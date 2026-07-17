import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Calendar, Edit2, Trash2, Users, MapPin } from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/my');
      if (res.data.success) {
        // Fetch applicant count for each job
        const jobsWithCount = await Promise.all(
          res.data.data.map(async (job) => {
            try {
              const appRes = await api.get(`/jobs/${job._id}/applicants`);
              return {
                ...job,
                applicantCount: appRes.data.count
              };
            } catch (err) {
              return { ...job, applicantCount: 0 };
            }
          })
        );
        setJobs(jobsWithCount);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this placement drive? All candidate submissions will be lost.')) {
      try {
        const res = await api.delete(`/jobs/${id}`);
        if (res.data.success) {
          alert('Placement drive deleted');
          fetchJobs();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete job drive.');
      }
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">Manage Job Postings</h1>
          <p className="text-slate-500 mt-1">Detailed list of all campus drives listed under your recruiter account.</p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Placement Drive</span>
        </Link>
      </div>

      {/* Table */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-sans">No drives posted</h3>
          <p className="text-slate-500 text-sm">Post a new placement drive to begin recruiting candidates from campus.</p>
          <Link
            to="/recruiter/jobs/new"
            className="inline-block px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            Create Posting
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Job Title</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Package</th>
                  <th className="px-6 py-3.5">Deadline</th>
                  <th className="px-6 py-3.5">Applicants</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Job Title */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 text-sm block">{job.title}</span>
                        <div className="flex items-center text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4 text-slate-500 font-medium">{job.company}</td>

                    {/* Package */}
                    <td className="px-6 py-4 text-slate-700 font-bold">{job.package}</td>

                    {/* Deadline */}
                    <td className="px-6 py-4 text-slate-500">{formatDate(job.deadline)}</td>

                    {/* Applicant count */}
                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold transition-colors text-xs"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount}</span>
                      </Link>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="p-1.5 border border-slate-200 text-slate-500 rounded-lg hover:text-primary-600 hover:bg-slate-50 hover:border-primary-100 transition-colors"
                          title="Edit posting"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-1.5 border border-slate-200 text-slate-500 rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
                          title="Delete posting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
