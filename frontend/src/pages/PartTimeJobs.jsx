import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    MapPin,
    BriefcaseBusiness,
    Clock3,
    DollarSign,
    CalendarDays,
    SlidersHorizontal,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    SearchX,
    ArrowUpDown,
    Bookmark,
    BookmarkCheck,
    CheckCircle2,
} from "lucide-react";

/*
  IMPORTANT:
  Replace this import with the location of your EXISTING authentication hook.

  Example:
  import { useAuth } from "../context/AuthContext";

  Your existing authentication system should return something similar to:

  {
    user: {
      id,
      name,
      role
    }
  }

  Do NOT create another authentication system.
*/

// Example import:
// import { useAuth } from "../context/AuthContext";


// ---------------------------------------------------------
// Temporary adapter for the example.
// REMOVE this function when connecting your existing AuthContext.
// ---------------------------------------------------------
const getExistingUser = () => {
    /*
      This is ONLY an adapter so the page can work if your project
      currently stores the authenticated user in localStorage.
  
      If your project already has AuthContext/useAuth,
      replace this with:
  
         const { user } = useAuth();
  
      and remove this function.
    */

    try {
        const possibleKeys = [
            "user",
            "currentUser",
            "authUser",
            "loggedInUser",
        ];

        for (const key of possibleKeys) {
            const stored = localStorage.getItem(key);

            if (stored) {
                const parsed = JSON.parse(stored);

                if (parsed) {
                    return parsed.user || parsed;
                }
            }
        }
    } catch (error) {
        console.error("Unable to read existing authentication state:", error);
    }

    return null;
};


// ---------------------------------------------------------
// API
// ---------------------------------------------------------

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "";


const fetchJobs = async ({
    search,
    location,
    category,
    salary,
    jobType,
    workingHours,
    page,
    limit,
    sort,
}) => {
    const params = new URLSearchParams();

    if (search.trim()) {
        params.append("search", search.trim());
    }

    if (location) {
        params.append("location", location);
    }

    if (category) {
        params.append("category", category);
    }

    if (salary) {
        params.append("salary", salary);
    }

    if (jobType) {
        params.append("jobType", jobType);
    }

    if (workingHours) {
        params.append("workingHours", workingHours);
    }

    params.append("page", page);
    params.append("limit", limit);
    params.append("sort", sort);

    const response = await fetch(
        `${API_BASE_URL}/api/jobs?${params.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load jobs. Server returned ${response.status}.`
        );
    }

    return response.json();
};


// ---------------------------------------------------------
// Helper functions
// ---------------------------------------------------------

const formatSalary = (job) => {
    if (job.salary) {
        return job.salary;
    }

    if (job.salaryMin || job.salaryMax) {
        const min = job.salaryMin
            ? Number(job.salaryMin).toLocaleString()
            : "";

        const max = job.salaryMax
            ? Number(job.salaryMax).toLocaleString()
            : "";

        if (min && max) {
            return `Rs. ${min} - Rs. ${max}`;
        }

        if (min) {
            return `From Rs. ${min}`;
        }

        if (max) {
            return `Up to Rs. ${max}`;
        }
    }

    return "Salary not specified";
};


