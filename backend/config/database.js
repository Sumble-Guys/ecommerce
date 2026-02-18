const mongoose = require("mongoose");
const colors = require("colors");

const uri =
  "mongodb+srv://AkhilBhimanadham:123@cluster0.zrolywl.mongodb.net/bharathbazaar";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(
      `Connected to MongoDB Successfully ${conn.connection.host} `.bgGreen.white
    );
  } catch (err) {
    console.log(`Error connecting to MongoDB`.bgWhite.red);
  }
};

module.exports = connectDB;
