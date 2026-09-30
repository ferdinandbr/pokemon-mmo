const { getEffectiveness } = require('./TypeChart');

class DamageCalculator {
  /**
   * Checks if an attack hits based on move accuracy.
   * @param {Object} move
   * @returns {boolean}
   */
  checkAccuracy(move) {
    if (!move.accuracy || move.accuracy <= 0 || move.accuracy >= 100) return true;
    const roll = Math.random() * 100;
    return roll <= move.accuracy;
  }

  /**
   * Rolls critical hit chance (Gen 3).
   * @param {Object} move
   * @returns {boolean}
   */
  rollCritical(move) {
    // Moves with high critical ratio (Slash, Razor Leaf, Karate Chop, etc.)
    const highCritMoves = ['SLASH', 'RAZORLEAF', 'KARATECHOP', 'CRABHAMMER', 'CROSSCHOP', 'AEROBLAST', 'AIRCUTTER', 'NIGHTSLASH'];
    const isHighCrit = highCritMoves.includes(move.internalName);
    const threshold = isHighCrit ? 0.125 : 0.0625; // 1/8 vs 1/16
    return Math.random() < threshold;
  }

  /**
   * Calculates battle damage dealt by a move.
   * 
   * @param {Object} attacker - { level, stats: { attack, spAtk }, species: { type1, type2 } }
   * @param {Object} defender - { level, stats: { defense, spDef }, species: { type1, type2 } }
   * @param {Object} move - { power, type, category, internalName, accuracy }
   * @returns {Object}
   */
  calculateDamage(attacker, defender, move) {
    // 1. Status moves deal 0 direct damage
    if (!move.power || move.power <= 0 || move.category === 'Status') {
      return {
        isHit: true,
        damage: 0,
        isCritical: false,
        effectiveness: 1,
        isSuperEffective: false,
        isNotVeryEffective: false,
        isImmune: false
      };
    }

    // 2. Accuracy check
    const isHit = this.checkAccuracy(move);
    if (!isHit) {
      return {
        isHit: false,
        damage: 0,
        isCritical: false,
        effectiveness: 1,
        isSuperEffective: false,
        isNotVeryEffective: false,
        isImmune: false
      };
    }

    // 3. Type Effectiveness
    const defType1 = defender.species?.type1 || 'NORMAL';
    const defType2 = defender.species?.type2 || null;
    const effectiveness = getEffectiveness(move.type, defType1, defType2);

    if (effectiveness === 0) {
      return {
        isHit: true,
        damage: 0,
        isCritical: false,
        effectiveness: 0,
        isSuperEffective: false,
        isNotVeryEffective: false,
        isImmune: true
      };
    }

    // 4. Attack and Defense Stats with Stat Stages
    const atkStats = attacker.stats || {};
    const defStats = defender.stats || {};
    const atkStages = attacker.statStages || {};
    const defStages = defender.statStages || {};

    const getStageMultiplier = (stage = 0) => {
      const s = Math.max(-6, Math.min(6, stage));
      return s >= 0 ? (2 + s) / 2 : 2 / (2 - s);
    };

    let A = 10;
    let D = 10;

    if (move.category === 'Special') {
      A = (atkStats.spAtk || 10) * getStageMultiplier(atkStages.spAtk);
      D = (defStats.spDef || 10) * getStageMultiplier(defStages.spDef);
    } else {
      A = (atkStats.attack || 10) * getStageMultiplier(atkStages.attack);
      D = (defStats.defense || 10) * getStageMultiplier(defStages.defense);
      // Burn penalty: physical attack is halved
      if (attacker.status === 'burn') {
        A = Math.floor(A * 0.5);
      }
    }

    // Safety bounds
    A = Math.max(1, Math.round(A));
    D = Math.max(1, Math.round(D));

    // 5. Base Damage Formula (Gen 3)
    const level = attacker.level || 5;
    const baseDamage = Math.floor(
      Math.floor((Math.floor((2 * level) / 5 + 2) * move.power * A) / D) / 50
    ) + 2;

    // 6. Modifiers
    // Critical Hit (2x in Gen 3)
    const isCritical = this.rollCritical(move);
    const critMultiplier = isCritical ? 2 : 1;

    // STAB (Same Type Attack Bonus = 1.5x)
    const atkType1 = attacker.species?.type1?.toUpperCase();
    const atkType2 = attacker.species?.type2?.toUpperCase();
    const moveType = move.type?.toUpperCase();
    const isStab = moveType && (moveType === atkType1 || moveType === atkType2);
    const stabMultiplier = isStab ? 1.5 : 1.0;

    // Random Factor: 85 to 100 divided by 100
    const randomMultiplier = (Math.floor(Math.random() * 16) + 85) / 100;

    const modifier = critMultiplier * stabMultiplier * effectiveness * randomMultiplier;
    const finalDamage = Math.max(1, Math.floor(baseDamage * modifier));

    return {
      isHit: true,
      damage: finalDamage,
      isCritical,
      effectiveness,
      isSuperEffective: effectiveness > 1,
      isNotVeryEffective: effectiveness < 1 && effectiveness > 0,
      isImmune: false
    };
  }
}

module.exports = new DamageCalculator();
