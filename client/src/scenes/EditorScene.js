import Phaser from 'phaser';

export default class EditorScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EditorScene' });

    this.map = null;
    this.mapJsonData = null;

    // Tile layers data structure
    this.tileLayerData = {
      Ground: null,     // Grass / terrain base (Depth 1)
      World: null,      // Building walls / structures (Depth 5)
      Overhead: null,   // Roof tops / tree canopies (Depth 50000)
      Collision: null   // Collision barrier layer (Depth 90000)
    };

    this.phaserLayers = {
      Ground: null,
      World: null,
      Overhead: null,
      Collision: null
    };

    // Active State
    this.activeTool = 'pencil'; // 'pencil', 'eraser', 'bucket', 'picker', 'object'
    this.selectedTileGid = 1;
    this.activeLayerName = 'World'; // 'Ground', 'World', 'Overhead', 'Collision'
    this.showGrid = true;
    this.showObjects = true;

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

    // Portal Linking State
    this.portalLinkState = null; // { linkId, origin, waypoints: [], destination }
    this.lastPointerWorldX = 0;
    this.lastPointerWorldY = 0;

    // UI Callback hooks
    this.onCoordsUpdate = null;
    this.onTilePicked = null;
    this.onObjectSelected = null;
    this.onToast = null;
  }

  preload() {
    this.load.image('spz3zUx_small', '/assets/tilesets/spz3zUx_small.png');
    this.load.tilemapTiledJSON('kanto_editor_map', '/assets/maps/spz3zUx_small.json');
    this.load.json('kanto_raw_json', '/assets/maps/spz3zUx_small.json');
  }

  create() {
    this.mapJsonData = JSON.parse(JSON.stringify(this.cache.json.get('kanto_raw_json')));
    this.map = this.make.tilemap({ key: 'kanto_editor_map' });

    const width = this.map.width;
    const height = this.map.height;
    const layerDepths = {
      Ground: 1,
      World: 5,
      Overhead: 50000,
      Collision: 90000
    };

    // Bind all tilesets dynamically
    const phaserTilesets = [];
    if (this.mapJsonData.tilesets && this.mapJsonData.tilesets.length > 0) {
      for (const t of this.mapJsonData.tilesets) {
        const ts = this.map.addTilesetImage(t.name, t.name);
        if (ts) phaserTilesets.push(ts);
      }
    }
    if (phaserTilesets.length === 0) {
      const defaultTs = this.map.addTilesetImage('spz3zUx_small', 'spz3zUx_small');
      if (defaultTs) phaserTilesets.push(defaultTs);
    }

    // Decode base64 layer data for memory modification
    ['Ground', 'World', 'Overhead', 'Collision'].forEach(layerName => {
      let layerJson = this.mapJsonData.layers.find(l => l.name === layerName && l.type === 'tilelayer');
      if (layerJson && layerJson.data) {
        this.tileLayerData[layerName] = this._decodeBase64(layerJson.data);
      } else {
        this.tileLayerData[layerName] = new Uint32Array(width * height);
      }

      // Create Phaser tilemap layer
      if (this.map.getLayerIndex(layerName) !== null) {
        this.phaserLayers[layerName] = this.map.createLayer(layerName, phaserTilesets, 0, 0);
      } else {
        this.phaserLayers[layerName] = this.map.createBlankLayer(layerName, phaserTilesets, 0, 0);
      }
      this.phaserLayers[layerName].setDepth(layerDepths[layerName]);
    });

    if (this.phaserLayers.Collision) {
      this.phaserLayers.Collision.setVisible(false);
    }

    // Setup Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.centerOn(1064, 3336);

    // Create Graphics Overlays
    this.gridGraphics = this.add.graphics().setDepth(100000);
    this.cursorGraphics = this.add.graphics().setDepth(100001);
    this.objectGraphics = this.add.graphics().setDepth(99999);
    this.collisionGraphics = this.add.graphics().setDepth(89999);

    // Draw Initial Overlays
    this.drawGrid();
    this.drawObjects();
    this.drawCollisionOverlay();

    // Input Listeners
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.input.on('wheel', this.onWheel, this);

    // Keyboard Shortcuts
    this.input.keyboard.on('keydown-H', () => this.setTool('hand'));
    this.input.keyboard.on('keydown-L', () => this.setTool('link'));
    this.input.keyboard.on('keydown-B', () => this.setTool('pencil'));
    this.input.keyboard.on('keydown-E', () => this.setTool('eraser'));
    this.input.keyboard.on('keydown-F', () => this.setTool('bucket'));
    this.input.keyboard.on('keydown-I', () => this.setTool('picker'));
    this.input.keyboard.on('keydown-O', () => this.setTool('object'));
    this.input.keyboard.on('keydown-G', () => this.toggleGrid());
    this.input.keyboard.on('keydown-ESC', () => this.cancelPortalLink());
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.portalLinkState && this.portalLinkState.origin) {
        const lastWp = (this.portalLinkState.waypoints && this.portalLinkState.waypoints.length > 0)
          ? this.portalLinkState.waypoints[this.portalLinkState.waypoints.length - 1]
          : { x: this.portalLinkState.origin.x + 64, y: this.portalLinkState.origin.y };
        this.finishPortalLinkDestination(Math.floor(lastWp.x / 16) * 16, Math.floor(lastWp.y / 16) * 16);
      }
    });
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

  // ─── Rendering Overlays ───────────────────────────────────────────────────

  drawGrid() {
    this.gridGraphics.clear();
    if (!this.showGrid) return;

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

  _drawDashedLine(graphics, x1, y1, x2, y2, dashLen = 8, gapLen = 6) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return;

    const angle = Math.atan2(dy, dx);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    let current = 0;
    while (current < dist) {
      const end = Math.min(current + dashLen, dist);
      const startX = x1 + cos * current;
      const startY = y1 + sin * current;
      const endX = x1 + cos * end;
      const endY = y1 + sin * end;
      graphics.lineBetween(startX, startY, endX, endY);
      current += dashLen + gapLen;
    }
  }

  _readProps(properties) {
    if (!properties) return {};
    if (Array.isArray(properties)) {
      return Object.fromEntries(properties.map(p => [p.name, p.value]));
    }
    return { ...properties };
  }

  drawObjects() {
    this.objectGraphics.clear();
    if (!this.showObjects || !this.mapJsonData) return;

    const objectLayers = this.mapJsonData.layers.filter(l => l.type === 'objectgroup');

    for (const layer of objectLayers) {
      let color = 0x00e5ff; // cyan (Zones)
      if (layer.name === 'Objects') color = 0xff5252; // red
      if (layer.name === 'Points of interest') color = 0xffcc00; // yellow
      if (layer.name === 'Portals' || layer.name === 'Warps' || layer.name === 'Doors') color = 0xab47bc; // purple

      for (const obj of layer.objects) {
        if (obj.type === 'portal_link') continue; // Handled separately in _drawPortalLinks()

        this.objectGraphics.lineStyle(2, color, 0.85);

        if (obj.point) {
          this.objectGraphics.fillStyle(color, 0.6);
          this.objectGraphics.fillCircle(obj.x, obj.y, 6);
          this.objectGraphics.strokeCircle(obj.x, obj.y, 8);
        } else {
          const w = obj.width || 16;
          const h = obj.height || 16;
          this.objectGraphics.fillStyle(color, 0.2);
          this.objectGraphics.fillRect(obj.x, obj.y, w, h);
          this.objectGraphics.strokeRect(obj.x, obj.y, w, h);
        }

        if (this.selectedObject && this.selectedObject.id === obj.id && this.selectedObject.layerName === layer.name) {
          this.objectGraphics.lineStyle(3, 0xffffff, 1);
          const w = obj.width || 16;
          const h = obj.height || 16;
          this.objectGraphics.strokeRect(obj.x - 2, obj.y - 2, w + 4, h + 4);
        }
      }
    }

    this._drawPortalLinks();
  }

  _drawPortalLinks() {
    if (!this.mapJsonData) return;

    const portalLinksMap = new Map();

    const portalLayers = this.mapJsonData.layers.filter(l => l.type === 'objectgroup');
    for (const layer of portalLayers) {
      for (const obj of layer.objects) {
        if (obj.type === 'portal_link') {
          const props = this._readProps(obj.properties);
          const linkId = props.linkId || obj.name;
          if (!portalLinksMap.has(linkId)) {
            portalLinksMap.set(linkId, { waypoints: [], isLinked: false });
          }
          const entry = portalLinksMap.get(linkId);

          if (props.role === 'origin') {
            entry.origin = obj;
            entry.isLinked = (props.isLinked === true || props.isLinked === 'true');
            if (props.waypoints) {
              try { entry.waypoints = typeof props.waypoints === 'string' ? JSON.parse(props.waypoints) : props.waypoints; } catch (e) {}
            }
          } else if (props.role === 'destination') {
            entry.destination = obj;
          }
        }
      }
    }

    // Render linked and unlinked portal pairs
    for (const [linkId, linkData] of portalLinksMap.entries()) {
      const { origin, destination, waypoints, isLinked } = linkData;

      if (origin) {
        const ox = origin.x + (origin.width || 32) / 2;
        const oy = origin.y + (origin.height || 32) / 2;

        const colorOrigin = isLinked ? 0xab47bc : 0xff1744; // Purple if linked, Red if unlinked
        this.objectGraphics.lineStyle(2, colorOrigin, 0.9);
        this.objectGraphics.fillStyle(colorOrigin, 0.25);
        this.objectGraphics.fillRect(origin.x, origin.y, origin.width || 32, origin.height || 32);
        this.objectGraphics.strokeRect(origin.x, origin.y, origin.width || 32, origin.height || 32);
        this.objectGraphics.fillCircle(ox, oy, 6);

        let currentX = ox;
        let currentY = oy;

        if (waypoints && waypoints.length > 0) {
          for (let i = 0; i < waypoints.length; i++) {
            const wp = waypoints[i];
            this.objectGraphics.lineStyle(2, 0x00e5ff, 0.9);
            this.objectGraphics.fillStyle(0x00e5ff, 0.7);
            this.objectGraphics.fillCircle(wp.x, wp.y, 5);
            this.objectGraphics.strokeCircle(wp.x, wp.y, 7);

            this.objectGraphics.lineStyle(2, colorOrigin, 0.85);
            this._drawDashedLine(this.objectGraphics, currentX, currentY, wp.x, wp.y, 8, 6);

            currentX = wp.x;
            currentY = wp.y;
          }
        }

        if (destination && isLinked) {
          const dx = destination.x + (destination.width || 32) / 2;
          const dy = destination.y + (destination.height || 32) / 2;

          this.objectGraphics.lineStyle(2, 0xff4081, 0.9);
          this.objectGraphics.fillStyle(0xff4081, 0.25);
          this.objectGraphics.fillRect(destination.x, destination.y, destination.width || 32, destination.height || 32);
          this.objectGraphics.strokeRect(destination.x, destination.y, destination.width || 32, destination.height || 32);
          this.objectGraphics.fillCircle(dx, dy, 6);

          this.objectGraphics.lineStyle(2, 0xff4081, 0.85);
          this._drawDashedLine(this.objectGraphics, currentX, currentY, dx, dy, 8, 6);
        } else {
          // Unlinked warning circle indicator
          this.objectGraphics.lineStyle(3, 0xff0000, 1);
          this.objectGraphics.strokeCircle(ox, oy, 14);
        }
      }
    }

    // Render active in-progress portal link creation (rubberband dashed line)
    if (this.portalLinkState && this.portalLinkState.origin) {
      const { origin, waypoints } = this.portalLinkState;
      const ox = origin.x + (origin.width || 32) / 2;
      const oy = origin.y + (origin.height || 32) / 2;

      this.objectGraphics.lineStyle(3, 0xffff00, 0.9);
      this.objectGraphics.fillStyle(0xffff00, 0.3);
      this.objectGraphics.fillRect(origin.x, origin.y, origin.width || 32, origin.height || 32);
      this.objectGraphics.strokeRect(origin.x, origin.y, origin.width || 32, origin.height || 32);

      let currentX = ox;
      let currentY = oy;

      if (waypoints && waypoints.length > 0) {
        for (const wp of waypoints) {
          this.objectGraphics.lineStyle(2, 0x00e5ff, 0.9);
          this.objectGraphics.fillStyle(0x00e5ff, 0.8);
          this.objectGraphics.fillCircle(wp.x, wp.y, 6);

          this.objectGraphics.lineStyle(2, 0xffff00, 0.85);
          this._drawDashedLine(this.objectGraphics, currentX, currentY, wp.x, wp.y, 8, 6);

          currentX = wp.x;
          currentY = wp.y;
        }
      }

      if (this.lastPointerWorldX !== undefined && this.lastPointerWorldY !== undefined) {
        this.objectGraphics.lineStyle(2, 0xffff00, 0.7);
        this._drawDashedLine(this.objectGraphics, currentX, currentY, this.lastPointerWorldX, this.lastPointerWorldY, 8, 6);
      }
    }
  }

  drawCollisionOverlay() {
    this.collisionGraphics.clear();
    const collisionData = this.tileLayerData.Collision;
    if (!collisionData) return;

    const width = this.map.width;
    const height = this.map.height;
    const tileW = this.map.tileWidth;
    const tileH = this.map.tileHeight;

    this.collisionGraphics.fillStyle(0xff0000, 0.35);
    this.collisionGraphics.lineStyle(1, 0xff0000, 0.7);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const gid = collisionData[y * width + x];
        if (gid > 0) {
          const px = x * tileW;
          const py = y * tileH;
          this.collisionGraphics.fillRect(px, py, tileW, tileH);
          this.collisionGraphics.strokeRect(px, py, tileW, tileH);
        }
      }
    }
  }

  updateCursor(worldX, worldY) {
    this.cursorGraphics.clear();

    const tileX = Math.floor(worldX / this.map.tileWidth);
    const tileY = Math.floor(worldY / this.map.tileHeight);

    if (tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) {
      return;
    }

    const snapX = tileX * this.map.tileWidth;
    const snapY = tileY * this.map.tileHeight;

    if (this.activeTool === 'hand') {
      return;
    } else if (this.activeLayerName === 'Collision') {
      this.cursorGraphics.lineStyle(2, 0xff0000, 0.9);
      this.cursorGraphics.fillStyle(0xff0000, 0.4);
    } else if (this.activeLayerName === 'Overhead') {
      this.cursorGraphics.lineStyle(2, 0x00e5ff, 0.9);
      this.cursorGraphics.fillStyle(0x00e5ff, 0.3);
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
    } else {
      this.cursorGraphics.lineStyle(2, 0xffffff, 0.9);
      this.cursorGraphics.fillStyle(0xffffff, 0.1);
    }

    this.cursorGraphics.fillRect(snapX, snapY, this.map.tileWidth, this.map.tileHeight);
    this.cursorGraphics.strokeRect(snapX, snapY, this.map.tileWidth, this.map.tileHeight);
  }

  // ─── Input Handlers ───────────────────────────────────────────────────────

  onPointerDown(pointer) {
    if (this.activeTool === 'hand' || pointer.middleButtonDown() || pointer.rightButtonDown() || this.input.keyboard.addKey('SPACE').isDown) {
      this.isDraggingMap = true;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
      this.camStartX = this.cameras.main.scrollX;
      this.camStartY = this.cameras.main.scrollY;
      if (this.sys.game.canvas) {
        this.sys.game.canvas.style.cursor = 'grabbing';
      }
      return;
    }

    if (pointer.leftButtonDown()) {
      const worldPoint = pointer.positionToCamera(this.cameras.main);
      const tileX = Math.floor(worldPoint.x / this.map.tileWidth);
      const tileY = Math.floor(worldPoint.y / this.map.tileHeight);

      this.isPainting = true;
      this.applyToolAt(tileX, tileY, worldPoint.x, worldPoint.y);
    }
  }

  onPointerMove(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const tileX = Math.floor(worldPoint.x / this.map.tileWidth);
    const tileY = Math.floor(worldPoint.y / this.map.tileHeight);

    this.lastPointerWorldX = worldPoint.x;
    this.lastPointerWorldY = worldPoint.y;

    this.updateCursor(worldPoint.x, worldPoint.y);

    if (this.onCoordsUpdate) {
      this.onCoordsUpdate(tileX, tileY, Math.floor(worldPoint.x), Math.floor(worldPoint.y));
    }

    if (this.portalLinkState) {
      this.drawObjects();
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
    if (this.sys.game.canvas) {
      this.sys.game.canvas.style.cursor = (this.activeTool === 'hand') ? 'grab' : 'crosshair';
    }
  }

  onWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    let zoom = this.cameras.main.zoom;
    if (deltaY > 0) {
      zoom = Math.max(0.5, zoom - 0.15);
    } else if (deltaY < 0) {
      zoom = Math.min(4.0, zoom + 0.15);
    }
    this.cameras.main.setZoom(zoom);
  }

  // ─── Operations ──────────────────────────────────────────────────────────

  applyToolAt(tileX, tileY, worldX, worldY) {
    if (tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) {
      return;
    }

    if (this.activeTool === 'link') {
      const snapX = Math.floor(worldX / 16) * 16;
      const snapY = Math.floor(worldY / 16) * 16;

      if (!this.portalLinkState) {
        // Step 1: Set Origin Portal
        const linkId = 'portal_' + (Date.now() % 10000);
        this.portalLinkState = {
          linkId: linkId,
          origin: { x: snapX, y: snapY, width: 32, height: 32 },
          waypoints: [],
          destination: null
        };
        if (this.onToast) {
          this.onToast(`📍 Portal Origem [${linkId}] definido! Clique para criar pontos intermediários de intervalo, ou duplo-clique/Enter para CONCLUIR no Destino.`, 'info');
        }
      } else {
        // Step 2: Double click or check click interval to finish or add waypoint
        const now = Date.now();
        if (this._lastClickTime && (now - this._lastClickTime < 350)) {
          // Double Click -> Finish Destination!
          this.finishPortalLinkDestination(snapX, snapY);
          this._lastClickTime = 0;
          return;
        }
        this._lastClickTime = now;

        // Otherwise add waypoint
        this.portalLinkState.waypoints.push({ x: snapX + 8, y: snapY + 8 });
        if (this.onToast) {
          this.onToast(`➕ Ponto de intervalo #${this.portalLinkState.waypoints.length} adicionado! Clique no local final e dê duplo-clique (ou tecle Enter) para concluir.`, 'info');
        }
      }
      this.drawObjects();
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
    const data = this.tileLayerData[layerName];
    const phaserLayer = this.phaserLayers[layerName];
    if (!data) return;

    const index = y * this.map.width + x;
    if (data[index] === gid) return;

    data[index] = gid;

    if (layerName === 'Collision') {
      this.drawCollisionOverlay();
      return;
    }

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

    if (this.onObjectSelected) {
      this.onObjectSelected(found);
    }
  }

  // ─── Setters ──────────────────────────────────────────────────────────────

  setActiveLayer(layerName) {
    this.activeLayerName = layerName;
  }

  setLayerVisible(layerName, visible) {
    if (layerName === 'Collision') {
      if (this.phaserLayers.Collision) {
        this.phaserLayers.Collision.setVisible(false);
      }
      this.collisionGraphics.setVisible(visible);
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

  toggleObjects() {
    this.showObjects = !this.showObjects;
    this.drawObjects();
  }

  zoomIn() {
    const newZoom = Math.min(4.0, this.cameras.main.zoom + 0.25);
    this.cameras.main.setZoom(newZoom);
  }

  zoomOut() {
    const newZoom = Math.max(0.5, this.cameras.main.zoom - 0.25);
    this.cameras.main.setZoom(newZoom);
  }

  // ─── Portal Linking Helpers ─────────────────────────────────────────────

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

  finishPortalLinkDestination(destX, destY) {
    if (!this.portalLinkState || !this.portalLinkState.origin) return;

    const { linkId, origin, waypoints } = this.portalLinkState;
    const portalLayer = this._getOrCreateObjectLayer('Portals');
    if (!portalLayer) return;

    const waypointsCopy = JSON.parse(JSON.stringify(waypoints || []));

    const originObj = {
      id: Date.now(),
      name: `Portal_${linkId}_Entrada`,
      type: 'portal_link',
      x: origin.x,
      y: origin.y,
      width: origin.width || 32,
      height: origin.height || 32,
      properties: [
        { name: 'linkId', value: linkId },
        { name: 'role', value: 'origin' },
        { name: 'targetX', value: destX },
        { name: 'targetY', value: destY },
        { name: 'waypoints', value: JSON.stringify(waypointsCopy) },
        { name: 'isLinked', value: true }
      ]
    };

    const destObj = {
      id: Date.now() + 1,
      name: `Portal_${linkId}_Saida`,
      type: 'portal_link',
      x: destX,
      y: destY,
      width: 32,
      height: 32,
      properties: [
        { name: 'linkId', value: linkId },
        { name: 'role', value: 'destination' },
        { name: 'targetX', value: origin.x },
        { name: 'targetY', value: origin.y },
        { name: 'waypoints', value: JSON.stringify(waypointsCopy) },
        { name: 'isLinked', value: true }
      ]
    };

    portalLayer.objects.push(originObj, destObj);
    this.portalLinkState = null;

    if (this.onToast) {
      this.onToast(`✅ Portal '${linkId}' conectado com sucesso! (${waypointsCopy.length} ponto(s) de intervalo)`, 'success');
    }
    this.drawObjects();
  }

  cancelPortalLink() {
    if (this.portalLinkState) {
      this.portalLinkState = null;
      if (this.onToast) this.onToast('🚫 Criação de portal cancelada.', 'info');
      this.drawObjects();
    }
  }

  getUnlinkedPortals() {
    if (!this.mapJsonData) return [];
    const unlinked = [];

    // Check active in-progress creation
    if (this.portalLinkState && this.portalLinkState.origin && !this.portalLinkState.destination) {
      unlinked.push({ name: this.portalLinkState.linkId, type: 'in_progress' });
    }

    // Check saved portal objects in map Json layers
    const portalLayers = this.mapJsonData.layers.filter(l => l.type === 'objectgroup');
    const portalMap = new Map();

    for (const layer of portalLayers) {
      for (const obj of layer.objects) {
        if (obj.type === 'portal_link') {
          const props = this._readProps(obj.properties);
          const linkId = props.linkId || obj.name;
          if (!portalMap.has(linkId)) {
            portalMap.set(linkId, { origin: false, destination: false, isLinked: false });
          }
          const item = portalMap.get(linkId);
          if (props.role === 'origin') {
            item.origin = true;
            if (props.isLinked === true || props.isLinked === 'true') item.isLinked = true;
          }
          if (props.role === 'destination') {
            item.destination = true;
          }
        }
      }
    }

    for (const [linkId, status] of portalMap.entries()) {
      if (!status.origin || !status.destination || !status.isLinked) {
        unlinked.push({ name: linkId });
      }
    }

    return unlinked;
  }

  // ─── Export JSON ─────────────────────────────────────────────────────────

  getExportJson() {
    if (!this.mapJsonData) return null;

    const exportMap = JSON.parse(JSON.stringify(this.mapJsonData));
    const width = this.map.width;
    const height = this.map.height;

    ['Ground', 'World', 'Overhead', 'Collision'].forEach(layerName => {
      const dataArr = this.tileLayerData[layerName];
      if (dataArr) {
        let jsonLayer = exportMap.layers.find(l => l.name === layerName && l.type === 'tilelayer');
        if (!jsonLayer) {
          jsonLayer = {
            name: layerName,
            type: 'tilelayer',
            encoding: 'base64',
            width: width,
            height: height,
            x: 0,
            y: 0,
            visible: true,
            opacity: 1,
            data: ''
          };
          const firstObjIndex = exportMap.layers.findIndex(l => l.type === 'objectgroup');
          if (firstObjIndex >= 0) {
            exportMap.layers.splice(firstObjIndex, 0, jsonLayer);
          } else {
            exportMap.layers.push(jsonLayer);
          }
        }
        jsonLayer.data = this._encodeBase64(dataArr);
      }
    });

    return exportMap;
  }
}
