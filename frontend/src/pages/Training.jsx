import React, { useEffect, useState, useCallback } from "react";
import {
    Search,
    SlidersHorizontal,
    Clock3,
    Users,
    Star,
    Heart,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    BookOpen,
    GraduationCap,
    CheckCircle2,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

const parseProvider = (provider) => {
    if (!provider) return { name: "Training Provider", bio: "" };
    if (typeof provider === "object") return provider;
    if (typeof provider === "string") {
        try {
            if (provider.trim().startsWith("{")) {
                return JSON.parse(provider);
            }
        } catch (e) { }
        return { name: provider, bio: "" };
    }
    return { name: String(provider), bio: "" };
};

const categories = [
    "All Categories",
    "Web Development",
    "Graphic Design",
    "Digital Marketing",
    "Data & AI",
    "Communication",
    "Business Skills",
];

const skillLevels = [
    "All Levels",
    "Beginner",
    "Intermediate",
    "Advanced",
];

const durations = [
    "Any Duration",
    "1–4 Weeks",
    "5–8 Weeks",
    "9–12 Weeks",
    "12+ Weeks",
];

const prices = ["All (Free & Paid)", "Free", "Paid"];

const trainingTypes = [
    "All Types",
    "Online",
    "In Person",
    "Hybrid",
];

function Training() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [skillLevel, setSkillLevel] = useState("All Levels");
    const [duration, setDuration] = useState("Any Duration");
    const [price, setPrice] = useState("All (Free & Paid)");
    const [trainingType, setTrainingType] = useState("All Types");
    const [sort, setSort] = useState("Most Popular");

    const [programs, setPrograms] = useState([]);
    const [totalPrograms, setTotalPrograms] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [saved, setSaved] = useState(() => {
        try {
            const savedItems = localStorage.getItem("saved_training_programs");
            return savedItems ? JSON.parse(savedItems) : [];
        } catch {
            return [];
        }
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);

            const params = new URLSearchParams();
            if (search.trim()) params.append("search", search.trim());
            if (category !== "All Categories") params.append("category", category);
            if (skillLevel !== "All Levels") params.append("skillLevel", skillLevel);
            if (duration !== "Any Duration") params.append("duration", duration);
            if (price !== "All (Free & Paid)") params.append("price", price);
            if (trainingType !== "All Types") params.append("trainingType", trainingType);
            if (sort) params.append("sort", sort);
            params.append("page", page);
            params.append("limit", 12);

            const res = await fetch(`${API_URL}/api/training-programs?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to fetch training programs");
            }

            const data = await res.json();
            const programList = data.programs || data.data || [];
            
            setPrograms(programList);
            setTotalPrograms(data.total || programList.length);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("Error fetching database training programs:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [search, category, skillLevel, duration, price, trainingType, sort, page]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const toggleSaved = (id) => {
        setSaved((current) => {
            const next = current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id];
            try {
                localStorage.setItem("saved_training_programs", JSON.stringify(next));
            } catch (e) {
                console.error(e);
            }
            return next;
        });
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("All Categories");
        setSkillLevel("All Levels");
        setDuration("Any Duration");
        setPrice("All (Free & Paid)");
        setTrainingType("All Types");
        setSort("Most Popular");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] text-slate-900">

            {/* =========================================================
          HERO
      ========================================================= */}
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/60">

                {/* Background decorations */}
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

                <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 py-14 md:flex-row md:px-8 lg:py-20">

                    {/* Hero text */}
                    <div className="z-10 w-full md:w-1/2">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm">
                            <Sparkles size={16} />
                            Learn skills. Create opportunities.
                        </div>

                        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                            Build Skills That{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Open Doors
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                            Learn practical skills and prepare yourself for better
                            earning and career opportunities.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2
                                    size={18}
                                    className="text-emerald-500"
                                />
                                Career-focused learning
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2
                                    size={18}
                                    className="text-emerald-500"
                                />
                                Free & affordable options
                            </div>
                        </div>
                    </div>

                    {/* Hero illustration */}
                    <div className="relative w-full md:w-1/2">
                        <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-3 shadow-2xl shadow-purple-200/40 backdrop-blur">

                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
                                alt="Students learning"
                                className="h-[300px] w-full rounded-2xl object-cover md:h-[360px]"
                            />

                            <div className="absolute bottom-8 left-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                    <GraduationCap size={22} />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Learning together
                                    </p>
                                    <p className="text-sm font-bold text-slate-900">
                                        Verified DB Programs
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* =========================================================
          MAIN
      ========================================================= */}
            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:py-10">

                {/* =====================================================
            SEARCH + FILTERS
        ===================================================== */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                    {/* Search row */}
                    <div className="flex flex-col gap-3 lg:flex-row">

                        <div className="relative flex-1">
                            <Search
                                size={20}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by program name, skill, or topic..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setPage(1);
                                fetchPrograms();
                            }}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <Search size={18} />
                            Search
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="hidden whitespace-nowrap text-sm font-medium text-slate-500 lg:block">
                                Sort by
                            </span>

                            <Select
                                value={sort}
                                onChange={(val) => {
                                    setSort(val);
                                    setPage(1);
                                }}
                                options={[
                                    "Most Popular",
                                    "Highest Rated",
                                    "Newest",
                                    "Price: Low to High",
                                ]}
                                className="w-full lg:w-48"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="my-5 h-px bg-slate-100" />

                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <SlidersHorizontal size={17} />
                        Filter programs
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                        <Select
                            value={category}
                            onChange={(val) => {
                                setCategory(val);
                                setPage(1);
                            }}
                            options={categories}
                        />

                        <Select
                            value={skillLevel}
                            onChange={(val) => {
                                setSkillLevel(val);
                                setPage(1);
                            }}
                            options={skillLevels}
                        />

                        <Select
                            value={duration}
                            onChange={(val) => {
                                setDuration(val);
                                setPage(1);
                            }}
                            options={durations}
                        />

                        <Select
                            value={price}
                            onChange={(val) => {
                                setPrice(val);
                                setPage(1);
                            }}
                            options={prices}
                        />

                        <Select
                            value={trainingType}
                            onChange={(val) => {
                                setTrainingType(val);
                                setPage(1);
                            }}
                            options={trainingTypes}
                        />

                    </div>

                    <button
                        onClick={clearFilters}
                        className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-600 transition hover:text-purple-800"
                    >
                        <RotateCcw size={15} />
                        Clear filters
                    </button>
                </div>

                {/* =====================================================
            RESULT HEADER
        ===================================================== */}
                <div className="mb-5 mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Training Programs
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {totalPrograms}
                            </span>{" "}
                            programs from database
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
                        <BookOpen size={16} />
                        Learn something new today
                    </div>
                </div>

                {/* =====================================================
            LOADING STATE
        ===================================================== */}
                {loading && <LoadingState />}

                {/* =====================================================
            ERROR STATE
        ===================================================== */}
                {!loading && error && (
                    <ErrorState onRetry={fetchPrograms} />
                )}

                {/* =====================================================
            EMPTY STATE
        ===================================================== */}
                {!loading && !error && programs.length === 0 && (
                    <EmptyState onClear={clearFilters} />
                )}

                {/* =====================================================
            TRAINING GRID
        ===================================================== */}
                {!loading && !error && programs.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                            {programs.map((program) => {
                                const currentUser = (() => {
                                    try {
                                        const u = localStorage.getItem("user");
                                        return u ? JSON.parse(u) : null;
                                    } catch {
                                        return null;
                                    }
                                })();
                                return (
                                    <TrainingCard
                                        key={program.id}
                                        program={program}
                                        saved={saved.includes(program.id)}
                                        currentUser={currentUser}
                                        onSave={() => toggleSaved(program.id)}
                                        onView={() =>
                                            navigate(`/training/${program.id}`)
                                        }
                                        onEnroll={() =>
                                            navigate(`/training/${program.id}`, {
                                                state: { autoEnroll: true },
                                            })
                                        }
                                    />
                                );
                            })}

                        </div>

                        {/* =================================================
                PAGINATION
            ================================================= */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">

                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-purple-300 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition ${pageNum === page
                                                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                                                : "border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-purple-300 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={18} />
                                </button>

                            </div>
                        )}
                    </>
                )}

            </main>
        </div>
    );
}

/* =============================================================
   SELECT COMPONENT
============================================================= */

function Select({ value, onChange, options, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
        </div>
    );
}

/* =============================================================
   TRAINING CARD
============================================================= */

function TrainingCard({
    program,
    saved,
    onSave,
    onView,
    onEnroll,
    currentUser,
}) {
    const providerObj = parseProvider(program.provider);
    const providerName = providerObj.name || "Training Provider";
    const providerInitial = providerName.charAt(0).toUpperCase();

    const enrolledNum = Number(program.enrolledCount || program.enrolled || 0);
    const reviewsNum = Number(program.reviewsCount || program.reviews || 0);
    const priceNum = Number(program.price || 0);
    const ratingVal = program.rating ? Number(program.rating).toFixed(1) : "N/A";

    const isTrainingProvider = currentUser?.role === "training_provider";
    const isOwner = isTrainingProvider && (program.providerId === currentUser?.id);

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">

            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">

                <img
                    src={program.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"}
                    alt={program.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Category & Owner Tag */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm backdrop-blur">
                        {program.category}
                    </span>

                    {isOwner && (
                        <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                            Your Program
                        </span>
                    )}
                </div>

                {/* Save */}
                <button
                    onClick={onSave}
                    aria-label="Save training program"
                    className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition ${saved
                            ? "border-purple-200 bg-purple-600 text-white"
                            : "border-white/70 bg-white/95 text-slate-600 hover:text-purple-600"
                        }`}
                >
                    <Heart
                        size={19}
                        fill={saved ? "currentColor" : "none"}
                    />
                </button>
            </div>

            {/* Body */}
            <div className="p-5">

                {/* Title */}
                <h3 className="line-clamp-2 min-h-[52px] text-lg font-bold leading-6 text-slate-900 transition group-hover:text-purple-700">
                    {program.title}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-2 min-h-[42px] text-sm leading-5 text-slate-500">
                    {program.description}
                </p>

                {/* Provider */}
                <div className="mt-4 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                        {providerInitial}
                    </div>

                    <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate text-sm font-semibold text-slate-700">
                            {providerName}
                        </span>

                        {program.verified && (
                            <CheckCircle2
                                size={15}
                                className="shrink-0 text-purple-600"
                            />
                        )}
                    </div>

                </div>

                {/* Details */}
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-500">

                    <div className="flex items-center gap-2">
                        <Clock3 size={15} className="text-slate-400" />
                        {program.duration || "Flexible"}
                    </div>

                    <div className="flex items-center gap-2">
                        <Users size={15} className="text-slate-400" />
                        {enrolledNum.toLocaleString()} enrolled
                    </div>

                    <div className="flex items-center gap-2">
                        <GraduationCap size={15} className="text-slate-400" />
                        {program.skillLevel || "All Levels"}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Star
                            size={15}
                            fill="currentColor"
                            className="text-amber-400"
                        />

                        <span className="font-semibold text-slate-700">
                            {ratingVal}
                        </span>

                        <span>({reviewsNum})</span>
                    </div>

                </div>

                {/* Price + Type */}
                <div className="mt-5 flex items-center justify-between">

                    <div>
                        {priceNum === 0 ? (
                            <span className="text-sm font-bold text-emerald-600">
                                Free
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-purple-700">
                                Rs. {priceNum.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {program.trainingType || "Online"}
                    </span>

                </div>

                {/* Buttons */}
                <div className="mt-5">
                    {isTrainingProvider ? (
                        <button
                            onClick={onView}
                            className="h-11 w-full rounded-xl border border-purple-200 bg-purple-50 text-sm font-bold text-purple-700 transition hover:bg-purple-100"
                        >
                            View Program Details
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onView}
                                className="h-11 rounded-xl border border-purple-200 bg-white text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                            >
                                View Program
                            </button>

                            <button
                                onClick={onEnroll}
                                className="h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Enroll
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

/* =============================================================
   LOADING STATE
============================================================= */

function LoadingState() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                    <div className="h-52 animate-pulse bg-slate-200" />

                    <div className="space-y-4 p-5">
                        <div className="h-6 animate-pulse rounded bg-slate-200" />
                        <div className="h-10 animate-pulse rounded bg-slate-100" />

                        <div className="h-8 w-1/2 animate-pulse rounded bg-slate-100" />

                        <div className="h-10 animate-pulse rounded bg-slate-100" />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-10 animate-pulse rounded bg-slate-100" />
                            <div className="h-10 animate-pulse rounded bg-slate-100" />
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
}

/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({ onClear }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <BookOpen size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
                No training programs found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find any programs matching your current
                search or filters. Try adjusting your filters.
            </p>

            <button
                onClick={onClear}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
                <RotateCcw size={16} />
                Clear Filters
            </button>
        </div>
    );
}

/* =============================================================
   ERROR STATE
============================================================= */

function ErrorState({ onRetry }) {
    return (
        <div className="rounded-3xl border border-red-100 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
                Failed to load training programs
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Something went wrong while loading the training
                programs. Please try again.
            </p>

            <button
                onClick={onRetry}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
            >
                <RotateCcw size={16} />
                Try Again
            </button>
        </div>
    );
}

export default Training;