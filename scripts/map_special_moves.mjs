import { MOVES_BY_ID, INCOMPATIBLE_ACTIVE_COMBAT_MOVES } from '../client/src/battle/movesDatabase.js';

const allMoves = Object.values(MOVES_BY_ID);

const categories = {
  // 1. Feixes Contínuos e Lasers (Caster canaliza parado, trava o alvo no feixe ou empurra)
  channeled_beam: {
    title: 'Feixes Contínuos, Lasers e Sopros Direcionais (Beams)',
    desc: 'Golpes que disparam um raio/laser ou coluna contínua de energia. O usuário canaliza parado enquanto o feixe atravessa a arena, travando o alvo ou empurrando-o para trás.',
    moves: []
  },
  // 2. Chuvas Aéreas e Bombardeios Orbitais (como Draco Meteor)
  aerial_multimeteor: {
    title: 'Chuvas Aéreas, Nevascas e Bombardeio do Céu (Draco Meteor Style)',
    desc: 'Golpes onde projéteis ou elementos caem verticalmente do céu em área com indicador no solo, múltiplos impactos ou tempestades.',
    moves: []
  },
  // 3. Golpes com Fases de Inalvejabilidade / Subterrâneo / Céu (Two-Turn / Evasion)
  two_turn_invuln: {
    title: 'Mergulho, Subterrâneo e Céu (Fase Inalvejável / Invulnerabilidade)',
    desc: 'Golpes onde o Pokémon sai temporariamente do plano de combate (entra na terra, água, sombras ou voa bem alto ficando inalvejável) antes de desferir o golpe surpresa.',
    moves: []
  },
  // 4. Golpes com Carga Prévia / Canalização de Força (Charging Strikes)
  charge_strike: {
    title: 'Golpes de Canalização / Carga Prévia (Charge Moves)',
    desc: 'Golpes com tempo de antecipação/carga elevado antes da liberação explosiva (absorvendo energia solar, abaixando a cabeça para defesa ou concentrando foco).',
    moves: []
  },
  // 5. Múltiplos Projéteis / Rajadas Dispersas / Leques (Multi-Projectile Spreads)
  multi_projectile: {
    title: 'Disparos Múltiplos, Rajadas e Triplos Projéteis (Multi-Projectile)',
    desc: 'Golpes que atiram 2 a 5 projéteis em sequência rápida ou espalhados em cone/leque (como balas, espinhos ou tornados múltiplos).',
    moves: []
  },
  // 6. Projéteis em Arco Parabólico / Morteiros (Lobbed / Mortar Bombs)
  arc_lobbed: {
    title: 'Projéteis Parabólicos e Bombas em Arco (Mortar / Lobbed)',
    desc: 'Bombas e sementes atiradas para o alto que caem em arco parabólico no local do alvo, explodindo ao atingir o chão.',
    moves: []
  },
  // 7. Projétil Bumerangue / Vai-e-Volta (Return Projectiles)
  boomerang_recoil: {
    title: 'Projéteis Retornáveis / Bumerangue (Boomerang / Rebound)',
    desc: 'Projétil que viaja em linha reta ou curva até a distância máxima e depois retorna ao atacante, podendo acertar duas vezes.',
    moves: []
  },
  // 8. Vórtices e Armadilhas de Aprisionamento Contínuo (Trapping DoT Vortices)
  continuous_trap: {
    title: 'Vórtices de Aprisionamento e Turbilhões Contínuos (Traps & DoT)',
    desc: 'Redemoinhos de fogo, areia, água ou teia que prendem o Pokémon adversário dentro do vórtice por alguns segundos, causando dano contínuo (DoT) e impedindo corrida.',
    moves: []
  },
  // 9. Ondas Sísmicas, Rachaduras no Solo e Erupções Terrestres (Ground Shockwaves)
  ground_aoe_hazard: {
    title: 'Ondas Sísmicas, Terremotos e Rachaduras no Solo (Ground AoE)',
    desc: 'Golpes que atingem o chão gerando fissuras radiantes, tremores de tela e erupções de rochas/lava sob os pés do alvo.',
    moves: []
  },
  // 10. Vampirismo e Dreno de Energia (Drain HP Lines)
  drain_vampiric: {
    title: 'Dreno de Vida e Vampirismo (Drain Lines)',
    desc: 'Cria filamentos de energia conectando defensor e atacante, drenando HP em tempo real e curando o usuário proporcionalmente ao dano causado.',
    moves: []
  },
  // 11. Manobras Especiais de Dash / Recuo / Giros (Special Dash & Mobility)
  special_dash_maneuver: {
    title: 'Dashes Especiais, Giros e Golpes de Hit-and-Run (Acrobatic Dashes)',
    desc: 'Golpes corporais que não são investidas simples: giros supersônicos de carapaça, investida com recuo imediato (hit-and-run) ou dashes em zigue-zague com extrema velocidade.',
    moves: []
  },
  // 12. Ondas Sonoras e Ecos Acústicos (Acoustic Shockwaves)
  sound_wave: {
    title: 'Ondas Sonoras, Gritos e Ecos Acústicos (Sonic AoE)',
    desc: 'Pulsos circulares concêntricos que se expandem em 360° ou em cone acústico, ignorando defesas convencionais/barreiras.',
    moves: []
  },
  // 13. Posturas Reativas e Contra-Ataques (Counters & Spikes)
  reactive_counter: {
    title: 'Contra-Ataques Reativos e Barreiras com Punição (Counters & Rebounds)',
    desc: 'O Pokémon assume postura defensiva por 0.8s: se atingido durante a postura, bloqueia o dano e devolve em dobro ou pune o contato do agressor.',
    moves: []
  },
  // 14. Golpes Suicidas / Autodestruição (Suicide Nukes)
  suicide_nuke: {
    title: 'Autodestruição e Explosões Totais de Arena (Suicide Nukes)',
    desc: 'Contagem regressiva no próprio corpo seguida de explosão colossal que consome o HP do usuário mas varre a arena.',
    moves: []
  },
  // 15. Golpes Dimensionais e de Assinatura Lendária (Signature Ultimates)
  signature_legendary: {
    title: 'Golpes Cósmicos, Dimensionais e Assinaturas Únicas (Mythic / Signatures)',
    desc: 'Golpes lendários de efeito visual e espacial de grande impacto: fendas temporais/espaciais, pilares geológicos gigantescos ou meteoros celestiais.',
    moves: []
  }
};

