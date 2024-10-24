const reviewService = require("../services/ReviewService");

const addReview = async (req, res) => {
  // console.log(">>>>>>>>>>>>>>>controller : ", req.body);

  const {
    userId,
    courtId,
    accessibilityRating,
    conditionRating,
    overallRating,
  } = req.body;

  if (
    !userId ||
    !courtId ||
    !accessibilityRating ||
    !conditionRating ||
    !overallRating
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields.", success: false });
  }

  try {
    const newReview = await reviewService.addReview(req.body);

    return res.status(201).json({
      success: true,
      review: newReview,
      message: "Review  successfully added.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getReviewsByCourtId = async (req, res) => {  
  const { courtId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
 
  if (!courtId) {
    return res.status(400).json({ message: "Court ID is required" });
  }

  try {
    const response = await reviewService.getReviewsByCourtId(courtId , page, limit);
    if (response.totalReviewsCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reviews found for this court" });
    }

    return res
      .status(200)
      .json({...response , success: true});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByCourtId,
};
