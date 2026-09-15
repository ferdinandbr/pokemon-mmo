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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
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
