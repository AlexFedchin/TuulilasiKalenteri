const Booking = require("../models/booking");

const checkBookingOwnership = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the user is the creator of the booking or an admin
    if (
      booking.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to modify this booking" });
    }

    // Attach the booking to the request object for further use
    req.booking = booking;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid booking ID" });
  }
};

module.exports = checkBookingOwnership;
