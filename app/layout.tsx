import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CareerLinker | Connect with Top Opportunities",
  description: "The modern job portal for candidates and employers.",
};

import SmoothScroll from "@/components/shared/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.variable} font-sans antialiased`}>
          <SmoothScroll>
            <div className="bg-gradient-overlay" />
            <div className="grid-background" />
            <Navbar />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  );
}
