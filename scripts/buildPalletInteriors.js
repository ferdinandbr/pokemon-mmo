const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const REF_IMG_PATH = 'C:/Users/fer/.gemini/antigravity-ide/brain/129426b5-aaa3-4148-a230-94906f505259/.user_uploaded/media_1791759376403.png';
const TILESETS_DIR = path.resolve(__dirname, '../client/public/assets/tilesets');
const MAPS_DIR = path.resolve(__dirname, '../client/public/assets/maps');

async function main() {
  console.log('Loading reference image...');
  const refImg = await loadImage(REF_IMG_PATH);
  const refCanvas = createCanvas(refImg.width, refImg.height);
  const refCtx = refCanvas.getContext('2d');
  refCtx.drawImage(refImg, 0, 0);

  // We have 4 rooms:
  // 1. Oak Lab: x=810, y=25, w=208, h=208 (13x13 tiles in 16px)
  // 2. Player 1F: x=412, y=24, w=192, h=144 (12x9 tiles in 16px)
  // 3. Player 2F: x=611, y=24, w=192, h=144 (12x9 tiles in 16px)
  // 4. Rival House: x=412, y=208, w=192, h=144 (12x9 tiles in 16px)

  const roomsDef = [
    {
      id: 'pallet_oak_lab',
      name: "Laboratório do Prof. Carvalho",
      crop: { x: 810, y: 25, w: 208, h: 208 },
      cols: 13,
      rows: 13,
      defaultSpawn: { x: 192, y: 352 },
      portals: [],
      signs: [
        {
          x: 288, y: 128, width: 96, height: 32,
          title: "Pokébolas dos Iniciais",
          text: "Três Pokébolas repousam sobre a mesa: Bulbasaur, Charmander e Squirtle! O Prof. Carvalho as preparou para novos treinadores."
        },
        {
          x: 32, y: 96, width: 64, height: 64,
          title: "Máquina de Revitalização",
          text: "Uma máquina de alta tecnologia desenvolvida pelo Prof. Carvalho para restaurar e energizar Pokébolas."
        },
        {
          x: 64, y: 64, width: 64, height: 32,
          title: "Terminal do Laboratório",
          text: "O computador do Prof. Carvalho está exibindo o banco de dados da Pokédex de Kanto."
        },
        {
          x: 32, y: 192, width: 128, height: 32,
          title: "Estante de Pesquisa",
          text: "Prateleiras repletas de artigos e anotações científicas sobre a ecologia dos Pokémon."
        },
        {
          x: 256, y: 192, width: 128, height: 32,
          title: "Biblioteca Pokémon",
          text: "Enciclopédias e tratados clássicos sobre evolução e tipos de Pokémon."
        }
      ],
      // Collisions: 1 for blocked, 0 for walkable
      getCollisions: (cols, rows) => {
        const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
        // Top walls
        for (let c = 0; c < cols; c++) {
          grid[0][c] = 1;
          grid[1][c] = 1;
        }
        // Left & right walls
        for (let r = 0; r < rows; r++) {
          grid[r][0] = 1;
          grid[r][cols - 1] = 1;
        }
        // Bottom walls except door at col 6
        for (let c = 0; c < cols; c++) {
          if (c !== 6) grid[rows - 1][c] = 1;
        }
        // Top right bookshelf
        for (let c = 8; c <= 11; c++) grid[2][c] = 1;
        // Healing machine at cols 1-2, rows 3-4
        grid[3][1] = 1; grid[3][2] = 1;
        grid[4][1] = 1; grid[4][2] = 1;
        // Starter table at cols 9-11, row 4
        grid[4][9] = 1; grid[4][10] = 1; grid[4][11] = 1;
        // Bookshelves lower left: cols 1-4, rows 6-7
        for (let r = 6; r <= 7; r++) {
          for (let c = 1; c <= 4; c++) grid[r][c] = 1;
        }
        // Bookshelves lower right: cols 8-11, rows 6-7
        for (let r = 6; r <= 7; r++) {
          for (let c = 8; c <= 11; c++) grid[r][c] = 1;
        }
        // Plants
        grid[11][1] = 1;
        grid[11][11] = 1;
        return grid;
      }
    },
    {
      id: 'pallet_player_house_1f',
      name: "Casa do Jogador (1º Andar)",
      crop: { x: 412, y: 24, w: 192, h: 144 },
      cols: 12,
      rows: 9,
      defaultSpawn: { x: 96, y: 224 },
      portals: [],
      signs: [
        {
          x: 160, y: 64, width: 32, height: 32,
          title: "Televisão",
          text: "Está passando um filme na TV: Dois garotos caminham sobre os trilhos do trem... Hora de começar minha própria aventura!"
        },
        {
          x: 64, y: 64, width: 64, height: 32,
          title: "Cozinha da Mamãe",
          text: "A pia e o fogão estão limpinhos. A mamãe sempre cuida de tudo com muito carinho."
        }
      ],
      getCollisions: (cols, rows) => {
        const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
        // Outer black border (col 0)
        for (let r = 0; r < rows; r++) grid[r][0] = 1;
        // Left wall
        for (let r = 0; r < rows; r++) grid[r][1] = 1;
        // Right wall
        for (let r = 0; r < rows; r++) grid[r][cols - 1] = 1;
        // Top wall & kitchen counter (rows 0, 1, except stairs at col 10)
        for (let c = 0; c < cols; c++) {
          grid[0][c] = 1;
          if (c !== 10) grid[1][c] = 1;
        }
        // Kitchen counter & TV at row 2
        for (let c = 1; c <= 7; c++) grid[2][c] = 1;
        // Central table (rows 4, 5, cols 4 to 7)
        for (let r = 4; r <= 5; r++) {
          for (let c = 4; c <= 7; c++) grid[r][c] = 1;
        }
        // Bottom wall except carpet at col 3
        for (let c = 0; c < cols; c++) {
          if (c !== 3) grid[rows - 1][c] = 1;
        }
        // Flower pots
        grid[7][1] = 1;
        grid[7][10] = 1;
        return grid;
      }
    },
    {
      id: 'pallet_player_house_2f',
      name: "Quarto do Jogador (2º Andar)",
      crop: { x: 611, y: 24, w: 192, h: 144 },
      cols: 12,
      rows: 9,
      defaultSpawn: { x: 256, y: 64 },
      portals: [],
      signs: [
        {
          x: 32, y: 64, width: 32, height: 32,
          title: "PC do Jogador",
          text: "Ligou o PC! Armazenamento de Pokémon pronto para sincronizar novos companheiros de equipe."
        },
        {
          x: 160, y: 96, width: 32, height: 32,
          title: "Videogame",
          text: "Um console de 8 bits está ligado à TV na frente do tapete! Não posso me distrair agora, o Prof. Carvalho está esperando!"
        },
        {
          x: 32, y: 128, width: 32, height: 64,
          title: "Cama Macia",
          text: "Sua cama confortável e arrumada. Parece tão acolhedora após um longo dia de jornada!"
        }
      ],
      getCollisions: (cols, rows) => {
        const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
        // Outer black border (col 0)
        for (let r = 0; r < rows; r++) grid[r][0] = 1;
        // Left & right walls
        for (let r = 0; r < rows; r++) {
          grid[r][1] = 1;
          grid[r][cols - 1] = 1;
        }
        // Top walls
        for (let c = 0; c < cols; c++) {
          grid[0][c] = 1;
          if (c < 8) grid[1][c] = 1;
        }
        // PC & Desk at cols 1-2, rows 1-2
        grid[2][1] = 1; grid[2][2] = 1;
        // Bookshelf at cols 3-4, row 2
        grid[2][3] = 1; grid[2][4] = 1;
        // TV & NES at col 5, rows 3-4
        grid[3][5] = 1; grid[4][5] = 1;
        // Bed at col 1-2, rows 4-5
        grid[4][1] = 1; grid[4][2] = 1;
        grid[5][1] = 1; grid[5][2] = 1;
        // Bottom wall
        for (let c = 0; c < cols; c++) grid[rows - 1][c] = 1;
        return grid;
      }
    },
    {
      id: 'pallet_rival_house',
      name: "Casa do Rival",
      crop: { x: 412, y: 208, w: 192, h: 144 },
      cols: 12,
      rows: 9,
      defaultSpawn: { x: 96, y: 224 },
      portals: [],
      signs: [
        {
          x: 128, y: 128, width: 64, height: 32,
          title: "Mesa da Daisy",
          text: "Xícaras de chá quente com aroma agradável sobre a mesa. A irmã do rival sempre acolhe com gentileza."
        },
        {
          x: 224, y: 32, width: 32, height: 32,
          title: "Mapa de Kanto",
          text: "Um grande mapa ilustrado da região de Kanto pendurado na parede."
        }
      ],
      getCollisions: (cols, rows) => {
        const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
        for (let r = 0; r < rows; r++) grid[r][0] = 1;
        for (let r = 0; r < rows; r++) grid[r][1] = 1;
        for (let r = 0; r < rows; r++) grid[r][cols - 1] = 1;
        for (let c = 0; c < cols; c++) {
          grid[0][c] = 1;
          grid[1][c] = 1;
        }
        for (let c = 1; c <= 7; c++) grid[2][c] = 1;
        for (let r = 4; r <= 5; r++) {
          for (let c = 4; c <= 7; c++) grid[r][c] = 1;
        }
        for (let c = 0; c < cols; c++) {
          if (c !== 3) grid[rows - 1][c] = 1;
        }
        grid[7][1] = 1;
        grid[7][10] = 1;
        return grid;
      }
    }
  ];

  // Extract all 32x32 tiles across all 4 rooms to build a unified extruded tileset
  console.log('Extracting and upscaling tiles (2x nearest neighbor)...');
  const uniqueTiles = new Map(); // hash -> { id, canvas }
  let nextTileId = 1;

  // Let's create an empty 32x32 tile as ID 0 (empty)
  // In Tiled, GID 0 is empty. Firstgid of tileset is 1.

  for (const room of roomsDef) {
    const { crop, cols, rows } = room;
    // Create 2x canvas of the room (from 16px to 32px)
    const scaledW = cols * 32;
    const scaledH = rows * 32;
    const roomCanvas = createCanvas(scaledW, scaledH);
    const roomCtx = roomCanvas.getContext('2d');
    roomCtx.imageSmoothingEnabled = false;
    roomCtx.drawImage(refImg, crop.x, crop.y, crop.w, crop.h, 0, 0, scaledW, scaledH);

    room.tileGids = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tileCanvas = createCanvas(32, 32);
        const tileCtx = tileCanvas.getContext('2d');
        tileCtx.imageSmoothingEnabled = false;
        tileCtx.drawImage(roomCanvas, c * 32, r * 32, 32, 32, 0, 0, 32, 32);

        const imgData = tileCtx.getImageData(0, 0, 32, 32).data;
        const hash = Buffer.from(imgData).toString('base64');

        let tileEntry = uniqueTiles.get(hash);
        if (!tileEntry) {
          tileEntry = {
            id: nextTileId++,
            canvas: tileCanvas
          };
          uniqueTiles.set(hash, tileEntry);
        }
        room.tileGids.push(tileEntry.id);
      }
    }
  }

  const totalTiles = uniqueTiles.size;
  console.log(`Extracted ${totalTiles} unique 32x32 tiles.`);

  // Build extruded tileset:
  // Tile dimensions: 32x32. Extrusion: margin=1, spacing=2.
  // Each tile in the sheet occupies (32 + 2) x (32 + 2) = 34x34 with 1px border around it.
  const columns = 16;
  const numRows = Math.ceil(totalTiles / columns);
  const sheetW = columns * 34; // 16 * 34 = 544
  const sheetH = numRows * 34;

  const sheetCanvas = createCanvas(sheetW, sheetH);
  const sheetCtx = sheetCanvas.getContext('2d');
  sheetCtx.imageSmoothingEnabled = false;

  const tileEntries = Array.from(uniqueTiles.values()).sort((a, b) => a.id - b.id);

  for (let i = 0; i < tileEntries.length; i++) {
    const tile = tileEntries[i];
    const colIndex = i % columns;
    const rowIndex = Math.floor(i / columns);

    // Inner tile position (margin 1, spacing 2)
    const destX = 1 + colIndex * 34;
    const destY = 1 + rowIndex * 34;

    // Draw main tile 32x32
    sheetCtx.drawImage(tile.canvas, destX, destY);

    // Extrude 1px borders (replicate edge pixels)
    // Top & Bottom edges
    sheetCtx.drawImage(tile.canvas, 0, 0, 32, 1, destX, destY - 1, 32, 1);
    sheetCtx.drawImage(tile.canvas, 0, 31, 32, 1, destX, destY + 32, 32, 1);
    // Left & Right edges
    sheetCtx.drawImage(tile.canvas, 0, 0, 1, 32, destX - 1, destY, 1, 32);
    sheetCtx.drawImage(tile.canvas, 31, 0, 1, 32, destX + 32, destY, 1, 32);
    // 4 Corners
    sheetCtx.drawImage(tile.canvas, 0, 0, 1, 1, destX - 1, destY - 1, 1, 1);
    sheetCtx.drawImage(tile.canvas, 31, 0, 1, 1, destX + 32, destY - 1, 1, 1);
    sheetCtx.drawImage(tile.canvas, 0, 31, 1, 1, destX - 1, destY + 32, 1, 1);
    sheetCtx.drawImage(tile.canvas, 31, 31, 1, 1, destX + 32, destY + 32, 1, 1);
  }

  const tilesetFileName = 'pallet_interiors.png';
  const tilesetFilePath = path.join(TILESETS_DIR, tilesetFileName);
  fs.writeFileSync(tilesetFilePath, sheetCanvas.toBuffer('image/png'));
  console.log(`Saved extruded tileset to ${tilesetFilePath} (${sheetW}x${sheetH})`);

  // Build each Tiled JSON map
  for (const room of roomsDef) {
    const collisionGrid = room.getCollisions(room.cols, room.rows);
    const collisionData = [];
    for (let r = 0; r < room.rows; r++) {
      for (let c = 0; c < room.cols; c++) {
        // In our engine, non-zero tile in Collision layer represents solid obstacle
        collisionData.push(collisionGrid[r][c] > 0 ? 1 : 0);
      }
    }

    const tiledMap = {
      compressionlevel: -1,
      height: room.rows,
      width: room.cols,
      infinite: false,
      orientation: "orthogonal",
      renderorder: "right-down",
      tileheight: 32,
      tilewidth: 32,
      type: "map",
      version: "1.10",
      tiledversion: "1.10.2",
      nextlayerid: 7,
      nextobjectid: 20,
      tilesets: [
        {
          firstgid: 1,
          name: "pallet_interiors",
          image: `../tilesets/${tilesetFileName}`,
          imagewidth: sheetW,
          imageheight: sheetH,
          tilewidth: 32,
          tileheight: 32,
          tilecount: totalTiles,
          columns: columns,
          margin: 1,
          spacing: 2
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
          width: room.cols,
          height: room.rows,
          data: room.tileGids
        },
        {
          id: 2,
          name: "Collision",
          type: "tilelayer",
          visible: false,
          opacity: 0.5,
          x: 0,
          y: 0,
          width: room.cols,
          height: room.rows,
          data: collisionData
        },
        {
          id: 3,
          name: "Portals",
          type: "objectgroup",
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
          objects: room.portals.map((p, idx) => ({
            id: 10 + idx,
            name: p.name,
            type: "portal_link",
            x: p.trigger.x,
            y: p.trigger.y,
            width: p.trigger.width,
            height: p.trigger.height,
            visible: true,
            properties: [
              { name: "targetRoom", type: "string", value: p.targetRoom },
              { name: "targetX", type: "int", value: p.targetSpawn.x },
              { name: "targetY", type: "int", value: p.targetSpawn.y }
            ]
          }))
        },
        {
          id: 4,
          name: "Zones",
          type: "objectgroup",
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
          objects: [
            {
              id: 1,
              name: room.name,
              type: "Zone",
              x: 0,
              y: 0,
              width: room.cols * 32,
              height: room.rows * 32,
              visible: true,
              properties: []
            }
          ]
        },
        {
          id: 5,
          name: "Points of interest",
          type: "objectgroup",
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
          objects: room.signs.map((s, idx) => ({
            id: 30 + idx,
            name: s.title,
            type: "sign",
            x: s.x,
            y: s.y,
            width: s.width,
            height: s.height,
            visible: true,
            properties: [
              { name: "title", type: "string", value: s.title },
              { name: "text", type: "string", value: s.text }
            ]
          }))
        }
      ]
    };

    const mapFilePath = path.join(MAPS_DIR, `${room.id}.json`);
    fs.writeFileSync(mapFilePath, JSON.stringify(tiledMap, null, 2), 'utf8');
    console.log(`Saved Tiled map ${mapFilePath} (${room.cols}x${room.rows} tiles)`);
  }

  console.log('All Pallet Town interior maps and tileset successfully built!');
}

main().catch(err => {
  console.error('Error generating Pallet interiors:', err);
  process.exit(1);
});
