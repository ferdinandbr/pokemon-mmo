const prisma = require('../database');
const fs = require('fs');
const path = require('path');

class EncounterService {
  /**
   * Get current server time of day phase ('morning', 'afternoon', 'night', 'dawn')
   * Manhã:     06h–12h
   * Tarde:     12h–18h
   * Noite:     18h–00h
   * Madrugada: 00h–06h
   */
  getCurrentTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';    // 06h–12h (Manhã)
    if (hour >= 12 && hour < 18) return 'afternoon';  // 12h–18h (Tarde)
    if (hour >= 18 && hour < 24) return 'night';      // 18h–00h (Noite)
    return 'dawn';                                    // 00h–06h (Madrugada)
  }

  /**
   * Get all encounter zones for a given mapId from the database.
   * If none exist, attempts to auto-migrate from map JSON file.
   */
  async getZonesForMap(mapId = 'kanto') {
    const cleanMapId = mapId ? mapId.replace(/[^a-zA-Z0-9_\-]/g, '') : 'kanto';
    
    let zones = await prisma.encounterZone.findMany({
      where: { mapId: cleanMapId },
      orderBy: { id: 'asc' }
    });

    if (zones.length === 0) {
      // Auto-migrate from tilemap JSON if available
      zones = await this.migrateFromMapJson(cleanMapId);
    }

    return zones;
  }

  /**
   * Migrate encounter zones from client map JSON file into database if present
   */
  async migrateFromMapJson(mapId) {
    try {
      const mapPath = path.join(__dirname, '../../../client/public/assets/maps', `${mapId}.json`);
      if (!fs.existsSync(mapPath)) return [];

      const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
      const spawnLayer = mapData.layers?.find(
        l => (l.name === 'PokemonSpawns' || l.name === 'Spawns' || l.name === 'Encounters') && l.type === 'objectgroup'
      );

      if (!spawnLayer || !Array.isArray(spawnLayer.objects) || spawnLayer.objects.length === 0) {
        return [];
      }

      const createdZones = [];
      for (const obj of spawnLayer.objects) {
        const props = {};
        if (Array.isArray(obj.properties)) {
          obj.properties.forEach(p => (props[p.name] = p.value));
        }

        const name = props.name || obj.name || 'Área de Spawn';
        const encounterType = props.encounterType || props.method || 'grass';
        const rate = Number(props.rate) || 10;
        let pokemonSpawns = [];

        try {
          const raw = props.pokemonSpawns || props.pokemonList || '[]';
          pokemonSpawns = typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch (e) {
          pokemonSpawns = [];
        }

        if (!Array.isArray(pokemonSpawns)) pokemonSpawns = [];

        const zone = await prisma.encounterZone.create({
          data: {
            mapId,
            name,
            encounterType,
            rate,
            x: Math.round(obj.x || 0),
            y: Math.round(obj.y || 0),
            width: Math.round(obj.width || 64),
            height: Math.round(obj.height || 64),
            pokemonSpawns: JSON.stringify(pokemonSpawns)
          }
        });
        createdZones.push(zone);
      }

      console.log(`[EncounterService] Migrated ${createdZones.length} encounter zones from map JSON '${mapId}' to DB.`);
      return createdZones;
    } catch (err) {
      console.warn(`[EncounterService] Failed to migrate map JSON for ${mapId}:`, err.message);
      return [];
    }
  }

  /**
   * Save or update an encounter zone in the DB
   */
  async saveZone(zoneData) {
    const { id, mapId, name, encounterType, rate, x, y, width, height, pokemonSpawns } = zoneData;
    const cleanMapId = mapId ? mapId.replace(/[^a-zA-Z0-9_\-]/g, '') : 'kanto';

    const serializedSpawns = typeof pokemonSpawns === 'string' 
      ? pokemonSpawns 
      : JSON.stringify(pokemonSpawns || []);

    const payload = {
      mapId: cleanMapId,
      name: name || 'Área de Spawn',
      encounterType: encounterType || 'grass',
      rate: Number(rate) || 10,
      x: Math.round(Number(x) || 0),
      y: Math.round(Number(y) || 0),
      width: Math.round(Number(width) || 64),
      height: Math.round(Number(height) || 64),
      pokemonSpawns: serializedSpawns
    };

    if (id && Number(id) > 0) {
      const existing = await prisma.encounterZone.findUnique({ where: { id: Number(id) } });
      if (existing) {
        return await prisma.encounterZone.update({
          where: { id: Number(id) },
          data: payload
        });
      }
    }

    return await prisma.encounterZone.create({ data: payload });
  }

  /**
   * Delete an encounter zone by ID
   */
  async deleteZone(id) {
    if (!id) return false;
    await prisma.encounterZone.delete({ where: { id: Number(id) } });
    return true;
  }

  /**
   * Bulk save all zones for a map (e.g. from editor map save)
   */
  async bulkSaveZonesForMap(mapId, zonesList = []) {
    const cleanMapId = mapId ? mapId.replace(/[^a-zA-Z0-9_\-]/g, '') : 'kanto';
    
    // Delete existing zones for this map and re-insert the new configuration
    await prisma.encounterZone.deleteMany({ where: { mapId: cleanMapId } });

    const created = [];
    for (const z of zonesList) {
      const saved = await this.saveZone({ ...z, mapId: cleanMapId, id: undefined });
      created.push(saved);
    }
    return created;
  }

  /**
   * Resolve wild encounter species and roll attributes based on player coordinates and environmental conditions
   */
  async resolveEncounter({ mapId = 'kanto', playerX, playerY, encounterMethod = 'grass', weather = 'clear', zoneId = null }) {
    const cleanMapId = mapId ? mapId.replace(/[^a-zA-Z0-9_\-]/g, '') : 'kanto';
    const currentTimeOfDay = this.getCurrentTimeOfDay();

    // 1. Fetch zones for map
    const zones = await this.getZonesForMap(cleanMapId);

    // 2. Find zone containing player coordinates or matching zoneId
    let matchingZone = null;
    if (zoneId) {
      matchingZone = zones.find(z => z.id === Number(zoneId));
    }
    if (!matchingZone && playerX != null && playerY != null) {
      matchingZone = zones.find(z => {
        const typeMatch = z.encounterType === encounterMethod;
        const insideX = playerX >= (z.x - 16) && playerX <= (z.x + z.width + 16);
        const insideY = playerY >= (z.y - 16) && playerY <= (z.y + z.height + 16);
        return typeMatch && insideX && insideY;
      });
    }

    // Se o jogador não estiver dentro de uma área de spawn delimitada, não gera encontro!
    if (!matchingZone) {
      return null;
    }

    let spawnEntries = [];
    if (matchingZone && matchingZone.pokemonSpawns) {
      try {
        spawnEntries = typeof matchingZone.pokemonSpawns === 'string'
          ? JSON.parse(matchingZone.pokemonSpawns)
          : matchingZone.pokemonSpawns;
      } catch (e) {
        spawnEntries = [];
      }
    }

    // Se a área não possuir nenhum Pokémon configurado, não gera encontro
    if (!Array.isArray(spawnEntries) || spawnEntries.length === 0) {
      return null;
    }

    // 3. Filter species by timeOfDay (Manhã, Tarde, Noite, Madrugada)
    const getWeightForTime = (entry) => {
      let val = null;
      if (currentTimeOfDay === 'morning') {
        val = entry.morningChance ?? entry.times?.morning;
      } else if (currentTimeOfDay === 'afternoon' || currentTimeOfDay === 'day') {
        val = entry.afternoonChance ?? entry.dayChance ?? entry.times?.afternoon ?? entry.times?.day;
      } else if (currentTimeOfDay === 'night') {
        val = entry.nightChance ?? entry.times?.night;
      } else if (currentTimeOfDay === 'dawn') {
        val = entry.dawnChance ?? entry.madrugadaChance ?? entry.times?.dawn ?? entry.times?.madrugada;
      }

      if (val != null) {
        return Math.max(0, Number(val));
      }

      // Legacy fallback
      if (Array.isArray(entry.timeOfDay) && entry.timeOfDay.length > 0) {
        if (!entry.timeOfDay.includes('all') && !entry.timeOfDay.includes(currentTimeOfDay)) {
          return 0;
        }
      }

      return Number(entry.weight) || 10;
    };

    let eligibleEntries = spawnEntries.filter(entry => {
      const w = getWeightForTime(entry);
      return w > 0;
    });

    // Fallback to all entries if environmental filtering removed everything
    if (eligibleEntries.length === 0) {
      eligibleEntries = spawnEntries;
    }

    // 4. Select species by weighted roll according to the active time slot
    const totalWeight = eligibleEntries.reduce((acc, s) => acc + Math.max(1, getWeightForTime(s)), 0);
    let roll = Math.random() * totalWeight;
    let chosenEntry = eligibleEntries[0];

    for (const entry of eligibleEntries) {
      const w = Math.max(1, getWeightForTime(entry));
      if (roll < w) {
        chosenEntry = entry;
        break;
      }
      roll -= w;
    }

    const speciesId = Number(chosenEntry.speciesId) || 16;
    const minLvl = Number(chosenEntry.minLevel) || 2;
    const maxLvl = Number(chosenEntry.maxLevel) || minLvl;
    const highIvChance = Number(chosenEntry.highIvChance) || 0;
    const shinyBonus = Number(chosenEntry.shinyBonus) || 1;

    const arenaKey = matchingZone?.arena || 
      (matchingZone?.encounterType === 'water' ? 'arena_water' : 
      (matchingZone?.encounterType === 'cave' ? 'arena_cave' : 'arena_grass'));

    return {
      speciesId,
      minLevel: minLvl,
      maxLevel: maxLvl,
      highIvChance,
      shinyBonus,
      zoneName: matchingZone?.name || 'Wild Area',
      arena: arenaKey,
      currentTimeOfDay,
      weather
    };
  }
}

module.exports = new EncounterService();
