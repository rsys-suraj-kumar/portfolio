"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { useAppStore } from "@/stores/useAppStore";
import { useAnimationBridge } from "@/stores/useAnimationBridge";
import { useTemporalCamera } from "@/lib/three/useTemporalCamera";
import { ERAS } from "@/lib/animation/config";
import {
  viscousParticlesVertexShader,
  viscousParticlesFragmentShader,
  PARTICLE_CONFIG,
} from "@/shaders/viscousParticles";
import {
  tunnelRingsVertexShader,
  tunnelRingsFragmentShader,
  TUNNEL_COLORS,
} from "@/shaders/tunnelRings";

// Seeded random number generator for deterministic particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Pre-generate particle data outside component for purity
function generateParticleData(count: number) {
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const siz = new Float32Array(count);
  const pha = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const seed = i * 1000;
    const theta = seededRandom(seed) * Math.PI * 2;
    const radius = 4 + seededRandom(seed + 1) * PARTICLE_CONFIG.spreadX;

    pos[i * 3] = Math.cos(theta) * radius;
    pos[i * 3 + 1] = Math.sin(theta) * radius;
    pos[i * 3 + 2] = (seededRandom(seed + 2) - 0.5) * PARTICLE_CONFIG.spreadZ;

    vel[i * 3] = (seededRandom(seed + 3) - 0.5) * PARTICLE_CONFIG.velocityRange;
    vel[i * 3 + 1] = (seededRandom(seed + 4) - 0.5) * PARTICLE_CONFIG.velocityRange;
    vel[i * 3 + 2] = seededRandom(seed + 5) * PARTICLE_CONFIG.velocityRange * 2;

    siz[i] = PARTICLE_CONFIG.baseSize * (0.5 + seededRandom(seed + 6));
    pha[i] = seededRandom(seed + 7) * Math.PI * 2;
  }

  return { pos, vel, siz, pha };
}

// Pre-computed particle data
const PARTICLE_DATA = generateParticleData(PARTICLE_CONFIG.count);

