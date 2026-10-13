const ROOM_DEFINITIONS = {
  "kanto": {
    "id": "kanto",
    "name": "Kanto (Open World)",
    "tilemapKey": "kanto",
    "width": 13056,
    "height": 12800,
    "defaultSpawn": {
      "x": 2016,
      "y": 8608
    },
    "portals": []
  },
  "pallet_player_house_1f": {
    "id": "pallet_player_house_1f",
    "name": "Casa do Jogador (1º Andar)",
    "tilemapKey": "pallet_player_house_1f",
    "width": 384,
    "height": 288,
    "defaultSpawn": {
      "x": 96,
      "y": 224
    },
    "portals": []
  },
  "pallet_player_house_2f": {
    "id": "pallet_player_house_2f",
    "name": "Quarto do Jogador (2º Andar)",
    "tilemapKey": "pallet_player_house_2f",
    "width": 384,
    "height": 288,
    "defaultSpawn": {
      "x": 256,
      "y": 64
    },
    "portals": []
  },
  "pallet_oak_lab": {
    "id": "pallet_oak_lab",
    "name": "Laboratório do Prof. Carvalho",
    "tilemapKey": "pallet_oak_lab",
    "width": 416,
    "height": 416,
    "defaultSpawn": {
      "x": 192,
      "y": 352
    },
    "portals": []
  },
  "pallet_rival_house": {
    "id": "pallet_rival_house",
    "name": "Casa do Rival",
    "tilemapKey": "pallet_rival_house",
    "width": 384,
    "height": 288,
    "defaultSpawn": {
      "x": 96,
      "y": 224
    },
    "portals": []
  }
};

class RoomManager {
  constructor() {
    // Map socketId -> player data
    this.players = new Map();
  }

  getRoomDefinition(roomId) {
    return ROOM_DEFINITIONS[roomId] || ROOM_DEFINITIONS.kanto;
  }

  getAllRooms() {
    return ROOM_DEFINITIONS;
  }

  addPlayer(socketId, playerData) {
    const roomId = (playerData.roomId && ROOM_DEFINITIONS[playerData.roomId]) ? playerData.roomId : 'kanto';
    const roomDef = this.getRoomDefinition(roomId);

    const player = {
      socketId,
      userId: playerData.userId,
      characterId: playerData.characterId,
      name: playerData.name,
      gender: playerData.gender || 'male',
      sprite: playerData.sprite || 'boy_run',
      level: playerData.level || 1,
      exp: playerData.exp || 0,
      roomId: roomDef.id,
      x: typeof playerData.x === 'number' ? playerData.x : roomDef.defaultSpawn.x,
      y: typeof playerData.y === 'number' ? playerData.y : roomDef.defaultSpawn.y,
      direction: playerData.direction || 'down',
      isMoving: false,
      activeBuddy: playerData.activeBuddy || null
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

  getPlayerByUserId(userId) {
    for (const player of this.players.values()) {
      if (player.userId === userId) {
        return player;
      }
    }
    return null;
  }

  getPlayerByCharacterId(characterId) {
    for (const player of this.players.values()) {
      if (player.characterId === characterId) {
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
