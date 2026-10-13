const express = require('express');
const router = express.Router();
const prisma = require('../database');
const encounterService = require('../services/encounterService');

// GET all available species from database for spawn selector / search
router.get('/species', async (req, res) => {
  try {
    const search = req.query.q ? String(req.query.q).trim().toLowerCase() : '';

    const allSpecies = await prisma.pokemonSpecies.findMany({
      select: {
        id: true,
        name: true,
        type1: true,
        type2: true,
        baseHp: true,
        baseAttack: true,
        baseSpeed: true
      },
      orderBy: { id: 'asc' }
    });

    let species = allSpecies;
    if (search) {
      const cleanNum = parseInt(search.replace('#', ''), 10);
      species = allSpecies.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(search);
        const idMatch = !isNaN(cleanNum) && s.id === cleanNum;
        const typeMatch = (s.type1 && s.type1.toLowerCase().includes(search)) || (s.type2 && s.type2.toLowerCase().includes(search));
        return nameMatch || idMatch || typeMatch;
      });
    }

    res.json({ success: true, count: species.length, species });
  } catch (err) {
    console.error('[EncounterRoutes Species Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all encounter zones for a map
router.get('/', async (req, res) => {
  try {
    const mapId = req.query.mapId || req.query.map || 'kanto';
    const zones = await encounterService.getZonesForMap(mapId);
    res.json({ success: true, mapId, count: zones.length, zones });
  } catch (err) {
    console.error('[EncounterRoutes GET Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST save/update a single encounter zone
router.post('/', async (req, res) => {
  try {
    const zoneData = req.body;
    if (!zoneData || typeof zoneData !== 'object') {
      return res.status(400).json({ success: false, error: 'Dados da zona de encounter inválidos' });
    }

    const saved = await encounterService.saveZone(zoneData);
    res.json({ success: true, message: 'Zona de spawn salva com sucesso!', zone: saved });
  } catch (err) {
    console.error('[EncounterRoutes POST Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST bulk save zones for a map
router.post('/bulk', async (req, res) => {
  try {
    const { mapId, zones } = req.body;
    if (!mapId || !Array.isArray(zones)) {
      return res.status(400).json({ success: false, error: 'Parâmetros mapId e array de zones são obrigatórios' });
    }

    const savedZones = await encounterService.bulkSaveZonesForMap(mapId, zones);
    res.json({ success: true, message: `${savedZones.length} zonas salvas no banco com sucesso!`, count: savedZones.length, zones: savedZones });
  } catch (err) {
    console.error('[EncounterRoutes POST bulk Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE an encounter zone by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID da zona não fornecido' });
    }

    const deleted = await encounterService.deleteZone(id);
    res.json({ success: true, message: 'Zona excluída com sucesso!', deleted });
  } catch (err) {
    console.error('[EncounterRoutes DELETE Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
