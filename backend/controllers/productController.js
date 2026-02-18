const User = require("../models/User");
const Product = require("../models/Product");
const AllProduct = require("../models/AllProduct");
const authState = require("../config/authState");

function formattedDateTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const meridiem = date.getHours() >= 12 ? "PM" : "AM";
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${meridiem}`;
}

exports.ecommerce = async (req, res) => {
  try {
    const userid = req.query.userid;
    const products = await AllProduct.find({});
    const user = await User.findOne({ _id: userid });
    res.render("ecommerce", {
      products,
      userid: user._id,
      username: user.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.displayProduct = async (req, res) => {
  try {
    const { userid, producerid, productid } = req.query;
    const product = await AllProduct.findOne({ _id: productid });
    const producer = await User.findOne({ _id: producerid });
    const user = await User.findOne({ _id: userid });
    res.render("displayproduct", { product, producer, user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.addToCart = async (req, res) => {
  const userid = req.query.userid;
  const user = await User.findOne({ _id: userid });
  const name = req.query.productName;
  const producerid = req.query.producerid;
  const producername = req.query.producername;
  const price = parseFloat(req.query.productCost);
  const imgUrl = req.query.imgUrl;
  const dateStr = formattedDateTime();
  try {
    const p = await Product.find({ userid, name });
    if (p.length > 0) {
      await Product.updateOne({ _id: p[0]._id }, { $inc: { quantity: 1 } });
    } else {
      const newProduct = new Product({
        userid,
        username: user.name,
        producerid,
        producername,
        name,
        price,
        imgUrl,
        date: dateStr,
      });
      await newProduct.save();
    }
    res.redirect(`/ecommerce?userid=${userid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.search = async (req, res) => {
  const name = req.query.productName;
  try {
    const products = await AllProduct.find({ name });
    const user = await User.find({ _id: authState.userid });
    res.render("ecommerce", {
      products,
      username: user[0] ? user[0].name : "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.categories = async (req, res) => {
  const name = req.query.productName;
  try {
    const products = await AllProduct.find({ name });
    const user = await User.find({ _id: authState.userid });
    res.render("ecommerce", {
      products,
      username: user[0] ? user[0].name : "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProducerPage = async (req, res) => {
  try {
    const { userid, producerid, productid } = req.query;
    const user = await User.findOne({ _id: producerid });
    const product = await AllProduct.findOne({ _id: productid });
    const products = await AllProduct.find({ producerid });
    res.render("producer", { user, product, products, userid, producerid });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
