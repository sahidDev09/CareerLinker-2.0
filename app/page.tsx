"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Briefcase, Users, Building2, TrendingUp, ArrowRight, Play } from "lucide-react";
import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
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

const stats = [
  { label: "Active Jobs", value: "12,450+", icon: Briefcase },
  { label: "Companies", value: "850+", icon: Building2 },
  { label: "Job Seekers", value: "45,000+", icon: Users },
  { label: "Avg. Hiring Time", value: "14 Days", icon: TrendingUp },
];

export default function Home() {
  return (
    <div className="flex flex-col space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 lg:pt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="up">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold border border-indigo-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span>Over 1,200 new jobs posted today!</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                  Find your <span className="gradient-text">dream job</span> with CareerLinker
                </h1>
                
                <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                  The most advanced job portal for professionals. Discover opportunities from top startups to Fortune 500 companies.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/jobs" 
                    className="flex justify-center items-center px-8 py-4 gradient-bg text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:scale-105 transition-transform"
                  >
                    Browse All Jobs
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                  <button className="flex justify-center items-center px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <Play size={14} className="text-indigo-600 fill-indigo-600" />
                    </div>
                    How It Works
                  </button>
                </div>

                <div className="flex items-center space-x-6 pt-4 grayscale opacity-60">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted By</span>
                  <div className="flex items-center gap-6 font-bold text-xl">
                    <span>Google</span>
                    <span>Meta</span>
                    <span>Amazon</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="relative">
              <div className="relative z-10 w-full aspect-square max-w-[600px] mx-auto">
                <Image 
                  src="/hero-illustration.png" 
                  alt="CareerLinker Hero" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Floating Decorative Elements */}
              <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute bottom-10 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 md:px-6">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScaleIn key={stat.label} delay={i * 0.1}>
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:bg-indigo-50/50 transition-colors group">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            </ScaleIn>
          ))}
        </StaggerContainer>
      </section>

      {/* Featured Jobs Section */}
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="relative p-10 md:p-20 rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 gradient-bg -z-10"></div>
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Briefcase size={300} className="text-white" />
          </div>
          
          <div className="max-w-2xl text-white space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Ready to take the next step in your career?
            </h2>
            <p className="text-xl text-indigo-100 opacity-90 leading-relaxed">
              Create your profile today and start applying to the best companies in the industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/signup" 
                className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-center hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Create Account
              </Link>
              <Link 
                href="/post-job" 
                className="px-10 py-5 bg-indigo-700/50 text-white border border-white/20 rounded-2xl font-bold text-center hover:bg-indigo-700/70 transition-colors"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