// ============================================================================
// TEMPORAL TUNNEL - The core visual element representing the timeline
// ============================================================================
function TemporalTunnel() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<THREE.ShaderMaterial[]>([]);
  const { scrollProgress } = useAppStore();
  const { timeProgress } = useAnimationBridge();

  // Create tunnel ring instances
  const rings = useMemo(() => {
    const ringCount = 60;
    return Array.from({ length: ringCount }, (_, i) => ({
      z: -i * 2.5,
      radius: 6 + Math.sin(i * 0.2) * 2,
      opacity: 1 - (i / ringCount) * 0.7,
      index: i,
    }));
  }, []);

  // Update shader uniforms
  useFrame((state) => {
    materialRefs.current.forEach((mat) => {
      if (mat) {
        mat.uniforms.uTime.value = state.clock.elapsedTime;
        mat.uniforms.uTimeProgress.value = timeProgress;
        mat.uniforms.uScrollVelocity.value = Math.min(1, Math.abs(scrollProgress - (mat.uniforms.uLastProgress?.value || 0)) * 10);
        mat.uniforms.uLastProgress = { value: scrollProgress };
      }
    });

    // Rotate tunnel based on scroll
    if (groupRef.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        scrollProgress * Math.PI * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[0, 0, ring.index * 0.08]}>
          <torusGeometry args={[ring.radius, 0.03, 8, 64]} />
          <shaderMaterial
            ref={(el) => {
              if (el) materialRefs.current[i] = el;
            }}
            vertexShader={tunnelRingsVertexShader}
            fragmentShader={tunnelRingsFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uTimeProgress: { value: 0 },
              uScrollVelocity: { value: 0 },
              uColor1: { value: new THREE.Color(...TUNNEL_COLORS.era2018) },
              uColor2: { value: new THREE.Color(...TUNNEL_COLORS.era2022) },
              uColor3: { value: new THREE.Color(...TUNNEL_COLORS.era2024) },
              uOpacity: { value: ring.opacity * 0.6 },
            }}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// VISCOUS PARTICLE FIELD - Particles that slow down when scroll stops
// ============================================================================
function ViscousParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { scrollProgress, cursorPosition } = useAppStore();
  const { timeProgress } = useAnimationBridge();
  const lastProgress = useRef(0);

  // Use pre-generated particle data
  const { pos: positions, vel: velocities, siz: sizes, pha: phases } = PARTICLE_DATA;

  useFrame((state) => {
    if (!materialRef.current) return;

    // Calculate scroll velocity
    const velocity = Math.abs(scrollProgress - lastProgress.current);
    lastProgress.current = scrollProgress;

    // Normalize cursor position to -1 to 1
    const normalizedCursor = new THREE.Vector2(
      (cursorPosition.x / window.innerWidth) * 2 - 1,
      -(cursorPosition.y / window.innerHeight) * 2 + 1
    );

    // Update uniforms
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uScrollVelocity.value = velocity * 100;
    materialRef.current.uniforms.uTimeProgress.value = timeProgress;
    materialRef.current.uniforms.uCursorPosition.value = normalizedCursor;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aVelocity" args={[velocities, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={viscousParticlesVertexShader}
        fragmentShader={viscousParticlesFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScrollVelocity: { value: 0 },
          uTimeProgress: { value: 0 },
          uCursorPosition: { value: new THREE.Vector2(0, 0) },
          uGravityStrength: { value: PARTICLE_CONFIG.gravityStrength },
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================================
// ERA MARKERS - Floating indicators for each time period
// ============================================================================
function EraMarkers() {
  const groupRef = useRef<THREE.Group>(null);
  const { currentEra } = useAppStore();
  const { timeProgress } = useAnimationBridge();

  useFrame(() => {
    if (!groupRef.current) return;
    // Position markers based on time progress
    groupRef.current.position.z = timeProgress * 100;
  });

  return (
    <group ref={groupRef}>
      {ERAS.slice(0, -1).map((era) => (
        <Float key={era.year} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <mesh position={[0, 5, -era.position * 120]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial
              color={era.color}
              transparent
              opacity={currentEra?.year === era.year ? 0.9 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ============================================================================
// PROJECT ARTIFACTS - Interactive 3D representations of projects
// ============================================================================
function ProjectArtifacts() {
  const groupRef = useRef<THREE.Group>(null);
  const { setActiveProject } = useAppStore();
  const { projectHoverTarget, setProjectHover, timeProgress } = useAnimationBridge();

  const projects = useMemo(
    () => [
      { id: "vfxai", position: [-4, 0, -35], color: "#ff00ff", shape: "octahedron" as const },
      { id: "simplr", position: [4, 1.5, -55], color: "#00ffff", shape: "icosahedron" as const },
      { id: "gitsy", position: [-3, -1, -75], color: "#ffff00", shape: "dodecahedron" as const },
      { id: "dashboard", position: [3, 0.5, -95], color: "#00ff88", shape: "octahedron" as const },
    ],
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z = timeProgress * 100;
  });

  return (
    <group ref={groupRef}>
      {projects.map((project) => (
        <Float key={project.id} speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
          <mesh
            position={project.position as [number, number, number]}
            scale={projectHoverTarget === project.id ? 1.3 : 1}
            onClick={() => setActiveProject(project.id)}
            onPointerOver={() => {
              setProjectHover(project.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setProjectHover(null);
              document.body.style.cursor = "none";
            }}
          >
            {project.shape === "octahedron" && <octahedronGeometry args={[0.6]} />}
            {project.shape === "icosahedron" && <icosahedronGeometry args={[0.5]} />}
            {project.shape === "dodecahedron" && <dodecahedronGeometry args={[0.5]} />}
            <meshStandardMaterial
              color={project.color}
              emissive={project.color}
              emissiveIntensity={projectHoverTarget === project.id ? 0.8 : 0.4}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ============================================================================
// CAMERA CONTROLLER - Orchestrates the temporal camera movement
// ============================================================================
function CameraController() {
  useTemporalCamera();
  return null;
}

// ============================================================================
// DYNAMIC LIGHTING - Era-responsive atmospheric lighting
// ============================================================================
function DynamicLighting() {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const { currentEra, cursorPosition } = useAppStore();
  const { viewport } = useThree();

  useFrame(() => {
    if (!pointLightRef.current || !currentEra) return;

    // Smoothly transition light color
    const targetColor = new THREE.Color(currentEra.color);
    pointLightRef.current.color.lerp(targetColor, 0.05);

    // Mouse-following light
    const x = (cursorPosition.x / window.innerWidth - 0.5) * viewport.width * 0.5;
    const y = -(cursorPosition.y / window.innerHeight - 0.5) * viewport.height * 0.5;

    pointLightRef.current.position.x = THREE.MathUtils.lerp(pointLightRef.current.position.x, x, 0.08);
    pointLightRef.current.position.y = THREE.MathUtils.lerp(pointLightRef.current.position.y, y, 0.08);
  });

  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight ref={pointLightRef} position={[0, 0, 10]} intensity={1.5} distance={25} />
      <pointLight position={[0, 0, -60]} intensity={0.8} color="#7b2cbf" distance={40} />
      <pointLight position={[0, 0, -120]} intensity={0.6} color="#ffffff" distance={50} />
    </>
  );
}

// ============================================================================
// CHRONO FOG - Time-gradient atmospheric fog
// ============================================================================
function ChronoFog() {
  const { timeProgress } = useAnimationBridge();
  
  // Dynamic fog that shifts color based on timeline position
  const fogColor = useMemo(() => {
    const past = new THREE.Color(0x1a0f05);    // Warm sepia
    const present = new THREE.Color(0x000000); // Clear
    const future = new THREE.Color(0x050a15);  // Cool blue
    
    if (timeProgress < 0.5) {
      return past.clone().lerp(present, timeProgress * 2);
    } else {
      return present.clone().lerp(future, (timeProgress - 0.5) * 2);
    }
  }, [timeProgress]);

  return <fog attach="fog" args={[fogColor, 15, 120]} />;
}

// ============================================================================
// MAIN SCENE EXPORT
// ============================================================================
export default function Scene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 50], fov: 60, near: 0.1, far: 250 }}
      dpr={[1, 2]}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        {/* Performance optimizations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        {/* Atmosphere */}
        <ChronoFog />
        <Environment preset="night" />

        {/* Core systems */}
        <CameraController />
        <DynamicLighting />

        {/* Visual elements */}
        <TemporalTunnel />
        <ViscousParticleField />
        <EraMarkers />
        <ProjectArtifacts />

        {/* Preload assets */}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
