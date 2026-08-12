import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Site name
              </span>
            </Link>

            <p className="text-sm leading-relaxed">
              simple description
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-blue-400 transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Features
            </h3>

            <ul className="space-y-3 text-sm">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                <span>
                  location
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+94 77 123 4567</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>email</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">

          <p>
            © {currentYear} EduMark Hub. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built with
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            for modern education
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;