const { MAX_MOVES_PER_POKEMON, calculateMaxPp } = require('./MoveConstants');
const moveRegistry = require('./MoveRegistry');

class MoveManager {
  /**
   * Safely parses moves list from JSON string or Array.
   * @param {string|Array} moves
   * @returns {Array<Object>}
   */
  parseMoves(moves) {
    if (!moves) return [];
    if (Array.isArray(moves)) return [...moves];
    try {
      return JSON.parse(moves || '[]');
    } catch (e) {
      console.warn('[MoveManager] Falha ao fazer parse de moves:', e);
      return [];
    }
  }

  /**
   * Checks if a Pokémon already knows a move (by ID or internalName).
   * @param {Array<Object>|string} currentMoves
   * @param {number|string} moveIdentifier
   * @returns {boolean}
   */
  hasMove(currentMoves, moveIdentifier) {
    const list = this.parseMoves(currentMoves);
    if (!moveIdentifier) return false;

    const idNum = Number(moveIdentifier);
    const isNum = !isNaN(idNum);
    const nameStr = String(moveIdentifier).trim().toUpperCase();

    return list.some(m => {
      if (isNum && (m.moveId === idNum || m.id === idNum)) return true;
      if (m.internalName && m.internalName.toUpperCase() === nameStr) return true;
      return false;
    });
  }

  /**
   * Checks if a Pokémon has space to learn a move directly (< 4 moves).
   * @param {Array<Object>|string} currentMoves
   * @returns {boolean}
   */
  canLearnDirectly(currentMoves) {
    const list = this.parseMoves(currentMoves);
    return list.length < MAX_MOVES_PER_POKEMON;
  }

  /**
   * Creates a new PokemonMove instance ready to be stored in the database.
   * @param {Object} moveDef
   * @param {number} [ppUps=0]
   * @returns {Object}
   */
  createInstance(moveDef, ppUps = 0) {
    const maxPp = calculateMaxPp(moveDef.pp, ppUps);
    return {
      moveId: moveDef.id,
      internalName: moveDef.internalName.toUpperCase(),
      pp: maxPp,
      maxPp: maxPp,
      ppUps: ppUps
    };
  }

  /**
   * Adds a new move to a Pokémon's moveset if it has fewer than 4 moves.
   * @param {Array<Object>|string} currentMoves
   * @param {Object|number|string} moveDefOrIdentifier
   * @returns {Array<Object>}
   */
  teachMove(currentMoves, moveDefOrIdentifier) {
    const list = this.parseMoves(currentMoves);
    const moveDef = typeof moveDefOrIdentifier === 'object' && moveDefOrIdentifier.id
      ? moveDefOrIdentifier
      : moveRegistry.get(moveDefOrIdentifier);

    if (!moveDef) {
      throw new Error(`Golpe não encontrado: "${moveDefOrIdentifier}"`);
    }

    if (this.hasMove(list, moveDef.internalName)) {
      throw new Error(`O Pokémon já conhece o golpe ${moveDef.name}.`);
    }

    if (list.length >= MAX_MOVES_PER_POKEMON) {
      throw new Error(`O Pokémon já possui ${MAX_MOVES_PER_POKEMON} golpes. É necessário substituir um existente.`);
    }

    list.push(this.createInstance(moveDef));
    return list;
  }

  /**
   * Replaces an existing move slot (0 to 3) or old move ID with a new move.
   * @param {Array<Object>|string} currentMoves
   * @param {number|string} slotIndexOrOldMoveId - Slot index (0-3) or identifier of move to forget
   * @param {Object|number|string} newMoveDefOrIdentifier
   * @returns {Array<Object>}
   */
  replaceMove(currentMoves, slotIndexOrOldMoveId, newMoveDefOrIdentifier) {
    const list = this.parseMoves(currentMoves);
    const newMoveDef = typeof newMoveDefOrIdentifier === 'object' && newMoveDefOrIdentifier.id
      ? newMoveDefOrIdentifier
      : moveRegistry.get(newMoveDefOrIdentifier);

    if (!newMoveDef) {
      throw new Error(`Novo golpe não encontrado: "${newMoveDefOrIdentifier}"`);
    }

    // Determine target index
    let targetIndex = -1;
    if (typeof slotIndexOrOldMoveId === 'number' && slotIndexOrOldMoveId >= 0 && slotIndexOrOldMoveId < list.length) {
      targetIndex = slotIndexOrOldMoveId;
    } else {
      const oldIdNum = Number(slotIndexOrOldMoveId);
      const oldNameStr = String(slotIndexOrOldMoveId).trim().toUpperCase();

      targetIndex = list.findIndex(m => {
        if (!isNaN(oldIdNum) && (m.moveId === oldIdNum || m.id === oldIdNum)) return true;
        if (m.internalName && m.internalName.toUpperCase() === oldNameStr) return true;
        return false;
      });
    }

    if (targetIndex === -1) {
      throw new Error(`Golpe anterior a ser substituído não foi encontrado.`);
    }

    // Prevent adding a move that the Pokémon already knows in another slot
    const alreadyKnownElsewhere = list.some((m, idx) => {
      if (idx === targetIndex) return false;
      return (m.moveId === newMoveDef.id) || (m.internalName && m.internalName.toUpperCase() === newMoveDef.internalName);
    });

    if (alreadyKnownElsewhere) {
      throw new Error(`O Pokémon já conhece o golpe ${newMoveDef.name} em outro slot.`);
    }

    // Drop-in replacement
    list[targetIndex] = this.createInstance(newMoveDef);
    return list;
  }

