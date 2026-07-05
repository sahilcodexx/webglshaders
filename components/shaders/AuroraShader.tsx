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
uniform float uIntensity;
uniform float uBlend;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = mat2(1.62, 1.18, -1.18, 1.62) * p;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.z;

  float time = uTime * uSpeed;
  vec2 mouse = (uMouse - 0.5) * vec2(0.45, 0.25);

  float curtain = 0.0;
  for (float i = 0.0; i < 4.0; i += 1.0) {
    float layer = i + 1.0;
    vec2 flow = vec2(p.x * (1.1 + layer * 0.24), p.y * 1.9 - time * (0.14 + layer * 0.04));
    float band = sin(flow.x * 2.4 + fbm(flow + mouse * layer) * 5.4 + time * 0.8);
    float verticalMask = smoothstep(-0.95, 0.55, p.y) * (1.0 - smoothstep(0.15, 1.1, p.y));
    curtain += smoothstep(0.46, 0.98, band) * verticalMask / layer;
  }

  float glow = pow(max(0.0, 1.0 - length(p * vec2(0.62, 1.15))), 2.4);
  float shimmer = fbm(vec2(p.x * 2.0 + time * 0.2, p.y * 4.0 - time * 0.16));
  float energy = clamp((curtain * 0.74 + glow * 0.36 + shimmer * 0.16) * uIntensity, 0.0, 1.0);

  vec3 palette = mix(uColorA, uColorB, smoothstep(-0.55, 0.7, p.x + shimmer * 0.35));
  palette = mix(palette, uColorC, smoothstep(0.35, 1.05, p.y + curtain * uBlend));

  vec3 color = palette * energy;
  color += palette * pow(energy, 3.0) * 0.8;

  gl_FragColor = vec4(color, clamp(energy * 0.92, 0.0, 1.0));
}
`

export interface AuroraShaderProps {
  speed?: number
  intensity?: number
  blend?: number
  colorA?: string
  colorB?: string
  colorC?: string
  className?: string
}

export function AuroraShader({
  speed = 0.65,
  intensity = 1,
  blend = 0.55,
  colorA = "#22D3EE",
  colorB = "#A855F7",
  colorC = "#F8E16C",
  className,
}: AuroraShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uIntensity: { value: clamp(intensity, 0, 3) },
      uBlend: { value: clamp(blend, 0, 1.5) },
      uColorA: { value: hexToRgb(colorA) },
      uColorB: { value: hexToRgb(colorB) },
      uColorC: { value: hexToRgb(colorC) },
    }),
    [blend, colorA, colorB, colorC, intensity, speed]
  )

  return <ShaderCanvas className={className} fragmentShader={fragmentShader} uniforms={uniforms} />
}

