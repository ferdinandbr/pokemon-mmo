const roomManager = require('../rooms/roomManager');
const characterService = require('../services/characterService');
const worldService = require('../services/worldService');

function setupPlayerHandlers(io, socket) {
  socket.on('player:join', async (payload) => {
    try {
      const { characterId } = payload;
      if (!characterId) {
        return socket.emit('error:msg', { message: 'ID de personagem não fornecido.' });
      }

      const character = await characterService.getCharacterDetails(characterId);
      if (!character) {
        return socket.emit('error:msg', { message: 'Personagem não encontrado.' });
      }

      // Safe position check for new map bounds
      let spawnX = character.x;
      let spawnY = character.y;
      const roomDef = roomManager.getRoomDefinition(character.roomId);
      if (spawnX < 32 || spawnY < 32 || spawnX > (roomDef.width - 32) || spawnY > (roomDef.height - 32)) {
        spawnX = roomDef.defaultSpawn.x;
        spawnY = roomDef.defaultSpawn.y;
      }


      // Add to Room Manager
      const activeBuddyPkmn = (character.pokemon || []).find(p => p.isBuddy);
      let activeBuddyData = null;
      if (activeBuddyPkmn) {
        const formattedId = String(activeBuddyPkmn.speciesId).padStart(3, '0');
        activeBuddyData = {
          id: activeBuddyPkmn.id,
          speciesId: activeBuddyPkmn.speciesId,
          name: activeBuddyPkmn.nickname || activeBuddyPkmn.name,
          level: activeBuddyPkmn.level,
          isShiny: activeBuddyPkmn.isShiny || false,
          sprite: `${formattedId}.png`
        };
      }

      const player = roomManager.addPlayer(socket.id, {
        userId: socket.user.userId,
        role: socket.user.role || 'user',
        characterId: character.id,
        name: character.name,
        gender: character.gender,
        sprite: character.sprite,
        roomId: character.roomId,
        x: spawnX,
        y: spawnY,
        direction: character.direction,
        activeBuddy: activeBuddyData
      });

      // Join socket room
      socket.join(player.roomId);

      const playersInRoom = roomManager.getPlayersInRoom(player.roomId);

      // Send initial data to joining player
      socket.emit('player:init', {
        self: player,
        role: socket.user.role || 'user',
        room: roomDef,
        players: playersInRoom.filter(p => p.socketId !== socket.id),
        allRooms: roomManager.getAllRooms(),
        money: character.money,
        bagCapacity: character.bagCapacity || 24,
        equipment: character.equipment || '{}',
        hasCompletedIntro: Boolean(character.hasCompletedIntro),
        inventory: character.inventory,
        pokedex: character.pokedex,
        pokemon: character.pokemon,
        worldState: worldService.getFullWorldState()
      });

      // Notify others in room
      socket.to(player.roomId).emit('player:joined', player);

      // Broadcast total online count
      io.emit('server:stats', { onlineCount: roomManager.getTotalOnlineCount() });
    } catch (err) {
      console.error('Error on player:join:', err);
      socket.emit('error:msg', { message: 'Erro ao entrar no mundo.' });
    }
  });

  socket.on('player:complete_intro', async () => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;
      await characterService.completeIntro(player.characterId);
      socket.emit('player:intro_completed', { success: true });
    } catch (err) {
      console.error('Error on player:complete_intro:', err);
    }
  });

  socket.on('player:move', (data) => {
    const player = roomManager.getPlayer(socket.id);
    if (!player) return;

    roomManager.updatePlayerMove(socket.id, data);

    // Relay move event to other players in the same room
    socket.to(player.roomId).emit('player:moved', {
      socketId: socket.id,
      characterId: player.characterId,
      x: player.x,
      y: player.y,
      direction: player.direction,
      isMoving: player.isMoving
    });
  });

  socket.on('player:change_room', async ({ targetRoom, targetX, targetY }) => {
    const player = roomManager.getPlayer(socket.id);
    if (!player) return;

    const oldRoomId = player.roomId;
    const transitionResult = roomManager.changeRoom(socket.id, targetRoom, targetX, targetY);
    if (!transitionResult) return;

    const { newRoomId } = transitionResult;

    // Leave old socket room
    socket.leave(oldRoomId);
    socket.to(oldRoomId).emit('player:left', { socketId: socket.id, characterId: player.characterId });

    // Join new socket room
    socket.join(newRoomId);

    // Save location to DB asynchronously
    characterService.updateCharacterLocation(player.characterId, {
      roomId: player.roomId,
      x: player.x,
      y: player.y,
      direction: player.direction
    }).catch(err => console.error('Error saving character position:', err));

    const roomDef = roomManager.getRoomDefinition(newRoomId);
    const playersInNewRoom = roomManager.getPlayersInRoom(newRoomId);

    socket.emit('room:changed', {
      room: roomDef,
      players: playersInNewRoom.filter(p => p.socketId !== socket.id),
      x: player.x,
      y: player.y
    });

    socket.to(newRoomId).emit('player:joined', player);
  });

  socket.on('disconnect', async () => {
    const player = roomManager.removePlayer(socket.id);
    if (player) {
      socket.to(player.roomId).emit('player:left', { socketId: socket.id, characterId: player.characterId });

      // Save position upon disconnect
      characterService.updateCharacterLocation(player.characterId, {
        roomId: player.roomId,
        x: player.x,
        y: player.y,
        direction: player.direction
      }).catch(err => console.error('Error saving character position on disconnect:', err));

      io.emit('server:stats', { onlineCount: roomManager.getTotalOnlineCount() });
    }
  });
}

module.exports = setupPlayerHandlers;
