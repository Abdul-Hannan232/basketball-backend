const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Court = sequelize.define(
  "courts",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.ENUM('Half Court', 'Full Court',), // Replace with your actual size options
      allowNull: true,
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    operating_hours: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    ratings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      defaultValue: "indoor",
      values: ["indoor", "outdoor", "sheltered"],
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    accessibility: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    images: {
      type: DataTypes.TEXT, // Store as JSON string
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("images", JSON.stringify(value));
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Court;
