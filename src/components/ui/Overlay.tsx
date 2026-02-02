"use client";

import { Github, Linkedin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const { scrollProgress, setScrollProgress, isLoading, currentEra } =
    useAppStore();
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
        <div className="text-lg font-bold tracking-tight glitch" data-text="SK">
          SK
        </div>

        <div className="flex items-center gap-8">
          {/* Era progress */}
          <div className="hidden md:flex items-center gap-2">
            {ERAS.map((era, i) => (
              <div
                key={era.year}
                className="w-8 h-0.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    scrollProgress >= era.position ? era.color : "#333",
                }}
              />
            ))}
          </div>

          <a
            href="#contact"
            className="text-sm hover:text-cyan-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div
          className="text-center max-w-4xl px-8 pointer-events-auto"
          style={{
            transform: `translateY(${scrollProgress * 100}px)`,
            opacity: Math.max(0, 1 - scrollProgress * 5),
          }}
        >
          <div className="overflow-hidden mb-6">
            <div
              className="inline-block px-4 py-2 text-xs font-semibold tracking-[0.4em] uppercase border border-white/20 rounded-full"
              style={{
                animation: "slideUp 0.8s ease forwards 0.3s",
                opacity: 0,
              }}
            >
              Scroll to travel through time
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6">
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
            className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            Senior Software Engineer crafting digital experiences
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-20 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* 2018 - The Beginning */}
      <TimelineSection era={ERAS[0]} className="px-8 md:px-20">
        <div className="max-w-2xl ml-20 md:ml-32 pointer-events-auto">
          <span className="text-8xl font-bold opacity-10 absolute -top-10 left-20">
            2018
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">The Beginning</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Started my journey into software engineering. Learning the
            fundamentals, building my first applications, and discovering the
            power of web technologies.
          </p>
          <div className="flex flex-wrap gap-3">
            {["HTML", "CSS", "JavaScript", "React"].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm border border-white/20 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </TimelineSection>

      {/* 2022 - IJRDO */}
      <TimelineSection era={ERAS[2]} className="px-8 md:px-20 items-end">
        <div className="max-w-2xl mr-20 md:mr-32 text-right pointer-events-auto">
          <span className="text-8xl font-bold opacity-10 absolute -top-10 right-20">
            2022
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">IJRDO Journal</h2>
          <p className="text-cyan-400 text-xl mb-6">Software Engineer</p>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Architected React and Next.js applications with scalable structures.
            Led technical direction for front-end features and mentored junior
            developers.
          </p>

          <ProjectCard
            title="Research Dashboard"
            description="Production-grade Next.js dashboard for managing Scopus articles"
            tags={["Next.js", "SSR", "Dashboard"]}
          />
        </div>
      </TimelineSection>

      {/* 2023-Present - Radiansys */}
      <TimelineSection era={ERAS[3]} className="px-8 md:px-20">
        <div className="max-w-3xl ml-20 md:ml-32 pointer-events-auto">
          <span className="text-8xl font-bold opacity-10 absolute -top-10 left-20">
            2023
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Radiansys Technologies
          </h2>
          <p className="text-fuchsia-400 text-xl mb-6">
            Senior Software Engineer
          </p>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Owning architecture-heavy features across large-scale React and
            Next.js applications. Solving performance-sensitive problems
            end-to-end.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <ProjectCard
              title="VFXAI Video Editor"
              description="Frame-accurate timeline, Fabric.js integration, CRDT+OT collaboration"
              tags={["React", "Fabric.js", "CRDT"]}
              color="#ff00ff"
            />
            <ProjectCard
              title="Simplr Chat"
              description="Custom WebSocket client, message virtualization, real-time sync"
              tags={["WebSocket", "React", "Virtualization"]}
              color="#00ffff"
            />
            <ProjectCard
              title="Gitsy PWA"
              description="WebAuthn biometrics, offline-first, service workers"
              tags={["PWA", "WebAuthn", "Service Workers"]}
              color="#ffff00"
            />
          </div>
        </div>
      </TimelineSection>

      {/* Present & Skills */}
      <TimelineSection
        era={ERAS[4]}
        className="px-8 md:px-20 items-center justify-center"
      >
        <div className="max-w-4xl text-center pointer-events-auto">
          <span className="text-8xl font-bold opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            NOW
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-12">Tech Stack</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
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
              skills={["Tailwind", "CSS Modules", "Styled"]}
              color="#ffff00"
            />
            <SkillCategory
              title="Tools"
              skills={["Firebase", "Jest", "Storybook"]}
              color="#00ff88"
            />
          </div>

          {/* Education */}
          <div className="inline-block p-8 border border-white/10 rounded-2xl text-left">
            <h3 className="text-2xl font-bold mb-2">
              B.Tech - Electrical Engineering
            </h3>
            <p className="text-cyan-400">Deenbandhu Chhotu Ram University</p>
            <p className="text-gray-500 text-sm">2018 – 2022</p>
          </div>
        </div>
      </TimelineSection>

      {/* Future - Contact */}
      <TimelineSection
        era={ERAS[5]}
        className="px-8 md:px-20 items-center justify-center"
        id="contact"
      >
        <div className="max-w-3xl text-center pointer-events-auto">
          <span className="text-6xl md:text-8xl font-bold opacity-5 absolute top-1/4 left-1/2 -translate-x-1/2">
            FUTURE
          </span>

          <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter">
            <span className="block">What&apos;s</span>
            <span className="block gradient-text">Next?</span>
          </h2>

          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            The future is unwritten. Let&apos;s build something amazing
            together.
          </p>

          <a
            href="mailto:suraj17054209@gmail.com"
            className="group inline-flex items-center gap-4 text-2xl md:text-4xl font-bold hover:text-cyan-400 transition-colors hover-target"
          >
            suraj17054209@gmail.com
            <ArrowUpRight className="w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </a>

          <div className="flex justify-center gap-6 mt-16">
            <SocialLink
              href="https://github.com/surajkumar85"
              icon={<Github />}
            />
            <SocialLink href="https://linkedin.com" icon={<Linkedin />} />
            <SocialLink href="mailto:suraj17054209@gmail.com" icon={<Mail />} />
            <SocialLink href="tel:+919306385785" icon={<Phone />} />
          </div>

          <p className="text-gray-700 mt-24 text-sm tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Suraj Kumar
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
