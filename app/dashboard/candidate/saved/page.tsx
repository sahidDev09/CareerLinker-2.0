"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { Bookmark, Briefcase, MapPin, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

const savedJobs = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140k - $190k",
  },
  {
    id: 2,
    role: "UI/UX Designer",
    company: "CreativeFlow",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $120k",
  }
];

export default function SavedJobsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <FadeIn direction="up">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#FF4D94] font-bold mb-2 text-sm">
            <Link href="/dashboard/candidate" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Saved Jobs</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Saved <span className="gradient-text">Jobs</span></h1>
          <p className="text-slate-400 mt-2">Manage all the opportunities you&apos;ve bookmarked for later.</p>
        </div>
      </FadeIn>

      {savedJobs.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <ScaleIn key={job.id}>
              <div className="p-6 rounded-3xl glass border border-white/10 hover:border-[#FF4D94]/50 transition-all group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#FF4D94]">
                    <Briefcase size={24} />
                  </div>
                  <button className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{job.role}</h3>
                <p className="text-[#FF4D94] font-bold mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark size={14} />
                    {job.type}
                  </div>
                  <div className="font-bold text-white/90">{job.salary}</div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-[#FF4D94] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#FF4D94]/20 transition-all">
                    Apply Now
                  </button>
                  <button className="px-4 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </ScaleIn>
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn direction="up" className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <div className="w-20 h-20 bg-[#FF4D94]/10 text-[#FF4D94] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Bookmark size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">No saved jobs yet</h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Start exploring jobs and bookmark the ones that catch your eye!
          </p>
          <Link 
            href="/jobs" 
            className="px-8 py-3 bg-[#FF4D94] text-white rounded-xl font-bold shadow-lg shadow-[#FF4D94]/20 hover:-translate-y-1 transition-all"
          >
            Browse Jobs
          </Link>
        </FadeIn>
      )}
    </div>
  );
}
