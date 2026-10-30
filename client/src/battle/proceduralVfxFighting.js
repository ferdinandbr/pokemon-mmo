/**
 * Procedural VFX System - FIGHTING Type (100% Canvas 2D Procedural - No Sprites)
 * High-impact martial kinetic visual effects for Fighting moves (excluding standard beams).
 */

export const FIGHTING_VFX_PALETTES = {
  kinetic: {
    core: '#FFFFFF',
    primary: '#EA580C',   // Orange 600
    mid: '#C2410C',       // Orange 700
    amber: '#F59E0B',     // Amber 500
    glow: 'rgba(234, 88, 12, 0.80)',
    spiritBlue: '#38BDF8', // Aura blue
  }
};

// 1. FOCUS PUNCH / MACH PUNCH / DYNAMIC PUNCH / HAMMER ARM (Colossal Kinetic Fist)
export function renderKineticPunchProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const t = Math.min(1.0, p / 0.65);
  const alpha = (1 - p);
  const punchR = (28 + t * 24) * scale;

  // Expanding conical impact shockwave rings
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = Math.max(1, (1 - p) * 6 * scale);
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.ellipse(0, 0, punchR * 1.2, punchR * 0.75, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Amber secondary ring
  ctx.strokeStyle = pal.amber;
  ctx.lineWidth = Math.max(1, (1 - p) * 3 * scale);
  ctx.beginPath();
  ctx.ellipse(0, 0, punchR * 0.7, punchR * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Explosive starburst spokes
  const numSpikes = 8;
  for (let s = 0; s < numSpikes; s++) {
    const ang = (s / numSpikes) * Math.PI * 2;
    const len = punchR * 1.35;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5 * scale * (1 - p);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len * 0.75);
    ctx.stroke();
  }

  // Core white flash
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = (1 - t) * 0.95;
  ctx.beginPath();
  ctx.arc(0, 0, 14 * scale * (1 - t), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 2. HIGH JUMP KICK / JUMP KICK / ROLLING KICK (Crescent Martial Cleave)
export function renderMartialKickProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  const kickLen = (48 + p * 20) * scale;

  // Sweeping dynamic arc
  ctx.save();
  ctx.rotate(-0.35 + p * 0.7);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4 * scale;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(0, 0, kickLen, Math.PI * 0.7, Math.PI * 1.3);
  ctx.stroke();

  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 9 * scale;
  ctx.globalAlpha = alpha * 0.8;
  ctx.stroke();
  ctx.restore();

  // Kinetic dust & shock burst
  if (p > 0.45) {
    const kt = (p - 0.45) / 0.55;
    ctx.strokeStyle = pal.amber;
    ctx.lineWidth = Math.max(1, (1 - kt) * 4);
    ctx.globalAlpha = (1 - kt) * 0.85;
    ctx.beginPath();
    ctx.ellipse(0, 8 * scale, kt * 36 * scale, kt * 14 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// 3. CLOSE COMBAT / SUPERPOWER / ARM THRUST (Flurry of Martial Strikes)
export function renderCloseCombatProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  // 4 Alternating rapid-fire martial impacts
  for (let h = 0; h < 4; h++) {
    const hDelay = h * 0.18;
    if (p < hDelay) continue;
    const hp = Math.min(1.0, (p - hDelay) / 0.40);
    const hAlpha = (1 - hp);
    const ox = ((h % 2 === 0 ? 1 : -1) * (14 + h * 4)) * scale;
    const oy = ((h < 2 ? -1 : 1) * (10 + h * 3)) * scale;
    const hr = (18 + hp * 22) * scale;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.strokeStyle = h % 2 === 0 ? pal.primary : pal.amber;
    ctx.lineWidth = Math.max(1, hAlpha * 4.5 * scale);
    ctx.globalAlpha = hAlpha * 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, hr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 6 * scale * hAlpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// 4. CROSS CHOP / SACRED SWORD / SECRET SWORD / SKY UPPERCUT (Martial Blade X-Slash)
export function renderCrossChopProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  const slashLen = (44 + p * 24) * scale;

  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.rotate(dir * 0.65);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5 * scale;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, -slashLen);
    ctx.lineTo(0, slashLen);
    ctx.stroke();

    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 8 * scale;
    ctx.globalAlpha = alpha * 0.8;
    ctx.stroke();
    ctx.restore();
  }

  // Central starburst
  ctx.fillStyle = pal.amber;
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, 16 * scale * (1 - p * 0.5), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 5. AURA SPHERE & FOCUS BLAST (Dense Spherical Ki Energy)
export function renderAuraSphereProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  if (p < 0.65) {
    // Ki Sphere Flight
    const t = p / 0.65;
    const curX = startX + (targetX - startX) * t;
    const curY = startY + (targetY - startY) * t;
    const r = (16 + Math.sin(t * 15) * 3) * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, r * 1.8);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.35, pal.spiritBlue);
    grad.addColorStop(0.70, pal.primary);
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(curX, curY, r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Orbital Ki Rings
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.ellipse(curX, curY, r * 1.3, r * 0.5, t * 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    // Ki Sphere Detonation
    const t = (p - 0.65) / 0.35;
    const curR = 54 * scale * Math.sin(t * Math.PI * 0.5);
    const alpha = (1 - t);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = pal.spiritBlue;
    ctx.lineWidth = Math.max(1, (1 - t) * 6 * scale);
    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath();
    ctx.arc(targetX, targetY, curR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = pal.amber;
    ctx.lineWidth = Math.max(1, (1 - t) * 3 * scale);
    ctx.beginPath();
    ctx.arc(targetX, targetY, curR * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// 6. SEISMIC TOSS / CIRCLE THROW / SUBMISSION (Seismic Crater Slam)
export function renderSeismicTossProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const t = p;
  const alpha = (1 - t);
  const craterR = (48 * Math.sin(t * Math.PI * 0.5)) * scale;

  // Expanding ground fissure rings
  ctx.strokeStyle = pal.mid;
  ctx.lineWidth = Math.max(1, (1 - t) * 6 * scale);
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.ellipse(0, 6 * scale, craterR * 1.4, craterR * 0.65, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Angular earth cracks radiating outward
  for (let c = 0; c < 6; c++) {
    const ang = (c / 6) * Math.PI * 2;
    const len = craterR * 1.25;
    ctx.strokeStyle = pal.amber;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 6 * scale);
    ctx.lineTo(Math.cos(ang) * len, 6 * scale + Math.sin(ang) * len * 0.5);
    ctx.stroke();
  }

  ctx.restore();
}

// 7. BULK UP / DETECT / QUICK GUARD / COUNTER (Martial Stance & Focus)
export function renderBulkUpProcedural(ctx, x, y, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = FIGHTING_VFX_PALETTES.kinetic;

  ctx.translate(x, y);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  const r = 32 * scale;

  // Surging hexagonal barrier / focus aura
  ctx.strokeStyle = pal.amber;
  ctx.lineWidth = 3.5 * scale;
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(ang) * r;
    const py = Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Rising muscular focus steam
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 2 * scale;
  for (let s = -1; s <= 1; s += 2) {
    ctx.beginPath();
    ctx.moveTo(s * 14 * scale, 10 * scale);
    ctx.quadraticCurveTo(s * 22 * scale, -20 * scale, s * 8 * scale, -45 * scale * p);
    ctx.stroke();
  }

  ctx.restore();
}

// =============================================================================
// MASTER DISPATCHER: FIGHTING MOVES
// =============================================================================
export function renderFightingMoveProcedural(ctx, move, progress, startX, startY, targetX, targetY, scale = 1) {
  if (!move || move.type !== 'Fighting') return false;
  const internal = (move.internalName || '').toUpperCase();

  // Preservar beams originais (Vacuum Wave)
  if (move.executionType === 'beam' || internal === 'VACUUMWAVE') {
    return false;
  }

  switch (internal) {
    case 'FOCUSPUNCH':
    case 'DYNAMICPUNCH':
    case 'HAMMERARM':
    case 'DRAINPUNCH':
    case 'MACHPUNCH':
    case 'POWERUPPUNCH':
    case 'ROCKSMASH':
    case 'KARATECHOP':
    case 'FORCEPALM':
    case 'WAKEUPSLAP':
      renderKineticPunchProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'HIGHJUMPKICK':
    case 'JUMPKICK':
    case 'ROLLINGKICK':
    case 'DOUBLEKICK':
    case 'TRIPLEKICK':
    case 'LOWKICK':
    case 'LOWSWEEP':
      renderMartialKickProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'CLOSECOMBAT':
    case 'SUPERPOWER':
    case 'ARMTHRUST':
      renderCloseCombatProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'CROSSCHOP':
    case 'SACREDSWORD':
    case 'SECRETSWORD':
    case 'SKYUPPERCUT':
    case 'BRICKBREAK':
      renderCrossChopProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'AURASPHERE':
    case 'FOCUSBLAST':
      renderAuraSphereProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'SEISMICTOSS':
    case 'CIRCLETHROW':
    case 'SUBMISSION':
    case 'VITALTHROW':
    case 'STORMTHROW':
    case 'FLYINGPRESS':
    case 'FINALGAMBIT':
    case 'REVERSAL':
    case 'REVENGE':
      renderSeismicTossProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'BULKUP':
    case 'DETECT':
    case 'QUICKGUARD':
    case 'MATBLOCK':
    case 'COUNTER':
      renderBulkUpProcedural(ctx, startX, startY, progress, scale);
      return true;

    default:
      if (move.category === 'Status' || move.executionType === 'buff') {
        renderBulkUpProcedural(ctx, startX, startY, progress, scale);
      } else {
        renderKineticPunchProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      }
      return true;
  }
}
