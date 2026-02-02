"use client";

import dynamic from "next/dynamic";
import Overlay from "@/components/ui/Overlay";
import LoadingScreen from "@/components/effects/LoadingScreen";
import CustomCursor from "@/components/effects/CustomCursor";
import { useAppStore } from "@/stores/useAppStore";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  const { scrollProgress } = useAppStore();

  return (
    <main className="relative w-full min-h-[500vh] bg-black text-white">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* 3D Scene Background - Fixed */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Content Overlay - Scrollable */}
      <Overlay />
    </main>
  );
}
