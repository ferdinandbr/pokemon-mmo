const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const tilesetDir = path.resolve(__dirname, '../client/public/assets/tilesets');
const backupDir = path.join(tilesetDir, 'originals_backup');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const toRepack = [
  { file: 'Outside2 Summer.png', srcCols: 8, totalTiles: 4544, destCols: 64 },
  { file: 'Outside3 Autumn.png', srcCols: 8, totalTiles: 4544, destCols: 64 },
  { file: 'Outside4 Winter.png', srcCols: 8, totalTiles: 4544, destCols: 64 },
  { file: 'Outside.png', srcCols: 8, totalTiles: 4016, destCols: 64 },
  { file: 'Caves.png', srcCols: 8, totalTiles: 1704, destCols: 64 },
  { file: 'Gyms interior.png', srcCols: 8, totalTiles: 1264, destCols: 64 },
  { file: 'Interior general.png', srcCols: 8, totalTiles: 2120, destCols: 64 }
];

async function run() {
  const tileW = 32;
  const tileH = 32;

  for (const item of toRepack) {
    const srcPath = path.join(tilesetDir, item.file);
    const backupPath = path.join(backupDir, item.file);

    if (!fs.existsSync(srcPath)) {
      console.log('Skipping missing:', item.file);
      continue;
    }

    // Backup original if not already backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(srcPath, backupPath);
      console.log('Backed up:', item.file);
    }

    const img = await loadImage(backupPath);
    const destRows = Math.ceil(item.totalTiles / item.destCols);
    const destW = item.destCols * tileW;
    const destH = destRows * tileH;

    const canvas = createCanvas(destW, destH);
    const ctx = canvas.getContext('2d');

    for (let t = 0; t < item.totalTiles; t++) {
      const sx = (t % item.srcCols) * tileW;
      const sy = Math.floor(t / item.srcCols) * tileH;
      const dx = (t % item.destCols) * tileW;
      const dy = Math.floor(t / item.destCols) * tileH;
      ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
    }

    const outBuf = canvas.toBuffer('image/png');
    fs.writeFileSync(srcPath, outBuf);
    console.log('Repacked ' + item.file + ': from ' + img.width + 'x' + img.height + ' to ' + destW + 'x' + destH);
  }
}

run().catch(console.error);
