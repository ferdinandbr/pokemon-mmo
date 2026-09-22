import { ROOMS_CONFIG } from '../maps/roomData';

/**
 * NodeGraphUI – Interactive Node Network Visualizer and Connection Creator for Pokémon MMO Maps.
 * Displays all maps as interconnected nodes with animated bezier portal arrows,
 * intuitive pan & zoom, drag-and-drop spatial organization, and portal connection creation.
 */
export default class NodeGraphUI {
  constructor(editorUI, editorScene) {
    this.editorUI = editorUI;
    this.editorScene = editorScene;

    this.container = null;
    this.svg = null;
    this.worldGroup = null;
    this.nodesContainer = null;

    this.isOpen = false;
    this.zoom = 0.85;
    this.panX = 120;
    this.panY = 80;

    this.isPanning = false;
    this.startPanX = 0;
    this.startPanY = 0;

    this.draggedNode = null;
    this.dragOffset = { x: 0, y: 0 };

    // Node layout positions in graph coordinates
    this.nodePositions = this.loadSavedPositions() || this.getDefaultKantoLayout();

    this.initDOM();
    this.bindEvents();
  }

  getDefaultKantoLayout() {
    // Canonical Kanto geographical layout for intuitive world visualization
    return {
      pallet_town:     { x: 380,  y: 920 },
      route_1:         { x: 380,  y: 660 },
      viridian_city:   { x: 380,  y: 400 },
      indigo_plateau:  { x: 60,   y: 160 },
      route_2:         { x: 380,  y: 160 },
      pewter_city:     { x: 380,  y: -100 },
      route_3:         { x: 680,  y: -100 },
      route_4:         { x: 980,  y: -100 },
      cerulean_city:   { x: 1280, y: -100 },
      route_9:         { x: 1580, y: -100 },
      route_10:        { x: 1880, y: 80 },
      lavender_town:   { x: 1880, y: 360 },
      route_8:         { x: 1580, y: 360 },
      saffron_city:    { x: 1280, y: 360 },
      route_7:         { x: 980,  y: 360 },
      celadon_city:    { x: 680,  y: 360 },
      route_5:         { x: 1280, y: 140 },
      route_6:         { x: 1280, y: 620 },
      vermilion_city:  { x: 1280, y: 880 },
      route_11:        { x: 1580, y: 880 },
      cinnabar_island: { x: 380,  y: 1220 },
      fuchsia_city:    { x: 1280, y: 1220 }
    };
  }

