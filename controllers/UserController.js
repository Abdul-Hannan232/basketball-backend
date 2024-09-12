// controllers/UserController.js
const userService = require('../services/UserServices');
const HttpStatus = require('../utils/ResponseStatus')
const { uploadImage, deleteFile } = require('../middlewares/multerConfig')

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(HttpStatus.OK).json({ message: "Users fetch successfully", users });
    } catch (err) {
        next(err)
    }
};

const addUser = async (req, resp, next) => {
    const imageFile = req.file;
    try {
        if (imageFile) {
            req.body.image = imageFile.filename
        }
        const user = await userService.addUser(req.body);
        if (user.status === 201 && imageFile) {
            uploadImage(req.body.image)
        }
        return resp.status(user.status).json({ message: user.message, data: user.user });
    } catch (error) {
        next(error); // Pass any errors to the error-handling middleware
    }
}

const getUser = async (req, res, next) => {
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

const searchUser = async (req, res, next) => {
    try {
        const users = await userService.searchUser(req);
        res.json({ users });
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    const { file: imageFile, body } = req;
    const { oldImage } = body;

    try {

        if (imageFile) {
            body.image = imageFile.filename;
            if (oldImage) {
                delete body.oldImage;
            }
        }

        const user = await userService.updateUser(body);

        // If the update is successful and a new image was uploaded, handle the file operations
        if (user.status === 200 && imageFile) {
            await uploadImage(body.image);

            if (oldImage) {
                deleteFile(oldImage);
            }
        }
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        console.error("Error updating user:", err.message);
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
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
    deleteUser,
    addUser
};