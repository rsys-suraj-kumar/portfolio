"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";

export default function Overlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 sm:p-20 overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center z-10 pointer-events-auto"
      >
        <div className="text-xl font-bold tracking-tighter">SURAJ KUMAR</div>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-gray-400 transition-colors">
            Work
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            Contact
          </a>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pointer-events-auto"
        >
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            Frontend Developer
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
            Crafting <br />
            Digital Experiences
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-lg mb-8 leading-relaxed">
            With 3.6 years of experience building award-winning web
            applications. Specializing in React, Next.js, and immersive 3D
            interfaces.
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all pointer-events-auto"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full font-medium hover:bg-white/20 transition-all pointer-events-auto"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-between items-end z-10 pointer-events-auto"
      >
        <div className="flex gap-4">
          <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
          <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
          <SocialLink href="#" icon={<Mail className="w-5 h-5" />} />
        </div>

        <div className="text-xs text-gray-500 text-right">
          <p>© {new Date().getFullYear()} Suraj Kumar.</p>
          <p>Made with Next.js & R3F.</p>
        </div>
      </motion.footer>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-110 transition-all"
    >
      {icon}
    </a>
  );
}
