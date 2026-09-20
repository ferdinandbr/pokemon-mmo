import SocketClient from '../network/SocketClient';

export default class ChatUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.currentChannel = 'room'; // 'room', 'global', 'whisper'

    this.chatContainer = document.querySelector('.chat-container');
    this.chatTabs = document.querySelectorAll('.chat-tab');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');
    this.chatHintBar = document.getElementById('chat-hint-bar');

    this.bindEvents();
    this.listenNetwork();
  }

  bindEvents() {
    this.chatTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.chatTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentChannel = tab.dataset.channel;
        this.updateHintBar();
        this.chatInput.focus();
      });
    });

    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Enter key handling for smooth gameplay
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (document.activeElement === this.chatInput) {
          if (!this.chatInput.value.trim()) {
            this.chatInput.blur();
            if (this.worldScene) this.worldScene.isChatting = false;
          }
        } else {
          // If modal is not open
          const menuModal = document.getElementById('menu-modal');
          if (menuModal && !menuModal.classList.contains('hidden')) return;

          // If in editor mode, don't open chat
          if (document.body.classList.contains('editor-mode')) return;

          // If dialogue box is open or was just closed, don't open chat
          if (this.worldScene?.dialogueBox?.isOpen || this.worldScene?.dialogueBox?.justClosed) return;

          // If player is close to a sign, let the sign interact trigger on Enter
          if (this.worldScene?.nearbySign) return;

          e.preventDefault();
          this.chatInput.focus();
          if (this.worldScene) this.worldScene.isChatting = true;
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === this.chatInput) {
          this.chatInput.blur();
          if (this.worldScene) this.worldScene.isChatting = false;
        }
      }
    });

    this.chatInput.addEventListener('focus', () => {
      if (this.worldScene) this.worldScene.isChatting = true;
    });

    this.chatInput.addEventListener('blur', () => {
      if (this.worldScene) this.worldScene.isChatting = false;
    });
  }

  updateHintBar() {
    if (this.currentChannel === 'room') {
      this.chatHintBar.innerText = 'Canal: [SALA] - Visível apenas para quem está neste mapa';
      this.chatInput.placeholder = 'Mensagem para a sala...';
    } else if (this.currentChannel === 'global') {
      this.chatHintBar.innerText = 'Canal: [GLOBAL] - Visível para todos os treinadores online';
      this.chatInput.placeholder = 'Mensagem global...';
    } else if (this.currentChannel === 'whisper') {
      this.chatHintBar.innerText = 'Canal: [SUSSURRO] - Envie /w <nome> <msg> para mensagem privada';
      this.chatInput.placeholder = '/w NomeDoTreinador Mensagem';
    }
  }

  sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    SocketClient.sendChat(text, this.currentChannel);
    this.chatInput.value = '';
    this.chatInput.blur();
    if (this.worldScene) this.worldScene.isChatting = false;
  }

  listenNetwork() {
    SocketClient.on('chat:message', (payload) => {
      this.addMessage(payload);
    });

    SocketClient.on('server:stats', (data) => {
      const onlineBadge = document.getElementById('hud-online-count');
      if (onlineBadge && typeof data.onlineCount === 'number') {
        onlineBadge.innerText = `${data.onlineCount} Online`;
      }
    });
  }

  addMessage({ channel, sender, target, text, timestamp }) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${channel}`;

    const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

    if (channel === 'room') {
      msgDiv.innerHTML = `<span style="color: #9aa5b8; font-size: 10px;">[${timeStr}]</span> <span class="sender">[Sala] ${sender}:</span> <span class="text">${escapeHtml(text)}</span>`;
    } else if (channel === 'global') {
      msgDiv.innerHTML = `<span style="color: #9aa5b8; font-size: 10px;">[${timeStr}]</span> <span class="sender">[Global] ${sender}:</span> <span class="text">${escapeHtml(text)}</span>`;
    } else if (channel === 'whisper') {
      msgDiv.innerHTML = `<span style="color: #9aa5b8; font-size: 10px;">[${timeStr}]</span> <span class="sender">[Sussurro de ${sender}]:</span> <span class="text">${escapeHtml(text)}</span>`;
    } else if (channel === 'system') {
      msgDiv.innerHTML = `<span class="sender">[Sistema]:</span> <span class="text">${escapeHtml(text)}</span>`;
    }

    this.chatMessages.appendChild(msgDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}
