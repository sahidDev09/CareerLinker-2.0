"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { FadeIn, ScaleIn } from "@/components/shared/Motion";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Github,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Info } from "lucide-react";

type Experience = {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

type Education = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const { user, isLoaded } = useUser();


  const [profile, setProfile] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    location: "",
    availability: "",
    skills: [] as string[],
    experiences: [] as Experience[],
    education: [] as Education[],
    certifications: [] as string[],
    awards: [] as string[],
    projects: [] as Project[],
    resume: null as File | null,
    resumeUrl: "",
    imageUrl: user?.imageUrl || "",
  });

  
  // Fetch initial data
  useEffect(() => {
    async function fetchProfile() {
      if (!isLoaded || !user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is 'no rows found'
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data");
        } else if (data) {
          setProfile({
            name: data.name || user.fullName || "",
            email: data.email || user.primaryEmailAddress?.emailAddress || "",
            location: data.location || "",
            availability: data.availability || "",
            skills: data.skills || [],
            experiences: data.experiences || [],
            education: data.education || [],
            certifications: data.certifications || [],
            awards: data.awards || [],
            projects: data.projects || [],
            resume: null,
            resumeUrl: data.resume_url || "",
            imageUrl: data.image_url || user.imageUrl || "",
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, isLoaded, supabase]);

  // Sync Clerk data if state is empty and user is loaded
  useEffect(() => {
    if (isLoaded && user && !profile.name) {
      setProfile(prev => ({
        ...prev,
        name: prev.name || user.fullName || "",
        email: prev.email || user.primaryEmailAddress?.emailAddress || "",
        imageUrl: prev.imageUrl || user.imageUrl || "",
      }));
    }
  }, [isLoaded, user, profile.name]);
  
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingResume(true);
    try {
      const fileExt = 'pdf';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('resume')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resume')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, resumeUrl: publicUrl, resume: file }));
      toast.success("Resume uploaded! Save changes to persist.");
    } catch (error: unknown) {
      console.error("Error uploading resume:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload resume";
      toast.error(errorMessage);
    } finally {
      setUploadingResume(false);
    }
  };


  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: profile.name,
          email: profile.email,
          location: profile.location,
          availability: profile.availability,
          skills: profile.skills,
          experiences: profile.experiences,
          education: profile.education,
          certifications: profile.certifications,
          awards: profile.awards,
          projects: profile.projects,
          image_url: profile.imageUrl,
          resume_url: profile.resumeUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Error saving profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save profile";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };


  // Calculate progress
  const progress = useMemo(() => {
    const totalFields = 9;
    let filledFields = 0;

    if (profile.name) filledFields++;
    if (profile.skills.length > 0) filledFields++;
    if (profile.experiences.length > 0) filledFields++;
    if (profile.education.length > 0) filledFields++;
    if (profile.certifications.length > 0) filledFields++;
    if (profile.awards.length > 0) filledFields++;
    if (profile.projects.length > 0) filledFields++;
    if (profile.resumeUrl) filledFields++;
    if (profile.imageUrl) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }, [profile]);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Zap },
    { id: "awards", label: "Awards & Certs", icon: Award },
    { id: "resume", label: "Resume", icon: FileText },
  ];

  const handleAddField = (field: 'experiences' | 'education' | 'projects' | 'skills') => {
    if (field === 'skills') {
      const skill = prompt("Enter new skill:");
      if (skill) setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      return;
    }

    const newItem = field === 'experiences' 
      ? { id: Date.now().toString(), role: "New Role", company: "New Company", duration: "2024 - Present", description: "" }
      : field === 'education'
      ? { id: Date.now().toString(), school: "New School", degree: "New Degree", year: "2024" }
      : { id: Date.now().toString(), name: "New Project", description: "", link: "" };

    setProfile(prev => ({
      ...prev,
      [field]: [...(prev[field] as (Experience | Education | Project)[]), newItem]
    }));
  };

  const handleRemoveField = (field: 'experiences' | 'education' | 'projects' | 'skills', id: string) => {
    if (field === 'skills') {
      setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== id) }));
      return;
    }
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] as { id: string }[]).filter((item) => item.id !== id)
    }));
  };

  const handleUpdateField = (field: 'experiences' | 'education' | 'projects', id: string, key: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] as (Experience | Education | Project)[]).map((item) => 
        item.id === id ? { ...item, [key]: value } : item
      ) as (Experience[] | Education[] | Project[])
    }));
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF4D94] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <FadeIn direction="up">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FF4D94] font-bold mb-2">
              <Link href="/dashboard/candidate" className="hover:underline flex items-center gap-1">
                Dashboard <ChevronRight size={14} />
              </Link>
              <span>Profile Settings</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Edit <span className="gradient-text">Profile</span></h1>
            <p className="text-slate-400">Keep your profile updated to attract better opportunities.</p>
          </div>
          
          <div className="glass p-6 rounded-2xl w-full md:w-80">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-slate-400 font-medium">Completion Progress</span>
              <span className="font-bold text-[#FF4D94]">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-[#FF4D94] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,77,148,0.4)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-3 sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === tab.id 
                    ? "bg-[#FF4D94] text-white shadow-lg shadow-[#FF4D94]/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2 text-sm">
                <Sparkles size={16} />
                <span>AI Profile Tip</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add at least 3 highlighted projects to increase your visibility to recruiters by 40%.
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="glass rounded-[2rem] p-8 md:p-10 min-h-[600px]">
            {activeTab === 'basic' && (
              <FadeIn direction="right" className="space-y-8">
                {/* Information Alert */}
                <div className="flex items-start gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                  <Info className="text-indigo-400 mt-0.5 shrink-0" size={20} />
                  <div className="space-y-1">
                    <p className="font-bold text-indigo-400 text-sm">Profile Sync Notice</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your <strong>full name</strong> and <strong>profile picture</strong> are managed through your account settings. 
                      Changes made there will reflect here automatically.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/10">
                  <div className="relative group">
                    <div 
                      className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center overflow-hidden border-2 border-white/10 group-hover:border-indigo-500/30 transition-all relative"
                    >
                      {profile.imageUrl ? (
                        <Image 
                          src={profile.imageUrl} 
                          alt="Profile" 
                          width={128} 
                          height={128} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-slate-500 translate-y-1">
                          <User size={48} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                        <Info className="text-white" size={32} />
                      </div>
                    </div>
                    {/* Image upload input removed - managed by Clerk */}
                    <div className="absolute -bottom-2 -right-2 bg-indigo-500 p-2 rounded-xl text-white shadow-lg pointer-events-none">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold">Account Identity</h3>
                    <p className="text-slate-400 text-sm mt-1">Managed via Clerk User Management</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 opacity-80">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-sm font-bold text-slate-400">Full Name</label>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Sync with Clerk</span>
                    </div>
                    <input 
                      type="text" 
                      value={profile.name} 
                      readOnly
                      className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none cursor-not-allowed selection:bg-indigo-500/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 px-1">Location</label>
                    <input 
                      type="text" 
                      value={profile.location} 
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#FF4D94]/50 focus:ring-1 focus:ring-[#FF4D94]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 px-1">Availability</label>
                    <select 
                      value={profile.availability}
                      onChange={(e) => setProfile({...profile, availability: e.target.value})}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#FF4D94]/50 focus:ring-1 focus:ring-[#FF4D94]/50 transition-all appearance-none"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="1 month notice">1 month notice</option>
                      <option value="2 months notice">2 months notice</option>
                      <option value="Not looking">Not looking</option>
                    </select>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === 'skills' && (
              <FadeIn direction="right" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Technical Skills</h3>
                  <button 
                    onClick={() => handleAddField('skills')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF4D94]/10 text-[#FF4D94] rounded-xl font-bold hover:bg-[#FF4D94]/20 transition-all"
                  >
                    <Plus size={18} /> Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill) => (
                    <ScaleIn key={skill}>
                      <div className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#FF4D94]/50 transition-all">
                        <span className="font-medium">{skill}</span>
                        <button 
                          onClick={() => handleRemoveField('skills', skill)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </ScaleIn>
                  ))}
                </div>
              </FadeIn>
            )}

            {activeTab === 'experience' && (
              <FadeIn direction="right" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Work Experience</h3>
                  <button 
                    onClick={() => handleAddField('experiences')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF4D94]/10 text-[#FF4D94] rounded-xl font-bold hover:bg-[#FF4D94]/20 transition-all"
                  >
                    <Plus size={18} /> Add Experience
                  </button>
                </div>
                <div className="space-y-6">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 group relative">
                      <button 
                        onClick={() => handleRemoveField('experiences', exp.id)}
                        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                          <input 
                            type="text" 
                            value={exp.role} 
                            onChange={(e) => handleUpdateField('experiences', exp.id, 'role', e.target.value)}
                            placeholder="e.g. Senior Developer"
                            className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                          <input 
                            type="text" 
                            value={exp.company} 
                            onChange={(e) => handleUpdateField('experiences', exp.id, 'company', e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                          <input 
                            type="text" 
                            value={exp.duration} 
                            onChange={(e) => handleUpdateField('experiences', exp.id, 'duration', e.target.value)}
                            placeholder="e.g. 2022 - Present"
                            className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                        <textarea 
                          value={exp.description} 
                          onChange={(e) => handleUpdateField('experiences', exp.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all min-h-[80px] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {activeTab === 'education' && (
              <FadeIn direction="right" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Education</h3>
                  <button 
                    onClick={() => handleAddField('education')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF4D94]/10 text-[#FF4D94] rounded-xl font-bold hover:bg-[#FF4D94]/20 transition-all"
                  >
                    <Plus size={18} /> Add Education
                  </button>
                </div>
                <div className="space-y-6">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 group relative">
                      <button 
                        onClick={() => handleRemoveField('education', edu.id)}
                        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Institution</label>
                          <input 
                            type="text" 
                            value={edu.school} 
                            onChange={(e) => handleUpdateField('education', edu.id, 'school', e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Degree</label>
                          <input 
                            type="text" 
                            value={edu.degree} 
                            onChange={(e) => handleUpdateField('education', edu.id, 'degree', e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                          <input 
                            type="text" 
                            value={edu.year} 
                            onChange={(e) => handleUpdateField('education', edu.id, 'year', e.target.value)}
                            placeholder="e.g. 2021"
                            className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {activeTab === 'projects' && (
              <FadeIn direction="right" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Highlighted Projects</h3>
                  <button 
                    onClick={() => handleAddField('projects')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF4D94]/10 text-[#FF4D94] rounded-xl font-bold hover:bg-[#FF4D94]/20 transition-all"
                  >
                    <Plus size={18} /> Add Project
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 group relative">
                      <button 
                        onClick={() => handleRemoveField('projects', project.id)}
                        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          value={project.name} 
                          onChange={(e) => handleUpdateField('projects', project.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#FF4D94] outline-none transition-all font-bold text-xl"
                          placeholder="Project Name"
                        />
                        <textarea 
                          value={project.description}
                          onChange={(e) => handleUpdateField('projects', project.id, 'description', e.target.value)}
                          className="w-full bg-transparent text-slate-400 text-sm h-20 resize-none outline-none focus:text-white transition-colors"
                          placeholder="Describe your role and impact..."
                        />
                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                          <Github size={16} />
                          <input 
                            type="text" 
                            value={project.link} 
                            onChange={(e) => handleUpdateField('projects', project.id, 'link', e.target.value)}
                            placeholder="github.com/..."
                            className="bg-transparent outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {activeTab === 'awards' && (
              <FadeIn direction="right" className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Certifications</h3>
                    <button 
                      onClick={() => {
                        const cert = prompt("Enter certification name:");
                        if (cert) setProfile(prev => ({ ...prev, certifications: [...prev.certifications, cert] }));
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF4D94]/10 text-[#FF4D94] rounded-xl font-bold hover:bg-[#FF4D94]/20 transition-all"
                    >
                      <Plus size={18} /> Add Certification
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.certifications.map((cert) => (
                      <div key={cert} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center">
                            <Award size={20} />
                          </div>
                          <span className="font-medium">{cert}</span>
                        </div>
                        <button 
                          onClick={() => setProfile(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }))}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Awards & Honors</h3>
                    <button 
                      onClick={() => {
                        const award = prompt("Enter award name:");
                        if (award) setProfile(prev => ({ ...prev, awards: [...prev.awards, award] }));
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF4D94]/10 text-[#FF4D94] rounded-xl font-bold hover:bg-[#FF4D94]/20 transition-all"
                    >
                      <Plus size={18} /> Add Award
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.awards.map((award) => (
                      <div key={award} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={20} />
                          </div>
                          <span className="font-medium">{award}</span>
                        </div>
                        <button 
                          onClick={() => setProfile(prev => ({ ...prev, awards: prev.awards.filter(a => a !== award) }))}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === 'resume' && (
              <FadeIn direction="right" className="space-y-8">
                <h3 className="text-2xl font-bold">Resume & Documents</h3>
                
                <div 
                  className={`border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all group cursor-pointer ${
                    profile.resumeUrl ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 hover:border-[#FF4D94]/30'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 ${
                    profile.resumeUrl ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#FF4D94]/10 text-[#FF4D94]'
                  }`}>
                    <FileText size={40} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">
                    {profile.resumeUrl ? "Resume Uploaded" : "Upload your resume"}
                  </h4>
                  <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    Recruiters favor candidates with complete, professional resumes. Upload in PDF format.
                  </p>
                  
                  <label className="px-8 py-4 bg-[#FF4D94] text-white rounded-2xl font-bold shadow-lg shadow-[#FF4D94]/20 hover:shadow-[#FF4D94]/40 transition-all hover:-translate-y-1 inline-block cursor-pointer disabled:opacity-50">
                    {uploadingResume ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    ) : (
                      profile.resumeUrl ? "Replace Resume" : "Choose File"
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf"
                      disabled={uploadingResume}
                      onChange={handleResumeUpload} 
                    />
                  </label>
                </div>

                {profile.resumeUrl && (
                  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-white">Current Resume</div>
                        <Link 
                          href={profile.resumeUrl} 
                          target="_blank" 
                          className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-1"
                        >
                          View Document <ChevronRight size={10} />
                        </Link>
                      </div>
                    </div>
                    <button 
                      onClick={() => setProfile({...profile, resumeUrl: "", resume: null})}
                      className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </FadeIn>
            )}
            
            <div className="mt-12 pt-8 border-t border-white/10 flex justify-end gap-4">
              <button className="px-8 py-3 rounded-2xl font-bold text-slate-400 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-10 py-4 bg-white text-black rounded-2xl font-bold shadow-xl hover:bg-slate-100 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={20} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
