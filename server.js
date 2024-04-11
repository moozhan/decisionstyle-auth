if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// List of allowed origins
const allowedOrigins = ['http://localhost:5500', 'https://decisionauthserver-92e41a504ad4.herokuapp.com/', 'https://decisionserver-51961461dcec.herokuapp.com/','http://localhost:3000', 'http://localhost:3001'];

// Dynamic CORS policy
const dynamicCors = (req, callback) => {
  const origin = req.header('Origin');
  // Check if the incoming origin is in the list of allowed origins
  if (allowedOrigins.includes(origin)) {
    callback(null, { origin: true, credentials: true }); // Allow the request
  } else {
    callback(new Error('Not allowed by CORS')); // Reject the request
  }
};



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
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/games', (req, res) => {
  res.render('games')
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
