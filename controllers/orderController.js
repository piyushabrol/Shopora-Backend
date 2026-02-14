const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const order = await Order.create({
  user: req.user._id,
  orderItems: cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
  })),
  totalPrice,
});


  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

exports.payOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.json({
    message: "Payment successful (Fake)",
    order: updatedOrder,
  });
};
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("orderItems.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Order = require("../models/Order");

//  ADMIN – Get All Orders
exports.getAllOrders = async (req, res) => {
  console.log("ADMIN ROUTE HIT");
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only the user who placed the order can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Paid orders cannot be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
