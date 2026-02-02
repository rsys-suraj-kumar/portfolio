// Viscous Particles Shader
// Particles slow down when scroll stops, creating a "time viscosity" effect
// Core of the "Temporal Drift" interaction

export const viscousParticlesVertexShader = /* glsl */ `
uniform float uTime;
uniform float uScrollVelocity;
uniform float uTimeProgress;
uniform vec2 uCursorPosition;
uniform float uGravityStrength;

attribute vec3 aVelocity;
attribute float aSize;
attribute float aPhase;

varying float vAlpha;
varying float vPhase;
varying vec3 vColor;

void main() {
  // Time viscosity: fast scroll = normal speed, slow/stop scroll = particles freeze
  float viscosity = 1.0 / (1.0 + uScrollVelocity * 10.0);
  float effectiveTime = uTime * (1.0 - viscosity * 0.8);
  
  // Base position with velocity
  vec3 pos = position;
  
  // Apply velocity with viscosity dampening
  pos += aVelocity * effectiveTime * (1.0 - viscosity * 0.5);
  
  // Wrap particles in Z (tunnel effect)
  float tunnelLength = 150.0;
  pos.z = mod(pos.z + uTimeProgress * tunnelLength, tunnelLength) - tunnelLength * 0.5;
  
  // Cursor gravity effect (particles are pulled toward cursor)
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vec2 screenPos = mvPosition.xy / mvPosition.w;
  vec2 toCursor = uCursorPosition - screenPos;
  float cursorDist = length(toCursor);
  
  // Inverse square gravity, stronger when scroll is slow
  float gravityEffect = uGravityStrength * viscosity / max(cursorDist * cursorDist, 0.5);
  vec2 gravityDisplacement = normalize(toCursor) * gravityEffect * 0.5;
  
  pos.xy += gravityDisplacement;
  
  // Calculate final position
  vec4 finalPosition = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_Position = finalPosition;
  
  // Size varies with distance and time
  float distanceFade = 1.0 - smoothstep(0.0, 80.0, abs(pos.z));
  gl_PointSize = aSize * distanceFade * (1.0 + viscosity * 0.5);
  
  // Alpha based on distance and viscosity (particles glow when frozen)
  vAlpha = distanceFade * (0.5 + viscosity * 0.5);
  vPhase = aPhase;
  
  // Color shifts based on time progress (past = warm, future = cool)
  vec3 pastColor = vec3(1.0, 0.5, 0.2);   // Orange
  vec3 presentColor = vec3(0.0, 0.9, 1.0); // Cyan
  vec3 futureColor = vec3(0.8, 0.6, 1.0);  // Purple
  
  if (uTimeProgress < 0.5) {
    vColor = mix(pastColor, presentColor, uTimeProgress * 2.0);
  } else {
    vColor = mix(presentColor, futureColor, (uTimeProgress - 0.5) * 2.0);
  }
}
`;

export const viscousParticlesFragmentShader = /* glsl */ `
varying float vAlpha;
varying float vPhase;
varying vec3 vColor;

void main() {
  // Circular particle with soft edge
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  // Soft circle falloff
  float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
  
  // Add subtle glow based on phase
  float glow = smoothstep(0.5, 0.0, dist) * 0.3;
  
  // Final color with additive glow
  vec3 finalColor = vColor + vec3(glow);
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

// Configuration for particle system
export const PARTICLE_CONFIG = {
  count: 800, // Balance between effect and performance
  spreadX: 15,
  spreadY: 15,
  spreadZ: 150,
  baseSize: 3.0,
  velocityRange: 0.02,
  gravityStrength: 0.1,
} as const;
