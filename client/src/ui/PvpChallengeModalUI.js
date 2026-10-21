import SocketClient from '../network/SocketClient';

export default class PvpChallengeModalUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.currentChallenge = null;
    this.timerInterval = null;
    this.remainingSeconds = 0;
    this.element = null;

    this.initDOM();
    this.listenNetwork();
  }

  initDOM() {
    let el = document.getElementById('pvp-challenge-modal');
    if (el) el.remove();

    el = document.createElement('div');
    el.id = 'pvp-challenge-modal';
    el.className = 'pvp-modal-overlay hidden';
    el.innerHTML = `
      <div class="pvp-modal-card">
        <div class="pvp-modal-badge">DESAFIO PVP</div>
        <div class="pvp-modal-icon">⚔️</div>
        <h3 class="pvp-modal-title" id="pvp-challenger-title">Novo Desafio!</h3>
        <p class="pvp-modal-desc" id="pvp-challenger-desc">Treinador quer batalhar com você!</p>
        <div class="pvp-modal-timer" id="pvp-modal-timer">Tempo restante: 25s</div>
        <div class="pvp-modal-actions">
          <button class="pvp-btn pvp-btn-accept" id="pvp-btn-accept">Aceitar Batalha</button>
          <button class="pvp-btn pvp-btn-decline" id="pvp-btn-decline">Recusar</button>
        </div>
      </div>
    `;

    const styleId = 'pvp-challenge-modal-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .pvp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(3, 7, 18, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          font-family: 'Outfit', 'Roboto', sans-serif;
          user-select: none;
          animation: pvpFadeIn 0.2s ease-out;
        }
        .pvp-modal-overlay.hidden {
          display: none !important;
        }
        @keyframes pvpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pvp-modal-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.98));
          border: 1px solid rgba(239, 68, 68, 0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(239, 68, 68, 0.25);
          border-radius: 16px;
          padding: 24px 28px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          position: relative;
        }
        .pvp-modal-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #ef4444, #f97316);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          padding: 3px 12px;
          border-radius: 9999px;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.5);
        }
        .pvp-modal-icon {
          font-size: 40px;
          margin-top: 8px;
          margin-bottom: 6px;
        }
        .pvp-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 6px;
        }
        .pvp-modal-desc {
          font-size: 14px;
          color: #94a3b8;
          margin: 0 0 16px;
          line-height: 1.4;
        }
        .pvp-modal-timer {
          font-size: 13px;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 20px;
        }
        .pvp-modal-actions {
          display: flex;
          gap: 12px;
        }
        .pvp-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .pvp-btn-accept {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        .pvp-btn-accept:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }
        .pvp-btn-decline {
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }
        .pvp-btn-decline:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
      `;
      document.head.appendChild(style);
    }

    const targetParent = document.getElementById('game-wrapper') || document.body;
    targetParent.appendChild(el);
    this.element = el;

    el.querySelector('#pvp-btn-accept').onclick = () => this.handleResponse(true);
    el.querySelector('#pvp-btn-decline').onclick = () => this.handleResponse(false);
  }

  listenNetwork() {
    SocketClient.on('pvp:challenge_received', (data) => {
      console.log('[PvP] Desafio recebido:', data);
      this.show(data);
    });

    SocketClient.on('pvp:challenge_expired', (data) => {
      this.close();
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show('PVP', `O desafio com ${data?.targetName || data?.challengerName || 'jogador'} expirou.`);
      }
    });

    SocketClient.on('pvp:challenge_cancelled', (data) => {
      this.close();
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show('PVP', data?.reason || `O desafio foi cancelado por ${data?.challengerName || 'desafiante'}.`);
      }
    });

    SocketClient.on('pvp:challenge_declined', (data) => {
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show('PVP', `${data?.targetName || 'O jogador'} recusou o desafio.`);
      }
    });

    SocketClient.on('pvp:error', (data) => {
      this.close();
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show('PVP', data?.message || 'Erro ao processar PvP.');
      }
    });
  }

  show(challengeData) {
    this.currentChallenge = challengeData;
    this.remainingSeconds = challengeData.timeoutSeconds || 25;

    const titleEl = this.element.querySelector('#pvp-challenger-title');
    const descEl = this.element.querySelector('#pvp-challenger-desc');
    const timerEl = this.element.querySelector('#pvp-modal-timer');

    if (titleEl) titleEl.textContent = `Desafio de ${challengeData.challengerName}!`;
    if (descEl) descEl.textContent = `${challengeData.challengerName} desafiou você para uma batalha Pokémon PvP em tempo real!`;
    if (timerEl) timerEl.textContent = `Tempo restante: ${this.remainingSeconds}s`;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      if (timerEl) timerEl.textContent = `Tempo restante: ${this.remainingSeconds}s`;
      if (this.remainingSeconds <= 0) {
        this.close();
      }
    }, 1000);

    this.element.classList.remove('hidden');
  }

  close() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.currentChallenge = null;
    this.element.classList.add('hidden');
  }

  handleResponse(accepted) {
    if (!this.currentChallenge) return;

    if (accepted) {
      const party = this.worldScene?.partyHUDUI?.party || [];
      const aliveLocal = party.filter(p => (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0);

      if (party.length > 0 && aliveLocal.length === 0) {
        if (this.worldScene?.dialogueBox) {
          this.worldScene.dialogueBox.show('PVP', 'Você não tem nenhum Pokémon em condições de batalha na sua equipe!');
        }
        this.close();
        return;
      }
    }

    SocketClient.emit('pvp:challenge_response', {
      challengerSocketId: this.currentChallenge.challengerSocketId,
      accepted
    });

    this.close();
  }
}
