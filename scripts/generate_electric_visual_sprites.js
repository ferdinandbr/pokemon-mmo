const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const OUT_DIR = path.resolve('client/public/assets/battle/animations/vfx/custom');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function setPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function drawPixelLine(ctx, x0, y0, x1, y1, color, thickness = 1) {
  x0 = Math.floor(x0); y0 = Math.floor(y0);
  x1 = Math.floor(x1); y1 = Math.floor(y1);
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = (x0 < x1) ? 1 : -1;
  const sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    ctx.fillStyle = color;
    if (thickness <= 1) {
      ctx.fillRect(x0, y0, 1, 1);
    } else {
      ctx.fillRect(x0 - Math.floor(thickness / 2), y0 - Math.floor(thickness / 2), thickness, thickness);
    }
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

// ============================================================================
// 1. ELECTRIC CHARGING AURA (Yellow & Blue)
// Frame: 64x64, 6 frames -> 384x64
// Crackling sphere of electricity, orbiting sparks and pulsing plasma
// ============================================================================
function generateElectricCharge(isBlue = false) {
  const fw = 64;
  const fh = 64;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = isBlue ? {
    DARK: '#0369a1',
    MID: '#0284c7',
    LIGHT: '#38bdf8',
    GLOW: '#7dd3fc',
    WHITE: '#ffffff'
  } : {
    DARK: '#b45309',
    MID: '#eab308',
    LIGHT: '#facc15',
    GLOW: '#fef08a',
    WHITE: '#ffffff'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    const baseR = 18 + Math.sin(f * 1.2) * 3;

    // Glowing core glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, baseR + 4);
    coreGrad.addColorStop(0, PAL.WHITE);
    coreGrad.addColorStop(0.35, PAL.LIGHT);
    coreGrad.addColorStop(0.7, PAL.MID);
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseR + 2, 0, Math.PI * 2);
    ctx.fill();

    // 4-6 Crackling jagged lightning arcs orbiting the center
    const arcCount = 5;
    for (let a = 0; a < arcCount; a++) {
      const startAngle = (a / arcCount) * Math.PI * 2 + (f * 0.9);
      const segments = 4;
      let curX = cx + Math.cos(startAngle) * (baseR * 0.4);
      let curY = cy + Math.sin(startAngle) * (baseR * 0.4);

      for (let s = 1; s <= segments; s++) {
        const segAngle = startAngle + (s / segments) * 0.9 + ((s % 2 === 0 ? 0.35 : -0.35));
        const segDist = (baseR * 0.4) + (s / segments) * (baseR * 0.8) + ((s * 3) % 4);
        const nextX = cx + Math.cos(segAngle) * segDist;
        const nextY = cy + Math.sin(segAngle) * segDist;

        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.DARK, 2);
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.LIGHT, 1);
        curX = nextX;
        curY = nextY;
      }
      // Spark at tip
      setPixel(ctx, curX, curY, PAL.WHITE);
      setPixel(ctx, curX + 1, curY, PAL.GLOW);
      setPixel(ctx, curX, curY + 1, PAL.GLOW);
    }

    // Sparkle particles flying outward
    for (let p = 0; p < 8; p++) {
      const pAngle = (p * 0.785) + (f * 0.5);
      const pDist = baseR + 3 + ((f * 3 + p * 4) % 9);
      const px = Math.round(cx + Math.cos(pAngle) * pDist);
      const py = Math.round(cy + Math.sin(pAngle) * pDist);
      setPixel(ctx, px, py, PAL.WHITE);
      setPixel(ctx, px + 1, py, PAL.LIGHT);
      setPixel(ctx, px, py - 1, PAL.MID);
    }
  }

  const filename = isBlue ? 'electric_charge_blue.png' : 'electric_charge_yellow.png';
  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: ${filename}`);
}

// ============================================================================
// 2. ELECTRIC BOLT IMPACT (Vertical Lightning Strike + Ground Shockwave)
// Frame: 96x128, 6 frames -> 576x128
// Descida vertical fulminante de raio com estilhaços e explosão de solo
// ============================================================================
function generateElectricBoltImpact(isBlue = false) {
  const fw = 96;
  const fh = 128;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = isBlue ? {
    DARK: '#075985',
    MID: '#0284c7',
    LIGHT: '#38bdf8',
    GLOW: '#bae6fd',
    WHITE: '#ffffff'
  } : {
    DARK: '#b45309',
    MID: '#eab308',
    LIGHT: '#facc15',
    GLOW: '#fef08a',
    WHITE: '#ffffff'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const groundY = fh - 24;

    const progress = f / (frames - 1);

    // Frame 0-2: Raio desce veloz do topo até o chão
    if (f <= 2) {
      const reach = (f + 1) / 3;
      const targetY = groundY * reach;

      // Raio principal espesso em zigue-zague
      let curX = cx + (Math.sin(f * 2) * 4);
      let curY = 0;
      const steps = 7;
      for (let s = 1; s <= steps; s++) {
        const nextY = (s / steps) * targetY;
        const offset = (s % 2 === 1 ? -1 : 1) * (6 + (s % 3) * 3);
        const nextX = cx + offset;

        // Aura escura externa
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.DARK, 5);
        // Camada média
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.MID, 3);
        // Núcleo branco puro
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.WHITE, 1);

        // Pequena ramificação lateral saindo do raio
        if (s === 3 || s === 5) {
          const bX = nextX + (s === 3 ? 14 : -14);
          const bY = nextY + 8;
          drawPixelLine(ctx, nextX, nextY, bX, bY, PAL.MID, 2);
          drawPixelLine(ctx, nextX, nextY, bX, bY, PAL.WHITE, 1);
        }

        curX = nextX;
        curY = nextY;
      }
    }

    // Frame 1-5: Impacto e explosão no chão
    if (f >= 1) {
      const blastProg = (f - 1) / 4;
      const blastR = 12 + blastProg * 28;
      const alpha = 1.0 - blastProg * 0.75;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, alpha);

      // Flash elipsoidal no solo (perspectiva 2D)
      ctx.fillStyle = PAL.GLOW;
      ctx.beginPath();
      ctx.ellipse(cx, groundY, blastR, blastR * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Anel de choque externo
      ctx.strokeStyle = PAL.LIGHT;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, groundY, blastR * 1.15, blastR * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Arcos rastejantes no solo
      for (let bolt = 0; bolt < 6; bolt++) {
        const angle = (bolt / 6) * Math.PI * 2 + (f * 0.4);
        const bDist = blastR * 1.35;
        const bX = cx + Math.cos(angle) * bDist;
        const bY = groundY + Math.sin(angle) * (bDist * 0.45);
        const midX = cx + Math.cos(angle + 0.3) * (bDist * 0.6);
        const midY = groundY + Math.sin(angle + 0.3) * (bDist * 0.3);

        drawPixelLine(ctx, cx, groundY, midX, midY, PAL.MID, 2);
        drawPixelLine(ctx, midX, midY, bX, bY, PAL.LIGHT, 1);
        setPixel(ctx, bX, bY, PAL.WHITE);
      }

      // Faíscas voando para cima
      for (let s = 0; s < 10; s++) {
        const spAngle = -Math.PI * 0.85 + (s / 10) * Math.PI * 0.7;
        const spDist = 14 + blastProg * 40 + (s * 3 % 10);
        const spX = Math.round(cx + Math.cos(spAngle) * spDist);
        const spY = Math.round(groundY + Math.sin(spAngle) * spDist * 0.9);
        setPixel(ctx, spX, spY, PAL.WHITE);
        setPixel(ctx, spX, spY + 1, PAL.GLOW);
      }
      ctx.restore();
    }
  }

  const filename = isBlue ? 'electric_bolt_impact_blue.png' : 'electric_bolt_impact_yellow.png';
  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: ${filename}`);
}

