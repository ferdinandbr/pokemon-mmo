import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { MOVES_BY_ID } from '../client/src/battle/movesDatabase.js';

const ids = [22, 25, 27, 29, 30, 31, 32, 34, 39, 42, 43, 45, 49, 575, 621];

async function run() {
  console.log('Testing canvas simulation for all 15 Dark moves...');
  const canvas = createCanvas(480, 220);
  const ctx = canvas.getContext('2d');

  for (const id of ids) {
    const move = MOVES_BY_ID[id];
    if (!move) throw new Error(`Move #${id} not found`);

    const imgPath = 'client/public/assets/battle/animations/' + move.visual.file;
    if (!fs.existsSync(imgPath)) throw new Error(`Image not found: ${imgPath}`);

    const img = await loadImage(imgPath);
    if (!img) throw new Error(`Could not load image: ${imgPath}`);

    // Verify properties
    const cols = move.visual.cols;
    const rows = move.visual.rows || 1;
    const fw = img.width / cols;
    const fh = img.height / rows;

    if (isNaN(fw) || fw <= 0 || isNaN(fh) || fh <= 0) {
      throw new Error(`Invalid frame dimensions for move #${id} ${move.name}: ${fw}x${fh}`);
    }

    // Test drawing a frame directly
    ctx.clearRect(0, 0, 480, 220);
    ctx.drawImage(img, 0, 0, fw, fh, 100, 100, fw, fh);

    console.log(`✓ Move #${id} (${move.name.padEnd(16)}): Frame size ${fw}x${fh}, Sheet: ${img.width}x${img.height}`);
  }

  console.log('\n>>> ALL 15 DARK MOVES PASSED SIMULATION & FRAME TEST! <<<');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
