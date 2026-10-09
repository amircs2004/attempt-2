const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const coonectedDatabase = require("../connection/connection");
const { User, Driver, Customer } = require("../models/typeOfUsers");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    await coonectedDatabase();
    const foundUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (foundUser) {
      return res.status(400).json({
        msg: "user already registered with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    let payLoad;

    if (role === "Driver") {
      newUser = await Driver.create({
        name: name.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "Driver",
      });
      payLoad = {
        id: newUser._id,
        role: "Driver",
      };
    } else if (role === "Customer") {
      newUser = await Customer.create({
        name: name.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "Customer",
      });
      payLoad = {
        id: newUser._id,
        role: "Customer",
      };
    } else {
      return res.status(400).json({ msg: "Invalid or missing role specified" });
    }

    const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // i need to create refresh token
    return res.status(201).json({
      data: newUser,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await coonectedDatabase();
    const foundUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!foundUser) {
      return res.status(404).json({ msg: "user not found" });
    }
    const isPassWordMatch = await bcrypt.compare(password, foundUser.password);

    if (!isPassWordMatch) {
      return res.status(401).json({ msg: "password not matched" });
    }
    //this code has problem that im senfing the password in the response so i need to remove it from the response and send only the user data without the password
    const payLoad = {
      id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };

    const token = await jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token: token,
      data: foundUser,
    });
  } catch (error) {
    return res.status(500).json({ msg: "error" });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      msg: "logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ msg: "error" });
  }
};
const getProfile = async (req, res) => {
  try {
    await coonectedDatabase();

    const userAccount = await User.findById(req.user.id);

    return res.status(200).json({ data: userAccount });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const googleAuth = async (req, res) => {
  const { role } = req.body;

  try {
    await coonectedDatabase();

    const { id: supabaseId, email, user_metadata } = req.authUser;
    const normalizedEmail = email.toLowerCase().trim();

    const rawName =
      user_metadata?.full_name ||
      user_metadata?.name ||
      normalizedEmail.split("@")[0];

    // 1. Check if user already exists in MongoDB by supabaseId or email
    let existingUser = await User.findOne({
      $or: [{ supabaseId }, { email: normalizedEmail }],
    });

    if (existingUser) {
      if (!existingUser.supabaseId) {
        existingUser.supabaseId = supabaseId;
        await existingUser.save();
      }

      const userResponse = existingUser.toObject();
      delete userResponse.password;
      const token = generateToken(existingUser._id);
      // FIX ADDED HERE: Include success: true
      return res.status(200).json({
        success: true,
        msg: "Google user logged in successfully",
        token: token,
        data: userResponse,
      });
    }

    // 2. If user doesn't exist, register them based on the requested role
    if (!role || (role !== "Driver" && role !== "Customer")) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or missing role specified for Google registration",
      });
    }

    let newUser;
    if (role === "Driver") {
      newUser = await Driver.create({
        supabaseId,
        name: rawName.trim(), // Optional: kept original casing instead of forcing lowercase
        email: normalizedEmail,
        role: "Driver",
      });
    } else if (role === "Customer") {
      newUser = await Customer.create({
        supabaseId,
        name: rawName.trim(),
        email: normalizedEmail,
        role: "Customer",
      });
    }

    const userResponse = newUser.toObject();
    delete userResponse.password;
    const token = generateToken(newUser._id);
    // FIX ADDED HERE: Include success: true
    return res.status(201).json({
      success: true,
      msg: "User registered successfully via Google Auth",
      token: token,
      data: userResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
module.exports = {
  register,
  login,
  logout,
  getProfile,
  googleAuth,
};
