"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
} from "@react-three/drei";
import { Suspense } from "react";
import FloatingShapes from "./FloatingShapes";

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true, toneMappingExposure: 1.5 }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

      <Suspense fallback={null}>
        <Environment preset="city" />

        <group position={[0, -1, 0]}>
          <FloatingShapes />
          <ContactShadows
            resolution={1024}
            scale={20}
            blur={2}
            opacity={0.5}
            far={10}
            color="#000000"
          />
        </group>

        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
        />
      </Suspense>
    </Canvas>
  );
}
