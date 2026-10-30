// Battle Weather & Day/Night Atmosphere System
// Simulates real-time atmospheric weather and dynamic lighting on the 2D battle arena

export const BATTLE_WEATHER_TYPES = {
  CLEAR: 'clear',
  SUNNY: 'sunny',
  RAIN: 'rain',
  STORM: 'storm',
  SNOW: 'snow',
  SANDSTORM: 'sandstorm',
  FOG: 'fog',
};

export const BATTLE_WEATHER_META = {
  clear: { name: 'Céu Limpo', icon: '☀️' },
  sunny: { name: 'Sol Intenso', icon: '🔆' },
  rain: { name: 'Chuva', icon: '🌧️' },
  storm: { name: 'Tempestade', icon: '⛈️' },
  snow: { name: 'Neve', icon: '❄️' },
  sandstorm: { name: 'Temp. de Areia', icon: '🌪️' },
  fog: { name: 'Neblina', icon: '🌫️' },
};

export class BattleWeather {
  constructor(engine) {
    this.engine = engine;
    this.currentWeather = 'clear';
    this.currentPhase = 'day'; // 'day' | 'dawn' | 'dusk' | 'night'
    this.time = 0;

    // Arena dimensions
    this.width = 1024;
    this.height = 790;

    // Particle pools
    this.particles = [];
    this.splashes = [];

    // Lightning effect for Storm
    this.lightningTimer = 4.0;
    this.lightningAlpha = 0;

    // Fog mist blobs
    this.fogBands = [];
  }

  setWeather(type = 'clear') {
    const cleanType = String(type || 'clear').toLowerCase();
    this.currentWeather = BATTLE_WEATHER_META[cleanType] ? cleanType : 'clear';
    this.initWeatherParticles();
  }

  setTimePhase(phase = 'day') {
    const cleanPhase = String(phase || 'day').toLowerCase();
    if (['day', 'dawn', 'dusk', 'night'].includes(cleanPhase)) {
      this.currentPhase = cleanPhase;
    } else {
      this.currentPhase = 'day';
    }
  }

