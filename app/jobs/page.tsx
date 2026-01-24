"use client";

import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";
import JobFilter from "@/components/jobs/JobFilter";
import { useState, useMemo, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Open sidebar by default on desktop
    if (window.innerWidth > 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

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

  useEffect(() => {
    if (isSidebarOpen && sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current.querySelectorAll(".filter-section"),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: "power2.out",
          delay: 0.2 
        }
      );
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const filters = document.querySelectorAll(".filter-section label");
    filters.forEach(filter => {
      filter.addEventListener("mouseenter", () => {
        gsap.to(filter, { x: 5, duration: 0.3, ease: "power2.out" });
      });
      filter.addEventListener("mouseleave", () => {
        gsap.to(filter, { x: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);

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
    <div className="container mx-auto py-12">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Sidebar Filters */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0, width: 0 }}
              animate={{ x: 0, opacity: 1, width: "auto" }}
              exit={{ x: -300, opacity: 0, width: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:w-80 flex-shrink-0"
              ref={sidebarRef}
            >
              <div className="sticky top-24 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8 lg:hidden">
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <JobFilter 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  locationQuery={locationQuery}
                  setLocationQuery={setLocationQuery}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Job Listings */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 font-bold ${
                  isSidebarOpen 
                    ? "bg-[#ff4d94]/10 border-[#ff4d94]/20 text-[#ff4d94]" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:border-[#ff4d94]/50 hover:bg-white/10"
                }`}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="hidden sm:inline">{isSidebarOpen ? "Hide Filters" : "Show Filters"}</span>
              </button>
              
              <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />
              
              <p className="text-slate-400 font-medium text-lg">
                Showing <span className="text-white font-bold">{filteredJobs.length}</span> results
              </p>
            </div>
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
            key={`${searchQuery}-${locationQuery}-${selectedTypes.join(',')}-${sortOrder}-${isSidebarOpen}`} 
            className={`grid gap-8 transition-all duration-500 ${
              isSidebarOpen 
                ? "grid-cols-1 md:grid-cols-2" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
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
