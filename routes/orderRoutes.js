const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { 
  createOrder, 
  payOrder, 
  getMyOrders, 
  getOrderById,
  getAllOrders,
  cancelOrder
} = require("../controllers/orderController");

router.get("/myorders", protect, getMyOrders);

router.get("/admin/all", protect, adminOnly, getAllOrders);

router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/pay", protect, payOrder);

module.exports = router;
