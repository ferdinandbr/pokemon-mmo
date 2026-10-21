import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const FRAME_WIDTH = 96;
const FRAME_HEIGHT = 128;
const TOTAL_FRAMES = 16;

const DEST_DIR = 'client/public/assets/battle/animations/vfx/custom';
const ORIGINALS_DIR = path.join(DEST_DIR, 'originals');

const PALETTES = {
  green: {
    filename: 'pillar_green.png',
    primary: '#00E676',       // Bright neon green
    core: '#FFFFFF',          // Pure white core shine
    highlight: '#B9F6CA',     // Pale mint highlight
    secondary: '#00C853',     // Emerald green
    translucentFill: 'rgba(0, 160, 75, 0.72)', // Translucent cross body
    translucentFillBack: 'rgba(0, 140, 65, 0.50)',
    glow: 'rgba(0, 230, 118, 0.40)',
    glowFaint: 'rgba(0, 230, 118, 0.12)',
    groundHalo: 'rgba(0, 255, 136, 0.65)',
    sparkle: '#FFFFFF',
    beam: 'rgba(46, 255, 139, 0.45)',
    beamEdge: 'rgba(0, 230, 118, 0.55)',
    crossBorder: 'rgba(185, 246, 202, 0.95)',
    crossTrail: 'rgba(0, 230, 118, 0.35)',
  },
  yellow: {
    filename: 'pillar_yellow.png',
    primary: '#FFD700',       // Bright radiant gold
    core: '#FFFFFF',          // Pure white core shine
    highlight: '#FFF9C4',     // Pale gold highlight
    secondary: '#FFB300',     // Warm amber
    translucentFill: 'rgba(215, 150, 0, 0.72)',
    translucentFillBack: 'rgba(190, 130, 0, 0.50)',
    glow: 'rgba(255, 215, 0, 0.40)',
    glowFaint: 'rgba(255, 215, 0, 0.12)',
    groundHalo: 'rgba(255, 230, 70, 0.65)',
    sparkle: '#FFFFFF',
    beam: 'rgba(255, 225, 60, 0.45)',
    beamEdge: 'rgba(255, 215, 0, 0.55)',
    crossBorder: 'rgba(255, 249, 196, 0.95)',
    crossTrail: 'rgba(255, 215, 0, 0.35)',
  },
  blue: {
    filename: 'pillar_blue.png',
    primary: '#00E5FF',       // Luminous celestial cyan
    core: '#FFFFFF',          // Pure white core shine
    highlight: '#E0F7FA',     // Pale ice cyan highlight
    secondary: '#00B0FF',     // Azure sky blue
    translucentFill: 'rgba(0, 150, 225, 0.72)',
    translucentFillBack: 'rgba(0, 130, 200, 0.50)',
    glow: 'rgba(0, 229, 255, 0.40)',
    glowFaint: 'rgba(0, 229, 255, 0.12)',
    groundHalo: 'rgba(0, 240, 255, 0.65)',
    sparkle: '#FFFFFF',
    beam: 'rgba(64, 240, 255, 0.45)',
    beamEdge: 'rgba(0, 229, 255, 0.55)',
    crossBorder: 'rgba(224, 247, 250, 0.95)',
    crossTrail: 'rgba(0, 229, 255, 0.35)',
  }
};

const CROSSES = [
  // Foreground prominent crosses (clean, well-spaced)
  { xOff: 12, size: 25, thick: 8.2, initY: 0.35, speed: 1.0, alpha: 0.90, depth: 'front', trail: 22 },
  { xOff: -14, size: 20, thick: 6.8, initY: 0.70, speed: 1.0, alpha: 0.88, depth: 'front', trail: 18 },
  { xOff: -2, size: 16, thick: 5.4, initY: 0.15, speed: 1.0, alpha: 0.85, depth: 'front', trail: 15 },
  { xOff: 11, size: 13, thick: 4.4, initY: 0.90, speed: 1.0, alpha: 0.80, depth: 'front', trail: 12 },

  // Background subtle crosses
  { xOff: -18, size: 10, thick: 3.4, initY: 0.45, speed: 1.0, alpha: 0.48, depth: 'back', trail: 9 },
  { xOff: 18, size: 11, thick: 3.6, initY: 0.05, speed: 1.0, alpha: 0.50, depth: 'back', trail: 10 },
];

