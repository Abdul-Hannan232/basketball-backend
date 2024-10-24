const   calculateAverageRating = (avgRatings = {}) => {
    const ratings = [
      avgRatings?.avgAccessibilityRating || 0,
      avgRatings?.avgConditionRating || 0,
      avgRatings?.avgOverallRating || 0,
    ];
  
    const sum = ratings.reduce((total, rating) => total + (+rating || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };
  

  module.exports = calculateAverageRating
 

