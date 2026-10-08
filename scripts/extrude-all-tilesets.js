const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const tilesetDir = path.resolve(__dirname, '../client/public/assets/tilesets');
const backupDir = path.join(tilesetDir, 'originals_backup');
const mapsDir = path.resolve(__dirname, '../client/public/assets/maps');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const tilesetList = [
  { file: 'Outside1 Spring.png', srcCols: 64, totalTiles: 4544, name: 'Outside1 Spring' },
  { file: 'Outside2 Summer.png', srcCols: 64, totalTiles: 4544, name: 'Outside2 Summer' },
  { file: 'Outside3 Autumn.png', srcCols: 64, totalTiles: 4544, name: 'Outside3 Autumn' },
  { file: 'Outside4 Winter.png', srcCols: 64, totalTiles: 4544, name: 'Outside4 Winter' },
  { file: 'Outside.png', srcCols: 64, totalTiles: 4016, name: 'Outside' },
  { file: 'Caves.png', srcCols: 64, totalTiles: 1704, name: 'Caves' },
  { file: 'Gyms interior.png', srcCols: 64, totalTiles: 1264, name: 'Gyms interior' },
  { file: 'Interior general.png', srcCols: 64, totalTiles: 2120, name: 'Interior general' }
];

async function extrude() {
  const tileW = 32;
  const tileH = 32;
  const destCols = 64;

  for (const item of tilesetList) {
    const srcPath = path.join(tilesetDir, item.file);
    const backupPath = path.join(backupDir, item.file);

    if (!fs.existsSync(srcPath)) {
      console.log('File missing:', item.file);
      continue;
    }

    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
      console.log('Backed up original:', item.file);
    }

    const img = await loadImage(backupPath);
    if (img.width === 2176) {
      console.log('Already extruded:', item.file);
      continue;
    }

    const destRows = Math.ceil(item.totalTiles / destCols);
    const destW = destCols * (tileW + 2); // 2176
    const destH = destRows * (tileH + 2);

    console.log(`Extruding ${item.file}: ${img.width}x${img.height} -> ${destW}x${destH}...`);

    const canvas = createCanvas(destW, destH);
    const ctx = canvas.getContext('2d');

    const origCols = img.width === 2048 ? 64 : (Math.floor(img.width / tileW) || 8);

    for (let t = 0; t < item.totalTiles; t++) {
      const sx = (t % origCols) * tileW;
      const sy = Math.floor(t / origCols) * tileH;

      const sc = t % destCols;
      const sr = Math.floor(t / destCols);

      const dx = 1 + sc * (tileW + 2);
      const dy = 1 + sr * (tileH + 2);

      // 1. Center tile
      ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);

      // 2. Extruded 1px edges
      ctx.drawImage(img, sx, sy, tileW, 1, dx, dy - 1, tileW, 1); // top
      ctx.drawImage(img, sx, sy + tileH - 1, tileW, 1, dx, dy + tileH, tileW, 1); // bottom
      ctx.drawImage(img, sx, sy, 1, tileH, dx - 1, dy, 1, tileH); // left
      ctx.drawImage(img, sx + tileW - 1, sy, 1, tileH, dx + tileW, dy, 1, tileH); // right

      // 3. Extruded 1px corners
      ctx.drawImage(img, sx, sy, 1, 1, dx - 1, dy - 1, 1, 1); // top-left
      ctx.drawImage(img, sx + tileW - 1, sy, 1, 1, dx + tileW, dy - 1, 1, 1); // top-right
      ctx.drawImage(img, sx, sy + tileH - 1, 1, 1, dx - 1, dy + tileH, 1, 1); // bottom-left
      ctx.drawImage(img, sx + tileW - 1, sy + tileH - 1, 1, 1, dx + tileW, dy + tileH, 1, 1); // bottom-right
    }

    const outBuf = canvas.toBuffer('image/png');
    fs.writeFileSync(srcPath, outBuf);
    console.log(`Saved extruded ${item.file} (${(outBuf.length / 1024).toFixed(1)} KB)`);
  }

  // Update map JSON files
  if (fs.existsSync(mapsDir)) {
    const mapFiles = fs.readdirSync(mapsDir).filter(f => f.endsWith('.json'));
    for (const file of mapFiles) {
      const mapPath = path.join(mapsDir, file);
      try {
        const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
        if (!mapData.tilesets || !Array.isArray(mapData.tilesets)) continue;

        let changed = false;
        for (const ts of mapData.tilesets) {
          const item = tilesetList.find(x => x.name === ts.name || ts.name.includes(x.name));
          if (item) {
            const destRows = Math.ceil(item.totalTiles / destCols);
            ts.imagewidth = destCols * 34; // 2176
            ts.imageheight = destRows * 34;
            ts.columns = destCols;
            ts.margin = 1;
            ts.spacing = 2;
            ts.tilewidth = 32;
            ts.tileheight = 32;
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2), 'utf8');
          console.log(`Updated map file: ${file}`);
        }
      } catch (err) {
        console.error(`Error updating ${file}:`, err);
      }
    }
  }
}

extrude().catch(console.error);
