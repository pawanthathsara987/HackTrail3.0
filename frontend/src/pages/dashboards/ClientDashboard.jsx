import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Users,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Edit,
  Save,
  LogOut,
  Upload,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Code2,
  CreditCard,
  Clock,
  FileText,
  Paperclip,
  Trash2,
  Eye,
} from "lucide-react";
import FreelancePaymentModal from "../../components/FreelancePaymentModal";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "proposals" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [userData, setUserData] = useState(null);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [selectedProposalForPayment, setSelectedProposalForPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [myProjects, setMyProjects] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    profilePhoto: "",
    servicesInterested: "",
    projectCategories: "",
    budgetRange: "",
    preferredSkills: "",
    hiringDescription: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchReceivedProposals();
  }, []);

  const fetchReceivedProposals = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/freelance-projects/client/received-proposals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReceivedProposals(data.proposals || []);
      }
    } catch (e) {
      console.error("Error fetching received proposals:", e);
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

      const client = user.clientProfile || {};

      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        location: user.location || "",
        profilePhoto: user.profilePhoto || "",
        servicesInterested: client.servicesInterested || "",
        projectCategories: client.projectCategories || "",
        budgetRange: client.budgetRange || "",
        preferredSkills: client.preferredSkills || "",
        hiringDescription: client.hiringDescription || "",
      });

      fetchMyProjects(user.id);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async (userId) => {
    try {
      const response = await fetch(`/api/freelance-projects?clientId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMyProjects(data.projects || data.data || []);
      }
    } catch (err) {
      console.error("Error loading client projects:", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project posting?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/freelance-projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete project.");
      }
      setMessage({ type: "success", text: "Project deleted successfully." });
      if (userData) fetchMyProjects(userData.id);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
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
      setMessage({ type: "success", text: "Client profile updated successfully!" });
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading client workspace...</p>
        </div>
      </div>
    );
  }

  const client = userData?.clientProfile || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <BriefcaseBusiness size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Opportunity<span className="text-emerald-600">X</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-block">
              Client Workspace
            </span>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700 font-bold">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt={userData.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userData?.fullName?.charAt(0) || "C"
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
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
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
                  userData?.fullName?.charAt(0) || "C"
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    {userData?.fullName}
                  </h1>
                  <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
                    Client / Hirer
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  {userData?.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-400" />
                    {userData?.location || "Location not set"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-300">
                    <BriefcaseBusiness size={14} />
                    Posted Projects: {myProjects.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "overview"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("proposals")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "proposals"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white/10 text-slate-200 hover:bg-white/15"
                }`}
              >
                <FileText size={16} className="text-emerald-300" />
                Student Proposals ({receivedProposals.length})
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "edit"
                    ? "bg-emerald-600 text-white shadow-md"
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
            {/* Left Column: Hired Jobs & Freelance Projects */}
            <div className="space-y-6 lg:col-span-2">
              {/* My Posted / Hired Jobs Section */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <BriefcaseBusiness className="text-emerald-600" size={20} />
                    Hired Jobs & Posted Projects
                    {myProjects.length > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {myProjects.length}
                      </span>
                    )}
                  </h3>

                  <Link
                    to="/freelancing"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    <PlusCircle size={15} />
                    Explore Student Gigs
                  </Link>
                </div>

                {myProjects.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                    <Code2 size={40} className="mx-auto text-emerald-400" />
                    <h4 className="mt-3 font-bold text-slate-800">No Hired Jobs Yet</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                      Explore student freelancer gigs or hire talented students for your projects.
                    </p>
                    <Link
                      to="/freelancing"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                    >
                      <Users size={14} />
                      Find & Hire Student Freelancers
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {myProjects.map((proj) => (
                      <div
                        key={proj.id || proj._id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">{proj.title}</h4>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                                proj.status === "hired" || proj.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {proj.status || "Active"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <BriefcaseBusiness size={12} />
                              {proj.category}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <DollarSign size={12} />
                              {proj.budget}
                            </span>
                            {proj.deadline && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {proj.deadline}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/freelancing/${proj.id || proj._id}`}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(proj.id || proj._id)}
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
                  Account Details
                </h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Client Name</p>
                      <p className="font-semibold text-slate-800">{userData?.fullName}</p>
                    </div>
                  </div>

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
                      <p className="text-xs text-slate-400">Phone</p>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPOSALS & ACTIVITY PAYMENTS */}
        {activeTab === "proposals" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-emerald-600" size={20} />
                  Student Proposals & Activity Payments
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review student proposals for your posted projects and complete payments to hire them.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 self-start sm:self-auto">
                {receivedProposals.length} Total Proposals Received
              </span>
            </div>

            {receivedProposals.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <FileText size={42} className="mx-auto text-slate-300" />
                <h4 className="mt-3 font-bold text-slate-800 text-base">No Student Proposals Yet</h4>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  When student freelancers apply for your posted projects, their proposals and pricing will appear here for you to review and pay.
                </p>
                <Link
                  to="/freelancing"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  <PlusCircle size={15} />
                  Browse Freelancers & Projects
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {receivedProposals.map((prop) => {
                  const student = prop.student || {};
                  const project = prop.project || {};
                  const isPaid = prop.paymentStatus === "paid" || prop.status === "accepted";

                  return (
                    <div
                      key={prop.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        {/* Header info */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                              {student.profilePhoto ? (
                                <img
                                  src={student.profilePhoto}
                                  alt={student.fullName}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                student.fullName?.charAt(0) || "S"
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {student.fullName || "Student Freelancer"}
                              </h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin size={12} />
                                {student.location || "Location not set"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Proposed Price
                            </span>
                            <p className="text-base font-extrabold text-emerald-600 leading-none">
                              ${parseFloat(prop.proposedPrice || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="mt-4">
                          <span className="text-[11px] font-semibold text-slate-400">
                            Project: <span className="text-slate-800 font-bold">{project.title || "Freelance Project"}</span>
                          </span>
                          <p className="mt-2 text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                            "{prop.coverLetter}"
                          </p>
                        </div>

                        {/* Proposal Specs */}
                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-slate-400" />
                            Delivery: <strong className="text-slate-700">{prop.deliveryTime}</strong>
                          </span>
                          {prop.relevantSkills && (
                            <span className="flex items-center gap-1">
                              <Sparkles size={13} className="text-emerald-500" />
                              Skills: <strong className="text-slate-700">{prop.relevantSkills}</strong>
                            </span>
                          )}
                          {prop.attachmentUrl && (
                            <a
                              href={prop.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
                            >
                              <Paperclip size={13} />
                              Attachment
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 border-t border-slate-100 pt-4">
                        {isPaid ? (
                          <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-emerald-800 border border-emerald-200">
                            <span className="flex items-center gap-1.5 text-xs font-bold">
                              <CheckCircle2 size={16} className="text-emerald-600" />
                              Paid & Hired
                            </span>
                            {prop.transactionId && (
                              <span className="text-[10px] font-mono font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                                {prop.transactionId}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProposalForPayment(prop);
                              setShowPaymentModal(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                          >
                            <CreditCard size={16} />
                            Pay ${parseFloat(prop.proposedPrice || 0).toFixed(2)} & Hire Student
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === "edit" && (
          <form onSubmit={handleSaveProfile} className="mt-8 max-w-4xl space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Personal & Contact Info
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Profile Avatar
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
                        "Avatar"
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      <Upload size={16} />
                      Choose Avatar
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
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
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
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
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

        {/* Payment Modal for Proposal Payment */}
        {selectedProposalForPayment && (
          <FreelancePaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedProposalForPayment(null);
            }}
            activityDetails={{
              id: selectedProposalForPayment.projectId,
              proposalId: selectedProposalForPayment.id,
              title: selectedProposalForPayment.project?.title || "Freelance Project Proposal",
              amount: selectedProposalForPayment.proposedPrice,
              freelancerName: selectedProposalForPayment.student?.fullName || "Student Freelancer",
              category: selectedProposalForPayment.project?.category || "Freelance",
              type: "proposal",
            }}
            onPaymentSuccess={(receipt) => {
              setReceivedProposals((prev) =>
                prev.map((p) =>
                  p.id === selectedProposalForPayment.id
                    ? {
                        ...p,
                        status: "accepted",
                        paymentStatus: "paid",
                        transactionId: receipt.transactionId,
                      }
                    : p
                )
              );
            }}
          />
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
