const { response } = require("express");
const Court = require("../models/Court");
const Rating = require("../models/Rating");
const { Sequelize } = require("sequelize");
const { deleteFile } = require("../middlewares/multerConfig")


const addCourt = async (courtData) => {
  // Create court record in database
  return await Court.create({
    ...courtData,
  });
};

const allCourt = async () => {
  return await Court.findAll({
    include: [{
      model: Rating,
      as: 'rating',
    }],
    order: [['created_at', 'DESC']] // Order by created_at in descending order
  });
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

const searchCourt = async (req) => {
  const { name, type, location, isactive } = req.body;
  const validSearchFields = ["name", "type", "location"];
  const whereClause = {};

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
  });

  return courts;
};



const getCourtById = async (id) => {
  try {
    // Find the court by ID and include its associated rating
    const court = await Court.findByPk(id, {
      include: [{
        model: Rating,
        as: 'rating' // assuming 'rating' is the alias for the Rating model defined in Relation.js
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


module.exports = {
  addCourt,
  allCourt,
  updateCourt,
  deleteCourt,
  searchCourt,
  getCourtById,
};
