import { create } from "zustand";

interface Era {
  year: string;
  label: string;
  color: string;
  position: number; // 0-1 in timeline
}

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

  // Actions
  setScrollProgress: (progress: number) => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setActiveProject: (project: string | null) => void;
  setTransitioning: (transitioning: boolean) => void;
  setCursorPosition: (position: { x: number; y: number }) => void;
}

// Timeline eras
export const ERAS: Era[] = [
  { year: "2018", label: "The Beginning", color: "#ff6b35", position: 0.1 },
  { year: "2020", label: "Growth", color: "#f7c59f", position: 0.3 },
  { year: "2022", label: "Momentum", color: "#00f5d4", position: 0.5 },
  { year: "2023", label: "Acceleration", color: "#7b2cbf", position: 0.7 },
  { year: "2024", label: "Present", color: "#00f0ff", position: 0.85 },
  { year: "Future", label: "What's Next", color: "#ffffff", position: 0.95 },
];

const getEraFromProgress = (progress: number): Era | null => {
  // Find the current era based on scroll progress
  for (let i = ERAS.length - 1; i >= 0; i--) {
    if (progress >= ERAS[i].position - 0.05) {
      return ERAS[i];
    }
  }
  return ERAS[0];
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  scrollProgress: 0,
  currentEra: null,
  isLoading: true,
  loadingProgress: 0,
  activeProject: null,
  isTransitioning: false,
  cursorPosition: { x: 0, y: 0 },

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
}));
