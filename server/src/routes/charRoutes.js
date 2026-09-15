const express = require('express');
const router = express.Router();
const characterService = require('../services/characterService');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const characters = await characterService.getUserCharacters(req.user.userId);
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, gender, sprite } = req.body;
    const character = await characterService.createCharacter({
      userId: req.user.userId,
      name,
      gender,
      sprite
    });
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const characterId = parseInt(req.params.id, 10);
    const character = await characterService.getCharacterDetails(characterId);
    if (!character || character.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    res.json(character);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
