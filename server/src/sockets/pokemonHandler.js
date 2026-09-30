const roomManager = require('../rooms/roomManager');
const pokemonService = require('../services/pokemonService');
const pokemonProgressionService = require('../services/pokemonProgressionService');
const evolutionManager = require('../services/evolution/EvolutionManager');

function setupPokemonHandlers(io, socket) {
  // Get all Pokemons (party & storage) for character
  socket.on('pokemon:get_data', async () => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const data = await pokemonService.getCharacterPokemonData(player.characterId);
      socket.emit('pokemon:data_response', { success: true, ...data });
    } catch (err) {
      console.error('[Socket Error pokemon:get_data]:', err);
      socket.emit('pokemon:data_response', { success: false, message: err.message });
    }
  });

  // Set active buddy Pokemon
  socket.on('pokemon:set_buddy', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const { pokemonId } = payload || {};
      if (!pokemonId) return;

      const updatedBuddy = await pokemonService.setBuddy(player.characterId, pokemonId);
      const formattedId = String(updatedBuddy.speciesId).padStart(3, '0');

      // Update runtime player state in roomManager
      const curHp = typeof updatedBuddy.currentHp === 'number' ? updatedBuddy.currentHp : (updatedBuddy.maxHp || 20);
      const maxHp = updatedBuddy.maxHp || 20;
      player.activeBuddy = {
        id: updatedBuddy.id,
        speciesId: updatedBuddy.speciesId,
        name: updatedBuddy.nickname || updatedBuddy.species.name,
        level: updatedBuddy.level,
        isShiny: updatedBuddy.isShiny,
        currentHp: curHp,
        maxHp,
        isFainted: curHp <= 0,
        sprite: `${formattedId}.png`
      };

      // Broadcast buddy change to everyone in the room
      io.to(player.roomId).emit('player:buddy_updated', {
        socketId: socket.id,
        characterId: player.characterId,
        buddy: player.activeBuddy
      });

      // Confirm to sender
      const allData = await pokemonService.getCharacterPokemonData(player.characterId);
      socket.emit('pokemon:data_response', { success: true, ...allData });
      socket.emit('equipment:updated', { equipment: { buddy: player.activeBuddy } });
    } catch (err) {
      console.error('[Socket Error pokemon:set_buddy]:', err);
      socket.emit('pokemon:data_response', { success: false, message: err.message });
    }
  });

  // Move Pokemon between party & storage slots
  socket.on('pokemon:move_slot', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const { pokemonId, targetLocation, targetSlot, targetBox } = payload || {};
      if (!pokemonId || !targetLocation) return;

      const updatedData = await pokemonService.movePokemonSlot(
        player.characterId,
        pokemonId,
        targetLocation,
        targetSlot,
        targetBox
      );

      socket.emit('pokemon:data_response', { success: true, ...updatedData });
    } catch (err) {
      console.error('[Socket Error pokemon:move_slot]:', err);
      socket.emit('pokemon:data_response', { success: false, message: err.message });
    }
  });

  // Replace an existing move with a pending move (when Pokémon has 4 moves)
  socket.on('pokemon:replace_move', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const { pokemonId, slotIndexToReplace, newMoveId } = payload || {};
      if (pokemonId === undefined || slotIndexToReplace === undefined) {
        return socket.emit('pokemon:action_error', { message: 'Dados incompletos para substituição de golpe.' });
      }

      const result = await pokemonProgressionService.confirmMoveReplacement({
        characterId: player.characterId,
        pokemonId: Number(pokemonId),
        slotIndexToReplace: Number(slotIndexToReplace),
        newMoveId: newMoveId ? Number(newMoveId) : null
      });

      const pkmnName = result.pokemon.nickname || result.pokemon.species.name;
      const oldName = result.oldMove ? result.oldMove.name : 'um golpe antigo';
      const newName = result.newMove.name;

      socket.emit('pokemon:move_replaced', {
        success: true,
        pokemonId: result.pokemon.id,
        pokemon: result.pokemon,
        oldMove: result.oldMove,
        newMove: result.newMove,
        message: `1, 2, e... Puf! ${pkmnName} esqueceu ${oldName} e aprendeu ${newName}!`
      });

      // Send refreshed party/storage data to client
      const allData = await pokemonService.getCharacterPokemonData(player.characterId);
      socket.emit('pokemon:data_response', { success: true, ...allData });
    } catch (err) {
      console.error('[Socket Error pokemon:replace_move]:', err);
      socket.emit('pokemon:action_error', { message: err.message });
    }
  });

  // Cancel learning a move (player chooses to forfeit the move)
  socket.on('pokemon:cancel_learn_move', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const { pokemonId, newMoveId } = payload || {};
      if (!pokemonId) return;

      const result = pokemonProgressionService.cancelMoveLearning({
        characterId: player.characterId,
        pokemonId: Number(pokemonId),
        newMoveId: newMoveId ? Number(newMoveId) : null
      });

      socket.emit('pokemon:move_learn_cancelled', {
        success: true,
        pokemonId: Number(pokemonId),
        message: result.moveName
          ? `${result.moveName} não foi aprendido.`
          : 'Aprendizado de golpe cancelado.'
      });
    } catch (err) {
      console.error('[Socket Error pokemon:cancel_learn_move]:', err);
      socket.emit('pokemon:action_error', { message: err.message });
    }
  });

  // Trigger level-up directly (progression, admin, battle rewards)
  socket.on('pokemon:level_up_request', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const { pokemonId, levels = 1 } = payload || {};
      if (!pokemonId) return;

      const result = await pokemonProgressionService.levelUpPokemon({
        characterId: player.characterId,
        pokemonId: Number(pokemonId),
        levelsToAdd: Number(levels)
      });

      socket.emit('pokemon:level_up', result);

      if (result.autoLearnedMoves && result.autoLearnedMoves.length > 0) {
        socket.emit('pokemon:move_learned_auto', {
          pokemonId: result.pokemon.id,
          moves: result.autoLearnedMoves
        });
      }

      if (result.pendingPromptMove) {
        socket.emit('pokemon:move_learn_prompt', result.pendingPromptMove);
      }

      // If active buddy leveled up, sync buddy level on runtime player
      if (player.activeBuddy && player.activeBuddy.id === Number(pokemonId)) {
        player.activeBuddy.level = result.newLevel;
        io.to(player.roomId).emit('player:buddy_updated', {
          socketId: socket.id,
          characterId: player.characterId,
          buddy: player.activeBuddy
        });
      }

      const allData = await pokemonService.getCharacterPokemonData(player.characterId);
      socket.emit('pokemon:data_response', { success: true, ...allData });
    } catch (err) {
      console.error('[Socket Error pokemon:level_up_request]:', err);
      socket.emit('pokemon:action_error', { message: err.message });
    }
  });

  // Execute evolution
  socket.on('pokemon:evolve', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const { pokemonId, targetSpeciesId } = payload || {};
      if (!pokemonId || !targetSpeciesId) return;

      const result = await evolutionManager.executeEvolution({
        characterId: player.characterId,
        pokemonId: Number(pokemonId),
        targetSpeciesId: Number(targetSpeciesId)
      });

      socket.emit('pokemon:evolve_success', result);

      // If active buddy evolved, update runtime player
      if (player.activeBuddy && player.activeBuddy.id === Number(pokemonId)) {
        const formattedId = String(result.pokemon.speciesId).padStart(3, '0');
        player.activeBuddy.speciesId = result.pokemon.speciesId;
        player.activeBuddy.name = result.pokemon.nickname || result.pokemon.species.name;
        player.activeBuddy.sprite = `${formattedId}.png`;
        io.to(player.roomId).emit('player:buddy_updated', {
          socketId: socket.id,
          characterId: player.characterId,
          buddy: player.activeBuddy
        });
      }

      const allData = await pokemonService.getCharacterPokemonData(player.characterId);
      socket.emit('pokemon:data_response', { success: true, ...allData });
    } catch (err) {
      console.error('[Socket Error pokemon:evolve]:', err);
      socket.emit('pokemon:action_error', { message: err.message });
    }
  });
}

module.exports = setupPokemonHandlers;
