const Booking = require("../models/booking.js");
const Location = require("../models/location.js");

const getInvoices = async (req, res) => {
  const { invoiceMade } = req.query;
  if (invoiceMade !== "true" && invoiceMade !== "false") {
    return res
      .status(400)
      .json({ error: "Invalid invoiceMade query parameter" });
  }
  try {
    const filter = {
      payerType: "insurance",
      invoiceMade: invoiceMade === "true",
    };

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

const changeInvoiceStatus = async (req, res) => {
  const { bookings } = req.body;
  const invoiceMade = req.query.invoiceMade === "true";

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
          error: `Booking with ID ${bookingId} does not have payer type 'insurance'`,
        });
      }
    }

    // Update the invoiceMade field for all bookings
    const updatedBookings = await Booking.updateMany(
      { _id: { $in: bookings } },
      { invoiceMade: invoiceMade }
    );
    if (updatedBookings.nModified === 0) {
      return res.status(404).json({ error: "No bookings were updated" });
    }

    res.status(200).json({
      message: `Invoices for the bookings are now ${
        invoiceMade ? "sent" : "not sent"
      }`,
    });
  } catch (error) {
    console.error(
      `Error marking bookings as ${invoiceMade ? "sent" : "not sent"}:`,
      error
    );
    res.status(500).json({ error: error.message });
  }
};

// Export to be used in routes/bookings.js
module.exports = {
  getInvoices,
  changeInvoiceStatus,
};
