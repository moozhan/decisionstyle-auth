if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }


const jwt = require('jsonwebtoken');

const validateCsrfAndJwt = (req, res, next) => {
    const csrfTokenFromHeader = req.headers['x-csrf-token'];
    const csrfTokenFromCookie = req.cookies['XSRF-TOKEN'];
    const authToken = req.cookies['AuthToken']; // JWT stored in HttpOnly cookie

    console.log('CSRF Token from Header:', csrfTokenFromHeader);
    console.log('CSRF Token from Cookie:', csrfTokenFromCookie);
    console.log('Auth Token:', authToken);

    if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
        return res.status(403).send({ message: "Invalid CSRF token." });
    }

    if (!authToken) {
        return res.status(401).send({ message: "No authentication token provided." });
    }

    jwt.verify(authToken, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send({ message: "Invalid authentication token." });
        }

        req.user = user; // Attach the user payload to the request object
        next(); // Proceed to the protected route handler
    });
};

module.exports = validateCsrfAndJwt;
