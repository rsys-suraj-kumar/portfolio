"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ANIMATION_CONFIG } from "@/lib/animation/config";

interface HeroTextProps {
  isLoaded: boolean;
}

export function HeroText({ isLoaded }: HeroTextProps) {
  const { scrollProgress } = useAppStore();
  const prefersReducedMotion = useReducedMotion();

  // Calculate opacity - fade out as user scrolls
  const opacity = Math.max(0, 1 - scrollProgress * 5);
  const translateY = scrollProgress * 80;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 2.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration.slow,
        ease: ANIMATION_CONFIG.easing.enter,
      },
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.7,
      transition: {
        duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration.normal,
        delay: prefersReducedMotion ? 0 : 3.5,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="text-center max-w-5xl px-8">
        {/* Subtle tag above name */}
        <motion.div className="overflow-hidden mb-6" variants={itemVariants}>
          <span className="inline-block px-5 py-2 text-xs font-bold tracking-[0.4em] uppercase border border-white/10 rounded-full bg-white/5 text-gray-400">
            Temporal Engineer
          </span>
        </motion.div>

        {/* Main headline - your name */}
        <h1 className="font-display font-bold tracking-tighter">
          <motion.span className="block overflow-hidden" variants={itemVariants}>
            <span
              className="block"
              style={{ fontSize: "clamp(3rem, 12vw, 9rem)", lineHeight: 0.9 }}
            >
              SURAJ
            </span>
          </motion.span>
          <motion.span className="block overflow-hidden" variants={itemVariants}>
            <span
              className="block gradient-text"
              style={{ fontSize: "clamp(3rem, 12vw, 9rem)", lineHeight: 0.9 }}
            >
              KUMAR
            </span>
          </motion.span>
        </h1>

        {/* Tagline */}
        <motion.p
          className="text-gray-400 mt-8 max-w-xl mx-auto leading-relaxed"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
          variants={taglineVariants}
        >
          Senior Engineer. I build things that{" "}
          <span className="text-white font-medium">move through time</span>.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 0.4, y: 0 } : {}}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            delay: prefersReducedMotion ? 0 : 4,
          }}
        >
          <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-gray-500 font-mono">
            Scroll to drift
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scaleY: [1, 0.6, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Static fallback for non-WebGL / low-power devices
 */
export function HeroFallback() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Gradient background instead of 3D */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-black to-cyan-950/20" />
      
      <div className="text-center relative z-10 px-8">
        {/* Simple animated gradient orb */}
        <div className="w-32 h-32 mx-auto mb-10 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-orange-500 animate-pulse opacity-60 blur-sm" />
        
        <span className="inline-block px-5 py-2 mb-6 text-xs font-bold tracking-[0.4em] uppercase border border-white/10 rounded-full bg-white/5 text-gray-400">
          Software Engineer
        </span>
        
        <h1 className="font-display font-bold tracking-tighter mb-6">
          <span className="block text-6xl md:text-8xl">SURAJ</span>
          <span className="block text-6xl md:text-8xl gradient-text">KUMAR</span>
        </h1>
        
        <p className="text-gray-400 text-xl max-w-lg mx-auto mb-12">
          Senior Engineer building high-performance digital products and creative experiences.
        </p>

        {/* Static timeline navigation */}
        <nav className="flex flex-wrap gap-3 justify-center" aria-label="Timeline navigation">
          {["2018", "2022", "2023", "Skills", "Contact"].map((section) => (
            <a
              key={section}
              href={`#era-${section.toLowerCase()}`}
              className="px-4 py-2 text-sm border border-white/20 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-colors"
            >
              {section}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
