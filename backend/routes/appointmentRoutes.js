const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/schedule-appointment", appointmentController.scheduleAppointment);

module.exports = router;
