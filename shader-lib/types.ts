export type UniformControlType =
  | "float"
  | "int"
  | "bool"
  | "vec2"
  | "vec3"
  | "vec4"
  | "color"
  | "slider"
  | "toggle"
  | "dropdown"

export interface ShaderUniformMetadata {
  name: string
  label: string
  type: UniformControlType
  defaultValue: number | boolean | string | number[]
  min?: number
  max?: number
  step?: number
  description: string
}

export interface ShaderMetadata {
  name: string
  slug: string
  description: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  author: string
  license: string
  version: string
  component: string
  uniforms: ShaderUniformMetadata[]
  examples: string[]
  performanceNotes: string[]
}

