import DialogueBox from './DialogueBox';
import { ROOMS_CONFIG } from '../maps/roomData';
import { COLLISION_TYPES, COLLISION_META } from '../maps/collisionConfig';
import NodeGraphUI from './NodeGraphUI';
import { PRESET_TILESETS } from '../maps/tilesetsConfig';
import { NPC_SPRITES, NPC_TYPES, DEFAULT_MART_ITEMS } from '../maps/npcConfig';

export { PRESET_TILESETS };

export const KANTO_POKEMON_LIST = [
  { id: 1, name: "Bulbasaur" }, { id: 2, name: "Ivysaur" }, { id: 3, name: "Venusaur" },
  { id: 4, name: "Charmander" }, { id: 5, name: "Charmeleon" }, { id: 6, name: "Charizard" },
  { id: 7, name: "Squirtle" }, { id: 8, name: "Wartortle" }, { id: 9, name: "Blastoise" },
  { id: 10, name: "Caterpie" }, { id: 11, name: "Metapod" }, { id: 12, name: "Butterfree" },
  { id: 13, name: "Weedle" }, { id: 14, name: "Kakuna" }, { id: 15, name: "Beedrill" },
  { id: 16, name: "Pidgey" }, { id: 17, name: "Pidgeotto" }, { id: 18, name: "Pidgeot" },
  { id: 19, name: "Rattata" }, { id: 20, name: "Raticate" }, { id: 21, name: "Spearow" },
  { id: 22, name: "Fearow" }, { id: 23, name: "Ekans" }, { id: 24, name: "Arbok" },
  { id: 25, name: "Pikachu" }, { id: 26, name: "Raichu" }, { id: 27, name: "Sandshrew" },
  { id: 28, name: "Sandslash" }, { id: 29, name: "Nidoran♀" }, { id: 30, name: "Nidorina" },
  { id: 31, name: "Nidoqueen" }, { id: 32, name: "Nidoran♂" }, { id: 33, name: "Nidorino" },
  { id: 34, name: "Nidoking" }, { id: 35, name: "Clefairy" }, { id: 36, name: "Clefable" },
  { id: 37, name: "Vulpix" }, { id: 38, name: "Ninetales" }, { id: 39, name: "Jigglypuff" },
  { id: 40, name: "Wigglytuff" }, { id: 41, name: "Zubat" }, { id: 42, name: "Golbat" },
  { id: 43, name: "Oddish" }, { id: 44, name: "Gloom" }, { id: 45, name: "Vileplume" },
  { id: 46, name: "Paras" }, { id: 47, name: "Parasect" }, { id: 48, name: "Venonat" },
  { id: 49, name: "Venomoth" }, { id: 50, name: "Diglett" }, { id: 51, name: "Dugtrio" },
  { id: 52, name: "Meowth" }, { id: 53, name: "Persian" }, { id: 54, name: "Psyduck" },
  { id: 55, name: "Golduck" }, { id: 56, name: "Mankey" }, { id: 57, name: "Primeape" },
  { id: 58, name: "Growlithe" }, { id: 59, name: "Arcanine" }, { id: 60, name: "Poliwag" },
  { id: 61, name: "Poliwhirl" }, { id: 62, name: "Poliwrath" }, { id: 63, name: "Abra" },
  { id: 64, name: "Kadabra" }, { id: 65, name: "Alakazam" }, { id: 66, name: "Machop" },
  { id: 67, name: "Machoke" }, { id: 68, name: "Machamp" }, { id: 69, name: "Bellsprout" },
  { id: 70, name: "Weepinbell" }, { id: 71, name: "Victreebel" }, { id: 72, name: "Tentacool" },
  { id: 73, name: "Tentacruel" }, { id: 74, name: "Geodude" }, { id: 75, name: "Graveler" },
  { id: 76, name: "Golem" }, { id: 77, name: "Ponyta" }, { id: 78, name: "Rapidash" },
  { id: 79, name: "Slowpoke" }, { id: 80, name: "Slowbro" }, { id: 81, name: "Magnemite" },
  { id: 82, name: "Magneton" }, { id: 83, name: "Farfetch'd" }, { id: 84, name: "Doduo" },
  { id: 85, name: "Dodrio" }, { id: 86, name: "Seel" }, { id: 87, name: "Dewgong" },
  { id: 88, name: "Grimer" }, { id: 89, name: "Muk" }, { id: 90, name: "Shellder" },
  { id: 91, name: "Cloyster" }, { id: 92, name: "Gastly" }, { id: 93, name: "Haunter" },
  { id: 94, name: "Gengar" }, { id: 95, name: "Onix" }, { id: 96, name: "Drowzee" },
  { id: 97, name: "Hypno" }, { id: 98, name: "Krabby" }, { id: 99, name: "Kingler" },
  { id: 100, name: "Voltorb" }, { id: 101, name: "Electrode" }, { id: 102, name: "Exeggcute" },
  { id: 103, name: "Exeggutor" }, { id: 104, name: "Cubone" }, { id: 105, name: "Marowak" },
  { id: 106, name: "Hitmonlee" }, { id: 107, name: "Hitmonchan" }, { id: 108, name: "Lickitung" },
  { id: 109, name: "Koffing" }, { id: 110, name: "Weezing" }, { id: 111, name: "Rhyhorn" },
  { id: 112, name: "Rhydon" }, { id: 113, name: "Chansey" }, { id: 114, name: "Tangela" },
  { id: 115, name: "Kangaskhan" }, { id: 116, name: "Horsea" }, { id: 117, name: "Seadra" },
  { id: 118, name: "Goldeen" }, { id: 119, name: "Seaking" }, { id: 120, name: "Staryu" },
  { id: 121, name: "Starmie" }, { id: 122, name: "Mr. Mime" }, { id: 123, name: "Scyther" },
  { id: 124, name: "Jynx" }, { id: 125, name: "Electabuzz" }, { id: 126, name: "Magmar" },
  { id: 127, name: "Pinsir" }, { id: 128, name: "Tauros" }, { id: 129, name: "Magikarp" },
  { id: 130, name: "Gyarados" }, { id: 131, name: "Lapras" }, { id: 132, name: "Ditto" },
  { id: 133, name: "Eevee" }, { id: 134, name: "Vaporeon" }, { id: 135, name: "Jolteon" },
  { id: 136, name: "Flareon" }, { id: 137, name: "Porygon" }, { id: 138, name: "Omanyte" },
  { id: 139, name: "Omastar" }, { id: 140, name: "Kabuto" }, { id: 141, name: "Kabutops" },
  { id: 142, name: "Aerodactyl" }, { id: 143, name: "Snorlax" }, { id: 144, name: "Articuno" },
  { id: 145, name: "Zapdos" }, { id: 146, name: "Moltres" }, { id: 147, name: "Dratini" },
  { id: 148, name: "Dragonair" }, { id: 149, name: "Dragonite" }, { id: 150, name: "Mewtwo" },
  { id: 151, name: "Mew" }
];

export function isImageReady(img) {
  if (!img) return false;
  if (img instanceof HTMLCanvasElement || img.tagName === 'CANVAS') {
    return img.width > 0 && img.height > 0;
  }
  return !!(img.complete && (img.naturalWidth > 0 || img.width > 0));
}

/**
 * Normalizes any tileset image so that oversized strips (e.g. 8 cols, height > 2048)
 * are repacked into a 64-column grid (2048px width) compatible with WebGL texture limits.
 */
