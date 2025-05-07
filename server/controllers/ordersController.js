const Order = require("../models/order");

// Get all orders
const getAllOrders = async (req, res) => {
  const { completed } = req.query;
  const filter =
    completed !== undefined ? { completed: completed === "true" } : {};
  try {
    const orders = await Order.find(filter);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { products, client, notes } = req.body;

  const newOrderData = {
    products,
    client,
    completed: false,
  };

  if (notes?.trim()) {
    newOrderData.notes = notes.trim();
  }

  // Add client name if client is "other"
  let clientName = null;
  if (client === "other") {
    clientName = req.body.clientName;

    if (!clientName.trim()) {
      return res.status(400).json({ error: "Client name is required" });
    }

    newOrderData.clientName = clientName.trim();
  }

  const order = new Order(newOrderData);

  try {
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a order
const updateOrder = async (req, res) => {
  const { products, client, notes } = req.body;

  const updatedOrderData = {
    products,
    client,
  };

  if (notes?.trim()) {
    updatedOrderData.notes = notes.trim();
  }
  if (req.body.completed !== undefined) {
    updatedOrderData.completed = req.body.completed;
  }

  // Add client name if client is "other"
  let clientName = null;
  if (client === "other") {
    clientName = req.body.clientName;

    if (!clientName.trim()) {
      return res.status(400).json({ error: "Client name is required" });
    }

    updatedOrderData.clientName = clientName.trim();
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updatedOrderData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ deletedOrderId: deletedOrder._id });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: error.message });
  }
};

const changeStatus = async (req, res) => {
  const { orders } = req.body;
  const completed = req.query.completed === "true";

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Invalid orders array" });
  }

  try {
    // Update the completed field for all orders
    const updatedOrders = await Order.updateMany(
      { _id: { $in: orders } },
      { completed: completed }
    );
    if (updatedOrders.nModified === 0) {
      return res.status(404).json({ error: "No orders were updated" });
    }
    res.status(200).json({
      message: `Orders are now marked as ${
        completed ? "completed" : "uncompleted"
      }`,
    });
  } catch (error) {
    console.error(
      `Error marking orders as ${completed ? "completed" : "uncompleted"}:`,
      error
    );
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  changeStatus,
};
