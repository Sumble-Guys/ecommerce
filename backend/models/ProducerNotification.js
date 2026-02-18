const mongoose = require("mongoose");

const producernotificationSchema = new mongoose.Schema({
  adminid: { type: String, default: "65126c15d82d69b8a5ce16a9" },
  achieved: String,
  count: String,
  date: String,
  producerid: String,
  producerName: String,
  productname: String,
  productImg: String,
  productprice: Number,
});

module.exports = mongoose.model(
  "producerNotifications",
  producernotificationSchema
);
