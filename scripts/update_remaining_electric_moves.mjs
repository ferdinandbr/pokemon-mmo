import fs from 'fs';

const filePath = 'client/src/battle/movesDatabase.js';
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
  70: {
    // Wild Charge: Imagem 2 amarela no impacto + carregamento
    file: 'vfx/custom/electric_impact_burst_yellow.png',
    cols: 5,
    rows: 1,
    startFrame: 0,
    endFrame: 4,
    fps: 24,
    key: 'wild_charge',
    theme: 'Investida Feroz Eletrizada com Explosão no Impacto (Wild Charge)',
    scale: 1.25,
    color: '#FACC15',
    isWildCharge: true,
    hasElectricCharge: true,
    chargeColor: '#FACC15',
    chargeFile: 'vfx/custom/electric_charge_yellow.png',
    applyElectrocuted: true
  },
  71: {
    // Discharge: Imagem 2 amarela e remover vfx/sprite atual
    file: 'vfx/custom/electric_impact_burst_yellow.png',
    cols: 5,
    rows: 1,
    startFrame: 0,
    endFrame: 4,
    fps: 24,
    key: 'discharge_burst',
    theme: 'Carregamento no Usuário e Descarga Elétrica com Explosão Amarela (Discharge)',
    scale: 1.35,
    color: '#FACC15',
    isDischarge: true,
    hasElectricCharge: true,
    chargeColor: '#FACC15',
    chargeFile: 'vfx/custom/electric_charge_yellow.png',
    applyElectrocuted: true
  },
  75: {
    // Thunder Fang: usar sprite teeth, ajustar tamanho
    file: 'core/teeth.png',
    cols: 5,
    rows: 5,
    startFrame: 0,
    endFrame: 4,
    fps: 24,
    key: 'thunder_fang',
    theme: 'Mordida de Presas Eletrificadas (Thunder Fang)',
    scale: 0.40,
    color: '#FACC15',
    isThunderFang: true,
    applyElectrocuted: true
  },
  77: {
    // Electroweb: diminuir tamanho da web, projetil imagem 3 amarela
    file: 'vfx/custom/electroweb.png',
    cols: 5,
    rows: 1,
    startFrame: 0,
    endFrame: 4,
    fps: 20,
    key: 'electroweb',
    theme: 'Projétil de Onda Elétrica Dourada com Teia Elétrica Ajustada (Electroweb)',
    scale: 0.80,
    color: '#FACC15',
    isElectroweb: true,
    isElectricBoltProj: true,
    projectileFile: 'vfx/custom/electric_projectile_yellow.png',
    applyElectrocuted: true
  },
  79: {
    // Thunder Shock: projetil imagem 3 amarela, impacto imagem 2 amarela
    file: 'vfx/custom/electric_projectile_yellow.png',
    cols: 5,
    rows: 1,
    startFrame: 0,
    endFrame: 4,
    fps: 24,
    key: 'thunder_shock',
    theme: 'Projétil de Onda Elétrica com Impacto Explosivo Amarelo (Thunder Shock)',
    scale: 1.0,
    color: '#FACC15',
    isThunderShock: true,
    isElectricBoltProj: true,
    impactFile: 'vfx/custom/electric_impact_burst_yellow.png',
    applyElectrocuted: true
  }
};

for (const [id, visualObj] of Object.entries(updates)) {
  const regex = new RegExp(`("${id}":\\s*{[\\s\\S]*?"visual":\\s*){[\\s\\S]*?}(,[\\s\\S]*?"activeCombatCompatible")`);
  if (regex.test(content)) {
    const formattedVisual = JSON.stringify(visualObj, null, 6)
      .split('\n')
      .map((line, idx) => idx === 0 ? line : '    ' + line)
      .join('\n');
    content = content.replace(regex, `$1${formattedVisual}$2`);
    console.log(`Updated Move ID ${id} visual config`);
  } else {
    console.warn(`Could not find visual block for Move ID ${id}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating movesDatabase.js');
