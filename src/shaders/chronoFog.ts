// Chrono Fog Shader
// Creates a time-gradient fog effect where the past and future have different atmospheres
// Past = warm, hazy | Present = clear | Future = cool, ethereal

export const chronoFogVertexShader = /* glsl */ `
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);
  
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const chronoFogFragmentShader = /* glsl */ `
uniform float uTimeProgress;
uniform vec3 uPastColor;
uniform vec3 uPresentColor;
uniform vec3 uFutureColor;
uniform float uFogDensity;
uniform float uFogStart;
uniform float uFogEnd;
uniform vec3 uCameraPosition;

varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  // Calculate distance from camera for fog
  float distance = length(vWorldPosition - uCameraPosition);
  
  // Standard exponential fog
  float fogFactor = 1.0 - exp(-uFogDensity * max(0.0, distance - uFogStart));
  fogFactor = clamp(fogFactor, 0.0, 1.0);
  
  // Determine fog color based on z-position relative to time progress
  // Negative Z = past, Positive Z = future
  float zNormalized = (vWorldPosition.z + 100.0) / 200.0; // Normalize -100 to 100 -> 0 to 1
  
  // How far from "now" is this point in the timeline?
  float temporalDistance = abs(zNormalized - uTimeProgress);
  
  // Fog is denser further from present
  float temporalFog = smoothstep(0.0, 0.4, temporalDistance);
  fogFactor = max(fogFactor, temporalFog * 0.7);
  
  // Color the fog based on whether it's past or future
  vec3 fogColor;
  if (zNormalized < uTimeProgress) {
    // Past - warm tones
    float pastIntensity = smoothstep(0.0, 0.5, uTimeProgress - zNormalized);
    fogColor = mix(uPresentColor, uPastColor, pastIntensity);
  } else {
    // Future - cool tones
    float futureIntensity = smoothstep(0.0, 0.5, zNormalized - uTimeProgress);
    fogColor = mix(uPresentColor, uFutureColor, futureIntensity);
  }
  
  // Output fog color and factor for blending in post-processing
  // Or use directly as environment color
  gl_FragColor = vec4(fogColor, fogFactor);
}
`;

// Fog configuration presets
export const FOG_PRESETS = {
  default: {
    pastColor: [0.15, 0.08, 0.03],     // Warm sepia
    presentColor: [0.0, 0.0, 0.0],      // Clear black
    futureColor: [0.03, 0.08, 0.15],    // Cool blue-black
    density: 0.015,
    start: 20,
    end: 150,
  },
  dramatic: {
    pastColor: [0.2, 0.1, 0.0],
    presentColor: [0.0, 0.02, 0.03],
    futureColor: [0.05, 0.0, 0.15],
    density: 0.025,
    start: 10,
    end: 100,
  },
  subtle: {
    pastColor: [0.08, 0.05, 0.02],
    presentColor: [0.0, 0.0, 0.0],
    futureColor: [0.02, 0.04, 0.08],
    density: 0.008,
    start: 30,
    end: 200,
  },
} as const;
