import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    headDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const departmentModel = mongoose.model("departments", departmentSchema);

export default departmentModel;