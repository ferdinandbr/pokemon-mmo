// Attack Clash System (Sistema de Confronto entre Ataques Simultâneos)
// Centralized resolution for Physical vs Physical, Projectile vs Projectile,
// Beam vs Beam, and Projectile vs Beam collisions in PokeMMO Arena 2D.
import { getTypeMultiplier } from './pokemonData.js';
import { soundManager } from './soundManager.js';

export const CLASH_CONFIG = {
  // Relative difference threshold (5%): <= 5% difference is a tie / mutual cancellation
  tolerance: 0.05,
  // Elemental modifiers
  elementalAdvantage: 1.25,
  elementalDisadvantage: 0.80,
  elementalNeutral: 1.00,
  // Winner damage reduction multiplier (70% normal damage / 30% reduction)
  winnerDamageMult: 0.70,
  // Daze (tontura) duration in seconds for physical clashes
  dazeDurationPhysical: 1.5,
};

/**
 * Calculates the raw confrontation force of an attack based on base power,
 * offensive stat (Atk/SpAtk), stat stages, and Pokémon level.
 */
export function calculateClashForce(entity, move) {
  if (!entity || !move) return 0;

  const isPhysical = move.category === 'Physical';
  const power = Math.max(15, move.power || (isPhysical ? 40 : 50));

  // Stat stage multipliers (Gen 5/6 standards)
  const stage = entity.statStages
    ? (isPhysical ? entity.statStages.atk : entity.statStages.spAtk) || 0
    : 0;
  const stageMultiplier = stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);

  const rawStat = entity.data?.stats
    ? (isPhysical ? entity.data.stats.atk : entity.data.stats.spAtk) || 50
    : 50;
  const effectiveStat = Math.max(1, Math.round(rawStat * stageMultiplier));

  const level = entity.level || 50;

  // Predictable clash force formula: Power * (Stat/50) * Level Scaling
  const baseForce = power * (effectiveStat / 50) * ((2 * level / 5 + 2) / 20);
  return Math.max(1, baseForce);
}

/**
 * Determines elemental matchup modifiers for two colliding attacks using the official type chart.
 * Returns { modA, modB }
 */
export function getElementalClashModifiers(typeA, typeB) {
  if (!typeA || !typeB) {
    return { modA: CLASH_CONFIG.elementalNeutral, modB: CLASH_CONFIG.elementalNeutral };
  }

  const multAtoB = getTypeMultiplier(typeA, typeB);
  const multBtoA = getTypeMultiplier(typeB, typeA);

  if (multAtoB > 1.0 && multBtoA <= 1.0) {
    // Attack A has elemental advantage
    return {
      modA: CLASH_CONFIG.elementalAdvantage,
      modB: CLASH_CONFIG.elementalDisadvantage,
    };
  } else if (multBtoA > 1.0 && multAtoB <= 1.0) {
    // Attack B has elemental advantage
    return {
      modA: CLASH_CONFIG.elementalDisadvantage,
      modB: CLASH_CONFIG.elementalAdvantage,
    };
  }

  // Neutral or reciprocal
  return {
    modA: CLASH_CONFIG.elementalNeutral,
    modB: CLASH_CONFIG.elementalNeutral,
  };
}

/**
 * Compares two attacks with elemental modifiers and 5% relative tolerance.
 */
export function compareClashAttacks({ entityA, moveA, typeA }, { entityB, moveB, typeB }) {
  const baseForceA = calculateClashForce(entityA, moveA);
  const baseForceB = calculateClashForce(entityB, moveB);

  const tA = typeA || moveA?.type || 'Normal';
  const tB = typeB || moveB?.type || 'Normal';

  const { modA, modB } = getElementalClashModifiers(tA, tB);
  const finalForceA = baseForceA * modA;
  const finalForceB = baseForceB * modB;

  const maxForce = Math.max(finalForceA, finalForceB);
  const relativeDiff = maxForce > 0 ? Math.abs(finalForceA - finalForceB) / maxForce : 0;

  const isTie = relativeDiff <= CLASH_CONFIG.tolerance;
  const winner = isTie ? null : (finalForceA > finalForceB ? 'A' : 'B');

  return {
    isTie,
    winner,
    relativeDiff,
    forceA: finalForceA,
    forceB: finalForceB,
    modA,
    modB,
  };
}

