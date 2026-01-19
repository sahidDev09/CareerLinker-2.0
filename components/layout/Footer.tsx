import Link from "next/link";
import { Briefcase, Github, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white shadow-lg">
                <Briefcase size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Career<span className="text-indigo-600">Linker</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Connecting world-class talent with the most innovative companies on the planet.
            </p>
            <div className="flex items-center space-x-4">
              <Twitter size={20} className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Github size={20} className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">For Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/jobs" className="hover:text-indigo-600">Browse Jobs</Link></li>
              <li><Link href="/profile" className="hover:text-indigo-600">Candidate Profile</Link></li>
              <li><Link href="/applications" className="hover:text-indigo-600">My Applications</Link></li>
              <li><Link href="/saved" className="hover:text-indigo-600">Saved Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/post-job" className="hover:text-indigo-600">Post a Job</Link></li>
              <li><Link href="/employer/dashboard" className="hover:text-indigo-600">Employer Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600">Pricing Plans</Link></li>
              <li><Link href="/hire" className="hover:text-indigo-600">Hiring Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Newsletter</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Get the latest job updates directly in your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} CareerLinker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
