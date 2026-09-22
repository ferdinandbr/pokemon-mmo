import Phaser from 'phaser';

export const WEATHER_TYPES = {
  CLEAR: 'clear',
  RAIN: 'rain',
  STORM: 'storm',
  SNOW: 'snow',
  FOG: 'fog',
  SUNNY: 'sunny',
  SANDSTORM: 'sandstorm'
};

export const WEATHER_META = {
  clear: { name: 'Limpo', icon: '☀️', ambientColor: 0xffffff, alpha: 0.0 },
  rain: { name: 'Chuva', icon: '🌧️', ambientColor: 0x1e293b, alpha: 0.18 },
  storm: { name: 'Tempestade', icon: '⛈️', ambientColor: 0x0f172a, alpha: 0.30 },
  snow: { name: 'Neve', icon: '❄️', ambientColor: 0x64748b, alpha: 0.06 },
  fog: { name: 'Neblina', icon: '🌫️', ambientColor: 0x475569, alpha: 0.18 },
  sunny: { name: 'Sol Intenso', icon: '🔆', ambientColor: 0xf59e0b, alpha: 0.14 },
  sandstorm: { name: 'Temp. de Areia', icon: '🌪️', ambientColor: 0xb45309, alpha: 0.22 }
};

export default class WeatherManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.currentWeather = WEATHER_TYPES.CLEAR;

    // Atmospheric tint overlay
    this.tintOverlay = null;

    // Particle Emitters
    this.rainParticles = null;
    this.splashParticles = null;
    this.snowParticles = null;
    this.sandParticles = null;

    // Fog & Lightning state
    this.fogGraphics = null;
    this.lightningOverlay = null;
    this.nextLightningTime = 0;
    this.isFlashing = false;

    // Wind dynamics
    this.currentWindFactor = 0;

    // Textures initialization
    this._initTextures();
    this._initOverlays();

    // Event hook for UI
    this.onWeatherChanged = null;

    // Window helper for quick testing
    window.weather = this;
    window.setWeather = (type) => this.setWeather(type);
  }

  _initTextures() {
    // 1. Raindrop texture (diagonal streak)
    if (!this.scene.textures.exists('weather_rain_drop')) {
      const cv = this.scene.textures.createCanvas('weather_rain_drop', 4, 18);
      if (cv) {
        const ctx = cv.getContext();
        const grad = ctx.createLinearGradient(0, 0, 2, 18);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        grad.addColorStop(0.5, 'rgba(164, 219, 255, 0.7)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(1, 0, 2, 18);
        cv.refresh();
      }
    }

    // 2. Rain splash texture
    if (!this.scene.textures.exists('weather_rain_splash')) {
      const cv = this.scene.textures.createCanvas('weather_rain_splash', 8, 4);
      if (cv) {
        const ctx = cv.getContext();
        ctx.fillStyle = 'rgba(200, 235, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(4, 2, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        cv.refresh();
      }
    }

    // 3. Snowflake texture (floco de neve brilhante e nítido)
    if (!this.scene.textures.exists('weather_snowflake')) {
      const cv = this.scene.textures.createCanvas('weather_snowflake', 12, 12);
      if (cv) {
        const ctx = cv.getContext();
        const rad = ctx.createRadialGradient(6, 6, 1, 6, 6, 6);
        rad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        rad.addColorStop(0.4, 'rgba(240, 248, 255, 0.95)');
        rad.addColorStop(0.7, 'rgba(200, 230, 255, 0.6)');
        rad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(6, 6, 6, 0, Math.PI * 2);
        ctx.fill();
        cv.refresh();
      }
    }

    // 4. Sand particle texture
    if (!this.scene.textures.exists('weather_sand')) {
      const cv = this.scene.textures.createCanvas('weather_sand', 6, 4);
      if (cv) {
        const ctx = cv.getContext();
        ctx.fillStyle = 'rgba(230, 160, 75, 0.85)';
        ctx.fillRect(0, 0, 6, 3);
        cv.refresh();
      }
    }
  }

  _initOverlays() {
    const cam = this.scene.cameras.main;
    const w = cam.width || 960;
    const h = cam.height || 540;

    // Atmospheric color tint rectangle (screen space)
    this.tintOverlay = this.scene.add.rectangle(w / 2, h / 2, w * 3, h * 3, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(45000);

    // Lightning flash overlay
    this.lightningOverlay = this.scene.add.rectangle(w / 2, h / 2, w * 3, h * 3, 0xffffff, 0)
      .setScrollFactor(0)
      .setDepth(46000);

    // Fog graphics layer
    this.fogGraphics = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(44000);

    // Handle viewport resize
    this.scene.scale.on('resize', (gameSize) => {
      if (this.tintOverlay) this.tintOverlay.setSize(gameSize.width * 3, gameSize.height * 3);
      if (this.lightningOverlay) this.lightningOverlay.setSize(gameSize.width * 3, gameSize.height * 3);
    });
  }

  /**
   * Ativa um tipo de clima
   * @param {string} weatherType 
   */
  setWeather(weatherType) {
    if (!WEATHER_META[weatherType]) {
      weatherType = WEATHER_TYPES.CLEAR;
    }

    // Se estiver de noite ou entardecer, não permite clima 'sunny' (sol intenso)
    const currentPhase = this.scene.dayNightManager?.currentPhase || 'day';
    const isNightTime = currentPhase === 'night' || currentPhase === 'dusk';
    if (isNightTime && weatherType === WEATHER_TYPES.SUNNY) {
      weatherType = WEATHER_TYPES.CLEAR;
    }

    this.currentWeather = weatherType;
    const meta = WEATHER_META[weatherType];

    // 1. Atualizar tint atmosférico (se for noite plena, reduz o alpha para não clarear o céu)
    if (this.tintOverlay) {
      this.scene.tweens.killTweensOf(this.tintOverlay);
      this.tintOverlay.fillColor = meta.ambientColor;
      const targetAlpha = isNightTime ? Math.min(meta.alpha, 0.08) : meta.alpha;
      this.scene.tweens.add({
        targets: this.tintOverlay,
        fillAlpha: targetAlpha,
        duration: 1000,
        ease: 'Sine.easeInOut'
      });
    }

    // 2. Limpar e destruir completamente emissores anteriores
    this._stopAllEmitters();

    // 3. Iniciar efeitos específicos do novo clima
    if (weatherType === WEATHER_TYPES.RAIN || weatherType === WEATHER_TYPES.STORM) {
      this._startRain(weatherType === WEATHER_TYPES.STORM);
    } else if (weatherType === WEATHER_TYPES.SNOW) {
      this._startSnow();
    } else if (weatherType === WEATHER_TYPES.SANDSTORM) {
      this._startSandstorm();
    }

    // 4. Notificar HUD
    if (this.onWeatherChanged) {
      this.onWeatherChanged(weatherType, meta);
    }

    this._updateHUDBadge();
  }

  _startRain(isStorm = false) {
    const cam = this.scene.cameras.main;
    const w = cam.width || 960;
    const h = cam.height || 540;
    const speedY = isStorm ? 750 : 500;
    const speedX = isStorm ? -180 : -90;

    this.rainParticles = this.scene.add.particles(0, 0, 'weather_rain_drop', {
      x: { min: -100, max: w + 200 },
      y: -30,
      lifespan: 1200,
      speedY: { min: speedY - 80, max: speedY + 80 },
      speedX: { min: speedX - 30, max: speedX + 30 },
      scaleY: { min: 0.8, max: 1.4 },
      scaleX: 1,
      alpha: { min: 0.5, max: 0.85 },
      frequency: isStorm ? 6 : 14,
      emitting: true
    }).setScrollFactor(0).setDepth(45500);

    this.splashParticles = this.scene.add.particles(0, 0, 'weather_rain_splash', {
      x: { min: 0, max: w },
      y: { min: h * 0.4, max: h },
      lifespan: 180,
      scale: { start: 0.6, end: 1.2 },
      alpha: { start: 0.7, end: 0 },
      frequency: isStorm ? 12 : 28,
      emitting: true
    }).setScrollFactor(0).setDepth(45400);

    if (isStorm) {
      this.nextLightningTime = this.scene.time.now + Phaser.Math.Between(15000, 25000);
    }
  }

  _startSnow() {
    const cam = this.scene.cameras.main;
    const w = cam.width || 960;
    const h = cam.height || 540;

    this.snowParticles = this.scene.add.particles(0, 0, 'weather_snowflake', {
      x: { min: -60, max: w + 80 },
      y: -20,
      lifespan: { min: 2500, max: 4500 },
      speedY: { min: 50, max: 120 },
      speedX: { min: -40, max: 40 },
      scale: { min: 0.6, max: 1.5 },
      alpha: { min: 0.6, max: 1.0 },
      frequency: 25,
      emitting: true
    }).setScrollFactor(0).setDepth(45500);
  }

  _startSandstorm() {
    const cam = this.scene.cameras.main;
    const w = cam.width || 960;
    const h = cam.height || 540;

    this.sandParticles = this.scene.add.particles(0, 0, 'weather_sand', {
      x: w + 40,
      y: { min: -20, max: h + 20 },
      lifespan: 1600,
      speedX: { min: -600, max: -400 },
      speedY: { min: -20, max: 60 },
      scaleX: { min: 1.2, max: 3.0 },
      scaleY: { min: 0.8, max: 1.5 },
      alpha: { min: 0.4, max: 0.8 },
      frequency: 10,
      emitting: true
    }).setScrollFactor(0).setDepth(45500);
  }

  _stopAllEmitters() {
    if (this.rainParticles) {
      this.rainParticles.stop();
      this.rainParticles.destroy();
      this.rainParticles = null;
    }
    if (this.splashParticles) {
      this.splashParticles.stop();
      this.splashParticles.destroy();
      this.splashParticles = null;
    }
    if (this.snowParticles) {
      this.snowParticles.stop();
      this.snowParticles.destroy();
      this.snowParticles = null;
    }
    if (this.sandParticles) {
      this.sandParticles.stop();
      this.sandParticles.destroy();
      this.sandParticles = null;
    }
    if (this.fogGraphics) {
      this.fogGraphics.clear();
    }
    if (this.lightningOverlay) {
      this.scene.tweens.killTweensOf(this.lightningOverlay);
      this.lightningOverlay.fillAlpha = 0;
      this.isFlashing = false;
    }
  }

  /**
   * Retorna a intensidade teórica de vento para o clima atual
   */
  getTargetWindFactor() {
    switch (this.currentWeather) {
      case WEATHER_TYPES.STORM:
        return 1.0;
      case WEATHER_TYPES.SANDSTORM:
        return 1.25;
      case WEATHER_TYPES.RAIN:
        return 0.6;
      case WEATHER_TYPES.SNOW:
        return 0.35;
      default:
        return 0.0;
    }
  }

  /**
   * Retorna o fator de vento atual interpolado suavemente
   */
  getWindFactor() {
    return this.currentWindFactor || 0;
  }

  /**
   * Chamado a cada frame
   */
  update(time, delta) {
    // 0. Interpolação suave do fator de vento
    const targetWind = this.getTargetWindFactor();
    const lerpSpeed = delta ? Math.min(1, delta * 0.002) : 0.02;
    this.currentWindFactor = Phaser.Math.Linear(this.currentWindFactor || 0, targetWind, lerpSpeed);

    // 1. Efeito de Relâmpago para Tempestade (frequência reduzida para ritmo natural)
    if (this.currentWeather === WEATHER_TYPES.STORM && time > this.nextLightningTime && !this.isFlashing) {
      this._triggerLightning();
      this.nextLightningTime = time + Phaser.Math.Between(20000, 42000);
    }

    // 2. Nevoeiro animado com ondas translúcidas
    if (this.currentWeather === WEATHER_TYPES.FOG && this.fogGraphics) {
      this._drawAnimatedFog(time);
    }
  }

  _triggerLightning() {
    if (!this.lightningOverlay) return;
    this.isFlashing = true;

    // Flash duplo característico de raio
    this.scene.tweens.add({
      targets: this.lightningOverlay,
      fillAlpha: 0.85,
      duration: 70,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.lightningOverlay.fillAlpha = 0;
        this.isFlashing = false;
      }
    });

    // Leve tremor de tela acompanhando o trovão
    if (this.scene.cameras && this.scene.cameras.main) {
      this.scene.cameras.main.shake(300, 0.0035);
    }
  }

  _drawAnimatedFog(time) {
    const cam = this.scene.cameras.main;
    const w = cam.width || 960;
    const h = cam.height || 540;

    this.fogGraphics.clear();
    const t = time * 0.0008;

    // Duas camadas de névoa translúcida ondulante
    for (let i = 0; i < 4; i++) {
      const yOffset = (h / 4) * i + Math.sin(t + i) * 20;
      const alpha = 0.08 + Math.sin(t * 1.5 + i) * 0.04;
      this.fogGraphics.fillStyle(0xffffff, Math.max(0.04, alpha));
      this.fogGraphics.fillRect(-50, yOffset - 40, w + 100, 80);
    }
  }

  _updateHUDBadge() {
    const meta = WEATHER_META[this.currentWeather] || WEATHER_META.clear;
    const currentPhase = this.scene.dayNightManager?.currentPhase || 'day';
    const isNight = currentPhase === 'night';
    const isDusk = currentPhase === 'dusk';
    const isDawn = currentPhase === 'dawn';

    let icon = meta.icon;
    let name = meta.name;

    // Adaptar clima limpo de acordo com o período astronômico
    if (this.currentWeather === WEATHER_TYPES.CLEAR) {
      if (isNight) {
        icon = '✨';
        name = 'Céu Estrelado';
      } else if (isDusk) {
        icon = '🌆';
        name = 'Céu Limpo';
      } else if (isDawn) {
        icon = '🌄';
        name = 'Alvorada';
      } else {
        icon = '☀️';
        name = 'Céu Limpo';
      }
    } else if (this.currentWeather === WEATHER_TYPES.FOG) {
      if (isNight) {
        icon = '🌫️';
        name = 'Neblina Noturna';
      }
    }

    const iconEl = document.getElementById('hud-weather-icon');
    const labelEl = document.getElementById('hud-weather-label');
    const badgeEl = document.getElementById('hud-weather-badge');

    if (iconEl) iconEl.textContent = icon;
    if (labelEl) labelEl.textContent = name;
    if (badgeEl) {
      badgeEl.className = `hud-stat-item hud-weather-item weather-${this.currentWeather}`;
      badgeEl.title = `Clima Atual: ${name}`;
    }
  }

  destroy() {
    this._stopAllEmitters();
    if (this.tintOverlay) this.tintOverlay.destroy();
    if (this.lightningOverlay) this.lightningOverlay.destroy();
    if (this.fogGraphics) this.fogGraphics.destroy();
    if (this.rainParticles) this.rainParticles.destroy();
    if (this.splashParticles) this.splashParticles.destroy();
    if (this.snowParticles) this.snowParticles.destroy();
    if (this.sandParticles) this.sandParticles.destroy();
  }
}
