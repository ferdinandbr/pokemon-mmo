import Phaser from 'phaser';
import DayNightPipeline from './DayNightPipeline';

export const DAY_NIGHT_CONFIG = {
  TEST_MODE: true, // true = 3 min dia / 3 min noite; false = 1 hora dia / 1 hora noite
  
  // Duração no modo de teste (ms)
  TEST_DAY_DURATION: 3 * 60 * 1000,   // 3 minutos
  TEST_NIGHT_DURATION: 3 * 60 * 1000, // 3 minutos
  TEST_TRANSITION: 30 * 1000,         // 30 segundos de transição

  // Duração no modo de produção (ms)
  PROD_DAY_DURATION: 60 * 60 * 1000,   // 1 hora
  PROD_NIGHT_DURATION: 60 * 60 * 1000, // 1 hora
  PROD_TRANSITION: 5 * 60 * 1000,      // 5 minutos de transição

  // Cores de fallback (usadas se WebGL shader não estiver disponível)
  NIGHT_COLOR: 0x050818, // Preto-azul meia-noite profundo
  DUSK_COLOR: 0xe65100,  // Entardecer laranja vibrante
  DAWN_COLOR: 0xd86a24,  // Amanhecer alvorada dourada
  MAX_NIGHT_ALPHA: 0.72,
  MAX_DUSK_ALPHA: 0.46
};

