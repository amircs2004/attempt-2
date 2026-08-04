const mongoose = require('mongoose');

const confirmedOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        productId: { 
          type: Number, 
          required: true 
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
      lat: Number,              // Map latitude
      lng: Number,              // Map longitude
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ConfirmedOrder || mongoose.model('ConfirmedOrder', confirmedOrderSchema);