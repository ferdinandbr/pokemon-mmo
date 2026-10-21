import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testVisuals() {
  const width = 800;
  const height = 480;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Dark retro background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Grid for pixel art reference
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const vfxDir = path.resolve(__dirname, '../client/public/assets/battle/animations');

  // 1. Load Megahorn Drill
  const megahornImg = await loadImage(path.join(vfxDir, 'vfx/custom/megahorn_drill.png'));
  // 2. Load Pin Missile Spike
  const pinImg = await loadImage(path.join(vfxDir, 'vfx/custom/pin_missile_spike.png'));
  // 3. Load String Shot Silk
  const silkImg = await loadImage(path.join(vfxDir, 'vfx/custom/string_shot_silk.png'));
  // 4. Load Spider Web
  const webImg = await loadImage(path.join(vfxDir, 'vfx/custom/spider_web.png'));
  // 5. Load Teeth Bite
  const teethImg = await loadImage(path.join(vfxDir, 'core/teeth.png'));
  // 6. Load Spacial Rend (diminished for Megahorn impact)
  const spacialRendImg = await loadImage(path.join(vfxDir, 'vfx/dimension/spacial_rend.png'));

  ctx.imageSmoothingEnabled = false;

  // Title
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('BUG MOVES VISUAL VERIFICATION (16-BIT PIXEL ART)', 30, 36);

  // Section 1: Megahorn Dash Drill (Frame 0, 2, 4 + angle rotation)
  ctx.font = '14px monospace';
  ctx.fillStyle = '#86efac';
  ctx.fillText('1. Megahorn Dash Drill (64x36px / frame)', 40, 75);
  // Show strip preview
  ctx.drawImage(megahornImg, 0, 0, 64, 36, 40, 90, 64 * 1.5, 36 * 1.5);
  ctx.drawImage(megahornImg, 64 * 2, 0, 64, 36, 160, 90, 64 * 1.5, 36 * 1.5);
  // Rotated in dash simulation
  ctx.save();
  ctx.translate(320, 117);
  ctx.rotate(-0.35);
  ctx.drawImage(megahornImg, 64 * 3, 0, 64, 36, -32 * 1.5, -18 * 1.5, 64 * 1.5, 36 * 1.5);
  ctx.restore();

  // Diminished impact preview (Spacial Rend at scale 0.55)
  ctx.fillStyle = '#93c5fd';
  ctx.fillText('Megahorn Impact (Spacial Rend Scale 0.55)', 440, 75);
  const srFw = spacialRendImg.naturalWidth / 4;
  const srFh = spacialRendImg.naturalHeight / 4;
  ctx.drawImage(spacialRendImg, srFw * 1, srFh * 1, srFw, srFh, 480, 85, srFw * 0.55, srFh * 0.55);

  // Section 2: Pin Missile / Fell Stinger Spikes
  ctx.fillStyle = '#fde047';
  ctx.fillText('2. Pin Missile / Fell Stinger Spike (48x20px / frame)', 40, 185);
  ctx.drawImage(pinImg, 0, 0, 48, 20, 40, 200, 48 * 1.3, 20 * 1.3);
  ctx.drawImage(pinImg, 48 * 2, 0, 48, 20, 120, 200, 48 * 1.3, 20 * 1.3);
  // Rotated flight simulation
  ctx.save();
  ctx.translate(240, 215);
  ctx.rotate(0.25);
  ctx.drawImage(pinImg, 48 * 4, 0, 48, 20, -24 * 1.3, -10 * 1.3, 48 * 1.3, 20 * 1.3);
  ctx.restore();

  // Section 3: String Shot Silk Stream
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('3. String Shot Silk Thread (64x32px / frame)', 440, 185);
  ctx.drawImage(silkImg, 0, 0, 64, 32, 440, 200, 64 * 1.2, 32 * 1.2);
  ctx.drawImage(silkImg, 64 * 2, 0, 64, 32, 530, 200, 64 * 1.2, 32 * 1.2);
  // Rotated stream simulation
  ctx.save();
  ctx.translate(660, 220);
  ctx.rotate(-0.2);
  ctx.drawImage(silkImg, 64 * 3, 0, 64, 32, -32 * 1.2, -16 * 1.2, 64 * 1.2, 32 * 1.2);
  ctx.restore();

  // Section 4: Spider Web & Sticky Web
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText('4. Spider Web & Sticky Web (Shared 8-frame web)', 40, 305);
  const webFw = webImg.naturalWidth / 8;
  const webFh = webImg.naturalHeight;
  ctx.drawImage(webImg, webFw * 3, 0, webFw, webFh, 60, 320, webFw * 0.9, webFh * 0.9);
  ctx.drawImage(webImg, webFw * 6, 0, webFw, webFh, 200, 320, webFw * 0.9, webFh * 0.9);

  // Section 5: Bug Bite (Teeth.png clamping)
  ctx.fillStyle = '#fdba74';
  ctx.fillText('5. Bug Bite (Teeth Fangs Clamping)', 440, 305);
  const teethFw = teethImg.naturalWidth / 5;
  const teethFh = teethImg.naturalHeight / 5;
  ctx.drawImage(teethImg, teethFw * 1, 0, teethFw, teethFh, 460, 325, teethFw * 0.7, teethFh * 0.7);
  ctx.drawImage(teethImg, teethFw * 3, 0, teethFw, teethFh, 570, 325, teethFw * 0.7, teethFh * 0.7);

  // Save artifact
  const outPath = path.resolve('C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/bug_moves_pixel_art_verified.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('Saved visual verification to:', outPath);
}

testVisuals().catch(console.error);
