/**
 * MoveEffectHandler.js
 * Handles status conditions, stat stages, secondary effects, and end-of-turn battle mechanics.
 */

class MoveEffectHandler {
  /**
   * Checks if an attack can proceed or if the attacker is afflicted by sleep, freeze, paralysis, or confusion.
   * @param {Object} attacker - Pokemon state
   * @param {string} role - 'player' | 'wild'
   * @param {Array} events - Event list to append text to
   * @returns {boolean} true if pokemon can move, false if action is blocked
   */
  checkCanMove(attacker, role, events) {
    const name = attacker.nickname || attacker.name || attacker.species?.name || 'Pokémon';

    // 1. Sleep check
    if (attacker.status === 'sleep') {
      attacker.sleepTurns = (attacker.sleepTurns || 1) - 1;
      if (attacker.sleepTurns <= 0) {
        attacker.status = null;
        events.push({
          type: 'text',
          message: `${name} acordou!`
        });
      } else {
        events.push({
          type: 'text',
          message: `${name} está dormindo profundamente...`
        });
        return false;
      }
    }

    // 2. Freeze check
    if (attacker.status === 'freeze') {
      if (Math.random() < 0.25) {
        attacker.status = null;
        events.push({
          type: 'text',
          message: `${name} descongelou!`
        });
      } else {
        events.push({
          type: 'text',
          message: `${name} está congelado e não pode se mover!`
        });
        return false;
      }
    }

    // 3. Paralysis check (25% full paralysis)
    if (attacker.status === 'paralysis') {
      if (Math.random() < 0.25) {
        events.push({
          type: 'text',
          message: `${name} está paralisado! Não conseguiu se mover!`
        });
        return false;
      }
    }

    // 4. Confusion check
    if (attacker.confusionTurns && attacker.confusionTurns > 0) {
      attacker.confusionTurns--;
      if (attacker.confusionTurns <= 0) {
        events.push({
          type: 'text',
          message: `${name} se livrou da confusão!`
        });
      } else {
        events.push({
          type: 'text',
          message: `${name} está confuso!`
        });
        if (Math.random() < 0.33) {
          // Hurt itself in confusion (40 BP physical damage)
          const atk = attacker.stats?.attack || 10;
          const def = attacker.stats?.defense || 10;
          const selfDamage = Math.max(1, Math.floor((Math.floor((2 * (attacker.level || 5)) / 5 + 2) * 40 * atk / def) / 50) + 2);
          attacker.currentHp = Math.max(0, attacker.currentHp - selfDamage);

          events.push({
            type: 'damage',
            target: role,
            damage: selfDamage,
            remainingHp: attacker.currentHp,
            maxHp: attacker.maxHp,
            message: 'Está tão confuso que feriu a si mesmo!'
          });
          return false;
        }
      }
    }

    // 5. Flinch check (1 turn only)
    if (attacker.isFlinched) {
      attacker.isFlinched = false;
      events.push({
        type: 'text',
        message: `${name} hesitou e não pôde atacar!`
      });
      return false;
    }

    return true;
  }

