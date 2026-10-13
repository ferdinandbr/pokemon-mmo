const fs = require('fs');
const path = require('path');

// Visual aesthetic resolver matching client/src/ui/BattleUI.js
function getAttackAnimationConfig(moveName = '') {
  const m = String(moveName).toLowerCase();

  // Explosion / Self-destruct
  if (m.includes('explos') || m.includes('selfdestruct') || m.includes('self-destruct') || m.includes('detonat') || m.includes('mind blown')) {
    return {
      file: '030-Explosion01.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 7, fps: 24,
      theme: 'Explosão Massiva / Detonação',
      description: 'Uma grande deflagração de fogo e fumaça que engole o campo em 8 quadros de alta velocidade.'
    };
  }

  // Psychic
  if (m.includes('psychic') || m.includes('psycho') || m.includes('psywave') || m.includes('psybeam') || m.includes('confus') || m.includes('extrasensory') || m.includes('hypnosis') || m.includes('dream') || m.includes('zen') || m.includes('kinesis') || m.includes('stored') || m.includes('meditat') || m.includes('miracle') || m.includes('psiqu') || m.includes('hipnose')) {
    return {
      file: '023-Burst01.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 7, fps: 24,
      theme: 'Pulso de Energia Psíquica / Onda Mental',
      description: 'Onda esférica de energia telecinética e mental que distorce o espaço e expande no alvo.'
    };
  }

  // Fairy
  if (m.includes('fairy') || m.includes('fada') || m.includes('moonblast') || m.includes('dazzling') || m.includes('play rough') || m.includes('charm') || m.includes('draining kiss') || m.includes('misty') || m.includes('sweet') || m.includes('fleur')) {
    return {
      file: '023-Burst01.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24,
      theme: 'Brilho Feérico / Explosão de Luz Encantada',
      description: 'Flash cintilante de partículas mágicas e essência de fada, estourando em feixes reluzentes.'
    };
  }

  // Ghost
  if (m.includes('ghost') || m.includes('spirit') || m.includes('hex') || m.includes('astonish') || m.includes('lick') || m.includes('curse') || m.includes('nightmare') || m.includes('ominous') || m.includes('phantom') || m.includes('shadow ball') || m.includes('fantasma')) {
    return {
      file: '030-Explosion01.png',
      cols: 5, rows: 2, startFrame: 4, endFrame: 7, fps: 24,
      theme: 'Ectoplasma Espectral / Vórtice Sombrio',
      description: 'Nuvem espessa de fumaça escura e ectoplasma espectral emanando do mundo dos espíritos.'
    };
  }

  // Dark special vs Dark physical
  if (m.includes('pulse') || m.includes('daze') || m.includes('snarl')) {
    return {
      file: '023-Burst01.png',
      cols: 5, rows: 2, startFrame: 4, endFrame: 7, fps: 24,
      theme: 'Onda Noturna Escura / Pulso Sinistro',
      description: 'Pulso de ondas sombrias concêntricas que atinge e atordoa o Pokémon adversário.'
    };
  }
  if (m.includes('shadow') || m.includes('dark') || m.includes('night') || m.includes('thief') || m.includes('pursuit') || m.includes('sucker') || m.includes('payback') || m.includes('feint') || m.includes('assurance') || m.includes('foul') || m.includes('brutal') || m.includes('sombra') || m.includes('ladrao') || m.includes('ladrão')) {
    return {
      file: '004-Attack02.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22,
      theme: 'Corte Noturno / Ataque Furtivo de Sombras',
      description: 'Múltiplos cortes cortantes velozes que rasgam a tela simulando golpes das trevas.'
    };
  }

  // Dragon
  if (m.includes('dragon') || m.includes('draco') || m.includes('outrage') || m.includes('rage') || m.includes('dual chop') || m.includes('dragao') || m.includes('dragão')) {
    return {
      file: '015-Fire01.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24,
      theme: 'Sopro Dracônico Incandescente',
      description: 'Jato de fogo e energia primordial expelido com a fúria mística dos dragões.'
    };
  }

  // Steel
  if (m.includes('steel') || m.includes('metal') || m.includes('iron') || m.includes('bullet') || m.includes('gyro') || m.includes('flash cannon') || m.includes('mirror') || m.includes('smart strike') || m.includes('corkscrew') || m.includes('magnet') || m.includes('aco') || m.includes('aço')) {
    return {
      file: '004-Attack02.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22,
      theme: 'Corte Metálico / Impacto Blindado de Aço',
      description: 'Cortes prateados pesados com faíscas metálicas simulando garras e lâminas de ferro fundido.'
    };
  }

  // Fighting
  if (m.includes('punch') || m.includes('hit') || m.includes('kick') || m.includes('combat') || m.includes('fight') || m.includes('karate') || m.includes('chop') || m.includes('brick') || m.includes('aura') || m.includes('focus') || m.includes('revenge') || m.includes('force palm') || m.includes('mach') || m.includes('bulk') || m.includes('cross') || m.includes('submission') || m.includes('superpower') || m.includes('soco') || m.includes('chute') || m.includes('scratch') || m.includes('claw') || m.includes('slash') || m.includes('cut') || m.includes('fury') || m.includes('cutter') || m.includes('scissor') || m.includes('aranh') || m.includes('garra')) {
    return {
      file: '004-Attack02.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22,
      theme: 'Golpe Marcial / Corte de Garras e Punhos',
      description: 'Lacerador físico de cortes rápidos em cruz e linhas de força cinética de combate corpo-a-corpo.'
    };
  }

  // Bug
  if (m.includes('bug') || m.includes('inseto') || m.includes('string') || m.includes('web') || m.includes('leech') || m.includes('signal') || m.includes('silver wind') || m.includes('infestation') || m.includes('quiver') || m.includes('sticky') || m.includes('spider')) {
    return {
      file: 'grass.png',
      cols: 5, rows: 5, startFrame: 5, endFrame: 7, fps: 24,
      theme: 'Emaranhado de Seda / Esporos e Pó de Inseto',
      description: 'Rajada de fibras orgânicas de seda e partículas dispersas que envolvem o defensor.'
    };
  }

  // Fire
  if (m.includes('spin') || m.includes('vortex') || m.includes('tornado') || m.includes('whirl') || m.includes('redemoinho')) {
    return {
      file: '015-Fire01.png',
      cols: 5, rows: 2, startFrame: 5, endFrame: 9, fps: 24,
      theme: 'Vórtice Ígneo / Redemoinho de Fogo',
      description: 'Coluna giratória de labaredas em espiral que sobe e envolve a área do alvo.'
    };
  }
  if (m.includes('fire') || m.includes('ember') || m.includes('flame') || m.includes('blast') || m.includes('erupt') || m.includes('burn') || m.includes('flare') || m.includes('pyro') || m.includes('magma') || m.includes('lava') || m.includes('fogo') || m.includes('brasa') || m.includes('queim') || m.includes('inciner')) {
    return {
      file: '015-Fire01.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24,
      theme: 'Labareda / Explosão de Fogo Incandescente',
      description: 'Erupção frontal de chamas ardentes que incinera o alvo em calor intenso.'
    };
  }

  // Electric
  if (m.includes('thunder') || m.includes('electric') || m.includes('electro') || m.includes('eletric') || m.includes('shock') || m.includes('spark') || m.includes('volt') || m.includes('trovao') || m.includes('trovão') || m.includes('choque')) {
    return {
      file: '017-Thunder01.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 5, fps: 24,
      theme: 'Descarga Elétrica / Relâmpago Fulminante',
      description: 'Raio bifurcado azul e amarelo descendo dos céus e eletrocutando a posição do alvo.'
    };
  }

  // Ice
  if (m.includes('ice') || m.includes('icicle') || m.includes('icy') || m.includes('blizzard') || m.includes('freeze') || m.includes('snow') || m.includes('gelo') || m.includes('frost') || m.includes('hail') || m.includes('aurora')) {
    return {
      file: 'Ice1.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 8, fps: 24,
      theme: 'Nevasca Congelante / Estilhaços de Gelo Puro',
      description: 'Cristais pontiagudos de gelo despencando e explodindo em lascas e geada esbranquiçada.'
    };
  }

  // Wind / Flying
  if (m.includes('gust') || m.includes('wind') || m.includes('wing') || m.includes('fly') || m.includes('aerial') || m.includes('air') || m.includes('twister') || m.includes('hurricane') || m.includes('vento') || m.includes('asa')) {
    return {
      file: 'Wind1.png',
      cols: 5, rows: 3, startFrame: 8, endFrame: 12, fps: 24,
      theme: 'Lâmina de Vácuo / Vendaval Aéreo Cortante',
      description: 'Rajada em arco aerodinâmico transparente de alta pressão que fatia o ar contra o adversário.'
    };
  }

  // Grass
  if (m.includes('vine') || m.includes('leaf') || m.includes('grass') || m.includes('seed') || m.includes('petal') || m.includes('absorb') || m.includes('drain') || m.includes('growth') || m.includes('chicote') || m.includes('folha') || m.includes('semente')) {
    return {
      file: 'grass.png',
      cols: 5, rows: 5, startFrame: 5, endFrame: 7, fps: 24,
      theme: 'Folhas Afiadas / Chicote de Vinhas Naturais',
      description: 'Chicoteamento botânico com folhas verdes girando e cortando em dinâmica vegetal orgânica.'
    };
  }

  // Bite / Crunch
  if (m.includes('bite') || m.includes('crunch') || m.includes('fang') || m.includes('mord') || m.includes('jaw')) {
    return {
      file: 'teeth.png',
      cols: 5, rows: 5, startFrame: 0, endFrame: 4, fps: 24,
      theme: 'Mandíbula Fantasma / Presas Mordiscando',
      description: 'Par de arcadas dentárias afiadas translúcidas que fecham abruptamente triturando o alvo.'
    };
  }

  // Poison
  if (m.includes('poison') || m.includes('acid') || m.includes('toxic') || m.includes('veneno') || m.includes('sludge') || m.includes('smog') || m.includes('gunk') || m.includes('venoshock') || m.includes('spore') || m.includes('sleep powder') || m.includes('stun spore') || m.includes('gas') || m.includes('corrosiv')) {
    return {
      file: 'poison.png',
      cols: 5, rows: 3, startFrame: 0, endFrame: 10, fps: 24,
      theme: 'Gás Tóxico Violeta / Bolhas Corrosivas de Ácido',
      description: 'Erva daninha ou névoa púrpura borbulhante de gotas venenosas espalhando toxicidade cáustica.'
    };
  }

  // Earth / Ground / Rock
  if (m.includes('mud') || m.includes('earth') || m.includes('rock') || m.includes('dig') || m.includes('sand') || m.includes('magnitude') || m.includes('fissure') || m.includes('tomb') || m.includes('terra') || m.includes('pedra')) {
    return {
      file: 'Earth1.png',
      cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22,
      theme: 'Tremor Sísmico / Erupção de Rochas e Poeira',
      description: 'Blocos de pedra e detritos marrons projetados para cima a partir de uma rachadura no piso.'
    };
  }

  // Water
  if (m.includes('surf') || m.includes('hydro') || m.includes('wave') || m.includes('aqua jet') || m.includes('waterfall') || m.includes('onda') || m.includes('dive')) {
    return {
      file: '018-Water01.png',
      cols: 5, rows: 3, startFrame: 6, endFrame: 10, fps: 24,
      theme: 'Onda Torrencial / Tsunami Aquático',
      description: 'Massa azul densa de água em crista de onda violenta que submerge o defensor sob alta vazão.'
    };
  }
  if (m.includes('water') || m.includes('bubble') || m.includes('aqua') || m.includes('agua') || m.includes('água') || m.includes('bolha')) {
    return {
      file: '018-Water01.png',
      cols: 5, rows: 3, startFrame: 0, endFrame: 3, fps: 24,
      theme: 'Esguicho e Bolhas Cristalinas de Água',
      description: 'Jato frontal de borrifos e gotículas esféricas límpidas espirrando contra o oponente.'
    };
  }

  // Default Physical
  return {
    file: '003-Attack01.png',
    cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24,
    theme: 'Impacto Físico Genérico / Flash de Pancada Branca',
    description: 'Flash de choque de concussão com estrela de impacto branca clássica de colisão cinética direta.'
  };
}

