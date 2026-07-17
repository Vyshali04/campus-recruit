import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, Building, MapPin, DollarSign, Calendar, Tag, AlertCircle, ChevronLeft } from 'lucide-react';

const AddJob = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    package: '',
    location: '',
    requiredSkills: '',
    deadline: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Validate deadline is not in the past
    if (new Date(deadline) < new Date().setHours(0, 0, 0, 0)) {
      setError('Application deadline cannot be set in the past');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/jobs', {
        title,
        company,
        description,
        package: pkg,
        location,
        requiredSkills,
        deadline
      });

      if (res.data.success) {
        alert('Campus recruitment drive posted successfully!');
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error creating job drive. Please check details.');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">Post Job Drive</h1>
        <p className="text-slate-500 mt-1">Specify recruitment parameters to list on the campus board.</p>
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
              placeholder="e.g. Software Engineer Intern"
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
              placeholder="e.g. Google India"
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
              placeholder="e.g. Bangalore, Karnataka"
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span>Salary Package (LPA)</span>
            </label>
            <input
              type="text"
              name="package"
              value={formData.package}
              onChange={handleChange}
              placeholder="e.g. 12 LPA"
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
              placeholder="e.g. React, Node.js, SQL, JavaScript"
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
              placeholder="Detail job requirements, eligibility, tech stack requirements, and roles/responsibilities..."
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
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm text-sm transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Publish Drive</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
