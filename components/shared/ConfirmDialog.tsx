"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger"
}: ConfirmDialogProps) {
  const colors = {
    danger: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-blue-500"
  };

  const lightColors = {
    danger: "bg-rose-500/10 text-rose-500",
    warning: "bg-amber-500/10 text-amber-500",
    info: "bg-blue-500/10 text-blue-500"
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
            className="relative w-full max-w-md glass rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-20 h-20 rounded-3xl ${lightColors[variant]} flex items-center justify-center mb-2`}>
                <AlertCircle size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                  {description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 order-2 sm:order-1"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 rounded-2xl ${colors[variant]} hover:brightness-110 text-white font-bold transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50 order-1 sm:order-2 flex items-center justify-center`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
