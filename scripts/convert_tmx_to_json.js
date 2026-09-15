/**
 * convert_tmx_to_json.js
 * Converts a Tiled .tmx XML file to a Phaser-compatible Tiled JSON file.
 * 
 * Usage: node scripts/convert_tmx_to_json.js <input.tmx> <output.json>
 * 
 * Can also fetch from URL:
 *   node scripts/convert_tmx_to_json.js --url "https://..." <output.json>
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Simple URL fetcher
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Very lightweight XML-to-JS converter sufficient for TMX files.
 */
function parseTmx(xml) {
  xml = xml.replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();

  function parseNode(str, offset) {
    while (offset < str.length && /\s/.test(str[offset])) offset++;
    if (str[offset] !== '<') return null;
    if (str[offset + 1] === '/') return null;

    let i = offset + 1;
    while (i < str.length && !/[\s>\/]/.test(str[i])) i++;
    const tagName = str.slice(offset + 1, i);

    const attrs = {};
    while (i < str.length && str[i] !== '>' && !(str[i] === '/' && str[i + 1] === '>')) {
      while (i < str.length && /\s/.test(str[i])) i++;
      if (str[i] === '>' || (str[i] === '/' && str[i + 1] === '>')) break;

      let an = i;
      while (i < str.length && str[i] !== '=' && !/\s/.test(str[i]) && str[i] !== '>') i++;
      const attrName = str.slice(an, i).trim();
      if (!attrName) { i++; continue; }

      while (i < str.length && /\s/.test(str[i])) i++;
      if (str[i] === '=') {
        i++;
        while (i < str.length && /\s/.test(str[i])) i++;
        const quote = str[i];
        if (quote === '"' || quote === "'") {
          i++;
          let av = i;
          while (i < str.length && str[i] !== quote) i++;
          attrs[attrName] = str.slice(av, i);
          i++;
        }
      }
    }

    if (str[i] === '/' && str[i + 1] === '>') {
      return { tag: tagName, attrs, children: [], text: '', end: i + 2 };
    }

    i++;
    const children = [];
    let text = '';

    while (i < str.length) {
      while (i < str.length && /\s/.test(str[i])) { i++; }
      if (str[i] === '<') {
        if (str[i + 1] === '/') {
          while (i < str.length && str[i] !== '>') i++;
          i++;
          break;
        }
        const child = parseNode(str, i);
        if (child) {
          children.push(child);
          i = child.end;
        } else {
          i++;
        }
      } else {
        let ts = i;
        while (i < str.length && str[i] !== '<') i++;
        text += str.slice(ts, i);
      }
    }

    return { tag: tagName, attrs, children, text: text.trim(), end: i };
  }

  return parseNode(xml, 0);
}

function parseProperties(propsNode) {
  const result = [];
  for (const prop of (propsNode ? propsNode.children : [])) {
    if (prop.tag === 'property') {
      result.push({
        name: prop.attrs.name,
        type: prop.attrs.type || 'string',
        value: prop.attrs.value,
      });
    }
  }
  return result;
}

