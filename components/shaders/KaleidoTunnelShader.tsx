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
uniform float uSegments;
uniform float uTwist;
uniform float uGlow;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

const float PI = 3.14159265359;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.0, 289.0))) * 45758.5453);
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
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = mat2(1.62, -1.18, 1.18, 1.62) * p;
    a *= 0.52;
  }
  return v;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(0.65, -0.65);
  float time = uTime * uSpeed;

  p += mouse * 0.18;
  float r = length(p);
  float angle = atan(p.y, p.x);
  float segmentAngle = 2.0 * PI / max(uSegments, 2.0);
  angle = abs(mod(angle + segmentAngle * 0.5, segmentAngle) - segmentAngle * 0.5);

  float tunnel = -log(max(r, 0.018));
  vec2 uv = vec2(angle / segmentAngle, tunnel);
  uv.y += time * 0.8;
  uv.x += sin(uv.y * 0.45 + time) * 0.14 * uTwist;

  float cells = 0.0;
  for (float i = 0.0; i < 4.0; i += 1.0) {
    vec2 q = uv * (2.0 + i * 1.35);
    q.x += sin(q.y * 0.7 + time * (0.55 + i * 0.12));
    float line = abs(fract(q.x) - 0.5);
    float rail = smoothstep(0.08, 0.0, line);
    float pulse = smoothstep(0.72, 1.0, sin(q.y * 2.2 - time * 1.5) * 0.5 + 0.5);
    cells += rail * pulse / (i + 1.0);
  }

  float mist = fbm(uv * vec2(2.5, 0.7) + time * 0.08);
  float center = pow(max(0.0, 1.0 - r), 3.0);
  float energy = clamp(cells * 0.85 + mist * 0.2 + center * 0.28, 0.0, 1.4);

  vec3 color = mix(uColor1, uColor2, smoothstep(0.1, 0.95, uv.x + mist * 0.25));
  color = mix(color, uColor3, smoothstep(0.35, 1.2, cells + center));
  color *= energy * uGlow;
  color += color * pow(energy, 3.0);
  color *= smoothstep(1.45, 0.05, r);

  color = aces(color);
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`

export interface KaleidoTunnelShaderProps {
  speed?: number
  segments?: number
  twist?: number
  glow?: number
  color1?: string
  color2?: string
  color3?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function KaleidoTunnelShader({
  speed = 0.8,
  segments = 8,
  twist = 1,
  glow = 1.15,
  color1 = "#22D3EE",
  color2 = "#FDE047",
  color3 = "#F472B6",
  enableMouseInteraction = true,
  className,
}: KaleidoTunnelShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uSegments: { value: clamp(segments, 3, 16) },
      uTwist: { value: clamp(twist, 0, 3) },
      uGlow: { value: clamp(glow, 0, 3) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uColor3: { value: hexToRgb(color3) },
    }),
    [color1, color2, color3, glow, segments, speed, twist]
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

