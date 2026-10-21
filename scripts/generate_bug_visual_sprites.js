const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const OUT_DIR = path.resolve('client/public/assets/battle/animations/vfx/custom');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Pixel helper: sets 1 pixel or a block of pixels with exact RGB
function setPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function setPixelBlock(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// ============================================================================
// 1. MEGAHORN DRILL - AUTHENTIC 16-BIT RETRO PIXEL ART
// Frame: 64x36, 6 frames -> 384x36
// References: Image 1 (Heracross green horn energy) + Image 2 (Rhyperior piercing drill)
// ============================================================================
function generatePixelMegahorn() {
  const fw = 64;
  const fh = 36;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Exact 16-bit GBA palette
  const PAL = {
    OUTLINE: '#112204',       // Deepest dark green outline
    DARK: '#2d5a08',          // Shaded chitin
    MID: '#559c0e',           // Bug green body
    BRIGHT: '#8be316',        // Vibrant lime energy
    HIGHLIGHT: '#d5fa7a',     // Glint highlight
    WHITE: '#ffffff',         // Core shine
    SPARK: '#fef08a',         // Gold spark
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cy = Math.floor(fh / 2); // 18
    const baseX = 10;
    const tipX = 56;
    const len = tipX - baseX; // 46px length
    const maxRadius = 14;

    // A. Stepped Pixel Aura / Wind Rings (around base)
    const ringOffset = f % 3;
    for (let r = -maxRadius - 2; r <= maxRadius + 2; r++) {
      if (Math.abs(r) % 2 === 0) {
        setPixel(ctx, ox + baseX - 2 - ringOffset, cy + r, PAL.BRIGHT);
      }
    }

    // B. Draw conical body row by row from baseX to tipX (pure integer pixel art)
    for (let x = baseX; x <= tipX; x++) {
      const prog = (x - baseX) / len; // 0 to 1
      const halfH = Math.max(1, Math.round((1 - prog) * maxRadius));

      // Helical ridge position calculation
      // 3 spiral ridge threads running along the cone
      const spin = (f / frames) * Math.PI * 2;
      const ridgeY1 = Math.sin(spin + prog * 7.5) * (halfH * 0.85);
      const ridgeY2 = Math.sin(spin + Math.PI + prog * 7.5) * (halfH * 0.85);

      for (let y = cy - halfH; y <= cy + halfH; y++) {
        const dy = y - cy;
        const normY = dy / (halfH || 1); // -1 (top) to +1 (bottom)

        // 1. Dark outline on perimeter
        if (Math.abs(dy) === halfH || x === baseX || x === tipX) {
          setPixel(ctx, ox + x, y, PAL.OUTLINE);
          continue;
        }

        // 2. Spinning spiral ridges (ridges are bright with dark shadow under)
        const distToRidge1 = Math.abs(dy - ridgeY1);
        const distToRidge2 = Math.abs(dy - ridgeY2);
        const isRidge = distToRidge1 < 1.4 || distToRidge2 < 1.4;
        const isRidgeShadow = (dy - ridgeY1 >= 1.4 && dy - ridgeY1 <= 2.5) ||
                              (dy - ridgeY2 >= 1.4 && dy - ridgeY2 <= 2.5);

        if (isRidge) {
          // Highlight on spiral flute
          if (normY < 0.2) {
            setPixel(ctx, ox + x, y, PAL.WHITE);
          } else {
            setPixel(ctx, ox + x, y, PAL.HIGHLIGHT);
          }
        } else if (isRidgeShadow) {
          setPixel(ctx, ox + x, y, PAL.DARK);
        } else {
          // 3. Conical Shading: Top is light-reflective, center is core energy, bottom is shaded
          if (normY < -0.6) {
            setPixel(ctx, ox + x, y, PAL.BRIGHT);
          } else if (normY < -0.2) {
            setPixel(ctx, ox + x, y, PAL.HIGHLIGHT);
          } else if (normY <= 0.2) {
            // White piercing spine core
            setPixel(ctx, ox + x, y, (prog > 0.4 || x % 2 === 0) ? PAL.WHITE : PAL.HIGHLIGHT);
          } else if (normY < 0.7) {
            setPixel(ctx, ox + x, y, PAL.MID);
          } else {
            setPixel(ctx, ox + x, y, PAL.DARK);
          }
        }
      }
    }

    // C. Piercing needle tip & diamond glint (x = tipX .. tipX + 5)
    setPixel(ctx, ox + tipX + 1, cy, PAL.WHITE);
    setPixel(ctx, ox + tipX + 2, cy, PAL.WHITE);
    setPixel(ctx, ox + tipX + 3, cy, PAL.HIGHLIGHT);
    setPixel(ctx, ox + tipX + 4, cy, PAL.BRIGHT);

    // Dynamic 4-point cross glint sparkle on tip
    const glintSize = (f % 2 === 0) ? 3 : 2;
    for (let g = 1; g <= glintSize; g++) {
      setPixel(ctx, ox + tipX - 1, cy - g, PAL.WHITE);
      setPixel(ctx, ox + tipX - 1, cy + g, PAL.WHITE);
      setPixel(ctx, ox + tipX - 1 - g, cy, PAL.WHITE);
      setPixel(ctx, ox + tipX - 1 + g, cy, PAL.WHITE);
    }

    // Trailing pixel speed dots
    const p1Y = cy + Math.sin(f * 2.1) * 8;
    const p2Y = cy - Math.cos(f * 1.8) * 10;
    setPixel(ctx, ox + baseX - 4 - (f % 4), p1Y, PAL.SPARK);
    setPixel(ctx, ox + baseX - 6 - ((f + 2) % 4), p2Y, PAL.HIGHLIGHT);
    setPixel(ctx, ox + baseX + 14, cy - maxRadius - 2 + (f % 3), PAL.WHITE);
    setPixel(ctx, ox + baseX + 26, cy + maxRadius + 2 - (f % 3), PAL.SPARK);
  }

  const outPath = path.join(OUT_DIR, 'megahorn_drill.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Pixel Art Megahorn drill generated:', outPath, `(${fw * frames}x${fh})`);
}

// ============================================================================
// 2. PIN MISSILE SPIKE - AERODYNAMIC DART NEEDLE MISSILE (16-BIT PIXEL ART)
// Frame: 48x20, 6 frames -> 288x20
// Authentic multi-segmented stinger dart with stabilizer fins and razor tip
// ============================================================================
function generatePixelPinMissile() {
  const fw = 48;
  const fh = 20;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    OUTLINE: '#141b08',       // Dark obsidian / chitin outline
    DARK_CHITIN: '#2e4a0a',   // Deep shaded green base
    MID_CHITIN: '#4d7c0f',    // Bug green casing
    BRIGHT_CHITIN: '#84cc16', // Vibrant chitin ring
    DARK_GOLD: '#a16207',     // Shaded amber needle metal
    MID_GOLD: '#ca8a04',      // Golden bronze alloy
    BRIGHT_GOLD: '#eab308',   // Polished needle gold
    YELLOW_GLOW: '#facc15',   // Luminous needle gleam
    LIGHT_YELLOW: '#fef08a',  // Sharp edge reflection
    WHITE: '#ffffff',         // Razor tip and specular sparkle
    SPEED_LINE: 'rgba(250, 204, 21, 0.65)'
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cy = Math.floor(fh / 2); // 10
    const spin = (f / frames) * Math.PI * 2;

    // --- A. Kinetic Propulsion Wake & Exhaust Sparks (x = 2 to 9) ---
    const wakePulse = (f % 2 === 0) ? 1 : 0;
    setPixel(ctx, ox + 3 - wakePulse, cy, PAL.WHITE);
    setPixel(ctx, ox + 4 - wakePulse, cy - 1, PAL.YELLOW_GLOW);
    setPixel(ctx, ox + 4 - wakePulse, cy + 1, PAL.YELLOW_GLOW);
    setPixel(ctx, ox + 5, cy, PAL.LIGHT_YELLOW);

    // Micro speed thrust particles
    const spX1 = ox + 1 - (f % 3);
    const spY1 = cy - 3 + ((f * 3) % 7);
    setPixel(ctx, spX1, spY1, PAL.BRIGHT_GOLD);

    // --- B. Stabilizer Tail Fins / Flukes (x = 7 to 15) ---
    // 4 Aerodynamic fins spinning in 3D perspective
    const finHeight = 6;
    for (let finIdx = 0; finIdx < 4; finIdx++) {
      const finAngle = spin + (finIdx * Math.PI / 2);
      const finCos = Math.cos(finAngle); // -1 to 1 (depth/projection)
      const finSin = Math.sin(finAngle); // -1 to 1 (vertical extension)

      // Only draw fins with visible vertical component or forward profile
      const finLen = Math.round(finSin * finHeight);
      if (Math.abs(finLen) >= 1) {
        const finBaseX = 13;
        const finTipX = 7;
        const dir = finLen > 0 ? 1 : -1;
        const absLen = Math.abs(finLen);

        for (let l = 1; l <= absLen; l++) {
          const fx = Math.round(finBaseX - (l / absLen) * (finBaseX - finTipX));
          const fy = cy + dir * l;

          // Shading based on 3D rotation and light from above
          let col = PAL.MID_CHITIN;
          if (l === absLen || fx === finTipX) col = PAL.OUTLINE;
          else if (dir < 0) col = PAL.BRIGHT_CHITIN; // Top fin caught by light
          else col = PAL.DARK_CHITIN; // Bottom fin in shadow

          setPixel(ctx, ox + fx, fy, col);
        }
      }
    }

    // --- C. Main Aerodynamic Stinger Shaft (x = 10 to 42) ---
    // Structure:
    // x = 10..15 : Chitinous Tail Cap & Rear Ring
    // x = 16..26 : Mid Chitin Casing with Recessed Girdle Lines
    // x = 27..38 : Tapered Golden Stinger Barrel
    // x = 39..44 : Slender Razor Needle Tip
    for (let x = 10; x <= 44; x++) {
      let halfH = 0;
      if (x <= 15) {
        // Rear tail cap
        halfH = 3;
      } else if (x <= 26) {
        // Mid body cylinder
        halfH = 3;
      } else if (x <= 36) {
        // Tapering golden needle
        const prog = (x - 26) / 10;
        halfH = Math.max(1, Math.round(3 * (1 - prog * 0.65)));
      } else {
        // Needle tip
        halfH = 1;
        if (x >= 42) halfH = 0; // Tapers down to single pixel needle line!
      }

      for (let y = cy - halfH; y <= cy + halfH; y++) {
        const dy = y - cy;

        // 1. Dark Outline
        if (Math.abs(dy) === halfH || x === 10 || x === 44) {
          setPixel(ctx, ox + x, y, PAL.OUTLINE);
          continue;
        }

        // 2. Chitin Section (x = 11 to 26)
        if (x <= 26) {
          // Recessed segment seams at x = 15, x = 20, x = 25
          if (x === 15 || x === 20 || x === 25) {
            setPixel(ctx, ox + x, y, dy >= 0 ? PAL.OUTLINE : PAL.DARK_CHITIN);
            continue;
          }

          // Shading: Top specular rim, middle bright body, bottom shaded belly
          if (dy === -halfH + 1) {
            setPixel(ctx, ox + x, y, PAL.BRIGHT_CHITIN);
          } else if (dy === 0) {
            // Spinning specular sheen highlight
            const sheenPos = Math.round(cy + Math.sin(spin * 1.5) * 1.2);
            setPixel(ctx, ox + x, y, (y === sheenPos) ? PAL.WHITE : PAL.BRIGHT_CHITIN);
          } else if (dy === 1) {
            setPixel(ctx, ox + x, y, PAL.MID_CHITIN);
          } else {
            setPixel(ctx, ox + x, y, PAL.DARK_CHITIN);
          }
        }
        // 3. Golden Needle Piercer Section (x = 27 to 38)
        else if (x <= 38) {
          if (dy === -halfH + 1) {
            setPixel(ctx, ox + x, y, PAL.LIGHT_YELLOW);
          } else if (dy === 0) {
            setPixel(ctx, ox + x, y, PAL.WHITE);
          } else if (dy === 1) {
            setPixel(ctx, ox + x, y, PAL.BRIGHT_GOLD);
          } else {
            setPixel(ctx, ox + x, y, PAL.DARK_GOLD);
          }
        }
        // 4. Razor Needle Point (x = 39 to 44)
        else {
          if (dy === 0) {
            setPixel(ctx, ox + x, y, PAL.WHITE);
          } else {
            setPixel(ctx, ox + x, y, PAL.LIGHT_YELLOW);
          }
        }
      }
    }

    // --- D. Ultra-Sharp Needle Apex & Diamond Star Glint (x = 45 to 47) ---
    setPixel(ctx, ox + 45, cy, PAL.WHITE);
    setPixel(ctx, ox + 46, cy, PAL.LIGHT_YELLOW);
    setPixel(ctx, ox + 47, cy, PAL.YELLOW_GLOW);

    // Tip sparkle glint cross
    const glintArm = (f % 2 === 0) ? 2 : 1;
    for (let g = 1; g <= glintArm; g++) {
      setPixel(ctx, ox + 44, cy - g, PAL.WHITE);
      setPixel(ctx, ox + 44, cy + g, PAL.WHITE);
      setPixel(ctx, ox + 44 - g, cy, PAL.WHITE);
      setPixel(ctx, ox + 44 + g, cy, PAL.WHITE);
    }

    // Trailing speed wind streaks along sides
    const windOffset = (f * 3) % 8;
    setPixel(ctx, ox + 22 - windOffset, cy - 5, PAL.YELLOW_GLOW);
    setPixel(ctx, ox + 21 - windOffset, cy - 5, PAL.LIGHT_YELLOW);
    setPixel(ctx, ox + 28 - windOffset, cy + 5, PAL.YELLOW_GLOW);
    setPixel(ctx, ox + 27 - windOffset, cy + 5, PAL.LIGHT_YELLOW);
  }

  const outPath = path.join(OUT_DIR, 'pin_missile_spike.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ High-Detail Pixel Art Pin Missile spike generated:', outPath, `(${fw * frames}x${fh})`);
}

