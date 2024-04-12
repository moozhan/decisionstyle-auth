const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path');

// Mocked games data
const games = [
  { id: 1, name: 'Puzzle Quest', url: 'http://example.com/game1' },
  { id: 2, name: 'Space Invaders', url: 'http://example.com/game2' },
  // Add more games as needed
];

// Middleware to verify the JWT token
// const verifyToken = (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];
//   if (typeof bearerHeader !== 'undefined') {
//     const bearerToken = bearerHeader.split(' ')[1];
//     req.token = bearerToken;
//     jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
//       if (err) {
//         res.sendStatus(403); // Forbidden if token is invalid
//       } else {
//         req.authData = authData; // Forward the authentication data
//         next();
//       }
//     });
//   } else {
//     res.sendStatus(403); // Forbidden if token is not provided
//   }
// };
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5500', 'https://decisionauthserver-92e41a504ad4.herokuapp.com', 'https://decisionserver-51961461dcec.herokuapp.com'];

router.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  res.sendFile(path.join(__dirname, '../public', 'games.html'));
})

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
