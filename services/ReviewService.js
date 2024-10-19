const Review = require("../models/Reviews");

const addReview = async (userId, courtId, comment, accessibilityRating, conditionRating, overallRating) => {
    try {
      const newReview = await Review.create({
        userId,
        courtId,
        comment,
        accessibilityRating,
        conditionRating,
        overallRating,
      });
  
      return newReview;
    } catch (error) {
      throw new Error(`Error adding review: ${error.message}`);
    }
  };
  module.exports={
    addReview
  }
  