/**
 * Helper to compute distance between point (px, py) and line segment (x1, y1)-(x2, y2)
 */
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return { dist: Math.hypot(px - x1, py - y1), nx: x1, ny: y1 };

  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const nx = x1 + t * dx;
  const ny = y1 + t * dy;
  return { dist: Math.hypot(px - nx, py - ny), nx, ny, t };
}

/**
 * Helper to find intersection between two 2D line segments
 */
function lineSegmentsIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
  const s1_x = p1_x - p0_x;
  const s1_y = p1_y - p0_y;
  const s2_x = p3_x - p2_x;
  const s2_y = p3_y - p2_y;

  const denom = -s2_x * s1_y + s1_x * s2_y;
  if (Math.abs(denom) < 0.0001) return null; // Parallel

  const s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / denom;
  const t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / denom;

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p0_x + (t * s1_x),
      y: p0_y + (t * s1_y),
    };
  }
  return null;
}

export class AttackClashSystem {
  constructor(engine) {
    this.engine = engine;
    this.clashCooldown = 0;
    this.resolvedPairs = new Set();
  }

  reset() {
    this.resolvedPairs.clear();
  }

  update(dt) {
    if (!this.engine || this.engine.battleEnded) return;

    const player = this.engine.playerEntity;
    const enemy = this.engine.enemyEntity;
    if (!player || !enemy || player.isFainted || enemy.isFainted) return;

    const projSys = this.engine.projectileSystem;
    const partSys = this.engine.particleSystem;
    const arena = this.engine.arena;

    // 1. Physical vs Physical Clash (Both dashing towards each other)
    this.checkPhysicalVsPhysical(player, enemy, arena, partSys);

    // 2. Projectile vs Projectile Clash
    if (projSys && projSys.projectiles && projSys.projectiles.length >= 2) {
      this.checkProjectileVsProjectile(projSys, arena, partSys);
    }

    // 3. Beam vs Beam Clash
    if (partSys && partSys.beams && partSys.beams.length >= 2) {
      this.checkBeamVsBeam(partSys, arena);
    }

    // 4. Projectile vs Beam Clash
    if (projSys && projSys.projectiles && partSys && partSys.beams && partSys.beams.length > 0) {
      this.checkProjectileVsBeam(projSys, partSys, arena);
    }

    // 5. Physical vs Projectile Clash
    if (projSys && projSys.projectiles && projSys.projectiles.length > 0) {
      this.checkPhysicalVsProjectile(player, enemy, projSys, arena, partSys);
    }
  }

