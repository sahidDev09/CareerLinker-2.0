"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Building2, 
  Search, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  TrendingUp,
  Star,
  Globe,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerContainer, ScaleIn } from "@/components/shared/Motion";

interface Job {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  location: string;
  type: string;
  working_type: string;
  status: string;
}

interface Company {
  name: string;
  logo: string;
  jobCount: number;
  locations: string[];
  types: string[];
  openJobs: Job[];
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('id, title, company_name, company_logo, location, type, working_type, status')
          .eq('status', 'active');

        if (error) throw error;

        // Group jobs by company
        const companyMap = new Map<string, Company>();

        jobs?.forEach((job: Job) => {
          if (!companyMap.has(job.company_name)) {
            companyMap.set(job.company_name, {
              name: job.company_name,
              logo: job.company_logo,
              jobCount: 0,
              locations: [],
              types: [],
              openJobs: []
            });
          }

          const comp = companyMap.get(job.company_name)!;
          comp.jobCount++;
          comp.openJobs.push(job);
          if (!comp.locations.includes(job.location)) comp.locations.push(job.location);
          if (!comp.types.includes(job.type)) comp.types.push(job.type);
        });

        setCompanies(Array.from(companyMap.values()));
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [supabase]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.locations.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [companies, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#ff4d94] animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Discovering Top Companies...</p>
      </div>
    );
  }

  return (
    <div className="text-white pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Explore Top <span className="gradient-text">Companies</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              Discover the best places to work and grow your career. Connect with industry leaders and innovative startups.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4d94] to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                <Search className="ml-4 text-slate-400 group-focus-within:text-[#ff4d94] transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search by company name or location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-white placeholder:text-slate-500 text-lg"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="container mx-auto px-4 mb-20">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Companies", value: companies.length, icon: Building2, color: "text-[#ff4d94]", bg: "bg-[#ff4d94]/10" },
            { label: "Open Positions", value: companies.reduce((acc, c) => acc + c.jobCount, 0), icon: Briefcase, color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { label: "Global Locations", value: [...new Set(companies.flatMap(c => c.locations))].length, icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Top Rated", value: "4.8/5", icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" }
          ].map((stat, i) => (
            <ScaleIn key={i}>
              <div className="glass p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500 group">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            </ScaleIn>
          ))}
        </StaggerContainer>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4">
        {filteredCompanies.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <ScaleIn key={company.name}>
                <div className="glass rounded-[2.5rem] p-8 border border-white/5 hover:border-[#ff4d94]/30 transition-all duration-500 group h-full flex flex-col">
                  {/* Company Profile Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                      {company.logo ? (
                        <Image 
                          src={company.logo} 
                          alt={company.name} 
                          width={80} 
                          height={80} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 size={40} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="px-3 py-1 bg-[#ff4d94]/10 rounded-full flex items-center gap-2 border border-[#ff4d94]/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d94] animate-pulse" />
                         <span className="text-[10px] font-bold text-[#ff4d94] uppercase tracking-wider">{company.jobCount} Jobs</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#ff4d94] transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                       Innovating the future of technology with a focus on {company.openJobs[0]?.title.toLowerCase()} and more. Join our global team of creators.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <MapPin size={16} className="text-[#ff4d94]" />
                        <span className="truncate">{company.locations.join(", ") || "Global"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Globe size={16} className="text-indigo-400" />
                        <span>Work {company.types.join(" / ")}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <TrendingUp size={16} className="text-emerald-400" />
                        <span>Top Talent Recommended</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden relative">
                          <Image src={`https://i.pravatar.cc/150?u=${company.name}${i}`} alt="Employee" fill className="object-cover" unoptimized />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-[#ff4d94]/20 flex items-center justify-center text-[10px] font-bold text-[#ff4d94] relative">
                        +12
                      </div>
                    </div>

                    <Link 
                      href={`/jobs?search=${encodeURIComponent(company.name)}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-[#ff4d94] text-white rounded-xl text-sm font-bold transition-all group/btn"
                    >
                      View Jobs <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </StaggerContainer>
        ) : (
          <FadeIn>
            <div className="text-center py-40 glass rounded-[3rem] border border-white/5">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600">
                <Search size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">No companies found</h2>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                We couldn&apos;t find any companies matching &quot;{searchQuery}&quot;. Try searching for something else.
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="px-8 py-3 bg-[#ff4d94] text-white rounded-2xl font-bold hover:shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] transition-all"
              >
                Clear Search
              </button>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
