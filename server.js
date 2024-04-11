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
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, './public')));

app.use(cookieParser());

const allowedOrigins = ['http://localhost:5500', 'http://localhost:3000', 'http://localhost:3001', 'https://decisionauthserver-92e41a504ad4.herokuapp.com', 'https://decisionserver-51961461dcec.herokuapp.com'];
router.use(cors({
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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Update with your allowed origins
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
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

app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname+'/games.html'));
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
