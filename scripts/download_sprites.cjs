const fs = require('fs');
const path = require('path');
const https = require('https');

let raw = fs.readFileSync('scratch_imgur.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const data = JSON.parse(raw);
const media = data.media;

const outDir = path.join(__dirname, '..', 'client', 'public', 'assets', 'pokemon', 'animated', 'front', 'normal');
const outShinyDir = path.join(__dirname, '..', 'client', 'public', 'assets', 'pokemon', 'animated', 'front', 'shiny');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(outShinyDir)) fs.mkdirSync(outShinyDir, { recursive: true });

const list = [];
for (let i = 1; i <= 151; i++) {
  const p = String(i).padStart(3, '0');
  
  // Normal candidate: uploaded before 20:54:13Z
  let mNormal = media.filter(m => (m.name === p || m.name === String(i)) && m.created_at < '2013-02-08T20:54:13Z' && m.created_at >= '2013-02-08T20:49:00Z');
  if (mNormal.length === 0) {
    mNormal = media.filter(m => (m.name === p + 'f') && m.created_at < '2013-02-08T20:54:13Z' && m.created_at >= '2013-02-08T20:49:00Z');
  }
  mNormal.sort((a,b) => b.created_at.localeCompare(a.created_at));
  const normal = mNormal[0];

  // Shiny candidate: uploaded before 20:49:00Z
  let mShiny = media.filter(m => (m.name === p || m.name === String(i)) && m.created_at < '2013-02-08T20:49:00Z');
  if (mShiny.length === 0) {
    mShiny = media.filter(m => (m.name === p + 'f') && m.created_at < '2013-02-08T20:49:00Z');
  }
  mShiny.sort((a,b) => b.created_at.localeCompare(a.created_at));
  const shiny = mShiny[0];

  if (!normal) {
    console.error(`Missing normal for ${p}`);
  }

  list.push({
    id: p,
    normalUrl: normal?.url,
    shinyUrl: shiny?.url
  });
}

console.log(`Prepared ${list.length} Pokémon download tasks.`);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(false); // already downloaded
    }
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
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
  const queue = [];
  for (const item of list) {
    if (item.normalUrl) {
      queue.push({
        name: `${item.id}.gif`,
        url: item.normalUrl,
        dest: path.join(outDir, `${item.id}.gif`)
      });
    }
    if (item.shinyUrl) {
      queue.push({
        name: `shiny/${item.id}.gif`,
        url: item.shinyUrl,
        dest: path.join(outShinyDir, `${item.id}.gif`)
      });
    }
  }

  console.log(`Total files to download: ${queue.length}`);
  const CONCURRENCY = 10;
  let active = 0;
  let index = 0;
  let completed = 0;

  return new Promise((resolve) => {
    function next() {
      if (index >= queue.length && active === 0) {
        return resolve();
      }
      while (active < CONCURRENCY && index < queue.length) {
        const task = queue[index++];
        active++;
        downloadFile(task.url, task.dest)
          .then(downloaded => {
            completed++;
            if (completed % 25 === 0 || completed === queue.length) {
              console.log(`Progress: ${completed}/${queue.length} files processed.`);
            }
          })
          .catch(err => {
            console.error(`Failed ${task.name}: ${err.message}`);
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
  console.log('All downloads completed!');
}).catch(err => {
  console.error('Fatal error:', err);
});
