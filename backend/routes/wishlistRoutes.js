const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.get("/addtowishlist", wishlistController.addToWishlist);
router.get("/removefromwishlist", wishlistController.removeFromWishlist);
router.get("/wishlist", wishlistController.getWishlist);

module.exports = router;
