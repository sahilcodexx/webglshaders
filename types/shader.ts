export type UniformType =
  | "float"
  | "int"
  | "bool"
  | "vec2"
  | "vec3"
  | "vec4"
  | "color"
  | "texture"
  | "select"

export interface UniformDefinition {
  name: string
  type: UniformType
  default: number | number[] | boolean | string
  min?: number
  max?: number
  step?: number
  description?: string
  group?: string
  options?: { label: string; value: string }[]
}

export interface ShaderMetadata {
  name: string
  slug: string
  description: string
  author: string
  version: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  category:
    | "atmosphere"
    | "water"
    | "noise"
    | "gradient"
    | "glass"
    | "glow"
    | "fire"
    | "smoke"
    | "blob"
    | "metaballs"
  previewImage: string
  uniforms: UniformDefinition[]
  license: string
  createdAt: string
  updatedAt: string
  relatedShaders: string[]
  fragmentShader?: string
  vertexShader?: string
}

export interface ShaderExport {
  metadata: ShaderMetadata
  fragmentShader: string
  vertexShader: string
  defaultUniforms: Record<string, unknown>
}

export interface ShaderRegistryEntry {
  slug: string
  metadata: ShaderMetadata
  import: () => Promise<ShaderExport>
}
