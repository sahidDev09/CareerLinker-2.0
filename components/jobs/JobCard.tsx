"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Clock, DollarSign, Briefcase, Bookmark, ExternalLink, MoreHorizontal, ArrowRight, Trash2 } from "lucide-react";
import { cn, formatSalary, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface JobCardProps {
  title: string;
  company: string;
  location?: string;
  type?: string;
  salary: string;
  postedAt: string;
  workingType?: string;
  logoUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  variant?: "default" | "modern";
  bgColor?: string;
  dotColor?: string;
  appliedCount?: number;
  avatars?: string[];
  isSaved?: boolean;
  onBookmarkToggle?: () => void;
  isBookmarking?: boolean;
  onDelete?: () => void;
  id: string;
}

export default function JobCard({
  title,
  company,
  location,
  type,
  salary,
  postedAt,
  workingType,
  logoUrl,
  tags = [],
  isFeatured = false,
  variant = "default",
  bgColor,
  dotColor,
  appliedCount = 0,
  avatars = [],
  isSaved = false,
  onBookmarkToggle,
  isBookmarking = false,
  onDelete,
  id,
}: JobCardProps) {
  if (variant === "modern") {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative p-8 rounded-[2rem] flex flex-col h-full transition-all duration-300 border border-white/5 hover:border-white/20 shadow-xl",
          bgColor ? "bg-white/10" : "bg-white/5"
        )}
      >
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmarkToggle?.();
            }}
            disabled={isBookmarking}
            className={cn(
              "transition-all duration-300",
              isSaved ? "text-[#ff4d94] fill-[#ff4d94]" : "text-white/70 hover:text-[#ff4d94]",
              isBookmarking && "opacity-50 cursor-wait"
            )}
          >
            <Bookmark 
              size={24} 
              strokeWidth={1.5} 
              className={cn(isSaved && "fill-current")}
            />
          </button>
          {onDelete ? (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-full"
            >
              <Trash2 size={20} />
            </button>
          ) : (
            <div className={cn(dotColor || "text-[#ff4d94]")}>
               <MoreHorizontal size={28} />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-8 flex-grow">
          <h3 className="text-2xl font-bold text-white leading-[1.1] tracking-tight">
            {title}
          </h3>
        </div>

        {/* Salary and Arrow */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-slate-400 text-lg font-medium">{formatSalary(salary)}</span>
            <div className="flex gap-2 mt-1">
              {workingType && (
                <span className="text-[10px] bg-[#ff4d94]/10 px-2 py-0.5 rounded text-[#ff4d94] uppercase font-bold tracking-wider border border-[#ff4d94]/20">
                  {workingType}
                </span>
              )}
              {type && (
                <span className="text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400 uppercase font-bold tracking-wider border border-indigo-500/20">
                  {type}
                </span>
              )}
            </div>
          </div>
          <div className="hover:translate-x-1 transition-transform cursor-pointer">
            <ArrowRight size={22} className="text-white" />
          </div>
        </div>

        {/* Applied Count & Avatars */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((avatar, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 overflow-hidden relative shadow-sm">
                <Image src={avatar} alt="avatar" fill className="object-cover" />
              </div>
            ))}
            {appliedCount > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-black bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                {appliedCount}+
              </div>
            )}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {appliedCount > 0 ? `${appliedCount}+ Applied` : 'Be the first to apply'}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/10 shadow-sm relative">
              {logoUrl ? (
                <Image src={logoUrl} alt={company} fill className="object-contain p-2" />
              ) : (
                <Briefcase size={22} className="text-slate-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[0.95rem] font-bold text-white leading-none mb-1.5">{company}</span>
              <span className="text-[0.8rem] text-slate-500 font-medium">{formatRelativeTime(postedAt)}</span>
            </div>
          </div>
          <Link 
            href={`/jobs/${id}`}
            className="bg-[#ff4d94] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#ff3385] transition-all hover:shadow-lg hover:shadow-pink-500/20"
          >
            View
          </Link>
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
          ? "bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5" 
          : "bg-white/5 border-white/10 hover:border-indigo-500/30 shadow-sm hover:shadow-xl"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-slate-400 overflow-hidden border border-white/10 relative">
            {logoUrl ? (
              <Image src={logoUrl} alt={company} fill className="object-contain p-2" />
            ) : (
              <Briefcase size={24} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            <p className="text-slate-500 text-sm font-medium">{company}</p>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBookmarkToggle?.();
          }}
          disabled={isBookmarking}
          className={cn(
            "transition-all duration-300",
            isSaved ? "text-[#ff4d94]" : "text-slate-500 hover:text-indigo-400",
            isBookmarking && "opacity-50 cursor-wait"
          )}
        >
          <Bookmark 
            size={20} 
            className={cn(isSaved && "fill-current text-[#ff4d94]")}
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {location && (
          <div className="flex items-center text-sm text-slate-400">
            <MapPin size={16} className="mr-1.5 text-slate-500" />
            {location}
          </div>
        )}
        {type && (
          <div className="flex items-center text-sm text-slate-400">
            <Clock size={16} className="mr-1.5 text-indigo-400" />
            {type}
          </div>
        )}
        {workingType && (
          <div className="flex items-center text-sm text-slate-400">
            <Briefcase size={16} className="mr-1.5 text-[#ff4d94]" />
            {workingType}
          </div>
        )}
        <div className="flex items-center text-sm text-slate-400">
          <DollarSign size={16} className="mr-1.5 text-slate-500" />
          {formatSalary(salary)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-medium border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <span className="text-xs text-slate-500 font-medium">Posted {formatRelativeTime(postedAt)}</span>
        <Link 
          href={`/jobs/${id}`}
          className="flex items-center text-sm font-bold text-indigo-400 group-hover:underline"
        >
          View Details
          <ExternalLink size={14} className="ml-1.5" />
        </Link>
      </div>
    </motion.div>
  );
}
