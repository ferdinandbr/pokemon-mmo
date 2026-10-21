const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function testGroundRender() {
  const dir = 'e:/Projetos/PokeMMO/client/public/assets/battle/animations/vfx/earth';
  const files = [
    { name: 'ground_crater_round.png', frames: 7, fw: 224, fh: 160, label: 'Crater Round (7 frames)' },
    { name: 'ground_crater_spiked.png', frames: 6, fw: 192, fh: 160, label: 'Crater Spiked (6 frames)' },
    { name: 'ground_fissure_crack.png', frames: 6, fw: 224, fh: 80, label: 'Fissure Crack (6 frames)' },
    { name: 'ground_skid_trench.png', frames: 6, fw: 224, fh: 80, label: 'Skid Trench (6 frames)' },
    { name: 'ground_stone_ring.png', frames: 5, fw: 160, fh: 80, label: 'Stone Ring (5 frames)' },
  ];

  const totalW = 1500;
  const totalH = 900;
  const canvas = createCanvas(totalW, totalH);
  const ctx = canvas.getContext('2d');

  // Background simulating battle arena ground
  ctx.fillStyle = '#4a7541'; // Grass arena tone
  ctx.fillRect(0, 0, totalW, totalH);

  // Subtle grid / arena texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < totalW; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, totalH); ctx.stroke();
  }
  for (let y = 0; y < totalH; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(totalW, y); ctx.stroke();
  }

  let curY = 30;

  for (const item of files) {
    const img = await loadImage(path.join(dir, item.name));
    
    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(item.label, 30, curY + 20);

    // Draw all frames horizontally
    for (let f = 0; f < item.frames; f++) {
      const fx = 30 + f * (item.fw + 10);
      const fy = curY + 30;

      // Draw faint frame boundary
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.strokeRect(fx, fy, item.fw, item.fh);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, f * item.fw, 0, item.fw, item.fh, fx, fy, item.fw, item.fh);

      // Frame number tag
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px monospace';
      ctx.fillText(`f${f + 1}`, fx + 6, fy + 16);
    }

    curY += item.fh + 45;
  }

  const outPath = 'C:/Users/fer/.gemini/antigravity-ide/brain/15788dd7-c0a6-467a-8aa1-cd424e56ec4b/test_ground_destruction_preview.png';
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Saved preview to ${outPath}`);
}

testGroundRender().catch(console.error);
