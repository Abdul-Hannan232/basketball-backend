const express = require('express');
const router = express.Router();
const CourtController = require('../controllers/CourtController');
const authenticateToken=require('../middlewares/AuthMiddleware')


router.post('/add', authenticateToken,CourtController.addCourt)
router.get('/all',CourtController.allCourt)
router.get('/:id', CourtController.getCourt);
router.put('/update', authenticateToken,CourtController.updateCourt)
router.delete('/:id', authenticateToken,CourtController.deleteCourt)
router.post('/search',authenticateToken, CourtController.searchCourt);

module.exports=router 