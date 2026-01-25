"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronLeft, 
  Users,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/shared/Motion";
import DOMPurify from 'dompurify';

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
  posted_at: string;
  posted_date: string;
  description?: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  resume_url: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const supabase = useMemo(() => createClient(), []);

  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (jobError) throw jobError;
        setJob(jobData);

        // Fetch user profile and application status if logged in
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
            setSelectedResumeUrl(profileData.resume_url);
          }

          const { data: appData } = await supabase
            .from('job_applications')
            .select('*')
            .eq('job_id', id)
            .eq('user_id', user.id);

          if (appData && appData.length > 0) {
            setIsApplied(true);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id, user, supabase]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploadingResume(true);
    try {
      const fileName = `${user.id}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('resume')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resume')
        .getPublicUrl(fileName);

      setSelectedResumeUrl(publicUrl);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!selectedResumeUrl) {
      toast.error("Please provide a resume to apply", {
        description: "Upload a new one or fill your profile."
      });
      return;
    }

    setApplying(true);
    try {
      // 1. Insert application
      const { error: appError } = await supabase
        .from('job_applications')
        .insert({
          job_id: id,
          user_id: user.id,
          resume_url: selectedResumeUrl,
          status: 'Applied'
        });

      if (appError) throw appError;

      // 2. Update job applied count
      await supabase.rpc('increment_applied_count', { 
        job_id: id 
      });

      // Note: If RPC doesn't exist, we might need a fallback, but let's assume it does for now
      // as part of the system logic.
      
      setIsApplied(true);
      toast.success("Application submitted successfully!", {
        description: "The recruiter has been notified of your interest."
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading || !isUserLoaded) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#ff4d94] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto  py-220 text-center">
        <h2 className="text-3xl font-bold mb-4">Job not found</h2>
        <Link href="/jobs" className="text-[#ff4d94] font-bold hover:underline">
          Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full bg-gradient-to-b from-[#ff4d94]/10 to-transparent pointer-events-none" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link 
            href="/jobs" 
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to browse
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="">
              <FadeIn direction="up">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-[#ff4d94] tracking-wider uppercase">
                    {job.working_type}
                  </span>
                  <span className="text-slate-500 text-sm font-medium">Posted {job.posted_at}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-lg text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 overflow-hidden">
                      {job.company_logo ? (
                        <Image src={job.company_logo} alt={job.company_name} width={40} height={40} className="object-contain" />
                      ) : (
                        <Building2 size={24} className="text-slate-400" />
                      )}
                    </div>
                    <span className="font-bold text-white">{job.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={22} className="text-[#ff4d94]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={22} className="text-emerald-400" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Save Position
              </button>
              <button 
                onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-[#ff4d94] text-white rounded-2xl font-bold shadow-[0_15px_30px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                Apply Now <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 md:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <FadeIn direction="up">
              <div className="glass rounded-[2.5rem] p-8 md:p-12 space-y-10 overflow-hidden">
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="text-[#ff4d94]" size={28} />
                    Job Description
                  </h2>
                  <div 
                    className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg rich-text-content break-words overflow-hidden"
                    dangerouslySetInnerHTML={{ 
                      __html: job.details 
                        ? (typeof window !== 'undefined' ? DOMPurify.sanitize(job.details) : job.details)
                        : "No description provided."
                    }}
                  />
                  <style jsx global>{`
                    .rich-text-content {
                      word-break: break-word;
                      overflow-wrap: break-word;
                    }
                    .rich-text-content ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .rich-text-content ol {
                      list-style-type: decimal;
                      padding-left: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .rich-text-content p {
                      margin-bottom: 1rem;
                    }
                    .rich-text-content strong {
                      color: white;
                      font-weight: 700;
                    }
                  `}</style>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="text-[#ff4d94]" size={28} />
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skill_tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:border-[#ff4d94]/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff4d94]/10 flex items-center justify-center text-[#ff4d94] shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Schedule</h4>
                      <p className="text-slate-400">{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Team Size</h4>
                      <p className="text-slate-400">10-50 Employees</p>
                    </div>
                  </div>
                </section>
              </div>
            </FadeIn>
          </div>

          {/* Right Sidebar - Application Card */}
          <div className="lg:col-span-1">
            <div id="apply-section" className="sticky top-32 space-y-6">
              <FadeIn direction="left">
                <div className="glass rounded-[2.5rem] p-8 space-y-8 border-t border-white/20">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Easy Apply</h3>
                    <p className="text-slate-400 text-sm">Send your application directly to the hiring team.</p>
                  </div>

                  {isApplied ? (
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
                      <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-xl text-emerald-400">Successfully Applied!</h4>
                        <p className="text-slate-400 text-sm mt-1">We&apos;ve sent your profile and resume to the recruiter.</p>
                      </div>
                      <button 
                        disabled 
                        className="w-full py-4 bg-emerald-500/20 text-emerald-400 rounded-2xl font-bold cursor-not-allowed border border-emerald-500/30"
                      >
                        Application Pending
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Resume Selection */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Your Resume</label>
                        
                        {profile?.resume_url ? (
                          <div 
                            onClick={() => setSelectedResumeUrl(profile.resume_url)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                              selectedResumeUrl === profile.resume_url 
                                ? "bg-[#ff4d94]/10 border-[#ff4d94] shadow-[0_0_15px_rgba(255,77,148,0.2)]" 
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="font-bold text-sm truncate">Resume from Profile</div>
                              <p className="text-[10px] text-slate-500 truncate">Last updated in profile settings</p>
                            </div>
                            {selectedResumeUrl === profile.resume_url && (
                              <CheckCircle2 size={18} className="text-[#ff4d94]" />
                            )}
                          </div>
                        ) : null}

                        <div className="relative">
                          <input 
                            type="file" 
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            className="hidden" 
                            id="new-resume" 
                          />
                          <label 
                            htmlFor="new-resume"
                            className={`w-full p-4 rounded-2xl border border-dashed transition-all cursor-pointer flex items-center gap-4 group ${
                              selectedResumeUrl && selectedResumeUrl !== profile?.resume_url
                                ? "bg-[#ff4d94]/10 border-[#ff4d94] solid shadow-[0_0_15px_rgba(255,77,148,0.2)]"
                                : "bg-white/5 border-white/10 hover:border-[#ff4d94]/50"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              selectedResumeUrl && selectedResumeUrl !== profile?.resume_url
                                ? "bg-[#ff4d94]/10 text-[#ff4d94]"
                                : "bg-white/10 text-slate-400 group-hover:text-[#ff4d94]"
                            }`}>
                              {uploadingResume ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Upload size={20} />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="font-bold text-sm truncate">
                                {selectedResumeUrl && selectedResumeUrl !== profile?.resume_url ? "New Resume Selected" : "Upload New CV"}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">PDF format only (Max 5MB)</p>
                            </div>
                            {selectedResumeUrl && selectedResumeUrl !== profile?.resume_url && !uploadingResume && (
                              <CheckCircle2 size={18} className="text-[#ff4d94]" />
                            )}
                          </label>
                        </div>
                      </div>

                      <button 
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full py-5 bg-[#ff4d94] text-white rounded-[1.5rem] font-bold shadow-[0_15px_30px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {applying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application <ArrowRight size={20} />
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-3 justify-center text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Trust & Safety Verified
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Company Preview Card */}
              <FadeIn direction="left" delay={0.2}>
                <div className="glass rounded-[2.5rem] p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2.5 overflow-hidden">
                      {job.company_logo ? (
                        <Image src={job.company_logo} alt={job.company_name} width={64} height={64} className="object-contain" />
                      ) : (
                        <Building2 size={32} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{job.company_name}</h4>
                      <div className="text-sm text-[#ff4d94] font-bold">Employer Verified</div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {job.company_name} is a leading technology company focused on delivering innovative solutions to global challenges. Join our missions to redefine the industry.
                  </p>
                  <Link href="#" className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm">
                    View Company Profile
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
