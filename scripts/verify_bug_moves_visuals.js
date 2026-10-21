import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Test render of the 7 bug moves to verify pixel-art graphics and impacts
async function testBugMovesVisuals() {
  console.log('Testing bug moves visual assets...');

  const assets = [
    'client/public/assets/battle/animations/vfx/custom/megahorn_drill.png',
    'client/public/assets/battle/animations/vfx/custom/pin_missile_spike.png',
    'client/public/assets/battle/animations/vfx/custom/string_shot_silk.png',
    'client/public/assets/battle/animations/vfx/custom/spider_web.png',
    'client/public/assets/battle/animations/core/attack_physical_01.png',
    'client/public/assets/battle/animations/core/teeth.png',
    'client/public/assets/battle/animations/vfx/smear/smear_v_01.png'
  ];

  for (const asset of assets) {
    if (fs.existsSync(asset)) {
      const img = await loadImage(asset);
      console.log(`[OK] ${path.basename(asset)}: ${img.width}x${img.height} loaded`);
    } else {
      console.error(`[FAIL] Missing asset: ${asset}`);
    }
  }

  // Create test preview collage showing all 7 moves
  const width = 800;
  const height = 480;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Bug Moves Visual Verification Preview (Pixel Art Authentic)', 20, 30);

  // 1. Megahorn Drill
  const megahornImg = await loadImage('client/public/assets/battle/animations/vfx/custom/megahorn_drill.png');
  ctx.fillText('1. Megahorn Dash Drill (64x36)', 30, 70);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(megahornImg, 0, 0, 64, 36, 40, 80, 64 * 2, 36 * 2);

  // 2. Megahorn Impact
  const physImg = await loadImage('client/public/assets/battle/animations/core/attack_physical_01.png');
  ctx.fillText('2. Megahorn Impact (attack_physical_01.png)', 280, 70);
  ctx.drawImage(physImg, 0, 0, 192, 192, 280, 80, 192 * 0.55, 192 * 0.55);

  // 3. X-Scissor dual cuts
  const smearImg = await loadImage('client/public/assets/battle/animations/vfx/smear/smear_v_01.png');
  ctx.fillText('3. X-Scissor Dual Slashes (Crossing Smeared Cuts)', 520, 70);
  ctx.save();
  ctx.translate(620, 130);
  ctx.rotate(-0.785);
  ctx.drawImage(smearImg, 0, 0, 96, 96, -48, -48, 96, 96);
  ctx.restore();
  ctx.save();
  ctx.translate(620, 130);
  ctx.rotate(0.785);
  ctx.scale(-1, 1);
  ctx.drawImage(smearImg, 0, 0, 96, 96, -48, -48, 96, 96);
  ctx.restore();

  // 4. Bug Bite
  const teethImg = await loadImage('client/public/assets/battle/animations/core/teeth.png');
  ctx.fillText('4. Bug Bite (teeth.png)', 30, 220);
  ctx.drawImage(teethImg, 0, 0, 192, 192, 40, 230, 192 * 0.55, 192 * 0.55);

  // 5. Pin Missile / Fell Stinger
  const pinImg = await loadImage('client/public/assets/battle/animations/vfx/custom/pin_missile_spike.png');
  ctx.fillText('5. Pin Missile & Fell Stinger Spike (48x20)', 280, 220);
  ctx.drawImage(pinImg, 0, 0, 48, 20, 290, 245, 48 * 2.2, 20 * 2.2);

  // 6. String Shot
  const silkImg = await loadImage('client/public/assets/battle/animations/vfx/custom/string_shot_silk.png');
  ctx.fillText('6. String Shot Silk Stream (64x32)', 520, 220);
  ctx.drawImage(silkImg, 0, 0, 64, 32, 530, 235, 64 * 1.8, 32 * 1.8);

  // 7. Sticky Web / Spider Web
  const webImg = await loadImage('client/public/assets/battle/animations/vfx/custom/spider_web.png');
  ctx.fillText('7. Sticky Web / Spider Web (spider_web.png)', 30, 350);
  ctx.drawImage(webImg, 0, 0, 192, 192, 40, 360, 192 * 0.5, 192 * 0.5);

  const outPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/bug_moves_all_verified.png';
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Saved composite test preview to: ${outPath}`);
}

testBugMovesVisuals().catch(console.error);
