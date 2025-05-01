const Booking = require("../models/booking.js");
const Location = require("../models/location.js");

const getSentInvoices = async (req, res) => {
  try {
    const filter = { payerType: "insurance", invoiceMade: true };

    const bookings = await Booking.find(
      filter,
      "_id plateNumber carModel insuranceNumber companyName insuranceCompany insuranceCompanyName invoiceMade price deductible date location"
    ).lean();

    for (const booking of bookings) {
      const location = await Location.findById(booking.location, "title");
      booking.locationTitle = location ? location.title : null;
    }

    res.json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUnsentInvoices = async (req, res) => {
  try {
    const filter = { payerType: "insurance", invoiceMade: false };

    const bookings = await Booking.find(
      filter,
      "_id plateNumber carModel insuranceNumber companyName insuranceCompany insuranceCompanyName invoiceMade price deductible date location"
    ).lean();

    for (const booking of bookings) {
      const location = await Location.findById(booking.location, "title");
      booking.locationTitle = location ? location.title : null;
    }

    res.json(bookings);
  } catch {
    console.error("Error getting bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

const markAsSent = async (req, res) => {
  const { bookings } = req.body;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({ error: "Invalid bookings array" });
  }

  try {
    // Check that all bookings are insurance type
    for (const bookingId of bookings) {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res
          .status(404)
          .json({ error: `Booking with ID ${bookingId} not found` });
      }

      if (booking.payerType !== "insurance") {
        return res.status(400).json({
          error: `Booking with ID ${bookingId} does not have payer type 'invoice'`,
        });
      }
    }

    // Update the invoiceMade field for all bookings
    const updatedBookings = await Booking.updateMany(
      { _id: { $in: bookings } },
      { invoiceMade: true }
    );
    if (updatedBookings.nModified === 0) {
      return res.status(404).json({ error: "No bookings were updated" });
    }
    res.status(200).json({ message: "Invoices for the bookings are now sent" });
  } catch (error) {
    console.error("Error marking bookings as sent:", error);
    res.status(500).json({ error: error.message });
  }
};

const markAsUnsent = async (req, res) => {
  const { bookings } = req.body;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({ error: "Invalid bookings array" });
  }

  try {
    // Check that all bookings are insurance type
    for (const bookingId of bookings) {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res
          .status(404)
          .json({ error: `Booking with ID ${bookingId} not found` });
      }

      if (booking.payerType !== "insurance") {
        return res.status(400).json({
          error: `Booking with ID ${bookingId} does not have payer type 'invoice'`,
        });
      }
    }

    // Update the invoiceMade field for all bookings
    const updatedBookings = await Booking.updateMany(
      { _id: { $in: bookings } },
      { invoiceMade: false }
    );
    if (updatedBookings.nModified === 0) {
      return res.status(404).json({ error: "No bookings were updated" });
    }
    res
      .status(200)
      .json({ message: "Invoices for the bookings are now not sent" });
  } catch (error) {
    console.error("Error marking bookings as sent:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export to be used in routes/bookings.js
module.exports = {
  getSentInvoices,
  getUnsentInvoices,
  markAsSent,
  markAsUnsent,
};
