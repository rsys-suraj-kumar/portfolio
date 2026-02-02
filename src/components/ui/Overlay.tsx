"use client";

import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Overlay() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const progress =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hover detection for interactive elements
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest(".hover-target")
      ) {
        setIsHovering(true);
      }
    };
    const handleMouseOut = () => setIsHovering(false);

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <div className={`loading-screen ${isLoaded ? "hidden" : ""}`}>
        <div className="loader" />
      </div>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""}`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorDotRef}
        className="cursor-dot"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Scroll Progress Indicator */}
      <div
        className="scroll-indicator"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      <div className="relative z-10">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-6 z-50 mix-blend-difference">
          <div
            className="glitch text-xl font-bold tracking-tight"
            data-text="SURAJ KUMAR"
          >
            SURAJ KUMAR
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wider">
            <a
              href="#experience"
              className="hover:text-cyan-400 transition-all duration-300 hover-target"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="hover:text-cyan-400 transition-all duration-300 hover-target"
            >
              Projects
            </a>
            <a
              href="#skills"
              className="hover:text-cyan-400 transition-all duration-300 hover-target"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="hover:text-cyan-400 transition-all duration-300 hover-target"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 pt-20 relative">
          <div
            className="max-w-4xl"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: Math.max(0, 1 - scrollY / 400),
            }}
          >
            <div className="overflow-hidden mb-6">
              <div
                className="inline-block px-4 py-2 text-sm font-semibold tracking-[0.3em] uppercase border border-cyan-400/30 rounded-full backdrop-blur-sm"
                style={{
                  animation: isLoaded
                    ? "split-reveal 0.8s forwards 0.5s"
                    : "none",
                  opacity: isLoaded ? 1 : 0,
                }}
              >
                Senior Software Engineer
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                    transition:
                      "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                  }}
                >
                  Building
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block gradient-text"
                  style={{
                    transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                    transition:
                      "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                  }}
                >
                  Digital
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                    transition:
                      "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
                  }}
                >
                  Experiences
                </span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-gray-400 max-w-xl mb-12 leading-relaxed"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1s",
              }}
            >
              Crafting high-performance React &amp; Next.js applications.
              <br />
              <span className="text-cyan-400">3+ years</span> of solving complex
              problems.
            </p>

            <div
              className="flex flex-wrap gap-6"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s",
              }}
            >
              <a href="#contact" className="magnetic-btn hover-target">
                Get in Touch
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </a>
              <a href="#projects" className="magnetic-btn hover-target">
                View Work
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 1s ease 1.5s",
            }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Scroll
            </span>
            <div className="w-px h-16 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="min-h-screen px-8 md:px-20 py-32">
          <div
            style={{
              transform: `translateY(${Math.max(0, 80 - (scrollY - 400) * 0.15)}px)`,
              opacity: Math.min(1, (scrollY - 300) / 300),
            }}
          >
            <div className="flex items-center gap-4 mb-16">
              <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase">
                01
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                Experience
              </h2>
            </div>

            <div className="space-y-8 max-w-4xl">
              <ExperienceCard
                index="01"
                company="Radiansys Technologies"
                role="Senior Software Engineer"
                period="Sept 2023 – Present"
                description="Architected large-scale React and Next.js applications. Owned architecture-heavy features and solved performance-sensitive problems end-to-end. Led cross-functional collaboration with backend, design, and PM teams."
                highlights={["Architecture", "Performance", "Leadership"]}
              />
              <ExperienceCard
                index="02"
                company="IJRDO Journal"
                role="Software Engineer"
                period="June 2022 – Sept 2023"
                description="Built scalable React and Next.js applications with reusable component systems. Led technical direction for front-end features and mentored junior developers."
                highlights={["React", "Next.js", "Mentorship"]}
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen px-8 md:px-20 py-32">
          <div
            style={{
              transform: `translateY(${Math.max(0, 80 - (scrollY - 1000) * 0.12)}px)`,
              opacity: Math.min(1, (scrollY - 900) / 300),
            }}
          >
            <div className="flex items-center gap-4 mb-16">
              <span className="text-magenta-400 text-sm tracking-[0.3em] uppercase text-fuchsia-400">
                02
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                Projects
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl">
              <ProjectCard
                title="VFXAI Video Editor"
                description="Frame-accurate timeline, Fabric.js integration, CRDT + OT for real-time multiplayer editing similar to Figma's architecture."
                tags={["React", "Fabric.js", "CRDT", "WebSocket"]}
                number="01"
              />
              <ProjectCard
                title="Simplr Chat"
                description="Custom WebSocket client library with reconnection logic, message virtualization using windowing techniques for infinite scroll."
                tags={["WebSocket", "Virtualization", "React"]}
                number="02"
              />
              <ProjectCard
                title="Gitsy PWA"
                description="WebAuthn biometric authentication, offline-first with service workers, background sync, optimized mobile performance."
                tags={["PWA", "WebAuthn", "Service Workers"]}
                number="03"
              />
              <ProjectCard
                title="Research Dashboard"
                description="Production-grade Next.js dashboard for Scopus articles with SSR, advanced filtering, and modular state management."
                tags={["Next.js", "SSR", "Dashboard"]}
                number="04"
              />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="min-h-screen px-8 md:px-20 py-32">
          <div
            style={{
              transform: `translateY(${Math.max(0, 80 - (scrollY - 1800) * 0.12)}px)`,
              opacity: Math.min(1, (scrollY - 1700) / 300),
            }}
          >
            <div className="flex items-center gap-4 mb-16">
              <span className="text-yellow-400 text-sm tracking-[0.3em] uppercase">
                03
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                Skills
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
              <SkillCard
                title="Languages"
                skills={["TypeScript", "JavaScript", "HTML5", "CSS3"]}
                color="cyan"
              />
              <SkillCard
                title="Frameworks"
                skills={["React.js", "Next.js", "Express.js", "Node.js"]}
                color="fuchsia"
              />
              <SkillCard
                title="State & Tools"
                skills={["Redux", "Zustand", "Firebase", "Jest", "Storybook"]}
                color="yellow"
              />
            </div>

            {/* Education */}
            <div className="mt-24 max-w-2xl">
              <h3 className="text-3xl font-bold mb-8">Education</h3>
              <div className="hover-card p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-bold">
                      B.Tech - Electrical Engineering
                    </h4>
                    <p className="text-cyan-400 mt-1">
                      Deenbandhu Chhotu Ram University
                    </p>
                  </div>
                  <span className="text-gray-500">2018 – 2022</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Relevant coursework: Data Structures, Algorithms, Computer
                  Systems, Machine Learning, Databases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="min-h-screen px-8 md:px-20 py-32 flex flex-col justify-center items-center text-center"
        >
          <div
            style={{
              transform: `translateY(${Math.max(0, 50 - (scrollY - 2500) * 0.1)}px)`,
              opacity: Math.min(1, (scrollY - 2400) / 300),
            }}
          >
            <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase mb-4 block">
              04 / Contact
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8">
              <span className="block">Let&apos;s Build</span>
              <span className="block gradient-text">Something</span>
              <span className="block">Amazing</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-xl">
              Ready to create the next big thing together?
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
                icon={<Github className="w-6 h-6" />}
                label="GitHub"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={<Linkedin className="w-6 h-6" />}
                label="LinkedIn"
              />
              <SocialLink
                href="mailto:suraj17054209@gmail.com"
                icon={<Mail className="w-6 h-6" />}
                label="Email"
              />
              <SocialLink
                href="tel:+919306385785"
                icon={<Phone className="w-6 h-6" />}
                label="Phone"
              />
            </div>

            <p className="text-gray-600 mt-24 text-sm tracking-wider uppercase">
              © {new Date().getFullYear()} Suraj Kumar
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function ExperienceCard({
  index,
  company,
  role,
  period,
  description,
  highlights,
}: {
  index: string;
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      className="hover-card p-8 md:p-10 hover-target"
      onMouseMove={handleMouseMove}
      style={
        {
          "--cursor-x": `${mousePos.x}%`,
          "--cursor-y": `${mousePos.y}%`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-6xl font-bold text-white/5">{index}</span>
        <span className="text-gray-500 text-sm">{period}</span>
      </div>
      <h3 className="text-3xl font-bold mb-2">{company}</h3>
      <p className="text-cyan-400 mb-4">{role}</p>
      <p className="text-gray-400 leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap gap-2">
        {highlights.map((h) => (
          <span
            key={h}
            className="px-3 py-1 text-xs uppercase tracking-wider border border-white/10 rounded-full"
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({
  title,
  description,
  tags,
  number,
}: {
  title: string;
  description: string;
  tags: string[];
  number: string;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      className="hover-card p-8 group hover-target"
      onMouseMove={handleMouseMove}
      style={
        {
          "--cursor-x": `${mousePos.x}%`,
          "--cursor-y": `${mousePos.y}%`,
        } as React.CSSProperties
      }
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-5xl font-bold text-white/5">{number}</span>
        <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 mb-6 text-sm leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-300 border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillCard({
  title,
  skills,
  color,
}: {
  title: string;
  skills: string[];
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "border-cyan-400/30 hover:border-cyan-400",
    fuchsia: "border-fuchsia-400/30 hover:border-fuchsia-400",
    yellow: "border-yellow-400/30 hover:border-yellow-400",
  };

  return (
    <div
      className={`p-8 border rounded-2xl transition-colors ${colorClasses[color]}`}
    >
      <h3 className="text-xl font-bold mb-6">{title}</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-${color}-400`} />
            <span className="text-gray-300">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 hover-target"
    >
      <div className="p-4 border border-white/10 rounded-full hover:border-cyan-400 hover:bg-cyan-400/10 transition-all group-hover:scale-110">
        {icon}
      </div>
      <span className="text-xs text-gray-500 group-hover:text-cyan-400 transition-colors">
        {label}
      </span>
    </a>
  );
}
