// Battle Arena Engine with Authentic Pixel Art Town Stadium Background
// Bounded strictly to the white line rectangle of the tournament field
import { DecalSystem } from './decalSystem.js';

export class BattleArena {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.time = 0;

    // Logical gameplay dimensions are STRICTLY FIXED to 1024 x 576 (Native 16:9 Widescreen).
    // Window resizing scales the viewport projection seamlessly without black letterbox bars,
    // while keeping logical boundaries and combat distance 100% invariant and fair for PvP.
    this.imgWidth = 1024;
    this.imgHeight = 576;

    // Fixed grass clearing boundary in native 1024x576 16:9 image space
    // Calibrated so Pokémon never wander under the top enemy HUD or bottom command bar/player HUD
    this.fieldCoords = {
      left: 215,
      right: 809,
      top: 125,
      bottom: 395,
      centerX: 512,
      centerY: 260,
    };

    // Logical bounds are ALWAYS fixed to native coordinates!
    this.bounds = {
      minX: this.fieldCoords.left,
      maxX: this.fieldCoords.right,
      minY: this.fieldCoords.top,
      maxY: this.fieldCoords.bottom,
    };

    this.centerX = this.fieldCoords.centerX;
    this.centerY = this.fieldCoords.centerY;
    this.arenaWidth = this.bounds.maxX - this.bounds.minX; // 594 px
    this.arenaHeight = this.bounds.maxY - this.bounds.minY; // 270 px
    this.radiusX = this.arenaWidth / 2;
    this.radiusY = this.arenaHeight / 2;

    // Preload time-of-day grass arena backgrounds as fallback
    this.bgImages = {
      day: null,
      dusk: null,
      night: null,
    };
    this.currentPhase = 'day';
    this.bgImage = null;
    this.imageLoaded = false;
    this.initBackgrounds();

    // Authentic Tiled Tilemap Support (arena_grass.json, etc.)
    this.currentArenaKey = 'arena_grass';
    this.mapLoaded = false;
    this.mapCanvas = null;
    this.overheadCanvas = null;
    this.mapSpawns = null;
    this.collisionGrid = null;
    this.collisionTiles = [];
    this.loadArenaMap('arena_grass');

    // Viewport projection parameters (scales drawing to screen without altering logic)
    this.scale = 1.0;
    this.drawX = 0;
    this.drawY = 0;
    this.drawWidth = 1024;
    this.drawHeight = 790;

    // Screen shake
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

    // Open tournament pitch (no obstructing pillars)
    this.obstacles = [];

    // Persistent ground battle marks (scorch, cracks, wet puddles, zaps)
    this.decalSystem = new DecalSystem(50);

