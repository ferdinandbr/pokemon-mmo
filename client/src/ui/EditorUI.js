/**
 * EditorUI – Modern HTML/CSS overlay and control system for the Phaser Map Editor.
 */
export default class EditorUI {
  constructor(editorScene) {
    this.editorScene = editorScene;
    this.container = null;
    this.tilesetCanvas = null;
    this.tilesetCtx = null;

    this.tilesetImage = new Image();
    this.tilesetImage.src = '/assets/tilesets/Outside1 Spring.png';

    this.activeGid = 1;
    this.activeTileset = null;
    this.columns = 64;
    this.tileSize = 32;
    this.totalTiles = 4544;

    this.initHTML();
    this.bindEvents();
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
            <svg class="editor-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span class="editor-logo-text">POKéMMO EDITOR</span>
          </div>
          <span class="editor-badge">pallet_town.json (36x20)</span>
        </div>

        <div class="editor-status-bar">
          <span id="editor-layer-indicator" class="editor-status-item highlight">Camada: World</span>
          <span id="editor-tool-indicator" class="editor-status-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            <span>Pincel</span>
          </span>
          <span id="editor-coords" class="editor-status-item">Tile: [0, 0] | Px: [0, 0]</span>
          <span id="editor-gid-indicator" class="editor-status-item">GID: 1</span>
        </div>

        <div class="editor-actions">
          <button id="btn-editor-save" class="editor-btn gold">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>SALVAR MAPA</span>
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

      <!-- Left Tool Bar -->
      <div class="editor-toolbar">
        <button id="tool-hand" class="editor-tool-btn" data-tooltip="Mover / Pan (H)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="5 9 2 12 5 15"></polyline>
            <polyline points="9 5 12 2 15 5"></polyline>
            <polyline points="19 9 22 12 19 15"></polyline>
            <polyline points="9 19 12 22 15 19"></polyline>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
        </button>

        <button id="tool-link" class="editor-tool-btn" data-tooltip="Link de Portais (L)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
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

        <button id="tool-picker" class="editor-tool-btn" data-tooltip="Conta-gotas (I)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m14 2 6 6"></path>
            <path d="m4 20 5-1 9-9-4-4-9 9-1 5Z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
        </button>

        <button id="tool-object" class="editor-tool-btn" data-tooltip="Inspetor de Objetos (O)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </button>

        <div class="tool-divider"></div>

        <button id="tool-zoomin" class="editor-tool-btn" data-tooltip="Zoom In (+)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        <button id="tool-zoomout" class="editor-tool-btn" data-tooltip="Zoom Out (-)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
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

      <!-- Right Sidebar (Layers & Tileset Picker) -->
      <div class="editor-sidebar">
        <div class="sidebar-section">
          <div class="section-title-group">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <h3>CAMADAS DE DESENHO</h3>
          </div>
          <div class="layer-list">
            <div class="layer-item" data-layer="Ground">
              <span class="layer-name">🌾 Ground (Grama & Piso)</span>
              <span class="layer-type">Base Tile</span>
            </div>
            <div class="layer-item active" data-layer="World">
              <span class="layer-name">🏢 World (Estruturas/Paredes)</span>
              <span class="layer-type">Building Tile</span>
            </div>
            <div class="layer-item" data-layer="Overhead">
              <span class="layer-name">⬆️ Overhead (Telhados - Acima)</span>
              <span class="layer-type tag-gold">Top Tile</span>
            </div>
            <div class="layer-item" data-layer="Collision">
              <span class="layer-name">🚫 Collision (Barreiras)</span>
              <span class="layer-type tag-red">Collision</span>
            </div>
            <div class="layer-item" data-layer="Objects">
              <span class="layer-name">Objects (Spawns / NPCs)</span>
              <span class="layer-type tag-red">Object</span>
            </div>
            <div class="layer-item" data-layer="Points of interest">
              <span class="layer-name">Points of interest (Placas)</span>
              <span class="layer-type tag-gold">Object</span>
            </div>
            <div class="layer-item" data-layer="Zones">
              <span class="layer-name">Zones (Locais / Zonas)</span>
              <span class="layer-type tag-cyan">Object</span>
            </div>
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
            <button id="btn-add-tileset-png" class="editor-btn gold" style="padding: 4px 8px; font-size: 11px; height: 32px;" title="Importar arquivo PNG de tileset / construções sem fundo">➕ Add PNG</button>
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

      <!-- Object Inspector Panel -->
      <div id="editor-object-modal" class="editor-modal hidden">
        <div class="modal-header">
          <div class="modal-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
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
            <label>Nome do Objeto / Ponto</label>
            <input type="text" id="obj-prop-name" class="form-input" placeholder="Ex: Spawn Point, Placa..." />
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
          <div class="form-row">
            <div class="form-group">
              <label>Largura (W)</label>
              <input type="number" id="obj-prop-w" class="form-input" />
            </div>
            <div class="form-group">
              <label>Altura (H)</label>
              <input type="number" id="obj-prop-h" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Propriedades Customizadas (JSON)</label>
            <textarea id="obj-prop-custom" class="form-input text-area" rows="3" placeholder='{"text": "Mensagem..."}'></textarea>
          </div>
          <div class="modal-actions">
            <button id="btn-save-object" class="editor-btn small primary">Salvar Objeto</button>
            <button id="btn-delete-object" class="editor-btn small danger">Excluir Objeto</button>
          </div>
        </div>
      </div>

      <!-- Toast Notification Container -->
      <div id="editor-toast-container" class="editor-toast-container"></div>
    `;

    this.container = editorEl;
    this.tilesetCanvas = document.getElementById('tileset-palette-canvas');
    this.tilesetCtx = this.tilesetCanvas.getContext('2d');

    // Wait for image to load to draw tileset palette
    this.tilesetImage.onload = () => {
      this.drawTilesetPalette();
      this.updateTilePreview(1);
    };
  }

  bindEvents() {
    // Populate tilesets dropdown
    this.populateTilesetSelect();

    // Hooks from Phaser EditorScene
    this.editorScene.onCoordsUpdate = (tileX, tileY, pxX, pxY) => {
      const coordsEl = document.getElementById('editor-coords');
      if (coordsEl) {
        coordsEl.textContent = `Tile: [${tileX}, ${tileY}] | Px: [${pxX}, ${pxY}]`;
      }
    };

    this.editorScene.onTilePicked = (gid) => {
      this.setTileGid(gid);
      this.showToast(`Tile GID ${gid} selecionado!`, 'info');
    };

    this.editorScene.onObjectSelected = (obj) => {
      this.openObjectModal(obj);
    };

    this.editorScene.onToast = (msg, type) => {
      this.showToast(msg, type);
    };

    // Tools Buttons
    const tools = ['hand', 'link', 'pencil', 'eraser', 'bucket', 'picker', 'object'];
    tools.forEach(tool => {
      const btn = document.getElementById(`tool-${tool}`);
      if (btn) {
        btn.addEventListener('click', () => this.selectTool(tool));
      }
    });

    document.getElementById('tool-zoomin')?.addEventListener('click', () => this.editorScene.zoomIn());
    document.getElementById('tool-zoomout')?.addEventListener('click', () => this.editorScene.zoomOut());
    document.getElementById('tool-grid')?.addEventListener('click', (e) => {
      this.editorScene.toggleGrid();
      e.currentTarget.classList.toggle('active', this.editorScene.showGrid);
    });

    // Layer List Selection
    document.querySelectorAll('.layer-item').forEach(item => {
      item.addEventListener('click', () => {
        const layerName = item.dataset.layer;
        document.querySelectorAll('.layer-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        if (['Ground', 'World', 'Overhead', 'Collision'].includes(layerName)) {
          this.editorScene.setActiveLayer(layerName);
          const indicator = document.getElementById('editor-layer-indicator');
          if (indicator) indicator.textContent = `Camada: ${layerName}`;

          this.showToast(`Camada ativa: ${layerName}`, 'info');

          if (layerName === 'Collision') {
            this.selectTool('pencil');
          }
        } else {
          this.selectTool('object');
        }
      });
    });

    // Tileset Dropdown Select
    const tilesetSelect = document.getElementById('editor-tileset-select');
    if (tilesetSelect) {
      tilesetSelect.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10);
        this.switchTileset(idx);
      });
    }

    // Tileset Upload PNG Button
    const btnAddPNG = document.getElementById('btn-add-tileset-png');
    const inputPNGFile = document.getElementById('input-tileset-png-file');

    if (btnAddPNG && inputPNGFile) {
      btnAddPNG.addEventListener('click', () => inputPNGFile.click());
      inputPNGFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleUploadTilesetPNG(e.target.files[0]);
        }
      });
    }

    // Top Action Buttons
    document.getElementById('btn-editor-save')?.addEventListener('click', () => this.saveMap());
    document.getElementById('btn-editor-reload')?.addEventListener('click', () => {
      if (confirm('Deseja recarregar o mapa? Alterações não salvas serão perdidas.')) {
        window.location.reload();
      }
    });
    document.getElementById('btn-editor-exit')?.addEventListener('click', () => this.hide());

    // Tileset Canvas Click
    this.tilesetCanvas.addEventListener('click', (e) => {
      const rect = this.tilesetCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const col = Math.floor(clickX / this.tileSize);
      const row = Math.floor(clickY / this.tileSize);

      const firstGid = this.activeTileset ? this.activeTileset.firstgid : 1;
      const localId = (row * this.columns) + col;

      const gid = firstGid + localId;
      this.setTileGid(gid);
      this.selectTool('pencil');
    });

    // Object Modal Controls
    document.getElementById('btn-close-obj-modal')?.addEventListener('click', () => {
      document.getElementById('editor-object-modal').classList.add('hidden');
    });

    document.getElementById('btn-save-object')?.addEventListener('click', () => this.saveObjectModal());
    document.getElementById('btn-delete-object')?.addEventListener('click', () => this.deleteObjectModal());

    // Shortcut Ctrl+S for saving
    window.addEventListener('keydown', (e) => {
      if (this.container.classList.contains('hidden')) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.saveMap();
      }
    });
  }

  populateTilesetSelect() {
    const select = document.getElementById('editor-tileset-select');
    if (!select || !this.editorScene.mapJsonData) return;

    const tilesets = this.editorScene.mapJsonData.tilesets || [];
    select.innerHTML = '';

    tilesets.forEach((t, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${t.name} (GID ${t.firstgid})`;
      select.appendChild(opt);
    });

    if (!this.activeTileset && tilesets.length > 0) {
      this.activeTileset = tilesets[0];
    }
  }

  switchTileset(idx) {
    const tilesets = this.editorScene.mapJsonData.tilesets;
    if (!tilesets || !tilesets[idx]) return;

    this.activeTileset = tilesets[idx];
    const filename = this.activeTileset.image.split('/').pop();

    this.columns = this.activeTileset.columns || 16;
    this.tileSize = this.activeTileset.tilewidth || 16;
    this.totalTiles = this.activeTileset.tilecount || 1000;

    this.tilesetImage = new Image();
    this.tilesetImage.src = '/assets/tilesets/' + filename;
    this.tilesetImage.onload = () => {
      this.drawTilesetPalette();
      this.updateTilePreview(this.activeTileset.firstgid);
    };
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
          body: JSON.stringify({
            filename: file.name,
            imageBase64: base64Data
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Erro ao fazer upload do tileset');
        }

        const img = new Image();
        img.src = base64Data;
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const tileW = 16;
          const tileH = 16;
          const columns = Math.floor(width / tileW);
          const rows = Math.floor(height / tileH);
          const tilecount = columns * rows;

          const tilesets = this.editorScene.mapJsonData.tilesets || [];
          let maxGid = 1;
          tilesets.forEach(t => {
            const endGid = (t.firstgid || 1) + (t.tilecount || 0);
            if (endGid > maxGid) maxGid = endGid;
          });

          const newTilesetObj = {
            name: cleanName,
            image: '../tilesets/' + data.filename,
            firstgid: maxGid,
            tilewidth: tileW,
            tileheight: tileH,
            columns: columns,
            tilecount: tilecount
          };

          tilesets.push(newTilesetObj);

          // Add texture to Phaser scene
          if (!this.editorScene.textures.exists(cleanName)) {
            this.editorScene.textures.addImage(cleanName, img);
          }

          // Populate Select & Switch
          this.populateTilesetSelect();
          const select = document.getElementById('editor-tileset-select');
          if (select) select.value = tilesets.length - 1;

          this.switchTileset(tilesets.length - 1);
          this.showToast(`✅ Tileset '${cleanName}' adicionado com sucesso! (GID ${maxGid})`, 'success');
        };
      } catch (err) {
        console.error('[Upload Tileset Error]:', err);
        this.showToast('❌ Erro no upload: ' + err.message, 'error');
      }
    };
    reader.readAsDataURL(file);
  }

  selectTool(toolName) {
    this.editorScene.setTool(toolName);

    const tools = ['hand', 'link', 'pencil', 'eraser', 'bucket', 'picker', 'object'];
    tools.forEach(t => {
      const btn = document.getElementById(`tool-${t}`);
      if (btn) btn.classList.toggle('active', t === toolName);
    });

    const toolSvgMap = {
      hand: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="19 9 22 12 19 15"></polyline><polyline points="9 19 12 22 15 19"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg> <span>Navegar</span>`,
      link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> <span>Link de Portais</span>`,
      pencil: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg> <span>Pincel</span>`,
      eraser: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L16 17"></path><line x1="18" y1="12" x2="11" y2="19"></line></svg> <span>Borracha</span>`,
      bucket: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"></path><path d="m5 2 5 5"></path><path d="M2 13h15"></path><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"></path></svg> <span>Preenchimento</span>`,
      picker: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m14 2 6 6"></path><path d="m4 20 5-1 9-9-4-4-9 9-1 5Z"></path><path d="m15 5 4 4"></path></svg> <span>Conta-gotas</span>`,
      object: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> <span>Objetos</span>`
    };

    const toolEl = document.getElementById('editor-tool-indicator');
    if (toolEl) toolEl.innerHTML = toolSvgMap[toolName] || toolName;
  }

  setTileGid(gid) {
    this.activeGid = gid;
    this.editorScene.setSelectedTile(gid);
    this.updateTilePreview(gid);

    const gidEl = document.getElementById('editor-gid-indicator');
    if (gidEl) gidEl.textContent = `GID: ${gid}`;
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

    const col = localId % this.columns;
    const row = Math.floor(localId / this.columns);

    const x = col * this.tileSize;
    const y = row * this.tileSize;

    this.tilesetCtx.strokeStyle = '#00ff00';
    this.tilesetCtx.lineWidth = 2;
    this.tilesetCtx.strokeRect(x, y, this.tileSize, this.tileSize);

    this.tilesetCtx.fillStyle = 'rgba(0, 255, 0, 0.35)';
    this.tilesetCtx.fillRect(x, y, this.tileSize, this.tileSize);
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

    const col = localId % this.columns;
    const row = Math.floor(localId / this.columns);

    const srcX = col * this.tileSize;
    const srcY = row * this.tileSize;

    ctx.drawImage(this.tilesetImage, srcX, srcY, this.tileSize, this.tileSize, 0, 0, 36, 36);

    document.getElementById('selected-tile-preview-badge').textContent = `GID: ${gid}`;
    document.getElementById('info-gid').textContent = gid;
    document.getElementById('info-gid-coords').textContent = `Coluna ${col}, Linha ${row}`;
  }

  openObjectModal(obj) {
    const modal = document.getElementById('editor-object-modal');
    if (!modal) return;

    if (!obj) {
      modal.classList.add('hidden');
      return;
    }

    document.getElementById('obj-prop-layer').value = obj.layerName || 'Objects';
    document.getElementById('obj-prop-name').value = obj.name || '';
    document.getElementById('obj-prop-x').value = obj.x || 0;
    document.getElementById('obj-prop-y').value = obj.y || 0;
    document.getElementById('obj-prop-w').value = obj.width || 16;
    document.getElementById('obj-prop-h').value = obj.height || 16;

    const customProps = obj.properties || {};
    document.getElementById('obj-prop-custom').value = Object.keys(customProps).length > 0 ? JSON.stringify(customProps, null, 2) : '';

    modal.classList.remove('hidden');
  }

  saveObjectModal() {
    const currentObj = this.editorScene.selectedObject;
    if (!currentObj || !this.editorScene.mapJsonData) return;

    const name = document.getElementById('obj-prop-name').value;
    const x = parseInt(document.getElementById('obj-prop-x').value, 10) || 0;
    const y = parseInt(document.getElementById('obj-prop-y').value, 10) || 0;
    const w = parseInt(document.getElementById('obj-prop-w').value, 10) || 16;
    const h = parseInt(document.getElementById('obj-prop-h').value, 10) || 16;

    let props = {};
    try {
      const customStr = document.getElementById('obj-prop-custom').value.trim();
      if (customStr) props = JSON.parse(customStr);
    } catch (e) {
      alert('Erro no formato JSON das propriedades customizadas!');
      return;
    }

    const layer = this.editorScene.mapJsonData.layers.find(l => l.name === currentObj.layerName);
    if (layer) {
      const target = layer.objects.find(o => o.id === currentObj.id);
      if (target) {
        target.name = name;
        target.x = x;
        target.y = y;
        target.width = w;
        target.height = h;
        target.properties = props;
      }
    }

    this.editorScene.drawObjects();
    document.getElementById('editor-object-modal').classList.add('hidden');
    this.showToast('Objeto atualizado!', 'success');
  }

  deleteObjectModal() {
    const currentObj = this.editorScene.selectedObject;
    if (!currentObj || !this.editorScene.mapJsonData) return;

    const layer = this.editorScene.mapJsonData.layers.find(l => l.name === currentObj.layerName);
    if (layer) {
      layer.objects = layer.objects.filter(o => o.id !== currentObj.id);
    }

    this.editorScene.selectedObject = null;
    this.editorScene.drawObjects();
    document.getElementById('editor-object-modal').classList.add('hidden');
    this.showToast('Objeto excluído!', 'warning');
  }

  async saveMap() {
    const saveBtn = document.getElementById('btn-editor-save');
    if (saveBtn) saveBtn.disabled = true;

    // Validation Guard: Prevent saving if unlinked portals exist
    const unlinked = this.editorScene.getUnlinkedPortals();
    if (unlinked && unlinked.length > 0) {
      this.showToast(`❌ Impossível salvar: Existe(m) ${unlinked.length} portal(is) incompleto(s) ou sem destino ligado! Ligue todos os portais antes de salvar.`, 'error');
      if (saveBtn) saveBtn.disabled = false;
      return;
    }

    this.showToast('Encodando e salvando camadas no servidor...', 'info');

    try {
      const exportJson = this.editorScene.getExportJson();
      if (!exportJson) {
        throw new Error('Falha ao gerar o JSON exportado do mapa.');
      }

      const res = await fetch('/api/admin/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportJson)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro desconhecido ao salvar o mapa');
      }

      this.showToast('✅ MAPA & CAMADAS SALVOS COM SUCESSO!', 'success');
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
    this.container.classList.remove('hidden');
    this.populateTilesetSelect();
  }

  hide() {
    document.body.classList.remove('editor-mode');
    this.container.classList.add('hidden');
    window.location.hash = '';
    window.location.reload();
  }
}
