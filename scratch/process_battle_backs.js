const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = 'C:\\Users\\fer\\Desktop\\BATTLE BACK';
const TARGET_DIR = path.resolve(__dirname, '../client/public/assets/battle/backgrounds');
const BATTLE_DIR = path.resolve(__dirname, '../client/public/assets/battle');

async function processBattleBacks() {
  console.log('=== 1. PROCESSANDO BATTLE BACKS (RESIZE x2 com NEAREST) ===');
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.toLowerCase().endsWith('.png'));
  console.log(`Encontradas ${files.length} imagens em "${SOURCE_DIR}".`);

  const processedList = [];

  for (const file of files) {
    const srcPath = path.join(SOURCE_DIR, file);
    const metadata = await sharp(srcPath).metadata();
    const newWidth = metadata.width * 2;
    const newHeight = metadata.height * 2;

    // Gerar slug limpo: "TALL GRASS NIGHT.png" -> "tall-grass-night.png"
    const baseName = path.parse(file).name;
    const slugName = baseName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '') + '.png';

    const destPathSlug = path.join(TARGET_DIR, slugName);

    // Resize x2 com nearest neighbor para pixel art impecável
    await sharp(srcPath)
      .resize({
        width: newWidth,
        height: newHeight,
        kernel: sharp.kernel.nearest
      })
      .png()
      .toFile(destPathSlug);

    console.log(`✔ [x2] ${file} (${metadata.width}x${metadata.height}) -> ${slugName} (${newWidth}x${newHeight})`);
    processedList.push({ file, slugName, newWidth, newHeight });
  }

  // Criar também uma cópia padrão "default_battle_bg.png" apontando para tall-grass.png
  const defaultSrc = path.join(TARGET_DIR, 'tall-grass.png');
  const defaultDest = path.join(TARGET_DIR, 'default.png');
  if (fs.existsSync(defaultSrc)) {
    fs.copyFileSync(defaultSrc, defaultDest);
    console.log(`✔ Criado fallback padrão: backgrounds/default.png`);
  }

  console.log('\n=== 2. REMOVENDO ASSETS OBSOLETOS (BGs e STANDS ANTIGOS) ===');
  const battleFiles = fs.readdirSync(BATTLE_DIR);
  let deletedCount = 0;

  for (const bf of battleFiles) {
    const fullPath = path.join(BATTLE_DIR, bf);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) continue;

    const lower = bf.toLowerCase();
    const shouldDelete =
      lower.startsWith('battlebg') ||
      lower.startsWith('enemybase') ||
      lower.startsWith('playerbase') ||
      lower.startsWith('bg_1_forest');

    if (shouldDelete) {
      fs.unlinkSync(fullPath);
      deletedCount++;
      // Log primeiros e contagem
      if (deletedCount <= 10 || deletedCount % 20 === 0) {
        console.log(`🗑 Removido: ${bf}`);
      }
    }
  }

  console.log(`\n✅ Concluído! Total de arquivos antigos removidos: ${deletedCount}`);
  console.log(`✅ Total de novos planos de fundo x2 criados: ${processedList.length}`);
}

processBattleBacks().catch(console.error);
