const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash: String,
    role: {
      type: Number,
      default: 0,
    },
    contact: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    pin: {
      type: String,
    },
    Itemproduced: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

usersSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.hash);
};

module.exports = mongoose.model('users', usersSchema);
