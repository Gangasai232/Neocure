import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load all page components
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Account"));
const SidebarLayout = React.lazy(() => import("./components/SidebarLayout"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
const Doctors = React.lazy(() => import("./pages/Doctors"));
const Support = React.lazy(() => import("./pages/Support"));
const Services = React.lazy(() => import("./pages/Services"));
const Transactions = React.lazy(() => import("./pages/Transactions"));

// Admin nested pages
const Analytics = React.lazy(() => import("./pages/admin/Analytics"));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const Appointments = React.lazy(() => import("./pages/admin/Appointments"));
const AdminTransactions = React.lazy(
  () => import("./pages/admin/Transactions"),
);
const AdminHome = React.lazy(() => import("./pages/admin/AdminHome"));

// Doctor nested pages
const DoctorHome = React.lazy(() => import("./pages/doctor/DoctorHome"));
const DoctorAppointments = React.lazy(
  () => import("./pages/doctor/Appointments"),
);
const Prediction = React.lazy(() => import("./pages/Prediction"));
const Error = React.lazy(() => import("./pages/Error"));

// Loading component with spinner
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid #e0e0e0",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px",
        }}
      />
      <p style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>
        Loading...
      </p>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public landing page as default */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected user routes */}
        <Route
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute roles={["admin", "patient", "doctor", "user"]}>
                <SidebarLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/support" element={<Support />} />
          <Route path="/services" element={<Services />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/predictor" element={<Prediction />} />
        </Route>

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute roles={["admin"]}>
                <SidebarLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="" element={<AdminHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>

        {/* Doctor-only routes */}
        <Route
          path="/doctor"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute roles={["doctor", "admin"]}>
                <SidebarLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="" element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
};

export default App;
