const bcrypt = require("bcrypt");
const User = require("../models/User");
const authState = require("../config/authState");

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const valid = await user.validPassword(password);
      if (valid) {
        authState.userid = user._id;
        authState.role = user.role;
        if (authState.role === 1) {
          return res.redirect("/admin/dashboard");
        }
        return res.render("img.ejs", { user });
      }
      return res.send({ message: "Password didn't match" });
    }
    res.redirect("/register");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.postRegister = async (req, res) => {
  const { email, name, password, address, contact, pin } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.redirect("/login");
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      contact,
      address,
      hash: hashPass,
      pin,
      role: 0,
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
