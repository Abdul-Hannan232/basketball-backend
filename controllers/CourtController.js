const courtService = require('../services/CourtService');
const HttpStatus = require('../utils/ResponseStatus')
const { assignUniqueName, uploadImage } = require('../middlewares/multerConfig')

const addCourt = async (req, res, next) => {
    const imageFile = req.files;
    try {
        if (imageFile?.length > 0) {
            // Extract filenames from imageFile array
            const images = imageFile.map(file => file.filename);
            
            // Assign the images array to req.body
            req.body.images = images;
        }
        const court = await courtService.addCourt(req.body);
        if (court.status === 201 && imageFile) {
            uploadImage(req.body.images)
        }
        res.status(HttpStatus.CREATED).json({ message: "Court Created Successfully", court: court });
    } catch (err) {
        console.log(err)
        next(err)
    }
};

const allCourt = async (req, res, next) => {
    try {
        const courts = await courtService.allCourt();
        res.status(HttpStatus.OK).json({ message: "Courts Fetched Successfully", courts });
    } catch (err) {
        console.log("error",err.message)
        next(err)
    }
};

const updateCourt = async (req, res, next) => {
    try {
        const updatedCourt = await courtService.updateCourt(req.body);
        res.json({ message: "Court updated successfully", updatedCourt });
    } catch (err) {
        next(err)
    }
}

const deleteCourt = async (req, res, next) => {
    try {
        await courtService.deleteCourt(req.params.id);
        res.json({ message: "Court deleted successfully" });
    } catch (err) {
        next(err)
    }
}

const searchCourt = async (req, res, next) => {
    try {
        const courts = await courtService.searchCourt(req);
        res.json({ courts });

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const getCourt = async (req, res, next) => {

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

