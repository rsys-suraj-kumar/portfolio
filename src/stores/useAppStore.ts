import { create } from "zustand";
import { getEraFromProgress, type Era } from "@/lib/animation/config";

// Re-export for backwards compatibility
export { ERAS } from "@/lib/animation/config";
export type { Era } from "@/lib/animation/config";

interface AppState {
  // Scroll state
  scrollProgress: number;
  currentEra: Era | null;

  // Loading state
  isLoading: boolean;
  loadingProgress: number;

  // Interaction state
  activeProject: string | null;
  isTransitioning: boolean;
  cursorPosition: { x: number; y: number };

  // Audio state
  isMuted: boolean;
  audioEnabled: boolean;

  // Accessibility
  prefersReducedMotion: boolean;

  // Actions
  setScrollProgress: (progress: number) => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setActiveProject: (project: string | null) => void;
  setTransitioning: (transitioning: boolean) => void;
  setCursorPosition: (position: { x: number; y: number }) => void;
  setMuted: (muted: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setPrefersReducedMotion: (prefers: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  scrollProgress: 0,
  currentEra: null,
  isLoading: true,
  loadingProgress: 0,
  activeProject: null,
  isTransitioning: false,
  cursorPosition: { x: 0, y: 0 },
  isMuted: true, // Default muted for good UX
  audioEnabled: false,
  prefersReducedMotion: false,

  // Actions
  setScrollProgress: (progress) =>
    set({
      scrollProgress: progress,
      currentEra: getEraFromProgress(progress),
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  setActiveProject: (project) =>
    set({
      activeProject: project,
      isTransitioning: project !== null,
    }),

  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

  setCursorPosition: (position) => set({ cursorPosition: position }),

  setMuted: (muted) => set({ isMuted: muted }),

  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  setPrefersReducedMotion: (prefers) => set({ prefersReducedMotion: prefers }),
}));
