import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';
import LocalPlayer from '../entities/LocalPlayer';
import RemotePlayer from '../entities/RemotePlayer';
import DialogueBox from '../ui/DialogueBox';
import TallGrassManager from '../entities/TallGrassManager';
import { ROOMS_CONFIG } from '../maps/roomData';
import { COLLISION_TYPES } from '../maps/collisionConfig';
import DayNightManager from '../systems/DayNightManager';
import WaterAnimationManager from '../systems/WaterAnimationManager';
import FlowerAnimationManager from '../systems/FlowerAnimationManager';
import WeatherManager from '../systems/WeatherManager';
import FollowerPokemon from '../entities/FollowerPokemon';
import bgmManager from '../audio/BGMManager';

const LAYER_DEPTHS = {
  Ground: 10,
  Paths: 20,
  Grass: 30,
  Water: 40,
  Shore: 45,
  Mountain: 50,
  Mountains: 50,
  Objects: 60,
  Buildings: 70,
  Building: 70,
  Trees: 80,
  Collision: 90000,
  Overhead: 1000,
  Arch: 1000
};

const COLLISION_LAYERS = [
  'Buildings',
  'Building',
  'Shore',
  'Trees',
  'Water',
  'Mountain',
  'Mountains',
  'Collision'
];


export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });

    this.currentRoom = ROOMS_CONFIG.pallet_town;
    this.localPlayer = null;
    this.localFollower = null;
    this.remotePlayers = new Map(); // socketId -> RemotePlayer
    this.remoteFollowers = new Map(); // socketId -> FollowerPokemon

    this.currentMap = null;
    this.mapLayers = new Map();
    this.collisionLayers = [];

    this.obstacleGroup = null;
    this.zones = [];
    this.currentZone = null;

    this.isTransitioning = false;
    this.portalCooldown = 0;
    this.isChatting = false;
    this.activeColliders = [];

    // Dialogue & Sign system
    this.dialogueBox = new DialogueBox();
    this._signs = [];
    this.nearbySign = null;

    // Tall grass immersion & rustle system
    this.tallGrassManager = new TallGrassManager(this);
  }

  // ─── Network handlers ──────────────────────────────────────────────────────

  create() {
    this.obstacleGroup = this.physics.add.staticGroup();

    // Day & Night cycle system
    this.dayNightManager = new DayNightManager(this);

    // Water wave tile animation system
    this.waterAnimationManager = new WaterAnimationManager(this);

    // Flower swaying tile animation system (Gen 3 / FireRed authentic)
    this.flowerAnimationManager = new FlowerAnimationManager(this);

    // Dynamic Weather system (Rain, Storm, Snow, Fog, Sunny, Sandstorm)
    this.weatherManager = new WeatherManager(this);
    window.setWeather = (type) => this.weatherManager?.setWeather(type);

    this.events.on('shutdown', () => {
      window.setWeather = null;
      if (this.dayNightManager) {
        this.dayNightManager.destroy();
        this.dayNightManager = null;
      }
      if (this.waterAnimationManager) {
        this.waterAnimationManager.destroy();
        this.waterAnimationManager = null;
      }
      if (this.flowerAnimationManager) {
        this.flowerAnimationManager.destroy();
        this.flowerAnimationManager = null;
      }
      if (this.weatherManager) {
        this.weatherManager.destroy();
        this.weatherManager = null;
      }
    });

    // Clean up any legacy interact prompt if in DOM
    document.getElementById('interact-prompt')?.remove();

    // Clear keyboard captures so spacebar works properly everywhere
    this.input.keyboard.clearCaptures();

    // Interaction key listeners (Enter, Space, E)
    this.input.keyboard.on('keydown-ENTER', () => this._handleInteract());
    this.input.keyboard.on('keydown-SPACE', () => this._handleInteract());
    this.input.keyboard.on('keydown-E', () => this._handleInteract());

    // Mouse click interaction on map (clicking directly on a sign tile to open dialogue)
    this.input.on('pointerdown', (pointer) => {
      if (this.dialogueBox && this.dialogueBox.isOpen) {
        this.dialogueBox.advance();
        return;
      }

      if (!pointer.leftButtonDown()) return;

      const worldPoint = pointer.positionToCamera(this.cameras.main);
      if (this._signs && this._signs.length > 0) {
        for (const sign of this._signs) {
          const sw = sign.width || 32;
          const sh = sign.height || 32;
          // Click hit test on sign tile (with 6px margin for easy clicking)
          if (worldPoint.x >= sign.x - 6 && worldPoint.x <= sign.x + sw + 6 &&
            worldPoint.y >= sign.y - 6 && worldPoint.y <= sign.y + sh + 6) {
            // Check player proximity (allow within 96px)
            if (this.localPlayer) {
              const px = this.localPlayer.x;
              const py = this.localPlayer.y;
              const cx = sign.x + sw / 2;
              const cy = sign.y + sh / 2;
              const dist = Phaser.Math.Distance.Between(px, py, cx, cy);
              if (dist <= 96) {
                this.nearbySign = sign;
                this._handleInteract();
                return;
              }
            }
          }
        }
      }
    });

    // Window-level fallback for Space, Enter, E to ensure it reliably triggers when near a sign
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        return;
      }
      if (this.isChatting) return;
      if (document.body.classList.contains('editor-mode')) return;

      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'e' || k === 'enter') {
        if (this.dialogueBox && this.dialogueBox.isOpen) {
          e.preventDefault();
          this.dialogueBox.advance();
          return;
        }
        if (this.nearbySign) {
          e.preventDefault();
          this._handleInteract();
        }
      }
    });

    SocketClient.on('player:init', (d) => this.onPlayerInit(d));
    SocketClient.on('player:joined', (d) => this.onPlayerJoined(d));
    SocketClient.on('player:moved', (d) => this.onPlayerMoved(d));
    SocketClient.on('player:left', (d) => this.onPlayerLeft(d));
    SocketClient.on('player:buddy_updated', (d) => this.onBuddyUpdated(d));
    SocketClient.on('room:changed', (d) => this.onRoomChanged(d));
    SocketClient.on('chat:message', (d) => this.onChatMessage(d));
    SocketClient.on('world:weather', (d) => this.onWorldWeather(d));
    SocketClient.on('world:time', (d) => this.onWorldTime(d));
    SocketClient.on('money:updated', (d) => this.onMoneyUpdated(d));

    // Snap player position to exact integer pixels after physics update to eliminate subpixel rendering jitter
    this.events.on('postupdate', () => {
      if (this.localPlayer) {
        this.localPlayer.x = Math.round(this.localPlayer.x);
        this.localPlayer.y = Math.round(this.localPlayer.y);
      }
    });

    // Render initial avatar face on HUD
    this._drawAvatarFace('boy_run');
  }

  onWorldWeather(data) {
    if (!data) return;
    this.serverWeather = data.weather;
    const roomWeather = this.currentRoom?.weather || data.weather || 'clear';
    if (this.weatherManager) {
      this.weatherManager.setWeather(roomWeather);
    }
  }

  onWorldTime(data) {
    if (!data) return;
    if (this.dayNightManager) {
      this.dayNightManager.syncWithServer(data);
    }
  }

  onMoneyUpdated(data) {
    if (!data || typeof data.money !== 'number') return;
    this.currentMoney = data.money;
    this._updateHUD(null, null, data.money);
  }

  onPlayerInit(data) {
    const { self, room, players } = data;
    const roomId = room?.id || self?.roomId || 'pallet_town';
    this.currentRoom = ROOMS_CONFIG[roomId] || room || ROOMS_CONFIG.pallet_town;

    this.buildMap();

    if (this.localPlayer) this.localPlayer.destroy();
    this.localPlayer = new LocalPlayer(this, self.x, self.y, self);
    this.localPlayer.setDepth(100 + self.y / 10000);
    this._attachPlayerColliders(this.localPlayer);

    const w = this.currentMap?.widthInPixels || this.currentRoom.width || 1152;
    const h = this.currentMap?.heightInPixels || this.currentRoom.height || 640;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 1, 1);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.0);

    if (self.activeBuddy) {
      if (this.localFollower) this.localFollower.destroy();
      this.localFollower = new FollowerPokemon(this, this.localPlayer, self.activeBuddy);
    }

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(this.currentRoom.name || room.name, self.name, data.money, self);

    // Apply authoritative server world state (weather & day/night)
    if (data.worldState) {
      if (data.worldState.weather) this.onWorldWeather(data.worldState.weather);
      if (data.worldState.time) this.onWorldTime(data.worldState.time);
    } else if (this.weatherManager) {
      this.weatherManager.setWeather(this.currentRoom.weather || 'clear');
    }

    // Play regional background music if intro already completed
    if (data.hasCompletedIntro !== false) {
      bgmManager.playForRoom(roomId);
    }
  }

  onRoomChanged(data) {
    const { room, players, x, y } = data;
    const roomId = room?.id || 'pallet_town';
    this.currentRoom = ROOMS_CONFIG[roomId] || room || ROOMS_CONFIG.pallet_town;

    this.buildMap();
    bgmManager.playForRoom(roomId);

    if (this.localPlayer) {
      this.localPlayer.setPosition(x, y);
      if (this.localPlayer.body) {
        this.localPlayer.body.reset(x, y);
        this.localPlayer.body.setVelocity(0, 0);
      }
      this.localPlayer.lastX = x;
      this.localPlayer.lastY = y;
      this.localPlayer.setDepth(100 + y / 10000);
      this._attachPlayerColliders(this.localPlayer);
    }

    const w = this.currentMap?.widthInPixels || this.currentRoom.width || 1152;
    const h = this.currentMap?.heightInPixels || this.currentRoom.height || 640;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 1, 1);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.0);

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(this.currentRoom.name || room.name);
    const finalWeather = this.currentRoom.weather || this.serverWeather || 'clear';
    if (this.weatherManager) {
      this.weatherManager.setWeather(finalWeather);
    }
    this.isTransitioning = false;
    this.portalCooldown = (this.time?.now ?? 0) + 1500;
  }

  onPlayerJoined(playerData) {
    if (this.localPlayer && playerData.characterId === this.localPlayer.characterId) return;
    this._addRemotePlayer(playerData);
  }

  onPlayerMoved(moveData) {
    const remote = this.remotePlayers.get(moveData.socketId);
    if (remote) remote.updateTarget(moveData);
  }

  onPlayerLeft(data) {
    const remote = this.remotePlayers.get(data.socketId);
    if (remote) {
      remote.destroy();
      this.remotePlayers.delete(data.socketId);
    }
    const follower = this.remoteFollowers.get(data.socketId);
    if (follower) {
      follower.destroy();
      this.remoteFollowers.delete(data.socketId);
    }
  }

  onBuddyUpdated(data) {
    const { socketId, buddy } = data || {};
    const isLocal = SocketClient.socket?.id === socketId;

    if (isLocal) {
      if (!buddy) {
        if (this.localFollower) {
          this.localFollower.destroy();
          this.localFollower = null;
        }
      } else if (this.localFollower) {
        this.localFollower.updateBuddy(buddy);
      } else if (this.localPlayer) {
        this.localFollower = new FollowerPokemon(this, this.localPlayer, buddy);
      }
    } else {
      const remote = this.remotePlayers.get(socketId);
      if (!buddy) {
        const follower = this.remoteFollowers.get(socketId);
        if (follower) {
          follower.destroy();
          this.remoteFollowers.delete(socketId);
        }
      } else if (this.remoteFollowers.has(socketId)) {
        this.remoteFollowers.get(socketId).updateBuddy(buddy);
      } else if (remote) {
        const follower = new FollowerPokemon(this, remote, buddy);
        this.remoteFollowers.set(socketId, follower);
      }
    }
  }

  onChatMessage(data) {
    if (data.channel !== 'room') return;
    const isLocal =
      this.localPlayer &&
      (data.sender === this.localPlayer.name ||
        data.senderSocketId === SocketClient.socket?.id);

    if (isLocal) {
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

  // ─── Map building ──────────────────────────────────────────────────────────

  buildMap() {
    // 1. Clean up active colliders from previous map so Arcade Physics doesn't query destroyed layers
    if (this.activeColliders && this.activeColliders.length > 0) {
      for (const collider of this.activeColliders) {
        if (collider && collider.destroy) {
          collider.destroy();
        }
      }
    }
    this.activeColliders = [];

    // 2. Destroy previous map assets
    if (this.tallGrassManager) {
      this.tallGrassManager.clear();
    }
    if (this.currentMap) {
      this.currentMap.destroy();
      this.currentMap = null;
    }
    this.mapLayers.clear();
    this.collisionLayers = [];

    if (this.obstacleGroup) {
      this.obstacleGroup.clear(true, true);
    }

    // ── Create Tiled map ──
    const mapKey = this.currentRoom?.tilemapKey || this.currentRoom?.id || 'pallet_town';
    const map = this.make.tilemap({ key: mapKey });
    this.currentMap = map;

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ── Bind all tilesets dynamically ──
    const tilesetList = [];
    if (map.tilesets && map.tilesets.length > 0) {
      for (const t of map.tilesets) {
        const ts = map.addTilesetImage(t.name, t.name, 32, 32, 1, 2);
        if (ts) tilesetList.push(ts);
      }
    }
    if (tilesetList.length === 0) {
      const defaultTs = map.addTilesetImage('Outside1 Spring', 'Outside1 Spring', 32, 32, 1, 2);
      if (defaultTs) tilesetList.push(defaultTs);
    }

    // ── Build all tile layers in defined stack order ──
    if (map.layers && map.layers.length > 0) {
      for (const layerData of map.layers) {
        const layerName = layerData.name;
        const layer = map.createLayer(layerName, tilesetList, 0, 0);
        if (!layer) continue;

        let depth = null;
        if (layerData.properties) {
          if (Array.isArray(layerData.properties)) {
            const p = layerData.properties.find(x => x.name === 'depth');
            if (p) depth = Number(p.value);
          } else if (typeof layerData.properties === 'object' && layerData.properties.depth !== undefined) {
            depth = Number(layerData.properties.depth);
          }
        }
        if (depth === null || isNaN(depth)) {
          depth = LAYER_DEPTHS[layerName] ?? 50;
        }
        layer.setDepth(depth);

        if (layerName === 'Trees') {
          // Separate tree tops / canopies into a dedicated swaying layer
          // so only the tree tops sway in the wind while trunks stay 100% stationary.
          // In the base 'Trees' layer, we keep the tiles but hide them (alpha = 0)
          // so that physics collision remains 100% solid and stationary across all tree tiles!
          const TREE_CANOPY_GIDS = new Set([
            689, 690, 691, 692, 693, 694, 697, 698, 699, 700,
            735, 751, 1631, 1632, 1633, 1634
          ]);
          const canopyLayer = map.createBlankLayer('Trees_Canopy', tilesetList, 0, 0);
          if (canopyLayer) {
            canopyLayer.setDepth(depth);
            const w = map.width;
            const h = map.height;
            for (let ty = 0; ty < h; ty++) {
              for (let tx = 0; tx < w; tx++) {
                const tile = layer.getTileAt(tx, ty);
                if (tile && TREE_CANOPY_GIDS.has(tile.index)) {
                  canopyLayer.putTileAt(tile.index, tx, ty);
                  // Hide tile in base layer so it isn't rendered twice, but keep it in layer for solid collision
                  tile.alpha = 0;
                  tile.setVisible(false);
                }
              }
            }
            this.mapLayers.set('Trees_Canopy', canopyLayer);
          }
        }

        // Check if this layer has collision enabled
        if (layerName === 'Collision') {
          // Explicit collision mask: only solid walls and ledges collide; WALKABLE_OVERRIDE (6) is non-collidable
          layer.setCollision([
            COLLISION_TYPES.SOLID,
            COLLISION_TYPES.LEDGE_DOWN,
            COLLISION_TYPES.LEDGE_LEFT,
            COLLISION_TYPES.LEDGE_RIGHT,
            COLLISION_TYPES.LEDGE_UP
          ]);
          layer.setVisible(false);
          this.collisionLayers.push(layer);
        } else if (COLLISION_LAYERS.includes(layerName)) {
          layer.setCollisionByExclusion([-1, 0]);
          this.collisionLayers.push(layer);
        }

        this.mapLayers.set(layerName, layer);
      }
    }

    // ── Apply Walkable Overrides from Collision Layer (doorways, erased tiles, paths) ──
    const colLayer = this.mapLayers.get('Collision');
    if (colLayer) {
      const mapW = map.width;
      const mapH = map.height;
      for (let ty = 0; ty < mapH; ty++) {
        for (let tx = 0; tx < mapW; tx++) {
          const colTile = colLayer.getTileAt(tx, ty);
          if (colTile && colTile.index === COLLISION_TYPES.WALKABLE_OVERRIDE) {
            // Force walkable across all collidable layers at this coordinate
            for (const cLayer of this.collisionLayers) {
              const t = cLayer.getTileAt(tx, ty);
              if (t) {
                t.setCollision(false, false, false, false);
              }
            }
          }
        }
      }
    }

    // ── Setup Tall Grass Layer ──
    if (this.tallGrassManager) {
      this.tallGrassManager.setLayer(this.mapLayers.get('Grass'));
    }

    // ── Object layers ──
    this._loadZones(map);
    this._loadPortals(map);
    this._loadSigns(map);
  }

  _loadZones(map) {
    this.zones = [];
    const zonesLayer = map.getObjectLayer('Zones');
    if (!zonesLayer) return;

    for (const obj of zonesLayer.objects) {
      this.zones.push({
        name: obj.name,
        bounds: new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width, obj.height)
      });
    }
  }

  _loadPortals(map) {
    const portalLayer =
      map.getObjectLayer('Portals') ||
      map.getObjectLayer('Warps') ||
      map.getObjectLayer('Doors');

    if (portalLayer) {
      this._portals = portalLayer.objects.map(obj => {
        const props = this._readProps(obj.properties);
        return {
          targetRoom: props.targetRoom || obj.name || this.currentRoom.id,
          targetSpawn: { x: props.targetX ?? obj.x, y: props.targetY ?? obj.y },
          trigger: { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
        };
      });
    } else {
      this._portals = this.currentRoom?.portals || [];
    }
  }

  _loadSigns(map) {
    this._signs = [];
    if (!map.objects) return;

    for (const layer of map.objects) {
      if (!layer || !layer.objects) continue;
      for (const obj of layer.objects) {
        const props = this._readProps(obj.properties);
        const isSign = obj.type === 'sign' ||
          layer.name === 'Points of interest' ||
          layer.name === 'Signs' ||
          props.dialogue ||
          (props.text && (props.title || obj.name));
        if (isSign) {
          const title = props.title || obj.name || 'PLACA';
          const text = props.text || props.dialogue || '';
          this._signs.push({
            x: obj.x,
            y: obj.y,
            width: obj.width || 32,
            height: obj.height || 32,
            title,
            text
          });
        }
      }
    }
  }

  _handleInteract() {
    // If typing in an input field or chat is open, do nothing
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }
    if (this.isChatting) return;

    if (this.dialogueBox) {
      if (this.dialogueBox.isOpen) {
        this.dialogueBox.advance();
        return;
      }
      if (this.dialogueBox.justClosed) {
        return;
      }
    }

    if (this.nearbySign) {
      this.dialogueBox.show(this.nearbySign.title, this.nearbySign.text);
    }
  }

  _readProps(properties) {
    if (!properties) return {};
    if (Array.isArray(properties)) {
      return Object.fromEntries(properties.map(p => [p.name, p.value]));
    }
    return { ...properties };
  }

  getCollisionAt(tileX, tileY) {
    if (!this.currentMap) return COLLISION_TYPES.NONE;
    if (tileX < 0 || tileX >= this.currentMap.width || tileY < 0 || tileY >= this.currentMap.height) {
      return COLLISION_TYPES.SOLID;
    }

    const collisionLayer = this.mapLayers.get('Collision');
    if (collisionLayer) {
      const tile = collisionLayer.getTileAt(tileX, tileY);
      if (tile && tile.index > 0) {
        return tile.index;
      }
    }
    return COLLISION_TYPES.NONE;
  }

  isTileWalkable(tileX, tileY) {
    if (!this.currentMap) return false;
    if (tileX < 0 || tileX >= this.currentMap.width || tileY < 0 || tileY >= this.currentMap.height) {
      return false;
    }

    // 1. Check Collision layer
    const colType = this.getCollisionAt(tileX, tileY);
    if (colType === COLLISION_TYPES.WALKABLE_OVERRIDE) {
      // Collision was explicitly erased / marked as passable on this tile: bypass layer collision!
      return true;
    }
    if (colType !== COLLISION_TYPES.NONE) {
      return false;
    }

    // 2. Check other COLLISION_LAYERS
    for (const layerName of COLLISION_LAYERS) {
      if (layerName === 'Collision') continue;
      const layer = this.mapLayers.get(layerName);
      if (layer) {
        const tile = layer.getTileAt(tileX, tileY);
        if (tile && tile.index > 0) {
          return false;
        }
      }
    }

    return true;
  }

  // ─── Player helpers ────────────────────────────────────────────────────────

  _attachPlayerColliders(player) {
    if (!this.activeColliders) this.activeColliders = [];

    // Collide with all collidable layers (Buildings, Shore, Trees, Water, Mountain, Mountains)
    for (const layer of this.collisionLayers) {
      const col = this.physics.add.collider(player, layer);
      this.activeColliders.push(col);
    }
    if (this.obstacleGroup && this.obstacleGroup.getLength() > 0) {
      const col = this.physics.add.collider(player, this.obstacleGroup);
      this.activeColliders.push(col);
    }
  }

  _addRemotePlayer(playerData) {
    if (this.remotePlayers.has(playerData.socketId)) {
      this.remotePlayers.get(playerData.socketId).destroy();
    }
    const remote = new RemotePlayer(this, playerData.x, playerData.y, playerData);
    remote.setDepth(100 + playerData.y / 10000);
    this.remotePlayers.set(playerData.socketId, remote);

    if (playerData.activeBuddy) {
      if (this.remoteFollowers.has(playerData.socketId)) {
        this.remoteFollowers.get(playerData.socketId).destroy();
      }
      const follower = new FollowerPokemon(this, remote, playerData.activeBuddy);
      this.remoteFollowers.set(playerData.socketId, follower);
    }
  }

  _clearRemotePlayers() {
    for (const remote of this.remotePlayers.values()) remote.destroy();
    this.remotePlayers.clear();
    for (const follower of this.remoteFollowers.values()) follower.destroy();
    this.remoteFollowers.clear();
  }

  // ─── Update loop ───────────────────────────────────────────────────────────

  update(time, delta) {

    // -------------------------------------------------------------------------
    // DAY / NIGHT
    // -------------------------------------------------------------------------

    if (this.dayNightManager) {
      this.dayNightManager.update(
        time,
        this.localPlayer
      );
    }

    // -------------------------------------------------------------------------
    // WATER
    // -------------------------------------------------------------------------

    if (this.waterAnimationManager) {
      this.waterAnimationManager.update(time);
    }

    // -------------------------------------------------------------------------
    // FLOWERS
    // -------------------------------------------------------------------------

    if (this.flowerAnimationManager) {
      this.flowerAnimationManager.update(time);
    }

    // -------------------------------------------------------------------------
    // WEATHER
    // -------------------------------------------------------------------------

    if (this.weatherManager) {
      this.weatherManager.update(
        time,
        delta
      );
    }

    // -------------------------------------------------------------------------
    // TREE SWAY
    // -------------------------------------------------------------------------

    this._updateTreeSway(time);

    // -------------------------------------------------------------------------
    // PLAYER
    // -------------------------------------------------------------------------

    if (!this.localPlayer) {
      return;
    }

    this.localPlayer.update(time);

    // -------------------------------------------------------------------------
    // LOCAL PLAYER COORDINATES
    // -------------------------------------------------------------------------

    const tx = Math.floor(
      this.localPlayer.x / 32
    );

    const ty = Math.floor(
      this.localPlayer.y / 32
    );

    if (
      this._lastCoordX !== tx ||
      this._lastCoordY !== ty
    ) {

      this._lastCoordX = tx;
      this._lastCoordY = ty;

      const coordsEl =
        document.getElementById('hud-coords');

      if (coordsEl) {
        coordsEl.innerText =
          `(${tx}, ${ty})`;
      }
    }

    // -------------------------------------------------------------------------
    // LOCAL PLAYER DEPTH
    // -------------------------------------------------------------------------

    this.localPlayer.setDepth(
      100 + this.localPlayer.y / 10000
    );

    // -------------------------------------------------------------------------
    // LOCAL FOLLOWER
    // -------------------------------------------------------------------------

    if (this.localFollower) {

      this.localFollower.updateFollower(
        this.localPlayer.x,
        this.localPlayer.y,
        this.localPlayer.direction,
        this.localPlayer.isMoving,
        delta,
        this.localPlayer.isJumping
      );
    }

    // -------------------------------------------------------------------------
    // REMOTE PLAYERS
    // -------------------------------------------------------------------------

    for (
      const [socketId, remote]
      of this.remotePlayers.entries()
    ) {

      if (!remote || !remote.active) {
        continue;
      }

      // Player depth
      remote.setDepth(
        100 + remote.y / 10000
      );

      // Remote movement interpolation
      remote.update();

      // -------------------------------------------------------------
      // REMOTE FOLLOWER
      // -------------------------------------------------------------

      const remoteFollower =
        this.remoteFollowers.get(socketId);

      if (remoteFollower) {

        remoteFollower.updateFollower(
          remote.x,
          remote.y,
          remote.direction,
          remote.isMoving,
          delta,
          remote.isJumping
        );
      }
    }

    // -------------------------------------------------------------------------
    // TALL GRASS
    // -------------------------------------------------------------------------

    if (this.tallGrassManager) {

      const allPlayers = [
        this.localPlayer,
        ...this.remotePlayers.values()
      ].filter(Boolean);

      this.tallGrassManager.update(
        allPlayers,
        time
      );
    }

    // -------------------------------------------------------------------------
    // SIGN PROXIMITY
    // -------------------------------------------------------------------------

    let closestSign = null;
    let minDist = 72;

    if (
      this._signs &&
      this._signs.length > 0 &&
      (!this.dialogueBox ||
        !this.dialogueBox.isOpen)
    ) {

      const px = this.localPlayer.x;
      const py = this.localPlayer.y;

      for (const sign of this._signs) {

        const cx =
          sign.x +
          sign.width / 2;

        const cy =
          sign.y +
          sign.height / 2;

        const dx = Math.abs(
          px - cx
        );

        const dy = Math.abs(
          py - cy
        );

        if (
          dx <= 60 &&
          dy <= 72
        ) {

          const dist =
            Phaser.Math.Distance.Between(
              px,
              py,
              cx,
              cy
            );

          if (dist < minDist) {

            minDist = dist;
            closestSign = sign;
          }
        }
      }
    }

    this.nearbySign = closestSign;

    // -------------------------------------------------------------------------
    // ZONE DETECTION
    // -------------------------------------------------------------------------

    if (this.zones.length > 0) {

      const px = this.localPlayer.x;
      const py = this.localPlayer.y;

      for (const zone of this.zones) {

        if (
          zone.bounds.contains(
            px,
            py
          )
        ) {

          if (
            this.currentZone !==
            zone.name
          ) {

            this.currentZone =
              zone.name;

            this._updateHUD(
              zone.name
            );
          }

          break;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PORTALS
    // -------------------------------------------------------------------------

    if (
      !this.isTransitioning &&
      time > this.portalCooldown &&
      this._portals
    ) {

      for (
        const portal
        of this._portals
      ) {

        const t = portal.trigger;

        if (
          this.localPlayer.x >= t.x &&
          this.localPlayer.x <=
          t.x + t.width &&
          this.localPlayer.y >= t.y &&
          this.localPlayer.y <=
          t.y + t.height
        ) {

          this.isTransitioning =
            true;

          this.portalCooldown =
            time + 2000;

          SocketClient.changeRoom(
            portal.targetRoom,
            portal.targetSpawn.x,
            portal.targetSpawn.y
          );

          break;
        }
      }
    }
  }

  // ─── HUD ───────────────────────────────────────────────────────────────────

  _updateHUD(roomName, playerName = null, money = null, playerObj = null) {
    const roomBadge = document.getElementById('hud-room-name');
    if (roomBadge && roomName) roomBadge.innerText = roomName;

    if (playerName) {
      const pName = document.getElementById('hud-player-name');
      if (pName) pName.innerText = playerName;
    }

    if (typeof money === 'number') {
      const moneyBadge = document.getElementById('hud-money');
      if (moneyBadge) moneyBadge.innerText = money.toLocaleString('pt-BR');
    }

    if (playerObj) {
      this.cachedPlayerData = playerObj;
      const lvlBadge = document.getElementById('hud-player-lvl');
      if (lvlBadge) lvlBadge.innerText = `${playerObj.level || 1}`;

      const expBar = document.getElementById('hud-exp-bar-fill');
      if (expBar) {
        const expPct = Math.min(100, Math.max(0, (playerObj.exp || 25) % 100));
        expBar.style.width = `${expPct}%`;
      }

      this._drawAvatarFace(playerObj.spriteKey || playerObj.sprite || 'boy_run');
    } else if (this.cachedPlayerData) {
      this._drawAvatarFace(this.cachedPlayerData.spriteKey || this.cachedPlayerData.sprite || 'boy_run');
    }
  }

  _drawAvatarFace(spriteKey = 'boy_run') {
    const canvas = document.getElementById('hud-avatar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let key = spriteKey || 'boy_run';
    if (key === 'boy') key = 'boy_run';
    if (key === 'girl') key = 'girl_run';

    if (!this.textures.exists(key)) {
      key = 'boy_run';
    }

    const texture = this.textures.get(key);
    if (!texture) return;
    const img = texture.getSourceImage();
    if (!img) return;

    const isGirl = String(key).toLowerCase().includes('girl');
    // Frame 0 of boy_run/girl_run is 32x48 facing front.
    // Boy: cap starts at y=7, chin/collar at y=31 (w=24, h=24).
    // Girl: sunhat starts at y=4, chin/hair at y=28 (w=24, h=24).
    const sx = 4;
    const sy = isGirl ? 4 : 7;
    const sw = 24;
    const sh = 24;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }

  /**
   * Simula o balanço suave das árvores conforme o vento do clima atual.
   * Balança SOMENTE a copa das árvores (Trees_Canopy e Overhead), mantendo os troncos 100% fixos no chão.
   * @param {number} time
   */
  _updateTreeSway(time) {
    const canopyLayer = this.mapLayers ? this.mapLayers.get('Trees_Canopy') : null;
    const overheadLayer = this.mapLayers ? this.mapLayers.get('Overhead') : null;
    const treesLayer = this.mapLayers ? this.mapLayers.get('Trees') : null;

    // Garante que o layer dos troncos nunca se mova
    if (treesLayer && treesLayer.x !== 0) {
      treesLayer.x = 0;
    }

    if (!canopyLayer && !overheadLayer) return;

    const wind = this.weatherManager ? this.weatherManager.getWindFactor() : 0;
    if (wind <= 0.001) {
      if (canopyLayer && canopyLayer.x !== 0) canopyLayer.x = 0;
      if (overheadLayer && overheadLayer.x !== 0) overheadLayer.x = 0;
      return;
    }

    // Onda harmônica de balanço simulando brisa suave e relaxante na copa
    // Período lento e elegante (~4.2s) com amplitude sutil (máximo ~1.0px no pico da tempestade)
    const t = time * 0.0015;
    const sway = (Math.sin(t) * 0.75 + Math.sin(t * 1.6) * 0.25) * wind;

    if (canopyLayer) {
      canopyLayer.x = sway;
    }
    if (overheadLayer) {
      overheadLayer.x = sway;
    }
  }
}
