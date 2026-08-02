const Order = require("../models/order");
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
}
const updateProductQuantityInOrder = async (req, res) => {
  try {
    await coonectedDatabase(); // Always call the database connection function

    const userId = req.user.id; // Matches your JWT payload: id: newUser._id
    const { productId } = req.params;
    const { change, orderId } = req.body;

    // SECURITY CHECK: Ensure the order exists AND belongs to the logged-in user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    // Convert productId to Number to match your schema type
    const targetProductId = Number(productId);

    // Find the item inside the order items array
    const item = order.items.find((i) => i.productId === targetProductId);

    if (!item) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    // Update quantity (increases if +1, decreases if -1)
    item.quantity += change;

    // If quantity drops to 0 or below, remove the item entirely
    if (item.quantity <= 0) {
      order.items = order.items.filter(
        (i) => i.productId !== targetProductId
      );
    }

    await order.save();
    return res.status(200).json({ message: "Quantity updated successfully", order });

  } catch (error) {
    console.error("Error updating product quantity:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addProductToOrder, removeProductFromOrder, getAllOrders  , updateProductQuantityInOrder};
