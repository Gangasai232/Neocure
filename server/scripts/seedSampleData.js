import "../config/environment.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../config/connectDB.js";
import authModel from "../models/authModel.js";
import departmentModel from "../models/departmentModel.js";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";
import appointmentModel from "../models/appointmentModel.js";
import servicesModel from "../models/servicesModel.js";

const departments = [
  {
    name: "Cardiology",
    code: "CARD",
    description: "Heart and blood vessel diagnosis and treatment",
  },
  {
    name: "Neurology",
    code: "NEUR",
    description: "Brain, spinal cord, and nervous system care",
  },
  {
    name: "Orthopedics",
    code: "ORTH",
    description: "Bone, joint, and musculoskeletal care",
  },
  {
    name: "Pediatrics",
    code: "PEDS",
    description: "Medical care for infants, children, and adolescents",
  },
  {
    name: "General Medicine",
    code: "GENM",
    description: "Routine diagnosis, treatment, and preventive care",
  },
];

const doctors = [
  {
    name: "Aisha Reddy",
    email: "aisha.reddy@samplehospital.com",
    phone: "9000001001",
    gender: "Female",
    age: 39,
    specialization: "Interventional Cardiology",
    department: "Cardiology",
    status: "Active",
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@samplehospital.com",
    phone: "9000001002",
    gender: "Male",
    age: 44,
    specialization: "Neurology",
    department: "Neurology",
    status: "Active",
  },
  {
    name: "Neha Sharma",
    email: "neha.sharma@samplehospital.com",
    phone: "9000001003",
    gender: "Female",
    age: 37,
    specialization: "Pediatric Care",
    department: "Pediatrics",
    status: "Active",
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@samplehospital.com",
    phone: "9000001004",
    gender: "Male",
    age: 47,
    specialization: "Orthopedic Surgery",
    department: "Orthopedics",
    status: "Away",
  },
  {
    name: "Kavya Iyer",
    email: "kavya.iyer@samplehospital.com",
    phone: "9000001005",
    gender: "Female",
    age: 35,
    specialization: "Internal Medicine",
    department: "General Medicine",
    status: "Active",
  },
];

const services = [
  {
    name: "General Consultation",
    description: "Initial health assessment and treatment planning",
    category: "consultation",
    price: 500,
    duration: "20 minutes",
  },
  {
    name: "Cardiac Screening",
    description: "Comprehensive heart checkup with ECG",
    category: "diagnostic",
    price: 1800,
    duration: "45 minutes",
  },
  {
    name: "Neurology Consultation",
    description: "Specialist evaluation for neurological conditions",
    category: "consultation",
    price: 1200,
    duration: "30 minutes",
  },
  {
    name: "Physiotherapy Session",
    description: "Guided rehabilitation and mobility therapy",
    category: "therapy",
    price: 900,
    duration: "40 minutes",
  },
  {
    name: "Arthroscopy",
    description: "Minimally invasive joint surgery procedure",
    category: "surgery",
    price: 55000,
    duration: "2 hours",
  },
];

const patients = [
  {
    name: "Aarav Nair",
    email: "aarav.nair@samplemail.com",
    phone: "9880012001",
    age: 29,
    gender: "Male",
    description: "Frequent migraine and sleep disturbance",
  },
  {
    name: "Meera Singh",
    email: "meera.singh@samplemail.com",
    phone: "9880012002",
    age: 34,
    gender: "Female",
    description: "Postpartum checkup and fatigue review",
  },
  {
    name: "Rohan Gupta",
    email: "rohan.gupta@samplemail.com",
    phone: "9880012003",
    age: 42,
    gender: "Male",
    description: "Knee pain follow-up after sports injury",
  },
  {
    name: "Ishita Rao",
    email: "ishita.rao@samplemail.com",
    phone: "9880012004",
    age: 26,
    gender: "Female",
    description: "Recurring chest discomfort and palpitations",
  },
  {
    name: "Vivaan Joshi",
    email: "vivaan.joshi@samplemail.com",
    phone: "9880012005",
    age: 11,
    gender: "Male",
    description: "Seasonal allergy and pediatric consultation",
  },
];

const adminAccount = {
  name: "System Admin",
  email: "admin@samplehospital.com",
  password: "Admin@12345",
};

