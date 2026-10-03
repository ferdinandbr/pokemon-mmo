import DialogueBox from './DialogueBox';
import { ROOMS_CONFIG } from '../maps/roomData';
import { COLLISION_TYPES, COLLISION_META } from '../maps/collisionConfig';
import NodeGraphUI from './NodeGraphUI';

export const PRESET_TILESETS = [
  { name: 'Outside4 Winter', file: 'Outside4 Winter.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 4544, imagewidth: 256, imageheight: 18176 },
  { name: 'Outside1 Spring', file: 'Outside1 Spring.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 4544, imagewidth: 256, imageheight: 18176 },
  { name: 'Outside2 Summer', file: 'Outside2 Summer.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 4544, imagewidth: 256, imageheight: 18176 },
  { name: 'Outside3 Autumn', file: 'Outside3 Autumn.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 4544, imagewidth: 256, imageheight: 18176 },
  { name: 'Outside', file: 'Outside.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 4016, imagewidth: 256, imageheight: 16064 },
  { name: 'spz3zUx_scaled', file: 'spz3zUx_scaled.png', tilewidth: 32, tileheight: 32, columns: 64, tilecount: 1689, imagewidth: 2176, imageheight: 918, margin: 1, spacing: 2 },
  { name: 'Caves', file: 'Caves.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 800, imagewidth: 256, imageheight: 3200 },
  { name: 'Dungeon cave', file: 'Dungeon cave.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 152, imagewidth: 256, imageheight: 608 },
  { name: 'Dungeon forest', file: 'Dungeon forest.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 160, imagewidth: 256, imageheight: 640 },
  { name: 'Factory interior', file: 'Factory interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 224, imagewidth: 256, imageheight: 896 },
  { name: 'Game Corner interior', file: 'Game Corner interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 240, imagewidth: 256, imageheight: 960 },
  { name: 'Graveyard tower interior', file: 'Graveyard tower interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 152, imagewidth: 256, imageheight: 608 },
  { name: 'Gyms interior', file: 'Gyms interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 1264, imagewidth: 256, imageheight: 5056 },
  { name: 'Interior general', file: 'Interior general.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 2120, imagewidth: 256, imageheight: 8480 },
  { name: 'Mansion interior', file: 'Mansion interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 232, imagewidth: 256, imageheight: 928 },
  { name: 'Mart interior', file: 'Mart interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 144, imagewidth: 256, imageheight: 576 },
  { name: 'Multiplayer rooms', file: 'Multiplayer rooms.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 344, imagewidth: 256, imageheight: 1376 },
  { name: 'Museum interior', file: 'Museum interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 184, imagewidth: 256, imageheight: 736 },
  { name: 'Poke Centre interior', file: 'Poke Centre interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 320, imagewidth: 256, imageheight: 1280 },
  { name: 'Ruins interior', file: 'Ruins interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 128, imagewidth: 256, imageheight: 512 },
  { name: 'Trainer Tower interior', file: 'Trainer Tower interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 440, imagewidth: 256, imageheight: 1760 },
  { name: 'Underground path', file: 'Underground path.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 72, imagewidth: 256, imageheight: 288 },
  { name: 'Underwater', file: 'Underwater.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 112, imagewidth: 256, imageheight: 448 },
  { name: 'Bike shop interior', file: 'Bike shop interior.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 176, imagewidth: 256, imageheight: 704 },
  { name: 'Boat', file: 'Boat.png', tilewidth: 32, tileheight: 32, columns: 8, tilecount: 648, imagewidth: 256, imageheight: 2592 }
];

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

    this.allMapsList = this._getDefaultMapsList();
    this.activeSidebarTab = 'layers'; // 'layers', 'portals', 'signs'

    this.initHTML();
    this.populateMapSelect();
    this.populatePortalTargetSelect();
    this.nodeGraphUI = new NodeGraphUI(this, this.editorScene);
    this.bindEvents();
    this.fetchMapsList();
  }

  _getDefaultMapsList() {
    const CITIES_LIST = [
      'pallet_town', 'viridian_city', 'pewter_city', 'cerulean_city',
      'vermilion_city', 'lavender_town', 'celadon_city', 'saffron_city',
      'fuchsia_city', 'cinnabar_island', 'indigo_plateau'
    ];
    const allKeys = Object.keys(ROOMS_CONFIG);
    const cities = allKeys.filter(k => CITIES_LIST.includes(k) || k.endsWith('_city') || k.endsWith('_town'));
    const routes = allKeys.filter(k => k.startsWith('route_')).sort((a, b) => {
      const na = parseInt(a.replace('route_', ''), 10) || 0;
      const nb = parseInt(b.replace('route_', ''), 10) || 0;
      return na - nb;
    });
    const root = allKeys.filter(k => !cities.includes(k) && !routes.includes(k));
    return { cities, routes, root };
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
              <canvas id="active-tile-preview" width="36" height="36"></canvas>
              <div class="tile-info">
                <div>GID Selecionado: <strong id="info-gid">1</strong></div>
                <div>Posição: <span id="info-gid-coords">Coluna 0, Linha 0</span></div>
              </div>
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

            <div id="editor-portals-list" style="max-height: 480px; overflow-y: auto;">
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

            <div id="editor-signs-list" style="max-height: 480px; overflow-y: auto;">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      </div>

      <!-- Portal Inspector / Edit Modal -->
      <div id="editor-portal-modal" class="editor-modal hidden">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"></path><path d="M14 12v.01"></path></svg>
            <h4>CONFIGURAR PORTAL</h4>
          </div>
          <button id="btn-close-portal-modal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Rótulo do Portal</label>
            <input type="text" id="portal-prop-label" class="form-input" placeholder="Ex: Entrada Rota 1" />
          </div>
          <div class="form-group">
            <label>Mapa de Destino</label>
            <select id="portal-prop-target-room" class="form-input editor-map-select"></select>
          </div>

          <!-- SPAWN DESTINO ROW + PICK BUTTON -->
          <div class="form-row" style="align-items: flex-end; gap: 6px;">
            <div class="form-group" style="flex:1;">
              <label>Spawn X (px)</label>
              <input type="number" id="portal-prop-target-x" class="form-input" />
            </div>
            <div class="form-group" style="flex:1;">
              <label>Spawn Y (px)</label>
              <input type="number" id="portal-prop-target-y" class="form-input" />
            </div>
            <button id="btn-portal-pick-target" class="editor-btn small gold" style="height: 34px; padding: 0 10px; display:inline-flex; align-items:center; gap:4px; font-weight: 600;" title="Carrega o mapa de destino para você clicar no local exato do spawn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Marcar Destino</span>
            </button>
          </div>

          <!-- GATILHO ORIGEM ROW + RE-MARK BUTTON -->
          <div class="form-row" style="align-items: flex-end; gap: 6px;">
            <div class="form-group" style="flex:1;">
              <label>Gatilho X (px)</label>
              <input type="number" id="portal-prop-x" class="form-input" />
            </div>
            <div class="form-group" style="flex:1;">
              <label>Gatilho Y (px)</label>
              <input type="number" id="portal-prop-y" class="form-input" />
            </div>
            <button id="btn-portal-pick-origin" class="editor-btn small secondary" style="height: 34px; padding: 0 10px; display:inline-flex; align-items:center; gap:4px;" title="Re-desenhar o retângulo do portal no mapa de origem">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>
              <span>Marcar Origem</span>
            </button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Largura (W)</label>
              <input type="number" id="portal-prop-w" class="form-input" />
            </div>
            <div class="form-group">
              <label>Altura (H)</label>
              <input type="number" id="portal-prop-h" class="form-input" />
            </div>
          </div>

          <!-- AUTOMATIC TWO-WAY CONNECT CHECKBOX -->
          <div style="margin: 8px 0 12px 0; background: rgba(15, 23, 42, 0.6); padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(251, 191, 36, 0.3);">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 11px; margin: 0; color: #ffecb3;">
              <input type="checkbox" id="portal-prop-create-return" checked style="accent-color: #f59e0b;" />
              <span>Criar portal de retorno automático (Destino ➔ Origem)</span>
            </label>
          </div>

          <div class="modal-actions">
            <button id="btn-portal-jump" class="editor-btn small secondary" title="Carrega o mapa de destino no editor para navegar" style="display:inline-flex; align-items:center; gap:4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              <span>Ver Destino</span>
            </button>
            <button id="btn-save-portal" class="editor-btn small primary">Salvar Portal</button>
            <button id="btn-delete-portal" class="editor-btn small danger">Excluir</button>
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

    this.editorScene.onTilePicked = (gid, layerName) => {
      // 1. Switch to layers tab so the tileset viewer is visible
      if (this.activeSidebarTab !== 'layers') {
        this.switchSidebarTab('layers');
      }

      if (layerName && layerName !== this.editorScene.activeLayerName) {
        this._selectLayer(layerName);
      }

      // 2. Locate tileset that contains this gid
      const tilesets = this.editorScene.mapJsonData?.tilesets || [];
      let foundTilesetIdx = -1;
      for (let i = 0; i < tilesets.length; i++) {
        const t = tilesets[i];
        const endGid = (t.firstgid || 1) + (t.tilecount || 10000);
        if (gid >= t.firstgid && gid < endGid) {
          foundTilesetIdx = i;
          break;
        }
      }

      if (foundTilesetIdx >= 0) {
        this.switchTileset(foundTilesetIdx, gid);
      } else {
        this.setTileGid(gid);
        this.scrollToTileInPalette(gid);
      }

      this.showToast(`🎯 Tile GID ${gid} copiado da camada "${layerName || 'Ativa'}"!`, 'success');
    };

    this.editorScene.onObjectDeleted = (obj) => {
      this.renderPortalsList();
      this.renderSignsList();
    };

    this.editorScene.onObjectSelected = (obj) => {
      if (obj.layerName === 'Portals' || obj.type === 'portal_link') {
        this.openPortalModal(obj);
        this.renderPortalsList();
      } else {
        this.openObjectModal(obj);
      }
    };

    this.editorScene.onPortalSelected = (portal) => {
      this.openPortalModal(portal);
      this.renderPortalsList();
    };

    this.editorScene.onSignSelected = (sign) => {
      this.openSignModal(sign);
      this.renderSignsList();
    };

    this.editorScene.onMapLoaded = (mapName, mapJsonData, layerNames) => {
      this.renderLayersList(layerNames);
      this.populateTilesetSelect();
      this.renderPortalsList();
      this.renderSignsList();

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
    };

    this.editorScene.onToast = (msg, type) => {
      this.showToast(msg, type);
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
          if (context.createReturn !== undefined) {
            const chk = document.getElementById('portal-prop-create-return');
            if (chk) chk.checked = context.createReturn;
          }
        }
        modal.classList.remove('hidden');
        if (this.editorScene?.input?.keyboard) {
          this.editorScene.input.keyboard.enabled = false;
        }
      }

      this.showToast(`🎯 Spawn de destino definido: (${targetX}px, ${targetY}px)!`, 'success');
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
    const tools = ['hand', 'pencil', 'eraser', 'bucket', 'picker', 'sign', 'link', 'object'];
    tools.forEach(tool => {
      const btn = document.getElementById(`tool-${tool}`);
      if (btn) {
        btn.addEventListener('click', () => this.selectTool(tool));
      }
    });

    document.getElementById('tool-zoomin')?.addEventListener('click', () => this.editorScene.zoomIn());
    document.getElementById('tool-zoomout')?.addEventListener('click', () => this.editorScene.zoomOut());

    // Sidebar Tabs
    ['layers', 'portals', 'signs'].forEach(tab => {
      document.getElementById(`tab-btn-${tab}`)?.addEventListener('click', () => this.switchSidebarTab(tab));
    });

    // New Portal & New Sign Buttons (First mark on map, then open config modal)
    document.getElementById('btn-add-new-portal')?.addEventListener('click', () => {
      this.selectTool('link');
      this.showToast('Clique e arraste no mapa para marcar a área do teleporte (1 ou mais grids).', 'info');
    });

    document.getElementById('btn-add-new-sign')?.addEventListener('click', () => {
      this.selectTool('sign');
      this.showToast('Clique no mapa para marcar a posição da placa (1 grid).', 'info');
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
    document.getElementById('btn-editor-reload')?.addEventListener('click', () => {
      if (confirm('Recarregar mapa atual? Alterações não salvas serão perdidas.')) {
        this.editorScene.loadMapByName(this.editorScene.currentMapName);
      }
    });
    document.getElementById('btn-editor-exit')?.addEventListener('click', () => this.hide());

    // Tileset Canvas Click: PRESERVE ACTIVE TOOL
    this.tilesetCanvas.addEventListener('click', (e) => {
      const rect = this.tilesetCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const margin = this.activeTileset?.margin || 0;
      const spacing = this.activeTileset?.spacing || 0;
      const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
      const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

      const col = Math.floor((clickX - margin) / (tileW + spacing));
      const row = Math.floor((clickY - margin) / (tileH + spacing));

      if (col < 0 || col >= this.columns || row < 0) return;

      const firstGid = this.activeTileset ? this.activeTileset.firstgid : 1;
      const gid = firstGid + (row * this.columns) + col;
      this.setTileGid(gid);
      // Only switch to pencil if currently using sign, link or object
      if (['sign', 'link', 'object'].includes(this.editorScene.activeTool)) {
        this.selectTool('pencil');
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

    // Interactive Portal Picking Buttons
    document.getElementById('btn-portal-pick-target')?.addEventListener('click', async () => {
      const targetRoom = document.getElementById('portal-prop-target-room').value;
      const label = document.getElementById('portal-prop-label').value;
      const targetX = parseInt(document.getElementById('portal-prop-target-x').value, 10) || 0;
      const targetY = parseInt(document.getElementById('portal-prop-target-y').value, 10) || 0;
      const x = parseInt(document.getElementById('portal-prop-x').value, 10) || 0;
      const y = parseInt(document.getElementById('portal-prop-y').value, 10) || 0;
      const w = parseInt(document.getElementById('portal-prop-w').value, 10) || 32;
      const h = parseInt(document.getElementById('portal-prop-h').value, 10) || 32;
      const createReturn = document.getElementById('portal-prop-create-return')?.checked ?? true;

      const currentObj = this.editorScene.selectedObject || {};

      const context = {
        sourceMap: this.editorScene.currentMapName,
        targetMap: targetRoom,
        portalId: currentObj.id,
        label,
        targetX,
        targetY,
        originX: x,
        originY: y,
        originW: w,
        originH: h,
        createReturn
      };

      document.getElementById('editor-portal-modal').classList.add('hidden');

      if (targetRoom && targetRoom !== this.editorScene.currentMapName) {
        this.showToast(`Carregando mapa de destino '${targetRoom}'...`, 'info');
        await this.editorScene.loadMapByName(targetRoom);
        const mapSelect = document.getElementById('editor-map-select');
        if (mapSelect) mapSelect.value = targetRoom;
      }

      this.editorScene.startPortalTargetPicking(context);

      const pickerBar = document.getElementById('portal-picker-bar');
      if (pickerBar) {
        document.getElementById('portal-picker-mode-badge').textContent = '🎯 MARCAR SPAWN DE DESTINO';
        document.getElementById('portal-picker-instructions').textContent = `Clique no mapa '${targetRoom}' para marcar a posição de nascimento (use Espaço/Arrastar para Pan).`;
        pickerBar.classList.remove('hidden');
      }
    });

    document.getElementById('btn-portal-pick-origin')?.addEventListener('click', async () => {
      const targetRoom = document.getElementById('portal-prop-target-room').value;
      const label = document.getElementById('portal-prop-label').value;
      const targetX = parseInt(document.getElementById('portal-prop-target-x').value, 10) || 0;
      const targetY = parseInt(document.getElementById('portal-prop-target-y').value, 10) || 0;
      const createReturn = document.getElementById('portal-prop-create-return')?.checked ?? true;

      const currentObj = this.editorScene.selectedObject || {};

      const context = {
        sourceMap: this.editorScene.currentMapName,
        targetMap: targetRoom,
        portalId: currentObj.id,
        label,
        targetX,
        targetY,
        createReturn
      };

      document.getElementById('editor-portal-modal').classList.add('hidden');
      this.selectTool('link');
      this.showToast('📍 Clique e arraste no mapa para desenhar a área do gatilho de origem.', 'info');

      const pickerBar = document.getElementById('portal-picker-bar');
      if (pickerBar) {
        document.getElementById('portal-picker-mode-badge').textContent = '📍 DESENHAR GATILHO DE ORIGEM';
        document.getElementById('portal-picker-instructions').textContent = 'Clique e arraste no mapa para marcar a área do portal.';
        pickerBar.classList.remove('hidden');
      }
    });

    document.getElementById('btn-portal-picker-cancel')?.addEventListener('click', async () => {
      document.getElementById('portal-picker-bar')?.classList.add('hidden');
      this.editorScene.stopPortalPicking();
      const ctx = this.editorScene.portalPickContext;
      if (ctx && ctx.sourceMap && ctx.sourceMap !== this.editorScene.currentMapName) {
        await this.editorScene.loadMapByName(ctx.sourceMap);
        const mapSelect = document.getElementById('editor-map-select');
        if (mapSelect) mapSelect.value = ctx.sourceMap;
      }
      document.getElementById('editor-portal-modal')?.classList.remove('hidden');
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

    // Stop propagation of all keydown events on inputs and textareas so typing (spaces, letters) is completely unaffected
    const modalInputs = document.querySelectorAll(
      '#editor-sign-modal input, #editor-sign-modal textarea, ' +
      '#editor-portal-modal input, #editor-portal-modal select, ' +
      '#editor-object-modal input, #editor-object-modal textarea, ' +
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
        if (data && (data.cities?.length || data.routes?.length)) {
          this.allMapsList = data;
        }
      }
    } catch (err) {
      console.warn('[EditorUI fetchMapsList Warning]:', err);
    }
    this.populateMapSelect();
    this.populatePortalTargetSelect();
  }

  populateMapSelect() {
    const select = document.getElementById('editor-map-select');
    if (!select) return;

    select.innerHTML = '';

    // Group 1: Cities
    if (this.allMapsList.cities && this.allMapsList.cities.length > 0) {
      const groupCities = document.createElement('optgroup');
      groupCities.label = '🏙️ Cidades de Kanto';
      this.allMapsList.cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city.replace('_', ' ').toUpperCase();
        groupCities.appendChild(opt);
      });
      select.appendChild(groupCities);
    }

    // Group 2: Routes
    if (this.allMapsList.routes && this.allMapsList.routes.length > 0) {
      const groupRoutes = document.createElement('optgroup');
      groupRoutes.label = '🌿 Rotas de Kanto';
      this.allMapsList.routes.forEach(route => {
        const opt = document.createElement('option');
        opt.value = route;
        opt.textContent = route.replace('_', ' ').toUpperCase();
        groupRoutes.appendChild(opt);
      });
      select.appendChild(groupRoutes);
    }

    // Group 3: Other maps in root
    if (this.allMapsList.root && this.allMapsList.root.length > 0) {
      const remaining = this.allMapsList.root.filter(r => !this.allMapsList.cities.includes(r) && !this.allMapsList.routes.includes(r));
      if (remaining.length > 0) {
        const groupOther = document.createElement('optgroup');
        groupOther.label = '🗺️ Outros Mapas';
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
    const all = [...(this.allMapsList.cities || []), ...(this.allMapsList.routes || []), ...(this.allMapsList.root || [])];
    all.sort().forEach(mapId => {
      const opt = document.createElement('option');
      opt.value = mapId;
      opt.textContent = mapId.replace('_', ' ').toUpperCase();
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

    const props = this.editorScene._readProps(obj.properties);
    document.getElementById('portal-prop-label').value = props.label || obj.name || '';
    document.getElementById('portal-prop-target-room').value = props.targetRoom || 'route_1';
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

    const createReturn = document.getElementById('portal-prop-create-return')?.checked;
    if (createReturn && targetRoom && targetRoom !== this.editorScene.currentMapName) {
      await this.saveReturnPortal(targetRoom, this.editorScene.currentMapName, targetX, targetY, x, y + h);
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

      let existingReturn = portalLayer.objects.find(o => Math.abs(o.x - returnX) < 16 && Math.abs(o.y - returnY) < 16);
      if (!existingReturn) {
        existingReturn = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: `Voltar para ${sourceMapName}`,
          type: 'portal_link',
          x: returnX,
          y: returnY,
          width: 32,
          height: 32,
          properties: []
        };
        portalLayer.objects.push(existingReturn);
      }

      existingReturn.name = `Voltar para ${sourceMapName}`;
      existingReturn.properties = [
        { name: 'targetRoom', value: sourceMapName },
        { name: 'targetX', value: returnTargetX },
        { name: 'targetY', value: returnTargetY },
        { name: 'label', value: `Voltar para ${sourceMapName}` },
        { name: 'isLinked', value: true }
      ];

      await fetch(`/api/admin/map?map=${encodeURIComponent(targetRoom)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetMapJson)
      });

      this.showToast(`⚡ Portal de retorno em '${targetRoom}' criado e salvo automaticamente!`, 'success');
    } catch (err) {
      console.warn('[saveReturnPortal] Falha ao criar portal de retorno automático:', err);
    }
  }

  async deletePortalModal() {
    const current = this.editorScene.selectedObject;
    if (!current || !this.editorScene.mapJsonData) return;

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

  // ─── Sidebar Tabs ─────────────────────────────────────────────────────────

  switchSidebarTab(tabName) {
    this.activeSidebarTab = tabName;
    ['layers', 'portals', 'signs'].forEach(t => {
      document.getElementById(`tab-btn-${t}`)?.classList.toggle('active', t === tabName);
      document.getElementById(`tab-content-${t}`)?.classList.toggle('hidden', t !== tabName);
    });

    if (tabName === 'portals') {
      this.renderPortalsList();
    } else if (tabName === 'signs') {
      this.renderSignsList();
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

    const tools = ['hand', 'pencil', 'eraser', 'bucket', 'picker', 'sign', 'link', 'object'];
    tools.forEach(t => {
      document.getElementById(`tool-${t}`)?.classList.toggle('active', t === toolName);
    });

    const toolLabels = {
      hand: 'Mão (H)',
      pencil: 'Pincel (B)',
      eraser: 'Borracha (E)',
      bucket: 'Preenchimento (F)',
      picker: 'Conta-gotas (I)',
      sign: '🪧 Placa (1 grid)',
      link: '🚪 Teleporte (Grids)',
      object: 'Objetos (O)'
    };

    const toolEl = document.getElementById('editor-tool-indicator');
    if (toolEl) toolEl.innerHTML = `<span>${toolLabels[toolName] || toolName.toUpperCase()}</span>`;
  }

  setTileGid(gid) {
    this.activeGid = gid;
    this.editorScene.setSelectedTile(gid);
    this.updateTilePreview(gid);

    const gidEl = document.getElementById('editor-gid-indicator');
    if (gidEl) gidEl.textContent = `GID: ${gid}`;
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
      libGroup.label = '➕ Adicionar da Biblioteca...';

      unaddedPresets.forEach(p => {
        const opt = document.createElement('option');
        opt.value = `lib:${p.name}`;
        opt.textContent = `+ ${p.name}`;
        libGroup.appendChild(opt);
      });
      select.appendChild(libGroup);
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

  addLibraryTileset(presetName) {
    const preset = PRESET_TILESETS.find(p => p.name === presetName);
    if (!preset) {
      this.showToast(`Tileset '${presetName}' não encontrado na biblioteca.`, 'error');
      return;
    }

    if (!this.editorScene.mapJsonData.tilesets) {
      this.editorScene.mapJsonData.tilesets = [];
    }

    const tilesets = this.editorScene.mapJsonData.tilesets;
    let maxGid = 1;
    tilesets.forEach(t => {
      const endGid = (t.firstgid || 1) + (t.tilecount || 0);
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
      margin: 0,
      spacing: 0
    };

    tilesets.push(newTileset);
    this.editorScene.bindTilesetToMap(newTileset);
    this.populateTilesetSelect();
    this.switchTileset(tilesets.length - 1);
    this.showToast(`✅ Tileset '${preset.name}' adicionado ao mapa! (GID inicial: ${maxGid})`, 'success');
  }

  switchTileset(idx, targetGid = null) {
    const tilesets = this.editorScene.mapJsonData?.tilesets;
    if (!tilesets || !tilesets[idx]) return;

    this.activeTileset = tilesets[idx];
    const filename = this.activeTileset.image.split('/').pop();

    this.columns = this.activeTileset.columns || 16;
    this.tileSize = this.activeTileset.tilewidth || 32;
    this.totalTiles = this.activeTileset.tilecount || 1000;

    const selectEl = document.getElementById('editor-tileset-select');
    if (selectEl) {
      selectEl.value = `map:${idx}`;
    }

    const onReady = () => {
      this.drawTilesetPalette();
      const gidToFocus = targetGid !== null ? targetGid : (this.activeGid || this.activeTileset.firstgid);
      this.setTileGid(gidToFocus);
      this.scrollToTileInPalette(gidToFocus);
    };

    if (this.tilesetImage && this.tilesetImage.src.endsWith(filename) && this.tilesetImage.complete) {
      onReady();
    } else {
      this.tilesetImage = new Image();
      this.tilesetImage.src = `/assets/tilesets/${filename}?t=${Date.now()}`;
      this.tilesetImage.onload = () => {
        onReady();
      };
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
          const columns = Math.floor(img.width / tileW);
          const tilecount = columns * Math.floor(img.height / tileH);

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
            columns: columns,
            tilecount: tilecount,
            imagewidth: img.width,
            imageheight: img.height
          };
          tilesets.push(newTileset);

          if (!this.editorScene.textures.exists(cleanName)) {
            this.editorScene.textures.addImage(cleanName, img);
          }
          this.editorScene.bindTilesetToMap(newTileset);

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

  drawTilesetPalette() {
    if (!this.tilesetImage.complete) return;
    this.tilesetCanvas.width = this.tilesetImage.width;
    this.tilesetCanvas.height = this.tilesetImage.height;
    this.tilesetCtx.drawImage(this.tilesetImage, 0, 0);
    this.highlightTilesetGid(this.activeGid);
  }

  highlightTilesetGid(gid) {
    if (!this.tilesetImage.complete) return;
    this.tilesetCtx.drawImage(this.tilesetImage, 0, 0);

    const firstGid = this.activeTileset ? this.activeTileset.firstgid : 1;
    const localId = gid - firstGid;
    if (localId < 0) return;

    const margin = this.activeTileset?.margin || 0;
    const spacing = this.activeTileset?.spacing || 0;
    const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
    const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

    const col = localId % this.columns;
    const row = Math.floor(localId / this.columns);
    const x = margin + col * (tileW + spacing);
    const y = margin + row * (tileH + spacing);

    // Glowing vibrant cyan and gold box
    this.tilesetCtx.strokeStyle = '#ffd700';
    this.tilesetCtx.lineWidth = 3;
    this.tilesetCtx.strokeRect(x - 1, y - 1, tileW + 2, tileH + 2);
    this.tilesetCtx.strokeStyle = '#00e5ff';
    this.tilesetCtx.lineWidth = 1.5;
    this.tilesetCtx.strokeRect(x, y, tileW, tileH);
    this.tilesetCtx.fillStyle = 'rgba(0, 229, 255, 0.35)';
    this.tilesetCtx.fillRect(x, y, tileW, tileH);
  }

  updateTilePreview(gid) {
    this.highlightTilesetGid(gid);
    const previewCanvas = document.getElementById('active-tile-preview');
    if (!previewCanvas || !this.tilesetImage.complete) return;

    const ctx = previewCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 36, 36);

    const firstGid = this.activeTileset ? this.activeTileset.firstgid : 1;
    const localId = gid - firstGid;
    if (localId < 0) return;

    const margin = this.activeTileset?.margin || 0;
    const spacing = this.activeTileset?.spacing || 0;
    const tileW = this.activeTileset?.tilewidth || this.tileSize || 32;
    const tileH = this.activeTileset?.tileheight || this.tileSize || 32;

    const col = localId % this.columns;
    const row = Math.floor(localId / this.columns);
    const srcX = margin + col * (tileW + spacing);
    const srcY = margin + row * (tileH + spacing);

    ctx.drawImage(this.tilesetImage, srcX, srcY, tileW, tileH, 0, 0, 36, 36);
    document.getElementById('selected-tile-preview-badge').textContent = `GID: ${gid}`;
    document.getElementById('info-gid').textContent = gid;
    document.getElementById('info-gid-coords').textContent = `Col ${col}, Linha ${row}`;
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

    this.highlightTilesetGid(gid);
  }

  // ─── Save Map ─────────────────────────────────────────────────────────────

  async saveMap() {
    const saveBtn = document.getElementById('btn-editor-save');
    if (saveBtn) saveBtn.disabled = true;

    this.showToast(`Salvando '${this.editorScene.currentMapName}' no servidor...`, 'info');

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

      this.showToast(`✅ MAPA '${this.editorScene.currentMapName}' SALVO COM SUCESSO!`, 'success');
    } catch (err) {
      console.error('[EditorUI Save Error]:', err);
      this.showToast('❌ Erro ao salvar mapa: ' + err.message, 'error');
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
