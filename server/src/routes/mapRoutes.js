const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const MAP_PATH = path.join(__dirname, '../../../client/public/assets/maps/spz3zUx_small.json');
const TILESETS_DIR = path.join(__dirname, '../../../client/public/assets/tilesets');

// GET map file
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(MAP_PATH)) {
      return res.status(404).json({ error: 'Mapa não encontrado' });
    }
    const data = fs.readFileSync(MAP_PATH, 'utf8');
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

    const jsonString = JSON.stringify(mapData, null, 2);
    
    // Backup current map before saving
    const backupPath = MAP_PATH + '.bak';
    if (fs.existsSync(MAP_PATH)) {
      fs.copyFileSync(MAP_PATH, backupPath);
    }

    fs.writeFileSync(MAP_PATH, jsonString, 'utf8');
    console.log(`[MapRoute] Mapa salvo com sucesso: ${MAP_PATH} (${(jsonString.length / 1024 / 1024).toFixed(2)} MB)`);

    res.json({ success: true, message: 'Mapa salvo com sucesso!', size: jsonString.length });
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