// ============================================================================
// 3. ELECTROCUTED BURST (Efeito de choque frenético no Pokémon)
// Frame: 64x64, 6 frames -> 384x64
// Faíscas e arcos que envolvem e eletrocutam a vítima
// ============================================================================
function generateElectrocutedBurst() {
  const fw = 64;
  const fh = 64;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    DARK: '#ca8a04',
    MID: '#eab308',
    LIGHT: '#fde047',
    GLOW: '#fef9c3',
    WHITE: '#ffffff',
    BLUE_SPARK: '#38bdf8'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    // 4 Arcos ziguezagueantes fechando ao redor do corpo
    const arcs = 4;
    for (let i = 0; i < arcs; i++) {
      const baseAng = (i / arcs) * Math.PI * 2 + (f * 1.5);
      const r1 = 12 + (f % 3) * 3;
      const r2 = 22 + ((f + 2) % 3) * 2;

      let x0 = cx + Math.cos(baseAng) * r1;
      let y0 = cy + Math.sin(baseAng) * r1;

      const midAng = baseAng + ((i % 2 === 0) ? 0.6 : -0.6);
      const mx = cx + Math.cos(midAng) * ((r1 + r2) / 2);
      const my = cy + Math.sin(midAng) * ((r1 + r2) / 2);

      const endAng = baseAng + 1.2;
      const x1 = cx + Math.cos(endAng) * r2;
      const y1 = cy + Math.sin(endAng) * r2;

      drawPixelLine(ctx, x0, y0, mx, my, PAL.DARK, 2);
      drawPixelLine(ctx, mx, my, x1, y1, PAL.DARK, 2);
      drawPixelLine(ctx, x0, y0, mx, my, PAL.LIGHT, 1);
      drawPixelLine(ctx, mx, my, x1, y1, PAL.WHITE, 1);

      // Faíscas nos nós
      setPixel(ctx, mx, my, PAL.WHITE);
      setPixel(ctx, x1, y1, PAL.GLOW);
    }

    // Centelhas dispersas
    for (let s = 0; s < 6; s++) {
      const sAng = s * 1.05 + f * 0.8;
      const sDist = 16 + ((f * 5 + s * 7) % 12);
      const sx = Math.round(cx + Math.cos(sAng) * sDist);
      const sy = Math.round(cy + Math.sin(sAng) * sDist);
      setPixel(ctx, sx, sy, PAL.WHITE);
      setPixel(ctx, sx + 1, sy, PAL.LIGHT);
      setPixel(ctx, sx, sy - 1, PAL.BLUE_SPARK);
    }
  }

  const outPath = path.join(OUT_DIR, 'electrocuted_burst.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: electrocuted_burst.png`);
}

