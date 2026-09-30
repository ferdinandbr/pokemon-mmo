const prisma = require('../../database');
const moveRegistry = require('../moves/MoveRegistry');
const moveManager = require('../moves/MoveManager');
const pokemonService = require('../pokemonService');
const pokemonProgressionService = require('../pokemonProgressionService');
const playerProgressionService = require('../player/PlayerProgressionService');
const friendshipManager = require('../evolution/FriendshipManager');
const damageCalculator = require('./DamageCalculator');
const catchCalculator = require('./CatchCalculator');
const moveEffectHandler = require('./MoveEffectHandler');

// Common wild species for Kanto grasslands
const WILD_GRASS_SPECIES = [
  { id: 16, name: 'PIDGEY', minLvl: 2, maxLvl: 5, weight: 35 },
  { id: 19, name: 'RATTATA', minLvl: 2, maxLvl: 4, weight: 35 },
  { id: 10, name: 'CATERPIE', minLvl: 2, maxLvl: 4, weight: 10 },
  { id: 13, name: 'WEEDLE', minLvl: 2, maxLvl: 4, weight: 10 },
  { id: 25, name: 'PIKACHU', minLvl: 3, maxLvl: 5, weight: 5 },
  { id: 43, name: 'ODDISH', minLvl: 3, maxLvl: 5, weight: 5 }
];

class BattleManager {
  constructor() {
    this.sessions = new Map(); // characterId -> BattleSession
  }

  /**
   * Gets active battle session for character.
   */
  getSession(characterId) {
    return this.sessions.get(Number(characterId)) || null;
  }

  /**
   * Generates a random wild Pokémon for battle.
   */
  async generateWildPokemon(minLevel = 2, maxLevel = 5) {
    await moveRegistry.ensureLoaded();

    // Roll species by weight
    const totalWeight = WILD_GRASS_SPECIES.reduce((acc, s) => acc + s.weight, 0);
    let roll = Math.random() * totalWeight;
    let chosenSpec = WILD_GRASS_SPECIES[0];

    for (const spec of WILD_GRASS_SPECIES) {
      if (roll < spec.weight) {
        chosenSpec = spec;
        break;
      }
      roll -= spec.weight;
    }

    const species = await prisma.pokemonSpecies.findUnique({ where: { id: chosenSpec.id } });
    const level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;

    const ivs = pokemonService.generateRandomIVs();
    const evs = { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 };
    const baseStats = {
      hp: species.baseHp,
      atk: species.baseAttack,
      def: species.baseDefense,
      spAtk: species.baseSpAtk,
      spDef: species.baseSpDef,
      speed: species.baseSpeed
    };

    const calculatedStats = pokemonService.calculateStats(baseStats, ivs, evs, level);
    const movesInstances = moveManager.selectMovesForInitialLevel(species, level);
    const movesInflated = moveRegistry.inflateMovesList(movesInstances);

    return {
      speciesId: species.id,
      name: species.name,
      level,
      isShiny: pokemonService.isShinyRoll(),
      gender: Math.random() < 0.5 ? 'M' : 'F',
      currentHp: calculatedStats.hp,
      maxHp: calculatedStats.hp,
      stats: calculatedStats,
      species,
      moves: movesInflated
    };
  }

