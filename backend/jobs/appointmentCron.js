const cron = require("node-cron");
const Appointment = require("../models/Appointment");

function startAppointmentCron() {
  cron.schedule("53 11 * * *", async () => {
    try {
      const currentTime = new Date();
      const result = await Appointment.updateMany(
        { completed: 0, appointmentDate: { $lt: currentTime } },
        { $set: { completed: 1 } }
      );
      console.log(`Marked ${result.modifiedCount} appointments as completed.`);
    } catch (error) {
      console.error("Error marking appointments as completed:", error);
    }
  });
}

module.exports = startAppointmentCron;
