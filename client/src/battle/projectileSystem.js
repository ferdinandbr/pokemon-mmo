// Projectile System for Pokemon Arena 2D
// Authentic 16-bit GBA / PMD Pixel Art Projectiles with Ground Decals & Anti-Double Hit
import {
  renderPixelMatrix,
  PIXEL_COLOR_PALETTES,
  EMBER_FRAMES,
  WATER_DROPLET_FRAMES,
  ELECTRIC_SPARK_FRAMES,
  SHADOW_BALL_FRAMES,
  RAZOR_LEAF_FRAMES,
  FOCUS_BLAST_FRAMES,
  POISON_SLUDGE_FRAMES,
  ROCK_SHARD_FRAMES,
  HORN_DRILL_FRAMES,
  SPIDER_WEB_FRAMES,
  DARK_WAVE_FRAMES,
  DARK_PULSE_FRAMES,
  NIGHT_DAZE_FRAMES,
} from './pixelArtVfx.js';
import { getMoveAnimImg } from './particleSystem.js';

export function getProjectileVisuals(p) {
  const skillId = p.skillData?.id;
  const internalName = (p.skillData?.internalName || '').toUpperCase();
  const skillName = (p.skillData?.name || '').toLowerCase();
  const type = p.type || p.skillData?.type || '';

  if (internalName === 'DRAGONRAGE' || skillId === 62 || skillName.includes('dragon rage') || p.skillData?.visual?.isDragonRage || internalName === 'ROAROFTIME' || skillId === 51 || skillName.includes('roar of time') || p.skillData?.visual?.isRoarOfTime) {
    return { frames: FOCUS_BLAST_FRAMES, palette: PIXEL_COLOR_PALETTES.ghost, decal: 'scorch', decalRadius: 32, isDragonRage: true, isRoarOfTime: Boolean(internalName === 'ROAROFTIME' || skillId === 51 || skillName.includes('roar of time') || p.skillData?.visual?.isRoarOfTime) };
  }
  if (internalName === 'TWISTER' || skillId === 61 || skillName.includes('twister') || p.skillData?.visual?.isTwister || p.isTwister) {
    return { isWhirlwindProj: true, decal: 'crack', decalRadius: 22 };
  }
  if (internalName === 'SNARL' || p.isSnarl || p.skillData?.visual?.isSnarl || p.skillData?.visual?.file?.includes('snarl_soundwave')) {
    return { isSnarl: true, decal: 'shadow', decalRadius: 28 };
  }
  if (internalName === 'DARKPULSE' || p.isDarkPulse || internalName === 'NIGHTDAZE' || p.isNightDaze || p.skillData?.visual?.isNightDaze) {
    return { frames: NIGHT_DAZE_FRAMES, palette: PIXEL_COLOR_PALETTES.dark, decal: 'shadow', decalRadius: 32, isNightDaze: true };
  }
  if (internalName === 'PINMISSILE' || internalName === 'FELLSTINGER' || p.isPinMissile || p.skillData?.visual?.file?.includes('pin_missile_spike')) {
    return { isPinMissile: true, decal: 'crack', decalRadius: 18 };
  }
  if (internalName === 'STRINGSHOT' || p.isStringShot || internalName === 'ELECTROWEB' || p.isElectroweb || p.skillData?.visual?.file?.includes('string_shot_silk')) {
    const isYellow = Boolean(internalName === 'ELECTROWEB' || p.isElectroweb || p.skillData?.visual?.isElectroweb || p.skillData?.type === 'Electric');
    return { isStringShot: true, isElectroweb: isYellow, isYellow, decal: isYellow ? 'zap_burn' : 'shadow', decalRadius: 20 };
  }
  if (internalName === 'SPIDERWEB' || internalName === 'STICKYWEB' || p.isWeb) {
    return { frames: SPIDER_WEB_FRAMES, palette: PIXEL_COLOR_PALETTES.bug, decal: 'shadow', decalRadius: 28 };
  }
  if (internalName === 'MEGAHORN' || p.isHorn || internalName === 'HORNATTACK' || internalName === 'DRILLRUN') {
    return { frames: HORN_DRILL_FRAMES, palette: PIXEL_COLOR_PALETTES.bug, decal: 'crack', decalRadius: 26 };
  }
  if (skillId === 'ember' || type === 'Fire') {
    return { frames: EMBER_FRAMES, palette: PIXEL_COLOR_PALETTES.fire, decal: 'scorch', decalRadius: 26 };
  }
  if (skillId === 'water_gun' || type === 'Water') {
    return { frames: WATER_DROPLET_FRAMES, palette: PIXEL_COLOR_PALETTES.water, decal: 'wet', decalRadius: 24 };
  }
  if (internalName === 'DISCHARGE' || p.isDischarge || p.skillData?.visual?.isDischarge ||
      internalName === 'THUNDERWAVE' || p.isThunderWave || p.skillData?.visual?.isThunderWave ||
      internalName === 'PARABOLICCHARGE' || p.isParabolicCharge || p.skillData?.visual?.isParabolicCharge) {
    return { isElectricBoltProj: true, isDischarge: Boolean(p.isDischarge), isThunderWave: Boolean(p.isThunderWave), isParabolicCharge: Boolean(p.isParabolicCharge), decal: 'zap_burn', decalRadius: 26 };
  }
  if (internalName === 'ZAPCANNON' || p.isZapCannon || p.skillData?.visual?.isZapCannon ||
      internalName === 'ELECTROBALL' || p.isElectroBall || p.skillData?.visual?.isElectroBall) {
    return {
      frames: FOCUS_BLAST_FRAMES,
      palette: PIXEL_COLOR_PALETTES.electric,
      isZapCannon: true,
      isElectroBall: true,
      hasLobArc: Boolean(internalName === 'ELECTROBALL' || p.isElectroBall || p.hasLobArc || p.skillData?.visual?.hasLobArc),
      decal: 'zap_burn',
      decalRadius: 30
    };
  }
  if (internalName === 'DAZZLINGGLEAM' || p.isDazzlingGleam || p.skillData?.visual?.isDazzlingGleam) {
    return { isDazzlingGleam: true, decal: 'scorch', decalRadius: 26 };
  }
  if (internalName === 'FAIRYLOCK' || p.isFairyLock || p.skillData?.visual?.isFairyLock) {
    return { isFairyLock: true, decal: 'shadow', decalRadius: 22 };
  }
  if (internalName === 'DISARMINGVOICE' || p.isDisarmingVoice || p.skillData?.visual?.isDisarmingVoice) {
    return { isDisarmingVoice: true, decal: 'shadow', decalRadius: 22 };
  }
  if (internalName === 'MOONBLAST' || p.isMoonblast || p.skillData?.visual?.isMoonblast) {
    return {
      frames: FOCUS_BLAST_FRAMES,
      palette: { outer: '#38BDF8', mid: '#F472B6', core: '#FFFFFF', glow: 'rgba(56, 189, 248, 0.45)' },
      decal: 'scorch',
      decalRadius: 24,
      isMoonblast: true
    };
  }
  if (internalName === 'THUNDERSHOCK' || p.isThunderShock || p.skillData?.visual?.isThunderShock || skillId === 'thunder_shock') {
    return { isElectricBoltProj: true, isThunderShock: true, decal: 'zap_burn', decalRadius: 24 };
  }
  if (type === 'Electric') {
    return { frames: ELECTRIC_SPARK_FRAMES, palette: PIXEL_COLOR_PALETTES.electric, decal: 'zap_burn', decalRadius: 22 };
  }
  if (skillId === 'shadow_ball' || type === 'Ghost') {
    return { frames: SHADOW_BALL_FRAMES, palette: PIXEL_COLOR_PALETTES.ghost, decal: 'shadow', decalRadius: 26 };
  }
  if (skillId === 'razor_leaf' || type === 'Grass') {
    return { frames: RAZOR_LEAF_FRAMES, palette: PIXEL_COLOR_PALETTES.grass, decal: 'scorch', decalRadius: 20 };
  }
  if (type === 'Poison') {
    return { frames: POISON_SLUDGE_FRAMES, palette: PIXEL_COLOR_PALETTES.poison, decal: 'shadow', decalRadius: 22 };
  }
  if (type === 'Rock') {
    return { frames: ROCK_SHARD_FRAMES, palette: PIXEL_COLOR_PALETTES.rock, decal: 'crack', decalRadius: 24 };
  }
  if (type === 'Ground') {
    return { frames: ROCK_SHARD_FRAMES, palette: PIXEL_COLOR_PALETTES.ground, decal: 'crack', decalRadius: 24 };
  }
  if (type === 'Ice') {
    return { frames: ROCK_SHARD_FRAMES, palette: PIXEL_COLOR_PALETTES.ice, decal: 'wet', decalRadius: 22 };
  }
  if (type === 'Bug') {
    return { frames: RAZOR_LEAF_FRAMES, palette: PIXEL_COLOR_PALETTES.bug, decal: 'scorch', decalRadius: 22 };
  }
  // Default (Focus Blast, Normal, Fighting, Dragon)
  return { frames: FOCUS_BLAST_FRAMES, palette: PIXEL_COLOR_PALETTES.dragon, decal: 'crack', decalRadius: 24 };
}