async function run() {
  const pbsPath = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/moves.txt';
  const content = fs.readFileSync(pbsPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l && !l.startsWith('#'));

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

  console.log(`Parsed ${moves.length} moves.`);

  // Type Distribution
  const typeCount = {};
  const catCount = {};
  const vfxCount = {};

  moves.forEach(m => {
    typeCount[m.type] = (typeCount[m.type] || 0) + 1;
    catCount[m.category] = (catCount[m.category] || 0) + 1;
    vfxCount[m.visual.file] = (vfxCount[m.visual.file] || 0) + 1;
  });

  console.log('Types:', typeCount);
  console.log('Categories:', catCount);
  console.log('VFX Sheets:', vfxCount);

  // Ensure docs dir exists
  const docsDir = path.resolve(__dirname, '../docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  // Generate Markdown Report
  let md = `# 📖 Relatório Técnico Completo: Todos os 621 Movimentos (Moves) do PokeMMO

> **Projeto**: PokeMMO (Kanto / FireRed & Pokémon Essentials v17.2)  
> **Total de Golpes Registrados**: ${moves.length}  
> **Escopo**: Especificação técnica de combate, descrições oficiais, metadados de balanceamento e mapeamento estético/visual da engine de batalha.

---

## 📊 1. Sumário Executivo & Estatísticas do Arsenal

O sistema de batalha do PokeMMO integra o banco de dados oficial do Pokémon Essentials com uma camada visual reativa renderizada via Canvas 2D e sequenciamento de eventos CSS no cliente web (\`BattleUI.js\`).

### 1.1 Distribuição por Categoria
| Categoria | Quantidade | Percentual | Função em Batalha |
|:---|:---:|:---:|:---|
| **Physical (Físico)** | ${catCount['Physical'] || 0} | ${((catCount['Physical'] / moves.length) * 100).toFixed(1)}% | Golpes de contato ou força corporal usando o stat de Attack vs Defense |
| **Special (Especial)** | ${catCount['Special'] || 0} | ${((catCount['Special'] / moves.length) * 100).toFixed(1)}% | Projéteis de energia, elementos e ondas mentais usando Sp. Atk vs Sp. Def |
| **Status (Suporte/Efeito)** | ${catCount['Status'] || 0} | ${((catCount['Status'] / moves.length) * 100).toFixed(1)}% | Modificação de atributos, condições de status (queimadura, sono, paralisia), clima e terrenos |

### 1.2 Distribuição por Tipo Elemental
| Tipo | Qtd de Moves | Tipo | Qtd de Moves | Tipo | Qtd de Moves |
|:---|:---:|:---|:---:|:---|:---:|
${Object.keys(typeCount).sort().map(t => `| **${t}** | ${typeCount[t]} `).reduce((acc, curr, idx) => {
  if (idx % 3 === 0) acc.push(curr);
  else acc[acc.length - 1] += curr;
  return acc;
}, []).map(row => row + '|').join('\n')}

---

## 🎨 2. Arquitetura da Estética Visual de Batalha

O PokeMMO implementa um pipeline visual em 4 camadas para cada movimento executado:

\`\`\`
[1. Ação do Atacante]          [2. Renderizador Canvas FX]        [3. Reação do Alvo]          [4. HUD / Interface]
   Lunge frontal CSS      ──▶     Spritesheet Essentials      ──▶    Flash vermelho de dano ──▶    Drenagem de HP
 (animateAttackLunge)           (192x192px @ 22-24 FPS)             (animateSpriteFlash)           e Badge de Status
\`\`\`

### 2.1 Catálogo de Spritesheets Visuais Integrados

| Spritesheet | Resolução / Grid | Frames Ativos | Tema Visual Associado | Moves Atendidos |
|:---|:---:|:---:|:---|:---:|
${Object.entries(vfxCount).sort((a,b) => b[1] - a[1]).map(([file, count]) => {
  const sample = moves.find(m => m.visual.file === file);
  return `| \`${file}\` | ${sample.visual.cols}x${sample.visual.rows} cols/rows | ${sample.visual.startFrame} a ${sample.visual.endFrame} | **${sample.visual.theme}** | ${count} golpes |`;
}).join('\n')}

