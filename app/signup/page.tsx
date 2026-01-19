"use client";

import Link from "next/link";
import { Briefcase, User, Building2, CheckCircle2 } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/shared/Motion";
import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState<"candidate" | "employer">("candidate");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <FadeIn direction="up" className="w-full max-w-xl">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200 dark:shadow-none p-10 md:p-12 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
              <Briefcase size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Join CareerLinker and start your journey</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setRole("candidate")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                role === "candidate" 
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                  : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "candidate" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-700 text-slate-400"}`}>
                <User size={20} />
              </div>
              <span className={`text-sm font-bold ${role === "candidate" ? "text-indigo-600" : "text-slate-500"}`}>Candidate</span>
            </button>
            <button 
              onClick={() => setRole("employer")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                role === "employer" 
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                  : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "employer" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-700 text-slate-400"}`}>
                <Building2 size={20} />
              </div>
              <span className={`text-sm font-bold ${role === "employer" ? "text-indigo-600" : "text-slate-500"}`}>Employer</span>
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-start space-x-3 py-2">
              <div className="mt-1">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                By creating an account, you agree to our <Link href="#" className="text-indigo-600 font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <button className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] transition-transform">
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-10 text-sm">
            Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
