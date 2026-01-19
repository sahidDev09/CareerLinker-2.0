"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  FileText, 
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Play
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Applied Jobs", value: 12, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Interviews", value: 3, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Shortlisted", value: 5, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { label: "Rejected", value: 2, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
];

const applications = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, CA",
    status: "Shortlisted",
    date: "Jan 15, 2026",
    logo: null,
  },
  {
    id: 2,
    role: "Product Designer",
    company: "CreativeFlow",
    location: "New York, NY",
    status: "Interview Scheduled",
    date: "Jan 12, 2026",
    logo: null,
  },
  {
    id: 3,
    role: "Backend Developer",
    company: "DataBridge",
    location: "Remote",
    status: "Applied",
    date: "Jan 10, 2026",
    logo: null,
  },
];

const upcomingInterviews = [
  {
    id: 1,
    role: "Product Designer",
    company: "CreativeFlow",
    time: "Tomorrow, 10:00 AM",
    type: "Google Meet",
  }
];

export default function CandidateDashboard() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, <span className="text-indigo-600">Sahid!</span></h1>
            <p className="text-slate-500 dark:text-slate-400">Here's an overview of your job applications and upcoming interviews.</p>
          </div>
          <Link 
            href="/jobs" 
            className="px-6 py-3 gradient-bg text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Find New Jobs
          </Link>
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
                <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+2 this week</div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          </ScaleIn>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <Link href="/dashboard/candidate/applications" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{app.role}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{app.company} • {app.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-medium">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === "Shortlisted" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          app.status === "Interview Scheduled" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500 dark:text-slate-400">
                        {app.date}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-8">
          {/* Upcoming Interview */}
          <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar size={120} />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Calendar size={20} className="mr-2" />
              Upcoming Interviews
            </h3>
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="space-y-4">
                <div>
                  <div className="text-sm opacity-80">{interview.role} at {interview.company}</div>
                  <div className="text-xl font-bold mt-1">{interview.time}</div>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Play size={14} />
                  <span>Join via {interview.type}</span>
                </div>
                <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  View Invitation
                </button>
              </div>
            ))}
          </div>

          {/* Profile widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4">Profile Completeness</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Almost there!</span>
                <span className="font-bold text-indigo-600">85%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 size={16} className="mr-2" />
                  <span>Contact info added</span>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 size={16} className="mr-2" />
                  <span>Resume uploaded</span>
                </div>
                <div className="flex items-center text-sm text-slate-400">
                  <Clock size={16} className="mr-2" />
                  <span>Add work experience</span>
                </div>
              </div>
              <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-100 transition-colors mt-4">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
