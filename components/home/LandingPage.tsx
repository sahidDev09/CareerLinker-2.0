"use client";

import Hero from "./Hero";
import Stats from "./Stats";
import FeaturedJobs from "./FeaturedJobs";
import CTA from "./Platform";
import SimpleCTA from "./CTA";

export default function LandingPage() {
  return (
    <div className="flex flex-col space-y-20 pb-20">
      <Hero />
      <Stats />
      <FeaturedJobs />
      <CTA />
      <SimpleCTA />
    </div>
  );
}
