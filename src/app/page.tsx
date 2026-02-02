"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useWebGLSupport, canRunFullExperience } from "@/hooks/useWebGLSupport";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ReducedMotionProvider, ReducedMotionToggle } from "@/components/a11y/ReducedMotionProvider";
import { SkipLink } from "@/components/a11y/SkipLink";
import { HeroText, HeroFallback } from "@/components/hero/HeroText";
import Overlay from "@/components/ui/Overlay";
import LoadingScreen from "@/components/effects/LoadingScreen";
import CustomCursor from "@/components/effects/CustomCursor";
import { AudioControls } from "@/components/ui/AudioControls";

// Dynamically import the 3D scene (no SSR)
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const { scrollProgress, isLoading, setLoading } = useAppStore();
  const webglSupport = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();

  // Determine if we should show the full 3D experience
  const showFullExperience = canRunFullExperience(webglSupport) && !prefersReducedMotion;

  // Handle loading completion for non-WebGL fallback
  useEffect(() => {
    if (!showFullExperience && isLoading) {
      // Skip loading animation for fallback
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showFullExperience, isLoading, setLoading]);

  return (
    <ReducedMotionProvider>
      {/* Accessibility: Skip to main content link */}
      <SkipLink />

      <main
        id="main-content"
        className="relative w-full min-h-[500vh] bg-black text-white"
        role="main"
      >
        {/* Loading Screen - Only for full experience */}
        {showFullExperience && <LoadingScreen />}

        {/* Custom Cursor - Only for non-touch devices */}
        {showFullExperience && <CustomCursor />}

        {/* Noise Overlay - Subtle texture */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Scroll Progress Bar */}
        <div
          className="scroll-progress"
          style={{ transform: `scaleX(${scrollProgress})` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page scroll progress"
        />

        {/* 3D Scene Background OR Static Fallback */}
        {showFullExperience ? (
          <>
            {/* Fixed 3D Canvas */}
            <div className="fixed inset-0 z-0" aria-hidden="true">
              <Scene />
            </div>

            {/* Hero Text (DOM-based, on top of canvas) */}
            <HeroText isLoaded={!isLoading} />
          </>
        ) : (
          /* Static fallback for low-power devices or reduced motion */
          <HeroFallback />
        )}

        {/* Content Overlay - Scrollable DOM content */}
        <Overlay showFullExperience={showFullExperience} />

        {/* Accessibility: Reduced motion toggle */}
        <ReducedMotionToggle />

        {/* Audio controls (if audio is enabled) */}
        <AudioControls />
      </main>
    </ReducedMotionProvider>
  );
}
