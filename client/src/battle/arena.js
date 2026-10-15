// Battle Arena Engine with Authentic Pixel Art Town Stadium Background
// Bounded strictly to the white line rectangle of the tournament field
import { DecalSystem } from './decalSystem.js';

export class BattleArena {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;

    // Logical gameplay dimensions are STRICTLY FIXED to 1024 x 576 (Native 16:9 Widescreen).
    // Window resizing scales the viewport projection seamlessly without black letterbox bars,
    // while keeping logical boundaries and combat distance 100% invariant and fair for PvP.
    this.imgWidth = 1024;
    this.imgHeight = 576;

    // Fixed grass clearing boundary in native 1024x576 16:9 image space
    this.fieldCoords = {
      left: 145,
      right: 880,
      top: 63,
      bottom: 518,
      centerX: 512,
      centerY: 290,
    };

    // Logical bounds are ALWAYS fixed to native coordinates!
    this.bounds = {
      minX: this.fieldCoords.left,
      maxX: this.fieldCoords.right,
      minY: this.fieldCoords.top,
      maxY: this.fieldCoords.bottom,
    };

    this.centerX = this.fieldCoords.centerX;
    this.centerY = this.fieldCoords.centerY;
    this.arenaWidth = this.bounds.maxX - this.bounds.minX; // 735 px
    this.arenaHeight = this.bounds.maxY - this.bounds.minY; // 455 px
    this.radiusX = this.arenaWidth / 2;
    this.radiusY = this.arenaHeight / 2;

    // Preload time-of-day grass arena backgrounds (Day, Dusk/Sunset, Night)
    this.bgImages = {
      day: null,
      dusk: null,
      night: null,
    };
    this.currentPhase = 'day';
    this.bgImage = null;
    this.imageLoaded = false;
    this.initBackgrounds();

    // Viewport projection parameters (scales drawing to screen without altering logic)
    this.scale = 1.0;
    this.drawX = 0;
    this.drawY = 0;
    this.drawWidth = 1024;
    this.drawHeight = 790;

    // Screen shake
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

    // Open tournament pitch (no obstructing pillars)
    this.obstacles = [];

    // Persistent ground battle marks (scorch, cracks, wet puddles, zaps)
    this.decalSystem = new DecalSystem(50);

