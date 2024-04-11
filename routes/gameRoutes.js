const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mocked games data
const games = [
  { id: 1, name: 'Puzzle Quest', url: 'http://example.com/game1' },
  { id: 2, name: 'Space Invaders', url: 'http://example.com/game2' },
  // Add more games as needed
];

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(403); // Forbidden if token is invalid
      } else {
        req.authData = authData; // Forward the authentication data
        next();
      }
    });
  } else {
    res.sendStatus(403); // Forbidden if token is not provided
  }
};

// Route to list all available games
router.get('/list', verifyToken, (req, res) => {
  res.json(games);
});

// Example route to access a specific game by id
router.get('/:id', verifyToken, (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find(g => g.id === gameId);
  if (game) {
    res.json(game);
  } else {
    res.status(404).send('Game not found');
  }
});

module.exports = router;
