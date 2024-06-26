if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const cookieParser = require('cookie-parser'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cors = require('cors');
const bodyParser = require('body-parser');
router.use(cookieParser());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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


// Register User
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.status(400).json({ username: 'Username already exists' });
      } else {
        const newUser = new User({
          username,
          email,
          password
        });

        newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      }
    });
});

// Login User
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then(user => {
    if (!user) {
      return res.status(404).json({ usernamenotfound: 'Username not found' });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, username: user.username }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          { expiresIn: '1h' }, // Set token expiration to 1 hour
          (err, token) => {
            if (err) {
              console.error('Error signing token:', err);
              return res.status(500).json({ message: 'Failed to create authentication token' });
            }

            // Set cookies
            const csrfToken = generateCsrfToken(); // Implement this function based on your CSRF token generation logic
            res.cookie('AuthToken', token, { httpOnly: true, secure: true, sameSite: 'None', path:'/', domain: '.sore-wasp-turtleneck.cyclic.app'});
            res.cookie('XSRF-TOKEN', csrfToken, { secure: true, sameSite: 'None' });
            // Respond with success message and token
            res.json({
              success: true,
              message: "Logged in successfully.",
              token: token // Optionally, you can include the token in the response for client-side storage
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: 'Password incorrect' });
      }
    })
    .catch(error => {
      console.error('Error comparing passwords:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
  })
  .catch(error => {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  });
});

router.get('/logout', (req, res) => {
  // Clear the authentication cookie
  res.cookie('AuthToken', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'None' });
  res.cookie('XSRF-TOKEN', '', { expires: new Date(0), secure: true, sameSite: 'None' });

  res.send({ message: 'Logged out successfully' });
});



// Utility function to generate CSRF token
// Implement according to your security requirements
function generateCsrfToken() {
  // Example: Return a random string or a hash; adjust as needed for your application's security requirements
  return require('crypto').randomBytes(64).toString('hex');
}
module.exports = router;
