const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

/**
 * Utility to convert Tiled TMX maps and TSX tilesets to standard Tiled JSON
 * used by Phaser 3, automatically repacking oversized tileset strips (e.g. 256x18176)
 * into GPU-safe textures (e.g. 2048x2272).
 */
async function repackTilesetIfOversized(imgDiskPath, tileW, tileH, srcCols, totalTiles) {
  if (!fs.existsSync(imgDiskPath)) return null;

  const buf = fs.readFileSync(imgDiskPath);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);

  // If height is already WebGL-safe, return current dimensions
  if (h <= 4096) {
    return { columns: srcCols, imagewidth: w, imageheight: h };
  }

  // Repack into 64 columns (2048px wide)
  const destCols = 64;
  const destRows = Math.ceil(totalTiles / destCols);
  const destW = destCols * tileW;
  const destH = destRows * tileH;

  console.log(`[TiledSync] Repacking oversized tileset ${path.basename(imgDiskPath)} from ${w}x${h} to ${destW}x${destH}...`);
  const img = await loadImage(imgDiskPath);
  const canvas = createCanvas(destW, destH);
  const ctx = canvas.getContext('2d');

  for (let t = 0; t < totalTiles; t++) {
    const sx = (t % srcCols) * tileW;
    const sy = Math.floor(t / srcCols) * tileH;

    const dx = (t % destCols) * tileW;
    const dy = Math.floor(t / destCols) * tileH;

    ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
  }

  const outBuf = canvas.toBuffer('image/png');
  fs.writeFileSync(imgDiskPath, outBuf);
  console.log(`[TiledSync] Repacked successfully: ${destW}x${destH} (${(outBuf.length / 1024).toFixed(1)} KB)`);

  return { columns: destCols, imagewidth: destW, imageheight: destH };
}

async function convertTmxToJson(tmxPath, outputJsonPath) {
  const tmxContent = fs.readFileSync(tmxPath, 'utf8');

  // Extract map attributes
  const mapMatch = tmxContent.match(/<map[^>]+>/);
  if (!mapMatch) throw new Error(`Invalid TMX at ${tmxPath}: no <map> tag found`);
  const mapTag = mapMatch[0];

  const getAttr = (tag, attr) => {
    const m = tag.match(new RegExp(`${attr}="([^"]+)"`));
    return m ? m[1] : null;
  };

  const width = parseInt(getAttr(mapTag, 'width'), 10);
  const height = parseInt(getAttr(mapTag, 'height'), 10);
  const tilewidth = parseInt(getAttr(mapTag, 'tilewidth'), 10);
  const tileheight = parseInt(getAttr(mapTag, 'tileheight'), 10);
  const orientation = getAttr(mapTag, 'orientation') || 'orthogonal';
  const renderorder = getAttr(mapTag, 'renderorder') || 'right-down';

  // Extract tileset tags
  const tilesetRegex = /<tileset\s+firstgid="([^"]+)"\s+source="([^"]+)"/g;
  let tsMatch;
  const tilesets = [];

  while ((tsMatch = tilesetRegex.exec(tmxContent)) !== null) {
    const firstgid = parseInt(tsMatch[1], 10);
    const tsxRelPath = tsMatch[2];
    const resolvedTsxPath = path.resolve(path.dirname(tmxPath), tsxRelPath);
    if (!fs.existsSync(resolvedTsxPath)) {
      console.warn(`[TiledSync] Warning: TSX file not found at ${resolvedTsxPath}`);
      continue;
    }
    const tsxContent = fs.readFileSync(resolvedTsxPath, 'utf8');

    const tsTagMatch = tsxContent.match(/<tileset[^>]+>/);
    const tsTag = tsTagMatch ? tsTagMatch[0] : '';
    const tsName = getAttr(tsTag, 'name');
    const tsTileWidth = parseInt(getAttr(tsTag, 'tilewidth'), 10);
    const tsTileHeight = parseInt(getAttr(tsTag, 'tileheight'), 10);
    const tsTileCount = parseInt(getAttr(tsTag, 'tilecount'), 10);
    let tsColumns = parseInt(getAttr(tsTag, 'columns'), 10);

    const imgTagMatch = tsxContent.match(/<image[^>]+>/);
    const imgTag = imgTagMatch ? imgTagMatch[0] : '';
    const imgSrc = getAttr(imgTag, 'source');
    let imgWidth = parseInt(getAttr(imgTag, 'width'), 10);
    let imgHeight = parseInt(getAttr(imgTag, 'height'), 10);

    // Check disk image in client assets
    const clientTilesetPath = path.join(__dirname, '../client/public/assets/tilesets', imgSrc);
    const repacked = await repackTilesetIfOversized(clientTilesetPath, tsTileWidth, tsTileHeight, tsColumns, tsTileCount);
    if (repacked) {
      tsColumns = repacked.columns;
      imgWidth = repacked.imagewidth;
      imgHeight = repacked.imageheight;
    }

    tilesets.push({
      columns: tsColumns,
      firstgid: firstgid,
      image: `/assets/tilesets/${imgSrc}`,
      imageheight: imgHeight,
      imagewidth: imgWidth,
      margin: 0,
      name: tsName,
      spacing: 0,
      tilecount: tsTileCount,
      tileheight: tsTileHeight,
      tilewidth: tsTileWidth
    });
  }

  // Extract layers
  const layerRegex = /<layer[^>]*id="([^"]+)"[^>]*name="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"[^>]*>[\s\S]*?<data[^>]*>([\s\S]*?)<\/data>[\s\S]*?<\/layer>/g;
  let layerMatch;
  const layers = [];

  while ((layerMatch = layerRegex.exec(tmxContent)) !== null) {
    const id = parseInt(layerMatch[1], 10);
    const name = layerMatch[2];
    const layerW = parseInt(layerMatch[3], 10);
    const layerH = parseInt(layerMatch[4], 10);
    const dataRaw = layerMatch[5];
    const data = dataRaw
      .trim()
      .split('\n')
      .flatMap(row => row.split(',').filter(v => v.trim() !== '').map(n => parseInt(n.trim(), 10) || 0));

    layers.push({
      data: data,
      height: layerH,
      id: id,
      name: name,
      opacity: 1,
      type: 'tilelayer',
      visible: true,
      width: layerW,
      x: 0,
      y: 0
    });
  }

  const jsonMap = {
    compressionlevel: -1,
    height: height,
    infinite: false,
    layers: layers,
    nextlayerid: 20,
    nextobjectid: 1,
    orientation: orientation,
    renderorder: renderorder,
    tiledversion: '1.11.2',
    tileheight: tileheight,
    tilesets: tilesets,
    tilewidth: tilewidth,
    type: 'map',
    version: '1.10',
    width: width
  };

  fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
  fs.writeFileSync(outputJsonPath, JSON.stringify(jsonMap, null, 2), 'utf8');
  console.log(`[TiledSync] Generated ${path.basename(outputJsonPath)} (${width}x${height}, ${layers.length} layers, tileset: ${tilesets[0]?.imagewidth}x${tilesets[0]?.imageheight})`);
  return jsonMap;
}

