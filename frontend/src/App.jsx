import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import PartTimeJobDetails from './pages/partTimeJobsDetails';
import PartTimeJobs from './pages/PartTimeJobs';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-900 font-sans text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {/* Navigation Header */}
        <Header />

        {/* Main Content View Container */}
        <main className="flex-grow">
          <Routes>
            {/* Home / Marks Dashboard Route */}
            <Route path="/" element={<Home />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Part-Time Job Routes */}
            <Route path="/part-time-jobs" element={<PartTimeJobs />} />
            <Route path="/part-time-jobs/:id" element={<PartTimeJobDetails />} />

            {/* Catch-all fallback redirecting to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
