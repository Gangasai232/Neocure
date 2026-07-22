import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patients",
      required: true,
      index: true,
    },
    doctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
      default: null,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    treatmentPlan: {
      type: String,
      trim: true,
      default: "",
    },
    prescriptions: [
      {
        _id: false,
        medicine: { type: String, trim: true },
        dosage: { type: String, trim: true },
        frequency: { type: String, trim: true },
      },
    ],
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({ patientID: 1, visitDate: -1 });

const medicalRecordModel = mongoose.model("medical_records", medicalRecordSchema);

export default medicalRecordModel;