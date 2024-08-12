const { response } = require("express");
const Rating = require("../models/Rating");
const { Sequelize } = require("sequelize");

const rateCourt = async (ratingData) => {
    // Create court rating record in database
    return await Rating.create({
      ...ratingData,
    });
   
  };

  module.exports={
    rateCourt
  }
  