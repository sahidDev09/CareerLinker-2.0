"use client";

import Image from "next/image";
import { Github, Linkedin, Facebook, Dribbble, Sun, Chrome as Zoom, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface JobCardProps {
  company: string;
  title: string;
  salary: string;
  description: string;
  logo: string;
  color: string;
  isActive?: boolean;
  avatars?: string[];
}

const JobCard = ({ 
  company, 
  title, 
  salary, 
  description, 
  logo, 
  color, 
  isActive = false,
  avatars = [] 
}: JobCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -15, scale: isActive ? 1.15 : 1.1, zIndex: isActive ? 100 : 60 }}
      className={`relative w-[280px] md:w-[300px] p-8 rounded-[3rem] shadow-2xl transition-all duration-500 ${color} ${isActive ? 'z-50 scale-110 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-4 border-white' : 'z-10 opacity-95'}`}
      style={{
        boxShadow: isActive ? '0 30px 60px -15px rgba(0,0,0,0.15)' : '0 10px 30px -10px rgba(0,0,0,0.05)'
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-sm border border-black/5 relative overflow-hidden">
          <Image src={logo} alt={company} fill className="object-contain p-2.5" />
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black opacity-40 uppercase tracking-[0.1em] mb-1">{company}</p>
          <p className="text-sm font-black">{salary}</p>
        </div>
      </div>
      
      <h3 className="text-2xl font-black leading-[1.2] mb-4 min-h-[3.5rem] tracking-tight">
        {title}
      </h3>
      
      <p className="text-xs font-semibold opacity-70 mb-8 line-clamp-2 h-10 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-2.5">
          {avatars.map((avatar, i) => (
            <div key={i} className="w-9 h-9 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden relative shadow-sm">
              <Image src={avatar} alt="avatar" fill className="object-cover" />
            </div>
          ))}
          <div className="w-9 h-9 rounded-full border-[3px] border-white bg-white/80 backdrop-blur-sm flex items-center justify-center text-[10px] font-black shadow-sm">
            50+
          </div>
        </div>
        {isActive && (
          <button className="bg-[#1A1A1A] text-white text-[13px] font-black px-7 py-3 rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95">
            Apply
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface FloatingIconProps {
  icon: LucideIcon;
  color: string;
  top: string;
  left: string;
  size?: number;
  delay?: number;
  opacity?: number;
}

const FloatingIcon = ({ icon: Icon, color, top, left, size = 48, delay = 0, opacity = 0.7 }: FloatingIconProps) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [-15, 15, -15], opacity }}
    transition={{ 
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
      opacity: { duration: 1, delay }
    }}
    className="absolute z-0 pointer-events-none hidden lg:block"
    style={{ top, left }}
  >
    <div className={`flex items-center justify-center rounded-[1.25rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] bg-white p-3 border border-black/5`} style={{ width: size, height: size }}>
      <Icon className={color} size={size * 0.55} strokeWidth={2.5} />
    </div>
  </motion.div>
);

interface CloudProps {
  top: string;
  left: string;
  scale?: number;
  opacity?: number;
  delay?: number;
}

const Cloud = ({ top, left, scale = 1, opacity = 0.6, delay = 0 }: CloudProps) => (
  <motion.div
    initial={{ x: 0 }}
    animate={{ x: [-30, 30, -30] }}
    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay }}
    className="absolute z-[-1] pointer-events-none"
    style={{ top, left, opacity, scale }}
  >
    <svg width="240" height="144" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M150 40C150 17.9086 132.091 0 110 0C94.5511 0 81.1687 8.74955 74.3435 21.6033C71.3503 20.5694 68.1408 20 64.8 20C47.2376 20 33 34.2376 33 51.8C33 53.6443 33.1568 55.452 33.458 57.21C14.3411 61.6445 0 78.7483 0 99.2C0 125.047 20.9529 146 46.8 146H152.2C178.6 146 200 124.6 200 101.4C200 78.2 181.4 59.4 158.2 59.4C158.2 59.4 158.2 59.4 158.2 59.4C158.2 48.7 154.5 38.8 148.4 31C149.4 33.9 150 36.9 150 40Z" fill="white" />
    </svg>
  </motion.div>
);

