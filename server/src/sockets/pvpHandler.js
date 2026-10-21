const roomManager = require('../rooms/roomManager');
const pvpManager = require('../services/battle/PvpManager');

function setupPvpHandlers(io, socket) {
  // 1. Send PvP Challenge
  socket.on('pvp:challenge', async (payload) => {
    try {
      const { targetSocketId } = payload || {};
      if (!targetSocketId) {
        return socket.emit('pvp:error', { message: 'Alvo não especificado.' });
      }

      await pvpManager.sendChallenge(io, socket, targetSocketId);
      socket.emit('pvp:challenge_sent', { targetSocketId });
    } catch (err) {
      console.warn('[PvP Socket Warning pvp:challenge]:', err.message);
      socket.emit('pvp:error', { message: err.message });
    }
  });

  // 2. Respond to Challenge (Accept / Decline)
  socket.on('pvp:challenge_response', async (payload) => {
    try {
      const { challengerSocketId, accepted } = payload || {};
      if (!challengerSocketId) return;

      await pvpManager.respondChallenge(io, socket, { challengerSocketId, accepted: Boolean(accepted) });
    } catch (err) {
      console.warn('[PvP Socket Warning pvp:challenge_response]:', err.message);
      socket.emit('pvp:error', { message: err.message });
    }
  });

  // 3. Cancel Challenge by challenger
  socket.on('pvp:challenge_cancel', () => {
    pvpManager.cancelChallenge(io, socket.id);
  });

  // 4. Relay Combat Action (Movement vector, dodge, attack, skill, shield, switch)
  socket.on('pvp:action_relay', (actionPayload) => {
    pvpManager.relayAction(io, socket, actionPayload);
  });

  // 5. Match Completed Report
  socket.on('pvp:match_completed', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      await pvpManager.endMatch(io, player.characterId, payload || {});
    } catch (err) {
      console.error('[PvP Socket Error pvp:match_completed]:', err);
    }
  });

  // 6. Handle Disconnect / Cleanups
  socket.on('disconnect', () => {
    pvpManager.handleDisconnect(io, socket.id);
  });
}

module.exports = setupPvpHandlers;
