const jwt = require('jsonwebtoken');

const validateCsrfAndJwt = (req, res, next) => {
    const csrfTokenFromCookie = req.cookies['XSRF-TOKEN'];
    const csrfTokenFromHeader = req.headers['x-csrf-token'];
    const authToken = req.cookies['AuthToken'];

    // Debug logging
    console.log('CSRF Token from Header:', csrfTokenFromHeader);
    console.log('CSRF Token from Cookie:', csrfTokenFromCookie);
    console.log('Auth Token (JWT) from Cookie:', authToken);

    if (!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
        console.error('Invalid CSRF token. Header vs Cookie mismatch.');
        return res.status(403).json({ message: "Invalid CSRF token." });
    }

    if (!authToken) {
        console.error('No authentication token provided.');
        return res.status(401).json({ message: "No authentication token provided." });
    }

    jwt.verify(authToken, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Invalid authentication token.', err);
            return res.status(403).json({ message: "Invalid authentication token." });
        }

        console.log('JWT verification successful. User:', user);
        req.user = user; // Attach the user payload to the request object
        next(); // Proceed to the protected route handler
    });
};

module.exports = validateCsrfAndJwt;
