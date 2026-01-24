"use client";

import { useEffect, useState, useMemo } from "react";
import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";
import { createClient } from "@/lib/supabase/client";

interface AppliedProfile {
  id: string;
  name: string;
  avatar: string;
}

interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  location: string;
  working_type: string;
  salary: string;
  salary_num: number;
  applied_count: number;
  applied_profiles: AppliedProfile[];
  posted_at: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
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
                title={job.title}
                company={job.company_name}
                postedAt={job.posted_at}
                salary={job.salary}
                logoUrl={job.company_logo}
                appliedCount={job.applied_count}
                avatars={job.applied_profiles?.map(p => p.avatar) || []}
                variant="modern" 
              />
            </FadeIn>
          ))
        )}
      </StaggerContainer>
    </section>
  );
}
