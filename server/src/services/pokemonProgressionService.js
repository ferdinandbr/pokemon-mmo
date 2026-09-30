const prisma = require('../database');
const moveRegistry = require('./moves/MoveRegistry');
const moveManager = require('./moves/MoveManager');
const pokemonService = require('./pokemonService');
const evolutionManager = require('./evolution/EvolutionManager');
const friendshipManager = require('./evolution/FriendshipManager');

class PokemonProgressionService {
  constructor() {
    // Map to store pending move learning requests awaiting user decision:
    // Key: `${characterId}:${pokemonId}` -> Value: { pokemonId, characterId, moveDef, timestamp }
    this.pendingMoveLearns = new Map();
  }

  /**
   * Generates a unique key for pending moves.
   */
  _getPendingKey(characterId, pokemonId) {
    return `${characterId}:${pokemonId}`;
  }

  /**
   * Sets a pending move learn for a player's Pokemon.
   */
  setPendingMove(characterId, pokemonId, moveDef) {
    const key = this._getPendingKey(characterId, pokemonId);
    this.pendingMoveLearns.set(key, {
      characterId,
      pokemonId,
      moveDef,
      timestamp: Date.now()
    });
  }

  /**
   * Retrieves active pending move learn.
   */
  getPendingMove(characterId, pokemonId) {
    const key = this._getPendingKey(characterId, pokemonId);
    return this.pendingMoveLearns.get(key) || null;
  }

  /**
   * Clears pending move learn.
   */
  clearPendingMove(characterId, pokemonId) {
    const key = this._getPendingKey(characterId, pokemonId);
    this.pendingMoveLearns.delete(key);
  }

  /**
   * Executes a level-up for a specific Pokemon:
   * 1. Increases level.
   * 2. Recalculates stats using base stats, IVs, EVs and Gen 3 formulas.
   * 3. Increases HP proportionally.
   * 4. Checks learnset for new moves (auto-learns if < 4, queues prompt if == 4).
   * 5. Checks evolution criteria.
   * 6. Persists updates to the database.
   * 
   * @param {Object} params
   * @param {number} params.characterId
   * @param {number} params.pokemonId
   * @param {number} [params.levelsToAdd=1]
   * @returns {Promise<Object>} Result summary with updated Pokemon, moves learned, and prompt if applicable.
   */
  async levelUpPokemon({ characterId, pokemonId, levelsToAdd = 1 }) {
    await moveRegistry.ensureLoaded();

    const pokemon = await prisma.pokemon.findFirst({
      where: { id: pokemonId, characterId },
      include: { species: true }
    });

    if (!pokemon) {
      throw new Error('Pokémon não encontrado para este personagem.');
    }

    const oldLevel = pokemon.level;
    const newLevel = Math.min(100, oldLevel + Math.max(1, levelsToAdd));

    if (oldLevel >= 100) {
      throw new Error(`${pokemon.nickname || pokemon.species.name} já está no nível máximo (100)!`);
    }

    const species = pokemon.species;

    // 1. Recalculate stats
    const baseStats = {
      hp: species.baseHp,
      atk: species.baseAttack,
      def: species.baseDefense,
      spAtk: species.baseSpAtk,
      spDef: species.baseSpDef,
      speed: species.baseSpeed
    };

    const ivs = {
      hp: pokemon.ivHp,
      atk: pokemon.ivAtk,
      def: pokemon.ivDef,
      spAtk: pokemon.ivSpAtk,
      spDef: pokemon.ivSpDef,
      speed: pokemon.ivSpeed
    };

    const evs = {
      hp: pokemon.evHp,
      atk: pokemon.evAtk,
      def: pokemon.evDef,
      spAtk: pokemon.evSpAtk,
      spDef: pokemon.evSpDef,
      speed: pokemon.evSpeed
    };

    let oldCalculatedStats = {};
    try {
      oldCalculatedStats = typeof pokemon.stats === 'string' ? JSON.parse(pokemon.stats || '{}') : (pokemon.stats || {});
    } catch (e) {
      oldCalculatedStats = pokemonService.calculateStats(baseStats, ivs, evs, oldLevel);
    }

    const newCalculatedStats = pokemonService.calculateStats(baseStats, ivs, evs, newLevel);
    const hpGain = Math.max(0, newCalculatedStats.hp - (pokemon.maxHp || oldCalculatedStats.hp || 20));
    const newMaxHp = newCalculatedStats.hp;
    const newCurrentHp = Math.min(newMaxHp, (pokemon.currentHp || newMaxHp) + hpGain);

    const statsDiff = {
      hp: newCalculatedStats.hp - (oldCalculatedStats.hp || 0),
      attack: newCalculatedStats.attack - (oldCalculatedStats.attack || 0),
      defense: newCalculatedStats.defense - (oldCalculatedStats.defense || 0),
      spAtk: newCalculatedStats.spAtk - (oldCalculatedStats.spAtk || 0),
      spDef: newCalculatedStats.spDef - (oldCalculatedStats.spDef || 0),
      speed: newCalculatedStats.speed - (oldCalculatedStats.speed || 0)
    };

    // 2. Process Learnset across the gained levels
    let currentMoves = moveManager.parseMoves(pokemon.moves);
    const autoLearnedMoves = [];
    let pendingPromptMove = null;

    for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
      const learnableAtLvl = moveManager.getLearnableMovesForLevel(species, lvl);

      for (const moveDef of learnableAtLvl) {
        // If already known, do not duplicate
        if (moveManager.hasMove(currentMoves, moveDef.internalName)) {
          continue;
        }

        // If has space (< 4 moves), learn directly
        if (moveManager.canLearnDirectly(currentMoves)) {
          currentMoves = moveManager.teachMove(currentMoves, moveDef);
          autoLearnedMoves.push(moveRegistry.inflatePokemonMove(moveDef));
        } else {
          // Already has 4 moves: queue prompt for user choice
          if (!pendingPromptMove) {
            pendingPromptMove = moveRegistry.inflatePokemonMove(moveDef);
            this.setPendingMove(characterId, pokemon.id, moveDef);
          }
        }
      }
    }

