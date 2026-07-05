"use client"

import { ShaderCanvas } from "./ShaderCanvas"
import { parseColor } from "./shader-utils"

export interface CosmicShaderProps {
  color1?: string
  color2?: string
  color3?: string
  speed?: number
  noiseDensity?: number
  noiseStrength?: number
  holographicIntensity?: number
  className?: string
}

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uHolographicIntensity;

varying vec2 vUv;
varying vec3 vPos;
varying float vHolographicIntensity;
varying float vCosmicWave;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)),
                 hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)),
                 hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec3 color1 = uColor1;
  vec3 color2 = uColor2;
  vec3 color3 = uColor3;

  float t = uTime * uSpeed;

  float interference1 = sin(vPos.x * 20.0 + t * 3.0) * cos(vPos.y * 15.0 + t * 2.0);
  float interference2 = sin(vPos.x * 35.0 + t * 4.0) * sin(vPos.y * 30.0 + t * 3.5);
  float interference3 = cos(vPos.x * 50.0 + t * 5.0) * cos(vPos.y * 45.0 + t * 4.5);

  float holographicPattern = (interference1 + interference2 * 0.5 + interference3 * 0.25) / 1.75;

  float shimmer = noise2D(vPos.xy * 40.0 + t * 2.0) * 0.3;
  float cosmicGlow = noise2D(vPos.xy * 8.0 + t * 0.5) * 0.5;

  vec3 holographicShift = vec3(
    sin(vPos.x * 10.0 + t * 2.0 + 0.0) * 0.1,
    sin(vPos.x * 10.0 + t * 2.0 + 2.094) * 0.1,
    sin(vPos.x * 10.0 + t * 2.0 + 4.188) * 0.1
  );

  float gradientX = smoothstep(-4.0, 4.0, vPos.x + holographicPattern * 2.0);
  float gradientY = smoothstep(-4.0, 4.0, vPos.y + vCosmicWave * 1.5);
  float gradientZ = smoothstep(-2.0, 2.0, vPos.z + shimmer);

  vec3 baseGradient = mix(
    mix(color1, color2, gradientX),
    color3,
    gradientY * 0.7 + gradientZ * 0.3
  );

  vec3 holographicColor = baseGradient + holographicShift;

  vec3 cosmicEnhancement = vec3(
    cosmicGlow * 0.2,
    shimmer * 0.15,
    (cosmicGlow + shimmer) * 0.1
  );

  float intensityMod = 1.0 + vHolographicIntensity * 0.5 + abs(holographicPattern) * 0.3;

  vec3 finalColor = (holographicColor + cosmicEnhancement) * intensityMod;

  float iridescence = sin(vPos.x * 25.0 + t * 3.0) * cos(vPos.y * 20.0 + t * 2.5) * 0.1;
  finalColor += vec3(iridescence * 0.2, iridescence * 0.3, iridescence * 0.4);

  float mouseInfluence = 1.0 - length(vUv - uMouse) * 0.5;
  mouseInfluence = clamp(mouseInfluence, 0.0, 1.0);
  mouseInfluence = smoothstep(0.0, 1.0, mouseInfluence);

  finalColor += mouseInfluence * 0.15;

  gl_FragColor = vec4(finalColor, 1.0);
}
`

export function CosmicShader({
  color1 = "#5227ff",
  color2 = "#dbba95",
  color3 = "#d0bce1",
  speed = 0.4,
  noiseDensity = 5.5,
  noiseStrength = 4.0,
  holographicIntensity = 1.0,
  className,
}: CosmicShaderProps) {
  const c1 = parseColor(color1)
  const c2 = parseColor(color2)
  const c3 = parseColor(color3)

  return (
    <ShaderCanvas
      fragmentShader={fragmentShader}
      uniforms={{
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 },
        uSpeed: { value: speed },
        uNoiseDensity: { value: noiseDensity },
        uNoiseStrength: { value: noiseStrength },
        uHolographicIntensity: { value: holographicIntensity },
      }}
      className={className}
    />
  )
}
