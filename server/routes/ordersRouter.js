const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  changeStatus,
} = require("../controllers/ordersController");
const validateOrderData = require("../middlewares/validateOrder");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Admin only routes
router.get("/", authenticate(["admin"]), getAllOrders);
router.post("/change-status", authenticate(["admin"]), changeStatus);
router.get("/:id", authenticate(["admin"]), getOrderById);
router.post("/", authenticate(["admin"]), validateOrderData, createOrder);
router.put("/:id", authenticate(["admin"]), validateOrderData, updateOrder);
router.delete("/:id", authenticate(["admin"]), deleteOrder);

// Export the router to be used in the server.js
module.exports = router;
