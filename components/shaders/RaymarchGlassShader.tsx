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
uniform float uRotation;
uniform float uLightStrength;
uniform vec3 uBaseColor;
uniform vec3 uAccentColor;
uniform vec3 uBackgroundColor;

const int MAX_STEPS = 64;
const float MAX_DIST = 18.0;
const float SURF_DIST = 0.0015;

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec2 mapScene(vec3 p) {
  float time = uTime * uSpeed;
  p.xz *= rot(time * 0.28 + uRotation);
  p.xy *= rot(sin(time * 0.22) * 0.35);

  vec3 q = p / uScale;
  q += 0.08 * sin(q.yzx * 4.0 + time);

  float core = sdSphere(q, 0.82);
  float cutBox = sdBox(q, vec3(0.58));
  float ringA = sdTorus(q.xzy, vec2(0.72, 0.055));
  float ringB = sdTorus(q.yxz, vec2(0.62, 0.045));
  float shape = smoothMin(core, cutBox, 0.28);
  shape = max(shape, -sdSphere(q - vec3(0.0, 0.0, 0.18), 0.45));
  shape = smoothMin(shape, ringA, 0.1);
  shape = smoothMin(shape, ringB, 0.08);

  return vec2(shape * uScale, 1.0);
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.0018, 0.0);
  return normalize(vec3(
    mapScene(p + e.xyy).x - mapScene(p - e.xyy).x,
    mapScene(p + e.yxy).x - mapScene(p - e.yxy).x,
    mapScene(p + e.yyx).x - mapScene(p - e.yyx).x
  ));
}

float raymarch(vec3 ro, vec3 rd) {
  float d = 0.0;

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * d;
    float sceneDistance = mapScene(p).x;
    d += sceneDistance * 0.82;

    if (abs(sceneDistance) < SURF_DIST || d > MAX_DIST) {
      break;
    }
  }

  return d;
}

float softShadow(vec3 ro, vec3 rd) {
  float result = 1.0;
  float t = 0.03;

  for (int i = 0; i < 24; i++) {
    float h = mapScene(ro + rd * t).x;
    result = min(result, 12.0 * h / t);
    t += clamp(h, 0.02, 0.18);

    if (result < 0.02 || t > 7.0) {
      break;
    }
  }

  return clamp(result, 0.0, 1.0);
}

float ambientOcclusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float weight = 1.0;

  for (int i = 0; i < 4; i++) {
    float h = 0.035 + 0.085 * float(i);
    float d = mapScene(p + n * h).x;
    occ += (h - d) * weight;
    weight *= 0.55;
  }

  return clamp(1.0 - occ * 2.2, 0.0, 1.0);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * vec2(1.0, -0.8);
  float time = uTime * uSpeed;

  vec3 ro = vec3(0.0, 0.05, 4.25);
  ro.xz *= rot(mouse.x * 0.75 + sin(time * 0.18) * 0.16);
  ro.y += mouse.y * 0.55;

  vec3 target = vec3(0.0, 0.0, 0.0);
  vec3 ww = normalize(target - ro);
  vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
  vec3 vv = cross(ww, uu);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.8 * ww);

  float d = raymarch(ro, rd);
  vec3 color = uBackgroundColor + vec3(0.035, 0.045, 0.065) * (1.0 - length(uv) * 0.35);

  if (d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);
    vec3 lightDir = normalize(vec3(-0.45, 0.82, 0.38));
    vec3 rimDir = normalize(vec3(0.65, 0.2, -0.72));
    vec3 viewDir = normalize(ro - p);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diff = max(dot(n, lightDir), 0.0);
    float shadow = softShadow(p + n * 0.025, lightDir);
    float ao = ambientOcclusion(p, n);
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 4.0);
    float spec = pow(max(dot(n, halfDir), 0.0), 90.0);
    float rim = pow(max(dot(n, rimDir), 0.0), 2.0);

    vec3 base = mix(uBaseColor, uAccentColor, p.y * 0.45 + 0.5 + fresnel * 0.35);
    vec3 glass = base * (0.14 + diff * shadow * 0.75) * ao;
    glass += vec3(1.0) * spec * shadow * uLightStrength;
    glass += uAccentColor * fresnel * 1.4;
    glass += uBaseColor * rim * 0.25;
    color = mix(color, glass, 0.95);
  }

  float vignette = smoothstep(1.45, 0.15, length(uv));
  color = aces(color * vignette);
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`

export interface RaymarchGlassShaderProps {
  speed?: number
  scale?: number
  rotation?: number
  lightStrength?: number
  baseColor?: string
  accentColor?: string
  backgroundColor?: string
  enableMouseInteraction?: boolean
  className?: string
}

export function RaymarchGlassShader({
  speed = 0.75,
  scale = 1,
  rotation = 0,
  lightStrength = 1,
  baseColor = "#67E8F9",
  accentColor = "#F0ABFC",
  backgroundColor = "#030712",
  enableMouseInteraction = true,
  className,
}: RaymarchGlassShaderProps) {
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: clamp(speed, 0, 3) },
      uScale: { value: clamp(scale, 0.55, 1.75) },
      uRotation: { value: (rotation * Math.PI) / 180 },
      uLightStrength: { value: clamp(lightStrength, 0, 3) },
      uBaseColor: { value: hexToRgb(baseColor) },
      uAccentColor: { value: hexToRgb(accentColor) },
      uBackgroundColor: { value: hexToRgb(backgroundColor) },
    }),
    [accentColor, backgroundColor, baseColor, lightStrength, rotation, scale, speed]
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
