const fs = require('fs');
const path = require('path');

const WIDTH = 25;  // 25 * 32 = 800px
const HEIGHT = 19; // 19 * 32 = 608px

// Tile GIDs (1-indexed based on pokemon_tileset.png 8 columns)
// Row 0: 1=Grass, 2=Flower, 3=Tall Grass, 4=Dirt Path, 5=Dirt Edge, 6=Water, 7=Shore, 8=Wood Floor
// Row 1: 9=Fence H, 10=Fence Post, 11=Sign, 12=Tree TL, 13=Tree TR, 14=Bush, 15=Ledge, 16=Lab Floor
// Row 2: 17=Roof Red TL, 18=Roof Red TC, 19=Roof Red TR, 20=Tree BL, 21=Tree BR, 22=Roof Red Bot, 23=Wall Window, 24=Wall Door
// Row 3: 25=Roof Blue TL, 26=Roof Blue TC, 27=Roof Blue TR, 28=Lab Antenna, 29=Wall Cream, 30=Lab Wall, 31=Lab Door, 32=Shadow Wall

const GID = {
  EMPTY: 0,
  GRASS: 1,
  FLOWER: 2,
  TALL_GRASS: 3,
  DIRT_PATH: 4,
  DIRT_EDGE: 5,
  WATER: 6,
  WATER_SHORE: 7,
  WOOD_FLOOR: 8,
  FENCE_H: 9,
  FENCE_POST: 10,
  SIGN: 11,
  TREE_TL: 12,
  TREE_TR: 13,
  BUSH: 14,
  LEDGE: 15,
  LAB_FLOOR: 16,
  ROOF_RED_TL: 17,
  ROOF_RED_TC: 18,
  ROOF_RED_TR: 19,
  TREE_BL: 20,
  TREE_BR: 21,
  ROOF_RED_SLOPE: 22,
  WALL_WINDOW: 23,
  WALL_DOOR: 24,
  ROOF_BLUE_TL: 25,
  ROOF_BLUE_TC: 26,
  ROOF_BLUE_TR: 27,
  LAB_ANTENNA: 28,
  WALL_CREAM: 29,
  WALL_LAB: 30,
  DOOR_LAB: 31,
  WALL_SHADOW: 32
};

// Create empty 2D grids
function createGrid(defaultVal = 0) {
  const grid = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(defaultVal);
    }
    grid.push(row);
  }
  return grid;
}

function flatten(grid) {
  const res = [];
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      res.push(grid[y][x]);
    }
  }
  return res;
}

// 1. Ground Layer: All grass base
const groundGrid = createGrid(GID.GRASS);

// 2. Paths and Flowers Layer
const pathsGrid = createGrid(0);

// Main vertical path from North (Route 1) to South
for (let y = 0; y < HEIGHT; y++) {
  pathsGrid[y][11] = GID.DIRT_PATH;
  pathsGrid[y][12] = GID.DIRT_PATH;
  pathsGrid[y][13] = GID.DIRT_PATH;
}

// Path to Red's house (west)
for (let x = 6; x < 11; x++) {
  pathsGrid[7][x] = GID.DIRT_PATH;
}

// Path to Blue's house (east)
for (let x = 14; x < 19; x++) {
  pathsGrid[7][x] = GID.DIRT_PATH;
}

// Path to Oak's Lab (south-east)
for (let x = 14; x < 17; x++) {
  pathsGrid[13][x] = GID.DIRT_PATH;
}

// Flowers near houses
pathsGrid[5][9] = GID.FLOWER;
pathsGrid[5][10] = GID.FLOWER;
pathsGrid[5][15] = GID.FLOWER;
pathsGrid[5][16] = GID.FLOWER;
pathsGrid[12][12] = GID.FLOWER;
pathsGrid[12][13] = GID.FLOWER;

// 3. Buildings, Walls, Trees Bottoms, Fences, Water (with COLLISION)
const buildingsGrid = createGrid(0);

// 4. Overhead Layer (Roofs, Trees Tops - Walkable UNDERNEATH)
const overheadGrid = createGrid(0);

