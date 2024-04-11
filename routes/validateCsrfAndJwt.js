const jwt = require('jsonwebtoken');

const validateCsrfAndJwt = (req, res, next) => {
    const csrfTokenFromCookie = req.cookies['XSRF-TOKEN'];
    const tokenFromHeader = req.headers['x-csrf-token'];
    const authToken = req.cookies['AuthToken'];

    console.log('CSRF Token from Header:', tokenFromHeader);
    console.log('CSRF Token from Cookie:', csrfTokenFromCookie);

    if (!csrfTokenFromCookie || !tokenFromHeader || csrfTokenFromCookie !== tokenFromHeader) {
        return res.status(403).json({ message: "Invalid CSRF token." });
    }

    if (!authToken) {
        return res.status(401).json({ message: "No authentication token provided." });
    }

    jwt.verify(authToken, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid authentication token." });
        }

        req.user = user; // Attach the user payload to the request object
        next(); // Proceed to the protected route handler
    });
};

module.exports = validateCsrfAndJwt;