  initWeatherParticles() {
    this.particles = [];
    this.splashes = [];
    this.fogBands = [];
    this.lightningAlpha = 0;

    const w = this.width;
    const h = this.height;

    switch (this.currentWeather) {
      case 'rain': {
        const count = 90;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * (w + 120) - 60,
            y: Math.random() * h,
            length: 12 + Math.random() * 10,
            speed: 700 + Math.random() * 260,
            thickness: 1 + Math.random() * 0.8,
            alpha: 0.35 + Math.random() * 0.35,
          });
        }
        break;
      }

      case 'storm': {
        const count = 160;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * (w + 200) - 100,
            y: Math.random() * h,
            length: 18 + Math.random() * 14,
            speed: 920 + Math.random() * 320,
            thickness: 1.2 + Math.random() * 1.0,
            alpha: 0.45 + Math.random() * 0.4,
          });
        }
        this.lightningTimer = 3.0 + Math.random() * 4.0;
        break;
      }

      case 'snow': {
        const count = 85;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: 1.5 + Math.random() * 2.5,
            speed: 55 + Math.random() * 65,
            wobbleSpeed: 1.5 + Math.random() * 2.0,
            wobbleAmp: 18 + Math.random() * 24,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.5 + Math.random() * 0.45,
          });
        }
        break;
      }

      case 'sandstorm': {
        const count = 120;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            length: 10 + Math.random() * 18,
            speedX: 750 + Math.random() * 350,
            speedY: 80 + (Math.random() - 0.5) * 60,
            thickness: 1.2 + Math.random() * 1.2,
            color: Math.random() > 0.4 ? '#f59e0b' : '#b45309',
            alpha: 0.4 + Math.random() * 0.4,
          });
        }
        break;
      }

      case 'fog': {
        // Translucent mist bands drifting across the arena
        for (let i = 0; i < 4; i++) {
          this.fogBands.push({
            x: (i * w) / 4,
            y: 120 + i * 140,
            width: w * 0.8,
            height: 90 + Math.random() * 60,
            speed: 25 + Math.random() * 18,
            alpha: 0.12 + Math.random() * 0.08,
          });
        }
        break;
      }
    }
  }

  update(dt) {
    this.time += dt;
    const w = this.width;
    const h = this.height;

    // 1. Rain & Storm Physics
    if (this.currentWeather === 'rain' || this.currentWeather === 'storm') {
      const slantX = this.currentWeather === 'storm' ? -180 : -90;

      for (const p of this.particles) {
        p.x += slantX * dt;
        p.y += p.speed * dt;

        // Splashes when hitting the ground zone (y > 380)
        if (p.y > h || (p.y > 420 && Math.random() < 0.04)) {
          if (this.splashes.length < 35) {
            this.splashes.push({
              x: p.x,
              y: Math.min(p.y, h - 30),
              radius: 1,
              maxRadius: 4 + Math.random() * 4,
              alpha: 0.6,
            });
          }
          p.x = Math.random() * (w + 140) - 40;
          p.y = -20;
        }
      }

      // Update splashes
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const s = this.splashes[i];
        s.radius += dt * 22;
        s.alpha -= dt * 2.4;
        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          this.splashes.splice(i, 1);
        }
      }

      // Lightning storm trigger
      if (this.currentWeather === 'storm') {
        this.lightningTimer -= dt;
        if (this.lightningTimer <= 0) {
          this.lightningAlpha = 0.82;
          this.lightningTimer = 5.0 + Math.random() * 6.0;
        }

        if (this.lightningAlpha > 0) {
          this.lightningAlpha = Math.max(0, this.lightningAlpha - dt * 4.2);
        }
      }
    }

    // 2. Snow Physics (fluttering snowflakes)
    else if (this.currentWeather === 'snow') {
      for (const p of this.particles) {
        p.phase += p.wobbleSpeed * dt;
        p.x += Math.sin(p.phase) * p.wobbleAmp * dt + 12 * dt;
        p.y += p.speed * dt;

        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        else if (p.x < -20) p.x = w + 20;
      }
    }

    // 3. Sandstorm Physics
    else if (this.currentWeather === 'sandstorm') {
      for (const p of this.particles) {
        p.x += p.speedX * dt;
        p.y += p.speedY * dt;

        if (p.x > w + 40) {
          p.x = -30;
          p.y = Math.random() * h;
        }
      }
    }

    // 4. Fog Physics
    else if (this.currentWeather === 'fog') {
      for (const f of this.fogBands) {
        f.x += f.speed * dt;
        if (f.x > w + 100) {
          f.x = -f.width;
        }
      }
    }
  }

  render(ctx) {
    ctx.save();

    // ─── 1. RENDER WEATHER PARTICLES ─────────────────────────────────────────
    if (this.currentWeather === 'rain' || this.currentWeather === 'storm') {
      const slantX = this.currentWeather === 'storm' ? -8 : -4;
      ctx.strokeStyle = this.currentWeather === 'storm' ? 'rgba(210, 230, 255, 0.65)' : 'rgba(180, 215, 255, 0.55)';
      ctx.beginPath();
      for (const p of this.particles) {
        ctx.lineWidth = p.thickness;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + slantX, p.y + p.length);
      }
      ctx.stroke();

      // Splashes
      ctx.lineWidth = 1;
      for (const s of this.splashes) {
        ctx.strokeStyle = `rgba(200, 230, 255, ${s.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 1.6, s.radius * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.currentWeather === 'snow') {
      for (const p of this.particles) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.currentWeather === 'sandstorm') {
      for (const p of this.particles) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.thickness;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y + 1);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    } else if (this.currentWeather === 'fog') {
      for (const f of this.fogBands) {
        const grad = ctx.createLinearGradient(f.x, f.y, f.x + f.width, f.y);
        grad.addColorStop(0, 'rgba(215, 225, 235, 0)');
        grad.addColorStop(0.5, `rgba(215, 225, 235, ${f.alpha.toFixed(2)})`);
        grad.addColorStop(1, 'rgba(215, 225, 235, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(f.x, f.y, f.width, f.height);
      }
    } else if (this.currentWeather === 'sunny') {
      // Golden shimmering solar rays radiating from top-right
      const pulse = Math.sin(this.time * 2.2) * 0.04;
      const rayAlpha = Math.max(0.04, 0.10 + pulse);
      const sunGrad = ctx.createRadialGradient(this.width * 0.85, 40, 40, this.width * 0.85, 40, 680);
      sunGrad.addColorStop(0, `rgba(251, 191, 36, ${(rayAlpha * 1.5).toFixed(2)})`);
      sunGrad.addColorStop(0.4, `rgba(245, 158, 11, ${rayAlpha.toFixed(2)})`);
      sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // ─── 2. ATMOSPHERIC WEATHER TINT ─────────────────────────────────────────
    let weatherTint = null;
    if (this.currentWeather === 'rain') {
      weatherTint = 'rgba(20, 32, 54, 0.16)';
    } else if (this.currentWeather === 'storm') {
      weatherTint = 'rgba(10, 16, 32, 0.28)';
    } else if (this.currentWeather === 'sandstorm') {
      weatherTint = 'rgba(180, 83, 9, 0.20)';
    } else if (this.currentWeather === 'snow') {
      weatherTint = 'rgba(180, 210, 240, 0.08)';
    }

    if (weatherTint) {
      ctx.fillStyle = weatherTint;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // ─── 3. DAY / NIGHT ATMOSPHERE COLOR GRADING & STADIUM LIGHTS ───────────
    if (this.currentPhase === 'dusk') {
      // Golden-red sunset twilight
      ctx.fillStyle = 'rgba(215, 80, 20, 0.22)';
      ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.currentPhase === 'dawn') {
      // Rosy morning glow
      ctx.fillStyle = 'rgba(225, 110, 60, 0.16)';
      ctx.fillRect(0, 0, this.width, this.height);
    } else if (this.currentPhase === 'night') {
      // Deep sapphire moonlight
      ctx.fillStyle = 'rgba(10, 18, 44, 0.44)';
      ctx.fillRect(0, 0, this.width, this.height);

      // Stadium floodlights around combatants (soft radial illumination)
      const entities = [
        this.engine.playerEntity,
        this.engine.enemyEntity,
        this.engine.trainer && this.engine.trainer.visible ? this.engine.trainer : null,
        this.engine.rivalTrainer && this.engine.rivalTrainer.visible ? this.engine.rivalTrainer : null,
      ].filter(Boolean);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const ent of entities) {
        const rad = (ent.radius || 24) * 2.8;
        const spotGrad = ctx.createRadialGradient(ent.x, ent.y - 10, 4, ent.x, ent.y - 10, rad);
        spotGrad.addColorStop(0, 'rgba(255, 255, 230, 0.24)');
        spotGrad.addColorStop(0.5, 'rgba(200, 225, 255, 0.12)');
        spotGrad.addColorStop(1, 'rgba(200, 225, 255, 0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(ent.x, ent.y - 10, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // ─── 4. STORM LIGHTNING FLASH ───────────────────────────────────────────
    if (this.lightningAlpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha.toFixed(2)})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    ctx.restore();
  }
}

