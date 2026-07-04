import type { ShaderExport } from "@/types/shader"

export const metadata = {
  name: "Water",
  slug: "water",
  description:
    "A realistic water surface effect with layered waves, foam, reflections, and depth-based coloring. Combines sine wave interference with fbm noise.",
  author: "shadercn",
  version: "1.0.0",
  tags: ["water", "ocean", "waves", "reflection", "surface"],
  difficulty: "advanced" as const,
  category: "water" as const,
  previewImage: "/shaders/water-preview.png",
  uniforms: [
    {
      name: "uTime",
      type: "float" as const,
      default: 0,
      min: 0,
      max: 100,
      step: 0.01,
      description: "Time",
      group: "Animation",
    },
    {
      name: "uSpeed",
      type: "float" as const,
      default: 0.5,
      min: 0.0,
      max: 3.0,
      step: 0.01,
      description: "Animation speed",
      group: "Animation",
    },
    {
      name: "uWaveHeight",
      type: "float" as const,
      default: 1.0,
      min: 0.0,
      max: 3.0,
      step: 0.01,
      description: "Wave intensity",
      group: "Waves",
    },
    {
      name: "uWaveFrequency",
      type: "float" as const,
      default: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      description: "Wave frequency",
      group: "Waves",
    },
    {
      name: "uDeepColor",
      type: "color" as const,
      default: [0.01, 0.02, 0.1],
      description: "Deep water color",
      group: "Colors",
    },
    {
      name: "uShallowColor",
      type: "color" as const,
      default: [0.0, 0.4, 0.3],
      description: "Shallow water color",
      group: "Colors",
    },
    {
      name: "uFoamColor",
      type: "color" as const,
      default: [0.9, 0.95, 1.0],
      description: "Foam color",
      group: "Colors",
    },
  ],
  license: "MIT",
  createdAt: "2025-01-01",
  updatedAt: "2025-01-01",
  relatedShaders: ["aurora", "gradient", "noise"],
}

export { default as fragmentShader } from "./fragment.glsl"
export { default as vertexShader } from "./vertex.glsl"

export const defaultUniforms = {
  uTime: 0,
  uSpeed: 0.5,
  uWaveHeight: 1.0,
  uWaveFrequency: 1.0,
  uDeepColor: [0.01, 0.02, 0.1],
  uShallowColor: [0.0, 0.4, 0.3],
  uFoamColor: [0.9, 0.95, 1.0],
}
