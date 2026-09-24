const prisma = require('../database');

class PokemonService {
  /**
   * Gen 3-8 Stats Formula
   */
  calculateStats(baseStats, ivs, evs, level) {
    const calcHp = (base, iv, ev, lvl) => {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * lvl) / 100) + lvl + 10;
    };

    const calcOther = (base, iv, ev, lvl) => {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * lvl) / 100) + 5;
    };

    const hp = calcHp(baseStats.hp, ivs.hp, evs.hp, level);
    const attack = calcOther(baseStats.atk, ivs.atk, evs.atk, level);
    const defense = calcOther(baseStats.def, ivs.def, evs.def, level);
    const spAtk = calcOther(baseStats.spAtk, ivs.spAtk, evs.spAtk, level);
    const spDef = calcOther(baseStats.spDef, ivs.spDef, evs.spDef, level);
    const speed = calcOther(baseStats.speed, ivs.speed, evs.speed, level);

    return { hp, attack, defense, spAtk, spDef, speed };
  }

  generateRandomIVs() {
    return {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      speed: Math.floor(Math.random() * 32)
    };
  }

  /**
   * Helper to check shiny odds (default 1/4096)
   */
  isShinyRoll() {
    return Math.floor(Math.random() * 4096) === 0;
  }

  /**
   * Resolves species by ID or Name/InternalName
   */
  async resolveSpecies(speciesIdOrName) {
    if (typeof speciesIdOrName === 'number' || !isNaN(parseInt(speciesIdOrName))) {
      const id = parseInt(speciesIdOrName);
      return await prisma.pokemonSpecies.findUnique({ where: { id } });
    }

    const cleanName = String(speciesIdOrName).trim().toUpperCase();
    let species = await prisma.pokemonSpecies.findFirst({
      where: { internalName: cleanName }
    });

    if (!species) {
      species = await prisma.pokemonSpecies.findFirst({
        where: { name: { equals: cleanName } }
      });
    }

    return species;
  }

  /**
   * Selects up to 4 moves from learnset up to specified level
   */
  async selectMovesForLevel(species, level) {
    let learnset = [];
    try {
      learnset = JSON.parse(species.moves || '[]');
    } catch (e) {
      learnset = [];
    }

    const eligibleMoves = learnset
      .filter(m => m.level <= level)
      .slice(-4); // Take up to 4 most recent moves

    const activeMoves = [];
    for (const item of eligibleMoves) {
      const moveData = await prisma.moveData.findUnique({
        where: { internalName: item.moveInternalName }
      });

      if (moveData) {
        activeMoves.push({
          id: moveData.id,
          name: moveData.name,
          internalName: moveData.internalName,
          type: moveData.type,
          category: moveData.category,
          power: moveData.power,
          accuracy: moveData.accuracy,
          pp: moveData.pp,
          maxPp: moveData.pp
        });
      } else {
        activeMoves.push({
          id: 0,
          name: item.moveInternalName,
          internalName: item.moveInternalName,
          type: 'NORMAL',
          category: 'Physical',
          power: 40,
          accuracy: 100,
          pp: 35,
          maxPp: 35
        });
      }
    }

    if (activeMoves.length === 0) {
      activeMoves.push({
        id: 1,
        name: 'Tackle',
        internalName: 'TACKLE',
        type: 'NORMAL',
        category: 'Physical',
        power: 40,
        accuracy: 100,
        pp: 35,
        maxPp: 35
      });
    }

    return activeMoves;
  }

  /**
   * Spawns / Creates a Pokemon for a Character
   */
  async createPokemon({ characterId, speciesIdOrName, level = 5, isShiny = null, forceBuddy = true, targetLocation = null }) {
    const species = await this.resolveSpecies(speciesIdOrName);
    if (!species) {
      throw new Error(`Espécie de Pokémon "${speciesIdOrName}" não encontrada.`);
    }

    const ivs = this.generateRandomIVs();
    const evs = { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 };
    const shiny = isShiny !== null ? Boolean(isShiny) : this.isShinyRoll();

    const baseStats = {
      hp: species.baseHp,
      atk: species.baseAttack,
      def: species.baseDefense,
      spAtk: species.baseSpAtk,
      spDef: species.baseSpDef,
      speed: species.baseSpeed
    };

    const calculatedStats = this.calculateStats(baseStats, ivs, evs, level);
    const activeMoves = await this.selectMovesForLevel(species, level);

    // Gender roll
    let gender = 'M';
    if (species.genderRate === 'AlwaysFemale') gender = 'F';
    else if (species.genderRate === 'Genderless') gender = 'G';
    else if (species.genderRate === 'FemaleOneEighth') gender = Math.random() < 0.125 ? 'F' : 'M';
    else if (species.genderRate === 'Female50Percent') gender = Math.random() < 0.5 ? 'F' : 'M';

    // Determine party vs storage placement
    const currentParty = await prisma.pokemon.findMany({
      where: { characterId, location: 'party' },
      orderBy: { partySlot: 'asc' }
    });

    let location = 'party';
    let partySlot = currentParty.length; // 0 to 5
    let boxNumber = 1;
    let boxSlot = 0;

    if (targetLocation === 'storage' || currentParty.length >= 6) {
      location = 'storage';
      partySlot = null;

      // Find first empty slot in storage
      const storageCount = await prisma.pokemon.count({
        where: { characterId, location: 'storage' }
      });
      boxNumber = Math.floor(storageCount / 30) + 1;
      boxSlot = storageCount % 30;
    }

    // Check if character already has a buddy
    const existingBuddy = await prisma.pokemon.findFirst({
      where: { characterId, isBuddy: true }
    });

    const shouldBeBuddy = forceBuddy || !existingBuddy;

    if (shouldBeBuddy) {
      // Clear old buddy flag
      await prisma.pokemon.updateMany({
        where: { characterId, isBuddy: true },
        data: { isBuddy: false }
      });
    }

    // Create DB instance
    const newPokemon = await prisma.pokemon.create({
      data: {
        characterId,
        speciesId: species.id,
        nickname: null,
        level,
        exp: 0,
        gender,
        isShiny: shiny,
        currentHp: calculatedStats.hp,
        maxHp: calculatedStats.hp,
        ivHp: ivs.hp,
        ivAtk: ivs.atk,
        ivDef: ivs.def,
        ivSpAtk: ivs.spAtk,
        ivSpDef: ivs.spDef,
        ivSpeed: ivs.speed,
        evHp: evs.hp,
        evAtk: evs.atk,
        evDef: evs.def,
        evSpAtk: evs.spAtk,
        evSpDef: evs.spDef,
        evSpeed: evs.speed,
        stats: JSON.stringify(calculatedStats),
        moves: JSON.stringify(activeMoves),
        location,
        partySlot,
        boxNumber,
        boxSlot,
        isBuddy: shouldBeBuddy
      },
      include: { species: true }
    });

    if (shouldBeBuddy) {
      await this.updateCharacterEquipmentBuddy(characterId, newPokemon);
    }

    return newPokemon;
  }

  /**
   * Sets active buddy Pokemon for character
   */
  async setBuddy(characterId, pokemonId) {
    const target = await prisma.pokemon.findFirst({
      where: { id: pokemonId, characterId },
      include: { species: true }
    });

    if (!target) {
      throw new Error('Pokémon não encontrado no inventário/armazenamento.');
    }

    // Clear old buddy
    await prisma.pokemon.updateMany({
      where: { characterId, isBuddy: true },
      data: { isBuddy: false }
    });

    // Set new buddy
    const updated = await prisma.pokemon.update({
      where: { id: pokemonId },
      data: { isBuddy: true },
      include: { species: true }
    });

    await this.updateCharacterEquipmentBuddy(characterId, updated);
    return updated;
  }

  /**
   * Updates Character.equipment JSON field to reflect active buddy
   */
  async updateCharacterEquipmentBuddy(characterId, pokemonInstance) {
    const character = await prisma.character.findUnique({ where: { id: characterId } });
    if (!character) return;

    let equip = {};
    try {
      equip = typeof character.equipment === 'string' ? JSON.parse(character.equipment || '{}') : (character.equipment || {});
    } catch (e) {
      equip = {};
    }

    if (pokemonInstance) {
      const formattedId = String(pokemonInstance.speciesId).padStart(3, '0');
      equip.buddy = {
        id: pokemonInstance.id,
        speciesId: pokemonInstance.speciesId,
        name: pokemonInstance.nickname || pokemonInstance.species.name,
        level: pokemonInstance.level,
        isShiny: pokemonInstance.isShiny,
        icon: `/assets/pokemon/overworld/${formattedId}.png`,
        sprite: `${formattedId}.png`
      };
    } else {
      equip.buddy = null;
    }

    await prisma.character.update({
      where: { id: characterId },
      data: { equipment: JSON.stringify(equip) }
    });
  }

  /**
   * Gets character's active party, storage boxes, and active buddy
   */
  async getCharacterPokemonData(characterId) {
    const party = await prisma.pokemon.findMany({
      where: { characterId, location: 'party' },
      orderBy: { partySlot: 'asc' },
      include: { species: true }
    });

    const storage = await prisma.pokemon.findMany({
      where: { characterId, location: 'storage' },
      orderBy: [{ boxNumber: 'asc' }, { boxSlot: 'asc' }],
      include: { species: true }
    });

    const activeBuddy = await prisma.pokemon.findFirst({
      where: { characterId, isBuddy: true },
      include: { species: true }
    });

    return { party, storage, activeBuddy };
  }

  /**
   * Swap or move Pokemon between party & storage slots
   */
  async movePokemonSlot(characterId, pokemonId, targetLocation, targetSlot, targetBox = 1) {
    const pkmn = await prisma.pokemon.findFirst({
      where: { id: pokemonId, characterId }
    });

    if (!pkmn) throw new Error('Pokémon não encontrado.');

    if (targetLocation === 'party') {
      // Check if another Pokemon is at this party slot
      const existingAtSlot = await prisma.pokemon.findFirst({
        where: { characterId, location: 'party', partySlot: targetSlot }
      });

      if (existingAtSlot && existingAtSlot.id !== pokemonId) {
        // Swap locations
        await prisma.pokemon.update({
          where: { id: existingAtSlot.id },
          data: {
            location: pkmn.location,
            partySlot: pkmn.partySlot,
            boxNumber: pkmn.boxNumber,
            boxSlot: pkmn.boxSlot
          }
        });
      }

      await prisma.pokemon.update({
        where: { id: pokemonId },
        data: {
          location: 'party',
          partySlot: targetSlot,
          boxNumber: 1,
          boxSlot: 0
        }
      });
    } else if (targetLocation === 'storage') {
      const existingAtSlot = await prisma.pokemon.findFirst({
        where: { characterId, location: 'storage', boxNumber: targetBox, boxSlot: targetSlot }
      });

      if (existingAtSlot && existingAtSlot.id !== pokemonId) {
        await prisma.pokemon.update({
          where: { id: existingAtSlot.id },
          data: {
            location: pkmn.location,
            partySlot: pkmn.partySlot,
            boxNumber: pkmn.boxNumber,
            boxSlot: pkmn.boxSlot
          }
        });
      }

      await prisma.pokemon.update({
        where: { id: pokemonId },
        data: {
          location: 'storage',
          partySlot: null,
          boxNumber: targetBox,
          boxSlot: targetSlot
        }
      });
    }

    return await this.getCharacterPokemonData(characterId);
  }
}

module.exports = new PokemonService();
