const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Sequelize }= require('sequelize')
const HttpStatus = require("../utils/ResponseStatus");
const getAllUsers = async () => {
    return await User.findAll();
 };

 const addUser = async (userData) => {
    try {
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(userData.email)) {
            return { status: HttpStatus.BAD_REQUEST, message: "Invalid email format" };
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            return { status: HttpStatus.CONFLICT, message: "Email already exists" };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create the new user
        const newUser = await User.create({
            ...userData,
            password: hashedPassword,
        });

        return {
            status: HttpStatus.CREATED,
            message: "User created successfully",
            user: newUser,
        };
    } catch (error) {
        console.error("Error in addUser:", error.message);
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occurred while creating the user",
            error: error.message,
        };
    }
};

 
const getUserById = async (id) => {
    return await User.findByPk(id);
};

const searchUser = async (req) => {
    const { search, type } = req.body;
    const validSearchFields = ['name', 'email'];
    if (!validSearchFields.includes(type)) {
        throw new Error('Invalid search type');
    }

    // Construct the dynamic query based on the specified type
    const whereClause = {
        [type]: {
            [Sequelize.Op.like]: `%${search}%`,
        },
        role: {
            [Sequelize.Op.not]: 'admin',
        },
    };

    const users = await User.findAll({
        where: whereClause,
    });
 
    return users;
};

const updateUser = async (userData) => {
     const { name,position,team,weight,height,country,isactive,jersey_number,phone_number,remarks,id } = userData
    const [affectedRows] = await User.update({ name,position,team,weight,height,country,isactive,phone_number,jersey_number,remarks }, {
        where: { id: id },
    });

    if (affectedRows > 0) {
        const updatedUser = await User.findOne({
            where: { id: id },
        });

        return updatedUser;
    }
};

const deleteUser = async (id) => {
    return await User.destroy({
        where: { id: id }
    });
};
module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    updateUser,
    deleteUser,
    addUser
};