"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, PartyPopper, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(true);
  
  const plan = searchParams.get("plan");
  const role = searchParams.get("role");

  useEffect(() => {
    async function updatePlan() {
      if (isLoaded && user && plan) {
        const supabase = createClient();
        const { error } = await supabase
          .from("profiles")
          .update({ package: plan.toLowerCase() })
          .eq("id", user.id);
        
        if (error) {
          console.error("Error updating plan:", error);
        }
        setIsUpdating(false);
      }
    }

    updatePlan();
  }, [isLoaded, user, plan]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff4d94]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-12 rounded-[3rem] bg-white/[0.07] border border-white/10 shadow-2xl backdrop-blur-xl text-center relative z-10"
      >
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 mx-auto relative">
          <PartyPopper className="w-12 h-12 text-emerald-500" />
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <h1 className="text-4xl font-black text-white mb-4">You&apos;re All Set!</h1>
        <p className="text-slate-400 mb-8 font-medium">
          Thank you for choosing the <span className="text-[#ff4d94] font-bold">{plan}</span> plan. 
          Your account features have been upgraded successfully.
        </p>

        {isUpdating ? (
          <div className="flex items-center justify-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating your profile...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs mb-8">
            <CheckCircle2 className="w-4 h-4" />
            Profile Updated
          </div>
        )}

        <button
          onClick={() => router.push(`/dashboard/${role || 'candidate'}`)}
          className="w-full py-5 rounded-2xl bg-white text-black font-black text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#ff4d94]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
