const ROOM_DEFINITIONS = {
  "pallet_town": {
    "id": "pallet_town",
    "name": "Pallet Town",
    "tilemapKey": "pallet_town",
    "width": 1152,
    "height": 640,
    "defaultSpawn": {
      "x": 560,
      "y": 272
    },
    "portals": [
      {
        "targetRoom": "route_1",
        "trigger": {
          "x": 576,
          "y": 0,
          "width": 64,
          "height": 32
        },
        "targetSpawn": {
          "x": 608,
          "y": 1184
        },
        "label": "Route 1"
      },
      {
        "targetRoom": "cinnabar_island",
        "trigger": {
          "x": 544,
          "y": 608,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 608,
          "y": 160
        },
        "label": "Rota 21 (Cinnabar Island)"
      }
    ]
  },
  "viridian_city": {
    "id": "viridian_city",
    "name": "Viridian City",
    "tilemapKey": "viridian_city",
    "width": 1600,
    "height": 1280,
    "defaultSpawn": {
      "x": 752,
      "y": 1152
    },
    "portals": [
      {
        "targetRoom": "route_1",
        "trigger": {
          "x": 704,
          "y": 1248,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 576,
          "y": 80
        },
        "label": "Route 1"
      },
      {
        "targetRoom": "route_2",
        "trigger": {
          "x": 576,
          "y": 0,
          "width": 192,
          "height": 32
        },
        "targetSpawn": {
          "x": 752,
          "y": 2432
        },
        "label": "Route 2"
      },
      {
        "targetRoom": "indigo_plateau",
        "trigger": {
          "x": 0,
          "y": 512,
          "width": 32,
          "height": 128
        },
        "targetSpawn": {
          "x": 432,
          "y": 384
        },
        "label": "Rota 22 (Indigo Plateau)"
      }
    ]
  },
  "pewter_city": {
    "id": "pewter_city",
    "name": "Pewter City",
    "tilemapKey": "pewter_city",
    "width": 1664,
    "height": 1472,
    "defaultSpawn": {
      "x": 816,
      "y": 800
    },
    "portals": [
      {
        "targetRoom": "route_2",
        "trigger": {
          "x": 768,
          "y": 1440,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 752,
          "y": 96
        },
        "label": "Route 2"
      },
      {
        "targetRoom": "route_3",
        "trigger": {
          "x": 1632,
          "y": 832,
          "width": 32,
          "height": 96
        },
        "targetSpawn": {
          "x": 112,
          "y": 368
        },
        "label": "Route 3"
      }
    ]
  },
  "cerulean_city": {
    "id": "cerulean_city",
    "name": "Cerulean City",
    "tilemapKey": "cerulean_city",
    "width": 1536,
    "height": 1280,
    "defaultSpawn": {
      "x": 672,
      "y": 640
    },
    "portals": [
      {
        "targetRoom": "route_4",
        "trigger": {
          "x": 0,
          "y": 640,
          "width": 32,
          "height": 96
        },
        "targetSpawn": {
          "x": 3680,
          "y": 640
        },
        "label": "Route 4"
      },
      {
        "targetRoom": "route_5",
        "trigger": {
          "x": 640,
          "y": 1248,
          "width": 192,
          "height": 32
        },
        "targetSpawn": {
          "x": 640,
          "y": 80
        },
        "label": "Route 5"
      },
      {
        "targetRoom": "route_9",
        "trigger": {
          "x": 1504,
          "y": 512,
          "width": 32,
          "height": 128
        },
        "targetSpawn": {
          "x": 80,
          "y": 432
        },
        "label": "Route 9"
      }
    ]
  },
  "vermilion_city": {
    "id": "vermilion_city",
    "name": "Vermilion City",
    "tilemapKey": "vermilion_city",
    "width": 1696,
    "height": 1440,
    "defaultSpawn": {
      "x": 912,
      "y": 640
    },
    "portals": [
      {
        "targetRoom": "route_6",
        "trigger": {
          "x": 832,
          "y": 0,
          "width": 160,
          "height": 32
        },
        "targetSpawn": {
          "x": 816,
          "y": 1216
        },
        "label": "Route 6"
      },
      {
        "targetRoom": "route_11",
        "trigger": {
          "x": 1664,
          "y": 512,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 80,
          "y": 576
        },
        "label": "Route 11"
      }
    ]
  },
  "lavender_town": {
    "id": "lavender_town",
    "name": "Lavender Town",
    "tilemapKey": "lavender_town",
    "width": 960,
    "height": 640,
    "defaultSpawn": {
      "x": 480,
      "y": 320
    },
    "portals": [
      {
        "targetRoom": "route_8",
        "trigger": {
          "x": 0,
          "y": 288,
          "width": 32,
          "height": 128
        },
        "targetSpawn": {
          "x": 2240,
          "y": 480
        },
        "label": "Route 8"
      },
      {
        "targetRoom": "route_10",
        "trigger": {
          "x": 288,
          "y": 0,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 320,
          "y": 2624
        },
        "label": "Route 10"
      }
    ]
  },
  "celadon_city": {
    "id": "celadon_city",
    "name": "Celadon City",
    "tilemapKey": "celadon_city",
    "width": 1920,
    "height": 1664,
    "defaultSpawn": {
      "x": 960,
      "y": 832
    },
    "portals": [
      {
        "targetRoom": "route_7",
        "trigger": {
          "x": 1888,
          "y": 576,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 80,
          "y": 576
        },
        "label": "Route 7"
      }
    ]
  },
  "saffron_city": {
    "id": "saffron_city",
    "name": "Saffron City",
    "tilemapKey": "saffron_city",
    "width": 2112,
    "height": 1792,
    "defaultSpawn": {
      "x": 960,
      "y": 1120
    },
    "portals": [
      {
        "targetRoom": "route_5",
        "trigger": {
          "x": 960,
          "y": 0,
          "width": 192,
          "height": 32
        },
        "targetSpawn": {
          "x": 704,
          "y": 1056
        },
        "label": "Route 5"
      },
      {
        "targetRoom": "route_6",
        "trigger": {
          "x": 960,
          "y": 1760,
          "width": 192,
          "height": 32
        },
        "targetSpawn": {
          "x": 848,
          "y": 48
        },
        "label": "Route 6"
      },
      {
        "targetRoom": "route_7",
        "trigger": {
          "x": 0,
          "y": 704,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 800,
          "y": 736
        },
        "label": "Route 7"
      },
      {
        "targetRoom": "route_8",
        "trigger": {
          "x": 2080,
          "y": 944,
          "width": 32,
          "height": 64
        },
        "targetSpawn": {
          "x": 96,
          "y": 320
        },
        "label": "Route 8"
      }
    ]
  },
  "fuchsia_city": {
    "id": "fuchsia_city",
    "name": "Fuchsia City",
    "tilemapKey": "fuchsia_city",
    "width": 1536,
    "height": 1312,
    "defaultSpawn": {
      "x": 768,
      "y": 656
    },
    "portals": [
      {
        "targetRoom": "cinnabar_island",
        "trigger": {
          "x": 672,
          "y": 1280,
          "width": 192,
          "height": 32
        },
        "targetSpawn": {
          "x": 608,
          "y": 160
        },
        "label": "Rota 19/20 (Cinnabar Island)"
      }
    ]
  },
  "cinnabar_island": {
    "id": "cinnabar_island",
    "name": "Cinnabar Island",
    "tilemapKey": "cinnabar_island",
    "width": 960,
    "height": 864,
    "defaultSpawn": {
      "x": 608,
      "y": 224
    },
    "portals": [
      {
        "targetRoom": "pallet_town",
        "trigger": {
          "x": 576,
          "y": 0,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 608,
          "y": 520
        },
        "label": "Rota 21 (Pallet Town)"
      },
      {
        "targetRoom": "fuchsia_city",
        "trigger": {
          "x": 928,
          "y": 160,
          "width": 32,
          "height": 320
        },
        "targetSpawn": {
          "x": 768,
          "y": 1216
        },
        "label": "Rota 20/19 (Fuchsia City)"
      }
    ]
  },
  "indigo_plateau": {
    "id": "indigo_plateau",
    "name": "Indigo Plateau",
    "tilemapKey": "indigo_plateau",
    "width": 864,
    "height": 640,
    "defaultSpawn": {
      "x": 432,
      "y": 384
    },
    "portals": [
      {
        "targetRoom": "viridian_city",
        "trigger": {
          "x": 384,
          "y": 416,
          "width": 96,
          "height": 32
        },
        "targetSpawn": {
          "x": 80,
          "y": 576
        },
        "label": "Rota 22 (Viridian City)"
      }
    ]
  },
  "route_1": {
    "id": "route_1",
    "name": "Route 1",
    "tilemapKey": "route_1",
    "width": 1408,
    "height": 1280,
    "defaultSpawn": {
      "x": 608,
      "y": 1184
    },
    "portals": [
      {
        "targetRoom": "pallet_town",
        "trigger": {
          "x": 576,
          "y": 1248,
          "width": 64,
          "height": 32
        },
        "targetSpawn": {
          "x": 608,
          "y": 80
        },
        "label": "Pallet Town"
      },
      {
        "targetRoom": "viridian_city",
        "trigger": {
          "x": 512,
          "y": 0,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 752,
          "y": 1152
        },
        "label": "Viridian City"
      }
    ]
  },
  "route_2": {
    "id": "route_2",
    "name": "Route 2",
    "tilemapKey": "route_2",
    "width": 1664,
    "height": 2560,
    "defaultSpawn": {
      "x": 752,
      "y": 2432
    },
    "portals": [
      {
        "targetRoom": "viridian_city",
        "trigger": {
          "x": 704,
          "y": 2528,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 656,
          "y": 96
        },
        "label": "Viridian City"
      },
      {
        "targetRoom": "pewter_city",
        "trigger": {
          "x": 704,
          "y": 0,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 816,
          "y": 1360
        },
        "label": "Pewter City"
      }
    ]
  },
  "route_3": {
    "id": "route_3",
    "name": "Route 3",
    "tilemapKey": "route_3",
    "width": 2880,
    "height": 832,
    "defaultSpawn": {
      "x": 112,
      "y": 368
    },
    "portals": [
      {
        "targetRoom": "pewter_city",
        "trigger": {
          "x": 0,
          "y": 288,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 1568,
          "y": 864
        },
        "label": "Pewter City"
      },
      {
        "targetRoom": "route_4",
        "trigger": {
          "x": 2176,
          "y": 0,
          "width": 256,
          "height": 32
        },
        "targetSpawn": {
          "x": 672,
          "y": 960
        },
        "label": "Mt. Moon (Route 4)"
      }
    ]
  },
  "route_4": {
    "id": "route_4",
    "name": "Route 4",
    "tilemapKey": "route_4",
    "width": 3776,
    "height": 1088,
    "defaultSpawn": {
      "x": 672,
      "y": 960
    },
    "portals": [
      {
        "targetRoom": "route_3",
        "trigger": {
          "x": 576,
          "y": 1056,
          "width": 256,
          "height": 32
        },
        "targetSpawn": {
          "x": 2304,
          "y": 96
        },
        "label": "Mt. Moon (Route 3)"
      },
      {
        "targetRoom": "cerulean_city",
        "trigger": {
          "x": 3744,
          "y": 544,
          "width": 32,
          "height": 320
        },
        "targetSpawn": {
          "x": 80,
          "y": 672
        },
        "label": "Cerulean City"
      }
    ]
  },
  "route_5": {
    "id": "route_5",
    "name": "Route 5",
    "tilemapKey": "route_5",
    "width": 1536,
    "height": 1280,
    "defaultSpawn": {
      "x": 640,
      "y": 80
    },
    "portals": [
      {
        "targetRoom": "cerulean_city",
        "trigger": {
          "x": 448,
          "y": 0,
          "width": 640,
          "height": 32
        },
        "targetSpawn": {
          "x": 736,
          "y": 1184
        },
        "label": "Cerulean City"
      },
      {
        "targetRoom": "saffron_city",
        "trigger": {
          "x": 688,
          "y": 1248,
          "width": 48,
          "height": 32
        },
        "targetSpawn": {
          "x": 1056,
          "y": 48
        },
        "label": "Saffron City"
      }
    ]
  },
  "route_6": {
    "id": "route_6",
    "name": "Route 6",
    "tilemapKey": "route_6",
    "width": 1408,
    "height": 1312,
    "defaultSpawn": {
      "x": 848,
      "y": 48
    },
    "portals": [
      {
        "targetRoom": "saffron_city",
        "trigger": {
          "x": 800,
          "y": 0,
          "width": 128,
          "height": 32
        },
        "targetSpawn": {
          "x": 992,
          "y": 1728
        },
        "label": "Saffron City"
      },
      {
        "targetRoom": "vermilion_city",
        "trigger": {
          "x": 736,
          "y": 1280,
          "width": 160,
          "height": 32
        },
        "targetSpawn": {
          "x": 912,
          "y": 96
        },
        "label": "Vermilion City"
      }
    ]
  },
  "route_7": {
    "id": "route_7",
    "name": "Route 7",
    "tilemapKey": "route_7",
    "width": 896,
    "height": 1504,
    "defaultSpawn": {
      "x": 80,
      "y": 576
    },
    "portals": [
      {
        "targetRoom": "celadon_city",
        "trigger": {
          "x": 0,
          "y": 512,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 1824,
          "y": 640
        },
        "label": "Celadon City"
      },
      {
        "targetRoom": "saffron_city",
        "trigger": {
          "x": 864,
          "y": 640,
          "width": 32,
          "height": 224
        },
        "targetSpawn": {
          "x": 80,
          "y": 784
        },
        "label": "Saffron City"
      }
    ]
  },
  "route_8": {
    "id": "route_8",
    "name": "Route 8",
    "tilemapKey": "route_8",
    "width": 2336,
    "height": 1664,
    "defaultSpawn": {
      "x": 96,
      "y": 320
    },
    "portals": [
      {
        "targetRoom": "saffron_city",
        "trigger": {
          "x": 0,
          "y": 320,
          "width": 32,
          "height": 224
        },
        "targetSpawn": {
          "x": 1952,
          "y": 960
        },
        "label": "Saffron City"
      },
      {
        "targetRoom": "lavender_town",
        "trigger": {
          "x": 2304,
          "y": 416,
          "width": 32,
          "height": 128
        },
        "targetSpawn": {
          "x": 80,
          "y": 352
        },
        "label": "Lavender Town"
      }
    ]
  },
  "route_9": {
    "id": "route_9",
    "name": "Route 9",
    "tilemapKey": "route_9",
    "width": 2304,
    "height": 2592,
    "defaultSpawn": {
      "x": 80,
      "y": 432
    },
    "portals": [
      {
        "targetRoom": "cerulean_city",
        "trigger": {
          "x": 0,
          "y": 352,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 1440,
          "y": 576
        },
        "label": "Cerulean City"
      },
      {
        "targetRoom": "route_10",
        "trigger": {
          "x": 2272,
          "y": 416,
          "width": 32,
          "height": 128
        },
        "targetSpawn": {
          "x": 80,
          "y": 480
        },
        "label": "Route 10"
      }
    ]
  },
  "route_10": {
    "id": "route_10",
    "name": "Route 10",
    "tilemapKey": "route_10",
    "width": 960,
    "height": 2720,
    "defaultSpawn": {
      "x": 80,
      "y": 480
    },
    "portals": [
      {
        "targetRoom": "lavender_town",
        "trigger": {
          "x": 256,
          "y": 2688,
          "width": 160,
          "height": 32
        },
        "targetSpawn": {
          "x": 352,
          "y": 96
        },
        "label": "Lavender Town"
      },
      {
        "targetRoom": "route_9",
        "trigger": {
          "x": 0,
          "y": 416,
          "width": 32,
          "height": 128
        },
        "targetSpawn": {
          "x": 2208,
          "y": 480
        },
        "label": "Route 9"
      }
    ]
  },
  "route_11": {
    "id": "route_11",
    "name": "Route 11",
    "tilemapKey": "route_11",
    "width": 2304,
    "height": 2208,
    "defaultSpawn": {
      "x": 80,
      "y": 576
    },
    "portals": [
      {
        "targetRoom": "vermilion_city",
        "trigger": {
          "x": 0,
          "y": 512,
          "width": 32,
          "height": 160
        },
        "targetSpawn": {
          "x": 1600,
          "y": 576
        },
        "label": "Vermilion City"
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
