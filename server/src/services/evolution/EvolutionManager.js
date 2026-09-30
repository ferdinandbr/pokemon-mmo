const prisma = require('../../database');
const pokemonService = require('../pokemonService');
const moveRegistry = require('../moves/MoveRegistry');
const moveManager = require('../moves/MoveManager');

class EvolutionManager {
  /**
   * Avalia se um Pokémon atende aos critérios para evoluir.
   * @param {Object} pokemon Instância do Pokémon com include: { species: true }
   * @param {Object} context { trigger: 'level'|'item'|'trade', itemInternalName?: string, hourOfDay?: number }
   * @returns {Promise<Object>} Resultado da elegibilidade { canEvolve, targetSpecies, method }
   */
  async checkEvolutionEligibility(pokemon, context = {}) {
    if (!pokemon || !pokemon.species) {
      return { canEvolve: false };
    }

    const { trigger = 'level', itemInternalName = null, hourOfDay = new Date().getHours() } = context;
    const species = pokemon.species;
    const friendship = pokemon.friendship ?? 70;

    let evolutions = [];
    try {
      evolutions = typeof species.evolutions === 'string' ? JSON.parse(species.evolutions || '[]') : (species.evolutions || []);
    } catch (e) {
      console.warn(`[EvolutionManager] Erro ao ler evolutions de ${species.name}:`, e);
      return { canEvolve: false };
    }

    if (!Array.isArray(evolutions) || evolutions.length === 0) {
      return { canEvolve: false };
    }

    for (const evo of evolutions) {
      const method = (evo.method || '').toLowerCase();
      const param = (evo.parameter || '').toUpperCase();
      let matched = false;

      // 1. Evolução por Nível
      if (trigger === 'level' && method === 'level') {
        const reqLevel = parseInt(param) || 0;
        if (pokemon.level >= reqLevel) {
          matched = true;
        }
      }

      // 2. Evolução por Amizade (Happiness)
      else if (trigger === 'level' && method === 'happiness') {
        if (friendship >= 220) {
          matched = true;
        }
      }

      // 3. Evolução por Amizade durante o Dia
      else if (trigger === 'level' && method === 'happinessday') {
        const isDay = hourOfDay >= 6 && hourOfDay < 18;
        if (friendship >= 220 && isDay) {
          matched = true;
        }
      }

      // 4. Evolução por Amizade durante a Noite
      else if (trigger === 'level' && method === 'happinessnight') {
        const isNight = hourOfDay >= 18 || hourOfDay < 6;
        if (friendship >= 220 && isNight) {
          matched = true;
        }
      }

      // 5. Evolução por Pedra / Item
      else if (trigger === 'item' && method === 'item') {
        if (itemInternalName && param === itemInternalName.toUpperCase()) {
          matched = true;
        }
      }

      // 6. Evolução por Troca ou Link Cable
      else if ((trigger === 'trade' && method === 'trade') || (trigger === 'item' && method === 'trade' && itemInternalName === 'LINKCABLE')) {
        matched = true;
      }

      if (matched && (evo.targetInternalName || evo.targetSpeciesId || evo.targetSpeciesName)) {
        // Buscar a espécie alvo no banco de dados
        let targetSpecies = null;
        if (evo.targetSpeciesId) {
          targetSpecies = await prisma.pokemonSpecies.findUnique({
            where: { id: Number(evo.targetSpeciesId) }
          });
        }
        if (!targetSpecies && evo.targetInternalName) {
          targetSpecies = await prisma.pokemonSpecies.findFirst({
            where: {
              OR: [
                { internalName: evo.targetInternalName.toUpperCase() },
                { name: { equals: evo.targetInternalName, mode: 'insensitive' } }
              ]
            }
          });
        }
        if (!targetSpecies && evo.targetSpeciesName) {
          targetSpecies = await prisma.pokemonSpecies.findFirst({
            where: {
              name: { equals: evo.targetSpeciesName, mode: 'insensitive' }
            }
          });
        }

        if (targetSpecies) {
          return {
            canEvolve: true,
            currentSpecies: species,
            targetSpecies,
            method: evo.method,
            parameter: evo.parameter
          };
        }
      }
    }

    return { canEvolve: false };
  }