// ============================================================================
// 4. PARABOLIC CHARGE (Ondas de Choque Elétrico Concêntricas no Chão - Imagem 4)
// Frame: 128x128, 6 frames -> 768x128
// Anéis expansivos no chão com rachaduras de relâmpago amarelo
// ============================================================================
function generateElectricShockwaveRings() {
  const fw = 128;
  const fh = 128;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    DARK: '#854d0e',
    MID: '#ca8a04',
    LIGHT: '#facc15',
    GLOW: '#fef08a',
    WHITE: '#ffffff'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2 + 8; // ligeiramente para baixo para perspectiva isométrica/plano de chão

    const rings = 3;
    for (let r = 0; r < rings; r++) {
      const progress = ((f / frames) + (r / rings)) % 1.0;
      if (progress < 0.08) continue;

      const rx = progress * 56;
      const ry = rx * 0.48; // Elipse achatada no chão
      const alpha = Math.sin(progress * Math.PI);

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, alpha);

      // Traço do anel elíptico com zigue-zague elétrico
      const steps = Math.max(36, Math.round(rx * 3.5));
      for (let s = 0; s < steps; s++) {
        const ang = (s / steps) * Math.PI * 2;
        // Modulação serrilhada de relâmpago
        const jag = Math.sin(ang * 12 + f * 3) * (progress < 0.7 ? 2.5 : 1.2);
        const curRx = rx + jag;
        const curRy = ry + jag * 0.48;

        const px = cx + Math.cos(ang) * curRx;
        const py = cy + Math.sin(ang) * curRy;

        setPixel(ctx, px, py, PAL.DARK);
        setPixel(ctx, px, py - 1, PAL.LIGHT);
        if (s % 3 === 0) {
          setPixel(ctx, px, py - 2, PAL.WHITE);
        }
      }

      // Arcos elétricos que saltam entre os anéis
      if (progress > 0.3 && progress < 0.8) {
        for (let a = 0; a < 4; a++) {
          const aAng = (a / 4) * Math.PI * 2 + (f * 0.7);
          const x0 = cx + Math.cos(aAng) * rx;
          const y0 = cy + Math.sin(aAng) * ry;
          const x1 = cx + Math.cos(aAng + 0.25) * (rx * 1.2);
          const y1 = cy + Math.sin(aAng + 0.25) * (ry * 1.2);
          drawPixelLine(ctx, x0, y0, x1, y1, PAL.WHITE, 1);
        }
      }

      ctx.restore();
    }
  }

  const outPath = path.join(OUT_DIR, 'electric_shockwave_rings.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: electric_shockwave_rings.png`);
}

