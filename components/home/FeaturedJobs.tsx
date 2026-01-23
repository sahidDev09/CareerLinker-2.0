"use client";

import { FadeIn, StaggerContainer } from "@/components/shared/Motion";
import JobCard from "@/components/jobs/JobCard";

const featuredJobs = [
  {
    title: "Sneaker Designer",
    company: "Nike Indonesia",
    postedAt: "24 Mar 2024",
    salary: "$300/hr",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    bgColor: "bg-[#f9f5ff]",
    dotColor: "text-pink-400",
    appliedCount: 45,
    avatars: ["https://i.pravatar.cc/100?u=a", "https://i.pravatar.cc/100?u=b", "https://i.pravatar.cc/100?u=c"]
  },
  {
    title: "React Developer",
    company: "Mail Chip",
    postedAt: "12 Mar 2024",
    salary: "$420/hr",
    logoUrl: "https://www.edigitalagency.com.au/wp-content/uploads/new-mailchimp-logo-vertical-black.png",
    bgColor: "bg-[#f6fcf1]",
    dotColor: "text-red-400",
    appliedCount: 128,
    avatars: ["https://i.pravatar.cc/100?u=d", "https://i.pravatar.cc/100?u=e", "https://i.pravatar.cc/100?u=f"]
  },
  {
    title: "Product Designer",
    company: "Figma",
    postedAt: "26 Mar 2024",
    salary: "$213/hr",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    bgColor: "bg-[#fff9ed]",
    dotColor: "text-pink-400",
    appliedCount: 89,
    avatars: ["https://i.pravatar.cc/100?u=g", "https://i.pravatar.cc/100?u=h", "https://i.pravatar.cc/100?u=i"]
  },
  {
    title: "Senior Arkeolog",
    company: "Google Map",
    postedAt: "12 Mar 2024",
    salary: "$1200/hr",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg",
    bgColor: "bg-slate-50",
    dotColor: "text-pink-400",
    appliedCount: 12,
    avatars: ["https://i.pravatar.cc/100?u=j", "https://i.pravatar.cc/100?u=k", "https://i.pravatar.cc/100?u=l"]
  },
  {
    title: "Chef Leader",
    company: "Finder",
    postedAt: "08 Mar 2024",
    salary: "$862/hr",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Findercomau_logo.png",
    bgColor: "bg-[#fff5f5]",
    dotColor: "text-pink-400",
    appliedCount: 56,
    avatars: ["https://i.pravatar.cc/100?u=m", "https://i.pravatar.cc/100?u=n", "https://i.pravatar.cc/100?u=o"]
  },
  {
    title: "Cleaning Service",
    company: "Notion",
    postedAt: "24 Mar 2024",
    salary: "$80/hr",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    bgColor: "bg-[#f0fbff]",
    dotColor: "text-pink-400",
    appliedCount: 234,
    avatars: ["https://i.pravatar.cc/100?u=p", "https://i.pravatar.cc/100?u=q", "https://i.pravatar.cc/100?u=r"]
  },
];

export default function FeaturedJobs() {
  return (
    <section className="container mx-auto py-5">
      <div className="text-center mb-18">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-[#ff4d94]">Explore</span> Our Current Job Openings
        </h2>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredJobs.map((job, i) => (
          <FadeIn key={job.title} direction="up" delay={i * 0.1}>
            <JobCard {...job} variant="modern" />
          </FadeIn>
        ))}
      </StaggerContainer>
    </section>
  );
}
