"use client";

import { useEffect, useState } from "react";

interface WebGLSupport {
  supported: boolean;
  version: 1 | 2 | null;
  maxTextureSize: number;
  maxVertexUniforms: number;
  renderer: string;
  isLowPower: boolean;
}

/**
 * Detect WebGL support and capabilities
 * Used to determine if we should render 3D or fall back to static
 */
export function useWebGLSupport(): WebGLSupport {
  const [support, setSupport] = useState<WebGLSupport>({
    supported: true, // Optimistic default for SSR
    version: 2,
    maxTextureSize: 4096,
    maxVertexUniforms: 1024,
    renderer: "",
    isLowPower: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let version: 1 | 2 | null = null;

    // Try WebGL 2 first
    gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    if (gl) {
      version = 2;
    } else {
      // Fall back to WebGL 1
      gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
      if (gl) {
        version = 1;
      }
    }

    if (!gl) {
      queueMicrotask(() => {
        setSupport({
          supported: false,
          version: null,
          maxTextureSize: 0,
          maxVertexUniforms: 0,
          renderer: "",
          isLowPower: true,
        });
      });
      return;
    }

    // Get capabilities
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) as number;
    
    // Get renderer info
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
      : "Unknown";

    // Detect low-power devices
    const isLowPower = detectLowPower(renderer, maxTextureSize);

    queueMicrotask(() => {
      setSupport({
        supported: true,
        version,
        maxTextureSize,
        maxVertexUniforms,
        renderer,
        isLowPower,
      });
    });

    // Cleanup
    canvas.remove();
  }, []);

  return support;
}

/**
 * Detect if device is likely low-power based on GPU info
 */
function detectLowPower(renderer: string, maxTextureSize: number): boolean {
  const lowPowerIndicators = [
    "Mali-4",
    "Mali-T",
    "Adreno 3",
    "Adreno 4",
    "PowerVR SGX",
    "Intel HD Graphics 4",
    "Intel HD Graphics 5",
    "SwiftShader", // Software rendering
    "llvmpipe", // Software rendering
  ];

  const rendererLower = renderer.toLowerCase();
  
  // Check for known low-power GPUs
  for (const indicator of lowPowerIndicators) {
    if (rendererLower.includes(indicator.toLowerCase())) {
      return true;
    }
  }

  // Small max texture size indicates weak GPU
  if (maxTextureSize < 4096) {
    return true;
  }

  return false;
}

/**
 * Check if device can handle the full experience
 */
export function canRunFullExperience(support: WebGLSupport): boolean {
  return (
    support.supported &&
    support.version === 2 &&
    !support.isLowPower &&
    support.maxTextureSize >= 4096
  );
}
