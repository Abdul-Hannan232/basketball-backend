const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/User"); 
const Court = require("../models/Court"); 

const Reviews = sequelize.define(
  "reviews",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    courtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Court,
        key: "id",
      },
    },
    accessibilityRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
    conditionRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
    overallRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
  },
  {
    tableName: "reviews",
    timestamps: true, 
  }
);

// Relations

Reviews.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


Reviews.belongsTo(Court, {
  foreignKey: "courtId",
  as: "court",
});


User.hasMany(Reviews, {
  foreignKey: "userId",
  as: "reviews",
});


Court.hasMany(Reviews, {
  foreignKey: "courtId",
  as: "reviews",
});

module.exports = Reviews;
