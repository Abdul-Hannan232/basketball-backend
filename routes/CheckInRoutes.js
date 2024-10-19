const express = require('express');
const router = express.Router();
const CheckInController = require('../controllers/CheckInController');
const authenticateToken = require('../middlewares/AuthMiddleware')



router.post('/add', authenticateToken, CheckInController.AddCheckIn, (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message }); // Send error message to frontend
    } 
    return next();
})
router.get('/status/:userId/:courtId', authenticateToken, CheckInController.CheckInStatus);
router.get('/checkins/:courtId', CheckInController.GetCheckInsByCourtId);
router.get('/all', CheckInController.AllCheckins)

module.exports = router 