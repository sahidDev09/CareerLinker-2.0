"use client";

import { FadeIn } from "@/components/shared/Motion";
import { 
  ArrowLeft,
  Search,
  Loader2,
  FileText,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
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
  pending: "bg-slate-400/10 text-slate-400 border-slate-400/20",
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

export default function ApplicantsPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff4d94] animate-spin" />
      </div>
    }>
      <ApplicantsContent />
    </Suspense>
  );
}

function ApplicantsContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");
  
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "all");
  
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<{jobId: string, userId: string, name: string, interview_details?: InterviewDetails} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchApplicants() {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        // 1. Fetch all jobs by this recruiter
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('recruiter_id', user.id);

        if (!jobsData || jobsData.length === 0) {
          setLoading(false);
          return;
        }

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
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, [isLoaded, user, supabase]);

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

      setApplicants(prev => prev.map(app => 
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

      setApplicants(prev => prev.map(app => 
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

      setApplicants(prev => prev.filter(app => !(app.id === userId && app.jobId === jobId)));
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           app.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchQuery, statusFilter]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff4d94] animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#ff4d94]/5 to-transparent pointer-events-none -z-10" />
      
      <FadeIn direction="up">
        <div className="mb-12 space-y-6">
          <Link 
            href="/dashboard/employer" 
            className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#FF4D94] transition-colors group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">
                All <span className="gradient-text">Applicants</span>
              </h1>
              <p className="text-slate-400">Review and manage candidates for all your posted jobs.</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border-white/10">
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D94] transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or role..." 
              className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-[#FF4D94]/50 outline-none w-full transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === "all" ? "bg-[#FF4D94] text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
            >
              All
            </button>
            {STAGES.map(stage => (
              <button 
                key={stage}
                onClick={() => setStatusFilter(stage)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === stage ? "bg-[#FF4D94] text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden shadow-xl border-white/10">
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
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FF4D94]/10 flex items-center justify-center text-[#FF4D94] font-bold uppercase">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#FF4D94] transition-colors">{app.name}</div>
                            <div className="text-xs text-slate-400">{app.experience}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-300 font-medium whitespace-nowrap">
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
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#FF4D94]/10 hover:bg-[#FF4D94] border border-[#FF4D94]/20 hover:border-[#FF4D94] rounded-xl transition-all group/btn"
                            onClick={() => window.open(app.resume, '_blank')}
                          >
                            <FileText size={14} className="text-[#FF4D94] group-hover/btn:text-white transition-colors" />
                            Resume
                          </button>
                          
                          {app.status === "Rejected" && (
                            <button 
                              className="inline-flex items-center justify-center p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
                              onClick={() => handleDeleteApplication(app.jobId, app.id)}
                              title="Delete Application"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-500 italic">
                      No applicants found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

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
