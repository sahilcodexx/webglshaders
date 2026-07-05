import type { ShaderMetadata } from "@/shader-lib/types"

export const darkVeilMetadata = {
  name: "Dark Veil",
  slug: "dark-veil",
  description:
    "A moody purple veil with optional noise, scanlines, hue shifting, and gentle warp.",
  tags: ["veil", "purple", "scanline", "dark", "background"],
  difficulty: "beginner",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "DarkVeilShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.5,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "warpAmount",
      label: "Warp",
      type: "slider",
      defaultValue: 0,
      min: 0,
      max: 2,
      step: 0.05,
      description: "Amount of veil distortion.",
    },
    {
      name: "color",
      label: "Color",
      type: "color",
      defaultValue: "#5227ff",
      description: "Primary veil color.",
    },
  ],
  examples: ['<DarkVeilShader speed={0.5} color="#5227ff" warpAmount={0.15} />'],
  performanceNotes: [
    "Single-pass mask with one value-noise lookup.",
    "Designed for large dark sections.",
  ],
} satisfies ShaderMetadata

