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




// const searchCourt = async (req) => {
//   const { name, type, location, isactive } = req.body;
//   const validSearchFields = ["name", "type", "location"];
//   const whereClause = {};

//   validSearchFields.forEach((field) => {
//     if (req.body[field]) {
//       whereClause[field] = {
//         [Sequelize.Op.like]: `%${req.body[field]}%`,
//       };
//     }
//   });

//   // Handling the isactive field
//   if (isactive !== undefined && isactive !== null) {
//     if (isactive) {
//       whereClause["isactive"] = true; // Show only active courts
//     } else if (!isactive) {
//       whereClause["isactive"] = false; // Show only not active courts
//     }
//     // If isactive is not provided or not 0 or 1, show all courts (both active and not active)
//   }

//   const courts = await Court.findAll({
//     where: whereClause,
//   });

//   return courts;
// };


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




// const searchCourt = async (req) => {
//   const { slug } = req.params;  
//   // console.log(' >>>>>>>>>>>>>>>>>>>>>. search : ' ,slug);
  
//   // Handle invalid query
//   if (!slug || typeof slug !== "string") {
//     throw new Error("Invalid court name parameter.");
//   }
// if(slug.toLowerCase() === "all"){
//   const courts = await Court.findAll({where:{isactive: true}});
//   return courts;
// }else{
//     const courts = await Court.findAll({
//       where: {
//         name: {
//           [Sequelize.Op.like]: `%${slug}%`,
//         },
//         isactive: true, 
//       },
//     });
    
//     return courts;
//   }

// };


// const filterCourts = async (filters) => {
//   const { order, courtType} = filters;

//   // Define sorting options
//   let orderOption = [];
//   if (order === "latest") {
//     orderOption.push(["created_at", "DESC"]);
//   } else if (order === "popular") {
//     orderOption.push(["ratings", "DESC"]);
//   } else if (order === "review") {
//     orderOption.push(["ratings", "DESC"]);
//   }

//   // Build filters for court type
//   let whereConditions = {isactive:true};
//   if (courtType) {
//     whereConditions.type = courtType;
//   }


//   // Fetch filtered courts from the database
//   const courts = await Court.findAll({
//     where: whereConditions,
//     order: orderOption,
//   });

//   return courts;
// }





module.exports = {
  addCourt,
  allCourt,
  updateCourt,
  deleteCourt,
  getCourtById,
  searchCourt,
  // filterCourts
};
