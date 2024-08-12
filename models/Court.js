const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Court = sequelize.define(
  "courts",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    operating_hours: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    ratings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      defaultValue: "indoor",
      values: ["indoor", "outdoor"],
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    accessibility: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
