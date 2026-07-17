import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, MapPin, DollarSign, Calendar, RefreshCw } from 'lucide-react';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Applied Jobs</h1>
        <p className="text-slate-500 mt-1">Keep track of your recruitment status and updates.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No applications yet</h3>
          <p className="text-slate-500 text-sm">You have not applied for any placement drives. Head over to the job board to find matching opportunities!</p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            Find Placement Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Job Details</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.map((app) => {
                  const job = app.jobId;
                  if (!job) {
                    return (
                      <tr key={app._id} className="text-slate-400">
                        <td className="px-6 py-4 font-semibold italic">Deleted Drive</td>
                        <td className="px-6 py-4">N/A</td>
                        <td className="px-6 py-4">{formatDate(app.appliedAt)}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-400">
                            Closed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">-</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 text-sm block">
                            {job.title}
                          </span>
                          <div className="flex items-center space-x-3 text-xs text-slate-400">
                            <span className="flex items-center space-x-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{job.location}</span>
                            </span>
                            <span className="flex items-center space-x-0.5">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>{job.package}</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{job.company}</td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-slate-300" />
                          <span>{formatDate(app.appliedAt)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-primary-600 font-bold hover:text-primary-700 hover:underline"
                        >
                          View Drive
                        </Link>
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

export default AppliedJobs;
