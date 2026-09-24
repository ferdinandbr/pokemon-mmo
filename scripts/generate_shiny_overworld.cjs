/**
 * generate_shiny_overworld.cjs
 *
 * Generates all 151 shiny overworld spritesheets for Gen 1 Pokémon.
 * Uses the color palette mapping extracted from the official animated Gen 5 GIFs
 * (front and back normal vs shiny).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE_DIR = path.join(__dirname, '..', 'client', 'public', 'assets', 'pokemon');
const OW_DIR = path.join(BASE_DIR, 'overworld', 'normal');
const OW_SHINY_DIR = path.join(BASE_DIR, 'overworld', 'shiny');
const ANIM_FRONT_NORM = path.join(BASE_DIR, 'animated', 'front', 'normal');
const ANIM_FRONT_SHINY = path.join(BASE_DIR, 'animated', 'front', 'shiny');
const ANIM_BACK_NORM = path.join(BASE_DIR, 'animated', 'back', 'normal');
const ANIM_BACK_SHINY = path.join(BASE_DIR, 'animated', 'back', 'shiny');

if (!fs.existsSync(OW_SHINY_DIR)) {
  fs.mkdirSync(OW_SHINY_DIR, { recursive: true });
}

function readGifPalette(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const buf = fs.readFileSync(filePath);
  const packed = buf[10];
  const hasGct = (packed & 0x80) !== 0;
  if (!hasGct) return [];
  const gctSize = 1 << ((packed & 0x07) + 1);
  const palette = [];
  let offset = 13;
  for (let i = 0; i < gctSize; i++) {
    palette.push([buf[offset], buf[offset + 1], buf[offset + 2]]);
    offset += 3;
  }
  return palette;
}

// Convert sRGB (0-255) to CIE-L*a*b*
function rgb2lab([r, g, b]) {
  r = r / 255; g = g / 255; b = b / 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + (16 / 116);

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

// Convert CIE-L*a*b* back to sRGB (0-255 clamped)
function lab2rgb([L, a, b]) {
  let y = (L + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  const x3 = Math.pow(x, 3);
  const y3 = Math.pow(y, 3);
  const z3 = Math.pow(z, 3);

  x = (x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787) * 0.95047;
  y = (y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787) * 1.00000;
  z = (z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787) * 1.08883;

  let r = x *  3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y *  1.8758 + z *  0.0415;
  let bl = x *  0.0557 + y * -0.2040 + z *  1.0570;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  bl = bl > 0.0031308 ? 1.055 * Math.pow(bl, 1 / 2.4) - 0.055 : 12.92 * bl;

  return [
    Math.max(0, Math.min(255, Math.round(r * 255))),
    Math.max(0, Math.min(255, Math.round(g * 255))),
    Math.max(0, Math.min(255, Math.round(bl * 255)))
  ];
}

// Delta E perceptual color distance
function deltaE(labA, labB) {
  return Math.hypot(labA[0] - labB[0], labA[1] - labB[1], labA[2] - labB[2]);
}

async function processPokemon(pad) {
  const owPath = path.join(OW_DIR, `${pad}.png`);
  if (!fs.existsSync(owPath)) {
    console.warn(`[Skip] Overworld sprite not found: ${owPath}`);
    return false;
  }

  const fnNorm = readGifPalette(path.join(ANIM_FRONT_NORM, `${pad}.gif`));
  const fnShiny = readGifPalette(path.join(ANIM_FRONT_SHINY, `${pad}.gif`));
  const bnNorm = readGifPalette(path.join(ANIM_BACK_NORM, `${pad}.gif`));
  const bnShiny = readGifPalette(path.join(ANIM_BACK_SHINY, `${pad}.gif`));

  // Build color pairs from front and back palettes
  const pairs = [];
  const seenPairKeys = new Set();

  function addPairs(normList, shinyList) {
    const len = Math.min(normList.length, shinyList.length);
    for (let i = 0; i < len; i++) {
      const n = normList[i];
      const s = shinyList[i];
      const key = `${n[0]},${n[1]},${n[2]}`;
      if (!seenPairKeys.has(key)) {
        seenPairKeys.add(key);
        pairs.push({ norm: n, shiny: s });
      }
    }
  }

  addPairs(fnNorm, fnShiny);
  addPairs(bnNorm, bnShiny);

  if (pairs.length === 0) {
    console.warn(`[Skip] No palette found for #${pad}`);
    return false;
  }

  const labNorm = pairs.map(p => rgb2lab(p.norm));
  const labShiny = pairs.map(p => rgb2lab(p.shiny));

  const ow = await sharp(owPath).raw().toBuffer({ resolveWithObject: true });
  const data = Buffer.from(ow.data);
  const cache = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha === 0) continue; // transparent pixel

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key = (r << 16) | (g << 8) | b;
    let res = cache.get(key);

    if (!res) {
      // Pure black outline is always preserved
      if (r === 0 && g === 0 && b === 0) {
        res = [0, 0, 0];
      } else {
        const rgb = [r, g, b];
        const lab = rgb2lab(rgb);

        let bestDist = Infinity;
        let bestIdx = 0;
        for (let j = 0; j < labNorm.length; j++) {
          const d = deltaE(lab, labNorm[j]);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = j;
          }
        }

        const sNorm = pairs[bestIdx].norm;
        const sShiny = pairs[bestIdx].shiny;

        // If normal color is identical to shiny color (e.g. neutral white, horns, teeth), keep original
        if (sNorm[0] === sShiny[0] && sNorm[1] === sShiny[1] && sNorm[2] === sShiny[2]) {
          res = rgb;
        } else {
          // Transfer shift in Lab space to preserve natural shading and contrast
          const dL = labShiny[bestIdx][0] - labNorm[bestIdx][0];
          const da = labShiny[bestIdx][1] - labNorm[bestIdx][1];
          const db = labShiny[bestIdx][2] - labNorm[bestIdx][2];

          const newLab = [
            Math.max(0, Math.min(100, lab[0] + dL)),
            lab[1] + da,
            lab[2] + db
          ];
          res = lab2rgb(newLab);
        }
      }
      cache.set(key, res);
    }

    data[i] = res[0];
    data[i + 1] = res[1];
    data[i + 2] = res[2];
  }

  const outDest = path.join(OW_SHINY_DIR, `${pad}.png`);
  await sharp(data, {
    raw: {
      width: ow.info.width,
      height: ow.info.height,
      channels: 4
    }
  }).png().toFile(outDest);

  return true;
}

async function run() {
  console.log('Generating 151 Shiny Overworld Spritesheets...');
  const start = Date.now();
  let count = 0;

  for (let i = 1; i <= 151; i++) {
    const pad = String(i).padStart(3, '0');
    const ok = await processPokemon(pad);
    if (ok) count++;
    if (i % 25 === 0 || i === 151) {
      console.log(`Progress: ${i}/151 processed (${count} generated).`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nAll done! Successfully generated ${count} shiny overworld sprites in ${elapsed}s.`);
  console.log(`Saved to: ${OW_SHINY_DIR}`);
}

run().catch(err => {
  console.error('Fatal error during shiny overworld generation:', err);
  process.exit(1);
});
