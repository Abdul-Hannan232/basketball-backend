const Reviews = require("../models/Reviews");
const User = require("../models/User");
const sequelize = require("../config/database");

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

  // get reviews by courtId
  async getReviewsByCourtId(courtId , page, limit) {
    const offset = (page - 1) * limit;
    try {
      const reviews = await Reviews.findAll({
        where: {
          courtId: courtId,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
      });

      ///////////  calculate avg rating of court
      const avgRatings = await Reviews.findOne({
        where: {
          courtId: courtId,
        },
        attributes: [
          [
            sequelize.fn("AVG", sequelize.col("accessibilityRating")),
            "avgAccessibilityRating",
          ],
          [
            sequelize.fn("AVG", sequelize.col("conditionRating")),
            "avgConditionRating",
          ],
          [
            sequelize.fn("AVG", sequelize.col("overallRating")),
            "avgOverallRating",
          ],
        ],
      });
    
      // agar koi reviews nahi hain, toh default rating return karen
      const averageAccessibilityRating =
        +avgRatings?.dataValues?.avgAccessibilityRating || 0;
      const averageConditionRating =
        +avgRatings?.dataValues?.avgConditionRating || 0;
      const averageOverallRating =
        +avgRatings?.dataValues?.avgOverallRating || 0;

      ///////////// overall average calculation
      const totalAverageRating =
        (averageAccessibilityRating +
          averageConditionRating +
          averageOverallRating) /
        3;
//////////////////// total reviews count

const totalReviewsCount = await Reviews.count({
  where: {
    courtId: courtId,
  },
});
      return {
        reviews,
        avgOverallRating: totalAverageRating.toFixed(1),
        totalPages: Math.ceil(+totalReviewsCount / limit),
        totalReviewsCount,
      };
    } catch (error) {
      console.error("Error fetching reviews: ", error);
      throw new Error("Could not fetch reviews");
    }
  },
};

module.exports = reviewService;

//   // get reviews by courtId
//   async getReviewsByCourtId(courtId) {
//     console.log("courtId : ", courtId);

//     try {
//       const reviews = await Reviews.findAll({
//         where: {
//           courtId: courtId,
//         },
//         include: [
//           {
//             model: User,
//             as: "user",
//             attributes: ["name"],
//           },
//         ],
//         order: [["createdAt", "DESC"]],
//       });

//       //  calculate avg rating of court
//       const avgRatings = await Reviews.findOne({
//         where: {
//           courtId: courtId,
//         },
//         attributes: [
//           [
//             sequelize.fn("AVG", sequelize.col("accessibilityRating")),
//             "avgAccessibilityRating",
//           ],
//           [
//             sequelize.fn("AVG", sequelize.col("conditionRating")),
//             "avgConditionRating",
//           ],
//           [
//             sequelize.fn("AVG", sequelize.col("overallRating")),
//             "avgOverallRating",
//           ],
//         ],
//       });
//       console.log(
//         "avgRatings : ",
//         typeof avgRatings.dataValues.avgAccessibilityRating
//       );

//       // agar koi reviews nahi hain, toh default rating return karen
//       const averageAccessibilityRating =
//         +avgRatings?.dataValues?.avgAccessibilityRating || 0;
//       const averageConditionRating =
//         +avgRatings?.dataValues?.avgConditionRating || 0;
//       const averageOverallRating =
//         +avgRatings?.dataValues?.avgOverallRating || 0;

//       // overall average calculation
//       const totalAverageRating =
//         (averageAccessibilityRating +
//           averageConditionRating +
//           averageOverallRating) /
//         3;

//       return {
//         reviews,
//         avgOverallRating: totalAverageRating.toFixed(1),
//       };
//     } catch (error) {
//       console.error("Error fetching reviews: ", error);
//       throw new Error("Could not fetch reviews");
//     }
//   },
// };

// module.exports = reviewService;

