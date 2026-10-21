const fs = require('fs');
const path = require('path');

const dir = 'e:/Projetos/PokeMMO/client/src/battle';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(dir, file);
  try {
    // Run syntax check
    require(filePath);
  } catch (err) {
    console.log(`[${file}] Runtime load error:`, err.message);
  }
}
