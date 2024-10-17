const { Op } = require('sequelize');
const CheckIn = require("../models/CheckIn");


const checkInService = {

  async hasRecentCheckIn(userId, courtId) {
    const currentTime = new Date();
    const sixHoursAgo = new Date(currentTime.getTime() - (6 * 60 * 60 * 1000));

    const recentCheckIn = await CheckIn.findOne({
      where: {
        userId: userId,
        courtId: courtId,
        checkInTime: { [Op.gt]: sixHoursAgo }
      }
    });

    return !!recentCheckIn; // Return true if a recent check-in exists
  },

//    Create a new check-in for the user and court
  
  async createCheckIn(userId, courtId) {
    const currentTime = new Date();

    const newCheckIn = await CheckIn.create({
      userId: userId,
      courtId: courtId,
      checkInTime: currentTime
    });

    return newCheckIn;
  }
};

module.exports = checkInService;
