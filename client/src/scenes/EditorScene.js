import Phaser from 'phaser';
import { ROOMS_CONFIG } from '../maps/roomData';
import { COLLISION_TYPES, COLLISION_META } from '../maps/collisionConfig';

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
    this.selectedCollisionType = COLLISION_TYPES.SOLID;
    this.onCollisionTypePicked = null;
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
    this.onZoomUpdate = null;
    this.onObjectDeleted = null;
  }

  preload() {
    const t = Date.now();
    this.load.image('Outside1 Spring', '/assets/tilesets/Outside1 Spring_extruded.png');
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

    // Disable context menu on canvas so right-click pan works without browser menu
    if (this.input && this.input.mouse) {
      this.input.mouse.disableContextMenu();
    }
    if (this.sys.game.canvas) {
      this.sys.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Auto-resize viewport for full editor canvas
    if (this.scale) {
      this.scale.scaleMode = Phaser.Scale.RESIZE;
      this.scale.autoCenter = Phaser.Scale.NO_CENTER;
      this.scale.resize(window.innerWidth, window.innerHeight);
      if (this.cameras && this.cameras.main) {
        this.cameras.main.setSize(window.innerWidth, window.innerHeight);
        this.cameras.main.setBackgroundColor('#090a10');
      }
      this._onResize = () => {
        if (document.body.classList.contains('editor-mode')) {
          this.scale.resize(window.innerWidth, window.innerHeight);
          if (this.cameras && this.cameras.main) {
            this.cameras.main.setSize(window.innerWidth, window.innerHeight);
          }
        }
      };
      window.removeEventListener('resize', this._onResize);
      window.addEventListener('resize', this._onResize);
    }

    // Input Listeners
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.input.on('wheel', this.onWheel, this);

    // Native mouse wheel zooming listener with precise pointer coordinates
    this._canvasWheelHandler = (e) => {
      if (!document.body.classList.contains('editor-mode')) return;
      if (e.target && e.target.closest && e.target.closest('.editor-sidebar, .editor-top-bar, .editor-modal, .editor-palette, .nodegraph-overlay')) {
        return;
      }
      e.preventDefault();
      this.handleZoomDelta(e.deltaY, e.clientX, e.clientY);
    };
    window.addEventListener('wheel', this._canvasWheelHandler, { passive: false });

    // Window pointerup listener to ensure dragging stops even when mouse released outside canvas
    this._onWindowPointerUp = () => {
      if (this.isDraggingMap) {
        this.isDraggingMap = false;
        if (this.sys.game.canvas) {
          this.sys.game.canvas.style.cursor = (this.activeTool === 'hand') ? 'grab' : 'crosshair';
        }
      }
      this.isPainting = false;
    };
    window.addEventListener('pointerup', this._onWindowPointerUp);
    window.addEventListener('mouseup', this._onWindowPointerUp);

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
    this.input.keyboard.on('keydown-PLUS', () => { if (!isTyping()) this.zoomIn(); });
    this.input.keyboard.on('keydown-NUMPAD_ADD', () => { if (!isTyping()) this.zoomIn(); });
    this.input.keyboard.on('keydown-MINUS', () => { if (!isTyping()) this.zoomOut(); });
    this.input.keyboard.on('keydown-NUMPAD_SUBTRACT', () => { if (!isTyping()) this.zoomOut(); });
    this.input.keyboard.on('keydown-ZERO', () => { if (!isTyping()) this.resetZoom(); });
    this.input.keyboard.on('keydown-NUMPAD_ZERO', () => { if (!isTyping()) this.resetZoom(); });
    this.input.keyboard.on('keydown-HOME', () => { if (!isTyping()) this.centerMap(); });

    // Scene shutdown cleanup
    this.events.on('shutdown', () => {
      if (this._canvasWheelHandler) {
        window.removeEventListener('wheel', this._canvasWheelHandler);
      }
      if (this._onResize) {
        window.removeEventListener('resize', this._onResize);
      }
      if (this._onWindowPointerUp) {
        window.removeEventListener('pointerup', this._onWindowPointerUp);
        window.removeEventListener('mouseup', this._onWindowPointerUp);
      }
    });
  }

  // ─── Dynamic Map Loading ──────────────────────────────────────────────────

  async loadMapByName(mapName) {
    if (this.onToast) this.onToast(`Carregando mapa: ${mapName}...`, 'info');
    try {
      let mapJson = null;
      try {
        const res = await fetch(`/api/admin/map?map=${encodeURIComponent(mapName)}`);
        if (res.ok) {
          mapJson = await res.json();
        }
      } catch (apiErr) {
        console.warn(`[EditorScene] API /api/admin/map falhou, buscando via asset estático:`, apiErr);
      }

      if (!mapJson) {
        const staticRes = await fetch(`/assets/maps/${encodeURIComponent(mapName)}.json?t=${Date.now()}`);
        if (!staticRes.ok) throw new Error(`HTTP ${staticRes.status}: Mapa '${mapName}' não encontrado`);
        mapJson = await staticRes.json();
      }

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
        const ts = this.map.addTilesetImage(t.name, t.name, 32, 32, 1, 2);
        if (ts) phaserTilesets.push(ts);
      }
    }
    if (phaserTilesets.length === 0) {
      const defaultTs = this.map.addTilesetImage('Outside1 Spring', 'Outside1 Spring', 32, 32, 1, 2);
      if (defaultTs) phaserTilesets.push(defaultTs);
    }

    // Discover all tile layers in map JSON
    const width = this.map.width;
    const height = this.map.height;

    // Check if layers have saved depths; if not, initial sort based on legacy LAYER_DEPTHS
    const hasSavedDepths = this.mapJsonData.layers.some(l => {
      const p = this._readProps(l.properties);
      return p.depth !== undefined;
    });

    if (!hasSavedDepths) {
      const visualLayers = this.mapJsonData.layers.filter(l => l.type === 'tilelayer' && l.name !== 'Collision');
      visualLayers.sort((a, b) => (LAYER_DEPTHS[a.name] || 50) - (LAYER_DEPTHS[b.name] || 50));
      const otherLayers = this.mapJsonData.layers.filter(l => l.type !== 'tilelayer' || l.name === 'Collision');
      this.mapJsonData.layers = [...visualLayers, ...otherLayers];
    }

    // Ensure Overhead layer is always present in every map (even if empty/unused)
    let overheadLayer = this.mapJsonData.layers.find(l => l.name === 'Overhead' && l.type === 'tilelayer');
    if (!overheadLayer) {
      const maxId = this.mapJsonData.layers.reduce((max, l) => Math.max(max, l.id || 0), 0);
      overheadLayer = {
        id: maxId + 1,
        name: 'Overhead',
        type: 'tilelayer',
        width: width,
        height: height,
        x: 0,
        y: 0,
        visible: true,
        opacity: 1,
        data: new Array(width * height).fill(0),
        properties: [
          { name: 'isOverhead', type: 'bool', value: true },
          { name: 'depth', type: 'int', value: 1000 }
        ]
      };
      const colOrObjIndex = this.mapJsonData.layers.findIndex(l => l.name === 'Collision' || l.type === 'objectgroup');
      if (colOrObjIndex !== -1) {
        this.mapJsonData.layers.splice(colOrObjIndex, 0, overheadLayer);
      } else {
        this.mapJsonData.layers.push(overheadLayer);
      }
    }

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
        if (l.name === 'Collision') {
          pLayer.setVisible(false);
        }
        this.phaserLayers[l.name] = pLayer;
      }
    }

    // Dynamic depth calculation and assignment to all layers
    this.updateLayerDepths();

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

    // Setup Camera - Full unconstrained pan & zoom
    this.cameras.main.removeBounds();
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBackgroundColor('#090a10');

    // Center camera on default spawn or map center (accounting for UI overlay panels)
    const roomDef = ROOMS_CONFIG[mapName];
    if (roomDef && roomDef.defaultSpawn) {
      this.centerOnWorldPoint(roomDef.defaultSpawn.x, roomDef.defaultSpawn.y);
    } else {
      this.centerOnWorldPoint(this.map.widthInPixels / 2, this.map.heightInPixels / 2);
    }
    this._notifyZoom();

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

    const colData = this.tileLayerData['Collision'];
    const walkableOverrides = new Set();
    if (colData) {
      for (let i = 0; i < width * height; i++) {
        if (colData[i] === COLLISION_TYPES.WALKABLE_OVERRIDE) {
          walkableOverrides.add(i);
        }
      }
    }

    for (const layerName of COLLISION_LAYERS) {
      const layerData = this.tileLayerData[layerName];
      if (!layerData) continue;

      const isExplicitCollisionLayer = (layerName === 'Collision');

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          const gid = layerData[idx];
          if (gid <= 0) continue;

          // If this tile has an explicit walkable override, ignore automatic layer collision!
          if (!isExplicitCollisionLayer && walkableOverrides.has(idx)) {
            continue;
          }

          const px = x * tileW;
          const py = y * tileH;
          const cx = px + tileW / 2;
          const cy = py + tileH / 2;

          if (isExplicitCollisionLayer && gid in COLLISION_META) {
            const meta = COLLISION_META[gid];
            this.collisionGraphics.fillStyle(meta.color, meta.fillAlpha);
            this.collisionGraphics.lineStyle(1.5, meta.color, meta.strokeAlpha);
            this.collisionGraphics.fillRect(px, py, tileW, tileH);
            this.collisionGraphics.strokeRect(px, py, tileW, tileH);

            if (gid === COLLISION_TYPES.WALKABLE_OVERRIDE) {
              // Draw gentle green check / X indicator showing collision was erased
              this.collisionGraphics.lineStyle(2, 0x00e676, 0.95);
              this.collisionGraphics.lineBetween(px + 6, cy, cx - 1, py + tileH - 7);
              this.collisionGraphics.lineBetween(cx - 1, py + tileH - 7, px + tileW - 6, py + 7);
            } else if (gid === COLLISION_TYPES.LEDGE_DOWN) {
              // Top barrier line
              this.collisionGraphics.lineStyle(3, 0xffeb3b, 1);
              this.collisionGraphics.lineBetween(px + 2, py + 2, px + tileW - 2, py + 2);

              // Down arrow
              this.collisionGraphics.lineStyle(2, 0xffffff, 1);
              this.collisionGraphics.lineBetween(cx, cy - 7, cx, cy + 7);
              this.collisionGraphics.lineBetween(cx - 5, cy + 2, cx, cy + 7);
              this.collisionGraphics.lineBetween(cx + 5, cy + 2, cx, cy + 7);
            } else if (gid === COLLISION_TYPES.LEDGE_LEFT) {
              // Right barrier line
              this.collisionGraphics.lineStyle(3, 0xffeb3b, 1);
              this.collisionGraphics.lineBetween(px + tileW - 2, py + 2, px + tileW - 2, py + tileH - 2);

              // Left arrow
              this.collisionGraphics.lineStyle(2, 0xffffff, 1);
              this.collisionGraphics.lineBetween(cx + 7, cy, cx - 7, cy);
              this.collisionGraphics.lineBetween(cx - 2, cy - 5, cx - 7, cy);
              this.collisionGraphics.lineBetween(cx - 2, cy + 5, cx - 7, cy);
            } else if (gid === COLLISION_TYPES.LEDGE_RIGHT) {
              // Left barrier line
              this.collisionGraphics.lineStyle(3, 0xffeb3b, 1);
              this.collisionGraphics.lineBetween(px + 2, py + 2, px + 2, py + tileH - 2);

              // Right arrow
              this.collisionGraphics.lineStyle(2, 0xffffff, 1);
              this.collisionGraphics.lineBetween(cx - 7, cy, cx + 7, cy);
              this.collisionGraphics.lineBetween(cx + 2, cy - 5, cx + 7, cy);
              this.collisionGraphics.lineBetween(cx + 2, cy + 5, cx + 7, cy);
            } else if (gid === COLLISION_TYPES.LEDGE_UP) {
              // Bottom barrier line
              this.collisionGraphics.lineStyle(3, 0xffeb3b, 1);
              this.collisionGraphics.lineBetween(px + 2, py + tileH - 2, px + tileW - 2, py + tileH - 2);

              // Up arrow
              this.collisionGraphics.lineStyle(2, 0xffffff, 1);
              this.collisionGraphics.lineBetween(cx, cy + 7, cx, cy - 7);
              this.collisionGraphics.lineBetween(cx - 5, cy - 2, cx, cy - 7);
              this.collisionGraphics.lineBetween(cx + 5, cy - 2, cx, cy - 7);
            }
          } else {
            // Standard solid collision
            this.collisionGraphics.fillStyle(0xff1744, 0.35);
            this.collisionGraphics.lineStyle(1, 0xff1744, 0.7);
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
      if (this.activeTool === 'eraser') {
        this.cursorGraphics.lineStyle(2, 0xff1744, 0.9);
        this.cursorGraphics.fillStyle(0xff1744, 0.25);
        this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
        this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);
        // Draw eraser X
        this.cursorGraphics.lineStyle(2, 0xffffff, 0.85);
        this.cursorGraphics.lineBetween(snapX + 6, snapY + 6, snapX + tileW - 6, snapY + tileH - 6);
        this.cursorGraphics.lineBetween(snapX + tileW - 6, snapY + 6, snapX + 6, snapY + tileH - 6);
        return;
      }

      const colType = this.selectedCollisionType || COLLISION_TYPES.SOLID;
      const meta = COLLISION_META[colType] || COLLISION_META[COLLISION_TYPES.SOLID];
      this.cursorGraphics.lineStyle(2, meta.color, 0.95);
      this.cursorGraphics.fillStyle(meta.color, meta.fillAlpha);
      this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
      this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);

      const cx = snapX + tileW / 2;
      const cy = snapY + tileH / 2;
      if (colType === COLLISION_TYPES.LEDGE_DOWN) {
        this.cursorGraphics.lineStyle(2, 0xffffff, 1);
        this.cursorGraphics.lineBetween(cx, cy - 7, cx, cy + 7);
        this.cursorGraphics.lineBetween(cx - 5, cy + 2, cx, cy + 7);
        this.cursorGraphics.lineBetween(cx + 5, cy + 2, cx, cy + 7);
      } else if (colType === COLLISION_TYPES.LEDGE_LEFT) {
        this.cursorGraphics.lineStyle(2, 0xffffff, 1);
        this.cursorGraphics.lineBetween(cx + 7, cy, cx - 7, cy);
        this.cursorGraphics.lineBetween(cx - 2, cy - 5, cx - 7, cy);
        this.cursorGraphics.lineBetween(cx - 2, cy + 5, cx - 7, cy);
      } else if (colType === COLLISION_TYPES.LEDGE_RIGHT) {
        this.cursorGraphics.lineStyle(2, 0xffffff, 1);
        this.cursorGraphics.lineBetween(cx - 7, cy, cx + 7, cy);
        this.cursorGraphics.lineBetween(cx + 2, cy - 5, cx + 7, cy);
        this.cursorGraphics.lineBetween(cx + 2, cy + 5, cx + 7, cy);
      } else if (colType === COLLISION_TYPES.LEDGE_UP) {
        this.cursorGraphics.lineStyle(2, 0xffffff, 1);
        this.cursorGraphics.lineBetween(cx, cy + 7, cx, cy - 7);
        this.cursorGraphics.lineBetween(cx - 5, cy - 2, cx, cy - 7);
        this.cursorGraphics.lineBetween(cx + 5, cy - 2, cx, cy - 7);
      }
      return;
    } else if (this.activeTool === 'pencil') {
      this.cursorGraphics.lineStyle(2, 0x00ff00, 0.9);
      this.cursorGraphics.fillStyle(0x00ff00, 0.25);
    } else if (this.activeTool === 'eraser') {
      this.cursorGraphics.lineStyle(2, 0xff1744, 0.95);
      this.cursorGraphics.fillStyle(0xff1744, 0.25);
      this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
      this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);
      // Draw crisp "X" for eraser
      this.cursorGraphics.lineStyle(2, 0xffffff, 0.9);
      this.cursorGraphics.lineBetween(snapX + 6, snapY + 6, snapX + tileW - 6, snapY + tileH - 6);
      this.cursorGraphics.lineBetween(snapX + tileW - 6, snapY + 6, snapX + 6, snapY + tileH - 6);
      return;
    } else if (this.activeTool === 'bucket') {
      this.cursorGraphics.lineStyle(2, 0xffff00, 0.9);
      this.cursorGraphics.fillStyle(0xffff00, 0.25);
    } else if (this.activeTool === 'picker') {
      this.cursorGraphics.lineStyle(2, 0x00e5ff, 1);
      this.cursorGraphics.fillStyle(0x00e5ff, 0.25);
      this.cursorGraphics.fillRect(snapX, snapY, tileW, tileH);
      this.cursorGraphics.strokeRect(snapX, snapY, tileW, tileH);
      // Eyedropper target circle
      this.cursorGraphics.lineStyle(2, 0xffffff, 0.95);
      this.cursorGraphics.strokeCircle(snapX + tileW / 2, snapY + tileH / 2, tileW / 4);
      return;
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

    // Pan with Middle Click, Right Click, Space + Click, or Hand tool
    const isRightClick = pointer.rightButtonDown() || pointer.button === 2 || (pointer.event && (pointer.event.button === 2 || pointer.event.buttons === 2));
    const isMiddleClick = pointer.middleButtonDown() || pointer.button === 1 || (pointer.event && (pointer.event.button === 1 || pointer.event.buttons === 4));
    const isSpaceDown = (this.spaceKey && this.spaceKey.isDown) || (pointer.event && (pointer.event.code === 'Space' || pointer.event.spaceKey));
    const isHandTool = (this.activeTool === 'hand');

    if (isRightClick || isMiddleClick || isSpaceDown || isHandTool) {
      this.isDraggingMap = true;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
      this.camStartX = Number.isFinite(this.cameras.main.scrollX) ? this.cameras.main.scrollX : 0;
      this.camStartY = Number.isFinite(this.cameras.main.scrollY) ? this.cameras.main.scrollY : 0;
      if (this.sys.game.canvas) this.sys.game.canvas.style.cursor = 'grabbing';
      return;
    }

    if (pointer.leftButtonDown()) {
      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const tileW = this.map.tileWidth || 32;
      const tileH = this.map.tileHeight || 32;
      const tileX = Math.floor(worldPoint.x / tileW);
      const tileY = Math.floor(worldPoint.y / tileH);

      // Alt + Click: Quick Eyedropper on current active layer
      if (pointer.event && pointer.event.altKey) {
        this.pickTileAt(tileX, tileY);
        return;
      }

      // Picker tool: Pick tile from current layer
      if (this.activeTool === 'picker') {
        this.pickTileAt(tileX, tileY);
        return;
      }

      // Eraser tool: check if clicking on existing sign or portal to delete
      if (this.activeTool === 'eraser') {
        const existingSign = this.findSignAt(worldPoint.x, worldPoint.y);
        if (existingSign) {
          this.deleteObject(existingSign);
          if (this.onToast) this.onToast(`🗑️ Placa "${existingSign.name || 'Placa'}" apagada!`, 'info');
          return;
        }
        const existingPortal = this.findPortalAt(worldPoint.x, worldPoint.y);
        if (existingPortal) {
          this.deleteObject(existingPortal);
          if (this.onToast) this.onToast(`🗑️ Portal "${existingPortal.name || 'Portal'}" apagado!`, 'info');
          return;
        }
      }

      // Check if clicking on an existing sign on the map (when using sign or object tool)
      const existingSign = this.findSignAt(worldPoint.x, worldPoint.y);
      if (existingSign && (this.activeTool === 'sign' || this.activeTool === 'object')) {
        this.selectedObject = existingSign;
        this.drawObjects();
        if (this.onSignSelected) this.onSignSelected(this.selectedObject);
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

    if (this.isDraggingMap) {
      const zoom = this.cameras.main.zoom || 1;
      this.cameras.main.scrollX = this.camStartX - (pointer.x - this.dragStartX) / zoom;
      this.cameras.main.scrollY = this.camStartY - (pointer.y - this.dragStartY) / zoom;
      if (this.cursorGraphics) this.cursorGraphics.clear();
      return;
    }

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
    this.handleZoomDelta(deltaY, pointer.x, pointer.y);
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
      if (this.activeTool === 'bucket') {
        const fillGid = (this.selectedCollisionType || COLLISION_TYPES.SOLID);
        this.floodFill(tileX, tileY, fillGid, 'Collision');
      } else if (this.activeTool === 'eraser') {
        const idx = tileY * this.map.width + tileX;
        const curGid = this.tileLayerData['Collision'] ? this.tileLayerData['Collision'][idx] : 0;
        const hasCollidableBase = COLLISION_LAYERS.filter(l => l !== 'Collision').some(lName => {
          return this.tileLayerData[lName] && this.tileLayerData[lName][idx] > 0;
        });

        if (hasCollidableBase && curGid !== COLLISION_TYPES.WALKABLE_OVERRIDE) {
          this.setTile(tileX, tileY, COLLISION_TYPES.WALKABLE_OVERRIDE, 'Collision');
        } else {
          this.setTile(tileX, tileY, 0, 'Collision');
        }
      } else if (this.activeTool === 'picker') {
        this.pickTileAt(tileX, tileY);
      } else {
        const gidToPaint = (this.selectedCollisionType || COLLISION_TYPES.SOLID);
        this.setTile(tileX, tileY, gidToPaint, 'Collision');
      }
      return;
    }

    if (this.activeTool === 'pencil') {
      this.setTile(tileX, tileY, this.selectedTileGid, layerName);
    } else if (this.activeTool === 'eraser') {
      this.setTile(tileX, tileY, 0, layerName);
    } else if (this.activeTool === 'bucket') {
      this.floodFill(tileX, tileY, this.selectedTileGid, layerName);
    } else if (this.activeTool === 'picker') {
      this.pickTileAt(tileX, tileY);
    } else if (this.activeTool === 'object') {
      this.selectObjectAt(worldX, worldY);
    }
  }

  pickTileAt(tileX, tileY) {
    if (!this.map || tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) {
      return;
    }

    const layerName = this.activeLayerName;
    if (layerName === 'Collision') {
      const colGid = this.getTile(tileX, tileY, 'Collision');
      if (colGid in COLLISION_META) {
        this.selectedCollisionType = colGid;
        if (this.onCollisionTypePicked) this.onCollisionTypePicked(colGid);
        if (this.onToast) this.onToast(`🎯 Colisão: ${COLLISION_META[colGid].name}`, 'info');
      } else {
        if (this.onToast) this.onToast('Sem colisão marcada neste tile (Livre)', 'info');
      }
      return;
    }

    let foundGid = this.getTile(tileX, tileY, layerName);
    let targetLayer = layerName;

    if (!foundGid || foundGid <= 0) {
      // Search visible layers from top to bottom (Overhead down to Ground)
      const visualLayers = [...this.allTileLayerNames]
        .filter(name => name !== 'Collision' && (!this.phaserLayers[name] || this.phaserLayers[name].visible))
        .reverse();

      for (const lName of visualLayers) {
        const g = this.getTile(tileX, tileY, lName);
        if (g && g > 0) {
          foundGid = g;
          targetLayer = lName;
          this.activeLayerName = lName;
          break;
        }
      }
    }

    if (foundGid && foundGid > 0) {
      this.selectedTileGid = foundGid;
      if (this.onTilePicked) this.onTilePicked(foundGid, targetLayer);
    } else {
      if (this.onToast) this.onToast(`Nenhum tile encontrado nesta posição (GID 0)`, 'info');
    }
  }

  setCollisionType(type) {
    this.selectedCollisionType = type;
  }

  getTile(x, y, layerName = this.activeLayerName) {
    const data = this.tileLayerData[layerName];
    if (!data) return 0;
    return data[y * this.map.width + x];
  }

  setTile(x, y, gid, layerName = this.activeLayerName, skipOverlay = false) {
    let data = this.tileLayerData[layerName];
    if (!data) {
      data = new Uint32Array(this.map.width * this.map.height);
      this.tileLayerData[layerName] = data;
    }

    const index = y * this.map.width + x;

    if (layerName === 'Collision') {
      if (gid === 0) {
        // Erasing on Collision layer:
        // Check if there is an underlying collision from tileset layers (Mountain, Trees, Buildings, Water, Shore)
        let hasUnderlyingCollision = false;
        for (const lName of COLLISION_LAYERS) {
          if (lName === 'Collision') continue;
          const lData = this.tileLayerData[lName];
          if (lData && lData[index] > 0) {
            hasUnderlyingCollision = true;
            break;
          }
        }

        if (hasUnderlyingCollision) {
          // If already WALKABLE_OVERRIDE, toggle back to 0 (restore default layer collision)
          // Otherwise, set to WALKABLE_OVERRIDE to erase the tileset collision!
          if (data[index] === COLLISION_TYPES.WALKABLE_OVERRIDE) {
            data[index] = 0;
          } else {
            data[index] = COLLISION_TYPES.WALKABLE_OVERRIDE;
          }
        } else {
          data[index] = 0;
        }
      } else {
        data[index] = gid;
      }

      if (!skipOverlay) this.drawCollisionOverlay();
      return;
    }

    if (data[index] === gid) return;
    data[index] = gid;

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
        this.setTile(x, y, fillGid, layerName, true);
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }

    if (layerName === 'Collision') {
      this.drawCollisionOverlay();
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

  // ─── Layer Ordering & Dynamic Depth Management ───────────────────────────

  _setLayerProperty(layerObj, propName, propValue, propType = 'int') {
    if (!layerObj) return;
    if (!layerObj.properties) {
      layerObj.properties = [];
    }
    if (Array.isArray(layerObj.properties)) {
      const existing = layerObj.properties.find(p => p.name === propName);
      if (existing) {
        existing.value = propValue;
        if (propType) existing.type = propType;
      } else {
        layerObj.properties.push({ name: propName, type: propType, value: propValue });
      }
    } else if (typeof layerObj.properties === 'object') {
      layerObj.properties[propName] = propValue;
    }
  }

  updateLayerDepths() {
    if (!this.mapJsonData || !this.mapJsonData.layers) return;

    const visualTileLayers = this.mapJsonData.layers.filter(
      l => l.type === 'tilelayer' && l.name !== 'Collision'
    );

    visualTileLayers.forEach((l, idx) => {
      const props = this._readProps(l.properties);
      const isOverhead = props.isOverhead === true || props.depth >= 1000 || (/overhead|arch/i.test(l.name) && props.isOverhead !== false);
      const depth = isOverhead ? (1000 + idx * 10) : (10 + idx * 10);

      this._setLayerProperty(l, 'isOverhead', isOverhead, 'bool');
      this._setLayerProperty(l, 'depth', depth, 'int');

      const pLayer = this.phaserLayers[l.name];
      if (pLayer) {
        pLayer.setDepth(depth);
        if (this.children && this.children.bringToTop) {
          this.children.bringToTop(pLayer);
        }
      }
    });

    // Collision layer
    const colLayer = this.mapJsonData.layers.find(l => l.name === 'Collision' && l.type === 'tilelayer');
    if (colLayer) {
      this._setLayerProperty(colLayer, 'depth', 89999, 'int');
      if (this.phaserLayers['Collision']) {
        this.phaserLayers['Collision'].setDepth(89999);
        if (this.children && this.children.bringToTop) {
          this.children.bringToTop(this.phaserLayers['Collision']);
        }
      }
    }

    if (this.collisionGraphics) {
      this.collisionGraphics.setDepth(89999);
      if (this.children && this.children.bringToTop) this.children.bringToTop(this.collisionGraphics);
    }
    if (this.objectGraphics) {
      this.objectGraphics.setDepth(99999);
      if (this.children && this.children.bringToTop) this.children.bringToTop(this.objectGraphics);
    }
    if (this.gridGraphics) {
      this.gridGraphics.setDepth(100000);
      if (this.children && this.children.bringToTop) this.children.bringToTop(this.gridGraphics);
    }
    if (this.cursorGraphics) {
      this.cursorGraphics.setDepth(100001);
      if (this.children && this.children.bringToTop) this.children.bringToTop(this.cursorGraphics);
    }

    if (this.sys && this.sys.displayList) {
      this.sys.displayList.queueDepthSort();
    }
  }

  moveLayer(layerName, direction) {
    if (!this.mapJsonData || !this.mapJsonData.layers) return false;
    if (layerName === 'Collision') return false;

    const visualLayers = this.mapJsonData.layers.filter(
      l => l.type === 'tilelayer' && l.name !== 'Collision'
    );
    const currentIndex = visualLayers.findIndex(l => l.name === layerName);
    if (currentIndex === -1) return false;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= visualLayers.length) return false;

    const currentLayer = visualLayers[currentIndex];
    const targetLayer = visualLayers[targetIndex];

    const rawCurrentIdx = this.mapJsonData.layers.indexOf(currentLayer);
    const rawTargetIdx = this.mapJsonData.layers.indexOf(targetLayer);

    if (rawCurrentIdx !== -1 && rawTargetIdx !== -1) {
      this.mapJsonData.layers[rawCurrentIdx] = targetLayer;
      this.mapJsonData.layers[rawTargetIdx] = currentLayer;
    }

    this.allTileLayerNames = this.mapJsonData.layers
      .filter(l => l.type === 'tilelayer')
      .map(l => l.name);

    this.updateLayerDepths();
    return true;
  }

  toggleLayerOverhead(layerName) {
    if (!this.mapJsonData || !this.mapJsonData.layers) return false;
    const visualLayers = this.mapJsonData.layers.filter(
      l => l.type === 'tilelayer' && l.name !== 'Collision'
    );
    const targetLayer = visualLayers.find(l => l.name === layerName);
    if (!targetLayer) return false;

    const props = this._readProps(targetLayer.properties);
    const currentIsOverhead = props.isOverhead === true || props.depth >= 1000;
    const newIsOverhead = !currentIsOverhead;

    this._setLayerProperty(targetLayer, 'isOverhead', newIsOverhead, 'bool');
    this._setLayerProperty(targetLayer, 'depth', newIsOverhead ? 1000 : 50, 'int');

    // If promoted to overhead, move to overhead section; if demoted, move to ground section
    const rawIdx = this.mapJsonData.layers.indexOf(targetLayer);
    if (rawIdx !== -1) {
      this.mapJsonData.layers.splice(rawIdx, 1);
      if (newIsOverhead) {
        const firstColOrObj = this.mapJsonData.layers.findIndex(l => l.name === 'Collision' || l.type === 'objectgroup');
        if (firstColOrObj !== -1) {
          this.mapJsonData.layers.splice(firstColOrObj, 0, targetLayer);
        } else {
          this.mapJsonData.layers.push(targetLayer);
        }
      } else {
        const firstOverhead = this.mapJsonData.layers.findIndex(l => {
          if (l.type !== 'tilelayer' || l.name === 'Collision') return true;
          const p = this._readProps(l.properties);
          return p.isOverhead === true || p.depth >= 1000 || (/overhead|arch/i.test(l.name) && p.isOverhead !== false);
        });
        if (firstOverhead !== -1) {
          this.mapJsonData.layers.splice(firstOverhead, 0, targetLayer);
        } else {
          this.mapJsonData.layers.unshift(targetLayer);
        }
      }
    }

    this.allTileLayerNames = this.mapJsonData.layers
      .filter(l => l.type === 'tilelayer')
      .map(l => l.name);

    this.updateLayerDepths();
    return true;
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

  onEditorOpen() {
    if (this.scale) {
      this.scale.scaleMode = Phaser.Scale.RESIZE;
      this.scale.autoCenter = Phaser.Scale.NO_CENTER;
      this.scale.resize(window.innerWidth, window.innerHeight);
    }
    if (this.cameras && this.cameras.main) {
      this.cameras.main.setSize(window.innerWidth, window.innerHeight);
      this.cameras.main.setBackgroundColor('#090a10');
    }
    if (this.sys.game.canvas) {
      this.sys.game.canvas.style.margin = '0px';
      this.sys.game.canvas.style.padding = '0px';
      this.sys.game.canvas.style.width = '100%';
      this.sys.game.canvas.style.height = '100%';
    }
    this.centerMap();
  }

  centerMap() {
    if (!this.map) return;
    this.centerOnWorldPoint(this.map.widthInPixels / 2, this.map.heightInPixels / 2);
    if (this.onToast) this.onToast('🎯 Mapa centralizado', 'info');
  }

  centerOnWorldPoint(worldX, worldY) {
    if (!this.cameras || !this.cameras.main) return;
    const cam = this.cameras.main;
    const zoom = cam.zoom || 1;

    // Available screen viewport boundaries accounting for UI overlays:
    // Left Toolbar width ~52px + 14px margin = ~70px
    // Right Sidebar width ~340px + 14px margin = ~354px
    // Top Bar height ~56px + 12px margin = ~68px
    // Bottom Hints height ~30px + 14px margin = ~44px
    const leftBoundary = 70;
    const rightBoundary = (cam.width || window.innerWidth) - 354;
    const topBoundary = 68;
    const bottomBoundary = (cam.height || window.innerHeight) - 44;

    const screenCenterX = leftBoundary + Math.max(0, (rightBoundary - leftBoundary) / 2);
    const screenCenterY = topBoundary + Math.max(0, (bottomBoundary - topBoundary) / 2);

    cam.scrollX = worldX - cam.width * 0.5 - (screenCenterX - cam.width * 0.5) / zoom;
    cam.scrollY = worldY - cam.height * 0.5 - (screenCenterY - cam.height * 0.5) / zoom;
  }

  handleZoomDelta(deltaY, screenX, screenY) {
    if (!this.cameras || !this.cameras.main) return;
    const cam = this.cameras.main;
    const oldZoom = cam.zoom || 1;
    const factor = deltaY < 0 ? 1.15 : (1 / 1.15);
    const newZoom = Phaser.Math.Clamp(oldZoom * factor, 0.2, 5.0);

    if (Math.abs(newZoom - oldZoom) > 0.001) {
      const sx = (screenX !== undefined) ? screenX : (cam.width * 0.5);
      const sy = (screenY !== undefined) ? screenY : (cam.height * 0.5);

      const worldPoint = cam.getWorldPoint(sx, sy);
      cam.setZoom(newZoom);
      cam.scrollX = worldPoint.x - cam.width * 0.5 - (sx - cam.width * 0.5) / newZoom;
      cam.scrollY = worldPoint.y - cam.height * 0.5 - (sy - cam.height * 0.5) / newZoom;
      this._notifyZoom();
    }
  }

  _zoomToLevel(newZoom) {
    if (!this.cameras || !this.cameras.main) return;
    const cam = this.cameras.main;
    const oldZoom = cam.zoom || 1;
    if (Math.abs(newZoom - oldZoom) < 0.001) return;

    const leftBoundary = 70;
    const rightBoundary = (cam.width || window.innerWidth) - 354;
    const topBoundary = 68;
    const bottomBoundary = (cam.height || window.innerHeight) - 44;
    const sx = leftBoundary + Math.max(0, (rightBoundary - leftBoundary) / 2);
    const sy = topBoundary + Math.max(0, (bottomBoundary - topBoundary) / 2);

    const worldPoint = cam.getWorldPoint(sx, sy);
    cam.setZoom(newZoom);
    cam.scrollX = worldPoint.x - cam.width * 0.5 - (sx - cam.width * 0.5) / newZoom;
    cam.scrollY = worldPoint.y - cam.height * 0.5 - (sy - cam.height * 0.5) / newZoom;
    this._notifyZoom();
  }

  resetZoom() {
    if (!this.cameras || !this.cameras.main) return;
    this.cameras.main.setZoom(1.0);
    this._notifyZoom();
    this.centerMap();
  }

  zoomIn() {
    if (!this.cameras || !this.cameras.main) return;
    const curZoom = this.cameras.main.zoom || 1;
    const newZoom = Phaser.Math.Clamp(curZoom + 0.25, 0.2, 5.0);
    this._zoomToLevel(newZoom);
  }

  zoomOut() {
    if (!this.cameras || !this.cameras.main) return;
    const curZoom = this.cameras.main.zoom || 1;
    const newZoom = Phaser.Math.Clamp(curZoom - 0.25, 0.2, 5.0);
    this._zoomToLevel(newZoom);
  }

  setZoom(zoomVal) {
    if (!this.cameras || !this.cameras.main) return;
    const newZoom = Phaser.Math.Clamp(zoomVal, 0.2, 5.0);
    this._zoomToLevel(newZoom);
  }

  _notifyZoom() {
    if (this.onZoomUpdate && this.cameras && this.cameras.main) {
      this.onZoomUpdate(this.cameras.main.zoom);
    }
  }

  deleteObject(obj) {
    if (!this.mapJsonData || !obj) return;
    for (const layer of this.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        layer.objects = layer.objects.filter(o => o.id !== obj.id && !(o.x === obj.x && o.y === obj.y));
      }
    }
    if (this.selectedObject && (this.selectedObject.id === obj.id || (this.selectedObject.x === obj.x && this.selectedObject.y === obj.y))) {
      this.selectedObject = null;
    }
    this.drawObjects();
    if (this.onObjectDeleted) this.onObjectDeleted(obj);
  }

  clearActiveLayer() {
    const layerName = this.activeLayerName;
    if (!this.map || !layerName) return;

    const width = this.map.width;
    const height = this.map.height;
    this.tileLayerData[layerName] = new Uint32Array(width * height);

    if (layerName === 'Collision') {
      this.drawCollisionOverlay();
    } else {
      const phaserLayer = this.phaserLayers[layerName];
      if (phaserLayer) {
        phaserLayer.removeAllTiles();
      }
    }
    if (this.onToast) this.onToast(`🧹 Camada "${layerName}" limpa com sucesso.`, 'info');
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

