// PartTimeJobDetails.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    AlertCircle,
    Bookmark,
    BookmarkCheck,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    DollarSign,
    Loader2,
    MapPin,
    Users,
} from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "";


/* --------------------------------------------------
   Authentication
   Replace this helper with your existing auth hook
   if your project already has one.
-------------------------------------------------- */

const getCurrentUser = () => {
    try {
        const possibleKeys = [
            "user",
            "currentUser",
            "authUser",
            "loggedInUser",
        ];

        for (const key of possibleKeys) {
            const storedUser = localStorage.getItem(key);

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                return parsedUser?.user || parsedUser;
            }
        }
    } catch (error) {
        console.error("Unable to read authenticated user:", error);
    }

    return null;
};

/* --------------------------------------------------
   API Functions
-------------------------------------------------- */

const getJob = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/api/jobs/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {}),
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load job details."
        );
    }

    return data;
};

const applyForJob = async (jobId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/api/jobs/${jobId}/apply`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to submit application."
        );
    }

    return data;
};

const saveJob = async (jobId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/api/jobs/${jobId}/save`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to save job."
        );
    }

    return data;
};

const unsaveJob = async (jobId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}/api/jobs/${jobId}/save`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to remove saved job."
        );
    }

    return data;
};

/* --------------------------------------------------
   Helper Functions
-------------------------------------------------- */

const formatDate = (date) => {
    if (!date) {
        return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatSalary = (job) => {
    if (job.salary) {
        return job.salary;
    }

    if (job.salaryMin && job.salaryMax) {
        return `Rs. ${Number(
            job.salaryMin
        ).toLocaleString()} - Rs. ${Number(
            job.salaryMax
        ).toLocaleString()}`;
    }

    if (job.salaryMin) {
        return `From Rs. ${Number(
            job.salaryMin
        ).toLocaleString()}`;
    }

    return "Negotiable";
};

const getArrayValue = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

/* --------------------------------------------------
   Main Component
-------------------------------------------------- */

const PartTimeJobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isApplying, setIsApplying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [alreadyApplied, setAlreadyApplied] =
        useState(false);

    const [applicationSuccess, setApplicationSuccess] =
        useState(false);

    const [isSaved, setIsSaved] = useState(false);

    const [actionError, setActionError] =
        useState("");

    /* ------------------------------------------------
       Load user and job
    ------------------------------------------------ */

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getJob(id);

            const loadedJob =
                response?.job ||
                response?.data ||
                response;

            if (!loadedJob || !loadedJob.id) {
                setJob(null);
                return;
            }

            setJob(loadedJob);

            /*
              The backend can return these values when the
              authenticated student has already interacted
              with this job.
            */

            setAlreadyApplied(
                Boolean(
                    loadedJob.hasApplied ||
                    loadedJob.alreadyApplied ||
                    loadedJob.applicationSubmitted
                )
            );

            setIsSaved(
                Boolean(
                    loadedJob.isSaved ||
                    loadedJob.saved
                )
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Something went wrong while loading the job."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ------------------------------------------------
       Apply
    ------------------------------------------------ */

    const handleApply = async () => {
        setActionError("");

        // User is not logged in
        if (!user) {
            navigate("/login");
            return;
        }

        const role = String(
            user.role || ""
        ).toUpperCase();

        // Only students can apply
        if (role !== "STUDENT") {
            setActionError(
                "Only students can apply for part-time jobs."
            );
            return;
        }

        // Already applied
        if (alreadyApplied) {
            return;
        }

        try {
            setIsApplying(true);

            await applyForJob(job.id);

            setAlreadyApplied(true);
            setApplicationSuccess(true);
        } catch (err) {
            console.error(err);

            /*
              If backend says the student already applied,
              show the correct state instead of treating it
              as a generic error.
            */

            if (
                err.message
                    ?.toLowerCase()
                    .includes("already applied")
            ) {
                setAlreadyApplied(true);
            } else {
                setActionError(
                    err.message ||
                    "Unable to submit your application."
                );
            }
        } finally {
            setIsApplying(false);
        }
    };

    /* ------------------------------------------------
       Save / Unsave
    ------------------------------------------------ */

    const handleSave = async () => {
        setActionError("");

        if (!user) {
            navigate("/login");
            return;
        }

        const role = String(
            user.role || ""
        ).toUpperCase();

        if (role !== "STUDENT") {
            setActionError(
                "Only students can save part-time jobs."
            );
            return;
        }

        try {
            setIsSaving(true);

            if (isSaved) {
                await unsaveJob(job.id);
                setIsSaved(false);
            } else {
                await saveJob(job.id);
                setIsSaved(true);
            }
        } catch (err) {
            console.error(err);

            setActionError(
                err.message ||
                "Unable to update saved jobs."
            );
        } finally {
            setIsSaving(false);
        }
    };

    /* ------------------------------------------------
       Loading State
    ------------------------------------------------ */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="flex min-h-[70vh] items-center justify-center px-4">
                    <div className="text-center">
                        <Loader2
                            className="mx-auto animate-spin text-indigo-600"
                            size={42}
                        />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Loading job details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------
       API Error
    ------------------------------------------------ */

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-16">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <div className="flex gap-4">
                            <AlertCircle
                                className="shrink-0 text-red-600"
                                size={24}
                            />

                            <div>
                                <h2 className="font-bold text-red-800">
                                    Unable to load job
                                </h2>

                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>

                                <button
                                    onClick={loadJob}
                                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------
       Job Not Found
    ------------------------------------------------ */

    if (!job) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-20">
                <div className="mx-auto max-w-xl text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <BriefcaseIcon />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-slate-900">
                        Job Not Found
                    </h1>

                    <p className="mt-2 text-slate-500">
                        The part-time job you are looking for
                        could not be found.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/part-time-jobs")
                        }
                        className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                        Back to Part-Time Jobs
                    </button>
                </div>
            </div>
        );
    }

    /* ------------------------------------------------
       Data
    ------------------------------------------------ */

    const responsibilities =
        getArrayValue(
            job.responsibilities
        );

    const requirements =
        getArrayValue(
            job.requirements
        );

    const skills =
        getArrayValue(
            job.requiredSkills ||
            job.skills
        );

    const role = String(
        user?.role || ""
    ).toUpperCase();

    const companyName =
        job.companyName ||
        job.company ||
        job.poster?.fullName ||
        job.jobPoster?.organizationName ||
        job.jobPoster?.companyName ||
        job.jobPoster?.name ||
        "Job Poster";


    /* ------------------------------------------------
       Render
    ------------------------------------------------ */

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Page */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

                {/* Two Column Layout */}
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

                    {/* =========================================
              MAIN SECTION
          ========================================== */}

                    <section className="min-w-0">

                        {/* Header */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                            <div className="flex flex-wrap items-center gap-3">

                                {job.category && (
                                    <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                                        {job.category}
                                    </span>
                                )}

                                {job.jobType && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                                        {job.jobType}
                                    </span>
                                )}

                            </div>

                            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                        {job.title}
                                    </h1>

                                    <div className="mt-3 flex items-center gap-2 text-slate-600">
                                        <Building2 size={18} />

                                        <span className="font-medium">
                                            {companyName}
                                        </span>
                                    </div>
                                </div>

                                {(job.image || job.companyLogo) && (
                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                                        <img
                                            src={job.image || job.companyLogo}
                                            alt={job.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Quick Information */}
                            <div className="mt-7 grid gap-3 sm:grid-cols-2">

                                <InfoCard
                                    icon={<MapPin size={19} />}
                                    label="Location"
                                    value={
                                        job.location ||
                                        "Not specified"
                                    }
                                />

                                <InfoCard
                                    icon={<DollarSign size={19} />}
                                    label="Salary / Payment"
                                    value={formatSalary(job)}
                                />

                                <InfoCard
                                    icon={<Clock3 size={19} />}
                                    label="Working Hours"
                                    value={
                                        job.workingHours ||
                                        job.hours ||
                                        "Not specified"
                                    }
                                />

                                <InfoCard
                                    icon={
                                        <CalendarDays size={19} />
                                    }
                                    label="Application Deadline"
                                    value={formatDate(
                                        job.deadline ||
                                        job.applicationDeadline
                                    )}
                                />

                            </div>
                        </div>

                        {/* Description */}
                        <ContentSection title="Job Description">
                            <p className="whitespace-pre-line leading-8 text-slate-600">
                                {job.description ||
                                    "No job description provided."}
                            </p>
                        </ContentSection>

                        {/* Responsibilities */}
                        {responsibilities.length > 0 && (
                            <ContentSection title="Responsibilities">

                                <ul className="space-y-3">
                                    {responsibilities.map(
                                        (item, index) => (
                                            <li
                                                key={`${item}-${index}`}
                                                className="flex gap-3 text-slate-600"
                                            >
                                                <CheckCircle2
                                                    size={19}
                                                    className="mt-1 shrink-0 text-indigo-600"
                                                />

                                                <span className="leading-7">
                                                    {item}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                            </ContentSection>
                        )}

                        {/* Requirements */}
                        {requirements.length > 0 && (
                            <ContentSection title="Requirements">

                                <ul className="space-y-3">
                                    {requirements.map(
                                        (item, index) => (
                                            <li
                                                key={`${item}-${index}`}
                                                className="flex gap-3 text-slate-600"
                                            >
                                                <CheckCircle2
                                                    size={19}
                                                    className="mt-1 shrink-0 text-indigo-600"
                                                />

                                                <span className="leading-7">
                                                    {item}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                            </ContentSection>
                        )}

                        {/* Required Skills */}
                        {skills.length > 0 && (
                            <ContentSection title="Required Skills">

                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                            </ContentSection>
                        )}

                        {/* Job Information */}
                        <ContentSection title="Job Information">

                            <div className="grid gap-4 sm:grid-cols-2">

                                <DetailRow
                                    icon={<Clock3 size={19} />}
                                    label="Working Hours"
                                    value={
                                        job.workingHours ||
                                        job.hours ||
                                        "Not specified"
                                    }
                                />

                                <DetailRow
                                    icon={<MapPin size={19} />}
                                    label="Location"
                                    value={
                                        job.location ||
                                        "Not specified"
                                    }
                                />

                                <DetailRow
                                    icon={<DollarSign size={19} />}
                                    label="Salary / Payment"
                                    value={formatSalary(job)}
                                />

                                <DetailRow
                                    icon={
                                        <CalendarDays size={19} />
                                    }
                                    label="Application Deadline"
                                    value={formatDate(
                                        job.deadline ||
                                        job.applicationDeadline
                                    )}
                                />

                            </div>

                        </ContentSection>

                    </section>

                    {/* =========================================
              SIDEBAR
          ========================================== */}

                    <aside>

                        <div className="lg:sticky lg:top-6">

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                {/* Company */}
                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                        <Building2 size={27} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Job Poster / Company
                                        </p>

                                        <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
                                            {companyName}
                                        </h2>
                                    </div>

                                </div>

                                {/* Poster information */}
                                {(job.jobPoster ||
                                    job.companyDescription ||
                                    job.posterDescription) && (
                                        <div className="mt-6 border-t border-slate-100 pt-6">

                                            <h3 className="font-semibold text-slate-900">
                                                About the Job Poster
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {job.companyDescription ||
                                                    job.posterDescription ||
                                                    job.jobPoster?.description ||
                                                    "No additional information available."}
                                            </p>

                                        </div>
                                    )}

                                {/* Dates */}
                                <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">

                                    <SidebarItem
                                        icon={
                                            <CalendarDays size={18} />
                                        }
                                        label="Posted Date"
                                        value={formatDate(
                                            job.createdAt ||
                                            job.postedDate
                                        )}
                                    />

                                    <SidebarItem
                                        icon={
                                            <CalendarDays size={18} />
                                        }
                                        label="Application Deadline"
                                        value={formatDate(
                                            job.deadline ||
                                            job.applicationDeadline
                                        )}
                                    />

                                </div>

                                {/* Action Error */}
                                {actionError && (
                                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                        <div className="flex gap-3">

                                            <AlertCircle
                                                size={19}
                                                className="mt-0.5 shrink-0 text-amber-600"
                                            />

                                            <p className="text-sm leading-6 text-amber-700">
                                                {actionError}
                                            </p>

                                        </div>
                                    </div>
                                )}

                                {/* Application Success */}
                                {applicationSuccess && (
                                    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                                        <div className="flex gap-3">

                                            <CheckCircle2
                                                size={19}
                                                className="mt-0.5 shrink-0 text-green-600"
                                            />

                                            <div>
                                                <p className="font-semibold text-green-800">
                                                    Application Submitted
                                                </p>

                                                <p className="mt-1 text-sm text-green-700">
                                                    Your application has been
                                                    successfully submitted.
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* Non Student Message */}
                                {user && role !== "STUDENT" && (
                                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                        <p className="text-sm leading-6 text-amber-700">
                                            Only students can apply for
                                            part-time jobs. Your current
                                            account does not have student
                                            application access.
                                        </p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="mt-6 space-y-3">

                                    {/* Not Logged In */}
                                    {!user && (
                                        <button
                                            onClick={() =>
                                                navigate("/login")
                                            }
                                            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Apply Now
                                        </button>
                                    )}

                                    {/* Student */}
                                    {user &&
                                        role === "STUDENT" && (
                                            <>
                                                {alreadyApplied ? (
                                                    <div className="space-y-3">
                                                        <button
                                                            disabled
                                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-sm"
                                                        >
                                                            <CheckCircle2
                                                                size={19}
                                                            />
                                                            Application Submitted
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                navigate("/student/dashboard", {
                                                                    state: { activeTab: "jobs" },
                                                                })
                                                            }
                                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 font-semibold text-indigo-700 hover:bg-indigo-100 transition text-sm"
                                                        >
                                                            View Applied Jobs in Dashboard
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={
                                                            handleApply
                                                        }
                                                        disabled={
                                                            isApplying
                                                        }
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        {isApplying ? (
                                                            <>
                                                                <Loader2
                                                                    size={19}
                                                                    className="animate-spin"
                                                                />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            "Apply Now"
                                                        )}
                                                    </button>
                                                )}

                                                <button
                                                    onClick={
                                                        handleSave
                                                    }
                                                    disabled={isSaving}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <Loader2
                                                                size={19}
                                                                className="animate-spin"
                                                            />
                                                            Updating...
                                                        </>
                                                    ) : isSaved ? (
                                                        <>
                                                            <BookmarkCheck
                                                                size={19}
                                                            />
                                                            Saved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bookmark
                                                                size={19}
                                                            />
                                                            Save Job
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}

                                    {/* Job Poster / Client */}
                                    {user &&
                                        role !== "STUDENT" && (
                                            <button
                                                disabled
                                                className="w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3.5 font-semibold text-slate-400"
                                            >
                                                Students Only
                                            </button>
                                        )}

                                </div>

                                {/* Mobile reminder */}
                                <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                                    By applying, you agree to provide
                                    accurate information to the job poster.
                                </p>

                            </div>
                        </div>

                    </aside>

                </div>
            </main>
        </div>
    );
};

/* --------------------------------------------------
   Reusable UI Components
-------------------------------------------------- */

const ContentSection = ({
    title,
    children,
}) => {
    return (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
                {title}
            </h2>

            <div className="mt-5">
                {children}
            </div>
        </section>
    );
};

const InfoCard = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="mt-0.5 text-indigo-600">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
};

const DetailRow = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
            <div className="text-indigo-600">
                {icon}
            </div>

            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
};

const SidebarItem = ({
    icon,
    label,
    value,
}) => {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-slate-400">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
};

const BriefcaseIcon = () => {
    return (
        <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-400"
        >
            <rect
                width="18"
                height="14"
                x="3"
                y="7"
                rx="2"
            />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M3 12h18" />
        </svg>
    );
};

export default PartTimeJobDetails;