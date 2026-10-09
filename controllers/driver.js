const ConfirmedOrder = require('../models/ConfirmedOrder')
const { Driver } = require('../models/typeOfUsers')
const coonectedDatabase = require("../connection/connection");

const getNearestOrderForDriver = async (req , res) => {

  try {
    await coonectedDatabase();

    const {  lng, lat } = req.body;
    console.log(" Driver Coords Received from Frontend -> Longitude:", lng, "Latitude:", lat);
// we rely on the protect middleware to pass us the driver id 
    const driverId = req.user?.id || req.user?._id;

    if (!lng || !lat) {
      return res.status(400).json({ success: false, error: "Driver coordinates are required." });
    }

    // Optional: Update the driver's current location in their profile 
    // so you can track them on a map later!
    if (driverId) {
      await Driver.findByIdAndUpdate(driverId, {
        currentLocation: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        }
      });
    }

    // Find the absolute closest pending order using MongoDB's $geoNear
    const nearestOrders = await ConfirmedOrder.aggregate([
      {
        $geoNear: {
          near: { 
            type: "Point", 
            coordinates: [parseFloat(lng), parseFloat(lat)] 
          },
          distanceField: "distanceInMeters", // MongoDB calculates distance for you
          spherical: true,
          query: { orderStatus: "processing" } // Only look for processing orders
        }
      },
      { $limit: 1 } // Grab only the closest one
    ]);

    const targetOrder = nearestOrders[0] || null;

    if (!targetOrder) {
      return res.status(404).json({ success: false, message: "No active orders found nearby." });
    }

    return res.status(200).json({
      success: true,
      data: targetOrder,
      distanceKm: (targetOrder.distanceInMeters / 1000).toFixed(2) // Convert meters to kilometers
    });

  } catch (err) {
    console.error("Error in getNearestOrderForDriver:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

const assigneDriver = async (req, res) => {
  try {
    console.log("=== START: assigneDriver Controller Called ===");
    
    // 1. Log headers to verify if the Authorization Bearer token is arriving
    console.log("Headers received:", {
      authorization: req.headers.authorization ? "Bearer token present" : "MISSING AUTHORIZATION HEADER",
      rawAuthorization: req.headers.authorization
    });

    // 2. Log what the protect middleware attached to req.user
    console.log("req.user object:", req.user);

    await coonectedDatabase();

    const driverId = req.user?.id || req.user?._id || req.user?.userId;
    console.log("Extracted driverId:", driverId);

    if (!driverId) {
      console.log("❌ FAILURE: Driver ID is missing. req.user did not contain 'id', '_id', or 'userId'.");
      return res.status(400).json({ success: false, message: "Driver ID is missing" });
    }

    // 3. Log request body to check the order ID
    console.log("Request body received:", req.body);
    const confirmedOrderId = req.body?._id;
    console.log("Extracted confirmedOrderId:", confirmedOrderId);

    if (!confirmedOrderId) {
      console.log("❌ FAILURE: Order ID (_id) is missing from req.body.");
      return res.status(400).json({ success: false, message: "Order ID is missing" });
    }

    const assignedDriver = await Driver.findByIdAndUpdate(
      driverId, 
      { assigned: true }, 
      { new: true }
    );
    console.log("Database Driver found & updated:", assignedDriver ? assignedDriver._id : "NOT FOUND");

    if (!assignedDriver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    const assignedOrder = await ConfirmedOrder.findOneAndUpdate(
      { _id: confirmedOrderId, orderStatus: "processing" },
      { 
        orderStatus: "assigned", 
        assignedDriver: driverId 
      },
      { new: true }
    );
    console.log("Database Order found & updated:", assignedOrder ? assignedOrder._id : "NOT FOUND OR ALREADY ASSIGNED");

    if (!assignedOrder) {
      await Driver.findByIdAndUpdate(driverId, { assigned: false });
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log("=== SUCCESS: Driver assigned successfully ===");
    return res.status(200).json({ 
      success: true, 
      message: "Driver assigned successfully", 
      assignedOrder, 
      assignedDriver 
    });

  } catch (error) {
    console.error("🔥 Error in assigneDriver catch block:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getDriverOrders = async (req , res) => {
  try{
    await coonectedDatabase()
    const driver = req.user?._id ||req.user.id || req.user?.userId;

     if(!driver){
      return res.status(400).json({success: false , message: "Driver id is missing"}) 
     }
  const driverAcceptedOrders = await ConfirmedOrder.find({assignedDriver: driver}).sort({ createdAt: -1 });
 if(!driverAcceptedOrders){
  return res.status(404).json({success: false , message: "No orders found for this driver"})  
 }
  return res.status(200).json({success: true , count: driverAcceptedOrders.length ,data: driverAcceptedOrders}) 

  }catch(error){
    return res.status(500).json({success: false , message: "Server error"})
  }
}

module.exports = {
    getNearestOrderForDriver ,
    assigneDriver , 
    getDriverOrders
}
