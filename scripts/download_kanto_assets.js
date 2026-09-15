/**
 * download_kanto_assets.js
 * Downloads tilesets and converts TMX maps from:
 * https://github.com/Shipairtime/Pokemon-Kanto-Tiled-Maps
 *
 * Usage: node scripts/download_kanto_assets.js [--tilesets] [--maps <map1,map2,...>]
 *
 * Examples:
 *   node scripts/download_kanto_assets.js --tilesets
 *   node scripts/download_kanto_assets.js --maps pallet_town,viridian_city,route_1
 *   node scripts/download_kanto_assets.js --tilesets --maps pallet_town
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const BASE_RAW = 'https://raw.githubusercontent.com/Shipairtime/Pokemon-Kanto-Tiled-Maps/main';
const ASSETS_DIR = path.join(__dirname, '../client/public/assets');
const TILESETS_DIR = path.join(ASSETS_DIR, 'tilesets');
const MAPS_DIR = path.join(ASSETS_DIR, 'maps');

// Available tilesets in the repository
const TILESETS = [
  { name: 'Outside1_Spring.png',        url: `${BASE_RAW}/Tilesets/Outside1%20Spring.png` },
  { name: 'Outside2_Summer.png',        url: `${BASE_RAW}/Tilesets/Outside2%20Summer.png` },
  { name: 'Outside3_Autumn.png',        url: `${BASE_RAW}/Tilesets/Outside3%20Autumn.png` },
  { name: 'Outside4_Winter.png',        url: `${BASE_RAW}/Tilesets/Outside4%20Winter.png` },
  { name: 'Interior_general.png',       url: `${BASE_RAW}/Tilesets/Interior%20general.png` },
  { name: 'Poke_Centre_interior.png',   url: `${BASE_RAW}/Tilesets/Poke%20Centre%20interior.png` },
  { name: 'Mart_interior.png',          url: `${BASE_RAW}/Tilesets/Mart%20interior.png` },
  { name: 'Gyms_interior.png',          url: `${BASE_RAW}/Tilesets/Gyms%20interior.png` },
  { name: 'Caves.png',                  url: `${BASE_RAW}/Tilesets/Caves.png` },
];

// Available maps from the repository
const MAPS = {
  pallet_town:    { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Pallet%20Town/Pallet%20Town%20Spring.tmx`,    output: 'pallet_town.json' },
  viridian_city:  { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Viridian%20City/Viridian%20City%20Spring.tmx`, output: 'viridian_city.json' },
  cerulean_city:  { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Cerulean%20City/Cerulean%20City%20Spring.tmx`, output: 'cerulean_city.json' },
  vermilion_city: { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Vermilion%20City/Vermilion%20City%20Spring.tmx`, output: 'vermilion_city.json' },
  celadon_city:   { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Celadon%20City/Celadon%20City%20Spring.tmx`,   output: 'celadon_city.json' },
  lavender_town:  { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Lavender%20Town/Lavender%20Town%20Spring.tmx`, output: 'lavender_town.json' },
  fuchsia_city:   { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Fuchsia%20City/Fuchsia%20City%20Spring.tmx`,   output: 'fuchsia_city.json' },
  saffron_city:   { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Saffron%20City/Saffron%20City%20Spring.tmx`,   output: 'saffron_city.json' },
  cinnabar_island:{ tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Cinnabar%20Island/Cinnabar%20Island%20Spring.tmx`, output: 'cinnabar_island.json' },
  pewter_city:    { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Pewter%20City/Pewter%20City%20Spring.tmx`,     output: 'pewter_city.json' },
  indigo_plateau: { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Citites/Indigo%20Plateau/Indigo%20Plateau%20Spring.tmx`, output: 'indigo_plateau.json' },
  route_1:  { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Routes/Kanto%20Route%20001/Kanto%20Route%201%20Spring.tmx`, output: 'route_1.json' },
  route_2:  { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Routes/Kanto%20Route%20002/Kanto%20Route%202.tmx`,           output: 'route_2.json' },
  route_3:  { tmxUrl: `${BASE_RAW}/Kanto%20maps/Kanto%20Routes/Kanto%20Route%20003/Kanto%20Route%203.tmx`,           output: 'route_3.json' },
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    // Check if already exists
    if (fs.existsSync(dest)) {
      console.log(`  ⏭  Already exists: ${path.basename(dest)}`);
      return resolve(dest);
    }

    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(dest).size;
        console.log(`  ✅ Downloaded: ${path.basename(dest)} (${(size / 1024).toFixed(1)} KB)`);
        resolve(dest);
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadTilesets(names = null) {
  const toDownload = names
    ? TILESETS.filter(t => names.includes(t.name.replace('.png', '').toLowerCase()))
    : TILESETS;

  console.log(`\n📦 Downloading ${toDownload.length} tileset(s) to: ${TILESETS_DIR}\n`);
  for (const ts of toDownload) {
    try {
      await downloadFile(ts.url, path.join(TILESETS_DIR, ts.name));
    } catch (err) {
      console.error(`  ❌ Failed: ${ts.name} — ${err.message}`);
    }
  }
}

async function convertMaps(mapIds) {
  const converterScript = path.join(__dirname, 'convert_tmx_to_json.js');
  console.log(`\n🗺️  Converting ${mapIds.length} map(s) to: ${MAPS_DIR}\n`);

  for (const id of mapIds) {
    const mapDef = MAPS[id];
    if (!mapDef) {
      console.error(`  ❌ Unknown map: "${id}". Available: ${Object.keys(MAPS).join(', ')}`);
      continue;
    }

    const outputPath = path.join(MAPS_DIR, mapDef.output);

    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭  Already converted: ${mapDef.output}`);
      continue;
    }

    try {
      console.log(`  🔄 Converting ${id}...`);
      execSync(`node "${converterScript}" --url "${mapDef.tmxUrl}" "${outputPath}"`, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..'),
      });
      console.log(`  ✅ Converted: ${mapDef.output}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${id} — ${err.message}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: node scripts/download_kanto_assets.js [options]

Options:
  --tilesets              Download all outdoor tilesets
  --maps <id1,id2,...>    Convert specific maps (comma-separated)
  --all                   Download all tilesets AND convert all maps

Available map IDs:
  ${Object.keys(MAPS).join(', ')}

Available tilesets:
  ${TILESETS.map(t => t.name).join(', ')}
`);
    return;
  }

  if (args.includes('--all')) {
    await downloadTilesets();
    await convertMaps(Object.keys(MAPS));
    return;
  }

  if (args.includes('--tilesets')) {
    await downloadTilesets();
  }

  const mapsIdx = args.indexOf('--maps');
  if (mapsIdx !== -1 && args[mapsIdx + 1]) {
    const mapIds = args[mapsIdx + 1].split(',').map(s => s.trim());
    await convertMaps(mapIds);
  }

  console.log('\n✨ Done!');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
