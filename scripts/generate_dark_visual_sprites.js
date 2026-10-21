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

// ============================================================================
// 1. SNARL SOUNDWAVE - EXPANDING ROUND DARK ACOUSTIC SHOCKWAVES
// Frame: 64x64, 6 frames -> 384x64
// Concentric circular sonic distortion rings with dark obsidian ripples & violet aura
// ============================================================================
function generateSnarlSoundwave() {
  const fw = 64;
  const fh = 64;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    OUTLINE: '#1e112a',     // Deep obsidian shadow
    DARK_VIOLET: '#4c1d95', // Rich sinister purple
    MID_VIOLET: '#7c3aed',  // Electric violet reverberation
    BRIGHT_LILAC: '#a855f7',// Luminous acoustic pulse
    LIGHT_LILAC: '#e9d5ff', // Sharp wave crest
    WHITE: '#ffffff',       // Pure acoustic core shine
    RED_ACCENT: '#be123c',  // Subtle sinister crimson edge
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    // 3 Concentric acoustic circular wavefronts expanding over time
    const waveCount = 3;
    for (let w = 0; w < waveCount; w++) {
      const waveProg = ((f / frames) + (w / waveCount)) % 1.0;
      if (waveProg < 0.08) continue;

      const maxR = 27;
      const r = Math.round(waveProg * maxR);
      const alpha = Math.sin(waveProg * Math.PI);
      const strokeThickness = waveProg < 0.5 ? 2.5 : 1.8;

      // Draw pixelated circular ring with notched sound vibration
      const steps = Math.max(36, Math.round(r * 4.5));
      for (let s = 0; s < steps; s++) {
        const ang = (s / steps) * Math.PI * 2;
        // Harmonic sound wave ripple notch modulation
        const ripple = Math.sin(ang * 8 + f * 2.5) * (waveProg < 0.7 ? 1.2 : 0.6);
        const curR = r + ripple;

        const px = cx + Math.cos(ang) * curR;
        const py = cy + Math.sin(ang) * curR;

        // Dark outer boundary
        setPixel(ctx, px, py, PAL.OUTLINE);

        // Inner glowing crest
        if (waveProg < 0.7) {
          const innerR = Math.max(1, curR - 1);
          const inX = cx + Math.cos(ang) * innerR;
          const inY = cy + Math.sin(ang) * innerR;
          setPixel(ctx, inX, inY, (s % 3 === 0) ? PAL.WHITE : PAL.BRIGHT_LILAC);

          // Second inner layer for thickness near center
          if (waveProg < 0.45) {
            const coreR = Math.max(1, curR - 2);
            setPixel(ctx, cx + Math.cos(ang) * coreR, cy + Math.sin(ang) * coreR, PAL.MID_VIOLET);
          }
        }
      }
    }

    // Central sinister growl epicenter sparkle / mouth burst
    if (f < 3) {
      const coreR = 4 - f;
      for (let cr = -coreR; cr <= coreR; cr++) {
        for (let cg = -coreR; cg <= coreR; cg++) {
          if (cr * cr + cg * cg <= coreR * coreR) {
            setPixel(ctx, cx + cr, cy + cg, f === 0 ? PAL.WHITE : PAL.BRIGHT_LILAC);
          }
        }
      }
    }

    // Flying sonic distortion motes around the ring
    for (let p = 0; p < 4; p++) {
      const pAng = (p * Math.PI * 0.5) + (f * 0.4);
      const pDist = 12 + ((f * 5 + p * 6) % 18);
      const mx = cx + Math.cos(pAng) * pDist;
      const my = cy + Math.sin(pAng) * pDist;
      setPixel(ctx, mx, my, p % 2 === 0 ? PAL.LIGHT_LILAC : PAL.RED_ACCENT);
    }
  }

  const outPath = path.join(OUT_DIR, 'snarl_soundwave.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Pixel Art Snarl Soundwave generated:', outPath, `(${fw * frames}x${fh})`);
}

