import type { ShaderMetadata, UniformDefinition } from "@/types/shader"

export interface RegistryShader {
  slug: string
  metadata: ShaderMetadata
  import: () => Promise<{
    fragmentShader: string
    vertexShader: string
    defaultUniforms: Record<string, unknown>
  }>
}

const shaderModules: RegistryShader[] = [
  {
    slug: "aurora",
    metadata: {
      name: "Aurora",
      slug: "aurora",
      description:
        "A flowing aurora borealis effect with multiple colour bands and organic motion.",
      author: "shadercn",
      version: "1.0.0",
      tags: ["aurora", "atmosphere", "noise", "northern-lights"],
      difficulty: "intermediate",
      category: "atmosphere",
      previewImage: "/shaders/aurora-preview.png",
      uniforms: [
        { name: "uSpeed", type: "float", default: 0.3, min: 0, max: 2, step: 0.01, description: "Animation speed", group: "Animation" },
        { name: "uIntensity", type: "float", default: 1.0, min: 0, max: 3, step: 0.01, description: "Brightness intensity", group: "Appearance" },
        { name: "uColor1", type: "color", default: [0.1, 0.8, 0.4], description: "Primary color", group: "Colors" },
        { name: "uColor2", type: "color", default: [0.4, 0.2, 0.8], description: "Secondary color", group: "Colors" },
        { name: "uColor3", type: "color", default: [0.0, 0.9, 0.6], description: "Accent color", group: "Colors" },
      ],
      license: "MIT",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      relatedShaders: ["galaxy", "gradient", "noise"],
    },
    import: () => import("@/shader-lib/aurora"),
  },
  {
    slug: "water",
    metadata: {
      name: "Water",
      slug: "water",
      description:
        "A realistic water surface effect with layered waves, foam, and depth-based coloring.",
      author: "shadercn",
      version: "1.0.0",
      tags: ["water", "ocean", "waves", "reflection", "surface"],
      difficulty: "advanced",
      category: "water",
      previewImage: "/shaders/water-preview.png",
      uniforms: [
        { name: "uSpeed", type: "float", default: 0.5, min: 0, max: 3, step: 0.01, description: "Animation speed", group: "Animation" },
        { name: "uWaveHeight", type: "float", default: 1.0, min: 0, max: 3, step: 0.01, description: "Wave intensity", group: "Waves" },
        { name: "uWaveFrequency", type: "float", default: 1.0, min: 0.1, max: 5, step: 0.1, description: "Wave frequency", group: "Waves" },
        { name: "uDeepColor", type: "color", default: [0.01, 0.02, 0.1], description: "Deep water color", group: "Colors" },
        { name: "uShallowColor", type: "color", default: [0.0, 0.4, 0.3], description: "Shallow water color", group: "Colors" },
        { name: "uFoamColor", type: "color", default: [0.9, 0.95, 1.0], description: "Foam color", group: "Colors" },
      ],
      license: "MIT",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      relatedShaders: ["aurora", "gradient", "noise"],
    },
    import: () => import("@/shader-lib/water"),
  },
  {
    slug: "noise",
    metadata: {
      name: "Noise",
      slug: "noise",
      description:
        "Animated fractal noise with domain warping. Creates organic, cloud-like textures.",
      author: "shadercn",
      version: "1.0.0",
      tags: ["noise", "fractal", "fbm", "cloud", "texture"],
      difficulty: "beginner",
      category: "noise",
      previewImage: "/shaders/noise-preview.png",
      uniforms: [
        { name: "uSpeed", type: "float", default: 0.3, min: 0, max: 2, step: 0.01, description: "Animation speed", group: "Animation" },
        { name: "uScale", type: "float", default: 3.0, min: 0.5, max: 10, step: 0.1, description: "Noise scale", group: "Pattern" },
        { name: "uIntensity", type: "float", default: 1.0, min: 0, max: 2, step: 0.01, description: "Noise intensity", group: "Pattern" },
        { name: "uOctaves", type: "int", default: 5, min: 1, max: 8, step: 1, description: "FBM octaves", group: "Pattern" },
        { name: "uContrast", type: "float", default: 1.5, min: 0.5, max: 5, step: 0.1, description: "Contrast", group: "Appearance" },
        { name: "uColor1", type: "color", default: [0.0, 0.0, 0.0], description: "Dark color", group: "Colors" },
        { name: "uColor2", type: "color", default: [1.0, 1.0, 1.0], description: "Light color", group: "Colors" },
      ],
      license: "MIT",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      relatedShaders: ["aurora", "water", "gradient"],
    },
    import: () => import("@/shader-lib/noise"),
  },
  {
    slug: "galaxy",
    metadata: {
      name: "Galaxy",
      slug: "galaxy",
      description:
        "A spiral galaxy with rotating arms, dust lanes, star field, and a bright core.",
      author: "shadercn",
      version: "1.0.0",
      tags: ["galaxy", "space", "spiral", "stars", "cosmos"],
      difficulty: "advanced",
      category: "atmosphere",
      previewImage: "/shaders/galaxy-preview.png",
      uniforms: [
        { name: "uSpeed", type: "float", default: 0.2, min: 0, max: 2, step: 0.01, description: "Animation speed", group: "Animation" },
        { name: "uRotationSpeed", type: "float", default: 0.3, min: -2, max: 2, step: 0.01, description: "Rotation speed", group: "Animation" },
        { name: "uStarDensity", type: "float", default: 1.0, min: 0, max: 5, step: 0.1, description: "Star density", group: "Appearance" },
        { name: "uColor1", type: "color", default: [0.2, 0.1, 0.5], description: "Inner color", group: "Colors" },
        { name: "uColor2", type: "color", default: [0.5, 0.2, 0.8], description: "Mid color", group: "Colors" },
        { name: "uColor3", type: "color", default: [0.1, 0.4, 0.8], description: "Outer color", group: "Colors" },
      ],
      license: "MIT",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      relatedShaders: ["aurora", "noise", "gradient"],
    },
    import: () => import("@/shader-lib/galaxy"),
  },
  {
    slug: "gradient",
    metadata: {
      name: "Gradient",
      slug: "gradient",
      description:
        "An animated multi-stop gradient with linear and radial modes, noise blending, and rotation control.",
      author: "shadercn",
      version: "1.0.0",
      tags: ["gradient", "color", "animation", "blend", "background"],
      difficulty: "beginner",
      category: "gradient",
      previewImage: "/shaders/gradient-preview.png",
      uniforms: [
        { name: "uSpeed", type: "float", default: 0.3, min: 0, max: 3, step: 0.01, description: "Animation speed", group: "Animation" },
        { name: "uAngle", type: "float", default: 0.0, min: 0, max: 6.283, step: 0.01, description: "Gradient angle", group: "Pattern" },
        { name: "uBlend", type: "float", default: 0.3, min: 0, max: 1, step: 0.01, description: "Noise blend amount", group: "Pattern" },
        { name: "uScale", type: "float", default: 1.0, min: 0.5, max: 3, step: 0.1, description: "Radial scale", group: "Pattern" },
        { name: "uColor1", type: "color", default: [0.1, 0.0, 0.2], description: "Color 1", group: "Colors" },
        { name: "uColor2", type: "color", default: [0.5, 0.0, 0.3], description: "Color 2", group: "Colors" },
        { name: "uColor3", type: "color", default: [0.8, 0.2, 0.2], description: "Color 3", group: "Colors" },
        { name: "uColor4", type: "color", default: [0.9, 0.6, 0.1], description: "Color 4", group: "Colors" },
      ],
      license: "MIT",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
      relatedShaders: ["aurora", "noise", "galaxy"],
    },
    import: () => import("@/shader-lib/gradient"),
  },
]

export function getShaderList(): RegistryShader[] {
  return shaderModules
}

export function getShaderBySlug(slug: string): RegistryShader | undefined {
  return shaderModules.find((s) => s.slug === slug)
}

export function getShadersByCategory(
  category: string
): RegistryShader[] {
  return shaderModules.filter((s) => s.metadata.category === category)
}

export function searchShaders(query: string): RegistryShader[] {
  const q = query.toLowerCase()
  return shaderModules.filter(
    (s) =>
      s.metadata.name.toLowerCase().includes(q) ||
      s.metadata.description.toLowerCase().includes(q) ||
      s.metadata.tags.some((t) => t.toLowerCase().includes(q))
  )
}
