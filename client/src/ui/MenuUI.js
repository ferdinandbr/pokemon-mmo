export default class MenuUI {
  constructor(onChangeCharacter) {
    this.onChangeCharacter = onChangeCharacter;
    this.characterData = null;

    this.modal = document.getElementById('menu-modal');
    this.btnOpen = document.getElementById('hud-menu-btn');
    this.btnClose = document.getElementById('menu-close-btn');
    this.btnChangeChar = document.getElementById('btn-change-char');

    this.btnPokemon = document.getElementById('menu-btn-pokemon');
    this.btnPokedex = document.getElementById('menu-btn-pokedex');
    this.btnBag = document.getElementById('menu-btn-bag');
    this.btnCard = document.getElementById('menu-btn-card');
    this.detailsPanel = document.getElementById('menu-details-panel');

    this.bindEvents();
  }

  setData(characterData) {
    this.characterData = characterData;
  }

  bindEvents() {
    this.btnOpen.addEventListener('click', () => this.show());
    this.btnClose.addEventListener('click', () => this.hide());
    this.btnChangeChar.addEventListener('click', () => {
      this.hide();
      this.onChangeCharacter();
    });

    this.btnPokemon.addEventListener('click', () => this.renderPokemonView());
    this.btnPokedex.addEventListener('click', () => this.renderPokedexView());
    this.btnBag.addEventListener('click', () => this.renderBagView());
    this.btnCard.addEventListener('click', () => this.renderCardView());

    // Direct HUD Action Bar buttons
    document.getElementById('hud-btn-pokemon')?.addEventListener('click', () => {
      this.show();
      this.renderPokemonView();
    });
    document.getElementById('hud-btn-bag')?.addEventListener('click', () => {
      this.show();
      this.renderBagView();
    });
    document.getElementById('hud-btn-quests')?.addEventListener('click', () => {
      this.show();
      this.renderPokedexView();
    });
    document.getElementById('hud-btn-battle')?.addEventListener('click', () => {
      this.show();
      this.renderCardView();
    });
    document.getElementById('hud-btn-chat')?.addEventListener('click', () => {
      const input = document.getElementById('chat-input');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth' });
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const hud = document.getElementById('hud');
        if (hud && !hud.classList.contains('hidden')) {
          if (!this.modal.classList.contains('hidden')) {
            this.hide();
          } else {
            this.show();
          }
        }
      }
    });
  }

  show() {
    this.modal.classList.remove('hidden');
    this.renderPokemonView(); // default view
  }

  hide() {
    this.modal.classList.add('hidden');
  }

  renderPokemonView() {
    const list = this.characterData?.pokemon || [];
    if (list.length === 0) {
      this.detailsPanel.innerHTML = '<p>Nenhum Pokémon no momento.</p>';
      return;
    }

    let html = '<h3 style="color: var(--fr-gold); margin-bottom: 8px;">Time Pokémon</h3><div style="display: flex; flex-direction: column; gap: 8px;">';
    for (const p of list) {
      const moves = typeof p.moves === 'string' ? JSON.parse(p.moves) : (p.moves || []);
      html += `
        <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${p.name}</strong> <span style="color: var(--fr-gold); font-size: 11px;">Lv. ${p.level}</span>
            <div style="font-size: 11px; color: var(--fr-text-muted); margin-top: 2px;">Golpes: ${moves.join(', ')}</div>
          </div>
          <div style="text-align: right; font-size: 12px;">
            <span style="color: #4caf50;">HP: ${p.currentHp}/${p.maxHp}</span>
          </div>
        </div>
      `;
    }
    html += '</div>';
    this.detailsPanel.innerHTML = html;
  }

  renderPokedexView() {
    const list = this.characterData?.pokedex || [];
    let html = '<h3 style="color: var(--fr-gold); margin-bottom: 8px;">Pokédex de Kanto</h3>';
    html += `<p style="font-size: 12px; color: var(--fr-text-muted); margin-bottom: 10px;">Pokémons Registrados: ${list.length}/151</p><div style="display: flex; flex-direction: column; gap: 6px;">`;

    for (const entry of list) {
      const numStr = String(entry.pokemonNumber).padStart(3, '0');
      const badgeColor = entry.status === 'caught' ? '#4caf50' : '#2196f3';
      const statusLabel = entry.status === 'caught' ? 'Capturado' : 'Visto';
      html += `
        <div style="background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between;">
          <span><strong>#${numStr}</strong> ${entry.pokemonName}</span>
          <span style="color: ${badgeColor}; font-size: 11px; font-weight: 700;">${statusLabel}</span>
        </div>
      `;
    }
    html += '</div>';
    this.detailsPanel.innerHTML = html;
  }

  renderBagView() {
    const list = this.characterData?.inventory || [];
    let html = '<h3 style="color: var(--fr-gold); margin-bottom: 8px;">Mochila do Treinador</h3>';
    html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">';

    for (const slot of list) {
      const item = slot.item;
      html += `
        <div style="background: rgba(255,255,255,0.06); padding: 8px 10px; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span>${item.name}</span>
            <span style="color: var(--fr-gold);">x${slot.quantity}</span>
          </div>
          <div style="font-size: 11px; color: var(--fr-text-muted); margin-top: 4px;">${item.description}</div>
        </div>
      `;
    }
    html += '</div>';
    this.detailsPanel.innerHTML = html;
  }

  renderCardView() {
    const char = this.characterData;
    const trainerId = String(char.id).padStart(5, '0');
    this.detailsPanel.innerHTML = `
      <h3 style="color: var(--fr-gold); margin-bottom: 8px;">Cartão de Treinador</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
        <div><strong>Nome:</strong> ${char.name}</div>
        <div><strong>ID Nº:</strong> ${trainerId}</div>
        <div><strong>Dinheiro:</strong> ₽ ${char.money.toLocaleString('pt-BR')}</div>
        <div><strong>Insígnias:</strong> 0 / 8</div>
        <div><strong>Região:</strong> Kanto</div>
        <div><strong>Local Atual:</strong> ${char.roomId}</div>
      </div>
    `;
  }
}
