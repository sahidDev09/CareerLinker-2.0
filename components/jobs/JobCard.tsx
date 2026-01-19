"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase, Bookmark, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  logoUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
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
}: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group p-6 rounded-2xl border transition-all duration-300",
        isFeatured 
          ? "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800" 
          : "bg-white border-slate-200 hover:border-indigo-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-700 shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
            {logoUrl ? (
              <img src={logoUrl} alt={company} className="w-full h-full object-contain p-2" />
            ) : (
              <Briefcase size={24} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{company}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={16} className="mr-1.5 text-slate-400" />
          {location}
        </div>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <Clock size={16} className="mr-1.5 text-slate-400" />
          {type}
        </div>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <DollarSign size={16} className="mr-1.5 text-slate-400" />
          {salary}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Posted {postedAt}</span>
        <button className="flex items-center text-sm font-bold text-indigo-600 group-hover:underline">
          View Details
          <ExternalLink size={14} className="ml-1.5" />
        </button>
      </div>
    </motion.div>
  );
}
