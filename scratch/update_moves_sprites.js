const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const animDir = path.resolve('client/public/assets/battle/animations');
const clientPreviewDir = path.resolve(animDir, 'previews');
const docsDir = path.resolve('docs');
const docsPreviewDir = path.resolve(docsDir, 'previews');

if (!fs.existsSync(clientPreviewDir)) fs.mkdirSync(clientPreviewDir, { recursive: true });
if (!fs.existsSync(docsPreviewDir)) fs.mkdirSync(docsPreviewDir, { recursive: true });

const animConfigs = [
  { key: 'impacto_fisico', file: '003-Attack01.png', cols: 5, frame: 1, label: 'Impacto Físico Genérico' },
  { key: 'cortes_marciais', file: '004-Attack02.png', cols: 5, frame: 2, label: 'Cortes Marciais, Garras e Aço' },
  { key: 'fogo_labareda', file: '015-Fire01.png', cols: 5, frame: 2, label: 'Labareda de Fogo e Sopro Dracônico' },
  { key: 'fogo_vortice', file: '015-Fire01.png', cols: 5, frame: 7, label: 'Vórtice de Chamas' },
  { key: 'raio_eletrico', file: '017-Thunder01.png', cols: 5, frame: 2, label: 'Raio / Relâmpago Elétrico' },
  { key: 'agua_bolhas', file: '018-Water01.png', cols: 5, frame: 1, label: 'Jato de Bolhas d\'Água' },
  { key: 'agua_tsunami', file: '018-Water01.png', cols: 5, frame: 8, label: 'Onda Torrencial / Tsunami' },
  { key: 'pulso_psiquico', file: '023-Burst01.png', cols: 5, frame: 3, label: 'Pulso de Energia Psíquica' },
  { key: 'brilho_feerico', file: '023-Burst01.png', cols: 5, frame: 2, label: 'Brilho Mágico Feérico' },
  { key: 'explosao_termica', file: '030-Explosion01.png', cols: 5, frame: 3, label: 'Grande Explosão Térmica' },
  { key: 'espectral_fantasma', file: '030-Explosion01.png', cols: 5, frame: 6, label: 'Ectoplasma Espectral' },
  { key: 'terremoto_pedra', file: 'Earth1.png', cols: 5, frame: 3, label: 'Tremor Sísmico e Rochas' },
  { key: 'gelo_nevasca', file: 'Ice1.png', cols: 5, frame: 4, label: 'Nevasca e Estilhaços de Gelo' },
  { key: 'folhas_vinha', file: 'grass.png', cols: 5, frame: 6, label: 'Folhas e Fibras Vegetais' },
  { key: 'veneno_toxico', file: 'poison.png', cols: 5, frame: 4, label: 'Névoa Tóxica e Bolhas Ácidas' },
  { key: 'mandibula_mordida', file: 'teeth.png', cols: 5, frame: 2, label: 'Mandíbula de Presas' },
  { key: 'vento_cortante', file: 'Wind1.png', cols: 5, frame: 10, label: 'Lâminas Cortantes de Vento' }
];

