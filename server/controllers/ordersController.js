const Order = require("../models/order");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
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
  const { eurocode, client, notes } = req.body;

  const newOrderData = {
    eurocode: eurocode.trim(),
    client: client,
    notes: notes.trim(),
  };

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
  const { eurocode, client, notes } = req.body;

  const updatedOrderData = {
    eurocode: eurocode.trim(),
    client,
    notes: notes.trim(),
  };

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

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