export function normalizeTilesetImage(img, tileW = 32, tileH = 32, targetCols = 64, margin = 0, spacing = 0) {
  // Extruded atlases (margin/spacing) must keep their layout: same formula Phaser uses
  if (margin > 0 || spacing > 0) {
    const cols = Math.max(1, Math.floor((img.width - margin * 2 + spacing) / (tileW + spacing)));
    const rows = Math.max(1, Math.floor((img.height - margin * 2 + spacing) / (tileH + spacing)));
    return {
      imageSource: img,
      columns: cols,
      tilecount: cols * rows,
      imagewidth: img.width,
      imageheight: img.height
    };
  }

  const currentCols = Math.floor(img.width / tileW) || 1;
  const currentRows = Math.floor(img.height / tileH) || 1;
  const totalTiles = currentCols * currentRows;

  // Safe WebGL boundaries: max width 2048, max height 2500
  if (img.height <= 2500 && img.width <= 2500 && (currentCols >= 16 || totalTiles <= 128)) {
    return {
      imageSource: img,
      columns: currentCols,
      tilecount: totalTiles,
      imagewidth: img.width,
      imageheight: img.height
    };
  }

  const destCols = targetCols;
  const destRows = Math.ceil(totalTiles / destCols);
  const destW = destCols * tileW;
  const destH = destRows * tileH;

  const canvas = document.createElement('canvas');
  canvas.width = destW;
  canvas.height = destH;
  const ctx = canvas.getContext('2d');

  for (let t = 0; t < totalTiles; t++) {
    const sx = (t % currentCols) * tileW;
    const sy = Math.floor(t / currentCols) * tileH;
    const dx = (t % destCols) * tileW;
    const dy = Math.floor(t / destCols) * tileH;
    ctx.drawImage(img, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
  }

  return {
    imageSource: canvas,
    columns: destCols,
    tilecount: totalTiles,
    imagewidth: destW,
    imageheight: destH
  };
}

/**
 * EditorUI – Modern HTML/CSS overlay and control system for the Phaser Map Editor.
 * Includes Map Selector, Dynamic Layer Management, Visual Portals Manager,
 * Collision Overlays, and FireRed Sign & Conversation System.
 */
export default class EditorUI {
  constructor(editorScene) {
    this.editorScene = editorScene;
    this.container = null;
    this.tilesetCanvas = null;
    this.tilesetCtx = null;
    this.dialogueBox = new DialogueBox();

    this.tilesetImage = new Image();
    this.tilesetImage.src = '/assets/tilesets/spz3zUx_scaled.png';

    this.activeGid = 1;
    this.activeTileset = null;
    this.columns = 64;
    this.tileSize = 32;
    this.totalTiles = 3881;

    // Multi-tile selection state
    this.selectedPattern = null; // { width, height, tiles: 2D array, minCol, maxCol, minRow, maxRow }
    this.isSelectingTileset = false;
    this.selectStartCol = 0;
    this.selectStartRow = 0;
    this.selectEndCol = 0;
    this.selectEndRow = 0;
    this.availableTilesetFiles = [];
    this.showPaletteGrid = true;
    this.paletteZoom = 1;

    this.allMapsList = this._getDefaultMapsList();
    this.activeSidebarTab = 'layers'; // 'layers', 'portals', 'signs'

    this.initHTML();
    this.populateMapSelect();
    this.populatePortalTargetSelect();
    this.nodeGraphUI = new NodeGraphUI(this, this.editorScene);
    this.databaseSpecies = KANTO_POKEMON_LIST;
    this.bindEvents();
    this.fetchMapsList();
    this.fetchSpeciesList();
  }

  _getDefaultMapsList() {
    const CITIES_LIST = [
      'pallet_town', 'viridian_city', 'pewter_city', 'cerulean_city',
      'vermilion_city', 'lavender_town', 'celadon_city', 'saffron_city',
      'fuchsia_city', 'cinnabar_island', 'indigo_plateau'
    ];
    const allKeys = Object.keys(ROOMS_CONFIG);
    const arenas = allKeys.filter(k => k.startsWith('arena_') || k.includes('arena'));
    if (!arenas.includes('arena_grass')) arenas.unshift('arena_grass');
    const interiors = allKeys.filter(k => !arenas.includes(k) && (k.includes('_house') || k.includes('_lab') || k.includes('_interior') || k.includes('_mart') || k.includes('_center')));
    const cities = allKeys.filter(k => !arenas.includes(k) && !interiors.includes(k) && (CITIES_LIST.includes(k) || k.endsWith('_city') || k.endsWith('_town')));
    const routes = allKeys.filter(k => !arenas.includes(k) && !interiors.includes(k) && k.startsWith('route_')).sort((a, b) => {
      const na = parseInt(a.replace('route_', ''), 10) || 0;
      const nb = parseInt(b.replace('route_', ''), 10) || 0;
      return na - nb;
    });
    const root = allKeys.filter(k => !cities.includes(k) && !routes.includes(k) && !arenas.includes(k) && !interiors.includes(k));
    if (!root.includes('kanto')) root.unshift('kanto');
    return { cities, routes, interiors, arenas, root };
  }

  initHTML() {
    let editorEl = document.getElementById('editor-screen');
    if (!editorEl) {
      editorEl = document.createElement('div');
      editorEl.id = 'editor-screen';
      editorEl.className = 'editor-screen hidden';
      document.body.appendChild(editorEl);
    }

    editorEl.innerHTML = `
      <!-- Top Bar -->
      <div class="editor-top-bar">
        <div class="editor-brand">
          <div class="editor-logo-group">
            <svg class="editor-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <div class="brand-text-wrapper">
              <span class="editor-logo-text">POKéMMO</span>
              <span class="editor-sublogo">MAP STUDIO</span>
            </div>
          </div>

          <!-- Map Selector Dropdown -->
          <div class="editor-map-select-group">
            <select id="editor-map-select" class="editor-map-select">
              <option value="kanto">Kanto</option>
            </select>
            <span id="editor-map-badge" class="editor-badge">kanto (408x400)</span>
          </div>
        </div>

        <div class="editor-status-bar">
          <span id="editor-layer-indicator" class="editor-status-item highlight">Camada: Ground</span>
          <span id="editor-tool-indicator" class="editor-status-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            <span>Pincel (B)</span>
          </span>
          <span id="editor-coords" class="editor-status-item">Tile: [0, 0] | Px: [0, 0]</span>
          <span id="editor-gid-indicator" class="editor-status-item">GID: 1</span>
          <span id="editor-zoom-indicator" class="editor-status-item zoom-badge" title="Nível de Zoom da Câmera">150%</span>
        </div>

        <div class="editor-actions">
          <button id="btn-center-map" class="editor-btn" title="Centralizar Mapa na Tela (Home)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line></svg>
            <span>CENTRALIZAR</span>
          </button>

          <button id="btn-toggle-grid" class="editor-btn active" title="Alternar Grade (G)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            <span>GRADE</span>
          </button>

          <button id="btn-toggle-collision" class="editor-btn active" title="Alternar Overlay de Colisões (C)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>COLISÕES</span>
          </button>

          <button id="btn-editor-save" class="editor-btn gold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>SALVAR</span>
          </button>

          <button id="btn-editor-reload" class="editor-btn secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            <span>RECARREGAR</span>
          </button>

          <button id="btn-editor-exit" class="editor-btn danger">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>SAIR</span>
          </button>
        </div>
      </div>

      <!-- Interactive Portal Picker Banner -->
      <div id="portal-picker-bar" class="portal-picker-bar hidden">
        <div class="portal-picker-info">
          <span id="portal-picker-mode-badge" class="portal-picker-badge">🎯 MARCAR SPAWN DE DESTINO</span>
          <span id="portal-picker-instructions">Clique no mapa para definir as coordenadas do jogador (use Espaço/Arrastar para Pan).</span>
        </div>
        <button id="btn-portal-picker-cancel" class="editor-btn small danger">Cancelar</button>
      </div>

      <!-- Left Tool Bar (Floating Dock) -->
      <div class="editor-toolbar">
        <button id="tool-hand" class="editor-tool-btn" data-tooltip="Mover / Pan (H ou Espaço + Arraste)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="5 9 2 12 5 15"></polyline>
            <polyline points="9 5 12 2 15 5"></polyline>
            <polyline points="19 9 22 12 19 15"></polyline>
            <polyline points="9 19 12 22 15 19"></polyline>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
        </button>

        <button id="tool-pencil" class="editor-tool-btn active" data-tooltip="Pincel (B)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>

        <button id="tool-eraser" class="editor-tool-btn" data-tooltip="Borracha (E)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L16 17"></path>
            <line x1="18" y1="12" x2="11" y2="19"></line>
          </svg>
        </button>

        <button id="tool-bucket" class="editor-tool-btn" data-tooltip="Preenchimento (F)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"></path>
            <path d="m5 2 5 5"></path>
            <path d="M2 13h15"></path>
            <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"></path>
          </svg>
        </button>

        <button id="tool-picker" class="editor-tool-btn" data-tooltip="Conta-gotas da Camada (I ou Alt+Clique)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m14 2 6 6"></path>
            <path d="m4 20 5-1 9-9-4-4-9 9-1 5Z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
        </button>

        <button id="tool-sign" class="editor-tool-btn" data-tooltip="Marcar Placa FireRed no Mapa (1 grid)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6h14v8H5z"></path><path d="M12 14v7"></path></svg>
        </button>

        <button id="tool-link" class="editor-tool-btn" data-tooltip="Marcar Teleporte no Mapa (Grids)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M14 12v.01"></path><path d="M20 20H4"></path></svg>
        </button>

        <button id="tool-object" class="editor-tool-btn" data-tooltip="Inspetor de Objetos (O)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </button>

        <button id="tool-zone" class="editor-tool-btn" data-tooltip="Desenhar Zona / Região de Cidade ou Rota (Z)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"></rect>
            <path d="M3 9h18"></path>
          </svg>
        </button>

        <button id="tool-spawn" class="editor-tool-btn" data-tooltip="Desenhar Área de Spawn de Pokémon (P)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M3 12h18"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>

        <button id="tool-npc" class="editor-tool-btn" data-tooltip="Posicionar / Editar NPC (N)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <div class="tool-divider"></div>

        <button id="tool-zoomin" class="editor-tool-btn" data-tooltip="Aproximar Zoom (+)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        <button id="tool-zoomout" class="editor-tool-btn" data-tooltip="Afastar Zoom (-)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        <button id="tool-zoomreset" class="editor-tool-btn" data-tooltip="Zoom 100% (1:1 / Tecla 0)">
          <span style="font-size: 11px; font-weight: 800; letter-spacing:-0.5px;">1:1</span>
        </button>

        <button id="tool-centermap" class="editor-tool-btn" data-tooltip="Centralizar Mapa (Home)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line></svg>
        </button>

        <button id="tool-grid" class="editor-tool-btn active" data-tooltip="Grade (G)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </button>
      </div>

      <!-- Floating Bottom Navigation Helper -->
      <div class="editor-nav-hints">
        <span class="hint-item"><kbd>Espaço</kbd> ou <kbd>Botão Direito</kbd> Arrastar</span>
        <span class="hint-dot">•</span>
        <span class="hint-item"><kbd>Scroll</kbd> Zoom</span>
        <span class="hint-dot">•</span>
        <span class="hint-item"><kbd>Alt + Clique</kbd> Copiar Tile</span>
        <span class="hint-dot">•</span>
        <span class="hint-item"><kbd>E</kbd> Borracha</span>
        <span class="hint-dot">•</span>
        <span class="hint-item"><kbd>Home</kbd> Centralizar</span>
      </div>

      <!-- Right Sidebar with Tabs -->
      <div class="editor-sidebar">
        <!-- Tab Navigation -->
        <div class="sidebar-tabs">
          <button id="tab-btn-layers" class="sidebar-tab-btn active" style="display:inline-flex; align-items:center; justify-content:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <span>Camadas</span>
          </button>
          <button id="tab-btn-portals" class="sidebar-tab-btn" style="display:inline-flex; align-items:center; justify-content:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M14 12v.01"></path></svg>
            <span>Portais</span>
          </button>
          <button id="tab-btn-signs" class="sidebar-tab-btn" style="display:inline-flex; align-items:center; justify-content:center; gap:5px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 6h14v8H5z"></path><path d="M12 14v7"></path></svg>
            <span>Placas</span>
          </button>
          <button id="tab-btn-zones" class="sidebar-tab-btn" style="display:inline-flex; align-items:center; justify-content:center; gap:4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"></rect><path d="M3 9h18"></path></svg>
            <span>Zonas</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:1px; opacity:0.8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button id="tab-btn-npcs" class="sidebar-tab-btn" style="display:inline-flex; align-items:center; justify-content:center; gap:4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>NPCs</span>
          </button>
        </div>

        <!-- TAB 1: Layers & Tileset Palette -->
        <div id="tab-content-layers" class="tab-content">
          <div class="sidebar-section">
            <div class="section-header">
              <div class="section-title-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <h3>CAMADAS DO MAPA ATIVO</h3>
              </div>
              <div style="display:flex; gap:4px; align-items:center;">
                <button id="btn-move-layer-up" class="editor-btn small" style="height: 24px; padding: 2px 7px; font-size: 11px;" title="Subir camada ativa (renderizar por cima)">▲</button>
                <button id="btn-move-layer-down" class="editor-btn small" style="height: 24px; padding: 2px 7px; font-size: 11px;" title="Descer camada ativa (renderizar por baixo)">▼</button>
                <button id="btn-clear-layer" class="editor-btn small danger" style="height: 24px; padding: 2px 7px; font-size: 10px; display:inline-flex; align-items:center; gap:3px;" title="Limpar todos os tiles da camada selecionada">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  <span>Limpar</span>
                </button>
              </div>
            </div>
            <div id="editor-layers-list" class="layer-list" style="max-height: 180px; overflow-y: auto;">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- COLLISION TYPES PALETTE (Shown when layer Collision is active) -->
          <div id="editor-collision-palette" class="sidebar-section hidden">
            <div class="section-header">
              <div class="section-title-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <h3>TIPO DE COLISÃO</h3>
              </div>
              <span id="selected-collision-badge" class="badge-gid" style="background:#ff1744; color:#fff;">Sólido</span>
            </div>
            <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 8px;">
              Selecione o tipo de colisão para pintar no mapa:
            </p>
            <div class="collision-types-list">
              <button class="collision-type-btn active" data-type="1" title="Bloqueio total - impede passagem de todos os lados">
                <span class="col-icon" style="color: #ff1744;">■</span>
                <div class="col-details">
                  <strong>Sólido</strong>
                  <small>Bloqueio total de passagem</small>
                </div>
              </button>
              <button class="collision-type-btn" data-type="2" title="Barranco - pode pular/descer para baixo, bloqueia subida">
                <span class="col-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                </span>
                <div class="col-details">
                  <strong>Barranco (Descer)</strong>
                  <small>Pula para baixo, bloqueia subida</small>
                </div>
              </button>
              <button class="collision-type-btn" data-type="3" title="Barranco - pode pular para esquerda, bloqueia retorno">
                <span class="col-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </span>
                <div class="col-details">
                  <strong>Barranco (Esquerda)</strong>
                  <small>Pula para esq., bloqueia retorno</small>
                </div>
              </button>
              <button class="collision-type-btn" data-type="4" title="Barranco - pode pular para direita, bloqueia retorno">
                <span class="col-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
                <div class="col-details">
                  <strong>Barranco (Direita)</strong>
                  <small>Pula para dir., bloqueia retorno</small>
                </div>
              </button>
              <button class="collision-type-btn" data-type="5" title="Barranco - pode pular para cima, bloqueia descida">
                <span class="col-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                </span>
                <div class="col-details">
                  <strong>Barranco (Subir)</strong>
                  <small>Pula para cima, bloqueia descida</small>
                </div>
              </button>
              <button class="collision-type-btn" data-type="6" title="Apagar/remover colisão existente (Montanha, Árvores, Construções, etc.)">
                <span class="col-icon" style="color: #00e676;">■</span>
                <div class="col-details">
                  <strong>Livre / Passável</strong>
                  <small>Apaga colisão própria do tileset</small>
                </div>
              </button>
            </div>
          </div>

          <div class="sidebar-section tileset-section">
            <div class="section-header">
              <div class="section-title-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <h3>PALETA DE TILES</h3>
              </div>
              <span id="selected-tile-preview-badge" class="badge-gid">GID: 1</span>
            </div>

            <div class="tileset-picker-toolbar">
              <select id="editor-tileset-select" class="small-select"></select>
              <div class="tileset-picker-toolbar-buttons">
                <button id="btn-add-outside4" class="editor-btn blue" title="Usar Tileset Outside 4 (Inverno)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/></svg>
                  <span>Outside 4</span>
                </button>
                <button id="btn-add-tileset-png" class="editor-btn gold" title="Importar tileset PNG">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>Add PNG</span>
                </button>
              </div>
              <input type="file" id="input-tileset-png-file" accept="image/png" style="display:none;" />
            </div>

            <div class="tile-preview-container">
              <canvas id="active-tile-preview" width="48" height="48" style="width:48px; height:48px;"></canvas>
              <div class="tile-info">
                <div>GID Selecionado: <strong id="info-gid">1</strong></div>
                <div>Posição: <span id="info-gid-coords">Coluna 0, Linha 0</span></div>
              </div>
            </div>

            <!-- Visual Tile Matcher: Correspondências no Outside -->
            <div id="tile-similarity-container" class="tile-similarity-container">
              <div class="similarity-header">
                <span>✨ Correspondências no Outside</span>
                <button id="btn-find-similar-tiles" class="editor-btn xsmall gold" title="Buscar correspondências visuais nos tilesets Outside">🔍 Buscar</button>
              </div>
              <div id="similar-tiles-list" class="similar-tiles-list">
                <small class="similarity-placeholder">Use o conta-gotas no mapa para ver tiles correspondentes no Outside</small>
              </div>
            </div>

            <div class="tileset-palette-controls" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; font-size:11px;">
              <div style="display:flex; gap:4px; align-items:center;">
                <button id="btn-palette-zoom-out" class="editor-btn small" title="Reduzir zoom da paleta" style="padding:2px 7px; height:24px;">-</button>
                <button id="btn-palette-zoom-100" class="editor-btn small active" title="Tamanho original 100%" style="padding:2px 7px; height:24px;">100%</button>
                <button id="btn-palette-zoom-in" class="editor-btn small" title="Aumentar zoom da paleta" style="padding:2px 7px; height:24px;">+</button>
                <button id="btn-palette-fit-width" class="editor-btn small" title="Ajustar à largura do painel" style="padding:2px 7px; height:24px;">Ajustar</button>
              </div>
              <button id="btn-palette-grid-toggle" class="editor-btn small active" title="Alternar grade visual nos tiles" style="padding:2px 7px; height:24px; display:inline-flex; align-items:center; gap:4px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
                <span>Grade</span>
              </button>
            </div>

            <!-- Tileset Canvas Container -->
            <div class="tileset-canvas-wrapper">
              <canvas id="tileset-palette-canvas"></canvas>
            </div>
          </div>
        </div>

        <!-- TAB 2: Portals & Map Connections -->
        <div id="tab-content-portals" class="tab-content hidden">
          <div class="sidebar-section">
            <div class="section-header">
              <div class="section-title-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M14 12v.01"></path></svg>
                <h3>PORTAIS & CONEXÕES</h3>
              </div>
              <button id="btn-add-new-portal" class="editor-btn small gold" style="height: 28px; padding: 2px 8px; font-size: 11px; display:inline-flex; align-items:center; gap:4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Novo Portal</span>
              </button>
            </div>
            <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 8px;">Conectam esta sala às outras cidades e rotas de Kanto.</p>

            <div id="editor-portals-list" class="zones-scroll-list">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- TAB 3: Signs & Conversations -->
        <div id="tab-content-signs" class="tab-content hidden">
          <div class="sidebar-section">
            <div class="section-header">
              <div class="section-title-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 6h14v8H5z"></path><path d="M12 14v7"></path></svg>
                <h3>PLACAS & CONVERSAS</h3>
              </div>
              <button id="btn-add-new-sign" class="editor-btn small gold" style="height: 28px; padding: 2px 8px; font-size: 11px; display:inline-flex; align-items:center; gap:4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Nova Placa</span>
              </button>
            </div>
            <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 8px;">Placas e objetos interativos com diálogo estilo FireRed.</p>

            <div id="editor-signs-list" class="zones-scroll-list">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- TAB 4: Zonas Manager (Cidades, Rotas & Spawns) -->
        <div id="tab-content-zones" class="tab-content hidden">
          <!-- Category Dropdown Selector -->
          <div class="sidebar-section" style="padding: 10px 12px; background: rgba(15, 23, 42, 0.7); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3); margin-bottom: 8px; flex-shrink: 0;">
            <label style="font-size: 10px; font-weight: 800; color: var(--fr-gold); text-transform: uppercase; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; letter-spacing: 0.5px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon></svg>
              <span>MODO DE ZONA</span>
            </label>
            <select id="editor-zones-subtab-select" class="form-input" style="font-weight: 700; background: #1e293b; border: 1px solid #3b82f6; color: #fff; padding: 7px 10px; font-size: 12px; cursor: pointer; border-radius: 6px; width: 100%;">
              <option value="cities">Cidades & Rotas (Bounding Boxes)</option>
              <option value="spawns">Spawns de Pokémon (Áreas Pokéstop)</option>
              <option value="arena">⚔️ Spawns de Batalha (Player & Rival)</option>
            </select>
          </div>

          <!-- SUB-VIEW 1: Cities & Routes Bounding Boxes -->
          <div id="zones-subview-cities" class="zones-subview">
            <div class="sidebar-section">
              <div class="section-header">
                <div class="section-title-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"></rect><path d="M3 9h18"></path></svg>
                  <h3>ZONAS & CIDADES</h3>
                </div>
                <button id="btn-add-new-zone" class="editor-btn small gold" style="height: 28px; padding: 2px 8px; font-size: 11px; display:inline-flex; align-items:center; gap:4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>Nova Zona</span>
                </button>
              </div>
              <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 8px;">Delimitadores de cidade e rota com status de desenvolvimento e notas.</p>

              <div id="editor-zones-list" class="zones-scroll-list">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>

          <!-- SUB-VIEW 2: Pokemon Spawns Manager -->
          <div id="zones-subview-spawns" class="zones-subview hidden">
            <div class="sidebar-section">
              <div class="section-header">
                <div class="section-title-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <h3>SPAWNS POKÉMON (POKESTOP.IO)</h3>
                </div>
                <button id="btn-add-new-spawn" class="editor-btn small gold" style="height: 28px; padding: 2px 8px; font-size: 11px; display:inline-flex; align-items:center; gap:4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>Nova Área</span>
                </button>
              </div>
              <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 8px;">Áreas de encontro com espécies, chances, IVs, shiny e climas estilo Pokéstop.</p>

              <div id="editor-spawns-list" class="zones-scroll-list">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>

          <!-- SUB-VIEW 3: Arena Battle Spawns Manager -->
          <div id="zones-subview-arena" class="zones-subview hidden">
            <div class="sidebar-section">
              <div class="section-header">
                <div class="section-title-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <h3>SPAWNS DA ARENA DE BATALHA</h3>
                </div>
              </div>
              <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 10px;">Defina os pontos de spawn do jogador local e do oponente/rival para esta arena.</p>

              <!-- PLAYER SPAWN CARD -->
              <div class="arena-spawn-card player-card" style="background: rgba(14, 30, 54, 0.9); border: 1.5px solid #00d4ff; border-radius: 8px; padding: 10px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                  <span style="font-weight: 800; font-size: 11px; color: #00d4ff; display:flex; align-items:center; gap:5px;">
                    <span>🔵</span> PLAYER (LOCAL)
                  </span>
                  <span id="arena-player-tile-badge" class="editor-badge" style="background: rgba(0, 212, 255, 0.2); color: #00d4ff; border: 1px solid #00d4ff;">Tile [11, 9]</span>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                  <div>
                    <label style="font-size: 10px; color: #94a3b8; display:block; margin-bottom: 2px;">Posição X (px)</label>
                    <input type="number" id="arena-player-x" class="form-input" style="height: 28px; font-size: 12px; width: 100%;" value="352" step="32" />
                  </div>
                  <div>
                    <label style="font-size: 10px; color: #94a3b8; display:block; margin-bottom: 2px;">Posição Y (px)</label>
                    <input type="number" id="arena-player-y" class="form-input" style="height: 28px; font-size: 12px; width: 100%;" value="288" step="32" />
                  </div>
                </div>

                <div style="margin-bottom: 10px;">
                  <label style="font-size: 10px; color: #94a3b8; display:block; margin-bottom: 2px;">Direção Inicial</label>
                  <select id="arena-player-facing" class="form-input" style="height: 28px; font-size: 11px; width: 100%;">
                    <option value="right">Direita ▶ (Padrão)</option>
                    <option value="left">Esquerda ◀</option>
                    <option value="up">Cima ▲</option>
                    <option value="down">Baixo ▼</option>
                  </select>
                </div>

                <div style="display:flex; gap: 6px;">
                  <button id="btn-pick-player-spawn" class="editor-btn small" style="flex:1; height: 28px; font-size: 11px; background: rgba(0, 212, 255, 0.15); border-color: #00d4ff; color: #00d4ff;">
                    🎯 Marcar no Clique
                  </button>
                  <button id="btn-focus-player-spawn" class="editor-btn small secondary" style="height: 28px; font-size: 11px;" title="Centralizar Câmera no Player">
                    🔍 Focar
                  </button>
                </div>
              </div>

              <!-- RIVAL / OPPONENT SPAWN CARD -->
              <div class="arena-spawn-card rival-card" style="background: rgba(45, 18, 24, 0.9); border: 1.5px solid #f43f5e; border-radius: 8px; padding: 10px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                  <label style="font-weight: 800; font-size: 11px; color: #f43f5e; display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="checkbox" id="arena-rival-enabled" checked style="accent-color:#f43f5e; cursor:pointer;" />
                    <span>🔴</span> RIVAL / OPONENTE
                  </label>
                  <span id="arena-rival-tile-badge" class="editor-badge" style="background: rgba(244, 63, 94, 0.2); color: #f43f5e; border: 1px solid #f43f5e;">Tile [21, 9]</span>
                </div>

                <div id="arena-rival-fields">
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                    <div>
                      <label style="font-size: 10px; color: #94a3b8; display:block; margin-bottom: 2px;">Posição X (px)</label>
                      <input type="number" id="arena-rival-x" class="form-input" style="height: 28px; font-size: 12px; width: 100%;" value="672" step="32" />
                    </div>
                    <div>
                      <label style="font-size: 10px; color: #94a3b8; display:block; margin-bottom: 2px;">Posição Y (px)</label>
                      <input type="number" id="arena-rival-y" class="form-input" style="height: 28px; font-size: 12px; width: 100%;" value="288" step="32" />
                    </div>
                  </div>

                  <div style="margin-bottom: 10px;">
                    <label style="font-size: 10px; color: #94a3b8; display:block; margin-bottom: 2px;">Direção Inicial</label>
                    <select id="arena-rival-facing" class="form-input" style="height: 28px; font-size: 11px; width: 100%;">
                      <option value="left">Esquerda ◀ (Padrão)</option>
                      <option value="right">Direita ▶</option>
                      <option value="up">Cima ▲</option>
                      <option value="down">Baixo ▼</option>
                    </select>
                  </div>

                  <div style="display:flex; gap: 6px;">
                    <button id="btn-pick-rival-spawn" class="editor-btn small" style="flex:1; height: 28px; font-size: 11px; background: rgba(244, 63, 94, 0.15); border-color: #f43f5e; color: #f43f5e;">
                      🎯 Marcar no Clique
                    </button>
                    <button id="btn-focus-rival-spawn" class="editor-btn small secondary" style="height: 28px; font-size: 11px;" title="Centralizar Câmera no Rival">
                      🔍 Focar
                    </button>
                  </div>
                </div>
              </div>

              <div style="background: rgba(15, 23, 42, 0.6); border: 1px dashed rgba(255,255,255,0.15); border-radius: 6px; padding: 8px; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                💡 <b>Dica:</b> Você também pode <b>clicar e arrastar</b> os avatares do Player e do Rival diretamente no mapa com a ferramenta de Mão/Seleção! Depois clique em <b>SALVAR</b> no topo.
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: NPCs Manager -->
        <div id="tab-content-npcs" class="tab-content hidden">
          <div class="sidebar-section">
            <div class="section-header">
              <div class="section-title-group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <h3>NPCS DO MAPA ATIVO</h3>
              </div>
              <button id="btn-add-new-npc" class="editor-btn small gold" style="height: 28px; padding: 2px 8px; font-size: 11px; display:inline-flex; align-items:center; gap:4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Novo NPC</span>
              </button>
            </div>
            <p style="font-size: 11px; color: var(--fr-text-muted); margin-bottom: 8px;">NPCs de conversa, batalha, Poké Mart e Prof. Carvalho.</p>

            <div id="editor-npcs-list" class="zones-scroll-list">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      </div>

      <!-- Portal Inspector / Edit Modal -->
      <div id="editor-portal-modal" class="editor-modal hidden" style="max-width: 440px;">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.2"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M14 12v.01"></path><circle cx="6" cy="12" r="3"></circle><line x1="9" y1="12" x2="15" y2="12"></line></svg>
            <h4>CONEXÃO DE PORTAIS (BIDIRECIONAL)</h4>
          </div>
          <button id="btn-close-portal-modal" class="close-btn">✕</button>
        </div>
        <div class="modal-body" style="gap: 12px;">
          <div class="form-group">
            <label>Nome / Rótulo da Conexão</label>
            <input type="text" id="portal-prop-label" class="form-input" placeholder="Ex: Entrada Laboratório do Carvalho" />
          </div>

          <!-- LADO A: ORIGEM -->
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 700; color: #c084fc; display:flex; align-items:center; gap:4px;">
                <span>📍 PARTE A (MAPA DE ORIGEM)</span>
              </span>
              <span id="portal-origin-map-badge" class="badge" style="background: rgba(168, 85, 247, 0.25); color: #e9d5ff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px;">kanto</span>
            </div>

            <div class="form-row" style="gap: 6px; align-items: flex-end;">
              <div class="form-group" style="flex:1;">
                <label style="font-size: 10px;">Gatilho X</label>
                <input type="number" id="portal-prop-x" class="form-input" style="height: 28px; font-size: 11px;" />
              </div>
              <div class="form-group" style="flex:1;">
                <label style="font-size: 10px;">Gatilho Y</label>
                <input type="number" id="portal-prop-y" class="form-input" style="height: 28px; font-size: 11px;" />
              </div>
              <div class="form-group" style="flex:1;">
                <label style="font-size: 10px;">Largura (W)</label>
                <input type="number" id="portal-prop-w" class="form-input" style="height: 28px; font-size: 11px;" />
              </div>
              <div class="form-group" style="flex:1;">
                <label style="font-size: 10px;">Altura (H)</label>
                <input type="number" id="portal-prop-h" class="form-input" style="height: 28px; font-size: 11px;" />
              </div>
              <button id="btn-portal-pick-origin" class="editor-btn small secondary" style="height: 28px; padding: 0 8px; white-space:nowrap;" title="Redesenhar a área da origem neste mapa">
                ✏️
              </button>
            </div>
          </div>

          <!-- LADO B: DESTINO -->
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 700; color: #34d399; display:flex; align-items:center; gap:4px;">
                <span>🎯 PARTE B (MAPA DE DESTINO)</span>
              </span>
            </div>

            <div class="form-group" style="margin-bottom: 8px;">
              <label style="font-size: 10px;">Selecione o Mapa de Destino</label>
              <select id="portal-prop-target-room" class="form-input editor-map-select" style="height: 32px; font-size: 12px;"></select>
            </div>

            <!-- Botão de Ação Primário: Desenhar Destino no Mapa -->
            <button id="btn-portal-draw-target" class="editor-btn primary" style="width: 100%; height: 38px; display:flex; align-items:center; justify-content:center; gap: 6px; font-weight: 600; background: linear-gradient(135deg, #059669, #10b981); border:none; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); cursor: pointer;" title="Carrega o mapa de destino para você desenhar onde o jogador deve chegar e voltar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
              <span>Desenhar Destino no Mapa ➔</span>
            </button>

            <!-- Coordenadas informativas de Destino -->
            <div class="form-row" style="gap: 6px; margin-top: 8px;">
              <div class="form-group" style="flex:1;">
                <label style="font-size: 10px;">Spawn Chegada X</label>
                <input type="number" id="portal-prop-target-x" class="form-input" style="height: 28px; font-size: 11px;" />
              </div>
              <div class="form-group" style="flex:1;">
                <label style="font-size: 10px;">Spawn Chegada Y</label>
                <input type="number" id="portal-prop-target-y" class="form-input" style="height: 28px; font-size: 11px;" />
              </div>
            </div>
          </div>

          <div class="modal-actions" style="margin-top: 4px;">
            <button id="btn-portal-jump" class="editor-btn small secondary" title="Abrir o mapa de destino no editor" style="display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              <span>Ir ao Mapa</span>
            </button>
            <button id="btn-save-portal" class="editor-btn small primary">Salvar Conexão</button>
            <button id="btn-delete-portal" class="editor-btn small danger">Excluir Conexão</button>
          </div>
        </div>
      </div>

      <!-- Sign / Conversation Inspector Modal -->
      <div id="editor-sign-modal" class="editor-modal hidden">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 6h14v8H5z"></path><path d="M12 14v7"></path></svg>
            <h4>CONVERSA / DIÁLOGO DA PLACA</h4>
          </div>
          <button id="btn-close-sign-modal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Título / Local (ex: PALLET TOWN)</label>
            <input type="text" id="sign-prop-title" class="form-input" placeholder="Ex: PALLET TOWN" />
          </div>
          <div class="form-group">
            <label>Mensagem da Placa / Conversa</label>
            <textarea id="sign-prop-text" class="form-input text-area" rows="4" placeholder="Ex: Shades of your journey await!"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Posição X (px)</label>
              <input type="number" id="sign-prop-x" class="form-input" />
            </div>
            <div class="form-group">
              <label>Posição Y (px)</label>
              <input type="number" id="sign-prop-y" class="form-input" />
            </div>
          </div>
          <div class="modal-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="btn-test-dialogue" class="editor-btn gold" style="flex: 1 1 100%; display:inline-flex; align-items:center; justify-content:center; gap:5px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>TESTAR DIÁLOGO (FIRERED PREVIEW)</span>
            </button>
            <button id="btn-save-sign" class="editor-btn small primary" style="flex: 1;">Salvar Placa</button>
            <button id="btn-delete-sign" class="editor-btn small danger" style="flex: 1;">Excluir</button>
          </div>
        </div>
      </div>

      <!-- Generic Object Modal -->
      <div id="editor-object-modal" class="editor-modal hidden">
        <div class="modal-header">
          <div class="modal-title">
            <h4>INSPETOR DE OBJETO</h4>
          </div>
          <button id="btn-close-obj-modal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Camada Origem</label>
            <input type="text" id="obj-prop-layer" readonly class="form-input readonly-input" />
          </div>
          <div class="form-group">
            <label>Nome do Objeto</label>
            <input type="text" id="obj-prop-name" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>X (px)</label>
              <input type="number" id="obj-prop-x" class="form-input" />
            </div>
            <div class="form-group">
              <label>Y (px)</label>
              <input type="number" id="obj-prop-y" class="form-input" />
            </div>
          </div>
          <div class="modal-actions">
            <button id="btn-save-object" class="editor-btn small primary">Salvar Objeto</button>
            <button id="btn-delete-object" class="editor-btn small danger">Excluir Objeto</button>
          </div>
        </div>
      </div>

      <!-- Zone / City Box Inspector Modal -->
      <div id="editor-zone-modal" class="editor-modal hidden" style="width: 540px; max-width: 95vw;">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"></rect><path d="M3 9h18"></path></svg>
            <h4>CONFIGURAR REGIONAL / ZONA DO MAPA</h4>
          </div>
          <button id="btn-close-zone-modal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label>Nome da Zona / Cidade</label>
              <input type="text" id="zone-prop-name" class="form-input" placeholder="Ex: Pallet Town, Route 1" />
            </div>
            <div class="form-group" style="flex:1;">
              <label>Tipo</label>
              <select id="zone-prop-type" class="form-input">
                <option value="city">Cidade</option>
                <option value="route">Rota</option>
                <option value="cave">Caverna</option>
                <option value="building">Edifício</option>
                <option value="other">Outro</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" style="flex:2;">
              <label>Status</label>
              <select id="zone-prop-status" class="form-input" style="font-weight: 600;">
                <option value="completed" style="color:#00e676;">Concluído</option>
                <option value="pending" selected style="color:#ffb300;">Pendente</option>
              </select>
            </div>
            <div class="form-group" style="flex:1;">
              <label>Cor da Linha</label>
              <input type="color" id="zone-prop-color" class="form-input" value="#00e5ff" style="height:34px; padding:2px; cursor:pointer;" />
            </div>
          </div>

          <div class="form-group">
            <label>Mensagem Informativa da Equipe (Note Badge)</label>
            <textarea id="zone-prop-note" class="form-input text-area" rows="3" placeholder="Ex: Área com NPCs e eventos validados."></textarea>
          </div>

          <div class="form-row" style="align-items: flex-end; gap: 6px;">
            <div class="form-group" style="flex:1;">
              <label>X (px)</label>
              <input type="number" id="zone-prop-x" class="form-input" />
            </div>
            <div class="form-group" style="flex:1;">
              <label>Y (px)</label>
              <input type="number" id="zone-prop-y" class="form-input" />
            </div>
            <div class="form-group" style="flex:1;">
              <label>Largura (W)</label>
              <input type="number" id="zone-prop-w" class="form-input" />
            </div>
            <div class="form-group" style="flex:1;">
              <label>Altura (H)</label>
              <input type="number" id="zone-prop-h" class="form-input" />
            </div>
            <button id="btn-zone-pick-origin" class="editor-btn small gold" style="height: 34px; padding: 0 10px; display:inline-flex; align-items:center; gap:4px; font-weight:600;" title="Redesenhar o retângulo da zona clicando e arrastando no mapa">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"></rect><path d="M9 3v18"></path></svg>
              <span>Redesenhar</span>
            </button>
          </div>

          <div class="modal-actions" style="margin-top: 14px;">
            <button id="btn-save-zone" class="editor-btn small primary" style="flex: 2;">Salvar Zona</button>
            <button id="btn-delete-zone" class="editor-btn small danger" style="flex: 1;">Excluir</button>
          </div>
        </div>
      </div>

      <!-- Pokemon Spawn Area Inspector Modal (Pokestop.io Style - Tabbed & Database Search) -->
      <div id="editor-spawn-modal" class="editor-modal hidden" style="width: 1020px; max-width: 96vw; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <h4>CONFIGURAÇÃO DE SPAWNS POKÉMON (PERSISTENTE NO BANCO DE DADOS)</h4>
          </div>
          <button id="btn-close-spawn-modal" class="close-btn">✕</button>
        </div>

        <!-- TABS NAV -->
        <div class="spawn-modal-tabs">
          <button type="button" id="tab-btn-spawn-map" class="spawn-nav-tab-btn active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            <span>1. Configuração da Área & Mapa</span>
          </button>
          <button type="button" id="tab-btn-spawn-pokemon" class="spawn-nav-tab-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>2. Pokémons Spawnados & Probabilidades</span>
            <span id="spawn-tab-count-badge" class="spawn-badge-count">1</span>
          </button>
        </div>

        <div class="modal-body" style="overflow-y: auto; flex: 1; padding: 2px;">
          <!-- TAB 1: ÁREA & MAPA -->
          <div id="tab-pane-spawn-map" class="spawn-tab-pane">
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin-bottom: 14px;">
              <h5 style="margin: 0 0 12px 0; font-size: 12px; color: var(--fr-gold); display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>DADOS GERAIS DA ÁREA DE ENCONTRO</span>
              </h5>
              <div class="form-row">
                <div class="form-group" style="flex: 2;">
                  <label>Nome da Área de Spawn</label>
                  <input type="text" id="spawn-prop-name" class="form-input" placeholder="Ex: Rota 1 - Grama Alta Principal" />
                </div>
                <div class="form-group" style="flex: 1.2;">
                  <label>Método de Encontro</label>
                  <select id="spawn-prop-type" class="form-input">
                    <option value="grass">Grama Alta (Walking)</option>
                    <option value="water">Água (Surf)</option>
                    <option value="fishing">Pesca (Rod)</option>
                    <option value="cave">Caverna / Rocha</option>
                  </select>
                </div>
                <div class="form-group" style="flex: 1.2;">
                  <label>Arena de Batalha (Cenário)</label>
                  <select id="spawn-prop-arena" class="form-input">
                    <!-- Dinamicamente preenchido com as arenas existentes do projeto -->
                  </select>
                </div>
                <div class="form-group" style="flex: 1;">
                  <label>Taxa Base % (Chance / Passo)</label>
                  <div class="custom-stepper-wrap" style="width: 100%;">
                    <input type="number" id="spawn-prop-rate" class="form-input" min="1" max="100" value="10" />
                    <div class="custom-stepper-controls">
                      <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
                      </button>
                      <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h5 style="margin: 0; font-size: 12px; color: var(--fr-gold); display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                  <span>DELIMITAÇÃO GEOMÉTRICA (COORDENADAS NO MAPA)</span>
                </h5>
                <span id="spawn-tile-summary" style="font-size: 11px; color: #94a3b8; font-weight: 600;"></span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Posição X (px)</label>
                  <div class="custom-stepper-wrap" style="width: 100%;">
                    <input type="number" id="spawn-prop-x" class="form-input" />
                    <div class="custom-stepper-controls">
                      <button type="button" class="stepper-btn btn-step-up" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                      <button type="button" class="stepper-btn btn-step-down" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Posição Y (px)</label>
                  <div class="custom-stepper-wrap" style="width: 100%;">
                    <input type="number" id="spawn-prop-y" class="form-input" />
                    <div class="custom-stepper-controls">
                      <button type="button" class="stepper-btn btn-step-up" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                      <button type="button" class="stepper-btn btn-step-down" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Largura W (px)</label>
                  <div class="custom-stepper-wrap" style="width: 100%;">
                    <input type="number" id="spawn-prop-w" class="form-input" />
                    <div class="custom-stepper-controls">
                      <button type="button" class="stepper-btn btn-step-up" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                      <button type="button" class="stepper-btn btn-step-down" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Altura H (px)</label>
                  <div class="custom-stepper-wrap" style="width: 100%;">
                    <input type="number" id="spawn-prop-h" class="form-input" />
                    <div class="custom-stepper-controls">
                      <button type="button" class="stepper-btn btn-step-up" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                      <button type="button" class="stepper-btn btn-step-down" tabindex="-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 10px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 8px; padding: 10px 14px; margin-top: 10px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span style="font-size: 11px; color: #cbd5e1; line-height: 1.4;">
                  <strong>Regra de Spawns Restritos:</strong> Encontros selvagens <em>somente</em> acontecem enquanto o jogador caminha dentro deste retângulo delimitado. Gramas altas fora de qualquer área de spawn não geram encontros.
                </span>
              </div>
            </div>
          </div>

          <!-- TAB 2: POKÉMONS SPAWNADOS -->
          <div id="tab-pane-spawn-pokemon" class="spawn-tab-pane hidden">
            <!-- TOOLBAR: BUSCA DO BANCO & ADICIONAR -->
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px; margin-bottom: 12px;">
              <!-- BARRA DE CÓPIA DE CONFIGURAÇÃO DE ZONA EXISTENTE -->
              <div class="spawn-copy-zone-bar" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 290px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2" style="flex-shrink: 0;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  <label for="spawn-copy-source-select" style="font-size: 11px; font-weight: 750; color: #94a3b8; white-space: nowrap; margin: 0;">Copiar de Zona Existente:</label>
                  <select id="spawn-copy-source-select" class="form-input" style="height: 36px; font-size: 11.5px; padding: 4px 10px; border-radius: 6px; flex: 1; min-width: 180px; background: rgba(15,23,42,0.9); border: 1px solid rgba(59,130,246,0.3); color: #fff;">
                    <option value="">-- Selecione uma zona para copiar a config --</option>
                  </select>
                </div>
                <button type="button" id="btn-apply-copy-zone" class="editor-btn small secondary" style="height: 36px; padding: 0 14px; font-size: 11px; display: inline-flex; align-items: center; gap: 6px; font-weight: 700;" title="Substitui os Pokémons e probabilidades atuais pelos da zona selecionada">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <span>Copiar Configuração</span>
                </button>
              </div>

              <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px;">
                <!-- SEARCH BOX COM BUSCA DO BANCO -->
                <div style="position: relative; flex: 1; min-width: 280px;">
                  <div style="display: flex; align-items: center; position: relative;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" style="position: absolute; left: 12px; pointer-events: none;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="spawn-pokemon-search" class="form-input" placeholder="Buscar Pokémon do banco por nome ou nº (ex: Pikachu, #025, Char)..." style="padding-left: 36px; font-size: 12px; height: 38px; border-radius: 8px;" />
                    <button type="button" id="btn-clear-spawn-search" style="position: absolute; right: 10px; background: none; border: none; color: #64748b; cursor: pointer; display: none;" title="Limpar busca">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  <!-- POPUP DE AUTOCOMPLETE COM POKÉMONS DO BANCO -->
                  <div id="spawn-search-autocomplete" class="spawn-autocomplete-dropdown hidden"></div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button type="button" id="btn-normalize-spawn-weights" class="editor-btn small" style="background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; height: 38px; padding: 0 14px; font-size: 11px; display: inline-flex; align-items: center; gap: 6px;" title="Ajusta proporcionalmente cada um dos 4 horários (Manhã, Tarde, Noite, Madrugada) para somarem 100%">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path></svg>
                    <span>Normalizar Horários (100%)</span>
                  </button>
                  <button type="button" id="btn-add-spawn-pokemon-row" class="editor-btn small gold" style="height: 38px; padding: 0 16px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Adicionar Pokémon</span>
                  </button>
                </div>
              </div>

              <!-- BARRA DE DISTRIBUIÇÃO PERCENTUAL POR HORÁRIO (4 TURNOS) -->
              <div class="spawn-turn-summary-card">
                <div class="spawn-turn-header-row">
                  <div class="spawn-turn-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>DISTRIBUIÇÃO DE PROBABILIDADE POR TURNO:</span>
                  </div>
                  <div id="spawn-distribution-status" class="spawn-dist-status-wrap"></div>
                </div>

                <div class="spawn-period-tabs">
                  <button type="button" class="spawn-period-tab-btn active" id="btn-period-morning">
                    <svg class="period-icon morning" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6"></path><path d="M4.93 10.93l4.24 4.24"></path><path d="M2 18h20"></path><path d="M20 18a8 8 0 0 0-16 0"></path><path d="M19.07 10.93l-4.24 4.24"></path></svg>
                    <span class="period-name">Manhã</span>
                    <span class="period-hours">06h–12h</span>
                    <span id="badge-total-morning" class="period-pill-pct">(0%)</span>
                  </button>
                  <button type="button" class="spawn-period-tab-btn" id="btn-period-afternoon">
                    <svg class="period-icon afternoon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
                    <span class="period-name">Tarde</span>
                    <span class="period-hours">12h–18h</span>
                    <span id="badge-total-afternoon" class="period-pill-pct">(0%)</span>
                  </button>
                  <button type="button" class="spawn-period-tab-btn" id="btn-period-night">
                    <svg class="period-icon night" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    <span class="period-name">Noite</span>
                    <span class="period-hours">18h–00h</span>
                    <span id="badge-total-night" class="period-pill-pct">(0%)</span>
                  </button>
                  <button type="button" class="spawn-period-tab-btn" id="btn-period-dawn">
                    <svg class="period-icon dawn" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                    <span class="period-name">Madrugada</span>
                    <span class="period-hours">00h–06h</span>
                    <span id="badge-total-dawn" class="period-pill-pct">(0%)</span>
                  </button>
                </div>
                <!-- Barra horizontal dinâmica -->
                <div id="spawn-probability-bar" class="spawn-prob-bar-container"></div>
              </div>
            </div>

            <!-- LISTAGEM DE POKÉMONS SPAWNADOS (CARD INSPECTOR) -->
            <div style="padding: 2px 0;">
              <div id="spawn-pokemon-cards-container" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Cards populados dinamicamente -->
              </div>
              <div id="spawn-pokemon-empty-msg" class="hidden" style="text-align: center; padding: 40px 10px; color: #64748b; font-size: 12px; background: rgba(15,23,42,0.5); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.1);">
                Nenhum Pokémon configurado nesta área de spawn. Digite o nome na busca acima ou clique em "Adicionar Pokémon".
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions" style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 10px;">
          <button id="btn-save-spawn" class="editor-btn small primary" style="flex: 2; height: 38px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            <span>Salvar Área de Spawn</span>
          </button>
          <button id="btn-delete-spawn" class="editor-btn small danger" style="flex: 1; height: 38px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>Excluir</span>
          </button>
        </div>
      </div>

      <!-- NPC Inspector / Edit Modal -->
      <div id="editor-npc-modal" class="editor-modal hidden" style="max-width: 480px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <h4 id="npc-modal-heading">CONFIGURAR NPC</h4>
          </div>
          <button id="btn-close-npc-modal" class="close-btn">✕</button>
        </div>
        <div class="modal-body" style="gap: 12px;">
          <!-- Row 1: Name and Sprite Preview -->
          <div style="display:flex; gap:12px; align-items:center;">
            <div style="width:52px; height:52px; background:#0b1120; border:2px solid #38bdf8; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;">
              <div id="npc-prop-sprite-preview" style="width:32px; height:48px; background-size:128px 192px; background-position:0 0; image-rendering:pixelated;"></div>
            </div>
            <div style="flex:1;">
              <label style="font-size:11px; font-weight:700; color:#94a3b8; display:block; margin-bottom:4px;">Nome do NPC</label>
              <input type="text" id="npc-prop-name" class="form-input" placeholder="Ex: Professor Carvalho" style="height:34px; font-weight:700;" />
            </div>
          </div>

          <!-- Row 2: Sprite Sheet Selector -->
          <div class="form-group">
            <label style="font-size:11px; font-weight:700; color:#94a3b8; margin-bottom:4px;">Aparência / Spritesheet</label>
            <select id="npc-prop-sprite" class="form-input" style="height:34px; font-weight:600;">
              <!-- Dynamically filled with NPC_SPRITES -->
            </select>
          </div>

          <!-- Row 3: NPC Type and Direction -->
          <div class="form-row" style="gap: 8px;">
            <div class="form-group" style="flex: 1.3;">
              <label style="font-size:11px; font-weight:700; color:#94a3b8; margin-bottom:4px;">Tipo de NPC</label>
              <select id="npc-prop-type" class="form-input" style="height:34px; font-weight:700;">
                <option value="dialogue">💬 Diálogo (Conversa)</option>
                <option value="battle">⚔️ Batalha (Treinador/Bandido)</option>
                <option value="shop">🛒 Loja (Poké Mart)</option>
                <option value="starter_oak">🎓 Prof. Carvalho (Inicial)</option>
              </select>
            </div>
            <div class="form-group" style="flex: 0.9;">
              <label style="font-size:11px; font-weight:700; color:#94a3b8; margin-bottom:4px;">Direção Inicial</label>
              <select id="npc-prop-direction" class="form-input" style="height:34px;">
                <option value="down">Baixo (Frente)</option>
                <option value="up">Cima (Costas)</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
              </select>
            </div>
          </div>

          <!-- SECTION: Dialogue -->
          <div id="npc-section-dialogue" class="form-group">
            <label id="npc-dialogue-label" style="font-size:11px; font-weight:700; color:#94a3b8; margin-bottom:4px;">Frases de Diálogo (Uma por linha)</label>
            <textarea id="npc-prop-dialogue" class="form-input" rows="3" style="resize:vertical; font-size:12px; line-height:1.4;" placeholder="Ex: Olá, treinador!\nSeja bem-vindo ao mundo Pokémon!"></textarea>
          </div>

          <!-- SECTION: Battle Config -->
          <div id="npc-section-battle" class="form-group hidden" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:10px; gap:8px; display:flex; flex-direction:column;">
            <span style="font-size:11px; font-weight:800; color:#f87171;">⚔️ CONFIGURAÇÃO DE BATALHA</span>
            
            <div class="form-row" style="gap:8px;">
              <div class="form-group" style="flex:1;">
                <label style="font-size:10px;">Alcance Visão (Grids)</label>
                <input type="number" id="npc-prop-vision" class="form-input" style="height:28px;" value="3" min="0" max="10" />
              </div>
              <div class="form-group" style="flex:1;">
                <label style="font-size:10px;">Recompensa ($)</label>
                <input type="number" id="npc-prop-reward" class="form-input" style="height:28px;" value="200" min="0" />
              </div>
            </div>

            <div class="form-row" style="gap:8px;">
              <div class="form-group" style="flex:1;">
                <label style="font-size:10px;">Recompensa EXP</label>
                <input type="number" id="npc-prop-reward-exp" class="form-input" style="height:28px;" value="150" min="0" />
              </div>
              <div class="form-group" style="flex:1;">
                <label style="font-size:10px;">Cooldown Revanche (s)</label>
                <input type="number" id="npc-prop-cooldown" class="form-input" style="height:28px;" value="300" min="0" title="Tempo em segundos (Ex: 300 = 5 min)" />
              </div>
            </div>

            <div class="form-group">
              <label style="font-size:10px;">Diálogo ao Vencer Jogador</label>
              <input type="text" id="npc-prop-loss-dlg" class="form-input" style="height:28px;" placeholder="Haha! Ainda precisa treinar mais!" />
            </div>
            <div class="form-group">
              <label style="font-size:10px;">Diálogo ao Ser Derrotado</label>
              <input type="text" id="npc-prop-win-dlg" class="form-input" style="height:28px;" placeholder="Você é muito forte..." />
            </div>

            <div class="form-group">
              <label style="font-size:10px;">Time Pokémon (JSON ou [{ speciesId, level, name }])</label>
              <input type="text" id="npc-prop-team" class="form-input" style="height:28px; font-family:monospace; font-size:11px;" placeholder='[{"speciesId":19,"level":3,"name":"Rattata"}]' />
            </div>
          </div>

          <!-- SECTION: Shop Config -->
          <div id="npc-section-shop" class="form-group hidden" style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:10px; gap:8px; display:flex; flex-direction:column;">
            <span style="font-size:11px; font-weight:800; color:#34d399;">🛒 CATÁLOGO DA LOJA</span>
            <p style="font-size:10px; color:#cbd5e1; margin:0;">Selecione os itens vendidos neste atendente (deixe desmarcado para catálogo padrão):</p>
            <div id="npc-shop-items-checklist" style="display:flex; flex-wrap:wrap; gap:6px;">
              <!-- Checkboxes for default items -->
            </div>
          </div>

          <!-- SECTION: Starter Oak Info -->
          <div id="npc-section-oak" class="form-group hidden" style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:8px; padding:10px;">
            <span style="font-size:11px; font-weight:800; color:#fbbf24;">🎓 SISTEMA DO PROFESSOR CARVALHO</span>
            <p style="font-size:11px; color:#fde68a; margin:4px 0 0 0;">
              Ao interagir com este NPC no Laboratório, abre a interface com as 3 Pokébolas (Bulbasaur, Charmander e Squirtle), lupa animada do GIF e confirmação SIM/NÃO.
            </p>
          </div>

          <!-- Position Coordinates -->
          <div class="form-row" style="gap:8px; align-items:flex-end;">
            <div class="form-group" style="flex:1;">
              <label style="font-size:10px;">Posição X</label>
              <input type="number" id="npc-prop-x" class="form-input" style="height:28px;" />
            </div>
            <div class="form-group" style="flex:1;">
              <label style="font-size:10px;">Posição Y</label>
              <input type="number" id="npc-prop-y" class="form-input" style="height:28px;" />
            </div>
            <button id="btn-npc-focus" class="editor-btn small secondary" style="height:28px; padding:0 10px;">🔍 Focar</button>
          </div>
        </div>
        <div class="modal-footer" style="display:flex; justify-content:space-between; padding:12px; border-top:1px solid rgba(255,255,255,0.1);">
          <button id="btn-delete-npc" class="editor-btn danger">Excluir NPC</button>
          <div style="display:flex; gap:8px;">
            <button id="btn-cancel-npc" class="editor-btn secondary">Cancelar</button>
            <button id="btn-save-npc" class="editor-btn gold">Salvar NPC</button>
          </div>
        </div>
      </div>

      <!-- Toast Container -->
      <div id="editor-toast-container" class="editor-toast-container"></div>
    `;

    this.container = editorEl;
    this.tilesetCanvas = document.getElementById('tileset-palette-canvas');
    this.tilesetCtx = this.tilesetCanvas.getContext('2d');

    this.tilesetImage.onload = () => {
      this.drawTilesetPalette();
      this.updateTilePreview(1);
    };
  }

  bindEvents() {
    this.populateTilesetSelect();

    // Editor Scene Callbacks
    this.editorScene.onCoordsUpdate = (tileX, tileY, pxX, pxY) => {
      const coordsEl = document.getElementById('editor-coords');
      if (coordsEl) coordsEl.textContent = `Tile: [${tileX}, ${tileY}] | Px: [${pxX}, ${pxY}]`;
    };

    this.editorScene.onZoomUpdate = (zoom) => {
      const zoomEl = document.getElementById('editor-zoom-indicator');
      if (zoomEl) zoomEl.textContent = `${Math.round(zoom * 100)}%`;
    };

    this.editorScene.onTilePicked = async (gid, sourceLayerName) => {
      if (this.activeSidebarTab !== 'layers') {
        this.switchSidebarTab('layers');
      }

      // IMPORTANTE: Não alterar a camada de pintura do usuário!
      // O usuário selecionou a camada onde quer colocar os tiles (ex: Overhead).
      // Ao usar o conta-gotas ele captura o visual/GID sem alterar a camada alvo.
      if (this.editorScene.activeTool === 'picker') {
        this.selectTool('pencil');
      }

      // Check which tileset in the map contains the picked tile GID
      const mapTilesets = this.editorScene.mapJsonData?.tilesets || [];
      const pickedTileset = mapTilesets.find(t => {
        const start = t.firstgid || 1;
        const count = t.tilecount || (t.columns * 100);
        return gid >= start && gid < start + count;
      });

      const currentTileset = this.activeTileset;
      const currentStart = currentTileset ? (currentTileset.firstgid || 1) : 1;
      const currentCount = currentTileset ? (currentTileset.tilecount || (currentTileset.columns * 100)) : 0;

      // Verifica se o tile pertence ao tileset atualmente selecionado
      const belongsToCurrent = currentTileset && (
        (pickedTileset && pickedTileset.name === currentTileset.name) ||
        (gid >= currentStart && gid < currentStart + currentCount)
      );

      if (belongsToCurrent) {
        // Se pertencer ao tileset atual selecionado: vai diretamente para ele sem fazer busca
        this.setTileGid(gid);
        this.scrollToTileInPalette(gid);

        const listEl = document.getElementById('similar-tiles-list');
        if (listEl) {
          listEl.innerHTML = `<small class="similarity-placeholder" style="color:#a0aec0;">Tile GID ${gid} pertence diretamente ao tileset atual (${currentTileset.name}).</small>`;
        }
        this.showToast(`🎯 Tile GID ${gid} selecionado no tileset "${currentTileset.name}"!`, 'success');
      } else {
        // Se for de um tileset diferente do atualmente selecionado: faz a busca de correspondência
        if (currentTileset) {
          const fromName = pickedTileset ? pickedTileset.name : 'outro tileset';
          this.showToast(`🔍 Buscando correspondência de "${fromName}" em "${currentTileset.name}"...`, 'info');

          const bestGid = await this.findSimilarOutsideTiles(gid, currentTileset);
          if (bestGid) {
            this.setTileGid(bestGid);
            this.scrollToTileInPalette(bestGid);
            this.showToast(`✨ Correspondência encontrada no tileset "${currentTileset.name}"!`, 'success');
          }
        } else {
          // Sem tileset pré-selecionado: troca para o tileset do tile
          const foundIdx = mapTilesets.findIndex(t => t.name === (pickedTileset?.name));
          if (foundIdx >= 0) {
            this.switchTileset(foundIdx, gid);
          } else {
            this.setTileGid(gid);
            this.scrollToTileInPalette(gid);
          }
          this.showToast(`Tile GID ${gid} copiado (origem: "${sourceLayerName || 'Ativa'}")!`, 'success');
        }
      }
    };

    this.editorScene.onObjectDeleted = (obj) => {
      this.renderPortalsList();
      this.renderSignsList();
      this.renderZonesList();
      this.renderSpawnsList();
      this.renderNpcsList();
    };

    this.editorScene.onObjectSelected = (obj) => {
      if (obj.layerName === 'Portals' || obj.type === 'portal_link') {
        this.openPortalModal(obj);
        this.renderPortalsList();
      } else if (obj.layerName === 'Zones' || obj.type === 'zone') {
        this.openZoneModal(obj);
        this.renderZonesList();
      } else if (obj.layerName === 'PokemonSpawns' || obj.layerName === 'Spawns' || obj.type === 'spawn') {
        this.openSpawnModal(obj);
        this.renderSpawnsList();
      } else if (obj.layerName === 'NPCs' || obj.type === 'npc' || obj.type === 'starter_oak' || obj.type === 'dialogue' || obj.type === 'battle' || obj.type === 'shop') {
        this.openNpcModal(obj);
        this.renderNpcsList();
      } else {
        this.openObjectModal(obj);
      }
    };

    this.editorScene.onNpcSelected = (npc) => {
      this.switchSidebarTab('npcs');
      this.openNpcModal(npc);
    };

    this.editorScene.onPortalSelected = (portal) => {
      this.openPortalModal(portal);
      this.renderPortalsList();
    };

    this.editorScene.onSignSelected = (sign) => {
      this.openSignModal(sign);
      this.renderSignsList();
    };

    this.editorScene.onZoneSelected = (zone) => {
      this.openZoneModal(zone);
      this.renderZonesList();
    };

    this.editorScene.onSpawnSelected = (spawn) => {
      this.openSpawnModal(spawn);
      this.renderSpawnsList();
    };

    this.editorScene.onMapLoaded = (mapName, mapJsonData, layerNames) => {
      this.renderLayersList(layerNames);
      this.populateTilesetSelect();
      this.switchTileset(0);
      this.renderPortalsList();
      this.renderSignsList();
      this.renderZonesList();
      this.renderSpawnsList();
      this.renderNpcsList();

      const badge = document.getElementById('editor-map-badge');
      if (badge) {
        badge.textContent = `${mapName} (${mapJsonData.width}x${mapJsonData.height})`;
      }
      const select = document.getElementById('editor-map-select');
      if (select && select.value !== mapName) {
        select.value = mapName;
      }
      if (this.editorScene.cameras?.main) {
        this.editorScene._notifyZoom();
      }

      if (mapName.startsWith('arena_') || mapName.includes('arena')) {
        this.switchSidebarTab('zones');
        this.switchZonesSubtab('arena');
      }
    };

    this.editorScene.onArenaSpawnUpdated = (role, x, y, spawnObj) => {
      document.getElementById('portal-picker-bar')?.classList.add('hidden');
      this.renderArenaSpawnsView();
      this.showToast(`🎯 Spawn do ${role === 'player' ? 'Player' : 'Rival'} posicionado em [${x}, ${y}]!`, 'success');
    };

    this.editorScene.onToast = (msg, type) => {
      this.showToast(msg, type);
    };

    this.editorScene.onPortalPairCompleted = async (destBox, context) => {
      document.getElementById('portal-picker-bar')?.classList.add('hidden');

      if (!context || !context.sourceMap || !context.targetMap) {
        this.showToast('Erro: Contexto de portais incompleto.', 'error');
        return;
      }

      const sourceMap = context.sourceMap;
      const targetMap = context.targetMap;

      // Calcular pontos seguros de spawn (chegada)
      // Chegando no destino: centro do gatilho de destino desenhado
      const destSpawnX = destBox.x + Math.floor(destBox.width / 2);
      const destSpawnY = destBox.y + Math.floor(destBox.height / 2);

      // Chegando de volta na origem: centro horizontal do gatilho de origem, 16px à frente da porta
      const originSpawnX = context.originX + Math.floor(context.originW / 2);
      const originSpawnY = context.originY + context.originH + 16;

      // 1. Gravar portal no MAPA DE DESTINO (que está atualmente carregado no editor)
      const destPortalLayer = this.editorScene._getOrCreateObjectLayer('Portals');
      let destPortal = destPortalLayer.objects.find(o => {
        const p = this.editorScene._readProps(o.properties);
        return p.targetRoom === sourceMap || (Math.abs(o.x - destBox.x) < 8 && Math.abs(o.y - destBox.y) < 8);
      });

      if (!destPortal) {
        destPortal = {
          id: Date.now() + 10,
          name: `Saída para ${sourceMap}`,
          type: 'portal_link',
          x: destBox.x,
          y: destBox.y,
          width: destBox.width,
          height: destBox.height,
          properties: []
        };
        destPortalLayer.objects.push(destPortal);
      } else {
        destPortal.x = destBox.x;
        destPortal.y = destBox.y;
        destPortal.width = destBox.width;
        destPortal.height = destBox.height;
      }

      destPortal.name = `Saída para ${sourceMap}`;
      destPortal.properties = [
        { name: 'targetRoom', value: sourceMap },
        { name: 'targetX', value: originSpawnX },
        { name: 'targetY', value: originSpawnY },
        { name: 'label', value: `Saída para ${sourceMap}` },
        { name: 'isLinked', value: true }
      ];

      this.editorScene.selectedObject = destPortal;
      this.editorScene.drawObjects();
      await this.saveMap();

      // 2. Gravar portal no MAPA DE ORIGEM (via API de persistência)
      try {
        const res = await fetch(`/api/admin/map?map=${encodeURIComponent(sourceMap)}`);
        if (res.ok) {
          const originMapJson = await res.json();
          if (originMapJson && originMapJson.layers) {
            let originLayer = originMapJson.layers.find(l => (l.name === 'Portals' || l.name === 'Warps' || l.name === 'Doors') && l.type === 'objectgroup');
            if (!originLayer) {
              originLayer = {
                name: 'Portals',
                type: 'objectgroup',
                visible: true,
                opacity: 1,
                objects: []
              };
              originMapJson.layers.push(originLayer);
            }

            let originPortal = originLayer.objects.find(o => o.id == context.portalId || (Math.abs(o.x - context.originX) < 8 && Math.abs(o.y - context.originY) < 8));
            if (!originPortal) {
              originPortal = {
                id: context.portalId || Date.now(),
                name: context.label || `Entrada para ${targetMap}`,
                type: 'portal_link',
                x: context.originX,
                y: context.originY,
                width: context.originW,
                height: context.originH,
                properties: []
              };
              originLayer.objects.push(originPortal);
            } else {
              originPortal.x = context.originX;
              originPortal.y = context.originY;
              originPortal.width = context.originW;
              originPortal.height = context.originH;
            }

            originPortal.name = context.label || `Entrada para ${targetMap}`;
            originPortal.properties = [
              { name: 'targetRoom', value: targetMap },
              { name: 'targetX', value: destSpawnX },
              { name: 'targetY', value: destSpawnY },
              { name: 'label', value: context.label || `Entrada para ${targetMap}` },
              { name: 'isLinked', value: true }
            ];

            await fetch(`/api/admin/map?map=${encodeURIComponent(sourceMap)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(originMapJson)
            });
          }
        }
      } catch (err) {
        console.warn('[onPortalPairCompleted] Falha ao salvar portal de origem:', err);
      }

      // 3. Sincronizar ROOMS_CONFIG em memória
      if (ROOMS_CONFIG[sourceMap]) {
        if (!ROOMS_CONFIG[sourceMap].portals) ROOMS_CONFIG[sourceMap].portals = [];
        ROOMS_CONFIG[sourceMap].portals = ROOMS_CONFIG[sourceMap].portals.filter(p => p.targetRoom !== targetMap);
        ROOMS_CONFIG[sourceMap].portals.push({
          trigger: { x: context.originX, y: context.originY, width: context.originW, height: context.originH },
          targetRoom: targetMap,
          targetSpawn: { x: destSpawnX, y: destSpawnY },
          label: context.label || `Entrada para ${targetMap}`
        });
      }

      if (ROOMS_CONFIG[targetMap]) {
        if (!ROOMS_CONFIG[targetMap].portals) ROOMS_CONFIG[targetMap].portals = [];
        ROOMS_CONFIG[targetMap].portals = ROOMS_CONFIG[targetMap].portals.filter(p => p.targetRoom !== sourceMap);
        ROOMS_CONFIG[targetMap].portals.push({
          trigger: { x: destBox.x, y: destBox.y, width: destBox.width, height: destBox.height },
          targetRoom: sourceMap,
          targetSpawn: { x: originSpawnX, y: originSpawnY },
          label: `Saída para ${sourceMap}`
        });
      }

      this.renderPortalsList();
      this.showToast(`✨ Conexão bidirecional criada com sucesso: '${sourceMap}' ⇄ '${targetMap}'!`, 'success');

      // Reabrir o modal mostrando a ponta de destino recém-criada
      this.openPortalModal(destPortal);
    };

    this.editorScene.onPortalTargetPicked = async (targetX, targetY, context) => {
      document.getElementById('portal-picker-bar')?.classList.add('hidden');

      if (context && context.sourceMap && context.sourceMap !== this.editorScene.currentMapName) {
        this.showToast(`Retornando ao mapa de origem '${context.sourceMap}'...`, 'info');
        await this.editorScene.loadMapByName(context.sourceMap);
        const mapSelect = document.getElementById('editor-map-select');
        if (mapSelect) mapSelect.value = context.sourceMap;
      }

      const modal = document.getElementById('editor-portal-modal');
      if (modal) {
        document.getElementById('portal-prop-target-x').value = targetX;
        document.getElementById('portal-prop-target-y').value = targetY;
        if (context) {
          if (context.label !== undefined) document.getElementById('portal-prop-label').value = context.label;
          if (context.targetMap !== undefined) document.getElementById('portal-prop-target-room').value = context.targetMap;
          if (context.originX !== undefined) document.getElementById('portal-prop-x').value = context.originX;
          if (context.originY !== undefined) document.getElementById('portal-prop-y').value = context.originY;
          if (context.originW !== undefined) document.getElementById('portal-prop-w').value = context.originW;
          if (context.originH !== undefined) document.getElementById('portal-prop-h').value = context.originH;
        }
        modal.classList.remove('hidden');
        if (this.editorScene?.input?.keyboard) {
          this.editorScene.input.keyboard.enabled = false;
        }
      }

      this.showToast(`Spawn de destino definido: (${targetX}px, ${targetY}px)!`, 'success');
    };

    // Top Bar Map Selector Change
    const mapSelect = document.getElementById('editor-map-select');
    if (mapSelect) {
      mapSelect.addEventListener('change', (e) => {
        const chosenMap = e.target.value;
        this.editorScene.loadMapByName(chosenMap);
      });
    }

    // Modo Rede de Mapas (Node Graph)
    document.getElementById('btn-mode-nodes')?.addEventListener('click', () => {
      if (this.nodeGraphUI) this.nodeGraphUI.show();
    });

    // Centralizar Mapa Buttons (Top Bar e Toolbar)
    document.getElementById('btn-center-map')?.addEventListener('click', () => this.editorScene.centerMap());
    document.getElementById('tool-centermap')?.addEventListener('click', () => this.editorScene.centerMap());

    // Reset Zoom Button
    document.getElementById('tool-zoomreset')?.addEventListener('click', () => this.editorScene.resetZoom());

    // Toggle Grid Buttons
    const onToggleGrid = (btn) => {
      this.editorScene.toggleGrid();
      const isActive = this.editorScene.showGrid;
      document.getElementById('btn-toggle-grid')?.classList.toggle('active', isActive);
      document.getElementById('tool-grid')?.classList.toggle('active', isActive);
    };
    document.getElementById('btn-toggle-grid')?.addEventListener('click', (e) => onToggleGrid(e.currentTarget));
    document.getElementById('tool-grid')?.addEventListener('click', (e) => onToggleGrid(e.currentTarget));

    // Toggle Collisions Button
    document.getElementById('btn-toggle-collision')?.addEventListener('click', (e) => {
      this.editorScene.toggleCollisions();
      e.currentTarget.classList.toggle('active', this.editorScene.showCollisions);
    });

    // Move Active Layer Up / Down Buttons
    document.getElementById('btn-move-layer-up')?.addEventListener('click', async () => {
      const active = this.editorScene.activeLayerName;
      if (!active || active === 'Collision') return;
      const moved = this.editorScene.moveLayer(active, 1);
      if (moved) {
        this.renderLayersList(this.editorScene.allTileLayerNames);
        await this.saveMap();
        this.showToast(`▲ Camada "${active}" subiu para cima e foi salva!`, 'success');
      }
    });

    document.getElementById('btn-move-layer-down')?.addEventListener('click', async () => {
      const active = this.editorScene.activeLayerName;
      if (!active || active === 'Collision') return;
      const moved = this.editorScene.moveLayer(active, -1);
      if (moved) {
        this.renderLayersList(this.editorScene.allTileLayerNames);
        await this.saveMap();
        this.showToast(`▼ Camada "${active}" desceu para baixo e foi salva!`, 'success');
      }
    });

    // Clear Active Layer Button
    document.getElementById('btn-clear-layer')?.addEventListener('click', () => {
      const layerName = this.editorScene.activeLayerName;
      if (confirm(`Tem certeza que deseja apagar todos os dados da camada "${layerName}"?`)) {
        this.editorScene.clearActiveLayer();
      }
    });

    // Collision Type Palette Buttons
    document.querySelectorAll('.collision-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = parseInt(e.currentTarget.dataset.type, 10);
        this.selectCollisionType(type);
      });
    });

    if (this.editorScene) {
      this.editorScene.onCollisionTypePicked = (type) => {
        this.selectCollisionType(type);
      };
    }

    // Tool Buttons
    const tools = ['hand', 'pencil', 'eraser', 'bucket', 'picker', 'sign', 'link', 'object', 'zone', 'spawn', 'npc'];
    tools.forEach(tool => {
      const btn = document.getElementById(`tool-${tool}`);
      if (btn) {
        btn.addEventListener('click', () => this.selectTool(tool));
      }
    });

    document.getElementById('tool-zoomin')?.addEventListener('click', () => this.editorScene.zoomIn());
    document.getElementById('tool-zoomout')?.addEventListener('click', () => this.editorScene.zoomOut());

    // Sidebar Tabs
    ['layers', 'portals', 'signs', 'zones', 'spawns', 'npcs'].forEach(tab => {
      document.getElementById(`tab-btn-${tab}`)?.addEventListener('click', () => this.switchSidebarTab(tab));
    });

    document.getElementById('editor-zones-subtab-select')?.addEventListener('change', (e) => {
      this.switchZonesSubtab(e.target.value);
    });

    // New Portal, Sign, Zone, Spawn & NPC Buttons
    document.getElementById('btn-add-new-portal')?.addEventListener('click', () => {
      this.selectTool('link');
      this.showToast('Clique e arraste no mapa para marcar a área do teleporte (1 ou mais grids).', 'info');
    });

    document.getElementById('btn-add-new-sign')?.addEventListener('click', () => {
      this.selectTool('sign');
      this.showToast('Clique no mapa para marcar a posição da placa (1 grid).', 'info');
    });

    document.getElementById('btn-add-new-zone')?.addEventListener('click', () => {
      this.selectTool('zone');
      this.showToast('Clique e arraste no mapa para desenhar a área da Cidade / Rota.', 'info');
    });

    document.getElementById('btn-add-new-spawn')?.addEventListener('click', () => {
      this.selectTool('spawn');
      this.showToast('Clique e arraste no mapa para desenhar a área de Spawn Pokémon.', 'info');
    });

    document.getElementById('btn-add-new-npc')?.addEventListener('click', () => {
      this.selectTool('npc');
      this.showToast('Clique no mapa onde deseja posicionar o novo NPC.', 'info');
    });

    // Arena Battle Spawns (Player & Rival) UI Controls
    const updatePlayerSpawnFromUI = () => {
      const x = parseInt(document.getElementById('arena-player-x')?.value, 10) || 0;
      const y = parseInt(document.getElementById('arena-player-y')?.value, 10) || 0;
      const facing = document.getElementById('arena-player-facing')?.value || 'right';
      this.editorScene.setArenaSpawnPosition('player', x, y, facing);
      this.renderArenaSpawnsView();
    };

    const updateRivalSpawnFromUI = () => {
      const x = parseInt(document.getElementById('arena-rival-x')?.value, 10) || 0;
      const y = parseInt(document.getElementById('arena-rival-y')?.value, 10) || 0;
      const facing = document.getElementById('arena-rival-facing')?.value || 'left';
      this.editorScene.setArenaSpawnPosition('opponent', x, y, facing);
      this.renderArenaSpawnsView();
    };

    document.getElementById('arena-player-x')?.addEventListener('change', updatePlayerSpawnFromUI);
    document.getElementById('arena-player-y')?.addEventListener('change', updatePlayerSpawnFromUI);
    document.getElementById('arena-player-facing')?.addEventListener('change', updatePlayerSpawnFromUI);

    document.getElementById('arena-rival-x')?.addEventListener('change', updateRivalSpawnFromUI);
    document.getElementById('arena-rival-y')?.addEventListener('change', updateRivalSpawnFromUI);
    document.getElementById('arena-rival-facing')?.addEventListener('change', updateRivalSpawnFromUI);

    document.getElementById('arena-rival-enabled')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      const spawnLayer = this.editorScene._getOrCreateObjectLayer('Spawns');
      if (enabled) {
        this.editorScene.getOrCreateArenaSpawn('opponent', 672, 288, 'left');
      } else {
        if (spawnLayer && spawnLayer.objects) {
          spawnLayer.objects = spawnLayer.objects.filter(o => {
            const p = this.editorScene._readProps(o.properties);
            return p.role !== 'opponent' && o.name !== 'opponent_spawn' && o.type !== 'spawn_opponent';
          });
        }
      }
      this.editorScene.drawObjects();
      this.renderArenaSpawnsView();
      this.showToast(enabled ? '⚔️ Spawn do Rival ativado!' : '🗑️ Spawn do Rival desativado (batalha selvagem).', 'info');
    });

    document.getElementById('btn-pick-player-spawn')?.addEventListener('click', () => {
      this.editorScene.startPickingArenaSpawn('player');
      const pickerBar = document.getElementById('portal-picker-bar');
      const badge = document.getElementById('portal-picker-mode-badge');
      const instr = document.getElementById('portal-picker-instructions');
      if (pickerBar && badge && instr) {
        badge.textContent = '🔵 MARCAR SPAWN DO PLAYER';
        badge.style.background = '#00d4ff';
        badge.style.color = '#000';
        instr.textContent = 'Clique no mapa onde o Player deve nascer na arena (use Botão Direito/Espaço para mover o mapa).';
        pickerBar.classList.remove('hidden');
      }
      this.showToast('🎯 Clique em qualquer tile do mapa para posicionar o PLAYER.', 'info');
    });

    document.getElementById('btn-pick-rival-spawn')?.addEventListener('click', () => {
      this.editorScene.startPickingArenaSpawn('opponent');
      const pickerBar = document.getElementById('portal-picker-bar');
      const badge = document.getElementById('portal-picker-mode-badge');
      const instr = document.getElementById('portal-picker-instructions');
      if (pickerBar && badge && instr) {
        badge.textContent = '🔴 MARCAR SPAWN DO RIVAL';
        badge.style.background = '#f43f5e';
        badge.style.color = '#fff';
        instr.textContent = 'Clique no mapa onde o Rival/Oponente deve nascer na arena (use Botão Direito/Espaço para mover o mapa).';
        pickerBar.classList.remove('hidden');
      }
      this.showToast('🎯 Clique em qualquer tile do mapa para posicionar o RIVAL / OPONENTE.', 'info');
    });

    document.getElementById('btn-portal-picker-cancel')?.addEventListener('click', () => {
      if (this.editorScene.isPickingArenaSpawn) {
        this.editorScene.stopPickingArenaSpawn();
        document.getElementById('portal-picker-bar')?.classList.add('hidden');
        this.showToast('🚫 Marcação de spawn cancelada.', 'info');
      }
    });

    document.getElementById('btn-focus-player-spawn')?.addEventListener('click', () => {
      const pSpawn = this.editorScene.getArenaSpawn('player');
      if (pSpawn && this.editorScene.cameras?.main) {
        this.editorScene.cameras.main.centerOn(pSpawn.x + 16, pSpawn.y + 16);
      }
    });

    document.getElementById('btn-focus-rival-spawn')?.addEventListener('click', () => {
      const rSpawn = this.editorScene.getArenaSpawn('opponent');
      if (rSpawn && this.editorScene.cameras?.main) {
        this.editorScene.cameras.main.centerOn(rSpawn.x + 16, rSpawn.y + 16);
      } else {
        this.showToast('Spawn do rival está desativado.', 'warning');
      }
    });

    // Tileset Select, Quick Add & Upload
    document.getElementById('editor-tileset-select')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val.startsWith('map:')) {
        const idx = parseInt(val.replace('map:', ''), 10);
        this.switchTileset(idx);
      } else if (val.startsWith('lib:')) {
        const presetName = val.replace('lib:', '');
        this.addLibraryTileset(presetName);
      } else if (val.startsWith('file:')) {
        const fileName = val.replace('file:', '');
        this.addFileTileset(fileName);
      }
    });

    document.getElementById('btn-add-outside4')?.addEventListener('click', () => {
      this.addOrSwitchTileset('Outside4 Winter');
    });

    const btnAddPNG = document.getElementById('btn-add-tileset-png');
    const inputPNGFile = document.getElementById('input-tileset-png-file');
    if (btnAddPNG && inputPNGFile) {
      btnAddPNG.addEventListener('click', () => inputPNGFile.click());
      inputPNGFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) this.handleUploadTilesetPNG(e.target.files[0]);
      });
    }

    // Top Action Buttons
    document.getElementById('btn-editor-save')?.addEventListener('click', () => this.saveMap());
    document.getElementById('btn-find-similar-tiles')?.addEventListener('click', () => {
      if (this.activeGid) this.findSimilarOutsideTiles(this.activeGid, this.activeTileset);
    });
    document.getElementById('btn-editor-reload')?.addEventListener('click', async () => {
      await this.fetchMapsList();
      if (confirm('Recarregar mapa atual? Alterações não salvas serão perdidas.')) {
        this.editorScene.loadMapByName(this.editorScene.currentMapName);
      }
    });
    document.getElementById('btn-editor-exit')?.addEventListener('click', () => this.hide());

    // Palette Zoom & Grid Listeners
    document.getElementById('btn-palette-zoom-in')?.addEventListener('click', () => {
      const nextZoom = this.paletteZoom === 'fit' ? 1.25 : Math.min(3, Math.round(((this.paletteZoom || 1) + 0.25) * 100) / 100);
      this.setPaletteZoom(nextZoom);
    });
    document.getElementById('btn-palette-zoom-out')?.addEventListener('click', () => {
      const nextZoom = this.paletteZoom === 'fit' ? 0.75 : Math.max(0.25, Math.round(((this.paletteZoom || 1) - 0.25) * 100) / 100);
      this.setPaletteZoom(nextZoom);
    });
    document.getElementById('btn-palette-zoom-100')?.addEventListener('click', () => {
      this.setPaletteZoom(1);
    });
    document.getElementById('btn-palette-fit-width')?.addEventListener('click', () => {
      this.setPaletteZoom(this.paletteZoom === 'fit' ? 1 : 'fit');
    });
    document.getElementById('btn-palette-grid-toggle')?.addEventListener('click', (e) => {
      this.showPaletteGrid = !this.showPaletteGrid;
      e.currentTarget.classList.toggle('active', this.showPaletteGrid);
      this.drawTilesetPalette();
    });


    // Tileset Canvas: Support single-click AND drag-to-select multiple tiles (like Tiled!)
    this.tilesetCanvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      const rect = this.tilesetCanvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (this.tilesetCanvas.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (this.tilesetCanvas.height / rect.height) : 1;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      const margin = this.activeTileset?.margin || 0;
      const spacing = this.activeTileset?.spacing || 0;
      const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
      const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

      const col = Math.floor((clickX - margin) / (tileW + spacing));
      const row = Math.floor((clickY - margin) / (tileH + spacing));

      const maxRow = Math.ceil(this.totalTiles / this.columns);
      if (col < 0 || col >= this.columns || row < 0 || row >= maxRow) return;

      this.isSelectingTileset = true;
      this.selectStartCol = col;
      this.selectStartRow = row;
      this.selectEndCol = col;
      this.selectEndRow = row;

      this.updateTilesetSelection();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isSelectingTileset || !this.tilesetCanvas) return;
      const rect = this.tilesetCanvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (this.tilesetCanvas.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (this.tilesetCanvas.height / rect.height) : 1;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      const margin = this.activeTileset?.margin || 0;
      const spacing = this.activeTileset?.spacing || 0;
      const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
      const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

      const maxRow = Math.max(1, Math.ceil(this.totalTiles / this.columns));
      const col = Math.max(0, Math.min(this.columns - 1, Math.floor((clickX - margin) / (tileW + spacing))));
      const row = Math.max(0, Math.min(maxRow - 1, Math.floor((clickY - margin) / (tileH + spacing))));

      if (col !== this.selectEndCol || row !== this.selectEndRow) {
        this.selectEndCol = col;
        this.selectEndRow = row;
        this.updateTilesetSelection();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isSelectingTileset) {
        this.isSelectingTileset = false;
        this.updateTilesetSelection();
        // Automatically switch to pencil tool if on non-painting tool
        if (['sign', 'link', 'object'].includes(this.editorScene.activeTool)) {
          this.selectTool('pencil');
        }
      }
    });

    // Portal Modal Buttons
    document.getElementById('btn-close-portal-modal')?.addEventListener('click', () => {
      document.getElementById('editor-portal-modal').classList.add('hidden');
      if (this.editorScene?.input?.keyboard) {
        this.editorScene.input.keyboard.enabled = true;
        this.editorScene.input.keyboard.clearCaptures();
      }
    });
    document.getElementById('btn-save-portal')?.addEventListener('click', () => this.savePortalModal());
    document.getElementById('btn-delete-portal')?.addEventListener('click', () => this.deletePortalModal());
    document.getElementById('btn-portal-jump')?.addEventListener('click', () => {
      const targetRoom = document.getElementById('portal-prop-target-room').value;
      if (targetRoom) {
        document.getElementById('editor-portal-modal').classList.add('hidden');
        if (this.editorScene?.input?.keyboard) {
          this.editorScene.input.keyboard.enabled = true;
          this.editorScene.input.keyboard.clearCaptures();
        }
        this.editorScene.loadMapByName(targetRoom);
      }
    });

    // Interactive Portal Linking: Draw Target on Target Map
    document.getElementById('btn-portal-draw-target')?.addEventListener('click', async () => {
      const targetRoom = document.getElementById('portal-prop-target-room').value;
      const label = document.getElementById('portal-prop-label').value;
      const x = parseInt(document.getElementById('portal-prop-x').value, 10) || 0;
      const y = parseInt(document.getElementById('portal-prop-y').value, 10) || 0;
      const w = parseInt(document.getElementById('portal-prop-w').value, 10) || 32;
      const h = parseInt(document.getElementById('portal-prop-h').value, 10) || 32;

      if (!targetRoom) {
        this.showToast('Por favor, selecione um mapa de destino.', 'warning');
        return;
      }

      if (targetRoom === this.editorScene.currentMapName) {
        this.showToast('Selecione um mapa de destino diferente do mapa atual.', 'warning');
        return;
      }

      const currentObj = this.editorScene.selectedObject || {};

      const context = {
        sourceMap: this.editorScene.currentMapName,
        targetMap: targetRoom,
        portalId: currentObj.id,
        label: label || `Conexão ${this.editorScene.currentMapName} ⇄ ${targetRoom}`,
        originX: x,
        originY: y,
        originW: w,
        originH: h
      };

      document.getElementById('editor-portal-modal').classList.add('hidden');

      this.showToast(`Abrindo mapa '${targetRoom}' para desenhar o portal de destino...`, 'info');
      await this.editorScene.loadMapByName(targetRoom);
      const mapSelect = document.getElementById('editor-map-select');
      if (mapSelect) mapSelect.value = targetRoom;

      this.editorScene.startDrawingPortalDestination(context);

      const pickerBar = document.getElementById('portal-picker-bar');
      if (pickerBar) {
        const badge = document.getElementById('portal-picker-mode-badge');
        const instructions = document.getElementById('portal-picker-instructions');
        if (badge) badge.textContent = 'DESENHAR DESTINO';
        if (instructions) instructions.textContent = `Arraste no mapa '${targetRoom}' para marcar a área do portal/tapete de destino.`;
        pickerBar.classList.remove('hidden');
      }
    });

    document.getElementById('btn-portal-pick-origin')?.addEventListener('click', async () => {
      document.getElementById('editor-portal-modal').classList.add('hidden');
      this.selectTool('link');
      this.showToast('Clique e arraste no mapa para desenhar a nova área do gatilho de origem.', 'info');

      const pickerBar = document.getElementById('portal-picker-bar');
      if (pickerBar) {
        const badge = document.getElementById('portal-picker-mode-badge');
        const instructions = document.getElementById('portal-picker-instructions');
        if (badge) badge.textContent = 'REDESENHAR ORIGEM';
        if (instructions) instructions.textContent = 'Clique e arraste no mapa para marcar a nova área do portal.';
        pickerBar.classList.remove('hidden');
      }
    });

    document.getElementById('btn-portal-picker-cancel')?.addEventListener('click', async () => {
      document.getElementById('portal-picker-bar')?.classList.add('hidden');
      
      const pairCtx = this.editorScene.portalPairContext;
      const pickCtx = this.editorScene.portalPickContext;
      const returnToMap = pairCtx?.sourceMap || pickCtx?.sourceMap;

      this.editorScene.cancelPortalMarking();
      this.editorScene.stopPortalPicking();

      if (returnToMap && returnToMap !== this.editorScene.currentMapName) {
        await this.editorScene.loadMapByName(returnToMap);
        const mapSelect = document.getElementById('editor-map-select');
        if (mapSelect) mapSelect.value = returnToMap;
      }

      if (this.editorScene.selectedObject) {
        document.getElementById('editor-portal-modal')?.classList.remove('hidden');
      }
    });

    // Sign Modal Buttons
    document.getElementById('btn-close-sign-modal')?.addEventListener('click', () => {
      document.getElementById('editor-sign-modal').classList.add('hidden');
      if (this.editorScene?.input?.keyboard) {
        this.editorScene.input.keyboard.enabled = true;
        this.editorScene.input.keyboard.clearCaptures();
      }
    });
    document.getElementById('btn-save-sign')?.addEventListener('click', () => this.saveSignModal());
    document.getElementById('btn-delete-sign')?.addEventListener('click', () => this.deleteSignModal());
    document.getElementById('btn-test-dialogue')?.addEventListener('click', () => {
      const title = document.getElementById('sign-prop-title').value;
      const text = document.getElementById('sign-prop-text').value;
      this.dialogueBox.show(title, text);
    });

    // Generic Object Modal Buttons
    document.getElementById('btn-close-obj-modal')?.addEventListener('click', () => {
      document.getElementById('editor-object-modal').classList.add('hidden');
      if (this.editorScene?.input?.keyboard) {
        this.editorScene.input.keyboard.enabled = true;
        this.editorScene.input.keyboard.clearCaptures();
      }
    });
    document.getElementById('btn-save-object')?.addEventListener('click', () => this.saveObjectModal());
    document.getElementById('btn-delete-object')?.addEventListener('click', () => this.deleteObjectModal());

    // Zone Modal Buttons
    document.getElementById('btn-close-zone-modal')?.addEventListener('click', () => {
      document.getElementById('editor-zone-modal').classList.add('hidden');
      if (this.editorScene?.input?.keyboard) {
        this.editorScene.input.keyboard.enabled = true;
        this.editorScene.input.keyboard.clearCaptures();
      }
    });
    document.getElementById('btn-save-zone')?.addEventListener('click', () => this.saveZoneModal());
    document.getElementById('btn-delete-zone')?.addEventListener('click', () => this.deleteZoneModal());
    document.getElementById('btn-zone-pick-origin')?.addEventListener('click', () => {
      const currentObj = this.editorScene.selectedObject;
      if (currentObj) {
        document.getElementById('editor-zone-modal').classList.add('hidden');
        if (this.editorScene?.input?.keyboard) {
          this.editorScene.input.keyboard.enabled = true;
          this.editorScene.input.keyboard.clearCaptures();
        }
        this.editorScene.startZoneRedraw(currentObj);
        this.showToast('Clique e arraste no mapa para redesenhar as dimensões da zona.', 'info');
      }
    });

    // Spawn Modal Buttons
    document.getElementById('btn-close-spawn-modal')?.addEventListener('click', () => {
      document.getElementById('editor-spawn-modal').classList.add('hidden');
      if (this.editorScene?.input?.keyboard) {
        this.editorScene.input.keyboard.enabled = true;
        this.editorScene.input.keyboard.clearCaptures();
      }
    });
    document.getElementById('btn-save-spawn')?.addEventListener('click', () => this.saveSpawnModal());
    document.getElementById('btn-delete-spawn')?.addEventListener('click', () => this.deleteSpawnModal());
    document.getElementById('btn-add-spawn-pokemon-row')?.addEventListener('click', () => this.addSpawnPokemonRow());
    this.setupSpawnModalEvents();

    // NPC Modal Buttons
    const closeNpcModal = () => {
      document.getElementById('editor-npc-modal')?.classList.add('hidden');
      if (this.editorScene?.input?.keyboard) {
        this.editorScene.input.keyboard.enabled = true;
        this.editorScene.input.keyboard.clearCaptures();
      }
    };
    document.getElementById('btn-close-npc-modal')?.addEventListener('click', closeNpcModal);
    document.getElementById('btn-cancel-npc')?.addEventListener('click', closeNpcModal);
    document.getElementById('btn-save-npc')?.addEventListener('click', () => this.saveNpcModal());
    document.getElementById('btn-delete-npc')?.addEventListener('click', () => this.deleteNpcModal());
    document.getElementById('btn-npc-focus')?.addEventListener('click', () => {
      const cur = this.editorScene.selectedObject;
      if (cur && this.editorScene.cameras?.main) {
        this.editorScene.cameras.main.centerOn(cur.x, cur.y);
      }
    });

    document.getElementById('npc-prop-sprite')?.addEventListener('change', (e) => {
      this._updateNpcSpritePreview(e.target.value);
    });

    document.getElementById('npc-prop-type')?.addEventListener('change', (e) => {
      this._updateNpcTypeSections(e.target.value);
    });

    this.populateNpcSpriteSelect();

    // Stop propagation of all keydown events on inputs and textareas so typing (spaces, letters) is completely unaffected
    const modalInputs = document.querySelectorAll(
      '#editor-sign-modal input, #editor-sign-modal textarea, ' +
      '#editor-portal-modal input, #editor-portal-modal select, ' +
      '#editor-object-modal input, #editor-object-modal textarea, ' +
      '#editor-zone-modal input, #editor-zone-modal select, #editor-zone-modal textarea, ' +
      '#editor-spawn-modal input, #editor-spawn-modal select, #editor-spawn-modal textarea, ' +
      '#editor-npc-modal input, #editor-npc-modal select, #editor-npc-modal textarea, ' +
      '#editor-topbar input, #editor-topbar select'
    );
    modalInputs.forEach(inputEl => {
      inputEl.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });
    });
  }

  // ─── Maps Fetch & Population ──────────────────────────────────────────────

  async fetchMapsList() {
    try {
      const res = await fetch('/api/admin/map/list');
      if (res.ok) {
        const data = await res.json();
        if (data && (data.cities?.length || data.routes?.length || data.arenas?.length || data.interiors?.length || data.root?.length)) {
          this.allMapsList = data;
        }
      }
    } catch (err) {
      console.warn('[EditorUI fetchMapsList Warning]:', err);
    }
    try {
      const resTs = await fetch('/api/admin/map/tilesets');
      if (resTs.ok) {
        const dataTs = await resTs.json();
        if (dataTs && Array.isArray(dataTs.tilesets)) {
          this.availableTilesetFiles = dataTs.tilesets;
        }
      }
    } catch (err) {
      console.warn('[EditorUI fetchTilesets Warning]:', err);
    }
    this.populateMapSelect();
    this.populatePortalTargetSelect();
    this.populateTilesetSelect();
  }

  populateMapSelect() {
    const select = document.getElementById('editor-map-select');
    if (!select) return;

    select.innerHTML = '';

    // Group 1: Cities
    if (this.allMapsList.cities && this.allMapsList.cities.length > 0) {
      const groupCities = document.createElement('optgroup');
      groupCities.label = 'Cidades de Kanto';
      this.allMapsList.cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city.replace(/_/g, ' ').toUpperCase();
        groupCities.appendChild(opt);
      });
      select.appendChild(groupCities);
    }

    // Group 2: Routes
    if (this.allMapsList.routes && this.allMapsList.routes.length > 0) {
      const groupRoutes = document.createElement('optgroup');
      groupRoutes.label = 'Rotas de Kanto';
      this.allMapsList.routes.forEach(route => {
        const opt = document.createElement('option');
        opt.value = route;
        opt.textContent = route.replace(/_/g, ' ').toUpperCase();
        groupRoutes.appendChild(opt);
      });
      select.appendChild(groupRoutes);
    }

    // Group 3: Arenas de Batalha
    if (this.allMapsList.arenas && this.allMapsList.arenas.length > 0) {
      const groupArenas = document.createElement('optgroup');
      groupArenas.label = 'Arenas de Batalha';
      this.allMapsList.arenas.forEach(arena => {
        const opt = document.createElement('option');
        opt.value = arena;
        opt.textContent = arena.replace(/_/g, ' ').toUpperCase();
        groupArenas.appendChild(opt);
      });
      select.appendChild(groupArenas);
    }

    // Group 4: Interiores
    if (this.allMapsList.interiors && this.allMapsList.interiors.length > 0) {
      const groupInteriors = document.createElement('optgroup');
      groupInteriors.label = 'Interiores';
      this.allMapsList.interiors.forEach(interior => {
        const opt = document.createElement('option');
        opt.value = interior;
        opt.textContent = interior.replace(/_/g, ' ').toUpperCase();
        groupInteriors.appendChild(opt);
      });
      select.appendChild(groupInteriors);
    }

    // Group 5: Other maps in root
    if (this.allMapsList.root && this.allMapsList.root.length > 0) {
      const remaining = this.allMapsList.root.filter(r => 
        !this.allMapsList.cities?.includes(r) && 
        !this.allMapsList.routes?.includes(r) && 
        !this.allMapsList.arenas?.includes(r) &&
        !this.allMapsList.interiors?.includes(r)
      );
      if (remaining.length > 0) {
        const groupOther = document.createElement('optgroup');
        groupOther.label = 'Outros Mapas';
        remaining.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m.toUpperCase();
          groupOther.appendChild(opt);
        });
        select.appendChild(groupOther);
      }
    }

    select.value = this.editorScene.currentMapName || 'kanto';
  }

  populatePortalTargetSelect() {
    const select = document.getElementById('portal-prop-target-room');
    if (!select) return;

    select.innerHTML = '';
    const all = [
      ...(this.allMapsList.cities || []),
      ...(this.allMapsList.routes || []),
      ...(this.allMapsList.interiors || []),
      ...(this.allMapsList.arenas || []),
      ...(this.allMapsList.root || [])
    ];
    const unique = Array.from(new Set(all));
    unique.sort().forEach(mapId => {
      const opt = document.createElement('option');
      opt.value = mapId;
      const roomDef = ROOMS_CONFIG[mapId];
      opt.textContent = roomDef?.name ? `${roomDef.name} (${mapId})` : mapId.replace(/_/g, ' ').toUpperCase();
      select.appendChild(opt);
    });
  }

  // ─── Dynamic Layer Management ─────────────────────────────────────────────

  renderLayersList(layerNames) {
    const container = document.getElementById('editor-layers-list');
    if (!container || !this.editorScene.mapJsonData) return;

    container.innerHTML = '';

    const allMapLayers = this.editorScene.mapJsonData.layers || [];
    const visualTileLayers = allMapLayers.filter(l => l.type === 'tilelayer' && l.name !== 'Collision');
    const hasCollision = allMapLayers.some(l => l.name === 'Collision') || (this.editorScene.tileLayerData && this.editorScene.tileLayerData['Collision']);

    const eyeOnSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeOffSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.4;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    // 1. Collision layer item (pinned at top of list as special editor tool layer)
    if (hasCollision) {
      const colItem = document.createElement('div');
      colItem.className = `layer-item ${this.editorScene.activeLayerName === 'Collision' ? 'active' : ''}`;
      colItem.dataset.layer = 'Collision';
      colItem.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="layer-visibility-btn" title="Alternar Visibilidade da Colisão">${this.editorScene.showCollisions ? eyeOnSvg : eyeOffSvg}</button>
          <span class="layer-name">Collision</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="layer-type tag-red" title="Camada de máscara de colisões">Colisão</span>
        </div>
      `;

      colItem.addEventListener('click', (e) => {
        if (e.target.closest('.layer-visibility-btn')) return;
        this._selectLayer('Collision');
      });

      const visBtn = colItem.querySelector('.layer-visibility-btn');
      visBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editorScene.toggleCollisions();
        visBtn.innerHTML = this.editorScene.showCollisions ? eyeOnSvg : eyeOffSvg;
      });

      container.appendChild(colItem);
    }

    // 2. Visual tile layers rendered in reverse order (Topmost visual layer first, bottommost visual layer last)
    const numVisual = visualTileLayers.length;
    for (let i = numVisual - 1; i >= 0; i--) {
      const layerObj = visualTileLayers[i];
      const name = layerObj.name;
      const isTop = (i === numVisual - 1);
      const isBottom = (i === 0);

      const props = this.editorScene._readProps(layerObj.properties);
      const isOverhead = props.isOverhead === true || props.depth >= 1000 || (/overhead|arch/i.test(name) && props.isOverhead !== false);

      const item = document.createElement('div');
      item.className = `layer-item ${this.editorScene.activeLayerName === name ? 'active' : ''}`;
      item.dataset.layer = name;

      const tagClass = isOverhead ? 'tag-gold' : 'tag-cyan';
      const tagText = isOverhead ? 'Topo' : 'Chão';
      const tagTooltip = isOverhead
        ? 'Renderiza acima do personagem (z >= 1000). Clique para alternar para Chão.'
        : 'Renderiza abaixo do personagem (z < 100). Clique para alternar para Topo.';

      const pLayer = this.editorScene.phaserLayers[name];
      const isVisible = pLayer ? pLayer.visible : true;

      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
          <button class="layer-visibility-btn" title="Alternar Visibilidade">${isVisible ? eyeOnSvg : eyeOffSvg}</button>
          <span class="layer-name" title="${name}">${name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
          <button class="layer-type-toggle ${tagClass}" title="${tagTooltip}">${tagText}</button>
          <div class="layer-order-group">
            <button class="layer-order-btn btn-layer-up" title="Subir camada (renderizar por cima)" ${isTop ? 'disabled' : ''}>▲</button>
            <button class="layer-order-btn btn-layer-down" title="Descer camada (renderizar por baixo)" ${isBottom ? 'disabled' : ''}>▼</button>
          </div>
        </div>
      `;

      // Select active layer
      item.addEventListener('click', (e) => {
        if (e.target.closest('.layer-visibility-btn') || e.target.closest('.layer-order-btn') || e.target.closest('.layer-type-toggle')) return;
        this._selectLayer(name);
      });

      // Visibility toggle
      const visBtn = item.querySelector('.layer-visibility-btn');
      visBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pL = this.editorScene.phaserLayers[name];
        const newVis = pL ? !pL.visible : false;
        this.editorScene.setLayerVisible(name, newVis);
        visBtn.innerHTML = newVis ? eyeOnSvg : eyeOffSvg;
      });

      // Type toggle (Topo / Chão)
      const typeToggle = item.querySelector('.layer-type-toggle');
      typeToggle.addEventListener('click', async (e) => {
        e.stopPropagation();
        this.editorScene.toggleLayerOverhead(name);
        this.renderLayersList(this.editorScene.allTileLayerNames);
        await this.saveMap();
        this.showToast(`Camada "${name}" configurada como ${isOverhead ? 'Chão (abaixo do jogador)' : 'Topo (acima do jogador)'}!`, 'info');
      });

      // Move Up
      const upBtn = item.querySelector('.btn-layer-up');
      upBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        this._selectLayer(name);
        const moved = this.editorScene.moveLayer(name, 1);
        if (moved) {
          this.renderLayersList(this.editorScene.allTileLayerNames);
          await this.saveMap();
          this.showToast(`Camada "${name}" subiu e foi salva!`, 'success');
        }
      });

      // Move Down
      const downBtn = item.querySelector('.btn-layer-down');
      downBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        this._selectLayer(name);
        const moved = this.editorScene.moveLayer(name, -1);
        if (moved) {
          this.renderLayersList(this.editorScene.allTileLayerNames);
          await this.saveMap();
          this.showToast(`Camada "${name}" desceu e foi salva!`, 'success');
        }
      });

      container.appendChild(item);
    }

    this._updateActiveLayerState();
  }

  _selectLayer(name) {
    document.querySelectorAll('.layer-item').forEach(el => {
      el.classList.toggle('active', el.dataset.layer === name);
    });

    this.editorScene.setActiveLayer(name);
    const indicator = document.getElementById('editor-layer-indicator');
    if (indicator) indicator.textContent = `Camada: ${name}`;

    this._updateActiveLayerState();
  }

  _updateActiveLayerState() {
    const name = this.editorScene.activeLayerName;
    const isCol = name === 'Collision';

    document.getElementById('editor-collision-palette')?.classList.toggle('hidden', !isCol);
    document.querySelector('.tileset-section')?.classList.toggle('hidden', isCol);

    if (isCol) {
      if (['sign', 'link', 'object'].includes(this.editorScene.activeTool)) {
        this.selectTool('pencil');
      }
      this.selectCollisionType(this.editorScene.selectedCollisionType || COLLISION_TYPES.SOLID);
    } else {
      if (['sign', 'link', 'object'].includes(this.editorScene.activeTool)) {
        this.selectTool('pencil');
      }
      const indicator = document.getElementById('editor-gid-indicator');
      if (indicator) indicator.textContent = `GID: ${this.activeGid}`;
    }
  }

  // ─── Portals List & Editor ────────────────────────────────────────────────

  renderPortalsList() {
    const container = document.getElementById('editor-portals-list');
    if (!container || !this.editorScene.mapJsonData) return;

    container.innerHTML = '';
    const portalLayer = this.editorScene.mapJsonData.layers.find(l => (l.name === 'Portals' || l.name === 'Warps') && l.type === 'objectgroup');

    if (!portalLayer || portalLayer.objects.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#888; text-align:center; padding:16px;">Nenhum portal cadastrado neste mapa. Clique em "Novo Portal" para adicionar.</div>`;
      return;
    }

    portalLayer.objects.forEach(obj => {
      const props = this.editorScene._readProps(obj.properties);
      const targetRoom = props.targetRoom || obj.name || 'Desconhecido';
      const targetX = props.targetX ?? obj.x;
      const targetY = props.targetY ?? obj.y;

      const card = document.createElement('div');
      card.className = 'portal-card';
      card.innerHTML = `
        <div class="portal-card-header">
          <span style="display:inline-flex; align-items:center; gap:4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M14 12v.01"></path></svg>
            <span>${props.label || obj.name || 'Portal'}</span>
          </span>
          <span style="color:var(--fr-gold); font-size:11px;">[${obj.x}, ${obj.y}]</span>
        </div>
        <div class="portal-card-details">
          <div>Destino: <strong>${targetRoom}</strong></div>
          <div>Spawn Destino: [${targetX}, ${targetY}]</div>
        </div>
        <div class="portal-card-actions">
          <button class="editor-btn small primary btn-edit-p">Configurar</button>
          <button class="editor-btn small secondary btn-jump-p">Ir para Destino</button>
        </div>
      `;

      card.querySelector('.btn-edit-p').addEventListener('click', () => this.openPortalModal({ ...obj, layerName: portalLayer.name }));
      card.querySelector('.btn-jump-p').addEventListener('click', () => this.editorScene.loadMapByName(targetRoom));

      container.appendChild(card);
    });
  }

  openPortalModal(obj) {
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = false;
    }
    this.editorScene.selectedObject = obj;
    this.editorScene.drawObjects();

    const modal = document.getElementById('editor-portal-modal');
    if (!modal) return;

    // Atualizar badge do mapa de origem
    const originBadge = document.getElementById('portal-origin-map-badge');
    if (originBadge) {
      originBadge.textContent = this.editorScene.currentMapName;
    }

    const props = this.editorScene._readProps(obj.properties);
    const fallbackTarget = (this.editorScene.currentMapName === 'pallet_oak_lab') ? 'kanto' : 'pallet_oak_lab';
    const chosenTarget = props.targetRoom || fallbackTarget;

    document.getElementById('portal-prop-label').value = props.label || obj.name || `Conexão ${this.editorScene.currentMapName} ⇄ ${chosenTarget}`;
    document.getElementById('portal-prop-target-room').value = chosenTarget;
    document.getElementById('portal-prop-target-x').value = props.targetX ?? 0;
    document.getElementById('portal-prop-target-y').value = props.targetY ?? 0;
    document.getElementById('portal-prop-x').value = obj.x || 0;
    document.getElementById('portal-prop-y').value = obj.y || 0;
    document.getElementById('portal-prop-w').value = obj.width || 32;
    document.getElementById('portal-prop-h').value = obj.height || 32;

    modal.classList.remove('hidden');
  }

  async savePortalModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const label = document.getElementById('portal-prop-label').value;
    const targetRoom = document.getElementById('portal-prop-target-room').value;
    const targetX = parseInt(document.getElementById('portal-prop-target-x').value, 10) || 0;
    const targetY = parseInt(document.getElementById('portal-prop-target-y').value, 10) || 0;
    const x = parseInt(document.getElementById('portal-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('portal-prop-y').value, 10) || 0;
    const w = parseInt(document.getElementById('portal-prop-w').value, 10) || 32;
    const h = parseInt(document.getElementById('portal-prop-h').value, 10) || 32;

    let target = null;
    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        const found = layer.objects.find(o => o.id == current.id || (o.x === current.x && o.y === current.y));
        if (found) {
          target = found;
          break;
        }
      }
    }

    if (!target) {
      const portalLayer = this.editorScene._getOrCreateObjectLayer('Portals');
      target = {
        id: current.id || Date.now(),
        name: label,
        type: 'portal_link',
        x,
        y,
        width: w,
        height: h,
        properties: []
      };
      portalLayer.objects.push(target);
    }

    target.name = label;
    target.x = x;
    target.y = y;
    target.width = w;
    target.height = h;
    target.properties = [
      { name: 'targetRoom', value: targetRoom },
      { name: 'targetX', value: targetX },
      { name: 'targetY', value: targetY },
      { name: 'label', value: label },
      { name: 'isLinked', value: true }
    ];

    this.editorScene.drawObjects();
    this.renderPortalsList();
    document.getElementById('editor-portal-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();

    // Sempre sincronizar o portal de retorno no mapa parceiro de forma bidirecional
    if (targetRoom && targetRoom !== this.editorScene.currentMapName) {
      const returnTargetSpawnX = x + Math.floor(w / 2);
      const returnTargetSpawnY = y + h + 16;
      await this.saveReturnPortal(targetRoom, this.editorScene.currentMapName, targetX, targetY, returnTargetSpawnX, returnTargetSpawnY);
    }
  }

  async saveReturnPortal(targetRoom, sourceMapName, returnX, returnY, returnTargetX, returnTargetY) {
    try {
      const res = await fetch(`/api/admin/map?map=${encodeURIComponent(targetRoom)}`);
      if (!res.ok) return;
      const targetMapJson = await res.json();
      if (!targetMapJson || !targetMapJson.layers) return;

      let portalLayer = targetMapJson.layers.find(l => (l.name === 'Portals' || l.name === 'Warps' || l.name === 'Doors') && l.type === 'objectgroup');
      if (!portalLayer) {
        portalLayer = {
          name: 'Portals',
          type: 'objectgroup',
          visible: true,
          opacity: 1,
          objects: []
        };
        targetMapJson.layers.push(portalLayer);
      }

      let existingReturn = portalLayer.objects.find(o => {
        const p = this.editorScene._readProps(o.properties);
        return p.targetRoom === sourceMapName || (Math.abs(o.x - returnX) < 16 && Math.abs(o.y - returnY) < 16);
      });

      if (!existingReturn) {
        existingReturn = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: `Saída para ${sourceMapName}`,
          type: 'portal_link',
          x: returnX,
          y: returnY,
          width: 32,
          height: 32,
          properties: []
        };
        portalLayer.objects.push(existingReturn);
      }

      existingReturn.name = `Saída para ${sourceMapName}`;
      existingReturn.properties = [
        { name: 'targetRoom', value: sourceMapName },
        { name: 'targetX', value: returnTargetX },
        { name: 'targetY', value: returnTargetY },
        { name: 'label', value: `Saída para ${sourceMapName}` },
        { name: 'isLinked', value: true }
      ];

      await fetch(`/api/admin/map?map=${encodeURIComponent(targetRoom)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetMapJson)
      });

      // Atualizar ROOMS_CONFIG em memória
      if (ROOMS_CONFIG[targetRoom]) {
        if (!ROOMS_CONFIG[targetRoom].portals) ROOMS_CONFIG[targetRoom].portals = [];
        ROOMS_CONFIG[targetRoom].portals = ROOMS_CONFIG[targetRoom].portals.filter(p => p.targetRoom !== sourceMapName);
        ROOMS_CONFIG[targetRoom].portals.push({
          trigger: { x: existingReturn.x, y: existingReturn.y, width: existingReturn.width || 32, height: existingReturn.height || 32 },
          targetRoom: sourceMapName,
          targetSpawn: { x: returnTargetX, y: returnTargetY },
          label: `Saída para ${sourceMapName}`
        });
      }

      this.showToast(`✨ Conexão bidirecional em '${targetRoom}' sincronizada!`, 'success');
    } catch (err) {
      console.warn('[saveReturnPortal] Falha ao sincronizar portal de retorno:', err);
    }
  }

  async deletePortalModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const props = this.editorScene._readProps(current.properties);
    const targetRoom = props.targetRoom;
    const currentMapName = this.editorScene.currentMapName;

    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        layer.objects = layer.objects.filter(o => o.id != current.id && !(o.x === current.x && o.y === current.y));
      }
    }

    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    this.renderPortalsList();
    document.getElementById('editor-portal-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();

    // Sincronizar remoção no mapa parceiro para manter ambas as pontas alinhadas
    if (targetRoom && targetRoom !== currentMapName) {
      try {
        const res = await fetch(`/api/admin/map?map=${encodeURIComponent(targetRoom)}`);
        if (res.ok) {
          const targetMapJson = await res.json();
          let changed = false;
          for (const layer of targetMapJson.layers || []) {
            if (layer.type === 'objectgroup' && layer.objects) {
              const countBefore = layer.objects.length;
              layer.objects = layer.objects.filter(o => {
                const op = this.editorScene._readProps(o.properties);
                return op.targetRoom !== currentMapName;
              });
              if (layer.objects.length !== countBefore) {
                changed = true;
              }
            }
          }
          if (changed) {
            await fetch(`/api/admin/map?map=${encodeURIComponent(targetRoom)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(targetMapJson)
            });
            if (ROOMS_CONFIG[targetRoom] && ROOMS_CONFIG[targetRoom].portals) {
              ROOMS_CONFIG[targetRoom].portals = ROOMS_CONFIG[targetRoom].portals.filter(p => p.targetRoom !== currentMapName);
            }
            this.showToast(`Portal correspondente em '${targetRoom}' também foi removido.`, 'info');
          }
        }
      } catch (err) {
        console.warn('[deletePortalModal] Erro ao sincronizar remoção no mapa destino:', err);
      }
    }
  }

  // ─── Signs & Conversations List & Editor ──────────────────────────────────

  renderSignsList() {
    const container = document.getElementById('editor-signs-list');
    if (!container || !this.editorScene.mapJsonData) return;

    container.innerHTML = '';
    const signLayer = this.editorScene.mapJsonData.layers.find(l => (l.name === 'Points of interest' || l.name === 'Signs') && l.type === 'objectgroup');

    if (!signLayer || signLayer.objects.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#888; text-align:center; padding:16px;">Nenhuma placa cadastrada. Clique em "Nova Placa" ou use a ferramenta de placa para colocar no mapa.</div>`;
      return;
    }

    signLayer.objects.forEach(obj => {
      const props = this.editorScene._readProps(obj.properties);
      const title = props.title || obj.name || 'Placa';
      const text = props.text || props.dialogue || '';

      const card = document.createElement('div');
      card.className = 'sign-card';
      card.innerHTML = `
        <div class="sign-card-header">
          <span style="display:inline-flex; align-items:center; gap:4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 6h14v8H5z"></path><path d="M12 14v7"></path></svg>
            <span>${title}</span>
          </span>
          <span style="color:var(--fr-gold); font-size:11px;">[${obj.x}, ${obj.y}]</span>
        </div>
        <div class="sign-card-text">"${text}"</div>
        <div class="portal-card-actions">
          <button class="editor-btn small gold btn-test-s" style="display:inline-flex; align-items:center; gap:4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Testar</span>
          </button>
          <button class="editor-btn small primary btn-edit-s">Editar</button>
        </div>
      `;

      card.querySelector('.btn-test-s').addEventListener('click', () => this.dialogueBox.show(title, text));
      card.querySelector('.btn-edit-s').addEventListener('click', () => this.openSignModal({ ...obj, layerName: signLayer.name }));

      container.appendChild(card);
    });
  }

  openSignModal(sign) {
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = false;
    }
    this.editorScene.selectedObject = sign;
    this.editorScene.drawObjects();

    const modal = document.getElementById('editor-sign-modal');
    if (!modal) return;

    const props = this.editorScene._readProps(sign.properties);
    document.getElementById('sign-prop-title').value = props.title || sign.name || '';
    document.getElementById('sign-prop-text').value = props.text || props.dialogue || '';
    document.getElementById('sign-prop-x').value = sign.x || 0;
    document.getElementById('sign-prop-y').value = sign.y || 0;

    modal.classList.remove('hidden');
  }

  async saveSignModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const title = document.getElementById('sign-prop-title').value;
    const text = document.getElementById('sign-prop-text').value;
    const x = parseInt(document.getElementById('sign-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('sign-prop-y').value, 10) || 0;

    let target = null;
    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        const found = layer.objects.find(o => o.id == current.id || (o.x === current.x && o.y === current.y));
        if (found) {
          target = found;
          break;
        }
      }
    }

    if (!target) {
      const signLayer = this.editorScene._getOrCreateObjectLayer('Points of interest');
      target = {
        id: current.id || Date.now(),
        name: title,
        type: 'sign',
        x,
        y,
        width: 32,
        height: 32,
        properties: []
      };
      signLayer.objects.push(target);
    }

    target.name = title;
    target.x = x;
    target.y = y;
    target.properties = [
      { name: 'title', value: title },
      { name: 'text', value: text }
    ];

    current.name = title;
    current.x = x;
    current.y = y;
    current.properties = [
      { name: 'title', value: title },
      { name: 'text', value: text }
    ];

    this.editorScene.drawObjects();
    this.renderSignsList();
    document.getElementById('editor-sign-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }

    // Automatically persist to the server so it reflects immediately in the game!
    await this.saveMap();
  }

  async deleteSignModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        layer.objects = layer.objects.filter(o => o.id != current.id && !(o.x === current.x && o.y === current.y));
      }
    }

    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    this.renderSignsList();
    document.getElementById('editor-sign-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }

    // Automatically persist deletion to server
    await this.saveMap();
  }

  // ─── Generic Object Modal ─────────────────────────────────────────────────

  openObjectModal(obj) {
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = false;
    }
    const modal = document.getElementById('editor-object-modal');
    if (!modal) return;
    document.getElementById('obj-prop-layer').value = obj.layerName || 'Objects';
    document.getElementById('obj-prop-name').value = obj.name || '';
    document.getElementById('obj-prop-x').value = obj.x || 0;
    document.getElementById('obj-prop-y').value = obj.y || 0;
    modal.classList.remove('hidden');
  }

  async saveObjectModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const name = document.getElementById('obj-prop-name').value;
    const x = parseInt(document.getElementById('obj-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('obj-prop-y').value, 10) || 0;

    const layer = this.editorScene.mapJsonData.layers.find(l => l.name === current.layerName);
    if (layer) {
      const target = layer.objects.find(o => o.id === current.id);
      if (target) {
        target.name = name;
        target.x = x;
        target.y = y;
      }
    }

    this.editorScene.drawObjects();
    document.getElementById('editor-object-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();
  }

  async deleteObjectModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const layer = this.editorScene.mapJsonData.layers.find(l => l.name === current.layerName);
    if (layer) {
      layer.objects = layer.objects.filter(o => o.id !== current.id);
    }
    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    document.getElementById('editor-object-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();
  }

  // ─── Zones List & Editor ──────────────────────────────────────────────────

  renderZonesList() {
    const container = document.getElementById('editor-zones-list');
    if (!container || !this.editorScene.mapJsonData) return;

    container.innerHTML = '';
    const zoneLayer = this.editorScene.mapJsonData.layers.find(l => (l.name === 'Zones' || l.name === 'Regiões') && l.type === 'objectgroup');

    if (!zoneLayer || zoneLayer.objects.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#888; text-align:center; padding:16px;">Nenhuma zona cadastrada. Clique em "Nova Zona" ou use a ferramenta (Z) para desenhar no mapa.</div>`;
      return;
    }

    zoneLayer.objects.forEach(obj => {
      const props = this.editorScene._readProps(obj.properties);
      const name = props.name || obj.name || 'Zona sem nome';
      const status = props.status || 'pending';
      const note = props.note || props.message || '';
      const color = props.color || '#00e5ff';

      const statusBadges = {
        completed: '<span style="background: rgba(0,230,118,0.2); color: #00e676; border: 1px solid #00e676; padding: 2px 6px; border-radius: 4px; font-weight:700;">Concluído</span>',
        ready: '<span style="background: rgba(0,230,118,0.2); color: #00e676; border: 1px solid #00e676; padding: 2px 6px; border-radius: 4px; font-weight:700;">Concluído</span>',
        pending: '<span style="background: rgba(255,179,0,0.2); color: #ffb300; border: 1px solid #ffb300; padding: 2px 6px; border-radius: 4px; font-weight:700;">Pendente</span>',
        dev: '<span style="background: rgba(255,179,0,0.2); color: #ffb300; border: 1px solid #ffb300; padding: 2px 6px; border-radius: 4px; font-weight:700;">Pendente</span>'
      };

      const card = document.createElement('div');
      card.className = 'portal-card';
      card.style.borderLeft = `4px solid ${color}`;
      card.innerHTML = `
        <div class="portal-card-header">
          <span style="display:inline-flex; align-items:center; gap:6px; font-weight:700;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"></rect><path d="M3 9h18"></path></svg>
            <span>${name}</span>
          </span>
          ${statusBadges[status] || statusBadges.pending}
        </div>
        <div class="portal-card-details" style="margin: 6px 0;">
          <div>Dimensões: <strong>${obj.width || 64}x${obj.height || 64}px</strong> | Pos: [${obj.x}, ${obj.y}]</div>
          ${note ? `<div style="margin-top:4px; font-style:italic; color:#e2e8f0; background:rgba(255,255,255,0.05); padding:4px 6px; border-radius:4px;">"${note}"</div>` : ''}
        </div>
        <div class="portal-card-actions">
          <button class="editor-btn small primary btn-edit-z">Configurar</button>
          <button class="editor-btn small gold btn-redraw-z">Redesenhar</button>
          <button class="editor-btn small secondary btn-focus-z">Focar Zona</button>
          <button class="editor-btn small danger btn-delete-z">Excluir</button>
        </div>
      `;

      card.querySelector('.btn-edit-z').addEventListener('click', () => this.openZoneModal({ ...obj, layerName: zoneLayer.name }));
      card.querySelector('.btn-redraw-z').addEventListener('click', () => {
        this.editorScene.selectedObject = { ...obj, layerName: zoneLayer.name };
        this.editorScene.startZoneRedraw(this.editorScene.selectedObject);
        this.showToast('Clique e arraste no mapa para redesenhar o retângulo da zona.', 'info');
      });
      card.querySelector('.btn-focus-z').addEventListener('click', () => {
        if (this.editorScene.cameras?.main) {
          this.editorScene.cameras.main.centerOn((obj.x || 0) + (obj.width || 64) / 2, (obj.y || 0) + (obj.height || 64) / 2);
        }
      });
      card.querySelector('.btn-delete-z').addEventListener('click', async () => {
        if (confirm(`Tem certeza que deseja excluir a zona "${name}"?`)) {
          this.editorScene.selectedObject = { ...obj, layerName: zoneLayer.name };
          await this.deleteZoneModal();
        }
      });

      container.appendChild(card);
    });
  }

  openZoneModal(zone) {
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = false;
    }
    this.editorScene.selectedObject = zone;
    this.editorScene.drawObjects();

    const modal = document.getElementById('editor-zone-modal');
    if (!modal) return;

    const props = this.editorScene._readProps(zone.properties);
    document.getElementById('zone-prop-name').value = props.name || zone.name || '';
    document.getElementById('zone-prop-type').value = props.type || 'city';
    document.getElementById('zone-prop-status').value = props.status === 'completed' || props.status === 'ready' ? 'completed' : 'pending';
    document.getElementById('zone-prop-color').value = props.color || '#00e5ff';
    document.getElementById('zone-prop-note').value = props.note || props.message || '';
    document.getElementById('zone-prop-x').value = zone.x || 0;
    document.getElementById('zone-prop-y').value = zone.y || 0;
    document.getElementById('zone-prop-w').value = zone.width || 128;
    document.getElementById('zone-prop-h').value = zone.height || 128;

    modal.classList.remove('hidden');
  }

  async saveZoneModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const name = document.getElementById('zone-prop-name').value;
    const type = document.getElementById('zone-prop-type').value;
    const status = document.getElementById('zone-prop-status').value;
    const color = document.getElementById('zone-prop-color').value;
    const note = document.getElementById('zone-prop-note').value;
    const x = parseInt(document.getElementById('zone-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('zone-prop-y').value, 10) || 0;
    const w = parseInt(document.getElementById('zone-prop-w').value, 10) || 128;
    const h = parseInt(document.getElementById('zone-prop-h').value, 10) || 128;

    let target = null;
    const zoneLayer = this.editorScene._getOrCreateObjectLayer('Zones');
    if (zoneLayer.objects) {
      target = zoneLayer.objects.find(o => o.id == current.id || (o.x === current.x && o.y === current.y));
    }

    if (!target) {
      target = {
        id: current.id || Date.now(),
        name,
        type: 'zone',
        x,
        y,
        width: w,
        height: h,
        properties: []
      };
      zoneLayer.objects.push(target);
    }

    target.name = name;
    target.x = x;
    target.y = y;
    target.width = w;
    target.height = h;
    target.properties = [
      { name: 'name', value: name },
      { name: 'type', value: type },
      { name: 'status', value: status },
      { name: 'color', value: color },
      { name: 'note', value: note }
    ];

    current.name = name;
    current.x = x;
    current.y = y;
    current.width = w;
    current.height = h;
    current.properties = target.properties;

    this.editorScene.drawObjects();
    this.renderZonesList();
    document.getElementById('editor-zone-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }

    await this.saveMap();
  }

  async deleteZoneModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        layer.objects = layer.objects.filter(o => o.id != current.id && !(o.x === current.x && o.y === current.y));
      }
    }

    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    this.renderZonesList();
    document.getElementById('editor-zone-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();
  }

  // ─── Spawns List & Editor (Pokestop.io Style) ─────────────────────────────

  renderSpawnsList() {
    const container = document.getElementById('editor-spawns-list');
    if (!container || !this.editorScene.mapJsonData) return;

    container.innerHTML = '';
    const spawnLayer = this.editorScene.mapJsonData.layers.find(l => (l.name === 'PokemonSpawns' || l.name === 'Spawns' || l.name === 'Encounters') && l.type === 'objectgroup');

    if (!spawnLayer || spawnLayer.objects.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#888; text-align:center; padding:16px;">Nenhuma área de spawn cadastrada. Clique em "Nova Área" ou use a ferramenta (P) para desenhar no mapa.</div>`;
      return;
    }

    spawnLayer.objects.forEach(obj => {
      const props = this.editorScene._readProps(obj.properties);
      const name = props.name || obj.name || 'Área de Spawn';
      const encounterType = props.encounterType || 'grass';
      const rate = props.rate || 10;
      let pList = [];
      try {
        pList = typeof props.pokemonSpawns === 'string' ? JSON.parse(props.pokemonSpawns) : (props.pokemonSpawns || []);
      } catch (e) {
        pList = [];
      }

      const typeBadges = {
        grass: '<span style="color:#00e676;">Grama Alta</span>',
        water: '<span style="color:#00e5ff;">Água</span>',
        fishing: '<span style="color:#ffb300;">Pesca</span>',
        cave: '<span style="color:#e0e0e0;">Caverna</span>'
      };

      const speciesBadgesHtml = pList.slice(0, 5).map(p => {
        const paddedId = String(p.speciesId || 16).padStart(3, '0');
        const pokeObj = KANTO_POKEMON_LIST.find(k => k.id === (p.speciesId || 16)) || { name: `ID #${p.speciesId}` };
        return `
          <div style="display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:12px; font-size:10px;">
            <img src="/assets/pokemon/animated/front/normal/${paddedId}.gif" width="22" height="22" style="image-rendering:pixelated;" />
            <span>${pokeObj.name} (L. ${p.minLevel}-${p.maxLevel})</span>
          </div>
        `;
      }).join('');

      const card = document.createElement('div');
      card.className = 'portal-card';
      card.innerHTML = `
        <div class="portal-card-header">
          <span style="display:inline-flex; align-items:center; gap:6px; font-weight:700;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path></svg>
            <span>${name}</span>
          </span>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="display:inline-flex; align-items:center; gap:3px; background:rgba(59,130,246,0.18); border:1px solid rgba(59,130,246,0.4); color:#93c5fd; padding:1px 6px; border-radius:10px; font-size:10px; font-weight:700;">⚔️ Arena: ${props.arena || 'grass'}</span>
            <span style="font-size:11px; font-weight:700;">${typeBadges[encounterType] || encounterType} (${rate}%)</span>
          </div>
        </div>
        <div style="margin: 6px 0; display:flex; flex-wrap:wrap; gap:4px;">
          ${speciesBadgesHtml || '<span style="color:#888; font-size:11px;">Nenhuma espécie configurada</span>'}
          ${pList.length > 5 ? `<span style="font-size:10px; color:#ffb300; align-self:center;">+${pList.length - 5} mais</span>` : ''}
        </div>
        <div class="portal-card-actions">
          <button class="editor-btn small primary btn-edit-sp">Configurar (Pokéstop)</button>
          <button class="editor-btn small secondary btn-focus-sp">Focar Área</button>
          <button class="editor-btn small danger btn-delete-sp">Excluir</button>
        </div>
      `;

      card.querySelector('.btn-edit-sp').addEventListener('click', () => this.openSpawnModal({ ...obj, layerName: spawnLayer.name }));
      card.querySelector('.btn-focus-sp').addEventListener('click', () => {
        if (this.editorScene.cameras?.main) {
          this.editorScene.cameras.main.centerOn((obj.x || 0) + (obj.width || 64) / 2, (obj.y || 0) + (obj.height || 64) / 2);
        }
      });
      card.querySelector('.btn-delete-sp').addEventListener('click', async () => {
        if (confirm(`Tem certeza que deseja excluir a área de spawn "${name}"?`)) {
          this.editorScene.selectedObject = { ...obj, layerName: spawnLayer.name };
          await this.deleteSpawnModal();
        }
      });

      container.appendChild(card);
    });
  }

  // ─── Arena Battle Spawns View (Player & Rival) ──────────────────────────

  renderArenaSpawnsView() {
    if (!this.editorScene.mapJsonData) return;

    const tileW = (this.editorScene.map && this.editorScene.map.tileWidth) ? this.editorScene.map.tileWidth : 32;
    const tileH = (this.editorScene.map && this.editorScene.map.tileHeight) ? this.editorScene.map.tileHeight : 32;

    const playerSpawn = this.editorScene.getOrCreateArenaSpawn('player', 352, 288, 'right');
    const rivalSpawn = this.editorScene.getArenaSpawn('opponent');

    // Player inputs
    const playerXInput = document.getElementById('arena-player-x');
    const playerYInput = document.getElementById('arena-player-y');
    const playerFacing = document.getElementById('arena-player-facing');
    const playerBadge = document.getElementById('arena-player-tile-badge');

    if (playerXInput) playerXInput.value = playerSpawn.x || 0;
    if (playerYInput) playerYInput.value = playerSpawn.y || 0;
    if (playerFacing) {
      const pProps = this.editorScene._readProps(playerSpawn.properties);
      playerFacing.value = pProps.facing || 'right';
    }
    if (playerBadge) {
      const tX = Math.floor((playerSpawn.x || 0) / tileW);
      const tY = Math.floor((playerSpawn.y || 0) / tileH);
      playerBadge.textContent = `Tile [${tX}, ${tY}]`;
    }

    // Rival inputs
    const rivalEnabled = document.getElementById('arena-rival-enabled');
    const rivalFields = document.getElementById('arena-rival-fields');
    const rivalXInput = document.getElementById('arena-rival-x');
    const rivalYInput = document.getElementById('arena-rival-y');
    const rivalFacing = document.getElementById('arena-rival-facing');
    const rivalBadge = document.getElementById('arena-rival-tile-badge');

    if (rivalEnabled) {
      rivalEnabled.checked = !!rivalSpawn;
    }
    if (rivalFields) {
      rivalFields.style.opacity = rivalSpawn ? '1' : '0.4';
      rivalFields.style.pointerEvents = rivalSpawn ? 'auto' : 'none';
    }

    if (rivalSpawn) {
      if (rivalXInput) rivalXInput.value = rivalSpawn.x || 0;
      if (rivalYInput) rivalYInput.value = rivalSpawn.y || 0;
      if (rivalFacing) {
        const rProps = this.editorScene._readProps(rivalSpawn.properties);
        rivalFacing.value = rProps.facing || 'left';
      }
      if (rivalBadge) {
        const tX = Math.floor((rivalSpawn.x || 0) / tileW);
        const tY = Math.floor((rivalSpawn.y || 0) / tileH);
        rivalBadge.textContent = `Tile [${tX}, ${tY}]`;
      }
    } else {
      if (rivalBadge) rivalBadge.textContent = `Desativado`;
    }
  }

  async fetchSpeciesList() {
    try {
      const res = await fetch('/api/admin/encounter-zones/species');
      const data = await res.json();
      if (data?.success && Array.isArray(data.species) && data.species.length > 0) {
        this.databaseSpecies = data.species;
      }
    } catch (e) {
      this.databaseSpecies = KANTO_POKEMON_LIST;
    }
  }

  setupSpawnModalEvents() {
    // Tab switching
    document.getElementById('tab-btn-spawn-map')?.addEventListener('click', () => this.switchSpawnTab('map'));
    document.getElementById('tab-btn-spawn-pokemon')?.addEventListener('click', () => this.switchSpawnTab('pokemon'));

    // Dynamic tile summary calculation when coordinate inputs change
    ['spawn-prop-x', 'spawn-prop-y', 'spawn-prop-w', 'spawn-prop-h'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.updateSpawnTileSummary());
    });

    // Period distribution view toggle (Manhã, Tarde, Noite, Madrugada)
    this.activeSpawnPeriod = 'morning';
    const setPeriodView = (period) => {
      this.activeSpawnPeriod = period;
      document.getElementById('btn-period-morning')?.classList.toggle('active', period === 'morning');
      document.getElementById('btn-period-afternoon')?.classList.toggle('active', period === 'afternoon');
      document.getElementById('btn-period-night')?.classList.toggle('active', period === 'night');
      document.getElementById('btn-period-dawn')?.classList.toggle('active', period === 'dawn');
      this.updateSpawnPercentages();
    };

    document.getElementById('btn-period-morning')?.addEventListener('click', () => setPeriodView('morning'));
    document.getElementById('btn-period-afternoon')?.addEventListener('click', () => setPeriodView('afternoon'));
    document.getElementById('btn-period-night')?.addEventListener('click', () => setPeriodView('night'));
    document.getElementById('btn-period-dawn')?.addEventListener('click', () => setPeriodView('dawn'));

    // Normalize weights button
    document.getElementById('btn-normalize-spawn-weights')?.addEventListener('click', () => this.normalizeSpawnWeights());

    // Add Pokemon button
    document.getElementById('btn-add-spawn-pokemon-row')?.addEventListener('click', () => {
      this.addSpawnPokemonRow({ speciesId: 16, minLevel: 2, maxLevel: 5, morningChance: 25, afternoonChance: 25, nightChance: 25, dawnChance: 25 });
    });

    // Copy Zone Config buttons
    document.getElementById('btn-apply-copy-zone')?.addEventListener('click', () => {
      this.applyCopiedSpawnConfig();
    });
    document.getElementById('spawn-copy-source-select')?.addEventListener('change', (e) => {
      if (e.target.value) {
        this.applyCopiedSpawnConfig();
      }
    });

    // Search and Autocomplete from Database
    const searchInput = document.getElementById('spawn-pokemon-search');
    const clearBtn = document.getElementById('btn-clear-spawn-search');
    const autocompleteDropdown = document.getElementById('spawn-search-autocomplete');

    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';
        
        // Filter existing cards in area
        this.filterSpawnPokemonTable(query);

        // Autocomplete search from database
        await this.renderSpawnSearchAutocomplete(query);
      });

      searchInput.addEventListener('focus', async () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) await this.renderSpawnSearchAutocomplete(query);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstItem = autocompleteDropdown?.querySelector('.spawn-autocomplete-item');
          if (firstItem) {
            firstItem.click();
          }
        }
      });
    }

    clearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearBtn.style.display = 'none';
      this.filterSpawnPokemonTable('');
      if (autocompleteDropdown) autocompleteDropdown.classList.add('hidden');
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#spawn-pokemon-search') && !e.target.closest('#spawn-search-autocomplete')) {
        autocompleteDropdown?.classList.add('hidden');
      }
    });

    // Custom Stepper Buttons Delegated Click Handler
    const spawnModal = document.getElementById('editor-spawn-modal');
    spawnModal?.addEventListener('click', (e) => {
      const btn = e.target.closest('.stepper-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const wrap = btn.closest('.custom-stepper-wrap');
      const input = wrap?.querySelector('input[type="number"]');
      if (!input || input.disabled) return;

      const step = parseFloat(input.step) || 1;
      const min = input.min !== '' ? parseFloat(input.min) : -Infinity;
      const max = input.max !== '' ? parseFloat(input.max) : Infinity;
      let val = parseFloat(input.value);
      if (isNaN(val)) val = 0;

      if (btn.classList.contains('btn-step-up')) {
        val = Math.min(max, val + step);
      } else if (btn.classList.contains('btn-step-down')) {
        val = Math.max(min, val - step);
      }

      input.value = val;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  async fetchSpeciesList() {
    if (this.databaseSpecies && this.databaseSpecies.length > 0) return this.databaseSpecies;
    try {
      const res = await fetch('/api/admin/encounter-zones/species');
      const data = await res.json();
      if (data?.success && Array.isArray(data.species) && data.species.length > 0) {
        this.databaseSpecies = data.species;
        return this.databaseSpecies;
      }
    } catch (e) {
      console.warn('[EditorUI] Falha ao carregar espécies do banco, usando fallback:', e);
    }
    this.databaseSpecies = KANTO_POKEMON_LIST;
    return this.databaseSpecies;
  }

  switchSpawnTab(tabName) {
    const isMap = tabName === 'map';
    const tabBtnMap = document.getElementById('tab-btn-spawn-map');
    const tabBtnPoke = document.getElementById('tab-btn-spawn-pokemon');
    const paneMap = document.getElementById('tab-pane-spawn-map');
    const panePoke = document.getElementById('tab-pane-spawn-pokemon');

    tabBtnMap?.classList.toggle('active', isMap);
    tabBtnPoke?.classList.toggle('active', !isMap);
    paneMap?.classList.toggle('hidden', !isMap);
    panePoke?.classList.toggle('hidden', isMap);

    if (!isMap) {
      this.updateSpawnPercentages();
    }
  }

  updateSpawnTileSummary() {
    const x = parseInt(document.getElementById('spawn-prop-x')?.value, 10) || 0;
    const y = parseInt(document.getElementById('spawn-prop-y')?.value, 10) || 0;
    const w = parseInt(document.getElementById('spawn-prop-w')?.value, 10) || 64;
    const h = parseInt(document.getElementById('spawn-prop-h')?.value, 10) || 64;

    const tx = Math.floor(x / 32);
    const ty = Math.floor(y / 32);
    const tw = Math.ceil(w / 32);
    const th = Math.ceil(h / 32);

    const summaryEl = document.getElementById('spawn-tile-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `<span style="display:inline-flex; align-items:center; gap:5px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>Tiles: [${tx}, ${ty}] • Dimensões: ${tw}x${th} tiles (${w}x${h}px)</span></span>`;
    }
  }

  filterSpawnPokemonTable(query) {
    const cards = document.querySelectorAll('.spawn-card-row');
    cards.forEach(c => {
      if (!query) {
        c.style.display = '';
        return;
      }
      const select = c.querySelector('.row-species-select');
      const optText = select ? select.options[select.selectedIndex]?.text.toLowerCase() : '';
      const match = optText.includes(query) || String(select?.value).includes(query);
      c.style.display = match ? '' : 'none';
    });
  }

  async renderSpawnSearchAutocomplete(query) {
    const dropdown = document.getElementById('spawn-search-autocomplete');
    if (!dropdown) return;

    if (!query) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }

    const speciesList = await this.fetchSpeciesList();
    const cleanNum = parseInt(query.replace('#', ''), 10);
    const matches = speciesList.filter(s => {
      const name = (s.name || '').toLowerCase();
      const id = String(s.id || '');
      const paddedId = id.padStart(3, '0');
      const idMatch = !isNaN(cleanNum) && s.id === cleanNum;
      const typeMatch = (s.type1 && s.type1.toLowerCase().includes(query)) || (s.type2 && s.type2.toLowerCase().includes(query));
      return name.includes(query) || id === query || paddedId.includes(query) || idMatch || typeMatch;
    }).slice(0, 12);

    if (matches.length === 0) {
      dropdown.innerHTML = `<div style="padding: 14px; color: #94a3b8; font-size: 11px; text-align: center;">Nenhum Pokémon encontrado no banco para "<strong>${query}</strong>"</div>`;
      dropdown.classList.remove('hidden');
      return;
    }

    const typeColors = {
      GRASS: '#10b981', POISON: '#a855f7', FIRE: '#f97316', WATER: '#3b82f6',
      ELECTRIC: '#eab308', BUG: '#84cc16', NORMAL: '#94a3b8', FLYING: '#60a5fa',
      PSYCHIC: '#ec4899', GHOST: '#7c3aed', GROUND: '#d97706', ROCK: '#78716c',
      FIGHTING: '#ef4444', ICE: '#06b6d4', DRAGON: '#6366f1'
    };

    dropdown.innerHTML = matches.map(s => {
      const paddedId = String(s.id).padStart(3, '0');
      const t1 = s.type1 ? `<span class="spawn-type-tag" style="background:${typeColors[s.type1.toUpperCase()] || '#3b82f6'}; color:#fff;">${s.type1}</span>` : '';
      const t2 = s.type2 ? `<span class="spawn-type-tag" style="background:${typeColors[s.type2.toUpperCase()] || '#64748b'}; color:#fff;">${s.type2}</span>` : '';
      return `
        <div class="spawn-autocomplete-item" data-id="${s.id}">
          <img src="/assets/pokemon/animated/front/normal/${paddedId}.gif" alt="${s.name}" onerror="this.src='/assets/pokemon/animated/front/normal/016.gif'" />
          <div style="flex: 1; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 800; color: #ffd700; font-size: 12px;">#${paddedId}</span>
              <span style="font-weight: 700; color: #fff; font-size: 12px;">${s.name}</span>
            </div>
            <div style="display: flex; gap: 4px; margin-top: 3px;">
              ${t1} ${t2}
            </div>
          </div>
          <button type="button" class="editor-btn xsmall gold" style="padding: 4px 10px; font-weight: 700;">+ Adicionar</button>
        </div>
      `;
    }).join('');

    dropdown.querySelectorAll('.spawn-autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.getAttribute('data-id'), 10);
        this.addSpawnPokemonRow({ speciesId: id, minLevel: 2, maxLevel: 5, morningChance: 25, afternoonChance: 25, nightChance: 25, dawnChance: 25 });
        dropdown.classList.add('hidden');
        const searchInput = document.getElementById('spawn-pokemon-search');
        if (searchInput) searchInput.value = '';
        document.getElementById('btn-clear-spawn-search')?.style.setProperty('display', 'none');
        this.filterSpawnPokemonTable('');
        this.showToast(`Pokémon #${String(id).padStart(3, '0')} adicionado à área!`, 'success');
      });
    });

    dropdown.classList.remove('hidden');
  }

  updateSpawnPercentages() {
    const cards = Array.from(document.querySelectorAll('.spawn-card-row'));
    let totalMorning = 0;
    let totalAfternoon = 0;
    let totalNight = 0;
    let totalDawn = 0;

    cards.forEach(c => {
      const m = parseFloat(c.querySelector('.row-chance-morning')?.value) || 0;
      const a = parseFloat(c.querySelector('.row-chance-afternoon')?.value) || 0;
      const n = parseFloat(c.querySelector('.row-chance-night')?.value) || 0;
      const d = parseFloat(c.querySelector('.row-chance-dawn')?.value) || 0;
      totalMorning += m;
      totalAfternoon += a;
      totalNight += n;
      totalDawn += d;
    });

    // Update badges
    const updateBadge = (id, total, normalColor) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = `(${total.toFixed(0)}%)`;
        el.style.color = Math.abs(total - 100) < 0.1 ? '#10b981' : normalColor;
      }
    };

    updateBadge('badge-total-morning', totalMorning, '#fbbf24');
    updateBadge('badge-total-afternoon', totalAfternoon, '#60a5fa');
    updateBadge('badge-total-night', totalNight, '#c084fc');
    updateBadge('badge-total-dawn', totalDawn, '#22d3ee');

    const countBadge = document.getElementById('spawn-tab-count-badge');
    if (countBadge) {
      countBadge.textContent = `${cards.length} Pokémon`;
    }

    const activePeriod = this.activeSpawnPeriod || 'morning';
    let activeTotal = totalMorning;
    let activePeriodLabel = 'Manhã (06h–12h)';
    if (activePeriod === 'afternoon') {
      activeTotal = totalAfternoon;
      activePeriodLabel = 'Tarde (12h–18h)';
    } else if (activePeriod === 'night') {
      activeTotal = totalNight;
      activePeriodLabel = 'Noite (18h–00h)';
    } else if (activePeriod === 'dawn') {
      activeTotal = totalDawn;
      activePeriodLabel = 'Madrugada (00h–06h)';
    }

    const statusEl = document.getElementById('spawn-distribution-status');
    if (statusEl) {
      const allBalanced = Math.abs(totalMorning - 100) < 0.1 &&
                          Math.abs(totalAfternoon - 100) < 0.1 &&
                          Math.abs(totalNight - 100) < 0.1 &&
                          Math.abs(totalDawn - 100) < 0.1;
      if (allBalanced) {
        statusEl.innerHTML = `
          <span class="status-badge success">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Todos os 4 turnos 100%</span>
          </span>
        `;
      } else {
        statusEl.innerHTML = `
          <span class="status-badge warning">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Total ${activePeriodLabel}: ${activeTotal.toFixed(0)}%</span>
          </span>
        `;
      }
    }

    // Build probability bar for active period
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#14b8a6', '#6366f1', '#e11d48', '#d97706'];
    const barSegments = [];

    cards.forEach((c, idx) => {
      let val = 0;
      if (activePeriod === 'morning') val = parseFloat(c.querySelector('.row-chance-morning')?.value) || 0;
      else if (activePeriod === 'afternoon') val = parseFloat(c.querySelector('.row-chance-afternoon')?.value) || 0;
      else if (activePeriod === 'night') val = parseFloat(c.querySelector('.row-chance-night')?.value) || 0;
      else if (activePeriod === 'dawn') val = parseFloat(c.querySelector('.row-chance-dawn')?.value) || 0;

      if (val > 0) {
        const pctOfBar = activeTotal > 0 ? (val / activeTotal) * 100 : 0;
        const select = c.querySelector('.row-species-select');
        const speciesName = select ? select.options[select.selectedIndex]?.text || 'Pokémon' : 'Pokémon';
        const color = COLORS[idx % COLORS.length];

        barSegments.push({
          pct: pctOfBar,
          color,
          title: `${speciesName} (${activePeriodLabel}): ${val}% (Proporção: ${pctOfBar.toFixed(1)}%)`
        });
      }
    });

    const barEl = document.getElementById('spawn-probability-bar');
    if (barEl) {
      if (barSegments.length === 0) {
        barEl.innerHTML = `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #64748b;">Nenhum Pokémon configurado para ${activePeriodLabel} (0%)</div>`;
      } else {
        barEl.innerHTML = barSegments.map(s => `
          <div class="spawn-prob-bar-segment" style="width: ${s.pct}%; background: ${s.color};" title="${s.title}"></div>
        `).join('');
      }
    }

    const emptyMsg = document.getElementById('spawn-pokemon-empty-msg');
    if (emptyMsg) {
      emptyMsg.classList.toggle('hidden', cards.length > 0);
    }
  }

  normalizeSpawnWeights() {
    const cards = Array.from(document.querySelectorAll('.spawn-card-row'));
    if (cards.length === 0) return;

    ['morning', 'afternoon', 'night', 'dawn'].forEach(period => {
      const selector = `.row-chance-${period}`;
      let total = 0;
      cards.forEach(c => {
        total += parseFloat(c.querySelector(selector)?.value) || 0;
      });

      if (total <= 0) {
        const eq = Math.floor(100 / cards.length);
        cards.forEach((c, i) => {
          const input = c.querySelector(selector);
          if (input) input.value = i === cards.length - 1 ? 100 - eq * (cards.length - 1) : eq;
        });
      } else {
        let allocated = 0;
        const nonZeroCards = cards.filter(c => (parseFloat(c.querySelector(selector)?.value) || 0) > 0);
        if (nonZeroCards.length > 0) {
          nonZeroCards.forEach((c, i) => {
            const input = c.querySelector(selector);
            const val = parseFloat(input?.value) || 0;
            let newVal = Math.max(1, Math.round((val / total) * 100));
            if (i === nonZeroCards.length - 1) {
              newVal = Math.max(1, 100 - allocated);
            } else {
              allocated += newVal;
            }
            if (input) input.value = newVal;
          });
        }
      }
    });

    this.updateSpawnPercentages();
    this.showToast('Todos os 4 horários normalizados para 100%!', 'success');
  }

  async populateCopyZoneSelect(currentSpawn) {
    const select = document.getElementById('spawn-copy-source-select');
    if (!select) return;

    select.innerHTML = '<option value="">-- Selecione uma zona para copiar a config --</option>';

    // 1. Zonas locais do mapa atual (Camada PokemonSpawns)
    const spawnLayer = this.editorScene?.mapJsonData?.layers?.find(l => (l.name === 'PokemonSpawns' || l.name === 'Spawns') && l.type === 'objectgroup');
    const mapObjects = spawnLayer?.objects || [];

    const currentId = currentSpawn?.id;
    const currentX = currentSpawn?.x;
    const currentY = currentSpawn?.y;

    const availableLocal = mapObjects.filter(obj => {
      const isCurrent = (currentId && obj.id == currentId) || (obj.x === currentX && obj.y === currentY);
      return !isCurrent;
    });

    this.copyZoneCache = new Map();

    if (availableLocal.length > 0) {
      const optGroupMap = document.createElement('optgroup');
      optGroupMap.label = 'Zonas deste Mapa';

      availableLocal.forEach(obj => {
        const props = this.editorScene._readProps(obj.properties);
        const name = props.name || obj.name || `Área #${obj.id}`;
        let spawns = [];
        try {
          spawns = typeof props.pokemonSpawns === 'string' ? JSON.parse(props.pokemonSpawns) : (props.pokemonSpawns || []);
        } catch (e) { spawns = []; }

        const key = `local_${obj.id || `${obj.x}_${obj.y}`}`;
        this.copyZoneCache.set(key, {
          name,
          encounterType: props.encounterType || 'grass',
          arena: props.arena || 'grass',
          rate: props.rate ?? 10,
          pokemonSpawns: spawns
        });

        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${name} (${spawns.length} Pokémon - ${props.encounterType || 'grass'} / Arena: ${props.arena || 'grass'})`;
        optGroupMap.appendChild(opt);
      });

      select.appendChild(optGroupMap);
    }

    // 2. Zonas persistidas no banco de dados
    try {
      const res = await fetch('/api/admin/encounter-zones?mapId=kanto');
      const data = await res.json();
      if (data?.success && Array.isArray(data.zones) && data.zones.length > 0) {
        const dbZones = data.zones.filter(z => {
          const isCurrent = (currentId && z.id == currentId) || (z.x === currentX && z.y === currentY);
          return !isCurrent;
        });

        if (dbZones.length > 0) {
          const optGroupDb = document.createElement('optgroup');
          optGroupDb.label = 'Zonas Salvas no Banco de Dados';

          dbZones.forEach(z => {
            const key = `db_${z.id}`;
            let spawns = [];
            try {
              spawns = typeof z.pokemonSpawns === 'string' ? JSON.parse(z.pokemonSpawns) : (z.pokemonSpawns || []);
            } catch (e) { spawns = []; }

            this.copyZoneCache.set(key, {
              name: z.name,
              encounterType: z.encounterMethod || 'grass',
              arena: z.arena || z.arenaType || 'grass',
              rate: z.baseRate ?? 10,
              pokemonSpawns: spawns
            });

            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `${z.name} (#${z.id}) (${spawns.length} Pokémon)`;
            optGroupDb.appendChild(opt);
          });

          select.appendChild(optGroupDb);
        }
      }
    } catch (e) {
      console.warn('[EditorUI] Falha ao carregar zonas do banco para cópia:', e);
    }
  }

  applyCopiedSpawnConfig() {
    const select = document.getElementById('spawn-copy-source-select');
    const selectedKey = select?.value;
    if (!selectedKey || !this.copyZoneCache?.has(selectedKey)) {
      this.showToast('Selecione uma zona existente no dropdown para copiar.', 'warning');
      return;
    }

    const source = this.copyZoneCache.get(selectedKey);
    const spawns = source.pokemonSpawns;
    if (!Array.isArray(spawns) || spawns.length === 0) {
      this.showToast(`A zona "${source.name}" não possui Pokémons configurados para copiar.`, 'warning');
      return;
    }

    const currentCards = document.querySelectorAll('.spawn-card-row');
    if (currentCards.length > 0) {
      if (!confirm(`Deseja substituir a configuração atual pela da zona "${source.name}" (${spawns.length} Pokémon)?`)) {
        return;
      }
    }

    // Copiar método, arena e taxa se definidos
    if (source.encounterType) {
      const typeInput = document.getElementById('spawn-prop-type');
      if (typeInput) typeInput.value = source.encounterType;
    }
    if (source.arena) {
      const arenaInput = document.getElementById('spawn-prop-arena');
      if (arenaInput) arenaInput.value = source.arena;
    }
    if (source.rate) {
      const rateInput = document.getElementById('spawn-prop-rate');
      if (rateInput) rateInput.value = source.rate;
    }

    const clonedList = JSON.parse(JSON.stringify(spawns));
    this.renderSpawnPokemonRows(clonedList);
    this.updateSpawnPercentages();

    this.showToast(`Configuração copiada de "${source.name}" com sucesso! (${clonedList.length} Pokémon)`, 'success');
  }

  populateSpawnArenaSelect(selectedArena = 'arena_grass') {
    const select = document.getElementById('spawn-prop-arena');
    if (!select) return;

    select.innerHTML = '';

    // Coleta as arenas existentes dos mapas carregados/configurados
    const existingArenas = new Set();
    if (this.allMapsList?.arenas && Array.isArray(this.allMapsList.arenas)) {
      this.allMapsList.arenas.forEach(a => existingArenas.add(a));
    }
    // Garante as arenas existentes no projeto
    existingArenas.add('arena_grass');

    const arenaLabels = {
      arena_grass: 'Arena de Grama / Campo Aberto (arena_grass)',
      arena_water: 'Arena Aquática / Lago (arena_water)',
      arena_cave: 'Arena de Caverna / Rocha (arena_cave)',
      arena_forest: 'Arena de Floresta / Bosque (arena_forest)',
      arena_indoor: 'Estádio / Arena Fechada (arena_indoor)'
    };

    existingArenas.forEach(arenaKey => {
      const opt = document.createElement('option');
      opt.value = arenaKey;
      const cleanName = arenaKey.replace(/_/g, ' ').toUpperCase();
      opt.textContent = arenaLabels[arenaKey] || `Arena ${cleanName} (${arenaKey})`;
      if (arenaKey === selectedArena || (selectedArena === 'grass' && arenaKey === 'arena_grass')) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    // Se a arena previamente configurada não estiver na lista (ex: caso seja um id customizado), preserva-a
    if (selectedArena && ![...existingArenas].includes(selectedArena) && selectedArena !== 'grass') {
      const customOpt = document.createElement('option');
      customOpt.value = selectedArena;
      customOpt.textContent = `Arena Personalizada (${selectedArena})`;
      customOpt.selected = true;
      select.appendChild(customOpt);
    }
  }

  async openSpawnModal(spawn) {
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = false;
    }
    this.editorScene.selectedObject = spawn;
    this.editorScene.drawObjects();

    const modal = document.getElementById('editor-spawn-modal');
    if (!modal) return;

    // Switch to tab 1 (Map & Delimitation) by default
    this.switchSpawnTab('map');

    const props = this.editorScene._readProps(spawn.properties);
    this.populateSpawnArenaSelect(props.arena || 'arena_grass');

    document.getElementById('spawn-prop-name').value = props.name || spawn.name || '';
    document.getElementById('spawn-prop-type').value = props.encounterType || 'grass';
    document.getElementById('spawn-prop-rate').value = props.rate ?? 10;
    document.getElementById('spawn-prop-x').value = spawn.x || 0;
    document.getElementById('spawn-prop-y').value = spawn.y || 0;
    document.getElementById('spawn-prop-w').value = spawn.width || 64;
    document.getElementById('spawn-prop-h').value = spawn.height || 64;

    this.updateSpawnTileSummary();

    // Clear search
    const searchInput = document.getElementById('spawn-pokemon-search');
    if (searchInput) searchInput.value = '';
    document.getElementById('btn-clear-spawn-search')?.style.setProperty('display', 'none');
    document.getElementById('spawn-search-autocomplete')?.classList.add('hidden');

    // Populate copy zone dropdown
    await this.populateCopyZoneSelect(spawn);

    // Load species from database
    await this.fetchSpeciesList();

    let pList = [];
    try {
      pList = typeof props.pokemonSpawns === 'string' ? JSON.parse(props.pokemonSpawns) : (props.pokemonSpawns || []);
    } catch (e) {
      pList = [];
    }

    if (!Array.isArray(pList) || pList.length === 0) {
      pList = [{ speciesId: 16, minLevel: 2, maxLevel: 4, morningChance: 45, afternoonChance: 40, nightChance: 10, dawnChance: 5, highIvChance: 0, shinyBonus: 1 }];
    }

    this.renderSpawnPokemonRows(pList);
    modal.classList.remove('hidden');
  }

  renderSpawnPokemonRows(list) {
    const container = document.getElementById('spawn-pokemon-cards-container');
    if (!container) return;

    container.innerHTML = '';
    list.forEach(p => this.addSpawnPokemonRow(p, false));
    this.updateSpawnPercentages();
  }

  addSpawnPokemonRow(data = {}, updatePct = true) {
    const container = document.getElementById('spawn-pokemon-cards-container');
    if (!container) return;

    const speciesId = data.speciesId || 16;
    const minLevel = data.minLevel ?? 2;
    const maxLevel = data.maxLevel ?? 5;

    // Read chances for 4 periods
    const morning = data.morningChance ?? data.times?.morning ?? 45;
    const afternoon = data.afternoonChance ?? data.dayChance ?? data.times?.afternoon ?? data.times?.day ?? 40;
    const night = data.nightChance ?? data.times?.night ?? 10;
    const dawn = data.dawnChance ?? data.madrugadaChance ?? data.times?.dawn ?? data.times?.madrugada ?? (data.nightChance ? Math.round(data.nightChance / 2) : 5);

    const highIvChance = data.highIvChance ?? 0;
    const shinyBonus = data.shinyBonus ?? 1;

    const card = document.createElement('div');
    card.className = 'spawn-card-row';

    const speciesList = this.databaseSpecies || KANTO_POKEMON_LIST;
    const optionsHtml = speciesList.map(k => {
      const selected = k.id === speciesId ? 'selected' : '';
      return `<option value="${k.id}" ${selected}>#${String(k.id).padStart(3, '0')} ${k.name}</option>`;
    }).join('');

    const paddedId = String(speciesId).padStart(3, '0');

    card.innerHTML = `
      <!-- Linha Superior do Card: Sprite, Espécie, Nível, IV, Shiny, Excluir -->
      <div class="spawn-card-header">
        <div class="spawn-card-sprite-wrap">
          <img class="spawn-card-sprite row-sprite-img" src="/assets/pokemon/animated/front/normal/${paddedId}.gif" alt="Pokemon" onerror="this.src='/assets/pokemon/animated/front/normal/016.gif'" />
        </div>
        
        <div class="spawn-card-species">
          <select class="form-input row-species-select" style="padding: 6px 12px; font-size: 12px; font-weight: 700; width: 100%; border-radius: 6px; height: 34px;">
            ${optionsHtml}
          </select>
        </div>

        <div class="spawn-card-field-group">
          <span class="field-label">NÍVEL</span>
          <div class="custom-stepper-wrap compact">
            <input type="number" class="row-min-lvl" value="${minLevel}" min="1" max="100" title="Nível Mínimo" />
            <div class="custom-stepper-controls">
              <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
              <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
          </div>
          <span class="field-separator">–</span>
          <div class="custom-stepper-wrap compact">
            <input type="number" class="row-max-lvl" value="${maxLevel}" min="1" max="100" title="Nível Máximo" />
            <div class="custom-stepper-controls">
              <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
              <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
          </div>
        </div>

        <div class="spawn-card-field-group">
          <span class="field-label">IV ALTO</span>
          <div class="custom-stepper-wrap compact">
            <input type="number" class="row-high-iv" value="${highIvChance}" min="0" max="100" title="Chance de IVs Altos (31)" />
            <div class="custom-stepper-controls">
              <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
              <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
          </div>
          <span class="field-unit">%</span>
        </div>

        <div class="spawn-card-field-group">
          <span class="field-label">SHINY</span>
          <div class="custom-stepper-wrap compact">
            <input type="number" class="row-shiny-mult" value="${shinyBonus}" min="1" max="50" title="Multiplicador Shiny" />
            <div class="custom-stepper-controls">
              <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
              <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
          </div>
          <span class="field-unit">x</span>
        </div>

        <button type="button" class="btn-remove-row spawn-card-btn-delete" title="Remover este Pokémon da área">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>

      <!-- Grid dos 4 Horários de Encontro -->
      <div class="spawn-card-times-grid">
        <div class="spawn-time-box morning" title="Período da Manhã (06h às 12h)">
          <div class="time-info">
            <div class="time-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6"></path><path d="M4.93 10.93l4.24 4.24"></path><path d="M2 18h20"></path><path d="M20 18a8 8 0 0 0-16 0"></path><path d="M19.07 10.93l-4.24 4.24"></path></svg>
              <span>Manhã</span>
            </div>
            <span class="time-hours">06h–12h</span>
          </div>
          <div class="time-input-wrap">
            <div class="custom-stepper-wrap">
              <input type="number" class="row-chance-morning" value="${morning}" min="0" max="100" />
              <div class="custom-stepper-controls">
                <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
              </div>
            </div>
            <span class="time-pct-symbol">%</span>
          </div>
        </div>

        <div class="spawn-time-box afternoon" title="Período da Tarde (12h às 18h)">
          <div class="time-info">
            <div class="time-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
              <span>Tarde</span>
            </div>
            <span class="time-hours">12h–18h</span>
          </div>
          <div class="time-input-wrap">
            <div class="custom-stepper-wrap">
              <input type="number" class="row-chance-afternoon" value="${afternoon}" min="0" max="100" />
              <div class="custom-stepper-controls">
                <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
              </div>
            </div>
            <span class="time-pct-symbol">%</span>
          </div>
        </div>

        <div class="spawn-time-box night" title="Período da Noite (18h às 00h)">
          <div class="time-info">
            <div class="time-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              <span>Noite</span>
            </div>
            <span class="time-hours">18h–00h</span>
          </div>
          <div class="time-input-wrap">
            <div class="custom-stepper-wrap">
              <input type="number" class="row-chance-night" value="${night}" min="0" max="100" />
              <div class="custom-stepper-controls">
                <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
              </div>
            </div>
            <span class="time-pct-symbol">%</span>
          </div>
        </div>

        <div class="spawn-time-box dawn" title="Período da Madrugada (00h às 06h)">
          <div class="time-info">
            <div class="time-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
              <span>Madrugada</span>
            </div>
            <span class="time-hours">00h–06h</span>
          </div>
          <div class="time-input-wrap">
            <div class="custom-stepper-wrap">
              <input type="number" class="row-chance-dawn" value="${dawn}" min="0" max="100" />
              <div class="custom-stepper-controls">
                <button type="button" class="stepper-btn btn-step-up" tabindex="-1" title="Aumentar"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg></button>
                <button type="button" class="stepper-btn btn-step-down" tabindex="-1" title="Diminuir"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg></button>
              </div>
            </div>
            <span class="time-pct-symbol">%</span>
          </div>
        </div>
      </div>
    `;

    const speciesSelect = card.querySelector('.row-species-select');
    const spriteImg = card.querySelector('.row-sprite-img');
    speciesSelect.addEventListener('change', (e) => {
      const newId = String(e.target.value).padStart(3, '0');
      spriteImg.src = `/assets/pokemon/animated/front/normal/${newId}.gif`;
      this.updateSpawnPercentages();
    });

    ['.row-chance-morning', '.row-chance-afternoon', '.row-chance-night', '.row-chance-dawn'].forEach(sel => {
      card.querySelector(sel)?.addEventListener('input', () => {
        this.updateSpawnPercentages();
      });
    });

    card.querySelector('.btn-remove-row').addEventListener('click', () => {
      card.remove();
      this.updateSpawnPercentages();
    });

    container.appendChild(card);

    if (updatePct) {
      this.updateSpawnPercentages();
    }
  }

  async saveSpawnModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const name = document.getElementById('spawn-prop-name').value;
    const encounterType = document.getElementById('spawn-prop-type').value;
    const rate = parseInt(document.getElementById('spawn-prop-rate').value, 10) || 10;
    const x = parseInt(document.getElementById('spawn-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('spawn-prop-y').value, 10) || 0;
    const w = parseInt(document.getElementById('spawn-prop-w').value, 10) || 64;
    const h = parseInt(document.getElementById('spawn-prop-h').value, 10) || 64;

    const cards = document.querySelectorAll('.spawn-card-row');
    const pokemonList = [];
    cards.forEach(c => {
      const speciesId = parseInt(c.querySelector('.row-species-select').value, 10);
      const minLevel = parseInt(c.querySelector('.row-min-lvl').value, 10) || 1;
      const maxLevel = parseInt(c.querySelector('.row-max-lvl').value, 10) || minLevel;
      const morningChance = parseFloat(c.querySelector('.row-chance-morning').value) || 0;
      const afternoonChance = parseFloat(c.querySelector('.row-chance-afternoon').value) || 0;
      const nightChance = parseFloat(c.querySelector('.row-chance-night').value) || 0;
      const dawnChance = parseFloat(c.querySelector('.row-chance-dawn').value) || 0;
      const highIvChance = parseInt(c.querySelector('.row-high-iv').value, 10) || 0;
      const shinyBonus = parseFloat(c.querySelector('.row-shiny-mult').value) || 1;

      const timeOfDay = [];
      if (morningChance > 0) timeOfDay.push('morning');
      if (afternoonChance > 0) timeOfDay.push('afternoon', 'day');
      if (nightChance > 0) timeOfDay.push('night');
      if (dawnChance > 0) timeOfDay.push('dawn');

      pokemonList.push({
        speciesId,
        minLevel,
        maxLevel,
        morningChance,
        afternoonChance,
        dayChance: afternoonChance,
        nightChance,
        dawnChance,
        madrugadaChance: dawnChance,
        times: {
          morning: morningChance,
          afternoon: afternoonChance,
          day: afternoonChance,
          night: nightChance,
          dawn: dawnChance,
          madrugada: dawnChance
        },
        timeOfDay: timeOfDay.length > 0 ? timeOfDay : ['morning', 'afternoon', 'night', 'dawn'],
        weight: Math.round(Math.max(morningChance, afternoonChance, nightChance, dawnChance, 1)),
        highIvChance,
        shinyBonus
      });
    });

    let target = null;
    const spawnLayer = this.editorScene._getOrCreateObjectLayer('PokemonSpawns');
    if (spawnLayer.objects) {
      target = spawnLayer.objects.find(o => o.id == current.id || (o.x === current.x && o.y === current.y));
    }

    if (!target) {
      target = {
        id: current.id || Date.now(),
        name,
        type: 'spawn',
        x,
        y,
        width: w,
        height: h,
        properties: []
      };
      spawnLayer.objects.push(target);
    }

    const arena = document.getElementById('spawn-prop-arena') ? document.getElementById('spawn-prop-arena').value : 'grass';

    target.name = name;
    target.x = x;
    target.y = y;
    target.width = w;
    target.height = h;
    target.properties = [
      { name: 'name', value: name },
      { name: 'encounterType', value: encounterType },
      { name: 'arena', value: arena },
      { name: 'rate', value: rate },
      { name: 'pokemonSpawns', value: JSON.stringify(pokemonList) }
    ];

    current.name = name;
    current.x = x;
    current.y = y;
    current.width = w;
    current.height = h;
    current.properties = target.properties;

    this.editorScene.drawObjects();
    this.renderSpawnsList();
    document.getElementById('editor-spawn-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }

    await this.saveMap();
  }

  async deleteSpawnModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.type === 'objectgroup' && layer.objects) {
        layer.objects = layer.objects.filter(o => o.id != current.id && !(o.x === current.x && o.y === current.y));
      }
    }

    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    this.renderSpawnsList();
    document.getElementById('editor-spawn-modal').classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();
  }

  // ─── NPCs List & Editor ──────────────────────────────────────────────────

  populateNpcSpriteSelect() {
    const select = document.getElementById('npc-prop-sprite');
    if (!select) return;
    select.innerHTML = '';
    NPC_SPRITES.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.key;
      opt.textContent = `${s.name} (${s.key})`;
      select.appendChild(opt);
    });
  }

  _updateNpcSpritePreview(spriteKey) {
    const previewEl = document.getElementById('npc-prop-sprite-preview');
    if (!previewEl) return;
    const def = NPC_SPRITES.find(s => s.key === spriteKey) || NPC_SPRITES[0];
    previewEl.style.backgroundImage = `url('/assets/characters/npcs/${def.file}')`;
  }

  _updateNpcTypeSections(npcType) {
    const secBattle = document.getElementById('npc-section-battle');
    const secShop = document.getElementById('npc-section-shop');
    const secOak = document.getElementById('npc-section-oak');
    const dlgLabel = document.getElementById('npc-dialogue-label');

    if (secBattle) secBattle.classList.toggle('hidden', npcType !== 'battle');
    if (secShop) secShop.classList.toggle('hidden', npcType !== 'shop');
    if (secOak) secOak.classList.toggle('hidden', npcType !== 'starter_oak');

    if (dlgLabel) {
      if (npcType === 'starter_oak') {
        dlgLabel.textContent = 'Mensagem de Abertura / Boas-Vindas de Carvalho';
      } else if (npcType === 'battle') {
        dlgLabel.textContent = 'Diálogo de Abertura ao Ver o Jogador (Grito de Batalha)';
      } else if (npcType === 'shop') {
        dlgLabel.textContent = 'Diálogo de Cumprimento do Atendente';
      } else {
        dlgLabel.textContent = 'Frases de Diálogo (Uma por linha)';
      }
    }
  }

  renderNpcsList() {
    const container = document.getElementById('editor-npcs-list');
    if (!container || !this.editorScene.mapJsonData) return;

    container.innerHTML = '';
    const npcLayer = this.editorScene.mapJsonData.layers.find(l => l.name === 'NPCs' && l.type === 'objectgroup');

    if (!npcLayer || !npcLayer.objects || npcLayer.objects.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#888; text-align:center; padding:16px;">Nenhum NPC cadastrado neste mapa. Clique em "Novo NPC" ou use a ferramenta (N) para posicionar no mapa.</div>`;
      return;
    }

    npcLayer.objects.forEach(obj => {
      const props = this.editorScene._readProps(obj.properties);
      const name = props.name || obj.name || 'NPC';
      const spriteKey = props.spriteKey || props.sprite || 'npc_boy';
      const npcType = props.npcType || props.type || 'dialogue';
      const direction = props.direction || 'down';

      const spriteDef = NPC_SPRITES.find(s => s.key === spriteKey) || { file: 'npc_boy.png' };
      const typeDef = NPC_TYPES.find(t => t.id === npcType) || { label: 'Diálogo', icon: '💬' };

      const card = document.createElement('div');
      card.className = 'portal-card';

      let borderColor = '#00e5ff';
      if (npcType === 'starter_oak') borderColor = '#ffd700';
      else if (npcType === 'battle') borderColor = '#ff1744';
      else if (npcType === 'shop') borderColor = '#00e676';
      card.style.borderLeft = `4px solid ${borderColor}`;

      const dirLabels = { down: 'Baixo (Frente)', up: 'Cima (Costas)', left: 'Esquerda', right: 'Direita' };

      card.innerHTML = `
        <div class="portal-card-header" style="color: #fff;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:36px; background:#0b1120; border:1px solid rgba(255,255,255,0.2); border-radius:4px; overflow:hidden; flex-shrink:0;">
              <div style="width:32px; height:48px; background-image:url('/assets/characters/npcs/${spriteDef.file}'); background-size:128px 192px; background-position:0 0; image-rendering:pixelated; transform:scale(0.8) translate(-4px, -6px);"></div>
            </div>
            <div>
              <span style="font-weight:700; font-size:12px; display:block;">${name}</span>
              <span style="font-size:10px; color:${borderColor}; font-weight:700;">${typeDef.icon} ${typeDef.label}</span>
            </div>
          </div>
          <span style="color:var(--fr-gold); font-size:11px;">[${obj.x}, ${obj.y}]</span>
        </div>
        <div class="portal-card-details" style="margin: 4px 0;">
          <div>Sprite: <strong>${spriteKey}</strong> | Olhando para: <strong>${dirLabels[direction] || direction}</strong></div>
        </div>
        <div class="portal-card-actions">
          <button class="editor-btn small primary btn-edit-npc">Configurar</button>
          <button class="editor-btn small secondary btn-focus-npc">Focar</button>
          <button class="editor-btn small danger btn-delete-npc">Excluir</button>
        </div>
      `;

      card.querySelector('.btn-edit-npc').addEventListener('click', () => this.openNpcModal({ ...obj, layerName: 'NPCs' }));
      card.querySelector('.btn-focus-npc').addEventListener('click', () => {
        if (this.editorScene.cameras?.main) {
          this.editorScene.cameras.main.centerOn(obj.x, obj.y);
        }
      });
      card.querySelector('.btn-delete-npc').addEventListener('click', async () => {
        if (confirm(`Tem certeza que deseja excluir o NPC "${name}"?`)) {
          this.editorScene.selectedObject = { ...obj, layerName: 'NPCs' };
          await this.deleteNpcModal();
        }
      });

      container.appendChild(card);
    });
  }

  openNpcModal(npc) {
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = false;
    }
    this.editorScene.selectedObject = npc;
    this.editorScene.drawObjects();

    const modal = document.getElementById('editor-npc-modal');
    if (!modal) return;

    this.populateNpcSpriteSelect();

    const props = this.editorScene._readProps(npc.properties);
    const spriteKey = props.spriteKey || props.sprite || 'npc_boy';
    const npcType = props.npcType || props.type || 'dialogue';
    const name = props.name || npc.name || 'Novo NPC';

    document.getElementById('npc-prop-name').value = name;
    document.getElementById('npc-prop-sprite').value = spriteKey;
    document.getElementById('npc-prop-type').value = npcType;
    document.getElementById('npc-prop-direction').value = props.direction || 'down';

    let dlg = props.dialogue || props.text || ['Olá, treinador!'];
    if (typeof dlg === 'string') {
      try {
        const parsed = JSON.parse(dlg);
        dlg = Array.isArray(parsed) ? parsed.join('\n') : dlg;
      } catch (e) {
        // keep string
      }
    } else if (Array.isArray(dlg)) {
      dlg = dlg.join('\n');
    }
    document.getElementById('npc-prop-dialogue').value = dlg;

    document.getElementById('npc-prop-vision').value = props.visionRange !== undefined ? props.visionRange : (npcType === 'battle' ? 3 : 0);
    document.getElementById('npc-prop-reward').value = props.rewardMoney !== undefined ? props.rewardMoney : 200;
    document.getElementById('npc-prop-reward-exp').value = props.rewardExp !== undefined ? props.rewardExp : 150;
    document.getElementById('npc-prop-cooldown').value = props.cooldown !== undefined ? props.cooldown : 300;
    document.getElementById('npc-prop-loss-dlg').value = props.lossDialogue || 'Haha! Ainda precisa treinar mais!';
    document.getElementById('npc-prop-win-dlg').value = props.winDialogue || 'Você é muito forte...';

    let teamStr = props.team || '[{"speciesId":19,"level":3,"name":"Rattata"}]';
    if (typeof teamStr === 'object') teamStr = JSON.stringify(teamStr);
    document.getElementById('npc-prop-team').value = teamStr;

    // Shop checklist
    const shopListContainer = document.getElementById('npc-shop-items-checklist');
    if (shopListContainer) {
      shopListContainer.innerHTML = '';
      let activeShopIds = [];
      if (props.shopItems) {
        if (Array.isArray(props.shopItems)) {
          activeShopIds = props.shopItems.map(i => typeof i === 'string' ? i : i.id);
        } else if (typeof props.shopItems === 'string') {
          try {
            const parsed = JSON.parse(props.shopItems);
            if (Array.isArray(parsed)) activeShopIds = parsed.map(i => typeof i === 'string' ? i : i.id);
          } catch(e) {}
        }
      } else {
        // By default all items are available
        activeShopIds = DEFAULT_MART_ITEMS.map(i => i.id);
      }

      DEFAULT_MART_ITEMS.forEach(item => {
        const isChecked = activeShopIds.includes(item.id);
        const itemLabel = document.createElement('label');
        itemLabel.style.display = 'inline-flex';
        itemLabel.style.alignItems = 'center';
        itemLabel.style.gap = '4px';
        itemLabel.style.fontSize = '11px';
        itemLabel.style.background = 'rgba(255,255,255,0.06)';
        itemLabel.style.padding = '4px 8px';
        itemLabel.style.borderRadius = '4px';
        itemLabel.style.cursor = 'pointer';
        itemLabel.innerHTML = `
          <input type="checkbox" class="npc-shop-item-check" value="${item.id}" ${isChecked ? 'checked' : ''} />
          <span>${item.name} ($${item.price})</span>
        `;
        shopListContainer.appendChild(itemLabel);
      });
    }

    document.getElementById('npc-prop-x').value = npc.x || 0;
    document.getElementById('npc-prop-y').value = npc.y || 0;

    this._updateNpcSpritePreview(spriteKey);
    this._updateNpcTypeSections(npcType);

    modal.classList.remove('hidden');
  }

  async saveNpcModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    const name = document.getElementById('npc-prop-name').value || 'NPC';
    const spriteKey = document.getElementById('npc-prop-sprite').value || 'npc_boy';
    const npcType = document.getElementById('npc-prop-type').value || 'dialogue';
    const direction = document.getElementById('npc-prop-direction').value || 'down';
    const dlgRaw = document.getElementById('npc-prop-dialogue').value || '';
    const dialogue = dlgRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const x = parseInt(document.getElementById('npc-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('npc-prop-y').value, 10) || 0;

    const visionRange = parseInt(document.getElementById('npc-prop-vision').value, 10) || 0;
    const rewardMoney = parseInt(document.getElementById('npc-prop-reward').value, 10) || 0;
    const rewardExp = parseInt(document.getElementById('npc-prop-reward-exp').value, 10) || 0;
    const cooldown = parseInt(document.getElementById('npc-prop-cooldown').value, 10) || 0;
    const lossDialogue = document.getElementById('npc-prop-loss-dlg').value || 'Haha! Ainda precisa treinar mais!';
    const winDialogue = document.getElementById('npc-prop-win-dlg').value || 'Você é muito forte...';

    let team = null;
    try {
      const teamVal = document.getElementById('npc-prop-team').value;
      if (teamVal) team = JSON.parse(teamVal);
    } catch(e) {
      team = [{ speciesId: 19, level: 3, name: 'Rattata' }];
    }

    // Selected shop items
    const checkedShopBoxes = document.querySelectorAll('.npc-shop-item-check:checked');
    const selectedShopIds = Array.from(checkedShopBoxes).map(cb => cb.value);
    const shopItems = DEFAULT_MART_ITEMS.filter(it => selectedShopIds.includes(it.id));

    let target = null;
    const npcLayer = this.editorScene._getOrCreateObjectLayer('NPCs');
    if (npcLayer.objects) {
      target = npcLayer.objects.find(o => o.id == current.id || (o.x === current.x && o.y === current.y));
    }

    if (!target) {
      target = {
        id: current.id || Date.now(),
        name,
        type: npcType,
        x,
        y,
        width: 32,
        height: 48,
        properties: []
      };
      npcLayer.objects.push(target);
    }

    target.name = name;
    target.type = npcType;
    target.x = x;
    target.y = y;
    target.width = 32;
    target.height = 48;

    const props = [
      { name: 'name', value: name },
      { name: 'spriteKey', value: spriteKey },
      { name: 'direction', value: direction },
      { name: 'npcType', value: npcType },
      { name: 'dialogue', value: JSON.stringify(dialogue) }
    ];

    if (npcType === 'battle') {
      props.push({ name: 'visionRange', value: visionRange });
      props.push({ name: 'rewardMoney', value: rewardMoney });
      props.push({ name: 'rewardExp', value: rewardExp });
      props.push({ name: 'cooldown', value: cooldown });
      props.push({ name: 'lossDialogue', value: lossDialogue });
      props.push({ name: 'winDialogue', value: winDialogue });
      if (team) props.push({ name: 'team', value: JSON.stringify(team) });
    } else if (npcType === 'shop') {
      props.push({ name: 'shopItems', value: JSON.stringify(shopItems) });
    }

    target.properties = props;

    current.name = name;
    current.x = x;
    current.y = y;
    current.properties = props;

    this.editorScene.drawObjects();
    this.renderNpcsList();
    document.getElementById('editor-npc-modal')?.classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }

    await this.saveMap();
    this.showToast(`✅ NPC "${name}" salvo no mapa!`, 'success');
  }

  async deleteNpcModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

    for (const layer of this.editorScene.mapJsonData.layers) {
      if (layer.name === 'NPCs' && layer.objects) {
        layer.objects = layer.objects.filter(o => o.id != current.id && !(o.x === current.x && o.y === current.y));
      }
    }

    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    this.renderNpcsList();
    document.getElementById('editor-npc-modal')?.classList.add('hidden');
    if (this.editorScene?.input?.keyboard) {
      this.editorScene.input.keyboard.enabled = true;
      this.editorScene.input.keyboard.clearCaptures();
    }
    await this.saveMap();
    this.showToast('🗑️ NPC removido do mapa.', 'info');
  }

  // ─── Sidebar Tabs ─────────────────────────────────────────────────────────

  switchSidebarTab(tabName) {
    if (tabName === 'spawns') {
      this.switchZonesSubtab('spawns');
      tabName = 'zones';
    }

    this.activeSidebarTab = tabName;
    ['layers', 'portals', 'signs', 'zones', 'npcs'].forEach(t => {
      document.getElementById(`tab-btn-${t}`)?.classList.toggle('active', t === tabName);
    });

    // Toggle tab contents
    document.getElementById('tab-content-layers')?.classList.toggle('hidden', tabName !== 'layers');
    document.getElementById('tab-content-portals')?.classList.toggle('hidden', tabName !== 'portals');
    document.getElementById('tab-content-signs')?.classList.toggle('hidden', tabName !== 'signs');
    document.getElementById('tab-content-zones')?.classList.toggle('hidden', tabName !== 'zones');
    document.getElementById('tab-content-npcs')?.classList.toggle('hidden', tabName !== 'npcs');

    if (tabName === 'portals') {
      this.renderPortalsList();
    } else if (tabName === 'signs') {
      this.renderSignsList();
    } else if (tabName === 'zones') {
      this.renderZonesList();
      this.renderSpawnsList();
      this.renderArenaSpawnsView();
    } else if (tabName === 'npcs') {
      this.renderNpcsList();
    }
  }

  switchZonesSubtab(subtabName) {
    this.activeZonesSubtab = subtabName;
    const select = document.getElementById('editor-zones-subtab-select');
    if (select && select.value !== subtabName) {
      select.value = subtabName;
    }

    const citiesView = document.getElementById('zones-subview-cities');
    const spawnsView = document.getElementById('zones-subview-spawns');
    const arenaView = document.getElementById('zones-subview-arena');
    if (citiesView) citiesView.classList.toggle('hidden', subtabName !== 'cities');
    if (spawnsView) spawnsView.classList.toggle('hidden', subtabName !== 'spawns');
    if (arenaView) arenaView.classList.toggle('hidden', subtabName !== 'arena');

    if (subtabName === 'arena') {
      this.renderArenaSpawnsView();
    }
  }

  // ─── Tools & Tilesets ─────────────────────────────────────────────────────

  selectCollisionType(type) {
    type = Number(type);
    this.editorScene.setCollisionType(type);

    document.querySelectorAll('.collision-type-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.type, 10) === type);
    });

    const meta = COLLISION_META[type] || COLLISION_META[COLLISION_TYPES.SOLID];
    const badge = document.getElementById('selected-collision-badge');
    if (badge) {
      badge.textContent = meta.shortName;
      badge.style.backgroundColor = meta.colorHex;
    }

    const gidEl = document.getElementById('editor-gid-indicator');
    if (gidEl) {
      gidEl.textContent = `Colisão: ${meta.shortName}`;
    }

    this.showToast(`Colisão selecionada: ${meta.name}`, 'info');
  }

  selectTool(toolName) {
    this.editorScene.setTool(toolName);

    const tools = ['hand', 'pencil', 'eraser', 'bucket', 'picker', 'sign', 'link', 'object', 'zone', 'spawn', 'npc'];
    tools.forEach(t => {
      document.getElementById(`tool-${t}`)?.classList.toggle('active', t === toolName);
    });

    const toolLabels = {
      hand: 'Mão (H)',
      pencil: 'Pincel (B)',
      eraser: 'Borracha (E)',
      bucket: 'Preenchimento (F)',
      picker: 'Conta-gotas (I)',
      sign: 'Placa (1 grid)',
      link: 'Teleporte (Grids)',
      object: 'Objetos (O)',
      zone: 'Zona/Região (Z)',
      spawn: 'Spawn Pokémon (P)',
      npc: 'NPC (N)'
    };

    const toolEl = document.getElementById('editor-tool-indicator');
    if (toolEl) toolEl.innerHTML = `<span>${toolLabels[toolName] || toolName.toUpperCase()}</span>`;
  }

  setTileGid(gid) {
    this.activeGid = gid;
    const firstGid = this.activeTileset ? this.activeTileset.firstgid : 1;
    const localId = Math.max(0, gid - firstGid);
    const col = localId % this.columns;
    const row = Math.floor(localId / this.columns);

    this.selectStartCol = col;
    this.selectStartRow = row;
    this.selectEndCol = col;
    this.selectEndRow = row;

    this.selectedPattern = {
      width: 1,
      height: 1,
      tiles: [[gid]],
      minCol: col,
      maxCol: col,
      minRow: row,
      maxRow: row
    };

    if (this.editorScene) {
      this.editorScene.setSelectedTile(gid, this.selectedPattern);
    }
    this.highlightTilesetSelection();
    this.updateTilePreviewMulti(this.selectedPattern);

    const gidEl = document.getElementById('editor-gid-indicator');
    if (gidEl) gidEl.textContent = `GID: ${gid}`;
  }

  updateTilesetSelection() {
    const minCol = Math.min(this.selectStartCol, this.selectEndCol);
    const maxCol = Math.max(this.selectStartCol, this.selectEndCol);
    const minRow = Math.min(this.selectStartRow, this.selectEndRow);
    const maxRow = Math.max(this.selectStartRow, this.selectEndRow);

    const width = maxCol - minCol + 1;
    const height = maxRow - minRow + 1;
    const firstGid = this.activeTileset ? this.activeTileset.firstgid : 1;

    const tiles = [];
    for (let r = 0; r < height; r++) {
      const rowTiles = [];
      for (let c = 0; c < width; c++) {
        const tileCol = minCol + c;
        const tileRow = minRow + r;
        const gid = firstGid + (tileRow * this.columns) + tileCol;
        rowTiles.push(gid);
      }
      tiles.push(rowTiles);
    }

    const primaryGid = tiles[0][0];
    this.activeGid = primaryGid;
    this.selectedPattern = {
      width,
      height,
      tiles,
      minCol,
      maxCol,
      minRow,
      maxRow
    };

    if (this.editorScene) {
      this.editorScene.setSelectedTile(primaryGid, this.selectedPattern);
    }

    this.highlightTilesetSelection();
    this.updateTilePreviewMulti(this.selectedPattern);
  }

  populateTilesetSelect() {
    const select = document.getElementById('editor-tileset-select');
    if (!select || !this.editorScene.mapJsonData) return;

    const tilesets = this.editorScene.mapJsonData.tilesets || [];
    select.innerHTML = '';

    const activeGroup = document.createElement('optgroup');
    activeGroup.label = 'Tilesets no Mapa (Ativos)';

    tilesets.forEach((t, idx) => {
      const opt = document.createElement('option');
      opt.value = `map:${idx}`;
      opt.textContent = `${t.name} (GID ${t.firstgid})`;
      if (this.activeTileset && (this.activeTileset.name === t.name || this.activeTileset.firstgid === t.firstgid)) {
        opt.selected = true;
      }
      activeGroup.appendChild(opt);
    });
    select.appendChild(activeGroup);

    const mapTilesetNames = new Set(tilesets.map(t => t.name));
    const unaddedPresets = PRESET_TILESETS.filter(p => !mapTilesetNames.has(p.name));

    if (unaddedPresets.length > 0) {
      const libGroup = document.createElement('optgroup');
      libGroup.label = 'Adicionar da Biblioteca...';

      unaddedPresets.forEach(p => {
        const opt = document.createElement('option');
        opt.value = `lib:${p.name}`;
        opt.textContent = `+ ${p.name}`;
        libGroup.appendChild(opt);
      });
      select.appendChild(libGroup);
    }

    if (this.availableTilesetFiles && this.availableTilesetFiles.length > 0) {
      const otherFiles = this.availableTilesetFiles.filter(file => {
        const name = file.replace(/\.png$/i, '');
        return !mapTilesetNames.has(name) && !PRESET_TILESETS.some(p => p.file === file || p.name === name);
      });

      if (otherFiles.length > 0) {
        const fileGroup = document.createElement('optgroup');
        fileGroup.label = 'Outros Arquivos PNG...';
        otherFiles.forEach(file => {
          const opt = document.createElement('option');
          opt.value = `file:${file}`;
          opt.textContent = `+ ${file}`;
          fileGroup.appendChild(opt);
        });
        select.appendChild(fileGroup);
      }
    }

    if (tilesets.length > 0 && !this.activeTileset) {
      this.activeTileset = tilesets[0];
    }
  }

  addOrSwitchTileset(name) {
    if (!this.editorScene.mapJsonData) return;
    if (!this.editorScene.mapJsonData.tilesets) {
      this.editorScene.mapJsonData.tilesets = [];
    }
    const tilesets = this.editorScene.mapJsonData.tilesets;
    const existingIndex = tilesets.findIndex(t => t.name === name);
    if (existingIndex >= 0) {
      this.switchTileset(existingIndex);
      this.showToast(`Alternado para o tileset '${name}'`, 'info');
      return;
    }
    this.addLibraryTileset(name);
  }

  addFileTileset(fileName) {
    const cleanName = fileName.replace(/\.png$/i, '');
    const preset = PRESET_TILESETS.find(p => p.file === fileName || p.name === cleanName);
    if (preset) {
      this.addLibraryTileset(preset.name);
      return;
    }

    const tilesets = this.editorScene.mapJsonData.tilesets || [];
    let maxGid = 1;
    tilesets.forEach(t => {
      const count = t.tilecount || (t.columns * 100);
      const endGid = (t.firstgid || 1) + count;
      if (endGid > maxGid) maxGid = endGid;
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tileW = 32;
      const tileH = 32;
      const normalized = normalizeTilesetImage(img, tileW, tileH, 64);
      const newTileset = {
        name: cleanName,
        image: '/assets/tilesets/' + fileName,
        firstgid: maxGid,
        tilewidth: tileW,
        tileheight: tileH,
        columns: normalized.columns,
        tilecount: normalized.tilecount,
        imagewidth: normalized.imagewidth,
        imageheight: normalized.imageheight,
        margin: 0,
        spacing: 0
      };
      tilesets.push(newTileset);
      if (this.editorScene?.textures) {
        if (this.editorScene.textures.exists(cleanName)) {
          this.editorScene.textures.remove(cleanName);
        }
        this.editorScene.textures.addImage(cleanName, normalized.imageSource);
      }
      this.editorScene.bindTilesetToMap(newTileset, normalized.imageSource);
      this.populateTilesetSelect();
      this.switchTileset(tilesets.length - 1);
      this.showToast(`✅ Tileset '${cleanName}' adicionado! (GID inicial: ${maxGid})`, 'success');
    };
    img.onerror = () => {
      this.showToast(`❌ Falha ao carregar imagem: ${fileName}`, 'error');
    };
    img.src = `/assets/tilesets/${encodeURIComponent(fileName)}`;
  }

  addLibraryTileset(presetName) {
    const preset = PRESET_TILESETS.find(p => p.name === presetName);
    if (!preset) {
      this.showToast(`Tileset '${presetName}' não encontrado na biblioteca.`, 'error');
      return;
    }

    if (!this.editorScene.mapJsonData) {
      this.editorScene.mapJsonData.tilesets = [];
    }

    const tilesets = this.editorScene.mapJsonData.tilesets;
    const existingIndex = tilesets.findIndex(t => t.name === preset.name);
    if (existingIndex >= 0) {
      this.switchTileset(existingIndex);
      this.showToast(`Tileset '${preset.name}' já está no mapa.`, 'info');
      return;
    }

    let maxGid = 1;
    tilesets.forEach(t => {
      const count = t.tilecount || (t.columns * 100);
      const endGid = (t.firstgid || 1) + count;
      if (endGid > maxGid) maxGid = endGid;
    });

    const newTileset = {
      name: preset.name,
      image: '/assets/tilesets/' + preset.file,
      firstgid: maxGid,
      tilewidth: preset.tilewidth,
      tileheight: preset.tileheight,
      columns: preset.columns,
      tilecount: preset.tilecount,
      imagewidth: preset.imagewidth,
      imageheight: preset.imageheight,
      margin: preset.margin || 0,
      spacing: preset.spacing || 0
    };

    tilesets.push(newTileset);
    this.populateTilesetSelect();
    const newIdx = tilesets.length - 1;
    this.switchTileset(newIdx);
    this.showToast(`✅ Tileset '${preset.name}' adicionado ao mapa! (GID inicial: ${maxGid})`, 'success');
  }

  switchTileset(idx, targetGid = null) {
    const tilesets = this.editorScene.mapJsonData?.tilesets;
    if (!tilesets || !tilesets[idx]) return;

    this.activeTileset = tilesets[idx];
    const filename = this.activeTileset.image.split('/').pop();

    this.columns = this.activeTileset.columns || 16;
    this.tileSize = this.activeTileset.tilewidth || 32;
    this.totalTiles = this.activeTileset.tilecount || (this.columns * 100);

    const selectEl = document.getElementById('editor-tileset-select');
    if (selectEl) {
      selectEl.value = `map:${idx}`;
    }

    // Reset multi-tile pattern on switch
    this.selectedPattern = null;

    const onReady = () => {
      const tw = this.activeTileset.tilewidth || 32;
      const th = this.activeTileset.tileheight || 32;
      const normalized = normalizeTilesetImage(
        this.tilesetImage, tw, th, 64,
        this.activeTileset.margin || 0,
        this.activeTileset.spacing || 0
      );
      if (normalized.imageSource !== this.tilesetImage) {
        this.tilesetImage = normalized.imageSource;
      }
      if (this.tilesetImage) {
        this.tilesetImage.tilesetKey = filename;
      }

      this.activeTileset.columns = normalized.columns;
      this.activeTileset.tilecount = normalized.tilecount;
      this.activeTileset.imagewidth = normalized.imagewidth;
      this.activeTileset.imageheight = normalized.imageheight;
      this.columns = normalized.columns;
      this.totalTiles = normalized.tilecount;

      // Ensure texture is registered/updated and tileset is bound to map safely
      if (this.editorScene) {
        this.editorScene.bindTilesetToMap(this.activeTileset, this.tilesetImage);
      }

      this.drawTilesetPalette();

      // Ensure gidToFocus belongs to the CURRENT tileset
      const firstGid = this.activeTileset.firstgid || 1;
      const count = this.activeTileset.tilecount || (this.columns * 100);
      let gidToFocus;
      if (targetGid !== null && targetGid >= firstGid && targetGid < firstGid + count) {
        gidToFocus = targetGid;
      } else if (this.activeGid >= firstGid && this.activeGid < firstGid + count) {
        gidToFocus = this.activeGid;
      } else {
        gidToFocus = firstGid;
      }

      this.setTileGid(gidToFocus);
      this.scrollToTileInPalette(gidToFocus);
    };

    const encodedFilename = encodeURIComponent(filename);
    const targetSrc = `/assets/tilesets/${encodedFilename}`;

    if (isImageReady(this.tilesetImage) && (this.tilesetImage.tilesetKey === filename || (this.tilesetImage.src && this.tilesetImage.src.includes(encodedFilename)))) {
      onReady();
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        img.tilesetKey = filename;
        this.tilesetImage = img;
        onReady();
      };
      img.onerror = () => {
        this.showToast(`❌ Erro ao carregar tileset: ${filename}`, 'error');
      };
      img.src = `${targetSrc}?t=${Date.now()}`;
    }
  }

  handleUploadTilesetPNG(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      const cleanName = file.name.replace(/\.png$/i, '');
      this.showToast('Enviando tileset PNG para o servidor...', 'info');

      try {
        const res = await fetch('/api/admin/map/tileset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, imageBase64: base64Data })
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Erro no upload');

        const img = new Image();
        img.src = base64Data;
        img.onload = () => {
          const tileW = 32;
          const tileH = 32;
          const normalized = normalizeTilesetImage(img, tileW, tileH, 64);

          const tilesets = this.editorScene.mapJsonData.tilesets || [];
          let maxGid = 1;
          tilesets.forEach(t => {
            const endGid = (t.firstgid || 1) + (t.tilecount || 0);
            if (endGid > maxGid) maxGid = endGid;
          });

          const newTileset = {
            name: cleanName,
            image: '/assets/tilesets/' + data.filename,
            firstgid: maxGid,
            tilewidth: tileW,
            tileheight: tileH,
            columns: normalized.columns,
            tilecount: normalized.tilecount,
            imagewidth: normalized.imagewidth,
            imageheight: normalized.imageheight,
            margin: 0,
            spacing: 0
          };
          tilesets.push(newTileset);

          if (this.editorScene.textures.exists(cleanName)) {
            this.editorScene.textures.remove(cleanName);
          }
          this.editorScene.textures.addImage(cleanName, normalized.imageSource);
          this.editorScene.bindTilesetToMap(newTileset, normalized.imageSource);

          this.populateTilesetSelect();
          this.switchTileset(tilesets.length - 1);
          this.showToast(`✅ Tileset '${cleanName}' pronto para uso!`, 'success');
        };
      } catch (err) {
        this.showToast('❌ Erro no upload: ' + err.message, 'error');
      }
    };
    reader.readAsDataURL(file);
  }

    setPaletteZoom(zoom) {
    this.paletteZoom = zoom;
    if (!this.tilesetCanvas) return;

    if (zoom === 'fit') {
      this.tilesetCanvas.style.width = '100%';
      this.tilesetCanvas.style.height = 'auto';
    } else {
      const w = Math.round(this.tilesetCanvas.width * zoom);
      const h = Math.round(this.tilesetCanvas.height * zoom);
      this.tilesetCanvas.style.width = `${w}px`;
      this.tilesetCanvas.style.height = `${h}px`;
    }

    document.querySelectorAll('.tileset-palette-controls .editor-btn').forEach(b => {
      if (b.id !== 'btn-palette-grid-toggle') b.classList.remove('active');
    });
    if (zoom === 1) document.getElementById('btn-palette-zoom-100')?.classList.add('active');
    else if (zoom === 'fit') document.getElementById('btn-palette-fit-width')?.classList.add('active');
  }

  drawTilesetPalette() {
    if (!isImageReady(this.tilesetImage)) return;
    this.tilesetCanvas.width = this.tilesetImage.width;
    this.tilesetCanvas.height = this.tilesetImage.height;
    this.tilesetCtx.drawImage(this.tilesetImage, 0, 0);

    if (this.showPaletteGrid) {
      const margin = this.activeTileset?.margin || 0;
      const spacing = this.activeTileset?.spacing || 0;
      const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
      const tileH = this.activeTileset?.tileheight || this.tileSize || 32;
      const maxRows = Math.ceil(this.totalTiles / this.columns);

      this.tilesetCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.tilesetCtx.lineWidth = 1;

      for (let c = 0; c <= this.columns; c++) {
        const lx = margin + c * (tileW + spacing);
        this.tilesetCtx.beginPath();
        this.tilesetCtx.moveTo(lx, margin);
        this.tilesetCtx.lineTo(lx, margin + maxRows * (tileH + spacing));
        this.tilesetCtx.stroke();
      }
      for (let r = 0; r <= maxRows; r++) {
        const ly = margin + r * (tileH + spacing);
        this.tilesetCtx.beginPath();
        this.tilesetCtx.moveTo(margin, ly);
        this.tilesetCtx.lineTo(margin + this.columns * (tileW + spacing), ly);
        this.tilesetCtx.stroke();
      }
    }

    this.highlightTilesetSelection();
    if (this.paletteZoom) {
      this.setPaletteZoom(this.paletteZoom);
    }
  }

  highlightTilesetGid(gid) {
    this.setTileGid(gid);
  }

  highlightTilesetSelection() {
    if (!isImageReady(this.tilesetImage)) return;
    this.tilesetCtx.drawImage(this.tilesetImage, 0, 0);

    const pattern = this.selectedPattern;
    if (!pattern) return;

    const minCol = pattern.minCol;
    const minRow = pattern.minRow;
    const width = pattern.width;
    const height = pattern.height;

    const margin = this.activeTileset?.margin || 0;
    const spacing = this.activeTileset?.spacing || 0;
    const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
    const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

    const boxX = margin + minCol * (tileW + spacing);
    const boxY = margin + minRow * (tileH + spacing);
    const boxW = width * tileW + (width - 1) * spacing;
    const boxH = height * tileH + (height - 1) * spacing;

    // Glowing vibrant cyan and gold box
    this.tilesetCtx.fillStyle = 'rgba(0, 229, 255, 0.35)';
    this.tilesetCtx.fillRect(boxX, boxY, boxW, boxH);

    this.tilesetCtx.strokeStyle = '#ffd700';
    this.tilesetCtx.lineWidth = 3;
    this.tilesetCtx.strokeRect(boxX - 1, boxY - 1, boxW + 2, boxH + 2);

    this.tilesetCtx.strokeStyle = '#00e5ff';
    this.tilesetCtx.lineWidth = 1.5;
    this.tilesetCtx.strokeRect(boxX, boxY, boxW, boxH);

    // Subtle inner grid lines for multi-selection
    if (width > 1 || height > 1) {
      this.tilesetCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      this.tilesetCtx.lineWidth = 1;
      for (let c = 1; c < width; c++) {
        const lx = boxX + c * (tileW + spacing);
        this.tilesetCtx.beginPath();
        this.tilesetCtx.moveTo(lx, boxY);
        this.tilesetCtx.lineTo(lx, boxY + boxH);
        this.tilesetCtx.stroke();
      }
      for (let r = 1; r < height; r++) {
        const ly = boxY + r * (tileH + spacing);
        this.tilesetCtx.beginPath();
        this.tilesetCtx.moveTo(boxX, ly);
        this.tilesetCtx.lineTo(boxX + boxW, ly);
        this.tilesetCtx.stroke();
      }
    }
  }

  updateTilePreviewMulti(pattern) {
    const previewCanvas = document.getElementById('active-tile-preview');
    if (!previewCanvas || !isImageReady(this.tilesetImage)) return;

    const ctx = previewCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    const margin = this.activeTileset?.margin || 0;
    const spacing = this.activeTileset?.spacing || 0;
    const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
    const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

    const srcX = margin + pattern.minCol * (tileW + spacing);
    const srcY = margin + pattern.minRow * (tileH + spacing);
    const srcW = pattern.width * tileW + (pattern.width - 1) * spacing;
    const srcH = pattern.height * tileH + (pattern.height - 1) * spacing;

    const canvasW = previewCanvas.width;
    const canvasH = previewCanvas.height;
    const scale = Math.min(canvasW / srcW, canvasH / srcH, 1);
    const destW = Math.round(srcW * scale);
    const destH = Math.round(srcH * scale);
    const destX = Math.round((canvasW - destW) / 2);
    const destY = Math.round((canvasH - destH) / 2);

    ctx.drawImage(this.tilesetImage, srcX, srcY, srcW, srcH, destX, destY, destW, destH);

    const primaryGid = pattern.tiles[0][0];
    const totalCount = pattern.width * pattern.height;
    const badgeText = totalCount > 1 ? `GID: ${primaryGid} (${pattern.width}x${pattern.height})` : `GID: ${primaryGid}`;

    const previewBadge = document.getElementById('selected-tile-preview-badge');
    if (previewBadge) previewBadge.textContent = badgeText;

    const infoGid = document.getElementById('info-gid');
    if (infoGid) infoGid.textContent = totalCount > 1 ? `${primaryGid} (${totalCount} tiles)` : primaryGid;

    const infoCoords = document.getElementById('info-gid-coords');
    if (infoCoords) {
      infoCoords.textContent = totalCount > 1
        ? `${pattern.width}x${pattern.height} (${totalCount} tiles)`
        : `Col ${pattern.minCol}, Linha ${pattern.minRow}`;
    }

    const gidIndicator = document.getElementById('editor-gid-indicator');
    if (gidIndicator) gidIndicator.textContent = badgeText;
  }

  updateTilePreview(gid) {
    this.setTileGid(gid);
  }

  scrollToTileInPalette(gid) {
    if (this.activeSidebarTab !== 'layers') {
      this.switchSidebarTab('layers');
    }

    const wrapper = document.querySelector('.tileset-canvas-wrapper');
    if (!wrapper || !this.activeTileset) return;

    const firstGid = this.activeTileset.firstgid || 1;
    const localId = gid - firstGid;
    if (localId < 0) return;

    const margin = this.activeTileset.margin || 0;
    const spacing = this.activeTileset.spacing || 0;
    const tileW = this.activeTileset.tilewidth || this.tileSize || 32;
    const tileH = this.activeTileset.tileheight || this.tileSize || 32;

    const col = localId % this.columns;
    const row = Math.floor(localId / this.columns);

    const targetX = margin + col * (tileW + spacing);
    const targetY = margin + row * (tileH + spacing);

    // Scroll both X and Y so the selected tile is centered in the viewer
    const scrollLeft = Math.max(0, targetX - (wrapper.clientWidth / 2) + (tileW / 2));
    const scrollTop = Math.max(0, targetY - (wrapper.clientHeight / 2) + (tileH / 2));

    wrapper.scrollTo({
      left: Math.round(scrollLeft),
      top: Math.round(scrollTop),
      behavior: 'smooth'
    });

    this.highlightTilesetSelection();
  }

  // ─── Save Map ─────────────────────────────────────────────────────────────

  // ─── Visual Tile Matcher / Outside Similarity Engine ────────────────────

  _ensureImageLoaded(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  getTileSignature(canvas, ctx, srcX, srcY, tileW = 32, tileH = 32) {
    let imgData;
    try {
      imgData = ctx.getImageData(srcX, srcY, tileW, tileH);
    } catch (e) {
      return new Float32Array(64);
    }

    const data = imgData.data;
    const gridSize = 4;
    const blockW = Math.floor(tileW / gridSize);
    const blockH = Math.floor(tileH / gridSize);
    const vec = new Float32Array(gridSize * gridSize * 4);

    let vecIdx = 0;
    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        let sumR = 0, sumG = 0, sumB = 0, sumA = 0, count = 0;
        const startX = gx * blockW;
        const startY = gy * blockH;

        for (let py = 0; py < blockH; py++) {
          for (let px = 0; px < blockW; px++) {
            const pixelIdx = ((startY + py) * tileW + (startX + px)) * 4;
            sumR += data[pixelIdx];
            sumG += data[pixelIdx + 1];
            sumB += data[pixelIdx + 2];
            sumA += data[pixelIdx + 3];
            count++;
          }
        }

        vec[vecIdx++] = sumR / Math.max(1, count);
        vec[vecIdx++] = sumG / Math.max(1, count);
        vec[vecIdx++] = sumB / Math.max(1, count);
        vec[vecIdx++] = sumA / Math.max(1, count);
      }
    }
    return vec;
  }

  calcVectorDistance(v1, v2) {
    let diffSq = 0;
    for (let i = 0; i < v1.length; i++) {
      const d = v1[i] - v2[i];
      diffSq += d * d;
    }
    return Math.sqrt(diffSq);
  }

  async findSimilarOutsideTiles(gid, targetTilesetObj = null) {
    if (!gid || gid <= 0) return null;
    const listEl = document.getElementById('similar-tiles-list');
    if (listEl) {
      listEl.innerHTML = '<small class="similarity-placeholder" style="color:#00e5ff;">🔍 Buscando tiles correspondentes...</small>';
    }

    try {
      const mapTilesets = this.editorScene?.mapJsonData?.tilesets || [];
      const srcTileset = mapTilesets.find(t => {
        const start = t.firstgid || 1;
        const count = t.tilecount || (t.columns * 100);
        return gid >= start && gid < start + count;
      }) || this.activeTileset;

      if (!srcTileset) return null;

      const firstGid = srcTileset.firstgid || 1;
      const localId = gid - firstGid;
      const cols = srcTileset.columns || 64;
      const tileW = srcTileset.tilewidth || 32;
      const tileH = srcTileset.tileheight || 32;
      const margin = srcTileset.margin || 0;
      const spacing = srcTileset.spacing || 0;

      const col = localId % cols;
      const row = Math.floor(localId / cols);
      const srcX = margin + col * (tileW + spacing);
      const srcY = margin + row * (tileH + spacing);

      const srcFile = (srcTileset.image || srcTileset.name + '.png').split('/').pop();
      const srcImg = await this._ensureImageLoaded('/assets/tilesets/' + encodeURIComponent(srcFile));
      if (!srcImg) return null;

      const helperCanvas = document.createElement('canvas');
      helperCanvas.width = tileW;
      helperCanvas.height = tileH;
      const helperCtx = helperCanvas.getContext('2d');
      helperCtx.drawImage(srcImg, srcX, srcY, tileW, tileH, 0, 0, tileW, tileH);

      const srcVec = this.getTileSignature(helperCanvas, helperCtx, 0, 0, tileW, tileH);

      // Determine target preset/tileset to search
      let targetPreset = null;
      const targetObj = targetTilesetObj || this.activeTileset;
      if (targetObj) {
        const targetName = targetObj.name;
        targetPreset = PRESET_TILESETS.find(p => p.name === targetName || p.file.replace(/\.png$/i, '') === targetName);
      }
      if (!targetPreset && targetObj) {
        const fallbackFile = (targetObj.image || targetObj.name + '.png').split('/').pop();
        targetPreset = {
          name: targetObj.name,
          file: fallbackFile,
          columns: targetObj.columns || 16,
          tilecount: targetObj.tilecount || (targetObj.columns * 100),
          tilewidth: targetObj.tilewidth || 32,
          tileheight: targetObj.tileheight || 32,
          margin: targetObj.margin || 0,
          spacing: targetObj.spacing || 0
        };
      }
      if (!targetPreset) {
        targetPreset = PRESET_TILESETS.find(p => p.name.includes('Outside1 Spring'))
          || PRESET_TILESETS.find(p => p.name.includes('Outside'))
          || PRESET_TILESETS[0];
      }

      const targetImg = await this._ensureImageLoaded('/assets/tilesets/' + encodeURIComponent(targetPreset.file));
      if (!targetImg) return null;

      const tCols = targetPreset.columns || 64;
      const tTileCount = targetPreset.tilecount || 4000;
      const tMargin = targetPreset.margin || 0;
      const tSpacing = targetPreset.spacing || 0;

      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = targetImg.width;
      targetCanvas.height = targetImg.height;
      const targetCtx = targetCanvas.getContext('2d');
      targetCtx.drawImage(targetImg, 0, 0);

      if (!this.tileSignaturesCache) this.tileSignaturesCache = new Map();
      const cacheKey = targetPreset.name;

      let targetSignatures = this.tileSignaturesCache.get(cacheKey);
      if (!targetSignatures) {
        targetSignatures = [];
        for (let i = 0; i < tTileCount; i++) {
          const tc = i % tCols;
          const tr = Math.floor(i / tCols);
          const tx = tMargin + tc * (tileW + tSpacing);
          const ty = tMargin + tr * (tileH + tSpacing);
          if (tx + tileW <= targetImg.width && ty + tileH <= targetImg.height) {
            const vec = this.getTileSignature(targetCanvas, targetCtx, tx, ty, tileW, tileH);
            targetSignatures.push({ localId: i, col: tc, row: tr, tx, ty, vec });
          }
        }
        this.tileSignaturesCache.set(cacheKey, targetSignatures);
      }

      const matches = [];
      const maxDist = Math.sqrt(16 * 4 * 255 * 255);

      for (const item of targetSignatures) {
        const dist = this.calcVectorDistance(srcVec, item.vec);
        const matchPct = Math.max(0, Math.round(100 * (1 - dist / maxDist)));
        matches.push({ ...item, dist, matchPct });
      }

      matches.sort((a, b) => a.dist - b.dist);
      const topMatches = matches.slice(0, 8);

      if (!listEl) return null;
      listEl.innerHTML = '';

      // Update header title to show the current target tileset
      const headerTitle = document.querySelector('#tile-similarity-container .similarity-header span');
      if (headerTitle) {
        headerTitle.textContent = `🔍 Correspondências em ${targetPreset.name}`;
      }

      const currentMapTilesets = this.editorScene?.mapJsonData?.tilesets || [];
      let boundIdx = currentMapTilesets.findIndex(t => t.name === targetPreset.name);
      if (boundIdx < 0) {
        this.addLibraryTileset(targetPreset.name);
        boundIdx = (this.editorScene?.mapJsonData?.tilesets || []).findIndex(t => t.name === targetPreset.name);
      }
      const targetFirstGid = boundIdx >= 0 ? (this.editorScene.mapJsonData.tilesets[boundIdx].firstgid || 1) : 1;

      topMatches.forEach((match, idx) => {
        const card = document.createElement('div');
        card.className = 'similar-tile-card' + (idx === 0 ? ' active' : '');
        card.title = `Correspondência #${idx + 1} (${match.matchPct}% de similaridade no ${targetPreset.name})`;

        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 36;
        thumbCanvas.height = 36;
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx.imageSmoothingEnabled = false;
        thumbCtx.drawImage(targetImg, match.tx, match.ty, tileW, tileH, 0, 0, 36, 36);
        card.appendChild(thumbCanvas);

        const badge = document.createElement('div');
        badge.className = 'similar-tile-badge';
        badge.textContent = `${match.matchPct}%`;
        card.appendChild(badge);

        card.addEventListener('click', () => {
          listEl.querySelectorAll('.similar-tile-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          if (boundIdx >= 0) {
            const targetGid = targetFirstGid + match.localId;
            if (this.activeTileset?.name !== targetPreset.name) {
              this.switchTileset(boundIdx, targetGid);
            } else {
              this.setTileGid(targetGid);
              this.scrollToTileInPalette(targetGid);
            }
            this.showToast(`✨ Tile similar selecionado! (GID ${targetGid} - ${match.matchPct}%)`, 'success');
          }
        });

        listEl.appendChild(card);
      });

      if (topMatches.length > 0) {
        return targetFirstGid + topMatches[0].localId;
      }
      return null;

    } catch (err) {
      console.warn('[TileMatcher Error]:', err);
      if (listEl) {
        listEl.innerHTML = '<small class="similarity-placeholder">Sem correspondências encontradas</small>';
      }
      return null;
    }
  }

  async saveMap() {
    const saveBtn = document.getElementById('btn-editor-save');
    if (saveBtn) saveBtn.disabled = true;

    this.showToast(`Salvando '${this.editorScene.currentMapName}' e sincronizando banco de dados...`, 'info');

    try {
      const exportJson = this.editorScene.getExportJson();
      if (!exportJson) throw new Error('Falha ao gerar JSON do mapa.');

      const mapParam = encodeURIComponent(this.editorScene.currentMapName);
      const res = await fetch(`/api/admin/map?map=${mapParam}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportJson)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar mapa.');
      }

      // Sync encounter zones from map JSON to database persistently
      const spawnLayer = exportJson.layers?.find(l => (l.name === 'PokemonSpawns' || l.name === 'Spawns' || l.name === 'Encounters') && l.type === 'objectgroup');
      if (spawnLayer && Array.isArray(spawnLayer.objects)) {
        const dbZones = spawnLayer.objects.map(obj => {
          const props = this.editorScene._readProps(obj.properties);
          let pList = [];
          try {
            pList = typeof props.pokemonSpawns === 'string' ? JSON.parse(props.pokemonSpawns) : (props.pokemonSpawns || []);
          } catch (e) {
            pList = [];
          }
          return {
            name: props.name || obj.name || 'Área de Spawn',
            encounterType: props.encounterType || 'grass',
            rate: props.rate || 10,
            x: obj.x || 0,
            y: obj.y || 0,
            width: obj.width || 64,
            height: obj.height || 64,
            pokemonSpawns: pList
          };
        });

        await fetch('/api/admin/encounter-zones/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mapId: this.editorScene.currentMapName, zones: dbZones })
        });
      }

      this.showToast(`MAPA '${this.editorScene.currentMapName}' E SPAWNS SALVOS NO BANCO!`, 'success');
    } catch (err) {
      console.error('[EditorUI Save Error]:', err);
      this.showToast('Erro ao salvar mapa: ' + err.message, 'error');
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('editor-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `editor-toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  show() {
    document.body.classList.add('editor-mode');
    const wrapper = document.getElementById('game-wrapper');
    if (wrapper) {
      wrapper.style.position = '';
      wrapper.style.top = '';
      wrapper.style.left = '';
      wrapper.style.width = '';
      wrapper.style.height = '';
    }
    this.container.classList.remove('hidden');
    this.populateTilesetSelect();
    this.fetchMapsList();

    if (this.editorScene && this.editorScene.onEditorOpen) {
      this.editorScene.onEditorOpen();
    }
  }

  hide() {
    document.body.classList.remove('editor-mode');
    this.container.classList.add('hidden');
    window.location.hash = '';
    window.location.reload();
  }
}
