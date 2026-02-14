const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
