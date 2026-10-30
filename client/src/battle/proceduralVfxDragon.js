/**
 * Procedural VFX System - DRAGON Type (100% Canvas 2D Procedural - No Sprites)
 * Mythic, luminous celestial visual effects for Dragon moves (excluding standard beams).
 */

export const DRAGON_VFX_PALETTES = {
  mythic: {
    core: '#FFFFFF',
    primary: '#4F46E5',   // Indigo 600
    mid: '#312E81',       // Indigo 900
    cyan: '#06B6D4',      // Cyan 500
    glow: 'rgba(79, 70, 229, 0.75)',
    crimson: '#E11D48',
    nebula: '#A855F7',
  },
  draco: {
    core: '#FEF08A',      // Yellow 200
    primary: '#F97316',   // Orange 500
    accent: '#DC2626',    // Red 600
    smoke: '#1E293B',
    glow: 'rgba(249, 115, 22, 0.80)',
  }
};

// 1. DRACO METEOR (Celestial Meteor Descent & Explosive Impact)
export function renderDracoMeteorProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DRAGON_VFX_PALETTES.draco;

  if (p < 0.65) {
    // 3 Descending meteors from upper atmosphere
    const t = p / 0.65;
    const startSkyX = targetX - 120 * scale;
    const startSkyY = targetY - 220 * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let m = 0; m < 3; m++) {
      const mt = Math.max(0, Math.min(1, t * 1.2 - m * 0.15));
      if (mt <= 0) continue;
      const mx = (startSkyX + m * 30 * scale) + (targetX - startSkyX) * mt;
      const my = (startSkyY + m * 20 * scale) + (targetY - startSkyY) * mt;

      // Flame tail
      const tailLen = (35 + mt * 30) * scale;
      const grad = ctx.createLinearGradient(mx, my, mx - tailLen * 0.6, my - tailLen);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, pal.primary);
      grad.addColorStop(0.7, pal.accent);
      grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = (6 + (1 - mt) * 4) * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - tailLen * 0.6, my - tailLen);
      ctx.stroke();

      // Core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(mx, my, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    // Impact Crater & Fireball Detonation
    const t = (p - 0.65) / 0.35;
    const curR = (55 * Math.sin(t * Math.PI * 0.5)) * scale;
    const alpha = (1 - t);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Expanding shock ring
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = Math.max(1, (1 - t) * 7 * scale);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(targetX, targetY + 4, curR * 1.3, curR * 0.65, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Central blast
    const bGrad = ctx.createRadialGradient(targetX, targetY - 10, 0, targetX, targetY - 10, curR);
    bGrad.addColorStop(0, '#FFFFFF');
    bGrad.addColorStop(0.35, pal.core);
    bGrad.addColorStop(0.70, pal.accent);
    bGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = bGrad;
    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath();
    ctx.arc(targetX, targetY - 10, curR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

// 2. DRAGON RUSH / DRAGON ASCENT (Great Draconic Astral Visage)
export function renderDragonRushProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DRAGON_VFX_PALETTES.mythic;

  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const curDist = dist * Math.min(1.0, p / 0.70);
  const curX = startX + Math.cos(angle) * curDist;
  const curY = startY + Math.sin(angle) * curDist;

  ctx.translate(curX, curY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  // Draconic head silhouette aura
  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha * 0.9;

  // Outer blue-indigo glow
  ctx.fillStyle = pal.primary;
  ctx.beginPath();
  ctx.moveTo(28 * scale, 0);
  ctx.lineTo(-24 * scale, -24 * scale);
  ctx.lineTo(-12 * scale, 0);
  ctx.lineTo(-24 * scale, 24 * scale);
  ctx.closePath();
  ctx.fill();

  // Inner cyan core
  ctx.fillStyle = pal.cyan;
  ctx.beginPath();
  ctx.moveTo(22 * scale, 0);
  ctx.lineTo(-16 * scale, -16 * scale);
  ctx.lineTo(-8 * scale, 0);
  ctx.lineTo(-16 * scale, 16 * scale);
  ctx.closePath();
  ctx.fill();

  // White piercing dragon eye
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(6 * scale, -8 * scale, 2.5 * scale, 0, Math.PI * 2);
  ctx.arc(6 * scale, 8 * scale, 2.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Trailing ethereal dragon scales
  for (let s = 1; s <= 4; s++) {
    const sx = -20 * scale - s * 14 * scale;
    const sw = (18 - s * 3) * scale;
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = alpha * (1 - s * 0.2);
    ctx.strokeRect(sx, -sw / 2, 8 * scale, sw);
  }

  ctx.restore();
}

// 3. SPACIAL REND & ROAR OF TIME (Cosmic Reality Tear)
export function renderSpacialRendProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DRAGON_VFX_PALETTES.mythic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const t = Math.sin(p * Math.PI);
  const slitLen = 70 * scale * t;
  const slitWidth = (12 + Math.sin(p * 20) * 4) * scale * t;

  // Vertical dimensional rupture
  const grad = ctx.createLinearGradient(-slitWidth, 0, slitWidth, 0);
  grad.addColorStop(0, 'rgba(168, 85, 247, 0)');
  grad.addColorStop(0.3, pal.nebula);
  grad.addColorStop(0.5, '#FFFFFF');
  grad.addColorStop(0.7, pal.cyan);
  grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(0, -slitLen);
  ctx.quadraticCurveTo(slitWidth, 0, 0, slitLen);
  ctx.quadraticCurveTo(-slitWidth, 0, 0, -slitLen);
  ctx.fill();

  // Cosmic shockwaves
  if (p > 0.40) {
    const st = (p - 0.40) / 0.60;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(1, (1 - st) * 3);
    ctx.globalAlpha = (1 - st) * 0.9;
    ctx.beginPath();
    ctx.ellipse(0, 0, st * 55 * scale, st * 28 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// 4. DUAL CHOP / DRAGON TAIL (Azure Dragon Claws & Tail Sweep)
export function renderDualChopProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DRAGON_VFX_PALETTES.mythic;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  // Claw 1: Blue/Cyan (0.10 to 0.55)
  if (p >= 0.10 && p <= 0.60) {
    const t = (p - 0.10) / 0.50;
    const len = 42 * scale;
    ctx.save();
    ctx.rotate(-0.4);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5 * scale;
    ctx.globalAlpha = (1 - t);
    ctx.beginPath();
    ctx.arc(0, 0, len, Math.PI * 0.8, Math.PI * 1.4);
    ctx.stroke();

    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 7 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Claw 2: Indigo/Violet (0.45 to 0.95)
  if (p >= 0.45) {
    const t = (p - 0.45) / 0.50;
    const len = 42 * scale;
    ctx.save();
    ctx.rotate(0.4);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5 * scale;
    ctx.globalAlpha = (1 - t);
    ctx.beginPath();
    ctx.arc(0, 0, len, -Math.PI * 0.4, Math.PI * 0.2);
    ctx.stroke();

    ctx.strokeStyle = pal.nebula;
    ctx.lineWidth = 7 * scale;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// 5. DRAGON DANCE / OUTRAGE (Twin Helix Dragon Buff Aura)
export function renderDragonDanceProcedural(ctx, x, y, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DRAGON_VFX_PALETTES.mythic;

  ctx.translate(x, y);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  const h = 70 * scale;

  // Twin helical ascending dragon spirits
  for (const s of [-1, 1]) {
    ctx.strokeStyle = s === 1 ? pal.cyan : pal.crimson;
    ctx.lineWidth = 3 * scale;
    ctx.globalAlpha = alpha * 0.85;
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.05) {
      const py = -t * h;
      const px = Math.sin(t * Math.PI * 4 + p * 8) * (20 * scale) * s;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.restore();
}

// =============================================================================
// MASTER DISPATCHER: DRAGON MOVES
// =============================================================================
export function renderDragonMoveProcedural(ctx, move, progress, startX, startY, targetX, targetY, scale = 1) {
  if (!move || move.type !== 'Dragon') return false;
  const internal = (move.internalName || '').toUpperCase();

  // Preservar beams originais
  if (move.executionType === 'beam' || internal === 'DRAGONPULSE' || internal === 'DRAGONBREATH') {
    return false;
  }

  switch (internal) {
    case 'DRACOMETEOR':
    case 'DRAGONRAGE':
      renderDracoMeteorProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'DRAGONRUSH':
    case 'DRAGONASCENT':
      renderDragonRushProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'SPACIALREND':
    case 'ROAROFTIME':
    case 'TWISTER':
      renderSpacialRendProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'DUALCHOP':
    case 'DRAGONTAIL':
      renderDualChopProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'DRAGONDANCE':
    case 'OUTRAGE':
      renderDragonDanceProcedural(ctx, startX, startY, progress, scale);
      return true;

    default:
      if (move.category === 'Status' || move.executionType === 'buff') {
        renderDragonDanceProcedural(ctx, startX, startY, progress, scale);
      } else {
        renderDualChopProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      }
      return true;
  }
}
