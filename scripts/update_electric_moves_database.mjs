import fs from 'fs';

const filePath = 'client/src/battle/movesDatabase.js';
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
  64: { // Bolt Strike
    executionType: 'dash',
    visual: {
      file: 'vfx/custom/electric_bolt_impact_blue.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'bolt_strike',
      theme: 'Investida com Carregamento Azul e Raio Fulminante (Bolt Strike)',
      scale: 1.15,
      color: '#38BDF8',
      isBoltStrike: true,
      hasElectricCharge: true,
      chargeColor: '#38BDF8',
      chargeFile: 'vfx/custom/electric_charge_blue.png',
      applyElectrocuted: true
    }
  },
  65: { // Thunder
    executionType: 'projectile',
    visual: {
      file: 'vfx/custom/electric_bolt_impact_yellow.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'thunder_strike',
      theme: 'Carregamento no Usuário e Descida de Raio Dourado (Thunder)',
      scale: 1.25,
      color: '#FACC15',
      isThunder: true,
      hasElectricCharge: true,
      chargeColor: '#FACC15',
      chargeFile: 'vfx/custom/electric_charge_yellow.png',
      applyElectrocuted: true
    }
  },
  66: { // Volt Tackle
    executionType: 'dash',
    visual: {
      file: 'vfx/custom/electric_bolt_impact_yellow.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'volt_tackle',
      theme: 'Investida Eletrizada Dourada com Raio no Impacto (Volt Tackle)',
      scale: 1.2,
      color: '#FACC15',
      isVoltTackle: true,
      hasElectricCharge: true,
      chargeColor: '#FACC15',
      chargeFile: 'vfx/custom/electric_charge_yellow.png',
      applyElectrocuted: true
    }
  },
  67: { // Zap Cannon
    executionType: 'projectile',
    visual: {
      file: 'vfx/pixel_fire/colored/yellow/group_4_2.png',
      cols: 14,
      rows: 1,
      startFrame: 0,
      endFrame: 13,
      fps: 24,
      key: 'zap_cannon',
      theme: 'Canhão de Plasma Elétrico Puro com Eletrocussão (Zap Cannon)',
      scale: 1.25,
      color: '#FACC15',
      isZapCannon: true,
      applyElectrocuted: true
    }
  },
  68: { // Fusion Bolt
    executionType: 'dash',
    visual: {
      file: 'vfx/custom/electric_bolt_impact_blue.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'fusion_bolt',
      theme: 'Ascensão Celeste e Mergulho com Relâmpago Azul (Fusion Bolt)',
      scale: 1.35,
      color: '#38BDF8',
      isFusionBolt: true,
      hasElectricCharge: true,
      chargeColor: '#38BDF8',
      chargeFile: 'vfx/custom/electric_charge_blue.png',
      applyElectrocuted: true
    }
  },
  69: { // Thunderbolt
    executionType: 'beam',
    visual: {
      file: 'vfx/custom/electrocuted_burst.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'thunderbolt_beam',
      theme: 'Feixe Elétrico Contínuo com Eletrocussão (Thunderbolt)',
      scale: 1.15,
      color: '#FACC15',
      isThunderbolt: true,
      hasElectricCharge: true,
      chargeColor: '#FACC15',
      chargeFile: 'vfx/custom/electric_charge_yellow.png',
      applyElectrocuted: true
    }
  },
  70: { // Wild Charge
    executionType: 'dash',
    visual: {
      file: 'core/thunder_01.png',
      cols: 5,
      rows: 2,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'wild_charge',
      theme: 'Investida Feroz Eletrizada com Carregamento (Wild Charge)',
      scale: 0.85,
      color: '#FACC15',
      hasElectricCharge: true,
      chargeColor: '#FACC15',
      chargeFile: 'vfx/custom/electric_charge_yellow.png'
    }
  },
  71: { // Discharge
    executionType: 'area',
    visual: {
      file: 'vfx/custom/electric_wave.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: 'discharge_burst',
      theme: 'Carregamento no Usuário e Descarga Radial no Inimigo (Discharge)',
      scale: 1.3,
      color: '#FACC15',
      isDischarge: true,
      hasElectricCharge: true,
      chargeColor: '#FACC15',
      chargeFile: 'vfx/custom/electric_charge_yellow.png',
      applyElectrocuted: true
    }
  },
  73: { // Volt Switch
    executionType: 'dash',
    visual: {
      file: 'core/punches.png',
      cols: 5,
      rows: 1,
      startFrame: 0,
      endFrame: 4,
      fps: 24,
      key: 'volt_switch',
      theme: 'Soco Elétrico Estilo Thunder Punch com Recuo (Volt Switch)',
      scale: 0.85,
      color: '#FACC15',
      isVoltSwitch: true
    }
  },
  75: { // Thunder Fang
    executionType: 'dash',
    visual: {
      file: 'core/teeth.png',
      cols: 5,
      rows: 2,
      startFrame: 0,
      endFrame: 4,
      fps: 24,
      key: 'thunder_fang',
      theme: 'Mordida de Presas Eletrificadas (Thunder Fang)',
      scale: 0.85,
      color: '#FACC15',
      isThunderFang: true,
      applyElectrocuted: true
    }
  },
  77: { // Electroweb
    executionType: 'projectile',
    visual: {
      file: 'vfx/custom/electroweb.png',
      cols: 5,
      rows: 1,
      startFrame: 0,
      endFrame: 4,
      fps: 20,
      key: 'electroweb',
      theme: 'Projétil de Teia Elétrica Dourada Desaceleradora (Electroweb)',
      scale: 1.2,
      color: '#FACC15',
      isElectroweb: true,
      applyElectrocuted: true
    }
  },
  83: { // Thunder Wave
    executionType: 'buff',
    visual: {
      file: 'vfx/custom/electric_wave.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 20,
      key: 'thunder_wave',
      theme: 'Onda Expansiva de Paralisia Elétrica (Thunder Wave)',
      scale: 1.25,
      target: 'target',
      color: '#FACC15',
      isThunderWave: true,
      applyElectrocuted: true
    }
  },
  570: { // Parabolic Charge
    executionType: 'area',
    visual: {
      file: 'vfx/custom/electric_shockwave_rings.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 20,
      key: 'parabolic_charge',
      theme: 'Ondas de Choque Elétricas no Solo e Dreno de Vida (Parabolic Charge)',
      scale: 1.45,
      color: '#FACC15',
      isParabolicCharge: true,
      drainPercent: 0.5
    }
  },
  604: { // Electric Terrain
    executionType: 'buff',
    visual: {
      file: 'vfx/custom/electric_terrain_decal.png',
      cols: 4,
      rows: 1,
      startFrame: 0,
      endFrame: 3,
      fps: 16,
      key: 'electric_terrain',
      theme: 'Terreno Elétrico com Fissuras e Raios Rastejantes (Electric Terrain)',
      scale: 1.6,
      target: 'self',
      isElectricTerrain: true
    }
  },
  82: { // Magnet Rise
    executionType: 'buff',
    visual: {
      file: 'vfx/custom/electric_charge_yellow.png',
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 20,
      key: 'magnet_rise',
      theme: 'Carregamento Eletromagnético Levitação (Magnet Rise)',
      scale: 1.1,
      target: 'self',
      isMagnetRise: true,
      hasElectricCharge: true,
      chargeColor: '#FACC15',
      chargeFile: 'vfx/custom/electric_charge_yellow.png'
    }
  },
  79: { // Thunder Shock
    executionType: 'projectile',
    visual: {
      file: 'vfx/electric/thunder.png',
      cols: 8,
      rows: 1,
      startFrame: 0,
      endFrame: 7,
      fps: 24,
      key: 'thunder_shock',
      theme: 'Projétil Elétrico Rápido com Eletrocussão (Thunder Shock)',
      scale: 0.75,
      color: '#FACC15',
      isThunderShock: true,
      applyElectrocuted: true
    }
  },
  80: { // Electro Ball
    executionType: 'projectile',
    visual: {
      file: 'vfx/pixel_fire/colored/yellow/group_4_2.png',
      cols: 14,
      rows: 1,
      startFrame: 0,
      endFrame: 13,
      fps: 24,
      key: 'electro_ball',
      theme: 'Orbe de Plasma Elétrico Veloz com Eletrocussão (Electro Ball)',
      scale: 0.95,
      color: '#FACC15',
      isElectroBall: true,
      applyElectrocuted: true
    }
  }
};

// Replace each entry in content
for (const [id, up] of Object.entries(updates)) {
  const moveRegex = new RegExp(`("${id}":\\s*\\{[\\s\\S]*?"id":\\s*${id},[\\s\\S]*?"activeCombatCompatible":\\s*true\\s*\\})`, 'm');
  const match = content.match(moveRegex);
  if (!match) {
    console.error(`Move ID ${id} not found with regex!`);
    continue;
  }

  let moveBlock = match[1];

  // Update executionType
  moveBlock = moveBlock.replace(/"executionType":\s*"[^"]*"/, `"executionType": "${up.executionType}"`);

  // Update visual
  const visualRegex = /"visual":\s*\{[\s\S]*?\}/;
  const visualJson = JSON.stringify(up.visual, null, 6);
  moveBlock = moveBlock.replace(visualRegex, `"visual": ${visualJson}`);

  content = content.replace(match[1], moveBlock);
  console.log(`Updated Move #${id}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated movesDatabase.js with all 17 electric moves!');