  /**
   * Returns moves that a species learns at an exact level (for level up trigger).
   * @param {Object} species - PokemonSpecies model record
   * @param {number} level
   * @returns {Array<Object>} Array of MoveDefinition objects
   */
  getLearnableMovesForLevel(species, level) {
    if (!species || !species.moves) return [];

    let learnset = [];
    try {
      learnset = typeof species.moves === 'string' ? JSON.parse(species.moves) : species.moves;
    } catch (e) {
      return [];
    }

    const matching = learnset.filter(entry => entry.level === level);
    const results = [];

    for (const entry of matching) {
      const def = moveRegistry.get(entry.moveInternalName);
      if (def && !results.some(r => r.id === def.id)) {
        results.push(def);
      }
    }

    return results;
  }

  /**
   * Builds the initial moveset (up to 4 moves) for a newly spawned or created Pokémon.
   * @param {Object} species
   * @param {number} level
   * @returns {Array<Object>} Array of clean PokemonMove instances
   */
  selectMovesForInitialLevel(species, level) {
    if (!species) return [this.createInstance(moveRegistry.getFallbackMove())];

    let learnset = [];
    try {
      learnset = typeof species.moves === 'string' ? JSON.parse(species.moves) : (species.moves || []);
    } catch (e) {
      learnset = [];
    }

    // Filter all moves up to current level
    const eligible = learnset.filter(m => m.level <= level);

    // Deduplicate keeping the most recent entry for each move
    const uniqueMap = new Map();
    for (const item of eligible) {
      const cleanName = String(item.moveInternalName).trim().toUpperCase();
      uniqueMap.set(cleanName, item);
    }

    // Take up to 4 most recent moves
    const selected = Array.from(uniqueMap.values()).slice(-MAX_MOVES_PER_POKEMON);

    const instances = [];
    for (const item of selected) {
      const def = moveRegistry.get(item.moveInternalName) || moveRegistry.getFallbackMove(item.moveInternalName);
      instances.push(this.createInstance(def));
    }

    if (instances.length === 0) {
      instances.push(this.createInstance(moveRegistry.getFallbackMove('TACKLE')));
    }

    return instances;
  }

  /**
   * Consumes PP for a move when used in battle or overworld.
   * @param {Array<Object>|string} currentMoves
   * @param {number|string} slotIndexOrIdentifier
   * @param {number} [amount=1]
   * @returns {{ success: boolean, moves: Array<Object>, consumedMove: Object|null, remainingPp: number }}
   */
  consumePp(currentMoves, slotIndexOrIdentifier, amount = 1) {
    const list = this.parseMoves(currentMoves);
    let targetIdx = -1;

    if (typeof slotIndexOrIdentifier === 'number' && slotIndexOrIdentifier >= 0 && slotIndexOrIdentifier < list.length) {
      targetIdx = slotIndexOrIdentifier;
    } else {
      const idNum = Number(slotIndexOrIdentifier);
      const nameStr = String(slotIndexOrIdentifier).trim().toUpperCase();
      targetIdx = list.findIndex(m => {
        if (!isNaN(idNum) && (m.moveId === idNum || m.id === idNum)) return true;
        if (m.internalName && m.internalName.toUpperCase() === nameStr) return true;
        return false;
      });
    }

    if (targetIdx === -1) {
      return { success: false, moves: list, consumedMove: null, remainingPp: 0, reason: 'MOVE_NOT_FOUND' };
    }

    const move = list[targetIdx];
    if (move.pp < amount) {
      return { success: false, moves: list, consumedMove: move, remainingPp: move.pp, reason: 'INSUFFICIENT_PP' };
    }

    move.pp = Math.max(0, move.pp - amount);
    list[targetIdx] = move;

    return { success: true, moves: list, consumedMove: move, remainingPp: move.pp };
  }

