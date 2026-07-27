const mongoose = require("mongoose");

const options = { discriminatorKey: "role", timestamps: true };

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  options
);

const User = mongoose.model("User", userSchema);

const Driver = User.discriminator(
  "Driver",
  new mongoose.Schema({
    Car: {
      type: String
    },
    phoneNumber: {
      type: Number
    }
  })
);

const Customer = User.discriminator(
  "Customer",
  new mongoose.Schema({
    homeAddress: {
      type: String
    },
    phoneNumber: {
      type: Number
    },
    PaymentWay: {
      type: String,
      enum: ['payer en especes', 'E payment']
    }
  })
);

const Admin = User.discriminator(
  "Admin",
  new mongoose.Schema({
    assigningDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    acceptOrders: {
      type: Boolean,
      default: false
    }
  })
);

module.exports = { User, Driver, Customer, Admin };