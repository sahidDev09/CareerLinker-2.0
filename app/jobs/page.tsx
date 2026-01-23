"use client";

import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";
import JobFilter from "@/components/jobs/JobFilter";
import { useState, useMemo } from "react";

const allJobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "TechNova",
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $180k",
    salaryNum: 160000,
    postedAt: "2 days ago",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ["React", "Next.js", "Tailwind"],
    isFeatured: true,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    appliedCount: 45,
    avatars: ["https://i.pravatar.cc/100?u=1", "https://i.pravatar.cc/100?u=2", "https://i.pravatar.cc/100?u=3"]
  },
  {
    id: 2,
    title: "Product Designer",
    company: "CreativeFlow",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120k - $160k",
    salaryNum: 140000,
    postedAt: "5 hours ago",
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    tags: ["Figma", "UI/UX", "Motion"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    appliedCount: 128,
    avatars: ["https://i.pravatar.cc/100?u=4", "https://i.pravatar.cc/100?u=5", "https://i.pravatar.cc/100?u=6"]
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "DataBridge",
    location: "Austin, TX",
    type: "Contract",
    salary: "$80 - $110 / hr",
    salaryNum: 95 * 2080, // rough annual estimate for sorting
    postedAt: "1 day ago",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["Node.js", "PostgreSQL", "Redis"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    appliedCount: 89,
    avatars: ["https://i.pravatar.cc/100?u=7", "https://i.pravatar.cc/100?u=8", "https://i.pravatar.cc/100?u=9"]
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "GrowthLab",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$90k - $130k",
    salaryNum: 110000,
    postedAt: "3 days ago",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["SEO", "Content", "Ads"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
    appliedCount: 12,
    avatars: ["https://i.pravatar.cc/100?u=10", "https://i.pravatar.cc/100?u=11", "https://i.pravatar.cc/100?u=12"]
  },
  {
    id: 5,
    title: "Senior DevOps Engineer",
    company: "CloudScale",
    location: "Remote",
    type: "Full-time",
    salary: "$160k - $210k",
    salaryNum: 185000,
    postedAt: "1 week ago",
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ["AWS", "Kubernetes", "CI/CD"],
    isFeatured: true,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    appliedCount: 56,
    avatars: ["https://i.pravatar.cc/100?u=13", "https://i.pravatar.cc/100?u=14", "https://i.pravatar.cc/100?u=15"]
  },
  {
    id: 6,
    title: "UX Researcher",
    company: "InnoSoft",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$60 - $85 / hr",
    salaryNum: 72 * 2080,
    postedAt: "4 days ago",
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tags: ["Testing", "Figma", "Data"],
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    appliedCount: 234,
    avatars: ["https://i.pravatar.cc/100?u=16", "https://i.pravatar.cc/100?u=17", "https://i.pravatar.cc/100?u=18"]
  },
];

type SortOrder = 'newest' | 'oldest' | 'salary-high';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const filteredJobs = useMemo(() => {
    let result = [...allJobs];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by location
    if (locationQuery) {
      const loc = locationQuery.toLowerCase();
      result = result.filter((job) => job.location.toLowerCase().includes(loc));
    }

    // Filter by job type
    if (selectedTypes.length > 0) {
      result = result.filter((job) => selectedTypes.includes(job.type));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.postedDate.getTime() - a.postedDate.getTime();
      } else if (sortOrder === 'oldest') {
        return a.postedDate.getTime() - b.postedDate.getTime();
      } else if (sortOrder === 'salary-high') {
        return b.salaryNum - a.salaryNum;
      }
      return 0;
    });

    return result;
  }, [searchQuery, locationQuery, selectedTypes, sortOrder]);

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
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <FadeIn key={job.id} direction="up">
                  <JobCard {...job} variant="modern" />
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

          {filteredJobs.length > 0 && (
            <div className="pt-16 flex justify-center">
              <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-[#ff4d94] hover:border-[#ff4d94] transition-all hover:shadow-lg hover:shadow-pink-500/20">
                Load More Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
