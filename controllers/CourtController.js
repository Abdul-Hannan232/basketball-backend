const courtService = require('../services/CourtService');
const HttpStatus = require('../utils/ResponseStatus')


const addCourt = async(req, res,next) => {
    try {
        const court = await courtService.addCourt(req.body);
        res.status(HttpStatus.CREATED).json({ message: "Court Created Successfully", court });
    } catch (err) {
        next(err)
    }
};

const allCourt = async(req, res,next) => {
    try {
        const courts = await courtService.allCourt();
        res.status(HttpStatus.OK).json({ message: "Courts Fetched Successfully", courts });
    } catch (err) {
        next(err)
    }
};

const updateCourt=async (req,res,next)=>{
    try {
        const updatedCourt = await courtService.updateCourt(req.body);
        res.json({ message: "Court updated successfully", updatedCourt });
    } catch (err) {
        next(err)
    }
}

const deleteCourt=async(req,res,next)=>
{
    try {
        await courtService.deleteCourt(req.params.id);
        res.json({ message: "Court deleted successfully" });
    }  catch (err) {
       next(err)
    }
}

const searchCourt=async (req,res,next)=>
{
    try {
        const courts = await courtService.searchCourt(req);
        res.json({ courts });
       
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const getCourt= async(req,res,next)=>{

        try {
            const courtDetail = await courtService.getCourtById(req.params.id);
            if (courtDetail) {
                res.json(courtDetail);
            } else {
                res.status(HttpStatus.NOT_FOUND).send("Court not found");
            }
        } catch (err) {
           next(err)
        }
}

module.exports = {
    addCourt,
    allCourt,
    updateCourt,
    deleteCourt,
    searchCourt,
    getCourt
};
