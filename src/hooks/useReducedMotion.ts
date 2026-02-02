"use client";

import { useEffect, useState } from "react";
import { ANIMATION_CONFIG } from "@/lib/animation/config";

/**
 * Hook to detect user's reduced motion preference
 * Automatically updates global animation config
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Check if we're in browser
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Use microtask to avoid synchronous setState in effect
    queueMicrotask(() => {
      setPrefersReduced(mediaQuery.matches);
    });

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Update global config when preference changes
  useEffect(() => {
    // Mutate the config object (it's designed for this)
    (ANIMATION_CONFIG as { timingScale: number }).timingScale = prefersReduced ? 0 : 1;
  }, [prefersReduced]);

  return prefersReduced;
}

/**
 * Get animation duration respecting reduced motion
 */
export function getAnimationDuration(baseDuration: number, prefersReduced: boolean): number {
  return prefersReduced ? 0.01 : baseDuration;
}

/**
 * Get animation config for Framer Motion respecting reduced motion
 */
export function getMotionConfig(prefersReduced: boolean) {
  if (prefersReduced) {
    return {
      initial: false,
      animate: true,
      transition: { duration: 0 },
    };
  }
  return {};
}