// ============================================================================
// 2. QUESTION MARKS DARK - ORBITING CONFUSION / SCHEMING SYMBOLS
// Frame: 48x48, 8 frames -> 384x48
// 3 sinister dark-purple question marks revolving in 3D orbit around entity
// Perfect for Flatter (on foe) and Nasty Plot (on self)
// ============================================================================
function generateQuestionMarksDark() {
  const fw = 48;
  const fh = 48;
  const frames = 8;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    OUTLINE: '#150824',     // Deep obsidian border
    DARK: '#3b0764',        // Deep purple shade
    MID: '#6b21a8',         // Sinister violet body
    BRIGHT: '#a855f7',      // Radiant psychic-dark purple
    HIGHLIGHT: '#d8b4fe',   // Luminous gleam
    WHITE: '#ffffff',       // Specular glint
    GOLD: '#facc15',        // Scheming intellect spark
  };

  // 7x10 pixel bitmap for a clean 16-bit retro question mark '?'
  // 1 = outline, 2 = body, 3 = highlight, 4 = dot body
  const QM_MATRIX = [
    [0, 1, 1, 1, 1, 0, 0],
    [1, 3, 2, 2, 2, 1, 0],
    [1, 3, 1, 1, 2, 1, 0],
    [0, 0, 0, 1, 2, 1, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 4, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ];

  function drawPixelQuestionMark(targetCtx, bx, by, scale = 1, alpha = 1.0) {
    targetCtx.save();
    targetCtx.globalAlpha = alpha;
    for (let r = 0; r < QM_MATRIX.length; r++) {
      for (let c = 0; c < QM_MATRIX[r].length; c++) {
        const val = QM_MATRIX[r][c];
        if (!val) continue;

        let col = PAL.OUTLINE;
        if (val === 2) col = PAL.BRIGHT;
        else if (val === 3) col = PAL.WHITE;
        else if (val === 4) col = PAL.HIGHLIGHT;

        targetCtx.fillStyle = col;
        targetCtx.fillRect(
          Math.floor(bx + c * scale),
          Math.floor(by + r * scale),
          Math.ceil(scale),
          Math.ceil(scale)
        );
      }
    }
    targetCtx.restore();
  }

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cx = ox + fw / 2;
    const cy = fh / 2;

    // 3 Question marks placed around an elliptical orbit (radius X: 16px, radius Y: 6px)
    const marks = [
      { baseAngle: 0 },
      { baseAngle: (Math.PI * 2) / 3 },
      { baseAngle: (Math.PI * 4) / 3 },
    ];

    // Sort by Y position for proper 3D depth layering
    const renderedMarks = marks.map((m, idx) => {
      const currentAng = m.baseAngle + (f / frames) * Math.PI * 2;
      const x = cx + Math.cos(currentAng) * 15;
      const y = cy + Math.sin(currentAng) * 7 - 4;
      const depth = Math.sin(currentAng); // -1 (back) to +1 (front)
      const scale = 0.85 + depth * 0.25; // 0.6 to 1.1 scale
      const alpha = 0.6 + depth * 0.4; // 0.2 to 1.0 opacity
      return { x, y, depth, scale, alpha, idx };
    }).sort((a, b) => a.depth - b.depth);

    for (const rm of renderedMarks) {
      // Center question mark around (rm.x, rm.y)
      const qmW = 7 * rm.scale;
      const qmH = 11 * rm.scale;
      drawPixelQuestionMark(ctx, rm.x - qmW / 2, rm.y - qmH / 2, rm.scale, rm.alpha);

      // Sparkle on frontmost mark
      if (rm.depth > 0.4 && (f + rm.idx) % 2 === 0) {
        setPixel(ctx, rm.x + qmW / 2 + 1, rm.y - qmH / 2, PAL.WHITE);
        setPixel(ctx, rm.x + qmW / 2 + 2, rm.y - qmH / 2, PAL.HIGHLIGHT);
      }
    }
  }

  const outPath = path.join(OUT_DIR, 'question_marks_dark.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Pixel Art Question Marks Dark generated:', outPath, `(${fw * frames}x${fh})`);
}

// ============================================================================
// 3. RECOLOR SMEAR_V_01 -> NIGHT_SLASH_CROSS (PURPLE/DARK PALETTE)
// Frame: 48x48, 6 frames -> 288x48
// Authentic pixel palette remapping to sinister dark violet, glowing purple & white razor tip
// ============================================================================
async function generateNightSlashCross() {
  const srcPath = path.resolve('client/public/assets/battle/animations/vfx/smear/smear_v_01.png');
  const img = await loadImage(srcPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (a < 10) continue;

    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b; // 0 to 255

    if (luma > 220) {
      // Pure razor crest highlight -> Specular White / Light Lilac
      d[i] = 250;
      d[i + 1] = 232;
      d[i + 2] = 255;
    } else if (luma > 170) {
      // Blade energy shine -> Vibrant Lilac
      d[i] = 216;
      d[i + 1] = 180;
      d[i + 2] = 254;
    } else if (luma > 120) {
      // Main blade slash core -> Electric Purple
      d[i] = 168;
      d[i + 1] = 85;
      d[i + 2] = 247;
    } else if (luma > 70) {
      // Shadow underside -> Deep Sinister Violet
      d[i] = 107;
      d[i + 1] = 33;
      d[i + 2] = 168;
    } else {
      // Edge / Outline -> Dark Obsidian / Crimson Shadow
      d[i] = 46;
      d[i + 1] = 16;
      d[i + 2] = 77;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const outPath = path.join(OUT_DIR, 'night_slash_cross.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Pixel Art Night Slash Cross (Purple Dark Palette) generated:', outPath, `(${img.width}x${img.height})`);
}

// ============================================================================
// 4. RECOLOR SMEAR_H_01 -> THIEF_SWIPE_DARK (PURPLE/DARK PALETTE)
// Frame: 48x48, 5 frames -> 240x48
// Used for Thief swipe & Hyperspace Fury 3-hit multi-strike
// ============================================================================
async function generateThiefSwipeDark() {
  const srcPath = path.resolve('client/public/assets/battle/animations/vfx/smear/smear_h_01.png');
  const img = await loadImage(srcPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (a < 10) continue;

    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    if (luma > 210) {
      d[i] = 250;
      d[i + 1] = 232;
      d[i + 2] = 255;
    } else if (luma > 160) {
      d[i] = 216;
      d[i + 1] = 180;
      d[i + 2] = 254;
    } else if (luma > 110) {
      d[i] = 168;
      d[i + 1] = 85;
      d[i + 2] = 247;
    } else if (luma > 60) {
      d[i] = 107;
      d[i + 1] = 33;
      d[i + 2] = 168;
    } else {
      d[i] = 46;
      d[i + 1] = 16;
      d[i + 2] = 77;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const outPath = path.join(OUT_DIR, 'thief_swipe_dark.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Pixel Art Thief Swipe Dark (Purple Dark Palette) generated:', outPath, `(${img.width}x${img.height})`);
}

async function main() {
  ensureDir(OUT_DIR);
  generateSnarlSoundwave();
  generateQuestionMarksDark();
  await generateNightSlashCross();
  await generateThiefSwipeDark();
  console.log('All Dark-Type custom pixel-art spritesheets successfully generated!');
}

main().catch(console.error);
