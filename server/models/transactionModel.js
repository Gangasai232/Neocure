import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orderID: {
      type: String,
      required: true,
    },
    paymentID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    receipt: {
      type: String,
    },
    items: [
      {
        _id: false, // Optional to avoid Mongoose creating extra _ids
        name: String,
        price: Number,
        duration: String,
      },
    ],
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transactions", transactionSchema);

export default transactionModel;
