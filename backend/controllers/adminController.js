const User = require("../models/User");
const Product = require("../models/Product");
const AllProduct = require("../models/AllProduct");
const Wishlist = require("../models/Wishlist");
const ProducerNotification = require("../models/ProducerNotification");

function formattedDateTime() {
  const date = new Date();
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  const meridiem = date.getHours() >= 12 ? "PM" : "AM";
  return `${y}-${m}-${d} ${h}:${min}:${s} ${meridiem}`;
}

exports.dashboard = async (req, res) => {
  try {
    const ordered = await Product.find({ status: "Ordered" });
    const InCart = await Product.find({ status: "InCart" });
    const customers = await User.find({});
    ordered.sort((a, b) => b.date - a.date);
    const formattedDateTimeStr = formattedDateTime();
    const products = await Wishlist.find({});
    const userCountMap = new Map();
    products.forEach((p) => {
      if (!userCountMap.has(p.name)) userCountMap.set(p.name, new Set());
      userCountMap.get(p.name).add(p);
    });
    const productLikes = Array.from(userCountMap, ([productName, product]) => ({
      productName,
      likes: product.size,
      product,
    }));
    for (const product of productLikes) {
      if (product.likes >= 3) {
        try {
          const pro = await AllProduct.findOne({ name: product.productName });
          const isExisted = await ProducerNotification.findOne({
            productname: product.productName,
          });
          if (!isExisted && pro) {
            const notif = new ProducerNotification({
              achieved: "Likes",
              count: String(product.likes),
              date: formattedDateTimeStr,
              producerid: pro.producerid,
              producerName: pro.producername,
              productname: pro.name,
              productImg: pro.imgUrl,
              productprice: pro.price,
            });
            await notif.save();
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    productLikes.sort((a, b) => b.likes - a.likes);
    res.render("admin", { ordered, InCart, customers, productLikes });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.addNewProductPage = (req, res) => {
  res.render("addnewproduct");
};

exports.addProduct = async (req, res) => {
  try {
    const { name, imgUrl, price, quantity } = req.body;
    const newProduct = new AllProduct({ name, imgUrl, price, quantity });
    await newProduct.save();
    res.render("addnewproduct");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.products = async (req, res) => {
  try {
    const products = await AllProduct.find({});
    res.render("products", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id, name, price, imgUrl, quantity } = req.query;
    res.render("update", { product: { id, name, price, imgUrl, quantity } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id, name, price, imgUrl, quantity } = req.body;
    await AllProduct.updateOne(
      { _id: id },
      { $set: { name, price, imgUrl, quantity } }
    );
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.deletePage = async (req, res) => {
  try {
    const products = await AllProduct.find({});
    res.render("delete", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    await AllProduct.deleteOne({ _id: id });
    res.redirect("/admin/delete");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.query.id;
    await AllProduct.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/dashboard");
  }
};

exports.customers = async (req, res) => {
  try {
    const u = await User.find({});
    res.render("customers", { u });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.totalOrders = async (req, res) => {
  try {
    const u = await User.find({});
    const userorders = [];
    await Promise.all(
      u.map(async (user) => {
        const ordered = await Product.find({
          userid: user._id,
          status: "Ordered",
        });
        const inCart = await Product.find({
          userid: user._id,
          status: "InCart",
        });
        userorders.push({
          user,
          orderedlen: ordered.length,
          incartlen: inCart.length,
          totallen: ordered.length + inCart.length,
        });
      })
    );
    res.render("totalorders", { userorders });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.orders = async (req, res) => {
  try {
    const u = await User.find({});
    const userorders = [];
    await Promise.all(
      u.map(async (user) => {
        const ordered = await Product.find({
          userid: user._id,
          status: "Ordered",
        });
        userorders.push({ user, products: ordered });
      })
    );
    res.render("orders", { userorders });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.favourites = async (req, res) => {
  try {
    const allUsers = await User.find({});
    const usersWithLikes = [];
    for (const user of allUsers) {
      const likedProducts = await Wishlist.find({ userid: user._id });
      usersWithLikes.push({ user, likedProducts });
    }
    res.render("favourites", { usersWithLikes });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
