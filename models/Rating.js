const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "ratings",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    court_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accessibility: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    condition: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    others: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    overall: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: true, 
    createdAt: "created_at",
    updatedAt: "updated_at",
  } 
);

module.exports = User;
