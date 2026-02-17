const mongoose = require('mongoose');

const allproductSchema = new mongoose.Schema({
  name: String,
  producerid: String,
  producername: String,
  imgUrl: String,
  info: String,
  price: Number,
  category: String,
});

module.exports = mongoose.model('allproducts', allproductSchema);