  /**
   * Executa a evolução do Pokémon, persistindo a nova espécie, recalculando stats e registrando na Pokedex.
   * @param {Object} params
   * @param {number} params.characterId
   * @param {number} params.pokemonId
   * @param {number} params.targetSpeciesId
   */
  async executeEvolution({ characterId, pokemonId, targetSpeciesId }) {
    await moveRegistry.ensureLoaded();

    const pokemon = await prisma.pokemon.findFirst({
      where: { id: pokemonId, characterId },
      include: { species: true }
    });

    if (!pokemon) {
      throw new Error('Pokémon não encontrado para este personagem.');
    }

    const targetSpecies = await prisma.pokemonSpecies.findUnique({
      where: { id: targetSpeciesId }
    });

    if (!targetSpecies) {
      throw new Error('Espécie evoluída não encontrada no banco de dados.');
    }

    const oldSpeciesName = pokemon.species.name;
    const oldLevel = pokemon.level;

    // 1. Recalcular atributos com base nos BaseStats da nova espécie
    const baseStats = {
      hp: targetSpecies.baseHp,
      atk: targetSpecies.baseAttack,
      def: targetSpecies.baseDefense,
      spAtk: targetSpecies.baseSpAtk,
      spDef: targetSpecies.baseSpDef,
      speed: targetSpecies.baseSpeed
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

    const newCalculatedStats = pokemonService.calculateStats(baseStats, ivs, evs, oldLevel);
    const hpGain = Math.max(0, newCalculatedStats.hp - pokemon.maxHp);
    const newMaxHp = newCalculatedStats.hp;
    const newCurrentHp = Math.min(newMaxHp, pokemon.currentHp + hpGain);

    // 2. Verificar novos golpes que a nova espécie aprende no nível atual
    let currentMoves = moveManager.parseMoves(pokemon.moves);
    const movesLearned = [];

    const evoMoves = moveManager.getLearnableMovesForLevel(targetSpecies, oldLevel);
    for (const moveDef of evoMoves) {
      if (!moveManager.hasMove(currentMoves, moveDef.internalName)) {
        if (moveManager.canLearnDirectly(currentMoves)) {
          currentMoves = moveManager.teachMove(currentMoves, moveDef);
          movesLearned.push(moveRegistry.inflatePokemonMove(moveDef));
        }
      }
    }

    // 3. Atualizar o Pokémon no banco de dados
    const updatedPokemon = await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: {
        speciesId: targetSpecies.id,
        currentHp: newCurrentHp,
        maxHp: newMaxHp,
        stats: JSON.stringify(newCalculatedStats),
        moves: JSON.stringify(currentMoves)
      },
      include: { species: true }
    });

    // 4. Registrar a espécie evoluída na Pokedex como 'caught'
    try {
      await prisma.pokedexEntry.upsert({
        where: {
          characterId_pokemonNumber: {
            characterId,
            pokemonNumber: targetSpecies.id
          }
        },
        update: {
          status: 'caught',
          caughtAt: new Date()
        },
        create: {
          characterId,
          pokemonNumber: targetSpecies.id,
          pokemonName: targetSpecies.name,
          status: 'caught',
          caughtAt: new Date()
        }
      });
    } catch (err) {
      console.warn('[EvolutionManager] Erro ao atualizar Pokedex na evolução:', err.message);
    }

    const formattedPokemon = pokemonService.formatPokemonForClient(updatedPokemon);

    return {
      success: true,
      pokemon: formattedPokemon,
      oldSpeciesName,
      newSpeciesName: targetSpecies.name,
      movesLearned,
      newStats: newCalculatedStats
    };
  }
}

module.exports = new EvolutionManager();