    this.resize();
  }

  async loadArenaMap(arenaKey = 'arena_grass') {
    if (!arenaKey) arenaKey = 'arena_grass';
    this.currentArenaKey = arenaKey;
    try {
      const cleanKey = String(arenaKey).replace(/[^a-zA-Z0-9_\-]/g, '');
      const response = await fetch(`/assets/maps/${cleanKey}.json?t=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const mapData = await response.json();
      await this.buildTilemapBuffers(mapData);
      console.log(`[BattleArena] Mapa Tiled '${cleanKey}' carregado e renderizado com sucesso.`);
    } catch (err) {
      console.warn(`[BattleArena] Não foi possível carregar o mapa Tiled '${arenaKey}', usando fallback:`, err.message);
      this.mapLoaded = false;
    }
  }

  async buildTilemapBuffers(mapData) {
    if (!mapData || !mapData.layers) return;

    this.mapWidth = (mapData.width || 32) * (mapData.tilewidth || 32);
    this.mapHeight = (mapData.height || 18) * (mapData.tileheight || 32);
    this.tileWidth = mapData.tilewidth || 32;
    this.tileHeight = mapData.tileheight || 32;

    // 1. Preload tilesets
    const tilesetEntries = [];
    const loadPromises = (mapData.tilesets || []).map(async (ts) => {
      let imgSrc = ts.image || '';
      if (imgSrc.startsWith('../')) {
        imgSrc = imgSrc.replace(/^(\.\.\/)+/, '/assets/');
      } else if (!imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
        imgSrc = `/assets/${imgSrc}`;
      }
      const img = new Image();
      img.src = imgSrc;
      await new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) resolve();
        else {
          img.onload = () => resolve();
          img.onerror = () => {
            console.warn(`[BattleArena] Falha ao carregar tileset ${imgSrc}`);
            resolve();
          };
        }
      });
      tilesetEntries.push({
        ...ts,
        img,
      });
    });

    await Promise.all(loadPromises);

    // Sort tilesets descending by firstgid for matching
    tilesetEntries.sort((a, b) => b.firstgid - a.firstgid);

    // 2. Extract Spawns from Object Layer
    const spawnsLayer = mapData.layers.find(l => (l.name === 'Spawns' || l.name === 'PokemonSpawns') && l.type === 'objectgroup');
    if (spawnsLayer?.objects) {
      const pSpawn = spawnsLayer.objects.find(o => o.name === 'player_spawn' || o.properties?.some(p => p.name === 'role' && p.value === 'player'));
      const eSpawn = spawnsLayer.objects.find(o => o.name === 'opponent_spawn' || o.name === 'enemy_spawn' || o.name === 'rival_spawn' || o.properties?.some(p => p.name === 'role' && (p.value === 'opponent' || p.value === 'enemy')));
      
      this.mapSpawns = {
        player: pSpawn ? { x: pSpawn.x, y: pSpawn.y, facing: 'right' } : null,
        enemy: eSpawn ? { x: eSpawn.x, y: eSpawn.y, facing: 'left' } : null,
      };
    }

    // 3. Extract Collisions from Tile Layer
    const collisionLayer = mapData.layers.find(l => (l.name === 'Collision' || l.name === 'Collisions') && l.type === 'tilelayer');
    this.collisionGrid = Array(mapData.height).fill(null).map(() => Array(mapData.width).fill(false));
    this.collisionTiles = [];
    if (collisionLayer?.data) {
      collisionLayer.data.forEach((gid, idx) => {
        if (gid > 0) {
          const col = idx % mapData.width;
          const row = Math.floor(idx / mapData.width);
          this.collisionGrid[row][col] = true;
          this.collisionTiles.push({ col, row, x: col * 32, y: row * 32, width: 32, height: 32 });
        }
      });
    }

    // 4. Create Offscreen Canvases for Ground/Objects and Overhead
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = this.imgWidth;
    mapCanvas.height = this.imgHeight;
    const mapCtx = mapCanvas.getContext('2d');
    mapCtx.imageSmoothingEnabled = false;

    const overheadCanvas = document.createElement('canvas');
    overheadCanvas.width = this.imgWidth;
    overheadCanvas.height = this.imgHeight;
    const overheadCtx = overheadCanvas.getContext('2d');
    overheadCtx.imageSmoothingEnabled = false;

    const drawTileLayer = (layer, targetCtx) => {
      if (!layer || !layer.data) return;
      layer.data.forEach((gid, idx) => {
        if (gid <= 0) return;
        const ts = tilesetEntries.find(t => gid >= t.firstgid && gid < t.firstgid + t.tilecount);
        if (!ts || !ts.img || !ts.img.complete) return;

        const localId = gid - ts.firstgid;
        const col = localId % ts.columns;
        const row = Math.floor(localId / ts.columns);
        const margin = ts.margin || 0;
        const spacing = ts.spacing || 0;
        const sx = margin + col * (ts.tilewidth + spacing);
        const sy = margin + row * (ts.tileheight + spacing);

        const destCol = idx % mapData.width;
        const destRow = Math.floor(idx / mapData.width);
        const dx = destCol * this.tileWidth;
        const dy = destRow * this.tileHeight;

        targetCtx.drawImage(
          ts.img,
          sx, sy, ts.tilewidth, ts.tileheight,
          dx, dy, this.tileWidth, this.tileHeight
        );
      });
    };

    // Draw Ground & Objects layers
    const groundLayer = mapData.layers.find(l => l.name === 'Ground' && l.type === 'tilelayer');
    const objectsLayer = mapData.layers.find(l => l.name === 'Objects' && l.type === 'tilelayer');
    const overheadLayer = mapData.layers.find(l => l.name === 'Overhead' && l.type === 'tilelayer');

    drawTileLayer(groundLayer, mapCtx);
    drawTileLayer(objectsLayer, mapCtx);
    drawTileLayer(overheadLayer, overheadCtx);

    this.mapCanvas = mapCanvas;
    this.overheadCanvas = overheadCanvas;
    this.mapLoaded = true;
  }

  initBackgrounds() {
    if (typeof Image === 'undefined') return;

    this.bgImages.day = new Image();
    this.bgImages.day.src = '/assets/battle/arenas/grass_wild_day.png';

    this.bgImages.dusk = new Image();
    this.bgImages.dusk.src = '/assets/battle/arenas/grass_wild_dusk.png';

    this.bgImages.night = new Image();
    this.bgImages.night.src = '/assets/battle/arenas/grass_wild_night.png';

    const onImgLoad = () => {
      this.imageLoaded = true;
      this.updateTimePhase();
    };

    this.bgImages.day.onload = onImgLoad;
    this.bgImages.dusk.onload = onImgLoad;
    this.bgImages.night.onload = onImgLoad;

    this.updateTimePhase();
  }

  updateTimePhase(forcedPhase = null) {
    let phase = forcedPhase;

    if (!phase) {
      if (typeof window !== 'undefined' && window.dayNight?.currentPhase) {
        phase = window.dayNight.currentPhase;
      }
    }

    if (!phase) {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 17) {
        phase = 'day';
      } else if (hour >= 17 && hour < 20) {
        phase = 'dusk';
      } else if (hour >= 5 && hour < 6) {
        phase = 'dawn';
      } else {
        phase = 'night';
      }
    }

    this.currentPhase = phase || 'day';

    if (this.currentPhase === 'night') {
      this.bgImage = this.bgImages.night || this.bgImages.day;
    } else if (this.currentPhase === 'dusk' || this.currentPhase === 'dawn') {
      this.bgImage = this.bgImages.dusk || this.bgImages.day;
    } else {
      this.currentPhase = 'day';
      this.bgImage = this.bgImages.day;
    }
  }

  resize() {
    const rect = this.canvas.parentElement
      ? this.canvas.parentElement.getBoundingClientRect()
      : { width: this.canvas.width || 1920, height: this.canvas.height || 1080 };
    this.canvas.width = rect.width || 1920;
    this.canvas.height = rect.height || 1080;

    // 16:9 Widescreen Projection
    // Scale seamlessly to cover the container width & height without black letterbox bars
    const scaleX = this.canvas.width / this.imgWidth;
    const scaleY = this.canvas.height / this.imgHeight;
    this.scale = Math.max(scaleX, scaleY);

    this.drawWidth = Math.round(this.imgWidth * this.scale);
    this.drawHeight = Math.round(this.imgHeight * this.scale);
    this.drawX = Math.round((this.canvas.width - this.drawWidth) / 2);
    this.drawY = Math.round((this.canvas.height - this.drawHeight) / 2);
  }

  getSpawnPoints() {
    return {
      player: {
        x: this.mapSpawns?.player?.x ?? (this.centerX - 160), // 352 px in fixed 1024x576 space
        y: this.mapSpawns?.player?.y ?? this.centerY,         // 288 px
        facing: this.mapSpawns?.player?.facing ?? 'right',
      },
      enemy: {
        x: this.mapSpawns?.enemy?.x ?? (this.centerX + 160),   // 672 px in fixed 1024x576 space
        y: this.mapSpawns?.enemy?.y ?? this.centerY,         // 288 px
        facing: this.mapSpawns?.enemy?.facing ?? 'left',
      },
    };
  }

  setTheme() {}

  triggerScreenShake(amount = 8) {
    // Screen shake desativado conforme solicitado: visão estável e fixa durante impactos
    this.shakeIntensity = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  addDecal(x, y, type = 'crater_round', radius = 24, duration = 8.0, angle = 0) {
    if (this.decalSystem) {
      this.decalSystem.addDecal(x, y, type, radius, duration, angle);
    }
  }

  resetDecals() {
    if (this.decalSystem) {
      this.decalSystem.reset();
    }
  }

  update(dt) {
    this.time += dt;

    if (this.decalSystem) {
      this.decalSystem.update(dt);
    }

    if (this.shakeIntensity > 0.1) {
      this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeIntensity = 0;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  // Check collision between a point/circle and all obstacles
  checkObstacleCollision(x, y, radius = 0) {
    for (const obs of this.obstacles) {
      const dx = x - obs.x;
      const dy = y - obs.y;
      const dist = Math.hypot(dx, dy);
      if (dist < obs.radius + radius) {
        return { collided: true, obstacle: obs, dist, dx, dy };
      }
    }
    return { collided: false, obstacle: null };
  }

  // Constrain position strictly within the white rectangular border
  clampInside(x, y, padding = 34) {
    const minX = this.bounds.minX + padding;
    const maxX = this.bounds.maxX - padding;
    const minY = this.bounds.minY + padding;
    const maxY = this.bounds.maxY - padding;

    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));
    const collided = (clampedX !== x || clampedY !== y);

    return { x: clampedX, y: clampedY, collided };
  }

  // Resolve boundary collision with crisp bounce damping on white lines and tilemap obstacles
  resolveCollisions(entity) {
    if (!entity) return;

    // 1. Resolve collision with tilemap Collision layer tiles
    if (this.collisionGrid && this.mapLoaded) {
      const r = entity.radius || 18;
      const minCol = Math.max(0, Math.floor((entity.x - r) / 32));
      const maxCol = Math.min(31, Math.floor((entity.x + r) / 32));
      const minRow = Math.max(0, Math.floor((entity.y - r) / 32));
      const maxRow = Math.min(17, Math.floor((entity.y + r) / 32));

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          if (this.collisionGrid[row]?.[col]) {
            const tileLeft = col * 32;
            const tileTop = row * 32;
            const closestX = Math.max(tileLeft, Math.min(entity.x, tileLeft + 32));
            const closestY = Math.max(tileTop, Math.min(entity.y, tileTop + 32));
            const dx = entity.x - closestX;
            const dy = entity.y - closestY;
            const dist = Math.hypot(dx, dy);

            if (dist < r) {
              const overlap = r - (dist || 0.001);
              const nx = dist > 0.001 ? dx / dist : (entity.vx < 0 ? 1 : -1);
              const ny = dist > 0.001 ? dy / dist : (entity.vy < 0 ? 1 : -1);

              entity.x += nx * overlap;
              entity.y += ny * overlap;

              const velDot = entity.vx * nx + entity.vy * ny;
              if (velDot < 0) {
                entity.vx -= velDot * nx;
                entity.vy -= velDot * ny;
              }
            }
          }
        }
      }
    }

    // 2. Resolve collision with static obstacles if any exist
    for (const obs of this.obstacles) {
      const dx = entity.x - obs.x;
      const dy = entity.y - obs.y;
      const dist = Math.hypot(dx, dy) || 1;
      const minDist = entity.radius + obs.radius;

      if (dist < minDist) {
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        entity.x += nx * overlap;
        entity.y += ny * overlap;

        const velDotNormal = entity.vx * nx + entity.vy * ny;
        if (velDotNormal < 0) {
          entity.vx -= velDotNormal * nx;
          entity.vy -= velDotNormal * ny;
        }
      }
    }

    // 3. Clamp strictly inside arena border
    const clamped = this.clampInside(entity.x, entity.y, entity.radius);
    if (clamped.collided) {
      const impactSpeed = Math.hypot(entity.vx, entity.vy);
      if (entity.x < clamped.x && entity.vx < 0) entity.vx *= -0.3;
      if (entity.x > clamped.x && entity.vx > 0) entity.vx *= -0.3;
      if (entity.y < clamped.y && entity.vy < 0) entity.vy *= -0.3;
      if (entity.y > clamped.y && entity.vy > 0) entity.vy *= -0.3;

      entity.x = clamped.x;
      entity.y = clamped.y;

      if (typeof entity.onArenaWallCollide === 'function') {
        entity.onArenaWallCollide(impactSpeed);
      }
    }
  }

  // Get random valid point inside rectangular arena
  getRandomPoint(padding = 50) {
    const minX = this.bounds.minX + padding;
    const maxX = this.bounds.maxX - padding;
    const minY = this.bounds.minY + padding;
    const maxY = this.bounds.maxY - padding;

    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
  }

  renderBackground(ctx = this.ctx) {
    ctx.imageSmoothingEnabled = false; // Sharp 16-bit pixel art
    if (this.mapLoaded && this.mapCanvas) {
      // 1. Draw Authentic Tiled Arena Tilemap (Ground + Objects)
      ctx.drawImage(
        this.mapCanvas,
        0,
        0,
        this.imgWidth,
        this.imgHeight
      );
    } else if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
      // Fallback static pixel art background
      ctx.drawImage(
        this.bgImage,
        0,
        0,
        this.imgWidth,
        this.imgHeight
      );
    } else {
      // Fallback clean turf
      ctx.fillStyle = '#2d5a27';
      ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
    }

    // 2. Persistent Ground Decals rendered seamlessly on the arena terrain (no restrictive bounds clipping)
    if (this.decalSystem) {
      this.decalSystem.render(ctx);
    }
  }

  renderForeground(ctx = this.ctx) {
    if (this.mapLoaded && this.overheadCanvas) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        this.overheadCanvas,
        0,
        0,
        this.imgWidth,
        this.imgHeight
      );
    }
  }

  renderObstacle() {}

  destroy() {
    if (this.decalSystem) {
      this.decalSystem.reset();
    }
  }
}
