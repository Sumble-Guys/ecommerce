const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/cart", cartController.getCart);
router.get("/removeall", cartController.removeAll);
router.get("/remove-from-cart", cartController.removeFromCart);
router.get("/updatepricecount", cartController.updatePriceCount);
router.get("/checkout", cartController.checkout);
router.get("/thankyou", cartController.getThankyou);

module.exports = router;
