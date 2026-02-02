"use client";

import { create } from "zustand";

export type TransitionPhase = "idle" | "entering" | "active" | "exiting";

interface AnimationBridgeState {
  // Shared values that both DOM and Canvas read
  heroProgress: number;
  projectHoverTarget: string | null;
  projectPulseTarget: string | null;
  transitionPhase: TransitionPhase;
  
  // Time-based animation state (core of Temporal Drift)
  timeProgress: number; // 0 = past, 1 = future
  timeVelocity: number; // How fast time is changing
  isTimeFrozen: boolean;
  
  // Camera state
  cameraTarget: { x: number; y: number; z: number } | null;
  
  // Setters
  setHeroProgress: (v: number) => void;
  setProjectHover: (id: string | null) => void;
  setProjectPulse: (id: string | null) => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  setTimeProgress: (v: number) => void;
  setTimeVelocity: (v: number) => void;
  setTimeFrozen: (frozen: boolean) => void;
  setCameraTarget: (target: { x: number; y: number; z: number } | null) => void;
}

export const useAnimationBridge = create<AnimationBridgeState>((set) => ({
  heroProgress: 0,
  projectHoverTarget: null,
  projectPulseTarget: null,
  transitionPhase: "idle",
  timeProgress: 0,
  timeVelocity: 0,
  isTimeFrozen: false,
  cameraTarget: null,

  setHeroProgress: (v) => set({ heroProgress: v }),
  setProjectHover: (id) => set({ projectHoverTarget: id }),
  setProjectPulse: (id) => set({ projectPulseTarget: id }),
  setTransitionPhase: (phase) => set({ transitionPhase: phase }),
  setTimeProgress: (v) => set({ timeProgress: v }),
  setTimeVelocity: (v) => set({ timeVelocity: v }),
  setTimeFrozen: (frozen) => set({ isTimeFrozen: frozen }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
