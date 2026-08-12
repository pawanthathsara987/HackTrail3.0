import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Target,
  Sparkles,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  HeartHandshake,
  ArrowRight,
  ChevronRight,
  Star,
} from "lucide-react";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("students");

  const stats = [
    { label: "Active Students & Learners", value: "15,000+", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Part-Time & Shift Jobs Posted", value: "3,800+", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { label: "Freelance Projects Completed", value: "5,200+", icon: Zap, color: "text-amber-600 bg-amber-50" },
    { label: "Training Program Graduates", value: "4,500+", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
  ];

  const pillars = [
    {
      icon: Briefcase,
      title: "Flexible Part-Time Jobs",
      badge: "Earn While Studying",
      description:
        "Flexible work opportunities structured around university class schedules, exam periods, and student lives. Gain financial independence without sacrificing grades.",
      highlights: ["Flexible shift hours", "Verified local employers", "Direct weekly/monthly payouts"],
      link: "/part-time-jobs",
      linkText: "Browse Jobs",
    },
    {
      icon: Zap,
      title: "Freelance Marketplace",
      badge: "Monetize Skills",
      description:
        "A platform where students showcase their talents in Web Development, Graphic Design, Content Writing, and Marketing to earn income from real clients worldwide.",
      highlights: ["Real client projects", "Portfolio building", "Fair project rates & escrow"],
      link: "/freelance",
      linkText: "Explore Projects",
    },
    {
      icon: GraduationCap,
      title: "Practical Training Programs",
      badge: "Skill Acceleration",
      description:
        "Industry-crafted training courses and intensive bootcamps focused on in-demand technical and business skills required by today's leading employers.",
      highlights: ["Mentor-led learning", "Hands-on capstones", "Recognized certificates"],
      link: "/training",
      linkText: "View Programs",
    },
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety First",
      description:
        "Every job posting, freelance contract, and training provider on OpportunityX is vetted to ensure a secure, scam-free environment for students.",
    },
    {
      icon: HeartHandshake,
      title: "Equal Opportunity",
      description:
        "We believe every student, regardless of university ranking or background, deserves direct access to career-building income and training.",
    },
    {
      icon: TrendingUp,
      title: "Practical Over Theoretical",
      description:
        "We prioritize real-world experience, practical skills, and measurable outputs over paper credentials.",
    },
    {
      icon: Globe,
      title: "Community Growth",
      description:
        "Building a collaborative ecosystem where students, mentors, and employers uplift each other to achieve long-term career readiness.",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Kusal Perera",
      role: "Founder & Executive Director",
      bio: "Former University Professor & Tech Entrepreneur passionate about solving student underemployment.",
      skills: ["EdTech Leadership", "Strategic Vision", "Higher Ed Partnerships"],
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Nipuni Fernando",
      role: "Head of Student Success & Programs",
      bio: "10+ years driving career mentorship programs and internship placements across top tech firms.",
      skills: ["Mentorship", "Curriculum Development", "Student Engagement"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sahan Jayawardena",
      role: "Lead Platform Architect",
      bio: "Full-stack technology architect crafting seamless match-making algorithms for student talents.",
      skills: ["Full-Stack Dev", "AI Matching", "Platform Scalability"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rachel Alwis",
      role: "Head of Employer Relations",
      bio: "Connecting companies, startups, and SMBs with energetic student talent and top freelancers.",
      skills: ["Corporate Partnerships", "Talent Acquisition", "Client Success"],
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />

      <main>
        {/* =========================================
            1. HERO SECTION
        ========================================= */}
        <section className="relative overflow-hidden bg-slate-900 py-20 text-white sm:py-28 lg:py-32">
          {/* Decorative Gradients */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                <Sparkles size={16} />
                About OpportunityX
              </span>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Empowering Students to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Learn, Earn & Succeed
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
                OpportunityX is Sri Lanka’s premier student empowerment platform—connecting ambitious learners with flexible part-time work, freelance projects, and practical training programs.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/part-time-jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                >
                  Explore Opportunities
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800 hover:border-slate-600"
                >
                  Get In Touch
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 text-left backdrop-blur transition hover:border-slate-700"
                >
                  <div className={`inline-flex rounded-xl p-3 ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            2. OUR MISSION & VISION
        ========================================= */}
        <section className="py-20 bg-slate-50 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Driven by Purpose
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Our Mission & Strategic Vision
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                We exist to eliminate the barrier between academic studying and career readiness, ensuring no student graduates without work experience or financial dignity.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Mission Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md mb-6">
                  <Target size={26} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  To provide every student and young professional with accessible, flexible opportunities to earn an income, build practical industry skills, and develop real-world work experience alongside their education.
                </p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                    Flexible earnings matched to study schedules
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                    Skill development through certified courses
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                    Direct connection to verified local & global clients
                  </li>
                </ul>
              </div>

              {/* Vision Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md mb-6">
                  <Award size={26} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  To become South Asia’s most trusted ecosystem where learning directly translates into earning, empowering a generation of self-reliant, highly skilled professionals ready for the future of work.
                </p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    Bridging university education with industry needs
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    Zero student debt through early financial independence
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    A thriving network of top student freelancers & employers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            3. THREE CORE PILLARS
        ========================================= */}
        <section className="py-20 bg-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Comprehensive Platform
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                The Three Pillars of OpportunityX
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Everything you need to thrive during university and build a competitive advantage before graduation.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <pillar.icon size={24} />
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-900">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{pillar.description}</p>

                    <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
                      {pillar.highlights.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 size={16} className="text-blue-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <Link
                      to={pillar.link}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
                    >
                      {pillar.linkText}
                      <ChevronRight size={16} className="transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            4. CORE VALUES
        ========================================= */}
        <section className="py-20 bg-slate-900 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                What Guides Us
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our Core Principles & Values
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                These core values govern how we design our features, partner with companies, and support our student community every single day.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                    <val.icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{val.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            5. WHY OPPORTUNITYX (STUDENTS VS EMPLOYERS)
        ========================================= */}
        <section className="py-20 bg-slate-50 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Designed for Everyone
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Why Choose OpportunityX?
              </h2>
            </div>

            {/* Tabs Selector */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("students")}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                    activeTab === "students"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  For Students & Learners
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("employers")}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                    activeTab === "employers"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  For Employers & Clients
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              {activeTab === "students" ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Student Benefits</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>Work on schedules that flex around exams and lectures.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>Earn extra income to cover tuition, books, and living costs.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>Gain verified work experience and portfolio projects before graduation.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Skill Development</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>Access free and affordable practical training courses.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>Earn digital credentials to showcase on your LinkedIn & resume.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>Connect with experienced mentors across tech, business & design.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Employer Advantages</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span>Access thousands of motivated, energetic university students.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span>Hire part-time staff for peak seasonal hours or event coverage.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span>Post jobs and evaluate talent before hiring full-time post-graduates.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Client Benefits</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span>Get affordable quality freelance design, dev, and content work.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span>Work with vetted student freelancers eager to impress and deliver.</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                        <span>Support youth empowerment while completing your business tasks.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            6. LEADERSHIP & TEAM
        ========================================= */}
        <section className="py-20 bg-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Behind the Platform
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Meet Our Leadership Team
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                A dedicated team of educators, technologists, and industry leaders committed to changing student career trajectories.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                    <p className="text-xs font-semibold text-blue-600">{member.role}</p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">{member.bio}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                      {member.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            7. CALL TO ACTION BANNER
        ========================================= */}
        <section className="px-5 py-16 sm:px-6 lg:px-8 bg-slate-50">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center sm:px-12 lg:py-20">
            <div className="mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-300">
                <Sparkles size={16} />
                Join OpportunityX Today
              </span>

              <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Ready to Take Control of Your Future?
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Start searching for flexible part-time jobs, submit freelance proposals, or enroll in practical training programs today.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500 shadow-md"
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
