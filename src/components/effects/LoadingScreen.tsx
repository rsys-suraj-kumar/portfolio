"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";

export default function LoadingScreen() {
  const { isLoading, loadingProgress, setLoading, setLoadingProgress } =
    useAppStore();
  const [phase, setPhase] = useState<
    "particle" | "explode" | "form" | "dissolve" | "done"
  >("particle");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      targetX?: number;
      targetY?: number;
    }

    const particles: Particle[] = [];
    const particleCount = 1000;

    // Initialize particles at center
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.5,
      });
    }

    // Text to form
    const text = "SURAJ KUMAR";
    ctx.font = "bold 80px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Get text pixel data for forming name
    ctx.fillStyle = "white";
    ctx.fillText(text, centerX, centerY);
    const textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find text pixels
    const textPixels: { x: number; y: number }[] = [];
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const i = (y * canvas.width + x) * 4;
        if (textImageData.data[i + 3] > 128) {
          textPixels.push({ x, y });
        }
      }
    }

    // Assign target positions to particles
    particles.forEach((p, i) => {
      if (i < textPixels.length) {
        p.targetX = textPixels[i].x;
        p.targetY = textPixels[i].y;
      }
    });

    let frame = 0;
    let currentPhase = "particle";

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      // Phase transitions
      if (frame === 30) {
        currentPhase = "explode";
        setPhase("explode");
        // Explode outward
        particles.forEach((p) => {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 15 + 5;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
        });
      }

      if (frame === 90) {
        currentPhase = "form";
        setPhase("form");
      }

      if (frame === 200) {
        currentPhase = "dissolve";
        setPhase("dissolve");
      }

      if (frame === 280) {
        currentPhase = "done";
        setPhase("done");
        setLoading(false);
        return;
      }

      particles.forEach((p) => {
        if (currentPhase === "particle") {
          // Slight glow at center
          p.alpha = 0.3 + Math.sin(frame * 0.1) * 0.2;
        } else if (currentPhase === "explode") {
          // Move outward
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
        } else if (currentPhase === "form") {
          // Move toward target (form text)
          if (p.targetX !== undefined && p.targetY !== undefined) {
            p.x += (p.targetX - p.x) * 0.08;
            p.y += (p.targetY - p.y) * 0.08;
          }
        } else if (currentPhase === "dissolve") {
          // Dissolve into tunnel
          p.y += (canvas.height / 2 - p.y) * 0.05;
          p.x += (canvas.width / 2 - p.x) * 0.05 + (Math.random() - 0.5) * 5;
          p.alpha *= 0.95;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Color gradient based on phase
        let color = "#00f0ff";
        if (currentPhase === "explode") {
          color = `hsl(${180 + Math.random() * 60}, 100%, 50%)`;
        } else if (currentPhase === "form") {
          color = "#ffffff";
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Update loading progress
      setLoadingProgress(Math.min(100, (frame / 280) * 100));

      if (currentPhase !== "done") {
        requestAnimationFrame(animate);
      }
    };

    // Start after a brief delay
    const timer = setTimeout(() => {
      animate();
    }, 500);

    return () => clearTimeout(timer);
  }, [setLoading, setLoadingProgress]);

  if (!isLoading && phase === "done") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${
        phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-all duration-100"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <span className="mt-2 text-xs text-white/40 tracking-[0.3em] uppercase">
          {phase === "particle" && "Initializing"}
          {phase === "explode" && "Expanding"}
          {phase === "form" && "Forming"}
          {phase === "dissolve" && "Entering"}
          {phase === "done" && "Ready"}
        </span>
      </div>
    </div>
  );
}
