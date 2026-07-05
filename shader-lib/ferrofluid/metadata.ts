import type { ShaderMetadata } from "@/shader-lib/types"

export const ferrofluidMetadata = {
  name: "Ferrofluid",
  slug: "ferrofluid",
  description:
    "Monochrome liquid-metal wisps with rim glow, shimmer, turbulence, and cursor magnetism.",
  tags: ["fluid", "ridges", "monochrome", "cursor", "background"],
  difficulty: "intermediate",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "FerrofluidShader",
  uniforms: [
    {
      name: "scale",
      label: "Scale",
      type: "slider",
      defaultValue: 1.6,
      min: 0.5,
      max: 4,
      step: 0.05,
      description: "Controls the size of the fluid cells.",
    },
    {
      name: "turbulence",
      label: "Turbulence",
      type: "slider",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Domain-warp strength.",
    },
    {
      name: "rimWidth",
      label: "Rim Width",
      type: "slider",
      defaultValue: 0.2,
      min: 0.02,
      max: 0.8,
      step: 0.01,
      description: "Width of glowing fluid edges.",
    },
  ],
  examples: [
    '<FerrofluidShader scale={1.6} turbulence={1} rimWidth={0.2} glow={2} color1="#ffffff" />',
  ],
  performanceNotes: [
    "Single-pass 2D FBM with five octaves.",
    "No textures, framebuffers, or raymarching.",
  ],
} satisfies ShaderMetadata

