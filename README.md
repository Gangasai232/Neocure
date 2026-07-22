# 🏥 Hospital Management System

A production-oriented MERN hospital management application for managing patients, appointments, doctors, services, departments, medical records, payments, and analytics.

🔗 [**Live Demo**](https://hospital-management-bmmd.onrender.com)

---

## ✨ Features

### 👥 User Roles & Authentication

- **Patient/User**: Book appointments, manage profile, browse services, make payments, and review appointment history
- **Doctor**: View and manage appointments, access patient information, and update availability status
- **Admin**: Complete system control with user management, analytics dashboard, and full CRUD operations
- **JWT-based secure authentication** with role-based access control (RBAC)
- Protected routes with middleware authorization for each role

### 🩺 Appointments Management

- Real-time doctor listing with **age**, **gender**, **specialization**, and **availability status**
- Book appointments with **date**, **time slot**, and **reason** using intuitive modal forms
- Admin can view, create, update, and manage all appointments
- Doctors can view their scheduled appointments and patient details
- Form validations with real-time feedback using **Zod + React Hook Form**

### 💳 Services & Payments

- Browse available hospital services with **name**, **price**, and **duration**
- Shopping cart functionality for multiple service selection
- **Razorpay payment gateway** integration (test mode)
- Transaction history with detailed order information
- **PDF receipt generation** with auto-download functionality
- Admin can create, update, and delete services

### 📊 Analytics Dashboard (Admin)

- **Interactive data visualizations** using Chart.js:
  - Pie chart showing user distribution (Patients, Doctors, Admins)
  - Bar graph displaying patient age group demographics
  - Area chart tracking monthly user registration trends
- Real-time growth metrics with percentage calculations
- Comprehensive statistics on total registered users

### 👨‍⚕️ Doctor Management

- Admin can add, edit, and delete doctor profiles
- Doctor details include **specialization**, **department**, **phone**, **age**, **gender**, and **status**
- Real-time status updates (Active/Away)
- Doctor-specific dashboard with appointment overview

### 👤 User & Patient Management

- Admin can view and manage all registered users
- Patient profile management with medical information
- Department and medical record APIs for hospital data organization
- User role assignment and permissions control
- Comprehensive user listing with filtering capabilities

### 📄 Transaction Management

- Complete transaction history for all payments
- Detailed order tracking with **Order ID** and **Payment ID**
- Transaction status monitoring (Success/Failed/Pending)
- PDF receipt generation with hospital branding
- Admin access to all transaction records

### 🌐 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Shadcn UI, React Hook Form, Zod, React Router, Zustand (State Management)
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Express Validator
- **Payment**: Razorpay API Integration
- **PDF Generation**: jsPDF with autoTable plugin
- **Charts**: Recharts library for data visualization

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js ≥ 18
- MongoDB (local or cloud)
- Razorpay test account

---

### 🧱 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Gangasai232/Neocure.git
cd Hospital-Management
```

#### 2. Backend Setup

Install backend dependencies:

```bash
npm install
```

Create `.env` file in root folder:

```env
PORT=5000
NODE_ENV=production/development
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

#### 3. Frontend Setup

```bash
cd client
npm install
```

#### 4. Run the Application

Start the backend server:

```bash
npm run dev
# Runs on http://localhost:5000
```

Start the frontend (in new terminal):

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## 📸 Key Features Overview

### 📊 Admin Analytics

- Visual data representation
- User growth tracking
- Age demographics analysis
- Month-over-month metrics

### 💳 Payment System

- Secure Razorpay integration
- Auto-generated PDF receipts
- Transaction history tracking
- Order management

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based middleware protection
- Input validation using Zod and Express Validator
- Centralized JWT role authorization middleware
- Protected API endpoints
- CORS configuration

---

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Dark mode support via Shadcn UI
- Accessible UI components

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is open source and available under the MIT License.
