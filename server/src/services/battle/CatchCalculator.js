class CatchCalculator {
  /**
   * Returns ball multiplier based on item name.
   * @param {string} itemName
   * @returns {number}
   */
  getBallBonus(itemName = 'Pokeball', context = {}) {
    const lower = String(itemName).toLowerCase();
    if (lower.includes('master')) return 9999;
    if (lower.includes('ultra')) return 2.0;
    if (lower.includes('great') || lower.includes('super')) return 1.5;
    if (lower.includes('safari')) return 1.5;
    if (lower.includes('quick')) return (context.turn <= 1) ? 4.0 : 1.0;
    if (lower.includes('dusk')) return 3.0;
    if (lower.includes('timer')) return Math.min(4.0, 1.0 + ((context.turn || 1) * 0.3));
    if (lower.includes('net')) {
      const types = [context.type1, context.type2].filter(Boolean).map(t => String(t).toUpperCase());
      return (types.includes('WATER') || types.includes('BUG')) ? 3.5 : 1.0;
    }
    if (lower.includes('fast')) return (context.baseSpeed && context.baseSpeed >= 100) ? 4.0 : 1.0;
    if (lower.includes('nest')) return Math.max(1.0, Math.min(3.0, (40 - (context.wildLevel || 5)) / 10));
    if (lower.includes('repeat')) return 3.0;
    if (lower.includes('level')) {
      const pLvl = context.playerLevel || 5;
      const wLvl = context.wildLevel || 5;
      if (pLvl >= wLvl * 4) return 8.0;
      if (pLvl >= wLvl * 2) return 4.0;
      if (pLvl > wLvl) return 2.0;
      return 1.0;
    }
    return 1.0;
  }

  /**
   * Calculates catch probability and shakes (Gen 3/4).
   * 
   * @param {Object} wildPokemon - { currentHp, maxHp, species: { id, name, type1, type2, baseSpeed } }
   * @param {string} ballName - e.g. "Poke Ball", "Great Ball", "Ultra Ball", "Master Ball"
   * @param {Object} [context] - { turn, playerLevel }
   * @returns {{ isCaught: boolean, shakes: number }}
   */
  calculateCatch(wildPokemon, ballName = 'Pokeball', context = {}) {
    const spec = wildPokemon.species || {};
    const ballContext = {
      turn: context.turn || 1,
      playerLevel: context.playerLevel || 5,
      wildLevel: wildPokemon.level || 5,
      type1: spec.type1,
      type2: spec.type2,
      baseSpeed: spec.baseSpeed
    };

    const ballBonus = this.getBallBonus(ballName, ballContext);

    // Master Ball is a guaranteed catch
    if (ballBonus >= 9999) {
      return { isCaught: true, shakes: 3 };
    }

    const maxHp = Math.max(1, wildPokemon.maxHp || 20);
    const currentHp = Math.max(1, wildPokemon.currentHp || 1);

    // Gen 1-3 Catch Rate reference table
    let speciesCatchRate = 120;
    const specId = wildPokemon.speciesId || spec.id;
    if ([1, 4, 7, 25, 133].includes(specId)) speciesCatchRate = 45; // Starters, Pikachu, Eevee
    else if ([16, 19, 10, 13, 21, 29, 32].includes(specId)) speciesCatchRate = 255; // Pidgey, Rattata, Caterpie, Weedle, Spearow, Nidoran
    else if ([144, 145, 146, 150, 151].includes(specId)) speciesCatchRate = 3; // Legendaries
    else if ([147, 148, 149].includes(specId)) speciesCatchRate = 45; // Dratini line
    else if ([129].includes(specId)) speciesCatchRate = 255; // Magikarp
    else if ([130].includes(specId)) speciesCatchRate = 45; // Gyarados
    else if ([143].includes(specId)) speciesCatchRate = 25; // Snorlax
    else if (specId > 100) speciesCatchRate = 75;

    // a = ((3 * maxHp - 2 * currentHp) * catchRate * ballBonus) / (3 * maxHp)
    const a = Math.max(1, Math.min(255, Math.floor(
      (((3 * maxHp - 2 * currentHp) * speciesCatchRate * ballBonus) / (3 * maxHp))
    )));

    if (a >= 255) {
      return { isCaught: true, shakes: 3 };
    }

    // Gen 3/4 formula: b = 65536 * (a / 255)^0.25
    // Note: The 0.25 exponent ensures probability of 4 consecutive shakes is ~ (a / 255).
    const b = Math.floor(65536 * Math.pow(a / 255, 0.25));

    let shakes = 0;
    for (let i = 0; i < 4; i++) {
      const roll = Math.floor(Math.random() * 65536);
      if (roll < b) {
        shakes++;
      } else {
        break;
      }
    }

    const isCaught = shakes >= 4;
    return {
      isCaught,
      shakes: Math.min(3, shakes)
    };
  }
}

module.exports = new CatchCalculator();
