const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function testWebpAnim() {
  const animDir = path.resolve('client/public/assets/battle/animations');
  const previewDir = path.resolve(animDir, 'previews');
  
  // Let's create an animated WebP for fogo_labareda (015-Fire01.png, frames 0 to 4)
  const inputPath = path.join(animDir, '015-Fire01.png');
  const frameW = 192;
  const frameH = 192;
  const cols = 5;

  const frameBuffers = [];
  for (let f = 0; f <= 4; f++) {
    const left = (f % cols) * frameW;
    const top = Math.floor(f / cols) * frameH;
    const buf = await sharp(inputPath)
      .extract({ left, top, width: frameW, height: frameH })
      .toBuffer();
    frameBuffers.push(buf);
  }

  // Combine with sharp or check if sharp supports joining frames
  console.log('Frames extracted:', frameBuffers.length);
}

testWebpAnim().catch(console.error);
