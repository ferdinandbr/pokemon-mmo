const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function run() {
  const dir = 'client/public/assets/battle/animations';
  const outDir = 'scratch/frames_fire';
  fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(path.join(dir, '015-Fire01.png')).metadata();
  console.log('015-Fire01:', meta.width, 'x', meta.height);
  const cols = meta.width / 192;
  const rows = meta.height / 192;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const framePath = path.join(outDir, `frame_${idx}_r${r}_c${c}.png`);
      await sharp(path.join(dir, '015-Fire01.png'))
        .extract({ left: c * 192, top: r * 192, width: 192, height: 192 })
        .toFile(framePath);
    }
  }
  console.log('Extracted 10 frames of 015-Fire01.png to scratch/frames_fire');
}

run().catch(console.error);
