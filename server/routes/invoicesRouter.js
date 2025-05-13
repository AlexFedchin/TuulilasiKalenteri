const express = require("express");
const {
  getInvoices,
  changeInvoiceStatus,
} = require("../controllers/invoicesController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", authenticate(["admin"]), getInvoices);
router.post(
  "/change-invoice-status",
  authenticate(["admin"]),
  changeInvoiceStatus
);

// Export the router to be used in the server.js
module.exports = router;