export class ProjectileSystem {
  constructor(particleSystem, arena = null) {
    this.particleSystem = particleSystem;
    this.arena = arena;
    this.projectiles = [];
    this.nextProjectileId = 1;
  }

  setArena(arena) {
    this.arena = arena;
  }

  reset() {
    this.projectiles = [];
  }

  spawn({
    sourceEntity,
    targetEntity,
    startX,
    startY,
    targetX,
    targetY,
    speed = 520,
    radius = 16,
    color = '#FF9800',
    type = 'Fire',
    skillData,
    onHit,
    hasLobArc = false,
    isElectroBall = false,
    arcHeight = 45,
  }) {
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy) || 1;
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;

    const projectileId = `proj_${this.nextProjectileId++}_${Date.now()}`;

    // Calibrated projectile radius: ~12-14px to match scaled Pokémon body proportions
    const calRadius = Math.max(9, Math.min(14, Math.round(radius * 0.75)));

    this.projectiles.push({
      id: projectileId,
      sourceEntity,
      targetEntity,
      startX,
      startY,
      targetX,
      targetY,
      x: startX,
      y: startY,
      vx,
      vy,
      speed,
      radius: calRadius,
      color,
      type,
      skillData,
      onHit,
      life: 2.5,
      trailTimer: 0,
      hitEntities: new Set(), // Strict single-hit registration set
      clashWonReduced: false,
      isElectroBall: Boolean(isElectroBall || skillData?.visual?.isElectroBall || skillData?.internalName === 'ELECTROBALL'),
      hasLobArc: Boolean(hasLobArc || isElectroBall || skillData?.visual?.hasLobArc || skillData?.visual?.isElectroBall || skillData?.internalName === 'ELECTROBALL'),
      arcHeight: arcHeight || skillData?.visual?.arcHeight || 45,
      totalDist: dist || 1,
      traveledDist: 0,
    });

