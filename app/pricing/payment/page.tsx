"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2,
  CreditCard,
  Zap,
  Star,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const plan = searchParams.get("plan") || "Standard";
  const price = searchParams.get("price") || "$19";
  const role = searchParams.get("role") || "candidate";

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pricing/success?plan=${plan}&role=${role}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      toast.error(error.message || "Payment failed.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsSuccess(true);
      toast.success("Payment successful!");
      setTimeout(() => {
        router.push(`/pricing/success?plan=${plan}&role=${role}`);
      }, 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.form
          key="payment-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-3xl space-y-8 relative overflow-hidden"
        >
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d94]/5 blur-3xl -mr-16 -mt-16 rounded-full" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff4d94] to-indigo-600 flex items-center justify-center shadow-lg shadow-[#ff4d94]/20">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Payment Method</h3>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Secure & Encrypted</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 shadow-inner">
              <PaymentElement 
                options={{
                  layout: "accordion",
                }} 
              />
            </div>
          </div>

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm font-semibold text-center bg-red-400/10 py-4 rounded-xl border border-red-400/20"
            >
              {errorMessage}
            </motion.div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing || !stripe || !elements}
              className={cn(
                "w-full py-5 rounded-2xl font-black text-lg transition-all duration-500 relative overflow-hidden group shadow-2xl",
                isProcessing 
                  ? "bg-white/5 text-slate-500 cursor-not-allowed" 
                  : "bg-[#FF4D94] text-white hover:scale-[1.02] active:scale-[0.98] shadow-[#FF4D94]/20 hover:shadow-[#FF4D94]/40"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Completing Purchase...
                  </>
                ) : (
                  <>
                    Pay {price} Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
            
            <div className="flex items-center justify-center gap-6 mt-6 opacity-60">
              <div className="flex items-center gap-1.5 grayscale transition-all duration-300 hover:grayscale-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SSL Secure</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 grayscale transition-all duration-300 hover:grayscale-0">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Real-time</span>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 rounded-[2.5rem] bg-white/[0.05] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-3xl text-center flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          
          <div className="w-28 h-28 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 relative">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
            >
              <div className="relative">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 filter drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
              </div>
            </motion.div>
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-emerald-500/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Payment Verified!</h2>
          <p className="text-slate-400 max-w-[280px] mx-auto mb-10 font-medium leading-relaxed">
            Welcome to the <span className="text-white font-bold">{plan}</span> experience. 
            Taking you to your dashboard...
          </p>
          
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold">
            <Loader2 className="w-4 h-4 animate-spin text-[#ff4d94]" />
            Redirecting...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "Standard";
  const price = searchParams.get("price") || "$19";
  const role = searchParams.get("role") || "candidate";

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, price, role }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [plan, price, role]);

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all duration-300 mb-10 group bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/5 hover:border-white/20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Return to Plans</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-[#ff4d94]" />
                <span className="text-[#ff4d94] text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-[1.1]">
                Elevate your <br />
                Career journey
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                Join thousands of professionals who have accelerated their career with our premium features.
              </p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden shadow-2xl group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                    <Zap className="w-8 h-8 text-[#ff4d94]" />
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden relative">
                        <Image 
                          src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                          alt="user" 
                          fill
                          className="object-cover" 
                        />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 mb-8">
                  <p className="text-[#ff4d94] text-[10px] font-black uppercase tracking-widest">Selected Subscription</p>
                  <h2 className="text-4xl font-black text-white flex items-center gap-3">
                    {plan}
                    <span className="text-xs font-bold py-1 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Monthly</span>
                  </h2>
                </div>

                <div className="h-px bg-white/10 w-full mb-8" />
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em]">Total to pay</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-5xl font-black text-white tracking-tighter">{price}</p>
                      <p className="text-slate-500 font-bold">.00</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/10">
                      <ShieldCheck className="w-3.5 h-3.5" /> Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Lock, title: "Enterprise Grade", desc: "Military-grade 256-bit encryption", color: "indigo" },
                { icon: ShieldCheck, title: "Buyer Protection", desc: "30-day money-back guarantee", color: "emerald" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className={cn("p-3 rounded-xl shadow-lg", 
                    item.color === 'indigo' ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {clientSecret ? (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#ff4d94',
                      colorBackground: '#101323ff',
                      colorText: '#ffffff',
                      colorDanger: '#ef4444',
                      fontFamily: 'Outfit, system-ui, sans-serif',
                      spacingUnit: '5px',
                      borderRadius: '12px',
                    },
                    rules: {
                      '.Input': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                      },
                      '.Input:focus': {
                        border: '1px solid #ff4d94',
                        boxShadow: '0 0 0 2px rgba(255, 77, 148, 0.2)',
                      },
                      '.Label': {
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#94a3b8',
                      }
                    }
                  }
                }}
              >
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-md flex flex-col items-center justify-center min-h-[500px]">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-[#ff4d94]" />
                </div>
                <h3 className="text-white font-black text-xl mt-8">Establishing Secure Session</h3>
                <p className="text-slate-500 font-medium mt-2 text-center max-w-xs">
                  Connecting to our secure payment processor. Please hold on a moment...
                </p>
              </div>
            )}
            
            <p className="text-center text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mt-8">
              Secured by <span className="text-white">Stripe</span> • CareerLinker Payment Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-[#ff4d94]" />
        <p className="text-[#ff4d94] font-black tracking-widest uppercase text-xs">Initializing Checkout</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
