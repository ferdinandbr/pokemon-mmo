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

    // Enter & Escape key handling for smooth gameplay
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (document.activeElement === this.chatInput) {
          if (!this.chatInput.value.trim()) {
            this.chatInput.blur();
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
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === this.chatInput) {
          this.chatInput.blur();
        }
      }
    });

    // Isolate chat input completely from Phaser so WASD, arrows, spaces, etc. type freely
    this.chatInput.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        this.chatInput.blur();
      }
    });

    this.chatInput.addEventListener('keyup', (e) => {
      e.stopPropagation();
    });

    this.chatInput.addEventListener('keypress', (e) => {
      e.stopPropagation();
    });

    this.chatInput.addEventListener('focus', () => {
      if (this.worldScene) {
        this.worldScene.isChatting = true;
        if (this.worldScene.input?.keyboard) {
          this.worldScene.input.keyboard.enabled = false;
        }
      }
    });

    this.chatInput.addEventListener('blur', () => {
      if (this.worldScene) {
        this.worldScene.isChatting = false;
        if (this.worldScene.input?.keyboard) {
          this.worldScene.input.keyboard.enabled = true;
          this.worldScene.input.keyboard.clearCaptures();
        }
      }
    });
  }

  updateHintBar() {
    if (!this.chatHintBar || !this.chatInput) return;
    if (this.currentChannel === 'room') {
      this.chatHintBar.innerText = 'Canal: [LOCAL] - Visível apenas para quem está neste mapa';
      this.chatInput.placeholder = 'Mensagem para o mapa atual...';
    } else if (this.currentChannel === 'global') {
      this.chatHintBar.innerText = 'Canal: [GLOBAL] - Visível para todos os treinadores';
      this.chatInput.placeholder = 'Enter para falar no Global...';
    } else if (this.currentChannel === 'trade') {
      this.chatHintBar.innerText = 'Canal: [TRADE] - Negociações, compras e trocas';
      this.chatInput.placeholder = 'Mensagem de troca / comércio...';
    } else if (this.currentChannel === 'system') {
      this.chatHintBar.innerText = 'Canal: [SISTEMA] - Mensagens oficiais do servidor';
      this.chatInput.placeholder = 'Canal exclusivo para avisos do sistema...';
    } else if (this.currentChannel === 'whisper') {
      this.chatHintBar.innerText = 'Canal: [PRIVADO] - Envie /w <nome> <msg> para mensagem direta';
      this.chatInput.placeholder = '/w NomeDoTreinador Mensagem';
    }
  }

  sendMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    // Comandos de teste e controle do ciclo Dia/Noite
    if (text.startsWith('/')) {
      const lower = text.toLowerCase();
      if (lower === '/dia' || lower === '/day') {
        window.setDayNightPhase?.('day');
        this.addMessage({ sender: 'Sistema', text: '☀️ Horário alterado para Dia!', channel: 'room' });
        this.chatInput.value = '';
        this.chatInput.blur();
        if (this.worldScene) this.worldScene.isChatting = false;
        return;
      }
      if (lower === '/tarde' || lower === '/dusk' || lower === '/entardecer') {
        window.setDayNightPhase?.('dusk');
        this.addMessage({ sender: 'Sistema', text: '🌅 Horário alterado para Entardecer (Laranja)!', channel: 'room' });
        this.chatInput.value = '';
        this.chatInput.blur();
        if (this.worldScene) this.worldScene.isChatting = false;
        return;
      }
      if (lower === '/noite' || lower === '/night') {
        window.setDayNightPhase?.('night');
        this.addMessage({ sender: 'Sistema', text: '🌙 Horário alterado para Noite (Preto-Azul com iluminação 2D)!', channel: 'room' });
        this.chatInput.value = '';
        this.chatInput.blur();
        if (this.worldScene) this.worldScene.isChatting = false;
        return;
      }
      if (lower === '/amanhecer' || lower === '/dawn') {
        window.setDayNightPhase?.('dawn');
        this.addMessage({ sender: 'Sistema', text: '🌄 Horário alterado para Amanhecer!', channel: 'room' });
        this.chatInput.value = '';
        this.chatInput.blur();
        if (this.worldScene) this.worldScene.isChatting = false;
        return;
      }

      // ─── Comandos de Clima ────────────────────────────────────────────────
      const weatherMap = {
        '/chuva': { type: 'rain', label: '🌧️ Chuva com respingos' },
        '/rain': { type: 'rain', label: '🌧️ Chuva com respingos' },
        '/tempestade': { type: 'storm', label: '⛈️ Tempestade com raios e relâmpagos' },
        '/storm': { type: 'storm', label: '⛈️ Tempestade com raios e relâmpagos' },
        '/neve': { type: 'snow', label: '❄️ Neve com flocos caindo' },
        '/snow': { type: 'snow', label: '❄️ Neve com flocos caindo' },
        '/nevoa': { type: 'fog', label: '🌫️ Névoa suave animada' },
        '/fog': { type: 'fog', label: '🌫️ Névoa suave animada' },
        '/sol': { type: 'sunny', label: '☀️ Luz Solar Intensa' },
        '/sunny': { type: 'sunny', label: '☀️ Luz Solar Intensa' },
        '/areia': { type: 'sandstorm', label: '🌪️ Tempestade de Areia' },
        '/sandstorm': { type: 'sandstorm', label: '🌪️ Tempestade de Areia' },
        '/limpo': { type: 'clear', label: '🌤️ Céu Limpo' },
        '/clear': { type: 'clear', label: '🌤️ Céu Limpo' }
      };

      if (weatherMap[lower] || lower.startsWith('/clima ') || lower.startsWith('/weather ')) {
        const targetType = weatherMap[lower]?.type || lower.split(' ')[1];
        if (targetType && this.worldScene?.weatherManager) {
          this.worldScene.weatherManager.setWeather(targetType);
        }
        // Send command to server so worldService broadcasts to all players
        SocketClient.sendChat(text, this.currentChannel);
        this.chatInput.value = '';
        this.chatInput.blur();
        if (this.worldScene) this.worldScene.isChatting = false;
        return;
      }
    }

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

  addMessage({ channel = 'room', sender = 'Treinador', target = null, text = '', timestamp = Date.now() }) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${channel}`;
    msgDiv.dataset.channel = channel;

    const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
    const timeHtml = timeStr ? `<span class="chat-time">[${timeStr}]</span> ` : '';

    let cleanSender = sender || 'Treinador';
    let vipBadge = '';
    if (cleanSender.toUpperCase().startsWith('[VIP]')) {
      vipBadge = '<span class="chat-tag vip">[VIP]</span>';
      cleanSender = cleanSender.substring(5).trim();
    }

    let channelBadge = '';
    if (channel === 'trade') {
      channelBadge = '<span class="chat-tag trade">[TRADE]</span>';
    } else if (channel === 'system') {
      channelBadge = '<span class="chat-tag system">[SISTEMA]</span>';
    }

    if (channel === 'whisper') {
      msgDiv.innerHTML = `${timeHtml}<span class="chat-tag whisper">[PRIVADO]</span> <span class="sender whisper">${escapeHtml(cleanSender)}:</span> <span class="text">${escapeHtml(text)}</span>`;
    } else if (channel === 'system') {
      msgDiv.innerHTML = `${timeHtml}${channelBadge} <span class="text system">${escapeHtml(text)}</span>`;
    } else {
      msgDiv.innerHTML = `${timeHtml}${vipBadge}${channelBadge}<span class="sender ${channel}">${escapeHtml(cleanSender)}:</span> <span class="text">${escapeHtml(text)}</span>`;
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
