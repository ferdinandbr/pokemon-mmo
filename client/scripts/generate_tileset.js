const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, getPixel) {
  // getPixel(x, y) => [r, g, b, a]
  const rowLength = 1 + width * 4; // 1 filter byte + 4 bytes per pixel (RGBA)
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a !== undefined ? a : 255;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c >>> 0;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const checksum = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(checksum, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 8x8 tiles of 32x32 = 256x256 pixels
const TILE_SIZE = 32;
const COLS = 8;
const ROWS = 8;
const WIDTH = COLS * TILE_SIZE;
const HEIGHT = ROWS * TILE_SIZE;

// Colors
const C = {
  GRASS_BASE: [112, 184, 96, 255],
  GRASS_DARK: [92, 160, 76, 255],
  GRASS_LIGHT: [128, 200, 112, 255],
  TALL_GRASS_DARK: [40, 104, 32, 255],
  TALL_GRASS_LIGHT: [80, 168, 64, 255],
  TALL_GRASS_MED: [56, 136, 48, 255],
  DIRT_BASE: [208, 184, 128, 255],
  DIRT_DARK: [184, 160, 104, 255],
  DIRT_LIGHT: [224, 200, 144, 255],
  WATER_DEEP: [56, 120, 184, 255],
  WATER_LIGHT: [80, 152, 216, 255],
  WATER_FOAM: [180, 220, 255, 255],
  WOOD_DARK: [92, 64, 40, 255],
  WOOD_MED: [136, 96, 56, 255],
  WOOD_LIGHT: [184, 136, 88, 255],
  ROOF_RED_DARK: [160, 32, 32, 255],
  ROOF_RED_MED: [211, 47, 47, 255],
  ROOF_RED_LIGHT: [239, 83, 80, 255],
  ROOF_BLUE_DARK: [2, 100, 160, 255],
  ROOF_BLUE_MED: [2, 136, 209, 255],
  ROOF_BLUE_LIGHT: [41, 182, 246, 255],
  WALL_CREAM: [240, 238, 228, 255],
  WALL_SHADOW: [200, 198, 188, 255],
  WALL_LAB: [224, 224, 224, 255],
  WALL_LAB_SHADOW: [176, 190, 197, 255],
  GLASS_BLUE: [129, 212, 250, 255],
  FLOWER_RED: [255, 64, 64, 255],
  FLOWER_YELLOW: [255, 235, 59, 255],
  TREE_DARK: [24, 72, 24, 255],
  TREE_MED: [40, 120, 40, 255],
  TREE_LIGHT: [64, 160, 56, 255],
  BLACK: [30, 30, 30, 255],
  WHITE: [255, 255, 255, 255],
  TRANS: [0, 0, 0, 0]
};

function getPixel(x, y) {
  const tileX = Math.floor(x / TILE_SIZE);
  const tileY = Math.floor(y / TILE_SIZE);
  const px = x % TILE_SIZE;
  const py = y % TILE_SIZE;

  // Row 0: Grounds & Waters
  // Tile (0,0): Pure Grass
  if (tileX === 0 && tileY === 0) {
    if ((px === 4 && py >= 4 && py <= 7) || (px === 18 && py >= 16 && py <= 19) ||
        (px === 24 && py >= 8 && py <= 11) || (px === 8 && py >= 22 && py <= 25)) {
      return C.GRASS_DARK;
    }
    if ((px === 5 && py === 4) || (px === 19 && py === 16)) return C.GRASS_LIGHT;
    return C.GRASS_BASE;
  }

  // Tile (1,0): Grass with Red/Yellow Flowers
  if (tileX === 1 && tileY === 0) {
    let col = C.GRASS_BASE;
    const d1 = Math.hypot(px - 10, py - 12);
    if (d1 < 4) col = C.FLOWER_RED;
    if (d1 < 1.8) col = C.FLOWER_YELLOW;
    const d2 = Math.hypot(px - 22, py - 22);
    if (d2 < 4) col = C.FLOWER_YELLOW;
    if (d2 < 1.8) col = C.FLOWER_RED;
    return col;
  }

  // Tile (2,0): Tall Grass
  if (tileX === 2 && tileY === 0) {
    if ((px >= 2 && px <= 9 && py >= 6 && py <= 28) ||
        (px >= 12 && px <= 19 && py >= 4 && py <= 30) ||
        (px >= 22 && px <= 29 && py >= 8 && py <= 28)) {
      if (py % 4 === 0) return C.TALL_GRASS_LIGHT;
      if (px % 3 === 0) return C.TALL_GRASS_DARK;
      return C.TALL_GRASS_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (3,0): Dirt Path Center
  if (tileX === 3 && tileY === 0) {
    if ((px === 6 && py === 6) || (px === 20 && py === 14) || (px === 10 && py === 24)) return C.DIRT_DARK;
    if ((px === 12 && py === 8) || (px === 26 && py === 20)) return C.DIRT_LIGHT;
    return C.DIRT_BASE;
  }

  // Tile (4,0): Dirt Path with Grass Border Left
  if (tileX === 4 && tileY === 0) {
    if (px < 4) return C.GRASS_BASE;
    if (px === 4) return C.DIRT_DARK;
    return C.DIRT_BASE;
  }

  // Tile (5,0): Water (Deep)
  if (tileX === 5 && tileY === 0) {
    if ((py === 8 && px >= 4 && px <= 16) || (py === 22 && px >= 14 && px <= 26)) return C.WATER_LIGHT;
    if ((py === 7 && px >= 5 && px <= 15) || (py === 21 && px >= 15 && px <= 25)) return C.WATER_FOAM;
    return C.WATER_DEEP;
  }

  // Tile (6,0): Water Shore Top (Grass on top, Water on bottom)
  if (tileX === 6 && tileY === 0) {
    if (py < 10) return C.GRASS_BASE;
    if (py <= 12) return C.DIRT_DARK;
    if (py === 14 && (px % 8 < 5)) return C.WATER_FOAM;
    return C.WATER_DEEP;
  }

  // Tile (7,0): Indoor Wood Floor
  if (tileX === 7 && tileY === 0) {
    if (py === 0 || py === 31 || px === 0 || px === 31) return C.WOOD_DARK;
    if (py % 8 === 0) return C.WOOD_DARK;
    if (px % 16 === 0) return C.WOOD_DARK;
    return C.WOOD_LIGHT;
  }

  // Row 1: Fences, Signs, Trees
  // Tile (0,1): Wooden Fence Horizontal
  if (tileX === 0 && tileY === 1) {
    if ((py >= 8 && py <= 13) || (py >= 20 && py <= 24)) {
      if (py === 8 || py === 20) return C.WOOD_LIGHT;
      if (py === 13 || py === 24) return C.WOOD_DARK;
      return C.WOOD_MED;
    }
    if ((px >= 3 && px <= 7 && py >= 4 && py <= 30) || (px >= 23 && px <= 27 && py >= 4 && py <= 30)) {
      if (px === 3 || py === 4) return C.WOOD_LIGHT;
      if (px === 7 || py === 30) return C.WOOD_DARK;
      return C.WOOD_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (1,1): Wooden Fence Post / Corner
  if (tileX === 1 && tileY === 1) {
    if (px >= 10 && px <= 21 && py >= 4 && py <= 30) {
      if (px === 10 || py === 4) return C.WOOD_LIGHT;
      if (px === 21 || py === 30) return C.WOOD_DARK;
      return C.WOOD_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (2,1): Wooden Signpost
  if (tileX === 2 && tileY === 1) {
    if (px >= 4 && px <= 27 && py >= 4 && py <= 20) {
      if (px === 4 || py === 4) return C.WOOD_LIGHT;
      if (px === 27 || py === 20) return C.WOOD_DARK;
      if ((py === 9 || py === 15) && px >= 8 && px <= 23) return C.WHITE;
      return C.WOOD_MED;
    }
    if (px >= 13 && px <= 18 && py >= 21) {
      return C.WOOD_DARK;
    }
    return C.GRASS_BASE;
  }

  // Tile (3,1): Tree Top-Left
  if (tileX === 3 && tileY === 1) {
    const dist = Math.hypot(px - 32, py - 32);
    if (dist < 28) {
      if (dist < 18) return C.TREE_LIGHT;
      if (dist < 25) return C.TREE_MED;
      return C.TREE_DARK;
    }
    return C.GRASS_BASE;
  }

  // Tile (4,1): Tree Top-Right
  if (tileX === 4 && tileY === 1) {
    const dist = Math.hypot(px - 0, py - 32);
    if (dist < 28) {
      if (dist < 18) return C.TREE_LIGHT;
      if (dist < 25) return C.TREE_MED;
      return C.TREE_DARK;
    }
    return C.GRASS_BASE;
  }

  // Tile (5,1): Bush / Small Shrub
  if (tileX === 5 && tileY === 1) {
    const dist = Math.hypot(px - 16, py - 18);
    if (dist < 12) {
      if (dist < 6) return C.TREE_LIGHT;
      return C.TREE_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (6,1): Ledge Jump Top (Rock cliff)
  if (tileX === 6 && tileY === 1) {
    if (py < 16) return [140, 110, 70, 255];
    if (py <= 22) return [100, 75, 45, 255];
    return C.GRASS_BASE;
  }

  // Tile (7,1): Indoor Lab Tile
  if (tileX === 7 && tileY === 1) {
    if (px === 0 || py === 0) return [200, 210, 220, 255];
    return [235, 240, 245, 255];
  }

  // Row 2: Tree Bottoms & Red House
  // Tile (3,2): Tree Bottom-Left (Trunk + Leaves)
  if (tileX === 3 && tileY === 2) {
    const dist = Math.hypot(px - 32, py - 0);
    if (dist < 26) {
      if (dist < 22) return C.TREE_MED;
      return C.TREE_DARK;
    }
    if (px >= 22 && py <= 24) return C.WOOD_DARK;
    return C.GRASS_BASE;
  }

  // Tile (4,2): Tree Bottom-Right (Trunk + Leaves)
  if (tileX === 4 && tileY === 2) {
    const dist = Math.hypot(px - 0, py - 0);
    if (dist < 26) {
      if (dist < 22) return C.TREE_MED;
      return C.TREE_DARK;
    }
    if (px <= 9 && py <= 24) return C.WOOD_DARK;
    return C.GRASS_BASE;
  }

  // Tile (0,2): Red Roof Top-Left
  if (tileX === 0 && tileY === 2) {
    if (py >= 8 && px >= 8) {
      if (py === 8 || px === 8) return C.ROOF_RED_LIGHT;
      return C.ROOF_RED_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (1,2): Red Roof Top-Center
  if (tileX === 1 && tileY === 2) {
    if (py >= 8) {
      if (py === 8) return C.ROOF_RED_LIGHT;
      if (py % 8 === 0) return C.ROOF_RED_DARK;
      return C.ROOF_RED_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (2,2): Red Roof Top-Right
  if (tileX === 2 && tileY === 2) {
    if (py >= 8 && px <= 23) {
      if (py === 8) return C.ROOF_RED_LIGHT;
      if (px === 23) return C.ROOF_RED_DARK;
      return C.ROOF_RED_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (5,2): Red Roof Bottom Slope
  if (tileX === 5 && tileY === 2) {
    if (py <= 26) {
      if (py >= 24) return C.ROOF_RED_DARK;
      return C.ROOF_RED_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (6,2): Wall with Window
  if (tileX === 6 && tileY === 2) {
    let col = C.WALL_CREAM;
    if (py <= 3) col = C.WALL_SHADOW;
    if (px >= 6 && px <= 25 && py >= 8 && py <= 23) {
      if (px === 6 || px === 25 || py === 8 || py === 23 || px === 15 || py === 15) {
        col = C.WOOD_DARK;
      } else {
        col = C.GLASS_BLUE;
      }
    }
    return col;
  }

  // Tile (7,2): Wall with Door
  if (tileX === 7 && tileY === 2) {
    let col = C.WALL_CREAM;
    if (py <= 3) col = C.WALL_SHADOW;
    if (px >= 4 && px <= 27 && py >= 6) {
      if (px === 4 || px === 27 || py === 6) return C.WOOD_DARK;
      if (px === 23 && py === 20) return C.FLOWER_YELLOW;
      return C.WOOD_MED;
    }
    return col;
  }

  // Row 3: Blue / Lab Roof & Modern Walls
  // Tile (0,3): Blue Roof Top-Left
  if (tileX === 0 && tileY === 3) {
    if (py >= 6 && px >= 6) {
      if (py === 6 || px === 6) return C.ROOF_BLUE_LIGHT;
      return C.ROOF_BLUE_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (1,3): Blue Roof Top-Center
  if (tileX === 1 && tileY === 3) {
    if (py >= 6) {
      if (py === 6) return C.ROOF_BLUE_LIGHT;
      if (py % 8 === 0) return C.ROOF_BLUE_DARK;
      return C.ROOF_BLUE_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (2,3): Blue Roof Top-Right
  if (tileX === 2 && tileY === 3) {
    if (py >= 6 && px <= 25) {
      if (py === 6) return C.ROOF_BLUE_LIGHT;
      if (px === 25) return C.ROOF_BLUE_DARK;
      return C.ROOF_BLUE_MED;
    }
    return C.GRASS_BASE;
  }

  // Tile (3,3): Lab Antenna / Technology Roof Tile
  if (tileX === 3 && tileY === 3) {
    if (px >= 14 && px <= 17 && py >= 8 && py <= 24) return [144, 164, 174, 255];
    if (Math.hypot(px - 16, py - 8) < 6) return [255, 235, 59, 255];
    return C.ROOF_BLUE_MED;
  }

  // Tile (4,3): Plain Cream Wall
  if (tileX === 4 && tileY === 3) {
    if (py <= 4) return C.WALL_SHADOW;
    return C.WALL_CREAM;
  }

  // Tile (5,3): Lab High-Tech Wall
  if (tileX === 5 && tileY === 3) {
    if (py <= 4) return C.WALL_LAB_SHADOW;
    if (py === 16) return [2, 136, 209, 255];
    return C.WALL_LAB;
  }

  // Tile (6,3): Lab Glass Sliding Door
  if (tileX === 6 && tileY === 3) {
    if (px >= 4 && px <= 27 && py >= 4) {
      if (px === 4 || px === 27 || py === 4) return [38, 50, 56, 255];
      if (px === 15 || px === 16) return [38, 50, 56, 255];
      return C.GLASS_BLUE;
    }
    return C.WALL_LAB;
  }

  // Tile (7,3): Roof overhang shadow
  if (tileX === 7 && tileY === 3) {
    if (py < 10) return [40, 40, 40, 180];
    return C.WALL_CREAM;
  }

  return C.GRASS_BASE;
}

const pngBuffer = createPng(WIDTH, HEIGHT, getPixel);
const outputPath = path.resolve(__dirname, '../public/assets/tilesets/pokemon_tileset.png');
fs.writeFileSync(outputPath, pngBuffer);
console.log(`Tileset successfully created at ${outputPath} (${WIDTH}x${HEIGHT})`);
