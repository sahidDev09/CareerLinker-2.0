"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export const FadeIn = ({ children, delay = 0, direction = "up", ...props }: { children: ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" } & HTMLMotionProps<"div">) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, delayChildren = 0, staggerChildren = 0.1, ...props }: { children: ReactNode; delayChildren?: number; staggerChildren?: number } & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children, delay = 0, ...props }: { children: ReactNode; delay?: number } & HTMLMotionProps<"div">) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
