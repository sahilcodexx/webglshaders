import type { ShaderMetadata } from "@/shader-lib/types"

export const gradientBlindsMetadata = {
  name: "Gradient Blinds",
  slug: "gradient-blinds",
  description:
    "Diagonal gradient blinds with spotlight falloff, grain, randomized widths, and optional distortion.",
  tags: ["gradient", "blinds", "spotlight", "grain", "background"],
  difficulty: "beginner",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "GradientBlindsShader",
  uniforms: [
    {
      name: "angle",
      label: "Angle",
      type: "slider",
      defaultValue: 20,
      min: -90,
      max: 90,
      step: 1,
      description: "Blind rotation in degrees.",
    },
    {
      name: "blindsCount",
      label: "Blinds Count",
      type: "slider",
      defaultValue: 16,
      min: 2,
      max: 40,
      step: 1,
      description: "Number of visible blinds.",
    },
    {
      name: "spotRadius",
      label: "Spot Radius",
      type: "slider",
      defaultValue: 0.5,
      min: 0.05,
      max: 2,
      step: 0.01,
      description: "Size of the illuminated area.",
    },
  ],
  examples: [
    '<GradientBlindsShader angle={20} blindsCount={16} color1="#ff9ffc" color2="#5227ff" />',
  ],
  performanceNotes: [
    "Cheap procedural stripes with grain.",
    "No loops in the fragment body.",
  ],
} satisfies ShaderMetadata

