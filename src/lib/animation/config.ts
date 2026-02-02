// Global animation configuration for Temporal Drift portfolio
// These values ensure consistency between Framer Motion (DOM) and R3F (Canvas)

export const ANIMATION_CONFIG = {
  // Timing scale (1 = normal, 0 = instant for reduced motion)
  timingScale: 1,

  // Global easing curves
  easing: {
    // Smooth deceleration - feels like coming to rest
    enter: [0.16, 1, 0.3, 1] as const,
    // Quick acceleration - feels like launching
    exit: [0.7, 0, 0.84, 0] as const,
    // Material design standard
    smooth: [0.4, 0, 0.2, 1] as const,
    // Bouncy spring-like
    bounce: [0.34, 1.56, 0.64, 1] as const,
  },

  // Duration presets (in seconds)
  duration: {
    instant: 0.1,
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    dramatic: 2.0,
  },

  // Stagger delays for sequential animations
  stagger: {
    tight: 0.03,
    normal: 0.08,
    relaxed: 0.15,
  },

  // Spring physics for Framer Motion
  spring: {
    // Snappy, responsive
    snappy: { stiffness: 400, damping: 30 },
    // Smooth, elegant
    smooth: { stiffness: 200, damping: 25 },
    // Bouncy, playful
    bouncy: { stiffness: 300, damping: 15 },
    // Slow, dramatic
    slow: { stiffness: 100, damping: 20 },
  },
} as const;

// Safe reading zones where camera movement is dampened
// Allows users to read content without motion distraction
export const SAFE_READING_ZONES = [
  { scrollStart: 0.0, scrollEnd: 0.08, label: "Hero", damping: 0.2 },
  { scrollStart: 0.15, scrollEnd: 0.25, label: "2018 Section", damping: 0.3 },
  { scrollStart: 0.35, scrollEnd: 0.45, label: "2022 Section", damping: 0.3 },
  { scrollStart: 0.55, scrollEnd: 0.65, label: "2023 Section", damping: 0.3 },
  { scrollStart: 0.75, scrollEnd: 0.85, label: "Skills Section", damping: 0.3 },
  { scrollStart: 0.90, scrollEnd: 1.0, label: "Contact", damping: 0.2 },
] as const;

export function isInSafeZone(scrollProgress: number): {
  inZone: boolean;
  damping: number;
  label: string | null;
} {
  for (const zone of SAFE_READING_ZONES) {
    if (scrollProgress >= zone.scrollStart && scrollProgress <= zone.scrollEnd) {
      return { inZone: true, damping: zone.damping, label: zone.label };
    }
  }
  return { inZone: false, damping: 1, label: null };
}

// Camera keyframes for the temporal journey
export interface CameraKeyframe {
  time: number; // 0-1 normalized scroll position
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

export const CAMERA_PATH: CameraKeyframe[] = [
  // Hero - wide establishing shot
  { time: 0.0, position: [0, 0, 50], lookAt: [0, 0, 0], fov: 60 },
  // Entering the tunnel
  { time: 0.1, position: [0, 2, 35], lookAt: [0, 0, -20], fov: 55 },
  // 2018 - Past era (warm, close)
  { time: 0.2, position: [-3, 1, 20], lookAt: [0, 0, -30], fov: 50 },
  // Transition zone
  { time: 0.35, position: [0, 0, 0], lookAt: [0, 0, -50], fov: 55 },
  // 2022 - Growth era
  { time: 0.45, position: [3, -1, -20], lookAt: [0, 0, -60], fov: 50 },
  // Transition zone
  { time: 0.55, position: [0, 2, -35], lookAt: [0, 0, -70], fov: 55 },
  // 2023 - Acceleration
  { time: 0.65, position: [-2, 0, -50], lookAt: [0, 0, -80], fov: 50 },
  // Skills showcase - pull back
  { time: 0.8, position: [0, 0, -65], lookAt: [0, 0, -90], fov: 60 },
  // Future - wide, hopeful
  { time: 1.0, position: [0, 3, -80], lookAt: [0, 0, -120], fov: 65 },
];

// Era definitions with temporal properties
export interface Era {
  year: string;
  label: string;
  color: string;
  position: number; // 0-1 in timeline
  description: string;
}

export const ERAS: Era[] = [
  { year: "2018", label: "The Beginning", color: "#ff6b35", position: 0.15, description: "Where curiosity met code" },
  { year: "2020", label: "Growth", color: "#f7c59f", position: 0.3, description: "Foundations solidified" },
  { year: "2022", label: "Momentum", color: "#00f5d4", position: 0.45, description: "Scale and impact" },
  { year: "2023", label: "Acceleration", color: "#7b2cbf", position: 0.6, description: "Senior leadership" },
  { year: "2024", label: "Present", color: "#00f0ff", position: 0.8, description: "Crafting the future" },
  { year: "Future", label: "What's Next", color: "#ffffff", position: 0.95, description: "Ready to collaborate" },
];

export function getEraFromProgress(progress: number): Era | null {
  for (let i = ERAS.length - 1; i >= 0; i--) {
    if (progress >= ERAS[i].position - 0.05) {
      return ERAS[i];
    }
  }
  return ERAS[0];
}
