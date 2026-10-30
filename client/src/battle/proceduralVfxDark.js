/**
 * Procedural VFX System - DARK Type (100% Canvas 2D Procedural - No Sprites)
 * High-framerate, luminous abyssal visual effects for all 32 Dark moves.
 */

export const DARK_VFX_PALETTES = {
  abyss: {
    core: '#FFFFFF',
    primary: '#7E22CE',   // Purple 700
    mid: '#3B0764',       // Purple 950
    shadow: '#090514',    // Abyssal black
    glow: 'rgba(126, 34, 206, 0.70)',
    crimson: '#E11D48',   // Rose 600 accent
    accent: '#A855F7',    // Purple 500
  },
  crimsonDark: {
    core: '#FFE4E6',
    primary: '#BE123C',   // Rose 700
    mid: '#881337',       // Rose 900
    shadow: '#1C0A10',
    glow: 'rgba(190, 18, 60, 0.75)',
    accent: '#FB7185',
  },
  voidViolet: {
    core: '#F5F3FF',
    primary: '#6D28D9',   // Violet 700
    mid: '#2E1065',       // Violet 950
    shadow: '#0B0418',
    glow: 'rgba(109, 40, 217, 0.70)',
    accent: '#C084FC',
  }
};

// Helper: Sinister shadowy tendril
function drawShadowTendril(ctx, x, y, angle, length, width, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(length * 0.35, -length * 0.25, length * 0.65, length * 0.25, length, 0);
  ctx.stroke();
  ctx.restore();
}

// 1. NIGHT DAZE & DARK PULSE (Abyssal Dome Shockwave)
export function renderNightDazeProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DARK_VFX_PALETTES.abyss;

  if (p < 0.60) {
    // Phase 1: Gathering dark orb from caster to target
    const t = p / 0.60;
    const curX = startX + (targetX - startX) * t;
    const curY = startY + (targetY - startY) * t;
    const r = (14 + Math.sin(t * Math.PI * 4) * 4) * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, r * 2.2);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.35, pal.accent);
    grad.addColorStop(0.70, pal.primary);
    grad.addColorStop(1, 'rgba(59, 7, 100, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(curX, curY, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Dark core
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = pal.shadow;
    ctx.beginPath();
    ctx.arc(curX, curY, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // Phase 2: Massive Abyssal Dome Detonation
    const t = (p - 0.60) / 0.40;
    const maxR = 65 * scale;
    const curR = maxR * Math.sin(t * Math.PI * 0.5);
    const alpha = (1 - t);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Outer shock ring
    ctx.strokeStyle = pal.crimson;
    ctx.lineWidth = Math.max(1, (1 - t) * 6 * scale);
    ctx.globalAlpha = alpha * 0.85;
    ctx.beginPath();
    ctx.arc(targetX, targetY, curR * 1.15, 0, Math.PI * 2);
    ctx.stroke();

    // Expanding violet dome
    const grad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, curR);
    grad.addColorStop(0, 'rgba(255, 255, 255, ' + (alpha * 0.9) + ')');
    grad.addColorStop(0.3, 'rgba(168, 85, 247, ' + (alpha * 0.7) + ')');
    grad.addColorStop(0.65, 'rgba(59, 7, 100, ' + (alpha * 0.8) + ')');
    grad.addColorStop(1, 'rgba(9, 5, 20, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(targetX, targetY, curR, 0, Math.PI * 2);
    ctx.fill();

    // Sinister tendrils whipping out
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + t * 2;
      drawShadowTendril(ctx, targetX, targetY, ang, curR * 1.2, 3 * scale, pal.accent);
    }
    ctx.restore();
  }
  ctx.restore();
}

