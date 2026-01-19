"use client";

import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";
import JobFilter from "@/components/jobs/JobFilter";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const allJobs = [
  {
    title: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$140k - $180k",
    postedAt: "2 days ago",
    tags: ["React", "Next.js", "Tailwind"],
    isFeatured: true,
  },
  {
    title: "Product Designer",
    company: "CreativeFlow",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120k - $160k",
    postedAt: "5 hours ago",
    tags: ["Figma", "UI/UX", "Motion"],
  },
  {
    title: "Backend Developer (Node.js)",
    company: "DataBridge",
    location: "Austin, TX (Hybrid)",
    type: "Contract",
    salary: "$80 - $110 / hr",
    postedAt: "1 day ago",
    tags: ["Node.js", "PostgreSQL", "Redis"],
  },
  {
    title: "Marketing Manager",
    company: "GrowthLab",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$90k - $130k",
    postedAt: "3 days ago",
    tags: ["SEO", "Content", "Ads"],
  },
  {
    title: "Senior DevOps Engineer",
    company: "CloudScale",
    location: "Remote",
    type: "Full-time",
    salary: "$160k - $210k",
    postedAt: "1 week ago",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    isFeatured: true,
  },
  {
    title: "UX Researcher",
    company: "InnoSoft",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$60 - $85 / hr",
    postedAt: "4 days ago",
    tags: ["User Testing", "Figma", "Data"],
  },
];

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col space-y-4 mb-12">
        <FadeIn direction="up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Find your <span className="text-indigo-600">next role</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl text-lg">
            Browse through thousands of job opportunities across different industries and locations.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <JobFilter />
        </aside>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Showing <span className="text-slate-900 dark:text-white font-bold">1-24</span> of 1,245 jobs
            </p>
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 transition-colors">
              <span>Sort by: Newest</span>
              <ChevronDown size={16} />
            </div>
          </div>

          <StaggerContainer className="grid grid-cols-1 gap-6">
            {allJobs.map((job, i) => (
              <FadeIn key={i} direction="up" delay={i * 0.05}>
                <JobCard {...job} />
              </FadeIn>
            ))}
          </StaggerContainer>

          <div className="pt-10 flex justify-center">
            <button className="px-8 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              Load More Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