// ─── Map Registry ─────────────────────────────────────────────────────────────
const KANTO_BASE_DIR = 'C:/Users/fer/Desktop/Pokemon-Kanto-Tiled-Maps-main/Kanto maps';
const MAPS_DEST_DIR = path.join(__dirname, '../client/public/assets/maps');

const MAP_REGISTRY = {
  // Cities
  pallet_town: {
    category: 'cities',
    filename: 'pallet_town.json',
    tmxRelPath: 'Kanto Citites/Pallet Town/Pallet Town Spring.tmx',
    aliases: ['pallet_town.json']
  },
  viridian_city: {
    category: 'cities',
    filename: 'viridian_city.json',
    tmxRelPath: 'Kanto Citites/Viridian City/Viridian City Spring.tmx',
    aliases: ['viridian_city.json']
  },
  pewter_city: {
    category: 'cities',
    filename: 'pewter_city.json',
    tmxRelPath: 'Kanto Citites/Peweter City/Peweter City Spring.tmx',
    aliases: ['pewter_city.json']
  },
  cerulean_city: {
    category: 'cities',
    filename: 'cerulean_city.json',
    tmxRelPath: 'Kanto Citites/Cerulean City/Cerulean City Spring.tmx',
    aliases: ['cerulean_city.json']
  },
  vermilion_city: {
    category: 'cities',
    filename: 'vermilion_city.json',
    tmxRelPath: 'Kanto Citites/Vermilion City/Vermilion City Spring.tmx',
    aliases: ['vermilion_city.json']
  },
  lavender_town: {
    category: 'cities',
    filename: 'lavender_town.json',
    tmxRelPath: 'Kanto Citites/Lavender Town/Lavender Town Spring.tmx',
    aliases: ['lavender_town.json']
  },
  celadon_city: {
    category: 'cities',
    filename: 'celadon_city.json',
    tmxRelPath: 'Kanto Citites/Celadon City/Celadon City Spring.tmx',
    aliases: ['celadon_city.json']
  },
  saffron_city: {
    category: 'cities',
    filename: 'saffron_city.json',
    tmxRelPath: 'Kanto Citites/Saffron City/Saffron City Spring.tmx',
    aliases: ['saffron_city.json']
  },
  fuchsia_city: {
    category: 'cities',
    filename: 'fuchsia_city.json',
    tmxRelPath: 'Kanto Citites/Fuchsia City/Fuchsia City Spring.tmx',
    aliases: ['fuchsia_city.json']
  },
  cinnabar_island: {
    category: 'cities',
    filename: 'cinnabar_island.json',
    tmxRelPath: 'Kanto Citites/Cinnabar Island/Cinnabar Island Spring.tmx',
    aliases: ['cinnabar_island.json']
  },
  indigo_plateau: {
    category: 'cities',
    filename: 'indigo_plateau.json',
    tmxRelPath: 'Kanto Citites/Indigo Plateau/Indigo Plateau Spring.tmx',
    aliases: ['indigo_plateau.json']
  },

  // Routes
  route_1: {
    category: 'routes',
    filename: 'route_001.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 001/Kanto Route 1 Spring.tmx',
    aliases: ['route_1.json']
  },
  route_2: {
    category: 'routes',
    filename: 'route_002.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 002/Kanto Route 2.tmx',
    aliases: ['route_2.json']
  },
  route_3: {
    category: 'routes',
    filename: 'route_003.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 003/Kanto Route 3.tmx',
    aliases: ['route_3.json']
  },
  route_4: {
    category: 'routes',
    filename: 'route_004.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 004/Kanto Route 4 Spring.tmx',
    aliases: ['route_4.json']
  },
  route_5: {
    category: 'routes',
    filename: 'route_005.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 005/Kanto Route 5 Spring.tmx',
    aliases: ['route_5.json']
  },
  route_6: {
    category: 'routes',
    filename: 'route_006.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 006/Kanto Route 6 Spring.tmx',
    aliases: ['route_6.json']
  },
  route_7: {
    category: 'routes',
    filename: 'route_007.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 007/Kanto Route 7 Spring.tmx',
    aliases: ['route_7.json']
  },
  route_8: {
    category: 'routes',
    filename: 'route_008.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 008/Kanto Route 8 Spring.tmx',
    aliases: ['route_8.json']
  },
  route_9: {
    category: 'routes',
    filename: 'route_009.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 009/Kanto Route 9 Spring.tmx',
    aliases: ['route_9.json']
  },
  route_10: {
    category: 'routes',
    filename: 'route_010.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 010/Kanto Route 10 Spring.tmx',
    aliases: ['route_10.json']
  },
  route_11: {
    category: 'routes',
    filename: 'route_011.json',
    tmxRelPath: 'Kanto Routes/Kanto Route 011/Kanto Route 11 Spring.tmx',
    aliases: ['route_11.json']
  }
};

