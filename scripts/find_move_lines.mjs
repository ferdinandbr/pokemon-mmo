import fs from 'fs';

const lines = fs.readFileSync('client/src/battle/movesDatabase.js', 'utf8').split('\n');
const targets = [
  'Bolt Strike', 'Thunder', 'Volt Tackle', 'Zap Cannon', 'Fusion Bolt',
  'Thunderbolt', 'Wild Charge', 'Discharge', 'Volt Switch', 'Thunder Fang',
  'Electroweb', 'Thunder Wave', 'Parabolic Charge', 'Electric Terrain',
  'Magnet Rise', 'Thunder Shock', 'Electro Ball'
];

targets.forEach(t => {
  const idx = lines.findIndex(l => l.includes(`"name": "${t}"`));
  console.log(`${t} line: ${idx + 1}`);
});