const BEAMS = [
  // Edge boundary beams
  { xOff: -30.5, width: 2.0, speed: 1.0, phase: 0.0, alpha: 0.60, isEdge: true },
  { xOff: 30.5, width: 2.0, speed: 1.0, phase: 0.0, alpha: 0.60, isEdge: true },
  // Internal rays
  { xOff: -23, width: 1.2, speed: 1.0, phase: 0.15, alpha: 0.35 },
  { xOff: -17, width: 1.8, speed: 1.0, phase: 0.50, alpha: 0.55 },
  { xOff: -12, width: 2.2, speed: 1.0, phase: 0.85, alpha: 0.65 },
  { xOff: -7, width: 1.5, speed: 1.0, phase: 0.28, alpha: 0.45 },
  { xOff: -2, width: 2.6, speed: 1.0, phase: 0.65, alpha: 0.75 },
  { xOff: 4, width: 1.8, speed: 1.0, phase: 0.98, alpha: 0.58 },
  { xOff: 10, width: 2.4, speed: 1.0, phase: 0.35, alpha: 0.70 },
  { xOff: 16, width: 1.6, speed: 1.0, phase: 0.72, alpha: 0.52 },
  { xOff: 22, width: 2.0, speed: 1.0, phase: 0.20, alpha: 0.65 },
];

const SPARKLES = [
  { xOff: -24, initY: 0.26, size: 3.5, speed: 1.0, phase: 0.2 },
  { xOff: -16, initY: 0.74, size: 4.2, speed: 1.0, phase: 0.7 },
  { xOff: -8, initY: 0.40, size: 2.8, speed: 1.0, phase: 0.4 },
  { xOff: -3, initY: 0.86, size: 3.2, speed: 1.0, phase: 0.9 },
  { xOff: 5, initY: 0.16, size: 3.8, speed: 1.0, phase: 0.1 },
  { xOff: 13, initY: 0.60, size: 3.0, speed: 1.0, phase: 0.5 },
  { xOff: 22, initY: 0.36, size: 4.5, speed: 1.0, phase: 0.8 },
  { xOff: 28, initY: 0.80, size: 2.6, speed: 1.0, phase: 0.3 },
  { xOff: -29, initY: 0.54, size: 3.2, speed: 1.0, phase: 0.6 },
  { xOff: 9, initY: 0.94, size: 3.6, speed: 1.0, phase: 0.05 },
  { xOff: -18, initY: 0.10, size: 3.0, speed: 1.0, phase: 0.35 },
  { xOff: 18, initY: 0.20, size: 3.2, speed: 1.0, phase: 0.75 },
];

