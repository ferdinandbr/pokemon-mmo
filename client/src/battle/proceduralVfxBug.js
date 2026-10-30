/**
 * Procedural VFX System - BUG Type (100% Canvas 2D Procedural - No Sprites)
 * Authentic, cinematic, and responsive vector visual effects for all 25 Bug moves.
 * 
 * Design Standards:
 * - Multi-layered luminous Canvas rendering (Core, Glow, Envelope, Trails, Particles).
 * - Full 3-phase lifecycle: Anticipation / Travel / Impact & Dissipation.
 * - Dynamic color palettes rooted in Bug element (Neon Lime, Emerald, Amber, Silk Silver, Toxic Purple).
 * - High-framerate 60 FPS performance without image assets.
 */

// Shared Palette Definitions for Bug Moves
export const BUG_VFX_PALETTES = {
  default: {
    core: '#FFFFFF',
    primary: '#A3E635',     // Lime 400
    mid: '#84CC16',         // Lime 500
    dark: '#4D7C0F',        // Lime 700
    glow: 'rgba(163, 230, 53, 0.65)',
    particles: '#D9F99D',   // Lime 200
  },
  swarm: {
    core: '#FEF08A',        // Yellow 200
    primary: '#F59E0B',     // Amber 500
    accent: '#D97706',      // Amber 600
    dark: '#1E293B',        // Slate 800 (Chitin black)
    glow: 'rgba(245, 158, 11, 0.65)',
    particles: '#FDE68A',
  },
  sonic: {
    core: '#FFFFFF',
    primary: '#A3E635',
    secondary: '#38BDF8',   // Light Sky Blue
    accent: '#FACC15',      // Yellow
    glow: 'rgba(163, 230, 53, 0.70)',
    wave: 'rgba(56, 189, 248, 0.55)',
  },
  silver: {
    core: '#FFFFFF',
    primary: '#E2E8F0',     // Slate 200
    mid: '#CBD5E1',         // Slate 300
    accent: '#BAE6FD',      // Light Sky Blue
    glint: '#FDF4FF',       // Soft Pearl White
    glow: 'rgba(226, 232, 240, 0.75)',
  },
  silk: {
    core: '#FFFFFF',
    thread: '#F8FAFC',
    sheen: '#A3E635',
    dark: '#64748B',
    glow: 'rgba(248, 250, 252, 0.60)',
  },
  toxic: {
    core: '#FAF5FF',
    primary: '#A855F7',     // Purple 500
    secondary: '#84CC16',   // Lime 500
    dark: '#581C87',        // Purple 900
    glow: 'rgba(168, 85, 247, 0.65)',
  },
  bioGlow: {
    core: '#FEF08A',
    primary: '#FACC15',
    mid: '#A3E635',
    glow: 'rgba(250, 204, 21, 0.85)',
    flare: '#FFFFFF',
  }
};

