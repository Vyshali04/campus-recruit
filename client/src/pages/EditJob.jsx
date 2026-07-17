import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building, MapPin, DollarSign, Calendar, Tag, AlertCircle, ChevronLeft } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    package: '',
    location: '',
    requiredSkills: '',
    deadline: ''
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          const job = res.data.data;
          
          // Verify ownership
          if (job.recruiterId !== user?.id) {
            alert('Not authorized to edit this job posting');
            navigate('/recruiter/dashboard');
            return;
          }

          // Format deadline to yyyy-MM-dd for HTML date input
          const formattedDate = job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '';

          setFormData({
            title: job.title || '',
            company: job.company || '',
            description: job.description || '',
            package: job.package || '',
            location: job.location || '',
            requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
            deadline: formattedDate
          });
        }
      } catch (err) {
        console.error('Error fetching job for editing:', err);
        setError('Failed to fetch job posting details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, company, description, package: pkg, location, requiredSkills, deadline } = formData;

    // Validate fields
    if (!title || !company || !description || !pkg || !location || !requiredSkills || !deadline) {
      setError('Please fill in all fields');
      return;
    }

    setSaveLoading(true);
    setError('');

    try {
      const res = await api.put(`/jobs/${id}`, {
        title,
        company,
        description,
        package: pkg,
        location,
        requiredSkills,
        deadline
      });

      if (res.data.success) {
        alert('Job drive updated successfully!');
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error updating job drive. Please try again.');
    } finally {
      setSaveLoading(false);
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
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Back button */}
      <div>
        <Link to="/recruiter/dashboard" className="inline-flex items-center space-x-1 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">Edit Placement Drive</h1>
        <p className="text-slate-500 mt-1">Modify details for this campus job posting.</p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Job Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Recruiting Company</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Job Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span>Salary Package</span>
            </label>
            <input
              type="text"
              name="package"
              value={formData.package}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Required Skills */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Tag className="w-4 h-4 text-slate-400" />
              <span>Required Skills (Comma separated)</span>
            </label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Application Deadline</span>
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-sans"
              required
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Link
            to="/recruiter/dashboard"
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveLoading}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm text-sm transition-colors"
          >
            {saveLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
