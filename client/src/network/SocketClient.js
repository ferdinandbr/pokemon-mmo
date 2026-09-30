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

    // Dynamically forward any socket event to registered internal listeners
    this.socket.onAny((event, ...args) => {
      this.emitInternal(event, args[0]);
    });

    // Explicitly tracked game events
    const forwardEvents = [
      'player:init',
      'player:joined',
      'player:moved',
      'player:left',
      'player:buddy_updated',
      'pokemon:data_response',
      'pokemon:learn_move_prompt',
      'pokemon:move_learned',
      'pokemon:move_replaced',
      'equipment:updated',
      'room:changed',
      'chat:message',
      'server:stats',
      'error:msg',
      'world:weather',
      'world:time',
      'inventory:update',
      'inventory:used_result',
      'character:update',
      'character:progress_update',
      'money:updated',
      'player:intro_completed',
      'pokemon:evolution_eligible',
      'pokemon:evolve_success',
      'battle:started',
      'battle:start_failed',
      'battle:turn_result',
      'battle:action_error'
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

  useItem(slotIndex, itemId = null, pokemonId = null) {
    if (!this.socket) return;
    this.socket.emit('inventory:use', { slotIndex, itemId, pokemonId });
  }

  swapInventorySlots(fromSlot, toSlot) {
    if (!this.socket) return;
    this.socket.emit('inventory:swap', { fromSlot, toSlot });
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
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
