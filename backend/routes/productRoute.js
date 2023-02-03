const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const protectRoute = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");

router.get("/products", protectRoute, getProducts);
router.get("/product/:productId", protectRoute, getProduct);
router.post("/", protectRoute, upload.single("image"), createProduct); // Option: upload.array("image")
router.patch("/update-product/:productId", protectRoute, updateProduct);
router.delete("/delete-product/:productId", protectRoute, deleteProduct);

module.exports = router;
