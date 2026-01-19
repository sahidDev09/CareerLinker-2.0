"use client";

import { Search, MapPin, Briefcase, DollarSign, Filter, X } from "lucide-react";
import { useState } from "react";

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Freelance"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Director", "VP / C-Suite"];
const salaryRanges = ["Under $50k", "$50k - $100k", "$100k - $150k", "$150k - $200k", "$200k+"];

export default function JobFilter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Job title, keywords, or company"
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="City, state, or remote"
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      <div className="hidden lg:block space-y-8 pt-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Briefcase size={18} className="mr-2 text-indigo-600" />
            Job Type
          </h3>
          <div className="space-y-3">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-3 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Filter size={18} className="mr-2 text-indigo-600" />
            Experience Level
          </h3>
          <div className="space-y-3">
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-3 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <DollarSign size={18} className="mr-2 text-indigo-600" />
            Salary Range
          </h3>
          <div className="space-y-3">
            {salaryRanges.map((range) => (
              <label key={range} className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-3 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">{range}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Toggle */}
      <button 
        className="lg:hidden w-full py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <Filter size={20} className="mr-2" />
        Filters
      </button>
    </div>
  );
}
