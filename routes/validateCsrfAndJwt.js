if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
const jwt = require('jsonwebtoken');

const validateCsrfAndJwt = (req, res, next) => {
    const csrfTokenFromHeader = req.headers['x-csrf-token']; // Change this to 'x-csrf-token' if using that in client-side
    const csrfTokenFromCookie = req.cookies['XSRF-TOKEN'];
    const authToken = req.cookies['AuthToken'];

    if (!csrfTokenFromHeader || !csrfTokenFromCookie || csrfTokenFromHeader !== csrfTokenFromCookie) {
        return res.status(403).send({ message: "Invalid CSRF token." });
    }

    if (!authToken) {
        return res.status(401).send({ message: "No authentication token provided." });
    }

    jwt.verify(authToken, process.env.SECRET_KEY, (err, authData) => {
        if (err) {
            return res.status(403).send({ message: "Invalid authentication token." });
        }
        req.authData = authData; // Pass the decoded token to the request
        next(); // Proceed to the next middleware or route handler
    });
};


module.exports = validateCsrfAndJwt;
