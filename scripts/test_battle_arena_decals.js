const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Import DecalSystem simulation
const dir = 'e:/Projetos/PokeMMO/client/public/assets/battle/animations/vfx/earth';

async function testArenaBattleGround() {
  const w = 1024;
  const h = 768;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Load arena background if exists, else render grass arena
  const arenaBgPath = 'e:/Projetos/PokeMMO/client/public/assets/battle/battle_bg.png';
  if (fs.existsSync(arenaBgPath)) {
    const bgImg = await loadImage(arenaBgPath);
    ctx.drawImage(bgImg, 0, 0, w, h);
  } else {
    // Arena turf
    ctx.fillStyle = '#4c7c42';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#3f6b36';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 440, 260, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Load ground destruction sprites
  const roundImg = await loadImage(path.join(dir, 'ground_crater_round.png'));
  const spikedImg = await loadImage(path.join(dir, 'ground_crater_spiked.png'));
  const fissureImg = await loadImage(path.join(dir, 'ground_fissure_crack.png'));
  const skidImg = await loadImage(path.join(dir, 'ground_skid_trench.png'));
  const ringImg = await loadImage(path.join(dir, 'ground_stone_ring.png'));

  ctx.imageSmoothingEnabled = false;

  // 1. Crater Round (Final Frame 6 of 7, 224x160)
  // Positioned at (320, 480) - Heavy slam impact
  {
    const fw = 224, fh = 160, frame = 6;
    const scale = 0.55;
    const dw = fw * scale, dh = fh * scale;
    ctx.save();
    ctx.translate(320, 480);
    ctx.drawImage(roundImg, frame * fw, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Variation 1: crater_round', 240, 550);
  }

  // 2. Crater Spiked (Final Frame 5 of 6, 192x160)
  // Positioned at (680, 460) - Earth Power / Stone Edge detonation
  {
    const fw = 192, fh = 160, frame = 5;
    const scale = 0.58;
    const dw = fw * scale, dh = fh * scale;
    ctx.save();
    ctx.translate(680, 460);
    ctx.drawImage(spikedImg, frame * fw, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Variation 2: crater_spiked', 600, 530);
  }

  // 3. Fissure Crack (Final Frame 5 of 6, 224x80)
  // Positioned at (500, 360) - Earthquake fault line
  {
    const fw = 224, fh = 80, frame = 5;
    const scale = 0.72;
    const dw = fw * scale, dh = fh * scale;
    ctx.save();
    ctx.translate(500, 360);
    ctx.drawImage(fissureImg, frame * fw, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Variation 3: fissure_crack', 430, 410);
  }

  // 4. Skid Trench (Final Frame 5 of 6, 224x80)
  // Positioned at (250, 320) angled at 25 degrees - Knockback recoil furrow
  {
    const fw = 224, fh = 80, frame = 5;
    const scale = 0.60;
    const dw = fw * scale, dh = fh * scale;
    const angle = 0.28;
    ctx.save();
    ctx.translate(250, 320);
    ctx.rotate(angle);
    // Left-anchored
    ctx.drawImage(skidImg, frame * fw, 0, fw, fh, 0, -dh / 2, dw, dh);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Variation 4: skid_trench (recoil furrow)', 200, 375);
  }

  // 5. Stone Ring (Final Frame 4 of 5, 160x80)
  // Positioned at (760, 310) - Seismic shockwave ring
  {
    const fw = 160, fh = 80, frame = 4;
    const scale = 0.65;
    const dw = fw * scale, dh = fh * scale;
    ctx.save();
    ctx.translate(760, 310);
    ctx.drawImage(ringImg, frame * fw, 0, fw, fh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Variation 5: stone_ring', 700, 360);
  }

  // Overlay HUD info
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(20, 20, 380, 80);
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Novo Sistema de Destruição de Solo (Pixel Art)', 35, 45);
  ctx.fillStyle = '#e0e0e0';
  ctx.font = '13px sans-serif';
  ctx.fillText('Zero vetores procedurais. 100% sprites fiéis com', 35, 68);
  ctx.fillText('animação progressiva e fixação de crateras na arena.', 35, 86);

  const outPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/test_battle_ground_arena.png';
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Saved battle ground arena simulation to ${outPath}`);
}

testArenaBattleGround().catch(console.error);
