if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, './public')));
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// List of allowed origins
const allowedOrigins = ['http://localhost:5500', 'https://decisionauthserver-92e41a504ad4.herokuapp.com', 'https://decisionserver-51961461dcec.herokuapp.com', 'http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true); // Allow the request
      } else {
          callback(new Error('Not allowed by CORS')); // Reject the request
      }
  },
  credentials: true, // This is important for cookies, authorization headers with HTTPS
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/games', cors(corsOptions), gameRoutes);
app.use(cookieParser());
const csrfProtection = csrf({
  cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure to true in production
      sameSite: 'Strict'
  }
});

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
