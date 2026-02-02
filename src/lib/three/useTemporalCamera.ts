"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useAppStore } from "@/stores/useAppStore";
import { useAnimationBridge } from "@/stores/useAnimationBridge";
import { CAMERA_PATH, isInSafeZone } from "@/lib/animation/config";

// Easing functions
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}


/**
 * Interpolate between camera keyframes based on scroll progress
 * The "Temporal Drift" effect: camera moves through time, not space
 */
export function useTemporalCamera() {
  const { scrollProgress } = useAppStore();
  const { setTimeProgress, setTimeVelocity } = useAnimationBridge();
  const { camera } = useThree();

  // Refs for smooth interpolation
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -10));
  const lastProgress = useRef(0);
  const velocity = useRef(0);

  // Memoize keyframe vectors for performance
  const keyframeVectors = useMemo(() => {
    return CAMERA_PATH.map((kf) => ({
      time: kf.time,
      position: new THREE.Vector3(...kf.position),
      lookAt: new THREE.Vector3(...kf.lookAt),
      fov: kf.fov,
    }));
  }, []);

  useFrame((state, delta) => {
    const t = scrollProgress;

    // Calculate velocity (how fast we're scrolling)
    velocity.current = Math.abs(t - lastProgress.current) / delta;
    lastProgress.current = t;

    // Update animation bridge with time state
    setTimeProgress(t);
    setTimeVelocity(velocity.current);

    // Find surrounding keyframes
    let k0 = keyframeVectors[0];
    let k1 = keyframeVectors[1];

    for (let i = 0; i < keyframeVectors.length - 1; i++) {
      if (t >= keyframeVectors[i].time && t <= keyframeVectors[i + 1].time) {
        k0 = keyframeVectors[i];
        k1 = keyframeVectors[i + 1];
        break;
      }
    }

    // Handle edge case: past last keyframe
    if (t >= keyframeVectors[keyframeVectors.length - 1].time) {
      k0 = keyframeVectors[keyframeVectors.length - 1];
      k1 = k0;
    }

    // Calculate local interpolation factor
    const range = k1.time - k0.time;
    const localT = range > 0 ? (t - k0.time) / range : 0;
    const eased = easeInOutCubic(Math.max(0, Math.min(1, localT)));

    // Interpolate position and lookAt
    targetPosition.current.lerpVectors(k0.position, k1.position, eased);
    targetLookAt.current.lerpVectors(k0.lookAt, k1.lookAt, eased);

    // Interpolate FOV
    const targetFov = THREE.MathUtils.lerp(k0.fov, k1.fov, eased);

    // Check if we're in a safe reading zone (dampen movement)
    const safeZone = isInSafeZone(t);
    const dampingFactor = safeZone.inZone ? safeZone.damping : 1;

    // Smooth follow with variable damping
    const lerpSpeed = delta * 3 * dampingFactor;

    camera.position.lerp(targetPosition.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);

    // Update FOV - R3F camera is mutable by design
    // eslint-disable-next-line react-hooks/immutability
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      targetFov,
      lerpSpeed
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    // Add subtle parallax based on time in safe zones
    if (safeZone.inZone) {
      // Gentle breathing motion when reading
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // eslint-disable-next-line react-hooks/immutability
      camera.position.y += breathe * dampingFactor;
    }
  });
}

/**
 * Simplified camera for reduced motion mode
 * Still responds to scroll but without smooth transitions
 */
export function useStaticCamera() {
  const { scrollProgress } = useAppStore();
  const { camera } = useThree();

  useFrame(() => {
    // Direct mapping without interpolation
    const t = scrollProgress;

    // Find current section
    for (let i = CAMERA_PATH.length - 1; i >= 0; i--) {
      if (t >= CAMERA_PATH[i].time) {
        const kf = CAMERA_PATH[i];
        camera.position.set(...kf.position);
        camera.lookAt(...kf.lookAt);
        // R3F camera is mutable by design
        // eslint-disable-next-line react-hooks/immutability
        (camera as THREE.PerspectiveCamera).fov = kf.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        break;
      }
    }
  });
}
