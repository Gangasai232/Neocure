import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["patient", "doctor", "admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

const authModel = mongoose.model("users", authSchema);

export default authModel;