  /**
   * Applies primary effects for Status moves, or secondary effects for Damaging moves.
   * @param {Object} move - Move definition
   * @param {Object} attacker - User of the move
   * @param {Object} defender - Target of the move
   * @param {number} damageDealt - Damage dealt (0 for status moves)
   * @param {string} attackerRole - 'player' | 'wild'
   * @param {Array} events - Event list
   */
  applyMoveEffects(move, attacker, defender, damageDealt, attackerRole, events) {
    const moveKey = String(move.internalName || move.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const defenderRole = attackerRole === 'player' ? 'wild' : 'player';
    const atkName = attacker.nickname || attacker.name || attacker.species?.name || 'Pokémon';
    const defName = defender.nickname || defender.name || defender.species?.name || 'Pokémon';

    // ─── 1. STATUS MOVES (Deal 0 direct damage) ──────────────────────────────
    if (move.category === 'Status' || !move.power || move.power <= 0) {
      // Poison
      if (['POISONPOWDER', 'TOXIC', 'POISONGAS'].includes(moveKey)) {
        this.inflictStatus(defender, 'poison', defenderRole, events, `${defName} foi envenenado!`);
        return;
      }
      // Paralysis
      if (['THUNDERWAVE', 'STUNSPORE', 'GLARE'].includes(moveKey)) {
        if (moveKey === 'THUNDERWAVE' && (defender.species?.type1 === 'GROUND' || defender.species?.type2 === 'GROUND')) {
          events.push({ type: 'text', message: 'Não teve efeito no tipo Terra!' });
          return;
        }
        this.inflictStatus(defender, 'paralysis', defenderRole, events, `${defName} ficou paralisado!`);
        return;
      }
      // Sleep
      if (['SLEEPPOWDER', 'HYPNOSIS', 'SING', 'SPORE', 'YAWN', 'GRASSWHISTLE'].includes(moveKey)) {
        this.inflictStatus(defender, 'sleep', defenderRole, events, `${defName} caiu no sono!`, Math.floor(Math.random() * 3) + 2);
        return;
      }
      // Burn
      if (['WILLOWISP'].includes(moveKey)) {
        this.inflictStatus(defender, 'burn', defenderRole, events, `${defName} foi queimado!`);
        return;
      }
      // Confusion
      if (['CONFUSERAY', 'SUPERSONIC', 'SWEETKISS', 'TEETERDANCE'].includes(moveKey)) {
        if (!defender.confusionTurns) {
          defender.confusionTurns = Math.floor(Math.random() * 3) + 2;
          events.push({ type: 'text', message: `${defName} ficou confuso!` });
        } else {
          events.push({ type: 'text', message: 'Mas falhou!' });
        }
        return;
      }
      // Stat modifications: Target Lowering
      if (['GROWL', 'BABYDOLLEYES'].includes(moveKey)) {
        this.modifyStatStage(defender, 'attack', -1, defenderRole, events, `O Ataque de ${defName} caiu!`);
        return;
      }
      if (['TAILWHIP', 'LEER'].includes(moveKey)) {
        this.modifyStatStage(defender, 'defense', -1, defenderRole, events, `A Defesa de ${defName} caiu!`);
        return;
      }
      if (['SCREECH'].includes(moveKey)) {
        this.modifyStatStage(defender, 'defense', -2, defenderRole, events, `A Defesa de ${defName} caiu muito!`);
        return;
      }
      if (['STRINGSHOT', 'SCARYFACE', 'COTTONSPORE'].includes(moveKey)) {
        this.modifyStatStage(defender, 'speed', -1, defenderRole, events, `A Velocidade de ${defName} caiu!`);
        return;
      }
      if (['SANDATTACK', 'SMOKESCREEN', 'FLASH', 'KINESIS'].includes(moveKey)) {
        this.modifyStatStage(defender, 'accuracy', -1, defenderRole, events, `A Precisão de ${defName} caiu!`);
        return;
      }
      // Stat modifications: Self Raising
      if (['SWORDSDANCE'].includes(moveKey)) {
        this.modifyStatStage(attacker, 'attack', 2, attackerRole, events, `O Ataque de ${atkName} subiu muito!`);
        return;
      }
      if (['HOWL', 'MEDITATE', 'SHARPEN'].includes(moveKey)) {
        this.modifyStatStage(attacker, 'attack', 1, attackerRole, events, `O Ataque de ${atkName} subiu!`);
        return;
      }
      if (['DEFENSECURL', 'HARDEN', 'WITHDRAW'].includes(moveKey)) {
        this.modifyStatStage(attacker, 'defense', 1, attackerRole, events, `A Defesa de ${atkName} subiu!`);
        return;
      }
      if (['ACIDARMOR', 'IRONDEFENSE', 'BARRIER'].includes(moveKey)) {
        this.modifyStatStage(attacker, 'defense', 2, attackerRole, events, `A Defesa de ${atkName} subiu muito!`);
        return;
      }
      if (['AGILITY', 'ROCKPOLISH'].includes(moveKey)) {
        this.modifyStatStage(attacker, 'speed', 2, attackerRole, events, `A Velocidade de ${atkName} subiu muito!`);
        return;
      }
      if (['CALMMIND'].includes(moveKey)) {
        this.modifyStatStage(attacker, 'spAtk', 1, attackerRole, events, `O Sp. Atk e Sp. Def de ${atkName} subiram!`);
        this.modifyStatStage(attacker, 'spDef', 1, attackerRole, null, '');
        return;
      }
      // Self Recovery
      if (['RECOVER', 'SOFTBOILED', 'ROOST', 'SLACKOFF', 'SYNTHESIS', 'MOONLIGHT', 'MORNINGSUN', 'MILKDRINK'].includes(moveKey)) {
        const healAmt = Math.max(1, Math.floor(attacker.maxHp / 2));
        attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmt);
        events.push({
          type: 'heal',
          target: attackerRole,
          amount: healAmt,
          remainingHp: attacker.currentHp,
          maxHp: attacker.maxHp,
          message: `${atkName} recuperou HP!`
        });
        return;
      }
      if (['REST'].includes(moveKey)) {
        attacker.currentHp = attacker.maxHp;
        attacker.status = 'sleep';
        attacker.sleepTurns = 2;
        events.push({
          type: 'heal',
          target: attackerRole,
          amount: attacker.maxHp,
          remainingHp: attacker.currentHp,
          maxHp: attacker.maxHp,
          message: `${atkName} dormiu profundamente para recuperar todas as suas forças!`
        });
        return;
      }

      // Default status message
      events.push({ type: 'text', message: `${atkName} usou ${move.name}!` });
      return;
    }

    // ─── 2. SECONDARY EFFECTS ON DAMAGING MOVES ─────────────────────────────
    if (damageDealt <= 0) return;

    // Drain moves (heals 50% of damage dealt)
    if (['ABSORB', 'MEGADRAIN', 'GIGADRAIN', 'LEECHLIFE', 'DRAINPUNCH', 'DRAINKISS'].includes(moveKey)) {
      const healAmount = Math.max(1, Math.floor(damageDealt / 2));
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount);
      events.push({
        type: 'heal',
        target: attackerRole,
        amount: healAmount,
        remainingHp: attacker.currentHp,
        maxHp: attacker.maxHp,
        message: `${atkName} absorveu energia do adversário!`
      });
    }

