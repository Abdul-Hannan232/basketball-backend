const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/validate-token', authController.validateToken)
router.post('/social-media-login', authController.socialMediaLogin)

module.exports = router; 