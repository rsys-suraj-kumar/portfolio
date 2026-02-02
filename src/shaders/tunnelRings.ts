// Tunnel Rings Shader
// Creates the glowing ring geometry that forms the time tunnel
// Rings pulse and shift color based on the current era

export const tunnelRingsVertexShader = /* glsl */ `
uniform float uTime;
uniform float uTimeProgress;
uniform float uScrollVelocity;

varying vec2 vUv;
varying float vRingIndex;
varying float vDistanceFromCamera;

attribute float aRingIndex;

void main() {
  vUv = uv;
  vRingIndex = aRingIndex;
  
  vec3 pos = position;
  
  // Rings pulse based on scroll velocity
  float pulse = sin(uTime * 3.0 + aRingIndex * 0.5) * 0.1 * uScrollVelocity;
  pos.xy *= 1.0 + pulse;
  
  // Slight rotation based on time
  float angle = uTime * 0.1 + aRingIndex * 0.05;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  pos.xy = rotation * pos.xy;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vDistanceFromCamera = -mvPosition.z;
  
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const tunnelRingsFragmentShader = /* glsl */ `
uniform float uTimeProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uOpacity;

varying vec2 vUv;
varying float vRingIndex;
varying float vDistanceFromCamera;

void main() {
  // Color interpolation based on time progress through eras
  vec3 color;
  if (uTimeProgress < 0.33) {
    color = mix(uColor1, uColor2, uTimeProgress * 3.0);
  } else if (uTimeProgress < 0.66) {
    color = mix(uColor2, uColor3, (uTimeProgress - 0.33) * 3.0);
  } else {
    color = mix(uColor3, uColor1, (uTimeProgress - 0.66) * 3.0);
  }
  
  // Distance-based fade
  float distanceFade = smoothstep(150.0, 20.0, vDistanceFromCamera);
  
  // Ring glow effect - brighter at edges
  float edgeGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
  edgeGlow = pow(edgeGlow, 2.0);
  
  // Combine effects
  float alpha = uOpacity * distanceFade * edgeGlow;
  
  // Add subtle flicker based on ring index
  alpha *= 0.8 + 0.2 * sin(vRingIndex * 0.7);
  
  gl_FragColor = vec4(color, alpha);
}
`;

// Era color definitions for the tunnel
export const TUNNEL_COLORS = {
  era2018: [1.0, 0.42, 0.21],    // #ff6b35 - Orange
  era2022: [0.0, 0.96, 0.83],    // #00f5d4 - Teal  
  era2023: [0.48, 0.17, 0.75],   // #7b2cbf - Purple
  era2024: [0.0, 0.94, 1.0],     // #00f0ff - Cyan
  future: [1.0, 1.0, 1.0],       // White
} as const;
