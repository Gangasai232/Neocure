import authModel from "../models/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { username, email, password } = req.body;

  try {
    const found = await authModel.findOne({ email: email });
    if (found) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, try to login",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new authModel({
      name: username,
      email: email,
      password: hashedPass,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User successfully registered",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while processing your request",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  //Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const found = await authModel.findOne({ email: email });

    if (!found) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials, please try again",
      });
    }

    const match = await bcrypt.compare(password, found.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: found._id, role: found.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.status(200).json({
      success: true,
      message: "User successfully logged in",
      token,
      data: {
        id: found._id,
        name: found.name,
        email: found.email,
        role: found.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server error while processing your request: ${err}`,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out. Please remove the token on the client.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server error while processing logout: ${err.message}`,
    });
  }
};

export { registerUser, loginUser, logoutUser };
