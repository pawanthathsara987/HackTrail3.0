import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Target, Menu, X, User, LogOut } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  }, [location.pathname]);

  // Don't render redundant header on pages that already render their own built-in navbar
  if (
    location.pathname === "/" ||
    location.pathname.startsWith("/student/dashboard") ||
    location.pathname.startsWith("/job-poster/dashboard") ||
    location.pathname.startsWith("/client/dashboard") ||
    location.pathname.startsWith("/training-provider/dashboard")
  ) {
    return null;
  }

  const getDashboardPath = (role) => {
    if (role === "job_poster") return "/job-poster/dashboard";
    if (role === "client") return "/client/dashboard";
    if (role === "training_provider") return "/training-provider/dashboard";
    return "/student/dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Target size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Opportunity<span className="text-blue-600">X</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex md:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition ${
              location.pathname === "/"
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </Link>

          <Link
            to="/part-time-jobs"
            className={`text-sm font-medium transition ${
              isActive("/part-time-jobs")
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Part-Time Jobs
          </Link>

          <Link
            to="/freelancing"
            className={`text-sm font-medium transition ${
              isActive("/freelancing") || isActive("/freelance")
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Freelancing
          </Link>

          <Link
            to="/training"
            className={`text-sm font-medium transition ${
              isActive("/training")
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Training Programs
          </Link>

          <Link
            to="/how-it-works"
            className={`text-sm font-medium transition ${
              isActive("/how-it-works")
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            How It Works
          </Link>

          <Link
            to="/about"
            className={`text-sm font-medium transition ${
              isActive("/about")
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition ${
              isActive("/contact")
                ? "text-blue-600 font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Desktop Auth / User Action */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath(user.role)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                <User size={16} className="text-blue-600" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-700 md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>

            <Link
              to="/part-time-jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Part-Time Jobs
            </Link>

            <Link
              to="/freelancing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Freelancing
            </Link>

            <Link
              to="/training"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Training Programs
            </Link>

            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact Us
            </Link>

            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              {user ? (
                <Link
                  to={getDashboardPath(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;