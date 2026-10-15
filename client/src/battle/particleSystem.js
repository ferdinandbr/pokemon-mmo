// Particle & Visual Effects Engine for Pokemon Arena 2D
// Authentic 16-bit Pixel Art VFX (GBA / Pokémon Mystery Dungeon Aesthetic)
import {
  renderPixelMatrix,
  renderPixelSlash,
  renderPixelCrossSlash,
  renderPixelBite,
  renderPixelPunch,
  renderPixelFireBlast,
  renderPixelLightningBolt,
  renderPixelStoneEdge,
  renderPixelContinuousBeam,
  renderSpeedHatching,
  renderPixelFoliageBurst,
  renderPixelIceCrystals,
  renderPixelShadowPulse,
  renderPixelPsychicRings,
  renderPixelStatArrows,
  PIXEL_COLOR_PALETTES,
} from './pixelArtVfx.js';

const MOVE_ANIM_CACHE = new Map();

// All official move animation spritesheets from PokeMMO
const ANIMATION_FILES = [
  '003-Attack01.png',
  '004-Attack02.png',
  '015-Fire01.png',
  '017-Thunder01.png',
  '018-Water01.png',
  '023-Burst01.png',
  '030-Explosion01.png',
  'Earth1.png',
  'grass.png',
  'Ice1.png',
  'normal1.png',
  'poison.png',
  'punches.png',
  'scratch_shadow_claw.png',
  'Tackle_B.png',
  'teeth.png',
  'Wind1.png',
];

export function getMoveAnimImg(file) {
  if (!file || typeof Image === 'undefined') return null;
  if (!MOVE_ANIM_CACHE.has(file)) {
    const img = new Image();
    img.src = `/assets/battle/animations/${file}`;
    MOVE_ANIM_CACHE.set(file, img);
  }
  return MOVE_ANIM_CACHE.get(file);
}

