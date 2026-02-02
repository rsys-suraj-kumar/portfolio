"use client";

import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAppStore, ERAS } from "@/stores/useAppStore";

// Timeline Section Component
function TimelineSection({
  era,
  children,
  className = "",
  id,
}: {
  era: (typeof ERAS)[0];
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { currentEra } = useAppStore();
  const isActive = currentEra?.year === era.year;

  return (
    <section
      id={id || `era-${era.year}`}
      className={`min-h-screen relative flex items-center ${className}`}
      style={{
        opacity: isActive ? 1 : 0.3,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Era indicator */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4">
        <div
          className="w-3 h-3 rounded-full transition-all duration-500"
          style={{
            backgroundColor: era.color,
            boxShadow: isActive ? `0 0 20px ${era.color}` : "none",
          }}
        />
        <span
          className="text-xs tracking-[0.3em] uppercase origin-center -rotate-90 whitespace-nowrap transition-colors duration-500"
          style={{ color: isActive ? era.color : "#666" }}
        >
          {era.year}
        </span>
      </div>

      {children}
    </section>
  );
}

export default function Overlay() {
  const { scrollProgress, setScrollProgress, isLoading } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  if (isLoading) return null;

  return (
    <div ref={containerRef} className="relative z-10 pointer-events-none">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-6 z-50 pointer-events-auto">
        <div className="text-xl font-bold tracking-tight font-display">
          SK<span className="text-cyan-400">.</span>
        </div>

        <div className="flex items-center gap-12">
          {/* Era progress */}
          <div className="hidden md:flex items-center gap-4">
            {ERAS.map((era) => (
              <div
                key={era.year}
                className="w-12 h-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor:
                    scrollProgress >= era.position
                      ? era.color
                      : "rgba(255,255,255,0.05)",
                  boxShadow:
                    scrollProgress >= era.position
                      ? `0 0 10px ${era.color}`
                      : "none",
                }}
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

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        {/* Subtle Backdrop for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

        <div
          className="text-center max-w-5xl px-8 pointer-events-auto relative z-10"
          style={{
            transform: `translateY(${scrollProgress * 50}px)`,
            opacity: Math.max(0, 1 - scrollProgress * 4),
          }}
        >
          <div className="overflow-hidden mb-8">
            <span
              className="inline-block px-6 py-2 text-xs font-bold tracking-[0.5em] uppercase border border-white/10 rounded-full bg-white/5"
              style={{
                animation: "slideUp 0.8s ease forwards 0.3s",
                opacity: 0,
              }}
            >
              The Architecture of Time
            </span>
          </div>

          <h1 className="text-8xl md:text-10xl font-bold tracking-tighter mb-8 font-display">
            <span className="block overflow-hidden">
              <span
                className="block animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                SURAJ
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="block gradient-text animate-slide-up"
                style={{ animationDelay: "0.7s" }}
              >
                KUMAR
              </span>
            </span>
          </h1>

          <p
            className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto animate-fade-in leading-relaxed"
            style={{ animationDelay: "1s" }}
          >
            Senior Software Engineer crafting{" "}
            <span className="text-white">high-performance</span> digital
            products and creative experiences.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-500">
            Scroll
          </span>
          <div className="w-px h-16 bg-linear-to-b from-white to-transparent" />
        </div>
      </section>

      {/* 2018 - The Beginning */}
      <TimelineSection era={ERAS[0]} className="px-8 md:px-32">
        <div className="max-w-3xl relative z-10 pointer-events-auto">
          {/* Content Backdrop */}
          <div className="absolute -inset-12 bg-black/40 blur-3xl -z-10 rounded-full" />

          <span className="text-9xl font-bold opacity-5 absolute -top-20 -left-10 font-display">
            2018
          </span>
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: ERAS[0].color }}
          >
            Chapter 01
          </p>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 font-display">
            The Beginning
          </h2>
          <p className="text-gray-400 text-xl leading-relaxed mb-10 max-w-xl">
            My journey began at the intersection of curiosity and code. While
            studying Electrical Engineering, I discovered the infinite creative
            potential of the web.
          </p>
          <div className="flex flex-wrap gap-4">
            {["React", "JavaScript", "Node.js", "Electrical Engineering"].map(
              (skill) => (
                <span
                  key={skill}
                  className="px-5 py-2 text-xs font-bold border border-white/10 rounded-full bg-white/5 uppercase tracking-widest text-gray-300"
                >
                  {skill}
                </span>
              ),
            )}
          </div>
        </div>
      </TimelineSection>

      <div className="h-[20vh]" />

      {/* 2022 - IJRDO */}
      <TimelineSection era={ERAS[2]} className="px-8 md:px-32 items-end">
        <div className="max-w-3xl text-right relative z-10 pointer-events-auto">
          {/* Content Backdrop */}
          <div className="absolute -inset-12 bg-black/40 blur-3xl -z-10 rounded-full" />

          <span className="text-9xl font-bold opacity-5 absolute -top-20 -right-10 font-display">
            2022
          </span>
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: ERAS[2].color }}
          >
            Chapter 02
          </p>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 font-display">
            IJRDO Journal
          </h2>
          <p className="text-cyan-400 text-xl mb-8 font-medium">
            Software Engineer
          </p>
          <p className="text-gray-400 text-xl leading-relaxed mb-10 max-w-xl ml-auto">
            Architected large-scale React and Next.js applications. Led
            technical direction for front-end features and established modern
            development standards.
          </p>

          <div className="flex justify-end">
            <ProjectCard
              title="Research Dashboard"
              description="Production-grade Next.js dashboard for managing Scopus articles and academic workflows."
              tags={["Next.js", "SSR", "Dashboard"]}
              color={ERAS[2].color}
            />
          </div>
        </div>
      </TimelineSection>

      <div className="h-[20vh]" />

      {/* 2023-Present - Radiansys */}
      <TimelineSection era={ERAS[3]} className="px-8 md:px-32">
        <div className="max-w-4xl relative z-10 pointer-events-auto">
          {/* Content Backdrop */}
          <div className="absolute -inset-12 bg-black/40 blur-3xl -z-10 rounded-full" />

          <span className="text-9xl font-bold opacity-5 absolute -top-20 -left-10 font-display">
            2023
          </span>
          <p
            className="text-sm font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: ERAS[3].color }}
          >
            Chapter 03
          </p>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 font-display">
            Radiansys Technologies
          </h2>
          <p className="text-fuchsia-400 text-xl mb-8 font-medium">
            Senior Software Engineer
          </p>
          <p className="text-gray-400 text-xl leading-relaxed mb-12 max-w-2xl">
            Directing technical architecture for mission-critical features.
            Solving high-complexity performance bottlenecks and building
            resilient end-to-end systems.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="VFXAI Video Editor"
              description="Frame-accurate timeline, Fabric.js implementation, and real-time collaboration."
              tags={["React", "Fabric.js", "CRDT"]}
              color="#ff00ff"
            />
            <ProjectCard
              title="Simplr Chat"
              description="Custom WebSocket client with message virtualization and real-time state sync."
              tags={["WebSocket", "React", "Perf"]}
              color="#00ffff"
            />
            <ProjectCard
              title="Gitsy PWA"
              description="WebAuthn biometric authentication with offline-first service worker sync."
              tags={["PWA", "Biometrics", "SW"]}
              color="#ffff00"
            />
          </div>
        </div>
      </TimelineSection>

      <div className="h-[20vh]" />

      {/* Tech Stack */}
      <TimelineSection
        era={ERAS[4]}
        className="px-8 md:px-32 items-center justify-center"
      >
        <div className="max-w-5xl text-center relative z-10 pointer-events-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-400/5 blur-[120px] -z-10 rounded-full" />

          <span className="text-[12rem] font-bold opacity-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display pointer-events-none">
            STACK
          </span>
          <h2 className="text-5xl md:text-8xl font-bold mb-16 font-display tracking-tight">
            Technical Arsenal
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <SkillCategory
              title="Core"
              skills={["TypeScript", "React", "Next.js"]}
              color="#00f0ff"
            />
            <SkillCategory
              title="State"
              skills={["Redux", "Zustand", "React Query"]}
              color="#ff00ff"
            />
            <SkillCategory
              title="Styling"
              skills={["Tailwind", "CSS Modules", "Framer"]}
              color="#ffff00"
            />
            <SkillCategory
              title="Tools"
              skills={["Firebase", "Jest", "Storybook"]}
              color="#00ff88"
            />
          </div>

          <div className="inline-flex flex-col md:flex-row items-center gap-8 p-10 border border-white/5 rounded-3xl bg-white/2">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2 font-display uppercase tracking-wider">
                B.Tech Electrical Engineering
              </h3>
              <p className="text-cyan-400 font-mono text-lg font-medium">
                Deenbandhu Chhotu Ram University
              </p>
            </div>
            <div className="h-px w-12 bg-white/10 hidden md:block" />
            <div className="text-gray-500 font-mono text-lg uppercase tracking-widest whitespace-nowrap">
              2018 — 2022
            </div>
          </div>
        </div>
      </TimelineSection>

      <div className="h-[20vh]" />

      {/* Future - Contact */}
      <TimelineSection
        era={ERAS[5]}
        className="px-8 md:px-32 items-center justify-center"
        id="contact"
      >
        <div className="max-w-4xl text-center relative z-10 pointer-events-auto">
          {/* Subtle glow behind contact */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 blur-[100px] -z-10 rounded-full" />

          <span className="text-xl font-bold tracking-[0.5em] uppercase text-gray-500 mb-8 block font-mono">
            The Next Era
          </span>

          <h2 className="text-6xl md:text-9xl font-bold mb-12 tracking-tighter font-display">
            <span className="block italic opacity-40">Ready to</span>
            <span className="block gradient-text">Collaborate?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            I&apos;m always looking for ambitious projects and bold ideas. If
            you have one, let&apos;s talk.
          </p>

          <a
            href="mailto:suraj17054209@gmail.com"
            className="group relative inline-flex items-center gap-6 text-3xl md:text-5xl font-bold transition-all hover-target"
          >
            <span className="relative z-10">suraj17054209@gmail.com</span>
            <ArrowUpRight className="w-10 h-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform text-cyan-400" />
            <div className="absolute -bottom-2 left-0 w-0 h-1 bg-cyan-400 transition-all duration-500 group-hover:w-full" />
          </a>

          <div className="flex justify-center gap-10 mt-24">
            <SocialLink
              href="https://github.com/surajkumar85"
              icon={<Github className="w-6 h-6" />}
            />
            <SocialLink
              href="https://linkedin.com"
              icon={<Linkedin className="w-6 h-6" />}
            />
            <SocialLink
              href="mailto:suraj17054209@gmail.com"
              icon={<Mail className="w-6 h-6" />}
            />
          </div>

          <p className="text-gray-600 mt-32 text-xs tracking-[0.4em] uppercase font-bold">
            © {new Date().getFullYear()} DESIGNED & DEVELOPED BY SURAJ KUMAR
          </p>
        </div>
      </TimelineSection>

      {/* Spacer for scroll */}
      <div className="h-screen" />
    </div>
  );
}

function ProjectCard({
  title,
  description,
  tags,
  color = "#00f0ff",
}: {
  title: string;
  description: string;
  tags: string[];
  color?: string;
}) {
  return (
    <div
      className="group p-6 border border-white/10 rounded-xl hover:border-white/30 transition-all cursor-pointer hover-target"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, transparent 50%)`,
      }}
    >
      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillCategory({
  title,
  skills,
  color,
}: {
  title: string;
  skills: string[];
  color: string;
}) {
  return (
    <div className="text-left">
      <h4
        className="text-sm font-semibold mb-3 uppercase tracking-wider"
        style={{ color }}
      >
        {title}
      </h4>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill} className="text-gray-300">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 border border-white/10 rounded-full hover:border-cyan-400 hover:bg-cyan-400/10 transition-all hover-target"
    >
      {icon}
    </a>
  );
}
