"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Video, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: InterviewDetails) => void;
  isLoading?: boolean;
  candidateName: string;
  initialDetails?: InterviewDetails;
}

export interface InterviewDetails {
  interviewers: string;
  meeting_url: string;
  scheduled_at: string;
}

export default function InterviewModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  candidateName,
  initialDetails
}: InterviewModalProps) {
  const [details, setDetails] = useState<InterviewDetails>(initialDetails || {
    interviewers: "",
    meeting_url: "",
    scheduled_at: ""
  });

  // Reset details when initialDetails changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setDetails(initialDetails || {
        interviewers: "",
        meeting_url: "",
        scheduled_at: ""
      });
    }
  }, [isOpen, initialDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(details);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="text-[#FF4D94]" size={24} />
                  Schedule Interview
                </h3>
                <p className="text-slate-400 text-sm">
                  Set up an interview for <span className="text-[#FF4D94] font-semibold">{candidateName}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2 ml-1">
                    <Users size={16} className="text-[#FF4D94]" />
                    Interviewers
                  </label>
                  <textarea
                    required
                    value={details.interviewers}
                    onChange={(e) => setDetails({ ...details, interviewers: e.target.value })}
                    placeholder="e.g. Faysal (Manager), Alamgir (Recruiter), Ibrahim (Finance Manager)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2 ml-1">
                    <Video size={16} className="text-[#FF4D94]" />
                    Google Meeting URL
                  </label>
                  <input
                    required
                    type="url"
                    value={details.meeting_url}
                    onChange={(e) => setDetails({ ...details, meeting_url: e.target.value })}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2 ml-1">
                    <Clock size={16} className="text-[#FF4D94]" />
                    Scheduled Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={details.scheduled_at}
                    onChange={(e) => setDetails({ ...details, scheduled_at: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-[#FF4D94]/50 outline-none transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 rounded-2xl bg-[#FF4D94] hover:brightness-110 text-white font-bold transition-all shadow-xl shadow-[#FF4D94]/20 disabled:opacity-50 order-1 sm:order-2 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      "Confirm Schedule"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
