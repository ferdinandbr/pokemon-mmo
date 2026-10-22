// Pokemon Data Engine for Real-Time Arena 2D Combat
// Incorporates Authentic Gen 1-6 Stats, Full 18-Type Matchup Chart, and 621 Dynamic Moves
import { getMoveData } from './movesDatabase.js';

export const TYPE_COLORS = {
  Normal:   '#A8A878',
  Fire:     '#F08030',
  Water:    '#6890F0',
  Grass:    '#78C850',
  Electric: '#F8D030',
  Ice:      '#98D8D8',
  Fighting: '#C03028',
  Poison:   '#A040A0',
  Ground:   '#E0C068',
  Flying:   '#A890F0',
  Psychic:  '#F85888',
  Bug:      '#A8B820',
  Rock:     '#B8A038',
  Ghost:    '#705898',
  Dragon:   '#7038F8',
  Steel:    '#B8B8D0',
  Dark:     '#705848',
  Fairy:    '#EE99AC',
};

// Crisp SVG Vector Emblems for all 18 Pokémon Types (matches modern HUD design)
export function getTypeIconSvg(type = 'normal') {
  const t = String(type || 'normal').toLowerCase();
  switch (t) {
    case 'fire':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2C9.5 6 7 8.5 7 12a5 5 0 0 0 10 0c0-3.5-2.5-6-5-10zm0 16a3 3 0 0 1-3-3c0-1.8 1.5-3 3-5 1.5 2 3 3.2 3 5a3 3 0 0 1-3 3z" fill="currentColor"/></svg>`;
    case 'water':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2.5C12 2.5 6 10 6 15a6 6 0 0 0 12 0c0-5-6-12.5-6-12.5zm0 15a3 3 0 0 1-3-3c0-1.5 1.5-3.5 3-5.2 1.5 1.7 3 3.7 3 5.2a3 3 0 0 1-3 3z" fill="currentColor"/></svg>`;
    case 'grass':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M17 3c-6.6 0-12 5.4-12 12 0 1.9.4 3.7 1.2 5.3C6.7 19.1 7 17.6 7 16c0-4.4 3.6-8 8-8 1.6 0 3.1.3 4.3.8C18.4 4.5 17 3 17 3zm2 5.5c-1.2-.5-2.5-.8-3.9-.8-4.9 0-9 3.8-9.4 8.7C7.4 19.3 10.4 21 14 21c5 0 7-5 7-10.5 0-.7-.1-1.3-.2-2z" fill="currentColor"/></svg>`;
    case 'electric':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M11 2L4 13h6l-2 9 9-11h-6l2-9z" fill="currentColor"/></svg>`;
    case 'ice':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>`;
    case 'fighting':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M6 13c0-2.2 1.8-4 4-4h4a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-4zm3-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor"/></svg>`;
    case 'poison':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2a7 7 0 0 0-7 7c0 3.5 2 5.5 3 7v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3c1-1.5 3-3.5 3-7a7 7 0 0 0-7-7zm-2.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>`;
    case 'ground':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M3 19h18L17 8l-4 6-3-4-7 9z" fill="currentColor"/></svg>`;
    case 'flying':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M3 13c5-5 11-7 18-6-2 5-6 10-12 11-2-1-4-3-6-5z" fill="currentColor"/></svg>`;
    case 'psychic':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"/></svg>`;
    case 'bug':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 3a4 4 0 0 0-4 4v1H6a1 1 0 0 0 0 2h2v2H5a1 1 0 0 0 0 2h3v1a4 4 0 0 0 8 0v-1h3a1 1 0 0 0 0-2h-3v-2h2a1 1 0 0 0 0-2h-2V7a4 4 0 0 0-4-4zm-2 5a2 2 0 1 1 4 0v1h-4V8z" fill="currentColor"/></svg>`;
    case 'rock':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M8 3l8 2 5 6-4 10H7L3 13l5-10z" fill="currentColor"/></svg>`;
    case 'ghost':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2a7 7 0 0 0-7 7v10l3-2 2 2 2-2 2 2 3-2V9a7 7 0 0 0-7-7zm-2 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>`;
    case 'dragon':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.5 0 4.8-.9 6.6-2.4l-3-3A6 6 0 1 1 18 12h4c0-5.5-4.5-10-10-10z" fill="currentColor"/></svg>`;
    case 'steel':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" fill="currentColor"/></svg>`;
    case 'dark':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2a9.9 9.9 0 0 0-3 .5 10 10 0 1 0 12.5 12.5A10 10 0 0 1 12 2z" fill="currentColor"/></svg>`;
    case 'fairy':
      return `<svg viewBox="0 0 24 24" class="type-svg"><path d="M12 2l2.5 6.5L21 11l-5.5 4.5L17 22l-5-4-5 4 1.5-6.5L3 11l6.5-2.5L12 2z" fill="currentColor"/></svg>`;
    case 'normal':
    default:
      return `<svg viewBox="0 0 24 24" class="type-svg"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
  }
}

// Full 18-Type Matchup Chart
export const TYPE_CHART = {
  Normal:   { Rock: 0.5, Ghost: 0.0, Steel: 0.5 },
  Fire:     { Fire: 0.5, Water: 0.5, Grass: 2.0, Ice: 2.0, Bug: 2.0, Rock: 0.5, Dragon: 0.5, Steel: 2.0 },
  Water:    { Fire: 2.0, Water: 0.5, Grass: 0.5, Ground: 2.0, Rock: 2.0, Dragon: 0.5 },
  Grass:    { Fire: 0.5, Water: 2.0, Grass: 0.5, Poison: 0.5, Ground: 2.0, Flying: 0.5, Bug: 0.5, Rock: 2.0, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2.0, Grass: 0.5, Electric: 0.5, Ground: 0.0, Flying: 2.0, Dragon: 0.5 },
  Ice:      { Fire: 0.5, Water: 0.5, Grass: 2.0, Ice: 0.5, Ground: 2.0, Flying: 2.0, Dragon: 2.0, Steel: 0.5 },
  Fighting: { Normal: 2.0, Ice: 2.0, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2.0, Ghost: 0.0, Dark: 2.0, Steel: 2.0, Fairy: 0.5 },
  Poison:   { Grass: 2.0, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0.0, Fairy: 2.0 },
  Ground:   { Fire: 2.0, Electric: 2.0, Grass: 0.5, Poison: 2.0, Flying: 0.0, Bug: 0.5, Rock: 2.0, Steel: 2.0 },
  Flying:   { Grass: 2.0, Electric: 0.5, Fighting: 2.0, Bug: 2.0, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2.0, Poison: 2.0, Psychic: 0.5, Dark: 0.0, Steel: 0.5 },
  Bug:      { Fire: 0.5, Grass: 2.0, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2.0, Ghost: 0.5, Dark: 2.0, Steel: 0.5, Fairy: 0.5 },
  Rock:     { Fire: 2.0, Ice: 2.0, Fighting: 0.5, Ground: 0.5, Flying: 2.0, Bug: 2.0, Steel: 0.5 },
  Ghost:    { Normal: 0.0, Psychic: 2.0, Ghost: 2.0, Dark: 0.5 },
  Dragon:   { Dragon: 2.0, Steel: 0.5, Fairy: 0.0 },
  Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2.0, Rock: 2.0, Steel: 0.5, Fairy: 2.0 },
  Dark:     { Fighting: 0.5, Psychic: 2.0, Ghost: 2.0, Dark: 0.5, Fairy: 0.5 },
  Fairy:    { Fire: 0.5, Fighting: 2.0, Poison: 0.5, Dragon: 2.0, Dark: 2.0, Steel: 0.5 },
};

export function getTypeMultiplier(attackerType, defType1, defType2 = null) {
  if (!attackerType || !defType1) return 1.0;
  const a = attackerType.charAt(0).toUpperCase() + attackerType.slice(1).toLowerCase();
  const d1 = defType1.charAt(0).toUpperCase() + defType1.slice(1).toLowerCase();
  const d2 = defType2 ? defType2.charAt(0).toUpperCase() + defType2.slice(1).toLowerCase() : null;

  let mult = 1.0;
  if (TYPE_CHART[a] && TYPE_CHART[a][d1] !== undefined) {
    mult *= TYPE_CHART[a][d1];
  }
  if (d2 && TYPE_CHART[a] && TYPE_CHART[a][d2] !== undefined) {
    mult *= TYPE_CHART[a][d2];
  }
  return mult;
}

export const NATURE_MODIFIERS = {
  Hardy:   {},
  Lonely:  { atk: 1.1, def: 0.9 },
  Brave:   { atk: 1.1, speed: 0.9 },
  Adamant: { atk: 1.1, spAtk: 0.9 },
  Naughty: { atk: 1.1, spDef: 0.9 },
  Bold:    { def: 1.1, atk: 0.9 },
  Relaxed: { def: 1.1, speed: 0.9 },
  Impish:  { def: 1.1, spAtk: 0.9 },
  Lax:     { def: 1.1, spDef: 0.9 },
  Timid:   { speed: 1.1, atk: 0.9 },
  Hasty:   { speed: 1.1, def: 0.9 },
  Jolly:   { speed: 1.1, spAtk: 0.9 },
  Naive:   { speed: 1.1, spDef: 0.9 },
  Modest:  { spAtk: 1.1, atk: 0.9 },
  Mild:    { spAtk: 1.1, def: 0.9 },
  Quiet:   { spAtk: 1.1, speed: 0.9 },
  Rash:    { spAtk: 1.1, spDef: 0.9 },
  Calm:    { spDef: 1.1, atk: 0.9 },
  Gentle:  { spDef: 1.1, def: 0.9 },
  Sassy:   { spDef: 1.1, speed: 0.9 },
  Careful: { spDef: 1.1, spAtk: 0.9 },
};

// Authentic PokéMMO Stat Calculation Formula (Base, IVs 0-31, EVs 0-252, Nature, Level)
export function calculatePokemonStats(baseStats, level = 50, ivs = {}, evs = {}, nature = 'Hardy') {
  const defaultIvs = { hp: 31, atk: 31, def: 31, spAtk: 31, spDef: 31, speed: 31 };
  const defaultEvs = { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 };
  const finalIvs = { ...defaultIvs, ...ivs };
  const finalEvs = { ...defaultEvs, ...evs };
  const natureMods = NATURE_MODIFIERS[nature] || {};

  // Authentic HP Formula: floor(((2 * Base + IV + floor(EV / 4)) * Level) / 100) + Level + 10
  const rawHp = Math.floor(((2 * baseStats.hp + finalIvs.hp + Math.floor(finalEvs.hp / 4)) * level) / 100) + level + 10;
  // Scaled for real-time arena combat duration (~500-750 HP for ~20-35s battles)
  const arenaHp = Math.round(rawHp * 4.2);

  const calcStat = (key) => {
    const raw = Math.floor(((2 * baseStats[key] + finalIvs[key] + Math.floor(finalEvs[key] / 4)) * level) / 100) + 5;
    const mult = natureMods[key] || 1.0;
    return Math.floor(raw * mult);
  };

  return {
    hp: arenaHp,
    atk: calcStat('atk'),
    def: calcStat('def'),
    spAtk: calcStat('spAtk'),
    spDef: calcStat('spDef'),
    speed: calcStat('speed'),
  };
}

// Calculate Movement Speed scaling from Pokémon Speed stat
export function calculateMovementSpeed(speedStat) {
  // Speed 30 -> 180 px/s
  // Speed 80 -> 217 px/s
  // Speed 100 -> 230 px/s
  // Speed 130 -> 250 px/s
  return Math.round(165 + (Math.max(20, Math.min(200, speedStat)) / 130) * 85);
}

// Calculate Dodge Cooldown scaling from Pokémon Speed stat
export function calculateDodgeCooldown(speedStat) {
  const baseCd = 1.15;
  const cd = baseCd * (100 / Math.max(50, speedStat));
  return Math.round(Math.max(0.60, Math.min(1.80, cd)) * 100) / 100;
}

// Calculate Attack Cooldown scaling from Move Power and Pokémon Speed stat
export function calculateMoveCooldown(movePower, speedStat) {
  // Dynamic & Fast-Paced Real-Time Combat Cadence:
  // Power 0 (status/barrier): 2.8s base (down from 4.0s)
  // Power 40 (Tackle/Water Gun): 1.25s base (down from 1.8s)
  // Power 80 (Bite/Crunch): 2.4s base (down from 3.5s)
  // Power 120-150 (Hydro Pump/Hyper Beam): 5.0s - 6.0s base (down from 7.5s - 9.0s)
  const power = Math.max(0, movePower || 0);
  const base = power <= 0 ? 2.8 : Math.max(1.1, (power / 26) * 1.05);
  const speedFactor = 100 / Math.max(50, speedStat * 0.75 + 25);
  return Math.max(0.60, Math.round(base * speedFactor * 100) / 100);
}

// Full Authentic Damage Formula for 2D Real-Time Combat
export function calculateCombatDamage(attacker, defender, move) {
  const isPhysical = move.category === 'Physical';

  // Stat stage multipliers (Gen 5/6 PokéMMO standards: +1 -> 1.5x, +2 -> 2.0x, -1 -> 0.67x, -2 -> 0.5x)
  const getStageMultiplier = (stage = 0) => {
    if (stage >= 0) return (2 + stage) / 2;
    return 2 / (2 - stage);
  };

  const atkStage = (attacker.statStages && (isPhysical ? attacker.statStages.atk : attacker.statStages.spAtk)) || 0;
  const defStage = (defender.statStages && (isPhysical ? defender.statStages.def : defender.statStages.spDef)) || 0;

  const rawAtkStat = isPhysical ? attacker.data.stats.atk : attacker.data.stats.spAtk;
  const rawDefStat = isPhysical ? defender.data.stats.def : defender.data.stats.spDef;

  const atkStat = Math.max(1, Math.round(rawAtkStat * getStageMultiplier(atkStage)));
  const defStat = Math.max(1, Math.round(rawDefStat * getStageMultiplier(defStage)));

  const level = attacker.level || (attacker.data && attacker.data.level) || 50;
  const power = Math.max(15, move.power || 40);

  // STAB: Same Type Attack Bonus (1.5x)
  const stab = (move.type === attacker.data.type1 || move.type === attacker.data.type2) ? 1.5 : 1.0;

  // Type effectiveness
  const typeMult = getTypeMultiplier(move.type, defender.data.type1, defender.data.type2);

  // Critical Hit (Base: ~4.16% [1/24], Stage 1: 12.5% [1/8], Stage 2+: 25% [1/4])
  const critStage = (move.combatBehavior && move.combatBehavior.critStage) || 0;
  const critChance = critStage >= 2 ? 0.25 : (critStage === 1 ? 0.125 : 0.0416);
  const isCrit = Math.random() < critChance;
  const critMult = isCrit ? 1.35 : 1.0;

  // Real-Time Action Combat Formula with 0.80 Pacing Factor (~20-35s tactical battles)
  const COMBAT_PACING_FACTOR = 0.80;
  const baseDamage = ((((2 * level / 5 + 2) * power * (atkStat / Math.max(1, defStat))) / 50) + 2) * COMBAT_PACING_FACTOR;
  const randomFactor = 0.88 + Math.random() * 0.12;
  const finalDamage = Math.max(1, Math.round(baseDamage * stab * typeMult * critMult * randomFactor));

  return {
    damage: finalDamage,
    isCrit,
    typeMultiplier: typeMult,
    isSuperEffective: typeMult > 1.0,
    isNotVeryEffective: typeMult < 1.0 && typeMult > 0,
    isImmune: typeMult === 0,
  };
}

// Helper to pick audio SE based on move type
export function getMoveSound(type, category, name = '') {
  const n = (name || '').toLowerCase();
  if (n.includes('mordida') || n.includes('bite') || n.includes('crunch')) return '/assets/audio/se/anim/Crash.ogg';
  if (n.includes('hydro') || n.includes('surf')) return '/assets/audio/se/anim/Water5.ogg';
  if (n.includes('water') || n.includes('bolha') || n.includes('bubble')) return '/assets/audio/se/anim/Water1.ogg';
  if (n.includes('flame') || n.includes('fogo') || n.includes('fire blast')) return '/assets/audio/se/anim/Fire3.ogg';
  if (n.includes('ember') || n.includes('brasa')) return '/assets/audio/se/anim/Fire1.ogg';
  if (n.includes('thunder') || n.includes('raio') || n.includes('spark')) return '/assets/audio/se/anim/Thunder1.ogg';
  if (n.includes('earth') || n.includes('terra') || n.includes('rock')) return '/assets/audio/se/anim/Earth1.ogg';

  switch (type) {
    case 'Fire': return '/assets/audio/se/anim/Fire1.ogg';
    case 'Water': return '/assets/audio/se/anim/Water1.ogg';
    case 'Electric': return '/assets/audio/se/anim/Thunder1.ogg';
    case 'Grass': return '/assets/audio/se/anim/Wind1.ogg';
    case 'Ice': return '/assets/audio/se/anim/Blow4.ogg';
    case 'Psychic': return '/assets/audio/se/anim/Confuse.ogg';
    case 'Ghost':
    case 'Dark': return '/assets/audio/se/anim/Darkness2.ogg';
    case 'Fighting': return '/assets/audio/se/anim/Crash.ogg';
    default: return '/assets/audio/se/anim/Blow1.ogg';
  }
}

// Default Level-up Move Profiles for Gen 1 Species when moves array is absent
const DEFAULT_SPECIES_MOVES = {
  1: [303, 208, 205, 195], // Bulbasaur: Tackle, Vine Whip, Razor Leaf, Solar Beam
  2: [303, 208, 205, 195], // Ivysaur
  3: [303, 208, 205, 195], // Venusaur
  4: [311, 146, 143, 136], // Charmander: Scratch, Ember, Flame Wheel, Flamethrower
  5: [311, 146, 143, 136], // Charmeleon
  6: [311, 146, 136, 128], // Charizard: Scratch, Ember, Flamethrower, Fire Blast
  7: [303, 551, 546, 536], // Squirtle: Tackle, Water Gun, Bubble Beam, Hydro Pump
  8: [303, 551, 546, 536], // Wartortle
  9: [303, 551, 271, 536], // Blastoise: Tackle, Water Gun, Skull Bash, Hydro Pump
  16: [303, 167, 310, 164], // Pidgey: Tackle, Gust, Quick Attack, Wing Attack
  17: [303, 167, 310, 164], // Pidgeotto
  18: [303, 167, 310, 164], // Pidgeot
  25: [310, 79, 74, 69],    // Pikachu: Quick Attack, Thunder Shock, Spark, Thunderbolt
  26: [310, 79, 74, 65],    // Raichu: Quick Attack, Thunder Shock, Spark, Thunder
  94: [182, 181, 178, 175], // Gengar: Lick, Astonish, Shadow Punch, Shadow Ball
  150: [462, 460, 452, 448], // Mewtwo: Confusion, Psybeam, Psychic, Psycho Boost
};

export const GEN1_SPECIES = {
  1: { name: 'Bulbasaur', type1: 'Grass', type2: 'Poison', baseHp: 45, atk: 49, def: 49, spAtk: 65, spDef: 65, speed: 45 },
  2: { name: 'Ivysaur', type1: 'Grass', type2: 'Poison', baseHp: 60, atk: 62, def: 63, spAtk: 80, spDef: 80, speed: 60 },
  3: { name: 'Venusaur', type1: 'Grass', type2: 'Poison', baseHp: 80, atk: 82, def: 83, spAtk: 100, spDef: 100, speed: 80 },
  4: { name: 'Charmander', type1: 'Fire', type2: null, baseHp: 39, atk: 52, def: 43, spAtk: 60, spDef: 50, speed: 65 },
  5: { name: 'Charmeleon', type1: 'Fire', type2: null, baseHp: 58, atk: 64, def: 58, spAtk: 80, spDef: 65, speed: 80 },
  6: { name: 'Charizard', type1: 'Fire', type2: 'Flying', baseHp: 78, atk: 84, def: 78, spAtk: 109, spDef: 85, speed: 100 },
  7: { name: 'Squirtle', type1: 'Water', type2: null, baseHp: 44, atk: 48, def: 65, spAtk: 50, spDef: 64, speed: 43 },
  8: { name: 'Wartortle', type1: 'Water', type2: null, baseHp: 59, atk: 63, def: 80, spAtk: 65, spDef: 80, speed: 58 },
  9: { name: 'Blastoise', type1: 'Water', type2: null, baseHp: 79, atk: 83, def: 100, spAtk: 85, spDef: 105, speed: 78 },
  10: { name: 'Caterpie', type1: 'Bug', type2: null, baseHp: 45, atk: 30, def: 35, spAtk: 20, spDef: 20, speed: 45 },
  11: { name: 'Metapod', type1: 'Bug', type2: null, baseHp: 50, atk: 25, def: 55, spAtk: 25, spDef: 25, speed: 30 },
  12: { name: 'Butterfree', type1: 'Bug', type2: 'Flying', baseHp: 60, atk: 45, def: 50, spAtk: 90, spDef: 80, speed: 70 },
  13: { name: 'Weedle', type1: 'Bug', type2: 'Poison', baseHp: 40, atk: 35, def: 30, spAtk: 20, spDef: 20, speed: 50 },
  14: { name: 'Kakuna', type1: 'Bug', type2: 'Poison', baseHp: 45, atk: 25, def: 50, spAtk: 25, spDef: 25, speed: 35 },
  15: { name: 'Beedrill', type1: 'Bug', type2: 'Poison', baseHp: 65, atk: 90, def: 40, spAtk: 45, spDef: 80, speed: 75 },
  16: { name: 'Pidgey', type1: 'Normal', type2: 'Flying', baseHp: 40, atk: 45, def: 40, spAtk: 35, spDef: 35, speed: 56 },
  17: { name: 'Pidgeotto', type1: 'Normal', type2: 'Flying', baseHp: 63, atk: 60, def: 55, spAtk: 50, spDef: 50, speed: 71 },
  18: { name: 'Pidgeot', type1: 'Normal', type2: 'Flying', baseHp: 83, atk: 80, def: 75, spAtk: 70, spDef: 70, speed: 101 },
  19: { name: 'Rattata', type1: 'Normal', type2: null, baseHp: 30, atk: 56, def: 35, spAtk: 25, spDef: 35, speed: 72 },
  20: { name: 'Raticate', type1: 'Normal', type2: null, baseHp: 55, atk: 81, def: 60, spAtk: 50, spDef: 70, speed: 97 },
  21: { name: 'Spearow', type1: 'Normal', type2: 'Flying', baseHp: 40, atk: 60, def: 30, spAtk: 31, spDef: 31, speed: 70 },
  22: { name: 'Fearow', type1: 'Normal', type2: 'Flying', baseHp: 65, atk: 90, def: 65, spAtk: 61, spDef: 61, speed: 100 },
  23: { name: 'Ekans', type1: 'Poison', type2: null, baseHp: 35, atk: 60, def: 44, spAtk: 40, spDef: 54, speed: 55 },
  24: { name: 'Arbok', type1: 'Poison', type2: null, baseHp: 60, atk: 95, def: 69, spAtk: 65, spDef: 79, speed: 80 },
  25: { name: 'Pikachu', type1: 'Electric', type2: null, baseHp: 35, atk: 55, def: 40, spAtk: 50, spDef: 50, speed: 90 },
  26: { name: 'Raichu', type1: 'Electric', type2: null, baseHp: 60, atk: 90, def: 55, spAtk: 90, spDef: 80, speed: 110 },
  27: { name: 'Sandshrew', type1: 'Ground', type2: null, baseHp: 50, atk: 75, def: 85, spAtk: 20, spDef: 30, speed: 40 },
  28: { name: 'Sandslash', type1: 'Ground', type2: null, baseHp: 75, atk: 100, def: 110, spAtk: 45, spDef: 55, speed: 65 },
  29: { name: 'NidoranF', type1: 'Poison', type2: null, baseHp: 55, atk: 47, def: 52, spAtk: 40, spDef: 40, speed: 41 },
  30: { name: 'Nidorina', type1: 'Poison', type2: null, baseHp: 70, atk: 62, def: 67, spAtk: 55, spDef: 55, speed: 56 },
  31: { name: 'Nidoqueen', type1: 'Poison', type2: 'Ground', baseHp: 90, atk: 92, def: 87, spAtk: 75, spDef: 85, speed: 76 },
  32: { name: 'NidoranM', type1: 'Poison', type2: null, baseHp: 46, atk: 57, def: 40, spAtk: 40, spDef: 40, speed: 50 },
  33: { name: 'Nidorino', type1: 'Poison', type2: null, baseHp: 61, atk: 72, def: 57, spAtk: 55, spDef: 55, speed: 65 },
  34: { name: 'Nidoking', type1: 'Poison', type2: 'Ground', baseHp: 81, atk: 102, def: 77, spAtk: 85, spDef: 75, speed: 85 },
  35: { name: 'Clefairy', type1: 'Normal', type2: null, baseHp: 70, atk: 45, def: 48, spAtk: 60, spDef: 65, speed: 35 },
  36: { name: 'Clefable', type1: 'Normal', type2: null, baseHp: 95, atk: 70, def: 73, spAtk: 95, spDef: 90, speed: 60 },
  37: { name: 'Vulpix', type1: 'Fire', type2: null, baseHp: 38, atk: 41, def: 40, spAtk: 50, spDef: 65, speed: 65 },
  38: { name: 'Ninetales', type1: 'Fire', type2: null, baseHp: 73, atk: 76, def: 75, spAtk: 81, spDef: 100, speed: 100 },
  39: { name: 'Jigglypuff', type1: 'Normal', type2: null, baseHp: 115, atk: 45, def: 20, spAtk: 45, spDef: 25, speed: 20 },
  40: { name: 'Wigglytuff', type1: 'Normal', type2: null, baseHp: 140, atk: 70, def: 45, spAtk: 85, spDef: 50, speed: 45 },
  41: { name: 'Zubat', type1: 'Poison', type2: 'Flying', baseHp: 40, atk: 45, def: 35, spAtk: 30, spDef: 40, speed: 55 },
  42: { name: 'Golbat', type1: 'Poison', type2: 'Flying', baseHp: 75, atk: 80, def: 70, spAtk: 65, spDef: 75, speed: 90 },
  43: { name: 'Oddish', type1: 'Grass', type2: 'Poison', baseHp: 45, atk: 50, def: 55, spAtk: 75, spDef: 65, speed: 30 },
  44: { name: 'Gloom', type1: 'Grass', type2: 'Poison', baseHp: 60, atk: 65, def: 70, spAtk: 85, spDef: 75, speed: 40 },
  45: { name: 'Vileplume', type1: 'Grass', type2: 'Poison', baseHp: 75, atk: 80, def: 85, spAtk: 110, spDef: 90, speed: 50 },
  46: { name: 'Paras', type1: 'Bug', type2: 'Grass', baseHp: 35, atk: 70, def: 55, spAtk: 45, spDef: 55, speed: 25 },
  47: { name: 'Parasect', type1: 'Bug', type2: 'Grass', baseHp: 60, atk: 95, def: 80, spAtk: 60, spDef: 80, speed: 30 },
  48: { name: 'Venonat', type1: 'Bug', type2: 'Poison', baseHp: 60, atk: 55, def: 50, spAtk: 40, spDef: 55, speed: 45 },
  49: { name: 'Venomoth', type1: 'Bug', type2: 'Poison', baseHp: 70, atk: 65, def: 60, spAtk: 90, spDef: 75, speed: 90 },
  50: { name: 'Diglett', type1: 'Ground', type2: null, baseHp: 10, atk: 55, def: 25, spAtk: 35, spDef: 45, speed: 95 },
  51: { name: 'Dugtrio', type1: 'Ground', type2: null, baseHp: 35, atk: 100, def: 50, spAtk: 50, spDef: 70, speed: 120 },
  52: { name: 'Meowth', type1: 'Normal', type2: null, baseHp: 40, atk: 45, def: 35, spAtk: 40, spDef: 40, speed: 90 },
  53: { name: 'Persian', type1: 'Normal', type2: null, baseHp: 65, atk: 70, def: 60, spAtk: 65, spDef: 65, speed: 115 },
  54: { name: 'Psyduck', type1: 'Water', type2: null, baseHp: 50, atk: 52, def: 48, spAtk: 65, spDef: 50, speed: 55 },
  55: { name: 'Golduck', type1: 'Water', type2: null, baseHp: 80, atk: 82, def: 78, spAtk: 95, spDef: 80, speed: 85 },
  56: { name: 'Mankey', type1: 'Fighting', type2: null, baseHp: 40, atk: 80, def: 35, spAtk: 35, spDef: 45, speed: 70 },
  57: { name: 'Primeape', type1: 'Fighting', type2: null, baseHp: 65, atk: 105, def: 60, spAtk: 60, spDef: 70, speed: 95 },
  58: { name: 'Growlithe', type1: 'Fire', type2: null, baseHp: 55, atk: 70, def: 45, spAtk: 70, spDef: 50, speed: 60 },
  59: { name: 'Arcanine', type1: 'Fire', type2: null, baseHp: 90, atk: 110, def: 80, spAtk: 100, spDef: 80, speed: 95 },
  60: { name: 'Poliwag', type1: 'Water', type2: null, baseHp: 40, atk: 50, def: 40, spAtk: 40, spDef: 40, speed: 90 },
  61: { name: 'Poliwhirl', type1: 'Water', type2: null, baseHp: 65, atk: 65, def: 65, spAtk: 50, spDef: 50, speed: 90 },
  62: { name: 'Poliwrath', type1: 'Water', type2: 'Fighting', baseHp: 90, atk: 95, def: 95, spAtk: 70, spDef: 90, speed: 70 },
  63: { name: 'Abra', type1: 'Psychic', type2: null, baseHp: 25, atk: 20, def: 15, spAtk: 105, spDef: 55, speed: 90 },
  64: { name: 'Kadabra', type1: 'Psychic', type2: null, baseHp: 40, atk: 35, def: 30, spAtk: 120, spDef: 70, speed: 105 },
  65: { name: 'Alakazam', type1: 'Psychic', type2: null, baseHp: 55, atk: 50, def: 45, spAtk: 135, spDef: 95, speed: 120 },
  66: { name: 'Machop', type1: 'Fighting', type2: null, baseHp: 70, atk: 80, def: 50, spAtk: 35, spDef: 35, speed: 35 },
  67: { name: 'Machoke', type1: 'Fighting', type2: null, baseHp: 80, atk: 100, def: 70, spAtk: 50, spDef: 60, speed: 45 },
  68: { name: 'Machamp', type1: 'Fighting', type2: null, baseHp: 90, atk: 130, def: 80, spAtk: 65, spDef: 85, speed: 55 },
  69: { name: 'Bellsprout', type1: 'Grass', type2: 'Poison', baseHp: 50, atk: 75, def: 35, spAtk: 70, spDef: 30, speed: 40 },
  70: { name: 'Weepinbell', type1: 'Grass', type2: 'Poison', baseHp: 65, atk: 90, def: 50, spAtk: 85, spDef: 45, speed: 55 },
  71: { name: 'Victreebel', type1: 'Grass', type2: 'Poison', baseHp: 80, atk: 105, def: 65, spAtk: 100, spDef: 70, speed: 70 },
  72: { name: 'Tentacool', type1: 'Water', type2: 'Poison', baseHp: 40, atk: 40, def: 35, spAtk: 50, spDef: 100, speed: 70 },
  73: { name: 'Tentacruel', type1: 'Water', type2: 'Poison', baseHp: 80, atk: 70, def: 65, spAtk: 80, spDef: 120, speed: 100 },
  74: { name: 'Geodude', type1: 'Rock', type2: 'Ground', baseHp: 40, atk: 80, def: 100, spAtk: 30, spDef: 30, speed: 20 },
  75: { name: 'Graveler', type1: 'Rock', type2: 'Ground', baseHp: 55, atk: 95, def: 115, spAtk: 45, spDef: 45, speed: 35 },
  76: { name: 'Golem', type1: 'Rock', type2: 'Ground', baseHp: 80, atk: 120, def: 130, spAtk: 55, spDef: 65, speed: 45 },
  77: { name: 'Ponyta', type1: 'Fire', type2: null, baseHp: 50, atk: 85, def: 55, spAtk: 65, spDef: 65, speed: 90 },
  78: { name: 'Rapidash', type1: 'Fire', type2: null, baseHp: 65, atk: 100, def: 70, spAtk: 80, spDef: 80, speed: 105 },
  79: { name: 'Slowpoke', type1: 'Water', type2: 'Psychic', baseHp: 90, atk: 65, def: 65, spAtk: 40, spDef: 40, speed: 15 },
  80: { name: 'Slowbro', type1: 'Water', type2: 'Psychic', baseHp: 95, atk: 75, def: 110, spAtk: 100, spDef: 80, speed: 30 },
  81: { name: 'Magnemite', type1: 'Electric', type2: null, baseHp: 25, atk: 35, def: 70, spAtk: 95, spDef: 55, speed: 45 },
  82: { name: 'Magneton', type1: 'Electric', type2: null, baseHp: 50, atk: 60, def: 95, spAtk: 120, spDef: 70, speed: 70 },
  83: { name: 'Farfetchd', type1: 'Normal', type2: 'Flying', baseHp: 52, atk: 90, def: 55, spAtk: 58, spDef: 62, speed: 60 },
  84: { name: 'Doduo', type1: 'Normal', type2: 'Flying', baseHp: 35, atk: 85, def: 45, spAtk: 35, spDef: 35, speed: 75 },
  85: { name: 'Dodrio', type1: 'Normal', type2: 'Flying', baseHp: 60, atk: 110, def: 70, spAtk: 60, spDef: 60, speed: 110 },
  86: { name: 'Seel', type1: 'Water', type2: null, baseHp: 65, atk: 45, def: 55, spAtk: 45, spDef: 70, speed: 45 },
  87: { name: 'Dewgong', type1: 'Water', type2: 'Ice', baseHp: 90, atk: 70, def: 80, spAtk: 70, spDef: 95, speed: 70 },
  88: { name: 'Grimer', type1: 'Poison', type2: null, baseHp: 80, atk: 80, def: 50, spAtk: 40, spDef: 50, speed: 25 },
  89: { name: 'Muk', type1: 'Poison', type2: null, baseHp: 105, atk: 105, def: 75, spAtk: 65, spDef: 100, speed: 50 },
  90: { name: 'Shellder', type1: 'Water', type2: null, baseHp: 30, atk: 65, def: 100, spAtk: 45, spDef: 25, speed: 40 },
  91: { name: 'Cloyster', type1: 'Water', type2: 'Ice', baseHp: 50, atk: 95, def: 180, spAtk: 85, spDef: 45, speed: 70 },
  92: { name: 'Gastly', type1: 'Ghost', type2: 'Poison', baseHp: 30, atk: 35, def: 30, spAtk: 100, spDef: 35, speed: 80 },
  93: { name: 'Haunter', type1: 'Ghost', type2: 'Poison', baseHp: 45, atk: 50, def: 45, spAtk: 115, spDef: 55, speed: 95 },
  94: { name: 'Gengar', type1: 'Ghost', type2: 'Poison', baseHp: 60, atk: 65, def: 60, spAtk: 130, spDef: 75, speed: 110 },
  95: { name: 'Onix', type1: 'Rock', type2: 'Ground', baseHp: 35, atk: 45, def: 160, spAtk: 30, spDef: 45, speed: 70 },
  96: { name: 'Drowzee', type1: 'Psychic', type2: null, baseHp: 60, atk: 48, def: 45, spAtk: 43, spDef: 90, speed: 42 },
  97: { name: 'Hypno', type1: 'Psychic', type2: null, baseHp: 85, atk: 73, def: 70, spAtk: 73, spDef: 115, speed: 67 },
  98: { name: 'Krabby', type1: 'Water', type2: null, baseHp: 30, atk: 105, def: 90, spAtk: 25, spDef: 25, speed: 50 },
  99: { name: 'Kingler', type1: 'Water', type2: null, baseHp: 55, atk: 130, def: 115, spAtk: 50, spDef: 50, speed: 75 },
  100: { name: 'Voltorb', type1: 'Electric', type2: null, baseHp: 40, atk: 30, def: 50, spAtk: 55, spDef: 55, speed: 100 },
  101: { name: 'Electrode', type1: 'Electric', type2: null, baseHp: 60, atk: 50, def: 70, spAtk: 80, spDef: 80, speed: 150 },
  102: { name: 'Exeggcute', type1: 'Grass', type2: 'Psychic', baseHp: 60, atk: 40, def: 80, spAtk: 60, spDef: 45, speed: 40 },
  103: { name: 'Exeggutor', type1: 'Grass', type2: 'Psychic', baseHp: 95, atk: 95, def: 85, spAtk: 125, spDef: 75, speed: 55 },
  104: { name: 'Cubone', type1: 'Ground', type2: null, baseHp: 50, atk: 50, def: 95, spAtk: 40, spDef: 50, speed: 35 },
  105: { name: 'Marowak', type1: 'Ground', type2: null, baseHp: 60, atk: 80, def: 110, spAtk: 50, spDef: 80, speed: 45 },
  106: { name: 'Hitmonlee', type1: 'Fighting', type2: null, baseHp: 50, atk: 120, def: 53, spAtk: 35, spDef: 110, speed: 87 },
  107: { name: 'Hitmonchan', type1: 'Fighting', type2: null, baseHp: 50, atk: 105, def: 79, spAtk: 35, spDef: 110, speed: 76 },
  108: { name: 'Lickitung', type1: 'Normal', type2: null, baseHp: 90, atk: 55, def: 75, spAtk: 60, spDef: 75, speed: 30 },
  109: { name: 'Koffing', type1: 'Poison', type2: null, baseHp: 40, atk: 65, def: 95, spAtk: 60, spDef: 45, speed: 35 },
  110: { name: 'Weezing', type1: 'Poison', type2: null, baseHp: 65, atk: 90, def: 120, spAtk: 85, spDef: 70, speed: 60 },
  111: { name: 'Rhyhorn', type1: 'Ground', type2: 'Rock', baseHp: 80, atk: 85, def: 95, spAtk: 30, spDef: 30, speed: 25 },
  112: { name: 'Rhydon', type1: 'Ground', type2: 'Rock', baseHp: 105, atk: 130, def: 120, spAtk: 45, spDef: 45, speed: 40 },
  113: { name: 'Chansey', type1: 'Normal', type2: null, baseHp: 250, atk: 5, def: 5, spAtk: 35, spDef: 105, speed: 50 },
  114: { name: 'Tangela', type1: 'Grass', type2: null, baseHp: 65, atk: 55, def: 115, spAtk: 100, spDef: 40, speed: 60 },
  115: { name: 'Kangaskhan', type1: 'Normal', type2: null, baseHp: 105, atk: 95, def: 80, spAtk: 40, spDef: 80, speed: 90 },
  116: { name: 'Horsea', type1: 'Water', type2: null, baseHp: 30, atk: 40, def: 70, spAtk: 70, spDef: 25, speed: 60 },
  117: { name: 'Seadra', type1: 'Water', type2: null, baseHp: 55, atk: 65, def: 95, spAtk: 95, spDef: 45, speed: 85 },
  118: { name: 'Goldeen', type1: 'Water', type2: null, baseHp: 45, atk: 67, def: 60, spAtk: 35, spDef: 50, speed: 63 },
  119: { name: 'Seaking', type1: 'Water', type2: null, baseHp: 80, atk: 92, def: 65, spAtk: 65, spDef: 80, speed: 68 },
  120: { name: 'Staryu', type1: 'Water', type2: null, baseHp: 30, atk: 45, def: 55, spAtk: 70, spDef: 55, speed: 85 },
  121: { name: 'Starmie', type1: 'Water', type2: 'Psychic', baseHp: 60, atk: 75, def: 85, spAtk: 100, spDef: 85, speed: 115 },
  122: { name: 'MrMime', type1: 'Psychic', type2: null, baseHp: 40, atk: 45, def: 65, spAtk: 100, spDef: 120, speed: 90 },
  123: { name: 'Scyther', type1: 'Bug', type2: 'Flying', baseHp: 70, atk: 110, def: 80, spAtk: 55, spDef: 80, speed: 105 },
  124: { name: 'Jynx', type1: 'Ice', type2: 'Psychic', baseHp: 65, atk: 50, def: 35, spAtk: 115, spDef: 95, speed: 95 },
  125: { name: 'Electabuzz', type1: 'Electric', type2: null, baseHp: 65, atk: 83, def: 57, spAtk: 95, spDef: 85, speed: 105 },
  126: { name: 'Magmar', type1: 'Fire', type2: null, baseHp: 65, atk: 95, def: 57, spAtk: 100, spDef: 85, speed: 93 },
  127: { name: 'Pinsir', type1: 'Bug', type2: null, baseHp: 65, atk: 125, def: 100, spAtk: 55, spDef: 70, speed: 85 },
  128: { name: 'Tauros', type1: 'Normal', type2: null, baseHp: 75, atk: 100, def: 95, spAtk: 40, spDef: 70, speed: 110 },
  129: { name: 'Magikarp', type1: 'Water', type2: null, baseHp: 20, atk: 10, def: 55, spAtk: 15, spDef: 20, speed: 80 },
  130: { name: 'Gyarados', type1: 'Water', type2: 'Flying', baseHp: 95, atk: 125, def: 79, spAtk: 60, spDef: 100, speed: 81 },
  131: { name: 'Lapras', type1: 'Water', type2: 'Ice', baseHp: 130, atk: 85, def: 80, spAtk: 85, spDef: 95, speed: 60 },
  132: { name: 'Ditto', type1: 'Normal', type2: null, baseHp: 48, atk: 48, def: 48, spAtk: 48, spDef: 48, speed: 48 },
  133: { name: 'Eevee', type1: 'Normal', type2: null, baseHp: 55, atk: 55, def: 50, spAtk: 45, spDef: 65, speed: 55 },
  134: { name: 'Vaporeon', type1: 'Water', type2: null, baseHp: 130, atk: 65, def: 60, spAtk: 110, spDef: 95, speed: 65 },
  135: { name: 'Jolteon', type1: 'Electric', type2: null, baseHp: 65, atk: 65, def: 60, spAtk: 110, spDef: 95, speed: 130 },
  136: { name: 'Flareon', type1: 'Fire', type2: null, baseHp: 65, atk: 130, def: 60, spAtk: 95, spDef: 110, speed: 65 },
  137: { name: 'Porygon', type1: 'Normal', type2: null, baseHp: 65, atk: 60, def: 70, spAtk: 85, spDef: 75, speed: 40 },
  138: { name: 'Omanyte', type1: 'Rock', type2: 'Water', baseHp: 35, atk: 40, def: 100, spAtk: 90, spDef: 55, speed: 35 },
  139: { name: 'Omastar', type1: 'Rock', type2: 'Water', baseHp: 70, atk: 60, def: 125, spAtk: 115, spDef: 70, speed: 55 },
  140: { name: 'Kabuto', type1: 'Rock', type2: 'Water', baseHp: 30, atk: 80, def: 90, spAtk: 55, spDef: 45, speed: 55 },
  141: { name: 'Kabutops', type1: 'Rock', type2: 'Water', baseHp: 60, atk: 115, def: 105, spAtk: 65, spDef: 70, speed: 80 },
  142: { name: 'Aerodactyl', type1: 'Rock', type2: 'Flying', baseHp: 80, atk: 105, def: 65, spAtk: 60, spDef: 75, speed: 130 },
  143: { name: 'Snorlax', type1: 'Normal', type2: null, baseHp: 160, atk: 110, def: 65, spAtk: 65, spDef: 110, speed: 30 },
  144: { name: 'Articuno', type1: 'Ice', type2: 'Flying', baseHp: 90, atk: 85, def: 100, spAtk: 95, spDef: 125, speed: 85 },
  145: { name: 'Zapdos', type1: 'Electric', type2: 'Flying', baseHp: 90, atk: 90, def: 85, spAtk: 125, spDef: 90, speed: 100 },
  146: { name: 'Moltres', type1: 'Fire', type2: 'Flying', baseHp: 90, atk: 100, def: 90, spAtk: 125, spDef: 85, speed: 90 },
  147: { name: 'Dratini', type1: 'Dragon', type2: null, baseHp: 41, atk: 64, def: 45, spAtk: 50, spDef: 50, speed: 50 },
  148: { name: 'Dragonair', type1: 'Dragon', type2: null, baseHp: 61, atk: 84, def: 65, spAtk: 70, spDef: 70, speed: 70 },
  149: { name: 'Dragonite', type1: 'Dragon', type2: 'Flying', baseHp: 91, atk: 134, def: 95, spAtk: 100, spDef: 100, speed: 80 },
  150: { name: 'Mewtwo', type1: 'Psychic', type2: null, baseHp: 106, atk: 110, def: 90, spAtk: 154, spDef: 90, speed: 130 },
  151: { name: 'Mew', type1: 'Psychic', type2: null, baseHp: 100, atk: 100, def: 100, spAtk: 100, spDef: 100, speed: 100 },
};


// Adapts any Pokémon (database entity or wild object) into a complete real-time battle combatant
export function adaptPokemonForBattle(rawMon) {
  if (!rawMon) return adaptPokemonForBattle({ speciesId: 1 });

  const speciesId = parseInt(
    rawMon.speciesId ||
    rawMon.species?.id ||
    rawMon.pokemonId ||
    (rawMon.species && typeof rawMon.species === 'number' ? rawMon.species : null) ||
    (rawMon.dbId ? rawMon.speciesId : rawMon.id) ||
    1,
    10
  );
  const fmtId = String(speciesId).padStart(3, '0');
  const species = GEN1_SPECIES[speciesId] || GEN1_SPECIES[1];

  const level = rawMon.level || 5;
  const isShiny = Boolean(rawMon.isShiny);
  const nature = rawMon.nature || 'Hardy';
  const ivs = rawMon.ivs || {
    hp: typeof rawMon.ivHp === 'number' ? rawMon.ivHp : 31,
    atk: typeof rawMon.ivAtk === 'number' ? rawMon.ivAtk : 31,
    def: typeof rawMon.ivDef === 'number' ? rawMon.ivDef : 31,
    spAtk: typeof rawMon.ivSpAtk === 'number' ? rawMon.ivSpAtk : 31,
    spDef: typeof rawMon.ivSpDef === 'number' ? rawMon.ivSpDef : 31,
    speed: typeof rawMon.ivSpeed === 'number' ? rawMon.ivSpeed : 31,
  };
  const evs = rawMon.evs || {
    hp: typeof rawMon.evHp === 'number' ? rawMon.evHp : 0,
    atk: typeof rawMon.evAtk === 'number' ? rawMon.evAtk : 0,
    def: typeof rawMon.evDef === 'number' ? rawMon.evDef : 0,
    spAtk: typeof rawMon.evSpAtk === 'number' ? rawMon.evSpAtk : 0,
    spDef: typeof rawMon.evSpDef === 'number' ? rawMon.evSpDef : 0,
    speed: typeof rawMon.evSpeed === 'number' ? rawMon.evSpeed : 0,
  };

  const baseStats = {
    hp: species.baseHp,
    atk: species.atk,
    def: species.def,
    spAtk: species.spAtk,
    spDef: species.spDef,
    speed: species.speed,
  };

  const calculatedStats = calculatePokemonStats(baseStats, level, ivs, evs, nature);
  const moveSpeed = calculateMovementSpeed(calculatedStats.speed);
  const dodgeCd = calculateDodgeCooldown(calculatedStats.speed);

  // Parse moves from rawMon.moves (from PokeMMO database, Box, or Party)
  let rawMoveList = [];
  if (Array.isArray(rawMon.moves) && rawMon.moves.length > 0) {
    rawMoveList = rawMon.moves;
  } else if (typeof rawMon.moves === 'string' && rawMon.moves.trim().length > 2) {
    try {
      const parsed = JSON.parse(rawMon.moves);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rawMoveList = parsed;
      }
    } catch (e) {
      console.warn('[pokemonData] Error parsing rawMon.moves JSON:', e);
    }
  }

  // Only fall back to default species/type moves if Pokémon has no learned moves registered
  if (rawMoveList.length === 0) {
    if (DEFAULT_SPECIES_MOVES[speciesId]) {
      rawMoveList = DEFAULT_SPECIES_MOVES[speciesId];
    } else {
      // Generate 4 moves based on primary and secondary types
      const t1 = species.type1;
      if (t1 === 'Water') rawMoveList = [303, 551, 546, 536]; // Tackle, Water Gun, Bubble Beam, Hydro Pump
      else if (t1 === 'Fire') rawMoveList = [311, 146, 143, 136]; // Scratch, Ember, Flame Wheel, Flamethrower
      else if (t1 === 'Grass') rawMoveList = [303, 208, 205, 195]; // Tackle, Vine Whip, Razor Leaf, Solar Beam
      else if (t1 === 'Electric') rawMoveList = [310, 79, 74, 69]; // Quick Attack, Thunder Shock, Spark, Thunderbolt
      else if (t1 === 'Psychic') rawMoveList = [303, 462, 460, 452]; // Tackle, Confusion, Psybeam, Psychic
      else if (t1 === 'Fighting') rawMoveList = [303, 107, 109, 86]; // Tackle, Karate Chop, Rock Smash, Close Combat
      else if (t1 === 'Ghost') rawMoveList = [182, 181, 178, 175]; // Lick, Astonish, Shadow Punch, Shadow Ball
      else if (t1 === 'Rock' || t1 === 'Ground') rawMoveList = [303, 234, 507, 223]; // Tackle, Mud-Slap, Rock Throw, Earthquake
      else rawMoveList = [303, 310, 290, 263]; // Tackle, Quick Attack, Headbutt, Hyper Beam
    }
  }

  // Inflate each move using comprehensive 621 moves database (filtering only active combat moves)
  const moves = rawMoveList.slice(0, 4).map((m, slotIdx) => {
    let moveDef = getMoveData(m);
    if (!moveDef || moveDef.activeCombatCompatible === false) {
      moveDef = getMoveData(303); // Fallback to Tackle
    }
    const pp = typeof m === 'object' && typeof m.pp === 'number' ? m.pp : moveDef.pp;
    const maxPp = typeof m === 'object' && typeof m.maxPp === 'number' ? m.maxPp : moveDef.pp;
    const cd = calculateMoveCooldown(moveDef.power, calculatedStats.speed);

    return {
      slot: slotIdx,
      id: moveDef.id,
      name: moveDef.name,
      internalName: moveDef.internalName,
      type: moveDef.type,
      category: moveDef.category,
      power: moveDef.power,
      accuracy: moveDef.accuracy,
      activeCombatCompatible: moveDef.activeCombatCompatible !== false,
      pp,
      maxPp,
      description: moveDef.description,
      executionType: moveDef.executionType,
      vfxFamily: moveDef.vfxFamily,
      combatBehavior: moveDef.combatBehavior,
      cooldown: cd,
      currentCooldown: 0,
      visual: moveDef.visual ? {
        ...moveDef.visual,
        file: moveDef.visual.file,
        cols: moveDef.visual.cols || 5,
        rows: moveDef.visual.rows || 2,
        startFrame: moveDef.visual.startFrame || 0,
        endFrame: moveDef.visual.endFrame || 4,
        fps: moveDef.visual.fps || 24,
      } : undefined,
      sound: getMoveSound(moveDef.type, moveDef.category, moveDef.name),
      color: TYPE_COLORS[moveDef.type] || '#9E9E9E',
    };
  });

  const maxHp = calculatedStats.hp;
  const currentHp = typeof rawMon.currentHp === 'number'
    ? Math.max(0, Math.min(maxHp, Math.round((rawMon.currentHp / (rawMon.maxHp || maxHp)) * maxHp)))
    : maxHp;

  return {
    id: fmtId,
    dbId: rawMon.id,
    speciesId,
    rawMaxHp: rawMon.maxHp || calculatedStats.hp,
    rawCurrentHp: typeof rawMon.currentHp === 'number' ? rawMon.currentHp : (rawMon.maxHp || calculatedStats.hp),
    name: rawMon.nickname || rawMon.name || species.name,
    level,
    isShiny,
    gender: rawMon.gender || 'M',
    nature,
    ivs,
    evs,
    baseStats,
    stats: calculatedStats,
    type1: species.type1,
    type2: species.type2,
    baseColor: TYPE_COLORS[species.type1] || '#2196F3',
    moveSpeed,
    dodgeCooldown: dodgeCd,
    moves,
    currentHp,
    maxHp,
    cry: `/assets/audio/se/cries/${fmtId}Cry.ogg`,
    scale: 2.6,
  };
}

export function getPokemonById(id) {
  const numId = parseInt(id, 10);
  return adaptPokemonForBattle({ speciesId: numId });
}