// Place tree helper: 2x2 tiles (TL, TR on overhead, BL, BR on buildings/collision)
function placeTree(tx, ty) {
  if (ty >= 0 && ty < HEIGHT && tx >= 0 && tx < WIDTH - 1) {
    overheadGrid[ty][tx] = GID.TREE_TL;
    overheadGrid[ty][tx + 1] = GID.TREE_TR;
    if (ty + 1 < HEIGHT) {
      buildingsGrid[ty + 1][tx] = GID.TREE_BL;
      buildingsGrid[ty + 1][tx + 1] = GID.TREE_BR;
    }
  }
}

// Top border trees (except portal opening at x=11..13)
for (let x = 0; x < 10; x += 2) placeTree(x, 0);
for (let x = 14; x < WIDTH; x += 2) placeTree(x, 0);

// Left border trees
for (let y = 2; y < HEIGHT - 1; y += 2) placeTree(0, y);

// Right border trees
for (let y = 2; y < HEIGHT - 1; y += 2) placeTree(23, y);

// Bottom border trees
for (let x = 0; x < WIDTH; x += 2) placeTree(x, 17);

// Water Pond (Bottom-Left: x=2..7, y=12..16)
for (let y = 12; y <= 15; y++) {
  for (let x = 2; x <= 7; x++) {
    if (y === 12) {
      buildingsGrid[y][x] = GID.WATER_SHORE;
    } else {
      buildingsGrid[y][x] = GID.WATER;
    }
  }
}

// Helper: Build House (4 tiles wide, 3 tiles high)
// Overhead: Roof top (TL, TC, TC, TR) & Roof bottom slope
// Buildings: Cream Wall with Windows and Door
function placeHouse(startX, startY, isLab = false) {
  const roofTL = isLab ? GID.ROOF_BLUE_TL : GID.ROOF_RED_TL;
  const roofTC = isLab ? GID.ROOF_BLUE_TC : GID.ROOF_RED_TC;
  const roofTR = isLab ? GID.ROOF_BLUE_TR : GID.ROOF_RED_TR;
  const wallTile = isLab ? GID.WALL_LAB : GID.WALL_CREAM;
  const doorTile = isLab ? GID.DOOR_LAB : GID.WALL_DOOR;

  // Roof top (Overhead)
  overheadGrid[startY][startX] = roofTL;
  overheadGrid[startY][startX + 1] = roofTC;
  overheadGrid[startY][startX + 2] = roofTC;
  overheadGrid[startY][startX + 3] = roofTR;

  // Roof bottom / slope (Overhead)
  overheadGrid[startY + 1][startX] = roofTL;
  overheadGrid[startY + 1][startX + 1] = isLab ? GID.LAB_ANTENNA : GID.ROOF_RED_SLOPE;
  overheadGrid[startY + 1][startX + 2] = roofTC;
  overheadGrid[startY + 1][startX + 3] = roofTR;

  // Walls & Door (Buildings / Collisions)
  buildingsGrid[startY + 2][startX] = GID.WALL_WINDOW;
  buildingsGrid[startY + 2][startX + 1] = wallTile;
  buildingsGrid[startY + 2][startX + 2] = doorTile;
  buildingsGrid[startY + 2][startX + 3] = GID.WALL_WINDOW;
}

// Ash's House (Casa do Red): (startX=4, startY=4)
placeHouse(4, 4, false);

// Gary's House (Casa do Blue): (startX=16, startY=4)
placeHouse(16, 4, false);

// Oak's Research Lab: (startX=15, startY=10)
placeHouse(15, 10, true);

// Fences below houses
for (let x = 3; x <= 8; x++) {
  buildingsGrid[8][x] = GID.FENCE_H;
}
for (let x = 16; x <= 21; x++) {
  buildingsGrid[8][x] = GID.FENCE_H;
}

// Wooden Signpost near Oak Lab
buildingsGrid[12][10] = GID.SIGN;

