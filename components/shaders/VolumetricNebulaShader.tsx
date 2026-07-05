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
uniform float uDensity;
uniform float uFalloff;
uniform float uStarIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), u.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x),
      u.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x),
      u.y
    ),
    u.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = mat3(
      0.0, 0.8, 0.6,
      -0.8, 0.36, -0.48,
      -0.6, -0.48, 0.64
    ) * p * 2.02;
    amplitude *= 0.52;
  }

  return value;
}

float starField(vec2 uv, float time) {
  vec2 grid = floor(uv * 150.0);
  vec2 local = fract(uv * 150.0) - 0.5;
  float h = fract(sin(dot(grid, vec2(127.1, 311.7))) * 43758.5453);
  float star = smoothstep(0.012, 0.0, length(local)) * step(0.985, h);
  return star * (0.6 + 0.4 * sin(time * 3.0 + h * 20.0));
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(0.8, -0.55);
  float time = uTime * uSpeed;

  vec3 ro = vec3(mouse.x, mouse.y * 0.7, -2.6);
  vec3 rd = normalize(vec3(p, 1.55));
  rd.xy += mouse * 0.12;

  vec3 color = vec3(0.0);
  float transmittance = 1.0;
  float depth = 0.0;

  for (int i = 0; i < 36; i++) {
    vec3 pos = ro + rd * depth;
    pos.z += time * 0.22;

    vec3 warped = pos;
    warped.xy += vec2(
      fbm(pos * 0.72 + vec3(0.0, time * 0.12, 1.7)),
      fbm(pos.yzx * 0.7 - vec3(time * 0.1, 0.0, 2.4))
    ) * 0.85;

    float cloud = fbm(warped * 1.15);
    cloud = smoothstep(uFalloff, 1.0, cloud);
    float shell = smoothstep(1.35, 0.1, length(pos.xy * vec2(0.9, 1.2)));
    float density = cloud * shell * uDensity;

    vec3 palette = mix(uColor1, uColor2, smoothstep(0.15, 0.85, cloud));
    palette = mix(palette, uColor3, smoothstep(0.4, 1.0, length(pos.xy) + cloud * 0.35));
    color += transmittance * palette * density * 0.075;
    transmittance *= exp(-density * 0.055);
    depth += 0.075;

    if (transmittance < 0.015) {
      break;
    }
  }

  float stars = starField(uv + mouse * 0.015, time) * uStarIntensity;
  color += vec3(stars);
  color += uColor2 * pow(max(0.0, 1.0 - length(p * vec2(0.55, 0.8))), 4.0) * 0.18;

  color = aces(color * 1.35);
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`

export interface VolumetricNebulaShaderProps {
  speed?: number
  density?: number
  falloff?: number
  starIntensity?: number
  color1?: string
  color2?: string
  color3?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function VolumetricNebulaShader({
  speed = 0.55,
  density = 1.2,
  falloff = 0.42,
  starIntensity = 0.75,
  color1 = "#38BDF8",
  color2 = "#A78BFA",
  color3 = "#FB7185",
  enableMouseInteraction = true,
  className,
}: VolumetricNebulaShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uDensity: { value: clamp(density, 0, 3) },
      uFalloff: { value: clamp(falloff, 0.1, 0.9) },
      uStarIntensity: { value: clamp(starIntensity, 0, 2) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uColor3: { value: hexToRgb(color3) },
    }),
    [color1, color2, color3, density, falloff, speed, starIntensity]
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