for (const m of allMoves) {
  const name = m.name.toLowerCase();
  const intName = m.internalName;
  const isCompat = !INCOMPATIBLE_ACTIVE_COMBAT_MOVES.has(intName);
  const entry = { id: m.id, name: m.name, internalName: intName, type: m.type, category: m.category, power: m.power, isCompat };

  // 1. Channeled Beams (excluding pure solar beam which is charge first)
  const beamKeywords = ['hyper beam', 'hydro pump', 'ice beam', 'flamethrower', 'signal beam', 'psybeam', 'flash cannon', 'dragon pulse', 'aura sphere', 'charge beam', 'bubble beam', 'techno blast', 'focus blast', 'blast burn', 'hydro cannon', 'frenzy plant', 'origin pulse', 'light of ruin', 'aeroblast', 'tri attack'];
  if (beamKeywords.some(k => name.includes(k)) || (m.executionType === 'beam' && !name.includes('solar beam'))) {
    categories.channeled_beam.moves.push(entry);
  }

  // 2. Aerial / Multi-meteor
  const skyKeywords = ['blizzard', 'draco meteor', 'meteor mash', 'hurricane', 'rain dance', 'sandstorm', 'hail', 'rock slide', 'stone edge', 'doom desire', 'muddy water', 'leaf storm', 'smog', 'haze'];
  if (skyKeywords.some(k => name.includes(k)) || (m.visual && m.visual.isDracoMeteor)) {
    categories.aerial_multimeteor.moves.push(entry);
  }

  // 3. Two turn invulnerable
  const invulnKeywords = ['dig', 'fly', 'dive', 'bounce', 'phantom force', 'shadow force', 'sky drop'];
  if (invulnKeywords.some(k => name === k || intName === k.toUpperCase().replace(/\s+/g,''))) {
    categories.two_turn_invuln.moves.push(entry);
  }

  // 4. Charge strike
  const chargeKeywords = ['solar beam', 'solarbeam', 'skull bash', 'sky attack', 'razor wind', 'geomancy', 'focus punch'];
  if (chargeKeywords.some(k => name.includes(k))) {
    categories.charge_strike.moves.push(entry);
  }

  // 5. Multi projectile
  const multiProjKeywords = ['bullet seed', 'pin missile', 'spike cannon', 'rock blast', 'icicle spear', 'water shuriken', 'barrage', 'twister', 'tail whip'];
  if (multiProjKeywords.some(k => name.includes(k)) || (m.visual && m.visual.projectileCount > 1)) {
    categories.multi_projectile.moves.push(entry);
  }

  // 6. Arc / lobbed
  const arcKeywords = ['sludge bomb', 'seed bomb', 'mud bomb', 'egg bomb', 'acid spray', 'sludge wave', 'maget bomb'];
  if (arcKeywords.some(k => name.includes(k))) {
    categories.arc_lobbed.moves.push(entry);
  }

  // 7. Boomerang
  if (name.includes('bonemerang') || name.includes('boomerang')) {
    categories.boomerang_recoil.moves.push(entry);
  }

  // 8. Continuous trap
  const trapKeywords = ['fire spin', 'whirlpool', 'sand tomb', 'magma storm', 'wrap', 'bind', 'clamp', 'infestation'];
  if (trapKeywords.some(k => name.includes(k))) {
    categories.continuous_trap.moves.push(entry);
  }

  // 9. Ground AoE / Earthquake / Hazards
  const groundKeywords = ['earthquake', 'fissure', 'earth power', 'bulldoze', 'stealth rock', 'spikes', 'toxic spikes', 'sticky web', 'eruption', 'lava plume', 'land\'s wrath', 'precipice blades'];
  if (groundKeywords.some(k => name.includes(k))) {
    categories.ground_aoe_hazard.moves.push(entry);
  }

  // 10. Drain
  if (['drain', 'leech life', 'horn leech', 'absorb', 'oblivion wing', 'parabolic charge'].some(k => name.includes(k)) || (m.combatBehavior && m.combatBehavior.drainPercent > 0)) {
    categories.drain_vampiric.moves.push(entry);
  }

  // 11. Special dash / acrobatic mobility
  const specialDashKeywords = ['rollout', 'ice ball', 'rapid spin', 'u-turn', 'volt switch', 'extreme speed', 'aqua jet', 'mach punch', 'bullet punch', 'shadow sneak', 'flame charge', 'gyro ball'];
  if (specialDashKeywords.some(k => name.replace(/[\s-]/g,'').includes(k.replace(/[\s-]/g,'')))) {
    categories.special_dash_maneuver.moves.push(entry);
  }

  // 12. Sound wave
  const soundKeywords = ['hyper voice', 'boomburst', 'bug buzz', 'snarl', 'relic song', 'uproar', 'chatter', 'disarming voice', 'screech', 'growl', 'roar', 'sing', 'grass whistle', 'supersonic'];
  if (soundKeywords.some(k => name.includes(k))) {
    categories.sound_wave.moves.push(entry);
  }

  // 13. Counter / Reactive
  const counterKeywords = ['counter', 'mirror coat', 'destiny bond', 'spiky shield', 'kings shield', 'bide', 'metal burst', 'detect', 'protect'];
  if (counterKeywords.some(k => name.replace(/['\s]/g,'').includes(k.replace(/['\s]/g,'')))) {
    categories.reactive_counter.moves.push(entry);
  }

  // 14. Suicide nuke
  const nukeKeywords = ['explosion', 'self-destruct', 'memento', 'healing wish', 'final gambit'];
  if (nukeKeywords.some(k => name.replace(/[\s-]/g,'').includes(k.replace(/[\s-]/g,'')))) {
    categories.suicide_nuke.moves.push(entry);
  }

  // 15. Signature / Legendary
  const sigKeywords = ['judgment', 'spacial rend', 'origin pulse', 'precipice blades', 'aeroblast', 'sacred fire', 'blue flare', 'bolt strike', 'fusion flare', 'fusion bolt', 'oblivion wing', 'geomancy', 'diamond storm', 'hyperspace hole', 'hyperspace fury', 'steam eruption', 'thousand arrows', 'thousand waves', 'dragon ascent', 'roar of time', 'v-create', 'searing shot'];
  if (sigKeywords.some(k => name.includes(k))) {
    categories.signature_legendary.moves.push(entry);
  }
}

for (const [key, cat] of Object.entries(categories)) {
  console.log(`\n======================================================`);
  console.log(`📌 ${cat.title} (${cat.moves.length} golpes)`);
  console.log(`Descrição: ${cat.desc}`);
  console.log(`Exemplos:`);
  for (const m of cat.moves.slice(0, 15)) {
    console.log(`  - [#${m.id}] ${m.name} [${m.type} | ${m.category}] (Compatível: ${m.isCompat ? 'SIM' : 'NÃO'})`);
  }
  if (cat.moves.length > 15) {
    console.log(`  ... e mais ${cat.moves.length - 15} golpes.`);
  }
}
