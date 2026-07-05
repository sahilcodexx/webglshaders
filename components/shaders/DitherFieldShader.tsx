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
uniform float uScale;
uniform float uDotSize;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.z;

  float time = uTime * uSpeed;
  vec2 mouse = (uMouse - 0.5) * vec2(1.2, 0.8);

  vec2 gridUv = gl_FragCoord.xy / max(uScale, 1.0);
  vec2 cell = floor(gridUv);
  vec2 local = fract(gridUv) - 0.5;

  vec2 cellUv = (cell * uScale) / uResolution.xy;
  vec2 cp = cellUv * 2.0 - 1.0;
  cp.x *= uResolution.z;

  float wave = sin(cp.x * 2.4 + time) + cos(cp.y * 3.1 - time * 0.8);
  float n = noise(cp * 2.4 + vec2(time * 0.18, -time * 0.12));
  float cursor = smoothstep(0.75, 0.0, length(cp - mouse));
  float luminance = smoothstep(-0.55, 1.35, wave * 0.34 + n + cursor * 0.7);

  float threshold = hash(cell);
  float visible = step(threshold, luminance);
  float radius = mix(0.08, clamp(uDotSize, 0.08, 0.48), luminance);
  float dot = smoothstep(radius, radius - 0.04, length(local));

  vec3 color = mix(uColorA, uColorB, luminance);
  float scanline = 0.92 + 0.08 * sin(cell.y * 0.9 + time * 4.0);

  gl_FragColor = vec4(color * dot * visible * scanline, dot * visible);
}
`

export interface DitherFieldShaderProps {
  speed?: number
  scale?: number
  dotSize?: number
  colorA?: string
  colorB?: string
  className?: string
}

export function DitherFieldShader({
  speed = 0.8,
  scale = 8,
  dotSize = 0.42,
  colorA = "#D4FF3F",
  colorB = "#38BDF8",
  className,
}: DitherFieldShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uScale: { value: clamp(scale, 4, 18) },
      uDotSize: { value: clamp(dotSize, 0.08, 0.5) },
      uColorA: { value: hexToRgb(colorA) },
      uColorB: { value: hexToRgb(colorB) },
    }),
    [colorA, colorB, dotSize, scale, speed]
  )

  return <ShaderCanvas className={className} fragmentShader={fragmentShader} uniforms={uniforms} />
}

