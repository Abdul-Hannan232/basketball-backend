const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middlewares/AuthMiddleware')
const AuthAndCheckRole = require('../middlewares/AuthAndCheckRole')
const { upload } = require('../middlewares/multerConfig');
// const {RouteHandler} = require('../utils/RouteHandler')

router.get('/all', authenticateToken, UserController.getUsers)
router.post('/add', AuthAndCheckRole(['admin']), upload.single('image'), UserController.addUser, (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message }); // Send error message to frontend
    } next();
}
)
// router.post('/add', AuthAndCheckRole(['admin']), upload.single('image'),RouteHandler(UserController.addUser) )
router.get('/:id', authenticateToken, UserController.getUser);
router.post('/search', authenticateToken, UserController.searchUser);
router.put('/update', authenticateToken,upload.single('image'), UserController.updateUser, (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ message: err.message }); // Send error message to frontend
    } next();
}
);
router.delete('/:id', AuthAndCheckRole(['admin']), UserController.deleteUser);



module.exports = router 