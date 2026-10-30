/**
 * Procedural VFX System - ELECTRIC Type (100% Canvas 2D Procedural - No Sprites)
 * High-voltage ionizing plasma visual effects for Electric moves (excluding standard beams).
 */

export const ELECTRIC_VFX_PALETTES = {
  highVolt: {
    core: '#FFFFFF',
    primary: '#FACC15',   // Yellow 400
    mid: '#EAB308',       // Yellow 500
    dark: '#CA8A04',      // Yellow 600
    cyan: '#38BDF8',      // Sky 400 (ionized plasma)
    glow: 'rgba(250, 204, 21, 0.85)',
  }
};

// Helper: Jagged fractal lightning branch
function drawFractalLightning(ctx, x1, y1, x2, y2, displace, width, color) {
  if (displace < 2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
  drawFractalLightning(ctx, x1, y1, midX, midY, displace / 2, width, color);
  drawFractalLightning(ctx, midX, midY, x2, y2, displace / 2, width, color);
}

// 1. THUNDER / THUNDER SHOCK / ZAP CANNON (Sky Downward Lightning Strike)
export function renderThunderStrikeProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = ELECTRIC_VFX_PALETTES.highVolt;

  const skyY = targetY - 240 * scale;

  if (p < 0.65) {
    // Lightning Strike Flash & Descent
    const t = p / 0.65;
    const alpha = (p < 0.20) ? (p / 0.20) : Math.sin(t * Math.PI * 3) * 0.4 + 0.6;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = alpha;

    // Outer glow bolt
    drawFractalLightning(ctx, targetX, skyY, targetX, targetY, 24 * scale, 8 * scale, pal.glow);

    // Inner yellow branch
    drawFractalLightning(ctx, targetX, skyY, targetX, targetY, 18 * scale, 4 * scale, pal.primary);

    // White core bolt
    drawFractalLightning(ctx, targetX, skyY, targetX, targetY, 12 * scale, 2 * scale, '#FFFFFF');
    ctx.restore();
  } else {
    // Ground Ionizing Discharge & Plasma Burst
    const t = (p - 0.65) / 0.35;
    const curR = 52 * scale * Math.sin(t * Math.PI * 0.5);
    const alpha = (1 - t);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Expanding plasma ring
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = Math.max(1, (1 - t) * 5 * scale);
    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath();
    ctx.ellipse(targetX, targetY + 4, curR * 1.3, curR * 0.65, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Radial electric sparks
    for (let s = 0; s < 6; s++) {
      const ang = (s / 6) * Math.PI * 2 + t * 4;
      const spLen = curR * 1.1;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(targetX + Math.cos(ang) * spLen, targetY + Math.sin(ang) * spLen * 0.6);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

// 2. VOLT TACKLE / BOLT STRIKE / WILD CHARGE (Ionized Plasma Rush)
export function renderVoltTackleProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = ELECTRIC_VFX_PALETTES.highVolt;

  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const curDist = dist * Math.min(1.0, p / 0.68);
  const curX = startX + Math.cos(angle) * curDist;
  const curY = startY + Math.sin(angle) * curDist;

  ctx.translate(curX, curY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  const r = 26 * scale;

  // Luminous plasma orb surrounding the runner
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.5);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, pal.cyan);
  grad.addColorStop(0.6, pal.primary);
  grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = grad;
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Dynamic electric arcs whipping across the perimeter
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2 * scale;
  for (let a = 0; a < 4; a++) {
    const aAng = (a / 4) * Math.PI * 2 + p * 12;
    ctx.beginPath();
    ctx.arc(0, 0, r, aAng, aAng + 0.9);
    ctx.stroke();
  }

  ctx.restore();
}

// 3. DISCHARGE & PARABOLIC CHARGE (Radial 360-degree Electric Wave)
export function renderDischargeProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = ELECTRIC_VFX_PALETTES.highVolt;

  ctx.translate(startX, startY);
  ctx.globalCompositeOperation = 'lighter';

  const maxR = 85 * scale;
  const curR = maxR * Math.sin(p * Math.PI * 0.5);
  const alpha = (1 - p);

  // Expanding shockwave circle
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = Math.max(1, (1 - p) * 6 * scale);
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, curR, 0, Math.PI * 2);
  ctx.stroke();

  // Cyan inner echo
  ctx.strokeStyle = pal.cyan;
  ctx.lineWidth = Math.max(1, (1 - p) * 3 * scale);
  ctx.beginPath();
  ctx.arc(0, 0, curR * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  // 8 Radiating lightning bolts
  for (let b = 0; b < 8; b++) {
    const bAng = (b / 8) * Math.PI * 2 + p * 3;
    const bx = Math.cos(bAng) * curR;
    const by = Math.sin(bAng) * curR;
    drawFractalLightning(ctx, 0, 0, bx, by, 12 * scale, 2 * scale, '#FFFFFF');
  }

  ctx.restore();
}

// 4. ELECTROWEB (Electrified Shock Matrix Net)
export function renderElectrowebProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = ELECTRIC_VFX_PALETTES.highVolt;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  const netR = 45 * scale * (0.6 + p * 0.4);

  // Concentric electrified web polygons
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 2 * scale;
  ctx.globalAlpha = alpha * 0.85;

  for (let ring = 1; ring <= 3; ring++) {
    const rr = (netR / 3) * ring;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const px = Math.cos(ang) * rr;
      const py = Math.sin(ang) * rr * 0.75;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Radial spokes
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang) * netR, Math.sin(ang) * netR * 0.75);
    ctx.stroke();
  }

  // Intermittent electric sparks on nodes
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = alpha;
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(ang) * (netR * 0.66), Math.sin(ang) * (netR * 0.50), 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 5. THUNDER PUNCH / THUNDER FANG / SPARK (Electric Strike Impact)
export function renderThunderPunchProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = ELECTRIC_VFX_PALETTES.highVolt;

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = (1 - p);
  const burstR = 36 * scale * p;

  // Yellow-cyan electric star burst
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = Math.max(1, (1 - p) * 4 * scale);
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, burstR, 0, Math.PI * 2);
  ctx.stroke();

  // 6 jagged shock sparks
  for (let s = 0; s < 6; s++) {
    const ang = (s / 6) * Math.PI * 2 + p * 2;
    const len = burstR * 1.3;
    drawFractalLightning(ctx, 0, 0, Math.cos(ang) * len, Math.sin(ang) * len, 8 * scale, 2.5 * scale, '#FFFFFF');
  }

  ctx.restore();
}

