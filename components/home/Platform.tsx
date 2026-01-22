"use client";

import { Search, UserCircle, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const resourceSteps = [
  {
    title: "Explore Opportunities",
    description: "Our platform is constantly updated with new roles, so check back regularly for the latest tech openings and industry resources.",
    icon: Search,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    shadowColor: "shadow-emerald-500/20",
  },
  {
    title: "Customize Your Profile",
    description: "Tailor your professional identity by highlighting skills and experiences that align with your career aspirations and goals.",
    icon: UserCircle,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    shadowColor: "shadow-pink-500/20",
  },
  {
    title: "Engage with Recruiters",
    description: "Connect with hiring managers directly, share your experiences, and network with like-minded professionals in our community.",
    icon: Users,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    shadowColor: "shadow-orange-500/20",
  },
  {
    title: "Provide Feedback",
    description: "We value your input! Let us know what features or resources you'd like to see more of as we work to accommodate your needs.",
    icon: MessageSquare,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
    shadowColor: "shadow-indigo-500/20",
  },
];

export default function CTA() {
  return (
    <section className="container mx-auto py-24 overflow-hidden">
      <div className="text-center mb-16">
        <h2 
          className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]"
        >
          <span className="text-[#ff4d94]">How to Make</span> the Most of <br /> Our Career Platform
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto ">
        {resourceSteps.map((step) => (
          <div 
            key={step.title} 
            className="bg-white/[0.03] border-white/10 border p-10 rounded-[2.5rem] shadow-2xl hover:bg-white/[0.08] transition-all duration-500 flex flex-col items-start gap-8 group cursor-default"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg]",
              step.iconBg,
              step.shadowColor
            )}>
              <step.icon className={cn("w-8 h-8", step.iconColor)} strokeWidth={2} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white tracking-tight">
                 {step.title}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
