const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function cropPokemonSprites() {
  const sourceImage = 'C:/Users/fer/Downloads/pokemons_1st.png';
  const outputDir = path.join(__dirname, '../../client/public/assets/pokemon/overworld');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`[CropScript] Lendo spritesheet de: ${sourceImage}`);
  console.log(`[CropScript] Diretorio de saida: ${outputDir}`);

  // Total grid: 11 rows x 15 cols = 165 blocks
  // Skip blocks:
  // - Row 1, Col 4 (Block 4) -> Venusaur Female duplicate
  // - Row 2, Col 12 (Block 27) -> Pikachu Female duplicate
  // - Blocks > 153 (Row 11 Cols 4..15) -> Empty tail slots

  let pokedexId = 1;
  let skippedCount = 0;

  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 15; col++) {
      const blockIndex = row * 15 + col + 1; // 1-indexed

      // Skip Venusaur F (block 4) and Pikachu F (block 27)
      if (blockIndex === 4 || blockIndex === 27) {
        console.log(`[CropScript] Ignorando bloco duplicado ${blockIndex} (r${row + 1}, c${col + 1})`);
        skippedCount++;
        continue;
      }

      if (pokedexId > 151) {
        break;
      }

      const x = col * 64;
      const y = row * 128;

      const formattedId = String(pokedexId).padStart(3, '0');
      const outputFile = path.join(outputDir, `${formattedId}.png`);

      await sharp(sourceImage)
        .extract({ left: x, top: y, width: 64, height: 128 })
        .toFile(outputFile);

      pokedexId++;
    }
  }

  console.log(`===========================================`);
  console.log(`[CropScript] Concluido! ${pokedexId - 1} sprites extraidos com sucesso.`);
  console.log(`[CropScript] Blocos duplicados ignorados: ${skippedCount}`);
  console.log(`===========================================`);
}

cropPokemonSprites().catch(err => {
  console.error('[CropScript Error]:', err);
  process.exit(1);
});
