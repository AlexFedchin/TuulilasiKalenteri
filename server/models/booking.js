const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 10,
      match: /^[A-Za-z]{1,3}-[0-9]{1,3}$/,
    },
    isWorkDone: { type: Boolean, default: false },
    carModel: { type: String, required: true, minlength: 2, maxlength: 25 },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
      match:
        /^((04[0-9]{1})(\s?|-?)|050(\s?|-?)|0457(\s?|-?)|[+]?358(\s?|-?)50|0358(\s?|-?)50|00358(\s?|-?)50|[+]?358(\s?|-?)4[0-9]{1}|0358(\s?|-?)4[0-9]{1}|00358(\s?|-?)4[0-9]{1})(\s?|-?)(([0-9]{3,4})(\s|-)?[0-9]{1,4})$/,
    },
    eurocode: { type: String, required: true, minlength: 2, maxlength: 20 },
    inStock: { type: Boolean, required: true },
    warehouseLocation: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: function () {
        return this.inStock;
      },
    },
    clientType: {
      type: String,
      enum: ["private", "company"],
      required: true,
    },
    payerType: {
      type: String,
      enum: ["person", "company", "insurance"],
      required: true,
    },
    insuranceCompany: {
      type: String,
      enum: [
        "pohjolaVakuutus",
        "lahiTapiola",
        "ifVakuutus",
        "fennia",
        "turva",
        "pohjantahti",
        "alandia",
        "muu",
      ],
      required: function () {
        return this.payerType === "insurance";
      },
    },
    insuranceNumber: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: function () {
        return this.payerType === "insurance";
      },
    },
    date: { type: Date, required: true },
    duration: { type: Number, required: true, min: 0.5, max: 6 }, // in hours
    notes: { type: String, minlength: 0, maxlength: 500 },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