// ============================================================================
// 3. STRING SHOT SILK - CONICAL EXPANDING WEB STREAM & JET (16-BIT PIXEL ART)
// Frame: 64x32, 6 frames -> 384x32
// References: Image 4 (Wurmple conical silk spray) + Image 5 (Sewaddle silk jet)
// ============================================================================
function generatePixelStringShot() {
  const fw = 64;
  const fh = 32;
  const frames = 6;
  const canvas = createCanvas(fw * frames, fh);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PAL = {
    OUTLINE: '#1e293b',       // Deep slate outline for high contrast
    DEEP_SHADE: '#475569',    // Shadowed underside of silk fiber
    SHADE: '#64748b',         // Shaded silk strand
    MID: '#94a3b8',           // Mid-tone silvery silk
    LIGHT: '#cbd5e1',         // Bright woven silk thread
    BRIGHT: '#e2e8f0',        // Lustrous silk crest
    WHITE: '#ffffff',         // Core pure white filament & droplet glint
    CYAN_GLOW: '#dbeafe',     // Subtle electrostatic silk sheen
  };

  for (let f = 0; f < frames; f++) {
    const ox = f * fw;
    const cy = Math.floor(fh / 2); // 16
    const spin = (f / frames) * Math.PI * 2;

    // --- A. Pressurized Ejection Nozzle Core (x = 2 to 10) ---
    // The concentrated origin stream spat from the Pokémon's mouth
    for (let x = 2; x <= 10; x++) {
      const prog = (x - 2) / 8;
      const h = Math.round(1 + prog * 1.5); // 1 to 2.5px radius
      for (let y = cy - h; y <= cy + h; y++) {
        const dy = y - cy;
        if (Math.abs(dy) === h || x === 2) {
          setPixel(ctx, ox + x, y, PAL.OUTLINE);
        } else if (dy === 0) {
          setPixel(ctx, ox + x, y, PAL.WHITE);
        } else if (dy < 0) {
          setPixel(ctx, ox + x, y, PAL.BRIGHT);
        } else {
          setPixel(ctx, ox + x, y, PAL.MID);
        }
      }
    }

    // --- B. Conical Expanding Silk Web Jet Stream (x = 10 to 54) ---
    // Multi-fiber braiding:
    // 1. Central taut tension core thread
    // 2. Upper billowing helical silk ribbon (phase A)
    // 3. Lower billowing helical silk ribbon (phase B)
    // 4. Cross-connecting sticky gossamer webbing filaments
    for (let x = 10; x <= 54; x++) {
      const prog = (x - 10) / 44; // 0.0 to 1.0 (cone expansion)
      const maxConeH = 2 + prog * 11; // Expands from 2px up to 13px radius!

      // Dynamic undulation wave along the stream
      const waveFreq = 4.2;
      const waveSpeed = spin * 1.5;
      const waveOffset = Math.sin(waveSpeed + prog * waveFreq);

      // Upper and lower oscillating braided ribbon boundaries
      const ribbon1Y = Math.round(cy - (maxConeH * 0.75) + Math.sin(waveSpeed + prog * 5.0) * (3.5 * prog));
      const ribbon2Y = Math.round(cy + (maxConeH * 0.75) + Math.sin(waveSpeed + Math.PI + prog * 5.0) * (3.5 * prog));
      const centerTensionY = Math.round(cy + Math.sin(waveSpeed * 0.8 + prog * 3.0) * (2.0 * prog));

      // 1. Draw Web Membrane / Translucent Gossamer Mesh (pixel stippling)
      if (prog > 0.25) {
        for (let y = Math.min(ribbon1Y, ribbon2Y); y <= Math.max(ribbon1Y, ribbon2Y); y++) {
          // Stipple pattern for authentic retro semi-transparency
          if ((x + y + f) % 3 === 0) {
            setPixel(ctx, ox + x, y, PAL.CYAN_GLOW);
          } else if ((x + y + f) % 5 === 0) {
            setPixel(ctx, ox + x, y, PAL.LIGHT);
          }
        }
      }

      // 2. Center Taut White Silk Cord
      setPixel(ctx, ox + x, centerTensionY - 1, PAL.SHADE);
      setPixel(ctx, ox + x, centerTensionY, PAL.WHITE);
      setPixel(ctx, ox + x, centerTensionY + 1, PAL.MID);

      // 3. Upper Main Silk Ribbon (Ribbon 1)
      setPixel(ctx, ox + x, ribbon1Y - 1, PAL.OUTLINE);
      setPixel(ctx, ox + x, ribbon1Y, PAL.BRIGHT);
      setPixel(ctx, ox + x, ribbon1Y + 1, PAL.WHITE);
      setPixel(ctx, ox + x, ribbon1Y + 2, PAL.SHADE);

      // 4. Lower Silk Ribbon (Ribbon 2)
      setPixel(ctx, ox + x, ribbon2Y - 2, PAL.MID);
      setPixel(ctx, ox + x, ribbon2Y - 1, PAL.WHITE);
      setPixel(ctx, ox + x, ribbon2Y, PAL.BRIGHT);
      setPixel(ctx, ox + x, ribbon2Y + 1, PAL.OUTLINE);

      // 5. Embedded Sticky Web Nodes / Pearls along the stream
      const nodePos1 = Math.round(16 + ((f * 6) % 36));
      const nodePos2 = Math.round(26 + (((f + 3) * 6) % 26));
      if (x === nodePos1 || x === nodePos2) {
        const ny = (x === nodePos1) ? ribbon1Y : ribbon2Y;
        setPixelBlock(ctx, ox + x - 1, ny - 1, 3, 3, PAL.WHITE);
        setPixel(ctx, ox + x - 1, ny - 1, PAL.CYAN_GLOW);
        setPixel(ctx, ox + x + 1, ny + 1, PAL.SHADE);
      }
    }

    // --- C. Trailing Flying Gossamer Whiskers & Filaments (Image 4 reference) ---
    // Fine wisps peeling off the cone
    for (let w = 0; w < 3; w++) {
      const wProg = (w / 3);
      const wx = Math.round(18 + w * 12 + (f % 4));
      const wyTop = Math.round(cy - 6 - w * 3 - Math.sin(spin + w * 2) * 3);
      const wyBot = Math.round(cy + 6 + w * 3 + Math.sin(spin + w * 2) * 3);

      setPixel(ctx, ox + wx, wyTop, PAL.WHITE);
      setPixel(ctx, ox + wx + 1, wyTop - 1, PAL.LIGHT);
      setPixel(ctx, ox + wx + 2, wyTop - 1, PAL.CYAN_GLOW);

      setPixel(ctx, ox + wx, wyBot, PAL.WHITE);
      setPixel(ctx, ox + wx + 1, wyBot + 1, PAL.LIGHT);
      setPixel(ctx, ox + wx + 2, wyBot + 1, PAL.CYAN_GLOW);
    }

    // --- D. Flared Snaring Web Head / Cocoon Net (x = 52 to 62) ---
    // The front of the stream expands into an enveloping web cup with grasping tendrils
    const headRadiusY = 11 + Math.sin(spin) * 2;
    for (let hy = -headRadiusY; hy <= headRadiusY; hy++) {
      const normHY = hy / headRadiusY;
      const cupX = Math.round(55 + (1 - Math.abs(normHY)) * 5); // Curved cup forward

      // Outer rim
      setPixel(ctx, ox + cupX, cy + hy, PAL.WHITE);
      setPixel(ctx, ox + cupX - 1, cy + hy, PAL.BRIGHT);
      setPixel(ctx, ox + cupX + 1, cy + hy, PAL.OUTLINE);

      // Forward grasping tendril claws at top, center, bottom
      if (Math.abs(hy) === Math.round(headRadiusY * 0.8) || Math.abs(hy) === 0) {
        const clawLen = 2 + (f % 3);
        for (let c = 1; c <= clawLen; c++) {
          setPixel(ctx, ox + cupX + c, cy + hy, (c === clawLen) ? PAL.WHITE : PAL.BRIGHT);
        }
      }
    }

    // Front web glints and sparkling silk motes
    const glintY = cy + Math.round(Math.sin(spin * 2) * 6);
    setPixel(ctx, ox + 61, glintY, PAL.WHITE);
    setPixel(ctx, ox + 62, glintY, PAL.WHITE);
    setPixel(ctx, ox + 61, glintY - 1, PAL.CYAN_GLOW);
    setPixel(ctx, ox + 61, glintY + 1, PAL.CYAN_GLOW);
  }

  const outPath = path.join(OUT_DIR, 'string_shot_silk.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('✓ Conical Silk Stream Pixel Art String Shot generated:', outPath, `(${fw * frames}x${fh})`);
}

ensureDir(OUT_DIR);
generatePixelMegahorn();
generatePixelPinMissile();
generatePixelStringShot();
console.log('All 100% Authentic Pixel-Art spritesheets successfully rebuilt!');
