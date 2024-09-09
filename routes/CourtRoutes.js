const express = require('express');
const router = express.Router();
const CourtController = require('../controllers/CourtController');
const authenticateToken = require('../middlewares/AuthMiddleware')
const { upload } = require('../middlewares/multerConfig');


router.post('/add', authenticateToken, upload.array('image', 12), CourtController.addCourt, (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message }); // Send error message to frontend
    } 
    return next();
})
router.get('/all', CourtController.allCourt)
router.get('/:id', CourtController.getCourt);
router.put('/update', authenticateToken, CourtController.updateCourt)
router.delete('/:id', authenticateToken, CourtController.deleteCourt)
router.post('/search', authenticateToken, CourtController.searchCourt);

module.exports = router 