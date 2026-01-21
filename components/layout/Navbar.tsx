"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Find Jobs", href: "/jobs" },
  { name: "Companies", href: "#" },
  { name: "For Employers", href: "/dashboard/employer" },
  { name: "Dashboard", href: "/dashboard/candidate" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 shadow-lg py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Briefcase size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Career<span className="text-indigo-400">Linker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-indigo-400",
                  pathname === link.href ? "text-indigo-400" : "text-slate-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
              Login
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Post a Job
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-black border-b border-white/10"
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-slate-300"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/5" />
          <button className="w-full text-left text-lg font-medium text-slate-300">
            Login
          </button>
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md">
            Post a Job
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
