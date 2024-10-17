const express = require('express');
const router = express.Router();
const CheckInController = require('../controllers/CheckInController');
const authenticateToken = require('../middlewares/AuthMiddleware')
const { upload } = require('../middlewares/multerConfig');



router.post('/add', authenticateToken, CheckInController.AddCheckIn, (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message }); // Send error message to frontend
    } 
    return next();
})
router.get('/status/:userId/:courtId', CheckInController.CheckInStatus);

module.exports = router 