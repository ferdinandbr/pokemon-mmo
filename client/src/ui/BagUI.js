import SocketClient from '../network/SocketClient';

export function getItemIcon(itemOrName = '', itemSprite = null) {
  let name = '';
  if (itemOrName && typeof itemOrName === 'object') {
    if (itemOrName.sprite) return itemOrName.sprite;
    itemSprite = itemOrName.sprite;
    name = itemOrName.name || '';
  } else {
    name = String(itemOrName || '');
  }

  if (itemSprite) return itemSprite;

  const lower = name.toLowerCase().trim();
  if (lower === 'poké ball' || lower === 'poke ball' || lower === 'pokeball') return '/assets/items/poke-ball.png';
  if (lower === 'great ball' || lower === 'greatball') return '/assets/items/great-ball.png';
  if (lower === 'ultra ball' || lower === 'ultraball') return '/assets/items/ultra-ball.png';
  if (lower === 'potion') return '/assets/items/potion.png';
  if (lower === 'super potion' || lower === 'superpotion') return '/assets/items/super-potion.png';
  if (lower === 'rare candy' || lower === 'rarecandy') return '/assets/items/rare-candy.png';
  if (lower === 'antidote') return '/assets/items/antidote.png';
  if (lower === 'town map' || lower === 'mapa') return '/assets/items/town-map.png';

  const slug = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (slug) {
    return `/assets/items/${slug}.png`;
  }

  return '/assets/ui/items/defaultitem.svg';
}

export function getItemCategoryLabel(category = '') {
  switch (category) {
    case 'pokeball': return 'Pokébola';
    case 'medicine': return 'Medicina';
    case 'battle': return 'Batalha';
    case 'berry': return 'Bagas / Berries';
    case 'machine': return 'MT / MO';
    case 'hold_item': return 'Segurado';
    case 'key_item': return 'Item-Chave';
    default: return 'Geral';
  }
}

