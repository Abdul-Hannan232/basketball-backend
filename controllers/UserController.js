// controllers/UserController.js
const userService = require('../services/UserServices');
const HttpStatus = require('../utils/ResponseStatus')


const getUsers = async(req, res,next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(HttpStatus.OK).json({ message: "Users fetch successfully", users });
    } catch (err) {
        next(err)
    }
};

const getUser = async(req, res,next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(HttpStatus.NOT_FOUND).send("User not found");
        }
    } catch (err) {
       next(err)
    }
};

const searchUser = async(req,res,next) => {
    try {
        const users = await userService.searchUser(req);
        res.json({ users });
    } catch (error) {
        console.log(error.message)
        next(error)
    }
 }
 const updateUser = async(req, res,next) => {
     try {
        const updatedUser = await userService.updateUser(req.body);
        res.json({ message: "User updated successfully", updatedUser });
    } catch (err) {
        next(err)
    }
};

const deleteUser = async(req, res,next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
       next(err)
    }
};


module.exports = {
    getUsers,
    getUser,
    searchUser,
    updateUser,
    deleteUser
};