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

module.exports = {
  MAX_MOVES_PER_POKEMON,
  MAX_PP_UPS,
  PP_UP_MULTIPLIER,
  POKEMON_TYPES,
  MOVE_CATEGORIES,
  LEARN_METHODS,
  calculateMaxPp
};
