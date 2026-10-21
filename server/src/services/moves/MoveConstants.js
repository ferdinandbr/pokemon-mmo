/**
 * MoveConstants - Core configurations and enumerations for the Pokémon Move System.
 */

const MAX_MOVES_PER_POKEMON = 4;
const MAX_PP_UPS = 3;
const PP_UP_MULTIPLIER = 0.2; // Each PP Up adds 20% of base PP (up to +60%)

const POKEMON_TYPES = Object.freeze([
  'NORMAL', 'FIRE', 'WATER', 'ELECTRIC', 'GRASS', 'ICE',
  'FIGHTING', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG',
  'ROCK', 'GHOST', 'DRAGON', 'DARK', 'STEEL', 'FAIRY'
]);

const MOVE_CATEGORIES = Object.freeze({
  PHYSICAL: 'Physical',
  SPECIAL: 'Special',
  STATUS: 'Status'
});

const LEARN_METHODS = Object.freeze({
  LEVEL_UP: 'LEVEL_UP',
  TM: 'TM',
  HM: 'HM',
  TUTOR: 'TUTOR',
  EGG: 'EGG'
});

/**
 * Calculates max PP based on base PP and number of PP Ups applied.
 * @param {number} basePp
 * @param {number} ppUps (0 to 3)
 * @returns {number}
 */
function calculateMaxPp(basePp, ppUps = 0) {
  const safePpUps = Math.max(0, Math.min(MAX_PP_UPS, parseInt(ppUps) || 0));
  return Math.floor(basePp * (1 + safePpUps * PP_UP_MULTIPLIER));
}

/**
 * Golpes de turnos/duplas/gimmicks incompatíveis com a arena de combate ativo.
 * Total: 116 golpes desativados para preservar a fluidez, telegrafia e impacto físico.
 */
const INCOMPATIBLE_ACTIVE_COMBAT_MOVES = Object.freeze(new Set([
  // 1. Manipuladores de Turnos e Ordem de Fila
  'TRICKROOM', 'QUASH', 'AFTERYOU', 'MEFIRST', 'BATONPASS', 'PURSUIT', 'ROUND', 'ECHOEDVOICE',
  'BIDE', 'ENCORE', 'DISABLE', 'TORMENT', 'IMPRISON', 'SPITE', 'GRUDGE', 'PERISHSONG', 'YAWN', 'SNATCH',

  // 2. Suporte Exclusivo para Batalhas em Duplas
  'FOLLOWME', 'RAGEPOWDER', 'ALLYSWITCH', 'HELPINGHAND', 'WIDEGUARD', 'QUICKGUARD', 'HEALPULSE', 'CRAFTYSHIELD',

  // 3. Dependentes de Itens Segurados (sem utilidade sem itens no combate ativo)
  'FLING', 'NATURALGIFT', 'SWITCHEROO', 'TRICK', 'BESTOW', 'EMBARGO',

  // 4. Manipuladores de Habilidades Passivas (Abilities)
  'SKILLSWAP', 'WORRYSEED', 'GASTROACID', 'SIMPLEBEAM', 'ENTRAINMENT', 'ROLEPLAY',

  // 5. Gimmicks Inúteis, Cópia Caótica ou Meta-específicos
  'SPLASH', 'CELEBRATE', 'HOLDHANDS', 'HAPPYHOUR', 'SYNCHRONOISE', 'METRONOME', 'ASSIST', 'COPYCAT', 'MIRRORMOVE', 'SLEEPTALK', 'SNORE', 'SKETCH', 'MIMIC',
  'CONVERSION', 'CONVERSION2', 'REFLECTTYPE', 'SOAK', 'CAMOUFLAGE', 'NATUREPOWER', 'SECRETPOWER',
  'PAINSPLIT', 'POWERSPLIT', 'GUARDSPLIT', 'HEARTSWAP', 'POWERSWAP', 'GUARDSWAP', 'PSYCHUP', 'TOPSYTURVY', 'WONDERROOM', 'MAGICROOM',
  'BEATUP', 'STOCKPILE', 'SPITUP', 'SWALLOW', 'FORESIGHT', 'ODORSLEUTH', 'MIRACLEEYE', 'LOCKON', 'MINDREADER', 'TELEKINESIS', 'GRAVITY',
  'ATTRACT', 'CAPTIVATE', 'RETURN', 'FRUSTRATION', 'ENDURE', 'DESTINYBOND', 'HAZE', 'CLEARSMOG',
  'MUDSPORT', 'WATERSPORT', 'AROMATICMIST', 'MAGNETICFLUX', 'ROTOTILLER', 'FLOWERSHIELD',
  'ELECTRIFY', 'IONDELUGE', 'TELEPORT',

  // 6. Debuffs Puros Numéricos (-1 / -2 Stat Stages invisíveis sem presença física)
  'LEER', 'TAILWHIP', 'GROWL', 'SCREECH', 'CHARM', 'COTTONSPORE', 'FLASH', 'KINESIS', 'SANDATTACK', 'SMOKESCREEN',
  'BABYDOLLEYES', 'CONFIDE', 'EERIEIMPULSE', 'FAKETEARS', 'FEATHERDANCE', 'METALSOUND', 'NOBLEROAR', 'PLAYNICE', 'SCARYFACE', 'SWEETSCENT', 'TICKLE'
]));

/**
 * Verifica se um golpe é compatível com combate ativo.
 * @param {string} internalName
 * @returns {boolean}
 */
function isActiveCombatMove(internalName) {
  if (!internalName) return false;
  return !INCOMPATIBLE_ACTIVE_COMBAT_MOVES.has(String(internalName).trim().toUpperCase());
}

module.exports = {
  MAX_MOVES_PER_POKEMON,
  MAX_PP_UPS,
  PP_UP_MULTIPLIER,
  POKEMON_TYPES,
  MOVE_CATEGORIES,
  LEARN_METHODS,
  INCOMPATIBLE_ACTIVE_COMBAT_MOVES,
  isActiveCombatMove,
  calculateMaxPp
};

