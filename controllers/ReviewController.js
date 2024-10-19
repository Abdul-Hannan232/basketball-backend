const reviewService = require("../services/ReviewService");

const addReview = async (req, res) => {
    const { userId, courtId, comment, accessibilityRating, conditionRating, overallRating } = req.body;
  
    if (!userId || !courtId || !accessibilityRating || !conditionRating || !overallRating) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    try {
      const newReview = await reviewService.addReview(
        userId,
        courtId,
        comment,
        accessibilityRating,
        conditionRating,
        overallRating
      );
  
      return res.status(201).json({ success: true, review: newReview });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
 
module.exports={
    addReview
}