  // ─── 1. Physical vs Physical ──────────────────────────────────────────────
  checkPhysicalVsPhysical(player, enemy, arena, partSys) {
    if (player.state !== 'dashing_strike' || enemy.state !== 'dashing_strike') return;
    if (player.isDizzy || enemy.isDizzy) return;

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    const collideDist = player.radius + enemy.radius + 24;

    if (dist <= collideDist) {
      const clashKey = `phys_${Math.round(player.x)}_${Math.round(enemy.x)}`;
      if (this.resolvedPairs.has(clashKey)) return;
      this.resolvedPairs.add(clashKey);
      setTimeout(() => this.resolvedPairs.delete(clashKey), 1000);

      const moveP = player.currentDashingSkill || player.physicalAttack;
      const moveE = enemy.currentDashingSkill || enemy.physicalAttack;

      const comp = compareClashAttacks(
        { entityA: player, moveA: moveP, typeA: moveP.type },
        { entityB: enemy, moveB: moveE, typeB: moveE.type }
      );

      const clashX = (player.x + enemy.x) / 2;
      const clashY = (player.y + enemy.y) / 2 - 20;

      soundManager.playHit?.(true, false);
      arena?.triggerScreenShake?.(16);
      arena?.addDecal?.(clashX, clashY + 20, 'crack', 34, 10.0);

      if (comp.isTie) {
        // CASE A: Equivalência dentro de 5% -> Anulação mútua
        player.state = 'moving';
        player.currentDashingSkill = null;
        player.vx = -player.dashDirX * 360;
        player.vy = -player.dashDirY * 360;
        player.applyDizziness(CLASH_CONFIG.dazeDurationPhysical);

        enemy.state = 'moving';
        enemy.currentDashingSkill = null;
        enemy.vx = -enemy.dashDirX * 360;
        enemy.vy = -enemy.dashDirY * 360;
        enemy.applyDizziness(CLASH_CONFIG.dazeDurationPhysical);

        partSys.spawnShockwave(clashX, clashY, 65, '#FFD700', 0.4);
        partSys.spawnPixelBurst(clashX, clashY, '#FFD700', 30, 220, 0.6, 5);
        partSys.addFloatingText(clashX, clashY - 14, 'EMPATE! ANULAÇÃO MÚTUA', 'electric', true);

        this.engine.onLogMessage(
          `⚔️ <strong>CONFRONTO FÍSICO!</strong> ${player.data.name} e ${enemy.data.name} colidiram com forças equivalentes! Ambos ficaram <strong>TONTOS</strong>!`,
          'system'
        );
      } else {
        // CASE B: Força diferente -> Vencedor prevalece, perdedor tonto
        const winner = comp.winner === 'A' ? player : enemy;
        const loser = comp.winner === 'A' ? enemy : player;
        const winMove = comp.winner === 'A' ? moveP : moveE;
        const loseMove = comp.winner === 'A' ? moveE : moveP;

        // Loser gets interrupted, dazed and knocked back
        loser.state = 'moving';
        loser.currentDashingSkill = null;
        const pushDirX = comp.winner === 'A' ? player.dashDirX : enemy.dashDirX;
        const pushDirY = comp.winner === 'A' ? player.dashDirY : enemy.dashDirY;
        loser.applyPush(pushDirX, pushDirY, 520, winner);
        loser.applyDizziness(CLASH_CONFIG.dazeDurationPhysical);

        // Winner continues trajectory and has damage reduced to 70% upon hit
        winner.hasClashWonReduced = true;
        if (winner.currentDashingSkill) {
          winner.currentDashingSkill.clashWonReduced = true;
        }

        const winColor = winMove.color || '#00E5FF';
        partSys.spawnShockwave(clashX, clashY, 60, winColor, 0.35);
        partSys.spawnPixelBurst(clashX, clashY, winColor, 26, 200, 0.5, 4);
        partSys.addFloatingText(clashX, clashY - 14, `${winner.data.name.toUpperCase()} VENCEU! (-30% Dano)`, 'heal', true);

        this.engine.onLogMessage(
          `⚔️ <strong>CONFRONTO FÍSICO!</strong> <strong>${winner.data.name}</strong> (${winMove.name}) sobrepujou <strong>${loser.data.name}</strong> (${loseMove.name})! Dano reduzido para 70%.`,
          'system'
        );
      }
    }
  }

