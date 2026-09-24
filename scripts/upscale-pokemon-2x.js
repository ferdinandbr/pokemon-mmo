const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseDir = path.join(__dirname, '../client/public/assets/pokemon/overworld');
const dirs = [path.join(baseDir, 'normal'), path.join(baseDir, 'shiny')];

async function upscaleAll() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => /^\d{3}\.png$/.test(f));
    console.log(`[${path.basename(dir)}] Encontrados ${files.length} arquivos de sprites.`);

  let upscaled = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const meta = await sharp(filePath).metadata();

    // Se já tiver 128x256 (ou maior), ignora
    if (meta.width >= 128 && meta.height >= 256) {
      skipped++;
      continue;
    }

    const tempPath = path.join(dir, `_temp_${file}`);
    await sharp(filePath)
      .resize(meta.width * 2, meta.height * 2, {
        kernel: sharp.kernel.nearest
      })
      .toFile(tempPath);

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    upscaled++;
  }

    console.log(`[${path.basename(dir)}] Concluído! ${upscaled} sprites ampliados para 2x (Nearest-Neighbor). ${skipped} já estavam em 2x.`);
  }
}

upscaleAll().catch(err => {
  console.error('Erro no upscale:', err);
  process.exit(1);
});
