const mongoose = require("mongoose");
const confirmedOrder = require("../models/ConfirmedOrder");
const user = require("../models/typeOfUsers");
const coonectedDatabase = require("../connection/connection");
const assignedDriver = require('../models/assignedDriver')

const assignDriverToOrder = async (req , res) => {
    try {
     await coonectedDatabase()
      
     const {orderId , driverId}  = req.body
     if (!mongoose.Types.ObjectId.isValid(driverId) || !mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "i can see u fucking trying to pass no sql injection " });
}
     const selectDriver = await user.findOne({  _id :driverId , role: "Driver"}) 
     if(!selectDriver){
        return res.status(404).json({success: false , message: "Driver not found"})
     }
      const order = await confirmedOrder.findById(orderId)
      if(!order){
        return res.status(404).json({success: false , message: "Order not found"})
      }
      const assineDriver = await assignedDriver.create({
           driver: driverId ,
            order: orderId ,
          
            assignedBy: req.user.id ,
          
      }) 
      return res.status(200).json({success: true , data: assineDriver})
    }catch(error){
     return res.status(500).json({success: false , message: "Server error"})
    }
}


module.exports = assignDriverToOrder