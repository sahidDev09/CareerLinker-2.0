"use client";

import Link from "next/link";
import Image from "next/image";
import { Briefcase, Github } from "lucide-react";
import { FadeIn } from "@/components/shared/Motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <FadeIn direction="up" className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg mb-6">
              <Briefcase size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to your account to continue</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <Link href="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <button className="w-full py-4 gradient-bg text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-[1.02] transition-transform">
              Sign In
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="mr-2" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                <Github size={18} className="mr-2" />
                GitHub
              </button>
            </div>
          </form>

          <p className="text-center text-slate-500 dark:text-slate-400 mt-10 text-sm">
            Don&apos;t have an account? <Link href="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
