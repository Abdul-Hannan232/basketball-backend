const Court = require("../models/Court");
const { Sequelize } = require("sequelize");
const { deleteFile } = require("../middlewares/multerConfig");
const Reviews = require("../models/Reviews");
const sequelize = require("../config/database");
const calculateAverageRating = require("../utils/calculateAverageRating");



const addCourt = async (courtData) => {
  // Create court record in database 
  return await Court.create({
    ...courtData,
  });
};
 
const allCourt = async (page, limit) => { 
  try {
    const courts = await Court.findAll({
      include: [
        {
          model: Reviews,
          as: 'reviews_id',
          attributes: ['accessibilityRating', 'conditionRating', 'overallRating'],
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('reviews_id.accessibilityRating')), 1), 'avgAccessibilityRating'],
          [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('reviews_id.conditionRating')), 1), 'avgConditionRating'],
          [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('reviews_id.overallRating')), 1), 'avgOverallRating'],
        ]      },
      group: ['courtId'],
      order: [['created_at', 'DESC']],
      
    });

    return courts.map(court => {
      const totalAverageRating = calculateAverageRating(court.dataValues);

      return {
        ...court.toJSON(),
        totalAverageRating,
      };
    });
  } catch (error) {
    console.error('Error fetching courts with ratings:', error);
    throw error;
  }
};



const updateCourt = async (courtData) => {
  const {
    name,
    location,
    operating_hours,
    cost,
    ratings,
    type,
    isactive,
    condition,
    accessibility,
    images,
    description,
    id,
  } = courtData;
  const [affectedRows] = await Court.update(
    {
      name,
      location,
      operating_hours,
      cost,
      ratings,
      type,
      isactive,
      condition,
      accessibility,
      images,
      description,
    },
    {
      where: { id: id },
    }
  );

  if (affectedRows > 0) {
    const updatedCourt = await Court.findOne({
      where: { id: id },
    });

    return updatedCourt;
  }
};

const deleteCourt = async (id) => {
  // Check if the court exists before attempting to delete
  const courtExists = await Court.findOne({
    where: { id: id },
  });

  // If user exists, proceed to delete
  if (courtExists) {
    await Court.destroy({
      where: { id: id },
    });
     let allImages = JSON.parse(courtExists.dataValues.images)
      await Promise.all(allImages.map(image => deleteFile(image)));
     return true; // Indicate successful deletion
  }

  return false;
};



const getCourtById = async (id) => {
  try {
    // Find the court by ID and include its associated rating
    const court = await Court.findByPk(id, {
      include: [{
        // model: Rating,
        // as: 'rating' // assuming 'rating' is the alias for the Rating model defined in Relation.js
        model: Reviews,
      as: 'reviews_id',
      }]
    });

    if (!court) {
      return null; // Court not found
    }

    return court;
  } catch (error) {
    // Handle errors gracefully
    console.error('Error fetching court:', error);
    throw error;
  }
};


searchCourt = async (req) => {
  console.log(">>>>>>>>>>>>>>>>>> ", req.body);
  
  const { name, type, location, order, isactive } = req.body;
  const validSearchFields = ["name", "type", "location"];
  const whereClause = {};

    // define sorting options
    let orderOption = [];
    if (order === "latest") {
      orderOption.push(["created_at", "DESC"]);
    } else if (order === "popular") {
      orderOption.push(["ratings", "DESC"]);
    } else if (order === "review") {
      orderOption.push(["ratings", "DESC"]);
    }
  
  

  validSearchFields.forEach((field) => {
    if (req.body[field]) {
      whereClause[field] = {
        [Sequelize.Op.like]: `%${req.body[field]}%`,
      };
    }
  });

  // Handling the isactive field
  if (isactive !== undefined && isactive !== null) {
    if (isactive) {
      whereClause["isactive"] = true; // Show only active courts
    } else if (!isactive) {
      whereClause["isactive"] = false; // Show only not active courts
    }
    // If isactive is not provided or not 0 or 1, show all courts (both active and not active)
  }

  const courts = await Court.findAll({
    where: whereClause,
    order: orderOption,
  });

  console.log("results : ", courts.length);
  return { totalCount: courts.length, courts, success: true };
  // return courts;
};




module.exports = {
  addCourt,
  allCourt,
  updateCourt,
  deleteCourt,
  getCourtById,
  searchCourt,
  // filterCourts
};
