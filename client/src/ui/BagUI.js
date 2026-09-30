import SocketClient from '../network/SocketClient';
import PokemonStorageUI from './PokemonStorageUI';
import { getPokemonOverworldSprite } from '../utils/pokemonAssets';

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
    this.party = [];

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

            <!-- Painel de Equipamentos do Treinador -->
            <div class="bag-inspector" id="bag-inspector">
              <div class="bag-equip-panel">
                <div class="bag-equip-header">
                  <h3>EQUIPAMENTOS DO TREINADOR</h3>
                </div>
                <div class="bag-equip-stage">
                  <!-- Slot Superior: Chapéu -->
                  <div class="bag-equip-slot-wrapper slot-top">
                    <span class="bag-slot-label">CHAPÉU</span>
                    <div class="bag-equip-slot" data-equip-slot="hat" title="Chapéu / Acessório">
                      <div class="bag-equip-item-container" id="equip-container-hat"></div>
                    </div>
                  </div>

                  <!-- Linha Meio: Skin, Player Preview, Buddy -->
                  <div class="bag-equip-row middle">
                    <div class="bag-equip-slot-wrapper">
                      <span class="bag-slot-label">SKIN</span>
                      <div class="bag-equip-slot" data-equip-slot="skin" title="Skin / Traje de Treinador">
                        <div class="bag-equip-item-container" id="equip-container-skin"></div>
                      </div>
                    </div>

                    <div class="bag-player-preview-wrapper" title="Prévia do Treinador">
                      <canvas id="bag-player-canvas" width="48" height="72"></canvas>
                    </div>

                    <div class="bag-equip-slot-wrapper">
                      <span class="bag-slot-label">BUDDY</span>
                      <div class="bag-equip-slot" data-equip-slot="buddy" title="Pokémon Companheiro">
                        <div class="bag-equip-item-container" id="equip-container-buddy"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Linha Inferior: Ferramenta, Amuleto (Centro), Montaria -->
                  <div class="bag-equip-row bottom">
                    <div class="bag-equip-slot-wrapper">
                      <span class="bag-slot-label">FERRAMENTA</span>
                      <div class="bag-equip-slot" data-equip-slot="tool" title="Ferramenta Utilitária">
                        <div class="bag-equip-item-container" id="equip-container-tool"></div>
                      </div>
                    </div>

                    <div class="bag-equip-slot-wrapper slot-bottom">
                      <span class="bag-slot-label">AMULETO</span>
                      <div class="bag-equip-slot" data-equip-slot="amulet" title="Amuleto / Relíquia">
                        <div class="bag-equip-item-container" id="equip-container-amulet"></div>
                      </div>
                    </div>

                    <div class="bag-equip-slot-wrapper">
                      <span class="bag-slot-label">MONTARIA</span>
                      <div class="bag-equip-slot" data-equip-slot="mount" title="Montaria / Veículo">
                        <div class="bag-equip-item-container" id="equip-container-mount"></div>
                      </div>
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
    this.tierInfoFooter = document.getElementById('bag-tier-info');

    this.equippedItems = {
      hat: null,
      skin: null,
      buddy: null,
      tool: null,
      mount: null,
      amulet: null
    };
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
        this.handleUseItem(slot);
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

      // Se a interface de batalha estiver aberta, não executar atalhos do mapa / overworld
      const battleEl = document.getElementById('battle-ui-container');
      const isBattleOpen = this.worldScene?.battleUI?.isOpen || window._battleUI?.isOpen || (battleEl && !battleEl.classList.contains('hidden'));
      if (isBattleOpen) return;

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

      if (bagSlot) {
        const targetSlotIndex = parseInt(bagSlot.dataset.slotIndex);
        try {
          const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
          if (!raw) return;
          const data = JSON.parse(raw);

          if (data.source === 'bag') {
            const fromSlotIndex = data.slotIndex;
            if (typeof fromSlotIndex === 'number' && !isNaN(targetSlotIndex) && fromSlotIndex !== targetSlotIndex) {
              SocketClient.emit('inventory:swap', {
                fromSlot: fromSlotIndex,
                toSlot: targetSlotIndex
              });

              // Optimistic instant local swap for zero-latency feel
              const slotA = this.inventory.find(s => s.slotIndex === fromSlotIndex);
              const slotB = this.inventory.find(s => s.slotIndex === targetSlotIndex);
              if (slotA && slotB) {
                slotA.slotIndex = targetSlotIndex;
                slotB.slotIndex = fromSlotIndex;
              } else if (slotA && !slotB) {
                slotA.slotIndex = targetSlotIndex;
              }

              if (this.selectedSlotIndex === fromSlotIndex) {
                this.selectedSlotIndex = targetSlotIndex;
              } else if (this.selectedSlotIndex === targetSlotIndex) {
                this.selectedSlotIndex = fromSlotIndex;
              }

              this.renderSlots();
              this.updateInspector();
            }
          }
        } catch (err) {
          console.error('Error on bagSlot drop:', err);
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
      if (data.equipment) {
        try {
          this.equippedItems = typeof data.equipment === 'string' ? JSON.parse(data.equipment) : data.equipment;
        } catch (e) {}
      }
      this.loadHotbar();
      this.sanitizeHotbar();
      this.updateHotbarView();
    });

    SocketClient.on('equipment:updated', (data) => {
      if (data.equipment) {
        try {
          const newEquip = typeof data.equipment === 'string' ? JSON.parse(data.equipment) : data.equipment;
          this.equippedItems = { ...this.equippedItems, ...newEquip };
          if (this.isOpen) this.renderEquippedSlots();
        } catch (e) {}
      }
    });

    SocketClient.on('player:buddy_updated', (data) => {
      const isLocal = data.socketId === SocketClient.socket?.id ||
                      (this.character && data.characterId === this.character.id);
      if (isLocal) {
        this.equippedItems.buddy = data.buddy || null;
        if (this.isOpen) this.renderEquippedSlots();
      }
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

    SocketClient.on('pokemon:data_response', (data) => {
      if (data && data.success && Array.isArray(data.party)) {
        this.party = data.party;
      }
    });

    SocketClient.on('player:init', (data) => {
      if (data?.pokemon && Array.isArray(data.pokemon)) {
        const partyList = data.pokemon.filter(p => p.location === 'party');
        if (partyList.length > 0) {
          this.party = partyList;
        }
      }
      SocketClient.emit('pokemon:get_data');
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
    if (Array.isArray(characterData.pokemon)) {
      this.party = characterData.pokemon.filter(p => p.location === 'party');
    }
    if (characterData.equipment) {
      try {
        const parsed = typeof characterData.equipment === 'string'
          ? JSON.parse(characterData.equipment)
          : characterData.equipment;
        this.equippedItems = { ...this.equippedItems, ...parsed };
      } catch (e) {}
    }
    const buddyPkmn = (characterData.pokemon || []).find(p => p.isBuddy);
    if (buddyPkmn) {
      const formattedId = String(buddyPkmn.speciesId).padStart(3, '0');
      this.equippedItems.buddy = {
        id: buddyPkmn.id,
        speciesId: buddyPkmn.speciesId,
        name: buddyPkmn.nickname || buddyPkmn.species?.name || buddyPkmn.name,
        level: buddyPkmn.level,
        isShiny: buddyPkmn.isShiny,
        sprite: `${formattedId}.png`
      };
    }
    this.loadHotbar();
    this.sanitizeHotbar();
    this.updateHotbarView();
  }

  open() {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
    if (!this.party || this.party.length === 0) {
      SocketClient.emit('pokemon:get_data');
    }
    if (!this.equippedItems.buddy && this.worldScene?.localFollower?.buddyData) {
      this.equippedItems.buddy = this.worldScene.localFollower.buddyData;
    }
    this.sanitizeHotbar();
    this.renderSlots();
    this.updateCapacityBadge();
    this.renderPlayerPreview();
    this.renderEquippedSlots();
    if (this.worldScene) {
      this.worldScene.isBagOpen = true;
    }
  }

  getParty() {
    if (Array.isArray(this.party) && this.party.length > 0) return this.party;
    if (this.worldScene?.partyHUDUI?.party?.length) return this.worldScene.partyHUDUI.party;
    if (window._partyHUDUI?.party?.length) return window._partyHUDUI.party;
    if (this.pokemonStorageUI?.party?.length) return this.pokemonStorageUI.party;
    if (window._pokemonStorageUI?.party?.length) return window._pokemonStorageUI.party;
    const charPkmn = (this.character?.pokemon || []).filter(p => p.location === 'party');
    if (charPkmn.length > 0) return charPkmn;
    return [];
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

  renderPlayerPreview() {
    const canvas = document.getElementById('bag-player-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spriteName = this.character?.sprite || 'boy_run';
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 32, 48, 8, 12, 32, 48);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    };
    img.onerror = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(8, 12, 32, 48);
    };
    img.src = `/assets/characters/${spriteName}.png`;
  }

  renderEquippedSlots() {
    const slots = ['hat', 'skin', 'buddy', 'tool', 'mount', 'amulet'];
    slots.forEach(slotKey => {
      const container = document.getElementById(`equip-container-${slotKey}`);
      if (!container) return;

      const equipped = this.equippedItems[slotKey];

      if (slotKey === 'buddy') {
        const buddy = equipped ||
                      this.equippedItems.buddy ||
                      this.worldScene?.localFollower?.buddyData ||
                      (this.character?.pokemon || []).find(p => p.isBuddy);

        if (buddy) {
          this.equippedItems.buddy = buddy;
          container.innerHTML = '';

          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          canvas.className = `bag-equipped-icon ${buddy.isShiny ? 'shiny-glow' : ''}`;
          canvas.title = `${buddy.nickname || buddy.name || 'Pokémon'} (Lv.${buddy.level || 1})\n(Clique para alterar companheiro)`;
          canvas.style.cursor = 'pointer';

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = false;

            let formattedId = '001';
            if (buddy.speciesId) {
              formattedId = String(buddy.speciesId).padStart(3, '0');
            } else if (buddy.sprite) {
              formattedId = String(buddy.sprite).replace('.png', '').padStart(3, '0');
            } else if (buddy.pokedexId) {
              formattedId = String(buddy.pokedexId).padStart(3, '0');
            } else if (buddy.species?.id) {
              formattedId = String(buddy.species.id).padStart(3, '0');
            }

            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, 64, 64);
              const frameW = img.width / 2;
              const frameH = img.height / 4;
              // Frame 4 (DOWN idle = Olhando de frente): coluna 0, linha 2 (y = 2 * frameH)
              const sx = 0;
              const sy = frameH * 2;
              ctx.drawImage(img, sx, sy, frameW, frameH, 0, 0, 64, 64);
            };
            img.onerror = () => {
              if (buddy.icon) {
                container.innerHTML = `<img src="${buddy.icon}" class="bag-equipped-icon" />`;
              }
            };
            img.src = getPokemonOverworldSprite(formattedId, { isShiny: Boolean(buddy.isShiny) });
          }

          container.appendChild(canvas);
        } else {
          container.innerHTML = `<span style="font-size: 10px; color: #78909c;">+ Selecionar</span>`;
        }
        container.onclick = (e) => {
          e.stopPropagation();
          if (!this.pokemonStorageUI) {
            this.pokemonStorageUI = new PokemonStorageUI(this.worldScene);
          }
          this.pokemonStorageUI.open();
        };
      } else {
        if (equipped) {
          container.innerHTML = `
            <img src="${equipped.icon}" class="bag-equipped-icon" title="${equipped.name}\n(Clique para desequipar)" />
          `;
          container.onclick = (e) => {
            e.stopPropagation();
            this.unequipItem(slotKey);
          };
        } else {
          container.innerHTML = '';
          container.onclick = null;
        }
      }
    });
  }

  saveEquipment() {
    const charId = this.character?.id || 'default';
    try {
      localStorage.setItem(`pokemmo_equipment_${charId}`, JSON.stringify(this.equippedItems));
    } catch (e) {}
    SocketClient.emit('equipment:update', { equipment: this.equippedItems });
  }

  unequipItem(slotKey) {
    if (this.equippedItems[slotKey]) {
      const name = this.equippedItems[slotKey].name;
      this.equippedItems[slotKey] = null;
      this.renderEquippedSlots();
      this.saveEquipment();
      this.showToast(`Item "${name}" desequipado!`);
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
          this.handleUseItem(slotData);
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
      this.selectedSlotIndex = null;
      if (this.tierInfoFooter) {
        this.tierInfoFooter.innerHTML = `
          <span class="bag-dnd-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" style="vertical-align: text-bottom; margin-right: 4px;">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Arraste itens para os slots da Barra Rápida visível na parte inferior
          </span>
        `;
      }
      return;
    }

    const item = slotData.item;
    const iconUrl = getItemIcon(item);

    if (this.tierInfoFooter) {
      this.tierInfoFooter.innerHTML = `
        <div class="bag-footer-item-bar">
          <div class="bag-footer-item-preview">
            <img src="${iconUrl}" alt="${item.name}" class="bag-footer-icon" onerror="this.onerror=null; this.src='/assets/ui/items/defaultitem.svg';" />
          </div>
          <div class="bag-footer-item-details">
            <div class="bag-footer-item-head">
              <strong class="bag-footer-item-title">${item.name}</strong>
              <span class="bag-chip">x${slotData.quantity}</span>
              <span class="bag-chip bag-chip-cat">${getItemCategoryLabel(item.category)}</span>
            </div>
            <p class="bag-footer-item-desc">${item.description || 'Sem descrição.'}</p>
          </div>
          <div class="bag-footer-item-actions">
            <button id="bag-footer-btn-use" class="bag-action-btn bag-btn-use">USAR ITEM</button>
          </div>
        </div>
      `;

      const btnUse = document.getElementById('bag-footer-btn-use');
      btnUse?.addEventListener('click', () => {
        this.handleUseItem(slotData);
      });
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

    if (!this.isOpen) {
      this.quickUseFromHotbar(invSlot);
    } else {
      this.handleUseItem(invSlot);
    }
  }

  handleUseItem(slotData) {
    if (!slotData || !slotData.item) return;
    const item = slotData.item;
    const lowerName = (item.name || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();

    // Pokébolas não podem ser usadas fora de batalha
    if (cat === 'pokeball' || lowerName.endsWith('ball') || lowerName.endsWith('bola')) {
      this.showToast('Pokébolas só podem ser usadas durante uma batalha para capturar Pokémon selvagens!', 'error');
      return;
    }

    // Itens aplicáveis a Pokémon (Medicina, Poções, Reviver, Doces, Pedras, Vitaminas)
    const isRevive = lowerName.includes('revive');
    const isCandy = lowerName.includes('candy') || lowerName.includes('doce');
    const isPotion = lowerName.includes('potion') || lowerName.includes('poção') || lowerName.includes('water') || lowerName.includes('milk') || lowerName.includes('soda') || lowerName.includes('lemonade') || lowerName.includes('berry') || lowerName.includes('restore');
    const isStatusHeal = lowerName.includes('antidote') || lowerName.includes('antídoto') || lowerName.includes('paralyz') || lowerName.includes('paralisia') || lowerName.includes('awakening') || lowerName.includes('despertar') || lowerName.includes('burn') || lowerName.includes('queimadura') || lowerName.includes('ice heal') || lowerName.includes('gelo') || lowerName.includes('full heal') || lowerName.includes('cura total');
    const isEvolutionStone = cat === 'evolution_stone' || lowerName.includes('stone') || lowerName.includes('pedra');

    const isTargeted = cat === 'medicine' || isRevive || isCandy || isPotion || isStatusHeal || isEvolutionStone;

    if (!isTargeted) {
      SocketClient.useItem(slotData.slotIndex, item.id);
      return;
    }

    // Obter Pokémon da equipe
    const party = this.getParty();

    if (!party || party.length === 0) {
      SocketClient.emit('pokemon:get_data');
      this.showToast('Sincronizando equipe Pokémon, tente novamente em instantes...', 'info');
      return;
    }

    // Se for Revive e nenhum Pokémon estiver desmaiado na equipe:
    if (isRevive) {
      const anyFainted = party.some(p => Number(p.currentHp !== undefined && p.currentHp !== null ? p.currentHp : 0) <= 0);
      if (!anyFainted) {
        this.showToast('Nenhum Pokémon da sua equipe está desmaiado!', 'info');
        return;
      }
    }

    // Abrir o modal de seleção de Pokémon da equipe estilo Battle Box
    this.openPartyTargetModal(slotData, party);
  }

  openPartyTargetModal(slotData, party) {
    let modalWrap = document.getElementById('bag-target-modal-overlay');
    if (modalWrap) {
      modalWrap.remove();
    }

    modalWrap = document.createElement('div');
    modalWrap.id = 'bag-target-modal-overlay';
    modalWrap.className = 'bag-target-modal-overlay';

    const item = slotData.item;
    const lowerName = (item.name || '').toLowerCase();
    const isRevive = lowerName.includes('revive');
    const isCandy = lowerName.includes('candy') || lowerName.includes('doce');
    const isPotion = lowerName.includes('potion') || lowerName.includes('poção') || lowerName.includes('water') || lowerName.includes('milk') || lowerName.includes('soda') || lowerName.includes('lemonade') || lowerName.includes('berry') || lowerName.includes('restore');
    const isStatusHeal = lowerName.includes('antidote') || lowerName.includes('antídoto') || lowerName.includes('paralyz') || lowerName.includes('paralisia') || lowerName.includes('awakening') || lowerName.includes('despertar') || lowerName.includes('burn') || lowerName.includes('queimadura') || lowerName.includes('ice heal') || lowerName.includes('gelo') || lowerName.includes('full heal') || lowerName.includes('cura total');

    modalWrap.innerHTML = `
      <div class="battle-modal-backdrop active" id="bag-target-backdrop"></div>
      <div class="battle-modal-panel battle-team-modal bag-target-modal-panel active" id="bag-target-panel">
        <div class="battle-modal-shelf"></div>
        <div class="battle-modal-header">
          <div class="battle-modal-title">
            <img src="${getItemIcon(item)}" class="btm-item-icon" alt="${item.name}">
            <span>USAR ${String(item.name).toUpperCase()}</span>
            <div class="btm-badge-count">${party.length}/6</div>
          </div>
          <div class="btm-subtitle">Selecione o Pokémon da sua equipe para receber o item</div>
          <button class="battle-modal-close" id="bag-target-close-btn" title="Fechar (ESC)">✕</button>
        </div>

        <div class="battle-team-board">
          <div class="battle-team-cells-grid" id="bag-target-cells-grid"></div>
          <div class="battle-team-footer">
            <button class="swsh-back-btn" id="bag-target-back-btn">◀ CANCELAR</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);

    const gridEl = modalWrap.querySelector('#bag-target-cells-grid');
    const closeBtn = modalWrap.querySelector('#bag-target-close-btn');
    const backBtn = modalWrap.querySelector('#bag-target-back-btn');
    const backdrop = modalWrap.querySelector('#bag-target-backdrop');

    const closeModal = () => {
      modalWrap.classList.add('closing');
      setTimeout(() => modalWrap.remove(), 150);
    };

    closeBtn.addEventListener('click', closeModal);
    backBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Preencher 6 células da grade da equipe (PC Box / Battle Team Style)
    for (let idx = 0; idx < 6; idx++) {
      const pkmn = party[idx];
      const cell = document.createElement('div');

      if (pkmn) {
        const curHp = Number(pkmn.currentHp !== undefined && pkmn.currentHp !== null ? pkmn.currentHp : 0);
        const maxHp = Number(pkmn.maxHp || 20);
        const isFainted = curHp <= 0;
        const isFullHp = curHp >= maxHp;
        const isMaxLvl = (pkmn.level || 1) >= 100;
        const isShiny = Boolean(pkmn.isShiny);

        let isDisabled = false;
        let hintText = '';
        let statusTagHtml = '';

        if (isRevive) {
          if (!isFainted) {
            isDisabled = true;
            hintText = 'não está desmaiado';
            statusTagHtml = '<span class="pbc-tag-status disabled">NÃO DESMAIADO</span>';
          } else {
            statusTagHtml = '<span class="pbc-tag-status revive-active">REVIVER</span>';
            hintText = 'Reviver Pokémon';
          }
        } else if (isPotion) {
          if (isFainted) {
            isDisabled = true;
            hintText = 'está desmaiado! Use um Revive';
            statusTagHtml = '<span class="pbc-tag-status fainted">DESMAIADO</span>';
          } else if (isFullHp) {
            isDisabled = true;
            hintText = 'já está com o HP máximo';
            statusTagHtml = '<span class="pbc-tag-status disabled">HP CHEIO</span>';
          } else {
            statusTagHtml = '';
            hintText = 'Curar HP';
          }
        } else if (isCandy) {
          if (isMaxLvl) {
            isDisabled = true;
            hintText = 'já atingiu o Nível Máximo (100)';
            statusTagHtml = '<span class="pbc-tag-status disabled">NÍVEL MÁX</span>';
          } else {
            statusTagHtml = '';
            hintText = 'Usar Doce';
          }
        } else if (isStatusHeal) {
          if (isFainted) {
            isDisabled = true;
            hintText = 'está desmaiado! Use um Revive';
            statusTagHtml = '<span class="pbc-tag-status fainted">DESMAIADO</span>';
          } else if (pkmn.status && pkmn.status !== 'NONE') {
            statusTagHtml = '';
            hintText = 'Curar Status';
          } else {
            isDisabled = true;
            hintText = 'não possui nenhum problema de status';
            statusTagHtml = '<span class="pbc-tag-status disabled">SEM STATUS</span>';
          }
        } else {
          statusTagHtml = '';
          hintText = 'Usar Item';
        }

        cell.className = `battle-pbc pkmn-box-cell ${isDisabled ? 'is-disabled' : 'selectable'} ${isFainted ? 'is-fainted' : ''}`;

        const speciesId = pkmn.speciesId || pkmn.species?.id || 1;
        const fmtId = String(speciesId).padStart(3, '0');
        const owSpriteUrl = getPokemonOverworldSprite(speciesId, { isShiny });
        const hpPct = Math.max(0, Math.min(100, Math.round((curHp / maxHp) * 100)));
        const hpColor = hpPct <= 20 ? 'hp-red' : hpPct <= 50 ? 'hp-yellow' : 'hp-green';

        const name = pkmn.nickname || pkmn.species?.name || pkmn.name || 'POKÉMON';

        cell.innerHTML = `
          <span class="pbc-dex-num">#${fmtId}</span>
          <div class="pkmn-ow-sprite pbc-ow-sprite" style="background-image: url('${owSpriteUrl}')"></div>
          <span class="pbc-name">${name}</span>
          <span class="pbc-level">Lv.${pkmn.level || 1}</span>
          <div class="pbc-hp-row" title="HP: ${curHp}/${maxHp}">
            <span class="pbc-hp-lbl">HP</span>
            <div class="pbc-hp-track">
              <div class="pbc-hp-fill ${hpColor}" style="width: ${hpPct}%;"></div>
            </div>
            <span class="pbc-hp-num">${curHp}/${maxHp}</span>
          </div>
          ${statusTagHtml}
        `;

        cell.addEventListener('click', () => {
          if (isDisabled) {
            this.showToast(`${name} ${hintText}!`, 'error');
            return;
          }
          closeModal();
          SocketClient.useItem(slotData.slotIndex, item.id, pkmn.id);
          this.showToast(`Usando ${item.name} em ${name}...`, 'success');
        });
      } else {
        cell.className = 'battle-pbc pkmn-box-cell empty-cell';
        cell.innerHTML = `<span class="pbc-num">${idx + 1}</span>`;
      }

      gridEl.appendChild(cell);
    }
  }

  quickUseFromHotbar(invSlot) {
    if (!invSlot || !invSlot.item) return;
    this.handleUseItem(invSlot);
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