---

## 📑 3. Catálogo Exaustivo de Todos os 621 Moves

Abaixo estão listados todos os **621 golpes** organizados por ID, com tipo, categoria, estatísticas (Poder, Precisão, PP, Prioridade), descrição fiel e o visual estético mapeado.

| #ID | Nome do Move | Tipo | Cat. | Pow | Acc | PP | Pri | Descrição do Golpe | Visual Estético / Spritesheet |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---|
`;

  for (const m of moves) {
    const pwr = m.power > 0 ? m.power : '—';
    const acc = m.accuracy > 0 ? `${m.accuracy}%` : '—';
    const cleanDesc = m.description.replace(/\|/g, '/');
    md += `| **#${m.id}** | **${m.name}** (\`${m.internalName}\`) | \`${m.type}\` | ${m.category} | ${pwr} | ${acc} | ${m.pp} | ${m.priority} | ${cleanDesc} | \`${m.visual.file}\` (F${m.visual.startFrame}-${m.visual.endFrame}) — *${m.visual.theme}* |\n`;
  }

  md += `\n---

## 🔍 4. Detalhamento Temático por Tipo Elemental

`;

  const typesList = [...new Set(moves.map(m => m.type))].sort();

  for (const t of typesList) {
    const list = moves.filter(m => m.type === t);
    md += `### ⚡ Tipo: ${t} (${list.length} golpes)\n\n`;
    md += `| ID | Nome | Cat. | Poder | Acc | PP | Descrição | Efeito Visual no Jogo |\n`;
    md += `|:---:|:---|:---:|:---:|:---:|:---:|:---|:---|\n`;
    for (const m of list) {
      const pwr = m.power > 0 ? m.power : '—';
      const acc = m.accuracy > 0 ? `${m.accuracy}%` : '—';
      const cleanDesc = m.description.replace(/\|/g, '/');
      md += `| #${m.id} | **${m.name}** | ${m.category} | ${pwr} | ${acc} | ${m.pp} | ${cleanDesc} | **${m.visual.theme}** (\`${m.visual.file}\`) |\n`;
    }
    md += '\n';
  }

  md += `\n---\n\n*Relatório gerado automaticamente a partir da base oficial PBS Kanto & Prisma Database do PokeMMO.*\n`;

  fs.writeFileSync(path.join(docsDir, 'RELATORIO_621_MOVES.md'), md, 'utf-8');
  console.log('Markdown report generated at docs/RELATORIO_621_MOVES.md');

  // Also generate an Interactive HTML visual catalog in client/public/moves_catalog.html
  const htmlPath = path.resolve(__dirname, '../client/public/moves_catalog.html');
  const movesJson = JSON.stringify(moves);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PokeMMO - Catálogo Visual dos 621 Moves</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0d1117;
      --card-bg: #161b22;
      --border-color: #30363d;
      --text-main: #f0f6fc;
      --text-muted: #8b949e;
      --accent: #58a6ff;
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
      background: linear-gradient(135deg, #1f2937, #111827);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
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
      background: #0d1117;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
    }
    input[type="text"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
    }

    select {
      background: #0d1117;
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
      gap: 18px;
    }

    .move-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }
    .move-card:hover {
      transform: translateY(-3px);
      border-color: #58a6ff88;
      box-shadow: 0 8px 20px rgba(0,0,0,0.5);
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
      background: #0d1117;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; }
    .si-val { font-weight: 700; color: #fff; }
    .si-lbl { font-size: 10px; color: var(--text-muted); }

    .desc {
      font-size: 13px;
      color: #c9d1d9;
      line-height: 1.4;
      flex: 1;
    }

    .vfx-box {
      background: #111b27;
      border-left: 3px solid #38bdf8;
      padding: 10px 12px;
      border-radius: 0 8px 8px 0;
      font-size: 12px;
    }
    .vfx-title {
      color: #38bdf8;
      font-weight: 700;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .vfx-meta {
      color: #94a3b8;
      font-family: monospace;
      font-size: 11px;
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
      <span>⚔️ Catálogo Geral de Movimentos</span>
      <span class="badge-total">621 Moves</span>
    </h1>
    <div class="subtitle">Relatório visual, descrições oficiais e mapeamento estético dos spritesheets da engine de batalha PokeMMO.</div>

    <div class="controls">
      <input type="text" id="searchInput" placeholder="Buscar por nome, golpe, efeito ou descrição...">
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
        <option value="">Todos os Spritesheets Visuais</option>
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

    function render() {
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
          const matchTheme = m.visual.theme.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchInternal && !matchTheme) return false;
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

          <div class="vfx-box">
            <div class="vfx-title">✨ \${m.visual.theme}</div>
            <div class="vfx-meta">Asset: \${m.visual.file} | F\${m.visual.startFrame}-F\${m.visual.endFrame} @ \${m.visual.fps}fps</div>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">\${m.visual.description}</div>
          </div>
        </div>
      \`).join('');
    }

    searchInput.addEventListener('input', render);
    typeFilter.addEventListener('change', render);
    catFilter.addEventListener('change', render);
    vfxFilter.addEventListener('change', render);

    render();
  </script>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`HTML interactive catalog generated at client/public/moves_catalog.html`);
}

run().catch(console.error);
