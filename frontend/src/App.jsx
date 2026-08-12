import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import FreelanceProjectDetails from './pages/freelancingdetails';
import Freelancing from './pages/Freelancing';
import PartTimeJobDetails from './pages/partTimeJobsDetails';
import PartTimeJobs from './pages/PartTimeJobs';
import TrainingDetails from './pages/TrainingDetails';
import Training from './pages/Training';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import JobPosterDashboard from './pages/dashboards/JobPosterDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans antialiased">
        <main className="flex-grow">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Part-Time Job Routes */}
            <Route path="/part-time-jobs" element={<PartTimeJobs />} />
            <Route path="/part-time-jobs/:id" element={<PartTimeJobDetails />} />
            {/* Training Routes */}
            <Route path="/training" element={<Training />} />
            <Route path="/training/:id" element={<TrainingDetails />} />
            {/* Role Profile & Dashboard Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/job-poster/dashboard" element={<JobPosterDashboard />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />

            {/* Catch-all fallback redirecting to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/freelance" element={<Freelancing />} />
            <Route path="/freelance/details" element={<FreelanceProjectDetails />} />

            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