    // Recoil moves (user takes 25% recoil)
    if (['TAKEDOWN', 'DOUBLEEDGE', 'SUBMISSION', 'BRAVEBIRD', 'FLAREBLITZ', 'VOLTTACKLE'].includes(moveKey)) {
      const recoil = Math.max(1, Math.floor(damageDealt / 4));
      attacker.currentHp = Math.max(0, attacker.currentHp - recoil);
      events.push({
        type: 'damage',
        target: attackerRole,
        damage: recoil,
        remainingHp: attacker.currentHp,
        maxHp: attacker.maxHp,
        message: `${atkName} sofreu dano por recuo!`
      });
    }

    // Secondary Poison (30%)
    if (['POISONSTING', 'SLUDGE', 'SLUDGEBOMB', 'POISONJAB', 'POISONFANG', 'SMOG'].includes(moveKey)) {
      if (Math.random() < 0.3) {
        this.inflictStatus(defender, 'poison', defenderRole, events, `${defName} foi envenenado!`);
      }
    }

    // Secondary Burn (10-20%)
    if (['EMBER', 'FLAMETHROWER', 'FIREBLAST', 'FIREPUNCH', 'FLAMEWHEEL', 'HEATWAVE', 'BLAZEKICK'].includes(moveKey)) {
      const chance = moveKey === 'FIREBLAST' ? 0.3 : 0.1;
      if (Math.random() < chance) {
        this.inflictStatus(defender, 'burn', defenderRole, events, `${defName} foi queimado!`);
      }
    }

    // Secondary Paralysis (10-30%)
    if (['THUNDERSHOCK', 'THUNDERBOLT', 'THUNDER', 'SPARK', 'BODYSLAM', 'THUNDERPUNCH', 'LICK', 'DRAGONBREATH'].includes(moveKey)) {
      const chance = ['BODYSLAM', 'LICK', 'DRAGONBREATH', 'SPARK', 'THUNDER'].includes(moveKey) ? 0.3 : 0.1;
      if (Math.random() < chance) {
        this.inflictStatus(defender, 'paralysis', defenderRole, events, `${defName} ficou paralisado!`);
      }
    }

    // Secondary Freeze (10%)
    if (['ICEBEAM', 'BLIZZARD', 'POWDERSNOW', 'ICEPUNCH'].includes(moveKey)) {
      if (Math.random() < 0.1) {
        this.inflictStatus(defender, 'freeze', defenderRole, events, `${defName} congelou solidamente!`);
      }
    }

    // Secondary Confusion (10-20%)
    if (['CONFUSION', 'PSYBEAM', 'WATERPULSE', 'DYNAMICPUNCH', 'DIZZYPUNCH'].includes(moveKey)) {
      const chance = moveKey === 'DYNAMICPUNCH' ? 1.0 : 0.2;
      if (Math.random() < chance && !defender.confusionTurns) {
        defender.confusionTurns = Math.floor(Math.random() * 3) + 2;
        events.push({ type: 'text', message: `${defName} ficou confuso!` });
      }
    }

    // Flinch (30%)
    if (['BITE', 'HEADBUTT', 'ROCKSLIDE', 'WATERFALL', 'IRONHEAD', 'AIRSLASH', 'ASTONISH', 'HYPERFANG'].includes(moveKey)) {
      if (Math.random() < 0.3) {
        defender.isFlinched = true;
      }
    }

