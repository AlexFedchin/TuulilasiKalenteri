const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const Location = require("../models/location.js");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(timezone);

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
    insuranceCompanyName,
    invoiceMade,
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
  if (clientType) filter.clientType = new RegExp(clientType, "i");
  if (payerType) filter.payerType = new RegExp(payerType, "i");
  if (insuranceCompany)
    filter.insuranceCompany = new RegExp(insuranceCompany, "i");
  if (insuranceCompanyName)
    filter.insuranceCompanyName = new RegExp(insuranceCompanyName, "i");
  if (invoiceMade) filter.invoiceMade = invoiceMade === "true";
  if (insuranceNumber)
    filter.insuranceNumber = new RegExp(insuranceNumber, "i");
  if (duration) filter.duration = Number(duration);
  if (notes) filter.notes = new RegExp(notes, "i");
  if (location) filter.location = location;

  if (startDate && endDate) {
    filter.date = { $gte: dayjs(startDate), $lte: dayjs(endDate) };
  } else if (date) {
    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();
    filter.date = { $gte: startOfDay, $lt: endOfDay };
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
    console.error("Error getting all bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const event = await Booking.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Booking not found" });
    res.json(event);
  } catch {
    console.error("Error getting booking by ID:", error);
    res.status(500).json({ error: error.message });
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
    insuranceCompanyName,
    insuranceNumber,
    date,
    duration,
    notes,
    location,
  } = req.body;

  let bookingLocation = location;
  try {
    // Check if the booking is being created in past
    if (dayjs(date).isBefore(dayjs(), "day") && req.user.role !== "admin") {
      return res.status(403).json({ error: "You cannot create past bookings" });
    }

    // Check if the booking ends after 16:00
    const endTime = dayjs(date).add(duration, "hour");
    const limitEndTime = dayjs
      .tz(date, "Europe/Helsinki")
      .hour(16)
      .minute(0)
      .second(0)
      .millisecond(0);
    if (endTime.isAfter(limitEndTime)) {
      return res.status(400).json({ error: "Booking should end before 16:00" });
    }

    // Finding and setting the booking's location
    if (req.user.role === "admin") {
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }
    } else {
      const locationObject = await Location.findOne({ users: req.user.id });
      if (!locationObject)
        return res.status(404).json({ error: "User's location not found" });

      bookingLocation = locationObject._id;
    }

    // Create a new booking
    const newBooking = new Booking({
      carModel: carModel.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      isWorkDone,
      phoneNumber: phoneNumber.trim(),
      eurocode: eurocode.trim().toUpperCase(),
      inStock,
      warehouseLocation: inStock ? warehouseLocation.trim() : undefined,
      clientType,
      payerType,
      insuranceCompany:
        payerType === "insurance" ? insuranceCompany : undefined,
      insuranceCompanyName:
        payerType === "insurance" && insuranceCompany === "other"
          ? insuranceCompanyName
          : undefined,
      insuranceNumber:
        payerType === "insurance"
          ? insuranceNumber.trim().toUpperCase()
          : undefined,
      date,
      duration,
      notes: notes.trim(),
      createdBy: req.user.id,
      location: bookingLocation,
      invoiceMade: false,
    });

    const savedBooking = await newBooking.save();

    if (!savedBooking)
      return res
        .status(500)
        .json({ error: "Error saving booking to database" });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
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
    insuranceCompanyName,
    insuranceNumber,
    date,
    duration,
    notes,
    location,
  } = req.body;

  let invoiceMade;
  if (req.user.role === "admin") {
    invoiceMade = req.body.invoiceMade;
  } else {
    invoiceMade = undefined;
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (
      dayjs(booking?.date).isBefore(dayjs(), "day") &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "You cannot modify past bookings" });
    }

    // Check if the booking ends after 16:00
    const endTime = dayjs(booking?.date).add(duration, "hour");
    const limitEndTime = dayjs
      .tz(booking?.date, "Europe/Helsinki")
      .hour(16)
      .minute(0)
      .second(0)
      .millisecond(0);
    if (endTime.isAfter(limitEndTime)) {
      return res.status(400).json({ error: "Booking should end before 16:00" });
    }

    let bookingLocation = location;
    if (req.user.role === "admin") {
      if (!location)
        return res.status(400).json({ error: "Location is required!" });
    } else {
      const locationObject = await Location.findOne({ users: req.user.id });
      if (!locationObject)
        return res.status(404).json({ error: "User's location not found" });

      bookingLocation = locationObject._id;
    }

    // Find and update the booking
    const updateFields = {
      carModel: carModel.trim(),
      isWorkDone,
      plateNumber: plateNumber.trim().toUpperCase(),
      phoneNumber: phoneNumber.trim(),
      eurocode: eurocode.trim().toUpperCase(),
      inStock,
      warehouseLocation: inStock ? warehouseLocation.trim() : undefined,
      clientType,
      payerType,
      insuranceCompany:
        payerType === "insurance" ? insuranceCompany : undefined,
      insuranceCompanyName:
        payerType === "insurance" && insuranceCompany === "other"
          ? insuranceCompanyName
          : undefined,
      insuranceNumber:
        payerType === "insurance" ? insuranceNumber.trim() : undefined,
      date,
      duration,
      notes: notes.trim(),
      location: bookingLocation,
    };

    if (invoiceMade !== undefined) {
      updateFields.invoiceMade = invoiceMade;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (
      dayjs(booking?.date).isBefore(dayjs(), "day") &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "You cannot delete past bookings" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.status(200).json({
      deletedBookingId: deletedBooking._id,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: error.message });
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
