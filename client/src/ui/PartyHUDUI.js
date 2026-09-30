/**
 * PartyHUDUI.js
 * Fixed Overworld Party HUD attached to the left edge of the screen, vertically centered.
 * Redesigned to match the exact aesthetic and styling of the Item Quick Hotbar.
 */

import SocketClient from '../network/SocketClient';
import { getPokemonOverworldSprite, formatSpeciesId } from '../utils/pokemonAssets';

export class PartyHUDUI {
  constructor(worldScene, pokemonStorageUI = null) {
    this.worldScene = worldScene;
    this.pokemonStorageUI = pokemonStorageUI;
    this.party = [];
    this.activeBuddy = null;
    this.container = null;
    this.slotsList = null;

    this.init();
    this.listenNetwork();
  }

  init() {
    const parent = document.getElementById('hud') || document.body;

    const existing = document.getElementById('overworld-party-hud');
    if (existing) existing.remove();

    const el = document.createElement('aside');
    el.id = 'overworld-party-hud';
    el.className = 'overworld-party-hud';
    el.setAttribute('aria-label', 'Equipe Pokémon Ativa');

    el.innerHTML = `
      <div class="oph-header-chip">PARTY</div>
      <div class="oph-slots-list" id="oph-slots-list"></div>
    `;

    parent.appendChild(el);
    this.container = el;
    this.slotsList = el.querySelector('#oph-slots-list');

    this.render();
  }

  listenNetwork() {
    SocketClient.on('pokemon:data_response', (data) => {
      if (data && data.success) {
        this.party = data.party || [];
        this.activeBuddy = data.activeBuddy || null;
        this.render();
      }
    });

    SocketClient.on('player:init', (data) => {
      if (data?.self?.activeBuddy) {
        this.activeBuddy = data.self.activeBuddy;
      }
      if (data?.pokemon && Array.isArray(data.pokemon)) {
        const partyList = data.pokemon.filter(p => p.location === 'party');
        if (partyList.length > 0) {
          this.party = partyList;
          this.render();
        }
      }
      SocketClient.emit('pokemon:get_data');
    });

    SocketClient.on('player:buddy_updated', (data) => {
      if (!data || !data.socketId || data.socketId === SocketClient.socket?.id) {
        this.activeBuddy = data?.buddy || null;
        this.render();
      }
    });

    if (this.pokemonStorageUI?.party?.length) {
      this.party = this.pokemonStorageUI.party;
      this.activeBuddy = this.pokemonStorageUI.activeBuddy;
      this.render();
    }
  }

  setParty(party, activeBuddy = null) {
    this.party = party || [];
    if (activeBuddy !== null) {
      this.activeBuddy = activeBuddy;
    }
    this.render();
  }

