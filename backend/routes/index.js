const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const producerRoutes = require("./producerRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const locationController = require("../controllers/locationController");

router.use("/", authRoutes);
router.use("/", productRoutes);
router.use("/", cartRoutes);
router.use("/", adminRoutes);
router.use("/", userRoutes);
router.use("/", appointmentRoutes);
router.use("/", producerRoutes);
router.use("/", wishlistRoutes);
router.get("/location", locationController.getLocation);

router.get("/", (req, res) => res.redirect("/login"));

module.exports = router;
