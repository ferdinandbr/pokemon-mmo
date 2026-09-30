const prisma = require('../database');
const moveRegistry = require('./moves/MoveRegistry');
const moveManager = require('./moves/MoveManager');

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
   * Formats a Pokemon object for client consumption, inflating moves definitions from MoveRegistry.
   */
  formatPokemonForClient(pkmn) {
    if (!pkmn) return null;
    const copy = { ...pkmn };
    copy.friendship = pkmn.friendship !== undefined && pkmn.friendship !== null ? pkmn.friendship : 70;
    copy.moves = moveRegistry.inflateMovesList(pkmn.moves);
    return copy;
  }

  /**
   * Selects up to 4 moves from learnset up to specified level using MoveManager.
   */
  async selectMovesForLevel(species, level) {
    await moveRegistry.ensureLoaded();
    return moveManager.selectMovesForInitialLevel(species, level);
  }

  /**
   * Spawns / Creates a Pokemon for a Character
   */
  async createPokemon({
    characterId,
    speciesIdOrName,
    level = 5,
    isShiny = null,
    forceBuddy = true,
    targetLocation = null,
    caughtLocation = null,
    caughtLevel = null,
    caughtBall = 'poke-ball',
    originalTrainerId = null,
    originalTrainerName = null,
    obtainedMethod = 'capture'
  }) {
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

    // Automatically resolve Original Trainer (OT) and Location if not provided
    let otId = originalTrainerId;
    let otName = originalTrainerName;
    let loc = caughtLocation;

    if (!otId || !otName || !loc) {
      const char = await prisma.character.findUnique({
        where: { id: characterId },
        select: { id: true, name: true, roomId: true }
      });
      if (char) {
        if (!otId) otId = char.id;
        if (!otName) otName = char.name;
        if (!loc) {
          try {
            const roomManager = require('../rooms/roomManager');
            loc = roomManager.ROOM_DEFINITIONS?.[char.roomId]?.name || 'Rota 1';
          } catch (e) {
            loc = 'Rota 1';
          }
        }
      }
    }

    // Create DB instance with permanent provenance / birth certificate
    const newPokemon = await prisma.pokemon.create({
      data: {
        characterId,
        speciesId: species.id,
        nickname: null,
        level,
        exp: Math.pow(level, 3),
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
        isBuddy: shouldBeBuddy,
        caughtLocation: loc || 'Rota 1',
        caughtAt: new Date(),
        caughtLevel: caughtLevel !== null && caughtLevel !== undefined ? caughtLevel : level,
        caughtBall: caughtBall || 'poke-ball',
        originalTrainerId: otId || characterId,
        originalTrainerName: otName || 'Treinador',
        obtainedMethod: obtainedMethod || 'capture'
      },
      include: { species: true }
    });

    if (shouldBeBuddy) {
      await this.updateCharacterEquipmentBuddy(characterId, newPokemon);
    }

    return this.formatPokemonForClient(newPokemon);
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
    return this.formatPokemonForClient(updated);
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
      const variant = pokemonInstance.isShiny ? 'shiny' : 'normal';
      equip.buddy = {
        id: pokemonInstance.id,
        speciesId: pokemonInstance.speciesId,
        name: pokemonInstance.nickname || pokemonInstance.species.name,
        level: pokemonInstance.level,
        isShiny: pokemonInstance.isShiny,
        icon: `/assets/pokemon/overworld/${variant}/${formattedId}.png`,
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
    await moveRegistry.ensureLoaded();

    const party = await prisma.pokemon.findMany({
      where: { characterId, location: 'party' },
      orderBy: { partySlot: 'asc' },
      include: { species: true }
    });

    // Auto-normalize any Pokemon whose exp is below baseline (level^3)
    for (const p of party) {
      const minExp = Math.pow(p.level, 3);
      if ((p.exp || 0) < minExp) {
        p.exp = minExp;
        await prisma.pokemon.update({
          where: { id: p.id },
          data: { exp: minExp }
        }).catch(() => {});
      }
    }

    const storage = await prisma.pokemon.findMany({
      where: { characterId, location: 'storage' },
      orderBy: [{ boxNumber: 'asc' }, { boxSlot: 'asc' }],
      include: { species: true }
    });

    for (const p of storage) {
      const minExp = Math.pow(p.level, 3);
      if ((p.exp || 0) < minExp) {
        p.exp = minExp;
        await prisma.pokemon.update({
          where: { id: p.id },
          data: { exp: minExp }
        }).catch(() => {});
      }
    }

    const activeBuddy = await prisma.pokemon.findFirst({
      where: { characterId, isBuddy: true },
      include: { species: true }
    });

    return {
      party: party.map(p => this.formatPokemonForClient(p)),
      storage: storage.map(p => this.formatPokemonForClient(p)),
      activeBuddy: this.formatPokemonForClient(activeBuddy)
    };
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
  }

  /**
   * Transfers a Pokemon from one character to another (Trade, Auction purchase, Transfer)
   * CRITICAL ANTI-FRAUD RULE:
   * The original birth certificate (originalTrainerId, originalTrainerName, caughtAt, caughtLocation, caughtLevel, caughtBall)
   * remains permanently intact and immutable.
   */
  async transferPokemon({ pokemonId, fromCharacterId, toCharacterId, method = 'trade' }) {
    const pkmn = await prisma.pokemon.findFirst({
      where: { id: pokemonId, characterId: fromCharacterId },
      include: { species: true }
    });

    if (!pkmn) {
      throw new Error('Pokémon não encontrado ou não pertence ao treinador de origem.');
    }

    // If was buddy of previous owner, clear buddy from equipment
    if (pkmn.isBuddy) {
      await this.updateCharacterEquipmentBuddy(fromCharacterId, null);
    }

    // Determine target location in receiver's party or storage
    const targetParty = await prisma.pokemon.findMany({
      where: { characterId: toCharacterId, location: 'party' },
      orderBy: { partySlot: 'asc' }
    });

    let targetLocation = 'party';
    let targetSlot = targetParty.length;
    let targetBox = 1;

    if (targetParty.length >= 6) {
      targetLocation = 'storage';
      targetSlot = null;
      const storageCount = await prisma.pokemon.count({
        where: { characterId: toCharacterId, location: 'storage' }
      });
      targetBox = Math.floor(storageCount / 30) + 1;
      targetSlot = storageCount % 30;
    }

    // Update Pokemon ownership (Preserving original birth certificate fields!)
    const updated = await prisma.pokemon.update({
      where: { id: pokemonId },
      data: {
        characterId: toCharacterId,
        location: targetLocation,
        partySlot: targetLocation === 'party' ? targetSlot : null,
        boxNumber: targetLocation === 'storage' ? targetBox : 1,
        boxSlot: targetLocation === 'storage' ? targetSlot : 0,
        isBuddy: false
        // Notice: originalTrainerId, originalTrainerName, caughtAt, caughtLocation NEVER change!
      },
      include: { species: true }
    });

    return this.formatPokemonForClient(updated);
  }

  /**
   * Verified Capture Counter for Events (100% Anti-Fraud):
   * Only counts Pokémon where:
   * 1. originalTrainerId === characterId (Player must have caught it personally, not bought or received in trade)
   * 2. obtainedMethod === 'capture' (Must be wild capture, not starter, egg, auction, or gift)
   * 3. caughtAt is within the event time window
   * 4. Optional: caughtLocation matches the event route/map
   */
  async countEventCaptures({ characterId, startDate, endDate, location = null }) {
    const whereClause = {
      originalTrainerId: Number(characterId),
      obtainedMethod: 'capture',
      caughtAt: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    if (location) {
      whereClause.caughtLocation = {
        equals: location,
        mode: 'insensitive'
      };
    }

    return await prisma.pokemon.count({
      where: whereClause
    });
  }
}

module.exports = new PokemonService();
