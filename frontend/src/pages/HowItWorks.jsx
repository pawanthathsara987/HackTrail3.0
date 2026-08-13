import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  UserCheck,
  Search,
  FileCheck,
  Send,
  DollarSign,
  Award,
  PlusCircle,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  Layers,
  HelpCircle,
} from "lucide-react";

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState("students");
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const studentSteps = [
    {
      step: "01",
      icon: UserCheck,
      color: "bg-blue-500 text-white",
      badge: "Account Setup",
      title: "Create Your Profile",
      description:
        "Sign up in minutes as a student. Highlight your skills, university background, availability hours, and career goals to stand out to top employers.",
      actionText: "Sign Up Now",
      actionLink: "/register",
    },
    {
      step: "02",
      icon: Search,
      color: "bg-indigo-500 text-white",
      badge: "Discovery",
      title: "Explore Opportunities",
      description:
        "Browse verified part-time jobs with student-friendly hours, lucrative freelance projects, or enroll in industry-led training bootcamps to upgrade your skill set.",
      actionText: "Browse Jobs",
      actionLink: "/part-time-jobs",
    },
    {
      step: "03",
      icon: Send,
      color: "bg-purple-500 text-white",
      badge: "Application",
      title: "Apply & Submit Proposals",
      description:
        "Apply to part-time positions with 1-click or send tailored freelance project bids detailing your rate, approach, and past portfolio work.",
      actionText: "Explore Freelance",
      actionLink: "/freelancing",
    },
    {
      step: "04",
      icon: Award,
      color: "bg-emerald-500 text-white",
      badge: "Success",
      title: "Earn, Learn & Build Portfolio",
      description:
        "Complete shifts or freelance deliverables, get paid securely, earn course certifications, and build a strong resume for future career growth.",
      actionText: "View Training",
      actionLink: "/training",
    },
  ];

  const employerSteps = [
    {
      step: "01",
      icon: PlusCircle,
      color: "bg-blue-600 text-white",
      badge: "Posting",
      title: "Post a Part-Time Job",
      description:
        "Define job roles, required skills, hourly/monthly pay rate, and flexible shift schedules tailored to student availability.",
      actionText: "Post a Job",
      actionLink: "/register",
    },
    {
      step: "02",
      icon: FileCheck,
      color: "bg-indigo-600 text-white",
      badge: "Screening",
      title: "Review Applicants",
      description:
        "Access structured student profiles, verified education backgrounds, resume uploads, and cover notes all in one streamlined dashboard.",
      actionText: "Employer Portal",
      actionLink: "/login",
    },
    {
      step: "03",
      icon: Users,
      color: "bg-purple-600 text-white",
      badge: "Selection",
      title: "Interview & Hire",
      description:
        "Connect directly with candidates, schedule quick interviews, and hire enthusiastic student talent eager to contribute to your business.",
      actionText: "Find Talent",
      actionLink: "/register",
    },
    {
      step: "04",
      icon: CheckCircle2,
      color: "bg-emerald-600 text-white",
      badge: "Management",
      title: "Track Shifts & Leave Reviews",
      description:
        "Manage working hours, maintain long-term working relationships, and rate student performance to nurture future leaders.",
      actionText: "Get Started",
      actionLink: "/register",
    },
  ];

  const clientSteps = [
    {
      step: "01",
      icon: Layers,
      color: "bg-amber-500 text-white",
      badge: "Project Scope",
      title: "Post Your Project",
      description:
        "Specify project requirements, budget limits, deadlines, and key deliverables for web development, graphic design, content, or marketing.",
      actionText: "Post Freelance Project",
      actionLink: "/register",
    },
    {
      step: "02",
      icon: Users,
      color: "bg-blue-500 text-white",
      badge: "Proposal Bids",
      title: "Compare Proposals",
      description:
        "Receive custom proposals from talented student freelancers. Review their proposed timeline, cost estimates, and portfolio samples.",
      actionText: "View Freelance Hub",
      actionLink: "/freelancing",
    },
    {
      step: "03",
      icon: Zap,
      color: "bg-purple-500 text-white",
      badge: "Collaboration",
      title: "Collaborate & Track Progress",
      description:
        "Work directly with selected freelancers, provide feedback on milestone drafts, and ensure project specs are met efficiently.",
      actionText: "Explore Projects",
      actionLink: "/freelancing",
    },
    {
      step: "04",
      icon: DollarSign,
      color: "bg-emerald-500 text-white",
      badge: "Completion",
      title: "Approve & Pay Securely",
      description:
        "Review final project deliverables, release secure payments upon satisfaction, and leave ratings to empower student careers.",
      actionText: "Get Started",
      actionLink: "/register",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Student-Centric Schedules",
      description:
        "All jobs and freelance projects feature flexible timing built around university lectures, exams, and student commitments.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Profiles & Employers",
      description:
        "Strict verification processes ensure safe working environments, genuine project listings, and verified student credentials.",
    },
    {
      icon: DollarSign,
      title: "Fair & Transparent Pay",
      description:
        "Clear pay terms for hourly, monthly, or fixed project work with transparent payment tracking and timely disbursements.",
    },
    {
      icon: Layers,
      title: "Unified Growth Hub",
      description:
        "Combine part-time work, real freelance experience, and certified skill bootcamps all within a single unified platform.",
    },
  ];

  const faqs = [
    {
      question: "Is OpportunityX free for students to join and apply?",
      answer:
        "Yes! OpportunityX is 100% free for students. You can create a profile, apply for part-time jobs, bid on freelance projects, and access free training programs without any subscription fees.",
    },
    {
      question: "Can I do part-time jobs while taking training courses?",
      answer:
        "Absoluty. OpportunityX is designed for flexibility. You can balance part-time shifts or freelance tasks alongside self-paced or live training programs without schedule conflicts.",
    },
    {
      question: "How do employers and clients verify student identity?",
      answer:
        "We verify student status during onboarding using official university emails, student IDs, and profile background checks, providing employers with authentic and reliable candidate information.",
    },
    {
      question: "How do payments work for freelance projects and part-time jobs?",
      answer:
        "Part-time job salaries are paid directly according to the employer's agreed schedule (weekly or monthly). Freelance project budgets are locked transparently upon milestone agreement and released upon client approval.",
    },
    {
      question: "How can employers and clients post openings on OpportunityX?",
      answer:
        "Simply register an account as a Job Poster or Client, complete your organization profile, and click 'Post a Job' or 'Post a Project'. Postings go live immediately after a quick automated review.",
    },
  ];

  const currentSteps =
    activeRole === "students"
      ? studentSteps
      : activeRole === "employers"
      ? employerSteps
      : clientSteps;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[250px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md mb-6">
            <Sparkles size={15} className="text-blue-400" />
            <span>Step-by-Step Platform Guide</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
            How <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">OpportunityX</span> Works
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Connecting ambitious students with flexible part-time jobs, freelance projects, and practical training—while providing employers and clients access to verified talent.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-600/40 active:scale-95"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/part-time-jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-7 py-3.5 text-base font-semibold text-slate-200 backdrop-blur transition hover:bg-slate-800 hover:text-white"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Role Tabs Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setActiveRole("students")}
              className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 text-base font-bold transition-all ${
                activeRole === "students"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <GraduationCap size={22} className={activeRole === "students" ? "text-blue-400" : "text-slate-500"} />
              <span>For Students</span>
            </button>

            <button
              onClick={() => setActiveRole("employers")}
              className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 text-base font-bold transition-all ${
                activeRole === "employers"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Briefcase size={22} className={activeRole === "employers" ? "text-indigo-400" : "text-slate-500"} />
              <span>For Employers</span>
            </button>

            <button
              onClick={() => setActiveRole("clients")}
              className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 text-base font-bold transition-all ${
                activeRole === "clients"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers size={22} className={activeRole === "clients" ? "text-purple-400" : "text-slate-500"} />
              <span>For Freelance Clients</span>
            </button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            {activeRole === "students"
              ? "Student Journey"
              : activeRole === "employers"
              ? "Employer Hiring Process"
              : "Client Project Workflow"}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mt-4">
            {activeRole === "students"
              ? "4 Simple Steps to Earn & Grow"
              : activeRole === "employers"
              ? "4 Easy Steps to Hire Student Talent"
              : "4 Steps from Project Post to Completion"}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Our platform simplifies every stage so you can achieve your goals faster with complete peace of mind.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {currentSteps.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-blue-600 transition">
                      {s.step}
                    </span>
                    <div className={`p-3.5 rounded-2xl shadow-md ${s.color}`}>
                      <IconComponent size={24} />
                    </div>
                  </div>

                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-3">
                    {s.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">
                    {s.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {s.description}
                  </p>
                </div>

                <Link
                  to={s.actionLink}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition pt-4 border-t border-slate-100"
                >
                  <span>{s.actionText}</span>
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Features & Pillars */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-400/20">
              Why OpportunityX Works Best
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 text-white">
              Built for Safety, Quality, and Flexibility
            </h2>
            <p className="mt-3 text-slate-400 text-base sm:text-lg">
              We eliminate friction between students and employers with specialized features designed for success.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const IconComp = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider border border-blue-100 mb-3">
            <HelpCircle size={15} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 text-base">
            Find quick answers to common questions about using OpportunityX.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:border-slate-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 hover:text-blue-600 transition gap-4"
              >
                <span className="text-base sm:text-lg">{faq.question}</span>
                <div className="shrink-0 p-1.5 rounded-full bg-slate-100 text-slate-600">
                  {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 sm:p-14 text-white text-center shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-blue-100 text-base sm:text-lg">
              Join thousands of students, employers, and clients leveraging OpportunityX to build better futures together.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-slate-900 shadow-md transition hover:bg-slate-100 hover:shadow-lg active:scale-95"
              >
                Create Account
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
