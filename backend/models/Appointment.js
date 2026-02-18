const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  appointmentText: String,
  appointmentName: String,
  appointmentConsumer: String,
  completed: { type: String, default: 0 },
});

module.exports = mongoose.model("appointment", appointmentSchema);
