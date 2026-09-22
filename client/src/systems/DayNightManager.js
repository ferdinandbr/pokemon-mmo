import Phaser from 'phaser';
import DayNightPipeline from './DayNightPipeline';

export const DAY_NIGHT_CONFIG = {
  TEST_MODE: false, // false = 1 hora dia / 1 hora noite (produção); true = teste rápido
  
  // Duração no modo de teste (ms)
  TEST_DAY_DURATION: 3 * 60 * 1000,   // 3 minutos
  TEST_NIGHT_DURATION: 3 * 60 * 1000, // 3 minutos
  TEST_TRANSITION: 30 * 1000,         // 30 segundos de transição

  // Duração no modo de produção (ms)
  PROD_DAY_DURATION: 60 * 60 * 1000,   // 1 hora
  PROD_NIGHT_DURATION: 60 * 60 * 1000, // 1 hora
  PROD_TRANSITION: 8 * 60 * 1000,      // 8 minutos de transição suave e gradual

  // Cores de fallback (usadas se WebGL shader não estiver disponível)
  NIGHT_COLOR: 0x0c152e, // Azul safira escuro e profundo noturno
  DUSK_COLOR: 0xcc5520,  // Entardecer dourado/alaranjado
  DAWN_COLOR: 0xc86030,  // Amanhecer suave
  MAX_NIGHT_ALPHA: 0.72,
  MAX_DUSK_ALPHA: 0.45
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
   * Sincroniza o ciclo local com o tempo autoritativo do servidor
   * @param {object} serverTimeData
   */
  syncWithServer(serverTimeData) {
    if (!serverTimeData) return;
    if (typeof serverTimeData.serverTime === 'number') {
      this.timeOffset = serverTimeData.serverTime - Date.now();
    }
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
      // 2. ENTARDECER (Dia -> Pôr do sol dourado -> Noite)
      phase = 'dusk';
      const progress = (t - (dayDuration - transition)) / transition; // 0.0 -> 1.0
      const s = progress * progress * (3 - 2 * progress);
      alpha = Phaser.Math.Linear(0, maxAlpha, s);
      color = this._lerpColor(DAY_NIGHT_CONFIG.DUSK_COLOR, DAY_NIGHT_CONFIG.NIGHT_COLOR, s);
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
      // 4. AMANHECER (Noite -> Alvorada suave -> Dia claro)
      phase = 'dawn';
      const progress = (t - (totalCycle - transition)) / transition; // 0.0 -> 1.0
      const s = progress * progress * (3 - 2 * progress);
      alpha = Phaser.Math.Linear(maxAlpha, 0, s);
      color = this._lerpColor(DAY_NIGHT_CONFIG.NIGHT_COLOR, DAY_NIGHT_CONFIG.DAWN_COLOR, Math.sin(progress * Math.PI));
      remainingMs = totalCycle - t;
      icon = '🌅';
      label = 'Amanhecer';
    }

    // Relógio virtual de 24h proporcional ao ciclo (ciclo começa às 08:00 manhã)
    const cycleFrac = t / totalCycle;
    const virtualTotalMins = (Math.floor(cycleFrac * 24 * 60) + 8 * 60) % (24 * 60);
    const vHours = String(Math.floor(virtualTotalMins / 60)).padStart(2, '0');
    const vMins = String(virtualTotalMins % 60).padStart(2, '0');
    const clockTime = `${vHours}:${vMins}`;

    return {
      phase,
      alpha,
      color,
      remainingMs,
      icon,
      label,
      clockTime,
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
      this.pipelineInstance.lightRadius = 0.24; // Raio de iluminação acolhedor e focado da tocha/lanterna
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

    if (state.phase === 'day' || !this.scene?.localPlayer) {
      // Dia pleno ou antes do spawn do jogador: 100% iluminação neutra e cores limpas
      this.pipelineInstance.nightDark = 0.0;
      this.pipelineInstance.ambientColor = [1.0, 1.0, 1.0];
      this.pipelineInstance.lightTint = [1.0, 1.0, 1.0];
    } else if (state.phase === 'dusk') {
      // Entardecer: transição suave e gradual para pôr do sol alaranjado -> noite
      const progress = (t - (dayDuration - transition)) / transition; // 0.0 -> 1.0
      const s = progress * progress * (3 - 2 * progress);

      this.pipelineInstance.nightDark = Phaser.Math.Linear(0.0, 0.86, s);

      // Ambient color: Luz diurna [1.0, 1.0, 1.0] -> Pôr do sol [1.15, 0.65, 0.35] -> Noite azul safira [0.18, 0.22, 0.46]
      let ambR, ambG, ambB;
      if (s < 0.5) {
        const sub = s / 0.5;
        ambR = Phaser.Math.Linear(1.0, 1.15, sub);
        ambG = Phaser.Math.Linear(1.0, 0.65, sub);
        ambB = Phaser.Math.Linear(1.0, 0.35, sub);
      } else {
        const sub = (s - 0.5) / 0.5;
        ambR = Phaser.Math.Linear(1.15, 0.18, sub);
        ambG = Phaser.Math.Linear(0.65, 0.22, sub);
        ambB = Phaser.Math.Linear(0.35, 0.46, sub);
      }
      this.pipelineInstance.ambientColor = [ambR, ambG, ambB];
      this.pipelineInstance.lightTint = [
        Phaser.Math.Linear(1.0, 1.22, s),
        Phaser.Math.Linear(1.0, 1.10, s),
        Phaser.Math.Linear(1.0, 0.88, s)
      ];
    } else if (state.phase === 'night') {
      // Noite plena: atmosfera noturna azul-safira profunda e escura, com iluminação de tocha aconchegante
      this.pipelineInstance.nightDark = 0.86;
      this.pipelineInstance.ambientColor = [0.18, 0.22, 0.46];
      this.pipelineInstance.lightTint = [1.22, 1.10, 0.88];
    } else if (state.phase === 'dawn') {
      // Amanhecer: Noite azul [0.18, 0.22, 0.46] -> Alvorada suave [1.08, 0.72, 0.52] -> Dia claro [1.0, 1.0, 1.0]
      const progress = (t - (totalCycle - transition)) / transition; // 0.0 -> 1.0
      const s = progress * progress * (3 - 2 * progress);

      // Escuridão reduz suavemente de 0.86 até 0.0
      this.pipelineInstance.nightDark = Phaser.Math.Linear(0.86, 0.0, s);

      let ambR, ambG, ambB;
      if (s < 0.5) {
        const sub = s / 0.5;
        ambR = Phaser.Math.Linear(0.18, 1.08, sub);
        ambG = Phaser.Math.Linear(0.22, 0.72, sub);
        ambB = Phaser.Math.Linear(0.46, 0.52, sub);
      } else {
        const sub = (s - 0.5) / 0.5;
        ambR = Phaser.Math.Linear(1.08, 1.0, sub);
        ambG = Phaser.Math.Linear(0.72, 1.0, sub);
        ambB = Phaser.Math.Linear(0.52, 1.0, sub);
      }
      this.pipelineInstance.ambientColor = [ambR, ambG, ambB];

      // Light tint: Tocha suave -> Luz solar neutra [1.0, 1.0, 1.0]
      this.pipelineInstance.lightTint = [
        Phaser.Math.Linear(1.22, 1.0, s),
        Phaser.Math.Linear(1.10, 1.0, s),
        Phaser.Math.Linear(0.88, 1.0, s)
      ];
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
    const formattedRemaining = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (iconSpan) iconSpan.innerText = state.icon;
    if (labelSpan) {
      labelSpan.innerText = state.clockTime || formattedRemaining;
    }

    badge.title = `${state.label} — Próxima fase em ${formattedRemaining}`;
    badge.className = `hud-time-group time-${state.phase}`;

    if (this._lastReportedPhase !== state.phase) {
      this._lastReportedPhase = state.phase;
      if (this.scene.weatherManager) {
        if ((state.phase === 'night' || state.phase === 'dusk') && this.scene.weatherManager.currentWeather === 'sunny') {
          this.scene.weatherManager.setWeather('clear');
        } else {
          this.scene.weatherManager._updateHUDBadge();
        }
      }
    }
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
