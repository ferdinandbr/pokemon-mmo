/**
 * generate-pokemon-sprites.js
 *
 * Recorta o spritesheet original em PNGs individuais de 64×128
 * (2 colunas × 4 linhas de 32×32) para cada um dos 151 Pokémon da Gen 1,
 * respeitando os limites exatos demarcados em pokemons_1st_guidelines.png.
 *
 * Linhas horizontais divisórias:
 *   y = [128, 257, 386, 515, 644, 773, 902, 1031, 1160, 1289]
 *
 * Linhas verticais divisórias:
 *   Linhas 0 a 6: [64, 129, 194, 258, 323, 388, 453, 518, 583, 648, 713, 778, 843, 908]
 *   Linhas 7 a 8: [63, 128, 193, 258, 323, 388, 453, 518, 583, 648, 713, 778, 843, 908]
 *   Linha 9:      [63, 128, 193, 258, 323, 388, 453, 518, 583, 648, 713, 778, 843, 905]
 *   Linha 10:     [63, 128, 193]
 *
 * ATENÇÃO — Duplicatas de gênero no spritesheet:
 *   Slot 3  (linha 0, col 3): Venusaur fêmea  → ignorado (idêntico ao macho)
 *   Slot 26 (linha 1, col 11): Pikachu fêmea → ignorado (idêntico ao macho)
 *
 * Usage:
 *   node scripts/generate-pokemon-sprites.js [--input PATH] [--output DIR]
 */

const path = require('path');
const fs = require('fs');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('sharp not found. Install with: npm install sharp');
  process.exit(1);
}

const args = process.argv.slice(2);
function getArg(flag, def) {
  const i = args.indexOf(flag);
  return (i !== -1 && args[i + 1]) ? args[i + 1] : def;
}

const DEFAULT_INPUT = fs.existsSync('C:/Users/fer/Downloads/pokemons_1st.png')
  ? 'C:/Users/fer/Downloads/pokemons_1st.png'
  : 'C:/Users/fer/Downloads/pokemons_1st_guidelines.png';

const INPUT = getArg('--input', DEFAULT_INPUT);
const OUTPUT_DIR = getArg('--output', path.join(__dirname, '../client/public/assets/pokemon/overworld/normal'));

const H_LINES = [128, 257, 386, 515, 644, 773, 902, 1031, 1160, 1289];
const POKEMON_PER_ROW = 15;

function getCell(row, col, imgHeight) {
  const yTop = row === 0 ? 0 : H_LINES[row - 1] + 1;
  const height = Math.min(128, imgHeight - yTop);

  let vLines;
  if (row <= 6) {
    vLines = [64, 129, 194, 258, 323, 388, 453, 518, 583, 648, 713, 778, 843, 908];
  } else if (row <= 8) {
    vLines = [63, 128, 193, 258, 323, 388, 453, 518, 583, 648, 713, 778, 843, 908];
  } else if (row === 9) {
    vLines = [63, 128, 193, 258, 323, 388, 453, 518, 583, 648, 713, 778, 843, 905];
  } else {
    vLines = [63, 128, 193];
  }

  const left = col === 0 ? 0 : vLines[col - 1] + 1;
  const right = col < vLines.length ? vLines[col] - 1 : 969;
  const width = Math.min(64, right - left + 1);

  return { left, top: yTop, width, height };
}

/**
 * Maps a Pokédex number (1-151) to the zero-based slot index in the sheet.
 *
 * Slots pulados:
 *   Slot 3  → Venusaur fêmea
 *   Slot 26 → Pikachu fêmea
 */
function pokedexToSlot(pokeDex) {
  if (pokeDex <= 3)  return pokeDex - 1;
  if (pokeDex <= 25) return pokeDex;
  return pokeDex + 1;
}

async function generate() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Input file not found: ${INPUT}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const meta = await sharp(INPUT).metadata();
  console.log(`Source sheet: ${INPUT} (${meta.width}x${meta.height})`);
  console.log(`Using exact guidelines. Skipping: slot 3 (Venusaur-F) and slot 26 (Pikachu-F)`);

  let generated = 0;
  let errors = 0;

  for (let pokeDex = 1; pokeDex <= 151; pokeDex++) {
    const slot = pokedexToSlot(pokeDex);

    const colGroup = slot % POKEMON_PER_ROW;
    const rowGroup = Math.floor(slot / POKEMON_PER_ROW);

    const cell = getCell(rowGroup, colGroup, meta.height);
    const outFile = path.join(OUTPUT_DIR, `${String(pokeDex).padStart(3, '0')}.png`);

    try {
      let img = sharp(INPUT).extract({
        left: cell.left,
        top: cell.top,
        width: cell.width,
        height: cell.height
      });

      // Garante dimensão exata de 64x128 preenchendo bordas com transparente se faltar 1 ou 2 px
      if (cell.width !== 64 || cell.height !== 128) {
        img = img.extend({
          top: 0,
          bottom: Math.max(0, 128 - cell.height),
          left: 0,
          right: Math.max(0, 64 - cell.width),
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        });
      }

      await img.png().toFile(outFile);

      generated++;
      if (pokeDex % 15 === 0 || pokeDex === 151) {
        process.stdout.write(`\r[${pokeDex}/151] #${String(pokeDex).padStart(3, '0')} -> slot ${slot} (col=${colGroup}, row=${rowGroup})`);
      }
    } catch (err) {
      console.error(`\nError generating #${pokeDex} (${outFile}): ${err.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Concluído! Gerados ${generated} sprites com sucesso (${errors} erros).`);
  console.log(`Destino: ${OUTPUT_DIR}`);
}

generate().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
