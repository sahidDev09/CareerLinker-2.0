"use client";

import { Search, MapPin, Briefcase, DollarSign, Filter } from "lucide-react";

interface JobFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Freelance"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Director", "VP / C-Suite"];
const salaryRanges = ["Under $50k", "$50k - $100k", "$100k - $150k", "$150k - $200k", "$200k+"];

export default function JobFilter({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  selectedTypes,
  setSelectedTypes,
}: JobFilterProps) {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="space-y-10">
      {/* Search Input */}
      <div className="space-y-5 filter-section">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Job title, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d94]/50 text-white placeholder:text-slate-500 transition-all"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Location or Remote"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff4d94]/50 text-white placeholder:text-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="hidden lg:block space-y-10 pt-4">
        <div className="filter-section">
          <h3 className="font-bold text-white mb-5 flex items-center text-lg">
            <Briefcase size={18} className="mr-2 text-[#ff4d94]" />
            Job Type
          </h3>
          <div className="space-y-3">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="appearance-none w-5 h-5 rounded-md border border-white/20 bg-white/5 checked:bg-[#ff4d94] checked:border-[#ff4d94] transition-all cursor-pointer" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100 pointer-events-none">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className={`ml-3 transition-colors ${selectedTypes.includes(type) ? 'text-white font-medium' : 'text-slate-400 group-hover:text-white'}`}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="font-bold text-white mb-5 flex items-center text-lg">
            <Filter size={18} className="mr-2 text-[#ff4d94]" />
            Experience Level
          </h3>
          <div className="space-y-3">
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="appearance-none w-5 h-5 rounded-md border border-white/20 bg-white/5 checked:bg-[#ff4d94] checked:border-[#ff4d94] transition-all cursor-pointer" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100 pointer-events-none">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-slate-400 group-hover:text-white transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3 className="font-bold text-white mb-5 flex items-center text-lg">
            <DollarSign size={18} className="mr-2 text-[#ff4d94]" />
            Salary Range
          </h3>
          <div className="space-y-3">
            {salaryRanges.map((range) => (
              <label key={range} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="appearance-none w-5 h-5 rounded-md border border-white/20 bg-white/5 checked:bg-[#ff4d94] checked:border-[#ff4d94] transition-all cursor-pointer" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100 pointer-events-none">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-slate-400 group-hover:text-white transition-colors">{range}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Toggle */}
      <button 
        className="lg:hidden w-full py-4 bg-[#ff4d94]/10 text-[#ff4d94] font-bold rounded-2xl border border-[#ff4d94]/20 flex items-center justify-center"
      >
        <Filter size={20} className="mr-2" />
        Filters
      </button>
    </div>
  );
}
