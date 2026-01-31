"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, X, Briefcase, Zap } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useLayoutEffect, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";
import RoleSelection from "@/components/shared/RoleSelection";
import { createClient } from "@/lib/supabase/client";
import pricingData from "@/data/pricing-plans.json";

interface AppliedProfile {
  user_id: string;
  user_name: string;
  user_email: string;
  status: string;
  applied_at: string;
}

function AuthRedirectHandler() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('show_signin') === 'true' && !user) {
      const redirectUrl = searchParams.get('redirect_url') || undefined;
      openSignIn({
        fallbackRedirectUrl: redirectUrl,
      });
    }
  }, [searchParams, openSignIn, user]);

  return null;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const pathname = usePathname();
  const creditsRef = useRef<HTMLDivElement>(null);
  
  const navRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const role = user?.publicMetadata?.role as "candidate" | "recruiter" | undefined;
  const actionButtonText = role === "candidate" ? "Apply Jobs" : "Post a Job";

  const [credits, setCredits] = useState<string>("0");
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async () => {
    if (!user || !role) return;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("package")
        .eq("id", user.id)
        .single();
      
      const userPackage = profileData?.package || "Free";
      const rolePlans = pricingData[role as keyof typeof pricingData];
      const plan = rolePlans.find((p: { name: string; features: string[] }) => p.name.toLowerCase() === userPackage.toLowerCase());
      
      if (plan && plan.features && plan.features.length > 0) {
        const creditFeature = plan.features[0];
        const match = creditFeature.match(/(\d+|Unlimited)/i);
        const totalLimit = match ? match[0] : "0";

        if (role === "recruiter" && totalLimit.toLowerCase() !== "unlimited") {
          const limit = parseInt(totalLimit);
          const { count, error } = await supabase
            .from("jobs")
            .select("*", { count: 'exact', head: true })
            .eq("recruiter_id", user.id)
            .eq("status", "active");
          
          if (error) throw error;
          const activeJobs = count || 0;
          setCredits(Math.max(0, limit - activeJobs).toString());
        } else if (role === "candidate" && totalLimit.toLowerCase() !== "unlimited") {
          const limit = parseInt(totalLimit);
          
          const { data: allJobsData, error: jobsError } = await supabase
            .from('jobs')
            .select('applied_profiles')
            .not('applied_profiles', 'is', null);
          
          if (jobsError) throw jobsError;
          
          const appliedCount = (allJobsData || []).filter(job => 
            Array.isArray(job.applied_profiles) && 
            job.applied_profiles.some((p: AppliedProfile) => p.user_id === user.id)
          ).length;

          setCredits(Math.max(0, limit - appliedCount).toString());
        } else {
          setCredits(totalLimit);
        }
      }
    } catch (err) {
      console.error("Error fetching user package or jobs:", err);
    }
  }, [user, role, supabase]);

  useEffect(() => {
    fetchProfile();
    
    // Listen for custom "credits-updated" event
    window.addEventListener('credits-updated', fetchProfile);
    
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (creditsRef.current && !creditsRef.current.contains(event.target as Node)) {
        setIsCreditsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('credits-updated', fetchProfile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchProfile]);

  const nextRenewalDate = useMemo(() => {
    if (!user?.createdAt) return null;
    const created = new Date(user.createdAt);
    const now = new Date();
    const renewal = new Date(now.getFullYear(), now.getMonth(), created.getDate());
    if (renewal < now) {
      renewal.setMonth(renewal.getMonth() + 1);
    }
    return renewal.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [user]);


  const navLinks = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Companies", href: "/companies" },
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      tl.from(navContainerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
      })
      .from(logoRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.8,
      }, "-=0.8")
      .from(".nav-link", {
        y: -10,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      }, "-=0.6")
      .from(buttonsRef.current, {
        x: 20,
        opacity: 0,
        duration: 0.8,
      }, "-=0.6");
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed w-full z-50 top-0 left-0 right-0">
      {/* Permanent Floating Wrapper */}
      <div ref={navRef} className="p-4">
        <div 
          ref={navContainerRef}
          className="mx-auto max-w-7xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl py-2 px-4 md:px-8 flex items-center justify-between"
        >
          {/* Logo */}
          <div ref={logoRef}>
            <Link href="/" className="flex items-center space-x-2 group">
              <Image src="/assests/careerLinkerBig.png" alt="Logo" width={200} height={200} className="h-14 object-contain"/>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8" ref={linksRef}>
            {navLinks.map((link) => (
              <div key={link.name}>
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl={link.href}>
                    <button
                      className={cn(
                        "nav-link text-sm font-semibold transition-colors duration-300 hover:text-[#ff4d94] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4d94] after:transition-all hover:after:w-full",
                        pathname === link.href ? "text-[#ff4d94] after:w-full" : "text-white/80"
                      )}
                    >
                      {link.name}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href={link.href}
                    className={cn(
                      "nav-link text-sm font-semibold transition-colors duration-300 hover:text-[#ff4d94] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4d94] after:transition-all hover:after:w-full",
                      pathname === link.href ? "text-[#ff4d94] after:w-full" : "text-white/80"
                    )}
                  >
                    {link.name}
                  </Link>
                </SignedIn>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-6" ref={buttonsRef}>
            <SignedOut>
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-white/80 hover:text-[#ff4d94] transition-all hover:-translate-y-0.5 active:scale-95">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2.5 bg-[#ff4d94] text-white rounded-full text-sm font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="relative" ref={creditsRef}>
                    <button 
                      onClick={() => setIsCreditsOpen(!isCreditsOpen)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group transition-all hover:bg-white/20"
                    >
                      <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                        <Zap size={10} className="text-black fill-black" />
                      </div>
                      <span className="text-xs font-bold text-white/90">
                        <span className="text-yellow-400">{credits}</span> Credits
                      </span>
                      <ChevronDown size={14} className={cn("text-white/60 transition-transform duration-300", isCreditsOpen && "rotate-180")} />
                    </button>

                    {/* Credits Dropdown */}
                    {isCreditsOpen && (
                      <div className="absolute top-full left-0 mt-3 w-64 bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl p-5 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">Credit Status</span>
                            <div className="px-2 py-0.5 bg-emerald-500/10 rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</div>
                          </div>
                          
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Total Available</span>
                              <span className="font-bold text-white">{credits}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">Next Renewal</span>
                              <span className="font-bold text-yellow-400">{nextRenewalDate}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Credits are renewed every month based on your plan type.
                            </p>
                            <Link 
                              href="/pricing"
                              onClick={() => setIsCreditsOpen(false)}
                              className="w-full py-2.5 bg-gradient-to-r from-[#ff4d94] to-[#ff7eb3] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#ff4d94]/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95"
                            >
                              <Sparkles size={14} />
                              Buy Credits / Upgrade
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link 
                    href={role === "recruiter" && credits === "0" ? "/pricing" : (role === "candidate" ? "/jobs" : "/post-job")}
                    className="px-6 py-2.5 bg-[#ff4d94] text-white rounded-full text-sm font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95"
                  >
                    {actionButtonText}
                  </Link>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "!w-10 !h-10 border-2 border-[#ff4d94]/50 hover:border-[#ff4d94] transition-all shadow-lg",
                      userButtonTrigger: "!w-10 !h-10"
                    }
                  }}
                >
                    <UserButton.MenuItems>
                      <UserButton.Action label="manageAccount" />
                      {role === "candidate" && (
                        <UserButton.Link 
                          label="Saved Jobs" 
                          labelIcon={<Bookmark size={16} />} 
                          href="/dashboard/candidate/saved" 
                        />
                      )}
                      {role === "recruiter" && (
                        <UserButton.Link 
                          label="Employer Dashboard" 
                          labelIcon={<Briefcase size={16} />} 
                          href="/dashboard/employer" 
                        />
                      )}
                    </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white transition-transform active:scale-90" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl mt-3 shadow-2xl transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[400px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
          )}
        >
          <div className="px-6 space-y-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl={link.href}>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="block text-lg font-bold text-white/90 hover:text-[#ff4d94] transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-lg font-bold text-white/90 hover:text-[#ff4d94] transition-colors"
                  >
                    {link.name}
                  </Link>
                </SignedIn>
              </div>
            ))}
            <hr className="border-white/10" />
            <SignedOut>
              <div className="space-y-4">
                <SignInButton mode="modal">
                  <button className="w-full text-left text-lg font-bold text-white/90 hover:text-[#ff4d94] transition-colors">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-4 bg-[#ff4d94] text-white rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white/90">Account</span>
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "!w-14 !h-14 border-2 border-[#ff4d94]/50 shadow-md",
                        userButtonTrigger: "!w-14 !h-14"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      {role === "candidate" && (
                        <>
                          <UserButton.Link 
                            label="Saved Jobs" 
                            labelIcon={<Bookmark size={16} />} 
                            href="/dashboard/candidate/saved" 
                          />
                          <UserButton.Link 
                            label="Applied Jobs" 
                            labelIcon={<Briefcase size={16} />} 
                            href="/dashboard/candidate/applications" 
                          />
                        </>
                      )}
                      {role === "recruiter" && (
                        <UserButton.Link 
                          label="Employer Dashboard" 
                          labelIcon={<Briefcase size={16} />} 
                          href="/dashboard/employer" 
                        />
                      )}
                      <UserButton.Action label="manageAccount" />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
                <div className="flex flex-col px-4 py-3 bg-white/5 border border-white/10 rounded-xl mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Available Credits</span>
                    <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#ff4d94]/20 border border-[#ff4d94]/30 rounded-full">
                      <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Zap size={10} className="text-black fill-black" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        <span className="text-yellow-400">{credits}</span> Credits
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
                    <span className="text-white/40">Next Renewal</span>
                    <span className="text-yellow-400/80 font-bold">{nextRenewalDate}</span>
                  </div>
                  <Link 
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 bg-[#ff4d94]/20 border border-[#ff4d94]/30 text-[#ff4d94] rounded-lg text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#ff4d94]/30 transition-all"
                  >
                    <Sparkles size={12} />
                    Get More Credits
                  </Link>
                </div>
                <Link 
                  href={role === "recruiter" && credits === "0" ? "/pricing" : (role === "candidate" ? "/jobs" : "/post-job")}
                  className="w-full inline-block text-center py-4 bg-[#ff4d94] text-white rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform"
                >
                  {actionButtonText}
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      <RoleSelection />
    </div>
  );
}
