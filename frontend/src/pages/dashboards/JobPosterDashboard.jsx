import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Save,
  LogOut,
  Upload,
  Sparkles,
  PlusCircle,
  TrendingUp,
  Trash2,
  Eye,
  X,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";


const JobPosterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "applicants" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedApplicantJobId, setSelectedApplicantJobId] = useState("all");
  const [selectedApplicantStatus, setSelectedApplicantStatus] = useState("all");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    profilePhoto: "",
    organizationName: "",
    organizationType: "",
    industry: "",
    organizationDescription: "",
    website: "",
    businessLocation: "",
  });

  const [myJobs, setMyJobs] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [uploadingJobImage, setUploadingJobImage] = useState(false);
  const [jobModalData, setJobModalData] = useState({
    title: "",
    category: "Web Development",
    location: "",
    jobType: "Part-Time",
    workingHours: "10-15 hrs/week",
    salaryMin: "",
    salaryMax: "",
    salaryType: "Monthly",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    deadline: "",
    image: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setMyJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Error loading posted jobs:", err);
    }
  };

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

      const jobPoster = user.jobPosterProfile || {};

      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        location: user.location || "",
        profilePhoto: user.profilePhoto || "",
        organizationName: jobPoster.organizationName || "",
        organizationType: jobPoster.organizationType || "",
        industry: jobPoster.industry || "",
        organizationDescription: jobPoster.organizationDescription || "",
        website: jobPoster.website || "",
        businessLocation: jobPoster.businessLocation || "",
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleJobImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingJobImage(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/upload/job-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload job image.");
      }

      setJobModalData((prev) => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      console.error("Job image upload error:", err);
      // Fallback to Base64 preview if server request fails
      const reader = new FileReader();
      reader.onloadend = () => {
        setJobModalData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingJobImage(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setIsCreatingJob(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");
    const organizationName =
      userData?.jobPosterProfile?.organizationName ||
      userData?.fullName ||
      "Organization";

    const payload = {
      title: jobModalData.title,
      companyName: organizationName,
      companyLogo: jobModalData.image || userData?.profilePhoto || null,
      image: jobModalData.image || null,
      category: jobModalData.category,
      location: jobModalData.location,
      jobType: jobModalData.jobType,
      workingHours: jobModalData.workingHours,
      salaryMin: jobModalData.salaryMin ? Number(jobModalData.salaryMin) : null,
      salaryMax: jobModalData.salaryMax ? Number(jobModalData.salaryMax) : null,
      salaryType: jobModalData.salaryType,
      salary: jobModalData.salaryMin && jobModalData.salaryMax
        ? `Rs. ${Number(jobModalData.salaryMin).toLocaleString()} - Rs. ${Number(jobModalData.salaryMax).toLocaleString()} / ${jobModalData.salaryType.toLowerCase()}`
        : null,
      description: jobModalData.description,
      requirements: jobModalData.requirements
        ? jobModalData.requirements.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      responsibilities: jobModalData.responsibilities
        ? jobModalData.responsibilities.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      benefits: jobModalData.benefits
        ? jobModalData.benefits.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      deadline: jobModalData.deadline || null,
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post job.");
      }

      setMessage({ type: "success", text: "New Job posted successfully!" });
      setShowJobModal(false);
      setJobModalData({
        title: "",
        category: "Web Development",
        location: "",
        jobType: "Part-Time",
        workingHours: "10-15 hrs/week",
        salaryMin: "",
        salaryMax: "",
        salaryType: "Monthly",
        description: "",
        requirements: "",
        responsibilities: "",
        benefits: "",
        deadline: "",
        image: "",
      });
      fetchMyJobs();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setMyJobs((prev) => prev.filter((j) => j.id !== jobId));
        setMessage({ type: "success", text: "Job deleted successfully." });
      }
    } catch (e) {
      console.error("Failed to delete job:", e);
    }
  };

  const handleUpdateApplicantStatus = async (applicationId, status) => {
    setUpdatingStatusId(applicationId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs/applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setMyJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          applications: (job.applications || []).map((app) =>
            app.id === applicationId ? { ...app, status } : app
          ),
        }))
      );
      setMessage({ type: "success", text: `Candidate status updated to ${status}.` });
    } catch (e) {
      console.error("Failed to update status:", e);
      setMessage({ type: "error", text: e.message || "Failed to update status." });
    } finally {
      setUpdatingStatusId(null);
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
      setMessage({ type: "success", text: "Organization profile updated successfully!" });
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading organization workspace...</p>
        </div>
      </div>
    );
  }

  const jobPoster = userData?.jobPosterProfile || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Opportunity<span className="text-indigo-600">X</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 sm:inline-block">
              Job Poster Workspace
            </span>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-700 font-bold">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt={jobPoster.organizationName || userData.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  jobPoster.organizationName?.charAt(0) || userData?.fullName?.charAt(0) || "J"
                )}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {jobPoster.organizationName || userData?.fullName}
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
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-800 text-2xl font-bold text-white flex items-center justify-center shadow-md">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  jobPoster.organizationName?.charAt(0) || "O"
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {jobPoster.organizationName || "Organization Profile"}
                  </h1>
                  <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
                    Job Poster
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  {jobPoster.industry ? `${jobPoster.industry} • ` : ""}
                  {jobPoster.organizationType || "Employer"}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-indigo-400" />
                    {jobPoster.businessLocation || userData?.location || "Location not set"}
                  </span>
                  {jobPoster.website && (
                    <a
                      href={jobPoster.website.startsWith("http") ? jobPoster.website : `https://${jobPoster.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-indigo-300 hover:underline"
                    >
                      <Globe size={14} />
                      {jobPoster.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "overview"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("applicants")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "applicants"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                <Users size={16} className="text-indigo-300" />
                Job Applicants (
                {myJobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0)}
                )
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "edit"
                    ? "bg-indigo-600 text-white shadow-md"
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
            {/* Left Column: Organization Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Organization Overview */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  <Building2 className="text-indigo-600" size={20} />
                  Organization Details
                </h3>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Organization Name
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {jobPoster.organizationName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Organization Type
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {jobPoster.organizationType || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Industry
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {jobPoster.industry || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Business Location
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {jobPoster.businessLocation || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Organization Description
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {jobPoster.organizationDescription ||
                      "No organization description provided yet."}
                  </p>
                </div>
              </div>

              {/* Quick Job Management Banner */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Briefcase className="text-indigo-600" size={20} />
                    Posted Jobs & Opportunities
                    {myJobs.length > 0 && (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                        {myJobs.length}
                      </span>
                    )}
                  </h3>

                  <button
                    onClick={() => setShowJobModal(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                  >
                    <PlusCircle size={15} />
                    Post New Job
                  </button>
                </div>

                {myJobs.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                    <Users size={36} className="mx-auto text-slate-400" />
                    <h4 className="mt-3 font-bold text-slate-800">Start Recruiting Students</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Post flexible part-time jobs, internships, and entry-level positions to connect with top student talent.
                    </p>
                    <button
                      onClick={() => setShowJobModal(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                    >
                      <PlusCircle size={14} />
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {myJobs.map((j) => (
                      <div
                        key={j.id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">{j.title}</h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                j.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {j.status}
                            </span>
                            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                              {j.applications?.length || 0} Applicants
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Briefcase size={12} />
                              {j.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {j.location}
                            </span>
                            {j.salary && (
                              <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                                <DollarSign size={12} />
                                {j.salary}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedApplicantJobId(String(j.id));
                              setActiveTab("applicants");
                            }}
                            className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                          >
                            <Users size={14} />
                            Applicants ({j.applications?.length || 0})
                          </button>
                          <Link
                            to={`/part-time-jobs/${j.id}`}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(j.id)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
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

            </div>

            {/* Right Column: Contact Info */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                  Contact Person Info
                </h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Contact Name</p>
                      <p className="font-semibold text-slate-800">{userData?.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Contact Email</p>
                      <p className="font-semibold text-slate-800">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="font-semibold text-slate-800">{userData?.phone || "N/A"}</p>
                    </div>
                  </div>

                  {jobPoster.website && (
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-400">Website</p>
                        <p className="font-semibold text-indigo-600 truncate max-w-[200px]">
                          {jobPoster.website}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICANTS */}
        {activeTab === "applicants" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users size={22} className="text-indigo-600" />
                  Job Applicants & Candidates
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Review student profiles, cover letters, and manage application statuses.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedApplicantJobId}
                  onChange={(e) => setSelectedApplicantJobId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">All Jobs ({myJobs.length})</option>
                  {myJobs.map((j) => (
                    <option key={j.id} value={String(j.id)}>
                      {j.title} ({j.applications?.length || 0})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedApplicantStatus}
                  onChange={(e) => setSelectedApplicantStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {(() => {
              const allApplications = myJobs.flatMap((j) =>
                (j.applications || []).map((app) => ({
                  ...app,
                  jobTitle: j.title,
                  jobId: j.id,
                  jobLocation: j.location,
                  jobSalary: j.salary,
                }))
              );

              const filteredApplications = allApplications.filter((app) => {
                const matchJob =
                  selectedApplicantJobId === "all" ||
                  String(app.jobId) === selectedApplicantJobId;
                const matchStatus =
                  selectedApplicantStatus === "all" ||
                  app.status === selectedApplicantStatus;
                return matchJob && matchStatus;
              });

              if (filteredApplications.length === 0) {
                return (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <Users size={48} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-bold text-slate-800">
                      No Applicants Found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                      {selectedApplicantJobId !== "all" || selectedApplicantStatus !== "all"
                        ? "No student applications match the selected job or status filter."
                        : "Students haven't applied for your posted jobs yet. Check back soon!"}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredApplications.map((app) => {
                    const applicant = app.applicant || {};
                    const profile = applicant.studentProfile || {};
                    const statusColor =
                      app.status === "accepted"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : app.status === "reviewed"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-amber-100 text-amber-800 border-amber-200";

                    return (
                      <div
                        key={app.id}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-indigo-50 border border-slate-200 flex items-center justify-center text-xl font-bold text-indigo-600">
                              {applicant.profilePhoto ? (
                                <img
                                  src={applicant.profilePhoto}
                                  alt={applicant.fullName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                applicant.fullName?.charAt(0) || "S"
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900">
                                  {applicant.fullName || "Student Candidate"}
                                </h3>
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${statusColor}`}>
                                  {app.status || "Pending"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Applied for: <span className="font-semibold text-slate-700">{app.jobTitle}</span> • {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleUpdateApplicantStatus(app.id, "accepted")}
                              disabled={updatingStatusId === app.id || app.status === "accepted"}
                              className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-40 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateApplicantStatus(app.id, "reviewed")}
                              disabled={updatingStatusId === app.id || app.status === "reviewed"}
                              className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 disabled:opacity-40 transition"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleUpdateApplicantStatus(app.id, "rejected")}
                              disabled={updatingStatusId === app.id || app.status === "rejected"}
                              className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-40 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>

                        {/* Student Academic & Contact Info */}
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 block font-medium">Contact:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{applicant.email || "N/A"}</p>
                            <p className="text-slate-500">{applicant.phone || "No phone provided"}</p>
                          </div>

                          <div>
                            <span className="text-slate-400 block font-medium">Education:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">
                              {profile.institutionName || "Not specified"}
                            </p>
                            <p className="text-slate-500">
                              {profile.fieldOfStudy ? `${profile.fieldOfStudy} (${profile.educationLevel || "Student"})` : profile.educationLevel || "Student"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400 block font-medium">Location & Experience:</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{applicant.location || "Location not set"}</p>
                            <p className="text-slate-500">{profile.experienceLevel ? `${profile.experienceLevel} Level` : "Student"}</p>
                          </div>
                        </div>

                        {/* Skills */}
                        {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-xs font-semibold text-slate-400 mr-1">Skills:</span>
                            {profile.skills.map((skill, idx) => (
                              <span key={idx} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Cover Letter & Resume */}
                        {(app.coverLetter || app.resumeUrl) && (
                          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                            {app.coverLetter && (
                              <div>
                                <span className="font-bold text-slate-700 block mb-1">Cover Letter / Note:</span>
                                <p className="italic text-slate-600 leading-relaxed">"{app.coverLetter}"</p>
                              </div>
                            )}

                            {app.resumeUrl && (
                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                <span className="font-bold text-slate-700">Resume / Portfolio:</span>
                                <a
                                  href={app.resumeUrl.startsWith("http") ? app.resumeUrl : `https://${app.resumeUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
                                >
                                  <Eye size={13} />
                                  View Resume
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === "edit" && (
          <form onSubmit={handleSaveProfile} className="mt-8 max-w-4xl space-y-8">
            {/* Organization Info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Organization Profile
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Organization Logo / Photo
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
                        "Logo"
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      <Upload size={16} />
                      Upload Logo
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
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationName: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Organization Type
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationType: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select Type</option>
                      <option value="Company">Company</option>
                      <option value="Startup">Startup</option>
                      <option value="NGO">NGO</option>
                      <option value="Educational Institution">Educational Institution</option>
                      <option value="Individual/Other">Individual / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      placeholder="e.g. https://company.com"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Business Location
                    </label>
                    <input
                      type="text"
                      value={formData.businessLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, businessLocation: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Organization Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.organizationDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationDescription: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Representative Contact Details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Representative Contact
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
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
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving Changes..." : "Save Organization Profile"}
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


        {/* POST NEW JOB MODAL */}
        {showJobModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <PlusCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Post a Part-Time Job</h3>
                    <p className="text-xs text-slate-500">Fill in the details to publish a new job for students</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="mt-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Junior Web Developer, Campus Brand Ambassador"
                      value={jobModalData.title}
                      onChange={(e) => setJobModalData({ ...jobModalData, title: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Job Image / Banner (Optional)
                    </label>
                    <div className="mt-2">
                      {jobModalData.image ? (
                        <div className="relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <img
                            src={jobModalData.image}
                            alt="Job Image Preview"
                            className="h-20 w-32 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              Image attached
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Uploaded to 'job-post' Supabase bucket
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setJobModalData({ ...jobModalData, image: "" })}
                            className="rounded-full bg-slate-200 p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 transition"
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:bg-slate-100/80">
                          {uploadingJobImage ? (
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs py-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                              Uploading image to Supabase 'job-post' bucket...
                            </div>
                          ) : (
                            <>
                              <Upload className="mb-2 text-indigo-600" size={24} />
                              <p className="text-xs font-semibold text-slate-700">
                                Click to upload job image or company banner
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Supports PNG, JPG, WEBP up to 5MB
                              </p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingJobImage}
                            onChange={handleJobImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Category *
                    </label>
                    <select
                      value={jobModalData.category}
                      onChange={(e) => setJobModalData({ ...jobModalData, category: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Data & AI">Data & AI</option>
                      <option value="Content Writing">Content Writing</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Job Type *
                    </label>
                    <select
                      value={jobModalData.jobType}
                      onChange={(e) => setJobModalData({ ...jobModalData, jobType: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Part-Time">Part-Time</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Colombo / Remote, Kandy"
                      value={jobModalData.location}
                      onChange={(e) => setJobModalData({ ...jobModalData, location: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10-15 hrs/week"
                      value={jobModalData.workingHours}
                      onChange={(e) => setJobModalData({ ...jobModalData, workingHours: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Salary Min (LKR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 20000"
                      value={jobModalData.salaryMin}
                      onChange={(e) => setJobModalData({ ...jobModalData, salaryMin: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Salary Max (LKR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35000"
                      value={jobModalData.salaryMax}
                      onChange={(e) => setJobModalData({ ...jobModalData, salaryMax: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Salary Frequency
                    </label>
                    <select
                      value={jobModalData.salaryType}
                      onChange={(e) => setJobModalData({ ...jobModalData, salaryType: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={jobModalData.deadline}
                      onChange={(e) => setJobModalData({ ...jobModalData, deadline: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Job Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe the job responsibilities, role expectations, and company culture..."
                      value={jobModalData.description}
                      onChange={(e) => setJobModalData({ ...jobModalData, description: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Requirements (one per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enrolled student&#10;Basic HTML & CSS&#10;Good communication skills"
                      value={jobModalData.requirements}
                      onChange={(e) => setJobModalData({ ...jobModalData, requirements: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Responsibilities (one per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Develop web pages&#10;Collaborate with team&#10;Fix design bugs"
                      value={jobModalData.responsibilities}
                      onChange={(e) => setJobModalData({ ...jobModalData, responsibilities: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Benefits (one per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Flexible hours&#10;Certificate of completion&#10;Remote work option"
                      value={jobModalData.benefits}
                      onChange={(e) => setJobModalData({ ...jobModalData, benefits: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingJob}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    <PlusCircle size={16} />
                    {isCreatingJob ? "Publishing..." : "Publish Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobPosterDashboard;

