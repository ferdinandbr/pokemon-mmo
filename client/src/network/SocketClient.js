import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.callbacks = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/';

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('[Network] Conectado ao servidor:', this.socket.id);
      this.emitInternal('connect');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('[Network] Desconectado:', reason);
      this.emitInternal('disconnect', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Network Error]', err.message);
      this.emitInternal('error', err.message);
    });

    // Game events
    const forwardEvents = [
      'player:init',
      'player:joined',
      'player:moved',
      'player:left',
      'room:changed',
      'chat:message',
      'server:stats',
      'error:msg',
      'world:weather',
      'world:time'
    ];

    for (const event of forwardEvents) {
      this.socket.on(event, (data) => {
        this.emitInternal(event, data);
      });
    }
  }

  joinGame(characterId) {
    if (!this.socket) return;
    this.socket.emit('player:join', { characterId });
  }

  sendMove(data) {
    if (!this.socket) return;
    this.socket.emit('player:move', data);
  }

  changeRoom(targetRoom, targetX, targetY) {
    if (!this.socket) return;
    this.socket.emit('player:change_room', { targetRoom, targetX, targetY });
  }

  sendChat(message, channel = 'room', target = null) {
    if (!this.socket) return;
    this.socket.emit('chat:send', { message, channel, target });
  }

  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.callbacks.has(event)) return;
    const filtered = this.callbacks.get(event).filter(cb => cb !== callback);
    this.callbacks.set(event, filtered);
  }

  emitInternal(event, data) {
    const list = this.callbacks.get(event);
    if (list) {
      list.forEach(cb => cb(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketClient();
