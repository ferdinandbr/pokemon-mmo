// Measures the visible (opaque) height of each Gen 1 PMD sprite (Idle, facing DOWN)
// and cross-references the official Pokédex height table.
// Usage: node scripts/analyze_sprite_sizes.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const PMD_DIR = path.join(ROOT, 'client/public/assets/pokemon/pmd/normal');
const TABLE = path.join(ROOT, 'pokemon_gen1_altura_peso.md');
const ALPHA_THRESHOLD = 20;

export function parseHeightTable(md) {
  const rows = {};
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\|\s*(\d{3})\s*\|\s*([^|]+?)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|/);
    if (m) rows[m[1]] = { name: m[2], heightM: Number(m[3]), weightKg: Number(m[4]) };
  }
  return rows;
}

async function measureVisibleHeight(id) {
  const dir = path.join(PMD_DIR, id);
  const anim = JSON.parse(fs.readFileSync(path.join(dir, 'animData.json'), 'utf8')).anims;
  const action = ['Idle', 'Walk'].find((a) => anim[a] && fs.existsSync(path.join(dir, `${a}-Anim.png`)));
  if (!action) return null;
  const { frameWidth: fw, frameHeight: fh, frameCount } = anim[action];
  const { data, info } = await sharp(path.join(dir, `${action}-Anim.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const frames = Math.min(frameCount || 1, Math.floor(info.width / fw));

  let maxH = 0;
  let maxW = 0;
  for (let f = 0; f < frames; f++) {
    let minY = fh, maxY = -1, minX = fw, maxX = -1;
    for (let y = 0; y < fh; y++) { // row 0 = facing DOWN
      for (let x = 0; x < fw; x++) {
        if (data[(y * info.width + f * fw + x) * 4 + 3] > ALPHA_THRESHOLD) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    if (maxY >= 0) {
      maxH = Math.max(maxH, maxY - minY + 1);
      maxW = Math.max(maxW, maxX - minX + 1);
    }
  }
  return { action, visibleH: maxH, visibleW: maxW };
}

const heights = parseHeightTable(fs.readFileSync(TABLE, 'utf8'));
const result = {};
for (const id of Object.keys(heights)) {
  const m = fs.existsSync(path.join(PMD_DIR, id)) ? await measureVisibleHeight(id) : null;
  result[id] = { ...heights[id], ...(m || {}) };
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result));
} else {
  for (const [id, r] of Object.entries(result)) {
    console.log(`${id} ${r.name.padEnd(12)} ${String(r.heightM).padStart(5)}m  sprite ${r.visibleW}x${r.visibleH} (${r.action})`);
  }
}
