"use client";

import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";
import JobFilter from "@/components/jobs/JobFilter";
import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AppliedProfile {
  id: string;
  name: string;
  avatar: string;
}

interface Job {
  id: string;
  title: string;
  details: string;
  company_name: string;
  company_logo: string;
  location: string;
  type: string;
  working_type: string;
  salary: string;
  salary_num: number;
  skill_tags: string[];
  applied_count: number;
  applied_profiles: AppliedProfile[];
  recruiter_id: string;
  recruiter_name: string;
  posted_at: string;
  posted_date: string;
}

type SortOrder = 'newest' | 'oldest' | 'salary-high';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [displayCount, setDisplayCount] = useState(6);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;
        if (data) setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [supabase]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company_name.toLowerCase().includes(query) ||
          job.skill_tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by location
    if (locationQuery) {
      const loc = locationQuery.toLowerCase();
      result = result.filter((job) => job.location.toLowerCase().includes(loc));
    }

    // Filter by working type (Full-time, Part-time, etc)
    if (selectedTypes.length > 0) {
      result = result.filter((job) => selectedTypes.includes(job.working_type));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime();
      } else if (sortOrder === 'salary-high') {
        return b.salary_num - a.salary_num;
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, locationQuery, selectedTypes, sortOrder]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, displayCount);
  }, [filteredJobs, displayCount]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col space-y-4 mb-16">
        <FadeIn direction="up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Find your <span className="text-[#ff4d94]">next role</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg md:text-xl">
            Browse through thousands of job opportunities across different industries and locations.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <JobFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
          </div>
        </aside>

        {/* Job Listings */}
        <div className="lg:col-span-9 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <p className="text-slate-400 font-medium text-lg">
              Showing <span className="text-white font-bold">{filteredJobs.length}</span> results
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-slate-500 text-sm font-medium">Sort by:</span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-slate-300 outline-none focus:ring-2 focus:ring-[#ff4d94]/50 transition-all cursor-pointer hover:border-[#ff4d94]/30"
              >
                <option value="newest" className="bg-slate-900">Newest First</option>
                <option value="oldest" className="bg-slate-900">Oldest First</option>
                <option value="salary-high" className="bg-slate-900">Highest Salary</option>
              </select>
            </div>
          </div>

          <StaggerContainer 
            key={`${searchQuery}-${locationQuery}-${selectedTypes.join(',')}-${sortOrder}`} 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {loading ? (
              // Loading placeholders
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[300px] w-full bg-white/5 animate-pulse rounded-[2rem] border border-white/10" />
              ))
            ) : displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
                <FadeIn key={job.id} direction="up">
                  <JobCard 
                    title={job.title}
                    company={job.company_name}
                    location={job.location}
                    type={job.working_type}
                    salary={job.salary}
                    postedAt={job.posted_at}
                    logoUrl={job.company_logo}
                    tags={job.skill_tags}
                    appliedCount={job.applied_count}
                    avatars={job.applied_profiles?.map((p: AppliedProfile) => p.avatar)}
                    variant="modern" 
                  />
                </FadeIn>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                <p className="text-slate-400 text-xl">No jobs found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedTypes([]);
                  }}
                  className="mt-4 text-[#ff4d94] font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </StaggerContainer>

          {filteredJobs.length > displayCount && (
            <div className="pt-16 flex justify-center">
              <button 
                onClick={() => setDisplayCount(filteredJobs.length)}
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-[#ff4d94] hover:border-[#ff4d94] transition-all hover:shadow-lg hover:shadow-pink-500/20"
              >
                Load More Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
