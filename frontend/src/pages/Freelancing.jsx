import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const Freelancing = ({ user }) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [projectType, setProjectType] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

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
  }, [search, category, skills, budget, projectType, deadline, sort, page]);

  const handleProposal = (projectId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "Client") {
      return;
    }

    if (user.role === "Student") {
      navigate(`/freelancing/${projectId}/proposal`);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSkills("");
    setBudget("");
    setProjectType("");
    setDeadline("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-3 font-semibold text-indigo-200">
              FREELANCE MARKETPLACE
            </p>

            <h1 className="text-3xl font-bold md:text-5xl">
              Turn Your Skills Into Freelance Opportunities
            </h1>

            <p className="mt-5 text-lg text-indigo-100">
              Discover real projects, connect with clients, and earn by using
              your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mx-auto -mt-8 max-w-7xl px-4">
        <div className="rounded-2xl bg-white p-5 shadow-lg">
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search project title, keyword or skill..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Writing">Writing</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Programming">Programming</option>
              <option value="Data Entry">Data Entry</option>
            </select>

            <input
              type="text"
              value={skills}
              onChange={(e) => {
                setSkills(e.target.value);
                setPage(1);
              }}
              placeholder="Required skills"
              className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-indigo-500"
            />

            <select
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">Budget range</option>
              <option value="0-5000">Below 5,000</option>
              <option value="5000-10000">5,000 - 10,000</option>
              <option value="10000-25000">10,000 - 25,000</option>
              <option value="25000+">25,000+</option>
            </select>

            <select
              value={projectType}
              onChange={(e) => {
                setProjectType(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">Project type</option>
              <option value="Fixed Price">Fixed Price</option>
              <option value="Hourly">Hourly</option>
            </select>

            <select
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">Deadline</option>
              <option value="7">Within 7 days</option>
              <option value="14">Within 14 days</option>
              <option value="30">Within 30 days</option>
            </select>
          </div>

          {/* Sort */}
          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SlidersHorizontal size={18} />
              <span>Sort by:</span>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="highestBudget">Highest Budget</option>
                <option value="lowestBudget">Lowest Budget</option>
                <option value="closingSoon">Closing Soon</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Projects */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Freelance Projects
            </h2>
            <p className="mt-1 text-gray-500">
              Find projects that match your skills.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-gray-200" />
                <div className="mt-6 h-20 rounded bg-gray-200" />
                <div className="mt-6 h-10 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            <p>{error}</p>

            <button
              onClick={fetchProjects}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && projects.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <Briefcase className="mx-auto mb-4 text-gray-400" size={45} />

            <h3 className="text-xl font-semibold text-gray-800">
              No projects found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id || project.id}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                      {project.category || "General"}
                    </span>

                    <span className="text-sm font-semibold text-green-600">
                      {project.budget || "Budget not specified"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {project.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <User size={16} />
                    <span>{project.clientName || "Client"}</span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                    {project.description}
                  </p>

                  {/* Skills */}
                  {project.requiredSkills?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Details */}
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        Deadline:{" "}
                        {project.deadline
                          ? new Date(project.deadline).toLocaleDateString()
                          : "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        Posted:{" "}
                        {project.postedDate
                          ? new Date(
                              project.postedDate
                            ).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/freelancing/${project._id || project.id}`}
                    className="flex-1 rounded-lg border border-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    View Project
                  </Link>

                  {user?.role !== "Client" && (
                    <button
                      onClick={() =>
                        handleProposal(project._id || project.id)
                      }
                      className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Submit Proposal
                    </button>
                  )}
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
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Freelancing;