const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/User");
const Court = require("../models/Court");


const CheckIn = sequelize.define("CheckIn", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: "Users", key: "id" },
  },
  courtId: {
    type: DataTypes.INTEGER,
    references: { model: "Courts", key: "id" },
  },
  checkInTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Relations
User.hasMany(CheckIn);
Court.hasMany(CheckIn);
CheckIn.belongsTo(User);
CheckIn.belongsTo(Court);


module.exports = CheckIn;
