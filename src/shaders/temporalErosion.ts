// Temporal Erosion Shader
// Creates the "time passing" effect - objects rust, grow moss, decay based on uTime uniform

export const temporalErosionVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  
  // Subtle vertex displacement based on time (weathering effect)
  vec3 displaced = position;
  float noise = sin(position.x * 10.0 + uTime * 3.14159) * 
                cos(position.y * 10.0 + uTime * 2.0) * 0.02;
  displaced += normal * noise * uTime;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

export const temporalErosionFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uPristineColor;
uniform vec3 uErodedColor;
uniform vec3 uGrowthColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Simplex noise function for organic erosion patterns
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Generate erosion pattern based on position and time
  float erosionNoise = snoise(vUv * 5.0 + vPosition.xy * 0.5);
  erosionNoise = (erosionNoise + 1.0) * 0.5; // Normalize to 0-1
  
  // Time controls how much erosion is visible
  // Lower areas (darker noise) erode first
  float erosionThreshold = uTime;
  float erosionMask = smoothstep(erosionThreshold - 0.2, erosionThreshold, erosionNoise);
  
  // Growth (moss/lichen) appears in crevices after erosion
  float growthNoise = snoise(vUv * 8.0 - vPosition.xz * 0.3);
  float growthMask = smoothstep(0.3, 0.7, uTime) * 
                     smoothstep(0.4, 0.6, growthNoise) * 
                     (1.0 - erosionMask);
  
  // Mix colors based on time state
  vec3 color = uPristineColor;
  color = mix(color, uErodedColor, (1.0 - erosionMask) * uTime);
  color = mix(color, uGrowthColor, growthMask);
  
  // Add subtle normal-based shading
  float lighting = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
  color *= lighting;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

// Preset colors for different material types
export const TEMPORAL_PRESETS = {
  metal: {
    pristine: [0.8, 0.8, 0.85],
    eroded: [0.45, 0.25, 0.15], // Rust
    growth: [0.2, 0.35, 0.2],   // Moss
  },
  stone: {
    pristine: [0.7, 0.7, 0.68],
    eroded: [0.4, 0.38, 0.35],  // Weathered
    growth: [0.15, 0.3, 0.15],  // Lichen
  },
  glass: {
    pristine: [0.9, 0.95, 1.0],
    eroded: [0.6, 0.65, 0.7],   // Frosted
    growth: [0.7, 0.8, 0.75],   // Mineral deposits
  },
} as const;
