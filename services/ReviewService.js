const Reviews = require("../models/Reviews");
const User = require("../models/User");
const sequelize = require("../config/database");
const calculateAverageRating = require("../utils/calculateAverageRating");

const reviewService = {
  // add  new review
  async addReview(body) {
    try {
      const newReview = await Reviews.create(body);
      return newReview;
    } catch (error) {
      throw new Error(`Error adding review: ${error.message}`);
    }
  },

  async getReviewsByCourtId(courtId, page, limit) {
    const offset = (page - 1) * limit;
    try {
      const reviews = await Reviews.findAll({
        where: { courtId },
        include: [
          {model: User,
            as: 'user',
            attributes: ['name'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
  
      const avgRatings = await Reviews.findOne({
        where: { courtId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('accessibilityRating')), 'avgAccessibilityRating'],
          [sequelize.fn('AVG', sequelize.col('conditionRating')), 'avgConditionRating'],
          [sequelize.fn('AVG', sequelize.col('overallRating')), 'avgOverallRating'],
        ],
      });
  
      const totalAverageRating = calculateAverageRating(avgRatings?.dataValues || {});
  
      const totalReviewsCount = await Reviews.count({ where: { courtId } });
  
      return {
        reviews,
        avgOverallRating: totalAverageRating,
        totalPages: Math.ceil(totalReviewsCount / limit),
        totalReviewsCount,
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Could not fetch reviews');
    }
  }
  

};

module.exports = reviewService;
