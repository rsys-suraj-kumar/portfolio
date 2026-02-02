"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshTransmissionMaterial,
  Environment,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate based on scroll position (window.scrollY)
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      const scrollProgress =
        scrollY / (document.body.scrollHeight - window.innerHeight || 1);

      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.3;
      groupRef.current.position.y = -scrollProgress * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Crystal Torus */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]} scale={1.5}>
          <torusGeometry args={[1, 0.4, 32, 100]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2}
            chromaticAberration={1}
            anisotropy={1}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#88ccff"
            roughness={0}
          />
        </mesh>
      </Float>

      {/* Floating Icosahedron */}
      <Float
        speed={3}
        rotationIntensity={1}
        floatIntensity={1.5}
        position={[-3, 1.5, -2]}
      >
        <mesh scale={0.7}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            thickness={1}
            chromaticAberration={0.5}
            color="#ff88cc"
          />
        </mesh>
      </Float>

      {/* Floating Octahedron */}
      <Float
        speed={2.5}
        rotationIntensity={1.2}
        floatIntensity={1}
        position={[3, -1, -2]}
      >
        <mesh scale={0.9}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            thickness={1.2}
            chromaticAberration={0.6}
            color="#88ffcc"
          />
        </mesh>
      </Float>

      {/* Small decorative spheres */}
      {[...Array(8)].map((_, i) => (
        <Float
          key={i}
          speed={1 + i * 0.3}
          rotationIntensity={0.5}
          floatIntensity={0.8}
          position={[
            Math.sin(i * 0.8) * 4,
            Math.cos(i * 0.8) * 3 - 1,
            -3 - i * 0.5,
          ]}
        >
          <mesh scale={0.15}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="white"
              emissive="white"
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingShapes />
      </Suspense>
    </Canvas>
  );
}
