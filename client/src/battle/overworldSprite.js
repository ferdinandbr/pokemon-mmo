// PMD Collab 8-Directional Action Sprite Engine
// Supports 8 directions (Down, Down-Right, Right, Up-Right, Up, Up-Left, Left, Down-Left)
// and rich states: Idle, Walk, Attack, Strike, Shoot, Hop, Hurt, Faint, etc.

export const PMD_DIRECTIONS = {
  DOWN: 0,
  DOWN_RIGHT: 1,
  RIGHT: 2,
  UP_RIGHT: 3,
  UP: 4,
  UP_LEFT: 5,
  LEFT: 6,
  DOWN_LEFT: 7,
};

export const DIRECTION_NAME_TO_INDEX = {
  down: 0,
  down_right: 1,
  right: 2,
  up_right: 3,
  up: 4,
  up_left: 5,
  left: 6,
  down_left: 7,
};

// Fallback hierarchy for animations when a specific action sheet does not exist
const ANIMATION_FALLBACKS = {
  Idle: ['Hover', 'Float', 'Walk', 'Hop'],
  Walk: ['Hover', 'Float', 'Idle', 'Hop'],
  Strike: ['Attack', 'Swing', 'Double', 'Jab', 'MultiStrike'],
  Shoot: ['Charge', 'Attack', 'SpAttack'],
  Hop: ['Walk', 'Hover', 'Idle'],
  Faint: ['Sleep', 'Hurt', 'Withdraw'],
  Charge: ['Shoot', 'Attack'],
};

// Global caches for image sheets and animation metadata
const SHEET_CACHE = new Map();
const METADATA_CACHE = new Map();

export function vectorToPmdDirection(vx, vy, defaultDir = 2) {
  const speed = Math.hypot(vx, vy);
  if (speed < 1e-3) return defaultDir;

  let angle = Math.atan2(vy, vx); // [-PI, PI]
  if (angle < 0) angle += Math.PI * 2; // [0, 2PI]

  // Divide into 8 octants of 45 degrees, offset by 22.5 deg (PI/8)
  const octant = Math.floor(((angle + Math.PI / 8) % (Math.PI * 2)) / (Math.PI / 4));
  const OCTANT_TO_PMD = [2, 1, 0, 7, 6, 5, 4, 3];
  return OCTANT_TO_PMD[octant] ?? defaultDir;
}

export class PmdSprite {
  constructor(pokemonId, isShiny = false) {
    this.pokemonId = String(pokemonId).padStart(3, '0');
    this.isShiny = Boolean(isShiny);
    this.currentDirection = PMD_DIRECTIONS.DOWN;
    this.currentAnimation = 'Idle';
    this.isLooping = true;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.animSpeed = 1.0;
    this.isMoving = false;
    this.loaded = false;
    this.metadata = null;
    this.images = new Map();

    this.loadMetadata(this.pokemonId);
  }

  async loadMetadata(pokemonId) {
    const variant = this.isShiny ? 'shiny' : 'normal';
    const cacheKey = `${variant}_${pokemonId}`;

    if (METADATA_CACHE.has(cacheKey)) {
      this.metadata = METADATA_CACHE.get(cacheKey);
      this.preloadCoreSheets();
      this.loaded = true;
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.location?.origin) {
        const origin = window.location.origin.startsWith('http') ? window.location.origin : '';
        let res = await fetch(`${origin}/assets/pokemon/pmd/${variant}/${pokemonId}/animData.json`);
        if (!res.ok) {
          res = await fetch(`${origin}/assets/pokemon/pmd/${pokemonId}/animData.json`);
        }
        if (res.ok) {
          this.metadata = await res.json();
          METADATA_CACHE.set(cacheKey, this.metadata);
        }
      }
    } catch (e) {
      console.warn(`Could not load PMD animData.json for ${pokemonId}`, e);
    }