async function generateAll() {
  const frameW = 192;
  const frameH = 192;

  // 1. Extract preview images to both client and docs
  for (const cfg of animConfigs) {
    const inputPath = path.join(animDir, cfg.file);
    if (!fs.existsSync(inputPath)) continue;

    const col = cfg.frame % cfg.cols;
    const row = Math.floor(cfg.frame / cfg.cols);
    const left = col * frameW;
    const top = row * frameH;

    const buf = await sharp(inputPath)
      .extract({ left, top, width: frameW, height: frameH })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(clientPreviewDir, `${cfg.key}.png`), buf);
    fs.writeFileSync(path.join(docsPreviewDir, `${cfg.key}.png`), buf);
  }
  console.log('Preview thumbnails generated in docs/previews/ and client/.../previews/');

  // 2. Parse moves from PBS moves.txt
  const pbsPath = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/moves.txt';
  const content = fs.readFileSync(pbsPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l && !l.startsWith('#'));

  function getAttackAnimationConfig(moveName = '') {
    const m = String(moveName).toLowerCase();

    if (m.includes('explos') || m.includes('selfdestruct') || m.includes('self-destruct') || m.includes('detonat') || m.includes('mind blown')) {
      return { file: '030-Explosion01.png', key: 'explosao_termica', cols: 5, rows: 2, startFrame: 0, endFrame: 7, fps: 24, theme: 'Explosão Massiva / Detonação' };
    }
    if (m.includes('psychic') || m.includes('psycho') || m.includes('psywave') || m.includes('psybeam') || m.includes('confus') || m.includes('extrasensory') || m.includes('hypnosis') || m.includes('dream') || m.includes('zen') || m.includes('kinesis') || m.includes('stored') || m.includes('meditat') || m.includes('miracle') || m.includes('psiqu') || m.includes('hipnose')) {
      return { file: '023-Burst01.png', key: 'pulso_psiquico', cols: 5, rows: 2, startFrame: 0, endFrame: 7, fps: 24, theme: 'Pulso de Energia Psíquica' };
    }
    if (m.includes('fairy') || m.includes('fada') || m.includes('moonblast') || m.includes('dazzling') || m.includes('play rough') || m.includes('charm') || m.includes('draining kiss') || m.includes('misty') || m.includes('sweet') || m.includes('fleur')) {
      return { file: '023-Burst01.png', key: 'brilho_feerico', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24, theme: 'Brilho Feérico Encantado' };
    }
    if (m.includes('ghost') || m.includes('spirit') || m.includes('hex') || m.includes('astonish') || m.includes('lick') || m.includes('curse') || m.includes('nightmare') || m.includes('ominous') || m.includes('phantom') || m.includes('shadow ball') || m.includes('fantasma')) {
      return { file: '030-Explosion01.png', key: 'espectral_fantasma', cols: 5, rows: 2, startFrame: 4, endFrame: 7, fps: 24, theme: 'Ectoplasma Espectral Sombrio' };
    }
    if (m.includes('pulse') || m.includes('daze') || m.includes('snarl')) {
      return { file: '023-Burst01.png', key: 'pulso_psiquico', cols: 5, rows: 2, startFrame: 4, endFrame: 7, fps: 24, theme: 'Onda / Pulso Noturno' };
    }
    if (m.includes('shadow') || m.includes('dark') || m.includes('night') || m.includes('thief') || m.includes('pursuit') || m.includes('sucker') || m.includes('payback') || m.includes('feint') || m.includes('assurance') || m.includes('foul') || m.includes('brutal') || m.includes('sombra') || m.includes('ladrao') || m.includes('ladrão')) {
      return { file: '004-Attack02.png', key: 'cortes_marciais', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22, theme: 'Corte Noturno de Sombras' };
    }
    if (m.includes('dragon') || m.includes('draco') || m.includes('outrage') || m.includes('rage') || m.includes('dual chop') || m.includes('dragao') || m.includes('dragão')) {
      return { file: '015-Fire01.png', key: 'fogo_labareda', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24, theme: 'Sopro Dracônico Incandescente' };
    }
    if (m.includes('steel') || m.includes('metal') || m.includes('iron') || m.includes('bullet') || m.includes('gyro') || m.includes('flash cannon') || m.includes('mirror') || m.includes('smart strike') || m.includes('corkscrew') || m.includes('magnet') || m.includes('aco') || m.includes('aço')) {
      return { file: '004-Attack02.png', key: 'cortes_marciais', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22, theme: 'Corte Metálico de Aço' };
    }
    if (m.includes('punch') || m.includes('hit') || m.includes('kick') || m.includes('combat') || m.includes('fight') || m.includes('karate') || m.includes('chop') || m.includes('brick') || m.includes('aura') || m.includes('focus') || m.includes('revenge') || m.includes('force palm') || m.includes('mach') || m.includes('bulk') || m.includes('cross') || m.includes('submission') || m.includes('superpower') || m.includes('soco') || m.includes('chute') || m.includes('scratch') || m.includes('claw') || m.includes('slash') || m.includes('cut') || m.includes('fury') || m.includes('cutter') || m.includes('scissor') || m.includes('aranh') || m.includes('garra')) {
      return { file: '004-Attack02.png', key: 'cortes_marciais', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22, theme: 'Golpe Marcial / Garras e Punhos' };
    }
    if (m.includes('bug') || m.includes('inseto') || m.includes('string') || m.includes('web') || m.includes('leech') || m.includes('signal') || m.includes('silver wind') || m.includes('infestation') || m.includes('quiver') || m.includes('sticky') || m.includes('spider')) {
      return { file: 'grass.png', key: 'folhas_vinha', cols: 5, rows: 5, startFrame: 5, endFrame: 7, fps: 24, theme: 'Rede de Seda / Esporos de Inseto' };
    }
    if (m.includes('spin') || m.includes('vortex') || m.includes('tornado') || m.includes('whirl') || m.includes('redemoinho')) {
      return { file: '015-Fire01.png', key: 'fogo_vortice', cols: 5, rows: 2, startFrame: 5, endFrame: 9, fps: 24, theme: 'Vórtice de Chamas' };
    }
    if (m.includes('fire') || m.includes('ember') || m.includes('flame') || m.includes('blast') || m.includes('erupt') || m.includes('burn') || m.includes('flare') || m.includes('pyro') || m.includes('magma') || m.includes('lava') || m.includes('fogo') || m.includes('brasa') || m.includes('queim') || m.includes('inciner')) {
      return { file: '015-Fire01.png', key: 'fogo_labareda', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24, theme: 'Labareda de Fogo Incandescente' };
    }
    if (m.includes('thunder') || m.includes('electric') || m.includes('electro') || m.includes('eletric') || m.includes('shock') || m.includes('spark') || m.includes('volt') || m.includes('trovao') || m.includes('trovão') || m.includes('choque')) {
      return { file: '017-Thunder01.png', key: 'raio_eletrico', cols: 5, rows: 2, startFrame: 0, endFrame: 5, fps: 24, theme: 'Relâmpago / Descarga Elétrica' };
    }
    if (m.includes('ice') || m.includes('icicle') || m.includes('icy') || m.includes('blizzard') || m.includes('freeze') || m.includes('snow') || m.includes('gelo') || m.includes('frost') || m.includes('hail') || m.includes('aurora')) {
      return { file: 'Ice1.png', key: 'gelo_nevasca', cols: 5, rows: 2, startFrame: 0, endFrame: 8, fps: 24, theme: 'Nevasca e Estilhaços de Gelo' };
    }
    if (m.includes('gust') || m.includes('wind') || m.includes('wing') || m.includes('fly') || m.includes('aerial') || m.includes('air') || m.includes('twister') || m.includes('hurricane') || m.includes('vento') || m.includes('asa')) {
      return { file: 'Wind1.png', key: 'vento_cortante', cols: 5, rows: 3, startFrame: 8, endFrame: 12, fps: 24, theme: 'Lâminas Cortantes de Vento' };
    }
    if (m.includes('vine') || m.includes('leaf') || m.includes('grass') || m.includes('seed') || m.includes('petal') || m.includes('absorb') || m.includes('drain') || m.includes('growth') || m.includes('chicote') || m.includes('folha') || m.includes('semente')) {
      return { file: 'grass.png', key: 'folhas_vinha', cols: 5, rows: 5, startFrame: 5, endFrame: 7, fps: 24, theme: 'Folhas Cortantes e Chicote' };
    }
    if (m.includes('bite') || m.includes('crunch') || m.includes('fang') || m.includes('mord') || m.includes('jaw')) {
      return { file: 'teeth.png', key: 'mandibula_mordida', cols: 5, rows: 5, startFrame: 0, endFrame: 4, fps: 24, theme: 'Mandíbula de Presas Afiadas' };
    }
    if (m.includes('poison') || m.includes('acid') || m.includes('toxic') || m.includes('veneno') || m.includes('sludge') || m.includes('smog') || m.includes('gunk') || m.includes('venoshock') || m.includes('spore') || m.includes('sleep powder') || m.includes('stun spore') || m.includes('gas') || m.includes('corrosiv')) {
      return { file: 'poison.png', key: 'veneno_toxico', cols: 5, rows: 3, startFrame: 0, endFrame: 10, fps: 24, theme: 'Névoa Tóxica e Bolhas Ácidas' };
    }
    if (m.includes('mud') || m.includes('earth') || m.includes('rock') || m.includes('dig') || m.includes('sand') || m.includes('magnitude') || m.includes('fissure') || m.includes('tomb') || m.includes('terra') || m.includes('pedra')) {
      return { file: 'Earth1.png', key: 'terremoto_pedra', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22, theme: 'Tremor Sísmico e Rochas' };
    }
    if (m.includes('surf') || m.includes('hydro') || m.includes('wave') || m.includes('aqua jet') || m.includes('waterfall') || m.includes('onda') || m.includes('dive')) {
      return { file: '018-Water01.png', key: 'agua_tsunami', cols: 5, rows: 3, startFrame: 6, endFrame: 10, fps: 24, theme: 'Onda Torrencial / Tsunami' };
    }
    if (m.includes('water') || m.includes('bubble') || m.includes('aqua') || m.includes('agua') || m.includes('água') || m.includes('bolha')) {
      return { file: '018-Water01.png', key: 'agua_bolhas', cols: 5, rows: 3, startFrame: 0, endFrame: 3, fps: 24, theme: 'Esguicho e Bolhas de Água' };
    }
    return { file: '003-Attack01.png', key: 'impacto_fisico', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24, theme: 'Impacto Físico (Estrela Branca)' };
  }

  const moves = [];
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length < 13) continue;

    const id = parseInt(parts[0].trim());
    const internalName = parts[1].trim();
    const name = parts[2].trim();
    const effectCode = parts[3].trim();
    const power = parseInt(parts[4].trim()) || 0;
    const type = parts[5].trim().toUpperCase();
    const category = parts[6].trim() || (power > 0 ? 'Physical' : 'Status');
    const accuracy = parseInt(parts[7].trim()) || 100;
    const pp = parseInt(parts[8].trim()) || 35;
    const chance = parseInt(parts[9].trim()) || 0;
    const target = parts[10].trim();
    const priority = parseInt(parts[11].trim()) || 0;
    const flags = parts[12].trim();
    const descPart = parts.slice(13).join(',').replace(/^"|"$/g, '').trim();

    const animConfig = getAttackAnimationConfig(name);

    moves.push({
      id,
      internalName,
      name,
      effectCode,
      power,
      type,
      category,
      accuracy,
      pp,
      chance,
      target,
      priority,
      flags,
      description: descPart,
      visual: animConfig
    });
  }

  console.log(`Loaded ${moves.length} moves.`);

  // 3. Write Updated Markdown Report
  let md = `# 📖 Relatório Completo: Todos os 621 Movimentos (Moves) e Seus Sprites

> **Projeto**: PokeMMO (Kanto / FireRed & Pokémon Essentials v17.2)  
> **Total de Golpes Registrados**: ${moves.length}  
> **Visualizador Interativo**: Abra \`client/public/moves_catalog.html\` no navegador para testar animações em tempo real.

---

## 🎨 Galeria Visual dos Spritesheets da Engine de Batalha

A tabela abaixo exibe os spritesheets utilizados pelas animações de golpes do PokeMMO, com o quadro representativo (*frame preview*), resolução, taxa de quadros (FPS) e tema visual:

| Arquivo de Sprite | Preview | Grid | Quadros Ativos | FPS | Tema Estético |
|:---|:---:|:---:|:---:|:---:|:---|
`;

  for (const cfg of animConfigs) {
    const sample = moves.find(m => m.visual.key === cfg.key) || { visual: { startFrame: 0, endFrame: 4, fps: 24, cols: cfg.cols, rows: 2 } };
    md += `| \`${cfg.file}\` | <img src="previews/${cfg.key}.png" width="48" height="48" alt="${cfg.label}" /> | ${sample.visual.cols}x${sample.visual.rows || 2} | F${sample.visual.startFrame} a F${sample.visual.endFrame} | ${sample.visual.fps} | **${cfg.label}** |\n`;
  }

  md += `\n---\n\n## 📑 Tabela Completa de Todos os 621 Golpes com Sprite Associado\n\n`;
  md += `| #ID | Move | Tipo | Cat | Pow | Acc | PP | Pri | Sprite Utilizado | Frames | Preview | Descrição Oficial |\n`;
  md += `|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---|\n`;

  for (const m of moves) {
    const pwr = m.power > 0 ? m.power : '—';
    const acc = m.accuracy > 0 ? `${m.accuracy}%` : '—';
    const cleanDesc = m.description.replace(/\|/g, '/');
    md += `| **#${m.id}** | **${m.name}** | \`${m.type}\` | ${m.category} | ${pwr} | ${acc} | ${m.pp} | ${m.priority} | \`${m.visual.file}\` | F${m.visual.startFrame}-${m.visual.endFrame} | <img src="previews/${m.visual.key}.png" width="32" height="32" /> | ${cleanDesc} |\n`;
  }

  md += `\n---\n\n## 🔍 Detalhamento por Tipo Elemental (com Sprites)\n\n`;

  const typesList = [...new Set(moves.map(m => m.type))].sort();

  for (const t of typesList) {
    const list = moves.filter(m => m.type === t);
    md += `### ⚡ Tipo: ${t} (${list.length} golpes)\n\n`;
    md += `| #ID | Nome do Golpe | Cat. | Poder | Acc | PP | Sprite Utilizado | Frames | Preview | Descrição |\n`;
    md += `|:---:|:---|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---|\n`;
    for (const m of list) {
      const pwr = m.power > 0 ? m.power : '—';
      const acc = m.accuracy > 0 ? `${m.accuracy}%` : '—';
      const cleanDesc = m.description.replace(/\|/g, '/');
      md += `| #${m.id} | **${m.name}** | ${m.category} | ${pwr} | ${acc} | ${m.pp} | \`${m.visual.file}\` | F${m.visual.startFrame}-${m.visual.endFrame} | <img src="previews/${m.visual.key}.png" width="32" height="32" /> | ${cleanDesc} |\n`;
    }
    md += '\n';
  }

  fs.writeFileSync(path.join(docsDir, 'RELATORIO_621_MOVES.md'), md, 'utf-8');
  console.log('Updated docs/RELATORIO_621_MOVES.md successfully!');

  // 4. Update client/public/moves_catalog.html with dynamic Sprite Animation Player!
  const htmlPath = path.resolve('client/public/moves_catalog.html');
  const movesJson = JSON.stringify(moves);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PokeMMO - Catálogo Visual dos 621 Moves com Animação</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0e14;
      --card-bg: #141b24;
      --border-color: #242f3d;
      --text-main: #f0f6fc;
      --text-muted: #8b949e;
      --accent: #38bdf8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Outfit', sans-serif;
      padding: 24px;
      line-height: 1.5;
    }

    header {
      background: linear-gradient(135deg, #172230, #0d1520);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .badge-total {
      background: #e11d48;
      color: #fff;
      font-size: 14px;
      padding: 4px 12px;
      border-radius: 999px;
      font-weight: 700;
    }

    .subtitle {
      color: var(--text-muted);
      margin-top: 6px;
      font-size: 15px;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
      align-items: center;
    }

    input[type="text"] {
      flex: 1;
      min-width: 260px;
      background: #080c12;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
    }
    input[type="text"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
    }

    select {
      background: #080c12;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
    }

    .stats-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      padding: 14px 20px;
      border-radius: 10px;
      flex: 1;
      min-width: 140px;
    }
    .stat-val { font-size: 22px; font-weight: 800; color: #fff; }
    .stat-lbl { font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }

    .move-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }
    .move-card:hover {
      transform: translateY(-3px);
      border-color: rgba(56, 189, 248, 0.5);
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .move-id {
      font-size: 12px;
      color: var(--text-muted);
      font-family: monospace;
      font-weight: 700;
    }

    .move-name {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    .chips {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .type-chip {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #fff;
    }

    .cat-chip {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .cat-Physical { background: #b91c1c; color: #fff; }
    .cat-Special { background: #1d4ed8; color: #fff; }
    .cat-Status { background: #4b5563; color: #fff; }

    .stats-row {
      display: flex;
      justify-content: space-between;
      background: #090e15;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .si-val { font-weight: 700; color: #fff; }
    .si-lbl { font-size: 10px; color: var(--text-muted); }

    .desc {
      font-size: 13px;
      color: #cbd5e1;
      line-height: 1.45;
      flex: 1;
    }

    /* Sprite Display Box */
    .sprite-box {
      background: #080d14;
      border: 1px solid #1f2a38;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      gap: 14px;
      align-items: center;
    }

    .sprite-canvas-wrap {
      width: 72px;
      height: 72px;
      background: radial-gradient(circle, #1a2636 0%, #090e15 80%);
      border: 1px solid #2a3a4e;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.6);
    }

    .sprite-canvas-wrap canvas {
      width: 64px;
      height: 64px;
      image-rendering: pixelated;
    }

    .sprite-info {
      flex: 1;
      min-width: 0;
    }

    .vfx-title {
      color: #38bdf8;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sprite-file {
      font-size: 12px;
      color: #e2e8f0;
      font-family: monospace;
      font-weight: 600;
      word-break: break-all;
    }

    .sprite-meta {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }

    /* Type Colors */
    .type-NORMAL { background: #A8A878; }
    .type-FIRE { background: #F08030; }
    .type-WATER { background: #6890F0; }
    .type-GRASS { background: #78C850; }
    .type-ELECTRIC { background: #F8D030; color: #000; }
    .type-ICE { background: #98D8D8; color: #000; }
    .type-FIGHTING { background: #C03028; }
    .type-POISON { background: #A040A0; }
    .type-GROUND { background: #E0C068; }
    .type-FLYING { background: #A890F0; }
    .type-PSYCHIC { background: #F85888; }
    .type-BUG { background: #A8B820; }
    .type-ROCK { background: #B8A038; }
    .type-GHOST { background: #705898; }
    .type-DRAGON { background: #7038F8; }
    .type-STEEL { background: #B8B8D0; color: #000; }
    .type-DARK { background: #705848; }
    .type-FAIRY { background: #EE99AC; }
  </style>
</head>
<body>

  <header>
    <h1>
      <span>⚔️ Arsenal dos 621 Moves com Animação de Sprites</span>
      <span class="badge-total">621 Moves</span>
    </h1>
    <div class="subtitle">Visualização de combate em tempo real: cada card executa em loop o recorte de frames do spritesheet oficial associado ao golpe.</div>

    <div class="controls">
      <input type="text" id="searchInput" placeholder="Buscar por golpe, tipo, descrição ou nome da spritesheet...">
      <select id="typeFilter">
        <option value="">Todos os Tipos (18)</option>
      </select>
      <select id="catFilter">
        <option value="">Todas as Categorias</option>
        <option value="Physical">Físico (Physical)</option>
        <option value="Special">Especial (Special)</option>
        <option value="Status">Status</option>
      </select>
      <select id="vfxFilter">
        <option value="">Todos os Spritesheets</option>
      </select>
    </div>
  </header>

  <div class="stats-bar">
    <div class="stat-card">
      <div class="stat-val" id="showingCount">621</div>
      <div class="stat-lbl">Golpes Exibidos</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">18</div>
      <div class="stat-lbl">Tipos Elementais</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">17</div>
      <div class="stat-lbl">Spritesheets VFX</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">100%</div>
      <div class="stat-lbl">Cobertura do Sistema</div>
    </div>
  </div>

  <div class="grid" id="movesGrid"></div>

  <script>
    const moves = ${movesJson};

    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const catFilter = document.getElementById('catFilter');
    const vfxFilter = document.getElementById('vfxFilter');
    const movesGrid = document.getElementById('movesGrid');
    const showingCount = document.getElementById('showingCount');

    // Cache loaded images
    const imageCache = new Map();
    function getImage(file) {
      if (imageCache.has(file)) return imageCache.get(file);
      const img = new Image();
      img.src = '/assets/battle/animations/' + file;
      imageCache.set(file, img);
      return img;
    }

    // Populate Filters
    const types = [...new Set(moves.map(m => m.type))].sort();
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      typeFilter.appendChild(opt);
    });

    const vfxs = [...new Set(moves.map(m => m.visual.file))].sort();
    vfxs.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      vfxFilter.appendChild(opt);
    });

    let activeCanvases = [];

    function render() {
      activeCanvases = [];
      const q = searchInput.value.toLowerCase().trim();
      const t = typeFilter.value;
      const c = catFilter.value;
      const v = vfxFilter.value;

      const filtered = moves.filter(m => {
        if (t && m.type !== t) return false;
        if (c && m.category !== c) return false;
        if (v && m.visual.file !== v) return false;
        if (q) {
          const matchName = m.name.toLowerCase().includes(q);
          const matchDesc = m.description.toLowerCase().includes(q);
          const matchInternal = m.internalName.toLowerCase().includes(q);
          const matchFile = m.visual.file.toLowerCase().includes(q);
          const matchTheme = m.visual.theme.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchInternal && !matchFile && !matchTheme) return false;
        }
        return true;
      });

      showingCount.textContent = filtered.length;

      movesGrid.innerHTML = filtered.map(m => \`
        <div class="move-card">
          <div class="card-head">
            <div>
              <div class="move-id">#\${m.id} • \${m.internalName}</div>
              <div class="move-name">\${m.name}</div>
            </div>
            <div class="chips">
              <span class="type-chip type-\${m.type}">\${m.type}</span>
              <span class="cat-chip cat-\${m.category}">\${m.category}</span>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-item">
              <span class="si-val">\${m.power > 0 ? m.power : '—'}</span>
              <span class="si-lbl">PODER</span>
            </div>
            <div class="stat-item">
              <span class="si-val">\${m.accuracy > 0 ? m.accuracy + '%' : '—'}</span>
              <span class="si-lbl">PRECISÃO</span>
            </div>
            <div class="stat-item">
              <span class="si-val">\${m.pp}</span>
              <span class="si-lbl">PP</span>
            </div>
            <div class="stat-item">
              <span class="si-val">\${m.priority > 0 ? '+' + m.priority : (m.priority < 0 ? m.priority : '0')}</span>
              <span class="si-lbl">PRIORIDADE</span>
            </div>
          </div>

          <div class="desc">\${m.description || 'Nenhuma descrição adicional.'}</div>

          <div class="sprite-box">
            <div class="sprite-canvas-wrap">
              <canvas class="anim-canvas" data-file="\${m.visual.file}" data-cols="\${m.visual.cols}" data-start="\${m.visual.startFrame}" data-end="\${m.visual.endFrame}" data-fps="\${m.visual.fps}" width="192" height="192"></canvas>
            </div>
            <div class="sprite-info">
              <div class="vfx-title">✨ \${m.visual.theme}</div>
              <div class="sprite-file">\${m.visual.file}</div>
              <div class="sprite-meta">Frames: \${m.visual.startFrame} a \${m.visual.endFrame} • \${m.visual.fps} FPS</div>
            </div>
          </div>
        </div>
      \`).join('');

      // Attach animation loop to all rendered canvases
      document.querySelectorAll('.anim-canvas').forEach(cv => {
        const file = cv.dataset.file;
        const cols = parseInt(cv.dataset.cols) || 5;
        const start = parseInt(cv.dataset.start) || 0;
        const end = parseInt(cv.dataset.end) || 4;
        const fps = parseInt(cv.dataset.fps) || 24;
        const ctx = cv.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const img = getImage(file);
        activeCanvases.push({
          cv,
          ctx,
          img,
          cols,
          start,
          end,
          fps,
          frame: start,
          lastTime: 0,
          interval: 1000 / fps
        });
      });
    }

    // Global RAF Loop for animating visible canvases
    function animateLoop(now) {
      for (const item of activeCanvases) {
        if (!item.img.complete || item.img.naturalWidth === 0) continue;
        if (now - item.lastTime >= item.interval) {
          item.lastTime = now;
          const frameW = 192;
          const frameH = 192;
          const col = item.frame % item.cols;
          const row = Math.floor(item.frame / item.cols);
          const sx = col * frameW;
          const sy = row * frameH;

          item.ctx.clearRect(0, 0, 192, 192);
          item.ctx.drawImage(item.img, sx, sy, frameW, frameH, 0, 0, 192, 192);

          item.frame++;
          if (item.frame > item.end) {
            item.frame = item.start;
          }
        }
      }
      requestAnimationFrame(animateLoop);
    }
    requestAnimationFrame(animateLoop);

    searchInput.addEventListener('input', render);
    typeFilter.addEventListener('change', render);
    catFilter.addEventListener('change', render);
    vfxFilter.addEventListener('change', render);

    render();
  </script>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('Updated client/public/moves_catalog.html with live canvas sprite animation player!');
}

generateAll().catch(console.error);
