import SocketClient from '../network/SocketClient';

export default class PlayerContextMenuUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.targetPlayer = null;
    this.element = null;
    this.isOpen = false;

    this.initDOM();
  }

  initDOM() {
    let el = document.getElementById('player-context-menu');
    if (el) el.remove();

    el = document.createElement('div');
    el.id = 'player-context-menu';
    el.className = 'player-context-menu hidden';
    el.innerHTML = `
      <div class="pcm-header">
        <span class="pcm-name" id="pcm-player-name">Treinador</span>
      </div>
      <div class="pcm-actions">
        <button class="pcm-btn pcm-challenge-btn" id="pcm-challenge-btn">
          <span class="pcm-icon">⚔️</span>
          <span>Desafiar para PvP</span>
        </button>
        <button class="pcm-btn pcm-close-btn" id="pcm-close-btn">
          <span class="pcm-icon">✕</span>
          <span>Fechar</span>
        </button>
      </div>
    `;

    // Modern glassmorphism styled context menu
    const styleId = 'player-context-menu-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .player-context-menu {
          position: fixed;
          z-index: 10000;
          min-width: 175px;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.2);
          border-radius: 10px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: 'Outfit', 'Roboto', sans-serif;
          pointer-events: auto;
          user-select: none;
          animation: pcmFadeIn 0.15s ease-out;
        }
        .player-context-menu.hidden {
          display: none !important;
        }
        @keyframes pcmFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .pcm-header {
          padding: 6px 10px 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .pcm-name {
          font-size: 13px;
          font-weight: 700;
          color: #38bdf8;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          letter-spacing: 0.5px;
        }
        .pcm-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pcm-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 7px 10px;
          border-radius: 6px;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .pcm-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          color: #ffffff;
          transform: translateX(2px);
        }
        .pcm-challenge-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
        }
        .pcm-icon {
          font-size: 14px;
        }
      `;
      document.head.appendChild(style);
    }

    const targetParent = document.getElementById('game-wrapper') || document.body;
    targetParent.appendChild(el);
    this.element = el;

    // Button event listeners
    const challengeBtn = el.querySelector('#pcm-challenge-btn');
    challengeBtn.onclick = () => {
      this.handleChallenge();
      this.close();
    };

    const closeBtn = el.querySelector('#pcm-close-btn');
    closeBtn.onclick = () => {
      this.close();
    };

    // Close when clicking anywhere outside
    window.addEventListener('pointerdown', (e) => {
      if (this.isOpen && !this.element.contains(e.target)) {
        this.close();
      }
    });
  }

  show(remotePlayer, screenX, screenY) {
    if (!remotePlayer) return;
    this.targetPlayer = remotePlayer;

    const nameEl = this.element.querySelector('#pcm-player-name');
    if (nameEl) nameEl.textContent = remotePlayer.name || 'Treinador';

    // Constrain position within window boundaries
    const menuWidth = 180;
    const menuHeight = 110;
    const posX = Math.min(window.innerWidth - menuWidth - 10, Math.max(10, screenX));
    const posY = Math.min(window.innerHeight - menuHeight - 10, Math.max(10, screenY));

    this.element.style.left = `${posX}px`;
    this.element.style.top = `${posY}px`;
    this.element.classList.remove('hidden');
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;
    this.element.classList.add('hidden');
    this.isOpen = false;
    this.targetPlayer = null;
  }

  handleChallenge() {
    if (!this.targetPlayer || !this.targetPlayer.socketId) return;

    // Check party requirement on local player first
    const party = this.worldScene?.partyHUDUI?.party || [];
    const aliveLocal = party.filter(p => (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0);

    if (party.length > 0 && aliveLocal.length === 0) {
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show('PVP', 'Você não tem nenhum Pokémon em condições de batalha na sua equipe!');
      }
      return;
    }

    console.log(`[PvP] Enviando desafio para ${this.targetPlayer.name} (${this.targetPlayer.socketId})`);
    SocketClient.emit('pvp:challenge', {
      targetSocketId: this.targetPlayer.socketId
    });

    if (this.worldScene?.dialogueBox) {
      this.worldScene.dialogueBox.show('PVP', `Desafio enviado para ${this.targetPlayer.name}! Aguardando resposta...`);
    }
  }
}
