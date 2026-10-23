import { MOVES_BY_ID } from '../client/src/battle/movesDatabase.js';

const targetNames = [
  'Bolt Strike', 'Thunder', 'Volt Tackle', 'Zap Cannon', 'Fusion Bolt',
  'Thunderbolt', 'Wild Charge', 'Discharge', 'Volt Switch', 'Thunder Fang',
  'Electroweb', 'Thunder Wave', 'Parabolic Charge', 'Electric Terrain',
  'Magnet Rise', 'Thunder Shock', 'Electro Ball', 'Thunder Punch'
];

const allMoves = Object.values(MOVES_BY_ID);

for (const name of targetNames) {
  const found = allMoves.find(m => m.name.toLowerCase() === name.toLowerCase());
  if (found) {
    console.log(`[#${found.id}] ${found.name} (${found.internalName}) - Cat: ${found.category}, Exec: ${found.executionType}, Family: ${found.vfxFamily}`);
    console.log('   visual:', JSON.stringify(found.visual));
    console.log('   combatBehavior:', JSON.stringify(found.combatBehavior));
  } else {
    console.log(`NOT FOUND: ${name}`);
  }
}