  /**
   * Starts a new wild battle encounter for a character.
   */
  async startWildBattle(characterId, context = {}) {
    await moveRegistry.ensureLoaded();

    const charId = Number(characterId);
    if (this.sessions.has(charId)) {
      return this.sessions.get(charId).getPublicState();
    }

    // Load player party
    const party = await prisma.pokemon.findMany({
      where: { characterId: charId, location: 'party' },
      include: { species: true },
      orderBy: { partySlot: 'asc' }
    });

    if (party.length === 0) {
      throw new Error('Você não possui nenhum Pokémon na equipe!');
    }

    // Normalizar EXP de Pokémon legados ou criados sem exp base
    party.forEach(p => {
      p.exp = Math.max(p.exp || 0, Math.pow(p.level, 3));
    });

    // Find first alive Pokémon
    const activeIndex = party.findIndex(p => p.currentHp > 0);
    if (activeIndex === -1) {
      throw new Error('Todos os seus Pokémon estão desmaiados! Visite o Centro Pokémon.');
    }

    const playerMon = party[activeIndex];
    const playerMonFormatted = pokemonService.formatPokemonForClient(playerMon);

    const wildPokemon = await this.generateWildPokemon(2, 5);

    let locationName = 'Rota 1';
    try {
      const roomManager = require('../../rooms/roomManager');
      const rId = context.roomId || 'route_1';
      locationName = context.locationName || roomManager.ROOM_DEFINITIONS?.[rId]?.name || 'Rota 1';
    } catch (e) {
      locationName = 'Rota 1';
    }

    const session = {
      characterId: charId,
      playerParty: party,
      activePlayerIndex: activeIndex,
      playerPokemon: playerMonFormatted,
      wildPokemon,
      runAttempts: 0,
      turn: 1,
      isEnded: false,
      caughtLocation: locationName,
      trainerName: context.playerName || null,

      getPublicState: function () {
        const pName = this.playerPokemon.nickname || this.playerPokemon.species?.name || 'Pokemon';
        return {
          battleId: `battle_${charId}_${Date.now()}`,
          activePlayerIndex: this.activePlayerIndex,
          playerPokemon: {
            ...this.playerPokemon,
            name: pName,
            isShiny: Boolean(this.playerPokemon.isShiny),
            gender: this.playerPokemon.gender || 'M',
            status: this.playerPokemon.status || null
          },
          wildPokemon: {
            speciesId: this.wildPokemon.speciesId,
            name: this.wildPokemon.name,
            level: this.wildPokemon.level,
            gender: this.wildPokemon.gender,
            isShiny: Boolean(this.wildPokemon.isShiny),
            currentHp: this.wildPokemon.currentHp,
            maxHp: this.wildPokemon.maxHp,
            status: this.wildPokemon.status || null
          },
          playerParty: this.playerParty.map(p => ({
            id: p.id,
            speciesId: p.speciesId,
            name: p.nickname || p.species?.name || p.name,
            level: p.level,
            gender: p.gender || 'M',
            isShiny: Boolean(p.isShiny),
            currentHp: p.currentHp,
            maxHp: p.maxHp,
            status: p.status || null,
            isFainted: p.currentHp <= 0
          }))
        };
      }
    };

    this.sessions.set(charId, session);
    return session.getPublicState();
  }