    this.resize();
  }

  initBackgrounds() {
    if (typeof Image === 'undefined') return;

    this.bgImages.day = new Image();
    this.bgImages.day.src = '/assets/battle/arenas/grass_wild_day.png';

    this.bgImages.dusk = new Image();
    this.bgImages.dusk.src = '/assets/battle/arenas/grass_wild_dusk.png';

    this.bgImages.night = new Image();
    this.bgImages.night.src = '/assets/battle/arenas/grass_wild_night.png';

    const onImgLoad = () => {
      this.imageLoaded = true;
      this.updateTimePhase();
    };

    this.bgImages.day.onload = onImgLoad;
    this.bgImages.dusk.onload = onImgLoad;
    this.bgImages.night.onload = onImgLoad;

    this.updateTimePhase();
  }

  updateTimePhase(forcedPhase = null) {
    let phase = forcedPhase;

    if (!phase) {
      if (typeof window !== 'undefined' && window.dayNight?.currentPhase) {
        phase = window.dayNight.currentPhase;
      }
    }

    if (!phase) {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 17) {
        phase = 'day';
      } else if (hour >= 17 && hour < 20) {
        phase = 'dusk';
      } else if (hour >= 5 && hour < 6) {
        phase = 'dawn';
      } else {
        phase = 'night';
      }
    }

    this.currentPhase = phase || 'day';

    if (this.currentPhase === 'night') {
      this.bgImage = this.bgImages.night || this.bgImages.day;
    } else if (this.currentPhase === 'dusk' || this.currentPhase === 'dawn') {
      this.bgImage = this.bgImages.dusk || this.bgImages.day;
    } else {
      this.currentPhase = 'day';
      this.bgImage = this.bgImages.day;
    }
  }

  resize() {
    const rect = this.canvas.parentElement
      ? this.canvas.parentElement.getBoundingClientRect()
      : { width: this.canvas.width || 1920, height: this.canvas.height || 1080 };
    this.canvas.width = rect.width || 1920;
    this.canvas.height = rect.height || 1080;

    // 16:9 Widescreen Projection
    // Scale seamlessly to cover the container width & height without black letterbox bars
    const scaleX = this.canvas.width / this.imgWidth;
    const scaleY = this.canvas.height / this.imgHeight;
    this.scale = Math.max(scaleX, scaleY);

    this.drawWidth = Math.round(this.imgWidth * this.scale);
    this.drawHeight = Math.round(this.imgHeight * this.scale);
    this.drawX = Math.round((this.canvas.width - this.drawWidth) / 2);
    this.drawY = Math.round((this.canvas.height - this.drawHeight) / 2);

    // CRITICAL GUARANTEE: this.bounds, this.centerX, this.centerY, this.arenaWidth,
    // this.arenaHeight NEVER change! Gameplay units remain 100% constant and fair!
  }

  getSpawnPoints() {
    return {
      player: {
        x: this.centerX - 190, // 322 px in fixed 1024x576 space
        y: this.centerY,       // 290 px
        facing: 'right',
      },
      enemy: {
        x: this.centerX + 190, // 702 px in fixed 1024x576 space
        y: this.centerY,       // 290 px
        facing: 'left',
      },
    };
  }

  setTheme() {}

  triggerScreenShake(amount = 8) {
    this.shakeIntensity = Math.max(this.shakeIntensity, amount);
  }

  addDecal(x, y, type = 'scorch', radius = 24, duration = 10.0) {
    if (this.decalSystem) {
      this.decalSystem.addDecal(x, y, type, radius, duration);
    }
  }

  resetDecals() {
    if (this.decalSystem) {
      this.decalSystem.reset();
    }
  }

  update(dt) {
    this.time += dt;

    if (this.decalSystem) {
      this.decalSystem.update(dt);
    }

    if (this.shakeIntensity > 0.1) {
      this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeIntensity = 0;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  // Check collision between a point/circle and all obstacles
  checkObstacleCollision(x, y, radius = 0) {
    for (const obs of this.obstacles) {
      const dx = x - obs.x;
      const dy = y - obs.y;
      const dist = Math.hypot(dx, dy);
      if (dist < obs.radius + radius) {
        return { collided: true, obstacle: obs, dist, dx, dy };
      }
    }
    return { collided: false, obstacle: null };
  }

  // Constrain position strictly within the white rectangular border
  clampInside(x, y, padding = 34) {
    const minX = this.bounds.minX + padding;
    const maxX = this.bounds.maxX - padding;
    const minY = this.bounds.minY + padding;
    const maxY = this.bounds.maxY - padding;

    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));
    const collided = (clampedX !== x || clampedY !== y);

    return { x: clampedX, y: clampedY, collided };
  }

  // Resolve boundary collision with crisp bounce damping on white lines
  resolveCollisions(entity) {
    if (!entity) return;

    // 1. Resolve collision with static obstacles if any exist
    for (const obs of this.obstacles) {
      const dx = entity.x - obs.x;
      const dy = entity.y - obs.y;
      const dist = Math.hypot(dx, dy) || 1;
      const minDist = entity.radius + obs.radius;

      if (dist < minDist) {
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        entity.x += nx * overlap;
        entity.y += ny * overlap;

        const velDotNormal = entity.vx * nx + entity.vy * ny;
        if (velDotNormal < 0) {
          entity.vx -= velDotNormal * nx;
          entity.vy -= velDotNormal * ny;
        }
      }
    }

    // 2. Clamp strictly inside rectangular white border
    const clamped = this.clampInside(entity.x, entity.y, entity.radius);
    if (clamped.collided) {
      const impactSpeed = Math.hypot(entity.vx, entity.vy);
      if (entity.x < clamped.x && entity.vx < 0) entity.vx *= -0.3;
      if (entity.x > clamped.x && entity.vx > 0) entity.vx *= -0.3;
      if (entity.y < clamped.y && entity.vy < 0) entity.vy *= -0.3;
      if (entity.y > clamped.y && entity.vy > 0) entity.vy *= -0.3;

      entity.x = clamped.x;
      entity.y = clamped.y;

      if (typeof entity.onArenaWallCollide === 'function') {
        entity.onArenaWallCollide(impactSpeed);
      }
    }
  }

  // Get random valid point inside rectangular arena
  getRandomPoint(padding = 50) {
    const minX = this.bounds.minX + padding;
    const maxX = this.bounds.maxX - padding;
    const minY = this.bounds.minY + padding;
    const maxY = this.bounds.maxY - padding;

    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
  }

  renderBackground(ctx = this.ctx) {
    // 1. Draw Authentic Wild Grass Pixel Art Background (Day, Dusk, Night)
    ctx.imageSmoothingEnabled = false; // Sharp 16-bit pixel art
    if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
      ctx.drawImage(
        this.bgImage,
        0,
        0,
        this.imgWidth,
        this.imgHeight
      );
    } else {
      // Fallback clean turf
      ctx.fillStyle = '#2d5a27';
      ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
    }

    // 2. Persistent Ground Decals clipped strictly to the grass clearing
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      this.bounds.minX,
      this.bounds.minY,
      this.arenaWidth,
      this.arenaHeight
    );
    ctx.clip();

    if (this.decalSystem) {
      this.decalSystem.render(ctx);
    }
    ctx.restore();
  }

  renderObstacle() {}

  destroy() {
    if (this.decalSystem) {
      this.decalSystem.reset();
    }
  }
}
