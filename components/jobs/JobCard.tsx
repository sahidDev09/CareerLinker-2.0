"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase, Bookmark, ExternalLink, MoreHorizontal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  title: string;
  company: string;
  location?: string;
  type?: string;
  salary: string;
  postedAt: string;
  logoUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  variant?: "default" | "modern";
  bgColor?: string;
  dotColor?: string;
  appliedCount?: number;
  avatars?: string[];
}

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
  postedAt,
  logoUrl,
  tags = [],
  isFeatured = false,
  variant = "default",
  bgColor,
  dotColor,
  appliedCount = 0,
  avatars = [],
}: JobCardProps) {
  if (variant === "modern") {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative p-8 rounded-[2rem] flex flex-col h-full transition-all duration-300 border border-transparent hover:border-slate-200 shadow-sm",
          bgColor || "bg-white"
        )}
      >
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-5">
          <button className="text-slate-900 hover:text-pink-500 transition-colors">
            <Bookmark size={24} strokeWidth={1.5} />
          </button>
          <div className={cn(dotColor || "text-[#ff4d94]")}>
             <MoreHorizontal size={28} />
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 flex-grow">
          <h3 className="text-2xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            {title}
          </h3>
        </div>

        {/* Salary and Arrow */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-500 text-lg font-medium">{salary}</span>
          <div className="hover:translate-x-1 transition-transform cursor-pointer">
            <ArrowRight size={22} className="text-slate-900" />
          </div>
        </div>

        {/* Applied Count & Avatars */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((avatar, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative shadow-sm">
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
            ))}
            {appliedCount > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                {appliedCount}+
              </div>
            )}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {appliedCount > 0 ? `${appliedCount}+ Applied` : 'Be the first to apply'}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
              {logoUrl ? (
                <img src={logoUrl} alt={company} className="w-full h-full object-contain p-2" />
              ) : (
                <Briefcase size={22} className="text-slate-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[0.95rem] font-bold text-slate-800 leading-none mb-1.5">{company}</span>
              <span className="text-[0.8rem] text-slate-400 font-medium">{postedAt}</span>
            </div>
          </div>
          <button className="bg-[#ff4d94] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#ff3385] transition-all hover:shadow-lg hover:shadow-pink-200">
            View
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group p-6 rounded-2xl border transition-all duration-300",
        isFeatured 
          ? "bg-indigo-50/50 border-indigo-200" 
          : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200/50">
            {logoUrl ? (
              <img src={logoUrl} alt={company} className="w-full h-full object-contain p-2" />
            ) : (
              <Briefcase size={24} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-slate-500 text-sm font-medium">{company}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {location && (
          <div className="flex items-center text-sm text-slate-500">
            <MapPin size={16} className="mr-1.5 text-slate-400" />
            {location}
          </div>
        )}
        {type && (
          <div className="flex items-center text-sm text-slate-500">
            <Clock size={16} className="mr-1.5 text-slate-400" />
            {type}
          </div>
        )}
        <div className="flex items-center text-sm text-slate-500">
          <DollarSign size={16} className="mr-1.5 text-slate-400" />
          {salary}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-medium">Posted {postedAt}</span>
        <button className="flex items-center text-sm font-bold text-indigo-600 group-hover:underline">
          View Details
          <ExternalLink size={14} className="ml-1.5" />
        </button>
      </div>
    </motion.div>
  );
}
