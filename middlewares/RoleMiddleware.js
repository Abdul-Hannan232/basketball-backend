// roleMiddleware.js

/**
 * Middleware to check if the user has one of the required roles.
 * 
 * @param {Array} roles - An array of strings representing the required roles.
 * @returns A middleware function.
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        // Check if the request has a user object and if the user's role is one of the required roles
        if (req.user && roles.includes(req.user.role)) {
            next(); // User has the required role, proceed to the next middleware
        } else {
            throw new Error('Access Denied: You do not have the correct role');
        }
    }
};

module.exports = checkRole;