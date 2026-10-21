import fs from 'fs';
const content = fs.readFileSync('client/src/battle/movesDatabase.js', 'utf8');
const files = new Set();
for (const m of content.matchAll(/"file":\s*"([^"]+)"/g)) {
  files.add(m[1]);
}
console.log('Unique visual files in movesDatabase:');
console.log(Array.from(files));
