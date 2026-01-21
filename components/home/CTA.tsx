"use client";

import { Search, UserCircle, Users, MessageSquare } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import { cn } from "@/lib/utils";

const resourceSteps = [
  {
    title: "Explore Opportunities",
    description: "Our platform is constantly updated with new roles, so check back regularly for the latest tech openings and industry resources.",
    icon: Search,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    shadowColor: "shadow-emerald-100",
  },
  {
    title: "Customize Your Profile",
    description: "Tailor your professional identity by highlighting skills and experiences that align with your career aspirations and goals.",
    icon: UserCircle,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
    shadowColor: "shadow-pink-100",
  },
  {
    title: "Engage with Recruiters",
    description: "Connect with hiring managers directly, share your experiences, and network with like-minded professionals in our community.",
    icon: Users,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    shadowColor: "shadow-orange-100",
  },
  {
    title: "Provide Feedback",
    description: "We value your input! Let us know what features or resources you'd like to see more of as we work to accommodate your needs.",
    icon: MessageSquare,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
    shadowColor: "shadow-indigo-100",
  },
];

export default function CTA() {
  return (
    <section className="container mx-auto">
      <div className="text-center mb-10">
        <FadeIn direction="up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            <span className="text-[#ff4d94]">How to Make</span> the Most of <br /> Our Career Platform
          </h2>
        </FadeIn>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
        {resourceSteps.map((step, i) => (
          <FadeIn key={step.title} direction="up" delay={i * 0.1}>
            <div className="bg-white/5 border-white/10 border p-10 rounded-[2.5rem] shadow-xl hover:bg-white/10 transition-all duration-300 flex flex-col items-start gap-6 group">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300",
                step.iconBg.replace('bg-', 'bg-').replace('50', '500/10'),
                step.shadowColor.replace('shadow-', 'shadow-').replace('100', '500/20')
              )}>
                <step.icon className={cn("w-7 h-7", step.iconColor)} strokeWidth={2.5} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">
                   {step.title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </StaggerContainer>
    </section>
  );
}
