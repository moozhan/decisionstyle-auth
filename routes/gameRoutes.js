const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mocked games data
const games = [
  { id: 1, name: 'Puzzle Quest', url: 'http://example.com/game1' },
  { id: 2, name: 'Space Invaders', url: 'http://example.com/game2' },
  // Add more games as needed
];

// Route to list all available games
router.get('/list', (req, res) => {
  res.json(games);
});

// Example route to access a specific game by id
router.get('/:id', (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find(g => g.id === gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).send('Game not found');
  }
});

module.exports = router;
