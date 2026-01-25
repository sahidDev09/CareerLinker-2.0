"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { 
  Users, 
  Plus, 
  Search, 
  Briefcase, 
  Calendar, 
  Eye, 
  MessageSquare,
  TrendingUp,
  ExternalLink,
  LayoutGrid,
  List,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

const stats = [
  { label: "Active Jobs", value: 8, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "New Applicants", value: 124, icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { label: "Interviews", value: 12, icon: Calendar, color: "text-[#FF4D94]", bg: "bg-[#FF4D94]/10" },
  { label: "Total Views", value: "4.2k", icon: Eye, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const applicants = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    appliedDate: "Today",
    status: "Reviewing",
    experience: "8 yrs",
    email: "alex@example.com",
    avatar: null
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Designer",
    appliedDate: "Yesterday",
    status: "Shortlisted",
    experience: "5 yrs",
    email: "sarah@example.com",
    avatar: null
  },
  {
    id: 3,
    name: "David Miller",
    role: "Backend Developer",
    appliedDate: "Jan 15, 2026",
    status: "Interviewing",
    experience: "4 yrs",
    email: "david@example.com",
    avatar: null
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "UX Researcher",
    appliedDate: "Jan 14, 2026",
    status: "Reviewing",
    experience: "3 yrs",
    email: "emma@example.com",
    avatar: null
  },
  {
    id: 5,
    name: "James Taylor",
    role: "Product Manager",
    appliedDate: "Jan 12, 2026",
    status: "Hired",
    experience: "10 yrs",
    email: "james@example.com",
    avatar: null
  },
];

const STAGES = ["Reviewing", "Shortlisted", "Interviewing", "Hired"];

export default function EmployerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [view, setView] = useState<"list" | "board">("list");

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role as string;
      if (role !== "recruiter") {
        router.push("/dashboard/candidate" + (window.location.search || ""));
      }
    }
  }, [isLoaded, user, router]);

  const groupedApplicants = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = applicants.filter(app => app.status === stage);
      return acc;
    }, {} as Record<string, typeof applicants>);
  }, []);

  if (!isLoaded || (user && user.publicMetadata?.role !== "recruiter")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff4d94] animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 text-white">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#ff4d94]/5 to-transparent pointer-events-none -z-10" />
      
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Employer <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400">Welcome back! Manage your job postings and applicants here.</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/post-job" 
              className="px-6 py-3 bg-[#FF4D94] text-white rounded-xl font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Post a New Job
            </Link>
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <ScaleIn key={stat.label}>
            <div className="p-6 rounded-2xl glass shadow-sm group hover:border-[#FF4D94]/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                {stat.label === "New Applicants" && (
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={12} />
                    +12%
                  </div>
                )}
              </div>
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-400 mt-1">{stat.label}</div>
            </div>
          </ScaleIn>
        ))}
      </StaggerContainer>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold">Applicants Pipeline</h2>
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
              <button 
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-[#FF4D94] text-white" : "text-slate-400 hover:text-white"}`}
                title="List View"
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setView("board")}
                className={`p-1.5 rounded-lg transition-all ${view === "board" ? "bg-[#FF4D94] text-white" : "text-slate-400 hover:text-white"}`}
                title="Board View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/employer/applicants" className="text-sm font-bold gradient-text hover:underline">View All</Link>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D94] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-[#FF4D94]/50 outline-none w-64 transition-all"
              />
            </div>
          </div>
        </div>

        {view === "list" ? (
          <FadeIn>
            <div className="glass rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {applicants.map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-[#FF4D94]/10 flex items-center justify-center text-[#FF4D94] font-bold uppercase">
                              {app.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-[#FF4D94] transition-colors">{app.name}</div>
                              <div className="text-xs text-slate-400">{app.experience} experience</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm text-slate-300 font-medium">
                          {app.role}
                        </td>
                        <td className="px-6 py-6 font-medium">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "Shortlisted" ? "bg-emerald-400/10 text-emerald-400" :
                            app.status === "Interviewing" ? "bg-purple-400/10 text-purple-400" :
                            app.status === "Hired" ? "bg-[#FF4D94]/10 text-[#FF4D94]" :
                            "bg-blue-400/10 text-blue-400"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-2 text-slate-400 hover:text-[#FF4D94] hover:bg-[#FF4D94]/10 rounded-lg transition-colors">
                              <MessageSquare size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                              <ExternalLink size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
              {STAGES.map((stage) => (
                <div key={stage} className="flex flex-col gap-4 min-w-[300px]">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        stage === "Shortlisted" ? "bg-emerald-400" :
                        stage === "Interviewing" ? "bg-purple-400" :
                        stage === "Hired" ? "bg-[#FF4D94]" :
                        "bg-blue-400"
                      }`} />
                      <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">{stage}</h3>
                      <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500">
                        {groupedApplicants[stage]?.length || 0}
                      </span>
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 min-h-[200px]">
                    {groupedApplicants[stage]?.length > 0 ? (
                      groupedApplicants[stage].map((app) => (
                        <div key={app.id} className="glass p-4 rounded-2xl hover:border-[#FF4D94]/30 transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-[#FF4D94]">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF4D94] font-bold text-xs">
                              {app.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm truncate group-hover:text-[#FF4D94] transition-colors">{app.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{app.role}</p>
                            </div>
                            <button className="text-slate-600 hover:text-white transition-colors">
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {app.appliedDate}
                            </div>
                            <div className="flex items-center gap-1 text-[#FF4D94] opacity-0 group-hover:opacity-100 transition-opacity">
                              Details <ChevronRight size={10} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center">
                        <p className="text-xs text-slate-600 font-medium italic">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>

      {/* Quick Stats Summary / Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 pt-12 border-t border-white/5">
        <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl glass shadow-xl relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={150} />
              </div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#FF4D94]" />
                Hiring Funnel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[
                    { label: "Applied", value: 240, percentage: 100, color: "bg-blue-400" },
                    { label: "Shortlisted", value: 45, percentage: 18.7, color: "bg-indigo-400" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  {[
                    { label: "Interviewed", value: 12, percentage: 5, color: "bg-purple-400" },
                    { label: "Hired", value: 2, percentage: 0.8, color: "bg-[#FF4D94]" }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>

        <div className="p-6 rounded-3xl glass shadow-sm flex flex-col justify-center">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-white/5 hover:bg-[#FF4D94]/10 rounded-2xl flex flex-col items-center justify-center space-y-2 group transition-all border border-white/5 hover:border-[#FF4D94]/30">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF4D94] group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold">New Job</span>
              </button>
              <button className="p-4 bg-white/5 hover:bg-blue-400/10 rounded-2xl flex flex-col items-center justify-center space-y-2 group transition-all border border-white/5 hover:border-blue-400/30">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                   <Calendar size={20} />
                </div>
                <span className="text-xs font-bold">Schedule</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

