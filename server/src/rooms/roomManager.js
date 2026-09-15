const ROOM_DEFINITIONS = {
  pallet_town: {
    id: 'pallet_town',
    name: 'Pallet Town',
    width: 1152,
    height: 640,
    defaultSpawn: { x: 608, y: 350 },
    portals: [
      {
        targetRoom: 'route_1',
        trigger: { x: 576, y: 0, width: 64, height: 32 },
        targetSpawn: { x: 400, y: 540 }
      },
      {
        targetRoom: 'ash_house',
        trigger: { x: 384, y: 224, width: 32, height: 32 },
        targetSpawn: { x: 400, y: 480 }
      },
      {
        targetRoom: 'rival_house',
        trigger: { x: 672, y: 224, width: 32, height: 32 },
        targetSpawn: { x: 400, y: 480 }
      },
      {
        targetRoom: 'oak_lab',
        trigger: { x: 704, y: 416, width: 32, height: 32 },
        targetSpawn: { x: 400, y: 480 }
      }
    ]
  },

  route_1: {
    id: 'route_1',
    name: 'Route 1',
    width: 800,
    height: 600,
    defaultSpawn: { x: 400, y: 540 },
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 360, y: 570, width: 80, height: 30 },
        targetSpawn: { x: 608, y: 48 }
      },
      {
        targetRoom: 'viridian_city',
        trigger: { x: 360, y: 0, width: 80, height: 30 },
        targetSpawn: { x: 400, y: 540 }
      }
    ]
  },

  viridian_city: {
    id: 'viridian_city',
    name: 'Viridian City',
    width: 800,
    height: 600,
    defaultSpawn: { x: 400, y: 540 },
    portals: [
      {
        targetRoom: 'route_1',
        trigger: { x: 360, y: 570, width: 80, height: 30 },
        targetSpawn: { x: 400, y: 50 }
      }
    ]
  },

  ash_house: {
    id: 'ash_house',
    name: "Casa do Red",
    width: 800,
    height: 600,
    defaultSpawn: { x: 400, y: 480 },
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 340, y: 545, width: 120, height: 55 },
        targetSpawn: { x: 400, y: 272 }
      }
    ]
  },

  rival_house: {
    id: 'rival_house',
    name: "Casa do Blue",
    width: 800,
    height: 600,
    defaultSpawn: { x: 400, y: 480 },
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 340, y: 545, width: 120, height: 55 },
        targetSpawn: { x: 688, y: 272 }
      }
    ]
  },

  oak_lab: {
    id: 'oak_lab',
    name: "Laboratório do Prof. Carvalho",
    width: 800,
    height: 600,
    defaultSpawn: { x: 400, y: 480 },
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 340, y: 545, width: 120, height: 55 },
        targetSpawn: { x: 720, y: 464 }
      }
    ]
  }
};

class RoomManager {
  constructor() {
    // Map socketId -> player data
    this.players = new Map();
  }

  getRoomDefinition(roomId) {
    return ROOM_DEFINITIONS[roomId] || ROOM_DEFINITIONS.pallet_town;
  }

  getAllRooms() {
    return ROOM_DEFINITIONS;
  }

  addPlayer(socketId, playerData) {
    const roomId = playerData.roomId || 'pallet_town';
    const roomDef = this.getRoomDefinition(roomId);

    const player = {
      socketId,
      userId: playerData.userId,
      characterId: playerData.characterId,
      name: playerData.name,
      gender: playerData.gender || 'male',
      sprite: playerData.sprite || 'boy_run',
      roomId: roomDef.id,
      x: typeof playerData.x === 'number' ? playerData.x : roomDef.defaultSpawn.x,
      y: typeof playerData.y === 'number' ? playerData.y : roomDef.defaultSpawn.y,
      direction: playerData.direction || 'down',
      isMoving: false
    };

    this.players.set(socketId, player);
    return player;
  }

  removePlayer(socketId) {
    const player = this.players.get(socketId);
    if (player) {
      this.players.delete(socketId);
    }
    return player;
  }

  getPlayer(socketId) {
    return this.players.get(socketId);
  }

  getPlayerByCharacterName(name) {
    const cleanName = name.toLowerCase().trim();
    for (const player of this.players.values()) {
      if (player.name.toLowerCase() === cleanName) {
        return player;
      }
    }
    return null;
  }

  updatePlayerMove(socketId, moveData) {
    const player = this.players.get(socketId);
    if (!player) return null;

    if (typeof moveData.x === 'number') player.x = moveData.x;
    if (typeof moveData.y === 'number') player.y = moveData.y;
    if (moveData.direction) player.direction = moveData.direction;
    if (typeof moveData.isMoving === 'boolean') player.isMoving = moveData.isMoving;

    return player;
  }

  changeRoom(socketId, targetRoomId, targetX, targetY) {
    const player = this.players.get(socketId);
    if (!player) return null;

    const targetRoomDef = this.getRoomDefinition(targetRoomId);
    const oldRoomId = player.roomId;

    player.roomId = targetRoomDef.id;
    player.x = typeof targetX === 'number' ? targetX : targetRoomDef.defaultSpawn.x;
    player.y = typeof targetY === 'number' ? targetY : targetRoomDef.defaultSpawn.y;
    player.isMoving = false;

    return { player, oldRoomId, newRoomId: targetRoomDef.id };
  }

  getPlayersInRoom(roomId) {
    const list = [];
    for (const player of this.players.values()) {
      if (player.roomId === roomId) {
        list.push(player);
      }
    }
    return list;
  }

  getTotalOnlineCount() {
    return this.players.size;
  }
}

module.exports = new RoomManager();