// =============================================================================
// 1. MEGAHORN (ID 1) - Massive Chitinous Energy Drill Charge & Shatter
// =============================================================================
export function renderMegahornProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const pal = BUG_VFX_PALETTES.default;

  // Position along the charge trajectory
  let curX = startX;
  let curY = startY;
  if (p < 0.65) {
    const t = p / 0.65;
    curX = startX + dx * t;
    curY = startY + dy * t;
  } else {
    curX = targetX;
    curY = targetY;
  }

  ctx.translate(curX, curY);
  ctx.rotate(angle);

  // 1. Charging Drill Cone (Active until impact)
  if (p < 0.78) {
    const chargeAlpha = p < 0.65 ? Math.min(1.0, p * 4.0) : Math.max(0, 1.0 - (p - 0.65) / 0.13);
    const hornLength = (54 + Math.sin(p * 35) * 4) * scale;
    const hornRadius = (16 + Math.sin(p * 25) * 2) * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = chargeAlpha;

    // Glowing energy aura cone
    const gradCone = ctx.createLinearGradient(-hornLength * 0.4, 0, hornLength * 0.9, 0);
    gradCone.addColorStop(0, 'rgba(77, 124, 15, 0.1)');
    gradCone.addColorStop(0.4, pal.glow);
    gradCone.addColorStop(0.85, pal.primary);
    gradCone.addColorStop(1.0, pal.core);

    ctx.beginPath();
    ctx.moveTo(hornLength, 0); // Horn sharp tip
    ctx.lineTo(-hornLength * 0.35, -hornRadius);
    ctx.quadraticCurveTo(0, 0, -hornLength * 0.35, hornRadius);
    ctx.closePath();
    ctx.fillStyle = gradCone;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 16 * scale;
    ctx.fill();

    // Solid inner core horn
    ctx.beginPath();
    ctx.moveTo(hornLength * 0.95, 0);
    ctx.lineTo(-hornLength * 0.25, -hornRadius * 0.55);
    ctx.lineTo(-hornLength * 0.25, hornRadius * 0.55);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Spiraling Helical Energy Rings along the horn
    const rings = 4;
    for (let i = 0; i < rings; i++) {
      const ringT = (p * 4.5 + i / rings) % 1.0;
      const rx = -hornLength * 0.3 + hornLength * 1.2 * ringT;
      const ry = hornRadius * (1.0 - ringT * 0.7);

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(rx, 0, 4 * scale, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = ringT > 0.5 ? pal.core : pal.primary;
      ctx.lineWidth = (2.5 - ringT * 1.5) * scale;
      ctx.stroke();
      ctx.restore();
    }

    // High-speed Piercing Speedlines behind horn
    const speedlines = 5;
    for (let i = 0; i < speedlines; i++) {
      const offset = (i - 2) * 5 * scale;
      const lineLen = (18 + (i % 3) * 12) * scale;
      ctx.beginPath();
      ctx.moveTo(-hornLength * 0.4, offset);
      ctx.lineTo(-hornLength * 0.4 - lineLen, offset);
      ctx.strokeStyle = 'rgba(217, 249, 157, 0.7)';
      ctx.lineWidth = 1.5 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Impact Blast & Chitin Shatter (p >= 0.60)
  if (p >= 0.60) {
    const impP = (p - 0.60) / 0.40;
    const impAlpha = Math.max(0, 1.0 - impP);
    const burstRadius = Math.sin(impP * Math.PI * 0.5) * 65 * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = impAlpha;

    // Conical pierce shockwave expanding forward
    ctx.beginPath();
    ctx.arc(0, 0, burstRadius, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = Math.max(1, (6 - impP * 5) * scale);
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 18 * scale;
    ctx.stroke();

    // Inner bright impact star
    const starSpikes = 8;
    ctx.beginPath();
    for (let i = 0; i < starSpikes * 2; i++) {
      const r = (i % 2 === 0 ? burstRadius * 0.8 : burstRadius * 0.3);
      const a = (i / (starSpikes * 2)) * Math.PI * 2;
      const sx = Math.cos(a) * r;
      const sy = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fillStyle = impP < 0.3 ? '#FFFFFF' : pal.primary;
    ctx.fill();

    // Flying Chitin Shards
    const shardCount = 10;
    for (let s = 0; s < shardCount; s++) {
      const shardAngle = ((s / shardCount) * Math.PI * 2) + s;
      const sDist = burstRadius * (0.8 + (s % 3) * 0.25);
      const sx = Math.cos(shardAngle) * sDist;
      const sy = Math.sin(shardAngle) * sDist * 0.7;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(shardAngle + impP * 8);
      ctx.beginPath();
      ctx.moveTo(0, -4 * scale);
      ctx.lineTo(3 * scale, 0);
      ctx.lineTo(0, 4 * scale);
      ctx.lineTo(-3 * scale, 0);
      ctx.closePath();
      ctx.fillStyle = s % 2 === 0 ? '#FFFFFF' : pal.primary;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 2. ATTACK ORDER (ID 2) - Swarm of Hive Wasps Tactical Dive-Bomb
// =============================================================================
export function renderAttackOrderProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.swarm;

  const beeCount = 14;

  for (let i = 0; i < beeCount; i++) {
    // Staggered launch times per bee
    const delay = (i / beeCount) * 0.35;
    if (p < delay) continue;

    const beeP = Math.min(1.0, (p - delay) / 0.55);
    const isImpacted = beeP >= 0.88;

    // Dive-bomb curve: starts high, arcs down toward target with organic wobble
    const wobble = Math.sin(beeP * 20 + i * 1.5) * 14 * (1.0 - beeP);
    const arcHeight = -Math.sin(beeP * Math.PI) * (45 + (i % 4) * 10) * scale;

    const bx = startX + (targetX - startX) * beeP;
    const by = startY + (targetY - startY) * beeP + arcHeight + wobble;

    const flightAngle = Math.atan2((targetY - by), (targetX - bx));

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(flightAngle);

    const beeAlpha = beeP < 0.1 ? beeP * 10 : (beeP > 0.85 ? Math.max(0, 1.0 - (beeP - 0.85) / 0.15) : 1.0);
    ctx.globalAlpha = beeAlpha;

    const bSize = (4.5 + (i % 3) * 1.2) * scale;

    // Glowing Neon Stinger Trail
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-bSize * 3.5, 0);
    ctx.strokeStyle = pal.glow;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Striped Bee Body (Yellow & Dark Chitin bands)
    // Abdomen
    ctx.beginPath();
    ctx.ellipse(-bSize * 0.5, 0, bSize * 1.1, bSize * 0.65, 0, 0, Math.PI * 2);
    ctx.fillStyle = pal.primary;
    ctx.fill();

    // Dark stripes
    ctx.beginPath();
    ctx.rect(-bSize * 0.9, -bSize * 0.6, bSize * 0.3, bSize * 1.2);
    ctx.rect(-bSize * 0.3, -bSize * 0.65, bSize * 0.3, bSize * 1.3);
    ctx.fillStyle = pal.dark;
    ctx.fill();

    // Stinger Tip
    ctx.beginPath();
    ctx.moveTo(-bSize * 1.5, 0);
    ctx.lineTo(-bSize * 0.8, -bSize * 0.3);
    ctx.lineTo(-bSize * 0.8, bSize * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Fluttering Wings (Rapid flutter cycle)
    const wingAngle = Math.sin(p * 60 + i * 2) * 0.8;
    ctx.save();
    ctx.globalAlpha = beeAlpha * 0.75;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
    // Left wing
    ctx.beginPath();
    ctx.ellipse(0, -bSize * 0.8, bSize * 0.9, bSize * 0.4, -0.4 + wingAngle, 0, Math.PI * 2);
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.ellipse(0, bSize * 0.8, bSize * 0.9, bSize * 0.4, 0.4 - wingAngle, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    // Impact Stings on Target
    if (isImpacted) {
      const impP = (beeP - 0.88) / 0.12;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.max(0, 1.0 - impP);
      ctx.beginPath();
      ctx.arc(targetX + (i % 3 - 1) * 8, targetY + (i % 2 - 0.5) * 12, 12 * impP * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

// =============================================================================
// 3. BUG BUZZ (ID 3) - Sinusoidal Ultrasonic Harmonic Wave Rings
// =============================================================================
export function renderBugBuzzProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.sonic;

  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  ctx.translate(startX, startY);
  ctx.rotate(angle);

  // Multiple expanding resonant sound rings
  const ringCount = 6;
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < ringCount; i++) {
    const ringT = (p * 1.6 + i / ringCount) % 1.0;
    const ringX = dist * ringT;
    const ringRadius = (16 + ringT * 42) * scale;
    const ringAlpha = Math.sin(ringT * Math.PI) * Math.min(1.0, (1.0 - p * 0.6) * 1.2);

    if (ringAlpha <= 0.01) continue;

    ctx.save();
    ctx.globalAlpha = ringAlpha;

    // Sinusoidal acoustic distortion on the ring boundary
    const points = 36;
    ctx.beginPath();
    for (let pt = 0; pt <= points; pt++) {
      const ptAngle = (pt / points) * Math.PI * 2;
      // High-frequency sonic ripple
      const waveMod = Math.sin(ptAngle * 10 + p * 30 + i * 2) * (3.5 * scale);
      const r = ringRadius + waveMod;
      const px = ringX + Math.cos(ptAngle) * (r * 0.45); // Compressed along beam vector
      const py = Math.sin(ptAngle) * r;

      if (pt === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Dual-color chromatic fringes (Lime interior, Sky Blue exterior)
    ctx.strokeStyle = i % 2 === 0 ? pal.primary : pal.secondary;
    ctx.lineWidth = (3.5 - ringT * 2.0) * scale;
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 14 * scale;
    ctx.stroke();

    // Inner resonant sonic core
    if (ringT < 0.7) {
      ctx.beginPath();
      ctx.ellipse(ringX, 0, 5 * scale, ringRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = ringAlpha * 0.65;
      ctx.fill();
    }
    ctx.restore();
  }

  // Target Sonic Detonation Disruptor (p >= 0.65)
  if (p >= 0.65) {
    const impP = (p - 0.65) / 0.35;
    const impRadius = Math.sin(impP * Math.PI * 0.5) * 58 * scale;
    ctx.save();
    ctx.translate(dist, 0);
    ctx.globalAlpha = Math.max(0, 1.0 - impP);

    // Sonic concussion bubble
    ctx.beginPath();
    ctx.arc(0, 0, impRadius, 0, Math.PI * 2);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = Math.max(1, 4 * (1.0 - impP) * scale);
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 18;
    ctx.stroke();

    // Chromatic dispersion lines
    const rays = 8;
    for (let r = 0; r < rays; r++) {
      const a = (r / rays) * Math.PI * 2 + impP * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (impRadius * 0.3), Math.sin(a) * (impRadius * 0.3));
      ctx.lineTo(Math.cos(a) * (impRadius * 1.1), Math.sin(a) * (impRadius * 1.1));
      ctx.strokeStyle = r % 2 === 0 ? '#38BDF8' : '#FACC15';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 4. X-SCISSOR (ID 4) - Dual Diagonal Crossing Scythe Claws & Starburst
// =============================================================================
export function renderXScissorProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  const midX = targetX;
  const midY = targetY;
  const slashSpan = 52 * scale;

  ctx.globalCompositeOperation = 'lighter';

  // Phase 1: Dual blades slice diagonally inwards (0.0 -> 0.60)
  if (p < 0.65) {
    const slashP = p / 0.65;
    const curSpan = slashSpan * slashP;
    const bladeAlpha = Math.min(1.0, slashP * 2.5);

    ctx.save();
    ctx.globalAlpha = bladeAlpha;
    ctx.lineWidth = (4.5 + slashP * 3.0) * scale;
    ctx.lineCap = 'round';
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 16 * scale;

    // Blade 1: Top-Left to Bottom-Right
    ctx.beginPath();
    ctx.moveTo(midX - slashSpan + curSpan * 0.3, midY - slashSpan + curSpan * 0.3);
    ctx.lineTo(midX - slashSpan + curSpan * 1.6, midY - slashSpan + curSpan * 1.6);
    ctx.strokeStyle = pal.primary;
    ctx.stroke();

    // White core line
    ctx.beginPath();
    ctx.moveTo(midX - slashSpan + curSpan * 0.4, midY - slashSpan + curSpan * 0.4);
    ctx.lineTo(midX - slashSpan + curSpan * 1.5, midY - slashSpan + curSpan * 1.5);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    // Blade 2: Bottom-Left to Top-Right
    ctx.beginPath();
    ctx.moveTo(midX - slashSpan + curSpan * 0.3, midY + slashSpan - curSpan * 0.3);
    ctx.lineTo(midX - slashSpan + curSpan * 1.6, midY + slashSpan - curSpan * 1.6);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = (4.5 + slashP * 3.0) * scale;
    ctx.stroke();

    // White core line
    ctx.beginPath();
    ctx.moveTo(midX - slashSpan + curSpan * 0.4, midY + slashSpan - curSpan * 0.4);
    ctx.lineTo(midX - slashSpan + curSpan * 1.5, midY + slashSpan - curSpan * 1.5);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    ctx.restore();
  }

  // Phase 2: Massive Intersecting "X" Flare Burst (0.60 -> 1.0)
  if (p >= 0.55) {
    const burstP = (p - 0.55) / 0.45;
    const burstAlpha = Math.max(0, 1.0 - burstP);
    const armLen = (slashSpan * 1.25 + burstP * 18) * scale;

    ctx.save();
    ctx.globalAlpha = burstAlpha;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 24 * scale;

    // The glowing "X" crossed beams
    ctx.beginPath();
    // Arm 1
    ctx.moveTo(midX - armLen, midY - armLen);
    ctx.lineTo(midX + armLen, midY + armLen);
    // Arm 2
    ctx.moveTo(midX - armLen, midY + armLen);
    ctx.lineTo(midX + armLen, midY - armLen);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = (8 - burstP * 6) * scale;
    ctx.lineCap = 'round';
    ctx.stroke();

    // White-hot inner "X"
    ctx.beginPath();
    ctx.moveTo(midX - armLen * 0.85, midY - armLen * 0.85);
    ctx.lineTo(midX + armLen * 0.85, midY + armLen * 0.85);
    ctx.moveTo(midX - armLen * 0.85, midY + armLen * 0.85);
    ctx.lineTo(midX + armLen * 0.85, midY - armLen * 0.85);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = (3.5 - burstP * 2.5) * scale;
    ctx.stroke();

    // Central diamond burst
    const dSize = (22 * (1.0 - burstP * 0.5)) * scale;
    ctx.beginPath();
    ctx.moveTo(midX, midY - dSize);
    ctx.lineTo(midX + dSize, midY);
    ctx.lineTo(midX, midY + dSize);
    ctx.lineTo(midX - dSize, midY);
    ctx.closePath();
    ctx.fillStyle = burstP < 0.3 ? '#FFFFFF' : pal.primary;
    ctx.fill();

    // Flying energy cutting sparks along X arms
    const sparkCount = 8;
    for (let s = 0; s < sparkCount; s++) {
      const sDist = armLen * (0.3 + (s / sparkCount) * 0.7);
      const signX = (s % 2 === 0 ? 1 : -1);
      const signY = (s % 4 < 2 ? 1 : -1);
      const sx = midX + signX * sDist + (Math.random() - 0.5) * 8;
      const sy = midY + signY * sDist + (Math.random() - 0.5) * 8;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 5. SIGNAL BEAM (ID 5) - Prismatic Double-Helix Chromatic Laser
// =============================================================================
export function renderSignalBeamProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  ctx.translate(startX, startY);
  ctx.rotate(angle);

  let curDist = dist;
  let alpha = 1.0;
  if (p < 0.15) {
    curDist = dist * (p / 0.15);
    alpha = p / 0.15;
  } else if (p > 0.80) {
    alpha = Math.max(0, 1.0 - (p - 0.80) / 0.20);
  }

  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'lighter';

  // 1. Central White-Hot Laser Beam
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(curDist, 0);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4 * scale;
  ctx.shadowColor = '#00E5FF';
  ctx.shadowBlur = 12 * scale;
  ctx.stroke();
  ctx.restore();

  // 2. Prismatic Double-Helix Intertwined Strands
  const steps = 40;
  const helixFrequency = 6;
  const helixAmplitude = 12 * scale;

  // Strand A: Lime / Cyan
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = curDist * t;
    const y = Math.sin(t * Math.PI * helixFrequency + p * 15) * helixAmplitude;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#22C55E';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#4ADE80';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();

  // Strand B: Magenta / Violet (Opposite Phase)
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = curDist * t;
    const y = Math.sin(t * Math.PI * helixFrequency + p * 15 + Math.PI) * helixAmplitude;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#EC4899';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#F472B6';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();

  // 3. Rotating Chromatic Photon Rings
  const ringCount = 5;
  for (let r = 0; r < ringCount; r++) {
    const rx = (curDist * ((p * 2.2 + r / ringCount) % 1.0));
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(rx, 0, 4 * scale, helixAmplitude * 1.15, 0, 0, Math.PI * 2);
    ctx.strokeStyle = r % 2 === 0 ? '#38BDF8' : '#FBBF24';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // 4. Kaleidoscope Confusion Impact at Target
  if (p >= 0.15) {
    ctx.save();
    ctx.translate(curDist, 0);
    const flareR = (18 + Math.sin(p * 40) * 6) * scale;
    const numPetals = 8;
    for (let pt = 0; pt < numPetals; pt++) {
      const pAngle = (pt / numPetals) * Math.PI * 2 + p * 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(pAngle) * flareR, Math.sin(pAngle) * flareR);
      ctx.strokeStyle = pt % 2 === 0 ? '#A3E635' : '#EC4899';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 6. U-TURN (ID 6) - Supersonic Inward Pierce & Parabolic Back-Vault Loop
// =============================================================================
export function renderUturnProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  ctx.globalCompositeOperation = 'lighter';

  // 1. Inward Pierce Dash (0.0 -> 0.55)
  if (p < 0.60) {
    const dashP = p / 0.60;
    const curX = startX + (targetX - startX) * dashP;
    const curY = startY + (targetY - startY) * dashP;

    // Aerodynamic Green Supersonic Cone
    const angle = Math.atan2(targetY - startY, targetX - startX);
    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(18 * scale, 0);
    ctx.lineTo(-24 * scale, -10 * scale);
    ctx.lineTo(-14 * scale, 0);
    ctx.lineTo(-24 * scale, 10 * scale);
    ctx.closePath();
    ctx.fillStyle = pal.primary;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 14;
    ctx.fill();

    // White needle tip
    ctx.beginPath();
    ctx.moveTo(22 * scale, 0);
    ctx.lineTo(0, -3 * scale);
    ctx.lineTo(0, 3 * scale);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  // 2. Impact Puncture Flash (0.50 -> 0.70)
  if (p >= 0.50 && p <= 0.75) {
    const impP = (p - 0.50) / 0.25;
    ctx.save();
    ctx.globalAlpha = Math.sin(impP * Math.PI);
    ctx.beginPath();
    ctx.arc(targetX, targetY, 28 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.restore();
  }

  // 3. U-turn Parabolic Loop-Back Ribbon Trail (0.55 -> 1.0)
  if (p >= 0.55) {
    const retP = (p - 0.55) / 0.45;
    const retAlpha = Math.max(0, 1.0 - retP * 0.8);

    ctx.save();
    ctx.globalAlpha = retAlpha;

    // Parabolic curving path back to origin
    const controlX = (startX + targetX) / 2;
    const controlY = Math.min(startY, targetY) - 55 * scale;

    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.quadraticCurveTo(controlX, controlY, startX, startY);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = (5 - retP * 3.5) * scale;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 16;
    ctx.stroke();

    // Inner white filament
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.quadraticCurveTo(controlX, controlY, startX, startY);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = (2 - retP * 1.5) * scale;
    ctx.stroke();

    // Looping particle dots along the retreat curve
    const dots = 6;
    for (let d = 0; d < dots; d++) {
      const dtP = (retP + d / dots) % 1.0;
      const t = dtP;
      // Quadratic Bezier interpolation
      const px = (1 - t) * (1 - t) * targetX + 2 * (1 - t) * t * controlX + t * t * startX;
      const py = (1 - t) * (1 - t) * targetY + 2 * (1 - t) * t * controlY + t * t * startY;

      ctx.beginPath();
      ctx.arc(px, py, 2.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = d % 2 === 0 ? '#FFFFFF' : pal.primary;
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 7. STEAMROLLER (ID 7) - Armored Rolling Chitin Wheel & Ground Crush
// =============================================================================
export function renderSteamrollerProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  const curX = p < 0.70 ? startX + (targetX - startX) * (p / 0.70) : targetX;
  const curY = p < 0.70 ? startY + (targetY - startY) * (p / 0.70) : targetY;

  const wheelR = 24 * scale;
  const spinAngle = p * Math.PI * 10; // Rapid forward revolutions

  // 1. Ground Dust & Friction Wake
  if (p < 0.75) {
    const dustCount = 4;
    for (let d = 0; d < dustCount; d++) {
      const dtX = curX - (15 + d * 10) * scale;
      const dtY = curY + wheelR * 0.75 + (Math.random() - 0.5) * 4;
      ctx.beginPath();
      ctx.arc(dtX, dtY, (5 + d * 3) * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(163, 230, 53, ${0.4 - d * 0.08})`;
      ctx.fill();
    }
  }

  // 2. Rolling Chitin Segmented Wheel
  ctx.save();
  ctx.translate(curX, curY);
  ctx.rotate(spinAngle);

  // Outer armored tire rim
  ctx.beginPath();
  ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
  ctx.fillStyle = '#365314'; // Dark olive chitin
  ctx.fill();
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 3.5 * scale;
  ctx.shadowColor = pal.primary;
  ctx.shadowBlur = 12;
  ctx.stroke();

  // Segmented chitin plates
  const segments = 6;
  for (let s = 0; s < segments; s++) {
    const a = (s / segments) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * wheelR, Math.sin(a) * wheelR);
    ctx.strokeStyle = '#4D7C0F';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Tread spikes
    const spikeX = Math.cos(a) * (wheelR + 4 * scale);
    const spikeY = Math.sin(a) * (wheelR + 4 * scale);
    ctx.beginPath();
    ctx.arc(spikeX, spikeY, 2.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#A3E635';
    ctx.fill();
  }

  // Inner hub
  ctx.beginPath();
  ctx.arc(0, 0, wheelR * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#1A2E05';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, wheelR * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();

  // 3. Heavy Impact Smash on Target
  if (p >= 0.70) {
    const impP = (p - 0.70) / 0.30;
    const impAlpha = Math.max(0, 1.0 - impP);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = impAlpha;
    ctx.beginPath();
    ctx.ellipse(targetX, targetY + wheelR * 0.8, 48 * impP * scale, 18 * impP * scale, 0, 0, Math.PI * 2);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = (5 - impP * 4) * scale;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 8. BUG BITE (ID 8) - Serrated Bio-Chitin Mandible Pincers Snap
// =============================================================================
export function renderBugBiteProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  ctx.translate(targetX, targetY);

  const biteSpan = 42 * scale;
  let closeOffset = 0;
  if (p < 0.45) {
    // Mandibles expand outward preparing to bite
    closeOffset = biteSpan * (1.0 + Math.sin(p / 0.45 * Math.PI * 0.5) * 0.25);
  } else if (p < 0.65) {
    // Violent snap shut!
    const snapP = (p - 0.45) / 0.20;
    closeOffset = biteSpan * Math.max(0, 1.25 - snapP * 1.35);
  } else {
    // Clamped tight and shuddering
    closeOffset = 0;
  }

  const alpha = p > 0.80 ? Math.max(0, 1.0 - (p - 0.80) / 0.20) : 1.0;
  ctx.globalAlpha = alpha;

  // Draw Left Mandible
  drawMandiblePincer(ctx, -closeOffset - 8 * scale, 0, 1, scale, pal);
  // Draw Right Mandible (Mirrored)
  drawMandiblePincer(ctx, closeOffset + 8 * scale, 0, -1, scale, pal);

  // Impact Crunch Spark & Saliva Splatter (p >= 0.58)
  if (p >= 0.58) {
    const impP = (p - 0.58) / 0.42;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0, 1.0 - impP);

    // Central bite flash
    ctx.beginPath();
    ctx.arc(0, 0, (22 - impP * 12) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 18;
    ctx.fill();

    // Crunch particle shards
    const sparks = 8;
    for (let s = 0; s < sparks; s++) {
      const sa = (s / sparks) * Math.PI * 2;
      const sr = 32 * impP * scale;
      ctx.beginPath();
      ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 2.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = s % 2 === 0 ? pal.primary : '#FFFFFF';
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

function drawMandiblePincer(ctx, x, y, dir, scale, pal) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);

  // Curved serrated mandible jaw
  ctx.beginPath();
  ctx.moveTo(-16 * scale, -22 * scale);
  ctx.bezierCurveTo(4 * scale, -24 * scale, 24 * scale, -10 * scale, 26 * scale, 0); // Sharp tip
  ctx.bezierCurveTo(20 * scale, 4 * scale, 8 * scale, 6 * scale, 0, 4 * scale);
  // Serrated teeth on inner rim
  ctx.lineTo(8 * scale, -4 * scale);
  ctx.lineTo(2 * scale, -8 * scale);
  ctx.lineTo(10 * scale, -14 * scale);
  ctx.lineTo(-4 * scale, -16 * scale);
  ctx.closePath();

  ctx.fillStyle = '#4D7C0F';
  ctx.fill();
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 2.5 * scale;
  ctx.shadowColor = pal.primary;
  ctx.shadowBlur = 10;
  ctx.stroke();

  // Ivory tip
  ctx.beginPath();
  ctx.moveTo(26 * scale, 0);
  ctx.lineTo(16 * scale, -4 * scale);
  ctx.lineTo(16 * scale, 3 * scale);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.restore();
}

// =============================================================================
// 9. SILVER WIND (ID 9) - Iridescent Silver-Pearl Diamond Slipstream
// =============================================================================
export function renderSilverWindProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const pal = BUG_VFX_PALETTES.silver;

  ctx.translate(startX, startY);
  ctx.rotate(angle);

  let curDist = dist;
  let alpha = p < 0.2 ? p / 0.2 : (p > 0.8 ? Math.max(0, 1.0 - (p - 0.8) / 0.2) : 1.0);
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'lighter';

  // 1. Flowing Volumetric Wind Ribbons (Undulating S-curves)
  const ribbons = 4;
  for (let r = 0; r < ribbons; r++) {
    const rOffset = (r - 1.5) * 12 * scale;
    const waveFreq = 3;
    const waveAmp = (10 + (r % 2) * 6) * scale;

    ctx.beginPath();
    ctx.moveTo(0, rOffset);

    const steps = 30;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = curDist * t;
      const y = rOffset + Math.sin(t * Math.PI * waveFreq + p * 12 + r) * waveAmp;
      ctx.lineTo(x, y);
    }

    const grad = ctx.createLinearGradient(0, 0, curDist, 0);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    grad.addColorStop(0.5, r % 2 === 0 ? 'rgba(226, 232, 240, 0.65)' : 'rgba(186, 230, 253, 0.65)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.8)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = (3.5 - (r % 2) * 1.5) * scale;
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 12;
    ctx.stroke();
  }

  // 2. Sparkling Shimmering Diamond Scales
  const scaleCount = 20;
  for (let sc = 0; sc < scaleCount; sc++) {
    const scT = (p * 1.8 + sc / scaleCount) % 1.0;
    const sx = curDist * scT;
    const sy = Math.sin(scT * Math.PI * 4 + sc) * (18 * scale) + (sc % 5 - 2) * 6 * scale;
    const scAlpha = Math.sin(scT * Math.PI);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(p * 20 + sc);
    ctx.globalAlpha = alpha * scAlpha;

    // Diamond glint shape
    const dR = (3.0 + (sc % 3) * 1.5) * scale;
    ctx.beginPath();
    ctx.moveTo(0, -dR);
    ctx.lineTo(dR * 0.6, 0);
    ctx.lineTo(0, dR);
    ctx.lineTo(-dR * 0.6, 0);
    ctx.closePath();
    ctx.fillStyle = sc % 3 === 0 ? '#FFFFFF' : (sc % 3 === 1 ? '#BAE6FD' : '#E2E8F0');
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  // 3. Shimmering Wind Impact Whirlwind on Target
  if (p >= 0.50) {
    const impP = (p - 0.50) / 0.50;
    ctx.save();
    ctx.translate(curDist, 0);
    ctx.globalAlpha = Math.max(0, 1.0 - impP * 0.8);

    const whirlR = (22 + impP * 24) * scale;
    ctx.beginPath();
    ctx.arc(0, 0, whirlR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 10. STRUGGLE BUG (ID 10) - Wing Shockwave Membrane Ripples
// =============================================================================
export function renderStruggleBugProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const pal = BUG_VFX_PALETTES.default;

  ctx.translate(startX, startY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  // 3 sequential fluttering wing shockwaves
  const waveCount = 3;
  for (let w = 0; w < waveCount; w++) {
    const wDelay = w * 0.22;
    if (p < wDelay) continue;

    const wP = (p - wDelay) / (1.0 - wDelay);
    const wx = dist * wP;
    const wySpan = (18 + wP * 36) * scale;
    const wAlpha = Math.sin(wP * Math.PI);

    ctx.save();
    ctx.translate(wx, 0);
    ctx.globalAlpha = wAlpha;

    // Translucent insect wing arc
    ctx.beginPath();
    ctx.moveTo(0, -wySpan);
    ctx.bezierCurveTo(14 * scale, -wySpan * 0.5, 14 * scale, wySpan * 0.5, 0, wySpan);
    ctx.bezierCurveTo(-10 * scale, wySpan * 0.4, -10 * scale, -wySpan * 0.4, 0, -wySpan);
    ctx.closePath();

    ctx.fillStyle = 'rgba(163, 230, 53, 0.22)';
    ctx.fill();
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = (3.0 - wP * 1.5) * scale;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Wing delicate vein lines
    ctx.beginPath();
    ctx.moveTo(-4 * scale, 0);
    ctx.lineTo(8 * scale, -wySpan * 0.6);
    ctx.moveTo(-4 * scale, 0);
    ctx.lineTo(8 * scale, wySpan * 0.6);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 11. TWINEEDLE (ID 11) - Dual Poison-Tipped High-Velocity Needle Darts
// =============================================================================
export function renderTwineedleProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.toxic;

  // Staggered dual needles: Needle 1 (0.0 -> 0.55), Needle 2 (0.35 -> 0.90)
  renderSingleNeedle(ctx, startX, startY - 6 * scale, targetX, targetY - 6 * scale, p, 0.0, 0.55, scale, pal);
  renderSingleNeedle(ctx, startX, startY + 6 * scale, targetX, targetY + 6 * scale, p, 0.35, 0.90, scale, pal);

  ctx.restore();
}

function renderSingleNeedle(ctx, sx, sy, tx, ty, p, startT, endT, scale, pal) {
  if (p < startT || p > endT + 0.1) return;

  const needleP = Math.min(1.0, (p - startT) / (endT - startT));
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const curDist = dist * Math.min(1.0, needleP * 1.2);

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  // Needle Flight
  if (needleP < 0.9) {
    const nx = curDist;
    const nLen = 28 * scale;
    ctx.beginPath();
    ctx.moveTo(nx, 0); // Tip
    ctx.lineTo(nx - nLen, -2.5 * scale);
    ctx.lineTo(nx - nLen * 0.8, 0);
    ctx.lineTo(nx - nLen, 2.5 * scale);
    ctx.closePath();
    ctx.fillStyle = pal.primary;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 10;
    ctx.fill();

    // Glowing Venom Point
    ctx.beginPath();
    ctx.arc(nx, 0, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }

  // Puncture impact on target
  if (needleP >= 0.8) {
    const impP = (needleP - 0.8) / 0.2;
    ctx.save();
    ctx.translate(dist, 0);
    ctx.globalAlpha = Math.max(0, 1.0 - impP);
    ctx.beginPath();
    ctx.arc(0, 0, 18 * impP * scale, 0, Math.PI * 2);
    ctx.fillStyle = pal.primary;
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 12. FURY CUTTER (ID 12) - Ramping Crescent Energy Blade Slashes
// =============================================================================
export function renderFuryCutterProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  // 3 sweeping consecutive slashes that grow in radius and intensity
  const slashes = [
    { start: 0.05, end: 0.40, angle: -0.6, radius: 32 },
    { start: 0.35, end: 0.70, angle: 0.6, radius: 42 },
    { start: 0.65, end: 1.00, angle: -0.2, radius: 56 }
  ];

  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  for (const s of slashes) {
    if (p < s.start || p > s.end) continue;
    const sP = (p - s.start) / (s.end - s.start);
    const alpha = Math.sin(sP * Math.PI);

    ctx.save();
    ctx.rotate(s.angle);
    ctx.globalAlpha = alpha;

    const sweepStart = -Math.PI * 0.75 + sP * Math.PI * 0.4;
    const sweepEnd = sweepStart + Math.PI * 0.8;
    const r = s.radius * scale;

    // Glowing Crescent Blade Arc
    ctx.beginPath();
    ctx.arc(0, 0, r, sweepStart, sweepEnd);
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = (5 - sP * 3) * scale;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 16 * scale;
    ctx.stroke();

    // White Razor Edge
    ctx.beginPath();
    ctx.arc(0, 0, r, sweepStart + 0.15, sweepEnd - 0.15);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 13. LEECH LIFE (ID 13) - Mandible Clamp & Siphoning Soul-Drain Filaments
// =============================================================================
export function renderLeechLifeProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  // 1. Initial Mandible Clamp on Target (0.0 -> 0.40)
  if (p < 0.45) {
    renderBugBiteProcedural(ctx, startX, startY, targetX, targetY, p / 0.45, scale * 0.9);
  }

  // 2. Siphoning Green-Cyan Energy Streams from Target back to User (0.35 -> 1.0)
  if (p >= 0.35) {
    const drainP = (p - 0.35) / 0.65;
    const dx = startX - targetX;
    const dy = startY - targetY;
    const dist = Math.hypot(dx, dy) || 1;

    ctx.globalCompositeOperation = 'lighter';
    const orbs = 6;
    for (let o = 0; o < orbs; o++) {
      const orbT = (drainP * 1.8 + o / orbs) % 1.0;
      // Curved drain path
      const arc = Math.sin(orbT * Math.PI) * (24 + (o % 3) * 8) * (o % 2 === 0 ? 1 : -1) * scale;
      const ox = targetX + dx * orbT;
      const oy = targetY + dy * orbT + arc;

      ctx.save();
      ctx.globalAlpha = Math.sin(orbT * Math.PI) * 0.9;
      ctx.beginPath();
      ctx.arc(ox, oy, (4 + (o % 2) * 2) * scale, 0, Math.PI * 2);
      ctx.fillStyle = o % 2 === 0 ? '#69F0AE' : '#A3E635';
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 12;
      ctx.fill();

      // White inner core
      ctx.beginPath();
      ctx.arc(ox, oy, 1.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();
    }

    // Healing Aura Glow on User (p >= 0.65)
    if (p >= 0.65) {
      const healP = (p - 0.65) / 0.35;
      ctx.save();
      ctx.globalAlpha = Math.sin(healP * Math.PI) * 0.7;
      ctx.beginPath();
      ctx.arc(startX, startY, (24 + healP * 12) * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(105, 240, 174, 0.35)';
      ctx.shadowColor = '#69F0AE';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

// =============================================================================
// 14. PIN MISSILE (ID 14) - Salvo of 5 Chitin Dart Spines in Ballistic Arcs
// =============================================================================
export function renderPinMissileProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.default;

  const pinCount = 5;
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < pinCount; i++) {
    const delay = (i / pinCount) * 0.38;
    if (p < delay) continue;

    const pinP = Math.min(1.0, (p - delay) / 0.52);
    const arcHeight = -Math.sin(pinP * Math.PI) * (28 + (i - 2) * 12) * scale;

    const px = startX + (targetX - startX) * pinP;
    const py = startY + (targetY - startY) * pinP + arcHeight;

    const angle = Math.atan2((targetY - py), (targetX - px));

    // Missile Dart
    if (pinP < 0.92) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      const pinLen = 22 * scale;

      // Glow trail
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-pinLen * 1.5, 0);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      // Sharp chitin needle
      ctx.beginPath();
      ctx.moveTo(pinLen * 0.5, 0);
      ctx.lineTo(-pinLen * 0.5, -2.5 * scale);
      ctx.lineTo(-pinLen * 0.3, 0);
      ctx.lineTo(-pinLen * 0.5, 2.5 * scale);
      ctx.closePath();
      ctx.fillStyle = pal.primary;
      ctx.shadowColor = pal.primary;
      ctx.shadowBlur = 10;
      ctx.fill();

      // White tip
      ctx.beginPath();
      ctx.arc(pinLen * 0.5, 0, 2 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();
    } else {
      // Impact burst
      const impP = (pinP - 0.92) / 0.08;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1.0 - impP);
      ctx.beginPath();
      ctx.arc(targetX + (i % 3 - 1) * 8, targetY + (i % 2 - 0.5) * 8, 14 * impP * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#A3E635';
      ctx.shadowColor = '#D9F99D';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

// =============================================================================
// 15. DEFEND ORDER (ID 15) - Hexagonal Honeycomb Living Shield Lattice
// =============================================================================
export function renderDefendOrderProcedural(ctx, startX, startY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.swarm;

  ctx.translate(startX, startY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  const hexRadius = 14 * scale;
  const hexGrid = [
    { q: 0, r: 0 },
    { q: 1, r: -1 }, { q: 1, r: 0 }, { q: 0, r: 1 },
    { q: -1, r: 1 }, { q: -1, r: 0 }, { q: 0, r: -1 }
  ];

  // Draw expanding honeycomb lattice
  for (const h of hexGrid) {
    const hx = (h.q * Math.sqrt(3) + h.r * (Math.sqrt(3) / 2)) * (hexRadius * 1.15);
    const hy = (h.r * 1.5) * (hexRadius * 1.15);

    ctx.save();
    ctx.translate(hx, hy);
    drawHexagon(ctx, hexRadius * (0.8 + Math.sin(p * Math.PI) * 0.2));
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.fill();
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 2.5 * scale;
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.restore();
  }

  // Orbiting guardian bees
  const bees = 4;
  for (let b = 0; b < bees; b++) {
    const bAngle = p * Math.PI * 4 + (b / bees) * Math.PI * 2;
    const bDist = (36 + Math.sin(p * 20) * 4) * scale;
    const bx = Math.cos(bAngle) * bDist;
    const by = Math.sin(bAngle) * bDist * 0.65;

    ctx.beginPath();
    ctx.arc(bx, by, 3.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  ctx.restore();
}

function drawHexagon(ctx, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// =============================================================================
// 16. HEAL ORDER (ID 16) - Royal Jelly Golden Cascading Nectar
// =============================================================================
export function renderHealOrderProcedural(ctx, startX, startY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.swarm;

  ctx.translate(startX, startY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  // Honey pool at base
  ctx.beginPath();
  ctx.ellipse(0, 16 * scale, 34 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.shadowColor = '#FBBF24';
  ctx.shadowBlur = 18;
  ctx.fill();

  // Falling droplets of royal nectar
  const drops = 8;
  for (let d = 0; d < drops; d++) {
    const dt = (p * 1.8 + d / drops) % 1.0;
    const dx = (d % 5 - 2) * 8 * scale;
    const dy = -45 * scale + dt * 60 * scale;

    ctx.beginPath();
    ctx.ellipse(dx, dy, 3 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  // Ascending golden restorative rings
  ctx.beginPath();
  ctx.ellipse(0, -p * 35 * scale, 24 * scale * (1.0 - p * 0.4), 8 * scale, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  ctx.restore();
}

// =============================================================================
// 17. QUIVER DANCE (ID 17) - Gossamer Butterfly Wings & Triple Stat Helix
// =============================================================================
export function renderQuiverDanceProcedural(ctx, startX, startY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  ctx.translate(startX, startY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  // Fluttering Gossamer Wings behind the Pokémon
  const wingFlutter = Math.sin(p * 35) * 0.35;
  const wingR = 48 * scale;

  ctx.save();
  ctx.shadowColor = '#A3E635';
  ctx.shadowBlur = 20;

  // Left wing
  ctx.beginPath();
  ctx.ellipse(-24 * scale, -10 * scale, wingR * 0.65, wingR * 0.45, -0.6 + wingFlutter, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(163, 230, 53, 0.35)';
  ctx.fill();
  ctx.strokeStyle = '#D9F99D';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.ellipse(24 * scale, -10 * scale, wingR * 0.65, wingR * 0.45, 0.6 - wingFlutter, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(163, 230, 53, 0.35)';
  ctx.fill();
  ctx.strokeStyle = '#D9F99D';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Triple Ascending Helix Ribbons (Lime = SpAtk, Cyan = SpDef, Amber = Speed)
  const statsColors = ['#A3E635', '#38BDF8', '#F59E0B'];
  for (let s = 0; s < 3; s++) {
    ctx.beginPath();
    for (let step = 0; step < 20; step++) {
      const t = step / 20;
      const hx = Math.sin(t * Math.PI * 4 + p * 10 + s * 2.1) * (18 * scale);
      const hy = 20 * scale - t * (60 * scale);
      if (step === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.strokeStyle = statsColors[s];
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
  }

  // Sparkling phosphor dust
  const dustCount = 12;
  for (let d = 0; d < dustCount; d++) {
    const da = (d / dustCount) * Math.PI * 2 + p * 8;
    const dr = (22 + (d % 3) * 10) * scale;
    ctx.beginPath();
    ctx.arc(Math.cos(da) * dr, Math.sin(da) * (dr * 0.6) - 15 * scale, 2.0 * scale, 0, Math.PI * 2);
    ctx.fillStyle = d % 2 === 0 ? '#FFFFFF' : '#A3E635';
    ctx.fill();
  }

  ctx.restore();
}

// =============================================================================
// 18. RAGE POWDER (ID 18) - Billowing Irritating Ruby-Amber Spore Cloud
// =============================================================================
export function renderRagePowderProcedural(ctx, startX, startY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  ctx.translate(startX, startY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  const cloudR = (28 + p * 32) * scale;
  const spores = 18;

  for (let s = 0; s < spores; s++) {
    const sa = (s / spores) * Math.PI * 2 + p * 4;
    const sr = (cloudR * (0.4 + (s % 4) * 0.2));
    const sx = Math.cos(sa) * sr;
    const sy = Math.sin(sa) * sr * 0.7;

    ctx.beginPath();
    ctx.arc(sx, sy, (4.5 + (s % 3) * 2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = s % 2 === 0 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.45)';
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  ctx.restore();
}

// =============================================================================
// 19. SPIDER WEB (ID 19) - Expanding Geometric Silk Cobweb Net
// =============================================================================
export function renderSpiderWebProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  ctx.translate(targetX, targetY);

  const pal = BUG_VFX_PALETTES.silk;
  const alpha = p < 0.6 ? p / 0.6 : Math.max(0, 1.0 - (p - 0.6) / 0.4);
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'lighter';

  const maxR = (38 * Math.min(1.0, p * 2.0)) * scale;
  const spokes = 8;
  const rings = 4;

  // Radial Spokes
  ctx.beginPath();
  for (let s = 0; s < spokes; s++) {
    const a = (s / spokes) * Math.PI * 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * maxR, Math.sin(a) * maxR);
  }
  ctx.strokeStyle = pal.thread;
  ctx.lineWidth = 1.8 * scale;
  ctx.shadowColor = '#A3E635';
  ctx.shadowBlur = 10;
  ctx.stroke();

  // Concentric Silk Polygons
  for (let r = 1; r <= rings; r++) {
    const ringR = (maxR * (r / rings));
    ctx.beginPath();
    for (let s = 0; s <= spokes; s++) {
      const a = (s / spokes) * Math.PI * 2;
      // Sag between spokes for realistic web tension
      const x = Math.cos(a) * ringR;
      const y = Math.sin(a) * ringR;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = r % 2 === 0 ? pal.thread : 'rgba(163, 230, 53, 0.75)';
    ctx.lineWidth = 1.4 * scale;
    ctx.stroke();
  }

  ctx.restore();
}

// =============================================================================
// 20. STRING SHOT (ID 20) - Braided Elastic Silk Cords Wrapping Target
// =============================================================================
export function renderStringShotProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.silk;

  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;

  ctx.globalCompositeOperation = 'lighter';

  // 1. Projectile Silk Streams (0.0 -> 0.65)
  if (p < 0.70) {
    const streamP = p / 0.70;
    const curX = startX + dx * streamP;
    const curY = startY + dy * streamP;

    const cords = 3;
    for (let c = 0; c < cords; c++) {
      const cOffset = (c - 1) * 6 * scale;
      ctx.beginPath();
      ctx.moveTo(startX, startY + cOffset);
      const midX = (startX + curX) / 2;
      const midY = (startY + curY) / 2 + Math.sin(streamP * 12 + c) * 12 * scale;
      ctx.quadraticCurveTo(midX, midY, curX, curY + cOffset);
      ctx.strokeStyle = pal.thread;
      ctx.lineWidth = 2.5 * scale;
      ctx.shadowColor = pal.sheen;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
  }

  // 2. Silk Wrapping & Binding Target (0.60 -> 1.0)
  if (p >= 0.60) {
    const wrapP = (p - 0.60) / 0.40;
    const wrapAlpha = Math.max(0, 1.0 - wrapP * 0.7);

    ctx.save();
    ctx.translate(targetX, targetY);
    ctx.globalAlpha = wrapAlpha;

    // Tightening spiral cocoon loops
    const loops = 5;
    for (let l = 0; l < loops; l++) {
      const ly = (l - 2) * 8 * scale;
      const lr = (22 - wrapP * 6) * scale;
      ctx.beginPath();
      ctx.ellipse(0, ly, lr, lr * 0.4, -0.2, 0, Math.PI * 2);
      ctx.strokeStyle = pal.thread;
      ctx.lineWidth = 2.5 * scale;
      ctx.shadowColor = pal.sheen;
      ctx.shadowBlur = 12;
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 21. TAIL GLOW (ID 21) - Bioluminescent Solar Flare Core Pulse
// =============================================================================
export function renderTailGlowProcedural(ctx, startX, startY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = BUG_VFX_PALETTES.bioGlow;

  ctx.translate(startX, startY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  // Expanding Solar Flash Core
  const coreR = (16 + Math.sin(p * Math.PI) * 26) * scale;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.35, pal.primary);
  grad.addColorStop(0.75, pal.mid);
  grad.addColorStop(1.0, 'transparent');

  ctx.beginPath();
  ctx.arc(0, 0, coreR, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.shadowColor = pal.glow;
  ctx.shadowBlur = 24 * scale;
  ctx.fill();

  // Expanding Shockwave Light Ring
  ctx.beginPath();
  ctx.arc(0, 0, (coreR * 1.4 + p * 20), 0, Math.PI * 2);
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = Math.max(1, (4 - p * 3) * scale);
  ctx.stroke();

  // Floating Firefly Orbs
  const fireflies = 8;
  for (let f = 0; f < fireflies; f++) {
    const fa = (f / fireflies) * Math.PI * 2 + p * 6;
    const fr = (coreR * 1.1 + (f % 3) * 10) * scale;
    ctx.beginPath();
    ctx.arc(Math.cos(fa) * fr, Math.sin(fa) * fr, 2.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }

  ctx.restore();
}

// =============================================================================
// 22. STICKY WEB (ID 22) - Ground-Spreading Viscous Silk Hazard
// =============================================================================
export function renderStickyWebProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  ctx.translate(targetX, targetY + 12 * scale); // On ground plane
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  const maxR = 48 * Math.min(1.0, p * 2.2) * scale;

  // Expanding Ground Web Mesh (Elliptical for 2.5D perspective)
  ctx.beginPath();
  ctx.ellipse(0, 0, maxR, maxR * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(163, 230, 53, 0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = '#A3E635';
  ctx.shadowBlur = 12;
  ctx.stroke();

  // Web spokes on floor
  const spokes = 8;
  for (let s = 0; s < spokes; s++) {
    const a = (s / spokes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * maxR, Math.sin(a) * (maxR * 0.45));
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.65)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // Sticky dew drops
  const dews = 6;
  for (let d = 0; d < dews; d++) {
    const da = (d / dews) * Math.PI * 2 + 0.3;
    const dr = maxR * 0.65;
    ctx.beginPath();
    ctx.arc(Math.cos(da) * dr, Math.sin(da) * (dr * 0.45), 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#D9F99D';
    ctx.fill();
  }

  ctx.restore();
}

// =============================================================================
// 23. FELL STINGER (ID 565) - Hyper-Velocity Armor-Piercing Stinger Lance
// =============================================================================
export function renderFellStingerProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const pal = BUG_VFX_PALETTES.toxic;

  ctx.translate(startX, startY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  // 1. Lance Thrust (0.0 -> 0.65)
  if (p < 0.70) {
    const thrustP = p / 0.70;
    const curX = dist * Math.pow(thrustP, 0.4);
    const lanceLen = 42 * scale;

    ctx.save();
    ctx.translate(curX, 0);

    // Glowing venom drill stinger
    ctx.beginPath();
    ctx.moveTo(18 * scale, 0);
    ctx.lineTo(-lanceLen, -4 * scale);
    ctx.lineTo(-lanceLen * 0.7, 0);
    ctx.lineTo(-lanceLen, 4 * scale);
    ctx.closePath();
    ctx.fillStyle = pal.primary;
    ctx.shadowColor = pal.primary;
    ctx.shadowBlur = 16;
    ctx.fill();

    // Supersonic shock rings along shaft
    ctx.beginPath();
    ctx.ellipse(-lanceLen * 0.4, 0, 3 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // 2. Fatal Detonation Pierce on Target (0.65 -> 1.0)
  if (p >= 0.65) {
    const impP = (p - 0.65) / 0.35;
    ctx.save();
    ctx.translate(dist, 0);
    ctx.globalAlpha = Math.max(0, 1.0 - impP);

    // Expanding execution burst
    ctx.beginPath();
    ctx.arc(0, 0, 38 * impP * scale, 0, Math.PI * 2);
    ctx.fillStyle = pal.primary;
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 22;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 18 * impP * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// 24. POWDER (ID 600) - Explosive Reactive Volatile Spore Shimmer
// =============================================================================
export function renderPowderProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  ctx.translate(targetX, targetY);
  ctx.globalCompositeOperation = 'lighter';

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  const cloudR = (22 + Math.sin(p * 20) * 4) * scale;
  const spores = 16;

  for (let s = 0; s < spores; s++) {
    const sa = (s / spores) * Math.PI * 2 + p * 3;
    const sr = cloudR * (0.5 + (s % 3) * 0.25);
    const sx = Math.cos(sa) * sr;
    const sy = Math.sin(sa) * sr * 0.75;

    ctx.beginPath();
    ctx.arc(sx, sy, 2.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = s % 2 === 0 ? '#FBBF24' : '#F43F5E';
    ctx.shadowColor = '#F43F5E';
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  ctx.restore();
}

// =============================================================================
// 25. INFESTATION (ID 611) - Toroidal Swarm Cloud of Biting Insects
// =============================================================================
export function renderInfestationProcedural(ctx, startX, startY, targetX, targetY, progress, scale = 1) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  ctx.translate(targetX, targetY);

  const alpha = Math.sin(p * Math.PI);
  ctx.globalAlpha = alpha;

  const insectCount = 22;
  const torusR = 32 * scale;

  for (let i = 0; i < insectCount; i++) {
    const orbitAngle = p * Math.PI * 6 + (i / insectCount) * Math.PI * 2;
    const zOffset = Math.sin(p * 15 + i * 1.5) * 14 * scale;
    const ix = Math.cos(orbitAngle) * torusR;
    const iy = Math.sin(orbitAngle) * (torusR * 0.5) + zOffset;

    ctx.save();
    ctx.translate(ix, iy);
    ctx.beginPath();
    ctx.arc(0, 0, (2.2 + (i % 2) * 1.0) * scale, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0 ? '#A3E635' : (i % 3 === 1 ? '#F59E0B' : '#1E293B');
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 6;
    ctx.fill();

    // Biting micro-flash
    if (Math.random() < 0.15) {
      ctx.beginPath();
      ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

// =============================================================================
// MASTER BUG PROCEDURAL VFX DISPATCHER
// =============================================================================
/**
 * Dispatches and renders any Bug move purely procedurally.
 * Returns true if the move was successfully handled as a Bug procedural VFX.
 */
export function renderBugMoveProcedural(ctx, move, progress, startX, startY, targetX, targetY, scale = 1) {
  if (!move) return false;
  const id = Number(move.id);
  const name = (move.internalName || move.name || '').toUpperCase().replace(/[^A-Z]/g, '');

  switch (name) {
    case 'MEGAHORN':
      renderMegahornProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'ATTACKORDER':
      renderAttackOrderProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'BUGBUZZ':
      renderBugBuzzProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'XSCISSOR':
      renderXScissorProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'SIGNALBEAM':
      // Mantido no motor de beams original (vfx/magic/signal_beam.png) conforme solicitado
      return false;
    case 'UTURN':
      renderUturnProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'STEAMROLLER':
      renderSteamrollerProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'BUGBITE':
      renderBugBiteProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'SILVERWIND':
      renderSilverWindProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'STRUGGLEBUG':
      renderStruggleBugProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'TWINEEDLE':
      renderTwineedleProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'FURYCUTTER':
      renderFuryCutterProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'LEECHLIFE':
      renderLeechLifeProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'PINMISSILE':
      renderPinMissileProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'DEFENDORDER':
      renderDefendOrderProcedural(ctx, startX, startY, progress, scale);
      return true;
    case 'HEALORDER':
      renderHealOrderProcedural(ctx, startX, startY, progress, scale);
      return true;
    case 'QUIVERDANCE':
      renderQuiverDanceProcedural(ctx, startX, startY, progress, scale);
      return true;
    case 'RAGEPOWDER':
      renderRagePowderProcedural(ctx, startX, startY, progress, scale);
      return true;
    case 'SPIDERWEB':
      renderSpiderWebProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'STRINGSHOT':
      renderStringShotProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'TAILGLOW':
      renderTailGlowProcedural(ctx, startX, startY, progress, scale);
      return true;
    case 'STICKYWEB':
      renderStickyWebProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'FELLSTINGER':
      renderFellStingerProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'POWDER':
      renderPowderProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    case 'INFESTATION':
      renderInfestationProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
      return true;
    default:
      if (move.type === 'Bug') {
        // Fallback procedural Bug strike (beams mantidos no motor original, exceto Bug Buzz/Silver Wind)
        if (move.executionType === 'beam') {
          return false;
        } else if (move.executionType === 'projectile') {
          renderPinMissileProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
        } else if (move.executionType === 'buff') {
          renderDefendOrderProcedural(ctx, startX, startY, progress, scale);
        } else {
          renderXScissorProcedural(ctx, startX, startY, targetX, targetY, progress, scale);
        }
        return true;
      }
      return false;
  }
}

