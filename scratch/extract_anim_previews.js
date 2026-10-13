const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const animDir = path.resolve('client/public/assets/battle/animations');
const previewDir = path.resolve(animDir, 'previews');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

const animConfigs = [
  { name: 'impact_fisico', file: '003-Attack01.png', cols: 5, frame: 1, label: 'Impacto Físico (Estrela Branca)' },
  { name: 'cortes_marciais', file: '004-Attack02.png', cols: 5, frame: 2, label: 'Cortes Marciais e Garras' },
  { name: 'fogo_labareda', file: '015-Fire01.png', cols: 5, frame: 2, label: 'Labareda de Fogo' },
  { name: 'fogo_vortice', file: '015-Fire01.png', cols: 5, frame: 7, label: 'Vórtice de Chamas' },
  { name: 'raio_eletrico', file: '017-Thunder01.png', cols: 5, frame: 2, label: 'Raio / Relâmpago Elétrico' },
  { name: 'agua_bolhas', file: '018-Water01.png', cols: 5, frame: 1, label: 'Jato de Bolhas d\'Água' },
  { name: 'agua_tsunami', file: '018-Water01.png', cols: 5, frame: 8, label: 'Onda Torrencial / Tsunami' },
  { name: 'pulso_psiquico', file: '023-Burst01.png', cols: 5, frame: 3, label: 'Pulso de Energia Psíquica' },
  { name: 'brilho_feerico', file: '023-Burst01.png', cols: 5, frame: 2, label: 'Brilho Mágico Feérico' },
  { name: 'explosao_termica', file: '030-Explosion01.png', cols: 5, frame: 3, label: 'Grande Explosão Térmica' },
  { name: 'espectral_fantasma', file: '030-Explosion01.png', cols: 5, frame: 6, label: 'Ectoplasma Espectral' },
  { name: 'terremoto_pedra', file: 'Earth1.png', cols: 5, frame: 3, label: 'Tremor e Rochas Terrestres' },
  { name: 'gelo_nevasca', file: 'Ice1.png', cols: 5, frame: 4, label: 'Nevasca e Estilhaços de Gelo' },
  { name: 'folhas_vinha', file: 'grass.png', cols: 5, frame: 6, label: 'Folhas e Fibras Vegetais' },
  { name: 'veneno_toxico', file: 'poison.png', cols: 5, frame: 4, label: 'Névoa Tóxica e Bolhas Ácidas' },
  { name: 'mandibula_mordida', file: 'teeth.png', cols: 5, frame: 2, label: 'Mandíbula de Presas' },
  { name: 'vento_cortante', file: 'Wind1.png', cols: 5, frame: 10, label: 'Lâminas Cortantes de Vento' }
];

async function extractPreviews() {
  const frameW = 192;
  const frameH = 192;

  for (const cfg of animConfigs) {
    const inputPath = path.join(animDir, cfg.file);
    if (!fs.existsSync(inputPath)) {
      console.warn('Missing file:', inputPath);
      continue;
    }

    const col = cfg.frame % cfg.cols;
    const row = Math.floor(cfg.frame / cfg.cols);
    const left = col * frameW;
    const top = row * frameH;

    const outputPath = path.join(previewDir, `${cfg.name}.png`);

    try {
      await sharp(inputPath)
        .extract({ left, top, width: frameW, height: frameH })
        .toFile(outputPath);
      console.log(`Generated: ${cfg.name}.png`);
    } catch (err) {
      console.error(`Error on ${cfg.name}:`, err.message);
    }
  }
}

extractPreviews();
