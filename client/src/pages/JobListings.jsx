import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { Search, MapPin, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');

  // Values sent to API on submit or trigger
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    location: '',
    skills: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (appliedFilters.search) params.search = appliedFilters.search;
      if (appliedFilters.location) params.location = appliedFilters.location;
      if (appliedFilters.skills) params.skills = appliedFilters.skills;

      const res = await api.get('/jobs', { params });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch job postings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [appliedFilters]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setAppliedFilters({
      search: searchTerm,
      location: locationFilter,
      skills: skillsFilter
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSkillsFilter('');
    setAppliedFilters({
      search: '',
      location: '',
      skills: ''
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Browse Placement Drives</h1>
        <p className="text-slate-500 mt-1.5">Discover and apply to active campus placement job postings.</p>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleApplyFilters} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <SlidersHorizontal className="w-5 h-5 text-primary-500" />
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Search & Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Keywords</label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="Title, company, keywords..."
              />
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="e.g. Bangalore, Remote"
              />
            </div>
          </div>

          {/* Skills Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Required Skills</label>
            <input
              type="text"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="e.g. React, Node, Python (comma separated)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-primary-500/10 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Grid of Results */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-10 h-10 text-primary-500 animate-spin" />
            <span className="text-slate-500 font-semibold mt-4">Searching active listings...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center space-x-3 max-w-xl mx-auto">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No placements found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            We couldn't find any job placement listings matching your search parameters. Try clearing your filters or broadening your terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
