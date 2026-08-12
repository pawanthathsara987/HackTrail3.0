import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case "student":
        return "/student/dashboard";

      case "job_poster":
        return "/job-poster/dashboard";

      case "client":
        return "/client/dashboard";

      default:
        return "/unauthorized";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      /*
       * Replace this with your actual API utility.
       *
       * Example:
       *
       * const response = await axios.post(
       *   "/api/auth/login",
       *   formData,
       *   {
       *     withCredentials: true,
       *   }
       * );
       *
       * const user = response.data.user;
       */

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      const user = data.user;

      if (!user || !user.role) {
        throw new Error("Unable to determine your account role.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate(getDashboardPath(user.role), {
        replace: true,
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "Unable to sign in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ==================================================
            LEFT BRANDING SECTION
        ================================================== */}

        <div className="relative hidden overflow-hidden bg-slate-900 lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900">
                <Target size={24} />
              </div>

              <span className="text-2xl font-bold text-white">
                Opportunity
                <span className="text-blue-400">X</span>
              </span>
            </Link>

            {/* Main content */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <ShieldCheck
                  size={16}
                  className="text-blue-400"
                />

                Trusted opportunity platform
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Connect with opportunities.
                <span className="block text-blue-400">
                  Build your future.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Sign in to access jobs, freelance opportunities,
                training programs, and professional connections
                through OpportunityX.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <Feature
                  number="01"
                  title="Discover"
                  description="Find opportunities"
                />

                <Feature
                  number="02"
                  title="Connect"
                  description="Meet talented people"
                />

                <Feature
                  number="03"
                  title="Grow"
                  description="Build your career"
                />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} OpportunityX. All
              rights reserved.
            </p>
          </div>
        </div>

        {/* ==================================================
            LOGIN SECTION
        ================================================== */}

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Target size={22} />
                </div>

                <span className="text-2xl font-bold text-slate-900">
                  Opportunity
                  <span className="text-blue-600">X</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to continue to your OpportunityX
                account.
              </p>
            </div>

            {/* Error */}
            {errors.submit && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <p className="text-sm font-medium text-red-700">
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.email
                        ? "border-red-400 ring-4 ring-red-50"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      updateField(
                        "password",
                        e.target.value
                      )
                    }
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-400 ring-4 ring-red-50"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      updateField(
                        "rememberMe",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-slate-600">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                New to OpportunityX?
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Register */}
            <Link
              to="/register"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Create an account
              <ArrowRight size={18} />
            </Link>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              Your account role is automatically determined
              after authentication. You do not need to select
              a role when signing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   FEATURE
============================================================ */

const Feature = ({ number, title, description }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <span className="text-xs font-bold text-blue-400">
      {number}
    </span>

    <p className="mt-3 font-semibold text-white">
      {title}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      {description}
    </p>
  </div>
);

export default Login;