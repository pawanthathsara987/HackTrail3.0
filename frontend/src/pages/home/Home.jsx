import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Users,
  BookOpen,
  Target,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock3,
  Award,
  Code2,
  Palette,
  Megaphone,
  Database,
  MessageCircle,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location.state]);

  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const getDashboardPath = (role) => {
    if (role === "job_poster") return "/job-poster/dashboard";
    if (role === "client") return "/client/dashboard";
    return "/student/dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Target size={22} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Opportunity
              <span className="text-blue-600">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink to="/" label="Home" />
            <NavLink
              to="/part-time-jobs"
              label="Part-Time Jobs"
            />
            <NavLink
              to="/freelancing"
              label="Freelancing"
            />
            <NavLink
              to="/training"
              label="Training Programs"
            />
            <NavLink
              to="/how-it-works"
              label="How It Works"
            />
            <NavLink to="/about" label="About" />
            <NavLink to="/contact" label="Contact" />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath(user.role)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <User size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                  title="Log Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="rounded-lg p-2 text-slate-700 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden">
            <nav className="flex flex-col gap-1">
              <MobileNavLink
                to="/"
                label="Home"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                to="/part-time-jobs"
                label="Part-Time Jobs"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                to="/freelancing"
                label="Freelancing"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                to="/training"
                label="Training Programs"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                to="/how-it-works"
                label="How It Works"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                to="/about"
                label="About"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <MobileNavLink
                to="/contact"
                label="Contact"
                closeMenu={() => setMobileMenuOpen(false)}
              />

              <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
                {user ? (
                  <Link
                    to={getDashboardPath(user.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white"
                  >
                    My Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-slate-50">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">

            {/* Hero Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                <Sparkles size={16} />
                Your opportunity starts here
              </div>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Learn.
                <span className="text-blue-600"> Earn.</span>
                <br />
                Build Your Future.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
                Find flexible part-time jobs, discover freelance
                opportunities, and build valuable skills through
                practical training programs.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/part-time-jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Find Opportunities
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/training"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  Start Learning
                  <BookOpen size={18} />
                </Link>
              </div>

              {/* Hero Trust Points */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                <TrustPoint text="Flexible opportunities" />
                <TrustPoint text="Practical training" />
                <TrustPoint text="Career focused" />
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/60">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      OpportunityX
                    </p>

                    <h3 className="mt-1 font-bold text-slate-900">
                      Your journey
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <TrendingUp size={20} />
                  </div>
                </div>

                {/* Journey */}
                <div className="space-y-4 py-6">
                  <JourneyCard
                    number="01"
                    icon={BookOpen}
                    title="Learn"
                    description="Develop practical skills"
                    color="blue"
                  />

                  <div className="ml-8 h-5 border-l-2 border-dashed border-slate-200" />

                  <JourneyCard
                    number="02"
                    icon={BriefcaseBusiness}
                    title="Earn"
                    description="Find opportunities that fit"
                    color="indigo"
                  />

                  <div className="ml-8 h-5 border-l-2 border-dashed border-slate-200" />

                  <JourneyCard
                    number="03"
                    icon={TrendingUp}
                    title="Grow"
                    description="Build experience & your career"
                    color="emerald"
                  />
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Keep moving forward
                    </p>

                    <p className="text-xs text-slate-400">
                      One opportunity at a time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            THREE MAIN SERVICES
        ====================================================== */}

        <section className="bg-white px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">

            <SectionHeader
              eyebrow="Three ways forward"
              title="Choose Your Path Forward"
              description="Whether you're looking to earn, work independently, or develop new skills, OpportunityX helps you take the next step."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">

              <OpportunityCard
                icon={BriefcaseBusiness}
                title="Part-Time Jobs"
                description="Find flexible part-time work that fits around your studies and helps you earn while gaining valuable experience."
                button="Find Part-Time Jobs"
                to="/part-time-jobs"
              />

              <OpportunityCard
                icon={Users}
                title="Freelancing"
                description="Use your skills to work on freelance projects, connect with clients, build your portfolio, and earn from your expertise."
                button="Explore Freelancing"
                to="/freelancing"
              />

              <OpportunityCard
                icon={GraduationCap}
                title="Training Programs"
                description="Learn practical and in-demand skills through training programs designed to help you become ready for real opportunities."
                button="Explore Training"
                to="/training"
              />

            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section id="how-it-works" className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">

            <SectionHeader
              eyebrow="Simple process"
              title="How It Works"
              description="Getting started is simple. Create your profile, discover the right path, and take action."
            />

            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StepCard
                number="01"
                icon={Users}
                title="Create Your Profile"
                description="Tell us about yourself, your education, skills, and interests."
              />

              <StepCard
                number="02"
                icon={Target}
                title="Choose Your Path"
                description="Find a part-time job, explore freelance work, or join a training program."
              />

              <StepCard
                number="03"
                icon={BriefcaseBusiness}
                title="Apply or Learn"
                description="Apply for opportunities or develop the skills you need through training."
              />

              <StepCard
                number="04"
                icon={TrendingUp}
                title="Earn & Grow"
                description="Gain experience, earn income, improve your skills, and move toward your career goals."
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            STUDENT FOCUSED
        ====================================================== */}

        <section id="about" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Built for students
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Your Future Starts With One Opportunity
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-500">
                OpportunityX brings earning opportunities, freelance
                work, and practical learning together in one place,
                helping students take meaningful steps toward their
                future.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Benefit text="Earn while studying" />
                <Benefit text="Find flexible part-time work" />
                <Benefit text="Work with clients through freelancing" />
                <Benefit text="Develop practical skills" />
                <Benefit text="Build professional experience" />
                <Benefit text="Improve career opportunities" />
              </div>

              <Link
                to="/register"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Your Profile
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="rounded-3xl bg-slate-900 p-7 shadow-2xl sm:p-9">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Your OpportunityX journey
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-white">
                      Keep growing
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Award size={24} />
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <ProgressItem
                    title="Profile"
                    percentage="100%"
                  />

                  <ProgressItem
                    title="Skills"
                    percentage="75%"
                  />

                  <ProgressItem
                    title="Opportunities"
                    percentage="50%"
                  />

                  <ProgressItem
                    title="Career Growth"
                    percentage="25%"
                  />
                </div>
              </div>

              <div className="absolute -bottom-5 -right-4 rounded-2xl bg-white p-4 shadow-xl sm:-right-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Target size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Focus
                    </p>

                    <p className="font-bold text-slate-900">
                      Learn → Earn → Grow
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            TRAINING PREVIEW
        ====================================================== */}

        <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Learn & grow
                </span>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Build Skills. Unlock Opportunities.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                  Explore practical training programs designed
                  to help you develop useful skills and become
                  ready for real opportunities.
                </p>
              </div>

              <Link
                to="/training"
                className="inline-flex shrink-0 items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                View Training Programs
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <TrainingCategory
                icon={Code2}
                title="Web Development"
              />

              <TrainingCategory
                icon={Palette}
                title="Graphic Design"
              />

              <TrainingCategory
                icon={Megaphone}
                title="Digital Marketing"
              />

              <TrainingCategory
                icon={Database}
                title="Data & AI"
              />

              <TrainingCategory
                icon={MessageCircle}
                title="Communication"
              />

              <TrainingCategory
                icon={BarChart3}
                title="Business Skills"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            IMPACT
        ====================================================== */}

        <section className="px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">

            <SectionHeader
              eyebrow="Platform impact"
              title="Growing Together"
              description="These are placeholder values and should be replaced with real statistics from the backend."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Users}
                value="—"
                label="Students Registered"
              />

              <StatCard
                icon={BriefcaseBusiness}
                value="—"
                label="Part-Time Jobs Posted"
              />

              <StatCard
                icon={Target}
                value="—"
                label="Freelance Projects"
              />

              <StatCard
                icon={GraduationCap}
                value="—"
                label="Training Programs"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center sm:px-12 lg:py-20">
            <div className="mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-blue-300">
                <Sparkles size={16} />
                Your next step starts here
              </span>

              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to Move Forward?
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                Whether you want to earn through part-time work,
                build your career through freelancing, or learn
                a new skill, your next opportunity starts here.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/part-time-jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Find a Part-Time Job
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/freelancing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-500"
                >
                  Explore Freelancing
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/training"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Start Training
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer id="contact" className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div>
              <Link
                to="/"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Target size={21} />
                </div>

                <span className="text-xl font-bold">
                  Opportunity
                  <span className="text-blue-600">X</span>
                </span>
              </Link>

              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
                Helping students learn, earn, build experience,
                and move toward a better future.
              </p>
            </div>

            {/* Platform */}
            <FooterColumn title="Platform">
              <FooterLink to="/" label="Home" />
              <FooterLink
                to="/part-time-jobs"
                label="Part-Time Jobs"
              />
              <FooterLink
                to="/freelancing"
                label="Freelancing"
              />
              <FooterLink
                to="/training"
                label="Training Programs"
              />
              <FooterLink
                to="/how-it-works"
                label="How It Works"
              />
              <FooterLink to="/about" label="About" />
            </FooterColumn>

            {/* Account */}
            <FooterColumn title="Account">
              <FooterLink to="/login" label="Login" />
              <FooterLink to="/register" label="Register" />
            </FooterColumn>

            {/* Support */}
            <FooterColumn title="Support">
              <FooterLink to="/contact" label="Contact" />
              <FooterLink
                to="/privacy-policy"
                label="Privacy Policy"
              />
              <FooterLink
                to="/terms"
                label="Terms & Conditions"
              />
            </FooterColumn>
          </div>

          <div className="mt-12 border-t border-slate-100 pt-7">
            <p className="text-center text-sm text-slate-400">
              © {new Date().getFullYear()} OpportunityX. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ============================================================
   NAVIGATION COMPONENTS
============================================================ */

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
  >
    {label}
  </Link>
);