function drawSparkle(ctx, x, y, size, color, alpha) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.24, y - size * 0.24);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.24, y + size * 0.24);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.24, y + size * 0.24);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.24, y - size * 0.24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCross(ctx, cx, cy, size, thick, pal, alpha, trailHeight = 18, isBack = false) {
  if (alpha <= 0.01) return;
  ctx.save();

  const halfS = size / 2;
  const halfT = thick / 2;

  // 1. Vertical light trail extending downwards from cross
  if (trailHeight > 2) {
    const trailGrad = ctx.createLinearGradient(cx, cy + halfT, cx, cy + halfT + trailHeight);
    trailGrad.addColorStop(0, pal.crossTrail);
    trailGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = trailGrad;
    ctx.fillRect(cx - halfT, cy + halfT, thick, trailHeight);
    ctx.restore();
  }

  // 2. Soft outer glow
  ctx.save();
  ctx.globalAlpha = alpha * 0.45;
  ctx.fillStyle = pal.primary;
  ctx.shadowColor = pal.primary;
  ctx.shadowBlur = 8;
  ctx.fillRect(cx - halfS - 1, cy - halfT - 1, size + 2, thick + 2);
  ctx.fillRect(cx - halfT - 1, cy - halfS - 1, thick + 2, size + 2);
  ctx.restore();

  // 3. Translucent cross body
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = isBack ? pal.translucentFillBack : pal.translucentFill;

  ctx.beginPath();
  ctx.moveTo(cx - halfT, cy - halfS);
  ctx.lineTo(cx + halfT, cy - halfS);
  ctx.lineTo(cx + halfT, cy - halfT);
  ctx.lineTo(cx + halfS, cy - halfT);
  ctx.lineTo(cx + halfS, cy + halfT);
  ctx.lineTo(cx + halfT, cy + halfT);
  ctx.lineTo(cx + halfT, cy + halfS);
  ctx.lineTo(cx - halfT, cy + halfS);
  ctx.lineTo(cx - halfT, cy + halfT);
  ctx.lineTo(cx - halfS, cy + halfT);
  ctx.lineTo(cx - halfS, cy - halfT);
  ctx.lineTo(cx - halfT, cy - halfT);
  ctx.closePath();
  ctx.fill();

  // Luminous border
  ctx.strokeStyle = pal.crossBorder;
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // Core bright highlight
  ctx.fillStyle = pal.core;
  ctx.globalAlpha = alpha * (isBack ? 0.25 : 0.45);
  ctx.fillRect(cx - halfT * 0.5, cy - halfT * 0.5, halfT, halfT);

  ctx.restore();
  ctx.restore();
}

