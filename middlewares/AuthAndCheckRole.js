const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate the token and check if the user has one of the required roles.
 * 
 * @param {Array} roles - An array of strings representing the required roles.
 * @returns A middleware function.
 */
const AuthAndCheckRole = (roles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                // If the Authorization header is missing
                throw new Error('Authorization header is missing');
            }

            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                // If the Authorization header is not in the correct format
                throw new Error('Authorization header is not in Bearer token format');
            }

            const token = parts[1];

            jwt.verify(token, process.env.SECRETKEY, (err, user) => {
                if (err) {
                    // If token verification fails
                    throw new Error('Invalid or expired token');
                }

                req.user = user;

                // Check if the user's role is one of the required roles
                if (req.user && roles.includes(req.user.role)) {
                    next(); // User is authenticated and has the required role
                } else {
                    res.status(403).json({ message: 'Access Denied: You do not have the correct role' });
                }
            });
        } catch (error) {
            res.status(401).json({ message: error.message }); // Handle errors
        }
    };
};

module.exports = AuthAndCheckRole;