// =============================================================================
// MASTER DISPATCHER: ELECTRIC MOVES
// =============================================================================
export function renderElectricMoveProcedural(ctx, move, progress, startX, startY, targetX, targetY, scale = 1) {
  if (!move || move.type !== 'Electric') return false;
  const internal = (move.internalName || '').toUpperCase();

  // Preservar beams originais (Thunderbolt, Shock Wave, Charge Beam)
  if (move.executionType === 'beam' || internal === 'THUNDERBOLT' || internal === 'SHOCKWAVE' || internal === 'CHARGEBEAM') {
    return false;
  }

  switch (internal) {
    case 'THUNDER':
    case 'THUNDERSHOCK':
    case 'ZAPCANNON':
    case 'ELECTROBALL':
      renderThunderStrikeProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'VOLTTACKLE':
    case 'BOLTSTRIKE':
    case 'WILDCHARGE':
    case 'VOLTSWITCH':
    case 'SPARK':
    case 'NUZZLE':
      renderVoltTackleProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'DISCHARGE':
    case 'PARABOLICCHARGE':
    case 'ELECTRICTERRAIN':
    case 'CHARGE':
    case 'MAGNETRISE':
    case 'IONDELUGE':
    case 'ELECTRIFY':
    case 'MAGNETICFLUX':
    case 'EERIEIMPULSE':
    case 'THUNDERWAVE':
      renderDischargeProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'ELECTROWEB':
      renderElectrowebProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    case 'THUNDERPUNCH':
    case 'THUNDERFANG':
    case 'FUSIONBOLT':
      renderThunderPunchProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;

    default:
      if (move.category === 'Status' || move.executionType === 'buff') {
        renderDischargeProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      } else {
        renderThunderPunchProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      }
      return true;
  }
}
