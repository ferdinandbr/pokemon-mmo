// Ground Decal & Battle Residue System for Pokemon Arena 2D
// 100% Sprite-Based Ground Destruction using Authentic Pixel-Art Spritesheets
// 5 Core Variations: crater_round, crater_spiked, fissure_crack, skid_trench, stone_ring
// Fast 60 FPS batched rendering, smooth animations that freeze on the final frame

const BASE_VFX_PATH = '/assets/battle/animations/vfx/earth/';

export const GROUND_DECAL_CONFIGS = {
  crater_round: {
    src: `${BASE_VFX_PATH}ground_crater_round.png`,
    frames: 7,
    fw: 224,
    fh: 160,
    animDuration: 0.35,
    scaleMult: 0.008,
    anchorLeft: false,
  },
  crater_spiked: {
    src: `${BASE_VFX_PATH}ground_crater_spiked.png`,
    frames: 6,
    fw: 192,
    fh: 160,
    animDuration: 0.30,
    scaleMult: 0.009,
    anchorLeft: false,
  },
  fissure_crack: {
    src: `${BASE_VFX_PATH}ground_fissure_crack.png`,
    frames: 6,
    fw: 224,
    fh: 80,
    animDuration: 0.30,
    scaleMult: 0.010,
    anchorLeft: false,
  },
  skid_trench: {
    src: `${BASE_VFX_PATH}ground_skid_trench.png`,
    frames: 6,
    fw: 224,
    fh: 80,
    animDuration: 0.28,
    scaleMult: 0.010,
    anchorLeft: true, // Origin at the start of the skid, carves forward
  },
  stone_ring: {
    src: `${BASE_VFX_PATH}ground_stone_ring.png`,
    frames: 5,
    fw: 160,
    fh: 80,
    animDuration: 0.25,
    scaleMult: 0.011,
    anchorLeft: false,
  },
};

export const GROUND_DECAL_ALIASES = {
  // Direct names
  crater_round: 'crater_round',
  crater_spiked: 'crater_spiked',
  fissure_crack: 'fissure_crack',
  skid_trench: 'skid_trench',
  stone_ring: 'stone_ring',

  // Craters & heavy impacts
  crater: 'crater_round',
  round: 'crater_round',
  slam: 'crater_round',
  meteor: 'crater_round',
  scorch: 'crater_round',
  burn: 'crater_round',
  wet: 'crater_round',

  // Spiked blasts & detonations
  spiked: 'crater_spiked',
  blast: 'crater_spiked',
  explosion: 'crater_spiked',
  earth_power: 'crater_spiked',
  stone_edge: 'crater_spiked',
  zap_burn: 'crater_spiked',
  shadow: 'crater_spiked',

  // Fissures & ground fault lines
  crack: 'fissure_crack',
  fissure: 'fissure_crack',
  earthquake: 'fissure_crack',
  magnitude: 'fissure_crack',
  bulldoze: 'fissure_crack',
  dig: 'fissure_crack',
  poison: 'fissure_crack',

  // Skid trenches & furrows
  skid: 'skid_trench',
  trench: 'skid_trench',
  slide: 'skid_trench',
  knockback: 'skid_trench',
  tackle: 'skid_trench',
  dash: 'skid_trench',

  // Stone rings & shockwaves
  ring: 'stone_ring',
  shockwave: 'stone_ring',
  stomp: 'stone_ring',
  seismic: 'stone_ring',
  ice: 'stone_ring',
};

export class DecalSystem {
  constructor(maxDecals = 40) {
    this.decals = [];
    this.maxDecals = maxDecals;
    this.images = {};
    this.initImages();
  }

  initImages() {
    if (typeof Image === 'undefined') return;
    for (const [key, cfg] of Object.entries(GROUND_DECAL_CONFIGS)) {
      const img = new Image();
      img.src = cfg.src;
      this.images[key] = img;
    }
  }

  reset() {
    this.decals = [];
  }

