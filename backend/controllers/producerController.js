const crypto = require("crypto");
const User = require("../models/User");
const Producer = require("../models/Producer");
const ProducerNotification = require("../models/ProducerNotification");

exports.notifications = async (req, res) => {
  try {
    const userid = req.query.userid;
    const user = await User.findOne({ _id: userid });
    const notifications = await ProducerNotification.find({
      producerid: userid,
    });
    res.render("producerNotifications", { notifications, user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.registerProducer = async (req, res) => {
  try {
    const { userid, aadharno, panno, documentid, taxid } = req.body;
    const user = await User.findOne({ _id: userid });
    const secretKey = String(user._id);
    const randomString = Math.random().toString(36).substring(2, 18);
    const data = randomString + secretKey;
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    const generatedId = hash.substring(0, 16);
    const newProducer = new Producer({
      userid,
      assignedid: generatedId,
      aadharno,
      panno,
      documentid,
      taxid,
    });
    await newProducer.save();
    res.redirect(`/completekyc?userid=${userid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.updateItemProduced = async (req, res) => {
  try {
    const producerid = req.query.userid;
    await User.updateOne(
      { _id: producerid },
      { $set: { Itemproduced: 1 } }
    );
    const user = await User.findOne({ _id: producerid });
    res.render("addnewproductuser", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};
