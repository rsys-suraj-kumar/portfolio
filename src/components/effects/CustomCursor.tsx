"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";

export default function CustomCursor() {
  const { setCursorPosition } = useAppStore();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Check for touch support
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      if (cursorDotRef.current) cursorDotRef.current.style.display = "none";
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setCursorPosition({ x: mouseX, y: mouseY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest(".hover-target") ||
        target.closest("[data-cursor='pointer']")
      ) {
        isHoveringRef.current = true;
        cursorRef.current?.classList.add("hovering");
      }
    };

    const handleMouseOut = () => {
      isHoveringRef.current = false;
      cursorRef.current?.classList.remove("hovering");
    };

    // Smooth cursor animation
    const animate = () => {
      // Smooth follow
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [setCursorPosition]);

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998] mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="w-full h-full rounded-full border-2 border-white transition-all duration-200 ease-out">
          <div className="absolute inset-0 rounded-full border border-white/30 scale-150 opacity-0 transition-opacity duration-200 cursor-hover:opacity-100" />
        </div>
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9998] mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </div>

      {/* Global cursor hiding */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }

        .hovering {
          width: 60px !important;
          height: 60px !important;
        }

        .hovering > div {
          border-color: #00f0ff !important;
          background: rgba(0, 240, 255, 0.1);
        }
      `}</style>
    </>
  );
}
