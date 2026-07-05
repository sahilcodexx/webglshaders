"use client"

import { useMemo } from "react"

import { ShaderCanvas } from "@/components/shaders/ShaderCanvas"
import { clamp, hexToRgb } from "@/components/shaders/shader-utils"

const fragmentShader = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uGridScale;
uniform float uWarp;
uniform float uLineWidth;
uniform float uGlow;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBackgroundColor;

float lineMask(vec2 p, float width) {
  vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p);
  float line = min(grid.x, grid.y);
  return 1.0 - smoothstep(width, width + 1.0, line);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.z;

  float time = uTime * uSpeed;
  vec2 cursor = (uMouse - 0.5) * vec2(1.4, -1.0);
  float cursorDistance = length(p - cursor);
  float cursorPull = exp(-cursorDistance * cursorDistance * 2.2);

  vec2 q = p;
  float radius = length(q);
  float angle = atan(q.y, q.x);
  angle += sin(radius * 5.0 - time) * 0.12 * uWarp;
  radius += sin(angle * 5.0 + time * 0.8) * 0.04 * uWarp;
  q = vec2(cos(angle), sin(angle)) * radius;
  q += normalize(q - cursor + 0.0001) * cursorPull * 0.18 * uWarp;

  vec2 perspective = q / (1.0 + max(q.y + 0.65, -0.35) * 0.55);
  perspective.y += time * 0.18;

  float primary = lineMask(perspective * uGridScale, uLineWidth);
  float secondary = lineMask((perspective + 0.5 / uGridScale) * uGridScale * 0.5, uLineWidth);
  float horizon = smoothstep(1.15, -0.2, abs(p.y + 0.15));
  float vignette = smoothstep(1.45, 0.15, length(p));

  float grid = (primary + secondary * 0.35) * horizon * vignette;
  float pulse = 0.65 + 0.35 * sin(time * 2.0 + radius * 7.0);
  vec3 lineColor = mix(uColor1, uColor2, smoothstep(-0.8, 0.9, p.y + cursorPull));
  vec3 color = uBackgroundColor;
  color += lineColor * grid * (0.65 + uGlow * pulse);
  color += lineColor * pow(grid, 3.0) * uGlow;
  color += uColor2 * cursorPull * 0.18 * vignette;

  gl_FragColor = vec4(color, clamp(grid * (0.55 + uGlow) + cursorPull * 0.18, 0.0, 1.0));
}
`

export interface WarpGridShaderProps {
  speed?: number
  gridScale?: number
  warp?: number
  lineWidth?: number
  glow?: number
  color1?: string
  color2?: string
  backgroundColor?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function WarpGridShader({
  speed = 0.75,
  gridScale = 12,
  warp = 1,
  lineWidth = 1,
  glow = 0.75,
  color1 = "#67E8F9",
  color2 = "#FB7185",
  backgroundColor = "#020617",
  enableMouseInteraction = true,
  className,
}: WarpGridShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uGridScale: { value: clamp(gridScale, 4, 32) },
      uWarp: { value: clamp(warp, 0, 3) },
      uLineWidth: { value: clamp(lineWidth, 0.25, 3) },
      uGlow: { value: clamp(glow, 0, 2) },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uBackgroundColor: { value: hexToRgb(backgroundColor) },
    }),
    [backgroundColor, color1, color2, glow, gridScale, lineWidth, speed, warp]
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
