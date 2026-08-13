import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Building2,
  Headphones,
  User,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "Student Support",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMessage("Please fill in all required fields (Name, Email, and Message).");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    // Simulate server response delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        inquiryType: "Student Support",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  const faqs = [
    {
      q: "How do students apply for part-time jobs on OpportunityX?",
      a: "Students can browse part-time listings filtered by category, location, and hours. Simply click on any job card, review the requirements, and click 'Apply Now' using your OpportunityX student profile.",
    },
    {
      q: "How can businesses or clients post freelance projects?",
      a: "Employers and clients can register for an account, choose 'Post Opportunity', and select either a Part-Time Job posting or a Freelance Project. Once submitted, our team reviews and publishes it to our student talent pool.",
    },
    {
      q: "Are training programs certified, and how do I enroll?",
      a: "Yes! All OpportunityX training programs are designed with industry experts and offer digital completion certificates. You can browse courses on the Training page and click 'Enroll' to get started immediately.",
    },
    {
      q: "How does OpportunityX ensure platform safety & payment trust?",
      a: "We verify employer profiles and client accounts before listings go live. Freelance projects utilize secure milestone structures or escrow options to ensure students receive fair pay upon completing project deliverables.",
    },
    {
      q: "What should I do if I need urgent account help or password resets?",
      a: "You can submit a ticket via this Contact page selecting 'Student Support' or 'Technical Support', or send an email directly to support@opportunityx.lk for priority assistance.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <main>
        {/* =========================================
            1. HERO SECTION
        ========================================= */}
        <section className="relative overflow-hidden bg-slate-900 py-20 text-white sm:py-24 lg:py-28">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 shadow-sm backdrop-blur">
                <Headphones size={16} />
                24/7 Dedicated Assistance
              </span>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                We're Here to{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                  Help You Succeed
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl max-w-2xl mx-auto">
                Have questions about job applications, freelance proposals, training courses, or corporate partnerships? Get in touch with our team.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            2. CONTACT INFO CARDS GRID
        ========================================= */}
        <section className="-mt-12 relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Address */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Headquarters</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                No. 124, Innovation Hub, Tech City, Colombo 03, Sri Lanka
              </p>
            </div>

            {/* Email */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Email Support</h3>
              <p className="mt-2 text-sm text-slate-600">
                <a href="mailto:support@opportunityx.lk" className="hover:text-blue-600 font-semibold block transition-colors">
                  support@opportunityx.lk
                </a>
                <a href="mailto:partnerships@opportunityx.lk" className="hover:text-blue-600 font-semibold block mt-1 transition-colors">
                  partnerships@opportunityx.lk
                </a>
              </p>
            </div>

            {/* Phone */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Hotline & WhatsApp</h3>
              <p className="mt-2 text-sm text-slate-600">
                <a href="tel:+94112345678" className="hover:text-blue-600 font-semibold block transition-colors">
                  +94 11 234 5678
                </a>
                <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="hover:text-emerald-600 font-semibold block mt-1 transition-colors">
                  +94 77 123 4567 (WhatsApp)
                </a>
              </p>
            </div>

            {/* Hours */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Operating Hours</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">Mon - Fri:</span> 8:30 AM - 6:00 PM
                <br />
                <span className="font-bold text-slate-800">Saturday:</span> 9:00 AM - 1:00 PM
                <br />
                <span className="font-bold text-slate-800">Sunday:</span> Closed (Online Help Available)
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            3. CONTACT FORM & LOCATION MAP SECTION
        ========================================= */}
        <section className="py-20 bg-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Form Container (7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Send Us a Message
                  </span>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    How Can We Assist You Today?
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Fill out the form below and our response team will get back to you within 24 hours.
                  </p>
                </div>

                {/* Success Banner */}
                {isSubmitted ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center animate-in fade-in duration-300">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white mb-4 shadow-md">
                      <CheckCircle2 size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900">Message Sent Successfully!</h3>
                    <p className="mt-2 text-sm text-emerald-700">
                      Thank you for contacting OpportunityX. A support representative will review your request and reply to your email shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        <AlertCircle size={18} className="shrink-0 text-red-600" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Ruwan Silva"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-11 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            required
                          />
                          <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ruwan@example.com"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-11 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            required
                          />
                          <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+94 77 123 4567"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-11 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                          />
                          <Phone size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>

                      {/* Inquiry Type */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Inquiry Category
                        </label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 bg-white"
                        >
                          <option value="Student Support">Student Support & Job Help</option>
                          <option value="Employer Posting">Employer & Job Poster Inquiry</option>
                          <option value="Freelance Marketplace">Freelance Marketplace Support</option>
                          <option value="Training Program">Training Programs & Courses</option>
                          <option value="Partnership">Corporate Partnership</option>
                          <option value="Technical Issue">Report Technical Issue</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief summary of your inquiry..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Provide details about your question or request..."
                        className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 shadow-md shadow-blue-600/20 active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Side Info & Map Card (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mb-6 shadow-md shadow-blue-600/30">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Visit Our Innovation Hub</h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    We welcome students, university representatives, and corporate partners to visit our main office in Tech City, Colombo.
                  </p>

                  <div className="mt-6 space-y-4 border-t border-slate-800 pt-6 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-blue-400 shrink-0" />
                      <span>Level 4, Innovation Tower, Galle Road, Colombo 03</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>+94 11 234 5678</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>contact@opportunityx.lk</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Map Visual */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-6 relative min-h-[220px] flex flex-col justify-between shadow-sm">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
                  <div className="relative z-10">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
                      Colombo 03 Location Map
                    </span>
                  </div>
                  <div className="relative z-10 mt-12 rounded-2xl bg-white p-4 shadow-md border border-slate-200 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">OpportunityX HQ</h4>
                      <p className="text-[11px] text-slate-500">Tech City, Galle Road, Colombo 03</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;
