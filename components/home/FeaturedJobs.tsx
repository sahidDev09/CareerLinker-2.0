"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";

const featuredJobs = [
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
];

export default function FeaturedJobs() {
  return (
    <section className="container mx-auto px-4 md:px-6 bg-slate-50 rounded-[3rem] py-20 border border-slate-200/50">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Featured <span className="text-indigo-600">Opportunities</span>
          </h2>
          <p className="text-slate-500 max-w-md">
            Handpicked jobs that match your skills and experience. Apply today and start your journey.
          </p>
        </div>
        <Link 
          href="/jobs" 
          className="group inline-flex items-center text-indigo-600 font-bold hover:underline"
        >
          View all jobs
          <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredJobs.map((job, i) => (
          <FadeIn key={job.title} direction="up" delay={i * 0.1}>
            <JobCard {...job} />
          </FadeIn>
        ))}
      </StaggerContainer>
    </section>
  );
}
