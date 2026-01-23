import Link from "next/link";
import { Briefcase, Github, Twitter, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-3xl border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
          <div className="col-span-1 md:col-span-1 space-y-4 text-white">
            <Link href="/" className="flex items-center space-x-2 group">
             <Image src="/assests/careerLinkerBig.png" alt="Logo" width={300} height={300} className="h-24 w-full"/>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connecting world-class talent with the most innovative companies on the planet.
            </p>
            <div className="flex items-center space-x-4">
              <Twitter size={20} className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors" />
              <Github size={20} className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">For Candidates</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/jobs" className="hover:text-indigo-400 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/profile" className="hover:text-indigo-400 transition-colors">Candidate Profile</Link></li>
              <li><Link href="/applications" className="hover:text-indigo-400 transition-colors">My Applications</Link></li>
              <li><Link href="/saved" className="hover:text-indigo-400 transition-colors">Saved Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">For Employers</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/post-job" className="hover:text-indigo-400 transition-colors">Post a Job</Link></li>
              <li><Link href="/employer/dashboard" className="hover:text-indigo-400 transition-colors">Employer Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing Plans</Link></li>
              <li><Link href="/hire" className="hover:text-indigo-400 transition-colors">Hiring Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest job updates directly in your inbox.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-slate-600"
              />
              <button className="bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                Join Now
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CareerLinker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
