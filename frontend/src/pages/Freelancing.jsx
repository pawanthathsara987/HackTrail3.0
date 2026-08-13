import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Clock,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Sparkles,
  Check,
  Plus,
  Image as ImageIcon,
  Tag,
  Star,
  Zap,
  Code2,
  Trash2,
  Edit,
} from "lucide-react";

const PRESET_SKILLS = [
  "React",
  "Node.js",
  "JavaScript",
  "HTML/CSS",
  "Tailwind CSS",
  "Figma",
  "UI/UX Design",
  "Photoshop",
  "Canva",
  "Python",
  "SEO",
  "Digital Marketing",
  "Content Writing",
  "Video Editing",
];

const PRESET_DELIVERABLES = [
  "Source Code Included",
  "Mobile Responsive Design",
  "Figma / Design Source File",
  "2 Free Revisions",
  "Commercial Use License",
  "24/7 Support",
];

const getDeadlineText = (deadline) => {
  if (!deadline) return "Flexible";
  if (typeof deadline === "string" && !deadline.includes("-")) return deadline;
  const parsed = new Date(deadline);
  if (isNaN(parsed.getTime())) return deadline;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Freelancing = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [projectType, setProjectType] = useState("");
  const [postTypeFilter, setPostTypeFilter] = useState(""); // "" for all posted freelance posts
  const [deadline, setDeadline] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  // Modal State for Creating/Editing Freelance Skill Gig (Fiverr Style)
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState(["React", "UI/UX Design"]);
  const [selectedDeliverables, setSelectedDeliverables] = useState([
    "Source Code Included",
    "2 Free Revisions",
  ]);
  const [customSkill, setCustomSkill] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [postForm, setPostForm] = useState({
    title: "",
    category: "Web Development",
    projectType: "Fixed Price",
    postType: "gig",
    currency: "$",
    budgetMin: "30",
    budgetMax: "100",
    deadline: "2 Days",
    description: "",
    projectImage: "",
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (skills) params.append("skills", skills);
      if (budget) params.append("budget", budget);
      if (projectType) params.append("projectType", projectType);
      if (postTypeFilter) params.append("postType", postTypeFilter);
      if (deadline) params.append("deadline", deadline);

      params.append("sort", sort);
      params.append("page", page);
      params.append("limit", 9);

      const response = await fetch(
        `/api/freelance-projects?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to load freelance projects.");
      }

      const data = await response.json();

      setProjects(data.projects || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, category, skills, budget, projectType, postTypeFilter, deadline, sort, page]);

  useEffect(() => {
    if (location.state?.openPostModal) {
      setShowPostModal(true);
    }
  }, [location.state]);

  const handleProposal = (projectId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    navigate(`/freelancing/${projectId}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSkills("");
    setBudget("");
    setProjectType("");
    setPostTypeFilter("");
    setDeadline("");
    setSort("newest");
    setPage(1);
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleDeliverable = (item) => {
    if (selectedDeliverables.includes(item)) {
      setSelectedDeliverables(selectedDeliverables.filter((d) => d !== item));
    } else {
      setSelectedDeliverables([...selectedDeliverables, item]);
    }
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPostError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPostError("Image size must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setPostForm((prev) => ({ ...prev, projectImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const getCalculatedBudgetStr = () => {
    const symbol = postForm.currency;
    const min = postForm.budgetMin ? Number(postForm.budgetMin).toLocaleString() : "";
    const max = postForm.budgetMax ? Number(postForm.budgetMax).toLocaleString() : "";

    if (postForm.projectType === "Hourly") {
      return min ? `${symbol}${min} / hr` : `${symbol}25 / hr`;
    }

    if (postForm.postType === "gig") {
      return min ? `${symbol}${min} (Starting Price)` : `${symbol}25`;
    }

    if (min && max) return `${symbol}${min} - ${symbol}${max}`;
    if (min) return `From ${symbol}${min}`;
    if (max) return `Up to ${symbol}${max}`;
    return `${symbol}50`;
  };

  const handleEditClick = (proj) => {
    setEditingProjectId(proj.id || proj._id);
    setPostForm({
      title: proj.title,
      category: proj.category,
      projectType: proj.projectType || "Fixed Price",
      postType: proj.postType || "gig",
      currency: "$",
      budgetMin: proj.budgetMin || "30",
      budgetMax: proj.budgetMax || "100",
      deadline: proj.deadline || "2 Days",
      description: proj.description,
      projectImage: proj.projectImage || "",
    });
    setSelectedSkills(proj.skillsRequired || []);
    setSelectedDeliverables(proj.deliverables || []);
    setImagePreview(proj.projectImage || null);
    setShowPostModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this freelance post?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/freelance-projects/${projectId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        fetchProjects();
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to delete post.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting post.");
    }
  };

  const handlePostProject = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    let titleToSave = postForm.title.trim();
    if (postForm.postType === "gig" && !titleToSave.toLowerCase().startsWith("i will")) {
      titleToSave = `I will ${titleToSave}`;
    }

    if (!titleToSave || !postForm.description.trim()) {
      setPostError("Please fill in all required gig fields.");
      return;
    }

    try {
      setIsPosting(true);
      setPostError("");
      const token = localStorage.getItem("token");

      const finalBudgetStr = getCalculatedBudgetStr();

      const url = editingProjectId
        ? `/api/freelance-projects/${editingProjectId}`
        : "/api/freelance-projects";

      const method = editingProjectId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: titleToSave,
          postType: postForm.postType,
          category: postForm.category,
          projectType: postForm.projectType,
          budget: finalBudgetStr,
          budgetMin: parseFloat(postForm.budgetMin) || null,
          budgetMax: parseFloat(postForm.budgetMax) || null,
          deadline: postForm.deadline,
          description: postForm.description,
          skillsRequired: selectedSkills,
          deliverables: selectedDeliverables,
          projectImage: postForm.projectImage || null,
          clientName: currentUser.fullName || "Student Seller",
        }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response (${response.status} ${response.statusText}).`);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish gig.");
      }

      setShowPostModal(false);
      setEditingProjectId(null);
      setImagePreview(null);
      setPostForm({
        title: "",
        category: "Web Development",
        projectType: "Fixed Price",
        postType: "gig",
        currency: "$",
        budgetMin: "30",
        budgetMax: "100",
        deadline: "2 Days",
        description: "",
        projectImage: "",
      });
      fetchProjects();
    } catch (err) {
      setPostError(err.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 px-4 py-16 text-white shadow-md">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              STUDENT SKILL MARKETPLACE (FIVERR STYLE)
            </div>

            <h1 className="text-3xl font-bold md:text-5xl tracking-tight">
              Sell Your Skills & Earn Money Online
            </h1>

            <p className="mt-4 text-lg text-emerald-100">
              Offer custom services (gigs), set your starting price, showcase portfolio photos, and deliver quality work to real buyers.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="mx-auto -mt-6 max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search freelance posts, skills, or titles..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Category Filter:
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Writing">Writing</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="budget_high">Highest Price</option>
              <option value="budget_low">Lowest Price</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <p className="mt-4 text-gray-500">Loading skill marketplace...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-2xl bg-red-50 p-8 text-center border border-red-100">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <Zap size={48} className="mx-auto text-emerald-400" />
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              No skill offers or projects found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first student to post a gig and sell your skills!
            </p>
            <button
              onClick={() => setShowPostModal(true)}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-md"
            >
              + Sell Your Skill Now
            </button>
          </div>
        )}

        {/* Gig / Project Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id || project.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-xl border border-gray-100 hover:border-emerald-200"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    {project.projectImage ? (
                      <img
                        src={project.projectImage}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-950 text-white">
                        <Code2 size={40} className="text-emerald-400 opacity-60" />
                      </div>
                    )}

                    {/* Gig vs Project Badge */}
                    <div className="absolute left-3 top-3 flex gap-2">
                      {project.postType === "gig" || project.posterRole === "student" ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                          <Zap size={12} className="fill-amber-400 text-amber-400" />
                          Student Skill Offer
                        </span>
                      ) : (
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                          Client Bounty
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Seller Profile Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                          {project.clientName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-none">
                            {project.clientName}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {project.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star size={14} className="fill-amber-400" />
                        <span>5.0</span>
                      </div>
                    </div>

                    {/* Gig Title */}
                    <h3 className="mt-4 text-base font-bold text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Skills Offered */}
                    {project.skillsRequired?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.skillsRequired.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Pricing Footer */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Delivery
                      </p>
                      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
                        <Clock size={13} className="text-gray-400" />
                        {getDeadlineText(project.deadline)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Starting at
                      </p>
                      <p className="text-lg font-extrabold text-emerald-600 leading-none">
                        {project.budget}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to={`/freelancing/${project._id || project.id}`}
                      className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white transition hover:bg-emerald-600 shadow-sm"
                    >
                      View Details
                    </Link>

                    {currentUser && currentUser.role === "student" && currentUser.id === project.clientId && (
                      <>
                        <button
                          onClick={() => handleEditClick(project)}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                          title="Edit Post"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id || project.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                          title="Delete Post"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}

                    {(!currentUser || (currentUser.role !== "student" && currentUser.id !== project.clientId)) && (
                      <button
                        onClick={() => handleProposal(project._id || project.id)}
                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
                      >
                        Hire Student
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && projects.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>

      {/* FIVERR STYLE SKILL GIG CREATION MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl my-8 border border-gray-100 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap size={22} className="text-amber-500 fill-amber-400" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentUser?.role === "client" || currentUser?.role === "job_poster"
                      ? "Post What You Want Built / Request Student"
                      : "Sell Your Skill / Post Fixed Price Gig"}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {currentUser?.role === "client" || currentUser?.role === "job_poster"
                    ? "Describe what work or project you need done by student freelancers, set your budget, and get proposals!"
                    : "Offer your expertise, upload portfolio samples, set your fixed starting price, and get hired!"}
                </p>
              </div>

              <button
                onClick={() => setShowPostModal(false)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {postError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-100">
                {postError}
              </div>
            )}

            <form onSubmit={handlePostProject} className="mt-5 space-y-6">
              {/* 1. Gig Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Gig / Service Title *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600">
                    I will
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="build a responsive React website or design mobile app screens..."
                    value={postForm.title}
                    onChange={(e) =>
                      setPostForm({ ...postForm, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3.5 pl-16 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* 2. Photo / Portfolio Sample Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Gig Cover / Portfolio Sample Photo *
                </label>

                {imagePreview ? (
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Gig Cover Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setPostForm((prev) => ({ ...prev, projectImage: "" }));
                      }}
                      className="absolute right-3 top-3 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-slate-900 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-6 text-center transition hover:border-emerald-500 hover:bg-emerald-50/60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Upload size={22} />
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      Upload Portfolio Photo or Service Cover Banner
                    </p>
                    <p className="text-xs text-gray-400">
                      Show buyers your previous work sample • Max 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 3. Category & Delivery Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Service Category *
                  </label>
                  <select
                    value={postForm.category}
                    onChange={(e) =>
                      setPostForm({ ...postForm, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Writing">Writing & Translation</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Video & Audio">Video & Animation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Delivery Time *
                  </label>
                  <select
                    value={postForm.deadline}
                    onChange={(e) =>
                      setPostForm({ ...postForm, deadline: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-sm font-semibold outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="1 Day">1 Day Delivery</option>
                    <option value="2 Days">2 Days Delivery</option>
                    <option value="3 Days">3 Days Delivery</option>
                    <option value="5 Days">5 Days Delivery</option>
                    <option value="1 Week">1 Week Delivery</option>
                  </select>
                </div>
              </div>

              {/* 4. Pricing & Rates */}
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    Starting Price / Service Rate *
                  </label>
                  <span className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm">
                    Price: {getCalculatedBudgetStr()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Currency
                    </label>
                    <select
                      value={postForm.currency}
                      onChange={(e) =>
                        setPostForm({ ...postForm, currency: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white font-bold text-gray-800"
                    >
                      <option value="$">$ (USD)</option>
                      <option value="Rs.">Rs. (LKR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Starting Price
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      value={postForm.budgetMin}
                      onChange={(e) =>
                        setPostForm({ ...postForm, budgetMin: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white font-bold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Max Package Price
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={postForm.budgetMax}
                      onChange={(e) =>
                        setPostForm({ ...postForm, budgetMax: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Included Deliverables / Features */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Included Service Deliverables / Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_DELIVERABLES.map((item) => {
                    const isChecked = selectedDeliverables.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDeliverable(item)}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition text-left border ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ${
                            isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isChecked && <Check size={12} />}
                        </div>
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Skills Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Select Skills Used *
                </label>

                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected && <Check size={13} />}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              {/* 7. Service Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Gig Service Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your service in detail, your experience, what you need from the buyer, and why clients should choose you..."
                  value={postForm.description}
                  onChange={(e) =>
                    setPostForm({ ...postForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting}
                  className="rounded-xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {isPosting ? "Publishing Gig..." : "⚡ Publish Gig Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Freelancing;