  /**
   * Add a ground destruction decal at (x, y)
   * @param {number} x Logical arena X
   * @param {number} y Logical arena Y
   * @param {string} type One of the 5 variations or an alias
   * @param {number} radius Controls scale of impact
   * @param {number} duration Total seconds before removal
   * @param {number} angle Optional rotation angle in radians (especially for skid_trench)
   */
  addDecal(x, y, type = 'crater_round', radius = 24, duration = 8.0, angle = 0) {
    const rawKey = (type || 'crater_round').toLowerCase();
    const resolvedType = GROUND_DECAL_ALIASES[rawKey] || 'crater_round';
    const cfg = GROUND_DECAL_CONFIGS[resolvedType] || GROUND_DECAL_CONFIGS.crater_round;

    // Proportional scale factor calibrated to Pokemon sprite dimensions (~48-120px)
    const scale = Math.max(0.20, Math.min(0.55, radius * cfg.scaleMult * 1.5));

    // Optional subtle random rotation or flip for circular/crack decals
    let finalAngle = angle;
    let flipX = false;
    if (resolvedType === 'fissure_crack' && angle === 0) {
      finalAngle = (Math.random() - 0.5) * 0.35;
      flipX = Math.random() < 0.5;
    } else if (resolvedType === 'crater_round' || resolvedType === 'crater_spiked') {
      flipX = Math.random() < 0.5;
      if (angle === 0) finalAngle = (Math.random() - 0.5) * 0.2;
    }

    const decal = {
      x,
      y,
      type: rawKey,
      resolvedType,
      cfg,
      scale,
      angle: finalAngle,
      flipX,
      duration: Math.max(duration, 3.0),
      time: 0,
      fadeDuration: 2.2,
      alpha: 1.0,
    };

    this.decals.push(decal);

    // Limit active decals to preserve 60 FPS performance
    if (this.decals.length > this.maxDecals) {
      const oldest = this.decals[0];
      oldest.time = Math.max(oldest.time, oldest.duration - 1.2);
    }
  }

  update(dt) {
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const d = this.decals[i];
      d.time += dt;

      if (d.time >= d.duration) {
        this.decals.splice(i, 1);
        continue;
      }

      // Smooth progressive fade-out in final fadeDuration seconds
      const remaining = d.duration - d.time;
      if (remaining <= d.fadeDuration) {
        d.alpha = Math.max(0, remaining / d.fadeDuration);
      } else {
        d.alpha = 1.0;
      }
    }
  }

  render(ctx) {
    if (this.decals.length === 0) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < this.decals.length; i++) {
      const d = this.decals[i];
      const alpha = d.alpha * 0.95;
      if (alpha <= 0.01) continue;

      const cfg = d.cfg || GROUND_DECAL_CONFIGS[d.resolvedType] || GROUND_DECAL_CONFIGS.crater_round;
      let img = this.images[d.resolvedType];

      // Lazy load fallback if not yet initialized
      if (!img && typeof Image !== 'undefined') {
        img = new Image();
        img.src = cfg.src;
        this.images[d.resolvedType] = img;
      }

      if (!img || !img.complete || img.naturalWidth === 0) continue;

      // Advance frames from 0 to last frame, then FREEZE on the last frame as persistent terrain scar!
      const totalFrames = cfg.frames;
      let frame = totalFrames - 1;
      if (d.time < cfg.animDuration) {
        frame = Math.min(totalFrames - 1, Math.floor((d.time / cfg.animDuration) * totalFrames));
      }

      const sx = frame * cfg.fw;
      const sy = 0;
      const dw = cfg.fw * d.scale;
      const dh = cfg.fh * d.scale;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(d.x, d.y);

      if (d.angle !== 0) {
        ctx.rotate(d.angle);
      }
      if (d.flipX) {
        ctx.scale(-1, 1);
      }

      if (cfg.anchorLeft) {
        // Skid trench: starts at (0, 0) and carves forward along the direction
        ctx.drawImage(img, sx, sy, cfg.fw, cfg.fh, 0, -dh / 2, dw, dh);
      } else {
        // Centered impact crater
        ctx.drawImage(img, sx, sy, cfg.fw, cfg.fh, -dw / 2, -dh / 2, dw, dh);
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
