"use client";

import { FadeIn, ScaleIn } from "@/components/shared/Motion";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  ArrowLeft,
  X,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Upload,
  Camera
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { useEffect, Suspense } from "react";
import pricingData from "@/data/pricing-plans.json";

export default function PostJobPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff4d94] animate-spin" />
      </div>
    }>
      <PostJobForm />
    </Suspense>
  );
}

function PostJobForm() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState(["React", "Next.js", "TypeScript"]);
  const [newSkill, setNewSkill] = useState("");
  const [jobPostingLimitReached, setJobPostingLimitReached] = useState(false);
  const [remainingJobs, setRemainingJobs] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "Full-time",
    working_type: "On-site",
    location: "",
    salary: "",
    details: "",
    company_name: "",
    company_logo: ""
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Local Preview
    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, company_logo: localUrl }));

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('companies_logo')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('companies_logo')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, company_logo: publicUrl }));
      toast.success("Logo uploaded successfully");
    } catch (error: unknown) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please use a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  useEffect(() => {
    async function fetchJob() {
      if (!jobId || !user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;
        if (data.recruiter_id !== user.id) {
          toast.error("Unauthorized to edit this job");
          router.push("/dashboard/employer");
          return;
        }

        setFormData({
          title: data.title,
          type: data.type,
          working_type: data.working_type,
          location: data.location,
          salary: data.salary,
          details: data.details,
          company_name: data.company_name,
          company_logo: data.company_logo
        });
        setSkills(data.skill_tags || []);
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId, user, supabase, router]);

  useEffect(() => {
    async function checkJobLimit() {
      if (!user || jobId) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("package")
          .eq("id", user.id)
          .single();
        
        const userPackage = profile?.package || "Free";
        const role = user.publicMetadata.role as string;
        if (role !== "recruiter") return;

        const rolePlans = pricingData.recruiter;
        const plan = rolePlans.find(p => p.name.toLowerCase() === userPackage.toLowerCase());

        if (plan) {
          const creditFeature = plan.features[0];
          const match = creditFeature.match(/(\d+|Unlimited)/i);
          const limitStr = match ? match[0] : "0";

          if (limitStr.toLowerCase() !== "unlimited") {
            const limit = parseInt(limitStr);
            const { count } = await supabase
              .from("jobs")
              .select("*", { count: "exact", head: true })
              .eq("recruiter_id", user.id)
              .eq("status", "active");
            
            const activeJobs = count || 0;
            setRemainingJobs(Math.max(0, limit - activeJobs));
            if (activeJobs >= limit) {
              setJobPostingLimitReached(true);
              toast.error("You have reached your job posting limit. Redirecting to pricing...");
              setTimeout(() => {
                router.push("/pricing");
              }, 2000);
            }
          } else {
            setRemainingJobs(Infinity);
          }
        }
      } catch (err) {
        console.error("Error checking job limit:", err);
      }
    }
    checkJobLimit();
  }, [user, supabase, jobId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a job");
      return;
    }

    if (!formData.title || !formData.company_name || !formData.salary) {
      toast.error("Please fill in all required fields (Title, Company Name, Salary)");
      return;
    }

    if (jobPostingLimitReached && !jobId) {
      toast.error("You have reached your job posting limit. Please upgrade your plan to post more jobs.");
      router.push("/pricing");
      return;
    }

    setLoading(true);
    try {
      const salaryNum = parseInt(formData.salary.replace(/[^0-9]/g, "")) || 0;
      const adjustedSalaryNum = formData.salary.toLowerCase().includes('k') ? salaryNum * 1000 : salaryNum;

      const jobData = {
        title: formData.title,
        details: formData.details,
        company_name: formData.company_name,
        company_logo: formData.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company_name)}&background=random`,
        location: formData.location,
        type: formData.type,
        working_type: formData.working_type,
        salary: formData.salary,
        salary_num: adjustedSalaryNum,
        skill_tags: skills,
        recruiter_id: user.id,
        recruiter_name: user.fullName || user.username || "Anonymous",
        status: 'active'
      };

      if (jobId) {
        const updatePayload = {
          title: formData.title,
          details: formData.details,
          company_name: formData.company_name,
          company_logo: formData.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company_name)}&background=random`,
          location: formData.location,
          type: formData.type,
          working_type: formData.working_type,
          salary: formData.salary,
          salary_num: adjustedSalaryNum,
          skill_tags: skills,
          status: 'active'
        };
        
        const { error, data } = await supabase
          .from("jobs")
          .update(updatePayload)
          .eq("id", jobId)
          .select();

        if (error) throw error;
        
        if (!data || data.length === 0) {
          const { data: checkData } = await supabase.from('jobs').select('id').eq('id', jobId).single();
          if (checkData) {
            throw new Error("Job exists but you don't have permission to update it (RLS). Please check your Supabase RLS policies.");
          } else {
            throw new Error("Job not found. It might have been deleted.");
          }
        }

        toast.success("Job updated successfully!");
      } else {
        const { error } = await supabase
          .from("jobs")
          .insert({
            ...jobData,
            posted_at: new Date().toISOString(),
            posted_date: new Date().toISOString(),
          });
        if (error) throw error;
        toast.success("Job posted successfully!");
      }

      router.push("/dashboard/employer/my-jobs");
    } catch (error: unknown) {
      console.error("Error posting job:", error);
      toast.error(error instanceof Error ? error.message : "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 text-white">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#ff4d94]/5 to-transparent pointer-events-none -z-10" />
      
      <FadeIn direction="up" className="mx-auto  px-4 md:px-0">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/dashboard/employer" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#FF4D94] mb-4 transition-colors group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {jobId ? "Edit" : "Post a"} <span className="gradient-text">{jobId ? "Job Post" : "New Job"}</span>
            </h1>
            <p className="text-slate-400 mt-2">{jobId ? "Update your job posting information." : "Reach thousands of talented professionals today."}</p>
            {!jobId && remainingJobs !== null && remainingJobs !== Infinity && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-[#ff4d94]/10 border border-[#ff4d94]/20 rounded-xl">
                <span className="text-sm font-bold text-[#ff4d94]">
                  {remainingJobs > 0 
                    ? `You can post ${remainingJobs} more job${remainingJobs === 1 ? "" : "s"} with your current plan.`
                    : "You have reached your job posting limit."}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Information */}
          <div className="glass rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Briefcase size={120} />
            </div>
            
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF4D94]/10 flex items-center justify-center text-[#FF4D94]">
                <Briefcase size={20} />
              </div>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Job Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Senior Product Designer"
                  className="w-full px-5 py-4  bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Company Name *</label>
                <input 
                  type="text" 
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="e.g. Acme Inc."
                  className="w-full px-5 py-4  bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Job Type</label>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none appearance-none transition-all"
                  >
                    <option className="bg-[#0a0a0a]" value="Full-time">Full-time</option>
                    <option className="bg-[#0a0a0a]" value="Part-time">Part-time</option>
                    <option className="bg-[#0a0a0a]" value="Remote">Remote</option>
                    <option className="bg-[#0a0a0a]" value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Working Type</label>
                <div className="relative">
                  <select 
                    value={formData.working_type}
                    onChange={(e) => setFormData({...formData, working_type: e.target.value})}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none appearance-none transition-all"
                  >
                    <option className="bg-[#0a0a0a]" value="On-site">On-site</option>
                    <option className="bg-[#0a0a0a]" value="Remote">Remote</option>
                    <option className="bg-[#0a0a0a]" value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. San Francisco, Remote"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Salary Range *</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g. $120k - $150k"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Company Logo</label>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Preview Area */}
                  <div className="relative group/logo">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl glass flex items-center justify-center p-2 overflow-hidden border-[#FF4D94]/30 relative transition-all group-hover/logo:border-[#FF4D94]/50">
                      {formData.company_logo ? (
                        <Image 
                          src={formData.company_logo} 
                          alt="Company Logo" 
                          width={128}
                          height={128}
                          className="w-full h-full object-contain rounded-2xl"
                          unoptimized={formData.company_logo.startsWith('blob:')}
                          onError={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              company_logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company_name || 'C')}&background=random` 
                            }));
                          }}
                        />
                      ) : (
                        <div className="text-slate-600 flex flex-col items-center gap-2">
                          <Camera size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Preview</span>
                        </div>
                      )}
                      
                      {uploading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 size={24} className="text-[#FF4D94] animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Upload File</label>
                        <label className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-white/5 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-[#FF4D94]/50 transition-all group/upload">
                          <Upload size={18} className="text-slate-500 group-hover/upload:text-[#FF4D94] transition-colors" />
                          <span className="text-sm font-bold text-slate-400 group-hover/upload:text-white transition-colors">Browse Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleLogoUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Or Paste URL</label>
                        <div className="relative">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input 
                            type="text" 
                            value={formData.company_logo.startsWith('blob:') ? '' : formData.company_logo}
                            onChange={(e) => setFormData({...formData, company_logo: e.target.value})}
                            placeholder="https://..."
                            className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 ml-1 font-medium italic">
                      Recommended: Square JPG or PNG, max 1MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="glass rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <FileText size={120} />
            </div>

            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <FileText size={20} />
              </div>
              Job Description
            </h2>
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-300 ml-1 block mb-2">Detailed Description</label>
              <RichTextEditor 
                value={formData.details}
                onChange={(value: string) => setFormData({...formData, details: value})}
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>

            <div className="space-y-6">
              <label className="text-sm font-bold text-slate-300 ml-1 block">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <ScaleIn key={skill}>
                    <span className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold flex items-center gap-2 group/skill hover:border-[#FF4D94]/50 transition-colors">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  </ScaleIn>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a required skill (e.g. Tailwind CSS)"
                    className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all placeholder:text-slate-600"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                </div>
                <button 
                  type="button"
                  onClick={addSkill}
                  className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-[#FF4D94] transition-all active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-12 pb-12">
            <button 
              type="button"
              className="w-full sm:w-auto px-10 py-4 text-slate-400 font-bold hover:text-white transition-colors"
            >
              Save as Draft
            </button>
            <button 
              type="submit"
              disabled={loading || (jobPostingLimitReached && !jobId)}
              className="w-full sm:w-auto px-12 py-4 gradient-bg text-white rounded-2xl font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  {jobId ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  {jobId ? "Update Job Post" : "Publish Job Post"}
                  <ChevronRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </FadeIn>
    </div>
  );
}