  /**
   * Restores all PP for all moves to their respective maxPp (e.g. Pokémon Center, Full Restore).
   * @param {Array<Object>|string} currentMoves
   * @returns {Array<Object>}
   */
  restoreAllPp(currentMoves) {
    const list = this.parseMoves(currentMoves);
    for (const move of list) {
      const def = moveRegistry.get(move.moveId || move.internalName);
      const maxPp = move.maxPp !== undefined ? move.maxPp : (def ? calculateMaxPp(def.pp, move.ppUps || 0) : 35);
      move.maxPp = maxPp;
      move.pp = maxPp;
    }
    return list;
  }

  /**
   * Restores PP for a single move slot by an amount (e.g. Ether restores 10, Max Ether restores all).
   * @param {Array<Object>|string} currentMoves
   * @param {number|string} slotIndexOrIdentifier
   * @param {number|null} [amount=10] - null restores fully to maxPp
   * @returns {Array<Object>}
   */
  restoreSlotPp(currentMoves, slotIndexOrIdentifier, amount = 10) {
    const list = this.parseMoves(currentMoves);
    let targetIdx = -1;

    if (typeof slotIndexOrIdentifier === 'number' && slotIndexOrIdentifier >= 0 && slotIndexOrIdentifier < list.length) {
      targetIdx = slotIndexOrIdentifier;
    } else {
      const idNum = Number(slotIndexOrIdentifier);
      const nameStr = String(slotIndexOrIdentifier).trim().toUpperCase();
      targetIdx = list.findIndex(m => {
        if (!isNaN(idNum) && (m.moveId === idNum || m.id === idNum)) return true;
        if (m.internalName && m.internalName.toUpperCase() === nameStr) return true;
        return false;
      });
    }

    if (targetIdx === -1) return list;

    const move = list[targetIdx];
    const def = moveRegistry.get(move.moveId || move.internalName);
    const maxPp = move.maxPp !== undefined ? move.maxPp : (def ? calculateMaxPp(def.pp, move.ppUps || 0) : 35);

    if (amount === null) {
      move.pp = maxPp;
    } else {
      move.pp = Math.min(maxPp, (move.pp || 0) + amount);
    }

    list[targetIdx] = move;
    return list;
  }

  /**
   * Applies a PP Up item to a move slot, increasing max PP by 20% (up to 3 times / +60%).
   * @param {Array<Object>|string} currentMoves
   * @param {number|string} slotIndexOrIdentifier
   * @returns {{ success: boolean, moves: Array<Object>, updatedMove: Object|null, message: string }}
   */
  applyPpUp(currentMoves, slotIndexOrIdentifier) {
    const { MAX_PP_UPS } = require('./MoveConstants');
    const list = this.parseMoves(currentMoves);
    let targetIdx = -1;

    if (typeof slotIndexOrIdentifier === 'number' && slotIndexOrIdentifier >= 0 && slotIndexOrIdentifier < list.length) {
      targetIdx = slotIndexOrIdentifier;
    } else {
      const idNum = Number(slotIndexOrIdentifier);
      const nameStr = String(slotIndexOrIdentifier).trim().toUpperCase();
      targetIdx = list.findIndex(m => {
        if (!isNaN(idNum) && (m.moveId === idNum || m.id === idNum)) return true;
        if (m.internalName && m.internalName.toUpperCase() === nameStr) return true;
        return false;
      });
    }

    if (targetIdx === -1) {
      return { success: false, moves: list, updatedMove: null, message: 'Golpe não encontrado.' };
    }

    const move = list[targetIdx];
    const curPpUps = move.ppUps || 0;

    if (curPpUps >= MAX_PP_UPS) {
      return { success: false, moves: list, updatedMove: move, message: 'Este golpe já atingiu o limite de PP Ups (máximo 3).' };
    }

    const def = moveRegistry.get(move.moveId || move.internalName);
    const basePp = def ? def.pp : 35;
    const newPpUps = curPpUps + 1;
    const newMaxPp = calculateMaxPp(basePp, newPpUps);
    const gain = newMaxPp - move.maxPp;

    move.ppUps = newPpUps;
    move.maxPp = newMaxPp;
    move.pp = (move.pp || 0) + Math.max(0, gain);
    list[targetIdx] = move;

    return {
      success: true,
      moves: list,
      updatedMove: move,
      message: `PP Máximo de ${def ? def.name : move.internalName} aumentado para ${newMaxPp}!`
    };
  }
}

module.exports = new MoveManager();
