import type { ShaderExport } from "@/types/shader"

export const metadata = {
  name: "Aurora",
  slug: "aurora",
  description:
    "A flowing aurora borealis effect with multiple colour bands and organic motion. Uses layered fbm noise to create realistic northern lights.",
  author: "shadercn",
  version: "1.0.0",
  tags: ["aurora", "atmosphere", "noise", "northern-lights", "sky"],
  difficulty: "intermediate" as const,
  category: "atmosphere" as const,
  previewImage: "/shaders/aurora-preview.png",
  uniforms: [
    {
      name: "uSpeed",
      type: "float" as const,
      default: 0.3,
      min: 0.0,
      max: 2.0,
      step: 0.01,
      description: "Animation speed",
      group: "Animation",
    },
    {
      name: "uIntensity",
      type: "float" as const,
      default: 1.0,
      min: 0.0,
      max: 3.0,
      step: 0.01,
      description: "Brightness intensity",
      group: "Appearance",
    },
    {
      name: "uColor1",
      type: "color" as const,
      default: [0.1, 0.8, 0.4],
      description: "Primary color (green)",
      group: "Colors",
    },
    {
      name: "uColor2",
      type: "color" as const,
      default: [0.4, 0.2, 0.8],
      description: "Secondary color (purple)",
      group: "Colors",
    },
    {
      name: "uColor3",
      type: "color" as const,
      default: [0.0, 0.9, 0.6],
      description: "Accent color (teal)",
      group: "Colors",
    },
  ],
  license: "MIT",
  createdAt: "2025-01-01",
  updatedAt: "2025-01-01",
  relatedShaders: ["galaxy", "gradient", "noise"],
}

export { default as fragmentShader } from "./fragment.glsl"
export { default as vertexShader } from "./vertex.glsl"

export const defaultUniforms = {
  uTime: 0,
  uSpeed: 0.3,
  uIntensity: 1.0,
  uColor1: [0.1, 0.8, 0.4],
  uColor2: [0.4, 0.2, 0.8],
  uColor3: [0.0, 0.9, 0.6],
}
