import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit,
  Save,
  LogOut,
  Upload,
  Sparkles,
  CheckCircle2,
  Code2,
  Clock,
  ArrowRight,
  Zap,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "courses" | "jobs" | "gigs" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [userData, setUserData] = useState(null);
  const [myGigs, setMyGigs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    profilePhoto: "",
    educationLevel: "",
    institutionName: "",
    fieldOfStudy: "",
    graduationYear: "",
    skills: [],
    interests: "",
    careerGoals: "",
    experienceLevel: "",
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchEnrolledCourses();
    fetchAppliedJobs();
    fetchMyProposals();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      const user = data.user;
      setUserData(user);

      // Fetch student's posted gigs
      fetchMyGigs(user.id);

      const student = user.studentProfile || {};

      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        location: user.location || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        profilePhoto: user.profilePhoto || "",
        educationLevel: student.educationLevel || "",
        institutionName: student.institutionName || "",
        fieldOfStudy: student.fieldOfStudy || "",
        graduationYear: student.graduationYear || "",
        skills: student.skills || [],
        interests: student.interests || "",
        careerGoals: student.careerGoals || "",
        experienceLevel: student.experienceLevel || "",
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGigs = async (userId) => {
    try {
      const response = await fetch(`/api/freelance-projects?clientId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMyGigs(data.projects || data.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch my gigs:", e);
    }
  };

  const fetchEnrolledCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingCourses(true);
    try {
      const response = await fetch("/api/training/my-enrollments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data.enrollments || []);
      }
    } catch (e) {
      console.error("Failed to fetch enrolled courses:", e);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingJobs(true);
    try {
      const response = await fetch("/api/jobs/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAppliedJobs(data.applications || []);
      }
    } catch (e) {
      console.error("Failed to fetch applied jobs:", e);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchMyProposals = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingProposals(true);
    try {
      const response = await fetch("/api/freelance-projects/my-proposals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMyProposals(data.proposals || []);
      }
    } catch (e) {
      console.error("Failed to fetch my proposals:", e);
    } finally {
      setLoadingProposals(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm("Are you sure you want to delete this posted gig?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/freelance-projects/${gigId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        setMyGigs((prev) => prev.filter((g) => g.id !== gigId && g._id !== gigId));
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to delete gig.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting gig.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUserData(data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setActiveTab("overview");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  const student = userData?.studentProfile || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Opportunity<span className="text-blue-600">X</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:inline-block">
              Student Workspace
            </span>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-700 font-bold">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt={userData.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userData?.fullName?.charAt(0) || "S"
                )}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {userData?.fullName}
                </p>
                <p className="text-xs text-slate-500">{userData?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="ml-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-800 text-2xl font-bold text-white flex items-center justify-center shadow-md">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt={userData.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userData?.fullName?.charAt(0) || "S"
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {userData?.fullName}
                  </h1>
                  <span className="rounded-md bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300 border border-blue-400/30">
                    Student Profile
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  {student.fieldOfStudy ? `${student.fieldOfStudy} at ` : ""}
                  {student.institutionName || "Student at OpportunityX"}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-blue-400" />
                    {userData?.location || "Location not set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={14} className="text-emerald-400" />
                    {student.experienceLevel ? `${student.experienceLevel} Level` : "Student"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "courses"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                <BookOpen size={16} className="text-blue-300" />
                Enrolled Courses ({enrolledCourses.length})
              </button>

              <button
                onClick={() => setActiveTab("jobs")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "jobs"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                <Briefcase size={16} className="text-indigo-300" />
                Applied Jobs ({appliedJobs.length})
              </button>

              <button
                onClick={() => setActiveTab("gigs")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "gigs"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                Freelance ({myGigs.length + myProposals.length})
              </button>

              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "edit"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {message.text && (
          <div
            className={`mt-6 rounded-2xl p-4 text-sm font-medium ${
              message.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Left Column: Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Academic Info */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  <GraduationCap className="text-blue-600" size={20} />
                  Academic Information
                </h3>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Education Level
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {student.educationLevel || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Institution Name
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {student.institutionName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Field of Study
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {student.fieldOfStudy || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Graduation Year
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {student.graduationYear || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  <Code2 className="text-blue-600" size={20} />
                  Skills & Expertise
                </h3>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Selected Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {student.skills && student.skills.length > 0 ? (
                      student.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Experience Level
                  </p>
                  <p className="mt-1 capitalize font-semibold text-slate-800">
                    {student.experienceLevel || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Enrolled Training Courses */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <BookOpen className="text-blue-600" size={20} />
                    Enrolled Courses & Programs
                    {enrolledCourses.length > 0 && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                        {enrolledCourses.length}
                      </span>
                    )}
                  </h3>
                  <Link
                    to="/training"
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Browse Catalog
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {loadingCourses ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Loading your enrolled courses...
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                    <BookOpen size={36} className="mx-auto text-slate-400" />
                    <h4 className="mt-3 font-bold text-slate-800">No Enrolled Courses Yet</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Boost your skills and career opportunities by enrolling in top-rated training programs.
                    </p>
                    <Link
                      to="/training"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 transition"
                    >
                      <Sparkles size={14} />
                      Explore Training Courses
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {enrolledCourses.slice(0, 3).map((item) => {
                      const program = item.program || {};
                      const providerName =
                        typeof program.provider === "string"
                          ? (program.provider.startsWith("{") ? JSON.parse(program.provider)?.name || program.provider : program.provider)
                          : program.provider?.name || "Training Provider";

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">
                              {program.image || program.providerLogo ? (
                                <img
                                  src={program.image || program.providerLogo}
                                  alt={program.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <BookOpen size={20} className="text-blue-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm truncate">
                                {program.title || "Training Program"}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {providerName} • {program.duration || "Self-Paced"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 capitalize">
                              {item.status || "Enrolled"}
                            </span>
                            <Link
                              to={`/training/${program.id || item.trainingId}`}
                              className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                            >
                              <Eye size={14} />
                              View Course
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                    {enrolledCourses.length > 3 && (
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="w-full text-center py-2 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View All Enrolled Courses ({enrolledCourses.length}) →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Applied Part-Time Jobs */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Briefcase className="text-indigo-600" size={20} />
                    Applied / Enrolled Part-Time Jobs
                    {appliedJobs.length > 0 && (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                        {appliedJobs.length}
                      </span>
                    )}
                  </h3>
                  <Link
                    to="/part-time-jobs"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Browse Jobs
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {loadingJobs ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Loading your job applications...
                  </div>
                ) : appliedJobs.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                    <Briefcase size={36} className="mx-auto text-slate-400" />
                    <h4 className="mt-3 font-bold text-slate-800">No Job Applications Yet</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Explore flexible part-time jobs tailored for students and start earning while learning.
                    </p>
                    <Link
                      to="/part-time-jobs"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                    >
                      <Sparkles size={14} />
                      Find Part-Time Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {appliedJobs.slice(0, 3).map((item) => {
                      const job = item.job || {};
                      const statusColor =
                        item.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : item.status === "reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-800";

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center font-bold text-indigo-600 text-xs">
                              {job.image || job.companyLogo ? (
                                <img
                                  src={job.image || job.companyLogo}
                                  alt={job.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Briefcase size={20} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm truncate">
                                {job.title || "Job Application"}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {job.companyName || "Company"} • {job.location || "Remote"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColor}`}>
                              {item.status || "Pending"}
                            </span>
                            <Link
                              to={`/part-time-jobs/${job.id || item.jobId}`}
                              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                            >
                              <Eye size={14} />
                              View Job
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                    {appliedJobs.length > 3 && (
                      <button
                        onClick={() => setActiveTab("jobs")}
                        className="w-full text-center py-2 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View All Applied Jobs ({appliedJobs.length}) →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Goals & Interests */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  <Sparkles className="text-blue-600" size={20} />
                  Career Goals & Interests
                </h3>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Career Goals
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {student.careerGoals || "No career goals specified yet."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Interests
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {student.interests || "No interests specified yet."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Quick Links */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  Contact Information
                </h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Email Address</p>
                      <p className="font-semibold text-slate-800">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Phone Number</p>
                      <p className="font-semibold text-slate-800">{userData?.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="font-semibold text-slate-800">{userData?.location || "N/A"}</p>
                    </div>
                  </div>

                  {userData?.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Date of Birth</p>
                        <p className="font-semibold text-slate-800">{userData.dateOfBirth}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Explore Actions */}
              <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-6 text-white shadow-xl">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  <h3 className="text-lg font-bold">Ready to Start Earning?</h3>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Offer your skills by posting a freelance service/task or explore active part-time jobs & projects.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() =>
                      navigate("/freelancing", {
                        state: { openPostModal: true },
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 font-bold text-slate-950 hover:from-amber-300 hover:to-amber-400 transition shadow-md w-full"
                  >
                    + Post Freelance Task / Service
                    <ArrowRight size={16} />
                  </button>

                  <Link
                    to="/freelancing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/20 transition"
                  >
                    Browse Freelance Projects
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/part-time-jobs"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/20 transition"
                  >
                    Browse Part-Time Jobs
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/training"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/20 transition"
                  >
                    View Training Programs
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY ENROLLED COURSES */}
        {activeTab === "courses" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen size={22} className="text-blue-600" />
                  My Enrolled Courses & Training Programs
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Track your learning progress, access course materials, and manage your enrolled programs.
                </p>
              </div>

              <Link
                to="/training"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-md hover:bg-blue-700 transition"
              >
                <Sparkles size={18} />
                Explore More Programs
              </Link>
            </div>

            {loadingCourses ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm text-slate-500">
                Loading your enrolled courses...
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <BookOpen size={48} className="mx-auto text-slate-300" />
                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  No Enrolled Courses Found
                </h3>
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                  You haven't enrolled in any training programs yet. Explore our training catalog to enhance your skills and gain certifications!
                </p>

                <Link
                  to="/training"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-blue-700 transition"
                >
                  <Sparkles size={18} />
                  Browse Training Catalog
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((item) => {
                  const program = item.program || {};
                  const providerName =
                    typeof program.provider === "string"
                      ? (program.provider.startsWith("{") ? JSON.parse(program.provider)?.name || program.provider : program.provider)
                      : program.provider?.name || "Training Provider";

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                          {program.image || program.providerLogo ? (
                            <img
                              src={program.image || program.providerLogo}
                              alt={program.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
                              <BookOpen size={40} />
                            </div>
                          )}
                          <span className="absolute top-3 right-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm capitalize">
                            {item.status || "Enrolled"}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>{program.category || "General"}</span>
                            <span>{program.skillLevel || "All Levels"}</span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                            {program.title || "Training Course"}
                          </h3>

                          <p className="text-xs text-slate-500">
                            By <span className="font-semibold text-slate-700">{providerName}</span>
                          </p>

                          <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                            {program.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={14} className="text-slate-400" />
                          {program.duration || "Self-Paced"}
                        </span>

                        <Link
                          to={`/training/${program.id || item.trainingId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
                        >
                          <Eye size={14} />
                          Continue Course
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: APPLIED PART-TIME JOBS */}
        {activeTab === "jobs" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase size={22} className="text-indigo-600" />
                  My Applied & Enrolled Part-Time Jobs
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Track status of your submitted job applications and view company updates.
                </p>
              </div>

              <Link
                to="/part-time-jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-md hover:bg-indigo-700 transition"
              >
                <Sparkles size={18} />
                Explore Part-Time Jobs
              </Link>
            </div>

            {loadingJobs ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm text-slate-500">
                Loading your applied jobs...
              </div>
            ) : appliedJobs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Briefcase size={48} className="mx-auto text-slate-300" />
                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  No Job Applications Found
                </h3>
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                  You haven't applied for any part-time jobs yet. Browse flexible student opportunities to start earning!
                </p>

                <Link
                  to="/part-time-jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-indigo-700 transition"
                >
                  <Sparkles size={18} />
                  Find Part-Time Jobs
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {appliedJobs.map((item) => {
                  const job = item.job || {};
                  const statusColor =
                    item.status === "accepted"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : item.status === "reviewed"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-amber-100 text-amber-800 border-amber-200";

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded-2xl bg-indigo-50 border border-slate-200 flex items-center justify-center font-bold text-indigo-600">
                              {job.image || job.companyLogo ? (
                                <img
                                  src={job.image || job.companyLogo}
                                  alt={job.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Briefcase size={22} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                                {job.title || "Job Application"}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {job.companyName || "Company"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Application Status:</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${statusColor}`}>
                              {item.status || "Pending"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium">
                              📍 {job.location || "Remote"}
                            </span>
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium">
                              ⏱️ {job.jobType || "Part-Time"}
                            </span>
                            {job.salary && (
                              <span className="rounded-lg bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1">
                                💰 {job.salary}
                              </span>
                            )}
                          </div>

                          {item.coverLetter && (
                            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                              <p className="font-semibold text-slate-700 mb-1">Cover Letter:</p>
                              <p className="line-clamp-2 italic text-slate-500">"{item.coverLetter}"</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Applied: {new Date(item.createdAt).toLocaleDateString()}
                        </span>

                        <Link
                          to={`/part-time-jobs/${job.id || item.jobId}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-2 font-bold text-white shadow hover:bg-indigo-700 transition"
                        >
                          <Eye size={14} />
                          Job Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY FREELANCE SERVICES & PROPOSALS */}
        {activeTab === "gigs" && (
          <div className="mt-8 space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap size={22} className="text-amber-500 fill-amber-400" />
                  My Freelance Services & Submitted Proposals
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your posted freelance gigs, services, and view submitted client proposals.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/freelancing", {
                    state: { openPostModal: true },
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                <Plus size={18} />
                + Post New Skill / Service
              </button>
            </div>

            {/* SECTION A: POSTED GIGS / SERVICES */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Zap size={18} className="text-amber-500" />
                My Posted Freelance Services ({myGigs.length})
              </h3>

              {myGigs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Zap size={36} className="mx-auto text-slate-400" />
                  <h4 className="mt-3 font-bold text-slate-800">No Posted Freelance Services</h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Post your skills (e.g. Graphic Design, Web Development, Content Writing) so clients can hire you.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myGigs.map((g) => (
                    <div
                      key={g.id || g._id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                            {g.category || "Service"}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            {g.budget}
                          </span>
                        </div>
                        <h4 className="mt-3 font-bold text-slate-900 text-sm line-clamp-2">
                          {g.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {g.description}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-slate-200/60 pt-3 flex items-center justify-between">
                        <Link
                          to={`/freelancing/${g.id || g._id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteGig(g.id || g._id)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION B: SUBMITTED PROPOSALS / APPLICATIONS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Code2 size={18} className="text-blue-600" />
                My Submitted Proposals & Applications ({myProposals.length})
              </h3>

              {loadingProposals ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Loading your proposals...
                </div>
              ) : myProposals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Code2 size={36} className="mx-auto text-slate-400" />
                  <h4 className="mt-3 font-bold text-slate-800">No Proposals Submitted Yet</h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Browse active client freelance projects and submit custom bids/proposals.
                  </p>
                  <Link
                    to="/freelancing"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 transition"
                  >
                    <Sparkles size={14} />
                    Browse Freelance Projects
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myProposals.map((item) => {
                    const project = item.project || {};
                    const statusColor =
                      item.status === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800";

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-600">
                              Proposed: Rs. {Number(item.proposedPrice).toLocaleString()}
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusColor}`}>
                              {item.status || "Pending"}
                            </span>
                          </div>

                          <h4 className="mt-3 font-bold text-slate-900 text-sm line-clamp-2">
                            {project.title || "Freelance Project"}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500 line-clamp-2 italic">
                            "{item.coverLetter}"
                          </p>

                          <div className="mt-3 text-xs text-slate-500">
                            ⏱️ Delivery: <span className="font-semibold text-slate-700">{item.deliveryTime}</span>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-slate-200/60 pt-3 flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <Link
                            to={`/freelancing/${project.id || item.projectId}`}
                            className="flex items-center gap-1 font-bold text-blue-600 hover:underline"
                          >
                            <Eye size={14} />
                            View Project
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === "edit" && (
          <form onSubmit={handleSaveProfile} className="mt-8 max-w-4xl space-y-8">
            {/* Photo & General */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Personal Information
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Profile Photo
                  </label>
                  <div className="mt-3 flex items-center gap-5">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xl">
                      {formData.profilePhoto ? (
                        <img
                          src={formData.profilePhoto}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "Photo"
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      <Upload size={16} />
                      Choose New Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({ ...formData, dateOfBirth: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Info Edit */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Academic Details
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Education Level
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, educationLevel: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Education Level</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="High School">High School</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) =>
                      setFormData({ ...formData, institutionName: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={formData.fieldOfStudy}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldOfStudy: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) =>
                      setFormData({ ...formData, graduationYear: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Experience Edit */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Skills & Goals
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Add Skills
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. React, Web Design, Data Analysis"
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceLevel: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Experience Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Career Goals
                  </label>
                  <textarea
                    rows={3}
                    value={formData.careerGoals}
                    onChange={(e) =>
                      setFormData({ ...formData, careerGoals: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Interests
                  </label>
                  <textarea
                    rows={2}
                    value={formData.interests}
                    onChange={(e) =>
                      setFormData({ ...formData, interests: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
