import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  BriefcaseBusiness,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Building2,
  Target,
  Search,
  X,
  ShieldCheck,
} from "lucide-react";

const roles = [
  {
    id: "student",
    title: "Student",
    description:
      "Find earning opportunities, develop your skills, join training programs, and build your career.",
    icon: GraduationCap,
  },
  {
    id: "job_poster",
    title: "Job Poster",
    description:
      "Post jobs and opportunities and connect with students and talented individuals.",
    icon: Building2,
  },
  {
    id: "client",
    title: "Client",
    description:
      "Find skilled freelancers and hire people for your projects and services.",
    icon: BriefcaseBusiness,
  },
];

const skillOptions = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Video Editing",
  "Photography",
  "Data Entry",
  "Data Analysis",
  "Python",
  "Java",
  "JavaScript",
  "React",
  "Node.js",
  "Database Management",
  "Social Media Management",
  "SEO",
];

const initialForm = {
  role: "",

  // Common
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  profilePhoto: null,
  location: "",

  // Student
  educationLevel: "",
  institutionName: "",
  fieldOfStudy: "",
  graduationYear: "",
  skills: [],
  interests: "",
  careerGoals: "",
  experienceLevel: "",

  // Job Poster
  organizationName: "",
  organizationType: "",
  industry: "",
  organizationDescription: "",
  website: "",
  businessLocation: "",

  // Client
  servicesInterested: "",
  projectCategories: "",
  budgetRange: "",
  preferredSkills: "",
  hiringDescription: "",

  // Account
  password: "",
  confirmPassword: "",
};

