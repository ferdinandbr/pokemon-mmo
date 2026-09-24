import SocketClient from '../network/SocketClient';
import { getPokemonAnimatedSprite, getPokemonOverworldSprite } from '../utils/pokemonAssets';

// Type color map for pokeball icon tint by type
const TYPE_ICONS = {
  fire:'&#128293;', water:'&#128167;', grass:'&#127807;', electric:'&#9889;',
  psychic:'&#10024;', dragon:'&#128992;', ice:'&#10052;', ghost:'&#128123;',
  dark:'&#128274;', steel:'&#9878;', fairy:'&#129498;', poison:'&#9763;',
  bug:'&#127795;', rock:'&#129704;', ground:'&#127758;', flying:'&#128038;',
  fighting:'&#128293;', normal:'&#9728;'
};

function typeIcon(type) {
  return TYPE_ICONS[(type||'').toLowerCase()] || '&#9670;';
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

    // Single animation RAF for details sprite
    this._detailsRaf = null;

    this.initDOM();
    this.bindEvents();
    this.listenNetwork();
  }

  initDOM() {
    let modal = document.getElementById('pkmn-storage-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'pkmn-storage-modal';
    modal.className = 'pkmn-storage-modal hidden';
    modal.innerHTML = '<div class="pkmn-main-container">'
      + '<div class="pkmn-main-header">'
      +   '<div class="pkmn-main-title"><span class="pkmn-header-pokeball">&#9679;</span>&nbsp;EQUIPE &amp; CAIXA POK&Eacute;MON</div>'
      +   '<div class="pkmn-box-nav" id="pkmn-box-nav"><button id="box-prev-btn" class="pkmn-box-nav-btn">&#9668;</button><span id="box-name-text">CAIXA 1</span><button id="box-next-btn" class="pkmn-box-nav-btn">&#9658;</button></div>'
      +   '<button id="pkmn-storage-close-btn" class="pkmn-close-btn">&#10005;</button>'
      + '</div>'
      + '<div class="pkmn-main-body">'
      +   '<div class="pkmn-panel-party" id="pkmn-panel-party"><div class="pkmn-panel-label">EQUIPE ATIVA</div><div class="pkmn-party-list" id="pkmn-party-list"></div></div>'
      +   '<div class="pkmn-panel-box"><div class="pkmn-panel-label">PC BOX</div><div class="pkmn-box-grid" id="pkmn-box-grid"></div></div>'
      +   '<div class="pkmn-panel-details" id="pkmn-panel-details"><div class="pkmn-details-empty-msg"><div class="pkmn-empty-pokeball">&#9677;</div><p>Selecione um Pok&eacute;mon</p></div></div>'
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
    const boxPkmn = this.storage.filter(p => (p.boxNumber || 1) === this.currentBox);
    const slots = new Array(30).fill(null), unplaced = [];
    boxPkmn.forEach(p => {
      const s = p.boxSlot;
      if (typeof s === 'number' && s >= 0 && s < 30 && !slots[s]) slots[s] = p; else unplaced.push(p);
    });
    unplaced.forEach(p => { const i = slots.findIndex(s => s === null); if (i !== -1) slots[i] = p; });
    return slots;
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
        const hpPct = Math.min(100, Math.max(0, Math.round(((pkmn.currentHp || pkmn.maxHp || 20) / (pkmn.maxHp || 20)) * 100)));
        const hpClass = hpPct <= 20 ? 'danger' : hpPct <= 50 ? 'warning' : 'healthy';
        const name = pkmn.nickname || pkmn.species?.name || 'Pokemon';
        const fmtId = String(pkmn.speciesId).padStart(3, '0');
        const type1 = pkmn.species?.type1 || 'Normal';
        const type2 = pkmn.species?.type2 || null;
        const buddyDot = isBuddy ? '<span class="pps-buddy-dot"></span>' : '';
        const shinyStar = pkmn.isShiny ? '<span class="pps-shiny-star">&#9733;</span>' : '';
        const t2 = type2 ? '<span class="type-chip type-' + type2.toLowerCase() + '">' + type2 + '</span>' : '';
        const owSprite = '<div class="pkmn-ow-sprite pps-ow-sprite" style="background-image: url(\'' + getPokemonOverworldSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) }) + '\')"></div>';

        card.className = 'pkmn-party-slot' + (isSelected ? ' selected' : '') + (isBuddy ? ' is-buddy' : '') + (pkmn.isShiny ? ' is-shiny' : '');
        card.innerHTML = '<div class="pps-icon-wrap">' + owSprite + buddyDot + shinyStar + '</div>'
          + '<div class="pps-info">'
          +   '<div class="pps-name-row"><span class="pps-name">' + name + '</span><span class="pps-level">Lv.' + pkmn.level + '</span></div>'
          +   '<div class="pps-types"><span class="type-chip type-' + type1.toLowerCase() + '">' + type1 + '</span>' + t2 + '</div>'
          +   '<div class="pps-hp-track"><div class="pps-hp-label">HP</div><div class="pps-hp-bar-bg"><div class="pps-hp-bar-fill ' + hpClass + '" style="width:' + hpPct + '%"></div></div><div class="pps-hp-num">' + (pkmn.currentHp || pkmn.maxHp) + '/' + pkmn.maxHp + '</div></div>'
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
    const slots = this._buildBoxSlots();

    slots.forEach((pkmn, i) => {
      const cell = document.createElement('div');
      if (pkmn) {
        const isSelected = this.selectedPokemon?.id === pkmn.id;
        const isBuddy = pkmn.isBuddy || this.activeBuddy?.id === pkmn.id;
        const name = pkmn.nickname || pkmn.species?.name || 'Pokemon';
        const fmtId = String(pkmn.speciesId).padStart(3, '0');
        const owSprite = '<div class="pkmn-ow-sprite pbc-ow-sprite" style="background-image: url(\'' + getPokemonOverworldSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) }) + '\')"></div>';

        cell.className = 'pkmn-box-cell' + (isSelected ? ' selected' : '') + (isBuddy ? ' is-buddy' : '') + (pkmn.isShiny ? ' is-shiny' : '');
        cell.title = name + ' Lv.' + pkmn.level;
        cell.innerHTML = '<span class="pbc-dex-num">#' + fmtId + '</span>'
          + owSprite
          + '<span class="pbc-name">' + name.substring(0, 8) + '</span>'
          + '<span class="pbc-level">Lv.' + pkmn.level + '</span>'
          + (pkmn.isShiny ? '<span class="pbc-shiny">&#9733;</span>' : '')
          + (isBuddy ? '<span class="pbc-buddy-dot"></span>' : '');
        cell.addEventListener('click', () => this._selectPokemon(pkmn));
      } else {
        cell.className = 'pkmn-box-cell empty-cell';
        cell.innerHTML = '<span class="pbc-num">' + (i+1) + '</span>';
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

  _renderDetails(pkmn) {
    if (!this.detailsPanel || !pkmn) return;
    this._stopDetailsAnimation();

    const fmtId = String(pkmn.speciesId).padStart(3, '0');
    let stats = {}, moves = [];
    try {
      stats = typeof pkmn.stats === 'string' ? JSON.parse(pkmn.stats || '{}') : (pkmn.stats || {});
      moves = typeof pkmn.moves === 'string' ? JSON.parse(pkmn.moves || '[]') : (pkmn.moves || []);
    } catch (e) {}

    const isBuddy = pkmn.isBuddy || this.activeBuddy?.id === pkmn.id;
    const name = pkmn.nickname || pkmn.species?.name || 'Pokemon';
    const type1 = pkmn.species?.type1 || 'Normal';
    const type2 = pkmn.species?.type2 || null;
    const gIcon = pkmn.gender === 'F' ? '<span class="det-gender female">&#9792;</span>'
                : pkmn.gender === 'M' ? '<span class="det-gender male">&#9794;</span>'
                : '<span class="det-gender">&#9711;</span>';

    const ivs = { hp:pkmn.ivHp??15, atk:pkmn.ivAtk??15, def:pkmn.ivDef??15, spatk:pkmn.ivSpAtk??15, spdef:pkmn.ivSpDef??15, speed:pkmn.ivSpeed??15 };
    const evs = { hp:pkmn.evHp??0, atk:pkmn.evAtk??0, def:pkmn.evDef??0, spatk:pkmn.evSpAtk??0, spdef:pkmn.evSpDef??0, speed:pkmn.evSpeed??0 };
    const totalIv = Object.values(ivs).reduce((a,b)=>a+b,0);
    const ivPct = Math.round((totalIv/186)*100);

    const statRows = [
      { lbl:'HP',    val:(pkmn.currentHp||pkmn.maxHp)+'/'+pkmn.maxHp, cur:pkmn.maxHp||20,       max:250, iv:ivs.hp,    ev:evs.hp,    cls:'hp'    },
      { lbl:'Atk',   val:stats.attack||0,                              cur:stats.attack||0,      max:200, iv:ivs.atk,   ev:evs.atk,   cls:'atk'   },
      { lbl:'Def',   val:stats.defense||0,                             cur:stats.defense||0,     max:200, iv:ivs.def,   ev:evs.def,   cls:'def'   },
      { lbl:'SpAtk', val:stats.spAtk||0,                              cur:stats.spAtk||0,       max:200, iv:ivs.spatk, ev:evs.spatk, cls:'spatk' },
      { lbl:'SpDef', val:stats.spDef||0,                              cur:stats.spDef||0,       max:200, iv:ivs.spdef, ev:evs.spdef, cls:'spdef' },
      { lbl:'Speed', val:stats.speed||0,                              cur:stats.speed||0,       max:200, iv:ivs.speed, ev:evs.speed, cls:'spd'   }
    ];

    const t2badge = type2 ? '<span class="type-badge type-' + type2.toLowerCase() + '">' + type2 + '</span>' : '';
    const statsHtml = statRows.map(s => {
      const pct = Math.max(8, Math.min(100, Math.round((s.cur/s.max)*100)));
      const ivMaxCls = s.iv >= 31 ? ' iv-max' : '';
      return '<div class="det-stat-row">'
        + '<span class="det-stat-lbl">' + s.lbl + '</span>'
        + '<span class="det-stat-val">' + s.val + '</span>'
        + '<div class="det-stat-bar-bg"><div class="det-stat-bar det-stat-' + s.cls + '" style="width:' + pct + '%"></div></div>'
        + '<span class="det-iv-badge' + ivMaxCls + '">' + s.iv + '</span>'
        + '<span class="det-ev-badge">' + s.ev + '</span>'
        + '</div>';
    }).join('');

    const movesHtml = moves.length > 0 ? moves.map(m =>
      '<div class="det-move">'
      + '<span class="det-move-name">' + (m.name || 'Desconhecido') + '</span>'
      + '<span class="type-chip type-' + (m.type||'normal').toLowerCase() + '">' + (m.type||'NORMAL') + '</span>'
      + '<span class="det-move-pp">PP ' + (m.pp||0) + '/' + (m.maxPp||0) + '</span>'
      + '</div>'
    ).join('') : '<div class="det-no-moves">Sem golpes</div>';

    const gifSrc = getPokemonAnimatedSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) });
    const fallbackSrc = getPokemonAnimatedSprite(fmtId, { isShiny: false });

    this.detailsPanel.innerHTML = '<div class="det-card">'
      + '<div class="det-sprite-area">'
      +   '<div class="det-sprite-stage">'
      +     '<img src="' + gifSrc + '" alt="' + name + '" class="det-sprite-gif" onload="if(this.nextElementSibling) this.nextElementSibling.style.width = Math.max(38, Math.min(88, Math.round(this.naturalWidth * 0.95))) + \'px\'" onerror="this.onerror=null; this.src=\'' + fallbackSrc + '\';">'
      +     '<div class="det-sprite-shadow"></div>'
      +   '</div>'
      +   (pkmn.isShiny ? '<div class="det-shiny-badge">&#9733; SHINY</div>' : '')
      +   (isBuddy ? '<div class="det-buddy-badge">&#11088; BUDDY</div>' : '')
      + '</div>'
      + '<div class="det-identity">'
      +   '<div class="det-name-row"><h3 class="det-name">' + name + '</h3>' + gIcon + (pkmn.isShiny ? '<span class="det-shiny-star">&#9733;</span>' : '') + '</div>'
      +   '<div class="det-meta"><span class="det-dex">#' + fmtId + '</span><span class="det-level">N&iacute;vel ' + pkmn.level + '</span></div>'
      +   '<div class="det-types"><span class="type-badge type-' + type1.toLowerCase() + '">' + type1 + '</span>' + t2badge + '</div>'
      + '</div>'
      + '<div class="det-section">'
      +   '<div class="det-section-title">ATRIBUTOS <span class="det-iv-total' + (ivPct>=80?' iv-gold':'') + '">IV ' + totalIv + '/186 (' + ivPct + '%)</span></div>'
      +   '<div class="det-stats">' + statsHtml + '</div>'
      + '</div>'
      + '<div class="det-section"><div class="det-section-title">GOLPES (' + moves.length + '/4)</div><div class="det-moves">' + movesHtml + '</div></div>'
      + '<div class="det-actions">'
      +   '<button id="det-btn-buddy" class="det-btn ' + (isBuddy ? 'det-btn-buddy-active' : 'det-btn-buddy') + '">' + (isBuddy ? '&#10003; Companheiro Ativo' : '&#11088; Definir Buddy') + '</button>'
      +   '<button id="det-btn-move" class="det-btn det-btn-move">' + (pkmn.location === 'storage' ? '&#128230; &#8594; Equipe' : '&#128230; Enviar ao PC') + '</button>'
      + '</div>'
      + '</div>';

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
