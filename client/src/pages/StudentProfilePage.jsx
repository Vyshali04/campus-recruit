import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, GraduationCap, Link2, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

const StudentProfilePage = () => {
  const [formData, setFormData] = useState({
    college: '',
    department: '',
    cgpa: '',
    skills: '',
    resumeLink: '',
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.get('/profile');
        if (res.data.success && res.data.data) {
          const profile = res.data.data;
          setFormData({
            college: profile.college || '',
            department: profile.department || '',
            cgpa: profile.cgpa !== null ? profile.cgpa.toString() : '',
            skills: profile.skills ? profile.skills.join(', ') : '',
            resumeLink: profile.resumeLink || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // It's possible profile doesn't exist yet (though created at register, fallback creates it)
        setErrorMsg('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (successMsg) setSuccessMsg('');
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const { college, department, cgpa, skills, resumeLink } = formData;

    // Validate CGPA
    if (cgpa) {
      const cgpaNum = Number(cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        setErrorMsg('CGPA must be a valid number between 0.0 and 10.0');
        setSaveLoading(false);
        return;
      }
    }

    // Validate Resume Link format
    if (resumeLink) {
      try {
        new URL(resumeLink);
      } catch (err) {
        setErrorMsg('Please enter a valid URL for the resume (include http:// or https://)');
        setSaveLoading(false);
        return;
      }
    }

    try {
      const res = await api.put('/profile', {
        college,
        department,
        cgpa: cgpa === '' ? '' : cgpa,
        skills,
        resumeLink
      });

      if (res.data.success) {
        setSuccessMsg('Placement profile updated successfully!');
        const updated = res.data.data;
        setFormData({
          college: updated.college || '',
          department: updated.department || '',
          cgpa: updated.cgpa !== null ? updated.cgpa.toString() : '',
          skills: updated.skills ? updated.skills.join(', ') : '',
          resumeLink: updated.resumeLink || '',
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg(err.response?.data?.message || 'Server error updating profile. Please try again.');
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
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Placement Profile</h1>
        <p className="text-slate-500 mt-1">Configure details that will be shared with recruiters when applying.</p>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* College */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>College Name</span>
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. National Institute of Technology"
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Department / Branch</span>
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* CGPA */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <User className="w-4 h-4 text-slate-400" />
              <span>CGPA (Out of 10.0)</span>
            </label>
            <input
              type="text"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.75"
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Skills */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Skills (Comma separated)</span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Express, JavaScript, Python"
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Resume Link */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Link2 className="w-4 h-4 text-slate-400" />
              <span>Resume Link (Google Drive, Canva, or GitHub URL)</span>
            </label>
            <input
              type="url"
              name="resumeLink"
              value={formData.resumeLink}
              onChange={handleChange}
              placeholder="e.g. https://drive.google.com/..."
              className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
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

export default StudentProfilePage;
