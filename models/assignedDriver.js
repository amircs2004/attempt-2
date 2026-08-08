const mongoose = require("mongoose");

const assignedDriverSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "accepted", "rejected", "completed"],
      default: "assigned",
      lowercase: true,
      trim: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { 
    timestamps: true, 
    collection: "assineddrivers" 
  }
);

const AssignedDriver = mongoose.model("AssignedDriver", assignedDriverSchema);

module.exports = AssignedDriver;