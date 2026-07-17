import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, MapPin, DollarSign, Briefcase, FileText, CheckCircle2, ChevronLeft, AlertTriangle } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Student specific check states
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [profileComplete, setProfileComplete] = useState(true);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Job
      const jobRes = await api.get(`/jobs/${id}`);
      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }

      // 2. If student, fetch applications and profile to check constraints
      if (user && user.role === 'student') {
        // Check if already applied
        const appRes = await api.get('/applications/my');
        if (appRes.data.success) {
          const matchingApp = appRes.data.data.find(app => app.jobId._id === id);
          if (matchingApp) {
            setAlreadyApplied(true);
            setApplicationStatus(matchingApp.status);
          }
        }

        // Check if profile is complete (needs college and resumeLink)
        try {
          const profileRes = await api.get('/profile');
          if (profileRes.data.success) {
            const profile = profileRes.data.data;
            if (!profile.college || !profile.resumeLink) {
              setProfileComplete(false);
            }
          }
        } catch (profileErr) {
          // If profile fetch fails (e.g. not created yet, though auth controller creates one)
          setProfileComplete(false);
        }
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Job details not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!profileComplete) {
      setError('Please complete your student profile (college and resume link) before applying.');
      return;
    }

    setApplyLoading(true);
    setError('');
    try {
      const res = await api.post(`/applications/${id}`);
      if (res.data.success) {
        setApplySuccess(true);
        setAlreadyApplied(true);
        setApplicationStatus('Pending');
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplyLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
          <p className="font-semibold">{error}</p>
        </div>
        <Link to="/jobs" className="inline-flex items-center space-x-1.5 font-bold text-primary-600">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Link>
      </div>
    );
  }

  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Back button */}
      <div>
        <Link to="/jobs" className="inline-flex items-center space-x-1 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold uppercase tracking-wider">
                  {job.company}
                </span>
                {isExpired ? (
                  <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-red-100 text-red-700">Deadline Passed</span>
                ) : (
                  <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-green-100 text-green-700">Open Placement</span>
                )}
              </div>
              
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {job.title}
              </h1>
            </div>

            {/* Core details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location</div>
                  <div className="text-sm font-semibold text-slate-700">{job.location}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Salary Package</div>
                  <div className="text-sm font-semibold text-slate-700">{job.package}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Apply Before</div>
                  <div className="text-sm font-semibold text-slate-700">{formatDate(job.deadline)}</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800">Job Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Application Card</h3>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start space-x-2 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Scenario 1: Not logged in */}
            {!user && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  You must be registered and logged in as a student to apply for this campus recruitment drive.
                </p>
                <Link
                  to="/login"
                  className="w-full block text-center py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
                >
                  Sign In to Apply
                </Link>
                <div className="text-center text-xs text-slate-400">
                  New student? <Link to="/register" className="font-bold text-primary-500 hover:underline">Create account</Link>
                </div>
              </div>
            )}

            {/* Scenario 2: Logged in as Recruiter */}
            {user && user.role === 'recruiter' && (
              <div className="space-y-4 text-center">
                <Briefcase className="w-10 h-10 text-violet-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Recruiter Access Only</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are logged in as a Recruiter. Check your dashboard to view applications or list new drives.
                </p>
                <Link
                  to="/recruiter/dashboard"
                  className="w-full block text-center py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors"
                >
                  Recruiter Dashboard
                </Link>
              </div>
            )}

            {/* Scenario 3: Logged in as Student */}
            {user && user.role === 'student' && (
              <div className="space-y-5">
                {/* 3a. Already Applied */}
                {alreadyApplied ? (
                  <div className="space-y-4">
                    <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-primary-600" />
                      <p className="text-sm font-bold text-primary-800">Application Submitted</p>
                      <p className="text-xs text-slate-500">You submitted your candidacy for this placement drive.</p>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</div>
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold capitalize ${
                        applicationStatus === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                        applicationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {applicationStatus}
                      </span>
                    </div>

                    <Link
                      to="/student/applications"
                      className="w-full block text-center py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 text-sm transition-colors"
                    >
                      Track Applications
                    </Link>
                  </div>
                ) : (
                  // 3b. Not applied yet
                  <div className="space-y-4">
                    {/* Check if profile needs completion */}
                    {!profileComplete && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <span>Profile Incomplete</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Your profile requires a college name and a valid resume link before you can submit applications.
                        </p>
                        <Link
                          to="/student/profile"
                          className="inline-block font-bold text-primary-600 hover:text-primary-700"
                        >
                          Complete Profile &rarr;
                        </Link>
                      </div>
                    )}

                    {isExpired ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm cursor-not-allowed"
                      >
                        Applications Closed
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        disabled={applyLoading || !profileComplete}
                        className="w-full flex justify-center items-center space-x-1.5 py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 text-sm transition-colors"
                      >
                        {applyLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            <span>Apply Now</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
