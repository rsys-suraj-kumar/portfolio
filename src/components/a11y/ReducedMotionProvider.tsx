"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAppStore } from "@/stores/useAppStore";

interface ReducedMotionContextType {
  prefersReducedMotion: boolean;
  toggleReducedMotion: () => void;
  forceReducedMotion: boolean;
  setForceReducedMotion: (force: boolean) => void;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  prefersReducedMotion: false,
  toggleReducedMotion: () => {},
  forceReducedMotion: false,
  setForceReducedMotion: () => {},
});

export function useReducedMotionContext() {
  return useContext(ReducedMotionContext);
}

interface ReducedMotionProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages reduced motion preferences
 * - Detects system preference
 * - Allows user override
 * - Syncs with global app store
 */
export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  const [systemPreference, setSystemPreference] = useState(false);
  const [forceReducedMotion, setForceReducedMotion] = useState(false);
  const { setPrefersReducedMotion } = useAppStore();

  // Detect system preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Use callback to avoid setState in effect body
    const checkPreference = () => {
      setSystemPreference(mediaQuery.matches);
    };
    
    // Initial check via microtask to avoid synchronous setState
    queueMicrotask(checkPreference);

    const handler = (event: MediaQueryListEvent) => {
      setSystemPreference(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Combined preference (system OR user override)
  const prefersReducedMotion = systemPreference || forceReducedMotion;

  // Sync with global store
  useEffect(() => {
    setPrefersReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion, setPrefersReducedMotion]);

  // Apply CSS class to html element
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [prefersReducedMotion]);

  const toggleReducedMotion = () => {
    setForceReducedMotion((prev) => !prev);
  };

  return (
    <ReducedMotionContext.Provider
      value={{
        prefersReducedMotion,
        toggleReducedMotion,
        forceReducedMotion,
        setForceReducedMotion,
      }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}

/**
 * Toggle button for reduced motion
 * Allows users to manually enable/disable motion
 */
export function ReducedMotionToggle() {
  const { prefersReducedMotion, toggleReducedMotion, forceReducedMotion } = useReducedMotionContext();

  return (
    <button
      onClick={toggleReducedMotion}
      aria-pressed={forceReducedMotion}
      aria-label={prefersReducedMotion ? "Enable animations" : "Reduce motion"}
      className="
        fixed bottom-4 left-4 z-50 
        p-3 rounded-full 
        border border-white/20 
        bg-black/50 backdrop-blur-sm
        hover:border-cyan-400 
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
      "
      title={prefersReducedMotion ? "Enable animations" : "Reduce motion"}
    >
      {prefersReducedMotion ? (
        // Play icon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ) : (
        // Pause icon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      )}
    </button>
  );
}