export default function Hero() {
  const jobs = [
    {
      company: "Twitch",
      title: "Sr Social Specialist",
      salary: "$300K - $500K",
      description: "We are looking for a Senior Social Specialist to join our team and lead our strategy.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg",
      color: "bg-[#EDE9FE] text-[#7C3AED]",
      avatars: ["https://i.pravatar.cc/100?u=1", "https://i.pravatar.cc/100?u=2", "https://i.pravatar.cc/100?u=3"]
    },
    {
      company: "Bank BCA",
      title: "Senior Teller Executive",
      salary: "$60K - $112K",
      description: "We are seeking a Senior Teller Executive to craft innovative and user-friendly experience.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
      color: "bg-[#FED7AA] text-[#EA580C]",
      avatars: ["https://i.pravatar.cc/100?u=4", "https://i.pravatar.cc/100?u=5", "https://i.pravatar.cc/100?u=6"]
    },
    {
      company: "Spotify",
      title: "Senior Product Designer",
      salary: "$120K - $200K",
      description: "We seek a Senior Product Designer to craft innovative, user-friendly experiences.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      color: "bg-[#CCFBF1] text-[#0F766E]",
      isActive: true,
      avatars: ["https://i.pravatar.cc/100?u=7", "https://i.pravatar.cc/100?u=8", "https://i.pravatar.cc/100?u=9"]
    },
    {
      company: "Apple",
      title: "Senior Frontend",
      salary: "$200K - $500K",
      description: "Looking for a Junior Frontend developer to implement visual elements of user.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      color: "bg-[#FECDD3] text-[#E11D48]",
      avatars: ["https://i.pravatar.cc/100?u=10", "https://i.pravatar.cc/100?u=11", "https://i.pravatar.cc/100?u=12"]
    },
    {
      company: "Meta Inc.",
      title: "Senior Account Executive",
      salary: "$100K - $500K",
      description: "Senior Account Executive to manage customer health and building strong relationships.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      color: "bg-[#DBEAFE] text-[#1D4ED8]",
      avatars: ["https://i.pravatar.cc/13", "https://i.pravatar.cc/14", "https://i.pravatar.cc/15"]
    },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-10 pb-20">
      {/* Decorative Background Elements */}
      <Cloud top="2%" left="2%" scale={1.3} opacity={0.1} />
      <Cloud top="12%" left="88%" scale={0.9} opacity={0.1} />
      <Cloud top="42%" left="-8%" scale={1.6} opacity={0.1} delay={3} />
      <Cloud top="38%" left="82%" scale={1.4} opacity={0.1} delay={1.5} />
      
      {/* Floating Icons */}
      <FloatingIcon icon={Dribbble} color="text-pink-500" top="12%" left="12%" size={52} delay={0} />
      <FloatingIcon icon={Facebook} color="text-blue-600" top="8%" left="82%" size={60} delay={1} />
      <FloatingIcon icon={Linkedin} color="text-blue-700" top="48%" left="22%" size={56} delay={2} />
      <FloatingIcon icon={Github} color="text-slate-900" top="46%" left="75%" size={52} delay={1.5} />
      <FloatingIcon icon={Sun} color="text-orange-400" top="68%" left="8%" size={44} delay={4} />
      <FloatingIcon icon={Zoom} color="text-blue-500" top="64%" left="92%" size={48} delay={0.5} />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-5xl mx-auto mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.03em] text-white leading-[1.1] mb-2">
            Smart Career{" "}
            <span className="relative inline-block mx-2 translate-y-3 md:translate-y-6">
              <motion.span 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="bg-indigo-500/20 p-2 md:p-4 rounded-[2rem] md:rounded-[2.5rem] inline-flex items-center justify-center shadow-lg relative w-14 h-14 md:w-24 md:h-24 cursor-pointer"
              >
                <Image 
                  src="https://em-content.zobj.net/source/apple/354/smiling-cat-with-heart-eyes_1f63b.png" 
                  alt="cat" 
                  fill
                  className="object-contain p-2"
                />
              </motion.span>
            </span>{" "}
            Solutions for <br className="hidden md:block" /> Your{" "}
            <span className="relative inline-flex items-center align-middle mx-1 -translate-y-2">
              <div className="flex -space-x-4">
                {[ 'a', 'b', 'c' ].map((u, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, zIndex: 10 }}
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full border-[3px] border-black bg-slate-800 overflow-hidden relative shadow-md"
                  >
                    <Image src={`https://i.pravatar.cc/100?u=${u}`} alt="user" fill className="object-cover" />
                  </motion.div>
                ))}
              </div>
            </span>{" "}
            Growing Needs
          </h1>

          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            The modern solution to optimize your hiring process.
          </p>
        </motion.div>

        {/* Job Cards Section */}
        <div className="relative mt-12 flex justify-center items-end px-4 overflow-visible py-10 rounded-[3rem]">
          <div className="flex -space-x-20 md:-space-x-32 items-end max-w-[1400px]">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotate: index === 0 ? -25 : index === 4 ? 25 : 0 }}
                animate={{ 
                  opacity: 1, 
                  y: index === 2 ? -40 : (index === 0 || index === 4 ? 60 : 10),
                  rotate: index === 0 ? -20 : index === 1 ? -10 : index === 3 ? 10 : index === 4 ? 20 : 0
                }}
                transition={{ delay: 0.1 * index, duration: 0.8, ease: "backOut" }}
                className="relative shrink-0"
                style={{ zIndex: index === 2 ? 50 : 10 }}
              >
                <JobCard {...job} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
