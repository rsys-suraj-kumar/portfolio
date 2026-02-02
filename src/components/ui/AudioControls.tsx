"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

/**
 * Audio control toggle
 * Defaults to muted for good UX (don't autoplay audio)
 */
export function AudioControls() {
  const { isMuted, setMuted, audioEnabled } = useAppStore();

  // Don't show if audio system isn't enabled
  if (!audioEnabled) return null;

  return (
    <button
      onClick={() => setMuted(!isMuted)}
      aria-label={isMuted ? "Enable sound" : "Mute sound"}
      aria-pressed={!isMuted}
      className="
        fixed bottom-4 right-4 z-50 
        p-3 rounded-full 
        border border-white/20 
        bg-black/50 backdrop-blur-sm
        hover:border-cyan-400 hover:bg-cyan-400/10
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
        group
      "
      title={isMuted ? "Enable sound" : "Mute sound"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-cyan-400" />
      )}
    </button>
  );
}

/**
 * Minimal audio hint that appears briefly
 * Suggests to users they can enable sound
 */
export function AudioHint({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      className="
        fixed bottom-20 right-4 z-50
        px-4 py-2 rounded-lg
        bg-black/80 backdrop-blur-sm
        border border-white/10
        text-xs text-gray-400
        animate-fade-in
      "
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        Sound available
      </span>
    </div>
  );
}
