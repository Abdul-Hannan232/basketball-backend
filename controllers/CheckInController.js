const checkInService = require("../services/CheckInService");

const AddCheckIn = async (req, res) =>{
  const { userId, courtId } = req.body;
  // console.log("AddCheckIn : ", req.body);

  try {
    // check latest check-in within the last 6 hours
    const hasRecentCheckIn = await checkInService.hasRecentCheckIn(
      userId,
      courtId
    );

    if (hasRecentCheckIn) {
      // If user has checked in recently, return an error
      return res
        .status(400)
        .json({ message: "Check-in already done in the last 6 hours" });
    }

    // otherwise create new check-in
    const newCheckIn = await checkInService.createCheckIn(userId, courtId);

    return res
      .status(200)
      .json({
        message: "Check-in successful",
        checkIn: newCheckIn,
        success: true,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during check-in", error, success: false });
  }
}

const CheckInStatus = async (req, res) => {
  const { userId, courtId } = req.params;

  try {
    const hasRecentCheckIn = await checkInService.hasRecentCheckIn(
      userId,
      courtId
    );
    // console.log(">>>>>>>>>>>>hasRecentCheckIn : ",hasRecentCheckIn);

    if (hasRecentCheckIn) {
      return res.status(200).json({
        success: true,
        message: "Check-in found",
        hasRecentCheckIn: hasRecentCheckIn,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No recent check-in found",
        hasRecentCheckIn: hasRecentCheckIn,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error checking check-in status",
      error: error.message,
      success: false,
    });
  }
};

const GetCheckInsByCourtId = async (req, res) => {
  const { courtId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const checkIns = await checkInService.getCheckInsByCourtId(courtId, page, limit);

    if (checkIns?.totalChekinsCount === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No check-ins found for this court.",
        });
    }

    return res
      .status(200)
      .json({...checkIns , success: true});
      // .json({ success: true, checkIns, total: checkIns?.length });
  } catch (error) {
    console.error("Error fetching check-ins by court ID", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching check-ins.",
      });
  }
};

const AllCheckins = async (req, res, next) => {
  try {
    const checkins = await checkInService.AllCourts();
    res
      .status(200)
      .json({
        message: "All Checkins Fetched Successfully",
        checkins,
        total: checkins?.length,
      });
  } catch (err) {
    console.log("error", err.message);
    next(err);
  }
};

module.exports = { AddCheckIn, CheckInStatus, GetCheckInsByCourtId , AllCheckins};
