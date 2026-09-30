const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function inspectSheets() {
  const dir = 'client/public/assets/battle/animations';
  const files = [
    '003-Attack01.png',
    '004-Attack02.png',
    '015-Fire01.png',
    '017-Thunder01.png',
    '018-Water01.png',
    '023-Burst01.png',
    '030-Explosion01.png',
    'Earth1.png',
    'Ice1.png',
    'Wind1.png',
    'normal1.png',
    'poison.png',
    'Scratch + Shadow Claw.png',
    'punches.png',
    'teeth.png',
    'grass.png',
    'Tackle_B.png'
  ];

  for (const f of files) {
    const filePath = path.join(dir, f);
    const meta = await sharp(filePath).metadata();
    const cols = Math.floor(meta.width / 192);
    const rows = Math.floor(meta.height / 192);
    console.log(`\n=== ${f} (${cols}x${rows}) ===`);

    for (let r = 0; r < rows; r++) {
      let rowPixels = 0;
      for (let c = 0; c < cols; c++) {
        const { data } = await sharp(filePath)
          .extract({ left: c * 192, top: r * 192, width: 192, height: 192 })
          .raw()
          .toBuffer({ resolveWithObject: true });

        let count = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 20) count++;
        }
        rowPixels += count;
      }
      console.log(`  Row ${r} total opaque pixels: ${rowPixels}`);
    }
  }
}

inspectSheets().catch(console.error);
