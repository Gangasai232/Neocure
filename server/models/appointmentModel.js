import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patients",
      required: true,
    },
    doctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  { doctorID: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);

export default appointmentModel;