    // Secondary Stat Drops
    if (['BUBBLE', 'BUBBLEBEAM', 'ROCKTOMB', 'ICYWIND'].includes(moveKey)) {
      if (Math.random() < 0.33) {
        this.modifyStatStage(defender, 'speed', -1, defenderRole, events, `A Velocidade de ${defName} caiu!`);
      }
    }
    if (['ACID', 'PSYCHIC', 'BUGBUZZ', 'EARTHPOWER', 'ENERGYBALL', 'FLASHCANNON', 'SHADOWBALL'].includes(moveKey)) {
      if (Math.random() < 0.15) {
        this.modifyStatStage(defender, 'spDef', -1, defenderRole, events, `A Sp. Def de ${defName} caiu!`);
      }
    }
    if (['CRUNCH', 'IRONTAIL'].includes(moveKey)) {
      if (Math.random() < 0.2) {
        this.modifyStatStage(defender, 'defense', -1, defenderRole, events, `A Defesa de ${defName} caiu!`);
      }
    }
  }

  /**
   * Helper to inflict a primary status condition if target doesn't already have one.
   */
  inflictStatus(target, statusType, role, events, msg, duration = 0) {
    if (target.currentHp <= 0) return;
    if (target.status) {
      if (msg) events.push({ type: 'text', message: 'Mas não teve efeito!' });
      return;
    }

    // Type immunities
    const t1 = target.species?.type1;
    const t2 = target.species?.type2;
    if (statusType === 'poison' && (t1 === 'POISON' || t2 === 'POISON' || t1 === 'STEEL' || t2 === 'STEEL')) {
      events.push({ type: 'text', message: 'Não afeta tipos Veneno ou Aço!' });
      return;
    }
    if (statusType === 'burn' && (t1 === 'FIRE' || t2 === 'FIRE')) {
      events.push({ type: 'text', message: 'Não afeta tipos Fogo!' });
      return;
    }
    if (statusType === 'paralysis' && (t1 === 'ELECTRIC' || t2 === 'ELECTRIC')) {
      events.push({ type: 'text', message: 'Não afeta tipos Elétrico!' });
      return;
    }
    if (statusType === 'freeze' && (t1 === 'ICE' || t2 === 'ICE')) {
      events.push({ type: 'text', message: 'Não afeta tipos Gelo!' });
      return;
    }

    target.status = statusType;
    if (statusType === 'sleep') {
      target.sleepTurns = duration || 2;
    }

    events.push({
      type: 'status_applied',
      target: role,
      status: statusType,
      message: msg
    });
  }

  /**
   * Modifies a stat stage (-6 to +6).
   */
  modifyStatStage(target, statName, delta, role, events, msg) {
    if (target.currentHp <= 0) return;
    if (!target.statStages) {
      target.statStages = { attack: 0, defense: 0, speed: 0, spAtk: 0, spDef: 0, accuracy: 0 };
    }

    const current = target.statStages[statName] || 0;
    const next = Math.max(-6, Math.min(6, current + delta));
    if (current === next) {
      if (events) events.push({ type: 'text', message: delta > 0 ? 'Não pode subir mais!' : 'Não pode cair mais!' });
      return;
    }

    target.statStages[statName] = next;
    if (events && msg) {
      events.push({
        type: 'stat_change',
        target: role,
        stat: statName,
        stage: next,
        message: msg
      });
    }
  }

  /**
   * Applies residual status damage at the end of a battle turn (Poison, Burn).
   * @param {Object} session
   * @param {Array} events
   */
  applyEndOfTurnEffects(session, events) {
    const mons = [
      { mon: session.playerPokemon, role: 'player' },
      { mon: session.wildPokemon, role: 'wild' }
    ];

    for (const { mon, role } of mons) {
      if (mon.currentHp <= 0 || !mon.status) continue;
      const name = mon.nickname || mon.name || mon.species?.name || 'Pokémon';

      if (mon.status === 'poison') {
        const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
        mon.currentHp = Math.max(0, mon.currentHp - dmg);
        events.push({
          type: 'damage',
          target: role,
          damage: dmg,
          remainingHp: mon.currentHp,
          maxHp: mon.maxHp,
          isStatusDamage: true,
          message: `${name} sofreu com o veneno!`
        });

        if (mon.currentHp <= 0) {
          events.push({
            type: 'faint',
            target: role,
            pokemonName: name,
            message: `${name} desmaiou por causa do veneno!`
          });
        }
      } else if (mon.status === 'burn') {
        const dmg = Math.max(1, Math.floor(mon.maxHp / 16));
        mon.currentHp = Math.max(0, mon.currentHp - dmg);
        events.push({
          type: 'damage',
          target: role,
          damage: dmg,
          remainingHp: mon.currentHp,
          maxHp: mon.maxHp,
          isStatusDamage: true,
          message: `${name} sofreu com a queimadura!`
        });

        if (mon.currentHp <= 0) {
          events.push({
            type: 'faint',
            target: role,
            pokemonName: name,
            message: `${name} desmaiou por causa da queimadura!`
          });
        }
      }
    }
  }
}

module.exports = new MoveEffectHandler();
