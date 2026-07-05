"use client"

import { useMemo } from "react"

import { ShaderCanvas } from "@/components/shaders/ShaderCanvas"
import { clamp, hexToRgb } from "@/components/shaders/shader-utils"

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAngle;
uniform float uNoiseAmount;
uniform float uBlindsCount;
uniform float uMinBlindWidth;
uniform float uSpotRadius;
uniform float uDistort;
uniform float uMouseDamp;
uniform vec3 uColor1;
uniform vec3 uColor2;

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
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.z, -1.0) * 2.0;
  float time = uTime * 0.15;

  vec2 q = rotate2D(p, uAngle);
  q.x += noise(q * 1.8 + time) * uDistort;

  float blindCoord = q.x * uBlindsCount;
  float cell = fract(blindCoord);
  float randomWidth = mix(uMinBlindWidth, 0.96, hash(vec2(floor(blindCoord), 2.7)));
  float blind = smoothstep(randomWidth, randomWidth - 0.08, cell);

  float spot = exp(-dot(p - mouse * uMouseDamp, p - mouse * uMouseDamp) / max(uSpotRadius, 0.001));
  float body = smoothstep(1.25, 0.0, length(p * vec2(0.72, 1.05)));
  float n = hash(gl_FragCoord.xy + floor(uTime * 24.0));
  float grain = mix(1.0, n, uNoiseAmount);

  vec3 color = mix(uColor1, uColor2, smoothstep(-0.85, 0.9, q.y + spot));
  float light = blind * body * (0.18 + spot * 1.45);
  color *= light * grain;

  gl_FragColor = vec4(color, 1.0);
}
`

export interface GradientBlindsShaderProps {
  angle?: number
  noiseAmount?: number
  blindsCount?: number
  minBlindWidth?: number
  spotRadius?: number
  distort?: number
  mouseDamp?: number
  color1?: string
  color2?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function GradientBlindsShader({
  angle = 20,
  noiseAmount = 0.5,
  blindsCount = 16,
  minBlindWidth = 0.6,
  spotRadius = 0.5,
  distort = 0,
  mouseDamp = 0.15,
  color1 = "#ff9ffc",
  color2 = "#5227ff",
  enableMouseInteraction = true,
  className,
}: GradientBlindsShaderProps) {
  const uniforms = useMemo(
    () => ({
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoiseAmount: { value: clamp(noiseAmount, 0, 1) },
      uBlindsCount: { value: clamp(blindsCount, 2, 40) },
      uMinBlindWidth: { value: clamp(minBlindWidth, 0.1, 0.95) },
      uSpotRadius: { value: clamp(spotRadius, 0.05, 2) },
      uDistort: { value: clamp(distort, 0, 2) },
      uMouseDamp: { value: clamp(mouseDamp, 0, 1) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
    }),
    [angle, blindsCount, color1, color2, distort, minBlindWidth, mouseDamp, noiseAmount, spotRadius]
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

