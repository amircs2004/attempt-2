const mongoose = require("mongoose");

const confirmedOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: Number,
          required: true,
        },
        title: String,
        priceAtPurchase: Number,
        quantity: Number,
        thumbnail: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      formattedAddress: String, // Map address string
      lat: Number, // Map latitude
      lng: Number, // Map longitude
    },

    //geoNear for json 2dsphere index
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // Expects [longitude, latitude]
        required: false,
      },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "assigned", "delivered", "cancelled"],
      default: "processing",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
      default: null, //  Starts empty until a driver claims/is assigned
      index: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.ConfirmedOrder ||
  mongoose.model("ConfirmedOrder", confirmedOrderSchema);
