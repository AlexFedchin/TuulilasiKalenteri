const express = require("express");
const {
  getInvoices,
  changeInvoiceStatus,
  getInvoicesForInvoicesPage,
} = require("../controllers/invoicesController");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", authenticate(["admin"]), getInvoices);
router.get(
  "/invoices-page",
  authenticate(["admin"]),
  getInvoicesForInvoicesPage
);
router.post(
  "/change-invoice-status",
  authenticate(["admin"]),
  changeInvoiceStatus
);

// Export the router to be used in the server.js
module.exports = router;