  render() {
    if (!this.slotsList) return;
    this.slotsList.innerHTML = '';

    // Always 6 slots (matching Item Quick Bar design)
    for (let i = 0; i < 6; i++) {
      const pkmn = this.party[i] || null;
      const slotEl = document.createElement('div');
      slotEl.dataset.slotIndex = i;

      if (pkmn) {
        slotEl.className = 'oph-slot has-pokemon';

        const speciesId = pkmn.speciesId || pkmn.species?.id || 1;
        const fmtId = formatSpeciesId(speciesId);
        const name = pkmn.nickname || pkmn.species?.name || pkmn.name || 'Pokémon';
        const level = pkmn.level || 1;
        const currentHp = typeof pkmn.currentHp === 'number' ? pkmn.currentHp : (pkmn.maxHp || 20);
        const maxHp = pkmn.maxHp || 20;
        const isFainted = currentHp <= 0;
        const hpPct = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));
        const hpClass = hpPct <= 20 ? 'danger' : hpPct <= 50 ? 'warning' : 'healthy';

        const isBuddy = Boolean(
          pkmn.isBuddy ||
          (this.activeBuddy && Number(this.activeBuddy.id) === Number(pkmn.id)) ||
          (this.worldScene?.localFollower?.buddyData && Number(this.worldScene.localFollower.buddyData.id) === Number(pkmn.id)) ||
          (this.pokemonStorageUI?.activeBuddy && Number(this.pokemonStorageUI.activeBuddy.id) === Number(pkmn.id))
        );

        if (isFainted) slotEl.classList.add('fainted');
        if (isBuddy) slotEl.classList.add('is-buddy');

        const owSpriteUrl = getPokemonOverworldSprite(fmtId, { isShiny: Boolean(pkmn.isShiny) });

        // Held item icon if any
        let itemHtml = '';
        const heldItem = pkmn.heldItem || pkmn.item || pkmn.heldItemName;
        if (heldItem) {
          const rawName = typeof heldItem === 'string' ? heldItem : (heldItem.name || heldItem.slug || '');
          if (rawName) {
            const itemSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            itemHtml = `<img src="/assets/items/${itemSlug}.png" class="oph-item-icon" alt="${rawName}" title="Segurando: ${rawName}" onerror="this.style.display='none'">`;
          }
        }

        slotEl.innerHTML = `
          <span class="oph-slot-key" title="Slot ${i + 1}">${i + 1}</span>
          ${itemHtml}
          <div class="oph-sprite-container">
            <div class="pkmn-ow-sprite oph-ow-sprite" style="background-image: url('${owSpriteUrl}')"></div>
          </div>
          <span class="oph-slot-level">Lv.${level}</span>
          <div class="oph-hp-track" title="HP: ${currentHp}/${maxHp} (${hpPct}%)">
            <div class="oph-hp-fill ${hpClass}" style="width: ${hpPct}%;"></div>
          </div>
        `;

        slotEl.title = `${name} (Lv. ${level}) - ${currentHp}/${maxHp} HP\n(Arraste um item da mochila aqui para usar)`;

        slotEl.ondragover = (e) => {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          slotEl.classList.add('oph-drag-over');
        };
        slotEl.ondragleave = () => {
          slotEl.classList.remove('oph-drag-over');
        };
        slotEl.ondrop = (e) => {
          e.preventDefault();
          slotEl.classList.remove('oph-drag-over');
          try {
            const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data && data.source === 'bag') {
              SocketClient.useItem(data.slotIndex, data.itemId, pkmn.id);
            }
          } catch (err) {}
        };

        slotEl.addEventListener('click', () => {
          if (this.pokemonStorageUI) {
            this.pokemonStorageUI.open();
            if (typeof this.pokemonStorageUI._selectPokemon === 'function') {
              this.pokemonStorageUI._selectPokemon(pkmn);
            }
          }
        });
      } else {
        slotEl.className = 'oph-slot empty';
        slotEl.innerHTML = `
          <span class="oph-slot-key">${i + 1}</span>
        `;
        slotEl.title = `Slot ${i + 1} vazio`;
      }

      this.slotsList.appendChild(slotEl);
    }
  }

  show() {
    this.container?.classList.remove('hidden');
  }

  hide() {
    this.container?.classList.add('hidden');
  }

  /**
   * Floating "▲ +N XP" effect beside party members that gained XP in battle.
   * @param {Map<number, number>} gains - pokemonId -> total XP gained
   */
  showXpGains(gains) {
    if (!gains || gains.size === 0 || !this.slotsList) return;
    this.show();
    const slots = this.slotsList.querySelectorAll('.oph-slot');
    slots.forEach((slotEl) => {
      const idx = Number(slotEl.dataset.slotIndex);
      const pkmn = this.party[idx];
      if (!pkmn) return;
      const amt = gains.get(Number(pkmn.id)) || 0;
      if (amt <= 0) return;
      slotEl.querySelector('.oph-xp-gain-float')?.remove();
      const badge = document.createElement('div');
      badge.className = 'oph-xp-gain-float';
      badge.innerHTML = `<span class="xp-arrow">▲</span><span class="xp-amt">+${amt} XP</span>`;
      slotEl.appendChild(badge);
      setTimeout(() => badge.remove(), 2700);
    });
  }
}
