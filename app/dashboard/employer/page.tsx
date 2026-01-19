"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink,
  Briefcase,
  Calendar,
  Eye,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Active Jobs", value: 8, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "New Applicants", value: 124, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Interviews", value: 12, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Total Views", value: "4.2k", icon: Eye, color: "text-green-600", bg: "bg-green-50" },
];

const applicants = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    appliedDate: "Today",
    status: "Reviewing",
    experience: "8 yrs",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Designer",
    appliedDate: "Yesterday",
    status: "Shortlisted",
    experience: "5 yrs",
  },
  {
    id: 3,
    name: "David Miller",
    role: "Backend Developer",
    appliedDate: "Jan 15, 2026",
    status: "Interviewing",
    experience: "4 yrs",
  },
];

export default function EmployerDashboard() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Employer Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back! Manage your job postings and applicants here.</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/post-job" 
              className="px-6 py-3 gradient-bg text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center"
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
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          </ScaleIn>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Applicants */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Applicants</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <td className="px-6 py-6 font-bold text-slate-900 dark:text-white">
                        <div>
                          {app.name}
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{app.experience} experience</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {app.role}
                      </td>
                      <td className="px-6 py-6 font-medium">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "Shortlisted" ? "bg-green-100 text-green-700" :
                          app.status === "Interviewing" ? "bg-purple-100 text-purple-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                            <MessageSquare size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hiring Funnel & Analytics */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
              <Building2 size={150} />
            </div>
            <h3 className="text-lg font-bold mb-6">Hiring Funnel</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Applied</span>
                  <span className="font-bold">240</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Shortlisted</span>
                  <span className="font-bold">45</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "18.7%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Interviewed</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Hired</span>
                  <span className="font-bold">2</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "0.8%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <span className="text-xs font-bold">New Job</span>
              </button>
              <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                   <Calendar size={20} />
                </div>
                <span className="text-xs font-bold">Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
