"use client";

import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  ArrowDown,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Overlay() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-10">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-6 z-50">
        <div className="text-xl font-bold tracking-tight">SURAJ KUMAR</div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a
            href="#experience"
            className="hover:text-blue-400 transition-colors"
          >
            Experience
          </a>
          <a href="#projects" className="hover:text-blue-400 transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-blue-400 transition-colors">
            Skills
          </a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 pt-20">
        <div
          className="max-w-3xl"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 500),
          }}
        >
          <div className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wide uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            Senior Software Engineer
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Building Scalable
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Web Architectures
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-8 leading-relaxed">
            Specializing in high-performance React &amp; Next.js applications.
            Solving performance-sensitive problems end-to-end.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all"
            >
              View Projects
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen px-8 md:px-20 py-32">
        <div
          style={{
            transform: `translateY(${Math.max(0, 100 - (scrollY - 400) * 0.2)}px)`,
            opacity: Math.min(1, (scrollY - 300) / 300),
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16">Experience</h2>
          <div className="space-y-12 max-w-4xl">
            <ExperienceCard
              company="Radiansys Technologies"
              role="Senior Software Engineer"
              period="Sept 2023 – Present"
              description="Worked across multiple large-scale React and Next.js applications, owning architecture-heavy features and solving performance-sensitive problems end-to-end. Partnered closely with backend, design, and PM teams to deliver features efficiently."
            />
            <ExperienceCard
              company="IJRDO Journal"
              role="Software Engineer"
              period="June 2022 – Sept 2023"
              description="Architected and developed React and Next.js applications with scalable structures and reusable component systems. Led technical direction for front-end features, mentored junior developers, and improved sprint estimation."
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen px-8 md:px-20 py-32 bg-white/5"
      >
        <div
          style={{
            transform: `translateY(${Math.max(0, 100 - (scrollY - 1000) * 0.15)}px)`,
            opacity: Math.min(1, (scrollY - 900) / 300),
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Project Highlights
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            <ProjectCard
              title="VFXAI Web Video Editor"
              description="Built a frame-accurate ticker for synchronizing playback. Integrated Fabric.js with custom rendering pipeline. Implemented CRDT + OT collaboration for real-time multiplayer editing."
              tags={["React", "Fabric.js", "CRDT", "WebSocket"]}
            />
            <ProjectCard
              title="Simplr Chat App"
              description="Designed custom WebSocket client library with fine-grained control over reconnection logic. Implemented message virtualization using windowing techniques."
              tags={["WebSocket", "Virtualization", "React"]}
            />
            <ProjectCard
              title="Gitsy (PWA)"
              description="Implemented secure WebAuthn-based biometric authentication. Enhanced offline-first capabilities using service worker caching strategies and background sync."
              tags={["PWA", "WebAuthn", "Service Workers"]}
            />
            <ProjectCard
              title="Research Publishing Dashboard"
              description="Built a production-grade Next.js dashboard for managing articles. Implemented optimized SSR, advanced filtering, and modular state management."
              tags={["Next.js", "SSR", "Dashboard"]}
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen px-8 md:px-20 py-32">
        <div
          style={{
            transform: `translateY(${Math.max(0, 100 - (scrollY - 1800) * 0.15)}px)`,
            opacity: Math.min(1, (scrollY - 1700) / 300),
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Skills &amp; Education
          </h2>
          <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>
              <div className="space-y-4">
                <SkillCategory
                  title="Languages"
                  skills={["HTML5", "CSS3", "JavaScript", "TypeScript"]}
                />
                <SkillCategory
                  title="Libraries & Frameworks"
                  skills={[
                    "React.js",
                    "Next.js",
                    "Redux",
                    "Zustand",
                    "Express.js",
                  ]}
                />
                <SkillCategory
                  title="Styling"
                  skills={["Tailwind CSS", "Styled Components", "CSS Modules"]}
                />
                <SkillCategory
                  title="Tools"
                  skills={["Firebase", "Figma", "Node.js", "Jest", "Storybook"]}
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Education</h3>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h4 className="text-xl font-bold">
                  B.Tech - Electrical Engineering
                </h4>
                <p className="text-blue-400 mt-1">
                  Deenbandhu Chhotu Ram University
                </p>
                <p className="text-gray-500 text-sm mt-1">2018 – 2022</p>
                <p className="text-gray-400 mt-4 text-sm">
                  Relevant coursework: Data Structures, Algorithms, Computer
                  Systems, Machine Learning, Databases.
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Achievements</h3>
                <p className="text-gray-400">
                  Volunteered at NBA peer team visit in the Electrical
                  Engineering Department and led a team of 10 people.
                </p>
              </div>
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
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let&apos;s Work Together
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl">
            Ready to build performance-critical web applications?
          </p>
          <a
            href="mailto:suraj17054209@gmail.com"
            className="inline-block px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform"
          >
            suraj17054209@gmail.com
          </a>
          <div className="flex justify-center gap-6 mt-12">
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
            <SocialLink
              href="tel:+919306385785"
              icon={<Phone className="w-6 h-6" />}
            />
          </div>
          <p className="text-gray-600 mt-16 text-sm">
            © {new Date().getFullYear()} Suraj Kumar. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}

function ExperienceCard({
  company,
  role,
  period,
  description,
}: {
  company: string;
  role: string;
  period: string;
  description: string;
}) {
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{company}</h3>
          <p className="text-blue-400">{role}</p>
        </div>
        <p className="text-gray-500 text-sm mt-2 md:mt-0">{period}</p>
      </div>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ProjectCard({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-gray-400 mb-6 text-sm leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 bg-white/10 rounded-full text-gray-300 border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillCategory({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all"
    >
      {icon}
    </a>
  );
}
