const ratingService = require("../services/RatingService");
const HttpStatus = require("../utils/ResponseStatus");

const rateCourt = async(req, res,next) => {
    try {
        const rating = await ratingService.rateCourt(req.body);
        res.status(HttpStatus.CREATED).json({ message: "Court Rated Successfully", rating });
 
    } catch (err) {
        next(err)
    }
};
 
module.exports={
    rateCourt
}