  // ─── 2. Projectile vs Projectile ──────────────────────────────────────────
  checkProjectileVsProjectile(projSys, arena, partSys) {
    const list = projSys.projectiles;

    for (let i = list.length - 1; i >= 0; i--) {
      const p1 = list[i];
      if (!p1 || p1.isDestroyed) continue;

      for (let j = i - 1; j >= 0; j--) {
        const p2 = list[j];
        if (!p2 || p2.isDestroyed) continue;

        // Must be opposing projectiles
        if (!p1.sourceEntity || !p2.sourceEntity) continue;
        if (p1.sourceEntity.isPlayer === p2.sourceEntity.isPlayer) continue;

        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const hitDist = p1.radius + p2.radius + 6;

        if (dist <= hitDist) {
          const clashX = (p1.x + p2.x) / 2;
          const clashY = (p1.y + p2.y) / 2;

          const comp = compareClashAttacks(
            { entityA: p1.sourceEntity, moveA: p1.skillData || { power: 50, category: 'Special', type: p1.type }, typeA: p1.type },
            { entityB: p2.sourceEntity, moveB: p2.skillData || { power: 50, category: 'Special', type: p2.type }, typeB: p2.type }
          );

          arena?.triggerScreenShake?.(12);
          arena?.addDecal?.(clashX, clashY, 'scorch', 26, 8.0);

          if (comp.isTie) {
            // Anulação Mútua
            p1.isDestroyed = true;
            p2.isDestroyed = true;
            list.splice(i, 1);
            const newJ = list.indexOf(p2);
            if (newJ !== -1) list.splice(newJ, 1);

            partSys.spawnShockwave(clashX, clashY, 50, '#FFD700', 0.35);
            partSys.spawnPixelBurst(clashX, clashY, '#FFD700', 26, 200, 0.5, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'PROJÉTEIS ANULADOS!', 'electric', false);

            this.engine.onLogMessage(
              `⚔️ <strong>CONFRONTO DE PROJÉTEIS!</strong> ${p1.skillData?.name || 'Ataque'} e ${p2.skillData?.name || 'Ataque'} colidiram e se anularam mutuamente!`,
              'system'
            );
            break;
          } else {
            // Vitória por Força
            const winnerP = comp.winner === 'A' ? p1 : p2;
            const loserP = comp.winner === 'A' ? p2 : p1;

            loserP.isDestroyed = true;
            const loserIdx = list.indexOf(loserP);
            if (loserIdx !== -1) list.splice(loserIdx, 1);

            // Winner continues with 70% damage reduction applied once
            winnerP.clashWonReduced = true;

            const winColor = winnerP.color || '#00E5FF';
            partSys.spawnShockwave(clashX, clashY, 45, winColor, 0.3);
            partSys.spawnPixelBurst(clashX, clashY, winColor, 20, 180, 0.45, 4);
            partSys.addFloatingText(clashX, clashY - 10, `${winnerP.skillData?.name || 'Projétil'} VENCEU! (-30% Dano)`, 'heal', false);

            this.engine.onLogMessage(
              `⚔️ <strong>CONFRONTO DE PROJÉTEIS!</strong> <strong>${winnerP.skillData?.name || 'Projétil'}</strong> destruiu o projétil adversário e manteve sua rota com dano reduzido para 70%!`,
              'system'
            );
            break;
          }
        }
      }
    }
  }

