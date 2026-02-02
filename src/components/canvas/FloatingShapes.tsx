"use client";

import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function FloatingShapes() {
  return (
    <group>
      {/* Main Crystal Torus */}
      <Float
        speed={4} // Animation speed
        rotationIntensity={1} // XYZ rotation intensity
        floatIntensity={2} // Up/down float intensity
      >
        <mesh position={[0, 0, 0]} scale={2}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2}
            chromaticAberration={1}
            anisotropy={1}
            distortion={1}
            distortionScale={1}
            temporalDistortion={0.2}
            color="#a0c0ff"
            roughness={0}
          />
        </mesh>
      </Float>

      {/* Floating Icosahedrons */}
      <Float
        speed={2}
        rotationIntensity={2}
        floatIntensity={1}
        position={[-4, 2, -2]}
      >
        <mesh scale={0.8}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            thickness={1}
            chromaticAberration={0.5}
            color="#ffa0e0"
            resolution={512}
          />
        </mesh>
      </Float>

      <Float
        speed={3}
        rotationIntensity={1.5}
        floatIntensity={1.5}
        position={[4, -2, -3]}
      >
        <mesh scale={1.2}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            thickness={1.5}
            chromaticAberration={0.8}
            color="#a0ffe0"
            resolution={512}
          />
        </mesh>
      </Float>

      {/* Background Particles/Stars */}
      <Stars />
    </group>
  );
}

// Pre-generate star positions to avoid Math.random in render
const STAR_POSITIONS = Array.from({ length: 50 }, (_, i) => {
  // Use deterministic seed based on index for consistent positions
  const seed = (i * 9301 + 49297) % 233280;
  const random = seed / 233280;
  return {
    x: (random - 0.5) * 20,
    y: (((seed * 2) % 233280) / 233280 - 0.5) * 20,
    z: (((seed * 3) % 233280) / 233280 - 0.5) * 20 - 5,
  };
});

function Stars() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      {STAR_POSITIONS.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]} scale={0.05}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </group>
  );
}
