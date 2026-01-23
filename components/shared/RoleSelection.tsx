"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, CheckCircle2 } from "lucide-react";

export default function RoleSelection() {
  const { user, isLoaded } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter" | null>(null);

  useEffect(() => {
    if (isLoaded && user && !user.publicMetadata?.role) {
      setShowModal(true);
    }
  }, [isLoaded, user]);

  const handleRoleSelection = async (role: "candidate" | "recruiter") => {
    if (!user) return;
    setLoading(true);
    setSelectedRole(role);
    
    try {
      // In a real app, you'd call a server action or API to update publicMetadata
      // For this demo, we'll use a fetch to a mock endpoint or a server action we'll create
      const response = await fetch("/api/user/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // Refresh user data
        await user.reload();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-[#1D253E] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ff4d94]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to CareerLinker!</h2>
            <p className="text-white/60 mb-8">Please select your role to personalize your experience.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Candidate Option */}
              <button
                disabled={loading}
                onClick={() => handleRoleSelection("candidate")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center hover:scale-[1.02] active:scale-[0.98] ${
                  selectedRole === "candidate" 
                    ? "border-[#ff4d94] bg-[#ff4d94]/10" 
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Candidate</h3>
                <p className="text-xs text-white/40">Find your dream job and apply with ease.</p>
                {selectedRole === "candidate" && (
                  <CheckCircle2 className="absolute top-4 right-4 text-[#ff4d94]" size={20} />
                )}
              </button>

              {/* Recruiter Option */}
              <button
                disabled={loading}
                onClick={() => handleRoleSelection("recruiter")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center hover:scale-[1.02] active:scale-[0.98] ${
                  selectedRole === "recruiter" 
                    ? "border-[#ff4d94] bg-[#ff4d94]/10" 
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#ff4d94]/20 flex items-center justify-center mb-4 text-[#ff4d94] group-hover:scale-110 transition-transform">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Recruiter</h3>
                <p className="text-xs text-white/40">Post jobs and find the best talent.</p>
                {selectedRole === "recruiter" && (
                  <CheckCircle2 className="absolute top-4 right-4 text-[#ff4d94]" size={20} />
                )}
              </button>
            </div>

            {loading && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-[#ff4d94]">
                <div className="w-2 h-2 bg-[#ff4d94] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-[#ff4d94] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-[#ff4d94] rounded-full animate-bounce" />
                <span className="text-sm font-medium ml-2">Setting up your profile...</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
