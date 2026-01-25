"use client";

import { FadeIn } from "@/components/shared/Motion";
import { 
  ArrowLeft,
  Search,
  Loader2,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

const STAGES = ["Pending", "Reviewing", "Shortlisted", "Interviewing", "Hired", "Rejected"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  Reviewing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Shortlisted: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  Interviewing: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  Hired: "bg-[#FF4D94]/10 text-[#FF4D94] border-[#FF4D94]/20",
  Rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

interface Applicant {
  id: string;
  name: string;
  role: string;
  appliedDate: string;
  status: string;
  experience: string;
  email: string;
  avatar: string | null;
  resume: string;
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
  const supabase = createClient();

  useEffect(() => {
    async function fetchApplicants() {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        // 1. Fetch all jobs by this recruiter
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('id')
          .eq('recruiter_id', user.id);

        if (!jobsData || jobsData.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch all applications
        const { data: appsData, error: appsError } = await supabase
          .from('job_applications')
          .select('*, profiles(*), jobs(*)')
          .in('job_id', jobsData.map(j => j.id));

        if (appsError) throw appsError;

        const mappedApps = (appsData || []).map(app => ({
          id: app.id,
          name: app.profiles?.name || "Unknown Candidate",
          role: app.jobs?.title || "Unknown Role",
          appliedDate: app.created_at ? formatRelativeTime(app.created_at) : "Unknown",
          status: app.status || "Pending",
          experience: app.profiles?.experiences?.[0]?.role 
            ? `${app.profiles.experiences[0].role} at ${app.profiles.experiences[0].company}` 
            : "No experience listed",
          email: app.profiles?.email || "",
          avatar: app.profiles?.image_url || null,
          resume: app.resume_url || app.profiles?.resume_url || "#"
        }));

        setApplicants(mappedApps);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, [isLoaded, user, supabase]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplicants(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
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
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
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
                        <button 
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#FF4D94]/10 hover:bg-[#FF4D94] border border-[#FF4D94]/20 hover:border-[#FF4D94] rounded-xl transition-all group/btn"
                          onClick={() => window.open(app.resume, '_blank')}
                        >
                          <FileText size={14} className="text-[#FF4D94] group-hover/btn:text-white transition-colors" />
                          Resume
                        </button>
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
    </div>
  );
}