function renderPillarFrame(ctx, f, totalF, pal) {
  const t = f / totalF;
  const cx = FRAME_WIDTH / 2;
  const baseY = FRAME_HEIGHT - 16;
  const topY = 10;
  const colHeight = baseY - topY;
  const ringRx = 31;
  const ringRy = 7.5;
  const colWidth = ringRx * 2;
  const colBottomY = baseY + ringRy;
  const colFullHeight = colBottomY - topY;

  ctx.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);

  // 1. Ground Light Puddle
  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(1.0, ringRy / ringRx);
  const floorGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, ringRx * 1.15);
  floorGrad.addColorStop(0, pal.groundHalo);
  floorGrad.addColorStop(0.5, pal.glowFaint);
  floorGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = floorGrad;
  ctx.beginPath();
  ctx.arc(0, 0, ringRx * 1.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Background Crosses
  for (const c of CROSSES) {
    if (c.depth !== 'back') continue;
    const normY = ((c.initY - t * c.speed) % 1.0 + 1.0) % 1.0;
    const y = topY + normY * colHeight;
    const x = cx + c.xOff;

    let a = c.alpha;
    if (normY > 0.85) a *= (1.0 - normY) / 0.15;
    else if (normY < 0.15) a *= normY / 0.15;

    drawCross(ctx, x, y, c.size, c.thick, pal, a, c.trail, true);
  }

  // 3. Main Cylindrical Light Column
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  const bodyVGrad = ctx.createLinearGradient(0, topY, 0, colBottomY);
  bodyVGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bodyVGrad.addColorStop(0.18, pal.glowFaint);
  bodyVGrad.addColorStop(0.70, pal.glow);
  bodyVGrad.addColorStop(0.92, pal.groundHalo);
  bodyVGrad.addColorStop(1, 'rgba(0,0,0,0)');

  const bodyHGrad = ctx.createLinearGradient(cx - ringRx, 0, cx + ringRx, 0);
  bodyHGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bodyHGrad.addColorStop(0.08, 'rgba(255,255,255,0.28)');
  bodyHGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)');
  bodyHGrad.addColorStop(0.92, 'rgba(255,255,255,0.28)');
  bodyHGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = bodyVGrad;
  ctx.fillRect(cx - ringRx, topY, colWidth, colFullHeight);

  ctx.fillStyle = bodyHGrad;
  ctx.fillRect(cx - ringRx, topY, colWidth, colFullHeight);
  ctx.restore();

  // 4. Vertical Light Beams
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const b of BEAMS) {
    const bx = cx + b.xOff;
    const beamProgress = ((t * b.speed + b.phase) % 1.0);
    const beamPulse = 0.65 + 0.35 * Math.sin(beamProgress * Math.PI * 2);

    const bGrad = ctx.createLinearGradient(bx, topY, bx, baseY);
    bGrad.addColorStop(0, 'rgba(0,0,0,0)');
    bGrad.addColorStop(0.25, pal.glowFaint);
    bGrad.addColorStop(0.7 + 0.2 * Math.sin(beamProgress * Math.PI), b.isEdge ? pal.beamEdge : pal.beam);
    bGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalAlpha = b.alpha * beamPulse;
    ctx.fillStyle = bGrad;
    ctx.fillRect(bx - b.width / 2, topY, b.width, colHeight);
  }
  ctx.restore();

  // 5. Foreground Floating Crosses
  for (const c of CROSSES) {
    if (c.depth !== 'front') continue;
    const normY = ((c.initY - t * c.speed) % 1.0 + 1.0) % 1.0;
    const y = topY + normY * colHeight;
    const x = cx + c.xOff;

    let a = c.alpha;
    if (normY > 0.88) {
      a *= (1.0 - normY) / 0.12;
    } else if (normY < 0.14) {
      a *= normY / 0.14;
    }

    drawCross(ctx, x, y, c.size, c.thick, pal, a, c.trail, false);
  }

  // 6. Sparkles
  for (const s of SPARKLES) {
    const normY = ((s.initY - t * s.speed) % 1.0 + 1.0) % 1.0;
    const y = topY + normY * colHeight;
    const x = cx + s.xOff;

    const twinkle = 0.5 + 0.5 * Math.sin((t + s.phase) * Math.PI * 4);
    let a = twinkle * 0.9;
    if (normY > 0.9) a *= (1.0 - normY) / 0.1;
    else if (normY < 0.1) a *= normY / 0.1;

    drawSparkle(ctx, x, y, s.size * (0.8 + 0.4 * twinkle), pal.sparkle, a);
  }

  // 7. Base Ring
  ctx.save();
  const ringPulse = 0.88 + 0.12 * Math.sin(t * Math.PI * 2);

  ctx.save();
  ctx.globalAlpha = 0.5 * ringPulse;
  ctx.strokeStyle = pal.primary;
  ctx.shadowColor = pal.primary;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.ellipse(cx, baseY, ringRx, ringRy, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.95 * ringPulse;
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(cx, baseY, ringRx, ringRy, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.85 * ringPulse;
  ctx.strokeStyle = pal.core;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.ellipse(cx, baseY, ringRx - 0.4, ringRy - 0.2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function generateSpritesheet(pal) {
  const sheetWidth = FRAME_WIDTH * TOTAL_FRAMES;
  const sheetHeight = FRAME_HEIGHT;
  const canvas = createCanvas(sheetWidth, sheetHeight);
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const frameCanvas = createCanvas(FRAME_WIDTH, FRAME_HEIGHT);
    const fCtx = frameCanvas.getContext('2d');
    renderPillarFrame(fCtx, f, TOTAL_FRAMES, pal);
    ctx.drawImage(frameCanvas, f * FRAME_WIDTH, 0);
  }

  return canvas;
}

// 1. Ensure directories exist
fs.makedirs = fs.mkdirSync;
fs.mkdirSync(DEST_DIR, { recursive: true });
fs.mkdirSync(ORIGINALS_DIR, { recursive: true });

// 2. Generate and write spritesheets
for (const [key, pal] of Object.entries(PALETTES)) {
  const targetPath = path.join(DEST_DIR, pal.filename);
  const backupPath = path.join(ORIGINALS_DIR, `backup_prev_${pal.filename}`);

  // Backup existing file if present and not yet backed up
  if (fs.existsSync(targetPath) && !fs.existsSync(backupPath)) {
    fs.copyFileSync(targetPath, backupPath);
    console.log(`Backed up previous ${pal.filename} to ${backupPath}`);
  }

  const canvas = generateSpritesheet(pal);
  fs.writeFileSync(targetPath, canvas.toBuffer('image/png'));
  console.log(`Successfully generated ${targetPath} (${FRAME_WIDTH * TOTAL_FRAMES}x${FRAME_HEIGHT}, ${TOTAL_FRAMES} frames)`);
}
