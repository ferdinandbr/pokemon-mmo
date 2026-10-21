const { getProjectileVisuals } = require('../client/src/battle/projectileSystem.js');
const { MOVES_BY_INTERNAL } = require('../client/src/battle/movesDatabase.js');

const types = ['Fire', 'Water', 'Electric', 'Ghost', 'Grass', 'Poison', 'Rock', 'Ground', 'Ice', 'Bug', 'Dragon', 'Normal', 'Psychic', 'Dark', 'Steel', 'Fairy', 'Flying', 'Fighting'];

console.log('Testing all element types:');
for (const t of types) {
  try {
    getProjectileVisuals({ type: t });
    console.log(`Type ${t}: OK`);
  } catch (e) {
    console.error(`Type ${t}: FAILED ->`, e.message);
  }
}

console.log('\nTesting Articuno & Gastly moves:');
const targetMoves = ['SHEERCOLD', 'BLIZZARD', 'ICEBEAM', 'FREEZEDRY', 'POWDERSNOW', 'ICESHARD', 'NIGHTSHADE', 'CONFUSERAY', 'SHADOWBALL', 'LICK', 'CURSE', 'SPITE', 'DREAMEATER', 'HEX'];
for (const mKey of targetMoves) {
  const m = MOVES_BY_INTERNAL[mKey];
  try {
    getProjectileVisuals({ type: m?.type, skillData: m });
    console.log(`Move ${mKey} (${m?.name}): OK`);
  } catch (e) {
    console.error(`Move ${mKey}: FAILED ->`, e.message);
  }
}
