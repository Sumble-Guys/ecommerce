const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.scheduleAppointment = async (req, res) => {
  try {
    const {
      userId,
      producerId,
      productId,
      appointmentDate,
      appointmentTime,
      appointmentText,
    } = req.body;
    const user = await User.findOne({ _id: producerId });
    const consumer = await User.findOne({ _id: userId });
    const appointment = new Appointment({
      userId,
      producerId,
      appointmentDate,
      appointmentTime,
      appointmentText,
      appointmentName: user.name,
      appointmentConsumer: consumer.name,
    });
    await appointment.save();
    res.redirect(
      `/producer?productid=${encodeURIComponent(productId)}&producerid=${encodeURIComponent(producerId)}&userid=${encodeURIComponent(userId)}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.userAppointments = async (req, res) => {
  try {
    const userid = req.query.userid;
    const user = await User.findOne({ _id: userid });
    const appointments = await Appointment.find({ userId: userid });
    const formattedAppointments = appointments.map((a) => ({
      ...a.toObject(),
      appointmentDate: a.appointmentDate.toISOString().split("T")[0],
    }));
    const appointments2 = await Appointment.find({ producerId: userid });
    const formattedAppointments2 = appointments2.map((a) => ({
      ...a.toObject(),
      appointmentDate: a.appointmentDate.toISOString().split("T")[0],
    }));
    res.render("userappointments", {
      user,
      formattedAppointments2,
      formattedAppointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
