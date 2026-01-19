"use client";

import { FadeIn } from "@/components/shared/Motion";
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  ArrowLeft,
  X,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PostJobPage() {
  const [skills, setSkills] = useState(["React", "Next.js", "TypeScript"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <FadeIn direction="up" className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/dashboard/employer" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight">Post a <span className="text-indigo-600">New Job</span></h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Reach thousands of talented professionals today.</p>
          </div>
        </div>

        <form className="space-y-12">
          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-8">
            <h2 className="text-xl font-bold flex items-center">
              <Briefcase size={20} className="mr-3 text-indigo-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Product Designer"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Type</label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. San Francisco, Remote"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. $120k - $150k"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-8">
            <h2 className="text-xl font-bold flex items-center">
              <FileText size={20} className="mr-3 text-indigo-600" />
              Job Description
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
              <textarea 
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold flex items-center">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-indigo-800">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Tailwind CSS"
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button 
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button className="px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
              Save as Draft
            </button>
            <button className="px-12 py-4 gradient-bg text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform">
              Publish Job Post
            </button>
          </div>
        </form>
      </FadeIn>
    </div>
  );
}
