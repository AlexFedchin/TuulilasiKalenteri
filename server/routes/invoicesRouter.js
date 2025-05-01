const express = require("express");
const {
  getSentInvoices,
  getUnsentInvoices,
  markAsSent,
  markAsUnsent,
} = require("../controllers/invoicesController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/sent-invoices", authenticate(["admin"]), getSentInvoices);
router.get("/unsent-invoices", authenticate(["admin"]), getUnsentInvoices);
router.post("/mark-as-sent", authenticate(["admin"]), markAsSent);
router.post("/mark-as-unsent", authenticate(["admin"]), markAsUnsent);

// Export the router to be used in the server.js
module.exports = router;
