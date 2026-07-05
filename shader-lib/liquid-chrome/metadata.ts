import type { ShaderMetadata } from "@/shader-lib/types"

export const liquidChromeMetadata = {
  name: "Liquid Chrome",
  slug: "liquid-chrome",
  description:
    "A reflective metaball surface for cards, feature panels, and product moments.",
  tags: ["metaballs", "card", "liquid", "chrome", "interactive"],
  difficulty: "intermediate",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "LiquidChromeShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.7,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "distortion",
      label: "Distortion",
      type: "slider",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Amount of wave distortion applied to the blobs.",
    },
    {
      name: "roughness",
      label: "Roughness",
      type: "slider",
      defaultValue: 0.35,
      min: 0,
      max: 1,
      step: 0.05,
      description: "Fine grain visible on the reflective surface.",
    },
    {
      name: "baseColor",
      label: "Base Color",
      type: "color",
      defaultValue: "#B8FFF1",
      description: "Main surface color.",
    },
    {
      name: "highlightColor",
      label: "Highlight",
      type: "color",
      defaultValue: "#FF6B4A",
      description: "Specular edge and reflection tint.",
    },
  ],
  examples: [
    '<LiquidChromeShader distortion={1.1} roughness={0.35} baseColor="#B8FFF1" highlightColor="#FF6B4A" />',
  ],
  performanceNotes: [
    "Uses seven signed-distance blobs in a single pass.",
    "Designed for contained cards as well as full-bleed sections.",
  ],
} satisfies ShaderMetadata

