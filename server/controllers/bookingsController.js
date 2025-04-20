const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const Location = require("../models/location.js");
const dayjs = require("dayjs");

const getAllBookings = async (req, res) => {
  const {
    carModel,
    plateNumber,
    phoneNumber,
    eurocode,
    inStock,
    warehouseLocation,
    clientType,
    payerType,
    insuranceCompany,
    insuranceNumber,
    date,
    startDate,
    endDate,
    duration,
    notes,
    location,
    userId,
    isWorkDone,
  } = req.query;

  let filter = {};

  if (carModel) filter.carModel = new RegExp(carModel, "i");
  if (isWorkDone !== undefined) filter.isWorkDone = isWorkDone === "true";
  if (plateNumber) filter.plateNumber = new RegExp(plateNumber, "i");
  if (phoneNumber) filter.phoneNumber = new RegExp(phoneNumber, "i");
  if (eurocode) filter.eurocode = new RegExp(eurocode, "i");
  if (inStock !== undefined) filter.inStock = inStock === "true";
  if (warehouseLocation)
    filter.warehouseLocation = new RegExp(warehouseLocation, "i");
  if (clientType) filter.clientType = clientType;
  if (payerType) filter.payerType = payerType;
  if (insuranceCompany) filter.insuranceCompany = insuranceCompany;
  if (insuranceNumber)
    filter.insuranceNumber = new RegExp(insuranceNumber, "i");
  if (duration) filter.duration = Number(duration);
  if (notes) filter.notes = new RegExp(notes, "i");
  if (location) filter.location = location;

  if (startDate && endDate) {
    filter.date = { $gte: dayjs(startDate), $lte: dayjs(endDate) };
  } else if (date) {
    filter.date = dayjs(date);
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
    console.error(error);
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
  const {
    carModel,
    isWorkDone,
    plateNumber,
    phoneNumber,
    eurocode,
    inStock,
    warehouseLocation,
    clientType,
    payerType,
    insuranceCompany,
    insuranceNumber,
    date,
    duration,
    notes,
    location,
  } = req.body;

  let bookingLocation = location;
  try {
    const today = dayjs();
    today.startOf("day");

    if (date < today && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Cannot create past bookings" });
    }

    if (req.user.role === "admin" && !location) {
      return res.status(400).json({ error: "Location is required" });
    } else {
      const locationObject = await Location.findOne({ users: req.user.id });
      if (!locationObject)
        return res.status(404).json({ error: "User's location not found" });

      bookingLocation = locationObject._id;
    }

    // Create a new booking
    const newBooking = new Booking({
      carModel,
      plateNumber,
      isWorkDone,
      phoneNumber,
      eurocode,
      inStock,
      warehouseLocation: inStock ? warehouseLocation : undefined,
      clientType,
      payerType,
      insuranceCompany:
        payerType === "insurance" ? insuranceCompany : undefined,
      insuranceNumber: payerType === "insurance" ? insuranceNumber : undefined,
      date,
      duration,
      notes,
      createdBy: req.user.id,
      location: bookingLocation,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBooking = async (req, res) => {
  const {
    carModel,
    plateNumber,
    isWorkDone,
    phoneNumber,
    eurocode,
    inStock,
    warehouseLocation,
    clientType,
    payerType,
    insuranceCompany,
    insuranceNumber,
    date,
    duration,
    notes,
    location,
  } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    const today = dayjs();
    today.startOf("day");

    if (booking?.date < today && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You cannot modify past bookings!" });
    }

    let bookingLocation = location;
    if (req.user.role === "admin" && !location) {
      return res.status(400).json({ error: "Location is required!" });
    } else {
      const locationObject = await Location.findOne({ users: req.user.id });
      if (!locationObject)
        return res.status(404).json({ error: "User's location not found!" });

      bookingLocation = locationObject._id;
    }

    // Find and update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        carModel,
        isWorkDone,
        plateNumber,
        phoneNumber,
        eurocode,
        inStock,
        warehouseLocation: inStock ? warehouseLocation : undefined,
        clientType,
        payerType,
        insuranceCompany:
          payerType === "insurance" ? insuranceCompany : undefined,
        insuranceNumber:
          payerType === "insurance" ? insuranceNumber : undefined,
        date,
        duration,
        notes,
        location: bookingLocation,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const today = dayjs();

    // today.startOf("day");
    // if (booking?.date < today && req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ error: "Forbidden: Cannot delete past bookings" });
    // }

    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.status(200).json({
      deletedBookingId: deletedBooking._id,
    });
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
