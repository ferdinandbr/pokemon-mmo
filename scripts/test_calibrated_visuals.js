const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function testVisuals() {
  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background: Sand field with grass border (like the actual arena)
  ctx.fillStyle = '#6bb070';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#edd197';
  ctx.fillRect(40, 30, width - 80, height - 60);

  // Bounds line (which used to clip and cut off decals!)
  const bounds = { minX: 80, minY: 60, maxX: width - 80, maxY: height - 60 };
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.20)';
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  ctx.setLineDash([]);

  // Load crater sprites
  const craterRoundPath = path.resolve('client/public/assets/battle/animations/vfx/earth/ground_crater_round.png');
  const craterSpikedPath = path.resolve('client/public/assets/battle/animations/vfx/earth/ground_crater_spiked.png');
  const beamPath = path.resolve('client/public/assets/battle/animations/vfx/magic/beams/beam_water.png');
  const poliwhirlPath = path.resolve('client/public/assets/pokemon/pmd/normal/061/Idle-Anim.png');

  const imgCraterRound = await loadImage(craterRoundPath);
  const imgCraterSpiked = await loadImage(craterSpikedPath);
  const imgBeam = fs.existsSync(beamPath) ? await loadImage(beamPath) : null;
  const imgPoli = fs.existsSync(poliwhirlPath) ? await loadImage(poliwhirlPath) : null;

  const drawCrater = (img, x, y, scale, spiked = false) => {
    const fw = spiked ? 192 : 224;
    const fh = 160;
    const totalFrames = spiked ? 6 : 7;
    const lastFrame = totalFrames - 1;
    const dw = fw * scale;
    const dh = fh * scale;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, lastFrame * fw, 0, fw, fh, x - dw / 2, y - dh / 2, dw, dh);
  };

  // 1. Crater at bounds edge (80, 220) - notice NO straight cut-off edge!
  drawCrater(imgCraterRound, 90, 220, 0.40);

  // 2. Medium and small craters
  drawCrater(imgCraterSpiked, 320, 160, 0.35, true);
  drawCrater(imgCraterRound, 390, 240, 0.28);

  // 3. Render Pokémon (Poliwhirl) and Beam
  const casterX = 580;
  const casterY = 240;

  if (imgPoli) {
    const fw = imgPoli.width / 4; // 40
    const fh = imgPoli.height / 8; // 40
    const scale = 2.4;
    const dw = fw * scale;
    const dh = fh * scale;
    ctx.imageSmoothingEnabled = false;
    // Draw Idle frame facing Left (direction index 6)
    ctx.drawImage(imgPoli, 0, 6 * fh, fw, fh, casterX - dw / 2, casterY - dh * 0.86, dw, dh);
  }

  // Target Pokemon on the left
  const targetX = 200;
  const targetY = 220;
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(targetX, targetY - 18, 16, 0, Math.PI * 2);
  ctx.fill();

  // Compute beam origin (strictly in front of caster at head height)
  // Dynamic head height: spriteHeight * 0.60 above feet
  const spriteHeight = 40 * 2.4;
  const headOffsetY = -Math.round(spriteHeight * 0.60);
  const headX = casterX;
  const headY = casterY + headOffsetY;
  const targetHeadY = targetY - 18;
  const angle = Math.atan2(targetHeadY - headY, targetX - headX);
  const forwardDist = 26;
  const originX = Math.round(headX + Math.cos(angle) * forwardDist);
  const originY = Math.round(headY + Math.sin(angle) * (forwardDist * 0.65));

  // Draw Beam from (originX, originY) to target
  const bdx = targetX - originX;
  const bdy = (targetY - 20) - originY;
  const dist = Math.hypot(bdx, bdy);
  const bAngle = Math.atan2(bdy, bdx);

  ctx.save();
  ctx.translate(originX, originY);
  ctx.rotate(bAngle);

  // Muzzle Charge Glow
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  if (imgBeam) {
    const fw = imgBeam.width / 4;
    const fh = imgBeam.height / 4;
    const beamH = fh * 0.38;
    ctx.drawImage(imgBeam, 0, 0, fw, fh, 0, -beamH / 2, dist, beamH);
  } else {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.fillRect(0, -10, dist, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -3, dist, 6);
  }
  ctx.restore();

  // Origin point indicator
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(originX, originY, 4, 0, Math.PI * 2);
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Origem do Beam: Em frente ao corpo na altura da cabeca', 410, 140);
  ctx.fillText('Cratera na borda: Sem borda de corte!', 45, 145);
  ctx.fillText('Tamanho proporcional calibrado (~60-90px)', 270, 310);

  const outPath = path.resolve('C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/test_calibrated_visuals.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('Saved test image to:', outPath);
}

testVisuals().catch(console.error);
