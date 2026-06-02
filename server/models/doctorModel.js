import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorID: {
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
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    age: {
      type: Number,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Away"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.post("save", async (doc, next) => {
  try {
    await mongoose.model("users").findByIdAndUpdate(doc.doctorID, {
      $set: { role: "doctor" },
    });
    next();
  } catch (err) {
    next(err);
  }
});

doctorSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // Example: Update user's role back to 'user'
    await mongoose.model("users").findByIdAndUpdate(doc.doctorID, {
      $set: { role: "user" },
    });
  }
});

const doctorModel = mongoose.model("doctors", doctorSchema);

export default doctorModel;
