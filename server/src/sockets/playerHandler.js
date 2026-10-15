const roomManager = require('../rooms/roomManager');
const characterService = require('../services/characterService');
const worldService = require('../services/worldService');
const pokemonService = require('../services/pokemonService');
const prisma = require('../database');
const battleManager = require('../services/battle/BattleManager');

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

      // Safe position check for room bounds
      const targetRoomId = (character.roomId && roomManager.getRoomDefinition(character.roomId)) ? character.roomId : 'kanto';
      const roomDef = roomManager.getRoomDefinition(targetRoomId);
      let spawnX = character.x;
      let spawnY = character.y;
      const minPadding = 16;
      if (!spawnX || !spawnY || isNaN(spawnX) || isNaN(spawnY) || spawnX < minPadding || spawnY < minPadding || spawnX > (roomDef.width - minPadding) || spawnY > (roomDef.height - minPadding)) {
        spawnX = roomDef.defaultSpawn?.x || 2016;
        spawnY = roomDef.defaultSpawn?.y || 8608;
      }


      // Check if character or user is already active in another session (Single session per char / user)
      const existingPlayer = roomManager.getPlayerByCharacterId(character.id) || roomManager.getPlayerByUserId(socket.user.userId);
      if (existingPlayer && existingPlayer.socketId !== socket.id) {
        console.log(`[PlayerJoin] Desconectando sessão duplicada do personagem ${character.id} (socket: ${existingPlayer.socketId})`);
        const oldSocket = io.sockets.sockets.get(existingPlayer.socketId);
        if (oldSocket) {
          oldSocket.emit('session:replaced', {
            message: 'Este personagem entrou no mundo a partir de outra sessão.'
          });
          oldSocket.disconnect(true);
        }
        roomManager.removePlayer(existingPlayer.socketId);
        socket.to(existingPlayer.roomId).emit('player:left', {
          socketId: existingPlayer.socketId,
          characterId: existingPlayer.characterId
        });
      }

      // Clear any leftover battle session upon entering the overworld
      battleManager.endSession(character.id);

      // Add to Room Manager
      const activeBuddyPkmn = (character.pokemon || []).find(p => p.isBuddy);
      let activeBuddyData = null;
      if (activeBuddyPkmn) {
        const formattedId = String(activeBuddyPkmn.speciesId).padStart(3, '0');
        const curHp = typeof activeBuddyPkmn.currentHp === 'number' ? activeBuddyPkmn.currentHp : (activeBuddyPkmn.maxHp || 20);
        const maxHp = activeBuddyPkmn.maxHp || 20;
        activeBuddyData = {
          id: activeBuddyPkmn.id,
          speciesId: activeBuddyPkmn.speciesId,
          name: activeBuddyPkmn.nickname || activeBuddyPkmn.name,
          level: activeBuddyPkmn.level,
          isShiny: activeBuddyPkmn.isShiny || false,
          currentHp: curHp,
          maxHp,
          isFainted: curHp <= 0,
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
        level: character.level || 1,
        exp: character.exp || 0,
        roomId: roomDef.id,
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

      // Send initial active party and storage data automatically on join
      try {
        const pokemonData = await pokemonService.getCharacterPokemonData(player.characterId);
        socket.emit('pokemon:data_response', { success: true, ...pokemonData });
      } catch (pkErr) {
        console.warn('[PlayerJoin] Error sending initial pokemon data:', pkErr);
      }

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
      battleManager.endSession(player.characterId);
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

  // ─── 3. Starter Pokemon Choice (Prof. Carvalho) ──────────────────────────
  socket.on('starter:choose', async (payload, callback) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) {
        if (typeof callback === 'function') callback({ success: false, message: 'Personagem não encontrado.' });
        return;
      }

      const { speciesId } = payload || {};
      const validStarters = [1, 4, 7]; // Bulbasaur, Charmander, Squirtle
      if (!validStarters.includes(Number(speciesId))) {
        if (typeof callback === 'function') callback({ success: false, message: 'Espécie de inicial inválida.' });
        return;
      }

      // Verifica se o jogador já possui algum Pokémon
      const existingCount = await prisma.pokemon.count({
        where: { characterId: player.characterId }
      });
      if (existingCount > 0) {
        if (typeof callback === 'function') callback({ success: false, message: 'Você já possui um Pokémon parceiro!' });
        return;
      }

      // Criação segura do Pokémon inicial nível 5
      const newPkmn = await pokemonService.createPokemon({
        characterId: player.characterId,
        speciesIdOrName: Number(speciesId),
        level: 5,
        targetLocation: 'party',
        caughtLocation: 'Laboratório do Prof. Carvalho',
        caughtBall: 'poke-ball',
        obtainedMethod: 'starter',
        forceBuddy: true
      });

      // Registra na Pokédex como 'caught' (capturado)
      const starterSpeciesNames = { 1: 'Bulbasaur', 4: 'Charmander', 7: 'Squirtle' };
      const speciesName = starterSpeciesNames[Number(speciesId)] || newPkmn.name;
      await prisma.pokedexEntry.upsert({
        where: {
          characterId_pokemonNumber: {
            characterId: player.characterId,
            pokemonNumber: Number(speciesId)
          }
        },
        update: {
          status: 'caught',
          caughtAt: new Date()
        },
        create: {
          characterId: player.characterId,
          pokemonNumber: Number(speciesId),
          pokemonName: speciesName,
          status: 'caught',
          caughtAt: new Date()
        }
      });

      // Marca introdução como concluída para players recém-criados
      await characterService.completeIntro(player.characterId);

      player.activeBuddy = {
        id: newPkmn.id,
        speciesId: newPkmn.speciesId,
        name: newPkmn.nickname || newPkmn.species?.name || newPkmn.name,
        level: newPkmn.level,
        isShiny: newPkmn.isShiny,
        sprite: String(newPkmn.speciesId).padStart(3, '0') + (newPkmn.isShiny ? '_shiny' : ''),
        currentHp: newPkmn.currentHp,
        maxHp: newPkmn.maxHp
      };

      // Atualiza outros jogadores na sala com o novo seguidor
      io.to(player.roomId).emit('player:buddy_updated', {
        socketId: socket.id,
        characterId: player.characterId,
        buddy: player.activeBuddy
      });

      // Retorna a nova party completa para o cliente
      socket.emit('pokemon:data_response', {
        success: true,
        party: [newPkmn],
        activeBuddy: player.activeBuddy
      });

      if (typeof callback === 'function') {
        callback({ success: true, pokemon: newPkmn });
      }
    } catch (err) {
      console.error('[Starter Choice Error]:', err);
      if (typeof callback === 'function') {
        callback({ success: false, message: err.message });
      }
    }
  });

  // ─── 4. Shop / Poké Mart Purchase ─────────────────────────────────────────
  socket.on('shop:buy', async (payload, callback) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) {
        if (typeof callback === 'function') callback({ success: false, message: 'Jogador não encontrado.' });
        return;
      }

      const { itemId, quantity = 1 } = payload || {};
      const qty = Math.max(1, Math.min(99, parseInt(quantity, 10) || 1));

      const ITEM_MAP = {
        'poke-ball': 'Poké Ball',
        'potion': 'Potion',
        'antidote': 'Antidote',
        'paralyze-heal': 'Paralyze Heal',
        'escape-rope': 'Escape Rope'
      };

      const searchName = ITEM_MAP[itemId] || itemId;
      const dbItem = await prisma.item.findFirst({
        where: {
          OR: [
            { name: searchName },
            { name: { contains: searchName } }
          ]
        }
      });

      const unitPrice = dbItem?.price || 200;
      const totalCost = unitPrice * qty;

      const character = await prisma.character.findUnique({
        where: { id: player.characterId },
        select: { money: true }
      });

      if (!character || character.money < totalCost) {
        if (typeof callback === 'function') callback({ success: false, message: 'Dinheiro insuficiente.' });
        return;
      }

      // Deduz dinheiro
      const updatedChar = await prisma.character.update({
        where: { id: player.characterId },
        data: { money: { decrement: totalCost } },
        select: { money: true }
      });

      // Atualiza ou insere no slot de inventário
      if (dbItem) {
        const existingSlot = await prisma.inventorySlot.findFirst({
          where: { characterId: player.characterId, itemId: dbItem.id }
        });

        if (existingSlot) {
          await prisma.inventorySlot.update({
            where: { id: existingSlot.id },
            data: { quantity: { increment: qty } }
          });
        } else {
          const usedSlots = await prisma.inventorySlot.findMany({
            where: { characterId: player.characterId },
            select: { slotIndex: true }
          });
          const usedSet = new Set(usedSlots.map(s => s.slotIndex));
          let freeIndex = 0;
          while (usedSet.has(freeIndex) && freeIndex < 24) freeIndex++;

          if (freeIndex < 24) {
            await prisma.inventorySlot.create({
              data: {
                characterId: player.characterId,
                itemId: dbItem.id,
                quantity: qty,
                slotIndex: freeIndex
              }
            });
          }
        }
      }

      socket.emit('money:updated', { money: updatedChar.money });

      // Atualiza inventário completo do cliente
      const fullInventory = await prisma.inventorySlot.findMany({
        where: { characterId: player.characterId },
        include: { item: true }
      });
      socket.emit('inventory:data', { items: fullInventory });

      if (typeof callback === 'function') {
        callback({ success: true, newMoney: updatedChar.money });
      }
    } catch (err) {
      console.error('[Shop Buy Error]:', err);
      if (typeof callback === 'function') {
        callback({ success: false, message: err.message });
      }
    }
  });
}

module.exports = setupPlayerHandlers;
