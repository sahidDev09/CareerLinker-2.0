"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { 
  Users, 
  Plus, 
  Search, 
  Briefcase, 
  Calendar, 
  Eye, 
  TrendingUp,
  LayoutGrid,
  List,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import InterviewModal, { InterviewDetails } from "@/components/dashboard/InterviewModal";


const STAGES = ["Pending", "Reviewing", "Shortlisted", "Interviewing", "Hired", "Rejected"];

interface AppliedProfile {
  user_id: string;
  user_name: string;
  user_email: string;
  resume_url: string;
  applied: boolean;
  status: string;
  avatar?: string;
  applied_at: string;
  interview_details?: InterviewDetails;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  Reviewing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Shortlisted: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  Interviewing: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  Hired: "bg-[#FF4D94]/10 text-[#FF4D94] border-[#FF4D94]/20",
  Rejected: "bg-red-400/10 text-red-400 border-red-400/20",
  pending: "bg-slate-400/10 text-slate-400 border-slate-400/20", // Handle lowercase case if any
};

const STAGE_DOT_COLORS: Record<string, string> = {
  Pending: "bg-slate-400",
  Reviewing: "bg-blue-400",
  Shortlisted: "bg-emerald-400",
  Interviewing: "bg-purple-400",
  Hired: "bg-[#FF4D94]",
  Rejected: "bg-red-400",
};

interface Applicant {
  id: string;
  jobId: string;
  name: string;
  role: string;
  appliedDate: string;
  status: string;
  experience: string;
  email: string;
  avatar: string | null;
  resume: string;
  interview_details?: InterviewDetails;
}

interface Job {
  id: string;
  title: string;
  status: string;
  views?: number;
  applied_profiles?: AppliedProfile[];
}

