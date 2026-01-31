"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Star, Crown, Rocket, ZapIcon, CreditCard, Mail, Bell, Headphones, Users, LayoutDashboard, BarChart3, MessageSquare, Bot, UserCheck } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isPopular?: boolean;
  buttonText: string;
}

const candidatePlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Best for new users exploring the platform",
    icon: <Rocket className="w-8 h-8" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    features: [
      "5 credits (one-time)",
      "Browse jobs",
      "Save jobs",
      "Limited job applications",
      "Basic profile visibility",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Standard",
    price: "$19",
    description: "For active job seekers",
    icon: <Zap className="w-8 h-8" />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    isPopular: true,
    features: [
      "50 credits / month",
      "Easy Apply",
      "Direct email to recruiters",
      "Profile boost (standard)",
      "Job alerts",
      "24/7 support",
    ],
    buttonText: "Go Standard",
  },
  {
    name: "Premium",
    price: "$49",
    description: "For serious & fast job seekers",
    icon: <Crown className="w-8 h-8" />,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    features: [
      "Unlimited credits",
      "Connect directly with recruiters",
      "High-priority applications",
      "Profile highlighted",
      "Top listed jobs access",
      "Early access to new postings",
      "24/7 VIP support",
    ],
    buttonText: "Go Premium",
  },
];

const recruiterPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "For small companies or first-time recruiters",
    icon: <Users className="w-8 h-8" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    features: [
      "Post 5 job",
      "View limited profiles",
      "Basic applicant tracking",
      "Standard job visibility",
      "Email support",
    ],
    buttonText: "Start Hiring",
  },
  {
    name: "Standard",
    price: "$15",
    description: "For growing teams",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    isPopular: true,
    features: [
      "Post up to 10 jobs / month",
      "Access to candidate database",
      "Shortlist & save candidates",
      "Direct message candidates",
      "Standard job promotion",
      "Basic analytics",
      "24/7 support",
    ],
    buttonText: "Upgrade Teams",
  },
  {
    name: "Premium",
    price: "$49",
    description: "For agencies & high-volume hiring",
    icon: <Shield className="w-8 h-8" />,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    features: [
      "Unlimited job postings",
      "Full database access",
      "Priority job listings",
      "Featured company profile",
      "Direct chat & email",
      "Advanced analytics & reports",
      "AI recommendations",
      "Dedicated account manager",
      "24/7 VIP support",
    ],
    buttonText: "Go Premium",
  },
];

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as "candidate" | "recruiter") || "candidate";

  const plans = role === "recruiter" ? recruiterPlans : candidatePlans;

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
            <PricingCard key={plan.name} plan={plan} index={index} />
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

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={cn(
        "relative p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 border border-white/5 bg-white/5 hover:border-white/20 shadow-2xl",
        plan.isPopular && "ring-2 ring-[#ff4d94]/50 scale-105 md:scale-110 z-20 bg-white/[0.07]"
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
          {plan.icon}
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
        className={cn(
          "w-full py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 shadow-lg",
          plan.isPopular
            ? "bg-[#ff4d94] text-white hover:bg-[#ff3385] shadow-pink-500/20 hover:shadow-pink-500/30"
            : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
        )}
      >
        {plan.buttonText}
      </button>

      {/* Footer Decoration */}
      <div className="absolute bottom-4 right-8 opacity-5">
        <ZapIcon className="w-24 h-24 text-white" />
      </div>
    </motion.div>
  );
}