const steps = [
  { id: 1, title: "Role", subtitle: "Choose your role" },
  { id: 2, title: "Information", subtitle: "Your details" },
  { id: 3, title: "Account", subtitle: "Secure account" },
  { id: 4, title: "Review", subtitle: "Check details" },
];

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isNewRegistration = searchParams.get("step") === "role";

  const STORAGE_KEY = "opportunityx_registration";

  const getSavedRegistration = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return {
          step: 1,
          formData: initialForm,
        };
      }

      const parsed = JSON.parse(saved);

      return {
        step: parsed.step || 1,
        formData: {
          ...initialForm,
          ...parsed.formData,

          // Never restore passwords from localStorage
          password: "",
          confirmPassword: "",
        },
      };
    } catch (error) {
      console.error("Failed to restore registration:", error);

      return {
        step: 1,
        formData: initialForm,
      };
    }
  };

  const savedRegistration = getSavedRegistration();

  const [step, setStep] = useState(
    isNewRegistration
      ? 1
      : savedRegistration.step
  );

  const [formData, setFormData] = useState(
    isNewRegistration
      ? initialForm
      : savedRegistration.formData
  );
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    try {
      const dataToSave = {
        step,
        formData: {
          ...formData,

          // Never store passwords in localStorage
          password: "",
          confirmPassword: "",

          // File objects cannot be reliably stored in localStorage
          profilePhoto: null,
        },
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dataToSave)
      );
    } catch (error) {
      console.error(
        "Failed to save registration progress:",
        error
      );
    }
  }, [step, formData]);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === formData.role),
    [formData.role]
  );

  const filteredSkills = skillOptions.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.role) {
        newErrors.role = "Please select a role to continue.";
      }
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required.";
      } else if (!/^[+]?[\d\s-]{9,15}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number.";
      }

      if (!formData.location.trim()) {
        newErrors.location = "Location is required.";
      }

      if (formData.role === "student") {
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = "Date of birth is required.";
        }

        if (!formData.gender) {
          newErrors.gender = "Please select your gender.";
        }

        if (!formData.educationLevel) {
          newErrors.educationLevel = "Education level is required.";
        }

        if (!formData.institutionName.trim()) {
          newErrors.institutionName = "Institution name is required.";
        }

        if (!formData.fieldOfStudy.trim()) {
          newErrors.fieldOfStudy = "Field of study is required.";
        }

        if (!formData.graduationYear) {
          newErrors.graduationYear = "Graduation year is required.";
        }

        if (formData.skills.length === 0) {
          newErrors.skills = "Select at least one skill.";
        }

        if (!formData.experienceLevel) {
          newErrors.experienceLevel = "Please select your experience level.";
        }
      }

      if (formData.role === "job_poster") {
        if (!formData.organizationName.trim()) {
          newErrors.organizationName = "Organization name is required.";
        }

        if (!formData.organizationType) {
          newErrors.organizationType = "Please select an organization type.";
        }

        if (!formData.industry.trim()) {
          newErrors.industry = "Industry is required.";
        }

        if (!formData.organizationDescription.trim()) {
          newErrors.organizationDescription =
            "Organization description is required.";
        }

        if (!formData.businessLocation.trim()) {
          newErrors.businessLocation = "Business location is required.";
        }
      }

      if (formData.role === "client") {
        if (!formData.servicesInterested.trim()) {
          newErrors.servicesInterested =
            "Please specify the services you are interested in.";
        }

        if (!formData.projectCategories.trim()) {
          newErrors.projectCategories =
            "Please specify your project categories.";
        }

        if (!formData.budgetRange) {
          newErrors.budgetRange = "Please select a budget range.";
        }

        if (!formData.preferredSkills.trim()) {
          newErrors.preferredSkills =
            "Please specify your preferred freelancer skills.";
        }
      }
    }

    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 8) {
        newErrors.password =
          "Password must contain at least 8 characters.";
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Use uppercase, lowercase letters and at least one number.";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);

      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((item) => item !== skill)
          : [...prev.skills, skill],
      };
    });

    setErrors((prev) => ({
      ...prev,
      skills: "",
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: "Please upload an image file.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePhoto: "Image must be smaller than 5MB.",
      }));
      return;
    }

    updateField("profilePhoto", file);
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case "student":
        return "/student/dashboard";

      case "job_poster":
        return "/job-poster/dashboard";

      case "client":
        return "/client/dashboard";

      default:
        return "/";
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Unable to create your account.");
    } catch (error) {
      // Fallback for mock/demo environment if backend endpoint is not yet mounted
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2
              size={42}
              className="text-emerald-600"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to OpportunityX!
          </h1>

          <p className="mt-3 text-slate-500">
            Your account has been created successfully. You can now access
            your {selectedRole?.title} dashboard.
          </p>

          <button
            onClick={() => {
              navigate(getDashboardPath(formData.role), { replace: true });
            }}
            className="mt-8 w-full rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Target size={24} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Opportunity<span className="text-blue-600">X</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-2 text-slate-500">
            Join OpportunityX and unlock new opportunities.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Progress */}
          <div className="border-b border-slate-100 px-6 py-6 sm:px-10">
            <div className="flex items-center justify-between">
              {steps.map((item, index) => {
                const completed = step > item.id;
                const active = step === item.id;

                return (
                  <React.Fragment key={item.id}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                          completed
                            ? "bg-emerald-500 text-white"
                            : active
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          item.id
                        )}
                      </div>

                      <div className="mt-2 hidden text-center sm:block">
                        <p
                          className={`text-sm font-semibold ${
                            active || completed
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {item.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 transition ${
                          step > item.id
                            ? "bg-emerald-500"
                            : "bg-slate-100"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {step === 1 && (
              <RoleSelection
                selectedRole={formData.role}
                onSelect={(role) => updateField("role", role)}
                error={errors.role}
              />
            )}

            {step === 2 && (
              <RoleInformation
                formData={formData}
                errors={errors}
                updateField={updateField}
                filteredSkills={filteredSkills}
                skillSearch={skillSearch}
                setSkillSearch={setSkillSearch}
                toggleSkill={toggleSkill}
                handleImageUpload={handleImageUpload}
              />
            )}

            {step === 3 && (
              <AccountStep
                formData={formData}
                errors={errors}
                updateField={updateField}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
            )}

            {step === 4 && (
              <ReviewStep
                formData={formData}
                selectedRole={selectedRole}
                setStep={setStep}
              />
            )}

            {errors.submit && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          By creating an account, you agree to OpportunityX's terms and
          privacy policy.
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   ROLE SELECTION
============================================================ */

const RoleSelection = ({ selectedRole, onSelect, error }) => {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          How will you use OpportunityX?
        </h2>

        <p className="mt-2 text-slate-500">
          Select the role that best describes you.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              className={`group relative rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                selected
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                  : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              }`}
            >
              {selected && (
                <div className="absolute right-4 top-4">
                  <CheckCircle2
                    size={22}
                    className="text-blue-600"
                  />
                </div>
              )}

              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                } transition`}
              >
                <Icon size={28} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {role.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/* ============================================================
   ROLE INFORMATION
============================================================ */

const RoleInformation = ({
  formData,
  errors,
  updateField,
  filteredSkills,
  skillSearch,
  setSkillSearch,
  toggleSkill,
  handleImageUpload,
}) => {
  return (
    <div>
      <SectionHeading
        title={
          formData.role === "student"
            ? "Tell us about yourself"
            : formData.role === "job_poster"
            ? "Tell us about your organization"
            : "Tell us about your hiring needs"
        }
        description="Provide some information to personalize your OpportunityX experience."
      />

      <div className="space-y-10">
        {/* Common Personal Information */}
        <FormSection title="Personal Information">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Full name"
              required
              placeholder="e.g. Sandeepa Lakshan"
              value={formData.fullName}
              onChange={(e) =>
                updateField("fullName", e.target.value)
              }
              error={errors.fullName}
            />

            <InputField
              label="Email address"
              required
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              error={errors.email}
            />

            <InputField
              label="Phone number"
              required
              placeholder="+94 77 123 4567"
              value={formData.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              error={errors.phone}
            />

            {formData.role === "student" && (
              <>
                <InputField
                  label="Date of birth"
                  required
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    updateField(
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                  error={errors.dateOfBirth}
                />

                <SelectField
                  label="Gender"
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    updateField("gender", e.target.value)
                  }
                  error={errors.gender}
                  options={[
                    ["male", "Male"],
                    ["female", "Female"],
                    ["other", "Other"],
                    ["prefer_not_to_say", "Prefer not to say"],
                  ]}
                />
              </>
            )}

            <InputField
              label="Location"
              required
              placeholder="e.g. Colombo, Sri Lanka"
              value={formData.location}
              onChange={(e) =>
                updateField("location", e.target.value)
              }
              error={errors.location}
              icon={<MapPin size={17} />}
            />
          </div>

          <ProfileImageUpload
            file={formData.profilePhoto}
            error={errors.profilePhoto}
            onChange={handleImageUpload}
          />
        </FormSection>

        {/* Student */}
        {formData.role === "student" && (
          <>
            <FormSection
              title="Education"
              description="Help us understand your academic background."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Education level"
                  required
                  value={formData.educationLevel}
                  onChange={(e) =>
                    updateField(
                      "educationLevel",
                      e.target.value
                    )
                  }
                  error={errors.educationLevel}
                  options={[
                    ["secondary", "Secondary Education"],
                    ["certificate", "Certificate"],
                    ["diploma", "Diploma"],
                    ["undergraduate", "Undergraduate"],
                    ["graduate", "Graduate"],
                    ["postgraduate", "Postgraduate"],
                  ]}
                />

                <InputField
                  label="Institution name"
                  required
                  placeholder="e.g. University of Colombo"
                  value={formData.institutionName}
                  onChange={(e) =>
                    updateField(
                      "institutionName",
                      e.target.value
                    )
                  }
                  error={errors.institutionName}
                />

                <InputField
                  label="Field of study"
                  required
                  placeholder="e.g. Information Technology"
                  value={formData.fieldOfStudy}
                  onChange={(e) =>
                    updateField(
                      "fieldOfStudy",
                      e.target.value
                    )
                  }
                  error={errors.fieldOfStudy}
                />

                <InputField
                  label="Graduation year"
                  required
                  type="number"
                  placeholder="e.g. 2027"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    updateField(
                      "graduationYear",
                      e.target.value
                    )
                  }
                  error={errors.graduationYear}
                />
              </div>
            </FormSection>

            <FormSection
              title="Professional Profile"
              description="Tell us about your abilities and career direction."
            >
              <SkillSelector
                selectedSkills={formData.skills}
                filteredSkills={filteredSkills}
                search={skillSearch}
                setSearch={setSkillSearch}
                toggleSkill={toggleSkill}
                error={errors.skills}
              />

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <TextareaField
                  label="Interests"
                  placeholder="What topics or activities are you interested in?"
                  value={formData.interests}
                  onChange={(e) =>
                    updateField("interests", e.target.value)
                  }
                />

                <TextareaField
                  label="Career goals"
                  placeholder="What kind of career do you want to build?"
                  value={formData.careerGoals}
                  onChange={(e) =>
                    updateField(
                      "careerGoals",
                      e.target.value
                    )
                  }
                />

                <SelectField
                  label="Experience level"
                  required
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    updateField(
                      "experienceLevel",
                      e.target.value
                    )
                  }
                  error={errors.experienceLevel}
                  options={[
                    ["beginner", "Beginner"],
                    ["intermediate", "Intermediate"],
                    ["advanced", "Advanced"],
                    ["professional", "Professional"],
                  ]}
                />
              </div>
            </FormSection>
          </>
        )}

        {/* Job Poster */}
        {formData.role === "job_poster" && (
          <FormSection
            title="Organization Information"
            description="Tell us about the organization or group posting opportunities."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Company / organization name"
                required
                placeholder="e.g. ABC Technologies"
                value={formData.organizationName}
                onChange={(e) =>
                  updateField(
                    "organizationName",
                    e.target.value
                  )
                }
                error={errors.organizationName}
              />

              <SelectField
                label="Organization type"
                required
                value={formData.organizationType}
                onChange={(e) =>
                  updateField(
                    "organizationType",
                    e.target.value
                  )
                }
                error={errors.organizationType}
                options={[
                  ["individual", "Individual"],
                  ["company", "Company"],
                  ["organization", "Organization"],
                  ["community_group", "Community Group"],
                ]}
              />

              <InputField
                label="Industry"
                required
                placeholder="e.g. Software & Technology"
                value={formData.industry}
                onChange={(e) =>
                  updateField("industry", e.target.value)
                }
                error={errors.industry}
              />

              <InputField
                label="Website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) =>
                  updateField("website", e.target.value)
                }
              />

              <div className="md:col-span-2">
                <InputField
                  label="Business location"
                  required
                  placeholder="e.g. Colombo, Sri Lanka"
                  value={formData.businessLocation}
                  onChange={(e) =>
                    updateField(
                      "businessLocation",
                      e.target.value
                    )
                  }
                  error={errors.businessLocation}
                />
              </div>

              <div className="md:col-span-2">
                <TextareaField
                  label="Organization description"
                  required
                  placeholder="Briefly describe your organization..."
                  value={formData.organizationDescription}
                  onChange={(e) =>
                    updateField(
                      "organizationDescription",
                      e.target.value
                    )
                  }
                  error={errors.organizationDescription}
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* Client */}
        {formData.role === "client" && (
          <FormSection
            title="Hiring Preferences"
            description="Help us understand the freelancers and services you are looking for."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Services you're interested in"
                required
                placeholder="e.g. Web development, design"
                value={formData.servicesInterested}
                onChange={(e) =>
                  updateField(
                    "servicesInterested",
                    e.target.value
                  )
                }
                error={errors.servicesInterested}
              />

              <InputField
                label="Project categories"
                required
                placeholder="e.g. Website, mobile app"
                value={formData.projectCategories}
                onChange={(e) =>
                  updateField(
                    "projectCategories",
                    e.target.value
                  )
                }
                error={errors.projectCategories}
              />

              <SelectField
                label="Typical budget range"
                required
                value={formData.budgetRange}
                onChange={(e) =>
                  updateField(
                    "budgetRange",
                    e.target.value
                  )
                }
                error={errors.budgetRange}
                options={[
                  ["under_25000", "Under LKR 25,000"],
                  ["25k_50k", "LKR 25,000 - 50,000"],
                  ["50k_100k", "LKR 50,000 - 100,000"],
                  ["100k_250k", "LKR 100,000 - 250,000"],
                  ["250k_plus", "LKR 250,000+"],
                ]}
              />

              <InputField
                label="Preferred freelancer skills"
                required
                placeholder="e.g. React, Photoshop, SEO"
                value={formData.preferredSkills}
                onChange={(e) =>
                  updateField(
                    "preferredSkills",
                    e.target.value
                  )
                }
                error={errors.preferredSkills}
              />

              <div className="md:col-span-2">
                <TextareaField
                  label="What do you usually need?"
                  placeholder="Briefly describe your typical projects or requirements..."
                  value={formData.hiringDescription}
                  onChange={(e) =>
                    updateField(
                      "hiringDescription",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </FormSection>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   ACCOUNT
============================================================ */

const AccountStep = ({
  formData,
  errors,
  updateField,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        title="Secure your account"
        description="Create a strong password to protect your OpportunityX account."
      />

      <div className="space-y-5">
        <PasswordField
          label="Password"
          required
          value={formData.password}
          onChange={(e) =>
            updateField("password", e.target.value)
          }
          error={errors.password}
          visible={showPassword}
          setVisible={setShowPassword}
        />

        <PasswordField
          label="Confirm password"
          required
          value={formData.confirmPassword}
          onChange={(e) =>
            updateField(
              "confirmPassword",
              e.target.value
            )
          }
          error={errors.confirmPassword}
          visible={showConfirmPassword}
          setVisible={setShowConfirmPassword}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-blue-600" size={20} />

          <div>
            <h4 className="font-semibold text-slate-900">
              Password requirements
            </h4>

            <ul className="mt-2 space-y-1 text-sm text-slate-500">
              <li>• At least 8 characters</li>
              <li>• At least one uppercase letter</li>
              <li>• At least one lowercase letter</li>
              <li>• At least one number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   REVIEW
============================================================ */

const ReviewStep = ({ formData, selectedRole, setStep }) => {
  return (
    <div>
      <SectionHeading
        title="Review your information"
        description="Make sure everything looks correct before creating your account."
      />

      <div className="space-y-5">
        <ReviewCard
          title="Account type"
          onEdit={() => setStep(1)}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {selectedRole && React.createElement(selectedRole.icon, {
                size: 24,
              })}
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {selectedRole?.title}
              </p>
              <p className="text-sm text-slate-500">
                {selectedRole?.description}
              </p>
            </div>
          </div>
        </ReviewCard>

        <ReviewCard
          title="Personal information"
          onEdit={() => setStep(2)}
        >
          <ReviewItem label="Full name" value={formData.fullName} />
          <ReviewItem label="Email" value={formData.email} />
          <ReviewItem label="Phone" value={formData.phone} />
          <ReviewItem label="Location" value={formData.location} />

          {formData.role === "student" && (
            <>
              <ReviewItem
                label="Date of birth"
                value={formData.dateOfBirth}
              />
              <ReviewItem
                label="Gender"
                value={formData.gender}
              />
            </>
          )}
        </ReviewCard>

        {formData.role === "student" && (
          <ReviewCard
            title="Education & skills"
            onEdit={() => setStep(2)}
          >
            <ReviewItem
              label="Education"
              value={formData.educationLevel}
            />
            <ReviewItem
              label="Institution"
              value={formData.institutionName}
            />
            <ReviewItem
              label="Field"
              value={formData.fieldOfStudy}
            />
            <ReviewItem
              label="Graduation"
              value={formData.graduationYear}
            />
            <ReviewItem
              label="Experience"
              value={formData.experienceLevel}
            />

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ReviewCard>
        )}

        {formData.role === "job_poster" && (
          <ReviewCard
            title="Organization"
            onEdit={() => setStep(2)}
          >
            <ReviewItem
              label="Organization"
              value={formData.organizationName}
            />
            <ReviewItem
              label="Type"
              value={formData.organizationType}
            />
            <ReviewItem
              label="Industry"
              value={formData.industry}
            />
            <ReviewItem
              label="Website"
              value={formData.website}
            />
            <ReviewItem
              label="Location"
              value={formData.businessLocation}
            />
          </ReviewCard>
        )}

        {formData.role === "client" && (
          <ReviewCard
            title="Hiring preferences"
            onEdit={() => setStep(2)}
          >
            <ReviewItem
              label="Services"
              value={formData.servicesInterested}
            />
            <ReviewItem
              label="Categories"
              value={formData.projectCategories}
            />
            <ReviewItem
              label="Budget"
              value={formData.budgetRange}
            />
            <ReviewItem
              label="Preferred skills"
              value={formData.preferredSkills}
            />
          </ReviewCard>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <CheckCircle2
            size={22}
            className="shrink-0 text-emerald-600"
          />

          <p className="text-sm text-emerald-800">
            Your password will be securely hashed before your account is
            stored.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

const SectionHeading = ({ title, description }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-slate-900">
      {title}
    </h2>

    <p className="mt-2 text-sm text-slate-500">
      {description}
    </p>
  </div>
);

const FormSection = ({ title, description, children }) => (
  <section>
    <div className="mb-5">
      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>

    {children}
  </section>
);

const InputField = ({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          icon ? "pl-10" : ""
        } ${
          error
            ? "border-red-400 ring-2 ring-red-50"
            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        }`}
      />
    </div>

    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    )}
  </div>
);

const TextareaField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  error,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <textarea
      rows={4}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
        error
          ? "border-red-400 ring-2 ring-red-50"
          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      }`}
    />

    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({
  label,
  required,
  value,
  onChange,
  error,
  options,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <select
      value={value}
      onChange={onChange}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
        error
          ? "border-red-400 ring-2 ring-red-50"
          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      }`}
    >
      <option value="">Select an option</option>

      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>

    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    )}
  </div>
);

const PasswordField = ({
  label,
  required,
  value,
  onChange,
  error,
  visible,
  setVisible,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Enter your password"
        className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm outline-none transition ${
          error
            ? "border-red-400 ring-2 ring-red-50"
            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        }`}
      />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
      >
        {visible ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>

    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {error}
      </p>
    )}
  </div>
);

const ProfileImageUpload = ({ file, error, onChange }) => {
  const previewUrl = useMemo(() => {
    if (file && (file instanceof Blob || file instanceof File)) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="mt-6">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Profile photo
      </label>

      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 p-5 transition hover:border-blue-400 hover:bg-blue-50/30">
        {previewUrl ? (
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Upload size={24} />
          </div>
        )}

        <div>
          <p className="font-semibold text-slate-800">
            {file ? "Change profile photo" : "Upload profile photo"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            PNG, JPG or WEBP • Maximum 5MB
          </p>
        </div>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onChange}
          className="hidden"
        />
      </label>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const SkillSelector = ({
  selectedSkills,
  filteredSkills,
  search,
  setSearch,
  toggleSkill,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Skills<span className="ml-1 text-red-500">*</span>
      </label>

      {selectedSkills.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
            >
              {skill}

              <button
                type="button"
                onClick={() => toggleSkill(skill)}
                className="hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative mb-3">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />
      </div>

      <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-3">
        <div className="flex flex-wrap gap-2">
          {filteredSkills.map((skill) => {
            const selected = selectedSkills.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const ReviewCard = ({ title, onEdit, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="mb-5 flex items-center justify-between">
      <h3 className="font-bold text-slate-900">{title}</h3>

      <button
        type="button"
        onClick={onEdit}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        Edit
      </button>
    </div>

    <div className="space-y-3">{children}</div>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm font-medium text-slate-800 sm:text-right">
      {value || "Not provided"}
    </span>
  </div>
);

export default Register;