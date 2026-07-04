import type { ShaderExport } from "@/types/shader"

export const metadata = {
  name: "Galaxy",
  slug: "galaxy",
  description:
    "A spiral galaxy with rotating arms, dust lanes, star field, and a bright core. Combines polar coordinates with fbm noise for organic structure.",
  author: "shadercn",
  version: "1.0.0",
  tags: ["galaxy", "space", "spiral", "stars", "cosmos", "nebula"],
  difficulty: "advanced" as const,
  category: "atmosphere" as const,
  previewImage: "/shaders/galaxy-preview.png",
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
      default: 0.2,
      min: 0.0,
      max: 2.0,
      step: 0.01,
      description: "Animation speed",
      group: "Animation",
    },
    {
      name: "uRotationSpeed",
      type: "float" as const,
      default: 0.3,
      min: -2.0,
      max: 2.0,
      step: 0.01,
      description: "Rotation speed",
      group: "Animation",
    },
    {
      name: "uStarDensity",
      type: "float" as const,
      default: 1.0,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      description: "Star density",
      group: "Appearance",
    },
    {
      name: "uColor1",
      type: "color" as const,
      default: [0.2, 0.1, 0.5],
      description: "Inner color",
      group: "Colors",
    },
    {
      name: "uColor2",
      type: "color" as const,
      default: [0.5, 0.2, 0.8],
      description: "Mid color",
      group: "Colors",
    },
    {
      name: "uColor3",
      type: "color" as const,
      default: [0.1, 0.4, 0.8],
      description: "Outer color",
      group: "Colors",
    },
  ],
  license: "MIT",
  createdAt: "2025-01-01",
  updatedAt: "2025-01-01",
  relatedShaders: ["aurora", "noise", "gradient"],
}

export { default as fragmentShader } from "./fragment.glsl"
export { default as vertexShader } from "./vertex.glsl"

export const defaultUniforms = {
  uTime: 0,
  uSpeed: 0.2,
  uRotationSpeed: 0.3,
  uStarDensity: 1.0,
  uColor1: [0.2, 0.1, 0.5],
  uColor2: [0.5, 0.2, 0.8],
  uColor3: [0.1, 0.4, 0.8],
}
