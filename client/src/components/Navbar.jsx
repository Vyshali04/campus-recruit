import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Menu, X, LayoutDashboard, FileText, ListFilter, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200
    ${isActive(path)
      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
  `;

  const mobileNavLinkClass = (path) => `
    block rounded-2xl px-4 py-2.5 text-base font-semibold transition-all duration-200
    ${isActive(path)
      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
  `;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white shadow-lg shadow-sky-500/25">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                RecruitPortal
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-2 md:flex">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/jobs" className={navLinkClass('/jobs')}>
              Browse Jobs
            </Link>

            {user && user.role === 'student' && (
              <>
                <Link to="/student/dashboard" className={navLinkClass('/student/dashboard')}>
                  <span className="flex items-center space-x-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </span>
                </Link>
                <Link to="/student/applications" className={navLinkClass('/student/applications')}>
                  <span className="flex items-center space-x-1.5">
                    <FileText className="h-4 w-4" />
                    <span>Applied Jobs</span>
                  </span>
                </Link>
                <Link to="/student/profile" className={navLinkClass('/student/profile')}>
                  <span className="flex items-center space-x-1.5">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </span>
                </Link>
              </>
            )}

            {user && user.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" className={navLinkClass('/recruiter/dashboard')}>
                  <span className="flex items-center space-x-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </span>
                </Link>
                <Link to="/recruiter/jobs" className={navLinkClass('/recruiter/jobs')}>
                  <span className="flex items-center space-x-1.5">
                    <ListFilter className="h-4 w-4" />
                    <span>My Jobs</span>
                  </span>
                </Link>
                <Link to="/recruiter/jobs/new" className={navLinkClass('/recruiter/jobs/new')}>
                  <span className="flex items-center space-x-1.5">
                    <PlusCircle className="h-4 w-4" />
                    <span>Post Job</span>
                  </span>
                </Link>
              </>
            )}
          </div>

          <div className="hidden items-center space-x-3 md:flex">
            {user ? (
              <div className="flex items-center space-x-4 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs font-medium capitalize text-slate-500">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-sky-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 px-2 py-3 shadow-2xl shadow-slate-900/5 backdrop-blur-xl md:hidden">
          <div className="space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/')}>
              Home
            </Link>
            <Link to="/jobs" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/jobs')}>
              Browse Jobs
            </Link>

            {user && user.role === 'student' && (
              <>
                <Link to="/student/dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/student/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/student/applications" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/student/applications')}>
                  Applied Jobs
                </Link>
                <Link to="/student/profile" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/student/profile')}>
                  My Profile
                </Link>
              </>
            )}

            {user && user.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/recruiter/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/recruiter/jobs" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/recruiter/jobs')}>
                  My Jobs
                </Link>
                <Link to="/recruiter/jobs/new" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/recruiter/jobs/new')}>
                  Post Job
                </Link>
              </>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200/80 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-800">{user.name}</div>
                    <div className="text-sm font-medium capitalize text-slate-500">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-base font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full rounded-2xl border border-slate-200 py-2.5 text-center text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full rounded-2xl bg-slate-900 py-2.5 text-center text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition-colors hover:bg-slate-800">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
