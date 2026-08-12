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
} from "lucide-react";

const JobPosterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  useEffect(() => {
    fetchProfile();
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

            <div className="flex gap-3">
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
                  </h3>

                  <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition">
                    <PlusCircle size={15} />
                    Post New Job
                  </button>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center border border-dashed border-slate-200">
                  <Users size={36} className="mx-auto text-slate-400" />
                  <h4 className="mt-3 font-bold text-slate-800">Start Recruiting Students</h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Post flexible part-time jobs, internships, and entry-level positions to connect with top student talent.
                  </p>
                </div>
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

        {/* TAB 2: EDIT PROFILE */}
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
      </main>
    </div>
  );
};

export default JobPosterDashboard;
