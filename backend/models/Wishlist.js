const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userid: String,
  username: String,
  producerid: String,
  producername: String,
  name: String,
  price: Number,
  imgUrl: String,
  quantity: Number,
  status: { type: String, default: "InCart" },
  date: String,
});

module.exports = mongoose.model("wishlist", productSchema);
