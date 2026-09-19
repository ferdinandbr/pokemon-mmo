import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';
import LocalPlayer from '../entities/LocalPlayer';
import RemotePlayer from '../entities/RemotePlayer';
import { ROOMS_CONFIG } from '../maps/roomData';

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
  'Objects'
];


export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });

    this.currentRoom = ROOMS_CONFIG.pallet_town;
    this.localPlayer = null;
    this.remotePlayers = new Map(); // socketId -> RemotePlayer

    this.currentMap = null;
    this.mapLayers = new Map();
    this.collisionLayers = [];

    this.obstacleGroup = null;
    this.zones = [];
    this.currentZone = null;

    this.isTransitioning = false;
    this.portalCooldown = 0;
    this.isChatting = false;
  }

  // ─── Network handlers ──────────────────────────────────────────────────────

  create() {
    this.obstacleGroup = this.physics.add.staticGroup();

    SocketClient.on('player:init',   (d) => this.onPlayerInit(d));
    SocketClient.on('player:joined', (d) => this.onPlayerJoined(d));
    SocketClient.on('player:moved',  (d) => this.onPlayerMoved(d));
    SocketClient.on('player:left',   (d) => this.onPlayerLeft(d));
    SocketClient.on('room:changed',  (d) => this.onRoomChanged(d));
    SocketClient.on('chat:message',  (d) => this.onChatMessage(d));
  }

  onPlayerInit(data) {
    const { self, room, players } = data;
    const roomId = room?.id || self?.roomId || 'pallet_town';
    this.currentRoom = ROOMS_CONFIG[roomId] || room || ROOMS_CONFIG.pallet_town;

    this.buildMap();

    if (this.localPlayer) this.localPlayer.destroy();
    this.localPlayer = new LocalPlayer(this, self.x, self.y, self);
    this.localPlayer.setDepth(100);
    this._attachPlayerColliders(this.localPlayer);

    const w = this.currentMap?.widthInPixels  || this.currentRoom.width  || 1152;
    const h = this.currentMap?.heightInPixels || this.currentRoom.height || 640;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 0.15, 0.15);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.35);

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(this.currentRoom.name || room.name, self.name, data.money);
  }

  onRoomChanged(data) {
    const { room, players, x, y } = data;
    const roomId = room?.id || 'pallet_town';
    this.currentRoom = ROOMS_CONFIG[roomId] || room || ROOMS_CONFIG.pallet_town;

    this.buildMap();

    if (this.localPlayer) {
      this.add.existing(this.localPlayer);
      this.localPlayer.setPosition(x, y);
      this.localPlayer.body.reset(x, y);
      this.localPlayer.setDepth(100);
      this._attachPlayerColliders(this.localPlayer);
    }

    const w = this.currentMap?.widthInPixels  || this.currentRoom.width  || 1152;
    const h = this.currentMap?.heightInPixels || this.currentRoom.height || 640;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 0.15, 0.15);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.35);

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(this.currentRoom.name || room.name);
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
    // Destroy previous map assets
    if (this.currentMap) {
      this.currentMap.destroy();
      this.currentMap = null;
    }
    this.mapLayers.clear();
    this.collisionLayers = [];

    this.children.removeAll();
    this.obstacleGroup.clear(true, true);

    // ── Create Tiled map ──
    const mapKey = this.currentRoom?.tilemapKey || this.currentRoom?.id || 'pallet_town';
    const map = this.make.tilemap({ key: mapKey });
    this.currentMap = map;

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ── Bind all tilesets dynamically ──
    const tilesetList = [];
    if (map.tilesets && map.tilesets.length > 0) {
      for (const t of map.tilesets) {
        const ts = map.addTilesetImage(t.name, t.name);
        if (ts) tilesetList.push(ts);
      }
    }
    if (tilesetList.length === 0) {
      const defaultTs = map.addTilesetImage('Outside1 Spring', 'Outside1 Spring');
      if (defaultTs) tilesetList.push(defaultTs);
    }

    // ── Build all tile layers in defined stack order ──
    if (map.layers && map.layers.length > 0) {
      for (const layerData of map.layers) {
        const layerName = layerData.name;
        const layer = map.createLayer(layerName, tilesetList, 0, 0);
        if (!layer) continue;

        const depth = LAYER_DEPTHS[layerName] ?? 50;
        layer.setDepth(depth);

        // Check if this layer has collision enabled
        if (COLLISION_LAYERS.includes(layerName)) {
          layer.setCollisionByExclusion([-1, 0]);
          this.collisionLayers.push(layer);
        }

        this.mapLayers.set(layerName, layer);
      }
    }

    // ── Object layers ──
    this._loadZones(map);
    this._loadPortals(map);
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
          targetRoom:  props.targetRoom  || obj.name || this.currentRoom.id,
          targetSpawn: { x: props.targetX ?? obj.x, y: props.targetY ?? obj.y },
          trigger:     { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
        };
      });
    } else {
      this._portals = this.currentRoom?.portals || [];
    }
  }


  _readProps(properties) {
    if (!properties) return {};
    if (Array.isArray(properties)) {
      return Object.fromEntries(properties.map(p => [p.name, p.value]));
    }
    return { ...properties };
  }

  // ─── Player helpers ────────────────────────────────────────────────────────

  _attachPlayerColliders(player) {
    // Collide with all collidable layers (Buildings, Shore, Trees, Water)
    for (const layer of this.collisionLayers) {
      this.physics.add.collider(player, layer);
    }
    if (this.obstacleGroup && this.obstacleGroup.getLength() > 0) {
      this.physics.add.collider(player, this.obstacleGroup);
    }
  }

  _addRemotePlayer(playerData) {
    if (this.remotePlayers.has(playerData.socketId)) {
      this.remotePlayers.get(playerData.socketId).destroy();
    }
    const remote = new RemotePlayer(this, playerData.x, playerData.y, playerData);
    remote.setDepth(100);
    this.remotePlayers.set(playerData.socketId, remote);
  }

  _clearRemotePlayers() {
    for (const remote of this.remotePlayers.values()) remote.destroy();
    this.remotePlayers.clear();
  }

  // ─── Update loop ───────────────────────────────────────────────────────────

  update(time) {
    if (!this.localPlayer) return;

    this.localPlayer.update(time);

    // Dynamic depth sorting among players (around depth 100, below Overhead at 200)
    this.localPlayer.setDepth(100 + this.localPlayer.y / 10000);
    for (const remote of this.remotePlayers.values()) {
      remote.setDepth(100 + remote.y / 10000);
      remote.update();
    }

    // Zone detection
    if (this.zones.length > 0) {
      const px = this.localPlayer.x;
      const py = this.localPlayer.y;
      for (const zone of this.zones) {
        if (zone.bounds.contains(px, py)) {
          if (this.currentZone !== zone.name) {
            this.currentZone = zone.name;
            this._updateHUD(zone.name);
          }
          break;
        }
      }
    }

    // Portal detection
    if (!this.isTransitioning && time > this.portalCooldown && this._portals) {
      for (const portal of this._portals) {
        const t = portal.trigger;
        if (
          this.localPlayer.x >= t.x && this.localPlayer.x <= t.x + t.width &&
          this.localPlayer.y >= t.y && this.localPlayer.y <= t.y + t.height
        ) {
          this.isTransitioning = true;
          this.portalCooldown = time + 2000;
          SocketClient.changeRoom(portal.targetRoom, portal.targetSpawn.x, portal.targetSpawn.y);
          break;
        }
      }
    }
  }

  // ─── HUD ───────────────────────────────────────────────────────────────────

  _updateHUD(roomName, playerName = null, money = null) {
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
