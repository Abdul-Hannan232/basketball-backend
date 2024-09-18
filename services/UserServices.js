const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Sequelize }= require('sequelize')
const HttpStatus = require("../utils/ResponseStatus");
const { deleteFile } = require("../middlewares/multerConfig")
const BASE_URL = process.env.BASE_URL;

const getAllUsers = async () => {
    return await User.findAll({
      order: [['created_at', 'DESC']] // Order by created_at in descending order
    });
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
         return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occurred while creating the user",
            error: error.message,
        };
    }
};

const getUserById = async (id) => {
    // Fetch the user by ID
    const user = await User.findByPk(id);
  // Check if the user exists and has an image property
  if (user && user.image) {
    // Prepend the BASEURL to the user's image
    user.image = `${BASE_URL}upload${user.image}`;
}
    return user;
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
      const { name,position,team,weight,height,country,isactive,image,jersey_number,phone_number,address,first_name,last_name,joined_since,remarks,role,id } = userData
    const [affectedRows] = await User.update({ name,position,team,weight,height,country,isactive,image,phone_number,address,first_name,last_name,joined_since,jersey_number,remarks,role }, {
        where: { id: id },
    });

    if (affectedRows > 0) {
        const user = await User.findOne({
            where: { id: id },
        });

        if(user && user.image)
        {
            user.image = `${BASE_URL}upload${user.image}`;
        }

        return {
            status: HttpStatus.OK,
            message: "User updated successfully",
            user: user,
        };
     }
};

const deleteUser = async (id) => {
  // Check if the user exists before attempting to delete
  const userExists = await User.findOne({
    where: { id: id },
  });

  // If user exists, proceed to delete
  if (userExists) {
     await User.destroy({
      where: { id: id },
    });
    const resp=deleteFile(userExists.dataValues.image)
     return true; // Indicate successful deletion
  }

  return false; 
};

module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    updateUser,
    deleteUser,
    addUser
};