export default function EmployerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [view, setView] = useState<"list" | "board">("list");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<{jobId: string, userId: string, name: string, interview_details?: InterviewDetails} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const supabase = createClient();

  const handleStatusChange = async (jobId: string, userId: string, newStatus: string) => {
    if (newStatus === "Interviewing") {
      const applicant = applicants.find(a => a.id === userId && a.jobId === jobId);
      if (applicant) {
        setSelectedApplicant({ 
          jobId, 
          userId, 
          name: applicant.name,
          interview_details: applicant.interview_details 
        });
        setIsInterviewModalOpen(true);
      }
      return;
    }

    try {
      // 1. Fetch current job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('applied_profiles')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;

      const updatedProfiles = (jobData.applied_profiles || []).map((p: AppliedProfile) => 
        p.user_id === userId ? { ...p, status: newStatus, interview_details: newStatus === "Interviewing" ? p.interview_details : undefined } : p
      );

      const { error } = await supabase
        .from('jobs')
        .update({ applied_profiles: updatedProfiles })
        .eq('id', jobId);

      if (error) throw error;

      setApplicants((prev: Applicant[]) => prev.map((app: Applicant) => 
        (app.id === userId && app.jobId === jobId) ? { ...app, status: newStatus } : app
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleInterviewConfirm = async (details: InterviewDetails) => {
    if (!selectedApplicant) return;
    
    try {
      setIsUpdating(true);
      const { jobId, userId } = selectedApplicant;

      // 1. Fetch current job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('applied_profiles')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;

      const updatedProfiles = (jobData.applied_profiles || []).map((p: AppliedProfile) => 
        p.user_id === userId ? { ...p, status: "Interviewing", interview_details: details } : p
      );

      const { error } = await supabase
        .from('jobs')
        .update({ applied_profiles: updatedProfiles })
        .eq('id', jobId);

      if (error) throw error;

      setApplicants((prev: Applicant[]) => prev.map((app: Applicant) => 
        (app.id === userId && app.jobId === jobId) ? { ...app, status: "Interviewing", interview_details: details } : app
      ));
      
      toast.success(`Interview scheduled for ${selectedApplicant.name}`);
      setIsInterviewModalOpen(false);
      setSelectedApplicant(null);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteApplication = async (jobId: string, userId: string) => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;

    try {
      // 1. Fetch current job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('applied_profiles')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;

      const updatedProfiles = (jobData.applied_profiles || []).filter((p: AppliedProfile) => 
        p.user_id !== userId
      );

      const { error } = await supabase
        .from('jobs')
        .update({ applied_profiles: updatedProfiles })
        .eq('id', jobId);

      if (error) throw error;

      setApplicants((prev: Applicant[]) => prev.filter((app: Applicant) => !(app.id === userId && app.jobId === jobId)));
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !user) return;
      
      const role = user.publicMetadata?.role as string;
      if (role !== "recruiter") {
        router.push("/dashboard/candidate" + (window.location.search || ""));
        return;
      }

      try {
        setLoading(true);
        // 1. Fetch all jobs by this recruiter
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('recruiter_id', user.id);

        if (jobsError) throw jobsError;
        setJobs(jobsData || []);

        // 2. Extract applicants from jobs.applied_profiles
        const allApplicants: Applicant[] = [];
        (jobsData || []).forEach(job => {
          if (job.applied_profiles) {
            job.applied_profiles.forEach((profile: AppliedProfile) => {
              allApplicants.push({
                id: profile.user_id,
                jobId: job.id,
                name: profile.user_name,
                role: job.title,
                appliedDate: profile.applied_at ? formatRelativeTime(profile.applied_at) : "Recent",
                status: profile.status,
                experience: "Candidate",
                email: profile.user_email,
                avatar: profile.avatar || null,
                resume: profile.resume_url,
                interview_details: profile.interview_details
              });
            });
          }
        });

        setApplicants(allApplicants);
      } catch (error) {
        console.error("Error fetching employer dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, user, router, supabase]);

  const stats = useMemo(() => {
    const activeJobsCount = jobs.filter((j: Job) => j.status === 'active').length;
    const totalApplicants = applicants.length;
    const interviewsCount = applicants.filter((a: Applicant) => a.status === 'Interviewing').length;
    const totalViewsCount = jobs.reduce((acc: number, job: Job) => acc + (job.views || 0), 0);

    return [
      { label: "Active Jobs", value: activeJobsCount, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
      { label: "New Applicants", value: totalApplicants, icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
      { label: "Interviews", value: interviewsCount, icon: Calendar, color: "text-[#FF4D94]", bg: "bg-[#FF4D94]/10" },
      { label: "Total Views", value: totalViewsCount > 999 ? (totalViewsCount / 1000).toFixed(1) + 'k' : totalViewsCount, icon: Eye, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    ];
  }, [jobs, applicants]);

  const groupedApplicants = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = applicants.filter(app => app.status === stage);
      return acc;
    }, {} as Record<string, typeof applicants>);
  }, [applicants]);

  if (!isLoaded || loading || (user && user.publicMetadata?.role !== "recruiter")) {
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
            <Link 
              href={
                stat.label === "Active Jobs" ? "/dashboard/employer/my-jobs" :
                stat.label === "New Applicants" ? "/dashboard/employer/applicants" :
                stat.label === "Interviews" ? "/dashboard/employer/applicants?status=Interviewing" :
                "#"
              }
              className="block p-6 rounded-2xl glass shadow-sm group hover:border-[#FF4D94]/50 transition-all duration-300"
            >
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
            </Link>
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

        {applicants.length === 0 ? (
          <FadeIn>
            <div className="glass rounded-3xl p-16 text-center border-2 border-dashed border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-slate-500">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">No applicants yet</h3>
              <p className="text-slate-400 max-w-sm mx-auto mb-8">
                When candidates apply to your job postings, they will appear here in your pipeline.
              </p>
              <Link 
                href="/post-job"
                className="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
              >
                <Plus size={18} className="mr-2" />
                Post another job
              </Link>
            </div>
          </FadeIn>
        ) : view === "list" ? (
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
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.jobId, app.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-transparent border cursor-pointer outline-none transition-all ${STATUS_COLORS[app.status]}`}
                          >
                            {STAGES.map(stage => (
                              <option key={stage} value={stage} className="bg-[#1a1c2e] text-white">
                                {stage}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-[#FF4D94]/10 hover:bg-[#FF4D94] border border-[#FF4D94]/20 hover:border-[#FF4D94] rounded-lg transition-all group/btn"
                              onClick={() => window.open(app.resume, '_blank')}
                            >
                              <FileText size={14} className="text-[#FF4D94] group-hover/btn:text-white transition-colors" />
                              View Resume
                            </button>

                            {app.status === "Rejected" && (
                              <button 
                                className="flex items-center justify-center p-1.5 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-lg transition-all"
                                onClick={() => handleDeleteApplication(app.jobId, app.id)}
                                title="Delete Application"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
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
                       <div className={`w-2 h-2 rounded-full ${STAGE_DOT_COLORS[stage]}`} />
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
                            <div className="relative group/more">
                              <button className="text-slate-600 hover:text-white transition-colors p-1">
                                <MoreHorizontal size={14} />
                              </button>
                              <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block z-20 bg-[#1a1c2e] border border-white/10 rounded-xl shadow-2xl p-1 min-w-[120px]">
                                {STAGES.map(s => (
                                  <button
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(app.jobId, app.id, s);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg hover:bg-white/5 transition-colors ${app.status === s ? 'text-[#FF4D94]' : 'text-slate-400'}`}
                                  >
                                    {s}
                                  </button>
                                ))}
                                {app.status === "Rejected" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteApplication(app.jobId, app.id);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {app.appliedDate}
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(app.resume, '_blank');
                                }}
                                className="flex items-center gap-1 text-[#FF4D94] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                              >
                                <FileText size={12} />
                                Resume
                              </button>
                              <div className="flex items-center gap-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                Details <ChevronRight size={10} />
                              </div>
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
                    { label: "Applied", value: applicants.length, percentage: 100, color: "bg-blue-400" },
                    { label: "Shortlisted", value: applicants.filter(a => a.status === 'Shortlisted').length, percentage: applicants.length ? (applicants.filter(a => a.status === 'Shortlisted').length / applicants.length) * 100 : 0, color: "bg-indigo-400" },
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
                    { label: "Interviewed", value: applicants.filter(a => a.status === 'Interviewing').length, percentage: applicants.length ? (applicants.filter(a => a.status === 'Interviewing').length / applicants.length) * 100 : 0, color: "bg-purple-400" },
                    { label: "Hired", value: applicants.filter(a => a.status === 'Hired').length, percentage: applicants.length ? (applicants.filter(a => a.status === 'Hired').length / applicants.length) * 100 : 0, color: "bg-[#FF4D94]" }
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

      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setSelectedApplicant(null);
        }}
        onConfirm={handleInterviewConfirm}
        isLoading={isUpdating}
        candidateName={selectedApplicant?.name || ""}
        initialDetails={selectedApplicant?.interview_details}
      />
    </div>
  );
}

