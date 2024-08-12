const User = require("./User");
const Court = require("./Court");
const Rating=require("./Rating")
const setupDatabaseRelations = () => {
  /////////////// Reltion with user and courts /////////////////////////////////////
  User.hasMany(Court, {
    foreignKey: "user_id", // Assuming user_id is the foreign key in the Courts table
    as: "court",
  });

  Court.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });


  Court.hasMany(Rating, {
    foreignKey: "court_id", // Assuming court_id is the foreign key in the Ratings table
    as: "rating",
  });

  Rating.belongsTo(Court, {
    foreignKey: "court_id",
    as: "court",
  });
 

  User.hasMany(Rating, {
    foreignKey: "user_id", // Assuming user_id is the foreign key in the Ratings table
    as: "rating",
  });

  Rating.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });
  
};

module.exports = setupDatabaseRelations;
