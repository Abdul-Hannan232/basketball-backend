const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateToken=require('../middlewares/AuthMiddleware')

router.get('/all',authenticateToken, UserController.getUsers)
router.get('/:id',authenticateToken, UserController.getUser);
router.post('/search',authenticateToken, UserController.searchUser);
router.put('/update',authenticateToken, UserController.updateUser);
router.delete('/:id',authenticateToken, UserController.deleteUser);



module.exports=router