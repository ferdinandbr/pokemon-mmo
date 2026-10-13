const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const result = await authService.register({ email, name, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const roomManager = require('../rooms/roomManager');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    // Disconnect active socket session for this user if present
    const io = req.app.get('io');
    if (io && result.user && result.user.id) {
      const sockets = Array.from(io.sockets.sockets.values());
      for (const s of sockets) {
        if (s.user && s.user.userId === result.user.id) {
          s.emit('session:replaced', { message: 'Sua conta foi acessada em outro dispositivo/navegador.' });
          const oldPlayer = roomManager.removePlayer(s.id);
          if (oldPlayer) {
            s.to(oldPlayer.roomId).emit('player:left', { socketId: s.id, characterId: oldPlayer.characterId });
          }
          s.disconnect(true);
        }
      }
    }

    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
