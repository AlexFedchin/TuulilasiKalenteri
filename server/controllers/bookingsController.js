const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const Location = require("../models/location.js");

const getAllBookings = async (req, res) => {
  const {
    carMake,
    carModel,
    plateNumber,
    insuranceNumber,
    date,
    userId,
    startDate,
    endDate,
  } = req.query;
  let filter = {};

  if (carMake) filter.carMake = new RegExp(carMake, "i");
  if (carModel) filter.carModel = new RegExp(carModel, "i");
  if (plateNumber) filter.plateNumber = new RegExp(plateNumber, "i");
  if (insuranceNumber)
    filter.insuranceNumber = new RegExp(insuranceNumber, "i");
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (date) {
    filter.date = new Date(date);
  }

  try {
    if (req.user.role === "admin") {
      if (userId) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        filter.createdBy = user._id;
      }
    } else if (req.user.role === "regular") {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      filter.createdBy = user._id;
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const event = await Booking.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Booking not found" });
    res.json(event);
  } catch {
    res.status(400).json({ error: "Invalid event ID" });
  }
};

const createBooking = async (req, res) => {
  const { carMake, carModel, plateNumber, insuranceNumber, date, duration } =
    req.body;

  console.log(req.user);

  // Create a new booking
  const newBooking = new Booking({
    carMake,
    carModel,
    plateNumber,
    insuranceNumber,
    date,
    duration,
    createdBy: req.user.id,
  });

  if (req.user.role === "admin") {
    if (!req.body.location)
      res.status(400).json({ error: "Location is required" });

    const location = await Location.findByIdAndUpdate(
      req.body.location,
      {
        $addToSet: { bookings: newBooking._id },
      },
      { new: true }
    );

    if (!location) return res.status(404).json({ error: "Location not found" });
  } else {
    const location = await Location.findOne({ users: req.user.id });
    if (!location) return res.status(404).json({ error: "Location not found" });

    // Add the booking to the user's location
    location.bookings.push(newBooking._id);
    await location.save();
  }

  try {
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBooking = async (req, res) => {
  const { carMake, carModel, plateNumber, insuranceNumber, date, duration } =
    req.body;

  try {
    // Find and update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        carMake,
        carModel,
        plateNumber,
        insuranceNumber,
        date,
        duration,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: "Invalid Booking ID or data" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    const location = await Location.findOne({
      bookings: deletedBooking._id,
    });

    if (!location) return res.status(404).json({ error: "Location not found" });

    location.bookings = location.bookings.filter(
      (bookingId) => bookingId.toString() !== deletedBooking._id.toString()
    );
    await location.save();

    if (!deletedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.status(204).json({ message: "Booking deleted" });
  } catch {
    res.status(400).json({ error: "Invalid Booking ID" });
  }
};

// Export to be used in routes/bookings.js
module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
