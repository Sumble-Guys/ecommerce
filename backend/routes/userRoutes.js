const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const appointmentController = require("../controllers/appointmentController");

router.get("/user/dashboard", userController.dashboard);
router.get("/user/orders", userController.orders);
router.get("/user/addproduct", userController.addProductPage);
router.get("/user/producer", userController.producerStats);
router.get("/user/appointments", appointmentController.userAppointments);
router.get("/address", userController.addressPage);
router.get("/checkid", userController.checkId);

module.exports = router;