const addDays = (daysFromNow) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const seed = async () => {
  try {
    const connected = await connectDB();
    if (!connected || mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected. Seed aborted.");
    }

    for (const department of departments) {
      await departmentModel.findOneAndUpdate(
        { name: department.name },
        { $set: department },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const defaultHashedPassword = await bcrypt.hash("Password@123", 10);

    for (const doctor of doctors) {
      const user = await authModel.findOneAndUpdate(
        { email: doctor.email },
        {
          $set: {
            name: doctor.name,
            email: doctor.email,
            password: defaultHashedPassword,
            role: "doctor",
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await doctorModel.findOneAndUpdate(
        { doctorID: user._id },
        {
          $set: {
            doctorID: user._id,
            name: doctor.name,
            phone: doctor.phone,
            gender: doctor.gender,
            age: doctor.age,
            specialization: doctor.specialization,
            department: doctor.department,
            status: doctor.status,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    for (const service of services) {
      await servicesModel.findOneAndUpdate(
        { name: service.name },
        { $set: service },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const seededDoctors = await doctorModel.find({
      name: { $in: doctors.map((doctor) => doctor.name) },
    });

    const doctorMap = new Map(seededDoctors.map((doctor) => [doctor.name, doctor]));

    const seededPatients = [];
    for (const patient of patients) {
      const user = await authModel.findOneAndUpdate(
        { email: patient.email },
        {
          $set: {
            name: patient.name,
            email: patient.email,
            password: defaultHashedPassword,
            role: "patient",
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const patientDoc = await patientModel.findOneAndUpdate(
        { patientID: user._id },
        {
          $set: {
            patientID: user._id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            description: patient.description,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      seededPatients.push(patientDoc);
    }

    const appointments = [
      {
        patientName: "Ishita Rao",
        doctorName: "Aisha Reddy",
        date: addDays(1),
        timeSlot: "Morning",
        status: "Pending",
        reason: "Recurring chest pain and elevated heart rate",
      },
      {
        patientName: "Aarav Nair",
        doctorName: "Arjun Mehta",
        date: addDays(2),
        timeSlot: "Afternoon",
        status: "Pending",
        reason: "Migraine episodes and dizziness",
      },
      {
        patientName: "Rohan Gupta",
        doctorName: "Rahul Verma",
        date: addDays(3),
        timeSlot: "Evening",
        status: "Pending",
        reason: "Follow-up for ligament injury and knee stiffness",
      },
      {
        patientName: "Vivaan Joshi",
        doctorName: "Neha Sharma",
        date: addDays(1),
        timeSlot: "Afternoon",
        status: "Completed",
        reason: "Pediatric allergy review",
      },
      {
        patientName: "Meera Singh",
        doctorName: "Kavya Iyer",
        date: addDays(4),
        timeSlot: "Morning",
        status: "Pending",
        reason: "General fatigue and thyroid screening",
      },
      {
        patientName: "Aarav Nair",
        doctorName: "Kavya Iyer",
        date: addDays(5),
        timeSlot: "Evening",
        status: "Cancelled",
        reason: "Routine internal medicine consultation",
      },
    ];

    const patientMap = new Map(seededPatients.map((patient) => [patient.name, patient]));
    for (const appointment of appointments) {
      const patient = patientMap.get(appointment.patientName);
      const doctor = doctorMap.get(appointment.doctorName);

      if (!patient || !doctor) {
        continue;
      }

      await appointmentModel.findOneAndUpdate(
        {
          doctorID: doctor._id,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
        },
        {
          $set: {
            patientID: patient._id,
            doctorID: doctor._id,
            date: appointment.date,
            timeSlot: appointment.timeSlot,
            status: appointment.status,
            reason: appointment.reason,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const adminHashedPassword = await bcrypt.hash(adminAccount.password, 10);
    await authModel.findOneAndUpdate(
      { email: adminAccount.email },
      {
        $set: {
          name: adminAccount.name,
          email: adminAccount.email,
          password: adminHashedPassword,
          role: "admin",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const headDoctor = await doctorModel.findOne({ department: "Cardiology" });
    if (headDoctor) {
      await departmentModel.findOneAndUpdate(
        { name: "Cardiology" },
        { $set: { headDoctor: headDoctor._id } }
      );
    }

    console.log(
      "Sample data seeded: departments, doctors, patients, services, appointments, admin"
    );
    console.log("Default doctor account password: Password@123");
    console.log("Default patient account password: Password@123");
    console.log(
      `Admin login -> email: ${adminAccount.email} | password: ${adminAccount.password}`
    );
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();