const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function sliceAndAnalyze() {
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

  // Row 1: crater_round (7 frames)
  const r1Boxes = [
    [40, 40, 90, 205],
    [130, 40, 190, 205],
    [240, 40, 320, 205],
    [365, 40, 470, 205],
    [505, 40, 615, 205],
    [645, 40, 765, 205],
    [790, 40, 995, 205],
  ].map(b => getTightBounds(...b));

  // Row 2: crater_spiked (6 frames)
  const r2Boxes = [
    [40, 210, 105, 370],
    [160, 210, 245, 370],
    [305, 210, 405, 370],
    [460, 210, 585, 370],
    [630, 210, 770, 370],
    [810, 210, 975, 370],
  ].map(b => getTightBounds(...b));

  // Row 3: fissure_crack (6 frames)
  const r3Boxes = [
    [30, 375, 115, 468],
    [150, 375, 250, 468],
    [280, 375, 410, 468],
    [440, 375, 590, 468],
    [615, 375, 768, 468],
    [795, 375, 995, 468],
  ].map(b => getTightBounds(...b));

  // Row 4: skid_trench (6 frames)
  const r4Boxes = [
    [35, 470, 90, 565],
    [120, 470, 210, 565],
    [250, 470, 380, 565],
    [415, 470, 545, 565],
    [590, 470, 740, 565],
    [770, 470, 980, 565],
  ].map(b => getTightBounds(...b));

  // Row 5: stone_ring (5 frames)
  const r5Boxes = [
    [55, 568, 95, 660],
    [175, 568, 230, 660],
    [295, 568, 385, 660],
    [435, 568, 560, 660],
    [620, 568, 760, 660],
  ].map(b => getTightBounds(...b));

  console.log('R1 max W, H:', Math.max(...r1Boxes.map(b => b.w)), Math.max(...r1Boxes.map(b => b.h)));
  console.log('R2 max W, H:', Math.max(...r2Boxes.map(b => b.w)), Math.max(...r2Boxes.map(b => b.h)));
  console.log('R3 max W, H:', Math.max(...r3Boxes.map(b => b.w)), Math.max(...r3Boxes.map(b => b.h)));
  console.log('R4 max W, H:', Math.max(...r4Boxes.map(b => b.w)), Math.max(...r4Boxes.map(b => b.h)));
  console.log('R5 max W, H:', Math.max(...r5Boxes.map(b => b.w)), Math.max(...r5Boxes.map(b => b.h)));
}

sliceAndAnalyze().catch(console.error);
