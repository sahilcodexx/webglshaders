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
uniform float uDensity;
uniform float uVeilOpacity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash(vec2 p) {
  p = fract(p * vec2(443.8975, 397.2973));
  p += dot(p, p.yx + 19.19);
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
    p = mat2(1.7, -1.2, 1.2, 1.7) * p;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.z;

  float time = uTime * uSpeed;
  vec2 cursor = (uMouse - 0.5) * vec2(0.7, -0.45);

  float veil = 0.0;
  for (float i = 0.0; i < 5.0; i += 1.0) {
    float layer = i + 1.0;
    vec2 q = p;
    q.x += sin(q.y * (2.4 + layer * 0.35) + time * (0.55 + layer * 0.09)) * 0.18;
    q.y += cos(q.x * (1.7 + layer * 0.25) - time * 0.35) * 0.12;
    q += cursor * (0.08 * layer);

    float stream = sin(q.x * uDensity + fbm(q * 1.8 + time * 0.12) * 4.5 + time);
    float strand = smoothstep(0.77, 1.0, stream) * smoothstep(1.15, -0.75, abs(q.y));
    veil += strand / layer;
  }

  float core = pow(max(0.0, 1.0 - length(p * vec2(0.72, 1.25))), 2.0);
  float energy = clamp((veil * 0.75 + core * 0.22) * uIntensity, 0.0, 1.0);

  vec3 color = mix(uColor1, uColor2, smoothstep(-0.55, 0.75, p.x + veil * 0.35));
  color = mix(color, uColor3, smoothstep(0.15, 0.95, p.y + fbm(p * 2.0 + time * 0.1)));
  color *= energy;
  color += color * energy * energy * 0.8;

  gl_FragColor = vec4(color, energy * uVeilOpacity);
}
`

export interface NeonVeilShaderProps {
  speed?: number
  intensity?: number
  density?: number
  veilOpacity?: number
  color1?: string
  color2?: string
  color3?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function NeonVeilShader({
  speed = 0.45,
  intensity = 1,
  density = 7.5,
  veilOpacity = 0.95,
  color1 = "#00F5D4",
  color2 = "#7C3AED",
  color3 = "#F15BB5",
  enableMouseInteraction = true,
  className,
}: NeonVeilShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uIntensity: { value: clamp(intensity, 0, 3) },
      uDensity: { value: clamp(density, 2, 16) },
      uVeilOpacity: { value: clamp(veilOpacity, 0, 1) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uColor3: { value: hexToRgb(color3) },
    }),
    [color1, color2, color3, density, intensity, speed, veilOpacity]
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

