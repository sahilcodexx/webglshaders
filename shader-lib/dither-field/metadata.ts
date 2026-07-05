import type { ShaderMetadata } from "@/shader-lib/types"

export const ditherFieldMetadata = {
  name: "Dither Field",
  slug: "dither-field",
  description:
    "A cursor-reactive ordered dot field that works well for technical hero sections and CTAs.",
  tags: ["dither", "cursor", "grid", "background", "technical"],
  difficulty: "beginner",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "DitherFieldShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.8,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "scale",
      label: "Scale",
      type: "slider",
      defaultValue: 8,
      min: 4,
      max: 18,
      step: 1,
      description: "Pixel cell size for the dither grid.",
    },
    {
      name: "dotSize",
      label: "Dot Size",
      type: "slider",
      defaultValue: 0.42,
      min: 0.08,
      max: 0.5,
      step: 0.01,
      description: "Maximum radius of visible dots inside each cell.",
    },
    {
      name: "colorA",
      label: "Color A",
      type: "color",
      defaultValue: "#D4FF3F",
      description: "Low-luminance dot color.",
    },
    {
      name: "colorB",
      label: "Color B",
      type: "color",
      defaultValue: "#38BDF8",
      description: "High-luminance dot color.",
    },
  ],
  examples: ['<DitherFieldShader scale={8} dotSize={0.42} colorA="#D4FF3F" colorB="#38BDF8" />'],
  performanceNotes: [
    "Computes one grid cell per fragment without texture lookups.",
    "Increase scale on lower-power devices for fewer visible cells.",
  ],
} satisfies ShaderMetadata

