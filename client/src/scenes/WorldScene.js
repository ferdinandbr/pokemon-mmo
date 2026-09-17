import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';
import LocalPlayer from '../entities/LocalPlayer';
import RemotePlayer from '../entities/RemotePlayer';

// ─── Room config: single source of truth for the Tiled map ───────────────────
const ROOM = {
  id: 'pallet_town',
  name: 'Pallet Town',
  tilemapKey: 'kanto_world',
  tilesetName: 'spz3zUx_small',
  tilesetImageKey: 'spz3zUx_small',
  defaultSpawn: { x: 1064, y: 3336 },
  portals: [
    {
      targetRoom: 'pallet_town',
      trigger: { x: 1024, y: 3312, width: 16, height: 16 },
      targetSpawn: { x: 1064, y: 3336 },
      label: ''
    }
  ]
};

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });

    this.localPlayer = null;
    this.remotePlayers = new Map(); // socketId -> RemotePlayer

    this.currentMap = null;
    this.worldLayer = null;       // base tile layer (below player)
    this.overheadLayer = null;    // overhead tile layer (above player)
    this.collisionLayer = null;   // reference for arcade collider

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

    this.buildMap();

    if (this.localPlayer) this.localPlayer.destroy();
    this.localPlayer = new LocalPlayer(this, self.x, self.y, self);
    this._attachPlayerColliders(this.localPlayer);

    const w = this.currentMap?.widthInPixels  || room.width  || 2128;
    const h = this.currentMap?.heightInPixels || room.height || 5440;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 0.15, 0.15);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setZoom(2.0);

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(room.name || ROOM.name, self.name, data.money);
  }

  onRoomChanged(data) {
    const { room, players, x, y } = data;

    this.buildMap();

    if (this.localPlayer) {
      this.localPlayer.setPosition(x, y);
      this.localPlayer.body.reset(x, y);
      this._attachPlayerColliders(this.localPlayer);
    }

    const w = this.currentMap?.widthInPixels  || room.width  || 2128;
    const h = this.currentMap?.heightInPixels || room.height || 5440;
    this.cameras.main.setBounds(0, 0, w, h);
    this.cameras.main.startFollow(this.localPlayer, true, 0.15, 0.15);
    this.cameras.main.roundPixels = true;

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(room.name || ROOM.name);
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
    this.worldLayer   = null;
    this.overheadLayer = null;
    this.collisionLayer = null;

    this.children.removeAll();
    this.obstacleGroup.clear(true, true);

    // ── Create Tiled map ──
    const map = this.make.tilemap({ key: ROOM.tilemapKey });
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
      const defaultTs = map.addTilesetImage(ROOM.tilesetName, ROOM.tilesetImageKey);
      if (defaultTs) tilesetList.push(defaultTs);
    }

    // ── Base layer: renders below the player (depth 5) ──
    const worldLayer = map.createLayer('World', tilesetList, 0, 0);
    if (!worldLayer) {
      console.error('[WorldScene] Layer "World" not found in tilemap');
      return;
    }
    worldLayer.setDepth(5);
    worldLayer.setCollisionByProperty({ collides: true });
    this.worldLayer = worldLayer;
    this.collisionLayer = worldLayer;

    // ── Ground layer (depth 1): if present ──
    const groundLayer = map.createLayer('Ground', tilesetList, 0, 0);
    if (groundLayer) {
      groundLayer.setDepth(1);
    }

    // ── Overhead layer (depth 50000): renders ABOVE the player ──
    const overheadLayer = map.createLayer('Overhead', tilesetList, 0, 0);
    if (overheadLayer) {
      overheadLayer.setDepth(50000);
      this.overheadLayer = overheadLayer;
    }

    // ── Dedicated Collision layer: if present in map JSON ──
    const collisionLayer = map.createLayer('Collision', tilesetList, 0, 0);
    if (collisionLayer) {
      collisionLayer.setDepth(0);
      collisionLayer.setVisible(false);
      collisionLayer.setCollisionByExclusion([-1, 0]);
      this.collisionLayer = collisionLayer;
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
    // Prefer portals defined in the Tiled "Warp" / "Portals" / "Doors" object layer
    const portalLayer =
      map.getObjectLayer('Portals') ||
      map.getObjectLayer('Warps') ||
      map.getObjectLayer('Doors');

    if (portalLayer) {
      this._portals = portalLayer.objects.map(obj => {
        const props = this._readProps(obj.properties);
        return {
          targetRoom:  props.targetRoom  || obj.name || ROOM.id,
          targetSpawn: { x: props.targetX ?? obj.x, y: props.targetY ?? obj.y },
          trigger:     { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
        };
      });
    } else {
      // Fallback: static portals from ROOM constant
      this._portals = ROOM.portals;
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
    if (this.collisionLayer) {
      this.physics.add.collider(player, this.collisionLayer);
    }
    if (this.obstacleGroup.getLength() > 0) {
      this.physics.add.collider(player, this.obstacleGroup);
    }
  }

  _addRemotePlayer(playerData) {
    if (this.remotePlayers.has(playerData.socketId)) {
      this.remotePlayers.get(playerData.socketId).destroy();
    }
    const remote = new RemotePlayer(this, playerData.x, playerData.y, playerData);
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

    // Dynamic Overhead Layer Depth Y-Sorting
    if (this.overheadLayer) {
      const tileX = Math.floor(this.localPlayer.x / 16);
      const tileY = Math.floor(this.localPlayer.y / 16);

      // Check if there is an overhead tile at the player's tile position or 1 tile below
      const currentTile = this.overheadLayer.getTileAt(tileX, tileY);
      const tileBelow = this.overheadLayer.getTileAt(tileX, tileY + 1);

      if (currentTile || tileBelow) {
        // Player is walking inside / behind an overhead structure -> Roof is ABOVE player
        this.overheadLayer.setDepth(this.localPlayer.y + 500);
      } else {
        // Player is outside overhead structures -> Roof is BELOW player (renders normally behind player)
        this.overheadLayer.setDepth(this.localPlayer.y - 500);
      }
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

    // Remote players
    for (const remote of this.remotePlayers.values()) remote.update();
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