// ============================================================================
// 5. THUNDER WAVE (Onda Transversal / Pulsos Concêntricos Elétricos)
// Frame: 64x64, 6 frames -> 384x64
// Ondas em crescente pulsantes que avançam no oponente
// ============================================================================
function generateElectricWave() {
  const fw = 64;
  const fh = 64;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    DARK: '#a16207',
    MID: '#eab308',
    LIGHT: '#fde047',
    WHITE: '#ffffff'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    const prog = f / (frames - 1);
    const waveCount = 3;

    for (let w = 0; w < waveCount; w++) {
      const wProg = (prog + w * 0.3) % 1.0;
      const wR = 8 + wProg * 22;
      const alpha = 1.0 - wProg * 0.8;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, alpha);

      // Desenhar arcos frontais em crescente
      const startAngle = -Math.PI * 0.6;
      const endAngle = Math.PI * 0.6;
      const steps = 24;

      for (let s = 0; s <= steps; s++) {
        const ang = startAngle + (s / steps) * (endAngle - startAngle);
        const jag = Math.sin(ang * 8 + f * 4) * 2;
        const curR = wR + jag;

        const px = cx + Math.cos(ang) * curR;
        const py = cy + Math.sin(ang) * curR;

        drawPixelLine(ctx, px - 1, py, px + 1, py, PAL.DARK, 2);
        drawPixelLine(ctx, px, py - 1, px, py + 1, PAL.LIGHT, 1);
        if (s % 2 === 0) setPixel(ctx, px, py, PAL.WHITE);
      }
      ctx.restore();
    }
  }

  const outPath = path.join(OUT_DIR, 'electric_wave.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: electric_wave.png`);
}