const MobileNavLink = ({
  to,
  label,
  closeMenu,
}) => (
  <Link
    to={to}
    onClick={closeMenu}
    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
  >
    {label}
  </Link>
);

/* ============================================================
   SECTION HEADER
============================================================ */

const SectionHeader = ({
  eyebrow,
  title,
  description,
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
      {eyebrow}
    </span>

    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
      {title}
    </h2>

    <p className="mt-4 text-lg leading-8 text-slate-500">
      {description}
    </p>
  </div>
);

/* ============================================================
   OPPORTUNITY CARD
============================================================ */

const OpportunityCard = ({
  icon: Icon,
  title,
  description,
  button,
  to,
}) => (
  <Link
    to={to}
    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40"
  >
    <div className="flex items-start justify-between">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={27} />
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">
        <ArrowRight size={17} />
      </div>
    </div>

    <h3 className="mt-7 text-xl font-bold text-slate-900">
      {title}
    </h3>

    <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
      {description}
    </p>

    <div className="mt-7 flex items-center gap-2 text-sm font-bold text-blue-600">
      {button}
      <ArrowRight
        size={16}
        className="transition group-hover:translate-x-1"
      />
    </div>
  </Link>
);

/* ============================================================
   JOURNEY CARD
============================================================ */

const JourneyCard = ({
  number,
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-center gap-4">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
      <Icon size={24} />
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-blue-600">
          {number}
        </span>

        <h4 className="font-bold text-slate-900">
          {title}
        </h4>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  </div>
);

/* ============================================================
   STEP CARD
============================================================ */

const StepCard = ({
  number,
  icon: Icon,
  title,
  description,
}) => (
  <div className="relative">
    <div className="mb-5 flex items-center justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        <Icon size={22} />
      </div>

      <span className="text-4xl font-bold text-slate-100">
        {number}
      </span>
    </div>

    <h3 className="text-lg font-bold text-slate-900">
      {title}
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-500">
      {description}
    </p>
  </div>
);

/* ============================================================
   BENEFIT
============================================================ */

const Benefit = ({ text }) => (
  <div className="flex items-start gap-3">
    <CheckCircle2
      size={19}
      className="mt-0.5 shrink-0 text-blue-600"
    />

    <span className="text-sm font-medium text-slate-700">
      {text}
    </span>
  </div>
);

/* ============================================================
   PROGRESS ITEM
============================================================ */

const ProgressItem = ({ title, percentage }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-slate-300">
        {title}
      </span>

      <span className="text-xs font-bold text-blue-400">
        {percentage}
      </span>
    </div>

    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-blue-500"
        style={{
          width: percentage,
        }}
      />
    </div>
  </div>
);

/* ============================================================
   TRAINING CATEGORY
============================================================ */

const TrainingCategory = ({
  icon: Icon,
  title,
}) => (
  <Link
    to="/training"
    className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
  >
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
      <Icon size={22} />
    </div>

    <p className="mt-4 text-sm font-semibold text-slate-700">
      {title}
    </p>
  </Link>
);

/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({
  icon: Icon,
  value,
  label,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      <Icon size={22} />
    </div>

    <p className="mt-5 text-3xl font-bold text-slate-900">
      {value}
    </p>

    <p className="mt-1 text-sm text-slate-500">
      {label}
    </p>

    <p className="mt-3 text-xs text-slate-400">
      Live data coming soon
    </p>
  </div>
);

/* ============================================================
   TRUST POINT
============================================================ */

const TrustPoint = ({ text }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500">
    <CheckCircle2
      size={16}
      className="text-emerald-500"
    />
    {text}
  </div>
);

/* ============================================================
   FOOTER
============================================================ */

const FooterColumn = ({
  title,
  children,
}) => (
  <div>
    <h3 className="text-sm font-bold text-slate-900">
      {title}
    </h3>

    <div className="mt-4 flex flex-col gap-3">
      {children}
    </div>
  </div>
);

const FooterLink = ({
  to,
  label,
}) => (
  <Link
    to={to}
    className="text-sm text-slate-500 transition hover:text-slate-900"
  >
    {label}
  </Link>
);

export default Home;