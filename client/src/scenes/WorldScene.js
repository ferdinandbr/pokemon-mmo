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
import NPC from '../entities/NPC';
import StarterSelectionUI from '../ui/StarterSelectionUI';
import ShopUI from '../ui/ShopUI';

const LAYER_DEPTHS = {
  Water: 10,
  Ground: 20,
  Paths: 25,
  Grass: 30,
  Shore: 35,
  Mountain: 38,
  Mountains: 38,
  Building: 40,
  Buildings: 40,
  Objects: 50,
  'Objects 2': 55,
  Trees: 60,
  Tress: 60,
  Collision: 90000,
  Overhead: 1000,
  Arch: 1000
};

const COLLISION_LAYERS = [
  'Buildings',
  'Building',
  'Shore',
  'Trees',
  'Tress',
  'Mountain',
  'Mountains',
  'Collision'
];


export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });

    this.currentRoom = ROOMS_CONFIG.kanto;
    this.localPlayer = null;
    this.localFollower = null;
    this.remotePlayers = new Map(); // socketId -> RemotePlayer
    this.remoteFollowers = new Map(); // socketId -> FollowerPokemon

    this.currentMap = null;
    this.currentMapKey = null;
    this.kantoCache = null;
    this.mapLayers = new Map();
    this.collisionLayers = [];
    this._encounterZonesDbCache = new Map();

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

    // NPC System & Modals
    this.npcs = new Map(); // npcId -> NPC
    this.nearbyNpc = null;
    this.starterSelectionUI = null;
    this.shopUI = null;
    this.hasChosenStarter = false;

    // Tall grass immersion & rustle system
    this.tallGrassManager = new TallGrassManager(this);
  }

  getZoomFactor() {
    // Locked: fixed zoom size for consistent proportions on any screen.
    // Mouse-wheel zoom is disabled (see create()).
    return 1.5;
  }

  // ─── Network handlers ──────────────────────────────────────────────────────

  create() {
    if (!this.battleUI && window._battleUI) {
      this.battleUI = window._battleUI;
      window._battleUI.worldScene = this;
    }

    this.obstacleGroup = this.physics.add.staticGroup();

    // UI Managers for NPCs
    this.starterSelectionUI = new StarterSelectionUI(this);
    this.shopUI = new ShopUI(this);

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
      if (this.kantoCache) {
        if (this.kantoCache.map && this.kantoCache.map !== this.currentMap) {
          this.kantoCache.map.destroy();
        }
        this.kantoCache = null;
      }
    });

    this.events.on('destroy', () => {
      if (this.kantoCache) {
        if (this.kantoCache.map && this.kantoCache.map !== this.currentMap) {
          this.kantoCache.map.destroy();
        }
        this.kantoCache = null;
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

      // Check click directly on an NPC
      if (this.npcs && this.npcs.size > 0 && this.localPlayer) {
        for (const npc of this.npcs.values()) {
          if (!npc || !npc.active) continue;
          const dist = Phaser.Math.Distance.Between(this.localPlayer.x, this.localPlayer.y, npc.x, npc.y);
          if (dist <= 100) {
            const bounds = new Phaser.Geom.Rectangle(npc.x - 24, npc.y - 32, 48, 64);
            if (bounds.contains(worldPoint.x, worldPoint.y)) {
              this.nearbyNpc = npc;
              this._handleInteract();
              return;
            }
          }
        }
      }

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

    // Initial fixed zoom (mouse-wheel zoom disabled to keep proportions locked)
    this.currentZoom = this.getZoomFactor();
    if (this.cameras.main) {
      this.cameras.main.setZoom(this.currentZoom);
    }

    this.scale.on('resize', (gameSize) => {
      if (this.cameras.main) {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
        this._updateCameraBounds();
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
          return;
        }
        if (this.nearbyNpc && !this.isTransitioning && (!this.battleUI || !this.battleUI.isOpen)) {
          e.preventDefault();
          this._handleInteract();
          return;
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
    SocketClient.on('battle:started', () => { this.isWildBattleTriggered = false; });
    SocketClient.on('battle:start_failed', () => { this.isWildBattleTriggered = false; });
    SocketClient.on('pokemon:data_response', (d) => {
      if (d && d.success) {
        if (Array.isArray(d.party) && d.party.length > 0) {
          this.hasChosenStarter = true;
        }
        this.checkLocalBuddyState(d.activeBuddy, d.party);
      }
    });

    // Snap player & follower positions to exact integer pixels after physics update to eliminate subpixel rendering jitter and camera stutter
    this.events.on('postupdate', (time, delta) => {
      if (this.localPlayer) {
        this.localPlayer.x = Math.round(this.localPlayer.x);
        this.localPlayer.y = Math.round(this.localPlayer.y);
        this.localPlayer.updateOverhead?.();

        if (this.localFollower && this.localFollower.active) {
          const dt = delta || this.game.loop.delta || 16.666;
          this.localFollower.updateFollower(
            this.localPlayer.x,
            this.localPlayer.y,
            this.localPlayer.direction,
            this.localPlayer.isMoving,
            dt,
            this.localPlayer.isJumping
          );
        }
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

  // Called by BattleUI.close(): locks encounters on the exit tile + short cooldown
  notifyBattleExited() {
    this.stepsSinceLastBattle = 0;
    this.battleExitCooldownUntil = (this.time?.now || 0) + 3000;
    if (this.localPlayer) {
      const tileSize = this.currentMap?.tileWidth || 16;
      this.lastBattleTile = {
        tx: Math.floor(this.localPlayer.x / tileSize),
        ty: Math.floor((this.localPlayer.y + 19) / tileSize)
      };
    } else {
      this.lastBattleTile = null;
    }
  }

  onStepInGrass() {
    if (this.battleUI?.isOpen || this.isWildBattleTriggered || this.isTransitioning || this.isChatting) {
      return;
    }

    // Não inicia batalha se o jogador ainda não possui nenhum Pokémon na equipe
    const party = this.partyHUDUI?.party || window._partyHUDUI?.party || this.pokemonStorageUI?.party || window._pokemonStorageUI?.party || [];
    const hasAnyPokemon = (Array.isArray(party) && party.length > 0) || Boolean(this.hasChosenStarter) || Boolean(this.localFollower?.buddyData);
    if (!hasAnyPokemon) {
      return;
    }

    // Post-battle lock: no encounter on the exact exit tile, plus short cooldown
    const nowMs = this.time?.now || 0;
    if (nowMs < (this.battleExitCooldownUntil || 0)) return;
    if (this.localPlayer && this.lastBattleTile) {
      const tileSize = this.currentMap?.tileWidth || 16;
      const tx = Math.floor(this.localPlayer.x / tileSize);
      const ty = Math.floor((this.localPlayer.y + 19) / tileSize);
      if (tx === this.lastBattleTile.tx && ty === this.lastBattleTile.ty) return;
      this.lastBattleTile = null;
    }

    // Check if player is strictly within a configured spawn area
    const px = this.localPlayer ? this.localPlayer.x : 0;
    const py = this.localPlayer ? (this.localPlayer.y + 19) : 0;
    const spawnZone = this._findSpawnZoneAt(px, py, 'grass');
    if (!spawnZone) {
      // Not inside any configured spawn zone! No encounter.
      return;
    }

    // Must have at least 1 Pokémon configured in this zone
    if (!Array.isArray(spawnZone.pokemonSpawns) || spawnZone.pokemonSpawns.length === 0) {
      return;
    }

    this.stepsSinceLastBattle = (this.stepsSinceLastBattle || 0) + 1;

    // Grace period: first 3 steps in zone have no encounter
    if (this.stepsSinceLastBattle <= 3) return;

    // Base rate % from spawn zone (e.g. rate 10 = 10% chance per step)
    const baseRatePercent = typeof spawnZone.rate === 'number' ? spawnZone.rate : 10;
    const encounterChance = Math.min(1.0, Math.max(0.01, baseRatePercent / 100));

    if (Math.random() < encounterChance) {
      this.isWildBattleTriggered = true;
      this.stepsSinceLastBattle = 0;

      if (this.localPlayer?.body) {
        this.localPlayer.body.setVelocity(0, 0);
        this.localPlayer.playIdle();
      }

      // Classic encounter screen flash (Gen 3 authentic white flash)
      this.cameras.main.flash(400, 255, 255, 255);

      this.time.delayedCall(420, () => {
        SocketClient.emit('battle:wild_trigger', {
          x: Math.round(px),
          y: Math.round(py),
          zoneId: spawnZone.id,
          method: 'grass'
        });
      });

      // Safety timeout: if server doesn't respond in 4s, unfreeze player
      this.time.delayedCall(4000, () => {
        if (this.isWildBattleTriggered && (!this.battleUI || !this.battleUI.isOpen)) {
          this.isWildBattleTriggered = false;
        }
      });
    }
  }

  _updateCameraBounds() {
    if (!this.cameras?.main) return;
    const w = this.currentMap?.widthInPixels || this.currentRoom?.width || 13056;
    const h = this.currentMap?.heightInPixels || this.currentRoom?.height || 12800;

    const cam = this.cameras.main;
    const zoom = this.currentZoom || cam.zoom || 1.5;
    const viewW = cam.width / zoom;
    const viewH = cam.height / zoom;

    let boundX = 0;
    let boundY = 0;
    let boundW = w;
    let boundH = h;

    if (w < viewW) {
      boundX = Math.round((w - viewW) / 2);
      boundW = Math.round(viewW);
    }
    if (h < viewH) {
      boundY = Math.round((h - viewH) / 2);
      boundH = Math.round(viewH);
    }

    cam.setBounds(boundX, boundY, boundW, boundH);
  }

  onPlayerInit(data) {
    const { self, room, players } = data;
    const targetRoomId = self.roomId || room?.id || 'kanto';
    this.currentRoom = ROOMS_CONFIG[targetRoomId] || ROOMS_CONFIG.kanto;

    this.buildMap();

    let startX = Number(self.x);
    let startY = Number(self.y);
    const mapW = this.currentMap?.widthInPixels || this.currentRoom.width || 13056;
    const mapH = this.currentMap?.heightInPixels || this.currentRoom.height || 12800;

    if (isNaN(startX) || isNaN(startY) || startX < 16 || startY < 16 || startX > mapW - 16 || startY > mapH - 16) {
      startX = this.currentRoom.defaultSpawn?.x || 2016;
      startY = this.currentRoom.defaultSpawn?.y || 8608;
      self.x = startX;
      self.y = startY;
    }

    if (this.localPlayer) this.localPlayer.destroy();
    this.localPlayer = new LocalPlayer(this, startX, startY, self);
    this.localPlayer.setDepth(100 + startY / 10000);
    this._attachPlayerColliders(this.localPlayer);

    this.currentZoom = this.currentZoom || this.getZoomFactor();
    this.cameras.main.setZoom(this.currentZoom);
    this.cameras.main.roundPixels = true;
    this.cameras.main.centerOn(startX, startY);
    this._updateCameraBounds();
    this.cameras.main.startFollow(this.localPlayer, true, 1, 1);

    if (self.activeBuddy) {
      const party = (data.pokemon || []).filter(p => p.location === 'party');
      this.checkLocalBuddyState(self.activeBuddy, party);
    }

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    const hasAnyPokemon = Array.isArray(data.pokemon) && data.pokemon.length > 0;
    this.hasChosenStarter = Boolean(data.hasCompletedIntro || hasAnyPokemon);

    this._updateHUD(this.currentZone || 'Pallet Town', self.name, data.money, self);

    // Apply authoritative server world state (weather & day/night)
    if (data.worldState) {
      if (data.worldState.weather) this.onWorldWeather(data.worldState.weather);
      if (data.worldState.time) this.onWorldTime(data.worldState.time);
    } else if (this.weatherManager) {
      this.weatherManager.setWeather(this.currentRoom.weather || 'clear');
    }

    // Play regional background music if intro already completed
    if (data.hasCompletedIntro !== false) {
      bgmManager.playForRoom(targetRoomId);
    }
  }

  onRoomChanged(data) {
    const { room, players, x, y } = data;
    const roomId = room?.id || 'kanto';
    this.currentRoom = ROOMS_CONFIG[roomId] || room || ROOMS_CONFIG.kanto;

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

    if (this.localFollower) {
      const pos = FollowerPokemon.behindPosition(x, y, this.localPlayer?.direction || 'down');
      this.localFollower.setPosition(pos.x, pos.y);
      this.localFollower.lastX = pos.x;
      this.localFollower.lastY = pos.y;
      this.localFollower.lastOwnerX = x;
      this.localFollower.lastOwnerY = y;
    }

    this.currentZoom = this.currentZoom || this.getZoomFactor();
    this.cameras.main.setZoom(this.currentZoom);
    this.cameras.main.roundPixels = true;
    if (this.localPlayer) {
      this.cameras.main.centerOn(x, y);
    }
    this._updateCameraBounds();
    this.cameras.main.startFollow(this.localPlayer, true, 1, 1);

    this._clearRemotePlayers();
    for (const p of players) this._addRemotePlayer(p);

    this._updateHUD(this.currentRoom.name || room.name);
    const finalWeather = this.currentRoom.weather || this.serverWeather || 'clear';
    if (this.weatherManager) {
      this.weatherManager.setWeather(finalWeather);
    }
    this.isTransitioning = false;
    this.portalCooldown = (this.time?.now || performance.now()) + 2000;
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

  isBuddyFainted(buddy, party = null) {
    if (!buddy) return true;
    if (typeof buddy.currentHp === 'number' && buddy.currentHp <= 0) return true;
    if (buddy.isFainted) return true;

    const currentParty = party || this.partyHUDUI?.party || this.pokemonStorageUI?.party || [];
    const pkmn = currentParty.find(p => Number(p.id) === Number(buddy.id));
    if (pkmn) {
      const curHp = typeof pkmn.currentHp === 'number' ? pkmn.currentHp : (pkmn.maxHp || 20);
      if (curHp <= 0) return true;
    }
    return false;
  }

  checkLocalBuddyState(activeBuddy = null, party = null) {
    const currentParty = party || this.partyHUDUI?.party || this.pokemonStorageUI?.party || [];
    const buddy = activeBuddy || this.partyHUDUI?.activeBuddy || this.localFollower?.buddyData || currentParty.find(p => p.isBuddy);

    if (!buddy) {
      if (this.localFollower) {
        this.localFollower.destroy();
        this.localFollower = null;
      }
      return;
    }

    if (this.isBuddyFainted(buddy, currentParty)) {
      if (this.localFollower) {
        this.localFollower.destroy();
        this.localFollower = null;
      }
      return;
    }

    const pkmn = currentParty.find(p => Number(p.id) === Number(buddy.id));
    const curHp = pkmn ? (typeof pkmn.currentHp === 'number' ? pkmn.currentHp : (pkmn.maxHp || 20)) : buddy.currentHp;
    const formattedId = String(pkmn?.speciesId || pkmn?.species?.id || buddy.speciesId || 1).padStart(3, '0');
    const buddyData = {
      ...(pkmn || {}),
      ...buddy,
      id: pkmn?.id || buddy.id,
      speciesId: pkmn?.speciesId || pkmn?.species?.id || buddy.speciesId,
      name: pkmn?.nickname || pkmn?.species?.name || pkmn?.name || buddy.name,
      level: pkmn?.level || buddy.level || 1,
      isShiny: pkmn ? Boolean(pkmn.isShiny) : Boolean(buddy.isShiny),
      currentHp: curHp,
      maxHp: pkmn?.maxHp || buddy.maxHp || 20,
      sprite: `${formattedId}.png`
    };

    if (!this.localFollower && this.localPlayer) {
      this.localFollower = new FollowerPokemon(this, this.localPlayer, buddyData);
    } else if (this.localFollower) {
      this.localFollower.updateBuddy(buddyData);
    }
  }

  onBuddyUpdated(data) {
    const { socketId, buddy } = data || {};
    const isLocal = SocketClient.socket?.id === socketId;

    if (isLocal) {
      if (!buddy || this.isBuddyFainted(buddy)) {
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
      if (!buddy || this.isBuddyFainted(buddy)) {
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

    const mapKey = (this.currentRoom?.tilemapKey && this.cache.tilemap.has(this.currentRoom.tilemapKey)) ? this.currentRoom.tilemapKey : 'kanto';
    const isTargetKanto = (mapKey === 'kanto');

    // 2. Destruir mapa anterior ou colocá-lo em hibernação (se for Kanto)
    if (this.tallGrassManager) {
      this.tallGrassManager.clear();
    }

    if (this.obstacleGroup) {
      this.obstacleGroup.clear(true, true);
    }

    if (this.currentMap) {
      if (this.currentMapKey === 'kanto') {
        // Preserva o Overworld de Kanto em cache dormindo (sem destruir suas texturas e layers)
        this._sleepKanto();
      } else {
        // Interiores são mapas minúsculos e transitórios: destruir com segurança
        this.currentMap.destroy();
        this.currentMap = null;
        this.mapLayers.clear();
        this.collisionLayers = [];
      }
    }

    // ── 3. Caminho Ultra-Rápido: Restaurar Kanto pré-carregado instantaneamente ──
    if (isTargetKanto && this.kantoCache) {
      this._wakeKanto();
      return;
    }

    // ── 4. Construção inicial do mapa Tiled ──
    const map = this.make.tilemap({ key: mapKey });
    this.currentMap = map;

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ── Bind all tilesets dynamically ──
    const tilesetList = [];
    if (!this.textures.exists('__tileset_fallback_blank')) {
      const blankCanvas = document.createElement('canvas');
      blankCanvas.width = 32;
      blankCanvas.height = 32;
      this.textures.addCanvas('__tileset_fallback_blank', blankCanvas);
    }

    if (map.tilesets && map.tilesets.length > 0) {
      const seenNames = new Set();
      const uniqueTilesets = [];
      for (const t of map.tilesets) {
        if (!seenNames.has(t.name)) {
          seenNames.add(t.name);
          uniqueTilesets.push(t);
        }
      }
      map.tilesets = uniqueTilesets;
      map.tilesets.sort((a, b) => (a.firstgid || 1) - (b.firstgid || 1));

      for (const t of map.tilesets) {
        const margin = t.tileMargin !== undefined ? t.tileMargin : (t.margin !== undefined ? t.margin : 0);
        const spacing = t.tileSpacing !== undefined ? t.tileSpacing : (t.spacing !== undefined ? t.spacing : 0);
        const tileW = t.tileWidth || t.tilewidth || map.tileWidth || 32;
        const tileH = t.tileHeight || t.tileheight || map.tileHeight || 32;
        const firstGid = t.firstgid || 1;
        let ts = map.getTileset(t.name);
        if (!ts) {
          ts = new Phaser.Tilemaps.Tileset(t.name, firstGid, tileW, tileH, margin, spacing);
          map.tilesets.push(ts);
        }

        if (this.textures.exists(t.name)) {
          const tex = this.textures.get(t.name);
          if (tex && typeof tex.setFilter === 'function') {
            tex.setFilter(Phaser.Textures.NEAREST);
          }
          ts.setImage(tex);
          ts.columns = t.columns || ts.columns || 64;
          ts.total = t.tilecount || ts.total || (ts.columns * 100);
          ts.rows = Math.ceil(ts.total / ts.columns);
          ts.tileMargin = t.margin !== undefined ? t.margin : (margin || 0);
          ts.tileSpacing = t.spacing !== undefined ? t.spacing : (spacing || 0);
        } else {
          // Provide fallback canvas texture so WebGL renderer never crashes on null image
          ts.setImage(this.textures.get('__tileset_fallback_blank'));

          if (t.image) {
            const filename = t.image.split('/').pop();
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              let finalSource = img;
              let cols = t.columns || Math.floor(img.width / tileW) || 1;
              let count = t.tilecount || (cols * Math.floor(img.height / tileH));
              if (img.height > 2048 && cols <= 8 && count > 128) {
                const destCols = 64;
                const destRows = Math.ceil(count / destCols);
                const c = document.createElement('canvas');
                c.width = destCols * tileW;
                c.height = destRows * tileH;
                const ctx = c.getContext('2d');
                for (let idx = 0; idx < count; idx++) {
                  const sx = (idx % cols) * tileW;
                  const sy = Math.floor(idx / cols) * tileH;
                  const dx = (idx % destCols) * tileW;
                  const dy = Math.floor(idx / destCols) * tileH;
                  ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
                }
                finalSource = c;
                cols = destCols;
              }
              if (this.textures.exists(t.name)) {
                this.textures.remove(t.name);
              }
              this.textures.addImage(t.name, finalSource);
              const activeTs = map.getTileset(t.name);
              if (activeTs) {
                activeTs.columns = cols;
                activeTs.total = count;
                activeTs.rows = Math.ceil(count / cols);
                activeTs.setImage(this.textures.get(t.name));
                const rebuildTiles = Array.isArray(map.tiles) ? [...map.tiles] : [];
                for (let i = 0; i < map.tilesets.length; i++) {
                  const set = map.tilesets[i];
                  const setCols = set.columns || 64;
                  const setTotal = set.total || 4544;
                  const setM = set.tileMargin || 0;
                  const setS = set.tileSpacing || 0;
                  const setTw = set.tileWidth || 32;
                  const setTh = set.tileHeight || 32;
                  for (let ti = 0; ti < setTotal; ti++) {
                    const gid = set.firstgid + ti;
                    const sc = ti % setCols;
                    const sr = Math.floor(ti / setCols);
                    rebuildTiles[gid] = [setM + sc * (setTw + setS), setM + sr * (setTh + setS), i];
                  }
                }
                map.tiles = rebuildTiles;
                this.mapLayers.forEach(l => {
                  if (l && typeof l.setTilesets === 'function') l.setTilesets(map.tilesets);
                });
              }
            };
            img.src = `/assets/tilesets/${encodeURIComponent(filename)}?t=${Date.now()}`;
          }
        }
        if (ts && !tilesetList.includes(ts)) tilesetList.push(ts);
      }
    }
    if (tilesetList.length === 0) {
      const defaultTs = map.addTilesetImage('spz3zUx_scaled', 'spz3zUx_scaled', 32, 32, 1, 2);
      if (defaultTs) tilesetList.push(defaultTs);
    }

    // Sort tilesets by firstgid
    map.tilesets.sort((a, b) => (a.firstgid || 1) - (b.firstgid || 1));

    try {
      if (typeof Phaser?.Tilemaps?.Parsers?.Tiled?.BuildTilesetIndex === 'function') {
        map.tiles = Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex(map);
      }
    } catch (err) {
      console.warn('[WorldScene] BuildTilesetIndex error:', err);
    }

    // Complete index builder ensuring all secondary tilesets are mapped
    const tiles = Array.isArray(map.tiles) ? [...map.tiles] : [];
    for (let i = 0; i < map.tilesets.length; i++) {
      const set = map.tilesets[i];
      const cols = set.columns || 64;
      const total = set.total || 4544;
      const m = set.tileMargin || 0;
      const s = set.tileSpacing || 0;
      const tw = set.tileWidth || 32;
      const th = set.tileHeight || 32;
      for (let t = 0; t < total; t++) {
        const gid = set.firstgid + t;
        const col = t % cols;
        const row = Math.floor(t / cols);
        tiles[gid] = [m + col * (tw + s), m + row * (th + s), i];
      }
    }
    map.tiles = tiles;

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
          const TREE_CANOPY_GIDS = new Set([
            689, 690, 691, 692, 693, 694, 697, 698, 699, 700,
            735, 751, 1631, 1632, 1633, 1634
          ]);
          const canopyLayer = map.createBlankLayer('Trees_Canopy', tilesetList, 0, 0);
          if (canopyLayer && layer.layer?.data) {
            canopyLayer.setDepth(depth);
            const grid = layer.layer.data;
            const numRows = grid.length;
            for (let ty = 0; ty < numRows; ty++) {
              const row = grid[ty];
              if (!row) continue;
              const numCols = row.length;
              for (let tx = 0; tx < numCols; tx++) {
                const tile = row[tx];
                if (tile && TREE_CANOPY_GIDS.has(tile.index)) {
                  canopyLayer.putTileAt(tile.index, tx, ty);
                  tile.alpha = 0;
                  tile.setVisible(false);
                }
              }
            }
            this.mapLayers.set('Trees_Canopy', canopyLayer);
          }
        }

        // Check if this layer has collision enabled
        const hasDedicatedCollision = map.layers && map.layers.some(l => l.name === 'Collision');
        if (layerName === 'Collision') {
          layer.setCollision([
            COLLISION_TYPES.SOLID,
            COLLISION_TYPES.LEDGE_DOWN,
            COLLISION_TYPES.LEDGE_LEFT,
            COLLISION_TYPES.LEDGE_RIGHT,
            COLLISION_TYPES.LEDGE_UP
          ]);
          layer.setVisible(false);
          this.collisionLayers.push(layer);
        } else if (!hasDedicatedCollision && COLLISION_LAYERS.includes(layerName)) {
          layer.setCollisionByExclusion([-1, 0]);
          this.collisionLayers.push(layer);
        }

        this.mapLayers.set(layerName, layer);
      }
    }

    // ── Apply Walkable Overrides from Collision Layer (doorways, erased tiles, paths) ──
    const colLayer = this.mapLayers.get('Collision');
    if (colLayer && colLayer.layer?.data) {
      const grid = colLayer.layer.data;
      const numRows = grid.length;
      for (let ty = 0; ty < numRows; ty++) {
        const row = grid[ty];
        if (!row) continue;
        const numCols = row.length;
        for (let tx = 0; tx < numCols; tx++) {
          const colTile = row[tx];
          if (colTile && colTile.index === COLLISION_TYPES.WALKABLE_OVERRIDE) {
            for (const cLayer of this.collisionLayers) {
              const t = cLayer.layer?.data?.[ty]?.[tx];
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
    this._loadSpawns(map);
    this._loadPortals(map);
    this._loadSigns(map);
    this._loadNPCs(map);

    if (isTargetKanto) {
      this.currentMapKey = 'kanto';
      this._saveKantoCache();
    } else {
      this.currentMapKey = mapKey;
    }
  }

  /**
   * Coloca o mapa de Kanto em hibernação / dormência ao entrar em interiores.
   * Oculta todas as camadas para que a GPU não gaste nenhum ciclo de renderização,
   * mas mantém os objetos e malha de tiles prontos na memória.
   */
  _sleepKanto() {
    if (!this.kantoCache) {
      this._saveKantoCache();
    }
    if (this.kantoCache?.mapLayers) {
      for (const layer of this.kantoCache.mapLayers.values()) {
        if (layer && layer.setVisible) {
          layer.setVisible(false);
          layer.setActive(false);
        }
      }
    }
    if (this.kantoCache?.npcs) {
      for (const npc of this.kantoCache.npcs.values()) {
        if (npc && npc.setVisible) {
          npc.setVisible(false);
          npc.setActive(false);
          if (npc.overheadContainer) npc.overheadContainer.setVisible(false);
        }
      }
    }
    this.currentMap = null;
    this.currentMapKey = null;
    this.mapLayers = new Map();
    this.collisionLayers = [];
    this.npcs = new Map();
  }

  /**
   * Restaura o Overworld de Kanto em 0ms (instantaneamente) ao sair de interiores.
   */
  _wakeKanto() {
    this.currentMap = this.kantoCache.map;
    this.currentMapKey = 'kanto';
    this.mapLayers = this.kantoCache.mapLayers;
    this.collisionLayers = this.kantoCache.collisionLayers;
    this.zones = this.kantoCache.zones;
    this.spawnZones = this.kantoCache.spawnZones;
    this._portals = this.kantoCache.portals;
    this._signs = this.kantoCache.signs;

    // Reativa todas as camadas com profundidades e visibilidades originais
    for (const [name, layer] of this.mapLayers.entries()) {
      if (layer && layer.setActive) {
        layer.setActive(true);
        if (name === 'Collision') {
          layer.setVisible(false);
        } else {
          layer.setVisible(true);
        }
      }
    }

    // Reativa todos os NPCs de Kanto
    this.npcs = this.kantoCache.npcs || new Map();
    for (const npc of this.npcs.values()) {
      if (npc && npc.setVisible) {
        npc.setVisible(true);
        npc.setActive(true);
        if (npc.overheadContainer) npc.overheadContainer.setVisible(true);
      }
    }

    // Restaura os limites de física de Kanto (13056 x 12800)
    this.physics.world.setBounds(0, 0, this.currentMap.widthInPixels, this.currentMap.heightInPixels);

    // Restaura o sistema de grama alta no layer 'Grass' de Kanto
    const grass = this.kantoCache.grassLayer || this.mapLayers.get('Grass');
    if (this.tallGrassManager && grass) {
      this.tallGrassManager.setLayer(grass);
    }
  }

  /**
   * Salva os ponteiros e estruturas do mapa de Kanto em cache permanente.
   */
  _saveKantoCache() {
    this.kantoCache = {
      map: this.currentMap,
      mapLayers: this.mapLayers,
      collisionLayers: this.collisionLayers,
      zones: this.zones,
      spawnZones: this.spawnZones,
      portals: this._portals,
      signs: this._signs,
      npcs: this.npcs,
      grassLayer: this.mapLayers.get('Grass')
    };
  }

  _loadSpawns(map) {
    this.spawnZones = [];
    if (!map) return;

    // 1. Load from map objects if available
    const spawnLayer = map.getObjectLayer('PokemonSpawns') ||
      map.getObjectLayer('Spawns') ||
      map.getObjectLayer('Encounters');
    if (spawnLayer && spawnLayer.objects) {
      for (const obj of spawnLayer.objects) {
        if (!obj) continue;
        const props = this._readProps(obj.properties);
        let pokemonSpawns = [];
        try {
          pokemonSpawns = typeof props.pokemonSpawns === 'string' ? JSON.parse(props.pokemonSpawns) : (props.pokemonSpawns || []);
        } catch (e) {
          pokemonSpawns = [];
        }
        this.spawnZones.push({
          id: obj.id,
          name: props.name || obj.name || 'Área de Spawn',
          encounterType: props.encounterType || props.method || 'grass',
          rate: Number(props.rate) || 10,
          bounds: new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width, obj.height),
          pokemonSpawns
        });
      }
    }

    // 2. Also fetch persistent database encounter zones asynchronously
    const roomId = this.currentRoom?.id || 'kanto';

    const applyDbZones = (zones) => {
      if (Array.isArray(zones) && zones.length > 0) {
        this.spawnZones = zones.map(z => {
          let pSpawns = [];
          try {
            pSpawns = typeof z.pokemonSpawns === 'string' ? JSON.parse(z.pokemonSpawns) : (z.pokemonSpawns || []);
          } catch (e) { pSpawns = []; }
          return {
            id: z.id,
            name: z.name,
            encounterType: z.encounterType || 'grass',
            rate: Number(z.rate) || 10,
            bounds: new Phaser.Geom.Rectangle(z.x, z.y, z.width, z.height),
            pokemonSpawns: pSpawns
          };
        });
        if (this.currentMapKey === 'kanto' && this.kantoCache) {
          this.kantoCache.spawnZones = this.spawnZones;
        }
      }
    };

    if (this._encounterZonesDbCache.has(roomId)) {
      applyDbZones(this._encounterZonesDbCache.get(roomId));
      return;
    }

    fetch(`/api/admin/encounter-zones?mapId=${encodeURIComponent(roomId)}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.zones)) {
          this._encounterZonesDbCache.set(roomId, data.zones);
          applyDbZones(data.zones);
        }
      })
      .catch(() => { });
  }

  _findSpawnZoneAt(x, y, method = 'grass') {
    if (!this.spawnZones || this.spawnZones.length === 0) return null;
    return this.spawnZones.find(zone => {
      if (zone.encounterType && zone.encounterType !== method) return false;
      if (!zone.bounds) return false;
      // Permite tolerância de até 16px nas bordas dos tiles da zona de spawn
      const b = zone.bounds;
      return x >= (b.x - 16) && x <= (b.x + b.width + 16) &&
             y >= (b.y - 16) && y <= (b.y + b.height + 16);
    });
  }

  _loadZones(map) {
    this.zones = [];
    if (!map) return;
    const zonesLayer = map.getObjectLayer('Zones') ||
      map.getObjectLayer('Regiões') ||
      map.getObjectLayer('Zonas') ||
      map.getObjectLayer('zones');
    if (!zonesLayer || !zonesLayer.objects) return;

    for (const obj of zonesLayer.objects) {
      if (!obj) continue;
      const props = this._readProps(obj.properties);
      const name = obj.name || props.name || 'Zona';
      this.zones.push({
        name: name,
        bounds: new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width, obj.height)
      });
    }
  }

  _loadPortals(map) {
    const portalLayer =
      map.getObjectLayer('Portals') ||
      map.getObjectLayer('Warps') ||
      map.getObjectLayer('Doors');

    if (portalLayer && portalLayer.objects && portalLayer.objects.length > 0) {
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

  _loadNPCs(map) {
    this._clearNPCs();
    if (!map) return;

    const npcObjects = [];

    // 1. Camada dedicada 'NPCs'
    const npcLayer = map.getObjectLayer('NPCs') ||
      map.getObjectLayer('Npcs') ||
      map.getObjectLayer('npcs') ||
      map.getObjectLayer('Characters');

    if (npcLayer && Array.isArray(npcLayer.objects)) {
      npcObjects.push(...npcLayer.objects);
    }

    // 2. Objetos com type === 'npc' em outras camadas
    if (map.objects) {
      for (const layer of map.objects) {
        if (!layer || layer.name === 'NPCs' || !layer.objects) continue;
        for (const obj of layer.objects) {
          if (obj && (obj.type === 'npc' || obj.type === 'NPC')) {
            npcObjects.push(obj);
          }
        }
      }
    }

    for (const obj of npcObjects) {
      if (!obj) continue;
      const props = this._readProps(obj.properties);

      let dialogue = props.dialogue || props.text || ['Olá, treinador!'];
      if (typeof dialogue === 'string') {
        try {
          const parsed = JSON.parse(dialogue);
          dialogue = Array.isArray(parsed) ? parsed : [dialogue];
        } catch (e) {
          dialogue = [dialogue];
        }
      }

      let team = props.team || null;
      if (typeof team === 'string') {
        try { team = JSON.parse(team); } catch (e) { team = null; }
      }

      let shopItems = props.shopItems || null;
      if (typeof shopItems === 'string') {
        try { shopItems = JSON.parse(shopItems); } catch (e) { shopItems = null; }
      }

      const npcData = {
        id: obj.id ? String(obj.id) : (obj.name || `npc_${obj.x}_${obj.y}`),
        name: props.name || obj.name || 'NPC',
        sprite: props.sprite || props.spriteKey || 'npc_oak',
        direction: props.direction || 'down',
        npcType: props.npcType || props.type || 'dialogue',
        dialogue,
        visionRange: Number(props.visionRange) || 3,
        rewardMoney: Number(props.rewardMoney) || 200,
        rewardExp: Number(props.rewardExp) || 150,
        cooldown: Number(props.cooldown) || 300,
        team,
        winDialogue: props.winDialogue || 'Você é forte...',
        lossDialogue: props.lossDialogue || 'Ainda precisa treinar mais!',
        shopItems
      };

      const npc = new NPC(this, obj.x, obj.y, npcData);
      this.npcs.set(npc.id, npc);

      // Colisão sólida para o jogador não atravessar o NPC
      if (this.localPlayer) {
        const col = this.physics.add.collider(this.localPlayer, npc);
        this.activeColliders.push(col);
      }
    }
  }

  _clearNPCs() {
    if (this.npcs) {
      for (const npc of this.npcs.values()) {
        if (npc && npc.destroy) {
          npc.destroy();
        }
      }
      this.npcs.clear();
    } else {
      this.npcs = new Map();
    }
    this.nearbyNpc = null;
  }

  startTrainerBattle(npc) {
    if (this.battleUI?.isOpen || this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentBattleNpc = npc;

    if (npc) {
      npc.isEngaging = true;
      npc.hasSpottedPlayer = true;
    }

    // Garante que qualquer caixa de diálogo seja fechada imediatamente
    if (this.dialogueBox && this.dialogueBox.isOpen) {
      this.dialogueBox.close();
    }
    const overworldDlg = document.getElementById('fr-dialogue-box');
    if (overworldDlg) overworldDlg.classList.add('hidden');

    if (this.localPlayer?.body) {
      this.localPlayer.body.setVelocity(0, 0);
      this.localPlayer.playIdle?.();
    }

    this.cameras.main.flash(450, 255, 255, 255);

    this.time.delayedCall(460, () => {
      SocketClient.emit('npc:battle_start', {
        npcId: npc.id,
        trainerData: npc.trainerData
      });
    });
  }

  onBattleFinished(result) {
    this.isTransitioning = false;

    if (!result || !result.isTrainer) {
      this.currentBattleNpc = null;
      return;
    }

    const npc = result.npc || this.currentBattleNpc;
    this.currentBattleNpc = null;

    if (result.winner === 'player') {
      if (npc) {
        npc.setBattleResult?.('win');
      }

      const dlg = result.trainerDialogue || npc?.trainerData?.winDialogue || 'Você é muito forte... Continue treinando!';
      const npcName = result.trainerName || npc?.name || 'Treinador';

      this.time.delayedCall(350, () => {
        if (this.dialogueBox && (!this.battleUI || !this.battleUI.isOpen)) {
          this.dialogueBox.show(npcName, [dlg]);
        }
      });
    } else if (result.winner === 'opponent') {
      if (npc) {
        npc.setBattleResult?.('loss');
      }

      const dlg = result.trainerDialogue || npc?.trainerData?.lossDialogue || 'Haha! Ainda precisa treinar mais!';
      const npcName = result.trainerName || npc?.name || 'Treinador';

      this.time.delayedCall(350, () => {
        if (this.dialogueBox && (!this.battleUI || !this.battleUI.isOpen)) {
          this.dialogueBox.show(npcName, [dlg]);
        }
      });
    }
  }

  _handleInteract() {
    // If typing in an input field or chat is open, do nothing
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }
    if (this.isChatting || this.isTransitioning || this.battleUI?.isOpen) return;

    if (this.dialogueBox) {
      if (this.dialogueBox.isOpen) {
        this.dialogueBox.advance();
        return;
      }
      if (this.dialogueBox.justClosed) {
        return;
      }
    }

    if (this.nearbyNpc) {
      this.nearbyNpc.interact(this.localPlayer);
      return;
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

    if (playerData.activeBuddy && !this.isBuddyFainted(playerData.activeBuddy)) {
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

    const tileSize = this.currentMap?.tileWidth || 16;
    const tx = Math.floor(this.localPlayer.x / tileSize);
    const ty = Math.floor(this.localPlayer.y / tileSize);

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

    // (Local follower is updated in 'postupdate' after physics step for perfect frame synchronization)

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
      const allEntities = [
        this.localPlayer,
        ...this.remotePlayers.values(),
        this.localFollower,
        ...(this.remoteFollowers ? this.remoteFollowers.values() : [])
      ].filter(Boolean);

      this.tallGrassManager.update(
        allEntities,
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
    // NPC PROXIMITY & LINE OF SIGHT
    // -------------------------------------------------------------------------
    let closestNpc = null;
    let minNpcDist = 64;

    if (this.npcs && this.npcs.size > 0 && this.localPlayer && (!this.dialogueBox || !this.dialogueBox.isOpen) && !this.isTransitioning && (!this.battleUI || !this.battleUI.isOpen)) {
      const px = this.localPlayer.x;
      const py = this.localPlayer.y;

      for (const npc of this.npcs.values()) {
        if (!npc || !npc.active) continue;

        // Linha de visão para NPCs de combate
        npc.checkLineOfSight(this.localPlayer);

        const dist = Phaser.Math.Distance.Between(px, py, npc.x, npc.y);
        if (dist < minNpcDist) {
          minNpcDist = dist;
          closestNpc = npc;
        }
      }
    }
    this.nearbyNpc = closestNpc;

    // -------------------------------------------------------------------------
    // ZONE DETECTION
    // -------------------------------------------------------------------------

    if (this.zones.length > 0 && this.localPlayer) {
      const px = this.localPlayer.x;
      const py = this.localPlayer.y;

      let currentMatchingZone = null;
      for (const zone of this.zones) {
        if (zone.bounds.contains(px, py)) {
          currentMatchingZone = zone;
          break;
        }
      }

      if (currentMatchingZone) {
        if (this.currentZone !== currentMatchingZone.name) {
          this.currentZone = currentMatchingZone.name;
          const formatted = this._formatZoneName(currentMatchingZone.name);
          this._updateHUD(formatted);
        }
      } else if (this.currentZone !== null) {
        this.currentZone = null;
        const defaultName = this._formatZoneName(this.currentRoom?.name || 'Kanto');
        this._updateHUD(defaultName);
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
    if (roomBadge && roomName) roomBadge.innerText = this._formatZoneName(roomName);

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
      // Only overwrite the level badge when a real value arrives
      // (player:init self used to carry no level, forcing a fake Lv.1)
      if (typeof playerObj.level === 'number') {
        const lvlBadge = document.getElementById('hud-player-lvl');
        if (lvlBadge) lvlBadge.innerText = `${playerObj.level}`;
      }

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
    const treesLayer = this.mapLayers ? this.mapLayers.get('Trees') : null;

    // Garante que o layer dos troncos nunca se mova
    if (treesLayer && treesLayer.x !== 0) {
      treesLayer.x = 0;
    }

    if (!canopyLayer) return;

    const wind = this.weatherManager ? this.weatherManager.getWindFactor() : 0;
    if (wind <= 0.001) {
      if (canopyLayer && canopyLayer.x !== 0) canopyLayer.x = 0;
      return;
    }

    // Onda harmônica de balanço simulando brisa suave e relaxante na copa
    // Período lento e elegante (~4.2s) com amplitude sutil (máximo ~1.0px no pico da tempestade)
    // NOTA: a camada Overhead (telhados/arcos) NÃO balança — só a copa das árvores.
    const t = time * 0.0015;
    const sway = (Math.sin(t) * 0.75 + Math.sin(t * 1.6) * 0.25) * wind;

    if (canopyLayer) {
      canopyLayer.x = sway;
    }
  }

  _formatZoneName(name) {
    if (!name) return 'Kanto';
    let clean = String(name).trim();

    if (/^route[_\s-]*(\d+)/i.test(clean)) {
      const match = clean.match(/^route[_\s-]*(\d+)/i);
      return `Rota ${match[1]}`;
    }

    const dict = {
      'pallet town': 'Pallet Town',
      'viridian city': 'Viridian City',
      'pewter city': 'Pewter City',
      'cerulean city': 'Cerulean City',
      'vermilion city': 'Vermilion City',
      'celadon city': 'Celadon City',
      'fuchsia city': 'Fuchsia City',
      'saffron city': 'Saffron City',
      'cinnabar island': 'Cinnabar Island',
      'indigo plateau': 'Indigo Plateau',
      'viridian forest': 'Floresta de Viridian',
      'mt. moon': 'Mt. Moon',
      'mt moon': 'Mt. Moon',
      'rock tunnel': 'Rock Tunnel',
      'seafoam islands': 'Ilhas Seafoam',
      'victory road': 'Victory Road',
      'pokemon tower': 'Torre Pokémon',
      'safari zone': 'Zona Safari',
      'power plant': 'Usinas de Energia'
    };

    const lower = clean.toLowerCase().replace(/_/g, ' ');
    if (dict[lower]) return dict[lower];

    return clean.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  _showZoneBanner() {
    const el = document.getElementById('zone-banner-notification');
    if (el) el.remove();
  }
}

