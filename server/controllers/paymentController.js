import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const saveTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const userID = req.user.id;
  try {
    const transaction = await transactionModel.create({ ...req.body, userID });
    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error creating transaction",
      error: err.message,
    });
  }
};

const getTransactions = async (req, res) => {
  const userID = req.user.id;
  try {
    const transactions = await transactionModel
      .find({
        userID,
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Transactions retrieved",
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({}).populate("userID");

    return res.status(200).json({
      success: true,
      message: "All transactions retrieved",
      data: transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error retrieving transactions",
      error: err.message,
    });
  }
};

export { createOrder, saveTransaction, getTransactions, getAllTransactions };
