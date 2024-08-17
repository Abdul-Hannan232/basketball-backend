const { response } = require("express");
const User = require("../models/User");
const { Sequelize }= require('sequelize')
const getAllUsers = async () => {
    return await User.findAll();
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
    const [affectedRows] = await User.update({ name,position,team,weight,height,country,isactive,jersey_number }, {
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
    deleteUser
};