  // ─── 3. Beam vs Beam ──────────────────────────────────────────────────────
  checkBeamVsBeam(partSys, arena) {
    const beams = partSys.beams;
    if (beams.length < 2) return;

    for (let i = 0; i < beams.length; i++) {
      const b1 = beams[i];
      if (!b1 || b1.isCancelled) continue;

      for (let j = i + 1; j < beams.length; j++) {
        const b2 = beams[j];
        if (!b2 || b2.isCancelled) continue;

        if (b1.caster?.isPlayer === b2.caster?.isPlayer) continue;

        // Check line segments intersection
        const inter = lineSegmentsIntersection(
          b1.startX, b1.startY, b1.targetX, b1.targetY,
          b2.startX, b2.startY, b2.targetX, b2.targetY
        );

        if (inter) {
          const clashKey = `beam_${b1.caster?.id}_${b2.caster?.id}`;
          if (this.resolvedPairs.has(clashKey)) return;
          this.resolvedPairs.add(clashKey);
          setTimeout(() => this.resolvedPairs.delete(clashKey), 1200);

          const move1 = b1.skill || b1.caster?.channelingSkill || { power: 90, category: 'Special', type: b1.type };
          const move2 = b2.skill || b2.caster?.channelingSkill || { power: 90, category: 'Special', type: b2.type };

          const comp = compareClashAttacks(
            { entityA: b1.caster, moveA: move1, typeA: b1.type },
            { entityB: b2.caster, moveB: move2, typeB: b2.type }
          );

          arena?.triggerScreenShake?.(18);
          arena?.addDecal?.(inter.x, inter.y, 'scorch', 36, 10.0);

          if (comp.isTie) {
            b1.isCancelled = true;
            b2.isCancelled = true;
            b1.caster?.cancelBeamChanneling?.('clash_tie');
            b2.caster?.cancelBeamChanneling?.('clash_tie');

            partSys.spawnShockwave(inter.x, inter.y, 70, '#FFD700', 0.45);
            partSys.spawnPixelBurst(inter.x, inter.y, '#FFD700', 35, 240, 0.6, 5);
            partSys.addFloatingText(inter.x, inter.y - 12, 'FEIXES ANULADOS!', 'electric', false);

            this.engine.onLogMessage(
              `⚔️ <strong>CONFRONTO DE FEIXES!</strong> Ambos os raios colidiram em força igual e se anularam!`,
              'system'
            );
          } else {
            const winBeam = comp.winner === 'A' ? b1 : b2;
            const loseBeam = comp.winner === 'A' ? b2 : b1;

            loseBeam.isCancelled = true;
            loseBeam.caster?.cancelBeamChanneling?.('clash_lost');

            // Winner beam deals 70% damage
            winBeam.clashWonReduced = true;
            if (winBeam.caster) winBeam.caster.hasClashWonReduced = true;

            const winColor = winBeam.color || '#00E5FF';
            partSys.spawnShockwave(inter.x, inter.y, 60, winColor, 0.4);
            partSys.spawnPixelBurst(inter.x, inter.y, winColor, 28, 220, 0.55, 4);
            partSys.addFloatingText(inter.x, inter.y - 12, 'FEIXE VITORIOSO! (-30% Dano)', 'heal', false);

            this.engine.onLogMessage(
              `⚔️ <strong>CONFRONTO DE FEIXES!</strong> O feixe de <strong>${winBeam.caster?.data?.name || 'Atacante'}</strong> dominou o choque e manteve o alvo!`,
              'system'
            );
          }
        }
      }
    }
  }

