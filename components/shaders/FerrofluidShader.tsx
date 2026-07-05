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
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uCursorStrength;
uniform float uCursorRadius;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
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
    p = mat2(1.62, -1.17, 1.17, 1.62) * p;
    amplitude *= 0.5;
  }

  return value;
}

float ridge(float v) {
  return 1.0 - abs(v * 2.0 - 1.0);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.z, -1.0) * 2.0;
  float time = uTime * uSpeed;

  vec2 q = p * uScale;
  float cursor = exp(-dot(p - mouse, p - mouse) / max(uCursorRadius, 0.001));
  q += normalize(p - mouse + 0.0001) * cursor * uCursorStrength;

  vec2 flow = vec2(
    fbm(q * 0.82 + vec2(time * 0.16, -time * 0.09)),
    fbm(q.yx * 0.8 + vec2(-time * 0.11, time * 0.14))
  );
  q += (flow - 0.5) * uTurbulence;

  float f1 = fbm(q + flow * uFluidity + time * 0.08);
  float f2 = fbm(q * 1.8 - flow.yx * 1.2 - time * 0.1);
  float f3 = fbm(q * 3.2 + vec2(time * 0.22, -time * 0.18));

  float veins = ridge(f1 + f2 * 0.55);
  float ink = smoothstep(0.42, 0.84, veins + f3 * 0.22);
  float rim = smoothstep(uSharpness, 1.0, ink) - smoothstep(1.0 - uRimWidth, 1.0, ink);
  float hot = pow(max(rim, 0.0), 1.35) * uGlow;
  float shimmer = pow(max(0.0, ridge(f3 + time * 0.12)), 5.0) * uShimmer * ink;

  vec3 color = vec3(0.005, 0.004, 0.008);
  vec3 ferro = mix(uColor1, uColor2, smoothstep(0.2, 0.9, f2));
  ferro = mix(ferro, uColor3, shimmer);
  color += ferro * (hot + shimmer * 0.5);
  color += ferro * ink * 0.06;

  float vignette = smoothstep(1.55, 0.15, length(p));
  color = aces(color * vignette);
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`

export interface FerrofluidShaderProps {
  speed?: number
  scale?: number
  turbulence?: number
  fluidity?: number
  rimWidth?: number
  sharpness?: number
  shimmer?: number
  glow?: number
  cursorStrength?: number
  cursorRadius?: number
  color1?: string
  color2?: string
  color3?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function FerrofluidShader({
  speed = 0.45,
  scale = 1.6,
  turbulence = 1,
  fluidity = 0.1,
  rimWidth = 0.2,
  sharpness = 2.5,
  shimmer = 1.5,
  glow = 2,
  cursorStrength = 1,
  cursorRadius = 0.35,
  color1 = "#ffffff",
  color2 = "#ffffff",
  color3 = "#ffffff",
  enableMouseInteraction = true,
  className,
}: FerrofluidShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uScale: { value: clamp(scale, 0.5, 4) },
      uTurbulence: { value: clamp(turbulence, 0, 3) },
      uFluidity: { value: clamp(fluidity, 0, 2) },
      uRimWidth: { value: clamp(rimWidth, 0.02, 0.8) },
      uSharpness: { value: clamp(sharpness, 0.2, 5) },
      uShimmer: { value: clamp(shimmer, 0, 4) },
      uGlow: { value: clamp(glow, 0, 4) },
      uCursorStrength: { value: clamp(cursorStrength, 0, 4) },
      uCursorRadius: { value: clamp(cursorRadius, 0.05, 1.5) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uColor3: { value: hexToRgb(color3) },
    }),
    [
      color1,
      color2,
      color3,
      cursorRadius,
      cursorStrength,
      fluidity,
      glow,
      rimWidth,
      scale,
      sharpness,
      shimmer,
      speed,
      turbulence,
    ]
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

