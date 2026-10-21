const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function processSprites() {
  const imgPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/.user_uploaded/media_1792445915981.png';
  const srcImg = await loadImage(imgPath);
  const srcCanvas = createCanvas(srcImg.width, srcImg.height);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(srcImg, 0, 0);

  // Define exact bounding boxes for each frame of each row
  // [x1, y1, x2, y2]
  const rows = {
    crater_round: [
      { x1: 42, y1: 172, x2: 81, y2: 235 }, // Frame 1
      { x1: 135, y1: 165, x2: 185, y2: 235 }, // Frame 2
      { x1: 246, y1: 153, x2: 314, y2: 245 }, // Frame 3
      { x1: 370, y1: 138, x2: 465, y2: 252 }, // Frame 4
      { x1: 511, y1: 115, x2: 607, y2: 256 }, // Frame 5
      { x1: 652, y1: 90, x2: 758, y2: 265 },  // Frame 6
      { x1: 797, y1: 78, x2: 989, y2: 275 },  // Frame 7
    ],
    crater_spiked: [
      { x1: 42, y1: 255, x2: 101, y2: 320 }, // Frame 1 (including right pebble)
      { x1: 167, y1: 245, x2: 239, y2: 332 }, // Frame 2
      { x1: 312, y1: 238, x2: 398, y2: 340 }, // Frame 3
      { x1: 465, y1: 228, x2: 577, y2: 348 }, // Frame 4
      { x1: 634, y1: 225, x2: 762, y2: 355 }, // Frame 5
      { x1: 816, y1: 223, x2: 970, y2: 357 }, // Frame 6 (including right pebble)
    ],
    fissure_crack: [
      { x1: 35, y1: 388, x2: 110, y2: 450 }, // Frame 1
      { x1: 154, y1: 388, x2: 244, y2: 450 }, // Frame 2
      { x1: 289, y1: 388, x2: 406, y2: 450 }, // Frame 3
      { x1: 448, y1: 388, x2: 585, y2: 450 }, // Frame 4
      { x1: 620, y1: 388, x2: 762, y2: 450 }, // Frame 5
      { x1: 800, y1: 388, x2: 991, y2: 450 }, // Frame 6
    ],
    skid_trench: [
      { x1: 42, y1: 485, x2: 83, y2: 549 },  // Frame 1
      { x1: 125, y1: 485, x2: 203, y2: 549 }, // Frame 2
      { x1: 258, y1: 485, x2: 373, y2: 549 }, // Frame 3
      { x1: 420, y1: 485, x2: 540, y2: 549 }, // Frame 4
      { x1: 597, y1: 485, x2: 737, y2: 549 }, // Frame 5
      { x1: 777, y1: 485, x2: 973, y2: 549 }, // Frame 6
    ],
    stone_ring: [
      { x1: 61, y1: 581, x2: 89, y2: 644 },  // Frame 1
      { x1: 184, y1: 581, x2: 221, y2: 644 }, // Frame 2
      { x1: 304, y1: 581, x2: 374, y2: 644 }, // Frame 3
      { x1: 443, y1: 581, x2: 552, y2: 644 }, // Frame 4
      { x1: 628, y1: 581, x2: 751, y2: 644 }, // Frame 5
    ]
  };

  // Check actual pixel bounds for each frame and print them
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

  // Row 1 tight bounds (Y search 40 to 205)
  console.log('--- Row 1 tight bounds ---');
  const r1Frames = [
    getTightBounds(40, 40, 90, 205),
    getTightBounds(130, 40, 190, 205),
    getTightBounds(240, 40, 320, 205),
    getTightBounds(365, 40, 470, 205),
    getTightBounds(505, 40, 615, 205),
    getTightBounds(645, 40, 765, 205),
    getTightBounds(790, 40, 995, 205),
  ];
  console.log('R1 frames:', r1Frames);

  // Row 2 tight bounds (Y search 210 to 370)
  console.log('--- Row 2 tight bounds ---');
  const r2Frames = [
    getTightBounds(40, 210, 105, 370),
    getTightBounds(160, 210, 245, 370),
    getTightBounds(305, 210, 405, 370),
    getTightBounds(460, 210, 585, 370),
    getTightBounds(630, 210, 770, 370),
    getTightBounds(810, 210, 975, 370),
  ];
  console.log('R2 frames:', r2Frames);

  // Row 3 tight bounds (Y search 375 to 468)
  console.log('--- Row 3 tight bounds ---');
  const r3Frames = [
    getTightBounds(30, 375, 115, 468),
    getTightBounds(150, 375, 250, 468),
    getTightBounds(280, 375, 410, 468),
    getTightBounds(440, 375, 590, 468),
    getTightBounds(615, 375, 768, 468),
    getTightBounds(795, 375, 995, 468),
  ];
  console.log('R3 frames:', r3Frames);

  // Row 4 tight bounds (Y search 470 to 565)
  console.log('--- Row 4 tight bounds ---');
  const r4Frames = [
    getTightBounds(35, 470, 90, 565),
    getTightBounds(120, 470, 210, 565),
    getTightBounds(250, 470, 380, 565),
    getTightBounds(415, 470, 545, 565),
    getTightBounds(590, 470, 740, 565),
    getTightBounds(770, 470, 980, 565),
  ];
  console.log('R4 frames:', r4Frames);

  // Row 5 tight bounds (Y search 568 to 660)
  console.log('--- Row 5 tight bounds ---');
  const r5Frames = [
    getTightBounds(55, 568, 95, 660),
    getTightBounds(175, 568, 230, 660),
    getTightBounds(295, 568, 385, 660),
    getTightBounds(435, 568, 560, 660),
    getTightBounds(620, 568, 760, 660),
  ];
  console.log('R5 frames:', r5Frames);
}

processSprites().catch(console.error);
