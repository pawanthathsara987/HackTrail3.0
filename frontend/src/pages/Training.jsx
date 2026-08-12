import React, { useMemo, useState } from "react";
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
    Code2,
    Palette,
    Megaphone,
    Brain,
    BriefcaseBusiness,
    MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockPrograms = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        description:
            "Learn HTML, CSS, JavaScript, React and Node.js by building real-world projects.",
        provider: "CodeMaster Academy",
        category: "Web Development",
        skillLevel: "Intermediate",
        duration: "12 Weeks",
        durationWeeks: 12,
        price: 0,
        trainingType: "Online",
        enrolled: 1245,
        rating: 4.8,
        reviews: 256,
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        verified: true,
    },
    {
        id: 2,
        title: "Canva Mastery: Design Like a Pro",
        description:
            "Create stunning designs for social media, branding, presentations and more.",
        provider: "DesignHub",
        category: "Graphic Design",
        skillLevel: "Beginner",
        duration: "4 Weeks",
        durationWeeks: 4,
        price: 0,
        trainingType: "Online",
        enrolled: 892,
        rating: 4.7,
        reviews: 187,
        image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
        verified: true,
    },
    {
        id: 3,
        title: "Digital Marketing Complete Course",
        description:
            "Learn SEO, social media, Google Ads, email marketing and digital strategy.",
        provider: "MarketEdge Institute",
        category: "Digital Marketing",
        skillLevel: "Intermediate",
        duration: "8 Weeks",
        durationWeeks: 8,
        price: 1999,
        trainingType: "Hybrid",
        enrolled: 1102,
        rating: 4.6,
        reviews: 142,
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
        verified: true,
    },
    {
        id: 4,
        title: "Data Science & Machine Learning with Python",
        description:
            "Learn Python, data analysis, machine learning and build practical AI projects.",
        provider: "AI School",
        category: "Data & AI",
        skillLevel: "Advanced",
        duration: "16 Weeks",
        durationWeeks: 16,
        price: 3999,
        trainingType: "Online",
        enrolled: 756,
        rating: 4.9,
        reviews: 215,
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
        verified: true,
    },
    {
        id: 5,
        title: "Professional Communication Skills",
        description:
            "Improve public speaking, teamwork, presentation and workplace communication.",
        provider: "CareerBoost",
        category: "Communication",
        skillLevel: "Beginner",
        duration: "3 Weeks",
        durationWeeks: 3,
        price: 0,
        trainingType: "In Person",
        enrolled: 634,
        rating: 4.5,
        reviews: 98,
        image:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
        verified: true,
    },
    {
        id: 6,
        title: "Entrepreneurship & Business Fundamentals",
        description:
            "Learn business planning, finance, marketing and how to start your own business.",
        provider: "Business Academy",
        category: "Business Skills",
        skillLevel: "Intermediate",
        duration: "6 Weeks",
        durationWeeks: 6,
        price: 1499,
        trainingType: "Online",
        enrolled: 481,
        rating: 4.7,
        reviews: 76,
        image:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
        verified: true,
    },
];

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

    const [saved, setSaved] = useState([]);
    const [loading] = useState(false);
    const [error] = useState(false);

    const filteredPrograms = useMemo(() => {
        let result = [...mockPrograms];

        if (search.trim()) {
            const query = search.toLowerCase();

            result = result.filter(
                (program) =>
                    program.title.toLowerCase().includes(query) ||
                    program.description.toLowerCase().includes(query) ||
                    program.category.toLowerCase().includes(query) ||
                    program.provider.toLowerCase().includes(query)
            );
        }

        if (category !== "All Categories") {
            result = result.filter(
                (program) => program.category === category
            );
        }

        if (skillLevel !== "All Levels") {
            result = result.filter(
                (program) => program.skillLevel === skillLevel
            );
        }

        if (price === "Free") {
            result = result.filter((program) => program.price === 0);
        }

        if (price === "Paid") {
            result = result.filter((program) => program.price > 0);
        }

        if (trainingType !== "All Types") {
            result = result.filter(
                (program) => program.trainingType === trainingType
            );
        }

        if (duration !== "Any Duration") {
            result = result.filter((program) => {
                if (duration === "1–4 Weeks") {
                    return program.durationWeeks >= 1 && program.durationWeeks <= 4;
                }

                if (duration === "5–8 Weeks") {
                    return program.durationWeeks >= 5 && program.durationWeeks <= 8;
                }

                if (duration === "9–12 Weeks") {
                    return program.durationWeeks >= 9 && program.durationWeeks <= 12;
                }

                if (duration === "12+ Weeks") {
                    return program.durationWeeks > 12;
                }

                return true;
            });
        }

        if (sort === "Most Popular") {
            result.sort((a, b) => b.enrolled - a.enrolled);
        }

        if (sort === "Highest Rated") {
            result.sort((a, b) => b.rating - a.rating);
        }

        if (sort === "Newest") {
            result.sort((a, b) => b.id - a.id);
        }

        if (sort === "Price: Low to High") {
            result.sort((a, b) => a.price - b.price);
        }

        return result;
    }, [
        search,
        category,
        skillLevel,
        duration,
        price,
        trainingType,
        sort,
    ]);

    const toggleSaved = (id) => {
        setSaved((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("All Categories");
        setSkillLevel("All Levels");
        setDuration("Any Duration");
        setPrice("All (Free & Paid)");
        setTrainingType("All Types");
        setSort("Most Popular");
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
                                        2,500+ students
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
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by program name, skill, or topic..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                            />
                        </div>

                        <button
                            type="button"
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
                                onChange={setSort}
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
                            onChange={setCategory}
                            options={categories}
                        />

                        <Select
                            value={skillLevel}
                            onChange={setSkillLevel}
                            options={skillLevels}
                        />

                        <Select
                            value={duration}
                            onChange={setDuration}
                            options={durations}
                        />

                        <Select
                            value={price}
                            onChange={setPrice}
                            options={prices}
                        />

                        <Select
                            value={trainingType}
                            onChange={setTrainingType}
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
                                {filteredPrograms.length}
                            </span>{" "}
                            programs
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
                    <ErrorState onRetry={() => window.location.reload()} />
                )}

                {/* =====================================================
            EMPTY STATE
        ===================================================== */}
                {!loading && !error && filteredPrograms.length === 0 && (
                    <EmptyState onClear={clearFilters} />
                )}

                {/* =====================================================
            TRAINING GRID
        ===================================================== */}
                {!loading && !error && filteredPrograms.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                            {filteredPrograms.map((program) => (
                                <TrainingCard
                                    key={program.id}
                                    program={program}
                                    saved={saved.includes(program.id)}
                                    onSave={() => toggleSaved(program.id)}
                                    onView={() =>
                                        navigate(`/training/${program.id}`)
                                    }
                                    onEnroll={() =>
                                        navigate(`/training/${program.id}`)
                                    }
                                />
                            ))}

                        </div>

                        {/* =================================================
                PAGINATION
            ================================================= */}
                        <div className="mt-10 flex items-center justify-center gap-2">

                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-purple-300 hover:text-purple-600"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {[1, 2, 3, 4].map((page) => (
                                <button
                                    key={page}
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition ${page === 1
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-purple-300 hover:text-purple-600"
                            >
                                <ChevronRight size={18} />
                            </button>

                        </div>
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
}) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">

            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-slate-100">

                <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Category */}
                <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm backdrop-blur">
                        {program.category}
                    </span>
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
                        {program.provider.charAt(0)}
                    </div>

                    <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate text-sm font-semibold text-slate-700">
                            {program.provider}
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
                        {program.duration}
                    </div>

                    <div className="flex items-center gap-2">
                        <Users size={15} className="text-slate-400" />
                        {program.enrolled.toLocaleString()} enrolled
                    </div>

                    <div className="flex items-center gap-2">
                        <GraduationCap size={15} className="text-slate-400" />
                        {program.skillLevel}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Star
                            size={15}
                            fill="currentColor"
                            className="text-amber-400"
                        />

                        <span className="font-semibold text-slate-700">
                            {program.rating}
                        </span>

                        <span>({program.reviews})</span>
                    </div>

                </div>

                {/* Price + Type */}
                <div className="mt-5 flex items-center justify-between">

                    <div>
                        {program.price === 0 ? (
                            <span className="text-sm font-bold text-emerald-600">
                                Free
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-purple-700">
                                Rs. {program.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {program.trainingType}
                    </span>

                </div>

                {/* Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3">

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