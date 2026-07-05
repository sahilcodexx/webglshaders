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
uniform float uDistortion;
uniform float uRoughness;
uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;

varying vec2 vUv;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453);
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
  vec2 mouse = (uMouse - 0.5) * vec2(0.7, -0.45);

  vec2 q = p;
  q.x += sin(q.y * 5.0 + time) * 0.08 * uDistortion;
  q.y += cos(q.x * 4.0 - time * 0.7) * 0.08 * uDistortion;

  float field = 1.0;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    vec2 center = vec2(
      sin(time * (0.28 + fi * 0.04) + fi * 2.2) * 0.72,
      cos(time * (0.23 + fi * 0.05) + fi * 1.7) * 0.42
    );
    center += mouse * (0.14 + fi * 0.02);
    float radius = 0.22 + 0.08 * sin(fi * 3.1 + time * 0.8);
    field = min(field, sdCircle(q - center, radius));
  }

  float surface = smoothstep(0.05, -0.18, field);
  float edge = 1.0 - smoothstep(0.0, 0.09, abs(field));
  float grain = noise(q * (18.0 + uRoughness * 18.0) + time * 0.5);

  vec2 normalHint = vec2(
    noise(q * 5.0 + time) - noise(q * 5.0 - time),
    noise(q.yx * 5.0 - time * 0.7) - noise(q.yx * 5.0 + time * 0.7)
  );

  float reflection = pow(clamp(1.0 - abs(q.y + normalHint.y * 0.35), 0.0, 1.0), 2.2);
  float sweep = smoothstep(0.72, 0.0, abs(q.x + q.y * 0.5 - sin(time * 0.7) * 0.5));

  vec3 color = mix(uBaseColor * 0.13, uBaseColor, surface);
  color += uHighlightColor * (edge * 0.8 + reflection * surface * 0.7 + sweep * surface * 0.25);
  color += vec3(grain * 0.08) * surface;

  float alpha = clamp(surface * 0.82 + edge * 0.8, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`

export interface LiquidChromeShaderProps {
  speed?: number
  distortion?: number
  roughness?: number
  baseColor?: string
  highlightColor?: string
  className?: string
}

export function LiquidChromeShader({
  speed = 0.7,
  distortion = 1,
  roughness = 0.35,
  baseColor = "#B8FFF1",
  highlightColor = "#FF6B4A",
  className,
}: LiquidChromeShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uDistortion: { value: clamp(distortion, 0, 3) },
      uRoughness: { value: clamp(roughness, 0, 1) },
      uBaseColor: { value: hexToRgb(baseColor) },
      uHighlightColor: { value: hexToRgb(highlightColor) },
    }),
    [baseColor, distortion, highlightColor, roughness, speed]
  )

  return <ShaderCanvas className={className} fragmentShader={fragmentShader} uniforms={uniforms} />
}

