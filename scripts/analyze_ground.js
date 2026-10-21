const { createCanvas, loadImage } = require('canvas');

async function run() {
  const imgPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/.user_uploaded/media_1792445915981.png';
  const img = await loadImage(imgPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;
  const width = img.width;
  const height = img.height;

  const rowCount = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 15) {
        rowCount[y]++;
      }
    }
  }

  // Find rows
  const rowBands = [];
  let inRow = false;
  let startY = 0;
  for (let y = 0; y < height; y++) {
    if (rowCount[y] > 5 && !inRow) {
      inRow = true;
      startY = y;
    } else if (rowCount[y] <= 5 && inRow) {
      inRow = false;
      rowBands.push({ startY, endY: y - 1, h: y - startY });
    }
  }
  if (inRow) rowBands.push({ startY, endY: height - 1, h: height - startY });

  console.log('Row bands count:', rowBands.length);
  rowBands.forEach((rb, i) => console.log('Row', i + 1, rb));

  // Now for each row, find columns (frames)
  rowBands.forEach((rb, rIdx) => {
    const colCount = new Array(width).fill(0);
    for (let x = 0; x < width; x++) {
      for (let y = rb.startY; y <= rb.endY; y++) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] > 15) {
          colCount[x]++;
        }
      }
    }
    const cols = [];
    let inCol = false;
    let startX = 0;
    for (let x = 0; x < width; x++) {
      if (colCount[x] > 0 && !inCol) {
        inCol = true;
        startX = x;
      } else if (colCount[x] === 0 && inCol) {
        inCol = false;
        cols.push({ startX, endX: x - 1, w: x - startX });
      }
    }
    if (inCol) cols.push({ startX, endX: width - 1, w: width - startX });
    console.log('Row ' + (rIdx + 1) + ' (' + cols.length + ' frames):');
    cols.forEach((c, ci) => console.log('  Frame ' + (ci + 1) + ':', c));
  });
}

run().catch(console.error);
