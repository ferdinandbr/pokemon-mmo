const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const MAPS_DIR = path.join(__dirname, '../../../client/public/assets/maps');
const DEFAULT_MAP_PATH = path.join(MAPS_DIR, 'pallet_town.json');
const TILESETS_DIR = path.join(__dirname, '../../../client/public/assets/tilesets');

function resolveMapPath(mapName) {
  if (!mapName) return DEFAULT_MAP_PATH;
  const clean = mapName.replace(/[^a-zA-Z0-9_\-]/g, '');
  return path.join(MAPS_DIR, `${clean}.json`);
}

// GET list all available maps (categorized cleanly from single source of truth)
router.get('/list', (req, res) => {
  try {
    if (!fs.existsSync(MAPS_DIR)) {
      return res.json({ cities: [], routes: [], root: [] });
    }

    const allFiles = fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.json') && !f.endsWith('.bak'));
    const mapNames = allFiles.map(f => f.replace('.json', ''));

    const CITIES_LIST = [
      'pallet_town', 'viridian_city', 'pewter_city', 'cerulean_city',
      'vermilion_city', 'lavender_town', 'celadon_city', 'saffron_city',
      'fuchsia_city', 'cinnabar_island', 'indigo_plateau'
    ];

    const cities = mapNames.filter(m => CITIES_LIST.includes(m) || m.endsWith('_city') || m.endsWith('_town'));
    const routes = mapNames.filter(m => m.startsWith('route_')).sort((a, b) => {
      const numA = parseInt(a.replace('route_', ''), 10) || 0;
      const numB = parseInt(b.replace('route_', ''), 10) || 0;
      return numA - numB;
    });
    const root = mapNames.filter(m => !cities.includes(m) && !routes.includes(m));

    res.json({ cities, routes, root });
  } catch (err) {
    console.error('[MapRoute Error GET /list]:', err);
    res.status(500).json({ error: 'Erro ao listar mapas: ' + err.message });
  }
});

// GET map file
router.get('/', (req, res) => {
  try {
    const targetPath = resolveMapPath(req.query.map);
    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ error: 'Mapa não encontrado: ' + (req.query.map || 'pallet_town') });
    }
    const data = fs.readFileSync(targetPath, 'utf8');
    res.type('application/json').send(data);
  } catch (err) {
    console.error('[MapRoute Error GET]:', err);
    res.status(500).json({ error: 'Erro ao carregar mapa: ' + err.message });
  }
});

// POST update map file
router.post('/', (req, res) => {
  try {
    const mapData = req.body;
    if (!mapData || typeof mapData !== 'object' || !Array.isArray(mapData.layers)) {
      return res.status(400).json({ error: 'Estrutura JSON do mapa inválida' });
    }

    const targetPath = resolveMapPath(req.query.map);
    const jsonString = JSON.stringify(mapData, null, 2);
    
    // Backup current map before saving
    const backupPath = targetPath + '.bak';
    if (fs.existsSync(targetPath)) {
      fs.copyFileSync(targetPath, backupPath);
    }

    fs.writeFileSync(targetPath, jsonString, 'utf8');
    console.log(`[MapRoute] Mapa salvo com sucesso: ${targetPath} (${(jsonString.length / 1024 / 1024).toFixed(2)} MB)`);

    res.json({ success: true, message: 'Mapa salvo com sucesso!', target: path.basename(targetPath), size: jsonString.length });
  } catch (err) {
    console.error('[MapRoute Error POST]:', err);
    res.status(500).json({ error: 'Erro ao salvar mapa: ' + err.message });
  }
});


// GET list available tileset PNG images
router.get('/tilesets', (req, res) => {
  try {
    if (!fs.existsSync(TILESETS_DIR)) {
      fs.mkdirSync(TILESETS_DIR, { recursive: true });
    }
    const files = fs.readdirSync(TILESETS_DIR).filter(f => f.toLowerCase().endsWith('.png'));
    res.json({ tilesets: files });
  } catch (err) {
    console.error('[MapRoute Error GET tilesets]:', err);
    res.status(500).json({ error: 'Erro ao listar tilesets: ' + err.message });
  }
});

// POST upload new tileset PNG image
router.post('/tileset', (req, res) => {
  try {
    const { filename, imageBase64 } = req.body;
    if (!filename || !imageBase64) {
      return res.status(400).json({ error: 'Parâmetros filename e imageBase64 são obrigatórios' });
    }

    // Clean filename
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    if (!safeFilename.toLowerCase().endsWith('.png')) {
      return res.status(400).json({ error: 'O arquivo de tileset deve ser uma imagem PNG (.png)' });
    }

    // Strip base64 data URL header if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (!fs.existsSync(TILESETS_DIR)) {
      fs.mkdirSync(TILESETS_DIR, { recursive: true });
    }

    const targetPath = path.join(TILESETS_DIR, safeFilename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`[MapRoute] Novo tileset PNG salvo: ${targetPath} (${buffer.length} bytes)`);

    res.json({
      success: true,
      filename: safeFilename,
      url: `/assets/tilesets/${safeFilename}`,
      message: 'Tileset salvo com sucesso!'
    });
  } catch (err) {
    console.error('[MapRoute Error POST tileset]:', err);
    res.status(500).json({ error: 'Erro ao upload do tileset: ' + err.message });
  }
});

module.exports = router;
