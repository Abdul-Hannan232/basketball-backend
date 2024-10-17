const checkInService = require("../services/CheckInService");

async function AddCheckIn(req, res) {
  const { userId, courtId } = req.body;

  try {
    // Check if the user has a recent check-in within the last 6 hours
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

    // Otherwise, create a new check-in
    const newCheckIn = await checkInService.createCheckIn(userId, courtId);

    return res
      .status(200)
      .json({ message: "Check-in successful", checkIn: newCheckIn });
  } catch (error) {
    return res.status(500).json({ message: "Error during check-in", error });
  }
}

async function CheckInStatus(req, res) {
  const { userId, courtId } = req.body;

  try {
    const hasRecentCheckIn = await checkInService.hasRecentCheckIn(
      userId,
      courtId
    );

    if (hasRecentCheckIn) {
      return res.status(200).json({
        message: "Check-in found",
        hasRecentCheckIn: hasRecentCheckIn,
      });
    } else {
      return res.status(404).json({
        message: "No recent check-in found",
        hasRecentCheckIn: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error checking check-in status",
      error: error.message,
    });
  }
}

module.exports = { AddCheckIn, CheckInStatus };