async function syncMap(mapKey) {
  const config = MAP_REGISTRY[mapKey];
  if (!config) {
    console.error(`[TiledSync] Unknown map key: ${mapKey}`);
    return;
  }

  const tmxSource = path.resolve(KANTO_BASE_DIR, config.tmxRelPath);
  if (!fs.existsSync(tmxSource)) {
    console.error(`[TiledSync] TMX source not found: ${tmxSource}`);
    return;
  }

  // Save to categorized directory: e.g. client/public/assets/maps/cities/pallet_town.json or routes/route_001.json
  const categorizedDest = path.join(MAPS_DEST_DIR, config.category, config.filename);
  console.log(`[TiledSync] Converting ${mapKey} (${config.tmxRelPath})...`);
  const jsonMap = await convertTmxToJson(tmxSource, categorizedDest);

  // Also write aliases (e.g. root client/public/assets/maps/pallet_town.json or route_1.json)
  if (config.aliases && config.aliases.length > 0) {
    for (const alias of config.aliases) {
      const aliasDest = path.join(MAPS_DEST_DIR, alias);
      fs.copyFileSync(categorizedDest, aliasDest);
      console.log(`[TiledSync] Copied alias -> ${alias}`);
    }
  }
}

async function run() {
  const args = process.argv.slice(2);
  let targets = [];

  if (args.includes('--all')) {
    targets = Object.keys(MAP_REGISTRY);
  } else if (args.length > 0) {
    targets = args.filter(a => !a.startsWith('--'));
  } else {
    // Default: sync Pallet Town and Route 1
    targets = ['pallet_town', 'route_1'];
  }

  for (const target of targets) {
    await syncMap(target);
  }
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { convertTmxToJson, MAP_REGISTRY, syncMap };