// Eagerly preload all animations at startup so they render immediately without HTTP delay
if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
  for (const f of ANIMATION_FILES) {
    getMoveAnimImg(f);
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.beams = [];
    this.areaRings = [];

    // Dedicated Pixel Art Attack VFX Overlays
    this.slashes = [];
    this.bites = [];
    this.punches = [];
    this.fireBlasts = [];
    this.lightnings = [];
    this.stoneEdges = [];
    this.speedHatchings = [];
    this.moveSpriteAnims = [];
    this.foliageBursts = [];
    this.iceCrystals = [];
    this.shadowPulses = [];
    this.psychicRings = [];
    this.statArrows = [];
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
    this.beams = [];
    this.areaRings = [];
    this.slashes = [];
    this.bites = [];
    this.punches = [];
    this.fireBlasts = [];
    this.lightnings = [];
    this.stoneEdges = [];
    this.speedHatchings = [];
    this.moveSpriteAnims = [];
    this.foliageBursts = [];
    this.iceCrystals = [];
    this.shadowPulses = [];
    this.psychicRings = [];
    this.statArrows = [];
  }

  // Spawn crisp pixel-art burst (explosions & projectile collisions)
  spawnPixelBurst(x, y, color = '#FF9800', count = 18, speed = 140, life = 0.4, size = 3) {
    const palette = [
      '#FFFFFF', // Core white hot spark
      color,
      color,
      '#111111', // Charred ash dot
    ];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const spd = (Math.random() * 0.6 + 0.4) * speed;
      const c = palette[Math.floor(Math.random() * palette.length)];

      this.particles.push({
        x: Math.round(x),
        y: Math.round(y),
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() < 0.3 ? size * 1.5 : size,
        color: c,
        life,
        maxLife: life,
        pixelAligned: true,
      });
    }
  }

  burst(x, y, color = '#FF9800', count = 16, speed = 120, life = 0.5, size = 4) {
    this.spawnPixelBurst(x, y, color, count, speed, life, size);
  }

  createExplosion(x, y, color = '#FF9800', count = 24, speed = 150) {
    this.spawnPixelBurst(x, y, color, count, speed, 0.5, 4);
  }

  // Flame trail / embers (quantized pixel blocks)
  spawnFlame(x, y, count = 3) {
    const colors = ['#FFFFFF', '#FFF176', '#FF9100', '#E64A19'];
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x: Math.round(x + (Math.random() - 0.5) * 14),
        y: Math.round(y + (Math.random() - 0.5) * 14),
        vx: (Math.random() - 0.5) * 30,
        vy: -Math.random() * 55 - 15,
        size: Math.random() < 0.4 ? 4 : 3,
        color: c,
        life: 0.4,
        maxLife: 0.4,
        pixelAligned: true,
      });
    }
  }

  // Water droplets / splashes in pixel art
  spawnWater(x, y, count = 4) {
    const colors = ['#FFFFFF', '#80D8FF', '#00B0FF', '#0288D1'];
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x: Math.round(x + (Math.random() - 0.5) * 12),
        y: Math.round(y + (Math.random() - 0.5) * 12),
        vx: (Math.random() - 0.5) * 75,
        vy: (Math.random() - 0.5) * 75 - 25,
        size: Math.random() < 0.5 ? 4 : 3,
        color: c,
        life: 0.38,
        maxLife: 0.38,
        pixelAligned: true,
      });
    }
  }

  // Electric spark zap in pixel art
  spawnSparks(x, y, count = 5) {
    const colors = ['#FFFFFF', '#FFFF00', '#FFD600', '#FF9100'];
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x: Math.round(x + (Math.random() - 0.5) * 12),
        y: Math.round(y + (Math.random() - 0.5) * 12),
        vx: (Math.random() - 0.5) * 140,
        vy: (Math.random() - 0.5) * 140,
        size: 3,
        color: c,
        life: 0.22,
        maxLife: 0.22,
        pixelAligned: true,
      });
    }
  }

  // Dust puff on footsteps or dash
  spawnDust(x, y, count = 3) {
    const colors = ['#CFD8DC', '#B0BEC5', '#90A4AE', '#78909C'];
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x: Math.round(x + (Math.random() - 0.5) * 10),
        y: Math.round(y + (Math.random() - 0.5) * 6),
        vx: (Math.random() - 0.5) * 30,
        vy: -Math.random() * 20 - 5,
        size: Math.random() < 0.5 ? 4 : 3,
        color: c,
        life: 0.35,
        maxLife: 0.35,
        pixelAligned: true,
      });
    }
  }

  // Expanding shockwave ring with quantized pixel border
  spawnShockwave(x, y, maxRadius = 60, color = '#FFFFFF', duration = 0.35) {
    this.areaRings.push({
      x: Math.round(x),
      y: Math.round(y),
      radius: 6,
      maxRadius,
      color,
      duration,
      time: 0,
    });
  }

  // Add Continuous Beam (Hydro Pump, Solar Beam, Ice Breath, Flamethrower)
  addBeam(startX, startY, targetX, targetY, color = '#00B0FF', width = 45, duration = 0.85, type = 'water', caster = null, targetEntity = null) {
    const beam = {
      startX: Math.round(startX),
      startY: Math.round(startY),
      targetX: Math.round(targetX),
      targetY: Math.round(targetY),
      color,
      width,
      duration,
      time: 0,
      type,
      caster,
      targetEntity,
    };
    this.beams.push(beam);
    return beam;
  }

  removeBeam(beam) {
    const idx = this.beams.indexOf(beam);
    if (idx !== -1) {
      this.beams.splice(idx, 1);
    }
  }

  // Slash Animation (Wing Attack, Dragon Claw, X-Scissor)
  spawnSlash(x, y, color = '#00E5FF', isCross = false, duration = 0.22) {
    this.slashes.push({
      x: Math.round(x),
      y: Math.round(y),
      color,
      isCross,
      duration,
      time: 0,
    });
  }

  // Bite / Crunch Animation
  spawnBite(x, y, duration = 0.28) {
    this.bites.push({
      x: Math.round(x),
      y: Math.round(y),
      duration,
      time: 0,
    });
  }

  // Energized Punch Impact
  spawnPunch(x, y, color = '#FF9100', duration = 0.25) {
    this.punches.push({
      x: Math.round(x),
      y: Math.round(y),
      color,
      duration,
      time: 0,
    });
  }

  // Fire Blast Kanji Symbol Detonation
  spawnFireBlast(x, y, duration = 0.65) {
    this.fireBlasts.push({
      x: Math.round(x),
      y: Math.round(y),
      duration,
      time: 0,
    });
  }

  // Lightning Strike (Thunder)
  spawnLightning(targetX, targetY, duration = 0.35) {
    this.lightnings.push({
      targetX: Math.round(targetX),
      targetY: Math.round(targetY),
      duration,
      time: 0,
    });
  }

  // Stone Edge / Rock Slide Spires
  spawnStoneEdge(targetX, targetY, duration = 0.55) {
    this.stoneEdges.push({
      targetX: Math.round(targetX),
      targetY: Math.round(targetY),
      duration,
      time: 0,
    });
  }

  // Anime-style Speed Hatching streaks for directional dodge
  spawnSpeedHatching(startX, startY, endX, endY, dirX, dirY, color = '#FFFFFF', duration = 0.28) {
    this.speedHatchings.push({
      startX: Math.round(startX),
      startY: Math.round(startY),
      endX: Math.round(endX),
      endY: Math.round(endY),
      dirX,
      dirY,
      color,
      duration,
      time: 0,
    });
  }

  // Foliage / Leaf Storm Burst
  spawnFoliageBurst(x, y, color = '#43A047', duration = 0.42) {
    this.foliageBursts.push({
      x: Math.round(x),
      y: Math.round(y),
      color,
      duration,
      time: 0,
    });
  }

  // Sharp Ice Crystals & Shards
  spawnIceCrystals(x, y, color = '#80DEEA', duration = 0.45) {
    this.iceCrystals.push({
      x: Math.round(x),
      y: Math.round(y),
      color,
      duration,
      time: 0,
    });
  }

  // Dark Shadow Pulse / Spectral Void
  spawnShadowPulse(x, y, color = '#7B1FA2', duration = 0.45) {
    this.shadowPulses.push({
      x: Math.round(x),
      y: Math.round(y),
      color,
      duration,
      time: 0,
    });
  }

  // Psychic Concentric Distortion Rings
  spawnPsychicRings(x, y, color = '#F50057', duration = 0.5) {
    this.psychicRings.push({
      x: Math.round(x),
      y: Math.round(y),
      color,
      duration,
      time: 0,
    });
  }

  // Stat Buff / Debuff Arrows
  spawnStatArrows(x, y, isBuff = true, color = '#00E676', duration = 0.65) {
    this.statArrows.push({
      x: Math.round(x),
      y: Math.round(y),
      isBuff,
      color: isBuff ? '#00E676' : '#FF5252',
      duration,
      time: 0,
    });
  }

  // Official Spritesheet Animation from RELATORIO_621_MOVES.md (e.g. 018-Water01.png, 003-Attack01.png)
  spawnMoveSpriteAnim(x, y, visual = {}) {
    const file = visual.file || '003-Attack01.png';
    const cols = visual.cols || 5;
    const rows = visual.rows || 2;
    const startFrame = typeof visual.startFrame === 'number' ? visual.startFrame : 0;
    const endFrame = typeof visual.endFrame === 'number' ? visual.endFrame : 4;
    const fps = visual.fps || 16; // 16 fps allows each frame to stay visible ~60ms

    const frameCount = Math.max(1, (endFrame - startFrame) + 1);
    // Guarantee visible animation duration (at least 0.38s so the animation is fully appreciated)
    const duration = Math.max(0.38, frameCount / fps);

    this.moveSpriteAnims.push({
      x: Math.round(x),
      y: Math.round(y),
      file,
      cols,
      rows,
      startFrame,
      endFrame,
      frameCount,
      fps,
      duration,
      scale: visual.scale || 1.15,
      time: 0,
    });
  }

  // Add Floating Combat Text (Compact & Clean)
  addFloatingText(x, y, text, type = 'normal', isCrit = false) {
    let color = '#FFFFFF';
    let size = 11;

    if (type === 'fire') color = '#FF7043';
    else if (type === 'water') color = '#29B6F6';
    else if (type === 'electric') color = '#FFEE58';
    else if (type === 'grass') color = '#9CCC65';
    else if (type === 'ghost') color = '#BA68C8';
    else if (type === 'psychic') color = '#F06292';
    else if (type === 'blocked') color = '#81D4FA';
    else if (type === 'physical') color = '#FFAB91';
    else if (type === 'heal') color = '#69F0AE';
    else if (type === 'dodge') color = '#ECEFF1';

    if (isCrit) {
      color = '#FFD700';
      size = 13.5;
    }

    this.floatingTexts.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y - 12,
      vx: (Math.random() - 0.5) * 16,
      vy: -50,
      text,
      color,
      size,
      life: 0.85,
      maxLife: 0.85,
      scale: isCrit ? 1.2 : 1.0,
      isCrit,
    });
  }

  update(dt) {
    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      t.vy += 80 * dt;
    }

    // Update Shockwave Rings
    for (let i = this.areaRings.length - 1; i >= 0; i--) {
      const r = this.areaRings[i];
      r.time += dt;
      if (r.time >= r.duration) {
        this.areaRings.splice(i, 1);
        continue;
      }
      const progress = r.time / r.duration;
      r.radius = 6 + progress * (r.maxRadius - 6);
    }

    // Update Beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.time += dt;
      if (b.caster && !b.caster.isFainted) {
        if (typeof b.caster.getAttackOrigin === 'function') {
          const origin = b.caster.getAttackOrigin();
          b.startX = origin.x;
          b.startY = origin.y;
        } else {
          b.startX = b.caster.x;
          b.startY = b.caster.y;
        }
      }
      if (b.targetEntity && !b.targetEntity.isFainted) {
        if (typeof b.targetEntity.getHitCenter === 'function') {
          const hitCenter = b.targetEntity.getHitCenter();
          b.targetX = hitCenter.x;
          b.targetY = hitCenter.y;
        } else {
          b.targetX = b.targetEntity.x;
          b.targetY = b.targetEntity.y - 18;
        }
      }
      if (b.time >= b.duration) {
        this.beams.splice(i, 1);
      }
    }

    // Update Slashes
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      const s = this.slashes[i];
      s.time += dt;
      if (s.time >= s.duration) {
        this.slashes.splice(i, 1);
      }
    }

    // Update Bites
    for (let i = this.bites.length - 1; i >= 0; i--) {
      const b = this.bites[i];
      b.time += dt;
      if (b.time >= b.duration) {
        this.bites.splice(i, 1);
      }
    }

    // Update Punches
    for (let i = this.punches.length - 1; i >= 0; i--) {
      const p = this.punches[i];
      p.time += dt;
      if (p.time >= p.duration) {
        this.punches.splice(i, 1);
      }
    }

    // Update Fire Blasts
    for (let i = this.fireBlasts.length - 1; i >= 0; i--) {
      const fb = this.fireBlasts[i];
      fb.time += dt;
      if (fb.time >= fb.duration) {
        this.fireBlasts.splice(i, 1);
      }
    }

    // Update Lightnings
    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      const l = this.lightnings[i];
      l.time += dt;
      if (l.time >= l.duration) {
        this.lightnings.splice(i, 1);
      }
    }

    // Update Stone Edges
    for (let i = this.stoneEdges.length - 1; i >= 0; i--) {
      const se = this.stoneEdges[i];
      se.time += dt;
      if (se.time >= se.duration) {
        this.stoneEdges.splice(i, 1);
      }
    }

    // Update Speed Hatchings
    for (let i = this.speedHatchings.length - 1; i >= 0; i--) {
      const sh = this.speedHatchings[i];
      sh.time += dt;
      if (sh.time >= sh.duration) {
        this.speedHatchings.splice(i, 1);
      }
    }

    // Update Foliage Bursts
    for (let i = this.foliageBursts.length - 1; i >= 0; i--) {
      const fb = this.foliageBursts[i];
      fb.time += dt;
      if (fb.time >= fb.duration) {
        this.foliageBursts.splice(i, 1);
      }
    }

    // Update Ice Crystals
    for (let i = this.iceCrystals.length - 1; i >= 0; i--) {
      const ic = this.iceCrystals[i];
      ic.time += dt;
      if (ic.time >= ic.duration) {
        this.iceCrystals.splice(i, 1);
      }
    }

    // Update Shadow Pulses
    for (let i = this.shadowPulses.length - 1; i >= 0; i--) {
      const sp = this.shadowPulses[i];
      sp.time += dt;
      if (sp.time >= sp.duration) {
        this.shadowPulses.splice(i, 1);
      }
    }

    // Update Psychic Rings
    for (let i = this.psychicRings.length - 1; i >= 0; i--) {
      const pr = this.psychicRings[i];
      pr.time += dt;
      if (pr.time >= pr.duration) {
        this.psychicRings.splice(i, 1);
      }
    }

    // Update Stat Arrows
    for (let i = this.statArrows.length - 1; i >= 0; i--) {
      const sa = this.statArrows[i];
      sa.time += dt;
      if (sa.time >= sa.duration) {
        this.statArrows.splice(i, 1);
      }
    }

    // Update Move Spritesheet Animations
    for (let i = this.moveSpriteAnims.length - 1; i >= 0; i--) {
      const ma = this.moveSpriteAnims[i];
      ma.time += dt;
      if (ma.time >= ma.duration) {
        this.moveSpriteAnims.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    // 1. Render Shockwave Rings (Pixel Dithered)
    for (const r of this.areaRings) {
      const progress = r.time / r.duration;
      const alpha = (1 - progress) * 0.85;
      const pSize = 3;
      const count = 16;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = r.color;
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        const px = Math.round(r.x + Math.cos(ang) * r.radius);
        const py = Math.round(r.y + Math.sin(ang) * r.radius * 0.65);
        ctx.fillRect(px, py, pSize, pSize);
      }
      ctx.restore();
    }

    // 2. Render Beams (Pixel Continuous Streams)
    for (const b of this.beams) {
      const progress = b.time / b.duration;
      renderPixelContinuousBeam(
        ctx,
        b.startX,
        b.startY,
        b.targetX,
        b.targetY,
        progress,
        b.type || 'water',
        b.width
      );
    }

    // 3. Render Area & Ground Attacks
    for (const fb of this.fireBlasts) {
      const progress = fb.time / fb.duration;
      renderPixelFireBlast(ctx, fb.x, fb.y, progress);
    }

    for (const se of this.stoneEdges) {
      const progress = se.time / se.duration;
      renderPixelStoneEdge(ctx, se.targetX, se.targetY, progress);
    }

    for (const l of this.lightnings) {
      const progress = l.time / l.duration;
      renderPixelLightningBolt(ctx, l.targetX, l.targetY, progress);
    }

    // 4. Render Melee / Hit VFX Overlays
    for (const s of this.slashes) {
      const progress = s.time / s.duration;
      if (s.isCross) {
        renderPixelCrossSlash(ctx, s.x, s.y, progress, s.color);
      } else {
        renderPixelSlash(ctx, s.x, s.y, progress, s.color);
      }
    }

    for (const b of this.bites) {
      const progress = b.time / b.duration;
      renderPixelBite(ctx, b.x, b.y, progress);
    }

    for (const p of this.punches) {
      const progress = p.time / p.duration;
      renderPixelPunch(ctx, p.x, p.y, progress, p.color);
    }

    // 4.5. Render High-Speed Hatching Lines (Rachuras de Velocidade)
    for (const sh of this.speedHatchings) {
      const progress = sh.time / sh.duration;
      renderSpeedHatching(ctx, sh.startX, sh.startY, sh.endX, sh.endY, sh.dirX, sh.dirY, progress, sh.color);
    }

    // 4.6. Render Foliage, Ice, Shadow, Psychic, Stat VFX
    for (const fb of this.foliageBursts) {
      const progress = fb.time / fb.duration;
      renderPixelFoliageBurst(ctx, fb.x, fb.y, progress, fb.color);
    }

    for (const ic of this.iceCrystals) {
      const progress = ic.time / ic.duration;
      renderPixelIceCrystals(ctx, ic.x, ic.y, progress, ic.color);
    }

    for (const sp of this.shadowPulses) {
      const progress = sp.time / sp.duration;
      renderPixelShadowPulse(ctx, sp.x, sp.y, progress, sp.color);
    }

    for (const pr of this.psychicRings) {
      const progress = pr.time / pr.duration;
      renderPixelPsychicRings(ctx, pr.x, pr.y, progress, pr.color);
    }

    for (const sa of this.statArrows) {
      const progress = sa.time / sa.duration;
      renderPixelStatArrows(ctx, sa.x, sa.y, progress, sa.isBuff, sa.color);
    }

    // 4.8. Render Move Spritesheet Animations (Official 621 Moves from RELATORIO_621_MOVES.md)
    for (const ma of this.moveSpriteAnims) {
      const img = getMoveAnimImg(ma.file);
      if (img && img.complete && img.naturalWidth > 0) {
        const frameProgress = Math.min(0.999, ma.time / ma.duration);
        const currentFrameRel = Math.floor(frameProgress * ma.frameCount);
        const actualFrame = ma.startFrame + currentFrameRel;

        const fw = img.naturalWidth / ma.cols;
        const fh = img.naturalHeight / ma.rows;
        const col = actualFrame % ma.cols;
        const row = Math.floor(actualFrame / ma.cols);
        const sx = col * fw;
        const sy = row * fh;
        const dw = fw * ma.scale;
        const dh = fh * ma.scale;

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          img,
          sx, sy, fw, fh,
          Math.round(ma.x - dw / 2),
          Math.round(ma.y - dh / 2),
          Math.round(dw),
          Math.round(dh)
        );
        ctx.restore();
      } else {
        // Instant visual fallback while image is being decoded
        const prog = ma.time / ma.duration;
        renderPixelSlash(ctx, ma.x, ma.y, prog, '#00E5FF');
      }
    }

    // 5. Render Crisp Pixel Particles
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = p.color;
      // Quantized integer pixel blocks
      const px = Math.round(p.x - p.size / 2);
      const py = Math.round(p.y - p.size / 2);
      ctx.fillRect(px, py, p.size, p.size);
      ctx.restore();
    }

    // 6. Render Floating Damage / Status Texts
    for (const t of this.floatingTexts) {
      const progress = t.life / t.maxLife;
      const alpha = Math.min(1, progress * 1.5);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${t.size}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Outline
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.strokeText(t.text, Math.round(t.x), Math.round(t.y));

      // Text Fill
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = t.isCrit ? 6 : 2;
      ctx.fillText(t.text, Math.round(t.x), Math.round(t.y));
      ctx.restore();
    }

    ctx.restore();
  }
}
