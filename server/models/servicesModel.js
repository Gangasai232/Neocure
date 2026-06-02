import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["diagnostic", "consultation", "surgery", "therapy", "other"],
      default: "other",
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: "30 minutes",
    },
  },
  { timestamps: true }
);

const servicesModel = mongoose.model("services", servicesSchema);

export default servicesModel;
