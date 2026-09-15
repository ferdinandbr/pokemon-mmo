const roomManager = require('../rooms/roomManager');

function setupChatHandlers(io, socket) {
  socket.on('chat:send', (payload) => {
    const player = roomManager.getPlayer(socket.id);
    if (!player) return;

    let { message, channel = 'room', target = null } = payload;
    if (!message || typeof message !== 'string') return;

    message = message.trim();
    if (message.length === 0 || message.length > 200) return;

    // Check if message begins with /w or /whisper
    if (message.startsWith('/w ') || message.startsWith('/whisper ')) {
      const parts = message.split(' ');
      if (parts.length >= 3) {
        channel = 'whisper';
        target = parts[1];
        message = parts.slice(2).join(' ');
      } else {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: 'Uso correto do sussurro: /w <nome_do_jogador> <mensagem>',
          timestamp: new Date().toISOString()
        });
      }
    }

    const timestamp = new Date().toISOString();

    if (channel === 'whisper') {
      if (!target) {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: 'Destinatário do sussurro não especificado.',
          timestamp
        });
      }

      const targetPlayer = roomManager.getPlayerByCharacterName(target);
      if (!targetPlayer) {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: `O jogador "${target}" não está online.`,
          timestamp
        });
      }

      const whisperPayload = {
        channel: 'whisper',
        sender: player.name,
        target: targetPlayer.name,
        text: message,
        timestamp
      };

      // Send to target
      io.to(targetPlayer.socketId).emit('chat:message', whisperPayload);

      // Send back to sender for confirmation
      socket.emit('chat:message', whisperPayload);
      return;
    }

    if (channel === 'global') {
      // Global chat
      io.emit('chat:message', {
        channel: 'global',
        sender: player.name,
        text: message,
        timestamp
      });
      return;
    }

    // Default: Room chat
    io.to(player.roomId).emit('chat:message', {
      channel: 'room',
      sender: player.name,
      senderSocketId: socket.id,
      text: message,
      roomId: player.roomId,
      timestamp
    });
  });
}

module.exports = setupChatHandlers;
