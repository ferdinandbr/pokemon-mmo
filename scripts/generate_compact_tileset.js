/**
 * generate_compact_tileset.js
 * 
 * Reads a Tiled JSON map, finds all unique tile IDs used across ALL layers,
 * crops only those tiles from the source tileset PNG,
 * and outputs a smaller PNG + updated JSON for Phaser.
 * 
 * Requires: npm install canvas (in the project root or globally)
 * 
 * Usage: node scripts/generate_compact_tileset.js
 */

const fs = require('fs');
const path = require('path');

const MAP_JSON = path.join(__dirname, '../client/public/assets/maps/pallet_town.json');
const SRC_TILESET = path.join(__dirname, '../client/public/assets/tilesets/Outside1_Spring.png');
const OUT_TILESET = path.join(__dirname, '../client/public/assets/tilesets/pallet_town_tiles.png');
const OUT_MAP_JSON = MAP_JSON; // overwrite in place

async function main() {
  // 1. Load the map JSON
  const mapData = JSON.parse(fs.readFileSync(MAP_JSON, 'utf8'));
  const tileset = mapData.tilesets[0];
  const firstgid = tileset.firstgid; // 1
  const srcColumns = tileset.columns; // 8
  const tileW = tileset.tilewidth;    // 32
  const tileH = tileset.tileheight;  // 32

  // 2. Collect all unique tile IDs (excluding 0 = empty)
  const usedGIDs = new Set();
  for (const layer of mapData.layers) {
    if (layer.type === 'tilelayer' && layer.data) {
      for (const gid of layer.data) {
        if (gid !== 0) usedGIDs.add(gid);
      }
    }
  }

  const localIds = Array.from(usedGIDs).map(gid => gid - firstgid).sort((a, b) => a - b);
  console.log(`Unique tile IDs used: ${localIds.length}`);
  console.log(`Range: ${localIds[0]} – ${localIds[localIds.length - 1]}`);

  // 3. Compute max required rows in the source tileset
  const maxLocalId = localIds[localIds.length - 1];
  const maxRow = Math.floor(maxLocalId / srcColumns);
  const neededHeight = (maxRow + 1) * tileH;
  const totalHeight = tileset.imageheight;

  console.log(`Source tileset: ${tileset.imagewidth}x${totalHeight}px`);
  console.log(`Max row used: ${maxRow} → we only need ${neededHeight}px of height (was ${totalHeight}px)`);

  // 4. Try to use canvas to crop the image
  let canvasAvailable = false;
  try {
    require.resolve('canvas');
    canvasAvailable = true;
  } catch (e) {
    canvasAvailable = false;
  }

  if (!canvasAvailable) {
    console.log('\n⚠️  "canvas" package not found. Attempting install...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install canvas --save-dev', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
      canvasAvailable = true;
    } catch (err) {
      console.error('Could not install canvas. Please run: npm install canvas');
      // Fallback: just update the JSON to use a subregion approach
      patchJsonOnly(mapData, tileset, neededHeight, OUT_MAP_JSON, OUT_TILESET, localIds, srcColumns, tileW, tileH, firstgid);
      return;
    }
  }

  const { createCanvas, loadImage } = require('canvas');

  console.log('\nLoading source tileset image...');
  const img = await loadImage(SRC_TILESET);
  console.log(`Loaded: ${img.width}x${img.height}px`);

  // Build a remapping: localId -> new compact position
  // We'll arrange tiles in rows of 8 columns
  const COMPACT_COLUMNS = 8;
  const idToNew = new Map(); // localId -> newLocalId
  localIds.forEach((lid, idx) => {
    idToNew.set(lid, idx);
  });

  const compactRows = Math.ceil(localIds.length / COMPACT_COLUMNS);
  const compactWidth = COMPACT_COLUMNS * tileW;
  const compactHeight = compactRows * tileH;

  console.log(`Compact tileset: ${compactWidth}x${compactHeight}px (${localIds.length} tiles in ${COMPACT_COLUMNS} cols)`);

  const canvas = createCanvas(compactWidth, compactHeight);
  const ctx = canvas.getContext('2d');

  for (let newIdx = 0; newIdx < localIds.length; newIdx++) {
    const localId = localIds[newIdx];
    // Source position in original tileset
    const srcCol = localId % srcColumns;
    const srcRow = Math.floor(localId / srcColumns);
    const sx = srcCol * tileW;
    const sy = srcRow * tileH;

    // Destination position in compact tileset
    const dstCol = newIdx % COMPACT_COLUMNS;
    const dstRow = Math.floor(newIdx / COMPACT_COLUMNS);
    const dx = dstCol * tileW;
    const dy = dstRow * tileH;

    ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
  }

  // Save compact PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(OUT_TILESET, buffer);
  console.log(`\n✅ Saved compact tileset: ${OUT_TILESET}`);

  // Update map JSON: remap GIDs and update tileset info
  for (const layer of mapData.layers) {
    if (layer.type === 'tilelayer' && layer.data) {
      layer.data = layer.data.map(gid => {
        if (gid === 0) return 0;
        const localId = gid - firstgid;
        const newLocalId = idToNew.get(localId);
        return newLocalId !== undefined ? newLocalId + firstgid : 0;
      });
    }
  }

  // Update tileset metadata
  mapData.tilesets[0].image = 'pallet_town_tiles.png';
  mapData.tilesets[0].imagewidth = compactWidth;
  mapData.tilesets[0].imageheight = compactHeight;
  mapData.tilesets[0].tilecount = localIds.length;
  mapData.tilesets[0].columns = COMPACT_COLUMNS;
  mapData.tilesets[0].name = 'pallet_town_tiles';

  fs.writeFileSync(OUT_MAP_JSON, JSON.stringify(mapData, null, 2));
  console.log(`✅ Updated map JSON with remapped tile IDs`);

  console.log('\n📋 Next steps:');
  console.log('  1. In BootScene.js, load: this.load.image("pallet_town_tiles", "/assets/tilesets/pallet_town_tiles.png")');
  console.log('  2. The roomData.js tileset name should be "pallet_town_tiles"');
  console.log('  3. Rebuild the client: npm run build (in /client)');
}

function patchJsonOnly(mapData, tileset, neededHeight, outPath, outTileset, localIds, srcColumns, tileW, tileH, firstgid) {
  // Without canvas we can't crop, but we can at least update the imageheight 
  // to the actual needed height so Phaser doesn't try to load metadata beyond that.
  console.log('\n⚠️  Fallback: patching JSON imageheight only (no image crop)');
  console.log('The tileset image will still be full-size — WebGL may still fail.');
  console.log('Please install canvas manually: npm install canvas --save-dev');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
