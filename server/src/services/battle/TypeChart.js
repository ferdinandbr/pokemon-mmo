/**
 * TypeChart - Pokemon elemental type effectiveness matrix (Gen 1-6 compatible).
 */

const EFFECTIVENESS = {
  NORMAL: {
    ROCK: 0.5,
    GHOST: 0,
    STEEL: 0.5
  },
  FIRE: {
    FIRE: 0.5,
    WATER: 0.5,
    GRASS: 2,
    ICE: 2,
    BUG: 2,
    ROCK: 0.5,
    DRAGON: 0.5,
    STEEL: 2
  },
  WATER: {
    FIRE: 2,
    WATER: 0.5,
    GRASS: 0.5,
    GROUND: 2,
    ROCK: 2,
    DRAGON: 0.5
  },
  ELECTRIC: {
    WATER: 2,
    ELECTRIC: 0.5,
    GRASS: 0.5,
    GROUND: 0,
    FLYING: 2,
    DRAGON: 0.5
  },
  GRASS: {
    FIRE: 0.5,
    WATER: 2,
    GRASS: 0.5,
    POISON: 0.5,
    GROUND: 2,
    FLYING: 0.5,
    BUG: 0.5,
    ROCK: 2,
    DRAGON: 0.5,
    STEEL: 0.5
  },
  ICE: {
    FIRE: 0.5,
    WATER: 0.5,
    GRASS: 2,
    ICE: 0.5,
    GROUND: 2,
    FLYING: 2,
    DRAGON: 2,
    STEEL: 0.5
  },
  FIGHTING: {
    NORMAL: 2,
    ICE: 2,
    POISON: 0.5,
    FLYING: 0.5,
    PSYCHIC: 0.5,
    BUG: 0.5,
    ROCK: 2,
    GHOST: 0,
    DARK: 2,
    STEEL: 2,
    FAIRY: 0.5
  },
  POISON: {
    GRASS: 2,
    POISON: 0.5,
    GROUND: 0.5,
    ROCK: 0.5,
    GHOST: 0.5,
    STEEL: 0,
    FAIRY: 2
  },
  GROUND: {
    FIRE: 2,
    ELECTRIC: 2,
    GRASS: 0.5,
    POISON: 2,
    FLYING: 0,
    BUG: 0.5,
    ROCK: 2,
    STEEL: 2
  },
  FLYING: {
    ELECTRIC: 0.5,
    GRASS: 2,
    FIGHTING: 2,
    BUG: 2,
    ROCK: 0.5,
    STEEL: 0.5
  },
  PSYCHIC: {
    FIGHTING: 2,
    POISON: 2,
    PSYCHIC: 0.5,
    DARK: 0,
    STEEL: 0.5
  },
  BUG: {
    FIRE: 0.5,
    GRASS: 2,
    FIGHTING: 0.5,
    POISON: 0.5,
    FLYING: 0.5,
    PSYCHIC: 2,
    GHOST: 0.5,
    DARK: 2,
    STEEL: 0.5,
    FAIRY: 0.5
  },
  ROCK: {
    FIRE: 2,
    ICE: 2,
    FIGHTING: 0.5,
    GROUND: 0.5,
    FLYING: 2,
    BUG: 2,
    STEEL: 0.5
  },
  GHOST: {
    NORMAL: 0,
    PSYCHIC: 2,
    GHOST: 2,
    DARK: 0.5
  },
  DRAGON: {
    DRAGON: 2,
    STEEL: 0.5,
    FAIRY: 0
  },
  DARK: {
    FIGHTING: 0.5,
    PSYCHIC: 2,
    GHOST: 2,
    DARK: 0.5,
    FAIRY: 0.5
  },
  STEEL: {
    FIRE: 0.5,
    WATER: 0.5,
    ELECTRIC: 0.5,
    ICE: 2,
    ROCK: 2,
    STEEL: 0.5,
    FAIRY: 2
  },
  FAIRY: {
    FIRE: 0.5,
    FIGHTING: 2,
    POISON: 0.5,
    DRAGON: 2,
    DARK: 2,
    STEEL: 0.5
  }
};

/**
 * Calculates effectiveness multiplier of an attack type against defender types.
 * @param {string} attackType - e.g. "FIRE"
 * @param {string} defType1 - e.g. "GRASS"
 * @param {string|null} [defType2=null] - e.g. "POISON"
 * @returns {number} Multiplier (0, 0.25, 0.5, 1, 2, 4)
 */
function getEffectiveness(attackType, defType1, defType2 = null) {
  if (!attackType || !defType1) return 1;

  const atk = String(attackType).trim().toUpperCase();
  const def1 = String(defType1).trim().toUpperCase();
  const def2 = defType2 ? String(defType2).trim().toUpperCase() : null;

  const chart = EFFECTIVENESS[atk] || {};

  let mult = 1;
  if (chart[def1] !== undefined) mult *= chart[def1];
  if (def2 && chart[def2] !== undefined) mult *= chart[def2];

  return mult;
}

module.exports = {
  EFFECTIVENESS,
  getEffectiveness
};
