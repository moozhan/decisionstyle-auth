const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const cors = require('cors');


const csrfProtection = csrf({ cookie: true });


router.use(cors({
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
const allowedOrigins = ['http://localhost:5500', 'https://decisionauthserver-92e41a504ad4.herokuapp.com', 'https://decisionserver-51961461dcec.herokuapp.com', 'http://localhost:3000', 'http://localhost:3001'];

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
  console.log('Incoming login request. Headers:', req.headers, 'Cookies:', req.cookies);

  const { username, password } = req.body;

  User.findOne({ username }).then(user => {
    if (!user) {
      res.render('/login.html', {errorMessage: 'Username not found'})
      return res.status(404).json({ usernamenotfound: 'Username not found' });
    } else {

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, username: user.username }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          { expiresIn: 31556926 }, // 1 year in seconds
          (err, token) => {
            res.cookie('AuthToken', token, { httpOnly: true, secure: true, sameSite: 'None' });
            const cookieOptions = {
              httpOnly: true,
              secure: true,
              sameSite: 'None', // Use 'None' for cross-site, 'Lax' or 'Strict' for same-site contexts
            };
            const csrfToken = generateCsrfToken(); // Implement this function based on your CSRF token generation logic
            res.cookie('XSRF-TOKEN', csrfToken, { ...cookieOptions, httpOnly: false });

            res.json({
              success: true,
              message: "Logged in successfully."
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: 'Password incorrect' });
      }
    });
  }
  });
});

router.get('/logout', (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Clear the authentication cookie
  res.cookie('AuthToken', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'Strict' });
  res.cookie('XSRF-TOKEN', '', { expires: new Date(0), secure: true, sameSite: 'Strict' });

  res.send({ message: 'Logged out successfully' });
});


// Utility function to generate CSRF token
// Implement according to your security requirements
function generateCsrfToken() {
  // Example: Return a random string or a hash; adjust as needed for your application's security requirements
  return require('crypto').randomBytes(64).toString('hex');
}
module.exports = router;