    return projectileId;
  }

  update(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.hasLobArc) {
        p.traveledDist = (p.traveledDist || 0) + p.speed * dt;
      }

      // Check collision with static arena obstacles (tactical blocking)
      if (this.arena && this.arena.checkObstacleCollision) {
        const obsHit = this.arena.checkObstacleCollision(p.x, p.y, p.radius);
        if (obsHit.collided) {
          const vis = getProjectileVisuals(p);
          if (this.arena.addDecal) {
            this.arena.addDecal(p.x, p.y, 'crack', 20);
          }
          this.particleSystem.spawnPixelBurst(p.x, p.y, p.color, 16, 160, 0.35, 3);
          this.particleSystem.spawnShockwave(p.x, p.y, 35, p.color, 0.25);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      // Emit continuous dynamic multi-element pixel trails & ground destruction wake
      p.trailTimer += dt;
      if (p.trailTimer >= 0.032) {
        p.trailTimer = 0;

        // Ground disturbance during low flight
        if (this.arena && this.arena.addDecal && Math.random() < 0.16) {
          const vis = getProjectileVisuals(p);
          this.arena.addDecal(p.x, p.y + 4, vis.decal, Math.round(vis.decalRadius * 0.5), 3.2);
        }

        // Multi-layered visual trails based on type and skill
        const internalName = (p.skillData?.internalName || '').toUpperCase();
        if (internalName === 'SPIDERWEB' || internalName === 'STICKYWEB' || p.isWeb) {
          // Floating green/white silk threads & sticky web droplets
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#C5E1A5', 2, 35, 0.30, 2);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#F1F8E9', 1, 20, 0.25, 1.5);
        } else if (internalName === 'STRINGSHOT' || p.isStringShot) {
          // Continuous white/slate silk string line trailing behind projectile
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#f1f5f9', 2, 20, 0.25, 1.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#cbd5e1', 1, 15, 0.20, 1.5);
        } else if (internalName === 'PINMISSILE' || internalName === 'FELLSTINGER' || p.isPinMissile) {
          // Sharp golden needle gleam & lime stinger speed trails
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#facc15', 2, 25, 0.20, 1.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#84cc16', 1, 18, 0.18, 1.5);
        } else if (internalName === 'MEGAHORN' || p.isHorn || internalName === 'HORNATTACK') {
          // Sharp aerodynamic trail with spiraling chitin green & white spark particles
          this.particleSystem.spawnDust(p.x, p.y + 2, 1);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#C5E1A5', 2, 45, 0.22, 2.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#FFFFFF', 1, 30, 0.18, 2);
        } else if (p.type === 'Fire') {
          this.particleSystem.spawnFlame(p.x, p.y, 3);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#FFD54F', 2, 40, 0.22, 2);
        } else if (p.type === 'Water') {
          this.particleSystem.spawnWater(p.x, p.y, 3);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#E0F7FA', 2, 35, 0.22, 2);
        } else if (p.type === 'Electric') {
          this.particleSystem.spawnSparks(p.x, p.y, 3);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#FFFFFF', 2, 50, 0.18, 2);
        } else if (p.type === 'Grass') {
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#76FF03', 3, 45, 0.25, 2.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#CCFF90', 2, 25, 0.20, 2);
        } else if (p.type === 'Dark' || internalName === 'SNARL' || internalName === 'DARKPULSE' || internalName === 'NIGHTDAZE') {
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#BA68C8', 2, 45, 0.28, 2.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#4A148C', 2, 25, 0.22, 2);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#0D001A', 1, 15, 0.20, 2);
        } else if (p.type === 'Ghost') {
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#7B1FA2', 2, 40, 0.28, 2.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#311B92', 2, 25, 0.22, 2);
        } else if (p.type === 'Rock' || p.type === 'Ground') {
          this.particleSystem.spawnDust(p.x, p.y + 4, 2);
          this.particleSystem.spawnPixelBurst(p.x, p.y, p.type === 'Ground' ? '#8D6E63' : '#B0BEC5', 3, 35, 0.22, 2);
        } else if (p.type === 'Ice') {
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#80DEEA', 2, 35, 0.22, 2);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#FFFFFF', 2, 25, 0.20, 2);
        } else {
          // Dragon / Psychic / Fighting / Multi-element glow
          this.particleSystem.spawnPixelBurst(p.x, p.y, p.color, 3, 40, 0.25, 2.5);
          this.particleSystem.spawnPixelBurst(p.x, p.y, '#FFFFFF', 1, 30, 0.20, 2);
        }
      }

      // Check collision with target entity (Anti-Double Hit Protection & Inalvejável during Dodge)
      if (p.targetEntity && !p.targetEntity.isFainted) {
        const targetCenter = typeof p.targetEntity.getHitCenter === 'function'
          ? p.targetEntity.getHitCenter()
          : { x: p.targetEntity.x, y: p.targetEntity.y - 28 };

        // Inalvejável: Target is actively dodging, projectile phases cleanly through!
        if (p.targetEntity.dodgeTimer > 0) {
          const dist = Math.hypot(p.x - targetCenter.x, p.y - targetCenter.y);
          if (dist <= p.radius + p.targetEntity.radius && !p.dodgedNotice) {
            p.dodgedNotice = true;
            this.particleSystem.addFloatingText(p.targetEntity.x, p.targetEntity.y - 14, 'ESQUIVOU!', 'dodge', false);
            p.targetEntity.onLog?.(`💨 <strong>${p.targetEntity.data.name}</strong> esquivou!`, 'dodge', p.targetEntity);
          }
          // Do not register hit, continue flying!
        } else {
          const targetId = p.targetEntity.id || p.targetEntity;
          if (!p.hitEntities.has(targetId)) {
            const dist = Math.hypot(p.x - targetCenter.x, p.y - targetCenter.y);
            const hitRadius = p.radius + p.targetEntity.radius;

            if (dist <= hitRadius) {
              // Register hit immediately so it can NEVER hit again
              p.hitEntities.add(targetId);

              // Forward clash won 70% damage reduction
              if (p.clashWonReduced && p.skillData) {
                p.skillData.clashWonReduced = true;
              }

              if (p.onHit) {
                p.onHit(p.targetEntity, p);
              } else {
                // Fallback impact spritesheet if onHit is not present
                const vfile = p.skillData?.visual?.file || '';
                const isStreamBody = vfile.includes('dragon_breath_stream') || vfile.includes('pixel_fire/colored');
                const isZapCannonProj = p.skillData?.internalName === 'ZAPCANNON' || p.skillData?.visual?.isZapCannon || vfile.includes('electric_impact_burst');
                if (isZapCannonProj && this.particleSystem && typeof this.particleSystem.spawnElectricBurst === 'function') {
                  this.particleSystem.spawnElectricBurst(p.x, p.y, 0.40, false);
                } else if (p.skillData?.visual && !isStreamBody && (p.skillData?.type !== 'Fire' || p.skillData?.vfxFamily === 'explosion' || vfile.includes('explosion') || vfile.includes('burst')) && this.particleSystem && typeof this.particleSystem.spawnMoveSpriteAnim === 'function') {
                  this.particleSystem.spawnMoveSpriteAnim(p.x, p.y, p.skillData.visual, 0);
                }
                const vis = getProjectileVisuals(p);
                if (this.arena && this.arena.addDecal) {
                  this.arena.addDecal(p.x, p.y, vis.decal, vis.decalRadius);
                }
                this.particleSystem.spawnPixelBurst(p.x, p.y, p.color, 24, 200, 0.45, 4);
                this.particleSystem.spawnShockwave(p.x, p.y, 50, p.color, 0.35);
              }

              if (p.targetEntity && (p.skillData?.visual?.applyElectrocuted || p.skillData?.type === 'Electric')) {
                if (typeof this.particleSystem?.spawnElectrocutedOverlay === 'function') {
                  this.particleSystem.spawnElectrocutedOverlay(p.targetEntity, 0.60);
                }
              }

              this.projectiles.splice(i, 1);
              continue;
            }
          }
        }
      }
    }
  }

  render(ctx) {
    for (const p of this.projectiles) {
      const vis = getProjectileVisuals(p);

      // Dedicated Dragon Rage Purple/Lilac Flame Projectile (Authentic Animated Spritesheet in Flight)
      if (vis.isDragonRage) {
        const rageImg = getMoveAnimImg('vfx/fire/dragon_breath_stream.png');
        const angle = Math.atan2(p.vy, p.vx);

        // 1. Subtle Draconic Embers trailing behind
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let t = 1; t <= 5; t++) {
          const ex = p.x - Math.cos(angle) * (t * 8.5) + (Math.sin(p.life * 12 + t * 2) * 3);
          const ey = p.y - Math.sin(angle) * (t * 8.5) + (Math.cos(p.life * 12 + t * 2) * 3);
          ctx.fillStyle = t % 2 === 0 ? '#9333EA' : '#C084FC';
          ctx.globalAlpha = (1 - t / 6) * 0.75;
          ctx.beginPath();
          ctx.arc(ex, ey, Math.max(1, 3.5 * (1 - t / 6)), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 2. The Animated Sprite Itself in Flight (Tinted Purple)
        if (rageImg && rageImg.complete && rageImg.naturalWidth > 0) {
          const cols = 8;
          const rows = 8;
          const fw = rageImg.naturalWidth / cols;
          const fh = rageImg.naturalHeight / rows;
          const totalFrames = 61;
          const frame = Math.floor(p.life * 32) % totalFrames;
          const sx = (frame % cols) * fw;
          const sy = Math.floor(frame / cols) * fh;
          const scale = vis.isRoarOfTime ? 1.25 : 1.15;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.filter = 'hue-rotate(90deg) saturate(1.8) brightness(1.2)'; // Vibrant Purple Flame
          ctx.translate(p.x, p.y);
          ctx.rotate(angle);
          ctx.drawImage(rageImg, sx, sy, fw, fh, -dw * 0.45, -dh / 2, dw, dh);
          ctx.restore();
        } else {
          // Micro glow core fallback while loading
          ctx.save();
          ctx.fillStyle = '#C084FC';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Time distortion ripples for Roar of Time
        if (vis.isRoarOfTime) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          for (let r = 1; r <= 3; r++) {
            const rx = p.x - Math.cos(angle) * (r * 11);
            const ry = p.y - Math.sin(angle) * (r * 11);
            ctx.strokeStyle = '#C084FC';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = (1 - r / 4) * 0.65;
            ctx.beginPath();
            ctx.ellipse(rx, ry, 8 + r * 3, 4 + r * 2, angle, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
        continue;
      }

      // Dedicated Twister Whirlwind Projectile in Flight
      if (vis.isWhirlwindProj) {
        const wwImg = getMoveAnimImg('vfx/wind/whirlwind.png');
        if (wwImg && wwImg.complete && wwImg.naturalWidth > 0) {
          const cols = 5;
          const rows = 4;
          const fw = wwImg.naturalWidth / cols;
          const fh = wwImg.naturalHeight / rows;
          const frame = Math.floor(p.life * 24) % 19;
          const sx = (frame % cols) * fw;
          const sy = Math.floor(frame / cols) * fh;
          const scale = 0.95;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.filter = 'hue-rotate(60deg) brightness(1.2)'; // Jade/Cyan draconic twister
          ctx.drawImage(wwImg, sx, sy, fw, fh, p.x - dw / 2, p.y - dh + 8, dw, dh);
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draconic wind particles
        ctx.save();
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(Math.round(p.x - 2 + (Math.random() - 0.5) * 8), Math.round(p.y - 2 + (Math.random() - 0.5) * 8), 2, 2);
        ctx.restore();
        continue;
      }

      // Dedicated Snarl Acoustic Soundwave in Flight
      if (vis.isSnarl) {
        const snarlImg = getMoveAnimImg('vfx/custom/snarl_soundwave.png');
        const angle = Math.atan2(p.vy, p.vx);

        // Acoustic concentric ripples trailing behind
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let t = 1; t <= 3; t++) {
          const rx = p.x - Math.cos(angle) * (t * 10);
          const ry = p.y - Math.sin(angle) * (t * 10);
          const rRad = 6 + t * 4;
          ctx.strokeStyle = t % 2 === 0 ? '#a855f7' : '#7c3aed';
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = (1 - t / 4) * 0.65;
          ctx.beginPath();
          ctx.arc(rx, ry, rRad, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        if (snarlImg && snarlImg.complete && snarlImg.naturalWidth > 0) {
          const cols = 6;
          const fw = snarlImg.naturalWidth / cols;
          const fh = snarlImg.naturalHeight;
          const frame = Math.floor(p.life * 20) % cols;
          const sx = frame * fw;
          const scale = 1.35;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(angle);
          ctx.drawImage(snarlImg, sx, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        continue;
      }

      // Dedicated Pin Missile / Fell Stinger Aerodynamic Pixel Spike Projectile
      if (vis.isPinMissile) {
        const spikeImg = getMoveAnimImg('vfx/custom/pin_missile_spike.png');
        const angle = Math.atan2(p.vy, p.vx);

        if (spikeImg && spikeImg.complete && spikeImg.naturalWidth > 0) {
          const cols = 6;
          const fw = spikeImg.naturalWidth / cols;
          const fh = spikeImg.naturalHeight;
          const frame = Math.floor(p.life * 24) % cols;
          const sx = frame * fw;
          const sy = 0;
          const scale = 1.25;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(angle);
          ctx.drawImage(spikeImg, sx, sy, fw, fh, -dw * 0.55, -dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#facc15';
          ctx.fillRect(Math.round(p.x - 2), Math.round(p.y - 2), 4, 4);
          ctx.restore();
        }
        continue;
      }

      // Dedicated String Shot Spiral Silk Strand Projectile
      // Dedicated String Shot & Electroweb Spiral Silk Strand Projectile
      if (vis.isStringShot) {
        const silkImg = getMoveAnimImg('vfx/custom/string_shot_silk.png');
        const angle = Math.atan2(p.vy, p.vx);
        const isYellow = Boolean(vis.isYellow || vis.isElectroweb || p.isElectroweb || p.skillData?.type === 'Electric');

        if (silkImg && silkImg.complete && silkImg.naturalWidth > 0) {
          const cols = 6;
          const fw = silkImg.naturalWidth / cols;
          const fh = silkImg.naturalHeight;
          const frame = Math.floor(p.life * 20) % cols;
          const sx = frame * fw;
          const sy = 0;
          const scale = 1.20;
          const dw = fw * scale;
          const dh = fh * scale;

          // Connecting silk strand from attacker to projectile head
          if (typeof p.startX === 'number' && typeof p.startY === 'number') {
            ctx.save();
            ctx.lineWidth = 3.2;
            ctx.strokeStyle = isYellow ? 'rgba(161, 98, 7, 0.85)' : 'rgba(30, 41, 59, 0.7)';
            ctx.beginPath();
            ctx.moveTo(Math.round(p.startX), Math.round(p.startY));
            ctx.lineTo(Math.round(p.x), Math.round(p.y));
            ctx.stroke();

            ctx.lineWidth = 1.8;
            ctx.strokeStyle = isYellow ? '#FACC15' : '#ffffff';
            ctx.beginPath();
            ctx.moveTo(Math.round(p.startX), Math.round(p.startY));
            ctx.lineTo(Math.round(p.x), Math.round(p.y));
            ctx.stroke();

            if (isYellow) {
              ctx.lineWidth = 0.9;
              ctx.strokeStyle = '#FEF08A';
              ctx.stroke();
            }
            ctx.restore();
          }

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          if (isYellow) {
            ctx.filter = 'sepia(1) saturate(12) hue-rotate(15deg) brightness(1.2)';
          }
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(angle);
          ctx.drawImage(silkImg, sx, sy, fw, fh, -dw * 0.55, -dh / 2, dw, dh);
          ctx.restore();

          if (isYellow) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let t = 1; t <= 3; t++) {
              const rx = p.x - Math.cos(angle) * (t * 10);
              const ry = p.y - Math.sin(angle) * (t * 10);
              ctx.fillStyle = t % 2 === 0 ? '#FEF08A' : '#FACC15';
              ctx.globalAlpha = 0.85;
              ctx.fillRect(Math.round(rx - 1), Math.round(ry - 1), 2, 2);
            }
            ctx.restore();
          }
        } else {
          ctx.save();
          ctx.fillStyle = isYellow ? '#FACC15' : '#ffffff';
          ctx.fillRect(Math.round(p.x - 2), Math.round(p.y - 2), 4, 4);
          ctx.restore();
        }
        continue;
      }

      // Dedicated Electric Bolt / Wave Projectile in Flight (Yellow / Gold)
      if (vis.isElectricBoltProj || p.isElectricBoltProj) {
        const boltImg = getMoveAnimImg('vfx/custom/electric_projectile_yellow.png');
        const angle = Math.atan2(p.vy, p.vx);

        // Electric micro spark trail
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let t = 1; t <= 3; t++) {
          const rx = p.x - Math.cos(angle) * (t * 8);
          const ry = p.y - Math.sin(angle) * (t * 8);
          ctx.fillStyle = t % 2 === 0 ? '#FEF08A' : '#FACC15';
          ctx.globalAlpha = (1 - t / 4) * 0.75;
          ctx.fillRect(Math.round(rx - 1), Math.round(ry - 1), 2, 2);
        }
        ctx.restore();

        if (boltImg && boltImg.complete && boltImg.naturalWidth > 0) {
          const cols = 5;
          const fw = boltImg.naturalWidth / cols;
          const fh = boltImg.naturalHeight;
          const frame = Math.floor(p.life * 24) % cols;
          const sx = frame * fw;
          const scale = 1.0;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.globalCompositeOperation = 'lighter';
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(angle);
          ctx.drawImage(boltImg, sx, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        continue;
      }

      // Dedicated Disarming Voice Sonic Wave Projectile (Pink sound wave + notes + hearts + MediumStar_64x64.png)
      if (vis.isDisarmingVoice || p.isDisarmingVoice) {
        const starImg = getMoveAnimImg('vfx/custom/MediumStar_64x64.png');
        const angle = Math.atan2(p.vy, p.vx);

        // 1. Expanding Sonic Wave Arc Rings in Pink/Magenta behind the star
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let w = 1; w <= 3; w++) {
          const waveDist = w * 16;
          const wx = p.x - Math.cos(angle) * waveDist;
          const wy = p.y - Math.sin(angle) * waveDist;
          const waveRadius = 10 + w * 6;
          const waveAlpha = (1 - w / 4) * 0.85;

          ctx.strokeStyle = w === 1 ? '#FB7185' : (w === 2 ? '#F472B6' : '#E879F9');
          ctx.lineWidth = 2.5 - w * 0.4;
          ctx.globalAlpha = waveAlpha;
          ctx.beginPath();
          ctx.arc(wx, wy, waveRadius, angle - Math.PI * 0.55, angle + Math.PI * 0.55);
          ctx.stroke();

          // Subtle acoustic vibration ripple
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(wx, wy, waveRadius * 0.75, angle - Math.PI * 0.4, angle + Math.PI * 0.4);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Floating Musical Notes and Cute Pink Hearts along the acoustic trail
        ctx.save();
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const notes = ['♪', '♫', '♥', '♬'];
        for (let n = 0; n < 3; n++) {
          const nDist = 18 + n * 18;
          const nx = p.x - Math.cos(angle) * nDist + Math.sin(p.life * 12 + n * 2) * 8;
          const ny = p.y - Math.sin(angle) * nDist + Math.cos(p.life * 12 + n * 2) * 8;
          const char = notes[(Math.floor(p.life * 6) + n) % notes.length];
          ctx.fillStyle = char === '♥' ? '#F43F5E' : (n % 2 === 0 ? '#FB7185' : '#FFFFFF');
          ctx.shadowColor = '#F472B6';
          ctx.shadowBlur = 6;
          ctx.fillText(char, Math.round(nx), Math.round(ny));
        }
        ctx.restore();

        // 3. Central Magic Star (vfx/custom/MediumStar_64x64.png, 60 frames)
        if (starImg && starImg.complete && starImg.naturalWidth > 0) {
          const cols = 60;
          const fw = 64;
          const fh = 64;
          const frame = Math.floor(p.life * 30) % cols;
          const sx = frame * fw;
          const scale = 0.85;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.globalCompositeOperation = 'lighter';
          ctx.shadowColor = '#F472B6';
          ctx.shadowBlur = 10;
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(angle);
          ctx.drawImage(starImg, sx, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#F472B6';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        continue;
      }

      // Dedicated Dazzling Gleam Projectile: Brilliant Radiant Starlight + MediumStar_64x64.png + Prism Trail
      if (vis.isDazzlingGleam || p.isDazzlingGleam) {
        const starImg = getMoveAnimImg('vfx/custom/MediumStar_64x64.png');
        const angle = Math.atan2(p.vy, p.vx);

        // 1. Radiant Multi-Prism Starlight Trail
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 1; i <= 4; i++) {
          const tDist = i * 14;
          const tx = p.x - Math.cos(angle) * tDist;
          const ty = p.y - Math.sin(angle) * tDist;
          const rad = (5 - i) * 3.5;
          const alpha = (1 - i / 5) * 0.85;

          const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, rad * 2);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.4, i % 2 === 0 ? '#FEF08A' : '#F472B6');
          grad.addColorStop(1, 'rgba(244, 114, 182, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(tx, ty, rad * 2, 0, Math.PI * 2);
          ctx.fill();

          // Small cross glints
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = alpha;
          ctx.fillRect(Math.round(tx - 1), Math.round(ty - rad), 2, rad * 2);
          ctx.fillRect(Math.round(tx - rad), Math.round(ty - 1), rad * 2, 2);
        }
        ctx.restore();

        // 2. Central Rotating MediumStar with Blinding White/Pink Additive Glow
        if (starImg && starImg.complete && starImg.naturalWidth > 0) {
          const cols = 60;
          const fw = 64;
          const fh = 64;
          const frame = Math.floor(p.life * 32) % cols;
          const sx = frame * fw;
          const scale = 1.05;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.globalCompositeOperation = 'lighter';
          ctx.shadowColor = '#FEF08A';
          ctx.shadowBlur = 18;
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(p.life * 6);
          ctx.drawImage(starImg, sx, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);

          // Additive core flare
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        continue;
      }

      // Dedicated Fairy Lock Projectile: Traveling Pink Starlight Star + Fairy Binding Sparkles
      if (vis.isFairyLock || p.isFairyLock) {
        const starImg = getMoveAnimImg('vfx/custom/MediumStar_64x64.png');
        const angle = Math.atan2(p.vy, p.vx);

        // 1. Trailing Fairy Binding Rings & Sparkles
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 1; i <= 3; i++) {
          const rDist = i * 16;
          const rx = p.x - Math.cos(angle) * rDist;
          const ry = p.y - Math.sin(angle) * rDist;
          const rAlpha = (1 - i / 4) * 0.75;
          ctx.strokeStyle = '#F472B6';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = rAlpha;
          ctx.beginPath();
          ctx.arc(rx, ry, 6 + i * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Central Star
        if (starImg && starImg.complete && starImg.naturalWidth > 0) {
          const cols = 60;
          const fw = 64;
          const fh = 64;
          const frame = Math.floor(p.life * 30) % cols;
          const sx = frame * fw;
          const scale = 0.95;
          const dw = fw * scale;
          const dh = fh * scale;

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.globalCompositeOperation = 'lighter';
          ctx.shadowColor = '#F472B6';
          ctx.shadowBlur = 12;
          ctx.translate(Math.round(p.x), Math.round(p.y));
          ctx.rotate(angle);
          ctx.drawImage(starImg, sx, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.save();
          ctx.fillStyle = '#F472B6';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        continue;
      }

      let drawX = p.x;
      let drawY = p.y;
      if (p.hasLobArc) {
        const arcProg = Math.min(1.0, Math.max(0.0, (p.traveledDist || 0) / (p.totalDist || 1)));
        const arcOffset = -Math.sin(arcProg * Math.PI) * (p.arcHeight || 45);
        drawY = p.y + arcOffset;

        // Trailing animated electric projectile frames along the lob arc (replacing the grey ground shadow)
        if (p.isElectroBall || vis.isElectroBall) {
          const trailImg = getMoveAnimImg('vfx/custom/electric_projectile_yellow.png');
          if (trailImg && trailImg.complete && trailImg.naturalWidth > 0) {
            const cols = 5;
            const fw = trailImg.naturalWidth / cols;
            const fh = trailImg.naturalHeight;
            const numTrails = 3;
            for (let t = 0; t < numTrails; t++) {
              const dDist = t === 0 ? 4 : 4 + t * 20;
              if ((p.traveledDist || 0) < dDist * 0.3) continue;
              const trailDist = Math.max(0, (p.traveledDist || 0) - dDist);
              const trailProg = Math.min(1.0, trailDist / (p.totalDist || 1));
              const tX = (p.startX ?? p.x) + ((p.targetX ?? p.x) - (p.startX ?? p.x)) * trailProg;
              const tGroundY = (p.startY ?? p.y) + ((p.targetY ?? p.y) - (p.startY ?? p.y)) * trailProg;
              const tArc = -Math.sin(trailProg * Math.PI) * (p.arcHeight || 45);
              const tY = tGroundY + tArc;

              const dArcDy = -Math.cos(trailProg * Math.PI) * Math.PI * (p.arcHeight || 45) / (p.totalDist || 1);
              const tAngle = Math.atan2(((p.targetY ?? p.y) - (p.startY ?? p.y)) / (p.totalDist || 1) + dArcDy, ((p.targetX ?? p.x) - (p.startX ?? p.x)) / (p.totalDist || 1));

              const tFrame = Math.floor((p.life * 24 + t * 2)) % cols;
              const sx = tFrame * fw;
              const tScale = (1.0 - t * 0.22) * 1.05;
              const dw = fw * tScale;
              const dh = fh * tScale;
              const tAlpha = (1.0 - t / numTrails) * 0.85;

              ctx.save();
              ctx.imageSmoothingEnabled = false;
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = tAlpha;
              ctx.translate(Math.round(tX), Math.round(tY));
              ctx.rotate(tAngle);
              ctx.drawImage(trailImg, sx, 0, fw, fh, -dw * 0.88, -dh / 2, dw, dh);
              ctx.restore();
            }
          }
        }
      }

      const rotation = Math.atan2(p.vy, p.vx) + Math.PI / 2;
      const frameIdx = Math.floor(p.life * 14) % vis.frames.length;

      // Render authentic 16-bit pixel projectile frame (calibrated scale 2 so it is proportional to Pokemon)
      renderPixelMatrix(ctx, drawX, drawY, vis.frames[frameIdx], vis.palette, 2, rotation, 1.0);

      // Micro pixel glint aura
      ctx.save();
      const pSize = 2;
      for (let i = 0; i < 3; i++) {
        const ang = (p.life * 12 + i * 2.1) % (Math.PI * 2);
        const gx = Math.round(drawX + Math.cos(ang) * (p.radius * 0.7));
        const gy = Math.round(drawY + Math.sin(ang) * (p.radius * 0.7));
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(gx, gy, pSize, pSize);
      }
      ctx.restore();
    }
  }
}
