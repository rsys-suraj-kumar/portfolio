"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type LoadingPhase = "gather" | "pulse" | "form" | "dissolve" | "complete";

export default function LoadingScreen() {
  const { isLoading, loadingProgress, setLoading, setLoadingProgress } = useAppStore();
  const [phase, setPhase] = useState<LoadingPhase>("gather");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Skip animation for reduced motion users
  useEffect(() => {
    if (prefersReducedMotion && isLoading) {
      const timer = setTimeout(() => {
        setLoadingProgress(100);
        setPhase("complete");
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [prefersReducedMotion, isLoading, setLoading, setLoadingProgress]);

  // Particle animation effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      targetX?: number;
      targetY?: number;
      color: string;
    }

    const particles: Particle[] = [];
    const particleCount = 600;

    // Colors for temporal theme
    const colors = ["#00f0ff", "#7b2cbf", "#ff6b35", "#ffffff"];

    // Initialize particles at center
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Get text pixel positions for "SK" formation
    ctx.font = `bold ${Math.min(canvas.width * 0.25, 200)}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText("SK", centerX, centerY);

    const textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find text pixels (sampling for performance)
    const textPixels: { x: number; y: number }[] = [];
    const sampleRate = 3;
    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const i = (y * canvas.width + x) * 4;
        if (textImageData.data[i + 3] > 128) {
          textPixels.push({ x, y });
        }
      }
    }

    // Assign targets to particles
    particles.forEach((p, i) => {
      if (i < textPixels.length) {
        p.targetX = textPixels[i].x;
        p.targetY = textPixels[i].y;
      }
    });

    let frame = 0;
    let currentPhase: LoadingPhase = "gather";
    let animationId: number;

    const animate = () => {
      // Clear with fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      // Phase transitions
      if (frame === 20 && currentPhase === "gather") {
        currentPhase = "pulse";
        setPhase("pulse");
        // Explode outward
        particles.forEach((p) => {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 12 + 4;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
        });
      }

      if (frame === 70 && currentPhase === "pulse") {
        currentPhase = "form";
        setPhase("form");
      }

      if (frame === 180 && currentPhase === "form") {
        currentPhase = "dissolve";
        setPhase("dissolve");
      }

      if (frame === 260) {
        currentPhase = "complete";
        setPhase("complete");
        setLoading(false);
        cancelAnimationFrame(animationId);
        return;
      }

      // Update and draw particles
      particles.forEach((p) => {
        if (currentPhase === "gather") {
          // Slight glow at center
          p.alpha = 0.4 + Math.sin(frame * 0.15) * 0.2;
        } else if (currentPhase === "pulse") {
          // Move outward with friction
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
        } else if (currentPhase === "form") {
          // Move toward text formation
          if (p.targetX !== undefined && p.targetY !== undefined) {
            p.x += (p.targetX - p.x) * 0.06;
            p.y += (p.targetY - p.y) * 0.06;
          }
          p.alpha = 0.8;
        } else if (currentPhase === "dissolve") {
          // Dissolve toward center and fade
          p.x += (centerX - p.x) * 0.03 + (Math.random() - 0.5) * 3;
          p.y += (centerY - p.y) * 0.03 + (Math.random() - 0.5) * 3;
          p.alpha *= 0.96;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Update loading progress
      setLoadingProgress(Math.min(100, (frame / 260) * 100));

      animationId = requestAnimationFrame(animate);
    };

    // Start after brief delay
    const startTimer = setTimeout(() => {
      animate();
    }, 400);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion, setLoading, setLoadingProgress]);

  // Phase labels
  const phaseLabels: Record<LoadingPhase, string> = {
    gather: "Gathering time...",
    pulse: "Expanding...",
    form: "Forming identity...",
    dissolve: "Entering timeline...",
    complete: "Ready",
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {/* Particle canvas */}
          {!prefersReducedMotion && (
            <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
          )}

          {/* Reduced motion fallback */}
          {prefersReducedMotion && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 animate-pulse" />
              <span className="text-2xl font-display font-bold">SK</span>
            </div>
          )}

          {/* Progress bar and status */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400"
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-xs text-white/40 tracking-[0.3em] uppercase font-mono">
              {phaseLabels[phase]}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
