import SocketClient from '../network/SocketClient';
import { getPokemonAnimatedSprite, getPokemonOverworldSprite } from '../utils/pokemonAssets';

// Type color map for pokeball icon tint by type
const TYPE_ICONS = {
  fire: '&#128293;', water: '&#128167;', grass: '&#127807;', electric: '&#9889;',
  psychic: '&#10024;', dragon: '&#128992;', ice: '&#10052;', ghost: '&#128123;',
  dark: '&#128274;', steel: '&#9878;', fairy: '&#129498;', poison: '&#9763;',
  bug: '&#127795;', rock: '&#129704;', ground: '&#127758;', flying: '&#128038;',
  fighting: '&#128293;', normal: '&#9728;'
};

function typeIcon(type) {
  return TYPE_ICONS[(type || '').toLowerCase()] || '&#9670;';
}

export default class PokemonStorageUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.isOpen = false;
    this.currentBox = 1;
    this.party = [];
    this.storage = [];
    this.activeBuddy = null;
    this.selectedPokemon = null;
    this._dragSource = null;
    this.statViewMode = 'radar'; // 'radar' or 'bars'
    this.detailsActiveTab = 'stats'; // 'stats' (Atributos) or 'moves' (Ataques)
    this.boxFilterSearch = '';
    this.boxFilterType = 'all';
    this.boxSortBy = 'slot';

    // Single animation RAF for details sprite
    this._detailsRaf = null;

    this.initDOM();
    this.bindEvents();
    this.listenNetwork();
  }

  _calcTotalIv(pkmn) {
    if (!pkmn) return 0;
    const ivs = [pkmn.ivHp ?? 15, pkmn.ivAtk ?? 15, pkmn.ivDef ?? 15, pkmn.ivSpAtk ?? 15, pkmn.ivSpDef ?? 15, pkmn.ivSpeed ?? 15];
    return ivs.reduce((a, b) => a + b, 0);
  }

  initDOM() {
    let modal = document.getElementById('pkmn-storage-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'pkmn-storage-modal';
    modal.className = 'pkmn-storage-modal hidden';
    modal.innerHTML = '<div class="pkmn-main-container">'
      + '<div class="pkmn-main-header">'
      + '<div class="pkmn-main-title"><span class="pkmn-header-pokeball">&#9679;</span>&nbsp;EQUIPE &amp; CAIXA POK&Eacute;MON</div>'
      + '<div class="pkmn-box-nav" id="pkmn-box-nav"><button id="box-prev-btn" class="pkmn-box-nav-btn">&#9668;</button><span id="box-name-text">CAIXA 1</span><button id="box-next-btn" class="pkmn-box-nav-btn">&#9658;</button></div>'
      + '<button id="pkmn-storage-close-btn" class="pkmn-close-btn">&#10005;</button>'
      + '</div>'
      + '<div class="pkmn-main-body">'
      + '<div class="pkmn-panel-party" id="pkmn-panel-party"><div class="pkmn-panel-label">EQUIPE ATIVA</div><div class="pkmn-party-list" id="pkmn-party-list"></div></div>'
      + '<div class="pkmn-panel-box">'
      + '<div class="pkmn-box-header">'
      + '<div class="pkmn-box-title-row">'
      + '<div class="pkmn-panel-label">PC BOX</div>'
      + '<div class="pkmn-box-badge-count" id="box-count-badge">0/30</div>'
      + '</div>'
      + '<div class="pkmn-box-filter-bar">'
      + '<div class="pkmn-box-search-box">'
      + '<input type="text" id="box-filter-search" class="pkmn-box-search-input" placeholder="Buscar Pokémon ou #ID..." autocomplete="off">'
      + '<button id="box-filter-clear" class="pkmn-box-clear-btn hidden" title="Limpar busca">&times;</button>'
      + '</div>'
      + '<div class="pkmn-box-selects-row">'
      + '<select id="box-filter-type" class="pkmn-box-select" title="Filtrar por Tipo">'
      + '<option value="all">Tipos: Todos</option>'
      + '<option value="normal">Normal</option>'
      + '<option value="fire">Fogo (Fire)</option>'
      + '<option value="water">Água (Water)</option>'
      + '<option value="grass">Planta (Grass)</option>'
      + '<option value="electric">Elétrico (Electric)</option>'
      + '<option value="ice">Gelo (Ice)</option>'
      + '<option value="fighting">Lutador (Fighting)</option>'
      + '<option value="poison">Veneno (Poison)</option>'
      + '<option value="ground">Terrestre (Ground)</option>'
      + '<option value="flying">Voador (Flying)</option>'
      + '<option value="psychic">Psíquico (Psychic)</option>'
      + '<option value="bug">Inseto (Bug)</option>'
      + '<option value="rock">Pedra (Rock)</option>'
      + '<option value="ghost">Fantasma (Ghost)</option>'
      + '<option value="dragon">Dragão (Dragon)</option>'
      + '<option value="steel">Aço (Steel)</option>'
      + '<option value="dark">Sombrio (Dark)</option>'
      + '<option value="fairy">Fada (Fairy)</option>'
      + '</select>'
      + '<select id="box-sort-by" class="pkmn-box-select" title="Ordenar por">'
      + '<option value="slot">Ordem: Padrão</option>'
      + '<option value="level_desc">Nível: Maior &#8595;</option>'
      + '<option value="level_asc">Nível: Menor &#8593;</option>'
      + '<option value="iv_desc">IV: Maior &#8595;</option>'
      + '<option value="iv_asc">IV: Menor &#8593;</option>'
      + '<option value="name_asc">Nome: A &#8594; Z</option>'
      + '</select>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="pkmn-box-grid" id="pkmn-box-grid"></div>'
      + '</div>'
      + '<div class="pkmn-panel-details" id="pkmn-panel-details"><div class="pkmn-details-empty-msg"><div class="pkmn-empty-pokeball">&#9677;</div><p>Selecione um Pok&eacute;mon</p></div></div>'
      + '</div>'
      + '</div>';

    document.body.appendChild(modal);
    this.modal = modal;
    this.partyList = document.getElementById('pkmn-party-list');
    this.boxGrid = document.getElementById('pkmn-box-grid');
    this.detailsPanel = document.getElementById('pkmn-panel-details');
    this.boxNameText = document.getElementById('box-name-text');
  }

  bindEvents() {
    document.getElementById('pkmn-storage-close-btn')?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.close(); });

    document.getElementById('box-prev-btn')?.addEventListener('click', () => {
      if (this.currentBox > 1) { this.currentBox--; this._refreshAll(); }
    });
    document.getElementById('box-next-btn')?.addEventListener('click', () => {
      if (this.currentBox < 10) { this.currentBox++; this._refreshAll(); }
    });

    const searchInput = document.getElementById('box-filter-search');
    const clearBtn = document.getElementById('box-filter-clear');
    const typeSelect = document.getElementById('box-filter-type');
    const sortSelect = document.getElementById('box-sort-by');

    searchInput?.addEventListener('input', (e) => {
      this.boxFilterSearch = e.target.value;
      if (clearBtn) {
        if (this.boxFilterSearch.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
      this._renderBox();
    });

    clearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this.boxFilterSearch = '';
      clearBtn.classList.add('hidden');
      this._renderBox();
    });

    typeSelect?.addEventListener('change', (e) => {
      this.boxFilterType = e.target.value;
      this._renderBox();
    });

    sortSelect?.addEventListener('change', (e) => {
      this.boxSortBy = e.target.value;
      this._renderBox();
    });

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (document.body.classList.contains('editor-mode')) return;
      if (this.worldScene?.isChatting) return;
      if (e.key === 'p' || e.key === 'P') { e.preventDefault(); this.toggle(); return; }
      if (e.key === 'Escape' && this.isOpen) { e.preventDefault(); this.close(); }
    });
  }

  listenNetwork() {
    SocketClient.on('pokemon:data_response', (data) => {
      if (data.success) {
        this.party = data.party || [];
        this.storage = data.storage || [];
        this.activeBuddy = data.activeBuddy || null;
        if (this.isOpen) {
          this._refreshAll();
          if (this.selectedPokemon) {
            const updated = [...this.party, ...this.storage].find(p => p.id === this.selectedPokemon.id);
            if (updated) { this.selectedPokemon = updated; this._renderDetails(updated); }
          }
        }
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
    SocketClient.emit('pokemon:get_data');
    this._refreshAll();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.add('hidden');
    this._stopDetailsAnimation();
  }

  toggle() { if (this.isOpen) this.close(); else this.open(); }

  // ─── DETAILS SPRITE ANIMATION ─────────────────────────────────────────────
  // Uses overworld sprite (front frame) with smooth float + idle breathing

  _stopDetailsAnimation() {
    if (this._detailsRaf) { cancelAnimationFrame(this._detailsRaf); this._detailsRaf = null; }
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────

  _refreshAll() {
    if (this.boxNameText) this.boxNameText.innerText = 'CAIXA ' + this.currentBox;
    this._renderParty();
    this._renderBox();
  }

  _buildPartySlots() {
    const slots = new Array(6).fill(null), unplaced = [];
    this.party.forEach(p => {
      const s = p.partySlot;
      if (typeof s === 'number' && s >= 0 && s < 6 && !slots[s]) slots[s] = p; else unplaced.push(p);
    });
    unplaced.forEach(p => { const i = slots.findIndex(s => s === null); if (i !== -1) slots[i] = p; });
    return slots;
  }

  _buildBoxSlots() {
    const rawBoxPkmn = this.storage.filter(p => (p.boxNumber || 1) === this.currentBox);
    const hasFilter = (this.boxFilterSearch && this.boxFilterSearch.trim() !== '')
      || (this.boxFilterType && this.boxFilterType !== 'all')
      || (this.boxSortBy && this.boxSortBy !== 'slot');

    if (!hasFilter) {
      const slots = new Array(30).fill(null), unplaced = [];
      rawBoxPkmn.forEach(p => {
        const s = p.boxSlot;
        if (typeof s === 'number' && s >= 0 && s < 30 && !slots[s]) slots[s] = p; else unplaced.push(p);
      });
      unplaced.forEach(p => { const i = slots.findIndex(s => s === null); if (i !== -1) slots[i] = p; });
      return { slots, isFiltered: false, totalCount: rawBoxPkmn.length, matchCount: rawBoxPkmn.length };
    }

    let filtered = [...rawBoxPkmn];

    // 1. Textual search filter (name, nickname or pokedex id)
    if (this.boxFilterSearch && this.boxFilterSearch.trim() !== '') {
      const q = this.boxFilterSearch.trim().toLowerCase();
      filtered = filtered.filter(p => {
        const name = (p.nickname || p.species?.name || '').toLowerCase();
        const fmtId = String(p.speciesId || 0).padStart(3, '0');
        return name.includes(q) || fmtId.includes(q) || ('#' + fmtId).includes(q);
      });
    }

    // 2. Type category filter
    if (this.boxFilterType && this.boxFilterType !== 'all') {
      const t = this.boxFilterType.toLowerCase();
      filtered = filtered.filter(p => {
        const t1 = (p.species?.type1 || '').toLowerCase();
        const t2 = (p.species?.type2 || '').toLowerCase();
        return t1 === t || t2 === t;
      });
    }

    // 3. Sorting by Level, IV, Name
    if (this.boxSortBy === 'level_desc') {
      filtered.sort((a, b) => (b.level || 1) - (a.level || 1));
    } else if (this.boxSortBy === 'level_asc') {
      filtered.sort((a, b) => (a.level || 1) - (b.level || 1));
    } else if (this.boxSortBy === 'iv_desc') {
      filtered.sort((a, b) => this._calcTotalIv(b) - this._calcTotalIv(a));
    } else if (this.boxSortBy === 'iv_asc') {
      filtered.sort((a, b) => this._calcTotalIv(a) - this._calcTotalIv(b));
    } else if (this.boxSortBy === 'name_asc') {
      filtered.sort((a, b) => {
        const nameA = a.nickname || a.species?.name || '';
        const nameB = b.nickname || b.species?.name || '';
        return nameA.localeCompare(nameB);
      });
    }

    const slots = new Array(Math.max(30, filtered.length)).fill(null);
    filtered.forEach((p, idx) => { slots[idx] = p; });

    return { slots, isFiltered: true, totalCount: rawBoxPkmn.length, matchCount: filtered.length };
  }

  _clearDragOver() {
    this.modal?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    this.modal?.querySelectorAll('.is-dragging').forEach(el => el.classList.remove('is-dragging'));
  }

  _attachDragDrop(el, location, slotIndex, pokemon) {
    if (pokemon) {
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (e) => {
        this._dragSource = {
          pokemonId: pokemon.id,
          location,
          slot: slotIndex,
          box: this.currentBox
        };
        el.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', pokemon.id);
      });

      el.addEventListener('dragend', () => {
        el.classList.remove('is-dragging');
        this._clearDragOver();
        this._dragSource = null;
      });
    }

    el.addEventListener('dragover', (e) => {
      if (!this._dragSource) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    el.addEventListener('dragenter', (e) => {
      if (!this._dragSource) return;
      e.preventDefault();
      el.classList.add('drag-over');
    });

    el.addEventListener('dragleave', (e) => {
      if (!el.contains(e.relatedTarget)) {
        el.classList.remove('drag-over');
      }
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      if (!this._dragSource) return;

      const source = this._dragSource;
      const targetLoc = location;
      const targetSlot = slotIndex;
      const targetBox = this.currentBox;

      // Same slot
      if (source.location === targetLoc && source.slot === targetSlot && (targetLoc === 'party' || source.box === targetBox)) {
        return;
      }

      // Block sending last party pokemon to storage
      if (source.location === 'party' && targetLoc === 'storage') {
        if (this.party.length <= 1) {
          alert('Não pode enviar o único Pokémon da equipe!');
          return;
        }
      }

      // Block adding 7th pokemon to party if target is empty
      if (source.location === 'storage' && targetLoc === 'party' && !pokemon && this.party.length >= 6) {
        alert('Equipe cheia (máximo 6 Pokémon)!');
        return;
      }

      SocketClient.emit('pokemon:move_slot', {
        pokemonId: source.pokemonId,
        targetLocation: targetLoc,
        targetSlot,
        targetBox
      });
    });
  }

  _renderParty() {
    if (!this.partyList) return;
    this.partyList.innerHTML = '';
    const slots = this._buildPartySlots();

    slots.forEach((pkmn, i) => {
      const card = document.createElement('div');
      if (pkmn) {
        const isSelected = this.selectedPokemon?.id === pkmn.id;
        const isBuddy = pkmn.isBuddy || this.activeBuddy?.id === pkmn.id;
        const curHp = typeof pkmn.currentHp === 'number' ? pkmn.currentHp : (pkmn.maxHp || 20);
        const maxHp = pkmn.maxHp || 20;
        const hpPct = Math.min(100, Math.max(0, Math.round((curHp / maxHp) * 100)));
        const hpClass = hpPct <= 20 ? 'danger' : hpPct <= 50 ? 'warning' : 'healthy';
        const name = pkmn.nickname || pkmn.species?.name || 'Pokemon';
        const fmtId = String(pkmn.speciesId).padStart(3, '0');
        const type1 = pkmn.species?.type1 || 'Normal';
        const type2 = pkmn.species?.type2 || null;
        const buddyDot = isBuddy ? '<span class="pps-buddy-dot"></span>' : '';
        const shinyStar = pkmn.isShiny ? '<span class="pps-shiny-star">&#9733;</span>' : '';
        const genderHtml = pkmn.gender === 'F' ? '<span class="pps-gender female" title="Fêmea">&#9792;</span>'
          : pkmn.gender === 'M' ? '<span class="pps-gender male" title="Macho">&#9794;</span>'
            : '';
        const t2 = type2 ? '<span class="type-chip type-' + type2.toLowerCase() + '">' + type2 + '</span>' : '';
        const owSprite = '<div class="pkmn-ow-sprite pps-ow-sprite" style="background-image: url(\'' + getPokemonOverworldSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) }) + '\')"></div>';

        card.className = 'pkmn-party-slot' + (isSelected ? ' selected' : '') + (isBuddy ? ' is-buddy' : '') + (pkmn.isShiny ? ' is-shiny' : '') + (curHp <= 0 ? ' is-fainted' : '');
        card.innerHTML = '<div class="pps-icon-wrap">' + owSprite + buddyDot + shinyStar + genderHtml + '</div>'
          + '<div class="pps-info">'
          + '<div class="pps-name-row"><span class="pps-name">' + name + '</span><span class="pps-level">Lv.' + pkmn.level + '</span></div>'
          + '<div class="pps-types"><span class="type-chip type-' + type1.toLowerCase() + '">' + type1 + '</span>' + t2 + '</div>'
          + '<div class="pps-hp-track"><div class="pps-hp-label">HP</div><div class="pps-hp-bar-bg"><div class="pps-hp-bar-fill ' + hpClass + '" style="width:' + hpPct + '%"></div></div><div class="pps-hp-num">' + curHp + '/' + maxHp + '</div></div>'
          + '</div>';
        card.addEventListener('click', () => this._selectPokemon(pkmn));
      } else {
        card.className = 'pkmn-party-slot empty-slot';
        card.innerHTML = '<div class="pps-icon-wrap pps-empty-icon"><span class="pps-empty-num">&#9711;</span></div>'
          + '<div class="pps-info pps-empty-info"><span class="pps-empty-lbl">VAGO</span></div>';
      }
      this._attachDragDrop(card, 'party', i, pkmn);
      this.partyList.appendChild(card);
    });
  }

  _renderBox() {
    if (!this.boxGrid) return;
    this.boxGrid.innerHTML = '';
    const { slots, isFiltered, totalCount, matchCount } = this._buildBoxSlots();

    // Update count badge in header
    const badgeEl = document.getElementById('box-count-badge');
    if (badgeEl) {
      if (isFiltered) {
        badgeEl.textContent = `${matchCount}/${totalCount}`;
        badgeEl.title = `${matchCount} Pokémon encontrados de ${totalCount} nesta caixa`;
        badgeEl.classList.add('is-filtered');
      } else {
        badgeEl.textContent = `${totalCount}/30`;
        badgeEl.title = `${totalCount} de 30 slots ocupados`;
        badgeEl.classList.remove('is-filtered');
      }
    }

    // Empty search state
    if (isFiltered && matchCount === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'pkmn-box-empty-search';
      emptyDiv.innerHTML = '<span class="pbes-title">Nenhum Pok&eacute;mon encontrado</span>'
        + '<span class="pbes-desc">Tente outros termos ou remova os filtros</span>'
        + '<button id="pbes-clear-btn" class="pbes-clear-btn">Limpar Filtros</button>';
      this.boxGrid.appendChild(emptyDiv);
      emptyDiv.querySelector('#pbes-clear-btn')?.addEventListener('click', () => {
        this.boxFilterSearch = '';
        this.boxFilterType = 'all';
        this.boxSortBy = 'slot';
        const searchInput = document.getElementById('box-filter-search');
        const clearBtn = document.getElementById('box-filter-clear');
        const typeSelect = document.getElementById('box-filter-type');
        const sortSelect = document.getElementById('box-sort-by');
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        if (typeSelect) typeSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'slot';
        this._renderBox();
      });
      return;
    }

    const showIvTag = this.boxSortBy && this.boxSortBy.startsWith('iv_');

    slots.forEach((pkmn, i) => {
      const cell = document.createElement('div');
      if (pkmn) {
        const isSelected = this.selectedPokemon?.id === pkmn.id;
        const isBuddy = pkmn.isBuddy || this.activeBuddy?.id === pkmn.id;
        const name = pkmn.nickname || pkmn.species?.name || 'Pokemon';
        const fmtId = String(pkmn.speciesId).padStart(3, '0');
        const owSprite = '<div class="pkmn-ow-sprite pbc-ow-sprite" style="background-image: url(\'' + getPokemonOverworldSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) }) + '\')"></div>';

        const totalIv = this._calcTotalIv(pkmn);
        const ivPct = Math.round((totalIv / 186) * 100);
        const ivTagHtml = showIvTag ? '<span class="pbc-iv-tag" title="IV: ' + totalIv + '/186 (' + ivPct + '%)">IV ' + ivPct + '%</span>' : '';
        const genderHtml = pkmn.gender === 'F' ? '<span class="pbc-gender female" title="Fêmea">&#9792;</span>'
          : pkmn.gender === 'M' ? '<span class="pbc-gender male" title="Macho">&#9794;</span>'
            : '';

        cell.className = 'pkmn-box-cell' + (isSelected ? ' selected' : '') + (isBuddy ? ' is-buddy' : '') + (pkmn.isShiny ? ' is-shiny' : '');
        cell.title = name + ' Lv.' + pkmn.level + ' | IV: ' + totalIv + '/186 (' + ivPct + '%)';
        cell.innerHTML = '<span class="pbc-dex-num">#' + fmtId + '</span>'
          + owSprite
          + '<span class="pbc-name">' + name.substring(0, 8) + '</span>'
          + '<span class="pbc-level">Lv.' + pkmn.level + '</span>'
          + genderHtml
          + ivTagHtml
          + (pkmn.isShiny ? '<span class="pbc-shiny">&#9733;</span>' : '');
        cell.addEventListener('click', () => this._selectPokemon(pkmn));
      } else {
        cell.className = 'pkmn-box-cell empty-cell';
        cell.innerHTML = '<span class="pbc-num">' + (i + 1) + '</span>';
      }
      this._attachDragDrop(cell, 'storage', i, pkmn);
      this.boxGrid.appendChild(cell);
    });
  }

  _selectPokemon(pkmn) {
    this.selectedPokemon = pkmn;
    this._renderParty();
    this._renderBox();
    this._renderDetails(pkmn);
  }

  _buildExpArcHtml(pkmn) {
    const lvl = pkmn.level || 5;
    const baseLvlExp = Math.pow(lvl, 3);
    const nextLvlExp = Math.pow(lvl + 1, 3);
    const expRange = Math.max(1, nextLvlExp - baseLvlExp);
    const rawExp = typeof pkmn.exp === 'number' ? pkmn.exp : 0;
    const currentExp = rawExp >= baseLvlExp ? rawExp : baseLvlExp + rawExp;
    const gainedInLevel = Math.max(0, Math.min(expRange, currentExp - baseLvlExp));
    const expProgressPct = Math.max(0, Math.min(100, Math.round((gainedInLevel / expRange) * 100)));
    const neededForNext = Math.max(0, nextLvlExp - currentExp);
    const isMaxLevel = lvl >= 100;

    const arcRadius = 108;
    const arcCircumference = Math.PI * arcRadius; // ~339.29
    const offset = arcCircumference * (1 - (isMaxLevel ? 1 : expProgressPct / 100));

    // Bead tip coordinates along the 180° arc
    const theta = Math.PI - (Math.PI * (isMaxLevel ? 1 : expProgressPct / 100));
    const beadX = 140 + Math.cos(theta) * arcRadius;
    const beadY = 135 - Math.sin(theta) * arcRadius;

    return `
      <div class="det-exp-arc-container">
        <!-- SVG Arc background framing the Pokémon sprite -->
        <svg class="det-exp-arc-svg" viewBox="0 0 280 150">
          <defs>
            <linearGradient id="expArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00e5ff" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#a855f7" />
            </linearGradient>
            <filter id="expArcGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Track -->
          <path d="M 32 135 A 108 108 0 0 1 248 135" class="det-exp-arc-track" />
          <!-- Animated Fill -->
          <path d="M 32 135 A 108 108 0 0 1 248 135" class="det-exp-arc-fill"
                stroke="url(#expArcGradient)"
                stroke-dasharray="${arcCircumference.toFixed(2)}"
                stroke-dashoffset="${offset.toFixed(2)}"
                filter="url(#expArcGlow)" />
          <!-- Bead dot -->
          <circle cx="${beadX.toFixed(1)}" cy="${beadY.toFixed(1)}" r="5.5" class="det-exp-arc-bead" />
        </svg>
      </div>
    `;
  }

  _buildExpCardHtml(pkmn) {
    const lvl = pkmn.level || 5;
    const baseLvlExp = Math.pow(lvl, 3);
    const nextLvlExp = Math.pow(lvl + 1, 3);
    const expRange = Math.max(1, nextLvlExp - baseLvlExp);
    const rawExp = typeof pkmn.exp === 'number' ? pkmn.exp : (typeof pkmn.experience === 'number' ? pkmn.experience : 0);
    const currentExp = rawExp >= baseLvlExp ? rawExp : baseLvlExp + rawExp;
    const gainedInLevel = Math.max(0, Math.min(expRange, currentExp - baseLvlExp));
    const expProgressPct = Math.max(0, Math.min(100, Math.round((gainedInLevel / expRange) * 100)));
    const neededForNext = Math.max(0, nextLvlExp - currentExp);
    const isMaxLevel = lvl >= 100;

    return `
      <div class="det-exp-card" title="XP: ${currentExp} | Próximo Nível: ${nextLvlExp}">
        <div class="dpc-header">
          <div class="dpc-title-wrap">
            <span class="dpc-badge-exp">EXP</span>
            <span class="dpc-val-text">${isMaxLevel ? 'MÁXIMO' : `${gainedInLevel}/${expRange} (${expProgressPct}%)`}</span>
          </div>
          <span class="dpc-sub-text">${isMaxLevel ? 'Lv. 100' : `Faltam ${neededForNext} p/ Lv.${lvl + 1}`}</span>
        </div>
        <div class="dpc-track">
          <div class="dpc-fill dpc-fill-exp" style="width: ${isMaxLevel ? 100 : expProgressPct}%;"></div>
        </div>
      </div>
    `;
  }

  _buildFriendshipRowHtml(pkmn) {
    const val = typeof pkmn.friendship === 'number' ? pkmn.friendship : 70;
    const safeFriendship = Math.max(0, Math.min(255, val));
    const friendshipPct = Math.floor((safeFriendship / 255) * 100);

    let tierLabel = 'Neutro';
    let tierColor = '#38bdf8';
    let isReady = false;

    if (safeFriendship < 50) {
      tierLabel = 'Desconfiado';
      tierColor = '#94a3b8';
    } else if (safeFriendship < 100) {
      tierLabel = 'Neutro';
      tierColor = '#38bdf8';
    } else if (safeFriendship < 150) {
      tierLabel = 'Amigável';
      tierColor = '#4ade80';
    } else if (safeFriendship < 220) {
      tierLabel = 'Confiante';
      tierColor = '#facc15';
    } else {
      tierLabel = 'Vínculo Forte ✨';
      tierColor = '#f43f5e';
      isReady = true;
    }

    return `
      <div class="det-friendship-row ${isReady ? 'is-bonded' : ''}" title="Amizade: ${safeFriendship}/255 (${tierLabel})">
        <div class="dfr-left">
          <span class="dfr-heart ${isReady ? 'heart-pulse' : ''}" style="color:${tierColor};">&#10084;</span>
          <span class="dfr-tier" style="color:${tierColor};">${tierLabel}</span>
        </div>
        <div class="dfr-track">
          <div class="dfr-fill ${isReady ? 'fill-gold' : ''}" style="width: ${friendshipPct}%; background: ${tierColor};"></div>
        </div>
        <span class="dfr-val">${safeFriendship}<span class="dfr-max">/255</span></span>
      </div>
    `;
  }

  _buildRadarChartHtml(pkmn, statRows) {
    const cx = 130;
    const cy = 85;
    const maxRadius = 55;

    // Angles for the 6 stats clockwise: HP (top), Atk (top-right), Def (bottom-right), Speed (bottom), SpDef (bottom-left), SpAtk (top-left)
    const angles = [
      -Math.PI / 2,         // HP (Top)
      -Math.PI / 6,         // Atk (Top-Right)
      Math.PI / 6,          // Def (Bottom-Right)
      Math.PI / 2,          // Speed (Bottom)
      (5 * Math.PI) / 6,    // SpDef (Bottom-Left)
      (7 * Math.PI) / 6     // SpAtk (Top-Left)
    ];

    // Concentric reference webs (25%, 50%, 75%, 100%)
    const websHtml = [0.25, 0.5, 0.75, 1.0].map((frac) => {
      const pts = angles.map(a => `${(cx + Math.cos(a) * maxRadius * frac).toFixed(1)},${(cy + Math.sin(a) * maxRadius * frac).toFixed(1)}`).join(' ');
      const strokeCol = frac === 1.0 ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)';
      const fillCol = frac === 1.0 ? 'rgba(0, 229, 255, 0.04)' : 'none';
      return `<polygon points="${pts}" stroke="${strokeCol}" fill="${fillCol}" stroke-width="${frac === 1.0 ? 1.5 : 1}" />`;
    }).join('');

    // Axis lines radiating from center
    const axesHtml = angles.map(a => {
      const x2 = (cx + Math.cos(a) * maxRadius).toFixed(1);
      const y2 = (cy + Math.sin(a) * maxRadius).toFixed(1);
      return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 2" stroke-width="1.2" />`;
    }).join('');

    // Dynamic scale based on level potential
    const lvl = pkmn.level || 5;
    const scaleMax = Math.max(24, Math.round(lvl * 3.5 + 14));

    const orderedStats = [
      statRows.find(s => s.cls === 'hp') || statRows[0],
      statRows.find(s => s.cls === 'atk') || statRows[1],
      statRows.find(s => s.cls === 'def') || statRows[2],
      statRows.find(s => s.cls === 'spd') || statRows[5],
      statRows.find(s => s.cls === 'spdef') || statRows[4],
      statRows.find(s => s.cls === 'spatk') || statRows[3]
    ];

    const dataPoints = orderedStats.map((s, idx) => {
      const val = typeof s.cur === 'number' ? s.cur : parseInt(s.cur) || 10;
      const ratio = Math.max(0.18, Math.min(1.0, val / scaleMax));
      const px = cx + Math.cos(angles[idx]) * maxRadius * ratio;
      const py = cy + Math.sin(angles[idx]) * maxRadius * ratio;
      return { px, py, s, val };
    });

    const polyPointsStr = dataPoints.map(p => `${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ');

    // Vertex dots
    const dotsHtml = dataPoints.map((p) => {
      return `<circle cx="${p.px.toFixed(1)}" cy="${p.py.toFixed(1)}" r="3.5" fill="#ffffff" stroke="${p.s.color}" stroke-width="2.2" class="det-radar-dot" />`;
    }).join('');

    // Outer Axis Labels
    const labelConfigs = [
      { x: cx, y: cy - maxRadius - 8, anchor: 'middle', idx: 0 },
      { x: cx + maxRadius + 10, y: cy - maxRadius * 0.5, anchor: 'start', idx: 1 },
      { x: cx + maxRadius + 10, y: cy + maxRadius * 0.5 + 4, anchor: 'start', idx: 2 },
      { x: cx, y: cy + maxRadius + 16, anchor: 'middle', idx: 3 },
      { x: cx - maxRadius - 10, y: cy + maxRadius * 0.5 + 4, anchor: 'end', idx: 4 },
      { x: cx - maxRadius - 10, y: cy - maxRadius * 0.5, anchor: 'end', idx: 5 }
    ];

    const labelsHtml = labelConfigs.map(cfg => {
      const s = orderedStats[cfg.idx];
      const val = typeof s.cur === 'number' ? s.cur : s.cur;
      return `<text x="${cfg.x.toFixed(1)}" y="${cfg.y.toFixed(1)}" text-anchor="${cfg.anchor}" class="det-radar-label">`
        + `<tspan fill="${s.color}" font-weight="800">${s.lbl}</tspan> `
        + `<tspan fill="#e2e8f0" font-weight="700">${val}</tspan>`
        + `</text>`;
    }).join('');

    return `
      <div class="det-radar-wrapper">
        <svg class="det-radar-svg" viewBox="0 0 260 170">
          <defs>
            <radialGradient id="radarAreaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.65" />
              <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.25" />
            </radialGradient>
            <filter id="radarPolyGlow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          ${websHtml}
          ${axesHtml}
          <polygon points="${polyPointsStr}" fill="url(#radarAreaGrad)" stroke="#00e5ff" stroke-width="2.2" filter="url(#radarPolyGlow)" class="det-radar-polygon" />
          ${dotsHtml}
          ${labelsHtml}
        </svg>
      </div>
    `;
  }

  _buildMovesSpaciousHtml(moves) {
    const moveSlots = [0, 1, 2, 3].map(i => moves[i] || null);
    return moveSlots.map(m => {
      if (!m) {
        return `
          <div class="det-move-card det-move-card-empty">
            <span class="dmc-empty-dash">- - Espaço Vazio - -</span>
          </div>
        `;
      }

      let categoryBadge = '';
      const catLower = (m.category || '').toLowerCase();
      if (catLower === 'physical') {
        categoryBadge = '<span class="dmc-cat dmc-cat-physical" title="Categoria Físico: Dano baseado em Ataque vs Defesa">FÍSICO</span>';
      } else if (catLower === 'special') {
        categoryBadge = '<span class="dmc-cat dmc-cat-special" title="Categoria Especial: Dano baseado em Sp. Atk vs Sp. Def">ESPECIAL</span>';
      } else if (catLower === 'status') {
        categoryBadge = '<span class="dmc-cat dmc-cat-status" title="Categoria Efeito: Não causa dano direto, altera atributos ou induz condições">EFEITO</span>';
      }

      return `
        <div class="det-move-card" title="${m.description || m.name || ''}">
          <div class="dmc-top">
            <span class="dmc-name">${m.name || 'Desconhecido'}</span>
            <span class="dmc-pp">PP ${m.pp ?? 0}/${m.maxPp ?? 0}</span>
          </div>
          <div class="dmc-bottom">
            <div class="dmc-type-group">
              <span class="type-chip type-${(m.type || 'normal').toLowerCase()}">${(m.type || 'NORMAL').toUpperCase()}</span>
              ${categoryBadge}
            </div>
            <div class="dmc-stats">
              <span class="dmc-stat-item"><span class="dmc-stat-k">PWR</span> <span class="dmc-stat-v">${m.power ? m.power : '—'}</span></span>
              <span class="dmc-stat-item"><span class="dmc-stat-k">ACC</span> <span class="dmc-stat-v">${m.accuracy ? m.accuracy + '%' : '—'}</span></span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  _buildOriginHtml(pkmn) {
    const caughtDate = pkmn.caughtAt ? new Date(pkmn.caughtAt) : (pkmn.createdAt ? new Date(pkmn.createdAt) : new Date());
    const dateFormatted = caughtDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' às ' + caughtDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const locationName = pkmn.caughtLocation || 'Kanto';
    const originalTrainer = pkmn.originalTrainerName || 'Desconhecido';
    const caughtLevel = pkmn.caughtLevel || pkmn.level || 5;
    const rawBall = pkmn.caughtBall || 'poke-ball';
    const ballSlug = rawBall.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const BALL_NAMES = {
      'poke-ball': 'Poké Ball',
      'great-ball': 'Great Ball',
      'ultra-ball': 'Ultra Ball',
      'master-ball': 'Master Ball',
      'premier-ball': 'Premier Ball',
      'safari-ball': 'Safari Ball',
      'heal-ball': 'Heal Ball',
      'net-ball': 'Net Ball',
      'nest-ball': 'Nest Ball',
      'dive-ball': 'Dive Ball',
      'dusk-ball': 'Dusk Ball',
      'timer-ball': 'Timer Ball',
      'quick-ball': 'Quick Ball',
      'repeat-ball': 'Repeat Ball',
      'luxury-ball': 'Luxury Ball'
    };
    const ballDisplayName = BALL_NAMES[ballSlug] || ballSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const methodMap = {
      capture: {
        label: 'Captura Selvagem',
        color: '#10b981',
        svg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>'
      },
      starter: {
        label: 'Pokémon Inicial',
        color: '#38bdf8',
        svg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
      },
      egg: {
        label: 'Chocado de Ovo',
        color: '#f59e0b',
        svg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 7 5 13a7 7 0 0 0 14 0c0-6-3-11-7-11z"></path></svg>'
      },
      auction: {
        label: 'Leilão / Mercado',
        color: '#a855f7',
        svg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
      },
      trade: {
        label: 'Troca de Jogadores',
        color: '#f97316',
        svg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>'
      },
      gift: {
        label: 'Presente / Evento',
        color: '#06b6d4',
        svg: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line></svg>'
      }
    };
    const methodInfo = methodMap[pkmn.obtainedMethod] || methodMap.capture;

    const isCurrentPlayerOT = Boolean(pkmn.originalTrainerId && pkmn.characterId && Number(pkmn.originalTrainerId) === Number(pkmn.characterId));
    const isEventEligible = isCurrentPlayerOT && pkmn.obtainedMethod === 'capture';

    const statusIconSvg = isEventEligible
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    return `
      <div class="det-origin-wrapper">
        <!-- Card 1: Treinador & Origem -->
        <div class="det-origin-card">
          <div class="det-origin-card-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Treinador & Origem</span>
          </div>
          <div class="det-origin-field">
            <span class="det-origin-lbl">Treinador Original (OT)</span>
            <span class="det-origin-val det-ot-name">${originalTrainer}</span>
          </div>
          <div class="det-origin-field">
            <span class="det-origin-lbl">Método de Obtenção</span>
            <span class="det-origin-method-badge" style="border-color: ${methodInfo.color}; color: ${methodInfo.color}">
              ${methodInfo.svg}
              <span>${methodInfo.label}</span>
            </span>
          </div>
          <div class="det-origin-field">
            <span class="det-origin-lbl">Data de Obtenção</span>
            <span class="det-origin-val">${dateFormatted}</span>
          </div>
        </div>

        <!-- Card 2: Local & Captura -->
        <div class="det-origin-card">
          <div class="det-origin-card-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Local & Condições</span>
          </div>
          <div class="det-origin-field">
            <span class="det-origin-lbl">Local de Captura</span>
            <span class="det-origin-val font-accent">${locationName}</span>
          </div>
          <div class="det-origin-field">
            <span class="det-origin-lbl">Nível Inicial</span>
            <span class="det-origin-val">Nível ${caughtLevel}</span>
          </div>
          <div class="det-origin-field">
            <span class="det-origin-lbl">Pokébola Utilizada</span>
            <span class="det-origin-val ball-val">
              <img src="/assets/items/${ballSlug}.png" onerror="this.src='/assets/battle/icon_ball.png'" class="det-ball-icon" alt="" />
              <span>${ballDisplayName}</span>
            </span>
          </div>
        </div>

        <!-- Card 3: Elegibilidade para Eventos -->
        <div class="det-event-status-box ${isEventEligible ? 'valid' : 'warning'}">
          <div class="desb-header">
            <span class="desb-icon">${statusIconSvg}</span>
            <span class="desb-title">${isEventEligible ? 'Captura Própria (Elegível para Eventos)' : 'Não Elegível para Eventos de Captura'}</span>
          </div>
          <div class="desb-desc">
            ${isEventEligible
              ? 'Capturado pessoalmente em batalha selvagem. Válido em rankings e torneios de captura!'
              : (pkmn.obtainedMethod === 'auction' || pkmn.obtainedMethod === 'trade' || !isCurrentPlayerOT)
                ? 'Transferido ou comprado de terceiros. Não contabiliza para missões e eventos de captura própria.'
                : 'Obtido por método especial (' + methodInfo.label + '). Não contabilizado em eventos de captura selvagem.'
            }
          </div>
        </div>
      </div>
    `;
  }

  _renderDetails(pkmn) {
    if (!this.detailsPanel || !pkmn) return;
    this._stopDetailsAnimation();

    const fmtId = String(pkmn.speciesId).padStart(3, '0');
    let stats = {}, moves = [];
    try {
      stats = typeof pkmn.stats === 'string' ? JSON.parse(pkmn.stats || '{}') : (pkmn.stats || {});
      moves = typeof pkmn.moves === 'string' ? JSON.parse(pkmn.moves || '[]') : (pkmn.moves || []);
    } catch (e) { }

    const isBuddy = pkmn.isBuddy || this.activeBuddy?.id === pkmn.id;
    const name = pkmn.nickname || pkmn.species?.name || 'Pokemon';
    const type1 = pkmn.species?.type1 || 'Normal';
    const type2 = pkmn.species?.type2 || null;
    const gIcon = pkmn.gender === 'F' ? '<span class="det-gender female">&#9792;</span>'
      : pkmn.gender === 'M' ? '<span class="det-gender male">&#9794;</span>'
        : '<span class="det-gender">&#9711;</span>';

    const ivs = { hp: pkmn.ivHp ?? 15, atk: pkmn.ivAtk ?? 15, def: pkmn.ivDef ?? 15, spatk: pkmn.ivSpAtk ?? 15, spdef: pkmn.ivSpDef ?? 15, speed: pkmn.ivSpeed ?? 15 };
    const evs = { hp: pkmn.evHp ?? 0, atk: pkmn.evAtk ?? 0, def: pkmn.evDef ?? 0, spatk: pkmn.evSpAtk ?? 0, spdef: pkmn.evSpDef ?? 0, speed: pkmn.evSpeed ?? 0 };
    const totalIv = Object.values(ivs).reduce((a, b) => a + b, 0);
    const ivPct = Math.round((totalIv / 186) * 100);

    const curHp = typeof pkmn.currentHp === 'number' ? pkmn.currentHp : (pkmn.maxHp || 20);
    const statRows = [
      { lbl: 'HP', val: curHp + '/' + (pkmn.maxHp || 20), cur: curHp, max: 250, iv: ivs.hp, ev: evs.hp, cls: 'hp', color: '#00c896' },
      { lbl: 'Atk', val: stats.attack || 0, cur: stats.attack || 0, max: 200, iv: ivs.atk, ev: evs.atk, cls: 'atk', color: '#e74c3c' },
      { lbl: 'Def', val: stats.defense || 0, cur: stats.defense || 0, max: 200, iv: ivs.def, ev: evs.def, cls: 'def', color: '#3498db' },
      { lbl: 'SpAtk', val: stats.spAtk || 0, cur: stats.spAtk || 0, max: 200, iv: ivs.spatk, ev: evs.spatk, cls: 'spatk', color: '#9b59b6' },
      { lbl: 'SpDef', val: stats.spDef || 0, cur: stats.spDef || 0, max: 200, iv: ivs.spdef, ev: evs.spdef, cls: 'spdef', color: '#1abc9c' },
      { lbl: 'Speed', val: stats.speed || 0, cur: stats.speed || 0, max: 200, iv: ivs.speed, ev: evs.speed, cls: 'spd', color: '#e67e22' }
    ];

    const t2badge = type2 ? '<span class="type-badge type-' + type2.toLowerCase() + '">' + type2 + '</span>' : '';
    const statsHtml = statRows.map(s => {
      const pct = Math.max(8, Math.min(100, Math.round((s.cur / s.max) * 100)));
      const ivMaxCls = s.iv >= 31 ? ' iv-max' : '';
      return '<div class="det-stat-row">'
        + '<span class="det-stat-lbl">' + s.lbl + '</span>'
        + '<span class="det-stat-val">' + s.val + '</span>'
        + '<div class="det-stat-bar-bg"><div class="det-stat-bar det-stat-' + s.cls + '" style="width:' + pct + '%"></div></div>'
        + '<span class="det-iv-badge' + ivMaxCls + '">' + s.iv + '</span>'
        + '<span class="det-ev-badge">' + s.ev + '</span>'
        + '</div>';
    }).join('');

    const gifSrc = getPokemonAnimatedSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) });
    const fallbackSrc = getPokemonAnimatedSprite(fmtId, { isShiny: false });

    const expArcHtml = this._buildExpArcHtml(pkmn);
    const expCardHtml = this._buildExpCardHtml(pkmn);
    const friendshipRowHtml = this._buildFriendshipRowHtml(pkmn);
    const radarHtml = this._buildRadarChartHtml(pkmn, statRows);
    const movesSpaciousHtml = this._buildMovesSpaciousHtml(moves);
    const originHtml = this._buildOriginHtml(pkmn);

    this.detailsPanel.innerHTML = '<div class="det-card">'
      + '<div class="det-sprite-area">'
      + expArcHtml
      + '<div class="det-sprite-stage">'
      + '<img src="' + gifSrc + '" alt="' + name + '" class="det-sprite-gif" onload="if(this.nextElementSibling) this.nextElementSibling.style.width = Math.max(48, Math.min(105, Math.round(this.naturalWidth * 1.15))) + \'px\'" onerror="this.onerror=null; this.src=\'' + fallbackSrc + '\';">'
      + '<div class="det-sprite-shadow"></div>'
      + '</div>'
      + expCardHtml
      + (pkmn.isShiny ? '<div class="det-shiny-badge">&#9733; SHINY</div>' : '')
      + (isBuddy ? '<div class="det-buddy-badge">&#11088; BUDDY</div>' : '')
      + '</div>'
      + '<div class="det-identity">'
      + '<div class="det-identity-main">'
      + '<div class="det-id-info">'
      + '<div class="det-name-row"><h3 class="det-name">' + name + '</h3>' + gIcon + (pkmn.isShiny ? '<span class="det-shiny-star">&#9733;</span>' : '') + '</div>'
      + '<div class="det-meta"><span class="det-dex">#' + fmtId + '</span><span class="det-meta-dot">•</span><span class="det-level">N&iacute;vel ' + pkmn.level + '</span></div>'
      + '</div>'
      + '<div class="det-id-badges">'
      + '<div class="det-types"><span class="type-badge type-' + type1.toLowerCase() + '">' + type1 + '</span>' + t2badge + '</div>'
      + '</div>'
      + '</div>'
      + friendshipRowHtml
      + '</div>'
      + '<div class="det-tabs-nav">'
      + '<button class="det-tab-btn ' + (this.detailsActiveTab === 'stats' ? 'active' : '') + '" id="det-tab-btn-stats">'
      + '<span class="dtb-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon></svg></span><span>ATRIBUTOS</span>'
      + '</button>'
      + '<button class="det-tab-btn ' + (this.detailsActiveTab === 'moves' ? 'active' : '') + '" id="det-tab-btn-moves">'
      + '<span class="dtb-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span><span>ATAQUES</span><span class="dtb-badge">' + moves.length + '/4</span>'
      + '</button>'
      + '<button class="det-tab-btn ' + (this.detailsActiveTab === 'origin' ? 'active' : '') + '" id="det-tab-btn-origin">'
      + '<span class="dtb-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></span><span>ORIGEM</span>'
      + '</button>'
      + '</div>'
      + '<div class="det-tab-pane ' + (this.detailsActiveTab === 'stats' ? '' : 'hidden') + '" id="det-pane-stats">'
      + '<div class="det-pane-header">'
      + '<div class="det-view-toggle">'
      + '<button class="dvt-btn ' + (this.statViewMode === 'radar' ? 'active' : '') + '" id="dvt-radar" title="Gráfico Radar/Losango">⬡ RADAR</button>'
      + '<button class="dvt-btn ' + (this.statViewMode === 'bars' ? 'active' : '') + '" id="dvt-bars" title="Lista de Barras">☰ BARRAS</button>'
      + '</div>'
      + '<div class="det-iv-header-box" title="Valores Individuais (Potencial Genético)">'
      + '<span class="det-iv-tag">IVs</span>'
      + '<span class="det-iv-total ' + (ivPct >= 80 ? 'iv-gold' : '') + '">' + totalIv + '/186 (' + ivPct + '%)</span>'
      + '</div>'
      + '</div>'
      + '<div id="det-radar-container" class="' + (this.statViewMode === 'radar' ? '' : 'hidden') + '">'
      + radarHtml
      + '<div class="det-ivs-grid">'
      + '<div class="det-iv-item ' + (ivs.hp >= 31 ? 'is-max' : '') + '"><span class="div-lbl">HP</span><span class="div-val">' + ivs.hp + '</span></div>'
      + '<div class="det-iv-item ' + (ivs.atk >= 31 ? 'is-max' : '') + '"><span class="div-lbl">ATK</span><span class="div-val">' + ivs.atk + '</span></div>'
      + '<div class="det-iv-item ' + (ivs.def >= 31 ? 'is-max' : '') + '"><span class="div-lbl">DEF</span><span class="div-val">' + ivs.def + '</span></div>'
      + '<div class="det-iv-item ' + (ivs.spatk >= 31 ? 'is-max' : '') + '"><span class="div-lbl">SPA</span><span class="div-val">' + ivs.spatk + '</span></div>'
      + '<div class="det-iv-item ' + (ivs.spdef >= 31 ? 'is-max' : '') + '"><span class="div-lbl">SPD</span><span class="div-val">' + ivs.spdef + '</span></div>'
      + '<div class="det-iv-item ' + (ivs.speed >= 31 ? 'is-max' : '') + '"><span class="div-lbl">SPE</span><span class="div-val">' + ivs.speed + '</span></div>'
      + '</div>'
      + '</div>'
      + '<div id="det-bars-container" class="det-stats ' + (this.statViewMode === 'bars' ? '' : 'hidden') + '">'
      + statsHtml
      + '</div>'
      + '</div>'
      + '<div class="det-tab-pane ' + (this.detailsActiveTab === 'moves' ? '' : 'hidden') + '" id="det-pane-moves">'
      + '<div class="det-pane-header">'
      + '<span class="det-pane-title">GOLPES DO POK&Eacute;MON</span>'
      + '<span class="det-moves-count-text">' + moves.length + ' de 4 aprendidos</span>'
      + '</div>'
      + '<div class="det-moves-spacious">'
      + movesSpaciousHtml
      + '</div>'
      + '</div>'
      + '<div class="det-tab-pane ' + (this.detailsActiveTab === 'origin' ? '' : 'hidden') + '" id="det-pane-origin">'
      + originHtml
      + '</div>'
      + '<div class="det-actions">'
      + '<button id="det-btn-move" class="det-btn det-btn-move">' + (pkmn.location === 'storage' ? 'Para Equipe' : 'Enviar ao PC') + '</button>'
      + '<button id="det-btn-buddy" class="det-btn ' + (isBuddy ? 'det-btn-buddy-active' : 'det-btn-buddy') + '">' + (isBuddy ? 'Buddy Ativo' : 'Definir Buddy') + '</button>'
      + '</div>'
      + '</div>';

    // Tab buttons event listeners
    document.getElementById('det-tab-btn-stats')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.detailsActiveTab = 'stats';
      document.getElementById('det-tab-btn-stats')?.classList.add('active');
      document.getElementById('det-tab-btn-moves')?.classList.remove('active');
      document.getElementById('det-tab-btn-origin')?.classList.remove('active');
      document.getElementById('det-pane-stats')?.classList.remove('hidden');
      document.getElementById('det-pane-moves')?.classList.add('hidden');
      document.getElementById('det-pane-origin')?.classList.add('hidden');
    });

    document.getElementById('det-tab-btn-moves')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.detailsActiveTab = 'moves';
      document.getElementById('det-tab-btn-moves')?.classList.add('active');
      document.getElementById('det-tab-btn-stats')?.classList.remove('active');
      document.getElementById('det-tab-btn-origin')?.classList.remove('active');
      document.getElementById('det-pane-moves')?.classList.remove('hidden');
      document.getElementById('det-pane-stats')?.classList.add('hidden');
      document.getElementById('det-pane-origin')?.classList.add('hidden');
    });

    document.getElementById('det-tab-btn-origin')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.detailsActiveTab = 'origin';
      document.getElementById('det-tab-btn-origin')?.classList.add('active');
      document.getElementById('det-tab-btn-stats')?.classList.remove('active');
      document.getElementById('det-tab-btn-moves')?.classList.remove('active');
      document.getElementById('det-pane-origin')?.classList.remove('hidden');
      document.getElementById('det-pane-stats')?.classList.add('hidden');
      document.getElementById('det-pane-moves')?.classList.add('hidden');
    });

    // View toggle listeners (Radar vs Barras)
    document.getElementById('dvt-radar')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.statViewMode = 'radar';
      document.getElementById('dvt-radar')?.classList.add('active');
      document.getElementById('dvt-bars')?.classList.remove('active');
      document.getElementById('det-radar-container')?.classList.remove('hidden');
      document.getElementById('det-bars-container')?.classList.add('hidden');
    });

    document.getElementById('dvt-bars')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.statViewMode = 'bars';
      document.getElementById('dvt-bars')?.classList.add('active');
      document.getElementById('dvt-radar')?.classList.remove('active');
      document.getElementById('det-bars-container')?.classList.remove('hidden');
      document.getElementById('det-radar-container')?.classList.add('hidden');
    });

    document.getElementById('det-btn-buddy')?.addEventListener('click', () => {
      SocketClient.emit('pokemon:set_buddy', { pokemonId: pkmn.id });
    });

    document.getElementById('det-btn-move')?.addEventListener('click', () => {
      if (pkmn.location === 'storage') {
        if (this.party.length >= 6) { alert('Equipe cheia (6/6)!'); return; }
        SocketClient.emit('pokemon:move_slot', { pokemonId: pkmn.id, targetLocation: 'party', targetSlot: this.party.length });
      } else {
        if (this.party.length <= 1) { alert('Nao pode enviar o unico Pokemon da equipe!'); return; }
        SocketClient.emit('pokemon:move_slot', { pokemonId: pkmn.id, targetLocation: 'storage', targetBox: 1, targetSlot: this.storage.length });
      }
    });
  }
}
