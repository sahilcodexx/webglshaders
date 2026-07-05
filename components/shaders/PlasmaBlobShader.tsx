"use client"

import { useMemo } from "react"

import { ShaderCanvas } from "@/components/shaders/ShaderCanvas"
import { clamp, hexToRgb } from "@/components/shaders/shader-utils"

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uBlobCount;
uniform float uBlobSize;
uniform float uSoftness;
uniform float uIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.z;

  float time = uTime * uSpeed;
  vec2 cursor = (uMouse - 0.5) * vec2(1.6, -1.1);
  float field = 0.0;
  vec3 colorAccum = vec3(0.0);

  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    if (fi >= uBlobCount) {
      break;
    }

    float seed = fi * 17.13 + 3.7;
    float orbit = 0.28 + hash(seed) * 0.58;
    vec2 center = vec2(
      sin(time * (0.24 + hash(seed + 1.0) * 0.26) + seed) * orbit,
      cos(time * (0.22 + hash(seed + 2.0) * 0.24) + seed * 1.21) * orbit * 0.72
    );
    center += cursor * (0.08 + hash(seed + 3.0) * 0.1);

    float radius = uBlobSize * (0.65 + hash(seed + 4.0) * 0.7);
    float influence = radius / max(length(p - center), 0.015);
    influence = pow(influence, uSoftness);
    field += influence;

    vec3 blobColor = mix(uColor1, uColor2, hash(seed + 5.0));
    blobColor = mix(blobColor, uColor3, hash(seed + 6.0) * 0.75);
    colorAccum += blobColor * influence;
  }

  float mask = smoothstep(0.95, 2.35, field);
  float edge = smoothstep(1.6, 2.8, field) - smoothstep(3.2, 5.4, field);
  vec3 color = colorAccum / max(field, 0.001);
  color *= mask * uIntensity;
  color += color * edge * 0.9;

  float alpha = clamp(mask * 0.9 + edge * 0.35, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`

export interface PlasmaBlobShaderProps {
  speed?: number
  blobCount?: number
  blobSize?: number
  softness?: number
  intensity?: number
  color1?: string
  color2?: string
  color3?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function PlasmaBlobShader({
  speed = 0.65,
  blobCount = 7,
  blobSize = 0.28,
  softness = 1.25,
  intensity = 1,
  color1 = "#2DD4BF",
  color2 = "#F97316",
  color3 = "#E879F9",
  enableMouseInteraction = true,
  className,
}: PlasmaBlobShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uBlobCount: { value: clamp(blobCount, 1, 10) },
      uBlobSize: { value: clamp(blobSize, 0.08, 0.75) },
      uSoftness: { value: clamp(softness, 0.6, 2.8) },
      uIntensity: { value: clamp(intensity, 0, 3) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uColor3: { value: hexToRgb(color3) },
    }),
    [blobCount, blobSize, color1, color2, color3, intensity, softness, speed]
  )

  return (
    <ShaderCanvas
      className={className}
      fragmentShader={fragmentShader}
      interactive={enableMouseInteraction}
      uniforms={uniforms}
    />
  )
}

