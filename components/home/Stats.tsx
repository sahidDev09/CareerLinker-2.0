"use client";

import { Briefcase, Users, Building2, TrendingUp } from "lucide-react";
import { StaggerContainer, ScaleIn } from "@/components/shared/Motion";

const stats = [
  { label: "Active Jobs", value: "12,450+", icon: Briefcase },
  { label: "Companies", value: "850+", icon: Building2 },
  { label: "Job Seekers", value: "45,000+", icon: Users },
  { label: "Avg. Hiring Time", value: "14 Days", icon: TrendingUp },
];

export default function Stats() {
  return (
    <section className="container mx-auto">
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <ScaleIn key={stat.label} delay={i * 0.1}>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-2 hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-400">{stat.label}</div>
            </div>
          </ScaleIn>
        ))}
      </StaggerContainer>
    </section>
  );
}
