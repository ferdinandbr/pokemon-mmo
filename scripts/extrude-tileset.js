const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function main() {
  const srcPath = path.join(__dirname, '../client/public/assets/tilesets/Outside1 Spring.png');
  const outPath = path.join(__dirname, '../client/public/assets/tilesets/Outside1 Spring_extruded.png');
  const mapsDir = path.join(__dirname, '../client/public/assets/maps');

  console.log('[Extruder] Loading source tileset:', srcPath);
  const img = await loadImage(srcPath);

  const tileW = 32;
  const tileH = 32;
  const cols = 64;
  const totalTiles = 4544;
  const rows = Math.ceil(totalTiles / cols); // 71

  // With margin 1 and spacing 2, each tile occupies (tileW + 2) by (tileH + 2)
  const destW = cols * (tileW + 2); // 64 * 34 = 2176
  const destH = rows * (tileH + 2); // 71 * 34 = 2414

  console.log(`[Extruder] Extruding ${totalTiles} tiles (${cols}x${rows}) to ${destW}x${destH}...`);
  const canvas = createCanvas(destW, destH);
  const ctx = canvas.getContext('2d');

  for (let t = 0; t < totalTiles; t++) {
    const sc = t % cols;
    const sr = Math.floor(t / cols);
    const sx = sc * tileW;
    const sy = sr * tileH;

    const dx = 1 + sc * (tileW + 2);
    const dy = 1 + sr * (tileH + 2);

    // 1. Center tile
    ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);

    // 2. Edges (duplicate 1px outer rim into the 1px margin / spacing gutter)
    ctx.drawImage(img, sx, sy, tileW, 1, dx, dy - 1, tileW, 1); // top
    ctx.drawImage(img, sx, sy + tileH - 1, tileW, 1, dx, dy + tileH, tileW, 1); // bottom
    ctx.drawImage(img, sx, sy, 1, tileH, dx - 1, dy, 1, tileH); // left
    ctx.drawImage(img, sx + tileW - 1, sy, 1, tileH, dx + tileW, dy, 1, tileH); // right

    // 3. Corners
    ctx.drawImage(img, sx, sy, 1, 1, dx - 1, dy - 1, 1, 1); // top-left
    ctx.drawImage(img, sx + tileW - 1, sy, 1, 1, dx + tileW, dy - 1, 1, 1); // top-right
    ctx.drawImage(img, sx, sy + tileH - 1, 1, 1, dx - 1, dy + tileH, 1, 1); // bottom-left
    ctx.drawImage(img, sx + tileW - 1, sy + tileH - 1, 1, 1, dx + tileW, dy + tileH, 1, 1); // bottom-right
  }

  const outBuf = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, outBuf);
  console.log(`[Extruder] Saved extruded tileset to ${outPath} (${(outBuf.length / 1024).toFixed(1)} KB)`);

  // Update all map JSON files
  const mapFiles = fs.readdirSync(mapsDir).filter(f => f.endsWith('.json'));
  let updatedCount = 0;

  for (const file of mapFiles) {
    const mapPath = path.join(mapsDir, file);
    try {
      const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
      if (!mapData.tilesets || !Array.isArray(mapData.tilesets)) continue;

      let changed = false;
      for (const ts of mapData.tilesets) {
        if (ts.name === 'Outside1 Spring') {
          ts.image = '/assets/tilesets/Outside1 Spring_extruded.png';
          ts.imagewidth = destW;
          ts.imageheight = destH;
          ts.columns = cols;
          ts.margin = 1;
          ts.spacing = 2;
          ts.tilewidth = 32;
          ts.tileheight = 32;
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2), 'utf8');
        updatedCount++;
      }
    } catch (err) {
      console.error(`[Extruder] Error updating ${file}:`, err);
    }
  }

  console.log(`[Extruder] Updated ${updatedCount} map JSON files with extruded tileset settings.`);
}

main().catch(console.error);
