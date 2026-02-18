const User = require("../models/User");
const Product = require("../models/Product");

exports.dashboard = async (req, res) => {
  try {
    const userid = req.query.userid;
    const user = await User.findOne({ _id: userid });
    const ordered = await Product.find({ userid, status: "Ordered" });
    res.render("userdashboard", { user, ordered });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.orders = async (req, res) => {
  try {
    const userid = req.query.userid;
    const user = await User.findOne({ _id: userid });
    const products = await Product.find({ userid, status: "Ordered" });
    res.render("userorders", { user, products });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.addProductPage = async (req, res) => {
  try {
    const userid = req.query.userid;
    const user = await User.findOne({ _id: userid });
    if (user.Itemproduced === 0) {
      return res.render("registerlink", { user });
    }
    res.render("addnewproductuser", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.producerStats = async (req, res) => {
  try {
    const producerid = req.query.userid;
    const user = await User.findOne({ _id: producerid });
    const ProductModel = require("../models/Product");
    const Wishlist = require("../models/Wishlist");
    const producerProducts = await ProductModel.find({
      producerid,
      status: "Ordered",
    });
    const productCountMap = new Map();
    for (const p of producerProducts) {
      const productId = p.name;
      if (!productCountMap.has(productId)) {
        productCountMap.set(productId, {
          productInfo: p,
          uniqueUserIds: new Set(),
        });
      }
      productCountMap.get(productId).uniqueUserIds.add(p.userid);
    }
    const resultArray = Array.from(productCountMap.values()).map((entry) => ({
      productInfo: entry.productInfo,
      userCount: entry.uniqueUserIds.size,
    }));
    const likedProducts = await Wishlist.find({ producerid });
    const likedProductCountMap = new Map();
    for (const lp of likedProducts) {
      const productId = lp.name;
      if (!likedProductCountMap.has(productId)) {
        likedProductCountMap.set(productId, {
          productInfo: lp,
          uniqueUserIds: new Set(),
        });
      }
      likedProductCountMap.get(productId).uniqueUserIds.add(lp.userid);
    }
    const likedResultArray = Array.from(likedProductCountMap.values()).map(
      (entry) => ({
        productInfo: entry.productInfo,
        userCount: entry.uniqueUserIds.size,
      })
    );
    res.render("productstats", { resultArray, likedResultArray, user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.addressPage = (req, res) => {
  res.render("address");
};

exports.checkId = async (req, res) => {
  try {
    const userid = req.query.userid;
    const user = await User.findOne({ _id: userid });
    res.render("addnewproductuser", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
