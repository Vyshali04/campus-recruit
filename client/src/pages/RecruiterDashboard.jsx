import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, FileText, CheckSquare, Trash2, Edit, Users, MapPin, DollarSign, Calendar } from 'lucide-react';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch recruiter's jobs
      const jobsRes = await api.get('/jobs/my');
      if (jobsRes.data.success) {
        const myJobs = jobsRes.data.data;
        setJobs(myJobs);

        // 2. Fetch applicants for each job to get aggregated stats
        let applicantsCount = 0;
        await Promise.all(
          myJobs.map(async (job) => {
            try {
              const appRes = await api.get(`/jobs/${job._id}/applicants`);
              if (appRes.data.success) {
                applicantsCount += appRes.data.count;
              }
            } catch (err) {
              console.error(`Error fetching applicants for job ${job._id}:`, err);
            }
          })
        );

        setStats({
          totalJobs: myJobs.length,
          totalApplicants: applicantsCount
        });
      }
    } catch (error) {
      console.error('Error fetching recruiter dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job drive? This will permanently delete the job and all associated applications.')) {
      try {
        const res = await api.delete(`/jobs/${jobId}`);
        if (res.data.success) {
          alert('Job drive deleted successfully');
          fetchDashboardData();
        }
      } catch (err) {
        console.error('Error deleting job:', err);
        alert(err.response?.data?.message || 'Failed to delete job.');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Recruiter Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage active campus recruitment drives and evaluate candidates.</p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Drive</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {/* Total Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Drives</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.totalJobs}</div>
          </div>
        </div>

        {/* Total Applicants */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applicants</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.totalApplicants}</div>
          </div>
        </div>
      </div>

      {/* Posted Drives Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Placement Drives</h2>
        
        {jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
            <PlusCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No job drives listed</h3>
            <p className="text-slate-500 text-sm">Post your first campus recruitment drive to start receiving applications from students.</p>
            <Link
              to="/recruiter/jobs/new"
              className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Post a Job Drive
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => {
              const isExpired = new Date(job.deadline) < new Date();
              return (
                <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Head */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{job.company}</span>
                      {isExpired ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-700">Closed</span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-green-100 text-green-700">Active</span>
                      )}
                    </div>
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 leading-snug line-clamp-1">{job.title}</h3>
                    
                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">{job.package}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    {/* Applicants link */}
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 font-bold hover:bg-sky-100 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Applicants</span>
                    </Link>

                    {/* Controls */}
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/recruiter/jobs/${job._id}/edit`}
                        className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:text-primary-600 hover:bg-slate-50 transition-colors"
                        title="Edit Drive"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Drive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
