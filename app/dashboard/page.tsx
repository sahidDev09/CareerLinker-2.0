"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardDispatcher() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const role = user.publicMetadata?.role as string;

      if (role === "recruiter") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/candidate");
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#ff4d94] animate-spin" />
        <p className="text-white/60 font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
