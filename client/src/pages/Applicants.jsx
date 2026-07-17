import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Users, FileText, ChevronLeft, AlertCircle, ExternalLink, Check, X, RefreshCw } from 'lucide-react';

const Applicants = () => {
  const { id } = useParams(); // Job ID
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdateLoadingId, setStatusUpdateLoadingId] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Job Info
      const jobRes = await api.get(`/jobs/${id}`);
      if (jobRes.data.success) {
        setJob(jobRes.data.data);
      }

      // 2. Fetch Applicants
      const appRes = await api.get(`/jobs/${id}/applicants`);
      if (appRes.data.success) {
        setApplicants(appRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch applicants. Make sure you are authorized.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdateLoadingId(appId);
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        // Update local status state immediately
        setApplicants(prevApps =>
          prevApps.map(app =>
            app._id === appId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (err) {
      console.error('Error changing status:', err);
      alert(err.response?.data?.message || 'Failed to update candidate status.');
    } finally {
      setStatusUpdateLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
          <p className="font-semibold">{error}</p>
        </div>
        <Link to="/recruiter/dashboard" className="inline-flex items-center space-x-1.5 font-bold text-primary-600">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Back link */}
      <div>
        <Link to="/recruiter/dashboard" className="inline-flex items-center space-x-1 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{job ? job.company : ''}</span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{job ? job.title : 'Placement Drive'}</h1>
          <p className="text-sm text-slate-500 mt-1">Review candidates submissions and shortlist profiles.</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          <Users className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">{applicants.length} Applicants</span>
        </div>
      </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-sans">No applications yet</h3>
          <p className="text-slate-500 text-sm">Students haven't applied for this drive yet. Once they apply, their profile card will show up here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4">Academics</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4">Resume</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Set Status Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applicants.map((app) => {
                  const s = app.student;
                  const isAppLoading = statusUpdateLoadingId === app._id;
                  
                  return (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-800">{s.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{s.email}</div>
                        </div>
                      </td>

                      {/* College & CGPA */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-600 font-medium">{s.college || 'N/A'}</div>
                          <div className="text-xs text-slate-400">
                            {s.department ? `${s.department} | ` : ''}
                            <span className="font-bold text-slate-700">CGPA: {s.cgpa !== null ? s.cgpa : 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {s.skills.length > 0 ? (
                            s.skills.map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200/50 text-slate-600 text-xs font-medium rounded">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-xs">No skills listed</span>
                          )}
                        </div>
                      </td>

                      {/* Resume Link */}
                      <td className="px-6 py-4">
                        {s.resumeLink ? (
                          <a
                            href={s.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-colors font-bold text-xs"
                          >
                            <span>Resume</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic text-xs">N/A</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Status Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {isAppLoading ? (
                            <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                                disabled={app.status === 'Shortlisted'}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  app.status === 'Shortlisted'
                                    ? 'bg-green-500 border-green-500 text-white cursor-default'
                                    : 'border-slate-200 text-slate-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50'
                                }`}
                                title="Shortlist Candidate"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleStatusChange(app._id, 'Rejected')}
                                disabled={app.status === 'Rejected'}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  app.status === 'Rejected'
                                    ? 'bg-red-500 border-red-500 text-white cursor-default'
                                    : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                                }`}
                                title="Reject Candidate"
                              >
                                <X className="w-4 h-4" />
                              </button>

                              {app.status !== 'Pending' && (
                                <button
                                  onClick={() => handleStatusChange(app._id, 'Pending')}
                                  className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors"
                                  title="Reset to Pending"
                                >
                                  Reset
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
