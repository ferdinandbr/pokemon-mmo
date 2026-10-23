const fs = require('fs');

const code = `
// ============================================================================
// AUTHENTIC ELECTRIC COMBAT RENDERERS (BOLT STRIKE, THUNDER, FUSION BOLT, ETC.)
// ============================================================================

/**
 * 1. Electric Charge Aura (Pulsing crackling electricity enveloping caster)
 */
export function renderElectricChargeCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null, isBlue = false) {
  const alpha = Math.sin(Math.min(1, p) * Math.PI);
  if (alpha <= 0.01) return;

  ctx.save();
  const color = isBlue ? '#38BDF8' : '#FACC15';

  // Ground glowing ellipse
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.0;
  ctx.globalAlpha = alpha * 0.75;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 6, 26, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.globalAlpha = alpha * 0.25;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 6, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Draw animated spritesheet aura
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 6;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    const frame = Math.min(cols - 1, Math.floor(p * cols));
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.1) * 1.35;
    const dw = fw * scale;
    const dh = fh * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1.0, alpha * 1.1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2, targetY - dh / 2 - 8, dw, dh);
    ctx.restore();
  }

  // Radiating sparks
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const sparks = 5;
  for (let s = 0; s < sparks; s++) {
    const ang = (s / sparks) * Math.PI * 2 + p * 4;
    const dist = 18 + Math.sin(p * 8 + s) * 10;
    const sx = targetX + Math.cos(ang) * dist;
    const sy = targetY - 8 + Math.sin(ang) * (dist * 0.65);
    ctx.fillStyle = s % 2 === 0 ? '#FFFFFF' : color;
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
  }
  ctx.restore();

  ctx.restore();
}

/**
 * 2. Electric Bolt Impact (Vertical Lightning Strike + Ground Shockwave)
 */
export function renderElectricBoltImpactCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null, isBlue = false) {
  const prog = Math.max(0, Math.min(1, p));
  ctx.save();

  const color = isBlue ? '#38BDF8' : '#FACC15';

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 6;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    const frame = Math.min(cols - 1, Math.floor(prog * cols));
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.25) * 1.3;
    const dw = fw * scale;
    const dh = fh * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0.1, 1.0 - prog * 0.5);
    ctx.imageSmoothingEnabled = false;
    // Align base of lightning to ground at targetY + 6
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2, targetY + 6 - dh + 20, dw, dh);
    ctx.restore();
  }

  // Ground radial lightning flash on impact (p >= 0.20)
  if (prog >= 0.20) {
    const blastP = (prog - 0.20) / 0.80;
    const blastR = 16 + blastP * 42;
    const alpha = (1 - blastP) * 0.8;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, (1 - blastP) * 3);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(targetX, targetY + 6, blastR, blastR * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = (1 - blastP) * 0.6;
    ctx.beginPath();
    ctx.ellipse(targetX, targetY + 6, blastR * 0.5, blastR * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 3. Electrocuted Burst on Target
 */
export function renderElectrocutedCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null) {
  const prog = Math.max(0, Math.min(1, p));
  const alpha = 1.0 - prog * 0.4;

  ctx.save();

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 6;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    // Rapid cycling for intense electrocution
    const frame = Math.floor(prog * cols * 2) % cols;
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.1) * 1.25;
    const dw = fw * scale;
    const dh = fh * scale;

    // Small jitter to simulate violent shock
    const jx = (Math.random() - 0.5) * 4;
    const jy = (Math.random() - 0.5) * 4;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0.1, alpha);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2 + jx, targetY - dh / 2 - 12 + jy, dw, dh);
    ctx.restore();
  }

  // Radiating yellow/white mini-arcs
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let s = 0; s < 4; s++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 16;
    ctx.fillStyle = Math.random() < 0.5 ? '#FFFFFF' : '#FACC15';
    ctx.globalAlpha = alpha;
    ctx.fillRect(Math.round(targetX + Math.cos(ang) * dist), Math.round(targetY - 12 + Math.sin(ang) * dist), 2, 2);
  }
  ctx.restore();

  ctx.restore();
}

/**
 * 4. Parabolic Charge (Expanding ground electric shockwave rings - Image 4)
 */
export function renderParabolicRingsCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null) {
  const prog = Math.max(0, Math.min(1, p));
  ctx.save();

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 6;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    const frame = Math.min(cols - 1, Math.floor(prog * cols));
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.45) * 1.35;
    const dw = fw * scale;
    const dh = fh * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0.1, 1.0 - prog * 0.7);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2, targetY - dh / 2 + 10, dw, dh);
    ctx.restore();
  }

  // Concentric expanding ground rings (procedural enhancement for Image 4 glow)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const ringR = prog * 64;
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = Math.max(1, (1 - prog) * 3);
  ctx.globalAlpha = (1 - prog) * 0.75;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 8, ringR, ringR * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 8, ringR * 0.75, ringR * 0.75 * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/**
 * 5. Thunder Wave (Pulsing wave travelling toward target)
 */
export function renderElectricWaveCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null) {
  const prog = Math.max(0, Math.min(1, p));
  ctx.save();

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 6;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    const frame = Math.min(cols - 1, Math.floor(prog * cols));
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.25) * 1.3;
    const dw = fw * scale;
    const dh = fh * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0.1, 1.0 - prog * 0.5);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2, targetY - dh / 2 - 10, dw, dh);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 6. Electroweb (Golden electrified web stuck to target)
 */
export function renderElectrowebCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null) {
  const prog = Math.max(0, Math.min(1, p));
  ctx.save();

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 5;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    const frame = Math.min(cols - 1, Math.floor(prog * cols));
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.2) * 1.25;
    const dw = fw * scale;
    const dh = fh * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0.2, 1.0 - prog * 0.4);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2, targetY - dh / 2 - 10, dw, dh);
    ctx.restore();
  }

  // Electric sparking nodes
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.random() * 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(Math.round(targetX + Math.cos(ang) * r), Math.round(targetY - 10 + Math.sin(ang) * r), 2, 2);
  }
  ctx.restore();

  ctx.restore();
}

/**
 * 7. Electric Terrain Decal (Branching ground lightning)
 */
export function renderElectricTerrainCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null) {
  const prog = Math.max(0, Math.min(1, p));
  ctx.save();

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = 4;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight;
    const frame = Math.min(cols - 1, Math.floor(prog * cols));
    const sx = frame * fw;

    const scale = (spriteVisual?.scale || 1.6) * 1.4;
    const dw = fw * scale;
    const dh = fh * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0.15, 1.0 - prog * 0.4);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, 0, fw, fh, targetX - dw / 2, targetY + 8 - dh / 2, dw, dh);
    ctx.restore();
  }

  ctx.restore();
}
`;

let current = fs.readFileSync('client/src/battle/pixelArtVfx.js', 'utf8');
if (!current.includes('renderElectricChargeCombat')) {
  current += code;
  fs.writeFileSync('client/src/battle/pixelArtVfx.js', current, 'utf8');
  console.log('Successfully appended electric renderers to pixelArtVfx.js!');
} else {
  console.log('Renderers already present in pixelArtVfx.js');
}
