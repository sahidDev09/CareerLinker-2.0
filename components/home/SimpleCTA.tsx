"use client";

import { ArrowRight, Zap } from "lucide-react";
import { FadeIn } from "@/components/shared/Motion";

export default function SimpleCTA() {
  return (
    <section className="container mx-auto px-4 py-24 mb-10">
      <div className="max-w-5xl mx-auto">
        <FadeIn direction="up">
          <div className="relative overflow-hidden bg-white rounded-[3.5rem] p-8 md:p-16 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-12 group transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.08)]">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff4d94]/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Join our network</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
                Ready to find your <br />
                <span className="text-[#ff4d94]">perfect career?</span>
              </h2>
              
              <p className="text-slate-500 text-lg max-w-md mx-auto md:mx-0">
                Create your profile today and start applying to the world&apos;s most innovative tech companies.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="px-10 py-5 bg-[#1A1A1A] text-white rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group">
                Sign Up Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[1.5rem] font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                Learn More
              </button>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-50 rounded-full blur-3xl opacity-60 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
