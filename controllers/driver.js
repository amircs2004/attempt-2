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

const assigneDriver = async (req , res) => {
  try{
     await coonectedDatabase();
    const driverId = req.user?.id || req.user?._id;
    if(!driverId){
      return res.status(400).json({success : false , message : "Driver ID is missing "})
    }

    //for now we use req.body 
    const  confirmedOrderId = req.body?._id
    const assignedDriver = await Driver.findByIdAndUpdate(driverId , { assigned: true } , {new : true})
    
     const assignedOrder = await ConfirmedOrder.findOneAndUpdate(
      { _id: confirmedOrderId, orderStatus: "processing" },
      { 
        orderStatus: "assigned", 
        assignedDriver: driverId 
      },
      { new: true }
    ); 

     if(!assignedOrder){
      await Driver.findByIdAndUpdate(driverId, { assigned: false });
    return res.status(404).json({success : false , message : "Order not found"} )
     }
    if(!assignedDriver){
      return res.status(404).json({success : false , message : "Driver not found"} )
    }
     
    //we also have to update the status of the order 
    return res.status(200).json({success : true , message : "Driver assigned successfully" , assignedOrder , assignedDriver})

  }catch(error){
    console.error("Error in assigneDriver:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}


module.exports = {
    getNearestOrderForDriver ,
    assigneDriver
}
