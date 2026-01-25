"use client";

import { useEffect, useState, useMemo } from "react";
import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

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
  company_name: string;
  company_logo: string;
  location: string;
  working_type: string;
  type: string;
  salary: string;
  salary_num: number;
  applied_count: number;
  applied_profiles: AppliedProfile[];
  posted_at: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);
  
  const { user, isLoaded: isUserLoaded } = useUser();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        setLoading(true);
        // Fetch jobs that are high paying and most applied
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('applied_count', { ascending: false })
          .order('salary_num', { ascending: false })
          .limit(6);

        if (error) throw error;
        if (data) setJobs(data);
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedJobs();
  }, [supabase]);

  // Fetch saved jobs for current user
  useEffect(() => {
    async function fetchSavedJobs() {
      if (!isUserLoaded || !user) {
        setSavedJobIds(new Set());
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          setSavedJobIds(new Set(data.map(item => item.job_id)));
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    }

    fetchSavedJobs();
  }, [user, isUserLoaded, supabase]);

  const handleBookmarkToggle = async (jobId: string) => {
    if (!user) {
      toast.error("Please sign in to save jobs");
      return;
    }

    setBookmarkingId(jobId);
    const isSaved = savedJobIds.has(jobId);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;
        
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success("Job removed from bookmarks");
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, job_id: jobId });

        if (error) throw error;

        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });
        toast.success("Job saved!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarkingId(null);
    }
  };

  return (
    <section className="container mx-auto py-5">
      <div className="text-center mb-18">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-[#ff4d94]">Explore</span> Our Current Job Openings
        </h2>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Loading states
          Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="h-[380px] w-full bg-white/5 animate-pulse rounded-[2rem] border border-white/10" 
            />
          ))
        ) : (
          jobs.map((job, i) => (
            <FadeIn key={job.id} direction="up" delay={i * 0.1}>
              <JobCard 
                id={job.id}
                title={job.title}
                company={job.company_name}
                type={job.type}
                workingType={job.working_type}
                postedAt={job.posted_at}
                salary={job.salary}
                logoUrl={job.company_logo}
                appliedCount={job.applied_count}
                avatars={job.applied_profiles?.map(p => p.avatar).filter((a): a is string => !!a) || []}
                variant="modern" 
                isSaved={savedJobIds.has(job.id)}
                onBookmarkToggle={() => handleBookmarkToggle(job.id)}
                isBookmarking={bookmarkingId === job.id}
              />
            </FadeIn>
          ))
        )}
      </StaggerContainer>
    </section>
  );
}
