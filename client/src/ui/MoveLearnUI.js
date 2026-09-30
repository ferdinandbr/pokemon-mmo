import SocketClient from '../network/SocketClient';

function isBattleOpen() {
  try {
    if (window._battleUI?.isOpen) return true;
    const el = document.getElementById('battle-ui-container');
    return Boolean(el && !el.classList.contains('hidden'));
  } catch (e) {
    return false;
  }
}

export default class MoveLearnUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.modal = null;
    this.isOpen = false;
    this.currentData = null; // { pokemonId, pokemonName, newMove, currentMoves }
    this.selectedSlot = null;
    this.pendingQueue = [];

    this.initDOM();
    this.bindEvents();
    this.listenNetwork();
  }

  initDOM() {
    let el = document.getElementById('pkmn-move-learn-modal');
    if (el) el.remove();

    el = document.createElement('div');
    el.id = 'pkmn-move-learn-modal';
    el.className = 'pkmn-move-learn-modal hidden';
    el.innerHTML = `
      <div class="pml-backdrop"></div>
      <div class="pml-window">
        <div class="pml-header">
          <span class="pml-pokeball-icon">●</span>
          <span class="pml-header-title" id="pml-title">APRENDER NOVO GOLPE</span>
        </div>

        <div class="pml-content">
          <div class="pml-banner" id="pml-banner">
            <span id="pml-pkmn-name">Pokémon</span> quer aprender um novo golpe!
          </div>

          <!-- Novo Golpe a ser aprendido -->
          <div class="pml-section-label">NOVO GOLPE</div>
          <div class="pml-new-move-card" id="pml-new-move-card">
            <!-- Injetado dinamicamente -->
          </div>

          <!-- Golpes Atuais (Escolher qual substituir) -->
          <div class="pml-section-label">SELECIONE UM GOLPE PARA ESQUECER (4/4)</div>
          <div class="pml-current-moves-list" id="pml-current-moves-list">
            <!-- 4 slots de golpes -->
          </div>

          <!-- Ações e Confirmação -->
          <div class="pml-confirmation-panel hidden" id="pml-confirm-panel">
            <div class="pml-confirm-text" id="pml-confirm-text">Esquecer este golpe?</div>
            <div class="pml-confirm-actions">
              <button class="pml-btn pml-btn-confirm" id="pml-btn-confirm-replace">✓ Confirmar Troca</button>
              <button class="pml-btn pml-btn-cancel-select" id="pml-btn-cancel-select">Voltar</button>
            </div>
          </div>

          <div class="pml-footer" id="pml-footer">
            <button class="pml-btn pml-btn-forfeit" id="pml-btn-forfeit">✕ Não Aprender (Desistir)</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(el);
    this.modal = el;

    this.titleEl = el.querySelector('#pml-title');
    this.pkmnNameEl = el.querySelector('#pml-pkmn-name');
    this.newMoveCardEl = el.querySelector('#pml-new-move-card');
    this.currentMovesListEl = el.querySelector('#pml-current-moves-list');
    this.confirmPanelEl = el.querySelector('#pml-confirm-panel');
    this.confirmTextEl = el.querySelector('#pml-confirm-text');
    this.footerEl = el.querySelector('#pml-footer');

    this.btnConfirmReplace = el.querySelector('#pml-btn-confirm-replace');
    this.btnCancelSelect = el.querySelector('#pml-btn-cancel-select');
    this.btnForfeit = el.querySelector('#pml-btn-forfeit');
  }

  bindEvents() {
    this.btnCancelSelect?.addEventListener('click', () => {
      this.selectedSlot = null;
      this._renderSelectionState();
    });

    this.btnConfirmReplace?.addEventListener('click', () => {
      if (this.selectedSlot === null || !this.currentData) return;

      const { pokemonId, newMove } = this.currentData;
      SocketClient.emit('pokemon:replace_move', {
        pokemonId,
        slotIndexToReplace: this.selectedSlot,
        newMoveId: newMove.id || newMove.moveId
      });

      this.close();
    });

    this.btnForfeit?.addEventListener('click', () => {
      if (!this.currentData) return;

      const { pokemonId, newMove, pokemonName } = this.currentData;
      const sure = confirm(`Deseja realmente desistir de ensinar ${newMove.name} para ${pokemonName}?`);
      if (sure) {
        SocketClient.emit('pokemon:cancel_learn_move', {
          pokemonId,
          newMoveId: newMove.id || newMove.moveId
        });
        this.close();
      }
    });
  }

  listenNetwork() {
    // 1. Quando o servidor solicita escolha do jogador (Pokémon tem 4 golpes)
    // Overworld-only: prompts vindos de batalha aguardam a saída da cena.
    SocketClient.on('pokemon:move_learn_prompt', (payload) => {
      if (!payload || !payload.newMove) return;
      if (isBattleOpen()) {
        this.pendingQueue.push(payload);
        return;
      }
      this.open(payload);
    });

    // 2. Quando um golpe é aprendido automaticamente (< 4 golpes)
    SocketClient.on('pokemon:move_learned_auto', ({ pokemonId, moves }) => {
      if (!moves || moves.length === 0) return;
      const names = moves.map(m => m.name).join(', ');
      this._showOverworldDialogue('APRENDEU GOLPE!', `Seu Pokémon aprendeu ${names}!`);
    });

    // 3. Quando a substituição foi concluída com sucesso
    SocketClient.on('pokemon:move_replaced', ({ message, oldMove, newMove }) => {
      const text = message || `1, 2, e... Puf! Esqueceu ${oldMove?.name || 'um golpe'} e aprendeu ${newMove.name}!`;
      this._showOverworldDialogue('GOLPE SUBSTITUÍDO', text);
    });

    // 4. Quando o jogador desiste de aprender
    SocketClient.on('pokemon:move_learn_cancelled', ({ message }) => {
      this._showOverworldDialogue('CANCELADO', message || 'O Pokémon não aprendeu o novo golpe.');
    });
  }

  /** DialogueBox only in overworld — defers while battling. */
  _showOverworldDialogue(title, text) {
    if (isBattleOpen()) {
      this.pendingQueue.push({ deferredDialogue: { title, text } });
      return;
    }
    if (this.worldScene?.dialogueBox) {
      this.worldScene.dialogueBox.show(title, text);
    }
  }

  open(data) {
    if (!data) return;
    // Safety: never over battle — queue instead
    if (isBattleOpen()) {
      this.pendingQueue.push(data);
      return;
    }
    this.currentData = data;
    this.selectedSlot = null;
    this.isOpen = true;
    this.modal.classList.remove('hidden');

    this._renderData();
  }

  /** Shows queued prompts after leaving battle (chained one by one). */
  flushQueue() {
    if (this.isOpen || isBattleOpen()) return;
    const next = this.pendingQueue.shift();
    if (!next) return;
    if (next.deferredDialogue) {
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show(next.deferredDialogue.title, next.deferredDialogue.text);
      }
      this.flushQueue();
      return;
    }
    this.open(next);
  }

  close() {
    this.isOpen = false;
    this.currentData = null;
    this.selectedSlot = null;
    this.modal.classList.add('hidden');
    this.flushQueue();
  }

  _renderData() {
    if (!this.currentData) return;

    const { pokemonName, newMove, currentMoves } = this.currentData;

    this.titleEl.textContent = `APRENDER NOVO GOLPE`;
    this.pkmnNameEl.textContent = pokemonName || 'Seu Pokémon';

    // Renderizar Novo Golpe
    const newType = (newMove.type || 'NORMAL').toLowerCase();
    const newCat = newMove.category || 'Physical';
    const newPower = newMove.power > 0 ? newMove.power : '—';
    const newAcc = newMove.accuracy > 0 ? `${newMove.accuracy}%` : '—';

    this.newMoveCardEl.innerHTML = `
      <div class="pml-move-main">
        <div class="pml-move-header">
          <span class="pml-move-name highlight-gold">${newMove.name}</span>
          <span class="type-chip type-${newType}">${newMove.type}</span>
          <span class="pml-category-chip cat-${newCat.toLowerCase()}">${newCat}</span>
        </div>
        <div class="pml-move-stats">
          <span>PODER: <strong>${newPower}</strong></span>
          <span>PRECISÃO: <strong>${newAcc}</strong></span>
          <span>PP: <strong>${newMove.pp}/${newMove.maxPp || newMove.pp}</strong></span>
        </div>
        <div class="pml-move-desc">${newMove.description || 'Nenhuma descrição disponível.'}</div>
      </div>
    `;

    // Renderizar os 4 Golpes Atuais
    this.currentMovesListEl.innerHTML = '';
    const moves = currentMoves || [];

    moves.forEach((move, index) => {
      const card = document.createElement('div');
      card.className = `pml-current-move-card slot-${index}`;
      card.dataset.slot = index;

      const type = (move.type || 'NORMAL').toLowerCase();
      const cat = move.category || 'Physical';
      const power = move.power > 0 ? move.power : '—';
      const acc = move.accuracy > 0 ? `${move.accuracy}%` : '—';

      card.innerHTML = `
        <div class="pml-slot-badge">Slot ${index + 1}</div>
        <div class="pml-move-main">
          <div class="pml-move-header">
            <span class="pml-move-name">${move.name}</span>
            <span class="type-chip type-${type}">${move.type}</span>
            <span class="pml-category-chip cat-${cat.toLowerCase()}">${cat}</span>
          </div>
          <div class="pml-move-stats">
            <span>PODER: <strong>${power}</strong></span>
            <span>PRECISÃO: <strong>${acc}</strong></span>
            <span>PP: <strong>${move.pp}/${move.maxPp || move.pp}</strong></span>
          </div>
        </div>
        <div class="pml-select-indicator">Substituir ➔</div>
      `;

      card.addEventListener('click', () => {
        this.selectedSlot = index;
        this._renderSelectionState();
      });

      this.currentMovesListEl.appendChild(card);
    });

    this._renderSelectionState();
  }

  _renderSelectionState() {
    const cards = this.currentMovesListEl.querySelectorAll('.pml-current-move-card');
    cards.forEach((c, idx) => {
      if (this.selectedSlot === idx) {
        c.classList.add('selected-to-replace');
      } else {
        c.classList.remove('selected-to-replace');
      }
    });

    if (this.selectedSlot !== null && this.currentData) {
      const oldMove = this.currentData.currentMoves[this.selectedSlot];
      const newMove = this.currentData.newMove;
      this.confirmTextEl.innerHTML = `Esquecer <strong>${oldMove.name}</strong> para aprender <strong>${newMove.name}</strong>?`;
      this.confirmPanelEl.classList.remove('hidden');
      this.footerEl.classList.add('hidden');
    } else {
      this.confirmPanelEl.classList.add('hidden');
      this.footerEl.classList.remove('hidden');
    }
  }
}
