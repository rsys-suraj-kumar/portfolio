"use client";

import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useAnimationBridge } from "@/stores/useAnimationBridge";
import { ERAS, ANIMATION_CONFIG, isInSafeZone } from "@/lib/animation/config";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OverlayProps {
  showFullExperience?: boolean;
}

// ============================================================================
// TIMELINE SECTION - Content sections tied to eras
// ============================================================================
interface TimelineSectionProps {
  era: (typeof ERAS)[0];
  children: React.ReactNode;
  className?: string;
  id?: string;
  align?: "left" | "right" | "center";
}

function TimelineSection({ era, children, className = "", id, align = "left" }: TimelineSectionProps) {
  const { scrollProgress } = useAppStore();
  const currentEra = useAppStore((s) => s.currentEra);
  const isActive = currentEra?.year === era.year;
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Check if in safe reading zone
  const safeZone = isInSafeZone(scrollProgress);
  const shouldDampen = safeZone.inZone && safeZone.label === era.label;

  const alignmentClass = {
    left: "items-start text-left",
    right: "items-end text-right",
    center: "items-center text-center",
  }[align];

  return (
    <section
      ref={sectionRef}
      id={id || `era-${era.year.toLowerCase()}`}
      className={`min-h-screen relative flex ${alignmentClass} ${className}`}
      style={{
        opacity: isActive ? 1 : 0.4,
        transition: reducedMotion ? "none" : "opacity 0.6s ease",
      }}
      aria-label={`${era.year}: ${era.label}`}
    >
      {/* Era indicator (left side) */}
      <div
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-20"
        aria-hidden="true"
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: era.color }}
          animate={{
            boxShadow: isActive ? `0 0 25px ${era.color}` : "0 0 0px transparent",
            scale: isActive ? 1.2 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
        <span
          className="text-[10px] tracking-[0.4em] uppercase origin-center -rotate-90 whitespace-nowrap font-mono font-medium"
          style={{ color: isActive ? era.color : "#444" }}
        >
          {era.year}
        </span>
      </div>

      {/* Reading zone indicator (subtle pulse when in safe zone) */}
      {shouldDampen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${era.color}05 0%, transparent 70%)`,
          }}
        />
      )}

      {children}
    </section>
  );
}

// ============================================================================
// ANIMATED CONTENT WRAPPER
// ============================================================================
function AnimatedContent({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration.normal,
        delay: prefersReducedMotion ? 0 : delay,
        ease: ANIMATION_CONFIG.easing.enter,
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// MAIN OVERLAY COMPONENT
// ============================================================================
export default function Overlay({ showFullExperience = true }: OverlayProps) {
  const { scrollProgress, setScrollProgress, isLoading } = useAppStore();
  const { setProjectHover } = useAnimationBridge();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  // Don't render during loading (for full experience)
  if (isLoading && showFullExperience) return null;

  return (
    <div
      ref={containerRef}
      className={`relative z-10 ${showFullExperience ? "pointer-events-none" : ""}`}
    >
      {/* ================================================================== */}
      {/* NAVIGATION */}
      {/* ================================================================== */}
      <nav
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 md:px-10 py-5 z-50 pointer-events-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        <a href="#" className="text-xl font-bold tracking-tight font-display hover:text-cyan-400 transition-colors">
          SK<span className="text-cyan-400">.</span>
        </a>

        <div className="flex items-center gap-8">
          {/* Era progress indicators */}
          <div className="hidden md:flex items-center gap-3" role="progressbar" aria-label="Timeline progress">
            {ERAS.map((era) => (
              <motion.div
                key={era.year}
                className="w-10 h-1 rounded-full"
                style={{
                  backgroundColor: scrollProgress >= era.position ? era.color : "rgba(255,255,255,0.08)",
                }}
                animate={{
                  boxShadow: scrollProgress >= era.position ? `0 0 8px ${era.color}` : "none",
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>

          <a
            href="#contact"
            className="text-sm font-medium hover:text-cyan-400 transition-colors tracking-widest uppercase"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* ================================================================== */}
      {/* HERO SPACER (3D hero text is rendered separately) */}
      {/* ================================================================== */}
      {showFullExperience && <div className="h-screen" aria-hidden="true" />}

      {/* ================================================================== */}
      {/* 2018 - THE BEGINNING */}
      {/* ================================================================== */}
      <TimelineSection era={ERAS[0]} className="px-6 md:px-20 lg:px-32 py-20" align="left">
        <AnimatedContent className="max-w-3xl relative z-10 pointer-events-auto">
          {/* Content backdrop for readability */}
          <div className="absolute -inset-8 md:-inset-12 bg-black/60 blur-3xl -z-10 rounded-full" />

          <span
            className="text-[8rem] md:text-[12rem] font-bold opacity-[0.03] absolute -top-16 -left-8 font-display select-none"
            aria-hidden="true"
          >
            2018
          </span>

          <p
            className="text-sm font-bold tracking-[0.4em] uppercase mb-4 font-mono"
            style={{ color: ERAS[0].color }}
          >
            Chapter 01
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-display tracking-tight">
            The Beginning
          </h2>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            My journey began at the intersection of curiosity and code. While studying
            Electrical Engineering, I discovered the infinite creative potential of the web—where
            logic meets art.
          </p>

          <div className="flex flex-wrap gap-3">
            {["React", "JavaScript", "Node.js", "Electrical Engineering"].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 text-xs font-bold border border-white/10 rounded-full bg-white/5 uppercase tracking-wider text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </AnimatedContent>
      </TimelineSection>

      <div className="h-[15vh]" aria-hidden="true" />

      {/* ================================================================== */}
      {/* 2022 - IJRDO */}
      {/* ================================================================== */}
      <TimelineSection era={ERAS[2]} className="px-6 md:px-20 lg:px-32 py-20" align="right">
        <AnimatedContent className="max-w-3xl relative z-10 pointer-events-auto ml-auto">
          <div className="absolute -inset-8 md:-inset-12 bg-black/60 blur-3xl -z-10 rounded-full" />

          <span
            className="text-[8rem] md:text-[12rem] font-bold opacity-[0.03] absolute -top-16 -right-8 font-display select-none"
            aria-hidden="true"
          >
            2022
          </span>

          <p
            className="text-sm font-bold tracking-[0.4em] uppercase mb-4 font-mono"
            style={{ color: ERAS[2].color }}
          >
            Chapter 02
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-display tracking-tight">
            IJRDO Journal
          </h2>

          <p className="text-xl mb-6 font-medium" style={{ color: ERAS[2].color }}>
            Software Engineer
          </p>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl ml-auto">
            Architected large-scale React and Next.js applications. Led technical direction
            for front-end features and established modern development standards.
          </p>

          <div className="flex justify-end">
            <ProjectCard
              id="dashboard"
              title="Research Dashboard"
              description="Production-grade Next.js dashboard for managing Scopus articles and academic workflows."
              tags={["Next.js", "SSR", "Dashboard"]}
              color={ERAS[2].color}
              onHover={setProjectHover}
            />
          </div>
        </AnimatedContent>
      </TimelineSection>

      <div className="h-[15vh]" aria-hidden="true" />

      {/* ================================================================== */}
      {/* 2023-PRESENT - RADIANSYS */}
      {/* ================================================================== */}
      <TimelineSection era={ERAS[3]} className="px-6 md:px-20 lg:px-32 py-20" align="left">
        <AnimatedContent className="max-w-5xl relative z-10 pointer-events-auto">
          <div className="absolute -inset-8 md:-inset-12 bg-black/60 blur-3xl -z-10 rounded-full" />

          <span
            className="text-[8rem] md:text-[12rem] font-bold opacity-[0.03] absolute -top-16 -left-8 font-display select-none"
            aria-hidden="true"
          >
            2023
          </span>

          <p
            className="text-sm font-bold tracking-[0.4em] uppercase mb-4 font-mono"
            style={{ color: ERAS[3].color }}
          >
            Chapter 03
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-display tracking-tight">
            Radiansys Technologies
          </h2>

          <p className="text-xl mb-6 font-medium" style={{ color: ERAS[3].color }}>
            Senior Software Engineer
          </p>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl">
            Directing technical architecture for mission-critical features. Solving high-complexity
            performance bottlenecks and building resilient end-to-end systems.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ProjectCard
              id="vfxai"
              title="VFXAI Video Editor"
              description="Frame-accurate timeline, Fabric.js implementation, and real-time collaboration."
              tags={["React", "Fabric.js", "CRDT"]}
              color="#ff00ff"
              onHover={setProjectHover}
            />
            <ProjectCard
              id="simplr"
              title="Simplr Chat"
              description="Custom WebSocket client with message virtualization and real-time state sync."
              tags={["WebSocket", "React", "Perf"]}
              color="#00ffff"
              onHover={setProjectHover}
            />
            <ProjectCard
              id="gitsy"
              title="Gitsy PWA"
              description="WebAuthn biometric authentication with offline-first service worker sync."
              tags={["PWA", "Biometrics", "SW"]}
              color="#ffff00"
              onHover={setProjectHover}
            />
          </div>
        </AnimatedContent>
      </TimelineSection>

      <div className="h-[15vh]" aria-hidden="true" />

      {/* ================================================================== */}
      {/* TECHNICAL ARSENAL */}
      {/* ================================================================== */}
      <TimelineSection era={ERAS[4]} className="px-6 md:px-20 lg:px-32 py-20" align="center" id="skills">
        <AnimatedContent className="max-w-5xl relative z-10 pointer-events-auto text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-400/5 blur-[150px] -z-10 rounded-full" />

          <span
            className="text-[10rem] md:text-[16rem] font-bold opacity-[0.02] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display pointer-events-none select-none"
            aria-hidden="true"
          >
            STACK
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-16 font-display tracking-tight">
            Technical Arsenal
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 text-left">
            <SkillCategory title="Core" skills={["TypeScript", "React", "Next.js"]} color="#00f0ff" />
            <SkillCategory title="State" skills={["Redux", "Zustand", "React Query"]} color="#ff00ff" />
            <SkillCategory title="Styling" skills={["Tailwind", "CSS Modules", "Framer"]} color="#ffff00" />
            <SkillCategory title="Tools" skills={["Firebase", "Jest", "Storybook"]} color="#00ff88" />
          </div>

          <div className="inline-flex flex-col md:flex-row items-center gap-6 p-8 border border-white/5 rounded-2xl bg-white/[0.02]">
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-1 font-display uppercase tracking-wider">
                B.Tech Electrical Engineering
              </h3>
              <p className="text-cyan-400 font-mono text-base md:text-lg font-medium">
                Deenbandhu Chhotu Ram University
              </p>
            </div>
            <div className="h-px w-10 bg-white/10 hidden md:block" />
            <div className="text-gray-500 font-mono text-base md:text-lg uppercase tracking-widest whitespace-nowrap">
              2018 — 2022
            </div>
          </div>
        </AnimatedContent>
      </TimelineSection>

      <div className="h-[15vh]" aria-hidden="true" />

      {/* ================================================================== */}
      {/* CONTACT - FUTURE */}
      {/* ================================================================== */}
      <TimelineSection era={ERAS[5]} className="px-6 md:px-20 lg:px-32 py-20" align="center" id="contact">
        <AnimatedContent className="max-w-4xl relative z-10 pointer-events-auto text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 blur-[120px] -z-10 rounded-full" />

          <span className="text-lg md:text-xl font-bold tracking-[0.5em] uppercase text-gray-500 mb-6 block font-mono">
            The Next Era
          </span>

          <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-10 tracking-tighter font-display">
            <span className="block italic opacity-40">Ready to</span>
            <span className="block gradient-text">Collaborate?</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-14 max-w-2xl mx-auto leading-relaxed">
            I&apos;m always looking for ambitious projects and bold ideas. If you have one, let&apos;s talk.
          </p>

          <a
            href="mailto:suraj17054209@gmail.com"
            className="group relative inline-flex items-center gap-4 text-2xl md:text-4xl lg:text-5xl font-bold transition-all hover-target"
          >
            <span className="relative z-10">suraj17054209@gmail.com</span>
            <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform text-cyan-400" />
            <div className="absolute -bottom-2 left-0 w-0 h-1 bg-cyan-400 transition-all duration-500 group-hover:w-full" />
          </a>

          <div className="flex justify-center gap-8 mt-20">
            <SocialLink href="https://github.com/surajkumar85" icon={<Github className="w-5 h-5" />} label="GitHub" />
            <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
            <SocialLink href="mailto:suraj17054209@gmail.com" icon={<Mail className="w-5 h-5" />} label="Email" />
          </div>

          <p className="text-gray-600 mt-28 text-xs tracking-[0.4em] uppercase font-bold">
            © {new Date().getFullYear()} Designed & Developed by Suraj Kumar
          </p>
        </AnimatedContent>
      </TimelineSection>

      {/* Final spacer for scroll */}
      <div className="h-screen" aria-hidden="true" />
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color?: string;
  onHover?: (id: string | null) => void;
}

function ProjectCard({ id, title, description, tags, color = "#00f0ff", onHover }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className="group p-5 border border-white/10 rounded-xl cursor-pointer hover-target"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
      }}
      onHoverStart={() => onHover?.(id)}
      onHoverEnd={() => onHover?.(null)}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02, borderColor: `${color}40` }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors font-display">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded-md font-mono">
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function SkillCategory({ title, skills, color }: { title: string; skills: string[]; color: string }) {
  return (
    <div className="text-left">
      <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider font-mono" style={{ color }}>
        {title}
      </h4>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill} className="text-gray-300 text-base">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-4 border border-white/10 rounded-full hover:border-cyan-400 hover:bg-cyan-400/10 transition-all hover-target"
    >
      {icon}
    </a>
  );
}
