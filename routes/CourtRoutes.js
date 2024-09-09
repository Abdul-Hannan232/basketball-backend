const express = require('express');
const router = express.Router();
const CourtController = require('../controllers/CourtController');
const authenticateToken = require('../middlewares/AuthMiddleware')
const { upload } = require('../middlewares/multerConfig');


router.post('/add', authenticateToken, upload.array('image', 5), CourtController.addCourt, (err, req, res, next) => {
 // `req.files` contains the files if validation passes
 if (req.files) {
    res.status(200).json({ message: "Files uploaded successfully!" });
} else {
    res.status(400).json({ message: "File upload failed." });
    next()
}
next()
}

)
router.get('/all', CourtController.allCourt)
router.get('/:id', CourtController.getCourt);
router.put('/update', authenticateToken, CourtController.updateCourt)
router.delete('/:id', authenticateToken, CourtController.deleteCourt)
router.post('/search', authenticateToken, CourtController.searchCourt);

module.exports = router 