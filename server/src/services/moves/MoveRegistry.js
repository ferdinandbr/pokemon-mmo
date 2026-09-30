const prisma = require('../../database');
const { calculateMaxPp } = require('./MoveConstants');

class MoveRegistry {
  constructor() {
    this.byId = new Map();
    this.byInternalName = new Map();
    this.isLoaded = false;
    this.loadPromise = null;
  }

  /**
   * Initializes the registry by caching all moves from the database.
   */
  async init() {
    if (this.isLoaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const moves = await prisma.moveData.findMany();
        this.byId.clear();
        this.byInternalName.clear();

        for (const move of moves) {
          const formatted = {
            id: move.id,
            internalName: move.internalName.toUpperCase(),
            name: move.name,
            type: move.type.toUpperCase(),
            category: move.category || (move.power > 0 ? 'Physical' : 'Status'),
            power: move.power || 0,
            accuracy: move.accuracy || 100,
            pp: move.pp || 35,
            description: move.description || ''
          };

          this.byId.set(formatted.id, formatted);
          this.byInternalName.set(formatted.internalName, formatted);
        }

        this.isLoaded = true;
        console.log(`[MoveRegistry] ${this.byId.size} golpes carregados e indexados em cache na memória.`);
      } catch (err) {
        console.error('[MoveRegistry] Erro ao carregar golpes do banco:', err);
        throw err;
      } finally {
        this.loadPromise = null;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Ensures the cache is ready before querying.
   */
  async ensureLoaded() {
    if (!this.isLoaded) {
      await this.init();
    }
  }

  /**
   * Gets a move definition by its numeric ID.
   * @param {number} id
   * @returns {Object|null}
   */
  getById(id) {
    return this.byId.get(Number(id)) || null;
  }

  /**
   * Gets a move definition by its internal PBS name (e.g., 'THUNDERBOLT').
   * @param {string} internalName
   * @returns {Object|null}
   */
  getByInternalName(internalName) {
    if (!internalName) return null;
    return this.byInternalName.get(String(internalName).trim().toUpperCase()) || null;
  }

  /**
   * Resolves a move definition by either ID or internalName.
   * @param {number|string} identifier
   * @returns {Object|null}
   */
  get(identifier) {
    if (identifier === null || identifier === undefined) return null;
    if (typeof identifier === 'number' || !isNaN(Number(identifier))) {
      const byId = this.getById(Number(identifier));
      if (byId) return byId;
    }
    return this.getByInternalName(identifier);
  }

  /**
   * Checks if a move exists in the registry.
   * @param {number|string} identifier
   * @returns {boolean}
   */
  has(identifier) {
    return this.get(identifier) !== null;
  }

  /**
   * Fallback definition if a move is not found.
   */
  getFallbackMove(internalName = 'TACKLE') {
    return {
      id: 1,
      internalName: 'TACKLE',
      name: 'Tackle',
      type: 'NORMAL',
      category: 'Physical',
      power: 40,
      accuracy: 100,
      pp: 35,
      description: 'A physical attack in which the user charges and slams into the target.'
    };
  }

  /**
   * Takes a raw instance of PokemonMove stored in Pokemon.moves (JSON)
   * and inflates it with static details (name, type, power, category, description)
   * for client consumption (UI, battle preview).
   * 
   * @param {Object} rawInstance - { moveId, internalName, pp, maxPp, ppUps } or legacy format
   * @returns {Object}
   */
  inflatePokemonMove(rawInstance) {
    if (!rawInstance) return null;

    const identifier = rawInstance.moveId || rawInstance.id || rawInstance.internalName;
    const def = this.get(identifier) || this.getFallbackMove(rawInstance.internalName);

    const ppUps = rawInstance.ppUps || 0;
    const maxPp = rawInstance.maxPp !== undefined ? rawInstance.maxPp : calculateMaxPp(def.pp, ppUps);
    const pp = rawInstance.pp !== undefined ? Math.min(rawInstance.pp, maxPp) : maxPp;

    return {
      id: def.id,
      moveId: def.id,
      name: def.name,
      internalName: def.internalName,
      type: def.type,
      category: def.category,
      power: def.power,
      accuracy: def.accuracy,
      pp,
      maxPp,
      ppUps,
      description: def.description
    };
  }

  /**
   * Inflates an array of move instances or a JSON string.
   * @param {Array|string} moves
   * @returns {Array<Object>}
   */
  inflateMovesList(moves) {
    let list = [];
    if (typeof moves === 'string') {
      try {
        list = JSON.parse(moves || '[]');
      } catch (e) {
        list = [];
      }
    } else if (Array.isArray(moves)) {
      list = moves;
    }

    return list.map(m => this.inflatePokemonMove(m)).filter(Boolean);
  }
}

module.exports = new MoveRegistry();
