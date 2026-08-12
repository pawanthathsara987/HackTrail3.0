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

    if (user.role !== "Student") {
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
    } else if (Number(form.proposedPrice) <= 0) {
      errors.proposedPrice = "Enter a valid proposed price.";
    }

    if (!form.deliveryTime.trim()) {
      errors.deliveryTime = "Estimated delivery time is required.";
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

    if (user.role !== "Student") {
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

      const response = await fetch(
        `/api/freelance-projects/${id}/proposals`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
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
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString();
  };

  const getClient = () => {
    return (
      project?.client ||
      project?.clientInfo ||
      {
        name: project?.clientName,
        profileImage: project?.clientProfileImage,
        location: project?.clientLocation,
        projects: project?.clientProjects,
        rating: project?.clientRating,
        id: project?.clientId,
      }
    );
  };

  const client = getClient();

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
                    <p className="text-xs text-gray-500">Client</p>
                    <p className="font-medium text-gray-800">
                      {client?.name || "Client"}
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
            {/* Client */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                About the Client
              </h2>

              <div className="mt-5 flex items-center gap-4">
                {client?.profileImage ? (
                  <img
                    src={client.profileImage}
                    alt={client.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <User size={25} />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {client?.name || "Client"}
                  </h3>

                  {client?.location && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      {client.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {client?.projects ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    Projects
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star
                      size={15}
                      className="fill-current text-yellow-500"
                    />
                    <span className="font-bold">
                      {client?.rating ?? "N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Rating
                  </p>
                </div>
              </div>

              {client?.id && (
                <button
                  onClick={() =>
                    navigate(`/clients/${client.id}`)
                  }
                  className="mt-5 w-full rounded-lg border border-indigo-600 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  View Client Profile
                </button>
              )}
            </div>

            {/* Proposal Card */}
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
              ) : user?.role === "Client" ||
                user?.role === "Job Poster" ? (
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="font-semibold text-gray-700">
                    Applying is unavailable
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Clients and job posters cannot submit proposals.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleProposalClick}
                  className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Submit Proposal
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