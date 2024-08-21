const jwt = require('jsonwebtoken');
const HttpStatus = require('../utils/ResponseStatus')
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
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Session expired. Please log in."
                });
            }

            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Session expired. Please log in."
                });
            }

            const token = parts[1];

            jwt.verify(token, process.env.SECRETKEY, (err, user) => {
                if (err) {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        success: false,
                        message: "Session expired. Please log in."
                    });
                }

                req.user = user;

                // Check if the user's role is one of the required roles
                if (req.user && roles.includes(req.user.role)) {
                    next(); // User is authenticated and has the required role
                } else {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        success: false,
                        message: "Access Denied: You do not have the correct role"
                    });
                }
            });
        } catch (error) {
             // Handle any other errors
        next(error);
        }
    };
};

module.exports = AuthAndCheckRole;
