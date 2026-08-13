import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/home/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PartTimeJobs from './pages/PartTimeJobs';
import PartTimeJobDetails from './pages/partTimeJobsDetails';
import Freelancing from './pages/Freelancing';
import FreelanceProjectDetails from './pages/freelancingdetails';
import Training from './pages/Training';
import TrainingDetails from './pages/TrainingDetails';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import JobPosterDashboard from './pages/dashboards/JobPosterDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';
import TrainingProviderDashboard from './pages/dashboards/TrainingProviderDashboard';

const getUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

const getRoleDashboard = (role) => {
  if (role === "job_poster") return "/job-poster/dashboard";
  if (role === "client") return "/client/dashboard";
  if (role === "training_provider") return "/training-provider/dashboard";
  return "/student/dashboard";
};

// Route Guard for Guests Only (Login & Register)
const GuestRoute = ({ children }) => {
  const user = getUser();
  if (user) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }
  return children;
};

// Route Guard for Role Specific Dashboards
const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans antialiased">
        <Header />

        <main className="flex-grow">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />

            {/* Platform Information Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Authentication Routes (Guest Only - hidden/redirected if logged in) */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            {/* Part-Time Job Routes */}
            <Route path="/part-time-jobs" element={<PartTimeJobs />} />
            <Route path="/part-time-jobs/:id" element={<PartTimeJobDetails />} />

            {/* Training Routes */}
            <Route path="/training" element={<Training />} />
            <Route path="/training/:id" element={<TrainingDetails />} />

            {/* Freelancing Routes */}
            <Route path="/freelancing" element={<Freelancing user={getUser()} />} />
            <Route path="/freelancing/:id" element={<FreelanceProjectDetails user={getUser()} />} />

            {/* Role Profile & Dashboard Routes (Protected per role) */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Navigate to="/student/dashboard" state={{ activeTab: "jobs" }} replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-poster/dashboard"
              element={
                <ProtectedRoute allowedRoles={["job_poster"]}>
                  <JobPosterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/training-provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={["training_provider"]}>
                  <TrainingProviderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback redirecting to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
