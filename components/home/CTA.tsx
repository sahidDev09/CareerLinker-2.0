"use client";

import { ArrowRight, Zap } from "lucide-react";
import { FadeIn } from "@/components/shared/Motion";

export default function SimpleCTA() {
  return (
    <section className="container mx-auto">
      <div className="mx-auto">
        <FadeIn direction="up">
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-8 md:p-16 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 group transition-all duration-500 hover:border-white/20">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white text-sm font-bold uppercase tracking-widest border border-white/5 overflow-hidden">
                <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                <span>Join our network</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Ready to find your <br />
                <span className="text-[#ff4d94]">perfect career?</span>
              </h2>
              
              <p className="text-slate-400 text-xl font-medium max-w-md mx-auto md:mx-0">
                Create your profile today and start applying to the world&apos;s most innovative tech companies.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-5 w-full md:w-auto">
              <button className="px-10 py-5 bg-[#ff4d94] text-white rounded-[1.5rem] font-black text-lg hover:bg-[#ff3385] transition-all shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group">
                Sign Up Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white/5 text-white border-2 border-white/10 rounded-[1.5rem] font-extrabold text-lg hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm">
                Learn More
              </button>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-700" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
