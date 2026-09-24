const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'client', 'public', 'assets', 'pokemon', 'animated');
const frontNormalDir = path.join(baseDir, 'front', 'normal');
const frontShinyDir = path.join(baseDir, 'front', 'shiny');
const backNormalDir = path.join(baseDir, 'back', 'normal');
const backShinyDir = path.join(baseDir, 'back', 'shiny');

fs.mkdirSync(frontNormalDir, { recursive: true });
fs.mkdirSync(frontShinyDir, { recursive: true });
fs.mkdirSync(backNormalDir, { recursive: true });
fs.mkdirSync(backShinyDir, { recursive: true });

// 1. Move root gifs (front normal) -> front/normal
const rootFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.gif'));
for (const file of rootFiles) {
  fs.renameSync(path.join(baseDir, file), path.join(frontNormalDir, file));
}
console.log(`Moved ${rootFiles.length} root GIFs to front/normal`);

// 2. Move shiny/*.gif (front shiny) -> front/shiny
const shinySourceDir = path.join(baseDir, 'shiny');
if (fs.existsSync(shinySourceDir)) {
  const shinyFiles = fs.readdirSync(shinySourceDir).filter(f => f.endsWith('.gif'));
  for (const file of shinyFiles) {
    fs.renameSync(path.join(shinySourceDir, file), path.join(frontShinyDir, file));
  }
  console.log(`Moved ${shinyFiles.length} shiny GIFs to front/shiny`);
  try {
    fs.rmdirSync(shinySourceDir);
  } catch (e) {
    console.warn(`Could not remove ${shinySourceDir}: ${e.message}`);
  }
}

// 3. Move back/*.gif (back normal) -> back/normal
const backDir = path.join(baseDir, 'back');
if (fs.existsSync(backDir)) {
  const backFiles = fs.readdirSync(backDir).filter(f => f.endsWith('.gif'));
  for (const file of backFiles) {
    fs.renameSync(path.join(backDir, file), path.join(backNormalDir, file));
  }
  console.log(`Moved ${backFiles.length} back GIFs to back/normal`);
}

// Verification
const fnCount = fs.existsSync(frontNormalDir) ? fs.readdirSync(frontNormalDir).filter(f => f.endsWith('.gif')).length : 0;
const fsCount = fs.existsSync(frontShinyDir) ? fs.readdirSync(frontShinyDir).filter(f => f.endsWith('.gif')).length : 0;
const bnCount = fs.existsSync(backNormalDir) ? fs.readdirSync(backNormalDir).filter(f => f.endsWith('.gif')).length : 0;
const bsCount = fs.existsSync(backShinyDir) ? fs.readdirSync(backShinyDir).filter(f => f.endsWith('.gif')).length : 0;

console.log('--- REORGANIZATION SUMMARY ---');
console.log(`front/normal: ${fnCount} GIFs`);
console.log(`front/shiny:  ${fsCount} GIFs`);
console.log(`back/normal:  ${bnCount} GIFs`);
console.log(`back/shiny:   ${bsCount} GIFs`);
console.log(`Total:        ${fnCount + fsCount + bnCount + bsCount} GIFs`);
