const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PasswordResetToken = sequelize.define('password_reset_tokens', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // refers to table name
            key: 'id', // 'id' refers to column name in users table
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false // Assuming you don't need createdAt and updatedAt for tokens
});

module.exports = PasswordResetToken;
