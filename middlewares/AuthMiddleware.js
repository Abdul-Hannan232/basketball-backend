const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
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
            next();
        });
    } catch (error) {
        // Handle any other errors
        next(error);
    }
};

module.exports = authenticateToken;
