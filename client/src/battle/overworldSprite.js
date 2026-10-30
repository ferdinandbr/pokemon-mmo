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

// Single-row PMD animations that lack 8-directional sheets: ignored completely and routed directly to standard fallbacks
const SINGLE_ROW_ACTIONS = new Set([
  'TumbleBack',
  'DeepBreath',
  'Tumble',
  'LostBalance',
  'Cringe',
  'Pain',
  'HitGround',
  'Eat',
  'Sit',
  'LookUp',
  'Sink',
  'LeapForth',
  'Pull',
]);

// Fallback hierarchy for animations when a specific action sheet does not exist
const ANIMATION_FALLBACKS = {
  Idle: ['Hover', 'Float', 'Walk'],
  Walk: ['Hover', 'Float', 'Idle'],
  Node: ['Nod', 'Attack', 'QuickStrike', 'Swing', 'Double', 'Idle'],
  Nod: ['Node', 'Attack', 'QuickStrike', 'Swing', 'Double', 'Idle'],
  Attack: ['Swing', 'Double', 'Strike', 'QuickStrike', 'Jab', 'Idle'],
  Strike: ['QuickStrike', 'Swing', 'Double', 'Attack', 'Jab', 'MultiStrike', 'Idle'],
  QuickStrike: ['Strike', 'Attack', 'Swing', 'Double', 'Idle'],
  Physical: ['Attack', 'Strike', 'QuickStrike', 'Swing', 'Double', 'Idle'],
  TumbleBack: ['Hurt', 'Attack', 'Idle'],
  Hurt: ['Idle'],
  Pose: ['Idle', 'Walk'],
  Shoot: ['Charge', 'Attack', 'SpAttack', 'Idle'],
  DeepBreath: ['Shoot', 'Charge', 'Attack', 'SpAttack', 'Idle'],
  HitGround: ['Faint', 'Hurt', 'Idle'],
  Faint: ['Hurt', 'Idle'],
  Charge: ['Shoot', 'Attack', 'Idle'],
  Hop: ['Walk', 'Hover', 'Idle'],
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

    this.preloadCoreSheets();
    this.loadMetadata(this.pokemonId);
  }

  async loadMetadata(pokemonId) {
    const variant = this.isShiny ? 'shiny' : 'normal';
    const cacheKey = `${variant}_${pokemonId}`;

    if (METADATA_CACHE.has(cacheKey)) {
      this.metadata = METADATA_CACHE.get(cacheKey);
      this.preloadCoreSheets();
      this.loaded = true;
      if (this.currentAnimation) {
        this.currentAnimation = this.resolveActionName(this.currentAnimation);
      }
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
          if (this.currentAnimation) {
            this.currentAnimation = this.resolveActionName(this.currentAnimation);
          }
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
    const coreActions = [
      'Idle', 'Walk', 'Attack', 'Hurt', 'Shoot', 'Charge',
      'Nod', 'Strike', 'QuickStrike', 'Pose', 'Faint'
    ];
    for (const action of coreActions) {
      this.getSheetImage(action);
    }
  }

  getActionCandidates(actionName) {
    const list = [];
    if (!SINGLE_ROW_ACTIONS.has(actionName)) {
      list.push(actionName);
    }
    const fb = ANIMATION_FALLBACKS[actionName];
    if (fb && Array.isArray(fb)) {
      for (const item of fb) {
        if (!SINGLE_ROW_ACTIONS.has(item) && !list.includes(item)) {
          list.push(item);
        }
      }
    }
    if (!list.includes('Attack')) list.push('Attack');
    if (!list.includes('Idle')) list.push('Idle');
    return list;
  }

  resolveActionName(actionName) {
    const candidates = this.getActionCandidates(actionName);
    if (this.metadata?.anims) {
      for (const cand of candidates) {
        if (this.metadata.anims[cand]) {
          return cand;
        }
      }
    }
    return candidates[0] || actionName;
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

    const candidates = this.getActionCandidates(actionName);
    let candidateIdx = candidates.indexOf(resolved);
    if (candidateIdx < 0) candidateIdx = 0;

    const img = new Image();
    const tryLoad = (idx) => {
      const act = candidates[idx] || 'Idle';
      img.src = `/assets/pokemon/pmd/${variant}/${this.pokemonId}/${act}-Anim.png`;
    };

    img.onerror = () => {
      // Cascading fallback on load error: se o sprite não existir na rede/disco, tenta o próximo candidato
      candidateIdx++;
      if (candidateIdx < candidates.length) {
        tryLoad(candidateIdx);
      } else if (img.src.indexOf('/normal/') === -1) {
        img.src = `/assets/pokemon/pmd/normal/${this.pokemonId}/Idle-Anim.png`;
      } else if (!img.src.endsWith('/Idle-Anim.png')) {
        img.onerror = null;
        img.src = `/assets/pokemon/pmd/normal/${this.pokemonId}/Idle-Anim.png`;
      }
    };

    tryLoad(candidateIdx);
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
    const candidates = this.getActionCandidates(actionName);
    if (this.metadata?.anims) {
      for (const cand of candidates) {
        if (this.metadata.anims[cand]) {
          return this.metadata.anims[cand];
        }
      }
      const firstValid = this.metadata.anims.Idle || this.metadata.anims.Walk || Object.values(this.metadata.anims)[0];
      if (firstValid) {
        return {
          frameWidth: firstValid.frameWidth || 48,
          frameHeight: firstValid.frameHeight || 48,
          frameCount: firstValid.frameCount || 4,
          durations: firstValid.durations || [8, 8, 8, 8],
        };
      }
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

    // Defeat animations (HitGround / Faint / Sleep) freeze permanently on the final frame
    const isDefeatAnim = this.currentAnimation === 'HitGround' || this.currentAnimation === 'Faint' || this.currentAnimation === 'Sleep';
    if (isDefeatAnim && this.currentFrame >= frameCount - 1) {
      this.currentFrame = frameCount - 1;
      return;
    }

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
        if (isDefeatAnim) {
          // Freeze on last frame of defeat
          this.currentFrame = frameCount - 1;
        } else if (this.currentAnimation === 'Hurt' && this.isHurtLocked) {
          // Maintain hurt stance while under continuous hit stun
          this.currentFrame = frameCount - 1;
        } else {
          // Return to Walk or Idle
          this.setAnimation(this.isMoving ? 'Walk' : 'Idle', true);
        }
      }
    }
  }

  render(ctx, x, y, scale = 2.4, hurtFlash = false, guardShield = false) {
    let img = this.getSheetImage(this.currentAnimation);
    let activeAnim = this.currentAnimation;
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Sheet still loading, smoothly fallback to Idle so the Pokemon never vanishes into thin air
      const idleImg = this.getSheetImage('Idle');
      if (idleImg && idleImg.complete && idleImg.naturalWidth > 0) {
        img = idleImg;
        activeAnim = 'Idle';
      } else {
        return;
      }
    }

    const config = this.getAnimConfig(activeAnim);
    const fw = config.frameWidth || 48;
    const fh = config.frameHeight || 48;
    const frameCount = config.frameCount || 1;

    const frameIdx = Math.min(this.currentFrame, frameCount - 1);
    const dirIdx = Math.max(0, Math.min(7, this.currentDirection));

    const sx = frameIdx * fw;
    const sy = dirIdx * fh;
    const dw = fw * scale;
    const dh = fh * scale;

    // Anchor: center horizontally, feet resting directly at ground plane (y)
    // In PMD SpriteCollab specifications, ground shadow center is placed at (fw / 2, fh / 2 + 3.5)
    const anchorX = fw / 2;
    const anchorY = fh / 2 + 3.5;
    const dx = x - anchorX * scale;
    const dy = y - anchorY * scale;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Clean Defensive Outline (Indicação visual nítida e clean ao redor da silhueta do Pokémon)
    if (guardShield) {
      if (!this._outlineCanvas) {
        this._outlineCanvas = document.createElement('canvas');
        this._outlineCtx = this._outlineCanvas.getContext('2d');
      }
      const oc = this._outlineCanvas;
      const octx = this._outlineCtx;
      if (oc.width !== fw || oc.height !== fh) {
        oc.width = fw;
        oc.height = fh;
      }
      octx.clearRect(0, 0, fw, fh);
      octx.imageSmoothingEnabled = false;
      // 1. Draw source frame into buffer
      octx.drawImage(img, sx, sy, fw, fh, 0, 0, fw, fh);
      // 2. Tint entire opaque silhouette to solid outline color (Cyan/Electric Blue or custom)
      octx.globalCompositeOperation = 'source-in';
      const outlineColor = typeof guardShield === 'string' ? guardShield : '#00E5FF';
      octx.fillStyle = outlineColor;
      octx.fillRect(0, 0, fw, fh);
      octx.globalCompositeOperation = 'source-over';

      // 3. Draw 8-directional outline around sprite
      const outlinePx = Math.max(1.5, Math.round(scale * 0.70));
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 0.92;
      ctx.shadowColor = outlineColor;
      ctx.shadowBlur = 6;
      ctx.drawImage(oc, 0, 0, fw, fh, dx - outlinePx, dy, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx + outlinePx, dy, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx, dy - outlinePx, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx, dy + outlinePx, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx - outlinePx, dy - outlinePx, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx + outlinePx, dy - outlinePx, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx - outlinePx, dy + outlinePx, dw, dh);
      ctx.drawImage(oc, 0, 0, fw, fh, dx + outlinePx, dy + outlinePx, dw, dh);
      ctx.restore();
    }

    ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);

    // Pure White Hit Flash Overlay (Piscar em branco na hora do hit)
    // Rendered via isolated offscreen canvas buffer so only the non-transparent pixels of the sprite turn white
    if (hurtFlash) {
      if (!this._flashCanvas) {
        this._flashCanvas = document.createElement('canvas');
        this._flashCtx = this._flashCanvas.getContext('2d');
      }
      const fc = this._flashCanvas;
      const fctx = this._flashCtx;
      if (fc.width !== fw || fc.height !== fh) {
        fc.width = fw;
        fc.height = fh;
      }
      fctx.clearRect(0, 0, fw, fh);
      fctx.imageSmoothingEnabled = false;
      // 1. Draw source sprite frame
      fctx.drawImage(img, sx, sy, fw, fh, 0, 0, fw, fh);
      // 2. Tint only opaque pixels to solid white
      fctx.globalCompositeOperation = 'source-in';
      fctx.fillStyle = '#FFFFFF';
      fctx.fillRect(0, 0, fw, fh);
      fctx.globalCompositeOperation = 'source-over';

      // 3. Draw white silhouette back to arena canvas at exact sprite position
      ctx.save();
      ctx.globalAlpha = 0.88;
      ctx.drawImage(fc, 0, 0, fw, fh, dx, dy, dw, dh);
      ctx.restore();
    }

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
    const anchorX = fw / 2;
    const anchorY = fh / 2 + 3.5;
    const dx = x - anchorX * scale;
    const dy = y - anchorY * scale;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0, Math.min(0.55, alpha * 0.7));
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);
    ctx.restore();
  }
}

// Keep OverworldSprite alias for backwards compatibility
export const OverworldSprite = PmdSprite;
