const bcrypt = require('bcrypt');
const { Admin, User } = require('../models/typeOfUsers'); // Adjust path based on your file structure
const coonectedDatabase = require("../connection/connection");

const createAdminByAdmin = async (req, res) => {
  try {
    await coonectedDatabase();

    // 1. Extra security check (though your restrictTo middleware should already handle this)
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ success: false, msg: "Access denied. Admins only." });
    }

    const { name, email, password, acceptOrders, assigningDriver } = req.body;

    // 2. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "Please provide name, email, and password." });
    }

    // 3. Check if a user with this email already exists
    const foundUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (foundUser) {
      return res.status(400).json({ 
        success: false, 
        msg: "User already registered with this email" 
      });
    }

    // 4. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create the new Admin using your Admin discriminator model
    const newAdmin = await Admin.create({
      name: name.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "Admin", // Automatically handled by discriminator, but safe to include
      acceptOrders: acceptOrders !== undefined ? acceptOrders : false,
      assigningDriver: assigningDriver || null,
    });

    // 6. Strip the password hash from the response object
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    return res.status(201).json({
      success: true,
      message: "New admin created successfully",
      data: adminResponse,
    });

  } catch (error) {
    console.error("Create Admin Error:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports =  createAdminByAdmin 
