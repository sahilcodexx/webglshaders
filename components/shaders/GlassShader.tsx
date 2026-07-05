"use client"

import { ShaderCanvas } from "./ShaderCanvas"
import { parseColor } from "./shader-utils"

export interface GlassShaderProps {
  color1?: string
  color2?: string
  color3?: string
  speed?: number
  transparency?: number
  refraction?: number
  chromaticAberration?: number
  fresnelPower?: number
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
uniform float uTransparency;
uniform float uRefraction;
uniform float uChromaticAberration;
uniform float uFresnelPower;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vReflect;
varying vec3 vRefract;

float fresnel(vec3 viewDirection, vec3 normal, float power) {
  return pow(1.0 - dot(viewDirection, normal), power);
}

void main() {
  vec3 viewDirection = normalize(vPosition);
  vec3 worldNormal = normalize(vNormal);

  float fresnelFactor = fresnel(viewDirection, worldNormal, uFresnelPower);

  vec3 gradientColor = mix(uColor1, uColor2, vUv.y);
  gradientColor = mix(gradientColor, uColor3, fresnelFactor);

  vec3 reflectionColor = vReflect * 0.5 + 0.5;

  vec3 refractionColor;
  if (uChromaticAberration > 0.0) {
    vec3 refractedR = refract(-viewDirection, worldNormal, 1.0 / (uRefraction - uChromaticAberration));
    vec3 refractedG = refract(-viewDirection, worldNormal, 1.0 / uRefraction);
    vec3 refractedB = refract(-viewDirection, worldNormal, 1.0 / (uRefraction + uChromaticAberration));
    refractionColor = vec3(
      refractedR.x * 0.5 + 0.5,
      refractedG.y * 0.5 + 0.5,
      refractedB.z * 0.5 + 0.5
    );
  } else {
    refractionColor = vRefract * 0.5 + 0.5;
  }

  vec3 envColor = mix(refractionColor, reflectionColor, fresnelFactor * 0.8);

  vec3 finalColor = mix(gradientColor, envColor, 0.7);

  float mouseInfluence = 1.0 - length(vUv - uMouse) * 0.5;
  mouseInfluence = clamp(mouseInfluence, 0.0, 1.0);
  mouseInfluence = smoothstep(0.0, 1.0, mouseInfluence);

  finalColor += mouseInfluence * 0.1;

  float alpha = mix(uTransparency, 1.0, fresnelFactor * 0.5);

  gl_FragColor = vec4(finalColor, alpha);
}
`

export function GlassShader({
  color1 = "#67E8F9",
  color2 = "#F0ABFC",
  color3 = "#FCD34D",
  speed = 0.3,
  transparency = 0.3,
  refraction = 1.5,
  chromaticAberration = 0.1,
  fresnelPower = 3.0,
  className,
}: GlassShaderProps) {
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
        uTransparency: { value: transparency },
        uRefraction: { value: refraction },
        uChromaticAberration: { value: chromaticAberration },
        uFresnelPower: { value: fresnelPower },
        uWaveAmplitude: { value: 0.1 },
        uWaveFrequency: { value: 5.0 },
        uNoiseStrength: { value: 0.5 },
        uDistortion: { value: 0.5 },
      }}
      className={className}
    />
  )
}
