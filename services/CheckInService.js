const { Op } = require("sequelize");
const CheckIn = require("../models/CheckIn");
const User = require("../models/User");

const checkInService = {
  async hasRecentCheckIn(userId, courtId) {
    const currentTime = new Date();
    const sixHoursAgo = new Date(currentTime.getTime() - 6 * 60 * 60 * 1000);

    const recentCheckIn = await CheckIn.findOne({
      where: {
        userId: userId,
        courtId: courtId,
        checkInTime: { [Op.gt]: sixHoursAgo },
      },
    });

    return !!recentCheckIn; // return true if recent check-in exists
  },

  //    Create new check-in

  async createCheckIn(userId, courtId) {
    const currentTime = new Date();

    const newCheckIn = await CheckIn.create({
      userId: userId,
      courtId: courtId,
      checkInTime: currentTime,
    });

    return newCheckIn;
  },

  // get checkin by court

  //   async getCheckInsByCourtId(courtId) {
  //     const checkIns = await CheckIn.findAll({
  //       where: {
  //         courtId: courtId
  //       },
  //       include: [
  //         {
  //           model: User, // include userData
  //           attributes: [ 'name', 'created_at', "team", "height" , "weight"],
  //         }
  //       ],
  //       order: [['checkInTime', 'DESC']]  // latest first
  //     });

  //     return checkIns;
  //   }

  async getCheckInsByCourtId(courtId , page, limit) {
    const offset = (page - 1) * limit;
    const checkIns = await CheckIn.findAll({
      where: {
        courtId: courtId,
      },
      include: [
        {
          model: User,
          attributes: ["name", "created_at", "team", "height", "weight"],
        },
      ],
      order: [["checkInTime", "DESC"]], // latest first
      limit: limit,
        offset: offset,
    });

    // format checkInTime
    const formattedCheckIns = checkIns.map((checkIn) => {
      const formattedTime = new Date(checkIn.checkInTime).toLocaleString(
        "en-US",
        {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }
      );

      // User Joining Date
      const userJoiningDate = new Date(checkIn?.user?.created_at); // user createdAt as joining date
      const year = userJoiningDate.getFullYear(); // extract the year

      const joiningDate = `Joined Since ${year}`;

      return {
        ...checkIn.toJSON(),
        user: {
          ...checkIn.user.toJSON(),
          joiningDate: joiningDate,
        },
        checkInTime: formattedTime,
      };
    });

    //////////////////// total checkins count

const totalChekinsCount = await CheckIn.count({
  where: {
    courtId: courtId,
  },
});



return {
  checkIns : formattedCheckIns,
  totalPages: Math.ceil(+totalChekinsCount / limit),
  totalChekinsCount,
};
  },

  async AllCourts() {
    return await CheckIn.findAll({
      order: [["createdAt", "DESC"]],
    });
  },
};

module.exports = checkInService;