    // 3. Update Pokemon in Database
    const updatedPokemon = await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: {
        level: newLevel,
        exp: Math.max(pokemon.exp || 0, Math.pow(newLevel, 3)),
        currentHp: newCurrentHp,
        maxHp: newMaxHp,
        stats: JSON.stringify(newCalculatedStats),
        moves: JSON.stringify(currentMoves)
      },
      include: { species: true }
    });

    // Friendship increase on level up (+4 points)
    await friendshipManager.addFriendship(pokemon.id, 4);

    // 4. Check Evolution eligibility (Level, Happiness, Day/Night)
    let evolutionEligibility = null;
    try {
      const evoCheck = await evolutionManager.checkEvolutionEligibility(updatedPokemon, { trigger: 'level' });
      if (evoCheck && evoCheck.canEvolve) {
        evolutionEligibility = {
          targetSpeciesId: evoCheck.targetSpecies.id,
          targetSpeciesName: evoCheck.targetSpecies.name,
          currentSpeciesName: evoCheck.currentSpecies.name,
          method: evoCheck.method
        };
      }
    } catch (e) {
      console.warn('[PokemonProgression] Erro ao verificar evolução:', e);
    }

    const formattedPokemon = pokemonService.formatPokemonForClient(updatedPokemon);

    return {
      success: true,
      pokemon: formattedPokemon,
      oldLevel,
      newLevel,
      statsDiff,
      newStats: newCalculatedStats,
      autoLearnedMoves,
      pendingPromptMove: pendingPromptMove ? {
        pokemonId: pokemon.id,
        pokemonName: pokemon.nickname || pokemon.species.name,
        newMove: pendingPromptMove,
        currentMoves: formattedPokemon.moves
      } : null,
      evolutionEligibility
    };
  }

  /**
   * Confirms replacement of an old move with a pending new move.
   */
  async confirmMoveReplacement({ characterId, pokemonId, slotIndexToReplace, newMoveId }) {
    await moveRegistry.ensureLoaded();

    const pending = this.getPendingMove(characterId, pokemonId);
    if (!pending) {
      throw new Error('Nenhum aprendizado de golpe pendente para este Pokémon.');
    }

    if (newMoveId && pending.moveDef.id !== Number(newMoveId)) {
      throw new Error('O golpe solicitado para aprender não corresponde ao golpe pendente.');
    }

    const pokemon = await prisma.pokemon.findFirst({
      where: { id: pokemonId, characterId },
      include: { species: true }
    });

    if (!pokemon) {
      throw new Error('Pokémon não encontrado.');
    }

    let currentMoves = moveManager.parseMoves(pokemon.moves);

    // Replace move
    const oldMoveInstance = currentMoves[slotIndexToReplace];
    const oldMoveInflated = oldMoveInstance ? moveRegistry.inflatePokemonMove(oldMoveInstance) : null;

    currentMoves = moveManager.replaceMove(currentMoves, slotIndexToReplace, pending.moveDef);

    // Save to DB
    const updatedPokemon = await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: {
        moves: JSON.stringify(currentMoves)
      },
      include: { species: true }
    });

    // Clear pending state
    this.clearPendingMove(characterId, pokemonId);

    const formattedPokemon = pokemonService.formatPokemonForClient(updatedPokemon);
    const newMoveInflated = moveRegistry.inflatePokemonMove(pending.moveDef);

    return {
      success: true,
      pokemon: formattedPokemon,
      oldMove: oldMoveInflated,
      newMove: newMoveInflated
    };
  }

  /**
   * Cancels learning a pending move (player chooses not to learn).
   */
  cancelMoveLearning({ characterId, pokemonId, newMoveId }) {
    const pending = this.getPendingMove(characterId, pokemonId);
    if (pending) {
      this.clearPendingMove(characterId, pokemonId);
      return { success: true, cancelledMoveId: pending.moveDef.id, moveName: pending.moveDef.name };
    }
    return { success: true };
  }
}

module.exports = new PokemonProgressionService();
