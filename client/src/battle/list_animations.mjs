import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.includes('Separated Frames')) {
        results = results.concat(getFiles(fullPath));
      }
    } else if (file.endsWith('.png')) {
      results.push(fullPath.replace(/\\/g, '/').split('assets/battle/animations/')[1]);
    }
  }
  return results;
}

const list = getFiles('client/public/assets/battle/animations');
console.log(JSON.stringify(list, null, 2));
