if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, './public')));

app.use(cookieParser());

function authenticate(req, res, next) {
  const token = req.cookies['AuthToken'];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:3001', 'https://decisionauthserver-92e41a504ad4.herokuapp.com', 'https://decisionserver-51961461dcec.herokuapp.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  credentials: true // Allow cookies to be sent with requests
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/games', gameRoutes);

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = process.env.DB_CONNECTION;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname+'/login.html'));
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname+'/register.html'));
})

app.get('/games', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname+'/games.html'));
})

app.use((err, req, res, next) => {
  if (err) {
    res.status(403).json({ message: err.message }); // Return CORS error message
  } else {
    next(); // Pass to the next middleware
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
