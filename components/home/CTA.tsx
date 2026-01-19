"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function CTA() {
  return (
    <section className="container mx-auto px-4 md:px-6">
      <div className="relative p-10 md:p-20 rounded-[3rem] overflow-hidden">
        <div className="absolute inset-0 gradient-bg -z-10"></div>
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Briefcase size={300} className="text-white" />
        </div>
        
        <div className="max-w-2xl text-white space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Ready to take the next step in your career?
          </h2>
          <p className="text-xl text-indigo-100 opacity-90 leading-relaxed">
            Create your profile today and start applying to the best companies in the industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/signup" 
              className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-center hover:bg-indigo-50 transition-colors shadow-xl"
            >
              Create Account
            </Link>
            <Link 
              href="/post-job" 
              className="px-10 py-5 bg-indigo-700/50 text-white border border-white/20 rounded-2xl font-bold text-center hover:bg-indigo-700/70 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