  loadSavedPositions() {
    try {
      const saved = localStorage.getItem('pokemmo_nodegraph_positions');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  savePositions() {
    try {
      localStorage.setItem('pokemmo_nodegraph_positions', JSON.stringify(this.nodePositions));
    } catch (e) {
      console.warn('Failed to save node positions:', e);
    }
  }

  initDOM() {
    let overlay = document.getElementById('editor-nodegraph-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'editor-nodegraph-overlay';
      overlay.className = 'nodegraph-overlay hidden';
      document.body.appendChild(overlay);
    }
    this.container = overlay;

    this.container.innerHTML = `
      <!-- Top Control Bar -->
      <div class="nodegraph-top-bar">
        <div class="nodegraph-brand">
          <svg class="nodegraph-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span class="nodegraph-title">REDE DE CONEXÕES (KANTO)</span>
          <span class="nodegraph-badge" id="nodegraph-count-badge">22 Mapas</span>
        </div>

        <div class="nodegraph-tools">
          <input type="text" id="nodegraph-search" class="nodegraph-search-input" placeholder="🔍 Buscar mapa..." />
          <button id="btn-nodegraph-auto-layout" class="nodegraph-btn" title="Organizar mapas geograficamente em grade contígua">
            ⚡ Auto-Organizar
          </button>
          <button id="btn-nodegraph-center" class="nodegraph-btn" title="Centralizar visualização nos mapas">
            🎯 Centralizar
          </button>
          <button id="btn-nodegraph-new-portal" class="nodegraph-btn gold" title="Criar nova conexão entre dois mapas">
            ➕ Nova Conexão
          </button>
        </div>

        <div class="nodegraph-nav-modes">
          <button id="btn-nodegraph-back-editor" class="nodegraph-btn primary">
            🗺️ Voltar ao Tile Editor
          </button>
        </div>
      </div>

      <!-- Graph Viewport (Infinite Pan & Zoom Workspace) -->
      <div id="nodegraph-viewport" class="nodegraph-viewport">
        <!-- SVG Connections Layer -->
        <svg id="nodegraph-svg" class="nodegraph-svg-canvas">
          <defs>
            <linearGradient id="conn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.9"/>
            </linearGradient>
            <linearGradient id="conn-gradient-hover" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="1"/>
              <stop offset="100%" stop-color="#fbbf24" stop-opacity="1"/>
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#00e5ff" />
            </marker>
            <marker id="arrow-hover" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
            </marker>
            <filter id="conn-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g id="nodegraph-svg-group"></g>
        </svg>

        <!-- HTML Cards Layer -->
        <div id="nodegraph-nodes-layer" class="nodegraph-nodes-layer"></div>
      </div>

      <!-- Zoom Indicator & Floating Controls -->
      <div class="nodegraph-zoom-dock">
        <button id="btn-nodegraph-zoom-in" class="nodegraph-zoom-btn" title="Aumentar Zoom">+</button>
        <span id="nodegraph-zoom-text" class="nodegraph-zoom-text">85%</span>
        <button id="btn-nodegraph-zoom-out" class="nodegraph-zoom-btn" title="Diminuir Zoom">-</button>
        <button id="btn-nodegraph-zoom-reset" class="nodegraph-zoom-btn" title="Resetar Zoom (100%)">1:1</button>
      </div>

      <!-- Modal: Nova Conexão de Portais -->
      <div id="nodegraph-portal-modal" class="nodegraph-modal-overlay hidden">
        <div class="nodegraph-modal-card">
          <div class="nodegraph-modal-header">
            <h3>CRIAR CONEXÃO DE PORTAL</h3>
            <button id="btn-close-portal-modal" class="nodegraph-modal-close">✕</button>
          </div>
          <div class="nodegraph-modal-body">
            <div class="nodegraph-form-row">
              <div class="nodegraph-form-col">
                <label>Mapa de Origem</label>
                <select id="portal-modal-src-room" class="nodegraph-select"></select>
              </div>
              <div class="nodegraph-form-col">
                <label>Mapa de Destino</label>
                <select id="portal-modal-target-room" class="nodegraph-select"></select>
              </div>
            </div>

            <div class="nodegraph-form-row">
              <div class="nodegraph-form-col">
                <label>Posição do Gatilho (Origem)</label>
                <div class="nodegraph-coords-inputs">
                  <span>X:</span>
                  <input type="number" id="portal-modal-trigger-x" class="nodegraph-num-input" value="320" step="32"/>
                  <span>Y:</span>
                  <input type="number" id="portal-modal-trigger-y" class="nodegraph-num-input" value="0" step="32"/>
                </div>
              </div>
              <div class="nodegraph-form-col">
                <label>Ponto de Spawn (Destino)</label>
                <div class="nodegraph-coords-inputs">
                  <span>X:</span>
                  <input type="number" id="portal-modal-spawn-x" class="nodegraph-num-input" value="320" step="32"/>
                  <span>Y:</span>
                  <input type="number" id="portal-modal-spawn-y" class="nodegraph-num-input" value="64" step="32"/>
                </div>
              </div>
            </div>

            <div class="nodegraph-checkbox-group">
              <input type="checkbox" id="portal-modal-reciprocal" checked />
              <label for="portal-modal-reciprocal">Criar automaticamente a rota de volta (Portal recíproco)</label>
            </div>
          </div>
          <div class="nodegraph-modal-footer">
            <button id="btn-confirm-portal-connect" class="nodegraph-btn gold">Confirmar Conexão</button>
            <button id="btn-cancel-portal-modal" class="nodegraph-btn secondary">Cancelar</button>
          </div>
        </div>
      </div>
    `;

    this.svgGroup = document.getElementById('nodegraph-svg-group');
    this.nodesContainer = document.getElementById('nodegraph-nodes-layer');
    this.viewport = document.getElementById('nodegraph-viewport');
  }

  bindEvents() {
    // Zoom in / out / reset
    document.getElementById('btn-nodegraph-zoom-in')?.addEventListener('click', () => this.adjustZoom(0.15));
    document.getElementById('btn-nodegraph-zoom-out')?.addEventListener('click', () => this.adjustZoom(-0.15));
    document.getElementById('btn-nodegraph-zoom-reset')?.addEventListener('click', () => {
      this.zoom = 1.0;
      this.applyTransform();
    });

    // Back to Tile Editor
    document.getElementById('btn-nodegraph-back-editor')?.addEventListener('click', () => {
      this.hide();
    });

    // Center view
    document.getElementById('btn-nodegraph-center')?.addEventListener('click', () => {
      this.centerAllNodes();
    });

    // Auto-organize layout
    document.getElementById('btn-nodegraph-auto-layout')?.addEventListener('click', () => {
      this.nodePositions = this.getDefaultKantoLayout();
      this.savePositions();
      this.render();
      this.centerAllNodes();
    });

    // Search filter
    document.getElementById('nodegraph-search')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.nodegraph-card').forEach(card => {
        const id = card.getAttribute('data-room-id') || '';
        const name = card.getAttribute('data-room-name') || '';
        const match = !q || id.toLowerCase().includes(q) || name.toLowerCase().includes(q);
        card.style.display = match ? 'flex' : 'none';
        card.classList.toggle('highlighted', !!(q && match));
      });
      this.renderConnections();
    });

    // Viewport Pan & Wheel Zoom
    this.viewport?.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const rect = this.viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newZoom = Math.min(2.5, Math.max(0.25, this.zoom * zoomFactor));
      this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
      this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
      this.zoom = newZoom;
      this.applyTransform();
    }, { passive: false });

    this.viewport?.addEventListener('mousedown', (e) => {
      // Pan when clicking empty viewport background or middle click
      if (e.target === this.viewport || e.target.tagName === 'svg' || e.target.tagName === 'g' || e.button === 1 || e.button === 2) {
        this.isPanning = true;
        this.startPanX = e.clientX - this.panX;
        this.startPanY = e.clientY - this.panY;
        this.viewport.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.panX = e.clientX - this.startPanX;
        this.panY = e.clientY - this.startPanY;
        this.applyTransform();
      } else if (this.draggedNode) {
        const rect = this.viewport.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.panX) / this.zoom;
        const mouseY = (e.clientY - rect.top - this.panY) / this.zoom;

        const newX = Math.round(mouseX - this.dragOffset.x);
        const newY = Math.round(mouseY - this.dragOffset.y);

        this.nodePositions[this.draggedNodeId] = { x: newX, y: newY };
        this.draggedNode.style.left = `${newX}px`;
        this.draggedNode.style.top = `${newY}px`;
        this.renderConnections();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanning) {
        this.isPanning = false;
        if (this.viewport) this.viewport.style.cursor = 'grab';
      }
      if (this.draggedNode) {
        this.draggedNode.classList.remove('dragging');
        this.draggedNode = null;
        this.draggedNodeId = null;
        this.savePositions();
      }
    });

    // Portal modal
    document.getElementById('btn-nodegraph-new-portal')?.addEventListener('click', () => {
      this.openPortalModal();
    });
    document.getElementById('btn-close-portal-modal')?.addEventListener('click', () => {
      document.getElementById('nodegraph-portal-modal')?.classList.add('hidden');
    });
    document.getElementById('btn-cancel-portal-modal')?.addEventListener('click', () => {
      document.getElementById('nodegraph-portal-modal')?.classList.add('hidden');
    });
    document.getElementById('btn-confirm-portal-connect')?.addEventListener('click', () => {
      this.handleConfirmPortalConnect();
    });
  }

  adjustZoom(delta) {
    this.zoom = Math.min(2.5, Math.max(0.25, this.zoom + delta));
    this.applyTransform();
  }

  applyTransform() {
    if (this.svgGroup) {
      this.svgGroup.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`);
    }
    if (this.nodesContainer) {
      this.nodesContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }
    const zoomText = document.getElementById('nodegraph-zoom-text');
    if (zoomText) zoomText.innerText = `${Math.round(this.zoom * 100)}%`;
  }

  show() {
    this.isOpen = true;
    if (this.container) {
      this.container.classList.remove('hidden');
    }
    this.render();
    this.applyTransform();
  }

  hide() {
    this.isOpen = false;
    if (this.container) {
      this.container.classList.add('hidden');
    }
    // Sync editor top bar button active state
    document.getElementById('btn-mode-nodes')?.classList.remove('active');
    document.getElementById('btn-mode-map')?.classList.add('active');
  }

  render() {
    if (!this.nodesContainer) return;
    this.nodesContainer.innerHTML = '';

    const roomKeys = Object.keys(ROOMS_CONFIG);
    const countBadge = document.getElementById('nodegraph-count-badge');
    if (countBadge) countBadge.innerText = `${roomKeys.length} Mapas`;

    roomKeys.forEach(roomId => {
      const room = ROOMS_CONFIG[roomId];
      const pos = this.nodePositions[roomId] || { x: 300, y: 300 };

      const card = document.createElement('div');
      card.className = 'nodegraph-card';
      card.id = `node-card-${roomId}`;
      card.setAttribute('data-room-id', roomId);
      card.setAttribute('data-room-name', room.name || roomId);
      card.style.left = `${pos.x}px`;
      card.style.top = `${pos.y}px`;

      const isCity = !roomId.startsWith('route_');
      const categoryLabel = isCity ? 'CIDADE / VILA' : 'ROTA';
      const categoryClass = isCity ? 'city' : 'route';

      const portals = room.portals || [];
      let portalsHTML = '';
      if (portals.length === 0) {
        portalsHTML = `<div class="nodegraph-no-portals">Nenhum portal configurado</div>`;
      } else {
        portalsHTML = portals.map((p, idx) => {
          const targetName = ROOMS_CONFIG[p.targetRoom]?.name || p.targetRoom;
          return `
            <div class="nodegraph-portal-row" title="Gatilho: [${p.trigger?.x}, ${p.trigger?.y}] -> Destino: ${p.targetRoom}">
              <div class="nodegraph-portal-dir">🚪</div>
              <div class="nodegraph-portal-meta">
                <span class="nodegraph-portal-target">${targetName}</span>
                <span class="nodegraph-portal-sub">Dest: (${p.targetSpawn?.x || 0}, ${p.targetSpawn?.y || 0})</span>
              </div>
              <span class="nodegraph-port-anchor" id="port-anchor-${roomId}-${idx}"></span>
            </div>
          `;
        }).join('');
      }

      card.innerHTML = `
        <div class="nodegraph-card-header">
          <div class="nodegraph-card-title-group">
            <span class="nodegraph-card-icon">${isCity ? '🏙️' : '🌿'}</span>
            <div class="nodegraph-card-titles">
              <span class="nodegraph-card-name">${room.name || roomId}</span>
              <span class="nodegraph-card-id">${roomId}</span>
            </div>
          </div>
          <span class="nodegraph-category-pill ${categoryClass}">${categoryLabel}</span>
        </div>

        <div class="nodegraph-card-body">
          <div class="nodegraph-size-info">
            <span>📐 ${Math.round((room.width || 1152) / 32)}x${Math.round((room.height || 640) / 32)} tiles</span>
            <span>📍 Spawn: (${room.defaultSpawn?.x || 0}, ${room.defaultSpawn?.y || 0})</span>
          </div>
          <div class="nodegraph-portals-section">
            <div class="nodegraph-section-title">Portais & Conexões (${portals.length}):</div>
            <div class="nodegraph-portals-list">
              ${portalsHTML}
            </div>
          </div>
        </div>

        <div class="nodegraph-card-footer">
          <button class="nodegraph-card-btn edit" data-action="edit" data-room-id="${roomId}">
            ✏️ Editar Mapa
          </button>
          <button class="nodegraph-card-btn connect" data-action="connect" data-room-id="${roomId}">
            🔗 + Conexão
          </button>
        </div>
      `;

      // Drag listener for card header
      const header = card.querySelector('.nodegraph-card-header');
      header?.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        this.draggedNode = card;
        this.draggedNodeId = roomId;
        card.classList.add('dragging');

        const rect = this.viewport.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.panX) / this.zoom;
        const mouseY = (e.clientY - rect.top - this.panY) / this.zoom;

        this.dragOffset = {
          x: mouseX - pos.x,
          y: mouseY - pos.y
        };
        e.stopPropagation();
      });

      // Button listeners
      card.querySelector('[data-action="edit"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openMapInEditor(roomId);
      });

      card.querySelector('[data-action="connect"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openPortalModal(roomId);
      });

      this.nodesContainer.appendChild(card);
    });

    this.renderConnections();
  }

  renderConnections() {
    if (!this.svgGroup) return;
    this.svgGroup.innerHTML = '';

    const roomKeys = Object.keys(ROOMS_CONFIG);
    const renderedPairs = new Set();

    roomKeys.forEach(sourceId => {
      const sourceRoom = ROOMS_CONFIG[sourceId];
      const sourcePos = this.nodePositions[sourceId];
      if (!sourcePos) return;

      const sourceCard = document.getElementById(`node-card-${sourceId}`);
      if (!sourceCard || sourceCard.style.display === 'none') return;

      const portals = sourceRoom.portals || [];
      portals.forEach((portal, pIdx) => {
        const targetId = portal.targetRoom;
        const targetPos = this.nodePositions[targetId];
        if (!targetPos) return;

        const targetCard = document.getElementById(`node-card-${targetId}`);
        if (!targetCard || targetCard.style.display === 'none') return;

        // Card dimensions
        const cardW = 280;
        const cardH = 220;

        // Compute port attachment points
        // If target is above source, connect top to bottom, etc.
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;

        let startX, startY, endX, endY;

        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical connection
          if (dy > 0) {
            // Target is below
            startX = sourcePos.x + cardW / 2;
            startY = sourcePos.y + cardH;
            endX = targetPos.x + cardW / 2;
            endY = targetPos.y;
          } else {
            // Target is above
            startX = sourcePos.x + cardW / 2;
            startY = sourcePos.y;
            endX = targetPos.x + cardW / 2;
            endY = targetPos.y + cardH;
          }
        } else {
          // Horizontal connection
          if (dx > 0) {
            // Target is to the right
            startX = sourcePos.x + cardW;
            startY = sourcePos.y + cardH / 2;
            endX = targetPos.x;
            endY = targetPos.y + cardH / 2;
          } else {
            // Target is to the left
            startX = sourcePos.x;
            startY = sourcePos.y + cardH / 2;
            endX = targetPos.x + cardW;
            endY = targetPos.y + cardH / 2;
          }
        }

        // Cubic bezier control points
        const dist = Math.hypot(endX - startX, endY - startY) * 0.45;
        let c1x = startX, c1y = startY, c2x = endX, c2y = endY;

        if (Math.abs(dy) > Math.abs(dx)) {
          c1y += (dy > 0 ? dist : -dist);
          c2y -= (dy > 0 ? dist : -dist);
        } else {
          c1x += (dx > 0 ? dist : -dist);
          c2x -= (dx > 0 ? dist : -dist);
        }

        const pathD = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;

        // SVG Path Element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('class', 'nodegraph-connection-line');
        path.setAttribute('marker-end', 'url(#arrow)');

        // Interactive hover
        path.addEventListener('mouseenter', () => {
          path.setAttribute('marker-end', 'url(#arrow-hover)');
          path.classList.add('hovered');
        });
        path.addEventListener('mouseleave', () => {
          path.setAttribute('marker-end', 'url(#arrow)');
          path.classList.remove('hovered');
        });

        this.svgGroup.appendChild(path);
      });
    });
  }

  centerAllNodes() {
    const keys = Object.keys(this.nodePositions);
    if (keys.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    keys.forEach(k => {
      const p = this.nodePositions[k];
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const cardW = 280;
    const cardH = 220;
    const graphW = (maxX - minX) + cardW + 200;
    const graphH = (maxY - minY) + cardH + 200;

    const vpW = this.viewport?.clientWidth || window.innerWidth;
    const vpH = this.viewport?.clientHeight || window.innerHeight;

    const fitZoom = Math.min(1.2, Math.max(0.35, Math.min(vpW / graphW, vpH / graphH)));
    this.zoom = fitZoom;
    this.panX = (vpW - (minX + maxX + cardW) * this.zoom) / 2;
    this.panY = (vpH - (minY + maxY + cardH) * this.zoom) / 2;

    this.applyTransform();
  }

  openMapInEditor(roomId) {
    this.hide();
    const select = document.getElementById('editor-map-select');
    if (select) {
      select.value = roomId;
    }
    if (this.editorScene && typeof this.editorScene.loadMapByName === 'function') {
      this.editorScene.loadMapByName(roomId);
    }
  }

  openPortalModal(defaultSrcId = null) {
    const modal = document.getElementById('nodegraph-portal-modal');
    if (!modal) return;

    const srcSelect = document.getElementById('portal-modal-src-room');
    const targetSelect = document.getElementById('portal-modal-target-room');

    if (srcSelect && targetSelect) {
      srcSelect.innerHTML = '';
      targetSelect.innerHTML = '';

      Object.keys(ROOMS_CONFIG).forEach(id => {
        const name = ROOMS_CONFIG[id].name || id;
        srcSelect.innerHTML += `<option value="${id}">${name} (${id})</option>`;
        targetSelect.innerHTML += `<option value="${id}">${name} (${id})</option>`;
      });

      if (defaultSrcId) srcSelect.value = defaultSrcId;
    }

    modal.classList.remove('hidden');
  }

  async handleConfirmPortalConnect() {
    const srcRoom = document.getElementById('portal-modal-src-room')?.value;
    const targetRoom = document.getElementById('portal-modal-target-room')?.value;
    const trigX = parseInt(document.getElementById('portal-modal-trigger-x')?.value || '0', 10);
    const trigY = parseInt(document.getElementById('portal-modal-trigger-y')?.value || '0', 10);
    const spawnX = parseInt(document.getElementById('portal-modal-spawn-x')?.value || '0', 10);
    const spawnY = parseInt(document.getElementById('portal-modal-spawn-y')?.value || '0', 10);
    const isReciprocal = document.getElementById('portal-modal-reciprocal')?.checked ?? true;

    if (!srcRoom || !targetRoom || srcRoom === targetRoom) {
      alert('Selecione dois mapas diferentes para conectar via portal!');
      return;
    }

    // Add portal to source room in ROOMS_CONFIG
    if (!ROOMS_CONFIG[srcRoom].portals) ROOMS_CONFIG[srcRoom].portals = [];
    ROOMS_CONFIG[srcRoom].portals.push({
      targetRoom: targetRoom,
      trigger: { x: trigX, y: trigY, width: 64, height: 32 },
      targetSpawn: { x: spawnX, y: spawnY },
      label: ROOMS_CONFIG[targetRoom]?.name || targetRoom
    });

    // Reciprocal portal in target room
    if (isReciprocal) {
      if (!ROOMS_CONFIG[targetRoom].portals) ROOMS_CONFIG[targetRoom].portals = [];
      ROOMS_CONFIG[targetRoom].portals.push({
        targetRoom: srcRoom,
        trigger: { x: spawnX, y: spawnY, width: 64, height: 32 },
        targetSpawn: { x: trigX, y: trigY + 32 },
        label: ROOMS_CONFIG[srcRoom]?.name || srcRoom
      });
    }

    document.getElementById('nodegraph-portal-modal')?.classList.add('hidden');
    this.render();
    alert(`✅ Conexão criada com sucesso entre ${srcRoom} e ${targetRoom}!`);
  }
}
