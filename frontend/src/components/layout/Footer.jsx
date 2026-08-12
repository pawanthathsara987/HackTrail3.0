import React from "react";
import { Link } from "react-router-dom";
import {
  Target,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  const platformLinks = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Part-Time Jobs",
      path: "/part-time-jobs",
    },
    {
      label: "Freelancing",
      path: "/freelancing",
    },
    {
      label: "Training Programs",
      path: "/training",
    },
    {
      label: "How It Works",
      path: "/how-it-works",
    },
    {
      label: "About",
      path: "/about",
    },
  ];

  const accountLinks = [
    {
      label: "Login",
      path: "/login",
    },
    {
      label: "Register",
      path: "/register",
    },
  ];

  const supportLinks = [
    {
      label: "Contact",
      path: "/contact",
    },
    {
      label: "Privacy Policy",
      path: "/privacy-policy",
    },
    {
      label: "Terms & Conditions",
      path: "/terms",
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                <Target size={21} />
              </div>

              <span className="text-xl font-bold tracking-tight">
                Opportunity
                <span className="text-blue-400">X</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Helping students discover opportunities,
              develop practical skills, gain experience,
              and build a better future.
            </p>

            {/* Learn Earn Grow */}
            <div className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">
              <span className="text-blue-400">
                Learn
              </span>

              <span className="mx-2 text-slate-600">
                →
              </span>

              <span className="text-emerald-400">
                Earn
              </span>

              <span className="mx-2 text-slate-600">
                →
              </span>

              <span className="text-purple-400">
                Grow
              </span>
            </div>
          </div>

          {/* Platform */}
          <FooterColumn title="Platform">
            {platformLinks.map((item) => (
              <FooterLink
                key={item.path}
                to={item.path}
                label={item.label}
              />
            ))}
          </FooterColumn>

          {/* Account */}
          <FooterColumn title="Account">
            {accountLinks.map((item) => (
              <FooterLink
                key={item.path}
                to={item.path}
                label={item.label}
              />
            ))}
          </FooterColumn>

          {/* Support */}
          <FooterColumn title="Support">
            {supportLinks.map((item) => (
              <FooterLink
                key={item.path}
                to={item.path}
                label={item.label}
              />
            ))}

            <a
              href="mailto:support@opportunityx.com"
              className="group inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
            >
              support@opportunityx.com

              <ArrowUpRight
                size={14}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </FooterColumn>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} OpportunityX.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/privacy-policy"
              className="text-xs text-slate-500 transition hover:text-slate-300"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-slate-500 transition hover:text-slate-300"
            >
              Terms
            </Link>

            <Link
              to="/contact"
              className="text-xs text-slate-500 transition hover:text-slate-300"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ============================================================
   FOOTER COLUMN
============================================================ */

const FooterColumn = ({
  title,
  children,
}) => {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">
        {title}
      </h3>

      <div className="mt-5 flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};

/* ============================================================
   FOOTER LINK
============================================================ */

const FooterLink = ({
  to,
  label,
}) => {
  return (
    <Link
      to={to}
      className="text-sm text-slate-400 transition hover:translate-x-0.5 hover:text-white"
    >
      {label}
    </Link>
  );
};

export default Footer;