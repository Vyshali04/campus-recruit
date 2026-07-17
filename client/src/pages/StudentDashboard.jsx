import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, CheckCircle, XCircle, Clock, ArrowRight, User } from 'lucide-react';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/applications/my');
        if (res.data.success) {
          const apps = res.data.data;
          setApplications(apps);

          // Calculate statistics
          const calculatedStats = apps.reduce(
            (acc, curr) => {
              acc.total += 1;
              if (curr.status === 'Pending') acc.pending += 1;
              else if (curr.status === 'Shortlisted') acc.shortlisted += 1;
              else if (curr.status === 'Rejected') acc.rejected += 1;
              return acc;
            },
            { total: 0, pending: 0, shortlisted: 0, rejected: 0 }
          );
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Welcome & Subtitle */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Student Dashboard</h1>
        <p className="text-slate-500 mt-1">Monitor placement progress and application updates.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.total}</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.pending}</div>
          </div>
        </div>

        {/* Shortlisted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.shortlisted}</div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</div>
            <div className="text-2xl font-black text-slate-800 mt-0.5">{stats.rejected}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Applications Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Recent Applications</h2>
            <Link to="/student/applications" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-0.5">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            {applications.length === 0 ? (
              <div className="p-8 text-center space-y-4">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-500 text-sm">You haven't submitted any job applications yet.</p>
                <Link to="/jobs" className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-sm transition-colors">
                  Browse Placement Drives
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-3.5">Job Drive</th>
                      <th className="px-6 py-3.5">Company</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{app.jobId ? app.jobId.title : 'Deleted Job'}</td>
                        <td className="px-6 py-4 text-slate-500">{app.jobId ? app.jobId.company : 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {app.jobId && (
                            <Link to={`/jobs/${app.jobId._id}`} className="text-primary-600 font-semibold hover:underline">
                              View Details
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Profile Shortcut */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 font-sans">Quick Setup</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Placement Profile</h3>
                <p className="text-xs text-slate-400">Keep credentials updated</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recruiters judge candidacy based on your college, CGPA, department, skills and resume. Ensure your details are completed.
            </p>
            <Link
              to="/student/profile"
              className="w-full flex items-center justify-center space-x-1 py-2 border border-slate-200 text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-bold rounded-lg text-sm transition-colors"
            >
              <span>Manage Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
