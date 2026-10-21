const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function inspect() {
  const imgPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/.user_uploaded/media_1792445915981.png';
  const img = await loadImage(imgPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  // Let's define the 5 rows' approximate Y ranges from our previous band analysis:
  // Row 1: Y 45 to 200
  // Row 2: Y 210 to 365
  // Row 3: Y 375 to 465
  // Row 4: Y 475 to 560
  // Row 5: Y 570 to 660

  const rowRanges = [
    { name: 'crater_round', y1: 40, y2: 205, expectedFrames: 7 },
    { name: 'crater_spiked', y1: 210, y2: 370, expectedFrames: 6 },
    { name: 'fissure_crack', y1: 375, y2: 468, expectedFrames: 6 },
    { name: 'skid_trench', y1: 470, y2: 565, expectedFrames: 6 },
    { name: 'stone_ring', y1: 568, y2: 660, expectedFrames: 5 },
  ];

  for (const row of rowRanges) {
    console.log('=== ' + row.name + ' ===');
    // Compute column projections in this row
    const colHasPixels = new Array(img.width).fill(0);
    for (let x = 0; x < img.width; x++) {
      for (let y = row.y1; y <= row.y2; y++) {
        const idx = (y * img.width + x) * 4;
        if (data[idx + 3] > 20) {
          colHasPixels[x]++;
        }
      }
    }

    // Find islands
    const islands = [];
    let inIsland = false;
    let startX = 0;
    for (let x = 0; x < img.width; x++) {
      if (colHasPixels[x] > 0 && !inIsland) {
        inIsland = true;
        startX = x;
      } else if (colHasPixels[x] === 0 && inIsland) {
        inIsland = false;
        islands.push({ x1: startX, x2: x - 1, w: x - startX });
      }
    }
    if (inIsland) islands.push({ x1: startX, x2: img.width - 1, w: img.width - startX });

    console.log('Raw islands found:', islands.length);
    islands.forEach((isl, idx) => console.log('  Island ' + (idx + 1) + ':', isl));
  }
}

inspect().catch(console.error);
