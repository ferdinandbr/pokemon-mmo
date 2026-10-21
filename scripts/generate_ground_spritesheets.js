const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateVisualizer() {
  const imgPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/.user_uploaded/media_1792445915981.png';
  const srcImg = await loadImage(imgPath);
  const srcCanvas = createCanvas(srcImg.width, srcImg.height);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(srcImg, 0, 0);

  const srcData = srcCtx.getImageData(0, 0, srcImg.width, srcImg.height).data;

  function getTightBounds(x1, y1, x2, y2) {
    let minX = x2, maxX = x1, minY = y2, maxY = y1;
    let found = false;
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const a = srcData[(y * srcImg.width + x) * 4 + 3];
        if (a > 15) {
          found = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return found ? { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 } : null;
  }

  const variations = {
    crater_round: {
      boxes: [
        [40, 40, 90, 205],
        [130, 40, 190, 205],
        [240, 40, 320, 205],
        [365, 40, 470, 205],
        [505, 40, 615, 205],
        [645, 40, 765, 205],
        [790, 40, 995, 205],
      ].map(b => getTightBounds(...b)),
      frameW: 224,
      frameH: 160,
      align: 'center'
    },
    crater_spiked: {
      boxes: [
        [40, 210, 105, 370],
        [160, 210, 245, 370],
        [305, 210, 405, 370],
        [460, 210, 585, 370],
        [630, 210, 770, 370],
        [810, 210, 975, 370],
      ].map(b => getTightBounds(...b)),
      frameW: 192,
      frameH: 160,
      align: 'center'
    },
    fissure_crack: {
      boxes: [
        [30, 375, 115, 468],
        [150, 375, 250, 468],
        [280, 375, 410, 468],
        [440, 375, 590, 468],
        [615, 375, 768, 468],
        [795, 375, 995, 468],
      ].map(b => getTightBounds(...b)),
      frameW: 224,
      frameH: 80,
      align: 'center'
    },
    skid_trench: {
      boxes: [
        [35, 470, 90, 565],
        [120, 470, 210, 565],
        [250, 470, 380, 565],
        [415, 470, 545, 565],
        [590, 470, 740, 565],
        [770, 470, 980, 565],
      ].map(b => getTightBounds(...b)),
      frameW: 224,
      frameH: 80,
      align: 'left_anchor' // Trench starts at the skid origin and carves forward
    },
    stone_ring: {
      boxes: [
        [55, 568, 95, 660],
        [175, 568, 230, 660],
        [295, 568, 385, 660],
        [435, 568, 560, 660],
        [620, 568, 760, 660],
      ].map(b => getTightBounds(...b)),
      frameW: 160,
      frameH: 80,
      align: 'center'
    }
  };

  const outputDir = 'e:/Projetos/PokeMMO/client/public/assets/battle/animations/vfx/earth';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const [key, v] of Object.entries(variations)) {
    const numFrames = v.boxes.length;
    const sheetCanvas = createCanvas(v.frameW * numFrames, v.frameH);
    const sheetCtx = sheetCanvas.getContext('2d');

    for (let f = 0; f < numFrames; f++) {
      const b = v.boxes[f];
      let dx, dy;
      if (v.align === 'center') {
        dx = f * v.frameW + Math.floor((v.frameW - b.w) / 2);
        dy = Math.floor((v.frameH - b.h) / 2);
      } else if (v.align === 'left_anchor') {
        // Left anchor: align left margin of furrow so it grows from left to right
        dx = f * v.frameW + 8;
        dy = Math.floor((v.frameH - b.h) / 2);
      }
      sheetCtx.drawImage(srcImg, b.minX, b.minY, b.w, b.h, dx, dy, b.w, b.h);
    }

    const outPath = path.join(outputDir, `ground_${key}.png`);
    fs.writeFileSync(outPath, sheetCanvas.toBuffer('image/png'));
    console.log(`Saved ${outPath} (${numFrames} frames, ${v.frameW}x${v.frameH} per frame, total ${sheetCanvas.width}x${sheetCanvas.height})`);
  }
}

generateVisualizer().catch(console.error);
