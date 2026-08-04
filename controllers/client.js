const Order = require("../models/order");
const confirmedOrder = require("../models/ConfirmedOrder");
const coonectedDatabase = require("../connection/connection");

// ADD PRODUCT TO ORDER
const addProductToOrder = async (req, res) => {
  try {
    await coonectedDatabase();

    const userId = req.user.id;
    const productData = req.body;

    let order = await Order.findOne({ userId, status: "active" });

    if (!order) {
      order = new Order({ userId, items: [], status: "active" });
    }

    order.items.push(productData);

    await order.save();
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE PRODUCT FROM ORDER
const removeProductFromOrder = async (req, res) => {
  try {
    await coonectedDatabase();

    const userId = req.user.id;
    const { productId } = req.params;

    const order = await Order.findOne({ userId, status: "active" });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Active order not found" });
    }

    order.items = order.items.filter(
      (item) => String(item.productId) !== String(productId),
    );

    await order.save();
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error removing product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    await coonectedDatabase();
    const userId = req.user.id;
    // userId -> ALL ORDERS CONDUCTED BY THIS CUSTOMER
    const orders = await Order.find({ userId });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateProductQuantityInOrder = async (req, res) => {
  try {
    await coonectedDatabase();

    const userId = req.user.id;
    const { productId } = req.params;
    const { change, orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    const targetProductId = Number(productId);
    const item = order.items.find(
      (i) => Number(i.productId) === targetProductId,
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    // Safely enforce numbers to completely prevent NaN errors
    const currentQty = Number(item.quantity) || 1;
    const numericChange = Number(change) || 0;

    item.quantity = currentQty + numericChange;

    if (item.quantity <= 0) {
      order.items = order.items.filter(
        (i) => Number(i.productId) !== targetProductId,
      );
    }

    await order.save();
    return res
      .status(200)
      .json({ message: "Quantity updated successfully", order });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const confirmOrder = async (req, res) => {
  try {
    await coonectedDatabase();

    const userId = req.user.id;
    const { itemsDetails, totalAmount, shippingAddress, paymentMethod } =
      req.body;

    // 1. Fetch the user's active cart
    const foundOrder = await Order.findOne({ userId, status: "active" });

    if (!foundOrder || foundOrder.items.length === 0) {
      return res
        .status(404)
        .json({ message: "No active order found or cart is empty." });
    }
  

    // 2. Create the permanent ConfirmedOrder document
    const createdConfirmedOrder = await confirmedOrder.create({
      userId,
      items: foundOrder.items || [], // Array of snapshot objects: { productId, title, priceAtPurchase, quantity, thumbnail }
      totalAmount: totalAmount || 0,
      shippingAddress: {
        street: shippingAddress.street || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postalCode || "",
        formattedAddress:
          shippingAddress.formattedAddress || shippingAddress.street,
        lat: shippingAddress.lat || null,
        lng: shippingAddress.lng || null,
      },
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    // 3. Delete the active cart from Order collection
    await Order.deleteOne({ _id: foundOrder._id });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: createdConfirmedOrder,
    });
  } catch (error) {
    console.error("Confirm Order Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Server error confirming order." });
  }
};

module.exports = {
  addProductToOrder,
  removeProductFromOrder,
  getAllOrders,
  updateProductQuantityInOrder,
  confirmOrder,
};
