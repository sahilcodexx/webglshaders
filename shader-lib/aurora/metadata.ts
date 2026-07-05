import type { ShaderMetadata } from "@/shader-lib/types"

export const auroraMetadata = {
  name: "Aurora",
  slug: "aurora",
  description:
    "A layered polar light shader with soft curtains, cursor drift, and balanced accent colors.",
  tags: ["background", "hero", "gradient", "noise", "interactive"],
  difficulty: "intermediate",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "AuroraShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.65,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "intensity",
      label: "Intensity",
      type: "slider",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Overall brightness and alpha strength.",
    },
    {
      name: "blend",
      label: "Blend",
      type: "slider",
      defaultValue: 0.55,
      min: 0,
      max: 1.5,
      step: 0.05,
      description: "How strongly the upper accent color enters the curtain.",
    },
    {
      name: "colorA",
      label: "Color A",
      type: "color",
      defaultValue: "#22D3EE",
      description: "Primary cyan color.",
    },
    {
      name: "colorB",
      label: "Color B",
      type: "color",
      defaultValue: "#A855F7",
      description: "Secondary violet color.",
    },
    {
      name: "colorC",
      label: "Color C",
      type: "color",
      defaultValue: "#F8E16C",
      description: "Warm highlight color.",
    },
  ],
  examples: [
    '<AuroraShader speed={0.65} intensity={1} colorA="#22D3EE" colorB="#A855F7" colorC="#F8E16C" />',
  ],
  performanceNotes: [
    "Uses one full-screen triangle and five noise octaves.",
    "Keep intensity below 1.4 for subtle UI backgrounds.",
  ],
} satisfies ShaderMetadata

