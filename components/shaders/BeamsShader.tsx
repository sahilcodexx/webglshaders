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
uniform float uBeamCount;
uniform float uBeamWidth;
uniform float uBeamHeight;
uniform float uNoiseIntensity;
uniform float uNoiseScale;
uniform float uRotation;
uniform vec3 uColor;

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

vec2 rotate2D(vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(0.5, -0.35);
  float time = uTime * uSpeed;

  vec2 q = rotate2D(p + mouse * 0.15, uRotation);
  q.x += sin(q.y * 2.0 + time * 0.7) * 0.08;

  float strips = fract(q.x * uBeamCount + time * 0.22);
  float beam = smoothstep(uBeamWidth, 0.0, abs(strips - 0.5));
  float band = exp(-q.y * q.y * uBeamHeight);
  float fade = smoothstep(1.45, -0.25, length(p * vec2(0.75, 1.1)));
  float n = noise(q * uNoiseScale + time * 0.15);
  float grain = hash(gl_FragCoord.xy + time);

  float light = beam * band * fade;
  light *= 0.72 + n * uNoiseIntensity;
  light += pow(light, 2.2) * 0.65;

  vec3 color = uColor * light;
  color += vec3(grain * 0.06 * light);
  color = pow(color, vec3(0.85));

  gl_FragColor = vec4(color, 1.0);
}
`

export interface BeamsShaderProps {
  speed?: number
  beamCount?: number
  beamWidth?: number
  beamHeight?: number
  noiseIntensity?: number
  noiseScale?: number
  rotation?: number
  color?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function BeamsShader({
  speed = 2,
  beamCount = 20,
  beamWidth = 0.32,
  beamHeight = 30,
  noiseIntensity = 1.75,
  noiseScale = 0.2,
  rotation = 30,
  color = "#ffffff",
  enableMouseInteraction = true,
  className,
}: BeamsShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 5) },
      uBeamCount: { value: clamp(beamCount, 2, 64) },
      uBeamWidth: { value: clamp(beamWidth, 0.02, 0.9) },
      uBeamHeight: { value: clamp(beamHeight, 1, 80) },
      uNoiseIntensity: { value: clamp(noiseIntensity, 0, 4) },
      uNoiseScale: { value: clamp(noiseScale, 0.05, 4) },
      uRotation: { value: (rotation * Math.PI) / 180 },
      uColor: { value: hexToRgb(color) },
    }),
    [beamCount, beamHeight, beamWidth, color, noiseIntensity, noiseScale, rotation, speed]
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

