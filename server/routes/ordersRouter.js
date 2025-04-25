const express = require("express");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordersController");
const validateOrderData = require("../middlewares/validateOrder");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Public Routes (accessible by any authenticated user)
router.get("/", authenticate(["admin"]), getAllOrders);

router.get("/:id", authenticate(["admin"]), getOrderById);

// Admin only routes
router.post("/", authenticate(["admin"]), validateOrderData, createOrder);

router.put("/:id", authenticate(["admin"]), validateOrderData, updateOrder);

router.delete("/:id", authenticate(["admin"]), deleteOrder);

// Export the router to be used in the server.js
module.exports = router;
