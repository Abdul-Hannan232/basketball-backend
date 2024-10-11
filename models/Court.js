// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const Court = sequelize.define(
//   "courts",
//   {
//     name: {
//       type: DataTypes.STRING,
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     location: {
//       type: DataTypes.STRING,
//     },
//     size: {
//       type: DataTypes.STRING,  // Changed ENUM to STRING
//     },
//     availability: {
//       type: DataTypes.STRING,
//     },
//     operating_hours: {
//       type: DataTypes.STRING,
//     },
//     cost: {
//       type: DataTypes.STRING, 
//     },
//     ratings: {
//       type: DataTypes.DECIMAL(10, 2),
//     },
//     type: {
//       type: DataTypes.STRING,
//       defaultValue: "indoor",
//     },
//     isactive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//     condition: {
//       type: DataTypes.STRING,
//     },
//     accessibility: {
//       type: DataTypes.STRING,
//     },
//     description: {
//       type: DataTypes.STRING,
//     },
//     phone_number: {
//       type: DataTypes.STRING,
//     },
//     facilities: {
//       type: DataTypes.TEXT, // Store as JSON string
//       allowNull: true,
//       defaultValue: null,
//       get() {
//         const rawValue = this.getDataValue("facilities");
//         return rawValue ? JSON.parse(rawValue) : [];
//       },
//       set(value) {
//         this.setDataValue("facilities", JSON.stringify(value));
//       },
//     },
//     images: {
//       type: DataTypes.TEXT, // Store as JSON string
//       allowNull: true,
//       defaultValue: null,
//       get() {
//         const rawValue = this.getDataValue("images");
//         return rawValue ? JSON.parse(rawValue) : [];
//       },
//       set(value) {
//         this.setDataValue("images", JSON.stringify(value));
//       },
//     },
//   },
//   {
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

// module.exports = Court;



const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Court = sequelize.define(
  "courts",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,  // Ensure name is provided
      validate: {
        notEmpty: true,  // Validate non-empty names
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    availability: {
      type: DataTypes.STRING,
    },
    operating_hours: {
      type: DataTypes.STRING,
    },
    cost: {
      type: DataTypes.STRING,
    },
    ratings: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,   // Ensure ratings are not below 0
        max: 5,   // Ensure ratings do not exceed 5
      },
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "indoor",
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    condition: {
      type: DataTypes.STRING,
    },
    accessibility: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    facilities: {
      type: DataTypes.TEXT, // Store as JSON string
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue("facilities");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("facilities", JSON.stringify(value));
      },
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
