import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Target, Heart } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Hide global footer on dashboard views or full-screen auth pages if needed
  if (
    location.pathname.startsWith("/student/dashboard") ||
    location.pathname.startsWith("/job-poster/dashboard") ||
    location.pathname.startsWith("/client/dashboard")
  ) {
    return null;
  }

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Target size={21} />
              </div>
              <span className="text-xl font-bold">
                Opportunity<span className="text-blue-600">X</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Helping students learn, earn, build experience, and move toward a better future.
            </p>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-slate-500 hover:text-slate-900 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/part-time-jobs" className="text-slate-500 hover:text-slate-900 transition">
                  Part-Time Jobs
                </Link>
              </li>
              <li>
                <Link to="/freelancing" className="text-slate-500 hover:text-slate-900 transition">
                  Freelancing
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-slate-500 hover:text-slate-900 transition">
                  Training Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/login" className="text-slate-500 hover:text-slate-900 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 hover:text-slate-900 transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-slate-500 hover:text-slate-900 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-500 hover:text-slate-900 transition">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} OpportunityX. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> for student empowerment
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;