import "./config/environment.js";
import express from "express";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

const clientBuildPath = path.join(__dirname, "..", "client", "dist");
const indexPath = path.join(clientBuildPath, "index.html");

if (fs.existsSync(indexPath)) {
  app.use(express.static(clientBuildPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Hospital Management Backend API is running",
    });
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on port ${PORT}`);
});
