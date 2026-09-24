const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = path.join(__dirname, '..', 'client', 'public', 'assets', 'pokemon', 'animated', 'back');
const outNormalDir = path.join(baseDir, 'normal');
const outShinyDir = path.join(baseDir, 'shiny');

if (!fs.existsSync(outNormalDir)) fs.mkdirSync(outNormalDir, { recursive: true });
if (!fs.existsSync(outShinyDir)) fs.mkdirSync(outShinyDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      return resolve(false);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', err => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const tasks = [];
  for (let i = 1; i <= 151; i++) {
    const pad = String(i).padStart(3, '0');
    // Normal back sprite
    tasks.push({
      id: pad,
      type: 'normal',
      url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${i}.gif`,
      dest: path.join(outNormalDir, `${pad}.gif`)
    });
    // Shiny back sprite
    tasks.push({
      id: pad,
      type: 'shiny',
      url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/${i}.gif`,
      dest: path.join(outShinyDir, `${pad}.gif`)
    });
  }

  console.log(`Starting download of ${tasks.length} back sprites (151 normal + 151 shiny)...`);

  const CONCURRENCY = 12;
  let active = 0;
  let index = 0;
  let completed = 0;
  let errors = 0;

  return new Promise((resolve) => {
    function next() {
      if (index >= tasks.length && active === 0) {
        return resolve();
      }
      while (active < CONCURRENCY && index < tasks.length) {
        const task = tasks[index++];
        active++;
        downloadFile(task.url, task.dest)
          .then(() => {
            completed++;
            if (completed % 30 === 0 || completed === tasks.length) {
              console.log(`Progress: ${completed}/${tasks.length} back sprites downloaded.`);
            }
          })
          .catch(err => {
            errors++;
            console.error(`Error downloading ${task.type} #${task.id}: ${err.message}`);
          })
          .finally(() => {
            active--;
            next();
          });
      }
    }
    next();
  });
}

run().then(() => {
  console.log('All back sprite downloads finished!');
  const normalCount = fs.readdirSync(outNormalDir).filter(f => f.endsWith('.gif')).length;
  const shinyCount = fs.readdirSync(outShinyDir).filter(f => f.endsWith('.gif')).length;
  console.log(`Verified files: ${normalCount} normal back sprites, ${shinyCount} shiny back sprites.`);
}).catch(err => {
  console.error('Fatal error:', err);
});
