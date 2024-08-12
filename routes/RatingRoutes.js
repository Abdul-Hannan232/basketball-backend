const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/RatingController');
const authenticateToken=require('../middlewares/AuthMiddleware')

router.post('/rate-court',RatingController.rateCourt)



module.exports=router