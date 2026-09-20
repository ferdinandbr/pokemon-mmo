import Phaser from 'phaser';
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
  Collision: 99000,
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

export default class EditorScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EditorScene' });

    this.map = null;
    this.mapJsonData = null;
    this.currentMapName = 'pallet_town';

    // Dynamic tile layers data
    this.tileLayerData = {};  // layerName -> Uint32Array
    this.phaserLayers = {};   // layerName -> Phaser.Tilemaps.TilemapLayer
    this.allTileLayerNames = [];

    // Active State
    this.activeTool = 'pencil'; // 'hand', 'link', 'pencil', 'eraser', 'bucket', 'picker', 'object', 'sign'
    this.selectedTileGid = 1;
    this.activeLayerName = 'Ground';
    this.showGrid = true;
    this.showObjects = true;
    this.showCollisions = true;

    // Graphics Overlays
    this.gridGraphics = null;
    this.cursorGraphics = null;
    this.objectGraphics = null;
    this.collisionGraphics = null;
    this.selectedObject = null;

    // Camera Panning & Interaction
    this.isDraggingMap = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.camStartX = 0;
    this.camStartY = 0;
    this.isPainting = false;

    // Portal & Sign Marking State
    this.isMarkingPortal = false;
    this.portalDragStart = null;
    this.lastPointerWorldX = 0;
    this.lastPointerWorldY = 0;

    // UI Callback hooks
    this.onCoordsUpdate = null;
    this.onTilePicked = null;
    this.onObjectSelected = null;
    this.onPortalSelected = null;
    this.onSignSelected = null;
    this.onMapLoaded = null;
    this.onToast = null;
  }

  preload() {
    const t = Date.now();
    this.load.image('Outside1 Spring', '/assets/tilesets/Outside1 Spring.png');
    this.load.tilemapTiledJSON('pallet_town_editor', `/assets/maps/pallet_town.json?t=${t}`);
    this.load.json('pallet_town_raw_json', `/assets/maps/pallet_town.json?t=${t}`);
  }

  create() {
    // Create Graphics Overlays
    this.gridGraphics = this.add.graphics().setDepth(100000);
    this.cursorGraphics = this.add.graphics().setDepth(100001);
    this.objectGraphics = this.add.graphics().setDepth(99999);
    this.collisionGraphics = this.add.graphics().setDepth(89999);

    // Initial map setup
    const initialJson = this.cache.json.get('pallet_town_raw_json');
    if (initialJson) {
      this.initMapData('pallet_town', initialJson);
    }

    // Input Listeners
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.input.on('wheel', this.onWheel, this);

    // Ensure keyboard captures do not intercept space or other keys globally in browser inputs
    this.input.keyboard.clearCaptures();
    this.spaceKey = this.input.keyboard.addKey('SPACE', false);

    // Keyboard Shortcuts (only when not typing in an input/textarea)
    const isTyping = () => {
      const el = document.activeElement;
      return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    };

    this.input.keyboard.on('keydown-H', () => { if (!isTyping()) this.setTool('hand'); });
    this.input.keyboard.on('keydown-L', () => { if (!isTyping()) this.setTool('link'); });
    this.input.keyboard.on('keydown-B', () => { if (!isTyping()) this.setTool('pencil'); });
    this.input.keyboard.on('keydown-E', () => { if (!isTyping()) this.setTool('eraser'); });
    this.input.keyboard.on('keydown-F', () => { if (!isTyping()) this.setTool('bucket'); });
    this.input.keyboard.on('keydown-I', () => { if (!isTyping()) this.setTool('picker'); });
    this.input.keyboard.on('keydown-O', () => { if (!isTyping()) this.setTool('object'); });
    this.input.keyboard.on('keydown-G', () => { if (!isTyping()) this.toggleGrid(); });
    this.input.keyboard.on('keydown-C', () => { if (!isTyping()) this.toggleCollisions(); });
    this.input.keyboard.on('keydown-ESC', () => { if (!isTyping()) this.cancelPortalMarking(); });
  }

  // ─── Dynamic Map Loading ──────────────────────────────────────────────────

  async loadMapByName(mapName) {
    if (this.onToast) this.onToast(`Carregando mapa: ${mapName}...`, 'info');
    try {
      const res = await fetch(`/api/admin/map?map=${encodeURIComponent(mapName)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Mapa não encontrado`);
      const mapJson = await res.json();
      this.initMapData(mapName, mapJson);
      if (this.onToast) this.onToast(`✅ Mapa '${mapName}' carregado com sucesso!`, 'success');
    } catch (err) {
      console.error('[EditorScene loadMapByName Error]:', err);
      if (this.onToast) this.onToast(`❌ Erro ao carregar mapa: ${err.message}`, 'error');
    }
  }

  initMapData(mapName, rawJson) {
    this.currentMapName = mapName;
    this.mapJsonData = JSON.parse(JSON.stringify(rawJson));
    this.selectedObject = null;
    this.isMarkingPortal = false;
    this.portalDragStart = null;

    // Destroy previous Phaser tilemap
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }

    this.tileLayerData = {};
    this.phaserLayers = {};
    this.allTileLayerNames = [];

    // Ensure Phaser has the tilemap JSON in cache
    const cacheKey = `editor_map_${mapName}_${Date.now()}`;
    this.cache.tilemap.add(cacheKey, { format: Phaser.Tilemaps.Formats.TILED_JSON, data: this.mapJsonData });
    this.map = this.make.tilemap({ key: cacheKey });

    // Tilesets
    const phaserTilesets = [];
    if (this.mapJsonData.tilesets && this.mapJsonData.tilesets.length > 0) {
      for (const t of this.mapJsonData.tilesets) {
        if (!this.textures.exists(t.name)) {
          const imgUrl = t.image.startsWith('/') ? t.image : `/assets/tilesets/${t.image.split('/').pop()}`;
          this.load.image(t.name, imgUrl);
        }
        const ts = this.map.addTilesetImage(t.name, t.name);
        if (ts) phaserTilesets.push(ts);
      }
    }
    if (phaserTilesets.length === 0) {
      const defaultTs = this.map.addTilesetImage('Outside1 Spring', 'Outside1 Spring');
      if (defaultTs) phaserTilesets.push(defaultTs);
    }

    // Discover all tile layers in map JSON
    const width = this.map.width;
    const height = this.map.height;

    const tileLayers = this.mapJsonData.layers.filter(l => l.type === 'tilelayer');
    for (const l of tileLayers) {
      this.allTileLayerNames.push(l.name);
      if (Array.isArray(l.data)) {
        this.tileLayerData[l.name] = new Uint32Array(l.data);
      } else if (typeof l.data === 'string') {
        this.tileLayerData[l.name] = this._decodeBase64(l.data);
      } else {
        this.tileLayerData[l.name] = new Uint32Array(width * height);
      }

      // Create Phaser tilemap layer
      let pLayer = this.map.getLayerIndex(l.name) !== null
        ? this.map.createLayer(l.name, phaserTilesets, 0, 0)
        : this.map.createBlankLayer(l.name, phaserTilesets, 0, 0);

      if (pLayer) {
        pLayer.setDepth(LAYER_DEPTHS[l.name] || 50);
        if (l.name === 'Collision') {
          pLayer.setVisible(false);
        }
        this.phaserLayers[l.name] = pLayer;
      }
    }

    // Ensure Collision layer exists in memory for painting
    if (!this.tileLayerData['Collision']) {
      this.tileLayerData['Collision'] = new Uint32Array(width * height);
    }

    // Default active layer
    if (this.allTileLayerNames.includes('Ground')) {
      this.activeLayerName = 'Ground';
    } else if (this.allTileLayerNames.length > 0) {
      this.activeLayerName = this.allTileLayerNames[0];
    } else {
      this.activeLayerName = 'Ground';
    }

    // Sincronizar Portais com ROOMS_CONFIG caso o mapa não possua camada de portais
    this._syncPortalsFromRoomConfig(mapName);

    // Setup Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setZoom(1.5);

    // Center camera on default spawn or map center
    const roomDef = ROOMS_CONFIG[mapName];
    if (roomDef && roomDef.defaultSpawn) {
      this.cameras.main.centerOn(roomDef.defaultSpawn.x, roomDef.defaultSpawn.y);
    } else {
      this.cameras.main.centerOn(this.map.widthInPixels / 2, this.map.heightInPixels / 2);
    }

    // Redraw Overlays
    this.drawGrid();
    this.drawObjects();
    this.drawCollisionOverlay();

    if (this.onMapLoaded) {
      this.onMapLoaded(mapName, this.mapJsonData, this.allTileLayerNames);
    }
  }

  _syncPortalsFromRoomConfig(mapName) {
    if (!this.mapJsonData) return;
    let portalLayer = this.mapJsonData.layers.find(l => (l.name === 'Portals' || l.name === 'Warps') && l.type === 'objectgroup');

    // If no portal layer or empty, import from ROOMS_CONFIG if available
    const roomConfig = ROOMS_CONFIG[mapName];
    if ((!portalLayer || portalLayer.objects.length === 0) && roomConfig && roomConfig.portals && roomConfig.portals.length > 0) {
      if (!portalLayer) {
        portalLayer = {
          name: 'Portals',
          type: 'objectgroup',
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
          objects: []
        };
        this.mapJsonData.layers.push(portalLayer);
      }

      roomConfig.portals.forEach((p, idx) => {
        const obj = {
          id: Date.now() + idx,
          name: p.label || `Portal_${p.targetRoom}`,
          type: 'portal_link',
          x: p.trigger.x,
          y: p.trigger.y,
          width: p.trigger.width || 32,
          height: p.trigger.height || 32,
          properties: [
            { name: 'targetRoom', value: p.targetRoom },
            { name: 'targetX', value: p.targetSpawn.x },
            { name: 'targetY', value: p.targetSpawn.y },
            { name: 'label', value: p.label || p.targetRoom },
            { name: 'isLinked', value: true }
          ]
        };
        portalLayer.objects.push(obj);
      });
    }
  }

  // ─── Base64 Utilities ──────────────────────────────────────────────────

  _decodeBase64(base64Str) {
    const binaryString = atob(base64Str.trim());
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Uint32Array(bytes.buffer);
  }

  _encodeBase64(uint32Arr) {
    const bytes = new Uint8Array(uint32Arr.buffer);
    let binaryString = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binaryString);
  }

  _readProps(properties) {
    if (!properties) return {};
    if (Array.isArray(properties)) {
      return Object.fromEntries(properties.map(p => [p.name, p.value]));
    }
    return { ...properties };
  }

  // ─── Overlays Drawing ──────────────────────────────────────────────────

  drawGrid() {
    this.gridGraphics.clear();
    if (!this.showGrid || !this.map) return;

    this.gridGraphics.lineStyle(1, 0xffffff, 0.15);
    const tileW = this.map.tileWidth;
    const tileH = this.map.tileHeight;
    const widthPx = this.map.widthInPixels;
    const heightPx = this.map.heightInPixels;

    for (let x = 0; x <= widthPx; x += tileW) {
      this.gridGraphics.lineBetween(x, 0, x, heightPx);
    }
    for (let y = 0; y <= heightPx; y += tileH) {
      this.gridGraphics.lineBetween(0, y, widthPx, y);
    }
  }

  drawCollisionOverlay() {
    this.collisionGraphics.clear();
    if (!this.showCollisions || !this.map) return;

    const width = this.map.width;
    const height = this.map.height;
    const tileW = this.map.tileWidth;
    const tileH = this.map.tileHeight;

    this.collisionGraphics.fillStyle(0xff1744, 0.35);
    this.collisionGraphics.lineStyle(1, 0xff1744, 0.7);

    // 1. Check all COLLISION_LAYERS from real map
    for (const layerName of COLLISION_LAYERS) {
      const layerData = this.tileLayerData[layerName];
      if (!layerData) continue;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const gid = layerData[y * width + x];
          if (gid > 0) {
            const px = x * tileW;
            const py = y * tileH;
            this.collisionGraphics.fillRect(px, py, tileW, tileH);
            this.collisionGraphics.strokeRect(px, py, tileW, tileH);
          }
        }
      }
    }
  }

  drawObjects() {
    this.objectGraphics.clear();
    if (!this.showObjects || !this.mapJsonData) return;

    const objectLayers = this.mapJsonData.layers.filter(l => l.type === 'objectgroup');

    for (const layer of objectLayers) {
      const isPortalLayer = (layer.name === 'Portals' || layer.name === 'Warps' || layer.name === 'Doors');
      const isSignLayer = (layer.name === 'Points of interest' || layer.name === 'Signs');

      for (const obj of layer.objects) {
        if (isPortalLayer) {
          this._drawSinglePortal(obj);
          continue;
        }

        if (isSignLayer || (obj.properties && (this._readProps(obj.properties).dialogue || this._readProps(obj.properties).text))) {
          this._drawSignObject(obj, layer.name);
          continue;
        }

        // Generic objects
        let color = 0x00e5ff;
        if (layer.name === 'Objects') color = 0xff5252;

        this.objectGraphics.lineStyle(2, color, 0.85);
        if (obj.point) {
          this.objectGraphics.fillStyle(color, 0.6);
          this.objectGraphics.fillCircle(obj.x, obj.y, 6);
        } else {
          const w = obj.width || 16;
          const h = obj.height || 16;
          this.objectGraphics.fillStyle(color, 0.2);
          this.objectGraphics.fillRect(obj.x, obj.y, w, h);
          this.objectGraphics.strokeRect(obj.x, obj.y, w, h);
        }

        if (this.selectedObject && this.selectedObject.id === obj.id) {
          this.objectGraphics.lineStyle(3, 0xffffff, 1);
          const w = obj.width || 16;
          const h = obj.height || 16;
          this.objectGraphics.strokeRect(obj.x - 2, obj.y - 2, w + 4, h + 4);
        }
      }
    }

  }

  _drawSinglePortal(obj) {
    const props = this._readProps(obj.properties);
    const targetRoom = props.targetRoom || obj.name || 'Destino';

    const tileW = (this.map && this.map.tileWidth) ? this.map.tileWidth : 32;
    const tileH = (this.map && this.map.tileHeight) ? this.map.tileHeight : 32;
    const w = obj.width || tileW;
    const h = obj.height || tileH;

    // Vibrant purple/magenta portal trigger styling
    this.objectGraphics.fillStyle(0xab47bc, 0.32);
    this.objectGraphics.lineStyle(2, 0xba68c8, 0.95);
    this.objectGraphics.fillRect(obj.x, obj.y, w, h);
    this.objectGraphics.strokeRect(obj.x, obj.y, w, h);

    // If multi-grid portal, draw light inner grid lines
    if (w > tileW || h > tileH) {
      this.objectGraphics.lineStyle(1, 0xba68c8, 0.4);
      for (let x = obj.x + tileW; x < obj.x + w; x += tileW) {
        this.objectGraphics.lineBetween(x, obj.y, x, obj.y + h);
      }
      for (let y = obj.y + tileH; y < obj.y + h; y += tileH) {
        this.objectGraphics.lineBetween(obj.x, y, obj.x + w, y);
      }
    }

    // Portal center warp core icon
    const cx = obj.x + w / 2;
    const cy = obj.y + h / 2;
    this.objectGraphics.fillStyle(0xe1bee7, 0.9);
    this.objectGraphics.fillCircle(cx, cy, 6);
    this.objectGraphics.lineStyle(2, 0xffffff, 1);
    this.objectGraphics.strokeCircle(cx, cy, 8);

    // Selected highlight
    if (this.selectedObject && this.selectedObject.id === obj.id) {
      this.objectGraphics.lineStyle(3, 0xffeb3b, 1);
      this.objectGraphics.strokeRect(obj.x - 3, obj.y - 3, w + 6, h + 6);
    }
  }

  _drawSignObject(obj, layerName) {
    const props = this._readProps(obj.properties);
    const title = props.title || obj.name || 'Placa';

    const tileW = (this.map && this.map.tileWidth) ? this.map.tileWidth : 32;
    const tileH = (this.map && this.map.tileHeight) ? this.map.tileHeight : 32;
    const w = obj.width || tileW;
    const h = obj.height || tileH;

    // Amber / Gold Signboard highlight
    this.objectGraphics.fillStyle(0xfbc02d, 0.35);
    this.objectGraphics.lineStyle(2, 0xffd54f, 0.95);
    this.objectGraphics.fillRect(obj.x, obj.y, w, h);
    this.objectGraphics.strokeRect(obj.x, obj.y, w, h);

    // Signpost bubble marker
    const cx = obj.x + w / 2;
    const cy = obj.y + h / 2;
    this.objectGraphics.fillStyle(0xfff176, 0.95);
    this.objectGraphics.fillCircle(cx, cy, Math.min(6, w / 4));

    if (this.selectedObject && this.selectedObject.id === obj.id) {
      this.objectGraphics.lineStyle(3, 0xffffff, 1);
      this.objectGraphics.strokeRect(obj.x - 2, obj.y - 2, w + 4, h + 4);
    }
  }

  findPortalAt(worldX, worldY) {
    if (!this.mapJsonData) return null;
    const portalLayer = this.mapJsonData.layers.find(l => (l.name === 'Portals' || l.name === 'Warps' || l.name === 'Doors') && l.type === 'objectgroup');
    if (!portalLayer) return null;
    for (const obj of portalLayer.objects) {
      const w = obj.width || 32;
      const h = obj.height || 32;
      if (worldX >= obj.x && worldX <= obj.x + w && worldY >= obj.y && worldY <= obj.y + h) {
        return { ...obj, layerName: portalLayer.name };
      }
    }
    return null;
  }

  findSignAt(worldX, worldY) {
    if (!this.mapJsonData) return null;
    const objectLayers = this.mapJsonData.layers.filter(l => l.type === 'objectgroup');
    const tileW = (this.map && this.map.tileWidth) ? this.map.tileWidth : 32;
    const tileH = (this.map && this.map.tileHeight) ? this.map.tileHeight : 32;

    for (const layer of objectLayers) {
      if (!layer.objects) continue;
      for (const obj of layer.objects) {
        const isSign = obj.type === 'sign' || layer.name === 'Points of interest' || layer.name === 'Signs';
        if (isSign) {
          const w = obj.width || tileW;
          const h = obj.height || tileH;
          if (worldX >= obj.x && worldX <= obj.x + w && worldY >= obj.y && worldY <= obj.y + h) {
            return { ...obj, layerName: layer.name };
          }
        }
      }
    }
    return null;
  }

  cancelPortalMarking() {
    if (this.isMarkingPortal) {
      this.isMarkingPortal = false;
      this.portalDragStart = null;
      this.cursorGraphics.clear();
      if (this.onToast) this.onToast('🚫 Marcação de teleporte cancelada.', 'info');
    }
  }

  // ─── Cursor & Interaction ─────────────────────────────────────────────────

  updateCursor(worldX, worldY) {
    this.cursorGraphics.clear();
    if (!this.map) return;

    const tileW = this.map.tileWidth || 32;
    const tileH = this.map.tileHeight || 32;
    const tileX = Math.floor(worldX / tileW);
    const tileY = Math.floor(worldY / tileH);

    if (tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) {
      return;
    }

    if (this.activeTool === 'hand') {
      return;
    }

    // Active drag box for Teleport/Portal (1 or more grids)
    if (this.isMarkingPortal && this.portalDragStart) {
      const minTileX = Math.max(0, Math.min(this.portalDragStart.tileX, tileX));
      const maxTileX = Math.min(this.map.width - 1, Math.max(this.portalDragStart.tileX, tileX));
      const minTileY = Math.max(0, Math.min(this.portalDragStart.tileY, tileY));
      const maxTileY = Math.min(this.map.height - 1, Math.max(this.portalDragStart.tileY, tileY));

      const boxX = minTileX * tileW;
      const boxY = minTileY * tileH;
      const boxW = (maxTileX - minTileX + 1) * tileW;
      const boxH = (maxTileY - minTileY + 1) * tileH;

      this.cursorGraphics.fillStyle(0xba68c8, 0.45);
      this.cursorGraphics.fillRect(boxX, boxY, boxW, boxH);
      this.cursorGraphics.lineStyle(2, 0xff80ab, 1);
      this.cursorGraphics.strokeRect(boxX, boxY, boxW, boxH);

      // Inner grid subdivisions if multi-tile
      this.cursorGraphics.lineStyle(1, 0xffffff, 0.35);
      for (let x = boxX + tileW; x < boxX + boxW; x += tileW) {
        this.cursorGraphics.lineBetween(x, boxY, x, boxY + boxH);
      }
      for (let y = boxY + tileH; y < boxY + boxH; y += tileH) {
        this.cursorGraphics.lineBetween(boxX, y, boxX + boxW, y);
      }
      return;
    }

    const snapX = tileX * tileW;
    const snapY = tileY * tileH;

    if (this.activeLayerName === 'Collision') {
      this.cursorGraphics.lineStyle(2, 0xff0000, 0.9);
      this.cursorGraphics.fillStyle(0xff0000, 0.4);
    } else if (this.activeTool === 'pencil') {
      this.cursorGraphics.lineStyle(2, 0x00ff00, 0.9);
      this.cursorGraphics.fillStyle(0x00ff00, 0.25);
    } else if (this.activeTool === 'eraser') {
      this.cursorGraphics.lineStyle(2, 0xff0000, 0.9);
      this.cursorGraphics.fillStyle(0xff0000, 0.25);
    } else if (this.activeTool === 'bucket') {
      this.cursorGraphics.lineStyle(2, 0xffff00, 0.9);
      this.cursorGraphics.fillStyle(0xffff00, 0.25);
    } else if (this.activeTool === 'picker') {
      this.cursorGraphics.lineStyle(2, 0x00e5ff, 0.9);
      this.cursorGraphics.fillStyle(0x00e5ff, 0.25);
    } else if (this.activeTool === 'sign') {
      // 1 grid indicator for Sign (Amber/Gold)
      this.cursorGraphics.lineStyle(2, 0xffd54f, 1);
      this.cursorGraphics.fillStyle(0xfbc02d, 0.4);
      this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
      this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);
      this.cursorGraphics.fillStyle(0xfff176, 0.95);
      this.cursorGraphics.fillCircle(snapX + tileW / 2, snapY + tileH / 2, Math.min(6, tileW / 4));
      return;
    } else if (this.activeTool === 'link') {
      // 1 grid hover indicator for Teleport (Purple)
      this.cursorGraphics.lineStyle(2, 0xba68c8, 1);
      this.cursorGraphics.fillStyle(0xab47bc, 0.35);
      this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
      this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);
      return;
    } else {
      this.cursorGraphics.lineStyle(2, 0xffffff, 0.9);
      this.cursorGraphics.fillStyle(0xffffff, 0.1);
    }

    this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
    this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);
  }

  onPointerDown(pointer) {
    if (!this.map) return;

    const isSpaceDown = (this.spaceKey && this.spaceKey.isDown);
    if (pointer.middleButtonDown() || pointer.rightButtonDown() || isSpaceDown) {
      this.isDraggingMap = true;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
      this.camStartX = this.cameras.main.scrollX;
      this.camStartY = this.cameras.main.scrollY;
      if (this.sys.game.canvas) this.sys.game.canvas.style.cursor = 'grabbing';
      return;
    }

    if (pointer.leftButtonDown()) {
      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const tileW = this.map.tileWidth || 32;
      const tileH = this.map.tileHeight || 32;
      const tileX = Math.floor(worldPoint.x / tileW);
      const tileY = Math.floor(worldPoint.y / tileH);

      // Check if clicking on an existing sign on the map (when using sign tool, hand tool, or picker)
      const existingSign = this.findSignAt(worldPoint.x, worldPoint.y);
      if (existingSign && (this.activeTool === 'sign' || this.activeTool === 'hand' || this.activeTool === 'picker')) {
        this.selectedObject = existingSign;
        this.drawObjects();
        if (this.onSignSelected) this.onSignSelected(this.selectedObject);
        return;
      }

      // Check if clicking on an existing portal on the map (when using hand tool)
      if (this.activeTool === 'hand') {
        const existingPortal = this.findPortalAt(worldPoint.x, worldPoint.y);
        if (existingPortal) {
          this.selectedObject = existingPortal;
          this.drawObjects();
          if (this.onPortalSelected) this.onPortalSelected(this.selectedObject);
          return;
        }

        // Hand tool with no object clicked: drag the map
        this.isDraggingMap = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
        this.camStartX = this.cameras.main.scrollX;
        this.camStartY = this.cameras.main.scrollY;
        if (this.sys.game.canvas) this.sys.game.canvas.style.cursor = 'grabbing';
        return;
      }

      // Placa (1 grid): mark immediately on click and open modal
      if (this.activeTool === 'sign') {
        this.addOrSelectSignAt(worldPoint.x, worldPoint.y);
        return;
      }

      // Teleporte: start marking 1 or more grids via drag
      if (this.activeTool === 'link') {
        const existingPortal = this.findPortalAt(worldPoint.x, worldPoint.y);
        this.isMarkingPortal = true;
        this.portalDragStart = {
          tileX,
          tileY,
          startX: worldPoint.x,
          startY: worldPoint.y,
          existingPortal
        };
        this.updateCursor(worldPoint.x, worldPoint.y);
        return;
      }

      this.isPainting = true;
      this.applyToolAt(tileX, tileY, worldPoint.x, worldPoint.y);
    }
  }

  onPointerMove(pointer) {
    if (!this.map) return;

    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const tileW = this.map.tileWidth || 32;
    const tileH = this.map.tileHeight || 32;
    const tileX = Math.floor(worldPoint.x / tileW);
    const tileY = Math.floor(worldPoint.y / tileH);

    this.lastPointerWorldX = worldPoint.x;
    this.lastPointerWorldY = worldPoint.y;

    this.updateCursor(worldPoint.x, worldPoint.y);

    if (this.onCoordsUpdate) {
      this.onCoordsUpdate(tileX, tileY, Math.floor(worldPoint.x), Math.floor(worldPoint.y));
    }

    if (this.isDraggingMap) {
      const zoom = this.cameras.main.zoom;
      this.cameras.main.scrollX = this.camStartX - (pointer.x - this.dragStartX) / zoom;
      this.cameras.main.scrollY = this.camStartY - (pointer.y - this.dragStartY) / zoom;
      return;
    }

    if (this.isPainting && pointer.leftButtonDown()) {
      if (this.activeTool === 'pencil' || this.activeTool === 'eraser') {
        this.applyToolAt(tileX, tileY, worldPoint.x, worldPoint.y);
      }
    }
  }

  onPointerUp(pointer) {
    this.isDraggingMap = false;
    this.isPainting = false;

    if (this.isMarkingPortal && this.portalDragStart) {
      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const tileW = this.map.tileWidth || 32;
      const tileH = this.map.tileHeight || 32;
      const curTileX = Math.floor(worldPoint.x / tileW);
      const curTileY = Math.floor(worldPoint.y / tileH);

      const dist = Phaser.Math.Distance.Between(this.portalDragStart.startX, this.portalDragStart.startY, worldPoint.x, worldPoint.y);

      // If clicked without dragging on an existing portal, select it
      if (dist < 8 && this.portalDragStart.existingPortal) {
        this.selectedObject = this.portalDragStart.existingPortal;
        this.drawObjects();
        if (this.onPortalSelected) this.onPortalSelected(this.selectedObject);
      } else {
        const minTileX = Math.max(0, Math.min(this.portalDragStart.tileX, curTileX));
        const maxTileX = Math.min(this.map.width - 1, Math.max(this.portalDragStart.tileX, curTileX));
        const minTileY = Math.max(0, Math.min(this.portalDragStart.tileY, curTileY));
        const maxTileY = Math.min(this.map.height - 1, Math.max(this.portalDragStart.tileY, curTileY));

        const boxX = minTileX * tileW;
        const boxY = minTileY * tileH;
        const boxW = (maxTileX - minTileX + 1) * tileW;
        const boxH = (maxTileY - minTileY + 1) * tileH;

        // If single click without drag on existing portal covering that tile
        const existingUnder = (dist < 8) ? this.findPortalAt(boxX + tileW / 2, boxY + tileH / 2) : null;
        if (existingUnder) {
          this.selectedObject = existingUnder;
          this.drawObjects();
          if (this.onPortalSelected) this.onPortalSelected(this.selectedObject);
        } else {
          // Create the teleporte with the marked grid area (1 or more grids)
          const targetRoom = (this.currentMapName === 'pallet_town') ? 'route_1' : 'pallet_town';
          const newPortal = this.addPortalTrigger(boxX, boxY, boxW, boxH, targetRoom, 0, 0, 'Novo Portal');
          if (this.onPortalSelected) this.onPortalSelected({ ...newPortal, layerName: 'Portals' });
        }
      }

      this.isMarkingPortal = false;
      this.portalDragStart = null;
      this.updateCursor(worldPoint.x, worldPoint.y);
    }

    if (this.sys.game.canvas) {
      this.sys.game.canvas.style.cursor = (this.activeTool === 'hand') ? 'grab' : 'crosshair';
    }
  }

  onWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    let zoom = this.cameras.main.zoom;
    if (deltaY > 0) {
      zoom = Math.max(0.4, zoom - 0.15);
    } else if (deltaY < 0) {
      zoom = Math.min(4.0, zoom + 0.15);
    }
    this.cameras.main.setZoom(zoom);
  }

  // ─── Tools & Editing Operations ──────────────────────────────────────────

  applyToolAt(tileX, tileY, worldX, worldY) {
    if (!this.map || tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) {
      return;
    }

    if (this.activeTool === 'sign') {
      this.addOrSelectSignAt(worldX, worldY);
      return;
    }

    const layerName = this.activeLayerName;

    if (layerName === 'Collision') {
      const gidToPaint = (this.activeTool === 'eraser') ? 0 : 1;
      this.setTile(tileX, tileY, gidToPaint, 'Collision');
      return;
    }

    if (this.activeTool === 'pencil') {
      this.setTile(tileX, tileY, this.selectedTileGid, layerName);
    } else if (this.activeTool === 'eraser') {
      this.setTile(tileX, tileY, 0, layerName);
    } else if (this.activeTool === 'bucket') {
      this.floodFill(tileX, tileY, this.selectedTileGid, layerName);
    } else if (this.activeTool === 'picker') {
      const currentGid = this.getTile(tileX, tileY, layerName);
      if (currentGid > 0) {
        this.selectedTileGid = currentGid;
        if (this.onTilePicked) this.onTilePicked(currentGid);
      }
    } else if (this.activeTool === 'object') {
      this.selectObjectAt(worldX, worldY);
    }
  }

  getTile(x, y, layerName = this.activeLayerName) {
    const data = this.tileLayerData[layerName];
    if (!data) return 0;
    return data[y * this.map.width + x];
  }

  setTile(x, y, gid, layerName = this.activeLayerName) {
    let data = this.tileLayerData[layerName];
    if (!data) {
      data = new Uint32Array(this.map.width * this.map.height);
      this.tileLayerData[layerName] = data;
    }

    const index = y * this.map.width + x;
    if (data[index] === gid) return;
    data[index] = gid;

    if (layerName === 'Collision') {
      this.drawCollisionOverlay();
      return;
    }

    const phaserLayer = this.phaserLayers[layerName];
    if (phaserLayer) {
      if (gid === 0) {
        phaserLayer.removeTileAt(x, y);
      } else {
        phaserLayer.putTileAt(gid, x, y);
      }
    }
  }

  floodFill(startX, startY, fillGid, layerName = this.activeLayerName) {
    const targetGid = this.getTile(startX, startY, layerName);
    if (targetGid === fillGid) return;

    const width = this.map.width;
    const height = this.map.height;
    const queue = [[startX, startY]];
    const visited = new Set();

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const key = `${x},${y}`;

      if (x < 0 || x >= width || y < 0 || y >= height || visited.has(key)) {
        continue;
      }
      visited.add(key);

      if (this.getTile(x, y, layerName) === targetGid) {
        this.setTile(x, y, fillGid, layerName);
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
  }

  // ─── Object, Portal & Sign Management ─────────────────────────────────────

  selectObjectAt(worldX, worldY) {
    if (!this.mapJsonData) return;

    const objectLayers = this.mapJsonData.layers.filter(l => l.type === 'objectgroup');
    let found = null;

    for (const layer of objectLayers) {
      for (const obj of layer.objects) {
        const w = obj.width || 16;
        const h = obj.height || 16;
        if (worldX >= obj.x && worldX <= obj.x + w && worldY >= obj.y && worldY <= obj.y + h) {
          found = { ...obj, layerName: layer.name };
          break;
        }
      }
      if (found) break;
    }

    this.selectedObject = found;
    this.drawObjects();

    if (found) {
      const isSign = found.layerName === 'Points of interest' || found.layerName === 'Signs' || (found.properties && (this._readProps(found.properties).dialogue || this._readProps(found.properties).text));
      if (isSign && this.onSignSelected) {
        this.onSignSelected(found);
      } else if (this.onObjectSelected) {
        this.onObjectSelected(found);
      }
    }
  }

  addOrSelectSignAt(worldX, worldY) {
    const tileW = (this.map && this.map.tileWidth) ? this.map.tileWidth : 32;
    const tileH = (this.map && this.map.tileHeight) ? this.map.tileHeight : 32;
    const snapX = Math.floor(worldX / tileW) * tileW;
    const snapY = Math.floor(worldY / tileH) * tileH;

    // Check if clicking existing sign at this location (across all layers)
    const existing = this.findSignAt(worldX, worldY);
    if (existing) {
      this.selectedObject = existing;
      this.drawObjects();
      if (this.onSignSelected) this.onSignSelected(this.selectedObject);
      return existing;
    }

    const signLayer = this._getOrCreateObjectLayer('Points of interest');

    // Create new sign object (exactly 1 grid cell)
    const newSign = {
      id: Date.now(),
      name: 'Placa',
      type: 'sign',
      x: snapX,
      y: snapY,
      width: tileW,
      height: tileH,
      properties: [
        { name: 'title', value: 'PLACA' },
        { name: 'text', value: 'Mensagem da placa aqui...' }
      ]
    };

    signLayer.objects.push(newSign);
    this.selectedObject = { ...newSign, layerName: 'Points of interest' };
    this.drawObjects();

    if (this.onToast) this.onToast(`💬 Nova placa criada em [${snapX}, ${snapY}] (1 grid)!`, 'success');
    if (this.onSignSelected) this.onSignSelected(this.selectedObject);
    return newSign;
  }

  addPortalTrigger(x, y, w = 32, h = 32, targetRoom = 'route_1', targetX = 608, targetY = 1184, label = 'Portal') {
    const portalLayer = this._getOrCreateObjectLayer('Portals');
    const newPortal = {
      id: Date.now(),
      name: label,
      type: 'portal_link',
      x: x,
      y: y,
      width: w,
      height: h,
      properties: [
        { name: 'targetRoom', value: targetRoom },
        { name: 'targetX', value: targetX },
        { name: 'targetY', value: targetY },
        { name: 'label', value: label },
        { name: 'isLinked', value: true }
      ]
    };

    portalLayer.objects.push(newPortal);
    this.selectedObject = { ...newPortal, layerName: 'Portals' };
    this.drawObjects();

    const tileW = (this.map && this.map.tileWidth) ? this.map.tileWidth : 32;
    const tileH = (this.map && this.map.tileHeight) ? this.map.tileHeight : 32;
    const gridCols = Math.round(w / tileW);
    const gridRows = Math.round(h / tileH);
    if (this.onToast) this.onToast(`🚪 Teleporte (${gridCols}x${gridRows} grid${gridCols * gridRows > 1 ? 's' : ''}) criado em [${x}, ${y}]!`, 'success');
    return newPortal;
  }

  _getOrCreateObjectLayer(layerName = 'Portals') {
    if (!this.mapJsonData) return null;
    let layer = this.mapJsonData.layers.find(l => l.name === layerName && l.type === 'objectgroup');
    if (!layer) {
      layer = {
        name: layerName,
        type: 'objectgroup',
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        objects: []
      };
      this.mapJsonData.layers.push(layer);
    }
    return layer;
  }

  // ─── Setters & Toggles ───────────────────────────────────────────────────

  setActiveLayer(layerName) {
    this.activeLayerName = layerName;
  }

  setLayerVisible(layerName, visible) {
    if (layerName === 'Collision') {
      this.showCollisions = visible;
      this.drawCollisionOverlay();
    } else if (this.phaserLayers[layerName]) {
      this.phaserLayers[layerName].setVisible(visible);
    }
  }

  setTool(tool) {
    this.activeTool = tool;
    if (this.sys.game.canvas) {
      this.sys.game.canvas.style.cursor = (tool === 'hand') ? 'grab' : 'crosshair';
    }
  }

  setSelectedTile(gid) {
    this.selectedTileGid = gid;
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.drawGrid();
  }

  toggleCollisions() {
    this.showCollisions = !this.showCollisions;
    this.drawCollisionOverlay();
    if (this.onToast) {
      this.onToast(this.showCollisions ? '🛡️ Overlay de Colisões: LIGADO' : '🛡️ Overlay de Colisões: DESLIGADO', 'info');
    }
  }

  toggleObjects() {
    this.showObjects = !this.showObjects;
    this.drawObjects();
  }

  zoomIn() {
    const newZoom = Math.min(4.0, this.cameras.main.zoom + 0.25);
    this.cameras.main.setZoom(newZoom);
  }

  zoomOut() {
    const newZoom = Math.max(0.4, this.cameras.main.zoom - 0.25);
    this.cameras.main.setZoom(newZoom);
  }

  // ─── Export JSON ─────────────────────────────────────────────────────────

  getExportJson() {
    if (!this.mapJsonData) return null;

    const exportMap = JSON.parse(JSON.stringify(this.mapJsonData));
    const width = this.map.width;
    const height = this.map.height;

    // Save all tile layers as standard JSON arrays (native Kanto format)
    for (const [layerName, dataArr] of Object.entries(this.tileLayerData)) {
      if (!dataArr) continue;

      let jsonLayer = exportMap.layers.find(l => l.name === layerName && l.type === 'tilelayer');
      if (!jsonLayer) {
        jsonLayer = {
          name: layerName,
          type: 'tilelayer',
          width: width,
          height: height,
          x: 0,
          y: 0,
          visible: true,
          opacity: 1,
          data: []
        };
        const firstObjIndex = exportMap.layers.findIndex(l => l.type === 'objectgroup');
        if (firstObjIndex >= 0) {
          exportMap.layers.splice(firstObjIndex, 0, jsonLayer);
        } else {
          exportMap.layers.push(jsonLayer);
        }
      }

      // Delete any base64 / compression flags so Phaser loads as standard array
      delete jsonLayer.encoding;
      delete jsonLayer.compression;
      jsonLayer.data = Array.from(dataArr);
    }

    return exportMap;
  }
}