// 2. NIGHT SLASH / SUCKER PUNCH / FOUL PLAY (Crossed Dark Scythe Claws)
export function renderNightSlashProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DARK_VFX_PALETTES.crimsonDark;

  // Dash trail if rushing
  if (p < 0.50) {
    const t = p / 0.50;
    const curX = startX + (targetX - startX) * t;
    const curY = startY + (targetY - startY) * t;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = pal.glow;
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    ctx.restore();
  } else {
    // Impact: Cross slash of dark crimson blades
    const t = (p - 0.50) / 0.50;
    const slashLen = (48 + t * 24) * scale;
    const alpha = (1 - t);

    ctx.save();
    ctx.translate(targetX, targetY);
    ctx.globalCompositeOperation = 'lighter';

    // Slash 1 (Down-right diagonal)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5 * scale * (1 - t * 0.5);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(-slashLen * 0.6, -slashLen * 0.6);
    ctx.lineTo(slashLen * 0.6, slashLen * 0.6);
    ctx.stroke();

    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 8 * scale * (1 - t);
    ctx.globalAlpha = alpha * 0.8;
    ctx.stroke();

    // Slash 2 (Down-left diagonal)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5 * scale * (1 - t * 0.5);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(slashLen * 0.6, -slashLen * 0.6);
    ctx.lineTo(-slashLen * 0.6, slashLen * 0.6);
    ctx.stroke();

    ctx.strokeStyle = pal.mid;
    ctx.lineWidth = 8 * scale * (1 - t);
    ctx.globalAlpha = alpha * 0.8;
    ctx.stroke();

    // Central crimson burst
    ctx.fillStyle = pal.accent;
    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, 16 * scale * (1 - t), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();
}

