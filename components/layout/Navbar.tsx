"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, X, Briefcase } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState, useRef, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import Image from "next/image";
import RoleSelection from "@/components/shared/RoleSelection";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const navRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const role = user?.publicMetadata?.role as "candidate" | "recruiter" | undefined;
  const actionButtonText = role === "candidate" ? "Apply Jobs" : "Post a Job";

  const navLinks = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Companies", href: "#" },
    { name: "Dashboard", href: "/dashboard/candidate" },
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
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "nav-link text-sm font-semibold transition-colors duration-300 hover:text-[#ff4d94] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff4d94] after:transition-all hover:after:w-full",
                  pathname === link.href ? "text-[#ff4d94] after:w-full" : "text-white/80"
                )}
              >
                {link.name}
              </Link>
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
                <button className="px-6 py-2.5 bg-[#ff4d94] text-white rounded-full text-sm font-bold shadow-[0_10px_20px_-5px_rgba(255,77,148,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,77,148,0.4)] transition-all hover:-translate-y-1 active:scale-95">
                  {actionButtonText}
                </button>
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
                      <UserButton.Link 
                        label="Saved Jobs" 
                        labelIcon={<Bookmark size={16} />} 
                        href="/dashboard/candidate/saved" 
                      />

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
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold text-white/90 hover:text-[#ff4d94] transition-colors"
              >
                {link.name}
              </Link>
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
                      <UserButton.Action label="manageAccount" />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
                <button className="w-full py-4 bg-[#ff4d94] text-white rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform">
                  {actionButtonText}
                </button>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
      <RoleSelection />
    </div>
  );
}
