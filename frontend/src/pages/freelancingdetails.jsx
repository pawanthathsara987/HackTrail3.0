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
} from "lucide-react";

const FreelanceProjectDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [showProposal, setShowProposal] = useState(false);
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

        const response = await fetch(`/api/freelance-projects/${id}`);

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load project.");
        }

        const data = await response.json();

        setProject(data.project || data.data || data);

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
      errors.coverLetter = "Cover letter is required.";
    }

    if (!form.proposedPrice) {
      errors.proposedPrice = "Proposed price is required.";
    }

    if (!form.deliveryTime.trim()) {
      errors.deliveryTime = "Delivery time is required.";
    }

    if (!form.relevantSkills.trim()) {
      errors.relevantSkills = "Relevant skills are required.";
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

      const formData = new FormData();

      formData.append("coverLetter", form.coverLetter);
      formData.append("proposedPrice", form.proposedPrice);
      formData.append("deliveryTime", form.deliveryTime);
      formData.append("relevantSkills", form.relevantSkills);

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
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              {alreadySubmitted ? (
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
                      : "Students offer skills & gigs. Clients and employers can apply or hire."}
                  </p>

                  {project.clientId === user?.id && (
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
                <button
                  onClick={handleProposalClick}
                  className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 shadow-md"
                >
                  Hire Student / Submit Proposal
                </button>
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

                {/* Proposed Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Proposed Price *
                  </label>

                  <input
                    type="number"
                    name="proposedPrice"
                    min="0"
                    value={form.proposedPrice}
                    onChange={handleChange}
                    placeholder="Enter your proposed price"
                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 ${
                      formErrors.proposedPrice
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {formErrors.proposedPrice && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.proposedPrice}
                    </p>
                  )}
                </div>

                {/* Delivery */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Estimated Delivery Time *
                  </label>

                  <input
                    type="text"
                    name="deliveryTime"
                    value={form.deliveryTime}
                    onChange={handleChange}
                    placeholder="Example: 7 days"
                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 ${
                      formErrors.deliveryTime
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {formErrors.deliveryTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.deliveryTime}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Relevant Skills *
                  </label>

                  <input
                    type="text"
                    name="relevantSkills"
                    value={form.relevantSkills}
                    onChange={handleChange}
                    placeholder="Example: React, HTML, CSS, JavaScript"
                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500 ${
                      formErrors.relevantSkills
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {formErrors.relevantSkills && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.relevantSkills}
                    </p>
                  )}
                </div>

                {/* Attachment */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Attachment
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-5 text-sm text-gray-500 hover:border-indigo-400 hover:bg-indigo-50">
                    <Upload size={20} />

                    <span>
                      {form.attachment
                        ? form.attachment.name
                        : "Upload a file"}
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
      </main>
    </div>
  );
};

export default FreelanceProjectDetails;