const formatDate = (date) => {
    if (!date) {
        return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};


const getDaysRemaining = (deadline) => {
    if (!deadline) {
        return null;
    }

    const today = new Date();
    const end = new Date(deadline);

    if (Number.isNaN(end.getTime())) {
        return null;
    }

    const difference = end.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};


const normalizeJobsResponse = (response) => {
    /*
      Supports common backend response structures:
  
      {
        jobs: [],
        total: 20,
        page: 1,
        limit: 10
      }
  
      OR
  
      {
        data: [],
        pagination: {}
      }
  
      OR simply:
  
      []
    */

    if (Array.isArray(response)) {
        return {
            jobs: response,
            total: response.length,
            page: 1,
            limit: response.length || 10,
            totalPages: 1,
        };
    }

    const jobs = response.jobs || response.data || [];

    const pagination = response.pagination || {};

    const total =
        response.total ??
        pagination.total ??
        jobs.length;

    const page =
        response.page ??
        pagination.page ??
        1;

    const limit =
        response.limit ??
        pagination.limit ??
        10;

    const totalPages =
        response.totalPages ??
        pagination.totalPages ??
        Math.max(1, Math.ceil(total / limit));

    return {
        jobs,
        total,
        page,
        limit,
        totalPages,
    };
};


// ---------------------------------------------------------
// Main component
// ---------------------------------------------------------

const PartTimeJobs = () => {
    const navigate = useNavigate();

    // -------------------------------------------------------
    // Authentication
    // -------------------------------------------------------

    /*
      If you have an AuthContext, use:
  
        const { user } = useAuth();
  
      instead of getExistingUser().
    */

    const user = useMemo(() => getExistingUser(), []);


    // -------------------------------------------------------
    // Search state
    // -------------------------------------------------------

    const [searchInput, setSearchInput] = useState("");

    const [filters, setFilters] = useState({
        location: "",
        category: "",
        salary: "",
        jobType: "",
        workingHours: "",
    });

    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);

    const limit = 9;


    // -------------------------------------------------------
    // Jobs state
    // -------------------------------------------------------

    const [jobs, setJobs] = useState([]);

    const [totalJobs, setTotalJobs] = useState(0);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [hasSearched, setHasSearched] = useState(false);


    // -------------------------------------------------------
    // UI state
    // -------------------------------------------------------

    const [mobileFiltersOpen, setMobileFiltersOpen] =
        useState(false);

    const [savedJobs, setSavedJobs] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("opportunityhub_saved_jobs") || "[]"
            );
        } catch {
            return [];
        }
    });


    // -------------------------------------------------------
    // Load jobs
    // -------------------------------------------------------

    const loadJobs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetchJobs({
                search: searchInput,
                location: filters.location,
                category: filters.category,
                salary: filters.salary,
                jobType: filters.jobType,
                workingHours: filters.workingHours,
                page,
                limit,
                sort,
            });

            const normalized = normalizeJobsResponse(response);

            setJobs(normalized.jobs);
            setTotalJobs(normalized.total);
            setTotalPages(normalized.totalPages);

            if (
                searchInput ||
                filters.location ||
                filters.category ||
                filters.salary ||
                filters.jobType ||
                filters.workingHours
            ) {
                setHasSearched(true);
            } else {
                setHasSearched(false);
            }
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Something went wrong while loading jobs."
            );

            setJobs([]);
            setTotalJobs(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [
        searchInput,
        filters,
        page,
        sort,
    ]);


    useEffect(() => {
        loadJobs();
    }, [loadJobs]);


    // -------------------------------------------------------
    // Search
    // -------------------------------------------------------

    const handleSearch = () => {
        setPage(1);
        loadJobs();
    };


    // -------------------------------------------------------
    // Clear filters
    // -------------------------------------------------------

    const clearFilters = () => {
        setSearchInput("");

        setFilters({
            location: "",
            category: "",
            salary: "",
            jobType: "",
            workingHours: "",
        });

        setSort("newest");
        setPage(1);
        setMobileFiltersOpen(false);
    };


    // -------------------------------------------------------
    // Filter update
    // -------------------------------------------------------

    const updateFilter = (name, value) => {
        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPage(1);
    };


    // -------------------------------------------------------
    // Save job
    // -------------------------------------------------------

    const toggleSaveJob = (jobId) => {
        setSavedJobs((previous) => {
            const alreadySaved = previous.includes(jobId);

            const updated = alreadySaved
                ? previous.filter((id) => id !== jobId)
                : [...previous, jobId];

            localStorage.setItem(
                "opportunityhub_saved_jobs",
                JSON.stringify(updated)
            );

            return updated;
        });
    };


    // -------------------------------------------------------
    // View details
    // -------------------------------------------------------

    const handleViewDetails = (jobId) => {
        navigate(`/part-time-jobs/${jobId}`);
    };


    // -------------------------------------------------------
    // Apply
    // -------------------------------------------------------

    const handleApply = (jobId) => {
        /*
          Reuse existing authentication.
    
          If no authenticated user:
              /login
    
          If Student:
              continue to existing student application process.
    
          If Job Poster / Client:
              do not allow student application.
        */

        if (!user) {
            navigate("/login");
            return;
        }

        const role = String(
            user.role ||
            user.userRole ||
            user.accountType ||
            ""
        ).toUpperCase();

        if (role === "STUDENT") {
            /*
              Existing OpportunityHub specification contains:
              /student/applications
      
              We pass the selected job ID through router state.
            */

            navigate("/student/applications", {
                state: {
                    jobId,
                    opportunityType: "PART_TIME_JOB",
                },
            });

            return;
        }

        if (
            role === "JOB_POSTER" ||
            role === "EMPLOYER" ||
            role === "CLIENT"
        ) {
            window.alert(
                "Job Posters and Clients cannot apply for jobs as students."
            );

            return;
        }

        window.alert(
            "Only students can apply for part-time jobs."
        );
    };


    // -------------------------------------------------------
    // Pagination
    // -------------------------------------------------------

    const handlePreviousPage = () => {
        setPage((previous) => Math.max(1, previous - 1));

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleNextPage = () => {
        setPage((previous) =>
            Math.min(totalPages, previous + 1)
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // -------------------------------------------------------
    // Filter component
    // -------------------------------------------------------

    const FilterContent = () => (
        <div className="space-y-5">

            {/* Location */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                </label>

                <select
                    value={filters.location}
                    onChange={(e) =>
                        updateFilter("location", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">All locations</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Online">Remote / Online</option>
                </select>
            </div>


            {/* Category */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Category
                </label>

                <select
                    value={filters.category}
                    onChange={(e) =>
                        updateFilter("category", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">All categories</option>
                    <option value="IT">IT & Technology</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Education">Education</option>
                    <option value="Data Entry">Data Entry</option>
                    <option value="Customer Service">
                        Customer Service
                    </option>
                    <option value="Content">Content & Writing</option>
                    <option value="Other">Other</option>
                </select>
            </div>


            {/* Salary */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Salary / Payment
                </label>

                <select
                    value={filters.salary}
                    onChange={(e) =>
                        updateFilter("salary", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">Any salary</option>
                    <option value="0-10000">
                        Under Rs. 10,000
                    </option>
                    <option value="10000-25000">
                        Rs. 10,000 - 25,000
                    </option>
                    <option value="25000-50000">
                        Rs. 25,000 - 50,000
                    </option>
                    <option value="50000+">
                        Rs. 50,000+
                    </option>
                </select>
            </div>


            {/* Working hours */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Working Hours
                </label>

                <select
                    value={filters.workingHours}
                    onChange={(e) =>
                        updateFilter(
                            "workingHours",
                            e.target.value
                        )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">Any hours</option>
                    <option value="under-10">
                        Under 10 hours/week
                    </option>
                    <option value="10-20">
                        10 - 20 hours/week
                    </option>
                    <option value="20-30">
                        20 - 30 hours/week
                    </option>
                    <option value="30+">
                        30+ hours/week
                    </option>
                </select>
            </div>


            {/* Job type */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Type
                </label>

                <select
                    value={filters.jobType}
                    onChange={(e) =>
                        updateFilter("jobType", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                    <option value="">All job types</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Evening">Evening</option>
                </select>
            </div>


            {/* Clear */}
            <button
                type="button"
                onClick={clearFilters}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
                <X size={16} />
                Clear Filters
            </button>
        </div>
    );


    // -------------------------------------------------------
    // Loading
    // -------------------------------------------------------

    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Hero
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    handleSearch={handleSearch}
                />

                <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24">
                    <div className="flex flex-col items-center text-center">
                        <Loader2
                            size={42}
                            className="mb-4 animate-spin text-indigo-600"
                        />

                        <h2 className="text-lg font-semibold text-slate-800">
                            Finding opportunities...
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Please wait while we load the latest jobs.
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    // -------------------------------------------------------
    // Main UI
    // -------------------------------------------------------

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Hero */}
            <Hero
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearch={handleSearch}
            />


            {/* Main */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Mobile controls */}
                <div className="mb-5 flex gap-3 lg:hidden">

                    <button
                        type="button"
                        onClick={() =>
                            setMobileFiltersOpen(true)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                    </button>

                    <div className="relative flex-1">
                        <ArrowUpDown
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm font-semibold text-slate-700 shadow-sm outline-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="highestPay">
                                Highest Pay
                            </option>
                            <option value="lowestPay">
                                Lowest Pay
                            </option>
                            <option value="closingSoon">
                                Closing Soon
                            </option>
                        </select>

                        <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </div>


                <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

                    {/* Desktop filters */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        Filters
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Find jobs that match you
                                    </p>
                                </div>

                                <SlidersHorizontal
                                    size={19}
                                    className="text-indigo-600"
                                />
                            </div>

                            <FilterContent />
                        </div>
                    </aside>


                    {/* Job results */}
                    <section>

                        {/* Results header */}
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    {totalJobs}{" "}
                                    {totalJobs === 1
                                        ? "opportunity"
                                        : "opportunities"}{" "}
                                    found
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Part-Time Opportunities
                                </h2>
                            </div>


                            {/* Desktop sorting */}
                            <div className="relative hidden sm:block">
                                <ArrowUpDown
                                    size={17}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        setPage(1);
                                    }}
                                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="newest">
                                        Newest
                                    </option>

                                    <option value="highestPay">
                                        Highest Pay
                                    </option>

                                    <option value="lowestPay">
                                        Lowest Pay
                                    </option>

                                    <option value="closingSoon">
                                        Closing Soon
                                    </option>
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>


                        {/* Error */}
                        {error && (
                            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                                <div className="flex gap-3">
                                    <AlertCircle
                                        size={21}
                                        className="mt-0.5 shrink-0 text-red-600"
                                    />

                                    <div>
                                        <h3 className="font-semibold text-red-800">
                                            Unable to load jobs
                                        </h3>

                                        <p className="mt-1 text-sm text-red-700">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={loadJobs}
                                            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Empty state */}
                        {!error && jobs.length === 0 && (
                            <EmptyState
                                hasSearched={hasSearched}
                                clearFilters={clearFilters}
                            />
                        )}


                        {/* Job cards */}
                        {!error && jobs.length > 0 && (
                            <>
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                    {jobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            isSaved={savedJobs.includes(job.id)}
                                            onSave={() =>
                                                toggleSaveJob(job.id)
                                            }
                                            onView={() =>
                                                handleViewDetails(job.id)
                                            }
                                            onApply={() =>
                                                handleApply(job.id)
                                            }
                                        />
                                    ))}

                                </div>


                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-3">

                                        <button
                                            type="button"
                                            disabled={page === 1}
                                            onClick={handlePreviousPage}
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <ChevronLeft size={17} />
                                            Previous
                                        </button>

                                        <div className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
                                            {page} / {totalPages}
                                        </div>

                                        <button
                                            type="button"
                                            disabled={page >= totalPages}
                                            onClick={handleNextPage}
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                            <ChevronRight size={17} />
                                        </button>

                                    </div>
                                )}
                            </>
                        )}

                    </section>
                </div>
            </main>


            {/* Mobile filter drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    <div
                        className="absolute inset-0 bg-slate-950/40"
                        onClick={() =>
                            setMobileFiltersOpen(false)
                        }
                    />

                    <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Filters
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Refine your job search
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileFiltersOpen(false)
                                }
                                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <FilterContent />

                        <button
                            type="button"
                            onClick={() =>
                                setMobileFiltersOpen(false)
                            }
                            className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};


// =========================================================
// HERO
// =========================================================

const Hero = ({
    searchInput,
    setSearchInput,
    handleSearch,
}) => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-300/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">

                <div className="mx-auto max-w-3xl text-center">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                        <BriefcaseBusiness size={16} />
                        Flexible opportunities for students
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Find Part-Time Jobs That Fit Your Life
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                        Discover flexible opportunities that help you earn while studying and gain valuable experience.
                    </p>


                    {/* Search */}
                    <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">

                        <div className="relative flex-1">

                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                placeholder="Job title, keyword or skill"
                                className="w-full rounded-xl border-0 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:bg-white"
                            />

                        </div>

                        <button
                            type="button"
                            onClick={handleSearch}
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                        >
                            <Search size={18} />
                            Search Jobs
                        </button>

                    </div>

                </div>
            </div>
        </section>
    );
};


// =========================================================
// JOB CARD
// =========================================================

const JobCard = ({
    job,
    isSaved,
    onSave,
    onView,
    onApply,
}) => {

    const deadlineDays = getDaysRemaining(
        job.deadline
    );

    const skills =
        Array.isArray(job.requiredSkills)
            ? job.requiredSkills
            : Array.isArray(job.skills)
                ? job.skills
                : typeof job.requiredSkills === "string"
                    ? job.requiredSkills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                    : [];


    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">

            {/* Card top */}
            <div className="border-b border-slate-100 p-5">

                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 text-indigo-600 border border-slate-100">
                            {job.image || job.companyLogo ? (
                                <img
                                    src={job.image || job.companyLogo}
                                    alt={job.title || "Job Image"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <BriefcaseBusiness size={23} />
                            )}
                        </div>

                        <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-slate-900">
                                {job.title || "Untitled Job"}
                            </h3>

                            <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                {job.company ||
                                    job.companyName ||
                                    job.posterName ||
                                    "Job Poster"}
                            </p>

                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={onSave}
                        aria-label={
                            isSaved
                                ? "Remove saved job"
                                : "Save job"
                        }
                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                        {isSaved ? (
                            <BookmarkCheck
                                size={20}
                                className="text-indigo-600"
                            />
                        ) : (
                            <Bookmark size={20} />
                        )}
                    </button>

                </div>


                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">

                    {job.category && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {job.category}
                        </span>
                    )}

                    {job.jobType && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {job.jobType}
                        </span>
                    )}

                    {job.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            <CheckCircle2 size={12} />
                            Verified
                        </span>
                    )}

                </div>

            </div>


            {/* Information */}
            <div className="flex-1 p-5">

                <div className="grid grid-cols-2 gap-4">

                    {/* Location */}
                    <div className="flex items-start gap-2">

                        <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Location
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {job.location || "Not specified"}
                            </p>
                        </div>

                    </div>


                    {/* Salary */}
                    <div className="flex items-start gap-2">

                        <DollarSign
                            size={17}
                            className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Payment
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-800">
                                {formatSalary(job)}
                            </p>
                        </div>

                    </div>


                    {/* Hours */}
                    <div className="flex items-start gap-2">

                        <Clock3
                            size={17}
                            className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Hours
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {job.workingHours ||
                                    job.hours ||
                                    "Flexible"}
                            </p>
                        </div>

                    </div>


                    {/* Deadline */}
                    <div className="flex items-start gap-2">

                        <CalendarDays
                            size={17}
                            className="mt-0.5 shrink-0 text-slate-400"
                        />

                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Deadline
                            </p>

                            <p
                                className={`mt-0.5 text-sm font-medium ${deadlineDays !== null &&
                                        deadlineDays <= 3 &&
                                        deadlineDays >= 0
                                        ? "text-red-600"
                                        : "text-slate-700"
                                    }`}
                            >
                                {formatDate(job.deadline)}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Description */}
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                    {job.description ||
                        "No description has been provided for this opportunity."}
                </p>


                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mt-5">

                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                            Required Skills
                        </p>

                        <div className="flex flex-wrap gap-2">

                            {skills.slice(0, 4).map(
                                (skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                    >
                                        {skill}
                                    </span>
                                )
                            )}

                            {skills.length > 4 && (
                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                    +{skills.length - 4}
                                </span>
                            )}

                        </div>
                    </div>
                )}

            </div>


            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-5">

                <div className="mb-4 flex items-center justify-between">

                    <p className="text-xs text-slate-400">
                        Posted {formatDate(job.postedDate || job.createdAt)}
                    </p>

                    {deadlineDays !== null &&
                        deadlineDays >= 0 &&
                        deadlineDays <= 7 && (
                            <span className="text-xs font-semibold text-orange-600">
                                {deadlineDays === 0
                                    ? "Closes today"
                                    : `${deadlineDays} days left`}
                            </span>
                        )}

                </div>


                <div className="flex gap-2">

                    <button
                        type="button"
                        onClick={onView}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={onApply}
                        className="flex-1 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                        Apply Now
                    </button>

                </div>
            </div>

        </article>
    );
};


// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({
    hasSearched,
    clearFilters,
}) => {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <SearchX size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
                {hasSearched
                    ? "No jobs match your search"
                    : "No part-time jobs available"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {hasSearched
                    ? "Try changing your search keywords or removing some filters to find more opportunities."
                    : "There are currently no part-time opportunities available. Please check again later."}
            </p>

            {hasSearched && (
                <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                    Clear Search
                </button>
            )}

        </div>
    );
};


export default PartTimeJobs;