  // ─── 4. Projectile vs Beam ────────────────────────────────────────────────
  checkProjectileVsBeam(projSys, partSys, arena) {
    const projectiles = projSys.projectiles;
    const beams = partSys.beams;

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      if (!p || p.isDestroyed) continue;

      for (let j = 0; j < beams.length; j++) {
        const b = beams[j];
        if (!b || b.isCancelled) continue;
        if (p.sourceEntity?.isPlayer === b.caster?.isPlayer) continue;

        const hit = distToSegment(p.x, p.y, b.startX, b.startY, b.targetX, b.targetY);
        const beamRadius = (b.width || 45) / 2;

        if (hit.dist <= p.radius + beamRadius) {
          const clashX = hit.nx;
          const clashY = hit.ny;

          const pMove = p.skillData || { power: 50, category: 'Special', type: p.type };
          const bMove = b.skill || b.caster?.channelingSkill || { power: 90, category: 'Special', type: b.type };

          const comp = compareClashAttacks(
            { entityA: p.sourceEntity, moveA: pMove, typeA: p.type },
            { entityB: b.caster, moveB: bMove, typeB: b.type }
          );

          arena?.triggerScreenShake?.(12);

          if (comp.isTie) {
            p.isDestroyed = true;
            projectiles.splice(i, 1);
            b.isCancelled = true;
            b.caster?.cancelBeamChanneling?.('clash_tie');

            partSys.spawnShockwave(clashX, clashY, 50, '#FFD700', 0.35);
            partSys.spawnPixelBurst(clashX, clashY, '#FFD700', 25, 200, 0.5, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'ANULAÇÃO MÚTUA!', 'electric', false);
            break;
          } else if (comp.winner === 'A') {
            // Projectile wins
            b.isCancelled = true;
            b.caster?.cancelBeamChanneling?.('clash_lost');
            p.clashWonReduced = true;

            partSys.spawnShockwave(clashX, clashY, 45, p.color || '#00E5FF', 0.3);
            partSys.spawnPixelBurst(clashX, clashY, p.color || '#00E5FF', 20, 180, 0.45, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'PROJÉTIL ATRAVESSOU O FEIXE!', 'heal', false);
            break;
          } else {
            // Beam wins
            p.isDestroyed = true;
            projectiles.splice(i, 1);
            b.clashWonReduced = true;

            partSys.spawnShockwave(clashX, clashY, 45, b.color || '#00E5FF', 0.3);
            partSys.spawnPixelBurst(clashX, clashY, b.color || '#00E5FF', 20, 180, 0.45, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'FEIXE DISSOLVEU O PROJÉTIL!', 'heal', false);
            break;
          }
        }
      }
    }
  }

  // ─── 5. Physical vs Projectile ────────────────────────────────────────────
  checkPhysicalVsProjectile(player, enemy, projSys, arena, partSys) {
    const entities = [player, enemy];
    const projectiles = projSys.projectiles;

    for (const ent of entities) {
      if (ent.state !== 'dashing_strike' || ent.isDizzy) continue;

      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!p || p.isDestroyed) continue;
        if (p.sourceEntity?.isPlayer === ent.isPlayer) continue;

        const dist = Math.hypot(ent.x - p.x, ent.y - p.y);
        if (dist <= ent.radius + p.radius + 8) {
          const clashX = p.x;
          const clashY = p.y;

          const pMove = p.skillData || { power: 50, category: 'Special', type: p.type };
          const physMove = ent.currentDashingSkill || ent.physicalAttack;

          const comp = compareClashAttacks(
            { entityA: ent, moveA: physMove, typeA: physMove.type },
            { entityB: p.sourceEntity, moveB: pMove, typeB: p.type }
          );

          arena?.triggerScreenShake?.(12);

          if (comp.isTie) {
            // Tie: Projectile destroyed, Physical dash interrupted (No tontura per Section 8)
            p.isDestroyed = true;
            projectiles.splice(i, 1);
            ent.state = 'moving';
            ent.currentDashingSkill = null;
            ent.vx = -ent.dashDirX * 120;
            ent.vy = -ent.dashDirY * 120;

            partSys.spawnShockwave(clashX, clashY, 45, '#FFD700', 0.3);
            partSys.spawnPixelBurst(clashX, clashY, '#FFD700', 22, 180, 0.45, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'CHOQUE ANULADO!', 'electric', false);
            break;
          } else if (comp.winner === 'A') {
            // Physical strike wins: destroys projectile and continues towards target!
            p.isDestroyed = true;
            projectiles.splice(i, 1);
            ent.hasClashWonReduced = true;
            if (ent.currentDashingSkill) {
              ent.currentDashingSkill.clashWonReduced = true;
            }

            const winColor = physMove.color || '#FFFFFF';
            partSys.spawnShockwave(clashX, clashY, 45, winColor, 0.3);
            partSys.spawnPixelBurst(clashX, clashY, winColor, 20, 180, 0.45, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'GOLPE DESTRUIU O PROJÉTIL!', 'heal', false);
            break;
          } else {
            // Projectile wins: consumes projectile, interrupts physical strike, applies 70% damage
            p.isDestroyed = true;
            projectiles.splice(i, 1);
            ent.state = 'moving';
            ent.currentDashingSkill = null;

            p.clashWonReduced = true;
            if (p.onHit) {
              p.onHit(ent, p);
            }

            partSys.spawnShockwave(clashX, clashY, 45, p.color || '#FF5252', 0.3);
            partSys.spawnPixelBurst(clashX, clashY, p.color || '#FF5252', 20, 180, 0.45, 4);
            partSys.addFloatingText(clashX, clashY - 10, 'PROJÉTIL INTERROMPEU O AVANÇO!', 'physical', false);
            break;
          }
        }
      }
    }
  }
}
