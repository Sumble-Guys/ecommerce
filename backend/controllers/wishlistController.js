const User = require("../models/User");
const Wishlist = require("../models/Wishlist");

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

exports.addToWishlist = async (req, res) => {
  const userid = req.query.userid;
  const name = req.query.productName;
  const producerid = req.query.producerid;
  const producername = req.query.producername;
  const price = parseFloat(req.query.productCost);
  const imgUrl = req.query.imgUrl;
  try {
    const p = await Wishlist.find({ userid, name });
    if (p.length > 0) {
      return res.redirect(`/ecommerce?userid=${userid}`);
    }
    const user = await User.findOne({ _id: userid });
    const newProduct = new Wishlist({
      userid,
      username: user.name,
      producerid,
      producername,
      name,
      price,
      imgUrl,
      date: formattedDateTime(),
    });
    await newProduct.save();
    res.redirect(`/ecommerce?userid=${userid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const id = req.query.id;
    const userid = req.query.userid;
    await Wishlist.deleteOne({ userid, _id: id });
    res.redirect(`/wishlist?userid=${userid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
    res.redirect("/cart");
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userid = req.query.userid;
    const products = await Wishlist.find({ userid });
    res.render("wishlist", { products, userid });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
