import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building2, Search, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 py-4 sm:space-y-10 lg:space-y-14">
      <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-slate-950 px-6 py-16 text-white shadow-[0_30px_90px_-30px_rgba(15,23,42,0.7)] sm:px-12 sm:py-24 lg:px-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.28),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.04))]" />
        <div className="relative mx-auto max-w-3xl space-y-6 text-center">
          <span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Simplifying Campus Placement
          </span>
          <h1 className="bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-4xl font-extrabold leading-none tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Connecting Top Talent with Great Careers
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-300">
            The ultimate recruitment portal where student career dreams meet recruiter opportunities. Fully centralized, automated, and streamlined.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="flex items-center space-x-2 rounded-full bg-sky-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-sky-400"
            >
              <span>Explore All Jobs</span>
              <Search className="h-5 w-5" />
            </Link>

            {!user && (
              <Link
                to="/register"
                className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/10 px-6 py-3.5 font-bold text-slate-100 transition-all hover:bg-white/20"
              >
                <span>Register as Student / Recruiter</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}

            {user && (
              <Link
                to={user.role === 'student' ? '/student/dashboard' : '/recruiter/dashboard'}
                className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/10 px-6 py-3.5 font-bold text-slate-100 transition-all hover:bg-white/20"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <div className="premium-card flex flex-col justify-between p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">For Students</h2>
            <p className="leading-relaxed text-slate-500">
              Build your placement profile, set your resumes, browse active campus opportunities, filter by location or tech stack, and monitor your shortlist outcomes dynamically.
            </p>
          </div>
          <div className="pt-6">
            <Link to="/jobs" className="inline-flex items-center space-x-1.5 font-bold text-sky-600 hover:text-sky-700">
              <span>Find jobs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="premium-card flex flex-col justify-between p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">For Recruiters</h2>
            <p className="leading-relaxed text-slate-500">
              Post your placement drives, update specifications, review student qualifications, inspect links to canvas resumes, and manage candidates status instantly.
            </p>
          </div>
          <div className="pt-6">
            <Link to={user && user.role === 'recruiter' ? '/recruiter/jobs/new' : '/login'} className="inline-flex items-center space-x-1.5 font-bold text-violet-600 hover:text-violet-700">
              <span>Post placement drive</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/70 p-8 text-center shadow-[0_20px_70px_-24px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-12">
        <div className="mx-auto max-w-xl space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">How It Works</h2>
          <p className="text-slate-500">A three-step placement process built for optimal campus convenience.</p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">1</div>
            <h3 className="font-bold text-slate-800">Register Profile</h3>
            <p className="text-sm leading-relaxed text-slate-500">Select Student or Recruiter role to establish your dedicated portal workspace.</p>
          </div>
          <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">2</div>
            <h3 className="font-bold text-slate-800">Post & Discover</h3>
            <p className="text-sm leading-relaxed text-slate-500">Recruiters list details, and students browse with robust skill-based filter mechanics.</p>
          </div>
          <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">3</div>
            <h3 className="font-bold text-slate-800">Apply & Review</h3>
            <p className="text-sm leading-relaxed text-slate-500">Submit applications and track status updates (Shortlisted or Rejected) in real time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