  /**
   * Executes a turn in the battle.
   * 
   * @param {number} characterId
   * @param {Object} action - { type: 'fight'|'item'|'switch'|'run', slotIndex, itemId, partyIndex }
   * @returns {Promise<Object>} Chronological list of battle events and updated state.
   */
  async executeTurn(characterId, action) {
    const session = this.getSession(characterId);
    if (!session || session.isEnded) {
      throw new Error('Nenhuma batalha ativa encontrada.');
    }

    const events = [];
    const playerMon = session.playerPokemon;
    const wildMon = session.wildPokemon;

    // Turn locking to enforce single action per turn
    if (session.isProcessingTurn) {
      throw new Error('Aguarde o término do turno atual!');
    }
    session.isProcessingTurn = true;

    try {
      // Se o Pokémon do jogador estiver desmaiado, apenas a ação de troca (switch) é permitida!
      if (playerMon.currentHp <= 0 && action.type !== 'switch') {
        throw new Error('Seu Pokémon desmaiou! Escolha outro Pokémon da sua equipe para continuar.');
      }

    // ─── ACTION: RUN (FUGIR) ──────────────────────────────────────────────────
    if (action.type === 'run') {
      session.runAttempts++;
      const playerSpeed = playerMon.stats?.speed || 10;
      const wildSpeed = wildMon.stats?.speed || 10;

      // Gen 3 Run Formula
      const F = Math.floor((playerSpeed * 128) / wildSpeed) + 30 * session.runAttempts;
      const canRun = F > 255 || Math.floor(Math.random() * 256) < F;

      if (canRun) {
        events.push({
          type: 'text',
          message: 'Você fugiu da batalha com segurança!'
        });
        events.push({ type: 'battle_end', reason: 'run' });
        this.sessions.delete(characterId);
        return { events, battleEnded: true };
      } else {
        events.push({
          type: 'text',
          message: 'Não conseguiu escapar!'
        });
        // Wild attacks after failed escape
        await this._executeWildAttack(session, events);
        session.turn++;
        return { events, battleEnded: session.isEnded, state: session.getPublicState() };
      }
    }

    // ─── ACTION: ITEM (QUICK ITEM OU MOCHILA: POKEBALL / CURA / REVIVE) ─────────
    if (action.type === 'item') {
      const { itemId } = action;
      const slot = await prisma.inventorySlot.findFirst({
        where: { characterId, itemId },
        include: { item: true }
      });

      if (!slot || slot.quantity <= 0) {
        throw new Error('Item não disponível na mochila!');
      }

      const item = slot.item;
      const lowerName = item.name.toLowerCase();

      // Check if item is a Poke Ball
      const isPokeBall = item.category === 'pokeball' ||
        lowerName.endsWith('ball') ||
        lowerName.endsWith('bola') ||
        lowerName.includes('poke ball') ||
        lowerName.includes('great ball') ||
        lowerName.includes('ultra ball') ||
        lowerName.includes('master ball') ||
        lowerName.includes('safari ball');

      const isHealing = lowerName.includes('potion') ||
        lowerName.includes('restore') ||
        lowerName.includes('candy') ||
        lowerName.includes('doce') ||
        lowerName.includes('revive') ||
        lowerName.includes('heal') ||
        lowerName.includes('antidote') ||
        lowerName.includes('berry');

      if (!isPokeBall && !isHealing) {
        throw new Error(`O item "${item.name}" não pode ser utilizado durante a batalha!`);
      }

      // ─── ITEM: POKÉBOLA ──────────────────────────────────────────────────
      if (isPokeBall) {
        // Decrement inventory
        if (slot.quantity > 1) {
          await prisma.inventorySlot.update({ where: { id: slot.id }, data: { quantity: slot.quantity - 1 } });
        } else {
          await prisma.inventorySlot.delete({ where: { id: slot.id } });
        }

        events.push({
          type: 'throw_ball',
          ballName: item.name,
          message: `Você arremessou 1x ${item.name}!`
        });

        const catchResult = catchCalculator.calculateCatch(wildMon, item.name, {
          turn: session.turn,
          playerLevel: session.playerPokemon?.level
        });

        events.push({
          type: 'ball_shake',
          shakes: catchResult.shakes
        });

        if (catchResult.isCaught) {
          events.push({
            type: 'catch_success',
            pokemonName: wildMon.name,
            message: `Gotcha! ${wildMon.name} foi capturado!`
          });

          // Party vs Storage placement: joins party if < 6 members, else PC Box
          const currentParty = await prisma.pokemon.findMany({
            where: { characterId, location: 'party' }
          });
          const targetLocation = currentParty.length < 6 ? 'party' : 'storage';

          const newMon = await pokemonService.createPokemon({
            characterId,
            speciesIdOrName: wildMon.speciesId,
            level: wildMon.level,
            isShiny: wildMon.isShiny,
            forceBuddy: false,
            targetLocation,
            caughtLocation: session.caughtLocation || 'Rota 1',
            caughtLevel: wildMon.level,
            caughtBall: item.slug || item.name || 'poke-ball',
            originalTrainerId: characterId,
            originalTrainerName: session.trainerName || null,
            obtainedMethod: 'capture'
          });

          if (targetLocation === 'party') {
            events.push({
              type: 'text',
              message: `${wildMon.name} entrou para a sua equipe!`
            });
          } else {
            events.push({
              type: 'text',
              message: `${wildMon.name} foi transferido para o PC Box!`
            });
          }

          // Register in Pokedex
          await prisma.pokedexEntry.upsert({
            where: {
              characterId_pokemonNumber: {
                characterId,
                pokemonNumber: wildMon.speciesId
              }
            },
            update: { status: 'caught', caughtAt: new Date() },
            create: {
              characterId,
              pokemonNumber: wildMon.speciesId,
              pokemonName: wildMon.name,
              status: 'caught',
              caughtAt: new Date()
            }
          });

          events.push({ type: 'battle_end', reason: 'catch', newPokemon: newMon });
          this.sessions.delete(characterId);
          return { events, battleEnded: true };
        } else {
          events.push({
            type: 'text',
            message: `Ah não! ${wildMon.name} escapou da Pokébola!`
          });

          // Wild attacks after failed catch
          await this._executeWildAttack(session, events);
          session.turn++;
          return { events, battleEnded: session.isEnded, state: session.getPublicState() };
        }
      }

      // ─── ITEM: CANDY (DOCE RARO / EXP CANDY) ──────────────────────────────
      if (lowerName.includes('candy') || lowerName.includes('doce')) {
        let targetMon = session.playerPokemon;
        if (targetMon.level >= 100) {
          throw new Error(`${targetMon.nickname || targetMon.name || targetMon.species?.name} já está no nível máximo (100)!`);
        }

        // Decrement inventory
        if (slot.quantity > 1) {
          await prisma.inventorySlot.update({ where: { id: slot.id }, data: { quantity: slot.quantity - 1 } });
        } else {
          await prisma.inventorySlot.delete({ where: { id: slot.id } });
        }

        if (lowerName.includes('exp')) {
          let expGain = 1000;
          if (lowerName.includes('xl')) expGain = 30000;
          else if (lowerName.includes('xs')) expGain = 100;
          else if (lowerName.endsWith(' l') || lowerName.includes(' l ')) expGain = 10000;
          else if (lowerName.endsWith(' m') || lowerName.includes(' m ')) expGain = 3000;
          else if (lowerName.endsWith(' s') || lowerName.includes(' s ')) expGain = 800;

          const curExp = (targetMon.exp || 0) + expGain;
          await prisma.pokemon.update({ where: { id: targetMon.id }, data: { exp: curExp } });

          if (curExp >= Math.pow(targetMon.level + 1, 3)) {
            const lvlRes = await pokemonProgressionService.levelUpPokemon({
              characterId,
              pokemonId: targetMon.id,
              levelsToAdd: 1
            });
            session.playerPokemon = pokemonService.formatPokemonForClient(lvlRes.pokemon);
            const pEntry = session.playerParty.find(p => p.id === targetMon.id);
            if (pEntry) {
              pEntry.level = lvlRes.newLevel;
              pEntry.maxHp = lvlRes.pokemon.maxHp;
              pEntry.currentHp = lvlRes.pokemon.currentHp;
            }
            events.push({
              type: 'level_up',
              message: `Parabéns! ${targetMon.nickname || targetMon.name || targetMon.species?.name} subiu para o Nível ${lvlRes.newLevel}!`
            });
          } else {
            events.push({
              type: 'exp_gain',
              pokemonId: targetMon.id,
              amount: expGain,
              message: `${targetMon.nickname || targetMon.name || targetMon.species?.name} ganhou ${expGain} EXP!`
            });
          }
        } else {
          // Rare Candy
          const lvlRes = await pokemonProgressionService.levelUpPokemon({
            characterId,
            pokemonId: targetMon.id,
            levelsToAdd: 1
          });
          session.playerPokemon = pokemonService.formatPokemonForClient(lvlRes.pokemon);
          const pEntry = session.playerParty.find(p => p.id === targetMon.id);
          if (pEntry) {
            pEntry.level = lvlRes.newLevel;
            pEntry.maxHp = lvlRes.pokemon.maxHp;
            pEntry.currentHp = lvlRes.pokemon.currentHp;
          }
          events.push({
            type: 'level_up',
            message: `Parabéns! ${targetMon.nickname || targetMon.name || targetMon.species?.name} subiu para o Nível ${lvlRes.newLevel}!`
          });
        }

        await this._executeWildAttack(session, events);
        session.turn++;
        return { events, battleEnded: session.isEnded, state: session.getPublicState() };
      }

      // ─── ITEM: REVIVE (REVIVER) ───────────────────────────────────────────
      if (lowerName.includes('revive')) {
        let targetMon = null;
        if (action.targetPokemonId) {
          targetMon = session.playerParty.find(p => p.id === Number(action.targetPokemonId));
        }
        if (!targetMon) {
          if (session.playerPokemon.currentHp <= 0) {
            targetMon = session.playerPokemon;
          } else {
            const fainted = session.playerParty.find(p => p.currentHp <= 0);
            if (fainted) {
              targetMon = fainted;
            } else {
              throw new Error('Nenhum Pokémon da equipe está desmaiado para reviver!');
            }
          }
        }

        if (targetMon.currentHp > 0) {
          throw new Error(`${targetMon.nickname || targetMon.name || targetMon.species?.name} não está desmaiado!`);
        }

        // Decrement inventory
        if (slot.quantity > 1) {
          await prisma.inventorySlot.update({ where: { id: slot.id }, data: { quantity: slot.quantity - 1 } });
        } else {
          await prisma.inventorySlot.delete({ where: { id: slot.id } });
        }

        const reviveHp = lowerName.includes('max') ? targetMon.maxHp : Math.max(1, Math.floor(targetMon.maxHp / 2));
        targetMon.currentHp = reviveHp;
        const pEntry = session.playerParty.find(p => p.id === targetMon.id);
        if (pEntry) pEntry.currentHp = reviveHp;
        if (session.playerPokemon.id === targetMon.id) {
          session.playerPokemon.currentHp = reviveHp;
        }

        await prisma.pokemon.update({
          where: { id: targetMon.id },
          data: { currentHp: reviveHp }
        });

        events.push({
          type: 'heal',
          target: targetMon.id === session.playerPokemon.id ? 'player' : 'party',
          pokemonId: targetMon.id,
          amount: reviveHp,
          currentHp: session.playerPokemon.currentHp,
          maxHp: session.playerPokemon.maxHp,
          message: `Usou ${item.name}! ${targetMon.nickname || targetMon.name || targetMon.species?.name} foi revivido com ${reviveHp} HP!`
        });

        if (session.playerPokemon.currentHp > 0) {
          await this._executeWildAttack(session, events);
          session.turn++;
        }
        return { events, battleEnded: session.isEnded, state: session.getPublicState() };
      }

      // ─── ITEM: POÇÕES & CURAS DE HP ───────────────────────────────────────
      if (lowerName.includes('potion') || lowerName.includes('restore') || lowerName.includes('water') || lowerName.includes('soda') || lowerName.includes('milk') || lowerName.includes('lemonade') || lowerName.includes('berry')) {
        let targetMon = session.playerPokemon;

        if (targetMon.currentHp >= targetMon.maxHp || targetMon.currentHp <= 0) {
          const hurt = session.playerParty.find(p => p.currentHp > 0 && p.currentHp < p.maxHp);
          if (hurt) {
            targetMon = hurt;
          } else if (targetMon.currentHp <= 0) {
            throw new Error('O Pokémon ativo está desmaiado! Use um Revive.');
          } else {
            throw new Error('Todos os Pokémon da equipe já estão com o HP máximo!');
          }
        }

        // Decrement inventory
        if (slot.quantity > 1) {
          await prisma.inventorySlot.update({ where: { id: slot.id }, data: { quantity: slot.quantity - 1 } });
        } else {
          await prisma.inventorySlot.delete({ where: { id: slot.id } });
        }

        let healAmount = 20;
        if (lowerName.includes('super')) healAmount = 50;
        else if (lowerName.includes('hyper')) healAmount = 200;
        else if (lowerName.includes('max') || lowerName.includes('full')) healAmount = targetMon.maxHp;
        else if (lowerName.includes('soda')) healAmount = 60;
        else if (lowerName.includes('lemonade')) healAmount = 80;
        else if (lowerName.includes('milk')) healAmount = 100;
        else if (lowerName.includes('water')) healAmount = 50;
        else if (lowerName.includes('oran')) healAmount = 10;
        else if (lowerName.includes('sitrus')) healAmount = Math.max(30, Math.floor(targetMon.maxHp / 4));

        const newHp = Math.min(targetMon.maxHp, targetMon.currentHp + healAmount);
        const diff = newHp - targetMon.currentHp;
        targetMon.currentHp = newHp;
        const pEntry = session.playerParty.find(p => p.id === targetMon.id);
        if (pEntry) pEntry.currentHp = newHp;
        if (session.playerPokemon.id === targetMon.id) {
          session.playerPokemon.currentHp = newHp;
        }

        await prisma.pokemon.update({
          where: { id: targetMon.id },
          data: { currentHp: newHp }
        });

        events.push({
          type: 'heal',
          target: targetMon.id === session.playerPokemon.id ? 'player' : 'party',
          amount: diff,
          currentHp: session.playerPokemon.currentHp,
          maxHp: session.playerPokemon.maxHp,
          message: `Usou ${item.name}! Recuperou ${diff} HP de ${targetMon.nickname || targetMon.name || targetMon.species?.name}!`
        });

        await this._executeWildAttack(session, events);
        session.turn++;
        return { events, battleEnded: session.isEnded, state: session.getPublicState() };
      }

      // ─── ITEM: CURAS DE STATUS ───────────────────────────────────────────
      if (lowerName.includes('heal') || lowerName.includes('cure') || lowerName.includes('antidote') || lowerName.includes('awakening')) {
        // Decrement inventory
        if (slot.quantity > 1) {
          await prisma.inventorySlot.update({ where: { id: slot.id }, data: { quantity: slot.quantity - 1 } });
        } else {
          await prisma.inventorySlot.delete({ where: { id: slot.id } });
        }

        events.push({
          type: 'text',
          message: `Usou ${item.name}! ${session.playerPokemon.nickname || session.playerPokemon.name} foi curado de condições de status!`
        });

        await this._executeWildAttack(session, events);
        session.turn++;
        return { events, battleEnded: session.isEnded, state: session.getPublicState() };
      }
    }

    // ─── ACTION: SWITCH (TROCAR POKEMON) ──────────────────────────────────────
    if (action.type === 'switch') {
      const targetIndex = Number(action.partyIndex);
      const party = session.playerParty;

      if (targetIndex < 0 || targetIndex >= party.length) {
        throw new Error('Índice de Pokémon inválido.');
      }

      const nextMon = party[targetIndex];
      if (nextMon.currentHp <= 0) {
        throw new Error('Este Pokémon está desmaiado e não pode lutar!');
      }

      if (targetIndex === session.activePlayerIndex) {
        throw new Error('Este Pokémon já está em batalha!');
      }

      const isForcedSwitch = session.playerPokemon.currentHp <= 0;

      session.activePlayerIndex = targetIndex;
      session.playerPokemon = pokemonService.formatPokemonForClient(nextMon);

      events.push({
        type: 'switch_in',
        pokemon: session.playerPokemon,
        message: isForcedSwitch
          ? `Vai, ${session.playerPokemon.nickname || session.playerPokemon.species.name}!`
          : `Volte! Vai, ${session.playerPokemon.nickname || session.playerPokemon.species.name}!`
      });

      // Wild Pokémon só ataca na troca se foi uma troca voluntária em meio ao combate.
      // Se o Pokémon anterior desmaiou, o selvagem já atacou e a nova rodada inicia limpa.
      if (!isForcedSwitch) {
        await this._executeWildAttack(session, events);
      }

      session.turn++;
      return { events, battleEnded: session.isEnded, state: session.getPublicState() };
    }

    // ─── ACTION: FIGHT (ATACAR COM GOLPE) ─────────────────────────────────────
    if (action.type === 'fight') {
      const slotIndex = Number(action.slotIndex);
      const playerMoves = playerMon.moves || [];
      const chosenMove = playerMoves[slotIndex];

      if (!chosenMove) {
        throw new Error('Golpe selecionado não encontrado.');
      }

      // Check PP
      if (chosenMove.pp <= 0) {
        throw new Error('Não há mais PP para este golpe!');
      }

      // Deduct PP in memory & DB
      moveManager.consumePp(playerMon.moves, slotIndex, 1);
      await prisma.pokemon.update({
        where: { id: playerMon.id },
        data: { moves: JSON.stringify(playerMon.moves) }
      });

      // Wild Pokémon chooses a move with PP
      const wildAvailableMoves = wildMon.moves.filter(m => m.pp > 0);
      const wildMove = wildAvailableMoves.length > 0
        ? wildAvailableMoves[Math.floor(Math.random() * wildAvailableMoves.length)]
        : wildMon.moves[0];

      // Speed & Priority check
      const playerPriority = chosenMove.priority || 0;
      const wildPriority = wildMove.priority || 0;
      const playerSpeed = playerMon.stats?.speed || 10;
      const wildSpeed = wildMon.stats?.speed || 10;

      let playerFirst = true;
      if (playerPriority !== wildPriority) {
        playerFirst = playerPriority > wildPriority;
      } else {
        playerFirst = playerSpeed >= wildSpeed;
      }

      if (playerFirst) {
        // Player attacks first
        await this._executePlayerAttack(session, chosenMove, events);
        if (wildMon.currentHp > 0 && !session.isEnded) {
          await this._executeWildAttack(session, events, wildMove);
        }
      } else {
        // Wild attacks first
        await this._executeWildAttack(session, events, wildMove);
        if (playerMon.currentHp > 0 && !session.isEnded) {
          await this._executePlayerAttack(session, chosenMove, events);
        }
      }

      // Residual end-of-turn status damage (poison, burn)
      if (!session.isEnded && wildMon.currentHp > 0 && playerMon.currentHp > 0) {
        moveEffectHandler.applyEndOfTurnEffects(session, events);
      }

      session.turn++;
      return { events, battleEnded: session.isEnded, state: session.isEnded ? null : session.getPublicState() };
    }

      return { events, state: session.getPublicState() };
    } finally {
      session.isProcessingTurn = false;
    }
  }

