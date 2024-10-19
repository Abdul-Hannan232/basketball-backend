const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const authenticateToken = require('../middlewares/AuthMiddleware')


router.post('/add', authenticateToken, ReviewController.addReview, (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message }); // Send error message to frontend
    } 
    return next();
})


module.exports = router