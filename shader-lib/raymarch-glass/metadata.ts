import type { ShaderMetadata } from "@/shader-lib/types"

export const raymarchGlassMetadata = {
  name: "Raymarch Glass",
  slug: "raymarch-glass",
  description:
    "A raymarched SDF glass object with smooth CSG, soft shadows, ambient occlusion, Fresnel, and ACES tone mapping.",
  tags: ["raymarching", "sdf", "lighting", "glass", "3d"],
  difficulty: "advanced",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "RaymarchGlassShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.75,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "scale",
      label: "Scale",
      type: "slider",
      defaultValue: 1,
      min: 0.55,
      max: 1.75,
      step: 0.05,
      description: "Object scale.",
    },
    {
      name: "lightStrength",
      label: "Light Strength",
      type: "slider",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Specular and key-light intensity.",
    },
  ],
  examples: [
    '<RaymarchGlassShader speed={0.75} scale={1} baseColor="#67E8F9" accentColor="#F0ABFC" />',
  ],
  performanceNotes: [
    "Uses 96 max raymarch steps and 42 max soft-shadow steps.",
    "Best for hero panels, feature cards, and high-impact previews.",
  ],
} satisfies ShaderMetadata

