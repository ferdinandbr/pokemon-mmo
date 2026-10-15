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
} from './pixelArtVfx.js';

export function getProjectileVisuals(p) {
  const type = p.type || 'Normal';
  const skillId = p.skillData?.id;

  if (skillId === 'ember' || type === 'Fire') {
    return { frames: EMBER_FRAMES, palette: PIXEL_COLOR_PALETTES.fire, decal: 'scorch', decalRadius: 26 };
  }
  if (skillId === 'water_gun' || type === 'Water') {
    return { frames: WATER_DROPLET_FRAMES, palette: PIXEL_COLOR_PALETTES.water, decal: 'wet', decalRadius: 24 };
  }
  if (skillId === 'thunder_shock' || type === 'Electric') {
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
  }) {
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy) || 1;
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;

    const projectileId = `proj_${this.nextProjectileId++}_${Date.now()}`;

    this.projectiles.push({
      id: projectileId,
      sourceEntity,
      targetEntity,
      x: startX,
      y: startY,
      vx,
      vy,
      speed,
      radius,
      color,
      type,
      skillData,
      onHit,
      life: 2.5,
      trailTimer: 0,
      hitEntities: new Set(), // Strict single-hit registration set
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

      // Emit continuous pixel trails
      p.trailTimer += dt;
      if (p.trailTimer >= 0.035) {
        p.trailTimer = 0;
        if (p.type === 'Fire') {
          this.particleSystem.spawnFlame(p.x, p.y, 2);
        } else if (p.type === 'Water') {
          this.particleSystem.spawnWater(p.x, p.y, 2);
        } else if (p.type === 'Electric') {
          this.particleSystem.spawnSparks(p.x, p.y, 2);
        } else if (p.type === 'Rock' || p.type === 'Ground') {
          this.particleSystem.spawnDust(p.x, p.y + 4, 1);
          this.particleSystem.spawnPixelBurst(p.x, p.y, p.type === 'Ground' ? '#8D6E63' : '#B0BEC5', 2, 25, 0.2, 2);
        } else {
          this.particleSystem.spawnPixelBurst(p.x, p.y, p.color, 2, 30, 0.25, 3);
        }
      }

      // Check collision with target entity (Anti-Double Hit Protection & Inalvejável during Dodge)
      if (p.targetEntity && !p.targetEntity.isFainted) {
        // Inalvejável: Target is actively dodging, projectile phases cleanly through!
        if (p.targetEntity.dodgeTimer > 0) {
          const dist = Math.hypot(p.x - p.targetEntity.x, p.y - p.targetEntity.y);
          if (dist <= p.radius + p.targetEntity.radius && !p.dodgedNotice) {
            p.dodgedNotice = true;
            this.particleSystem.addFloatingText(p.targetEntity.x, p.targetEntity.y - 14, '💨 ESQUIVOU!', 'dodge', false);
          }
          // Do not register hit, continue flying!
        } else {
          const targetId = p.targetEntity.id || p.targetEntity;
          if (!p.hitEntities.has(targetId)) {
            const dist = Math.hypot(p.x - p.targetEntity.x, p.y - p.targetEntity.y);
            const hitRadius = p.radius + p.targetEntity.radius;

            if (dist <= hitRadius) {
              // Register hit immediately so it can NEVER hit again
              p.hitEntities.add(targetId);

              if (p.onHit) {
                p.onHit(p.targetEntity, p);
              }

              const vis = getProjectileVisuals(p);

              // Persistent ground impact decal (scorch, wet, zap_burn, crack, shadow)
              if (this.arena && this.arena.addDecal) {
                this.arena.addDecal(p.x, p.y, vis.decal, vis.decalRadius);
              }

              // Impact Pixel Burst & Shockwave
              this.particleSystem.spawnPixelBurst(p.x, p.y, p.color, 24, 200, 0.45, 4);
              this.particleSystem.spawnShockwave(p.x, p.y, 50, p.color, 0.35);

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
      const rotation = Math.atan2(p.vy, p.vx) + Math.PI / 2;
      const frameIdx = Math.floor(p.life * 14) % vis.frames.length;

      // Render authentic 16-bit pixel projectile frame
      renderPixelMatrix(ctx, p.x, p.y, vis.frames[frameIdx], vis.palette, 3, rotation, 1.0);

      // Micro pixel glint aura
      ctx.save();
      const pSize = 2;
      for (let i = 0; i < 3; i++) {
        const ang = (p.life * 12 + i * 2.1) % (Math.PI * 2);
        const gx = Math.round(p.x + Math.cos(ang) * (p.radius * 0.7));
        const gy = Math.round(p.y + Math.sin(ang) * (p.radius * 0.7));
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(gx, gy, pSize, pSize);
      }
      ctx.restore();
    }
  }
}
