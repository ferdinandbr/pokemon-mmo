import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';
import LocalPlayer from '../entities/LocalPlayer';
import RemotePlayer from '../entities/RemotePlayer';
import DialogueBox from '../ui/DialogueBox';
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
    this.activeColliders = [];

    // Dialogue & Sign system
    this.dialogueBox = new DialogueBox();
    this._signs = [];
    this.nearbySign = null;
  }

  // ─── Network handlers ──────────────────────────────────────────────────────

  create() {
    this.obstacleGroup = this.physics.add.staticGroup();

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
    this.cameras.main.setZoom(1.0);

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
      this.localPlayer.setPosition(x, y);
      if (this.localPlayer.body) {
        this.localPlayer.body.reset(x, y);
        this.localPlayer.body.setVelocity(0, 0);
      }
      this.localPlayer.lastX = x;
      this.localPlayer.lastY = y;
      this.localPlayer.setDepth(100);
      this._attachPlayerColliders(this.localPlayer);
    }

    const w = this.currentMap?.widthInPixels  || this.currentRoom.width  || 1152;
    const h = this.currentMap?.heightInPixels || this.currentRoom.height || 640;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 0.15, 0.15);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(1.0);

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

        // Invisible collision masks should not render tiles on screen
        if (layerName === 'Collision') {
          layer.setVisible(false);
        }

        this.mapLayers.set(layerName, layer);
      }
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
          targetRoom:  props.targetRoom  || obj.name || this.currentRoom.id,
          targetSpawn: { x: props.targetX ?? obj.x, y: props.targetY ?? obj.y },
          trigger:     { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
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

    // Sign proximity detection (generous distance to comfortably interact with adjacent 32x32 tiles)
    let closestSign = null;
    let minDist = 72;
    if (this._signs && this._signs.length > 0 && (!this.dialogueBox || !this.dialogueBox.isOpen)) {
      const px = this.localPlayer.x;
      const py = this.localPlayer.y;

      for (const sign of this._signs) {
        const cx = sign.x + sign.width / 2;
        const cy = sign.y + sign.height / 2;
        const dx = Math.abs(px - cx);
        const dy = Math.abs(py - cy);
        if (dx <= 60 && dy <= 72) {
          const dist = Phaser.Math.Distance.Between(px, py, cx, cy);
          if (dist < minDist) {
            minDist = dist;
            closestSign = sign;
          }
        }
      }
    }

    this.nearbySign = closestSign;

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
