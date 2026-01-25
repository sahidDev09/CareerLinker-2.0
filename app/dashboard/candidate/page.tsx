"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  ExternalLink,
  Play
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateProfileCompleteness } from "@/lib/profile-utils";
import { Loader2 } from "lucide-react";


const stats = [
  { label: "Applied Jobs", value: 12, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Interviews", value: 3, icon: Calendar, color: "text-[#FF4D94]", bg: "bg-[#FF4D94]/10" },
  { label: "Shortlisted", value: 5, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Rejected", value: 2, icon: XCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
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
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchProfile() {
      if (!isLoaded || !user) return;
      
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            ...data,
            imageUrl: data.image_url || user.imageUrl,
            resumeUrl: data.resume_url,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        // loading finished
      }
    }

    fetchProfile();
  }, [user, isLoaded, supabase]);

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role as string;
      if (role === "recruiter") {
        router.push("/dashboard/employer" + (window.location.search || ""));
      }
    }
  }, [isLoaded, user, router]);

  const { percentage, nextSteps, completedSteps } = useMemo(() => {
    return calculateProfileCompleteness(profile);
  }, [profile]);

  if (!isLoaded || (user && user.publicMetadata?.role === "recruiter")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff4d94] animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, <span className="gradient-text">Sahid!</span></h1>
            <p className="text-slate-400">Here&apos;s an overview of your job applications and upcoming interviews.</p>
          </div>
          <Link 
            href="/jobs" 
            className="px-6 py-3 bg-[#FF4D94] text-white rounded-xl font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95"
          >
            Find New Jobs
          </Link>
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
                <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+2 this week</div>
              </div>
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-400 mt-1">{stat.label}</div>
            </div>
          </ScaleIn>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <Link href="/dashboard/candidate/applications" className="text-sm font-bold gradient-text hover:underline">View All</Link>
          </div>
          
          <div className="glass rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Job Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-white">{app.role}</div>
                            <div className="text-xs text-slate-400">{app.company} • {app.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-medium">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === "Shortlisted" ? "bg-green-100/10 text-green-400" :
                          app.status === "Interview Scheduled" ? "bg-purple-100/10 text-purple-400" :
                          "bg-blue-100/10 text-blue-400"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-400">
                        {app.date}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="text-slate-400 hover:text-white transition-colors">
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
          <div className="p-6 rounded-3xl bg-[#FF4D94] text-white shadow-xl shadow-[#FF4D94]/20 relative overflow-hidden">
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
                <button className="w-full py-3 bg-white text-[#FF4D94] rounded-xl font-bold hover:bg-slate-100 transition-colors">
                  View Invitation
                </button>
              </div>
            ))}
          </div>

          {/* Profile widget */}
          <div className="p-6 rounded-3xl glass shadow-sm">
            <h3 className="font-bold mb-4">Profile Completeness</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">
                  {percentage === 100 ? "Perfect Profile!" : percentage > 70 ? "Almost there!" : "Keep going!"}
                </span>
                <span className="font-bold text-[#FF4D94]">{percentage}%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF4D94] rounded-full shadow-[0_0_10px_rgba(255,77,148,0.5)] transition-all duration-1000 ease-out" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="space-y-2 pt-2">
                {completedSteps.slice(0, 2).map((step) => (
                  <div key={step.id} className="flex items-center text-sm text-emerald-400">
                    <CheckCircle2 size={16} className="mr-2" />
                    <span>{step.label}</span>
                  </div>
                ))}
                {nextSteps.slice(0, 2).map((step) => (
                  <div key={step.id} className="flex items-center text-sm text-slate-400">
                    <Clock size={16} className="mr-2" />
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
              <Link 
                href="/dashboard/candidate/profile"
                className="w-full inline-block text-center py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-colors mt-4"
              >
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
