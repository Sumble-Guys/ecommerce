const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/ecommerce", productController.ecommerce);
router.get("/displayproduct", productController.displayProduct);
router.get("/add-to-cart", productController.addToCart);
router.get("/search", productController.search);
router.get("/categories", productController.categories);
router.get("/producer", productController.getProducerPage);

module.exports = router;
