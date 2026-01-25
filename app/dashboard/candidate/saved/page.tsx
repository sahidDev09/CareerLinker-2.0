"use client";

import { useEffect, useState, useMemo } from "react";
import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import JobCard from "@/components/jobs/JobCard";

interface AppliedProfile {
  user_id: string;
  user_name: string;
  user_email: string;
  resume_url: string;
  applied: boolean;
  status: string;
  avatar?: string;
  applied_at: string;
}

interface Job {
  id: string;
  title: string;
  details: string;
  company_name: string;
  company_logo: string;
  location: string;
  type: string;
  working_type: string;
  salary: string;
  salary_num: number;
  skill_tags: string[];
  applied_count: number;
  applied_profiles: AppliedProfile[];
  recruiter_id: string;
  recruiter_name: string;
  posted_at: string;
  posted_date: string;
}

interface SavedJob {
  job_id: string;
  user_id: string;
  created_at: string;
  jobs: Job;
}

export default function SavedJobsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchSavedJobs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          jobs (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSavedJobs(data as SavedJob[]);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoaded && user) {
      fetchSavedJobs();
    } else if (isUserLoaded && !user) {
      setLoading(false);
    }
  }, [user, isUserLoaded, supabase]);

  const handleRemoveSaved = async (jobId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;

      setSavedJobs(prev => prev.filter(item => item.job_id !== jobId));
      toast.success("Job removed from saved");
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("Failed to remove job");
    }
  };

  if (!isUserLoaded || loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="mb-12">
          <div className="h-4 w-32 bg-white/5 animate-pulse rounded mb-2" />
          <div className="h-10 w-64 bg-white/5 animate-pulse rounded mb-4" />
          <div className="h-4 w-96 bg-white/5 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[350px] bg-white/5 animate-pulse rounded-[2rem] border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

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
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedJobs.map((item) => (
            <FadeIn key={item.job_id} direction="up">
              <JobCard 
                id={item.job_id}
                title={item.jobs.title}
                company={item.jobs.company_name}
                location={item.jobs.location}
                type={item.jobs.type}
                workingType={item.jobs.working_type}
                salary={item.jobs.salary}
                postedAt={item.jobs.posted_at}
                logoUrl={item.jobs.company_logo}
                tags={item.jobs.skill_tags}
                appliedCount={item.jobs.applied_count}
                avatars={item.jobs.applied_profiles?.map(p => p.avatar).filter((a): a is string => !!a) || []}
                variant="modern"
                isSaved={true}
                onBookmarkToggle={() => handleRemoveSaved(item.job_id)}
                onDelete={() => handleRemoveSaved(item.job_id)}
              />
            </FadeIn>
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