// 3. CRUNCH / BITE (Dark Spectral Fangs)
export function renderDarkBiteProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DARK_VFX_PALETTES.voidViolet;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  // Opening (0 to 0.4), clamping snap (0.4 to 0.7), dissipate (0.7 to 1.0)
  let jawDist = 0;
  let alpha = 1.0;
  if (p < 0.40) {
    jawDist = (36 * (p / 0.40)) * scale;
    alpha = p / 0.40;
  } else if (p < 0.70) {
    const snapT = (p - 0.40) / 0.30;
    jawDist = (36 * (1 - Math.pow(snapT, 2))) * scale;
    alpha = 1.0;
  } else {
    jawDist = 0;
    alpha = (1 - (p - 0.70) / 0.30);
  }

  // Draw upper & lower sinister obsidian fangs
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(1, side);
    ctx.translate(0, -jawDist);

    ctx.fillStyle = pal.mid;
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = alpha * 0.9;

    // 3 prominent curved fangs
    for (let f = -1; f <= 1; f++) {
      const fx = f * 18 * scale;
      ctx.beginPath();
      ctx.moveTo(fx - 7 * scale, 0);
      ctx.lineTo(fx + 7 * scale, 0);
      ctx.lineTo(fx, 24 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Impact burst when jaws clamp
  if (p >= 0.65) {
    const t = (p - 0.65) / 0.35;
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = Math.max(1, (1 - t) * 4);
    ctx.globalAlpha = (1 - t) * 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, 28 * scale * t, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// 4. SNARL / ROAR (Concentric Dark Soundwave Crescents)
export function renderSnarlProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DARK_VFX_PALETTES.abyss;

  const dx = targetX - startX;
  const dy = targetY - startY;
  const angle = Math.atan2(dy, dx);
  const dist = Math.hypot(dx, dy) || 1;

  ctx.translate(startX, startY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  // Salvo of 4 expanding dark soundwave rings traveling forward
  for (let w = 0; w < 4; w++) {
    const wDelay = w * 0.15;
    if (p < wDelay) continue;
    const wp = Math.min(1.0, (p - wDelay) / 0.55);
    const waveDist = dist * wp;
    const waveR = (16 + wp * 42) * scale;
    const alpha = Math.sin(wp * Math.PI) * 0.85;

    ctx.save();
    ctx.translate(waveDist, 0);
    ctx.strokeStyle = w % 2 === 0 ? pal.crimson : pal.accent;
    ctx.lineWidth = Math.max(1, (1 - wp) * 4.5 * scale);
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.arc(0, 0, waveR, -Math.PI * 0.38, Math.PI * 0.38);
    ctx.stroke();

    // Inner shadow ripple
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(1, (1 - wp) * 2);
    ctx.globalAlpha = alpha * 0.7;
    ctx.beginPath();
    ctx.arc(0, 0, waveR * 0.7, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// 5. DARK VOID / MEMENTO / EMBARGO (Swirling Abyssal Black Hole)
export function renderDarkVoidProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DARK_VFX_PALETTES.abyss;

  ctx.translate(targetX, targetY);
  const rot = p * Math.PI * 6;
  const alpha = Math.sin(p * Math.PI);
  const maxR = 48 * scale;

  ctx.save();
  // Deep black gravity well
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#05020a';
  ctx.beginPath();
  ctx.arc(0, 0, maxR * 0.55 * alpha, 0, Math.PI * 2);
  ctx.fill();

  // Spiral luminous vortex arms
  ctx.globalCompositeOperation = 'lighter';
  for (let arm = 0; arm < 4; arm++) {
    const armAng = (arm / 4) * Math.PI * 2 + rot;
    ctx.strokeStyle = arm % 2 === 0 ? pal.accent : pal.crimson;
    ctx.lineWidth = 3.5 * scale;
    ctx.globalAlpha = alpha * 0.85;
    ctx.beginPath();
    for (let r = 8; r < maxR; r += 4) {
      const theta = armAng + (r / maxR) * Math.PI * 1.5;
      const px = Math.cos(theta) * r;
      const py = Math.sin(theta) * r * 0.70;
      if (r === 8) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

// 6. NASTY PLOT / FLATTER / HONE CLAWS (Sinister Schematic & Stat Glyphs)
export function renderDarkBuffProcedural(ctx, x, y, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = DARK_VFX_PALETTES.abyss;
  const alpha = Math.sin(p * Math.PI);

  ctx.translate(x, y);
  ctx.globalCompositeOperation = 'lighter';

  // Rising dark aura column
  const colH = 65 * scale * p;
  const colW = 26 * scale;
  const grad = ctx.createLinearGradient(0, 10, 0, -colH);
  grad.addColorStop(0, 'rgba(168, 85, 247, ' + (alpha * 0.8) + ')');
  grad.addColorStop(0.5, 'rgba(126, 34, 206, ' + (alpha * 0.6) + ')');
  grad.addColorStop(1, 'rgba(225, 29, 72, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(-colW / 2, -colH, colW, colH);

  // Twin sinister curving horns/runes rising
  ctx.strokeStyle = pal.crimson;
  ctx.lineWidth = 3 * scale;
  ctx.globalAlpha = alpha * 0.9;
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * 12 * scale, 0);
    ctx.quadraticCurveTo(dir * 26 * scale, -colH * 0.5, dir * 8 * scale, -colH * 0.95);
    ctx.stroke();
  }

  ctx.restore();
}

// =============================================================================
// MASTER DISPATCHER: DARK MOVES
// =============================================================================
export function renderDarkMoveProcedural(ctx, move, progress, startX, startY, targetX, targetY, scale = 1) {
  if (!move || move.type !== 'Dark') return false;
  const internal = (move.internalName || '').toUpperCase();

  switch (internal) {
    case 'NIGHTDAZE':
    case 'DARKPULSE':
      renderNightDazeProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'NIGHTSLASH':
    case 'SUCKERPUNCH':
    case 'FOULPLAY':
    case 'FEINTATTACK':
    case 'ASSURANCE':
    case 'PAYBACK':
    case 'PURSUIT':
    case 'THIEF':
    case 'KNOCKOFF':
    case 'PUNISHMENT':
    case 'HYPERSPACEFURY':
    case 'BEATUP':
    case 'FLING':
      renderNightSlashProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'CRUNCH':
    case 'BITE':
      renderDarkBiteProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'SNARL':
      renderSnarlProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'DARKVOID':
    case 'MEMENTO':
    case 'EMBARGO':
    case 'FAKETEARS':
    case 'TORMENT':
    case 'TAUNT':
    case 'SWITCHEROO':
    case 'QUASH':
    case 'SNATCH':
    case 'PARTINGSHOT':
    case 'TOPSYTURVY':
      renderDarkVoidProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'NASTYPLOT':
    case 'HONECLAWS':
    case 'FLATTER':
      renderDarkBuffProcedural(ctx, startX, startY, progress, scale);
      return true;

    default:
      if (move.category === 'Status' || move.executionType === 'buff') {
        renderDarkBuffProcedural(ctx, startX, startY, progress, scale);
      } else {
        renderNightSlashProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      }
      return true;
  }
}