export default class BagUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.character = null;
    this.inventory = [];
    this.bagCapacity = 24;
    this.selectedSlotIndex = null;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.isOpen = false;

    // Default hotbar slots (unique)
    this.hotbarSlots = [
      { key: 1, itemId: null, itemName: 'Poké Ball' },
      { key: 2, itemId: null, itemName: 'Potion' },
      { key: 3, itemId: null, itemName: 'Town Map' },
      { key: 4, itemId: null, itemName: null },
      { key: 5, itemId: null, itemName: null }
    ];

    this.initDOM();
    this.bindEvents();
    this.listenNetwork();
    this.initGlobalDragAndDrop();

    setTimeout(() => {
      this.loadHotbar();
      this.sanitizeHotbar();
      this.updateHotbarView();
    }, 100);
  }

  initDOM() {
    let modal = document.getElementById('bag-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bag-modal';
      modal.className = 'bag-modal hidden';
      modal.innerHTML = `
        <div class="bag-container">
          <div class="bag-shelf"></div>
          <div class="bag-header">
            <div class="bag-title-group">
              <img src="/assets/ui/bag_sprite.png" class="bag-title-sprite" alt="Bag" />
              <h2 class="bag-title">MOCHILA DO TREINADOR</h2>
              <div class="bag-capacity-badge" id="bag-capacity-badge">
                <img src="/assets/ui/icon_item.png" class="bag-capacity-icon-img" alt="" />
                <span id="bag-capacity-text">0 / 24 Slots</span>
              </div>
            </div>
            <div class="bag-header-actions">
              <button id="bag-close-btn" class="bag-close-btn" title="Fechar (B / ESC)">✕</button>
            </div>
          </div>

          <!-- Filtros e Barra de Pesquisa com os Ícones do Desktop do Usuário -->
          <div class="bag-toolbar">
            <div class="bag-tabs">
              <button class="bag-tab active" data-cat="all">
                <img src="/assets/ui/custom_icons/1.png" class="bag-tab-img" alt="" />
                <span>TODOS</span>
              </button>
              <button class="bag-tab" data-cat="medicine">
                <img src="/assets/ui/custom_icons/2.png" class="bag-tab-img" alt="" />
                <span>MEDICINA</span>
              </button>
              <button class="bag-tab" data-cat="pokeball">
                <img src="/assets/ui/custom_icons/3.png" class="bag-tab-img" alt="" />
                <span>POKÉBOLAS</span>
              </button>
              <button class="bag-tab" data-cat="machine">
                <img src="/assets/ui/custom_icons/4.png" class="bag-tab-img" alt="" />
                <span>MTs</span>
              </button>
              <button class="bag-tab" data-cat="berry">
                <img src="/assets/ui/custom_icons/5.png" class="bag-tab-img" alt="" />
                <span>BERRIES</span>
              </button>
              <button class="bag-tab" data-cat="hold_item">
                <img src="/assets/ui/custom_icons/6.png" class="bag-tab-img" alt="" />
                <span>SEGURADOS</span>
              </button>
              <button class="bag-tab" data-cat="battle">
                <img src="/assets/ui/custom_icons/7.png" class="bag-tab-img" alt="" />
                <span>BATALHA</span>
              </button>
              <button class="bag-tab" data-cat="key_item">
                <img src="/assets/ui/custom_icons/8.png" class="bag-tab-img" alt="" />
                <span>CHAVE</span>
              </button>
            </div>
            <div class="bag-search-wrapper">
              <input type="text" id="bag-search-input" class="bag-search-input" placeholder="Buscar itens..." />
            </div>
          </div>

          <!-- Conteúdo Principal: Grade de Slots + Painel de Detalhes -->
          <div class="bag-body">
            <!-- Grade de Slots -->
            <div class="bag-slots-wrapper">
              <div class="bag-slots-grid" id="bag-slots-grid"></div>
              <div class="bag-tier-info" id="bag-tier-info">
                <span class="bag-dnd-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" style="vertical-align: text-bottom; margin-right: 4px;">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Arraste itens para os slots da Barra Rápida visível na parte inferior
                </span>
              </div>
            </div>

            <!-- Painel do Item Selecionado -->
            <div class="bag-inspector" id="bag-inspector">
              <div class="bag-inspector-empty">
                <img src="/assets/ui/bag_sprite.png" class="bag-empty-icon-img" alt="Mochila" />
                <p>Selecione um item na mochila para ver detalhes e ações</p>
              </div>
              <div class="bag-inspector-content hidden" id="bag-inspector-content">
                <div class="bag-item-card">
                  <div class="bag-item-preview-box">
                    <img id="bag-item-preview-img" src="" alt="" class="bag-item-preview-img" />
                  </div>
                  <div class="bag-item-info">
                    <h3 id="bag-item-name" class="bag-item-name">Item</h3>
                    <div class="bag-item-badges">
                      <span id="bag-item-category-tag" class="bag-chip">Categoria</span>
                      <span id="bag-item-qty-tag" class="bag-chip bag-chip-qty">x1</span>
                    </div>
                  </div>
                </div>

                <div class="bag-item-desc-box">
                  <p id="bag-item-desc" class="bag-item-desc"></p>
                  <div class="bag-item-meta" id="bag-item-meta"></div>
                </div>

                <!-- Ações do Item -->
                <div class="bag-item-actions">
                  <button id="bag-btn-use" class="bag-action-btn bag-btn-use">
                    USAR ITEM
                  </button>
                  <div class="bag-hotbar-assign-group">
                    <span class="bag-assign-label">Equipar na Barra Rápida:</span>
                    <div class="bag-hotbar-btn-group">
                      <button class="bag-hotbar-quick-assign" data-slot="1">1</button>
                      <button class="bag-hotbar-quick-assign" data-slot="2">2</button>
                      <button class="bag-hotbar-quick-assign" data-slot="3">3</button>
                      <button class="bag-hotbar-quick-assign" data-slot="4">4</button>
                      <button class="bag-hotbar-quick-assign" data-slot="5">5</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modal = modal;
    this.slotsGrid = document.getElementById('bag-slots-grid');
    this.capacityText = document.getElementById('bag-capacity-text');
    this.searchInput = document.getElementById('bag-search-input');
    this.inspectorEmpty = document.querySelector('.bag-inspector-empty');
    this.inspectorContent = document.getElementById('bag-inspector-content');

    this.previewImg = document.getElementById('bag-item-preview-img');
    this.itemName = document.getElementById('bag-item-name');
    this.categoryTag = document.getElementById('bag-item-category-tag');
    this.qtyTag = document.getElementById('bag-item-qty-tag');
    this.itemDesc = document.getElementById('bag-item-desc');
    this.btnUse = document.getElementById('bag-btn-use');
  }

  bindEvents() {
    document.getElementById('bag-close-btn')?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    this.btnUse?.addEventListener('click', () => {
      if (this.selectedSlotIndex === null) return;
      const slot = this.inventory.find(s => s.slotIndex === this.selectedSlotIndex);
      if (slot) {
        SocketClient.useItem(slot.slotIndex, slot.itemId);
      }
    });

    this.modal.querySelectorAll('.bag-hotbar-quick-assign').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSlot = parseInt(btn.dataset.slot);
        if (this.selectedSlotIndex === null) return;
        const slot = this.inventory.find(s => s.slotIndex === this.selectedSlotIndex);
        if (slot && slot.item) {
          this.bindItemToHotbar(targetSlot, slot.itemId, slot.item.name);
          this.showToast(`Item "${slot.item.name}" equipado no atalho [${targetSlot}]!`);
          this.renderSlots();
        }
      });
    });

    this.modal.querySelectorAll('.bag-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.modal.querySelectorAll('.bag-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentCategory = tab.dataset.cat;
        this.renderSlots();
      });
    });

    this.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderSlots();
    });

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (document.body.classList.contains('editor-mode')) return;
      if (this.worldScene?.isChatting) return;

      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const slotNum = parseInt(e.key);
        this.triggerHotbarSlot(slotNum);
      }
    });
  }

  /** Global Delegated Drag-and-Drop Handler to guarantee drag works everywhere */
  initGlobalDragAndDrop() {
    if (window._bagDragBound) return;
    window._bagDragBound = true;

    window.addEventListener('dragover', (e) => {
      const quickSlot = e.target.closest('.quick-slot');
      const bagSlot = e.target.closest('.bag-slot');
      if (quickSlot || bagSlot) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        if (quickSlot) quickSlot.classList.add('drag-over');
        if (bagSlot) bagSlot.classList.add('drag-over');
      }
    });

    window.addEventListener('dragleave', (e) => {
      const quickSlot = e.target.closest('.quick-slot');
      const bagSlot = e.target.closest('.bag-slot');
      if (quickSlot && !quickSlot.contains(e.relatedTarget)) {
        quickSlot.classList.remove('drag-over');
      }
      if (bagSlot && !bagSlot.contains(e.relatedTarget)) {
        bagSlot.classList.remove('drag-over');
      }
    });

    window.addEventListener('drop', (e) => {
      const quickSlot = e.target.closest('.quick-slot');
      const bagSlot = e.target.closest('.bag-slot');

      if (quickSlot || bagSlot) {
        e.preventDefault();
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      }

      if (quickSlot) {
        const targetSlotNum = parseInt(quickSlot.dataset.slot);
        try {
          const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
          if (!raw) return;
          const data = JSON.parse(raw);

          if (data.source === 'bag') {
            const slot = this.inventory.find(s => s.slotIndex === data.slotIndex);
            if (slot && slot.item) {
              this.bindItemToHotbar(targetSlotNum, slot.itemId, slot.item.name);
              this.showToast(`Item "${slot.item.name}" equipado na barra rápida [${targetSlotNum}]!`);
              this.renderSlots();
            }
          } else if (data.source === 'hotbar') {
            const fromKey = data.hotbarKey;
            const toKey = targetSlotNum;
            if (fromKey !== toKey) {
              const itemFrom = { ...this.hotbarSlots[fromKey - 1] };
              const itemTo   = { ...this.hotbarSlots[toKey   - 1] };
              this.hotbarSlots[fromKey - 1] = { ...itemTo,   key: fromKey };
              this.hotbarSlots[toKey   - 1] = { ...itemFrom, key: toKey };
              this.sanitizeHotbar();
              this.updateHotbarView();
              this.renderSlots();
            }
          }
        } catch (err) {
          console.error('Error on quickSlot drop:', err);
        }
      }
    });

    const quickBar = document.querySelector('.hud-quick-bar');
    if (quickBar && !window._hotbarEventsBound) {
      window._hotbarEventsBound = true;

      quickBar.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.quick-slot-remove-btn');
        if (removeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const slotEl = removeBtn.closest('.quick-slot');
          if (slotEl) {
            const slotNum = parseInt(slotEl.dataset.slot);
            this.unbindHotbarSlot(slotNum);
          }
          return;
        }
      });

      quickBar.addEventListener('contextmenu', (e) => {
        const slotEl = e.target.closest('.quick-slot');
        if (slotEl) {
          e.preventDefault();
          e.stopPropagation();
          const slotNum = parseInt(slotEl.dataset.slot);
          this.unbindHotbarSlot(slotNum);
        }
      });
    }
  }

  listenNetwork() {
    SocketClient.on('player:init', (data) => {
      if (data.self) this.character = data.self;
      if (data.inventory) {
        this.inventory = data.inventory;
      }
      this.loadHotbar();
      this.sanitizeHotbar();
      this.updateHotbarView();
    });

    SocketClient.on('inventory:update', (data) => {
      if (data.inventory) {
        this.inventory = data.inventory;
        this.updateHotbarView();
        if (this.isOpen) {
          this.renderSlots();
          this.updateInspector();
        }
      }
    });

    SocketClient.on('inventory:used_result', (res) => {
      if (res.success) {
        this.showToast(res.message || 'Item utilizado com sucesso!');
      } else {
        this.showToast(res.message || 'Não foi possível usar este item.', 'error');
      }
    });

    SocketClient.on('character:update', (data) => {
      if (typeof data.money === 'number') {
        const moneyBadge = document.getElementById('hud-money');
        if (moneyBadge) moneyBadge.innerText = data.money.toLocaleString('pt-BR');
        if (this.character) this.character.money = data.money;
      }
    });
  }

  setData(characterData) {
    if (!characterData) return;
    this.character = characterData;
    if (characterData.inventory) {
      this.inventory = characterData.inventory;
    }
    if (characterData.bagCapacity) {
      this.bagCapacity = characterData.bagCapacity;
    }
    this.loadHotbar();
    this.sanitizeHotbar();
    this.updateHotbarView();
  }

  open() {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
    this.sanitizeHotbar();
    this.renderSlots();
    this.updateCapacityBadge();
    if (this.worldScene) {
      this.worldScene.isBagOpen = true;
    }
  }

  close() {
    this.isOpen = false;
    this.modal.classList.add('hidden');
    if (this.worldScene) {
      this.worldScene.isBagOpen = false;
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  updateCapacityBadge() {
    if (this.capacityText) {
      this.capacityText.innerText = `${this.inventory.length} / ${this.bagCapacity} Slots`;
    }
  }

  renderSlots() {
    if (!this.slotsGrid) return;
    this.slotsGrid.innerHTML = '';

    const filteredSlots = this.inventory.filter(s => {
      const item = s.item;
      if (!item) return false;
      const matchCat = this.currentCategory === 'all' || item.category === this.currentCategory;
      const matchSearch = !this.searchQuery || item.name.toLowerCase().includes(this.searchQuery);
      return matchCat && matchSearch;
    });

    const isFiltering = this.currentCategory !== 'all' || Boolean(this.searchQuery);

    for (let i = 0; i < this.bagCapacity; i++) {
      const slotEl = document.createElement('div');

      const matchingSlot = filteredSlots.find(s => s.slotIndex === i);
      const rawSlot = this.inventory.find(s => s.slotIndex === i);
      const slotData = isFiltering ? matchingSlot : rawSlot;

      slotEl.className = 'bag-slot';
      slotEl.dataset.slotIndex = i;

      if (this.selectedSlotIndex === i) {
        slotEl.classList.add('selected');
      }

      if (isFiltering && !matchingSlot && rawSlot) {
        slotEl.classList.add('dimmed-filter');
      }

      if (slotData && slotData.item) {
        const item = slotData.item;
        const iconUrl = getItemIcon(item);
        const hotbarKey = this.getHotbarKeyForItem(item.id, item.name);

        slotEl.innerHTML = `
          <img src="${iconUrl}" alt="${item.name}" class="bag-slot-icon" onerror="this.onerror=null; this.src='/assets/ui/items/defaultitem.svg';" />
          <span class="bag-slot-qty">x${slotData.quantity}</span>
          ${hotbarKey ? `<span class="bag-slot-hotbar-key" title="Atalho [${hotbarKey}]">[${hotbarKey}]</span>` : ''}
        `;
        slotEl.title = `${item.name} (x${slotData.quantity})\n${item.description}\n(Dê duplo clique para usar)`;

        slotEl.setAttribute('draggable', 'true');
        slotEl.ondragstart = (e) => {
          slotEl.classList.add('dragging');
          document.body.classList.add('is-dragging-item');
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            const payload = JSON.stringify({
              source: 'bag',
              slotIndex: i,
              itemId: item.id
            });
            e.dataTransfer.setData('text/plain', payload);
            e.dataTransfer.setData('application/json', payload);
          }
        };
        slotEl.ondragend = () => {
          slotEl.classList.remove('dragging');
          document.body.classList.remove('is-dragging-item');
          document.querySelectorAll('.bag-slot.drag-over, .quick-slot.drag-over').forEach(el => el.classList.remove('drag-over'));
        };

        slotEl.onclick = () => {
          this.selectedSlotIndex = i;
          this.renderSlots();
          this.updateInspector(slotData);
        };

        slotEl.ondblclick = () => {
          SocketClient.useItem(slotData.slotIndex, item.id);
        };
      } else {
        slotEl.classList.add('empty');
        slotEl.innerHTML = `<span class="bag-slot-empty-num">${i + 1}</span>`;
      }

      this.slotsGrid.appendChild(slotEl);
    }

    this.updateCapacityBadge();
  }

  updateInspector(slotData = null) {
    if (!slotData && this.selectedSlotIndex !== null) {
      slotData = this.inventory.find(s => s.slotIndex === this.selectedSlotIndex);
    }

    if (!slotData || !slotData.item) {
      this.inspectorEmpty.classList.remove('hidden');
      this.inspectorContent.classList.add('hidden');
      return;
    }

    const item = slotData.item;
    this.inspectorEmpty.classList.add('hidden');
    this.inspectorContent.classList.remove('hidden');

    this.previewImg.src = getItemIcon(item);
    this.previewImg.onerror = () => { this.previewImg.src = '/assets/ui/items/defaultitem.svg'; };
    this.itemName.innerText = item.name;
    this.categoryTag.innerText = getItemCategoryLabel(item.category);
    this.qtyTag.innerText = `x${slotData.quantity}`;
    this.itemDesc.innerText = item.description || 'Nenhuma descrição disponível.';

    const metaBox = document.getElementById('bag-item-meta');
    if (metaBox) {
      metaBox.innerHTML = `
        <div style="font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; margin-top: 6px;">
          <span>Preço de Venda:</span>
          <strong style="color: #ffd700;">¥ ${(item.price / 2).toLocaleString('pt-BR')}</strong>
        </div>
      `;
    }
  }

  // ─── Hotbar Rápida (1-5) ──────────────────────────────────────────────────

  loadHotbar() {
    try {
      const charId = this.character?.id || 'default';
      const saved = localStorage.getItem(`pokemmo_hotbar_${charId}`);
      if (saved) {
        this.hotbarSlots = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load hotbar from storage', e);
    }
  }

  saveHotbar() {
    try {
      const charId = this.character?.id || 'default';
      localStorage.setItem(`pokemmo_hotbar_${charId}`, JSON.stringify(this.hotbarSlots));
    } catch (e) {
      console.warn('Could not save hotbar to storage', e);
    }
  }

  /** Ensures that every item appears at most once on the hotbar */
  sanitizeHotbar() {
    const seen = new Set();
    this.hotbarSlots.forEach(slot => {
      if (!slot.itemId && !slot.itemName) return;
      const rawKey = slot.itemId != null ? slot.itemId : slot.itemName;
      const key = String(rawKey || '').toLowerCase();
      if (!key || seen.has(key)) {
        slot.itemId = null;
        slot.itemName = null;
      } else {
        seen.add(key);
      }
    });
    this.saveHotbar();
  }

  /** Assigns item uniquely to slotNumber, removing it from any previous slot */
  bindItemToHotbar(slotNumber, itemId, itemName) {
    if (slotNumber < 1 || slotNumber > 5) return;

    this.hotbarSlots.forEach(slot => {
      const isSameId = itemId != null && slot.itemId === itemId;
      const isSameName = itemName && slot.itemName && String(slot.itemName).toLowerCase() === String(itemName).toLowerCase();
      if (isSameId || isSameName) {
        slot.itemId = null;
        slot.itemName = null;
      }
    });

    this.hotbarSlots[slotNumber - 1] = {
      key: slotNumber,
      itemId,
      itemName
    };

    this.sanitizeHotbar();
    this.updateHotbarView();
  }

  getHotbarKeyForItem(itemId, itemName) {
    const found = this.hotbarSlots.find(h =>
      (itemId != null && h.itemId === itemId) ||
      (itemName && h.itemName && String(h.itemName).toLowerCase() === String(itemName).toLowerCase())
    );
    return found ? found.key : null;
  }

  unbindHotbarSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 5) return;
    const current = this.hotbarSlots[slotNumber - 1];
    const name = current?.itemName || 'Item';

    this.hotbarSlots[slotNumber - 1] = {
      key: slotNumber,
      itemId: null,
      itemName: null
    };

    this.saveHotbar();
    this.updateHotbarView();
    this.renderSlots();
    if (current && (current.itemId || current.itemName)) {
      this.showToast(`Item "${name}" removido do atalho [${slotNumber}]!`);
    }
  }

  updateHotbarView() {
    const quickBar = document.querySelector('.hud-quick-bar');
    if (!quickBar) return;

    for (let i = 1; i <= 5; i++) {
      const config = this.hotbarSlots[i - 1];
      const slotEl = quickBar.querySelector(`.quick-slot[data-slot="${i}"]`);
      if (!slotEl) continue;

      const qtyEl = slotEl.querySelector('.quick-slot-qty');
      const iconEl = slotEl.querySelector('.quick-slot-icon');

      if (config && (config.itemId || config.itemName)) {
        const invSlot = this.inventory.find(s =>
          (config.itemId != null && s.itemId === config.itemId) ||
          (config.itemName && s.item?.name && String(s.item.name).toLowerCase() === String(config.itemName).toLowerCase())
        );
        const qty = invSlot ? invSlot.quantity : 0;
        const displayName = invSlot?.item?.name || config.itemName || 'Item';
        if (invSlot && !config.itemId) {
          config.itemId = invSlot.itemId;
        }

        iconEl.src = getItemIcon(invSlot?.item || config.itemName);
        iconEl.onerror = () => { iconEl.src = '/assets/ui/items/defaultitem.svg'; };
        iconEl.alt = displayName;
        iconEl.style.display = 'block';
        qtyEl.innerText = qty;
        slotEl.title = `[Tecla ${i}] ${displayName} (x${qty})\nClique para usar | Clique direito ou [×] para remover`;

        slotEl.classList.remove('empty');
        slotEl.classList.add('has-item');
        slotEl.style.opacity = qty === 0 ? '0.45' : '1';
      } else {
        iconEl.src = '';
        iconEl.style.display = 'none';
        qtyEl.innerText = '';
        slotEl.title = `Slot [${i}]: Vazio. Arraste um item da Mochila aqui.`;
        slotEl.classList.add('empty');
        slotEl.classList.remove('has-item');
        slotEl.style.opacity = '1';
      }
    }
  }

  triggerHotbarSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 5) return;
    const config = this.hotbarSlots[slotNumber - 1];
    if (!config || (!config.itemId && !config.itemName)) {
      this.showToast(`Slot [${slotNumber}] está vazio! Abra a Mochila (B) e arraste um item.`);
      return;
    }

    const invSlot = this.inventory.find(s =>
      (config.itemId != null && s.itemId === config.itemId) ||
      (config.itemName && s.item?.name && String(s.item.name).toLowerCase() === String(config.itemName).toLowerCase())
    );
    if (!invSlot || invSlot.quantity <= 0) {
      this.showToast(`Você não tem mais ${config.itemName || 'este item'} na mochila!`, 'error');
      return;
    }

    const slotEl = document.querySelector(`.hud-quick-bar .quick-slot[data-slot="${slotNumber}"]`);
    if (slotEl) {
      slotEl.classList.remove('active-pulse');
      void slotEl.offsetWidth;
      slotEl.classList.add('active-pulse');
    }

    SocketClient.useItem(invSlot.slotIndex, invSlot.itemId);
  }

  showToast(message, type = 'info') {
    let toast = document.getElementById('hud-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hud-toast';
      toast.className = 'hud-toast';
      document.body.appendChild(toast);
    }

    toast.className = `hud-toast active ${type}`;
    toast.innerHTML = `<span class="hud-toast-text">${message}</span>`;

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }
}
