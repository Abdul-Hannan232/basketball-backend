const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');

const User = sequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    team: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    weight: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    jersey_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM,
      defaultValue: 'user',
      values: ['user', 'admin']
    }
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