export default class DayNightManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.isTestMode = DAY_NIGHT_CONFIG.TEST_MODE;
    this.timeOffset = 0; // Permite forçar horários em testes

    // Cache de estado atual
    this.currentPhase = 'day'; // 'day' | 'dusk' | 'night' | 'dawn'
    this.currentAlpha = 0;
    this.currentColor = 0x000000;
    this.remainingMsInPhase = 0;

    // Pipeline de Shader WebGL (iluminação 2D cinematográfica)
    this.pipelineInstance = null;
    this._initShaderPipeline();

    // Elementos visuais de fallback (caso WebGL shaders não estejam ativos)
    this.ambientOverlay = null;
    this.playerLight = null;

    if (!this.pipelineInstance) {
      this._createPlayerLightTexture();
      this._createAmbientOverlay();
      this._createPlayerLight();
    }

    // Redimensionamento de tela
    this._onResize = (gameSize) => {
      if (this.ambientOverlay) {
        this.ambientOverlay.setSize(gameSize.width * 2, gameSize.height * 2);
      }
    };
    this.scene.scale.on('resize', this._onResize);

    // Helpers expostos para depuração e testes no console ou chat
    window.dayNight = this;
    window.toggleDayNightTestMode = () => {
      this.isTestMode = !this.isTestMode;
      console.log(`[DayNight] Modo de teste: ${this.isTestMode ? '3 min dia / 3 min noite' : '1h dia / 1h noite'}`);
      return this.isTestMode;
    };
    window.setDayNightPhase = (phaseName) => {
      this.forcePhase(phaseName);
    };
  }

  // ─── Inicialização do Shader Pipeline ──────────────────────────────────────

  _initShaderPipeline() {
    const renderer = this.scene.renderer;
    if (renderer && renderer.pipelines) {
      try {
        renderer.pipelines.addPostPipeline('DayNightPipeline', DayNightPipeline);
        const camera = this.scene.cameras.main;
        camera.setPostPipeline(DayNightPipeline);
        this.pipelineInstance = camera.getPostPipeline(DayNightPipeline);
        console.log('[DayNight] WebGL DayNightPipeline ativado com sucesso na câmera!');
      } catch (e) {
        console.warn('[DayNight] Não foi possível ativar DayNightPipeline WebGL:', e);
        this.pipelineInstance = null;
      }
    }
  }

  // ─── Fallback: Textura e Luz sem Shader ─────────────────────────────────────

  _createPlayerLightTexture() {
    const key = 'day_night_player_light';
    if (this.scene.textures.exists(key)) return;

    const size = 256;
    const canvasTexture = this.scene.textures.createCanvas(key, size, size);
    if (!canvasTexture) return;

    const ctx = canvasTexture.context;
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 12, center, center, center);
    // Brilho prata/azul luar suave e cristalino
    gradient.addColorStop(0, 'rgba(220, 238, 255, 0.70)');
    gradient.addColorStop(0.25, 'rgba(145, 190, 255, 0.38)');
    gradient.addColorStop(0.6, 'rgba(85, 135, 245, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    canvasTexture.refresh();
  }

  _createAmbientOverlay() {
    const width = Math.max(this.scene.scale.width, 1920);
    const height = Math.max(this.scene.scale.height, 1080);
    this.ambientOverlay = this.scene.add.rectangle(0, 0, width, height, 0x050818, 0);
    this.ambientOverlay.setOrigin(0, 0);
    this.ambientOverlay.setScrollFactor(0);
    this.ambientOverlay.setDepth(2000);
  }

  _createPlayerLight() {
    if (!this.scene.textures.exists('day_night_player_light')) return;
    this.playerLight = this.scene.add.image(0, 0, 'day_night_player_light');
    this.playerLight.setOrigin(0.5, 0.5);
    this.playerLight.setBlendMode(Phaser.BlendModes.ADD);
    this.playerLight.setDepth(98);
    this.playerLight.setAlpha(0);
  }

  // ─── Lógica do Ciclo ─────────────────────────────────────────────────────────

  /**
   * Força uma fase específica para testes imediatos
   * @param {'day'|'dusk'|'night'|'dawn'} phase
   */
  forcePhase(phase) {
    const dayDuration = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_DAY_DURATION : DAY_NIGHT_CONFIG.PROD_DAY_DURATION;
    const nightDuration = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_NIGHT_DURATION : DAY_NIGHT_CONFIG.PROD_NIGHT_DURATION;
    const transition = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_TRANSITION : DAY_NIGHT_CONFIG.PROD_TRANSITION;
    const totalCycle = dayDuration + nightDuration;

    let targetTimeInCycle = 0;
    switch (phase.toLowerCase()) {
      case 'day':
      case 'dia':
        targetTimeInCycle = 0;
        break;
      case 'dusk':
      case 'tarde':
      case 'entardecer':
        targetTimeInCycle = dayDuration - transition;
        break;
      case 'night':
      case 'noite':
        targetTimeInCycle = dayDuration;
        break;
      case 'dawn':
      case 'amanhecer':
        targetTimeInCycle = totalCycle - transition;
        break;
      default:
        console.warn(`[DayNight] Fase desconhecida: ${phase}. Use: 'day', 'dusk', 'night', 'dawn'`);
        return;
    }

    const currentNow = Date.now();
    const currentModulo = currentNow % totalCycle;
    this.timeOffset = (targetTimeInCycle - currentModulo + totalCycle) % totalCycle;
    console.log(`[DayNight] Fase forçada para: ${phase}`);
  }

  /**
   * Retorna os dados calculados do horário atual
   */
  calculateState() {
    const dayDuration = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_DAY_DURATION : DAY_NIGHT_CONFIG.PROD_DAY_DURATION;
    const nightDuration = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_NIGHT_DURATION : DAY_NIGHT_CONFIG.PROD_NIGHT_DURATION;
    const transition = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_TRANSITION : DAY_NIGHT_CONFIG.PROD_TRANSITION;
    const totalCycle = dayDuration + nightDuration;

    const now = Date.now() + this.timeOffset;
    const t = now % totalCycle;

    let phase = 'day';
    let alpha = 0;
    let color = DAY_NIGHT_CONFIG.NIGHT_COLOR;
    let remainingMs = 0;
    let icon = '☀️';
    let label = 'Dia';

    const maxAlpha = DAY_NIGHT_CONFIG.MAX_NIGHT_ALPHA;

    if (t < dayDuration - transition) {
      // 1. DIA PLENO
      phase = 'day';
      alpha = 0;
      color = 0x000000;
      remainingMs = (dayDuration - transition) - t;
      icon = '☀️';
      label = 'Dia';
    } else if (t < dayDuration) {
      // 2. ENTARDECER (Pôr do sol laranja vibrante -> Noite preto-azul)
      phase = 'dusk';
      const progress = (t - (dayDuration - transition)) / transition; // 0.0 -> 1.0
      const maxDuskAlpha = DAY_NIGHT_CONFIG.MAX_DUSK_ALPHA;

      if (progress < 0.45) {
        const subP = progress / 0.45;
        alpha = Phaser.Math.Linear(0, maxDuskAlpha, subP);
        color = DAY_NIGHT_CONFIG.DUSK_COLOR;
      } else {
        const subP = (progress - 0.45) / 0.55;
        alpha = Phaser.Math.Linear(maxDuskAlpha, maxAlpha, subP);
        color = this._lerpColor(DAY_NIGHT_CONFIG.DUSK_COLOR, DAY_NIGHT_CONFIG.NIGHT_COLOR, subP);
      }

      remainingMs = dayDuration - t;
      icon = '🌅';
      label = 'Entardecer';
    } else if (t < totalCycle - transition) {
      // 3. NOITE PLENA (Preto-azul profundo)
      phase = 'night';
      alpha = maxAlpha;
      color = DAY_NIGHT_CONFIG.NIGHT_COLOR;
      remainingMs = (totalCycle - transition) - t;
      icon = '🌙';
      label = 'Noite';
    } else {
      // 4. AMANHECER (Noite -> Alvorada dourada -> Dia)
      phase = 'dawn';
      const progress = (t - (totalCycle - transition)) / transition; // 0.0 -> 1.0
      const maxDawnAlpha = 0.38;

      if (progress < 0.55) {
        const subP = progress / 0.55;
        alpha = Phaser.Math.Linear(maxAlpha, maxDawnAlpha, subP);
        color = this._lerpColor(DAY_NIGHT_CONFIG.NIGHT_COLOR, DAY_NIGHT_CONFIG.DAWN_COLOR, subP);
      } else {
        const subP = (progress - 0.55) / 0.45;
        alpha = Phaser.Math.Linear(maxDawnAlpha, 0, subP);
        color = DAY_NIGHT_CONFIG.DAWN_COLOR;
      }

      remainingMs = totalCycle - t;
      icon = '🌄';
      label = 'Amanhecer';
    }

    return {
      phase,
      alpha,
      color,
      remainingMs,
      icon,
      label,
      isNight: phase === 'night' || phase === 'dusk' || phase === 'dawn',
      isTestMode: this.isTestMode
    };
  }

  // ─── Loop de Atualização ───────────────────────────────────────────────────

  /**
   * Chamado a cada frame pelo WorldScene.update()
   * @param {number} time
   * @param {Phaser.GameObjects.Container|null} localPlayer
   */
  update(time, localPlayer = null) {
    const state = this.calculateState();
    this.currentPhase = state.phase;
    this.currentAlpha = state.alpha;
    this.currentColor = state.color;
    this.remainingMsInPhase = state.remainingMs;

    // Se o pipeline com shader estiver ativo, ele processa a iluminação via GPU
    if (this.pipelineInstance) {
      const camera = this.scene.cameras.main;
      let normX = 0.5;
      let normY = 0.5;

      if (localPlayer) {
        const screenX = (localPlayer.x - camera.scrollX) * camera.zoom;
        const screenY = (localPlayer.y - camera.scrollY) * camera.zoom;
        normX = screenX / camera.width;
        normY = 1.0 - (screenY / camera.height); // WebGL Y invertido (0 embaixo, 1 em cima)
      }

      this.pipelineInstance.lightX = normX;
      this.pipelineInstance.lightY = normY;
      this.pipelineInstance.aspect = camera.width / camera.height;
      this.pipelineInstance.lightRadius = 0.36; // Raio equilibrado e agradável aos olhos
      this.pipelineInstance.flicker = Math.sin(time * 0.007) * 0.02 + Math.sin(time * 0.019) * 0.012;

      this._updatePipelinePhase(state);
    } else {
      // Fallback: Atualiza o overlay retangular e a luz tradicional
      if (this.ambientOverlay) {
        this.ambientOverlay.fillColor = state.color;
        this.ambientOverlay.fillAlpha = state.alpha;
      }
      if (this.playerLight) {
        if (localPlayer && state.alpha > 0.02) {
          this.playerLight.setPosition(localPlayer.x, localPlayer.y + 8);
          this.playerLight.setAlpha(state.alpha * 0.95);
          this.playerLight.setVisible(true);
        } else {
          this.playerLight.setVisible(false);
        }
      }
    }

    // Atualiza o badge do HUD no DOM
    this._updateHUD(state);
  }

  _updatePipelinePhase(state) {
    if (!this.pipelineInstance) return;

    const dayDuration = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_DAY_DURATION : DAY_NIGHT_CONFIG.PROD_DAY_DURATION;
    const nightDuration = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_NIGHT_DURATION : DAY_NIGHT_CONFIG.PROD_NIGHT_DURATION;
    const transition = this.isTestMode ? DAY_NIGHT_CONFIG.TEST_TRANSITION : DAY_NIGHT_CONFIG.PROD_TRANSITION;
    const totalCycle = dayDuration + nightDuration;

    const now = Date.now() + this.timeOffset;
    const t = now % totalCycle;

    if (state.phase === 'day') {
      // Dia pleno: shader não escurece nada, 100% cores originais
      this.pipelineInstance.nightDark = 0.0;
    } else if (state.phase === 'dusk') {
      // Entardecer: transição para pôr do sol alaranjado
      const progress = (t - (dayDuration - transition)) / transition; // 0.0 -> 1.0
      
      if (progress < 0.5) {
        // Primeira metade: mundo banhado em luz de pôr do sol dourado/laranja
        const subP = progress / 0.5;
        this.pipelineInstance.nightDark = Phaser.Math.Linear(0.0, 0.55, subP);
        this.pipelineInstance.ambientColor = [1.20, 0.48, 0.12]; // Laranja pôr do sol
        this.pipelineInstance.lightTint = [1.15, 0.95, 0.75];
      } else {
        // Segunda metade: entardecer laranja escurece suavemente para a noite preto-azul
        const subP = (progress - 0.5) / 0.5;
        this.pipelineInstance.nightDark = Phaser.Math.Linear(0.55, 0.94, subP);
        const ambR = Phaser.Math.Linear(1.20, 0.025, subP);
        const ambG = Phaser.Math.Linear(0.48, 0.035, subP);
        const ambB = Phaser.Math.Linear(0.12, 0.085, subP);
        this.pipelineInstance.ambientColor = [ambR, ambG, ambB];
        this.pipelineInstance.lightTint = [0.95, 1.08, 1.35]; // Transição para luar prata/azul
      }
    } else if (state.phase === 'night') {
      // Noite plena: escuridão profunda preto-azul com iluminação prata/azul luar
      this.pipelineInstance.nightDark = 0.94;
      this.pipelineInstance.ambientColor = [0.02, 0.035, 0.095]; // Preto-azul meia-noite
      this.pipelineInstance.lightTint = [0.95, 1.08, 1.35];      // Iluminação prata/azul (luar celestial)
    } else if (state.phase === 'dawn') {
      // Amanhecer: Noite escura -> Alvorada suave -> Dia claro
      const progress = (t - (totalCycle - transition)) / transition; // 0.0 -> 1.0
      
      if (progress < 0.5) {
        const subP = progress / 0.5;
        this.pipelineInstance.nightDark = Phaser.Math.Linear(0.94, 0.45, subP);
        const ambR = Phaser.Math.Linear(0.025, 0.85, subP);
        const ambG = Phaser.Math.Linear(0.035, 0.45, subP);
        const ambB = Phaser.Math.Linear(0.085, 0.25, subP);
        this.pipelineInstance.ambientColor = [ambR, ambG, ambB];
      } else {
        const subP = (progress - 0.5) / 0.5;
        this.pipelineInstance.nightDark = Phaser.Math.Linear(0.45, 0.0, subP);
        this.pipelineInstance.ambientColor = [0.85, 0.45, 0.25];
      }
      this.pipelineInstance.lightTint = [1.12, 0.96, 0.78];
    }
  }

  _updateHUD(state) {
    const badge = document.getElementById('hud-time-badge');
    if (!badge) return;

    const iconSpan = document.getElementById('hud-time-icon');
    const labelSpan = document.getElementById('hud-time-label');

    const totalSeconds = Math.max(0, Math.floor(state.remainingMs / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (iconSpan) iconSpan.innerText = state.icon;
    if (labelSpan) {
      labelSpan.innerText = `${state.label} (${formattedTime})`;
    }

    // Classe CSS para estilização dinâmica por fase
    badge.className = `hud-badge time-${state.phase}`;
  }

  // ─── Interpolação de Cores ─────────────────────────────────────────────────

  _lerpColor(colorA, colorB, t) {
    const rA = (colorA >> 16) & 0xff;
    const gA = (colorA >> 8) & 0xff;
    const bA = colorA & 0xff;

    const rB = (colorB >> 16) & 0xff;
    const gB = (colorB >> 8) & 0xff;
    const bB = colorB & 0xff;

    const r = Math.round(Phaser.Math.Linear(rA, rB, t));
    const g = Math.round(Phaser.Math.Linear(gA, gB, t));
    const b = Math.round(Phaser.Math.Linear(bA, bB, t));

    return (r << 16) | (g << 8) | b;
  }

  // ─── Limpeza ───────────────────────────────────────────────────────────────

  destroy() {
    this.scene.scale.off('resize', this._onResize);
    if (this.pipelineInstance) {
      try {
        this.scene.cameras.main.removePostPipeline('DayNightPipeline');
      } catch (e) {}
      this.pipelineInstance = null;
    }
    if (this.ambientOverlay) {
      this.ambientOverlay.destroy();
      this.ambientOverlay = null;
    }
    if (this.playerLight) {
      this.playerLight.destroy();
      this.playerLight = null;
    }
    if (window.dayNight === this) {
      delete window.dayNight;
    }
  }
}
