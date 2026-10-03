const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function buildKantoPerfect() {
  const inputImagePath = 'client/public/assets/tilesets/spz3zUx.png';
  const outputImagePath = 'client/public/assets/tilesets/spz3zUx_scaled.png';
  const outputMapPath = 'client/public/assets/maps/kanto.json';

  console.log(`[PerfectKanto] Loading source image ${inputImagePath}...`);
  const img = await loadImage(inputImagePath);
  console.log(`[PerfectKanto] Source Dimensions: ${img.width}x${img.height}`);

  const srcTileW = 16;
  const srcTileH = 16;
  const outTileW = 32;
  const outTileH = 32;

  const mapCols = img.width / srcTileW;  // 408
  const mapRows = img.height / srcTileH; // 400
  const totalMapTiles = mapCols * mapRows; // 163,200

  const srcCanvas = createCanvas(img.width, img.height);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);

  const tileHashMap = new Map(); // hash -> GID (1-based)
  const uniqueTiles = []; // array of ImageData
  const groundData = new Uint32Array(totalMapTiles);

  console.log(`[PerfectKanto] Processing & deduplicating 163,200 tiles...`);

  for (let r = 0; r < mapRows; r++) {
    for (let c = 0; c < mapCols; c++) {
      const tileIndex = r * mapCols + c;
      const imgData = srcCtx.getImageData(c * srcTileW, r * srcTileH, srcTileW, srcTileH);
      const data = imgData.data;

      // Check if tile is pure white (#FFFFFF or #FAFAFA+) -> outside margin
      let isWhite = true;
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];

        if (alpha > 0 && !(red >= 250 && green >= 250 && blue >= 250)) {
          isWhite = false;
          break;
        }
      }

      if (isWhite) {
        // Leave as empty tile (GID 0)
        groundData[tileIndex] = 0;
        continue;
      }

      // Extract exact 1024-byte slice for this specific 16x16 tile
      const tileBufferSlice = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      const hash = tileBufferSlice.toString('base64');

      if (tileHashMap.has(hash)) {
        groundData[tileIndex] = tileHashMap.get(hash);
      } else {
        uniqueTiles.push(imgData);
        const newGid = uniqueTiles.length; // 1-based GID
        tileHashMap.set(hash, newGid);
        groundData[tileIndex] = newGid;
      }
    }
  }

  const numUnique = uniqueTiles.length;
  console.log(`[PerfectKanto] Found ${numUnique} unique tiles!`);

  // Build GPU-safe Extruded 2x Atlas (32x32 tiles, margin: 1, spacing: 2)
  // This completely eliminates subpixel tile seams and camera movement lines!
  const margin = 1;
  const spacing = 2;
  const atlasCols = 64;
  const atlasRows = Math.ceil(numUnique / atlasCols);
  const atlasW = atlasCols * (outTileW + spacing); // 64 * 34 = 2176px
  const atlasH = atlasRows * (outTileH + spacing); // 27 * 34 = 918px

  console.log(`[PerfectKanto] Creating Extruded 2x atlas: ${atlasW}x${atlasH}px (${atlasCols} cols x ${atlasRows} rows, margin=${margin}, spacing=${spacing})...`);

  const atlasCanvas = createCanvas(atlasW, atlasH);
  const atlasCtx = atlasCanvas.getContext('2d');
  atlasCtx.imageSmoothingEnabled = false;

  const tileHelperCanvas = createCanvas(srcTileW, srcTileH);
  const tileHelperCtx = tileHelperCanvas.getContext('2d');

  for (let i = 0; i < numUnique; i++) {
    const col = i % atlasCols;
    const row = Math.floor(i / atlasCols);

    const dx = margin + col * (outTileW + spacing);
    const dy = margin + row * (outTileH + spacing);

    tileHelperCtx.putImageData(uniqueTiles[i], 0, 0);

    // 1. Draw center 32x32 tile
    atlasCtx.drawImage(
      tileHelperCanvas,
      0, 0, srcTileW, srcTileH,
      dx, dy, outTileW, outTileH
    );

    // 2. Extrude edges (1px duplicate outward into gutter to prevent texture bleed)
    // Top
    atlasCtx.drawImage(atlasCanvas, dx, dy, outTileW, 1, dx, dy - 1, outTileW, 1);
    // Bottom
    atlasCtx.drawImage(atlasCanvas, dx, dy + outTileH - 1, outTileW, 1, dx, dy + outTileH, outTileW, 1);
    // Left
    atlasCtx.drawImage(atlasCanvas, dx, dy, 1, outTileH, dx - 1, dy, 1, outTileH);
    // Right
    atlasCtx.drawImage(atlasCanvas, dx + outTileW - 1, dy, 1, outTileH, dx + outTileW, dy, 1, outTileH);

    // 3. Extrude corners (1px corner duplicate into diagonal gutter)
    // Top-left
    atlasCtx.drawImage(atlasCanvas, dx, dy, 1, 1, dx - 1, dy - 1, 1, 1);
    // Top-right
    atlasCtx.drawImage(atlasCanvas, dx + outTileW - 1, dy, 1, 1, dx + outTileW, dy - 1, 1, 1);
    // Bottom-left
    atlasCtx.drawImage(atlasCanvas, dx, dy + outTileH - 1, 1, 1, dx - 1, dy + outTileH, 1, 1);
    // Bottom-right
    atlasCtx.drawImage(atlasCanvas, dx + outTileW - 1, dy + outTileH - 1, 1, 1, dx + outTileW, dy + outTileH, 1, 1);
  }

  const atlasBuf = atlasCanvas.toBuffer('image/png');
  fs.writeFileSync(outputImagePath, atlasBuf);
  console.log(`[PerfectKanto] Saved Extruded 2x atlas to ${outputImagePath} (${(atlasBuf.length / 1024).toFixed(1)} KB)`);

  // Rebuild kanto.json with 32x32 tiles, margin 1, spacing 2
  const zeroArray = new Array(totalMapTiles).fill(0);

  const newLayers = [
    { name: 'Water', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    { name: 'Ground', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(groundData) },
    { name: 'Grass', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    { name: 'Building', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    { name: 'Objects', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    { name: 'Tress', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    { name: 'Overhead', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    { name: 'Collision', type: 'tilelayer', visible: true, opacity: 1, x: 0, y: 0, width: mapCols, height: mapRows, data: Array.from(zeroArray) },
    {
      draworder: 'topdown',
      id: 9,
      name: 'Zones',
      opacity: 1,
      type: 'objectgroup',
      visible: true,
      x: 0,
      y: 0,
      objects: [
        {
          id: 200,
          name: 'Pallet Town',
          x: 896 * 2,
          y: 4160 * 2,
          width: 352 * 2,
          height: 352 * 2,
          visible: true,
          rotation: 0,
          type: ''
        },
        {
          id: 201,
          name: 'Route 1',
          x: 960 * 2,
          y: 3360 * 2,
          width: 288 * 2,
          height: 800 * 2,
          visible: true,
          rotation: 0,
          type: ''
        },
        {
          id: 202,
          name: 'Viridian City',
          x: 800 * 2,
          y: 2600 * 2,
          width: 640 * 2,
          height: 760 * 2,
          visible: true,
          rotation: 0,
          type: ''
        }
      ]
    },
    {
      draworder: 'topdown',
      id: 10,
      name: 'Portals',
      opacity: 1,
      type: 'objectgroup',
      visible: true,
      x: 0,
      y: 0,
      objects: []
    }
  ];

  const newMapJson = {
    compressionlevel: -1,
    height: mapRows,
    width: mapCols,
    tilewidth: outTileW,
    tileheight: outTileH,
    infinite: false,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    type: 'map',
    version: '1.10',
    tilesets: [
      {
        firstgid: 1,
        name: 'spz3zUx_scaled',
        tilewidth: outTileW,
        tileheight: outTileH,
        tilecount: numUnique,
        columns: atlasCols,
        image: '../tilesets/spz3zUx_scaled.png',
        imagewidth: atlasW,
        imageheight: atlasH,
        margin: margin,
        spacing: spacing
      }
    ],
    layers: newLayers
  };

  fs.writeFileSync(outputMapPath, JSON.stringify(newMapJson));
  console.log(`[PerfectKanto] Successfully built ${outputMapPath} (Extruded 32x32 tiles, margin=${margin}, spacing=${spacing})!`);
  console.log(`[PerfectKanto] Atlas Info: ${atlasW}x${atlasH}px, ${numUnique} unique tiles, columns=${atlasCols}`);
}

buildKantoPerfect().catch(err => {
  console.error('[PerfectKanto Error]:', err);
  process.exit(1);
});
