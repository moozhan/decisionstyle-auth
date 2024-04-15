const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path');
const cors = require('cors');


// Mocked games data
const games = [
  { id: 1, name: 'Puzzle Quest', url: 'http://example.com/game1' },
  { id: 2, name: 'Space Invaders', url: 'http://example.com/game2' },
  // Add more games as needed
];

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5500', 'https://decisionauthserver-92e41a504ad4.herokuapp.com', 'https://decisionserver-51961461dcec.herokuapp.com', 'https://extinct-stole-duck.cyclic.app', 'https://sore-wasp-turtleneck.cyclic.app'];
router.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


router.get('/', (req, res) => {
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
