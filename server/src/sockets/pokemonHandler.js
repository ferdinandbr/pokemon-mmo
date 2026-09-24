const roomManager = require('../rooms/roomManager');
const pokemonService = require('../services/pokemonService');

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
      player.activeBuddy = {
        id: updatedBuddy.id,
        speciesId: updatedBuddy.speciesId,
        name: updatedBuddy.nickname || updatedBuddy.species.name,
        level: updatedBuddy.level,
        isShiny: updatedBuddy.isShiny,
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
}

module.exports = setupPokemonHandlers;