    this.preloadCoreSheets();
    this.loaded = true;
  }

  preloadCoreSheets() {
    if (typeof Image === 'undefined') return;
    const coreActions = ['Idle', 'Walk', 'Attack', 'Hurt', 'Faint', 'Hop', 'Shoot', 'Strike'];
    for (const action of coreActions) {
      this.getSheetImage(action);
    }
  }

  resolveActionName(actionName) {
    if (this.metadata?.anims && this.metadata.anims[actionName]) {
      return actionName;
    }

    const fallbacks = ANIMATION_FALLBACKS[actionName];
    if (fallbacks && this.metadata?.anims) {
      for (const fb of fallbacks) {
        if (this.metadata.anims[fb]) return fb;
      }
    }

    return actionName;
  }

  getSheetImage(actionName) {
    const resolved = this.resolveActionName(actionName);
    const variant = this.isShiny ? 'shiny' : 'normal';
    const key = `${variant}_${this.pokemonId}_${resolved}`;

    if (SHEET_CACHE.has(key)) {
      return SHEET_CACHE.get(key);
    }

    if (typeof Image === 'undefined') {
      return null;
    }

    const img = new Image();
    img.src = `/assets/pokemon/pmd/${variant}/${this.pokemonId}/${resolved}-Anim.png`;
    img.onerror = () => {
      // Fallback to flat or normal variant if specific variant sheet is missing
      if (this.isShiny) {
        img.src = `/assets/pokemon/pmd/normal/${this.pokemonId}/${resolved}-Anim.png`;
      } else {
        img.src = `/assets/pokemon/pmd/${this.pokemonId}/${resolved}-Anim.png`;
      }
    };
    SHEET_CACHE.set(key, img);
    return img;
  }

  setDirection(dir) {
    if (typeof dir === 'number') {
      this.currentDirection = Math.max(0, Math.min(7, dir));
    } else if (typeof dir === 'string' && DIRECTION_NAME_TO_INDEX[dir] !== undefined) {
      this.currentDirection = DIRECTION_NAME_TO_INDEX[dir];
    }
  }

  setDirectionFromVector(vx, vy) {
    const speed = Math.hypot(vx, vy);
    if (speed < 5) return;
    this.currentDirection = vectorToPmdDirection(vx, vy, this.currentDirection);
  }

  faceTowards(targetX, targetY, currentX, currentY) {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    this.setDirectionFromVector(dx, dy);
  }

  setAnimation(animName, loop = true) {
    const resolved = this.resolveActionName(animName);
    if (this.currentAnimation === resolved && this.isLooping === loop) {
      return;
    }

    this.currentAnimation = resolved;
    this.isLooping = loop;
    this.currentFrame = 0;
    this.frameTimer = 0;
  }

  getAnimConfig(actionName = this.currentAnimation) {
    const resolved = this.resolveActionName(actionName);
    if (this.metadata?.anims && this.metadata.anims[resolved]) {
      return this.metadata.anims[resolved];
    }
    // Default fallback config
    return {
      frameWidth: 48,
      frameHeight: 48,
      frameCount: 4,
      durations: [8, 8, 8, 8],
    };
  }

  update(dt, isMoving = false) {
    this.isMoving = isMoving;

    // Auto-transition between Idle and Walk when not playing an action/attack/hurt/faint
    if (this.isLooping) {
      const resolvedIdle = this.resolveActionName('Idle');
      const resolvedWalk = this.resolveActionName('Walk');
      if (this.isMoving && this.currentAnimation === resolvedIdle && resolvedIdle !== resolvedWalk) {
        this.setAnimation('Walk', true);
      } else if (!this.isMoving && this.currentAnimation === resolvedWalk && resolvedIdle !== resolvedWalk) {
        this.setAnimation('Idle', true);
      }
    }

    const config = this.getAnimConfig(this.currentAnimation);
    const frameCount = config.frameCount || 1;
    const durations = config.durations || [8];

    // Frame duration in seconds (30 FPS base tick rate)
    const currentDurTicks = durations[this.currentFrame] || 8;
    const frameDuration = (currentDurTicks / 30) / this.animSpeed;

    this.frameTimer += dt;
    if (this.frameTimer >= frameDuration) {
      this.frameTimer -= frameDuration;
      if (this.currentFrame + 1 < frameCount) {
        this.currentFrame++;
      } else if (this.isLooping) {
        this.currentFrame = 0;
      } else {
        // One-shot animation completed
        if (this.currentAnimation === 'Faint') {
          // Freeze on last frame of defeat
          this.currentFrame = frameCount - 1;
        } else {
          // Return to Walk or Idle
          this.setAnimation(this.isMoving ? 'Walk' : 'Idle', true);
        }
      }
    }
  }

  render(ctx, x, y, scale = 2.4, hurtFlash = false, guardShield = false) {
    const img = this.getSheetImage(this.currentAnimation);
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Sheet still loading, render fallback indicator
      return;
    }

    const config = this.getAnimConfig(this.currentAnimation);
    const fw = config.frameWidth || 48;
    const fh = config.frameHeight || 48;
    const frameCount = config.frameCount || 1;

    const frameIdx = Math.min(this.currentFrame, frameCount - 1);
    const dirIdx = Math.max(0, Math.min(7, this.currentDirection));

    const sx = frameIdx * fw;
    const sy = dirIdx * fh;
    const dw = fw * scale;
    const dh = fh * scale;

    // Anchor: center horizontally, bottom-aligned with feet resting directly at ground plane (y)
    const dx = x - dw / 2;
    const dy = y - dh * 0.86;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (hurtFlash) {
      ctx.filter = 'brightness(1.8) drop-shadow(0 0 10px #ff1744)';
    }

    if (guardShield) {
      ctx.filter = 'drop-shadow(0 0 8px #00e5ff)';
    }

    ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);
    ctx.restore();
  }

  renderAfterImage(ctx, x, y, scale = 2.4, alpha = 0.5, color = '#00E5FF') {
    const img = this.getSheetImage(this.currentAnimation);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const config = this.getAnimConfig(this.currentAnimation);
    const fw = config.frameWidth || 48;
    const fh = config.frameHeight || 48;
    const frameCount = config.frameCount || 1;

    const frameIdx = Math.min(this.currentFrame, frameCount - 1);
    const dirIdx = Math.max(0, Math.min(7, this.currentDirection));

    const sx = frameIdx * fw;
    const sy = dirIdx * fh;
    const dw = fw * scale;
    const dh = fh * scale;
    const dx = x - dw / 2;
    const dy = y - dh * 0.86;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.filter = `drop-shadow(0 0 8px ${color})`;
    ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);
    ctx.restore();
  }
}

// Keep OverworldSprite alias for backwards compatibility
export const OverworldSprite = PmdSprite;