// Portals Object Layer
const portalsObjects = [
  {
    id: 1,
    name: 'Portal_Route_1',
    type: 'portal',
    x: 352,
    y: 0,
    width: 96,
    height: 32,
    rotation: 0,
    visible: true,
    properties: [
      { name: 'targetRoom', type: 'string', value: 'route_1' },
      { name: 'targetSpawnX', type: 'float', value: 400 },
      { name: 'targetSpawnY', type: 'float', value: 540 },
      { name: 'label', type: 'string', value: 'ROTA 1 ⬆' }
    ]
  },
  {
    id: 2,
    name: 'Portal_Oak_Lab',
    type: 'portal',
    x: 17 * 32, // door x
    y: 12 * 32, // door y
    width: 32,
    height: 32,
    rotation: 0,
    visible: true,
    properties: [
      { name: 'targetRoom', type: 'string', value: 'oak_lab' },
      { name: 'targetSpawnX', type: 'float', value: 400 },
      { name: 'targetSpawnY', type: 'float', value: 520 },
      { name: 'label', type: 'string', value: 'LAB CARVALHO 🚪' }
    ]
  }
];

// Spawns Object Layer
const spawnsObjects = [
  {
    id: 10,
    name: 'default_spawn',
    type: 'spawn',
    x: 400,
    y: 350,
    width: 32,
    height: 32,
    rotation: 0,
    visible: true,
    properties: []
  }
];

const mapJson = {
  compressionlevel: -1,
  height: HEIGHT,
  width: WIDTH,
  infinite: false,
  orientation: "orthogonal",
  renderorder: "right-down",
  tiledversion: "1.10.2",
  tileheight: 32,
  tilewidth: 32,
  type: "map",
  version: "1.10",
  tilesets: [
    {
      columns: 8,
      firstgid: 1,
      image: "../tilesets/pokemon_tileset.png",
      imageheight: 256,
      imagewidth: 256,
      margin: 0,
      name: "pokemon_tileset",
      spacing: 0,
      tilecount: 64,
      tileheight: 32,
      tilewidth: 32,
      tiles: [
        // Water tiles collides
        { id: 5, properties: [{ name: "collides", type: "bool", value: true }] },
        { id: 6, properties: [{ name: "collides", type: "bool", value: true }] },
        // Fence collides
        { id: 8, properties: [{ name: "collides", type: "bool", value: true }] },
        { id: 9, properties: [{ name: "collides", type: "bool", value: true }] },
        // Sign collides
        { id: 10, properties: [{ name: "collides", type: "bool", value: true }] },
        // Tree trunks collides
        { id: 19, properties: [{ name: "collides", type: "bool", value: true }] },
        { id: 20, properties: [{ name: "collides", type: "bool", value: true }] },
        // Walls & Door collides
        { id: 22, properties: [{ name: "collides", type: "bool", value: true }] },
        { id: 23, properties: [{ name: "collides", type: "bool", value: true }] },
        { id: 28, properties: [{ name: "collides", type: "bool", value: true }] },
        { id: 29, properties: [{ name: "collides", type: "bool", value: true }] }
      ]
    }
  ],
  layers: [
    {
      id: 1,
      name: "Ground",
      type: "tilelayer",
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT,
      data: flatten(groundGrid)
    },
    {
      id: 2,
      name: "Paths",
      type: "tilelayer",
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT,
      data: flatten(pathsGrid)
    },
    {
      id: 3,
      name: "Buildings",
      type: "tilelayer",
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT,
      properties: [
        { name: "collides", type: "bool", value: true }
      ],
      data: flatten(buildingsGrid)
    },
    {
      id: 4,
      name: "Overhead",
      type: "tilelayer",
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT,
      properties: [
        { name: "overhead", type: "bool", value: true }
      ],
      data: flatten(overheadGrid)
    },
    {
      id: 5,
      name: "Portals",
      type: "objectgroup",
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      draworder: "topdown",
      objects: portalsObjects
    },
    {
      id: 6,
      name: "Spawns",
      type: "objectgroup",
      visible: true,
      opacity: 1,
      x: 0,
      y: 0,
      draworder: "topdown",
      objects: spawnsObjects
    }
  ]
};

const outputPath = path.resolve(__dirname, '../public/assets/maps/pallet_town.json');
fs.writeFileSync(outputPath, JSON.stringify(mapJson, null, 2));
console.log(`Pallet Town Tiled map successfully generated at ${outputPath}`);
