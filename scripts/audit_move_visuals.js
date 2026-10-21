const { loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { MOVES_BY_ID } = require('../client/src/battle/movesDatabase.js');

async function auditMoves() {
  const baseAnimDir = 'e:/Projetos/PokeMMO/client/public/assets/battle/animations';
  const issues = [];
  const checkedFiles = new Map();

  for (const [id, move] of Object.entries(MOVES_BY_ID)) {
    if (!move.visual || !move.visual.file) continue;

    const relFile = move.visual.file;
    const fullPath = path.join(baseAnimDir, relFile);

    if (!fs.existsSync(fullPath)) {
      issues.push({ id, name: move.name, move: move.internalName, type: 'FILE_NOT_FOUND', file: relFile });
      continue;
    }

    let imgInfo = checkedFiles.get(fullPath);
    if (!imgInfo) {
      const img = await loadImage(fullPath);
      imgInfo = { width: img.width, height: img.height };
      checkedFiles.set(fullPath, imgInfo);
    }

    const cols = move.visual.cols || 1;
    const rows = move.visual.rows || 1;
    const fw = imgInfo.width / cols;
    const fh = imgInfo.height / rows;
    const scale = move.visual.scale || 1.0;
    const dw = fw * scale;
    const dh = fh * scale;

    // Check if cols / rows are inverted or frame is gigantic
    const isAspectMismatch = (imgInfo.width < imgInfo.height && cols > rows) || (imgInfo.width > imgInfo.height && rows > cols);
    const isGiant = dw > 400 || dh > 400 || fw > 300 || fh > 300;

    if (isAspectMismatch || isGiant) {
      issues.push({
        id,
        name: move.name,
        move: move.internalName,
        file: relFile,
        imgDim: `${imgInfo.width}x${imgInfo.height}`,
        cols,
        rows,
        fw,
        fh,
        scale,
        dw,
        dh,
        isAspectMismatch,
        isGiant
      });
    }
  }

  console.log(`Found ${issues.length} potential issues:`);
  console.table(issues);
}

auditMoves().catch(console.error);
