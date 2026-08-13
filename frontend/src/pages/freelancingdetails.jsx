import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Briefcase,
  User,
  Paperclip,
  Upload,
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import FreelancePaymentModal from "../components/FreelancePaymentModal";

const FreelanceProjectDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [showProposal, setShowProposal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDirectBuyModal, setShowDirectBuyModal] = useState(false);
  const [buyInstructions, setBuyInstructions] = useState("");
  const [priceOption, setPriceOption] = useState("agree"); // "agree" | "custom"
  const [customPrice, setCustomPrice] = useState("");
  const [deliveryTimeOption, setDeliveryTimeOption] = useState("2 Days");
  const [buyAttachment, setBuyAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [form, setForm] = useState({
    coverLetter: "",
    proposedPrice: "",
    deliveryTime: "",
    relevantSkills: "",
    attachment: null,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const token = localStorage.getItem("token");
        const response = await fetch(`/api/freelance-projects/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load project.");
        }

        const data = await response.json();
        const projData = data.project || data.data || data;
        setProject(projData);

        const defaultDeadline = projData.deadline || projData.expectedDeliveryTime || "2 Days";
        setForm((prev) => ({
          ...prev,
          deliveryTime: prev.deliveryTime || defaultDeadline,
        }));
        setDeliveryTimeOption(defaultDeadline);

        if (data.alreadySubmitted) {
          setAlreadySubmitted(true);
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleProposalClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (project && project.clientId === user.id) {
      alert("You cannot submit a proposal for your own project.");
      return;
    }

    const defaultDeadline = project?.deadline || project?.expectedDeliveryTime || "2 Days";

    setForm((prev) => ({
      ...prev,
      deliveryTime: prev.deliveryTime || defaultDeadline,
      proposedPrice:
        prev.proposedPrice ||
        (project?.budget
          ? String(parseInt(project.budget.replace(/[^0-9]/g, ""), 10) || project.budget)
          : ""),
    }));

    setShowProposal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));

    setFormErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.coverLetter.trim()) {
      errors.coverLetter = "Proposal description / Cover letter is required.";
    }

    if (priceOption === "custom" && !form.proposedPrice) {
      errors.proposedPrice = "Proposed price is required.";
    }

    if (!form.deliveryTime.trim()) {
      errors.deliveryTime = "Estimated delivery time is required.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const finalPrice =
        priceOption === "agree"
          ? project?.budget || "Fixed Price Agreed"
          : form.proposedPrice.trim().startsWith("$") || form.proposedPrice.trim().startsWith("Rs")
          ? form.proposedPrice.trim()
          : `$${form.proposedPrice.trim()}`;

      const formData = new FormData();

      formData.append("coverLetter", form.coverLetter);
      formData.append("proposedPrice", finalPrice);
      formData.append("deliveryTime", form.deliveryTime || "Standard Delivery");
      formData.append("relevantSkills", project?.category || "Proposal");

      if (form.attachment) {
        formData.append("attachment", form.attachment);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/freelance-projects/${id}/proposals`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        }
      );

      if (response.status === 409) {
        setAlreadySubmitted(true);
        setShowProposal(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message || "Failed to submit proposal."
        );
      }

      setSuccess(true);
      setShowProposal(false);
      setAlreadySubmitted(true);

      setForm({
        coverLetter: "",
        proposedPrice: "",
        deliveryTime: "",
        relevantSkills: "",
        attachment: null,
      });
    } catch (err) {
      setError(err.message || "Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectBuySubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!buyInstructions.trim()) {
      setError("Please describe what you want the student freelancer to do.");
      return;
    }

    if (priceOption === "custom" && !customPrice.trim()) {
      setError("Please enter your proposed custom price.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const finalPrice =
        priceOption === "agree"
          ? project?.budget || "Fixed Price Agreed"
          : customPrice.trim().startsWith("$") || customPrice.trim().startsWith("Rs")
          ? customPrice.trim()
          : `$${customPrice.trim()}`;

      const formDataObj = new FormData();
      formDataObj.append("coverLetter", buyInstructions.trim());
      formDataObj.append("proposedPrice", finalPrice);
      formDataObj.append("deliveryTime", deliveryTimeOption);
      formDataObj.append("relevantSkills", project?.category || "Gig Order");

      if (buyAttachment) {
        formDataObj.append("attachment", buyAttachment);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`/api/freelance-projects/${id}/proposals`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formDataObj,
      });

      if (response.status === 409) {
        setAlreadySubmitted(true);
        setShowDirectBuyModal(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to place order.");
      }

      setSuccess(true);
      setShowDirectBuyModal(false);
      setAlreadySubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Flexible";
    if (typeof date === "string" && !date.includes("-")) return date;
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCreatorInfo = () => {
    const creatorUser = project?.client;
    const isStudentSeller =
      project?.posterRole === "student" ||
      project?.postType === "gig" ||
      creatorUser?.role === "student";

    return {
      isStudent: isStudentSeller,
      title: isStudentSeller ? "About the Student Freelancer" : "About the Employer / Client",
      name: creatorUser?.fullName || project?.clientName || (isStudentSeller ? "Student Seller" : "Client"),
      profilePhoto: creatorUser?.profilePhoto || project?.clientProfileImage || null,
      location: creatorUser?.location || project?.clientLocation || "Location not set",
      rating: project?.clientRating || 5.0,
    };
  };

  const creator = getCreatorInfo();

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="animate-pulse">
            <div className="mb-8 h-5 w-32 rounded bg-gray-200" />
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="mt-4 h-4 w-1/3 rounded bg-gray-200" />
              <div className="mt-8 h-24 rounded bg-gray-200" />

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-20 rounded bg-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Briefcase
            size={55}
            className="mx-auto mb-4 text-gray-400"
          />

          <h1 className="text-2xl font-bold text-gray-900">
            Project Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            This freelance project may have been removed or does not exist.
          </p>

          <button
            onClick={() => navigate("/freelancing")}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Back to Freelancing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/freelancing")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Freelancing
        </button>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            Your proposal has been submitted successfully.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Project */}
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                    {project.category || "Freelance Project"}
                  </span>

                  <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    {project.title}
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    Posted {formatDate(project.postedDate || project.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 px-5 py-4 text-center">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Budget
                  </p>
                  <p className="mt-1 text-xl font-bold text-green-600">
                    {project.budget || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="mt-8 grid grid-cols-1 gap-4 border-y border-gray-100 py-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-medium text-gray-800">
                      {project.category || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(project.deadline)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Delivery Time
                    </p>
                    <p className="font-medium text-gray-800">
                      {project.expectedDeliveryTime ||
                        project.deliveryTime ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {creator.isStudent ? "Student Seller" : "Client"}
                    </p>
                    <p className="font-medium text-gray-800">
                      {creator.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Project Description
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {project.description || "No description provided."}
                </p>
              </div>

              {/* Skills */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Required Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.requiredSkills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Project Requirements
                </h2>

                <div className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {project.requirements ||
                    "No additional requirements provided."}
                </div>
              </div>

              {/* Attachments */}
              {project.attachments?.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    Attachments
                  </h2>

                  <div className="mt-4 space-y-2">
                    {project.attachments.map((file, index) => (
                      <a
                        key={index}
                        href={file.url || file}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-indigo-600 hover:bg-gray-50"
                      >
                        <Paperclip size={17} />
                        {file.name || `Attachment ${index + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Creator / Seller Info Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-base font-bold text-gray-900">
                  {creator.title}
                </h2>
                {creator.isStudent && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Student Seller
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-4">
                {creator.profilePhoto ? (
                  <img
                    src={creator.profilePhoto}
                    alt={creator.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-emerald-500/20"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
                    {creator.name?.charAt(0) || "S"}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {creator.name}
                  </h3>

                  {creator.location && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={14} className="text-gray-400" />
                      {creator.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3 text-center">
                  <p className="text-sm font-bold text-gray-900">
                    {creator.isStudent ? "Student" : "Client"}
                  </p>
                  <p className="text-[11px] text-gray-500">Role</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="font-bold text-sm">
                      {creator.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">Rating</p>
                </div>
              </div>
            </div>

            {/* Proposal / Action Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
              {project.paymentStatus === "paid" || project.status === "in_progress" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white mb-2">
                    <CheckCircle2 size={22} />
                  </div>
                  <p className="font-bold text-emerald-900 text-sm">
                    Activity Paid & Student Hired
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    This freelancing activity is currently in progress.
                  </p>
                  {project.transactionId && (
                    <p className="mt-2 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100 py-1 px-2 rounded-md">
                      Ref: {project.transactionId}
                    </p>
                  )}
                </div>
              ) : alreadySubmitted ? (
                <div className="rounded-xl bg-green-50 p-4 text-center">
                  <p className="font-semibold text-green-700">
                    Proposal Already Submitted
                  </p>
                  <p className="mt-1 text-sm text-green-600">
                    You have already submitted a proposal for this project.
                  </p>
                </div>
              ) : user?.role === "student" ? (
                <div className="rounded-xl bg-indigo-50/70 p-4 text-center border border-indigo-100">
                  <p className="font-bold text-indigo-900 text-sm">
                    Student View Mode
                  </p>
                  <p className="mt-1 text-xs text-indigo-700">
                    {project.clientId === user?.id
                      ? "You are the owner of this freelance post."
                      : "Students offer skills & gigs. Clients and customers can hire & pay."}
                  </p>

                  {user?.role === "student" && project.clientId === user?.id && (
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this post?")) {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`/api/freelance-projects/${project.id}`, {
                            method: "DELETE",
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                          if (res.ok) navigate("/freelancing");
                        }
                      }}
                      className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
                    >
                      Delete My Post
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">

                  {/* Option 2: Custom Proposal */}
                  <button
                    onClick={handleProposalClick}
                    className="w-full rounded-2xl bg-slate-900 py-3 px-4 text-xs font-bold text-white transition hover:bg-emerald-600 shadow-sm flex items-center justify-center gap-2"
                  >
                    Submit Custom Proposal / Quote
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Proposal Modal */}
        {showProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
              <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Submit Proposal
                  </h2>

                  <p className="text-sm text-gray-500">
                    Send your proposal to the client.
                  </p>
                </div>

                <button
                  onClick={() => setShowProposal(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                {/* Cover Letter */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Cover Letter *
                  </label>

                  <textarea
                    name="coverLetter"
                    value={form.coverLetter}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Explain why you are suitable for this project..."
                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
                      formErrors.coverLetter
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {formErrors.coverLetter && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.coverLetter}
                    </p>
                  )}
                </div>

                {/* Pricing & Budget Agreement */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    Pricing & Budget Agreement *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPriceOption("agree")}
                      className={`rounded-2xl border p-3 text-left transition ${
                        priceOption === "agree"
                          ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">✓ Agree Listed Price</p>
                      <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                        {project?.budget || "Fixed Price"}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriceOption("custom")}
                      className={`rounded-2xl border p-3 text-left transition ${
                        priceOption === "custom"
                          ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">✏️ Set Custom Price</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Propose custom rate</p>
                    </button>
                  </div>

                  {priceOption === "custom" && (
                    <div className="mt-3">
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Enter Your Proposed Custom Price *
                      </label>
                      <input
                        type="text"
                        name="proposedPrice"
                        value={form.proposedPrice}
                        onChange={handleChange}
                        placeholder="e.g. $45 or Rs. 15,000"
                        className="w-full rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-900 outline-none focus:border-indigo-500"
                      />
                      {formErrors.proposedPrice && (
                        <p className="mt-1 text-xs font-semibold text-red-500">
                          {formErrors.proposedPrice}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Estimated Delivery Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    Estimated Completion / Delivery Time *
                  </label>
                  <select
                    name="deliveryTime"
                    value={form.deliveryTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-800 outline-none focus:border-indigo-500 bg-white"
                  >
                    {project?.deadline && (
                      <option value={project.deadline}>
                        {project.deadline}
                      </option>
                    )}
                    <option value="1 Day Express">1 Day Express</option>
                    <option value="2 Days">2 Days</option>
                    <option value="3 Days">3 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="Flexible">Flexible Timeline</option>
                  </select>
                  {formErrors.deliveryTime && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {formErrors.deliveryTime}
                    </p>
                  )}
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    Attachment / Proposal Document (Optional)
                  </label>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-xs font-semibold text-gray-600 hover:border-indigo-400 hover:bg-indigo-50/40 transition">
                    <Upload size={18} className="text-indigo-600" />
                    <span>
                      {form.attachment ? form.attachment.name : "Upload a file (brief, wireframes, CV)"}
                    </span>

                    <input
                      type="file"
                      name="attachment"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowProposal(false)}
                    disabled={submitting}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Proposal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Freelance Payment Modal */}
        <FreelancePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          activityDetails={{
            id: project.id,
            title: project.title,
            amount: project.budgetMin || project.budget,
            freelancerName: creator.name,
            category: project.category,
            type: "gig",
          }}
          onPaymentSuccess={(receipt) => {
            setProject((prev) => ({
              ...prev,
              paymentStatus: "paid",
              status: "in_progress",
              transactionId: receipt.transactionId,
            }));
          }}
        />
        {/* FIVERR DIRECT ORDER / BUY GIG MODAL */}
        {showDirectBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto my-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-2xl bg-amber-400 p-2.5 text-slate-950 font-bold text-lg">
                    ⚡
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Order / Hire Student Freelancer
                    </h2>
                    <p className="text-xs text-gray-500">
                      Confirm details with student seller: <strong className="text-emerald-700">{creator.name}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDirectBuyModal(false)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Form */}
              <form onSubmit={handleDirectBuySubmit} className="mt-5 space-y-5">
                {/* 1. What he wants to do */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    1. What do you want built or done? *
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={buyInstructions}
                    onChange={(e) => setBuyInstructions(e.target.value)}
                    placeholder="Describe your exact project requirements, features needed, or guidelines for the student..."
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-medium"
                  />
                </div>

                {/* 2. Price Agreement vs Custom Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    2. Pricing & Budget Agreement *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPriceOption("agree")}
                      className={`rounded-2xl border p-3 text-left transition ${
                        priceOption === "agree"
                          ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">✓ Agree Listed Price</p>
                      <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
                        {project.budget || "Fixed Price"}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriceOption("custom")}
                      className={`rounded-2xl border p-3 text-left transition ${
                        priceOption === "custom"
                          ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">✏️ Propose Custom Price</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Negotiate custom budget</p>
                    </button>
                  </div>

                  {priceOption === "custom" && (
                    <div className="mt-3">
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Enter Your Custom Proposed Price *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. $45 or Rs. 15,000"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-900 outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Delivery Timeframe */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    3. How soon do you need the project completed? *
                  </label>
                  <select
                    value={deliveryTimeOption}
                    onChange={(e) => setDeliveryTimeOption(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500 bg-white"
                  >
                    {project?.deadline && (
                      <option value={project.deadline}>
                        {project.deadline}
                      </option>
                    )}
                    <option value="1 Day Express">1 Day Express Delivery</option>
                    <option value="2 Days">2 Days Delivery</option>
                    <option value="3 Days">3 Days Delivery</option>
                    <option value="5 Days">5 Days Delivery</option>
                    <option value="1 Week">1 Week Delivery</option>
                    <option value="2 Weeks">2 Weeks Delivery</option>
                    <option value="Flexible">Flexible Timeline</option>
                  </select>
                </div>

                {/* 4. Attachment Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-1.5">
                    4. Attach Reference File / Project Brief (Optional)
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:bg-emerald-50/40 transition">
                    <Upload size={16} className="text-emerald-600" />
                    <span>
                      {buyAttachment ? buyAttachment.name : "Click to upload brief, wireframes, or reference PDF/image"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) => setBuyAttachment(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowDirectBuyModal(false)}
                    disabled={submitting}
                    className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-amber-400 py-3 text-xs font-extrabold text-slate-950 hover:bg-amber-300 shadow-md transition disabled:opacity-60"
                  >
                    {submitting ? "Placing Order..." : "⚡ Confirm & Order Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FreelanceProjectDetails;