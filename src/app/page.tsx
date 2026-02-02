"use client";

import dynamic from "next/dynamic";
import Overlay from "@/components/ui/Overlay";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* 3D Scene Background - Fixed */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Content Overlay - Scrollable */}
      <Overlay />
    </main>
  );
}
