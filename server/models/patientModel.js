import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    phone: {
      type: String,
      required: true,
      match: /^\d+$/,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.post("save", async (pat, next) => {
  try {
    await mongoose.model("users").findByIdAndUpdate(pat.patientID, {
      $set: { role: "patient" },
    });
    next();
  } catch (err) {
    next(err);
  }
});

patientSchema.post("findOneAndDelete", async (pat) => {
  if (pat) {
    // Example: Update user's role back to 'user'
    await mongoose.model("users").findByIdAndUpdate(pat.patientID, {
      $set: { role: "user" },
    });
  }
});

const patientModel = mongoose.model("patients", patientSchema);

export default patientModel;
