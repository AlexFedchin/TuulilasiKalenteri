const Booking = require("../models/booking.js");
const User = require("../models/user.js");

const getAllBookings = async (req, res) => {
  const { carMake, carModel, plateNumber, insuranceNumber, date, userId } =
    req.query;
  let filter = {};

  if (carMake) filter.carMake = new RegExp(carMake, "i");
  if (carModel) filter.carModel = new RegExp(carModel, "i");
  if (plateNumber) filter.plateNumber = new RegExp(plateNumber, "i");
  if (insuranceNumber)
    filter.insuranceNumber = new RegExp(insuranceNumber, "i");
  if (date) filter.date = new Date(date);
  if (userId) {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");
    filter["createdBy.id"] = user._id;
  }

  try {
    const bookings = await Booking.find(filter);

    if (!bookings || bookings.length === 0) {
      return res.status(404).send("No bookings found");
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOwnBookings = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).send("User not found");

  const bookings = await Booking.find({
    createdBy: {
      id: user._id,
    },
  });

  if (!bookings || bookings.length === 0)
    return res.status(404).send("No bookings found for this user");

  res.json(bookings);
};

const getBookingById = async (req, res) => {
  try {
    const event = await Booking.findById(req.params.id);
    if (!event) return res.status(404).send("Booking not found");
    res.json(event);
  } catch {
    res.status(400).send("Invalid event ID");
  }
};

const createBooking = async (req, res) => {
  const { carMake, carModel, plateNumber, insuranceNumber, date, duration } =
    req.body;

  try {
    // Ensure the user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    // Create a new booking
    const newBooking = new Booking({
      carMake,
      carModel,
      plateNumber,
      insuranceNumber,
      date,
      duration,
      createdBy: {
        id: user._id,
        username: user.username,
      },
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
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

    if (!updatedBooking) return res.status(404).send("Booking not found");

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: "Invalid Booking ID or data" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) return res.status(404).send("Booking not found");

    res.status(204).send("Booking deleted");
  } catch {
    res.status(400).send("Invalid Booking ID");
  }
};

// Export to be used in routes/bookings.js
module.exports = {
  getAllBookings,
  getOwnBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