  async _executePlayerAttack(session, move, events) {
    const attacker = session.playerPokemon;
    const defender = session.wildPokemon;

    // Check status conditions (sleep, freeze, paralysis, confusion, flinch)
    const canMove = moveEffectHandler.checkCanMove(attacker, 'player', events);
    if (!canMove) return;

    events.push({
      type: 'attack',
      attacker: 'player',
      attackerName: attacker.nickname || attacker.species.name,
      moveName: move.name,
      message: `${attacker.nickname || attacker.species.name} usou ${move.name}!`
    });

    const result = damageCalculator.calculateDamage(attacker, defender, move);

    if (!result.isHit) {
      events.push({ type: 'text', message: 'Mas errou o alvo!' });
      return;
    }

    if (result.isImmune) {
      events.push({ type: 'text', message: 'Não teve efeito...' });
      return;
    }

    if (result.damage > 0) {
      defender.currentHp = Math.max(0, defender.currentHp - result.damage);

      events.push({
        type: 'damage',
        target: 'wild',
        damage: result.damage,
        remainingHp: defender.currentHp,
        maxHp: defender.maxHp,
        isCritical: result.isCritical,
        effectiveness: result.effectiveness
      });

      if (result.isCritical) {
        events.push({ type: 'text', message: 'Um acerto crítico!' });
      }
      if (result.isSuperEffective) {
        events.push({ type: 'text', message: 'É super efetivo!' });
      } else if (result.isNotVeryEffective) {
        events.push({ type: 'text', message: 'Não foi muito efetivo...' });
      }
    }

    // Apply secondary and status effects
    moveEffectHandler.applyMoveEffects(move, attacker, defender, result.damage, 'player', events);

    // Check if wild Pokemon fainted
    if (defender.currentHp <= 0) {
      events.push({
        type: 'faint',
        target: 'wild',
        pokemonName: defender.name,
        message: `${defender.name} selvagem desmaiou!`
      });

      // 1. Calculate Base EXP Gained
      const baseExp = defender.species?.baseExp || 64;
      const baseExpGain = Math.max(6, Math.floor(((baseExp * defender.level) / 7) * 1.5));

      // 2. Player Rewards (Trainer EXP & Poké-dollars)
      let playerRewards = null;
      try {
        const playerExpGain = Math.max(10, Math.floor(defender.level * 18));
        const playerMoneyGain = Math.max(20, Math.floor(defender.level * 35));
        playerRewards = await playerProgressionService.addPlayerExpAndMoney(
          session.characterId,
          playerExpGain,
          playerMoneyGain
        );

        events.push({
          type: 'player_rewards',
          rewards: playerRewards,
          message: `Você ganhou ${playerRewards.moneyGained} Poké-dollars e ${playerRewards.expGained} XP de Treinador!`
        });

        if (playerRewards.leveledUp) {
          events.push({
            type: 'player_level_up',
            newLevel: playerRewards.newLevel,
            message: `Subiu de Rank! Você agora é um Treinador Nível ${playerRewards.newLevel}!`
          });
        }
      } catch (err) {
        console.error('[BattleManager] Erro ao conceder recompensas ao Treinador:', err);
      }

      // 3. Friendship bonus for the active combatant (+1)
      try {
        await friendshipManager.addFriendship(attacker.id, 1);
      } catch (err) {
        console.warn('[BattleManager] Erro ao adicionar amizade pós-vitória:', err);
      }

      // 4. Party EXP Distribution (100% active, 50% non-fainted team members)
      const partyMembers = Array.isArray(session.playerParty) && session.playerParty.length > 0
        ? session.playerParty
        : [attacker];

      const levelUpResults = [];
      const evolutionPrompts = [];

      for (const partyMon of partyMembers) {
        // Skip fainted Pokémon
        if (partyMon.currentHp <= 0) continue;

        const isAttacker = partyMon.id === attacker.id;
        const gainedExp = isAttacker ? baseExpGain : Math.max(3, Math.floor(baseExpGain * 0.5));

        events.push({
          type: 'exp_gain',
          pokemonId: partyMon.id,
          amount: gainedExp,
          isAttacker,
          message: isAttacker
            ? `${partyMon.nickname || partyMon.species?.name || partyMon.name} ganhou ${gainedExp} pontos de EXP!`
            : `${partyMon.nickname || partyMon.species?.name || partyMon.name} ganhou ${gainedExp} pontos de EXP compartilhada!`
        });

        try {
          const baseExp = Math.max(partyMon.exp || 0, Math.pow(partyMon.level, 3));
          const curExp = baseExp + gainedExp;
          partyMon.exp = curExp;
          await prisma.pokemon.update({ where: { id: partyMon.id }, data: { exp: curExp } });

          // Threshold check (medium fast: (level + 1)^3)
          let currentLevel = partyMon.level;
          let levelsGained = 0;
          while (currentLevel + levelsGained < 100 && curExp >= Math.pow(currentLevel + levelsGained + 1, 3)) {
            levelsGained++;
          }

          if (levelsGained > 0) {
            const levelUpResult = await pokemonProgressionService.levelUpPokemon({
              characterId: session.characterId,
              pokemonId: partyMon.id,
              levelsToAdd: levelsGained
            });

            // Sincronizar dados em memória da party e do Pokémon ativo
            partyMon.level = levelUpResult.newLevel;
            partyMon.maxHp = levelUpResult.pokemon.maxHp;
            partyMon.currentHp = Math.min(partyMon.currentHp + (levelUpResult.statsDiff?.hp || 0), partyMon.maxHp);
            if (session.playerPokemon && session.playerPokemon.id === partyMon.id) {
              session.playerPokemon.level = levelUpResult.newLevel;
              session.playerPokemon.maxHp = partyMon.maxHp;
              session.playerPokemon.currentHp = partyMon.currentHp;
              if (levelUpResult.pokemon.stats) {
                session.playerPokemon.stats = typeof levelUpResult.pokemon.stats === 'string'
                  ? JSON.parse(levelUpResult.pokemon.stats)
                  : levelUpResult.pokemon.stats;
              }
            }

            levelUpResults.push(levelUpResult);

            events.push({
              type: 'level_up',
              pokemon: levelUpResult.pokemon,
              newLevel: levelUpResult.newLevel,
              statsDiff: levelUpResult.statsDiff,
              message: `Parabéns! ${partyMon.nickname || partyMon.species?.name || partyMon.name} subiu para o Nível ${levelUpResult.newLevel}!`
            });

            if (levelUpResult.pendingPromptMove) {
              events.push({
                type: 'move_learn_prompt',
                promptData: levelUpResult.pendingPromptMove
              });
            }

            if (levelUpResult.evolutionEligibility) {
              evolutionPrompts.push({
                pokemonId: partyMon.id,
                pokemonName: partyMon.nickname || partyMon.species?.name || partyMon.name,
                ...levelUpResult.evolutionEligibility
              });

              events.push({
                type: 'evolution_eligible',
                pokemonId: partyMon.id,
                pokemonName: partyMon.nickname || partyMon.species?.name || partyMon.name,
                targetSpeciesId: levelUpResult.evolutionEligibility.targetSpeciesId,
                targetSpeciesName: levelUpResult.evolutionEligibility.targetSpeciesName,
                method: levelUpResult.evolutionEligibility.method,
                message: `O quê?! ${partyMon.nickname || partyMon.species?.name || partyMon.name} está prestes a evoluir!`
              });
            }
          }
        } catch (e) {
          console.error(`[BattleManager] Erro no level up pós-batalha para mon ${partyMon.id}:`, e);
        }
      }

      events.push({
        type: 'battle_end',
        reason: 'victory',
        levelUpResults,
        evolutionPrompts,
        playerRewards
      });
      session.isEnded = true;
      this.sessions.delete(session.characterId);
    }
  }

