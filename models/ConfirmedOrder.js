import mongoose from 'mongoose';

const confirmedOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Snapshot of items at time of purchase
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
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

export default mongoose.models.ConfirmedOrder || mongoose.model('ConfirmedOrder', confirmedOrderSchema);