import { cosmicMetadata } from "./cosmic/metadata"
import { glassMetadata } from "./glass/metadata"
import { gradientMetadata } from "./gradient/metadata"

export const shaders = [gradientMetadata, cosmicMetadata, glassMetadata]

export { cosmicMetadata, glassMetadata, gradientMetadata }
export type { ShaderMetadata, ShaderUniformMetadata, UniformControlType } from "./types"
