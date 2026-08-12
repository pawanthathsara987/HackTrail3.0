import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Award,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock3,
    GraduationCap,
    Laptop,
    Loader2,
    MapPin,
    PlayCircle,
    ShieldCheck,
    Star,
    Users,
    Video,
    XCircle,
} from "lucide-react";

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

/*
|--------------------------------------------------------------------------
| Training Program Details
|--------------------------------------------------------------------------
| Route:
| /training/:id
|
| API:
| GET  /api/training-programs/:id
| POST /api/training-programs/:id/enroll
|--------------------------------------------------------------------------
*/

function TrainingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    const [openModules, setOpenModules] = useState([0]);

    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState("");

    const getCurrentUser = () => {
        try {
            const user = localStorage.getItem("user");

            if (!user) {
                return null;
            }

            return JSON.parse(user);
        } catch {
            return null;
        }
    };

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const currentUser = getCurrentUser();
    const token = getToken();

    const isLoggedIn = Boolean(token && currentUser);

    const userRole = currentUser?.role?.toUpperCase();

    const isStudent = userRole === "STUDENT";

    const isJobPoster =
        userRole === "JOB_POSTER" ||
        userRole === "EMPLOYER" ||
        userRole === "CLIENT";

    useEffect(() => {
        fetchTrainingProgram();
    }, [id]);

    const fetchTrainingProgram = async () => {
        try {
            setLoading(true);
            setError("");
            setNotFound(false);

            const headers = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(
                `${API_URL}/api/training-programs/${id}`,
                { headers }
            );

            if (response.status === 404) {
                setNotFound(true);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load training program.");
            }

            const data = await response.json();
            const training = data?.program || data?.data || data;

            if (data?.isEnrolled !== undefined) {
                training.isEnrolled = data.isEnrolled;
            }

            setProgram(training);
        } catch (err) {
            console.error(err);
            setError(
                err.message || "Unable to load the training program."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Curriculum Accordion
    |--------------------------------------------------------------------------
    */

    const toggleModule = (index) => {
        setOpenModules((current) => {
            if (current.includes(index)) {
                return current.filter((item) => item !== index);
            }

            return [...current, index];
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Enrollment
    |--------------------------------------------------------------------------
    */

    const handleEnrollment = async () => {
        setEnrollmentError("");

        /*
         * Not logged in
         */
        if (!isLoggedIn) {
            navigate("/login", {
                state: {
                    from: `/training/${id}`,
                },
            });

            return;
        }

        /*
         * Non-student users
         */
        if (!isStudent) {
            setEnrollmentError(
                "Only students can enroll in training programs."
            );

            return;
        }

        /*
         * Already enrolled
         */
        if (program?.isEnrolled) {
            navigate(`/training/${id}/learning`);
            return;
        }

        try {
            setEnrolling(true);

            const response = await fetch(
                `${API_URL}/api/training-programs/${id}/enroll`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data?.message || "Enrollment failed. Please try again."
                );
            }

            setEnrollmentSuccess(true);

            setProgram((current) => ({
                ...current,
                isEnrolled: true,
                enrolledStudents:
                    Number(current?.enrolledStudents || current?.enrolledCount || 0) + 1,
            }));
        } catch (err) {
            console.error(err);

            setEnrollmentError(
                err.message || "Unable to complete enrollment."
            );
        } finally {
            setEnrolling(false);
        }
    };

    useEffect(() => {
        if (
            program &&
            location.state?.autoEnroll &&
            !program.isEnrolled &&
            !enrolling &&
            !enrollmentSuccess
        ) {
            handleEnrollment();
        }
    }, [program, location.state]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return <TrainingDetailsLoading />;
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <TrainingDetailsError
                message={error}
                onRetry={fetchTrainingProgram}
                onBack={() => navigate("/training")}
            />
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Not Found
    |--------------------------------------------------------------------------
    */

    if (notFound || !program) {
        return (
            <TrainingNotFound
                onBack={() => navigate("/training")}
            />
        );
    }

    const providerObj = parseProvider(program?.provider);
    const providerName = providerObj.name || "Training Provider";
    const providerBio = providerObj.bio || "";
    const enrolledNum = Number(program?.enrolledCount || program?.enrolledStudents || 0);
    const reviewsNum = Number(program?.reviewsCount || program?.reviewCount || 0);

    const curriculum = program.curriculum || [];

    return (
        <div className="min-h-screen bg-[#f8f9fc] text-slate-900">

            {/* =========================================================
          TOP NAV / BACK
      ========================================================= */}

            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
                    <button
                        onClick={() => navigate("/training")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-purple-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Training Programs
                    </button>
                </div>
            </div>

            {/* =========================================================
          HERO
      ========================================================= */}

            <section className="relative overflow-hidden bg-slate-950">

                <div className="absolute inset-0">
                    <img
                        src={program.image}
                        alt=""
                        className="h-full w-full object-cover opacity-20"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-purple-950/80" />
                </div>

                <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 lg:py-14">

                    <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">

                        {/* Hero information */}

                        <div className="max-w-3xl">

                            {/* Category */}

                            <div className="mb-5 flex flex-wrap items-center gap-3">

                                {program.category && (
                                    <span className="rounded-full bg-purple-500/20 px-4 py-2 text-xs font-bold text-purple-200 ring-1 ring-purple-400/30">
                                        {program.category}
                                    </span>
                                )}

                                {program.verified && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                                        <ShieldCheck size={14} />
                                        Verified Provider
                                    </span>
                                )}

                            </div>

                            {/* Title */}

                            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                                {program.title}
                            </h1>

                            {/* Description */}

                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                                {program.shortDescription ||
                                    program.description}
                            </p>

                            {/* Provider */}

                            <div className="mt-6 flex flex-wrap items-center gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                                        {getInitials(providerName)}
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Provided by
                                        </p>

                                        <p className="font-semibold text-white">
                                            {providerName}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Stats */}

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">

                                <HeroStat
                                    icon={<Star size={17} />}
                                    value={program.rating || "N/A"}
                                    label={
                                        program.rating
                                            ? `${reviewsNum} reviews`
                                            : "No ratings yet"
                                    }
                                />

                                <HeroStat
                                    icon={<Users size={17} />}
                                    value={formatNumber(enrolledNum)}
                                    label="students enrolled"
                                />

                                <HeroStat
                                    icon={<Clock3 size={17} />}
                                    value={
                                        program.duration || "Flexible"
                                    }
                                    label="duration"
                                />

                                <HeroStat
                                    icon={<GraduationCap size={17} />}
                                    value={
                                        program.skillLevel || "All Levels"
                                    }
                                    label="skill level"
                                />

                            </div>

                        </div>

                        {/* =====================================================
                ENROLL CARD
            ===================================================== */}

                        <EnrollmentCard
                            program={program}
                            isLoggedIn={isLoggedIn}
                            isStudent={isStudent}
                            isJobPoster={isJobPoster}
                            enrolling={enrolling}
                            enrollmentSuccess={enrollmentSuccess}
                            enrollmentError={enrollmentError}
                            onEnroll={handleEnrollment}
                            onContinue={() =>
                                navigate(`/training/${id}/learning`)
                            }
                            onLogin={() =>
                                navigate("/login", {
                                    state: {
                                        from: `/training/${id}`,
                                    },
                                })
                            }
                        />

                    </div>

                </div>
            </section>

            {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:py-14">

                <div className="grid gap-10 lg:grid-cols-[1fr_350px]">

                    {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

                    <div className="space-y-8">

                        {/* About */}

                        <ContentSection
                            icon={<BookOpen size={20} />}
                            title="About the Program"
                        >
                            <p className="whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">
                                {program.about ||
                                    program.description ||
                                    "This training program is designed to help students develop practical and career-focused skills."}
                            </p>
                        </ContentSection>

                        {/* What you will learn */}

                        <ContentSection
                            icon={<GraduationCap size={20} />}
                            title="What You Will Learn"
                        >
                            <div className="grid gap-3 sm:grid-cols-2">

                                {(program.whatYouWillLearn || []).map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                                        >
                                            <CheckCircle2
                                                size={19}
                                                className="mt-0.5 shrink-0 text-emerald-500"
                                            />

                                            <span className="text-sm leading-6 text-slate-700">
                                                {item}
                                            </span>
                                        </div>
                                    )
                                )}

                            </div>

                            {(!program.whatYouWillLearn ||
                                program.whatYouWillLearn.length === 0) && (
                                    <EmptyContent text="Learning outcomes will be available soon." />
                                )}
                        </ContentSection>

                        {/* Skills */}

                        <ContentSection
                            icon={<Award size={20} />}
                            title="Skills You Will Gain"
                        >
                            <div className="flex flex-wrap gap-3">

                                {(program.skills || []).map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}

                            </div>

                            {(!program.skills ||
                                program.skills.length === 0) && (
                                    <EmptyContent text="Skills information will be available soon." />
                                )}
                        </ContentSection>

                        {/* Curriculum */}

                        <ContentSection
                            icon={<PlayCircle size={20} />}
                            title="Course Curriculum"
                        >
                            <div className="overflow-hidden rounded-2xl border border-slate-200">

                                {curriculum.length > 0 ? (
                                    curriculum.map((module, index) => {
                                        const isOpen =
                                            openModules.includes(index);

                                        return (
                                            <div
                                                key={module.id || index}
                                                className="border-b border-slate-200 last:border-b-0"
                                            >

                                                <button
                                                    onClick={() =>
                                                        toggleModule(index)
                                                    }
                                                    className="flex w-full items-center justify-between gap-5 bg-white p-5 text-left transition hover:bg-slate-50"
                                                >

                                                    <div className="flex items-center gap-4">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-purple-700">
                                                            {String(index + 1).padStart(
                                                                2,
                                                                "0"
                                                            )}
                                                        </div>

                                                        <div>

                                                            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                                                                Module {index + 1}
                                                            </p>

                                                            <h3 className="mt-1 text-sm font-bold text-slate-900 md:text-base">
                                                                {module.title}
                                                            </h3>

                                                        </div>

                                                    </div>

                                                    {isOpen ? (
                                                        <ChevronUp
                                                            size={20}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                    ) : (
                                                        <ChevronDown
                                                            size={20}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                    )}

                                                </button>

                                                {isOpen && (
                                                    <div className="bg-slate-50 px-5 pb-5 pt-1">

                                                        {module.description && (
                                                            <p className="mb-4 pl-14 text-sm leading-6 text-slate-500">
                                                                {module.description}
                                                            </p>
                                                        )}

                                                        <div className="space-y-2 pl-14">

                                                            {(module.lessons || []).map(
                                                                (lesson, lessonIndex) => (
                                                                    <div
                                                                        key={
                                                                            lesson.id ||
                                                                            lessonIndex
                                                                        }
                                                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                                                                    >

                                                                        <div className="flex items-center gap-3">

                                                                            <PlayCircle
                                                                                size={17}
                                                                                className="text-purple-500"
                                                                            />

                                                                            <span className="text-sm font-medium text-slate-700">
                                                                                {typeof lesson ===
                                                                                    "string"
                                                                                    ? lesson
                                                                                    : lesson.title}
                                                                            </span>

                                                                        </div>

                                                                        {typeof lesson !==
                                                                            "string" &&
                                                                            lesson.duration && (
                                                                                <span className="text-xs text-slate-400">
                                                                                    {
                                                                                        lesson.duration
                                                                                    }
                                                                                </span>
                                                                            )}

                                                                    </div>
                                                                )
                                                            )}

                                                        </div>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center">
                                        <BookOpen
                                            size={30}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-3 text-sm text-slate-500">
                                            Curriculum details will be available
                                            soon.
                                        </p>
                                    </div>
                                )}

                            </div>
                        </ContentSection>

                        {/* Requirements */}

                        <ContentSection
                            icon={<CheckCircle2 size={20} />}
                            title="Requirements"
                        >
                            <ul className="space-y-3">

                                {(program.requirements || []).map(
                                    (requirement, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-sm leading-6 text-slate-600"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                                            {requirement}
                                        </li>
                                    )
                                )}

                            </ul>

                            {(!program.requirements ||
                                program.requirements.length === 0) && (
                                    <EmptyContent text="No specific requirements. Check the program description for details." />
                                )}
                        </ContentSection>

                    </div>

                    {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}

                    <aside className="space-y-5">

                        {/* Program information */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Program Information
                            </h2>

                            <div className="mt-5 space-y-4">

                                <InfoRow
                                    icon={<Clock3 size={18} />}
                                    label="Duration"
                                    value={
                                        program.duration || "Not specified"
                                    }
                                />

                                <InfoRow
                                    icon={<Laptop size={18} />}
                                    label="Learning Format"
                                    value={
                                        program.learningFormat ||
                                        program.trainingType ||
                                        "Online"
                                    }
                                />

                                <InfoRow
                                    icon={<GraduationCap size={18} />}
                                    label="Skill Level"
                                    value={
                                        program.skillLevel ||
                                        "All Levels"
                                    }
                                />

                                <InfoRow
                                    icon={<Users size={18} />}
                                    label="Students"
                                    value={`${formatNumber(
                                        program.enrolledStudents || 0
                                    )} enrolled`}
                                />

                                <InfoRow
                                    icon={<MapPin size={18} />}
                                    label="Location"
                                    value={
                                        program.location || "Online"
                                    }
                                />

                            </div>

                        </div>

                        {/* Trainer */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Trainer Information
                            </h2>

                            <div className="mt-5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-lg font-bold text-white">
                                        {getInitials(
                                            program.trainer?.name ||
                                            providerName
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {program.trainer?.name ||
                                                providerName}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {program.trainer?.role ||
                                                "Professional Trainer"}
                                        </p>
                                    </div>

                                </div>

                                {(program.trainer?.bio || providerBio) && (
                                    <p className="mt-5 text-sm leading-6 text-slate-500">
                                        {program.trainer?.bio || providerBio}
                                    </p>
                                )}

                                {program.trainer?.experience && (
                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-purple-50 p-3 text-sm font-medium text-purple-700">
                                        <Award size={17} />
                                        {program.trainer.experience}
                                    </div>
                                )}

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

            {/* =========================================================
          MOBILE STICKY ENROLL BAR
      ========================================================= */}

            <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur lg:hidden">

                <div className="flex items-center justify-between gap-4">

                    <div>
                        <p className="text-xs text-slate-500">
                            Program price
                        </p>

                        <p className="text-lg font-extrabold text-slate-900">
                            {program.price === 0 ||
                                program.isFree
                                ? "Free"
                                : `Rs. ${Number(
                                    program.price || 0
                                ).toLocaleString()}`}
                        </p>
                    </div>

                    <EnrollmentButton
                        program={program}
                        isLoggedIn={isLoggedIn}
                        isStudent={isStudent}
                        isJobPoster={isJobPoster}
                        enrolling={enrolling}
                        enrollmentSuccess={enrollmentSuccess}
                        onEnroll={handleEnrollment}
                        onContinue={() =>
                            navigate(`/training/${id}/learning`)
                        }
                        onLogin={() =>
                            navigate("/login", {
                                state: {
                                    from: `/training/${id}`,
                                },
                            })
                        }
                    />

                </div>
            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Hero Stat
|--------------------------------------------------------------------------
*/

function HeroStat({ icon, value, label }) {
    return (
        <div className="flex items-center gap-2">

            <div className="text-purple-300">
                {icon}
            </div>

            <div>
                <p className="font-bold text-white">
                    {value}
                </p>

                <p className="text-xs text-slate-400">
                    {label}
                </p>
            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Enrollment Card
|--------------------------------------------------------------------------
*/

function EnrollmentCard({
    program,
    isLoggedIn,
    isStudent,
    isJobPoster,
    enrolling,
    enrollmentSuccess,
    enrollmentError,
    onEnroll,
    onContinue,
    onLogin,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">

            {/* Image */}

            <div className="relative h-52 overflow-hidden">

                <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-4 left-5 flex items-center gap-2 text-sm font-semibold text-white">
                    <Video size={17} />
                    {program.learningFormat ||
                        program.trainingType ||
                        "Online Learning"}
                </div>

            </div>

            <div className="p-6">

                {/* Price */}

                <div className="flex items-end justify-between">

                    <div>

                        <p className="text-xs font-medium text-slate-500">
                            Program fee
                        </p>

                        <p className="mt-1 text-3xl font-extrabold text-slate-900">
                            {program.price === 0 ||
                                program.isFree
                                ? "Free"
                                : `Rs. ${Number(
                                    program.price || 0
                                ).toLocaleString()}`}
                        </p>

                    </div>

                    {program.rating && (
                        <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-bold text-amber-700">
                            <Star
                                size={15}
                                fill="currentColor"
                            />
                            {program.rating}
                        </div>
                    )}

                </div>

                {/* Success */}

                {enrollmentSuccess && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                        <div className="flex gap-3">

                            <CheckCircle2
                                size={20}
                                className="shrink-0 text-emerald-600"
                            />

                            <div>
                                <p className="font-bold text-emerald-800">
                                    Enrollment successful!
                                </p>

                                <p className="mt-1 text-xs leading-5 text-emerald-700">
                                    You are now enrolled in this training
                                    program.
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={onContinue}
                            className="mt-3 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Continue Learning
                        </button>

                    </div>
                )}

                {/* Error */}

                {enrollmentError && (
                    <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                        <XCircle
                            size={19}
                            className="shrink-0 text-red-500"
                        />

                        <p className="text-sm leading-5 text-red-700">
                            {enrollmentError}
                        </p>

                    </div>
                )}

                {/* Main enrollment button */}

                {!enrollmentSuccess && (
                    <div className="mt-6">

                        <EnrollmentButton
                            program={program}
                            isLoggedIn={isLoggedIn}
                            isStudent={isStudent}
                            isJobPoster={isJobPoster}
                            enrolling={enrolling}
                            enrollmentSuccess={enrollmentSuccess}
                            onEnroll={onEnroll}
                            onContinue={onContinue}
                            onLogin={onLogin}
                        />

                    </div>
                )}

                {/* Trust */}

                <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">

                    <TrustItem text="Practical career-focused content" />

                    <TrustItem text="Learn at your own pace" />

                    <TrustItem text="Certificate upon completion" />

                </div>

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Enrollment Button
|--------------------------------------------------------------------------
*/

function EnrollmentButton({
    program,
    isLoggedIn,
    isStudent,
    isJobPoster,
    enrolling,
    enrollmentSuccess,
    onEnroll,
    onContinue,
    onLogin,
}) {
    /*
     * Already enrolled
     */

    if (program?.isEnrolled) {
        return (
            <button
                onClick={onContinue}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
            >
                <PlayCircle size={18} />
                Continue Learning
            </button>
        );
    }

    /*
     * Logged out
     */

    if (!isLoggedIn) {
        return (
            <button
                onClick={onLogin}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
                <GraduationCap size={18} />
                Login to Enroll
            </button>
        );
    }

    /*
     * Job Poster / Client
     */

    if (isJobPoster || !isStudent) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">

                <p className="text-sm font-semibold text-slate-700">
                    Student enrollment only
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    This program is available for students to
                    enroll.
                </p>

            </div>
        );
    }

    /*
     * Enrolling
     */

    if (enrolling) {
        return (
            <button
                disabled
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-400 px-5 text-sm font-bold text-white"
            >
                <Loader2
                    size={18}
                    className="animate-spin"
                />
                Enrolling...
            </button>
        );
    }

    /*
     * Student
     */

    return (
        <button
            onClick={onEnroll}
            disabled={enrollmentSuccess}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
            <GraduationCap size={18} />
            Enroll Now
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Content Section
|--------------------------------------------------------------------------
*/

function ContentSection({ icon, title, children }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    {icon}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                    {title}
                </h2>

            </div>

            {children}

        </section>
    );
}

/*
|--------------------------------------------------------------------------
| Info Row
|--------------------------------------------------------------------------
*/

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs text-slate-400">
                    {label}
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                    {value}
                </p>

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Trust Item
|--------------------------------------------------------------------------
*/

function TrustItem({ text }) {
    return (
        <div className="flex items-center gap-2 text-xs text-slate-500">

            <CheckCircle2
                size={15}
                className="text-emerald-500"
            />

            {text}

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Empty Content
|--------------------------------------------------------------------------
*/

function EmptyContent({ text }) {
    return (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            {text}
        </p>
    );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function TrainingDetailsLoading() {
    return (
        <div className="min-h-screen bg-[#f8f9fc]">

            {/* Hero skeleton */}

            <div className="bg-slate-900">

                <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">

                    <div className="max-w-3xl space-y-5">

                        <div className="h-7 w-32 animate-pulse rounded-full bg-slate-800" />

                        <div className="h-14 w-3/4 animate-pulse rounded-xl bg-slate-800" />

                        <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-slate-800" />

                        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />

                        <div className="flex gap-6 pt-4">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-12 w-28 animate-pulse rounded bg-slate-800"
                                />
                            ))}

                        </div>

                    </div>

                </div>

            </div>

            {/* Content skeleton */}

            <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">

                <div className="grid gap-8 lg:grid-cols-[1fr_350px]">

                    <div className="space-y-6">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-slate-200 bg-white p-8"
                            >

                                <div className="h-7 w-52 animate-pulse rounded bg-slate-200" />

                                <div className="mt-6 space-y-3">

                                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                                    <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />

                                </div>

                            </div>
                        ))}

                    </div>

                    <div className="h-96 animate-pulse rounded-2xl bg-white" />

                </div>

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

function TrainingDetailsError({
    message,
    onRetry,
    onBack,
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-5">

            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <XCircle size={30} />
                </div>

                <h1 className="mt-5 text-xl font-bold text-slate-900">
                    Unable to load program
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {message}
                </p>

                <div className="mt-6 flex gap-3">

                    <button
                        onClick={onBack}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Back
                    </button>

                    <button
                        onClick={onRetry}
                        className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Not Found
|--------------------------------------------------------------------------
*/

function TrainingNotFound({ onBack }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-5">

            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                    <BookOpen size={30} />
                </div>

                <h1 className="mt-5 text-xl font-bold text-slate-900">
                    Training program not found
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    The training program you're looking for may have
                    been removed, expired, or does not exist.
                </p>

                <button
                    onClick={onBack}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                    <ArrowLeft size={17} />
                    Browse Training Programs
                </button>

            </div>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

export default TrainingDetails;