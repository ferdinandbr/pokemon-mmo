const { loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { MOVES_BY_INTERNAL } = require('../client/src/battle/movesDatabase.js');

async function checkGastlyAndArticuno() {
  const baseAnimDir = 'e:/Projetos/PokeMMO/client/public/assets/battle/animations';
  const gastlyMoves = ['HYPNOSIS', 'LICK', 'SPITE', 'MEANLOOK', 'CURSE', 'NIGHTSHADE', 'CONFUSERAY', 'SUCKERPUNCH', 'PAYBACK', 'SHADOWBALL', 'DREAMEATER', 'DARKPULSE', 'DESTINYBOND', 'HEX', 'NIGHTMARE'];
  const articunoMoves = ['ROOST', 'HURRICANE', 'FREEZEDRY', 'TAILWIND', 'SHEERCOLD', 'GUST', 'POWDERSNOW', 'MIST', 'ICESHARD', 'MINDREADER', 'ANCIENTPOWER', 'AGILITY', 'ICEBEAM', 'REFLECT', 'HAIL', 'BLIZZARD'];

  console.log('=== GASTLY MOVES ===');
  for (const mKey of gastlyMoves) {
    const m = MOVES_BY_INTERNAL[mKey];
    if (!m) {
      console.log(mKey, 'NOT IN DATABASE!');
      continue;
    }
    const vis = m.visual;
    if (!vis || !vis.file) {
      console.log(mKey, 'NO VISUAL FILE');
      continue;
    }
    const full = path.join(baseAnimDir, vis.file);
    const exists = fs.existsSync(full);
    let dims = 'N/A';
    if (exists) {
      const img = await loadImage(full);
      dims = `${img.width}x${img.height}`;
    }
    console.log(mKey, `(${m.name})`, '| file:', vis.file, '| cols:', vis.cols, 'rows:', vis.rows, '| exists:', exists, '| dims:', dims, '| scale:', vis.scale);
  }

  console.log('\n=== ARTICUNO MOVES ===');
  for (const mKey of articunoMoves) {
    const m = MOVES_BY_INTERNAL[mKey];
    if (!m) {
      console.log(mKey, 'NOT IN DATABASE!');
      continue;
    }
    const vis = m.visual;
    if (!vis || !vis.file) {
      console.log(mKey, 'NO VISUAL FILE');
      continue;
    }
    const full = path.join(baseAnimDir, vis.file);
    const exists = fs.existsSync(full);
    let dims = 'N/A';
    if (exists) {
      const img = await loadImage(full);
      dims = `${img.width}x${img.height}`;
    }
    console.log(mKey, `(${m.name})`, '| file:', vis.file, '| cols:', vis.cols, 'rows:', vis.rows, '| exists:', exists, '| dims:', dims, '| scale:', vis.scale);
  }
}

checkGastlyAndArticuno().catch(console.error);
