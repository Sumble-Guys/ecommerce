const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema({
  userid: String,
  assignedid: { type: String, unique: true },
  aadharno: String,
  panno: String,
  documentid: String,
  taxid: String,
});

module.exports = mongoose.model("producers", producerSchema);
