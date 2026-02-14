const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);   
router.put("/:itemId", protect, updateCartItem);
router.delete("/:itemId", protect, removeCartItem);

module.exports = router;
