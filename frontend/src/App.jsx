import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
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
            <Route path="/contact" element={<ContactUs />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Part-Time Job Routes */}
            <Route path="/part-time-jobs" element={<PartTimeJobs />} />
            <Route path="/part-time-jobs/:id" element={<PartTimeJobDetails />} />

            {/* Training Routes */}
            <Route path="/training" element={<Training />} />
            <Route path="/training/:id" element={<TrainingDetails />} />

            {/* Freelancing Routes */}
            <Route path="/freelancing" element={<Freelancing />} />
            <Route path="/freelancing/:id" element={<FreelanceProjectDetails />} />

            {/* Role Profile & Dashboard Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/job-poster/dashboard" element={<JobPosterDashboard />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />

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
