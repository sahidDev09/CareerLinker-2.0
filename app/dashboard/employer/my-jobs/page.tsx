"use client";

import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";
import { 
  Briefcase, 
  Plus, 
  Search, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import JobCard from "@/components/jobs/JobCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  type: string;
  salary: string;
  posted_at: string;
  working_type: string;
  company_logo: string;
  skill_tags: string[];
}

export default function MyJobsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMyJobs() {
      if (!isLoaded || !user) return;
      
      const role = user.publicMetadata?.role as string;
      if (role !== "recruiter") {
        router.push("/dashboard/candidate");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('recruiter_id', user.id)
          .order('posted_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching my jobs:", error);
        toast.error("Failed to load your job postings");
      } finally {
        setLoading(false);
      }
    }

    fetchMyJobs();
  }, [isLoaded, user, router, supabase]);

  const handleDelete = async () => {
    if (!jobToDelete || !user) return;

    try {
      setIsDeleting(true);
      const { error, data } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobToDelete)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        // If data is empty but no error, it means the row wasn't found or RLS blocked deletion
        const { data: checkData } = await supabase.from('jobs').select('id').eq('id', jobToDelete).single();
        if (checkData) {
          throw new Error("Job exists but you don't have permission to delete it (RLS). Please check your Supabase RLS policies.");
        } else {
          throw new Error("Job not found. It might have been deleted already.");
        }
      }

      setJobs(prev => prev.filter(job => job.id !== jobToDelete));
      toast.success("Job post deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job post");
    } finally {
      setIsDeleting(false);
      setJobToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/post-job?jobId=${id}`);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff4d94] animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 text-white">
      {/* Background Decor */}
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
                My Job <span className="gradient-text">Postings</span>
              </h1>
              <p className="text-slate-400">Manage and track all the jobs you have posted.</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF4D94] transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your jobs..." 
                  className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-[#FF4D94]/50 outline-none w-full md:w-80 transition-all border-white/20"
                />
              </div>
              <Link 
                href="/post-job" 
                className="px-6 py-3 bg-[#FF4D94] text-white rounded-xl font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center whitespace-nowrap"
              >
                <Plus size={20} className="mr-2" />
                Post Job
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {filteredJobs.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <ScaleIn key={job.id}>
              <JobCard 
                id={job.id}
                title={job.title}
                company={job.company_name}
                location={job.location}
                type={job.type}
                salary={job.salary}
                postedAt={job.posted_at}
                workingType={job.working_type}
                logoUrl={job.company_logo}
                tags={job.skill_tags}
                variant="modern"
                onDelete={() => setJobToDelete(job.id)}
                onEdit={() => handleEdit(job.id)}
              />
            </ScaleIn>
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn>
          <div className="glass rounded-3xl p-20 text-center flex flex-col items-center justify-center space-y-6 border-dashed border-2 border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600">
              <Briefcase size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No job posts found</h3>
              <p className="text-slate-400 max-w-xs mx-auto">
                {searchQuery ? "We couldn't find any jobs matching your search." : "You haven't posted any jobs yet. Start hiring today!"}
              </p>
            </div>
            {!searchQuery && (
              <Link 
                href="/post-job" 
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-all"
              >
                Create First Post
              </Link>
            )}
          </div>
        </FadeIn>
      )}

      <ConfirmDialog 
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Job Post"
        description="Are you sure you want to delete this job post? This action cannot be undone and will remove all associated applicant data."
        isLoading={isDeleting}
        confirmText="Yes, Delete"
        cancelText="Keep Job"
      />
    </div>
  );
}
