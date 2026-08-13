import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Edit,
  Save,
  LogOut,
  Upload,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  DollarSign,
  X,
  Sparkles,
  Globe,
  Building2,
} from "lucide-react";

const PRESET_CATEGORIES = [
  "Web Development",
  "Graphic Design",
  "Digital Marketing",
  "Data & AI",
  "Mobile Apps",
  "Writing & Content",
  "Business Skills",
];

const TrainingProviderDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("programs"); // "programs" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [userData, setUserData] = useState(null);
  const [programs, setPrograms] = useState([]);

  // Create / Edit Program Modal State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [programForm, setProgramForm] = useState({
    title: "",
    category: "Web Development",
    skillLevel: "Beginner",
    trainingType: "Online",
    duration: "4 Weeks",
    price: "0",
    description: "",
    about: "",
    location: "Online",
    image: "",
    whatYouWillLearn: ["Build real-world projects", "Master key tools"],
    requirements: ["Basic computer knowledge"],
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    profilePhoto: "",
    organizationName: "",
    organizationType: "",
    websiteUrl: "",
    bio: "",
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

      const provider = user.trainingProviderProfile || {};

      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        location: user.location || "",
        profilePhoto: user.profilePhoto || "",
        organizationName: provider.organizationName || "",
        organizationType: provider.organizationType || "",
        websiteUrl: provider.websiteUrl || "",
        bio: provider.bio || "",
      });

      // Fetch programs created by this provider
      fetchMyPrograms(user.id);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPrograms = async (userId) => {
    try {
      const response = await fetch(`/api/training-programs?providerId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs || data.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch provider programs:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
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
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setActiveTab("programs");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setModalError("Please select a valid image file.");
      return;
    }

    // Show a local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setModalError("");

    try {
      const token = localStorage.getItem("token");
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const uploadRes = await fetch("/api/upload/job-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed.");

      // Store Supabase public URL (not base64)
      setProgramForm((prev) => ({ ...prev, image: uploadData.imageUrl }));
      setImagePreview(uploadData.imageUrl);
    } catch (err) {
      setModalError("Image upload failed: " + err.message);
      setImagePreview(null);
      setProgramForm((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProgramId(null);
    setImagePreview(null);
    setProgramForm({
      title: "",
      category: "Web Development",
      skillLevel: "Beginner",
      trainingType: "Online",
      duration: "4 Weeks",
      price: "0",
      description: "",
      about: "",
      location: "Online",
      image: "",
      whatYouWillLearn: ["Build real-world projects", "Master key tools"],
      requirements: ["Basic computer knowledge"],
    });
    setShowProgramModal(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgramId(program.id);
    setImagePreview(program.image || null);
    setProgramForm({
      title: program.title,
      category: program.category || "Web Development",
      skillLevel: program.skillLevel || "Beginner",
      trainingType: program.trainingType || "Online",
      duration: program.duration || "4 Weeks",
      price: String(program.price || 0),
      description: program.description || "",
      about: program.about || "",
      location: program.location || "Online",
      image: program.image || "",
      whatYouWillLearn: program.whatYouWillLearn || ["Build real-world projects"],
      requirements: program.requirements || ["Basic computer knowledge"],
    });
    setShowProgramModal(true);
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Are you sure you want to delete this training program?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/training-programs/${programId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== programId));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete program.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting program.");
    }
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    if (!programForm.title.trim() || !programForm.description.trim()) {
      setModalError("Please fill in required program fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setModalError("");
      const token = localStorage.getItem("token");

      const providerName =
        formData.organizationName || userData?.fullName || "Training Provider";

      const url = editingProgramId
        ? `/api/training-programs/${editingProgramId}`
        : "/api/training-programs";

      const method = editingProgramId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: programForm.title.trim(),
          provider: providerName,
          providerLogo: userData?.profilePhoto || null,
          category: programForm.category,
          skillLevel: programForm.skillLevel,
          trainingType: programForm.trainingType,
          duration: programForm.duration,
          price: parseFloat(programForm.price) || 0,
          description: programForm.description,
          about: programForm.about || programForm.description,
          location: programForm.location,
          image: programForm.image || null,
          whatYouWillLearn: programForm.whatYouWillLearn,
          requirements: programForm.requirements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save training program.");
      }

      setShowProgramModal(false);
      fetchMyPrograms(userData.id);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <span className="font-semibold">Loading Training Provider Workspace...</span>
        </div>
      </div>
    );
  }

  const provider = userData?.trainingProviderProfile || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Opportunity<span className="text-emerald-600">X</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">

            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:inline-block">
              Training Provider Workspace
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
                  provider.organizationName?.charAt(0) || userData?.fullName?.charAt(0) || "T"
                )}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {provider.organizationName || userData?.fullName}
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

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 px-4 py-10 text-white shadow-lg">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-slate-800 flex items-center justify-center font-bold text-2xl text-emerald-400">
                {userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt={userData.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  provider.organizationName?.charAt(0) || "T"
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30 mb-2">
                  <BookOpen size={14} />
                  Training Provider / Educator
                </div>

                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                  {provider.organizationName || userData?.fullName || "Training Provider"}
                </h1>

                <p className="mt-1 text-sm text-emerald-200">
                  {provider.organizationType || "Skills & Training Academy"} • {userData?.location || "Sri Lanka"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/training"
                className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                <Eye size={16} />
                View All Programs
              </Link>

              <button
                onClick={() => setActiveTab("programs")}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                  activeTab === "programs"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                My Programs ({programs.length})
              </button>

              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  activeTab === "edit"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 mt-8">
        {/* Alert Notifications */}
        {message.text && (
          <div
            className={`mb-6 rounded-2xl p-4 text-sm font-semibold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* TAB 1: MY TRAINING PROGRAMS & PROVIDER DETAILS */}
        {activeTab === "programs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Published Programs */}
            <div className="space-y-6 lg:col-span-2">
              {/* Top Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={22} className="text-emerald-600" />
                    Published Training Programs
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Create and manage practical training courses to help students build in-demand skills.
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-700 transition shrink-0"
                >
                  <Plus size={18} />
                  + Post New Program
                </button>
              </div>

              {/* Empty State */}
              {programs.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <BookOpen size={48} className="mx-auto text-emerald-400" />
                  <h3 className="mt-4 text-lg font-bold text-slate-800">
                    No training programs posted yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                    Publish courses, workshops, or training bootcamps to educate students and earn recognition.
                  </p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 transition"
                  >
                    <Plus size={18} />
                    Post Your First Training Program
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {programs.map((prog) => (
                    <div
                      key={prog.id}
                      className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        {prog.image ? (
                          <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
                            <img
                              src={prog.image}
                              alt={prog.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mb-4 flex h-36 w-full items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <BookOpen size={36} />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            {prog.category}
                          </span>

                          <span className="font-extrabold text-emerald-700 text-sm">
                            {Number(prog.price) === 0 ? "FREE" : `$${prog.price}`}
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-2">
                          {prog.title}
                        </h3>

                        <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                          {prog.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Users size={14} className="text-slate-400" />
                          Enrolled: <strong className="text-slate-800">{prog.enrolledCount || 0}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/training/${prog.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={14} />
                            View
                          </Link>

                          <button
                            onClick={() => handleEditProgram(prog)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800"
                          >
                            <Edit size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProgram(prog.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 1 Column: Provider Details Card */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <Building2 className="text-emerald-600" size={18} />
                    Provider Details
                  </h3>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition"
                  >
                    <Edit size={14} />
                    Edit Details
                  </button>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Organization / Academy
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {provider.organizationName || userData?.fullName || "Not set"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Organization Type
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {provider.organizationType || "Skills & Training Academy"}
                    </p>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                    <User size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-slate-400">Contact Person</p>
                      <p className="font-semibold text-slate-800">{userData?.fullName || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-slate-400">Email Address</p>
                      <p className="font-semibold text-slate-800">{userData?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-slate-400">Phone</p>
                      <p className="font-semibold text-slate-800">{userData?.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-slate-400">Location</p>
                      <p className="font-semibold text-slate-800">{userData?.location || "N/A"}</p>
                    </div>
                  </div>

                  {provider.websiteUrl && (
                    <div className="flex items-start gap-3">
                      <Globe size={16} className="mt-0.5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-slate-400">Official Website</p>
                        <a
                          href={provider.websiteUrl.startsWith("http") ? provider.websiteUrl : `https://${provider.websiteUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-emerald-600 hover:underline break-all"
                        >
                          {provider.websiteUrl}
                        </a>
                      </div>
                    </div>
                  )}

                  {provider.bio && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Provider Description / Bio
                      </p>
                      <p className="mt-1 text-slate-600 leading-relaxed whitespace-pre-line">
                        {provider.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === "edit" && (
          <form onSubmit={handleSaveProfile} className="max-w-3xl mx-auto space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Provider & Organization Profile
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Organization / Institute Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) =>
                    setFormData({ ...formData, organizationName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, websiteUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Provider Bio / Description
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Describe your academy or experience..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 transition"
                >
                  {saving ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* CREATE / EDIT PROGRAM MODAL */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl my-8 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingProgramId ? "Edit Training Program" : "Post New Training Program"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the training details to publish for students.
                </p>
              </div>

              <button
                onClick={() => setShowProgramModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-100">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveProgram} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Full-Stack Web Development Bootcamp"
                  value={programForm.title}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Program Cover Banner Image
                </label>
                {imagePreview ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setProgramForm((prev) => ({ ...prev, image: "" }));
                      }}
                      className="absolute right-3 top-3 rounded-full bg-slate-900/80 p-1.5 text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-6 text-center transition hover:border-emerald-500">
                    <Upload size={22} className="text-emerald-600" />
                    <p className="text-xs font-bold text-slate-800">
                      Upload Program Banner Image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={programForm.category}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500 bg-white"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Skill Level *
                  </label>
                  <select
                    value={programForm.skillLevel}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, skillLevel: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Format *
                  </label>
                  <select
                    value={programForm.trainingType}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, trainingType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Weeks"
                    value={programForm.duration}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, duration: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Price ($ / 0 for Free) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={programForm.price}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, price: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Program Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe course objectives, benefits, and curriculum outline..."
                  value={programForm.description}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {isSubmitting
                    ? "Publishing..."
                    : editingProgramId
                    ? "Update Program"
                    : "Publish Program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProviderDashboard;
