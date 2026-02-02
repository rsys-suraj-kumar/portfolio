"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshTransmissionMaterial,
  Environment,
  MeshDistortMaterial,
  Sphere,
} from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

// Morphing Sphere that responds to scroll
function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollProgress =
      scrollY / (document.body.scrollHeight - window.innerHeight || 1);

    // Morph distortion based on scroll
    meshRef.current.rotation.y =
      state.clock.elapsedTime * 0.1 + scrollProgress * Math.PI;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;

    // Scale pulsing
    const scale = 2.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Sphere ref={meshRef} args={[1, 128, 128]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#00f0ff"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0}
        metalness={0.8}
        envMapIntensity={1}
      />
    </Sphere>
  );
}

// Orbiting rings around the sphere
function OrbitingRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollProgress =
      scrollY / (document.body.scrollHeight - window.innerHeight || 1);

    groupRef.current.rotation.x = scrollProgress * Math.PI * 2;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[3 + i * 0.5, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? "#00f0ff" : i === 1 ? "#ff00ff" : "#ffff00"}
            emissive={i === 0 ? "#00f0ff" : i === 1 ? "#ff00ff" : "#ffff00"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Particle field
function ParticleField() {
  const count = 500;
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00f0ff"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating crystal shapes
function FloatingCrystals() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollProgress =
      scrollY / (document.body.scrollHeight - window.innerHeight || 1);

    groupRef.current.rotation.y = scrollProgress * Math.PI * 1.5;
    groupRef.current.position.y = -scrollProgress * 3;
  });

  const crystalPositions = [
    { pos: [-4, 2, -3], scale: 0.5, color: "#ff00ff" },
    { pos: [4, -1, -2], scale: 0.6, color: "#00ffff" },
    { pos: [-3, -2, -4], scale: 0.4, color: "#ffff00" },
    { pos: [3, 3, -5], scale: 0.7, color: "#ff00ff" },
    { pos: [0, -3, -3], scale: 0.5, color: "#00ffff" },
  ];

  return (
    <group ref={groupRef}>
      {crystalPositions.map((crystal, i) => (
        <Float
          key={i}
          speed={2 + i * 0.5}
          rotationIntensity={1}
          floatIntensity={1}
        >
          <mesh
            position={crystal.pos as [number, number, number]}
            scale={crystal.scale}
          >
            <octahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial
              thickness={0.5}
              chromaticAberration={0.5}
              color={crystal.color}
              distortion={0.2}
              temporalDistortion={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Mouse-following light
function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;

    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;

    lightRef.current.position.x = THREE.MathUtils.lerp(
      lightRef.current.position.x,
      x,
      0.1,
    );
    lightRef.current.position.y = THREE.MathUtils.lerp(
      lightRef.current.position.y,
      y,
      0.1,
    );
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 5]}
      intensity={2}
      color="#ff00ff"
      distance={10}
    />
  );
}

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          color="#ffffff"
        />

        <MorphingSphere />
        <OrbitingRings />
        <ParticleField />
        <FloatingCrystals />
        <MouseLight />

        {/* Fog for depth */}
        <fog attach="fog" args={["#000000", 5, 25]} />
      </Suspense>
    </Canvas>
  );
}