  async _executeWildAttack(session, events, optionalMove = null) {
    const attacker = session.wildPokemon;
    const defender = session.playerPokemon;

    const move = optionalMove || (attacker.moves.length > 0 ? attacker.moves[0] : moveRegistry.getFallbackMove('TACKLE'));

    // Check status conditions (sleep, freeze, paralysis, confusion, flinch)
    const canMove = moveEffectHandler.checkCanMove(attacker, 'wild', events);
    if (!canMove) return;

    events.push({
      type: 'attack',
      attacker: 'wild',
      attackerName: attacker.name,
      moveName: move.name,
      message: `${attacker.name} selvagem usou ${move.name}!`
    });

    const result = damageCalculator.calculateDamage(attacker, defender, move);

    if (!result.isHit) {
      events.push({ type: 'text', message: 'Mas errou o alvo!' });
      return;
    }

    if (result.isImmune) {
      events.push({ type: 'text', message: 'Não teve efeito...' });
      return;
    }

    if (result.damage > 0) {
      defender.currentHp = Math.max(0, defender.currentHp - result.damage);

      // Synchronize currentHp in session.playerParty
      const partyEntry = session.playerParty.find(p => p.id === defender.id);
      if (partyEntry) {
        partyEntry.currentHp = defender.currentHp;
      }

      // Persist HP to DB
      await prisma.pokemon.update({
        where: { id: defender.id },
        data: { currentHp: defender.currentHp }
      });

      events.push({
        type: 'damage',
        target: 'player',
        damage: result.damage,
        remainingHp: defender.currentHp,
        maxHp: defender.maxHp,
        isCritical: result.isCritical,
        effectiveness: result.effectiveness
      });

      if (result.isCritical) {
        events.push({ type: 'text', message: 'Um acerto crítico!' });
      }
      if (result.isSuperEffective) {
        events.push({ type: 'text', message: 'É super efetivo!' });
      }
    }

    // Apply secondary and status effects
    moveEffectHandler.applyMoveEffects(move, attacker, defender, result.damage, 'wild', events);

    // Check if player Pokemon fainted
    if (defender.currentHp <= 0) {
      events.push({
        type: 'faint',
        target: 'player',
        pokemonName: defender.nickname || defender.species.name,
        message: `${defender.nickname || defender.species.name} desmaiou!`
      });

      // Check remaining alive Pokemon in party
      const aliveIndex = session.playerParty.findIndex(p => p.id !== defender.id && p.currentHp > 0);
      if (aliveIndex !== -1) {
        events.push({
          type: 'force_switch',
          message: 'Escolha outro Pokémon para continuar a batalha!'
        });
      } else {
        events.push({
          type: 'blackout',
          message: 'Todos os seus Pokémon desmaiaram! Você correu para o Centro Pokémon.'
        });

        // Restore team on blackout (classic Pokémon Center heal)
        await prisma.pokemon.updateMany({
          where: { characterId: session.characterId, location: 'party' },
          data: { currentHp: 20 } // temporary revive
        });

        events.push({ type: 'battle_end', reason: 'blackout' });
        session.isEnded = true;
        this.sessions.delete(session.characterId);
      }
    }
  }
}

module.exports = new BattleManager();
