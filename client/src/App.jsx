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
const Error = React.lazy(() => import("./pages/Error"));

// Loading component with spinner
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_40%),linear-gradient(180deg,_rgba(239,246,255,0.85),_rgba(255,255,255,1))] px-6 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))]">
    <div className="rounded-3xl border border-blue-100/80 bg-white/90 px-10 py-8 text-center shadow-2xl shadow-blue-100/60 backdrop-blur dark:border-blue-900/60 dark:bg-slate-950/80 dark:shadow-blue-950/30">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-300">
        Loading workspace
      </p>
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