// ============================================================================
// 6. ELECTROWEB (Teia de Aranha Eletrificada em Amarelo/Dourado)
// Frame: 80x80, 5 frames -> 400x80
// Colorizada com fios dourados e nós luminosos de alta voltagem
// ============================================================================
function generateElectroweb() {
  const fw = 80;
  const fh = 80;
  const frames = 5;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    DARK: '#854d0e',
    MID: '#eab308',
    LIGHT: '#fef08a',
    WHITE: '#ffffff',
    BLUE_SPARK: '#38bdf8'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    const spokes = 8;
    const maxR = 34;

    // 8 Raios radiais da teia
    for (let s = 0; s < spokes; s++) {
      const ang = (s / spokes) * Math.PI * 2;
      const x1 = cx + Math.cos(ang) * maxR;
      const y1 = cy + Math.sin(ang) * maxR;
      drawPixelLine(ctx, cx, cy, x1, y1, PAL.MID, 1);
    }

    // 4 Círculos concêntricos poligonais interligando os raios
    const rings = 4;
    for (let r = 1; r <= rings; r++) {
      const rDist = (r / rings) * maxR;
      for (let s = 0; s < spokes; s++) {
        const ang0 = (s / spokes) * Math.PI * 2;
        const ang1 = ((s + 1) / spokes) * Math.PI * 2;

        const x0 = cx + Math.cos(ang0) * rDist;
        const y0 = cy + Math.sin(ang0) * rDist;
        const x1 = cx + Math.cos(ang1) * rDist;
        const y1 = cy + Math.sin(ang1) * rDist;

        // Fio com leve curvatura para dentro
        const midX = (x0 + x1) / 2 + Math.cos((ang0 + ang1) / 2) * -2;
        const midY = (y0 + y1) / 2 + Math.sin((ang0 + ang1) / 2) * -2;

        drawPixelLine(ctx, x0, y0, midX, midY, PAL.DARK, 2);
        drawPixelLine(ctx, midX, midY, x1, y1, PAL.DARK, 2);
        drawPixelLine(ctx, x0, y0, midX, midY, PAL.LIGHT, 1);
        drawPixelLine(ctx, midX, midY, x1, y1, PAL.LIGHT, 1);

        // Nós elétricos piscantes nos cruzamentos
        if ((s + r + f) % 2 === 0) {
          setPixel(ctx, x0, y0, PAL.WHITE);
          setPixel(ctx, x0 + 1, y0, PAL.LIGHT);
          setPixel(ctx, x0, y0 - 1, PAL.BLUE_SPARK);
        }
      }
    }

    // Centro brilhante
    setPixel(ctx, cx, cy, PAL.WHITE);
    setPixel(ctx, cx + 1, cy, PAL.LIGHT);
    setPixel(ctx, cx - 1, cy, PAL.LIGHT);
    setPixel(ctx, cx, cy + 1, PAL.LIGHT);
    setPixel(ctx, cx, cy - 1, PAL.LIGHT);
  }

  const outPath = path.join(OUT_DIR, 'electroweb.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: electroweb.png`);
}

// ============================================================================
// 7. ELECTRIC TERRAIN DECAL (Terreno com Fissuras e Raios Rastejantes)
// Frame: 128x128, 4 frames -> 512x128
// ============================================================================
function generateElectricTerrain() {
  const fw = 128;
  const fh = 128;
  const frames = 4;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    GROUND_CRACK: '#451a03',
    DARK_ELEC: '#a16207',
    MID_ELEC: '#eab308',
    LIGHT_ELEC: '#facc15',
    WHITE: '#ffffff'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    // 6 Fissuras ramificadas saindo do centro pelo chão
    const branches = 6;
    for (let b = 0; b < branches; b++) {
      const bAng = (b / branches) * Math.PI * 2 + 0.2;
      let curX = cx;
      let curY = cy;
      const segs = 4;

      for (let s = 1; s <= segs; s++) {
        const segDist = s * 12 + (s % 2) * 4;
        const angleVar = bAng + ((s % 2 === 0) ? 0.3 : -0.3) + Math.sin(f + s) * 0.15;
        const nextX = cx + Math.cos(angleVar) * segDist;
        const nextY = cy + Math.sin(angleVar) * (segDist * 0.55); // perspectiva de chão

        // Rachadura de solo
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.GROUND_CRACK, 3);
        // Corrente elétrica percorrendo a rachadura
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.MID_ELEC, 2);
        drawPixelLine(ctx, curX, curY, nextX, nextY, PAL.LIGHT_ELEC, 1);

        if ((s + f) % 2 === 0) {
          setPixel(ctx, nextX, nextY, PAL.WHITE);
        }

        curX = nextX;
        curY = nextY;
      }
    }
  }

  const outPath = path.join(OUT_DIR, 'electric_terrain_decal.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated: electric_terrain_decal.png`);
}

// Run all generators
ensureDir(OUT_DIR);
generateElectricCharge(false); // Yellow
generateElectricCharge(true);  // Blue
generateElectricBoltImpact(false); // Yellow
generateElectricBoltImpact(true);  // Blue
generateElectrocutedBurst();
generateElectricShockwaveRings();
generateElectricWave();
generateElectroweb();
generateElectricTerrain();
console.log('All electric visual sprites generated successfully!');
