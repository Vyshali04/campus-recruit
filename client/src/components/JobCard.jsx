import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, ArrowRight, Building } from 'lucide-react';

const JobCard = ({ job }) => {
  const { _id, title, company, package: pkg, location, requiredSkills, deadline } = job;

  // Format deadline date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isExpired = new Date(deadline) < new Date();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 hover:shadow-xl hover:shadow-slate-100 hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full group">
      <div>
        {/* Company & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <Building className="w-3.5 h-3.5" />
            <span>{company}</span>
          </span>
          {isExpired ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 tracking-wide">Expired</span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700 tracking-wide">Active</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-4 line-clamp-1">
          {title}
        </h3>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 mb-5">
          <div className="flex items-center space-x-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center space-x-1.5 min-w-0">
            <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{pkg}</span>
          </div>
        </div>

        {/* Skills Required */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {requiredSkills.slice(0, 3).map((skill, index) => (
            <span 
              key={index} 
              className="px-2.5 py-1 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100 rounded-md"
            >
              {skill}
            </span>
          ))}
          {requiredSkills.length > 3 && (
            <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-500 rounded-md">
              +{requiredSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Apply Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Apply by: {formatDate(deadline)}</span>
        </div>
        
        <Link
          to={`/jobs/${_id}`}
          className="flex items-center space-x-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group-hover:translate-x-0.5 duration-200"
        >
          <span>Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
