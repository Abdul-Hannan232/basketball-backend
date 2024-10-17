const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');

const User = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
     },
    first_name: {
      type: DataTypes.STRING,
    }, 
    last_name: {
      type: DataTypes.STRING,
    },
    joined_since: {
      type: DataTypes.DATE,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
    },
    team: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.STRING, 
    },
    height: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
    jersey_number: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    login_type: {
      type: DataTypes.STRING,
      defaultValue: 'simple'
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
