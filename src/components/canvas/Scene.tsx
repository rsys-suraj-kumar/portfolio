"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useAppStore, ERAS } from "@/stores/useAppStore";

// Time Tunnel - The core visual element
function TimeTunnel() {
  const tunnelRef = useRef<THREE.Group>(null);
  const { scrollProgress, currentEra } = useAppStore();

  // Create tunnel geometry with rings
  const rings = useMemo(() => {
    const ringCount = 50;
    return Array.from({ length: ringCount }, (_, i) => ({
      z: -i * 2,
      radius: 5 + Math.sin(i * 0.3) * 1.5,
      opacity: 1 - (i / ringCount) * 0.8,
    }));
  }, []);

  useFrame((state) => {
    if (!tunnelRef.current) return;

    // Rotate based on scroll
    tunnelRef.current.rotation.z = scrollProgress * Math.PI * 0.5;

    // Move through tunnel based on scroll
    tunnelRef.current.position.z = scrollProgress * 80;
  });

  // Get current era color
  const eraColor = currentEra?.color || "#00f0ff";

  return (
    <group ref={tunnelRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[0, 0, i * 0.1]}>
          <torusGeometry args={[ring.radius, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={eraColor}
            transparent
            opacity={ring.opacity * 0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Particle Field - Creates the immersive space effect
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const { scrollProgress } = useAppStore();

  const count = 3000;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute in a cylinder shape
      const theta = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 8;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;

      // Velocity for animation
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = Math.random() * 0.05;
    }

    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array;

    // Speed based on scroll
    const speed = 0.5 + scrollProgress * 2;

    for (let i = 0; i < count; i++) {
      // Move particles toward camera (positive z)
      positions[i * 3 + 2] += velocities[i * 3 + 2] * speed;

      // Reset particles that pass the camera
      if (positions[i * 3 + 2] > 50) {
        positions[i * 3 + 2] = -50;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate entire field slightly
    particlesRef.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Era Markers - Floating year indicators
function EraMarkers() {
  const groupRef = useRef<THREE.Group>(null);
  const { scrollProgress, currentEra } = useAppStore();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z = scrollProgress * 80;
  });

  return (
    <group ref={groupRef}>
      {ERAS.slice(0, -1).map((era, i) => (
        <Float
          key={era.year}
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <mesh position={[0, 4, -era.position * 100]}>
            <planeGeometry args={[4, 1]} />
            <meshBasicMaterial
              color={era.color}
              transparent
              opacity={currentEra?.year === era.year ? 1 : 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Project Artifacts - 3D representations of projects
function ProjectArtifacts() {
  const groupRef = useRef<THREE.Group>(null);
  const { scrollProgress, setActiveProject } = useAppStore();

  const projects = [
    { id: "vfxai", position: [-3, 0, -30], color: "#ff00ff", shape: "box" },
    {
      id: "simplr",
      position: [3, 1, -50],
      color: "#00ffff",
      shape: "octahedron",
    },
    {
      id: "gitsy",
      position: [-2, -1, -70],
      color: "#ffff00",
      shape: "icosahedron",
    },
    {
      id: "dashboard",
      position: [2, 0, -85],
      color: "#00ff88",
      shape: "torus",
    },
  ];

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z = scrollProgress * 80;
  });

  return (
    <group ref={groupRef}>
      {projects.map((project) => (
        <Float
          key={project.id}
          speed={1.5}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <mesh
            position={project.position as [number, number, number]}
            onClick={() => setActiveProject(project.id)}
            onPointerOver={(e) => {
              document.body.style.cursor = "pointer";
              (e.object as THREE.Mesh).scale.setScalar(1.2);
            }}
            onPointerOut={(e) => {
              document.body.style.cursor = "none";
              (e.object as THREE.Mesh).scale.setScalar(1);
            }}
          >
            {project.shape === "box" && <boxGeometry args={[1, 1, 1]} />}
            {project.shape === "octahedron" && (
              <octahedronGeometry args={[0.7]} />
            )}
            {project.shape === "icosahedron" && (
              <icosahedronGeometry args={[0.6]} />
            )}
            {project.shape === "torus" && (
              <torusGeometry args={[0.5, 0.2, 16, 32]} />
            )}
            <meshStandardMaterial
              color={project.color}
              emissive={project.color}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Camera Controller - Handles scroll-based camera movement
function CameraController() {
  const { camera } = useThree();
  const { scrollProgress } = useAppStore();

  useFrame(() => {
    // Move camera through the tunnel
    camera.position.z = 10 - scrollProgress * 80;

    // Slight sway based on progress
    camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 0.5;
    camera.position.y = Math.cos(scrollProgress * Math.PI * 2) * 0.3;

    // Look forward
    camera.lookAt(0, 0, camera.position.z - 10);
  });

  return null;
}

// Ambient Lighting - Era-based color changes
function DynamicLighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { currentEra, cursorPosition } = useAppStore();
  const { viewport } = useThree();

  useFrame(() => {
    if (!lightRef.current || !currentEra) return;

    // Update light color based on era
    lightRef.current.color.set(currentEra.color);

    // Mouse-following light position
    const x = (cursorPosition.x / window.innerWidth - 0.5) * viewport.width;
    const y = -(cursorPosition.y / window.innerHeight - 0.5) * viewport.height;

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
    <>
      <ambientLight intensity={0.1} />
      <pointLight
        ref={lightRef}
        position={[0, 0, 5]}
        intensity={2}
        distance={15}
      />
      <pointLight
        position={[0, 0, -50]}
        intensity={1}
        color="#ff00ff"
        distance={30}
      />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 200 }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#000000", 10, 100]} />
        <Environment preset="night" />

        <CameraController />
        <DynamicLighting />
        <TimeTunnel />
        <ParticleField />
        <EraMarkers />
        <ProjectArtifacts />
      </Suspense>
    </Canvas>
  );
}
