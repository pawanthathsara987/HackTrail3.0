import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Logo / Site Name */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              Site name
            </span>
          </Link>

          {/* Sign In */}
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          
          >
            Sign In
          </Link>

          <Link
            to="/part-time-jobs"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"

          >
            Part-Time Jobs
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;