function tmxToTiledJson(xml, tilesetImageMap = {}) {
  const root = parseTmx(xml);
  if (!root || root.tag !== 'map') throw new Error('Invalid TMX: root element must be <map>');

  const mapAttrs = root.attrs;
  const mapWidth = parseInt(mapAttrs.width);
  const mapHeight = parseInt(mapAttrs.height);
  const tileWidth = parseInt(mapAttrs.tilewidth);
  const tileHeight = parseInt(mapAttrs.tileheight);

  // Tilesets
  const tilesets = [];
  for (const child of root.children) {
    if (child.tag === 'tileset') {
      const firstgid = parseInt(child.attrs.firstgid);
      const sourcePath = child.attrs.source || '';
      const tsxName = path.basename(sourcePath, '.tsx');
      let name = child.attrs.name || tsxName;
      let tileCount = parseInt(child.attrs.tilecount) || 0;
      let columns = parseInt(child.attrs.columns) || 0;
      let twid = parseInt(child.attrs.tilewidth) || tileWidth;
      let thgt = parseInt(child.attrs.tileheight) || tileHeight;
      let imageSource = '';
      let imageWidth = 0;
      let imageHeight = 0;

      const imgChild = child.children.find(c => c.tag === 'image');
      if (imgChild) {
        imageSource = imgChild.attrs.source || '';
        imageWidth = parseInt(imgChild.attrs.width) || 0;
        imageHeight = parseInt(imgChild.attrs.height) || 0;
      }

      if (tilesetImageMap[tsxName]) {
        const ov = tilesetImageMap[tsxName];
        name = ov.name || name;
        imageSource = ov.image || imageSource;
        imageWidth = ov.imageWidth || imageWidth;
        imageHeight = ov.imageHeight || imageHeight;
        tileCount = ov.tileCount || tileCount;
        columns = ov.columns || columns;
      }

      tilesets.push({
        firstgid,
        name: name || tsxName,
        tilewidth: twid,
        tileheight: thgt,
        spacing: 0,
        margin: 0,
        tilecount: tileCount,
        columns,
        image: imageSource ? path.basename(imageSource) : '',
        imagewidth: imageWidth,
        imageheight: imageHeight,
      });
    }
  }

  // Layers
  const layers = [];
  let layerId = 1;

  for (const child of root.children) {
    if (child.tag === 'layer') {
      const dataChild = child.children.find(c => c.tag === 'data');
      let data = [];

      if (dataChild) {
        const encoding = dataChild.attrs.encoding || 'csv';
        if (encoding === 'csv') {
          data = dataChild.text.split(',').map(v => parseInt(v.trim()) || 0);
        }
      }

      const propsChild = child.children.find(c => c.tag === 'properties');
      layers.push({
        id: parseInt(child.attrs.id) || layerId++,
        name: child.attrs.name || 'Layer ' + layerId,
        type: 'tilelayer',
        x: 0,
        y: 0,
        width: parseInt(child.attrs.width) || mapWidth,
        height: parseInt(child.attrs.height) || mapHeight,
        visible: child.attrs.visible !== '0',
        opacity: parseFloat(child.attrs.opacity) || 1,
        data,
        properties: parseProperties(propsChild),
      });
    } else if (child.tag === 'objectgroup') {
      const objects = [];
      for (const obj of child.children) {
        if (obj.tag === 'object') {
          const propsChild = obj.children.find(c => c.tag === 'properties');
          objects.push({
            id: parseInt(obj.attrs.id) || 0,
            name: obj.attrs.name || '',
            type: obj.attrs.type || obj.attrs.class || '',
            x: parseFloat(obj.attrs.x) || 0,
            y: parseFloat(obj.attrs.y) || 0,
            width: parseFloat(obj.attrs.width) || 0,
            height: parseFloat(obj.attrs.height) || 0,
            rotation: parseFloat(obj.attrs.rotation) || 0,
            visible: obj.attrs.visible !== '0',
            properties: parseProperties(propsChild),
          });
        }
      }
      const propsChild = child.children.find(c => c.tag === 'properties');
      layers.push({
        id: parseInt(child.attrs.id) || layerId++,
        name: child.attrs.name || 'Objects ' + layerId,
        type: 'objectgroup',
        x: 0,
        y: 0,
        draworder: child.attrs.draworder || 'topdown',
        visible: child.attrs.visible !== '0',
        opacity: parseFloat(child.attrs.opacity) || 1,
        objects,
        properties: parseProperties(propsChild),
      });
    }
  }

  return {
    version: '1.10',
    tiledversion: '1.11.2',
    type: 'map',
    orientation: mapAttrs.orientation || 'orthogonal',
    renderorder: mapAttrs.renderorder || 'right-down',
    width: mapWidth,
    height: mapHeight,
    tilewidth: tileWidth,
    tileheight: tileHeight,
    infinite: mapAttrs.infinite === '1',
    nextlayerid: parseInt(mapAttrs.nextlayerid) || layers.length + 1,
    nextobjectid: parseInt(mapAttrs.nextobjectid) || 1,
    tilesets,
    layers,
    properties: [],
  };
}

// Known tileset overrides for Shipairtime/Pokemon-Kanto-Tiled-Maps
const KANTO_TILESET_MAP = {
  'Outside1 Spring': {
    name: 'Outside1 Spring',
    image: 'Outside1_Spring.png',
    imageWidth: 256,
    imageHeight: 18176,
    tileCount: 4544,
    columns: 8,
  },
  'Outside2 Summer': {
    name: 'Outside2 Summer',
    image: 'Outside2_Summer.png',
    imageWidth: 256,
    imageHeight: 18176,
    tileCount: 4544,
    columns: 8,
  },
  'Outside': {
    name: 'Outside',
    image: 'Outside.png',
    imageWidth: 256,
    imageHeight: 18176,
    tileCount: 4544,
    columns: 8,
  },
  'Interior general': {
    name: 'Interior general',
    image: 'Interior_general.png',
    imageWidth: 256,
    imageHeight: 18176,
    tileCount: 4544,
    columns: 8,
  },
};

async function main() {
  const args = process.argv.slice(2);
  let inputXml = null;
  let outputFile = null;

  if (args[0] === '--url') {
    console.log(`Fetching TMX from:\n  ${args[1]}\n`);
    inputXml = await fetchUrl(args[1]);
    outputFile = args[2];
  } else {
    const inputFile = args[0];
    outputFile = args[1];
    if (!inputFile || !fs.existsSync(inputFile)) {
      console.error('Usage: node scripts/convert_tmx_to_json.js <input.tmx> <output.json>');
      console.error('   or: node scripts/convert_tmx_to_json.js --url <url> <output.json>');
      process.exit(1);
    }
    inputXml = fs.readFileSync(inputFile, 'utf8');
  }

  if (!outputFile) {
    console.error('Missing output file argument');
    process.exit(1);
  }

  console.log('Parsing TMX...');
  const json = tmxToTiledJson(inputXml, KANTO_TILESET_MAP);

  fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));

  console.log('\n✅ Converted successfully!');
  console.log(`   Map: ${json.width}x${json.height} tiles (${json.tilewidth}x${json.tileheight}px each)`);
  console.log(`   Tilesets: ${json.tilesets.map(t => t.name).join(', ')}`);
  const layerSummary = json.layers.map(l =>
    `     [${l.type}] "${l.name}"${l.type === 'tilelayer' ? ` ${l.width}x${l.height}` : ` (${(l.objects || []).length} objects)`}`
  ).join('\n');
  console.log(`   Layers:\n${layerSummary}`);
  console.log(`\nOutput: ${path.resolve(outputFile)}`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
