const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    const userid = req.query.userid;
    const products = await Product.find({ userid, status: "InCart" });
    res.render("cart", { products, userid });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.removeAll = async (req, res) => {
  try {
    const userid = req.query.userid;
    await Product.deleteMany({ userid, status: "InCart" });
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.deleteOne({ _id: id });
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.updatePriceCount = async (req, res) => {
  const id = req.query.id;
  const count = parseInt(req.query.count, 10);
  const price = parseFloat(req.query.price);
  try {
    await Product.updateOne(
      { _id: id },
      { $set: { quantity: count, price } }
    );
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.checkout = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.updateMany(
      { userid: id },
      { $set: { status: "Ordered" } }
    );
    res.redirect("/thankyou");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.getThankyou = (req, res) => {
  res.render("thankyou");
};
