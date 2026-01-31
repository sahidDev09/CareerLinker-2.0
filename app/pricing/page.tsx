"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, Rocket, ZapIcon, BarChart3, Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import pricingData from "@/data/pricing-plans.json";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  bgColor: string;
  isPopular?: boolean;
  buttonText: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Crown: <Crown className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  BarChart3: <BarChart3 className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
};


export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const role = (user?.publicMetadata?.role as "candidate" | "recruiter") || "candidate";
  const [userPackage, setUserPackage] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("package")
        .eq("id", user.id)
        .single();
      
      if (data && !error) {
        setUserPackage(data.package);
      }
    }
    
    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [user, isLoaded, supabase]);

  const plans = (role === "recruiter" ? pricingData.recruiter : pricingData.candidate) as PricingPlan[];

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff4d94]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-20 px-4">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff4d94]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ff4d94] text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Pricing Plans
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight flex justify-center gap-2">
              Simple, Transparent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d94] to-indigo-400">
                Pricing for Everyone
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Choose the perfect plan for your {role === "recruiter" ? "hiring needs" : "career journey"}. 
              No hidden fees, cancel anytime.
            </p>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard 
              key={plan.name} 
              plan={plan} 
              index={index} 
              isCurrent={userPackage?.toLowerCase() === plan.name.toLowerCase()}
              onSelect={async () => {
                if (plan.price === "$0") {
                  try {
                    const supabase = createClient();
                    const { error } = await supabase
                      .from("profiles")
                      .update({ package: plan.name.toLowerCase() })
                      .eq("id", user?.id);
                    
                    if (error) throw error;
                    
                    toast.success(`Successfully activated ${plan.name} plan!`);
                    router.push(`/dashboard/${role}`);
                  } catch (error) {
                    console.error("Error activating free plan:", error);
                    toast.error("Failed to activate plan. Please try again.");
                  }
                  return;
                }

                const searchParams = new URLSearchParams({
                  plan: plan.name,
                  price: plan.price,
                  role: role
                });
                router.push(`/pricing/payment?${searchParams.toString()}`);
              }}
            />
          ))}
        </div>

        {/* FAQ Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 font-medium">
            Have questions? <a href="#" className="text-[#ff4d94] hover:underline">Contact our support team</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function PricingCard({ 
  plan, 
  index, 
  isCurrent,
  onSelect 
}: { 
  plan: PricingPlan; 
  index: number; 
  isCurrent?: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={cn(
        "relative p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 border border-white/5 bg-white/5 hover:border-white/20 shadow-2xl backdrop-blur-md",
        index === 1 ? "md:scale-110 z-20 bg-white/[0.07] ring-2 ring-[#ff4d94]/30" : "md:scale-95 z-10",
        isCurrent && "border-[#ff4d94]/30"
      )}
    >
      {plan.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ff4d94] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-500/20">
          Most Popular
        </div>
      )}

      {/* Icon & Name */}
      <div className="flex items-center justify-between mb-8">
        <div className={cn("p-4 rounded-2xl", plan.bgColor, plan.color)}>
          {ICON_MAP[plan.icon]}
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-4xl font-black text-white">{plan.price}</span>
            {plan.price !== "$0" && <span className="text-slate-500 font-bold">/mo</span>}
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
        {plan.description}
      </p>

      {/* Features */}
      <div className="space-y-4 mb-10 flex-grow">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn("p-1 rounded-full", plan.bgColor)}>
              <Check className={cn("w-3 h-3", plan.color)} strokeWidth={3} />
            </div>
            <span className="text-slate-300 text-sm font-medium">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        disabled={isCurrent}
        onClick={onSelect}
        className={cn(
          "w-full py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 shadow-lg",
          isCurrent 
            ? "bg-[#FF4D94] text-white cursor-not-allowed border border-emerald-500/20"
            : plan.isPopular
              ? "bg-white/5 text-white hover:bg-white/10 border border-white/10"
              : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
        )}
      >
        {isCurrent ? "Current Plan" : plan.buttonText}
      </button>

      {/* Footer Decoration */}
      <div className="absolute bottom-4 right-8 opacity-5">
        <ZapIcon className="w-24 h-24 text-white" />
      </div>
    </motion.div>
  );
}
