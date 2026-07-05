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
uniform float uHueShift;
uniform float uNoiseIntensity;
uniform float uScanlineFrequency;
uniform float uScanlineIntensity;
uniform float uWarpAmount;
uniform vec3 uColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

vec2 rotate2D(vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(0.7, -0.45);
  float time = uTime * uSpeed;

  vec2 q = p;
  q += mouse * 0.12;
  q.x += sin(q.y * 3.0 + time) * 0.12 * uWarpAmount;
  q.y += noise(q * 2.0 + time * 0.08) * 0.16 * uWarpAmount;

  vec2 blade = rotate2D(q - vec2(-0.38, 0.08), -0.72 + sin(time * 0.12) * 0.08);
  float veil = smoothstep(0.62, -0.12, abs(blade.y)) * smoothstep(-1.05, 0.25, blade.x);
  veil *= smoothstep(1.0, -0.3, blade.x);

  float bloom = exp(-abs(blade.y) * 7.5) * smoothstep(-0.8, 0.32, blade.x);
  float n = noise(q * 4.0 + time * 0.14);
  float scan = sin(gl_FragCoord.y * uScanlineFrequency) * 0.5 + 0.5;

  vec3 shifted = mix(uColor, uColor.brg, clamp(uHueShift, 0.0, 1.0));
  vec3 color = vec3(0.0);
  color += shifted * veil * (0.58 + n * uNoiseIntensity);
  color += shifted * bloom * 0.75;
  color *= 1.0 - scan * uScanlineIntensity;
  color += vec3(hash(gl_FragCoord.xy + time) * 0.025 * uNoiseIntensity);

  float vignette = smoothstep(1.45, 0.2, length(p));
  gl_FragColor = vec4(color * vignette, 1.0);
}
`

export interface DarkVeilShaderProps {
  speed?: number
  hueShift?: number
  noiseIntensity?: number
  scanlineFrequency?: number
  scanlineIntensity?: number
  warpAmount?: number
  color?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function DarkVeilShader({
  speed = 0.5,
  hueShift = 0,
  noiseIntensity = 0,
  scanlineFrequency = 0,
  scanlineIntensity = 0,
  warpAmount = 0,
  color = "#5227ff",
  enableMouseInteraction = true,
  className,
}: DarkVeilShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uHueShift: { value: clamp(hueShift, 0, 1) },
      uNoiseIntensity: { value: clamp(noiseIntensity, 0, 2) },
      uScanlineFrequency: { value: clamp(scanlineFrequency, 0, 30) },
      uScanlineIntensity: { value: clamp(scanlineIntensity, 0, 1) },
      uWarpAmount: { value: clamp(warpAmount, 0, 2) },
      uColor: { value: hexToRgb(color) },
    }),
    [color, hueShift, noiseIntensity, scanlineFrequency, scanlineIntensity, speed, warpAmount]
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

