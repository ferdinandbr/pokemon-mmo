import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';
import LocalPlayer from '../entities/LocalPlayer';
import RemotePlayer from '../entities/RemotePlayer';
import { ROOMS_CONFIG } from '../maps/roomData';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });

    this.localPlayer = null;
    this.remotePlayers = new Map(); // socketId -> RemotePlayer
    this.currentRoomId = 'pallet_town';
    this.roomDef = null;
    this.obstacleGroup = null;
    this.currentTilemap = null;
    this.tilemapLayers = [];
    this.tiledCollisionLayers = [];
    this.isTransitioning = false;
    this.portalCooldown = 0;
    this.isChatting = false;
  }

  create() {
    // Setup physics static group for collisions
    this.obstacleGroup = this.physics.add.staticGroup();

    // Listen to network events
    SocketClient.on('player:init', (data) => this.handlePlayerInit(data));
    SocketClient.on('player:joined', (data) => this.handlePlayerJoined(data));
    SocketClient.on('player:moved', (data) => this.handlePlayerMoved(data));
    SocketClient.on('player:left', (data) => this.handlePlayerLeft(data));
    SocketClient.on('room:changed', (data) => this.handleRoomChanged(data));
    SocketClient.on('chat:message', (data) => this.handleChatMessage(data));
  }

  handlePlayerInit(data) {
    const { self, room, players } = data;
    this.currentRoomId = room.id;

    this.buildRoom(room.id);

    // Create Local Player
    if (this.localPlayer) {
      this.localPlayer.destroy();
    }

    this.localPlayer = new LocalPlayer(this, self.x, self.y, self);
    this.physics.add.collider(this.localPlayer, this.obstacleGroup);
    for (const colLayer of this.tiledCollisionLayers) {
      this.physics.add.collider(this.localPlayer, colLayer);
    }

    // Setup Camera based on current room bounds
    const boundsW = this.roomDef?.width || room.width;
    const boundsH = this.roomDef?.height || room.height;
    this.cameras.main.setBounds(0, 0, boundsW, boundsH);
    this.cameras.main.startFollow(this.localPlayer, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.75);

    // Clear old remote players
    this.clearRemotePlayers();

    // Add existing players in room
    for (const p of players) {
      this.addRemotePlayer(p);
    }

    // Update HUD
    this.updateHUD(room.name, self.name, data.money);
  }

  handleRoomChanged(data) {
    const { room, players, x, y } = data;
    this.currentRoomId = room.id;

    this.buildRoom(room.id);

    if (this.localPlayer) {
      this.localPlayer.setPosition(x, y);
      this.localPlayer.body.reset(x, y);
      this.physics.add.collider(this.localPlayer, this.obstacleGroup);
      for (const colLayer of this.tiledCollisionLayers) {
        this.physics.add.collider(this.localPlayer, colLayer);
      }
    }

    const boundsW = this.roomDef?.width || room.width;
    const boundsH = this.roomDef?.height || room.height;
    this.cameras.main.setBounds(0, 0, boundsW, boundsH);

    this.clearRemotePlayers();
    for (const p of players) {
      this.addRemotePlayer(p);
    }

    this.updateHUD(room.name);
    this.isTransitioning = false;
    this.portalCooldown = (this.time ? this.time.now : 0) + 1500;
  }

  handlePlayerJoined(playerData) {
    if (this.localPlayer && playerData.characterId === this.localPlayer.characterId) return;
    this.addRemotePlayer(playerData);
  }

  handlePlayerMoved(moveData) {
    const remote = this.remotePlayers.get(moveData.socketId);
    if (remote) {
      remote.updateTarget(moveData);
    }
  }

  handlePlayerLeft(data) {
    const remote = this.remotePlayers.get(data.socketId);
    if (remote) {
      remote.destroy();
      this.remotePlayers.delete(data.socketId);
    }
  }

  handleChatMessage(data) {
    if (data.channel === 'room') {
      // Find who sent it
      if (this.localPlayer && (data.sender === this.localPlayer.name || data.senderSocketId === SocketClient.socket?.id)) {
        this.localPlayer.showSpeechBubble(data.text);
      } else {
        for (const remote of this.remotePlayers.values()) {
          if (remote.name === data.sender || remote.socketId === data.senderSocketId) {
            remote.showSpeechBubble(data.text);
            break;
          }
        }
      }
    }
  }

  addRemotePlayer(playerData) {
    if (this.remotePlayers.has(playerData.socketId)) {
      this.remotePlayers.get(playerData.socketId).destroy();
    }

    const remote = new RemotePlayer(this, playerData.x, playerData.y, playerData);
    this.remotePlayers.set(playerData.socketId, remote);
  }

  clearRemotePlayers() {
    for (const remote of this.remotePlayers.values()) {
      remote.destroy();
    }
    this.remotePlayers.clear();
  }

  buildRoom(roomId) {
    // Clean up previous tilemap if exists
    if (this.currentTilemap) {
      this.currentTilemap.destroy();
      this.currentTilemap = null;
    }
    this.tilemapLayers = [];
    this.tiledCollisionLayers = [];

    // Clear existing static obstacles & graphics
    this.children.removeAll();
    this.obstacleGroup.clear(true, true);

    const room = ROOMS_CONFIG[roomId] || ROOMS_CONFIG.pallet_town;
    this.roomDef = { ...room };

    const tilemapKey = room.tilemap || roomId;
    if (this.cache.tilemap.has(tilemapKey)) {
      this.buildTiledRoom(tilemapKey, room);
    } else {
      this.buildProceduralRoom(room);
    }

    // Re-attach collider if localPlayer exists
    if (this.localPlayer) {
      this.physics.add.collider(this.localPlayer, this.obstacleGroup);
      for (const colLayer of this.tiledCollisionLayers) {
        this.physics.add.collider(this.localPlayer, colLayer);
      }
    }
  }

  buildTiledRoom(tilemapKey, roomConfig) {
    const map = this.make.tilemap({ key: tilemapKey });
    this.currentTilemap = map;

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.roomDef.width = mapWidth;
    this.roomDef.height = mapHeight;

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Bind tilesets
    const tilesetInstances = [];
    for (const ts of map.tilesets) {
      const textureKey = ts.name;
      if (this.textures.exists(textureKey)) {
        const inst = map.addTilesetImage(ts.name, textureKey);
        if (inst) tilesetInstances.push(inst);
      } else if (this.textures.exists('pokemon_tileset')) {
        const inst = map.addTilesetImage(ts.name, 'pokemon_tileset');
        if (inst) tilesetInstances.push(inst);
      }
    }

    // Process Tile Layers
    // Layer naming conventions for Shipairtime/Pokemon-Kanto-Tiled-Maps:
    //   Ground, Shore, Paths → base ground (depth 0..N, no collision)
    //   Water                → impassable (collision all tiles)
    //   Objects              → decorative objects above ground (overhead)
    //   Buildings            → solid structures (overhead + collision)
    //   Trees                → overhead canopy (overhead, no collision body on layer)
    for (let i = 0; i < map.layers.length; i++) {
      const layerData = map.layers[i];
      const layerName = layerData.name;
      const layer = map.createLayer(layerName, tilesetInstances, 0, 0);
      if (!layer) continue;

      this.tilemapLayers.push(layer);

      // Read optional Tiled custom properties
      const props = {};
      if (layerData.properties) {
        if (Array.isArray(layerData.properties)) {
          layerData.properties.forEach(p => (props[p.name] = p.value));
        } else {
          Object.assign(props, layerData.properties);
        }
      }

      // Overhead: renders above the player sprite
      const isOverhead =
        props.overhead === true ||
        props.depth === 'above' ||
        /^(Trees|Buildings|Objects)$/i.test(layerName) ||
        /overhead|above|roof|treetop|top|ceiling/i.test(layerName);

      // Collision: all non-empty tiles block movement
      const isCollisionLayer =
        props.collides === true ||
        /^(Water)$/i.test(layerName) ||
        /collision|obstacle|wall/i.test(layerName);

      // Depth assignment
      if (isOverhead) {
        layer.setDepth(10000 + i);
      } else {
        layer.setDepth(i);
      }

      // Apply tile collisions
      if (isCollisionLayer) {
        // All non-empty tiles in this layer are solid
        layer.setCollisionByExclusion([-1, 0]);
        this.tiledCollisionLayers.push(layer);
      } else {
        // Only tiles with explicit collides property set to true
        layer.setCollisionByProperty({ collides: true });
      }
    }

    // Process Object Layers (Collisions, Portals, Spawns)
    if (map.objects) {
      for (const objGroup of map.objects) {
        const groupName = objGroup.name.toLowerCase();

        // 1. Collisions Object Layer
        if (groupName.includes('collision') || groupName.includes('obstacle')) {
          for (const obj of objGroup.objects) {
            const obsBox = this.add.zone(
              obj.x + obj.width / 2,
              obj.y + obj.height / 2,
              obj.width,
              obj.height
            );
            this.physics.add.existing(obsBox, true);
            this.obstacleGroup.add(obsBox);
          }
        }

        // 2. Portals Object Layer
        if (groupName.includes('portal') || groupName.includes('warp') || groupName.includes('door')) {
          const portals = [];
          for (const obj of objGroup.objects) {
            const props = {};
            if (obj.properties) {
              if (Array.isArray(obj.properties)) {
                obj.properties.forEach(p => (props[p.name] = p.value));
              } else {
                Object.assign(props, obj.properties);
              }
            }

            const targetRoom = props.targetRoom || obj.name;
            const targetSpawnX = props.targetSpawnX !== undefined ? props.targetSpawnX : (props.targetX || 400);
            const targetSpawnY = props.targetSpawnY !== undefined ? props.targetSpawnY : (props.targetY || 400);
            const label = props.label || obj.name || '';

            portals.push({
              targetRoom,
              trigger: { x: obj.x, y: obj.y, width: obj.width, height: obj.height },
              targetSpawn: { x: targetSpawnX, y: targetSpawnY },
              label
            });

            if (label) {
              this.add.text(obj.x + obj.width / 2, obj.y + obj.height / 2, label, {
                fontFamily: "'Outfit', sans-serif",
                fontSize: '10px',
                fontWeight: '700',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
              }).setOrigin(0.5, 0.5).setDepth(10005);
            }
          }

          if (portals.length > 0) {
            this.roomDef.portals = portals;
          }
        }

        // 3. Spawns Object Layer
        if (groupName.includes('spawn')) {
          const defSpawn = objGroup.objects.find(o => o.name === 'default_spawn' || o.type === 'spawn') || objGroup.objects[0];
          if (defSpawn) {
            this.roomDef.defaultSpawn = { x: defSpawn.x, y: defSpawn.y };
          }
        }
      }
    }

    // Fallback portals from roomConfig if not in Tiled objects
    if (!this.roomDef.portals || this.roomDef.portals.length === 0) {
      this.roomDef.portals = roomConfig.portals || [];
      for (const portal of this.roomDef.portals) {
        const trig = portal.trigger;
        if (portal.label) {
          this.add.text(trig.x + trig.width / 2, trig.y + trig.height / 2, portal.label, {
            fontFamily: "'Outfit', sans-serif",
            fontSize: '10px',
            fontWeight: '700',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
          }).setOrigin(0.5, 0.5).setDepth(10005);
        }
      }
    }

    // Static obstacles from roomConfig (for maps without Tiled collision object layer)
    if (roomConfig.obstacles && roomConfig.obstacles.length > 0) {
      for (const obs of roomConfig.obstacles) {
        const obsBox = this.add.zone(
          obs.x + obs.width / 2,
          obs.y + obs.height / 2,
          obs.width,
          obs.height
        );
        this.physics.add.existing(obsBox, true);
        this.obstacleGroup.add(obsBox);
      }
    }
  }

  buildProceduralRoom(room) {
    this.physics.world.setBounds(0, 0, room.width, room.height);

    // 1. Ground Layer
    const groundGfx = this.add.graphics();
    groundGfx.fillStyle(Phaser.Display.Color.HexStringToColor(room.backgroundColor).color, 1);
    groundGfx.fillRect(0, 0, room.width, room.height);
    groundGfx.setDepth(0);

    // Tiles grid texture overlay
    if (room.theme === 'outdoor') {
      const tileCols = Math.ceil(room.width / 32);
      const tileRows = Math.ceil(room.height / 32);
      for (let r = 0; r < tileRows; r++) {
        for (let c = 0; c < tileCols; c++) {
          if ((r + c) % 3 === 0) {
            this.add.image(c * 32 + 16, r * 32 + 16, 'tile_grass').setDepth(1);
          }
        }
      }
    } else {
      // Indoor floor pattern
      const floorGfx = this.add.graphics();
      floorGfx.lineStyle(1, 0x8a6038, 0.4);
      for (let x = 60; x < room.width - 60; x += 32) {
        floorGfx.lineBetween(x, 60, x, room.height - 40);
      }
      for (let y = 60; y < room.height - 40; y += 32) {
        floorGfx.lineBetween(60, y, room.width - 60, y);
      }
      floorGfx.setDepth(2);
    }

    // 2. Roads
    if (room.roads) {
      for (const road of room.roads) {
        const roadGfx = this.add.graphics();
        roadGfx.fillStyle(0xd0b880, 1);
        roadGfx.fillRect(road.x, road.y, road.width, road.height);
        // Border detail
        roadGfx.fillStyle(0xb8a068, 0.7);
        roadGfx.fillRect(road.x, road.y, road.width, 3);
        roadGfx.fillRect(road.x, road.y + road.height - 3, road.width, 3);
        roadGfx.setDepth(2);
      }
    }

    // 3. Tall Grass
    if (room.tallGrass) {
      for (const grass of room.tallGrass) {
        const cols = Math.floor(grass.width / 32);
        const rows = Math.floor(grass.height / 32);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            this.add.image(grass.x + c * 32 + 16, grass.y + r * 32 + 16, 'tile_tall_grass').setDepth(3);
          }
        }
      }
    }

    // 4. Obstacles & Buildings
    for (const obs of room.obstacles) {
      const obstacleBox = this.add.zone(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width, obs.height);
      this.physics.add.existing(obstacleBox, true);
      this.obstacleGroup.add(obstacleBox);

      // Render Visual representation
      const obsGfx = this.add.graphics();
      if (obs.type === 'house') {
        this.renderHouse(obs.x, obs.y, obs.width, obs.height, obs.label, 0xd32f2f);
      } else if (obs.type === 'lab') {
        this.renderLab(obs.x, obs.y, obs.width, obs.height, obs.label);
      } else if (obs.type === 'pokecenter') {
        this.renderHouse(obs.x, obs.y, obs.width, obs.height, obs.label, 0xe53935);
      } else if (obs.type === 'pokemart') {
        this.renderHouse(obs.x, obs.y, obs.width, obs.height, obs.label, 0x1e88e5);
      } else if (obs.type === 'gym') {
        this.renderHouse(obs.x, obs.y, obs.width, obs.height, obs.label, 0x546e7a);
      } else if (obs.type === 'water') {
        this.renderWater(obs.x, obs.y, obs.width, obs.height);
      } else if (obs.type === 'bookshelf') {
        this.renderBookshelf(obs.x, obs.y, obs.width, obs.height);
      } else if (obs.type === 'lab_table') {
        this.renderLabTable(obs.x, obs.y, obs.width, obs.height);
      } else if (obs.type === 'computer') {
        this.renderComputer(obs.x, obs.y, obs.width, obs.height);
      } else if (obs.type === 'fence') {
        for (let fx = obs.x; fx < obs.x + obs.width; fx += 32) {
          this.add.image(fx + 16, obs.y + 8, 'tile_fence').setDepth(obs.y);
        }
      } else if (obs.type === 'ledge') {
        obsGfx.fillStyle(0x408030, 1);
        obsGfx.fillRoundedRect(obs.x, obs.y, obs.width, obs.height, 4);
        obsGfx.setDepth(4);
      } else {
        // Border tree walls
        if (room.theme === 'outdoor') {
          for (let tx = obs.x; tx < obs.x + obs.width; tx += 48) {
            for (let ty = obs.y; ty < obs.y + obs.height; ty += 48) {
              this.add.image(tx + 24, ty + 24, 'tile_tree').setDepth(ty + 24);
            }
          }
        } else {
          // Lab walls
          obsGfx.fillStyle(0x5c4228, 1);
          obsGfx.fillRect(obs.x, obs.y, obs.width, obs.height);
          obsGfx.setDepth(obs.y + obs.height);
        }
      }
    }

    // 5. Decorations
    if (room.decorations) {
      for (const dec of room.decorations) {
        if (dec.type === 'flower') {
          this.add.image(dec.x, dec.y, 'tile_flower').setDepth(4);
        } else if (dec.type === 'sign') {
          this.add.image(dec.x, dec.y, 'tile_sign').setDepth(dec.y);
        } else if (dec.type === 'carpet') {
          const carpetGfx = this.add.graphics();
          carpetGfx.fillStyle(0xcc3333, 0.9);
          carpetGfx.fillRoundedRect(dec.x, dec.y, dec.width, dec.height, 8);
          carpetGfx.lineStyle(2, 0xffcc00, 0.8);
          carpetGfx.strokeRoundedRect(dec.x, dec.y, dec.width, dec.height, 8);
          carpetGfx.setDepth(3);
        }
      }
    }

    // 6. Portals Markers
    for (const portal of room.portals) {
      const trig = portal.trigger;
      const portalGfx = this.add.graphics();
      portalGfx.fillStyle(0xffeb3b, 0.25);
      portalGfx.fillRoundedRect(trig.x, trig.y, trig.width, trig.height, 6);
      portalGfx.lineStyle(2, 0xffeb3b, 0.7);
      portalGfx.strokeRoundedRect(trig.x, trig.y, trig.width, trig.height, 6);
      portalGfx.setDepth(5);

      if (portal.label) {
        this.add.text(trig.x + trig.width / 2, trig.y + trig.height / 2, portal.label, {
          fontFamily: "'Outfit', sans-serif",
          fontSize: '10px',
          fontWeight: '700',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5, 0.5).setDepth(6);
      }
    }
  }

  renderHouse(x, y, w, h, label, roofColor) {
    const gfx = this.add.graphics();
    // Roof (Gabled)
    gfx.fillStyle(roofColor, 1);
    gfx.fillRoundedRect(x, y, w, h * 0.45, 8);
    // Walls
    gfx.fillStyle(0xf0eee4, 1);
    gfx.fillRect(x + 10, y + h * 0.45, w - 20, h * 0.55);
    // Door
    gfx.fillStyle(0x795548, 1);
    gfx.fillRect(x + w / 2 - 16, y + h - 36, 32, 36);
    // Windows
    gfx.fillStyle(0x81d4fa, 1);
    gfx.fillRect(x + 24, y + h * 0.55, 24, 24);
    gfx.fillRect(x + w - 48, y + h * 0.55, 24, 24);
    gfx.setDepth(y + h);

    if (label) {
      this.add.text(x + w / 2, y + h * 0.25, label, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '11px',
        fontWeight: '700',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5, 0.5).setDepth(y + h + 1);
    }
  }

  renderLab(x, y, w, h, label) {
    const gfx = this.add.graphics();
    // Modern White/Blue Lab Roof
    gfx.fillStyle(0x37474f, 1);
    gfx.fillRoundedRect(x, y, w, h * 0.4, 6);
    // Main Structure
    gfx.fillStyle(0xe0e0e0, 1);
    gfx.fillRect(x + 8, y + h * 0.4, w - 16, h * 0.6);
    // Blue Glass Sliding Door
    gfx.fillStyle(0x0288d1, 1);
    gfx.fillRect(x + w / 2 - 20, y + h - 40, 40, 40);
    // Antenna / Dish on roof
    gfx.fillStyle(0x90a4ae, 1);
    gfx.fillRect(x + 30, y - 10, 8, 14);
    gfx.fillCircle(x + 34, y - 12, 8);
    gfx.setDepth(y + h);

    if (label) {
      this.add.text(x + w / 2, y + h * 0.2, label, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '11px',
        fontWeight: '700',
        color: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5, 0.5).setDepth(y + h + 1);
    }
  }

  renderWater(x, y, w, h) {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x3878b8, 0.95);
    gfx.fillRoundedRect(x, y, w, h, 12);
    gfx.lineStyle(3, 0x205080, 1);
    gfx.strokeRoundedRect(x, y, w, h, 12);
    // Waves
    gfx.fillStyle(0x60b0f0, 0.6);
    gfx.fillRect(x + 20, y + 25, 40, 4);
    gfx.fillRect(x + 80, y + 70, 50, 4);
    gfx.fillRect(x + 30, y + 100, 60, 4);
    gfx.setDepth(3);
  }

  renderBookshelf(x, y, w, h) {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x5d4037, 1);
    gfx.fillRect(x, y, w, h);
    // Rows of books
    const colors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xfbc02d];
    for (let by = y + 8; by < y + h - 8; by += 16) {
      for (let bx = x + 6; bx < x + w - 12; bx += 10) {
        gfx.fillStyle(colors[(bx * 3 + by) % colors.length], 1);
        gfx.fillRect(bx, by, 8, 12);
      }
    }
    gfx.setDepth(y + h);
  }

  renderLabTable(x, y, w, h) {
    const gfx = this.add.graphics();
    // Metal research table
    gfx.fillStyle(0x78909c, 1);
    gfx.fillRoundedRect(x, y, w, h, 6);
    // Three Pokéball capsules!
    const balls = [x + w * 0.25, x + w * 0.5, x + w * 0.75];
    for (const bx of balls) {
      gfx.fillStyle(0xd32f2f, 1);
      gfx.fillCircle(bx, y + h / 2, 7);
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(bx, y + h / 2 + 2, 4);
      gfx.fillStyle(0x000000, 1);
      gfx.fillCircle(bx, y + h / 2, 2);
    }
    gfx.setDepth(y + h);
  }

  renderComputer(x, y, w, h) {
    const gfx = this.add.graphics();
    gfx.fillStyle(0x455a64, 1);
    gfx.fillRect(x, y, w, h);
    // Glowing monitor
    gfx.fillStyle(0x00e676, 0.9);
    gfx.fillRect(x + 8, y + 10, w - 16, h * 0.4);
    gfx.setDepth(y + h);
  }

  update(time, delta) {
    if (this.localPlayer) {
      this.localPlayer.update(time);

      // Check portal overlap
      if (!this.isTransitioning && time > this.portalCooldown && this.roomDef && this.roomDef.portals) {
        for (const portal of this.roomDef.portals) {
          const trig = portal.trigger;
          if (
            this.localPlayer.x >= trig.x &&
            this.localPlayer.x <= trig.x + trig.width &&
            this.localPlayer.y >= trig.y &&
            this.localPlayer.y <= trig.y + trig.height
          ) {
            this.isTransitioning = true;
            this.portalCooldown = time + 2000;
            SocketClient.changeRoom(portal.targetRoom, portal.targetSpawn.x, portal.targetSpawn.y);
            break;
          }
        }
      }
    }

    // Update remote players
    for (const remote of this.remotePlayers.values()) {
      remote.update();
    }
  }

  updateHUD(roomName, playerName = null, money = null) {
    const roomBadge = document.getElementById('hud-room-name');
    if (roomBadge) roomBadge.innerText = roomName;

    if (playerName) {
      const pName = document.getElementById('hud-player-name');
      if (pName) pName.innerText = playerName;
    }

    if (typeof money === 'number') {
      const moneyBadge = document.getElementById('hud-money');
      if (moneyBadge) moneyBadge.innerText = money.toLocaleString('pt-BR');
    }
  }
}
