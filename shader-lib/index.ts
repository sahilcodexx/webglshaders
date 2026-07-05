import { auroraMetadata } from "@/shader-lib/aurora/metadata"
import { beamsMetadata } from "@/shader-lib/beams/metadata"
import { darkVeilMetadata } from "@/shader-lib/dark-veil/metadata"
import { ditherFieldMetadata } from "@/shader-lib/dither-field/metadata"
import { ferrofluidMetadata } from "@/shader-lib/ferrofluid/metadata"
import { gradientBlindsMetadata } from "@/shader-lib/gradient-blinds/metadata"
import { kaleidoTunnelMetadata } from "@/shader-lib/kaleido-tunnel/metadata"
import { liquidChromeMetadata } from "@/shader-lib/liquid-chrome/metadata"
import { neonVeilMetadata } from "@/shader-lib/neon-veil/metadata"
import { plasmaBlobMetadata } from "@/shader-lib/plasma-blob/metadata"
import { raymarchGlassMetadata } from "@/shader-lib/raymarch-glass/metadata"
import { volumetricNebulaMetadata } from "@/shader-lib/volumetric-nebula/metadata"
import { warpGridMetadata } from "@/shader-lib/warp-grid/metadata"

export const shaders = [
  ferrofluidMetadata,
  auroraMetadata,
  beamsMetadata,
  darkVeilMetadata,
  ditherFieldMetadata,
  gradientBlindsMetadata,
  raymarchGlassMetadata,
  volumetricNebulaMetadata,
  kaleidoTunnelMetadata,
  liquidChromeMetadata,
  neonVeilMetadata,
  warpGridMetadata,
  plasmaBlobMetadata,
]

export {
  auroraMetadata,
  beamsMetadata,
  darkVeilMetadata,
  ditherFieldMetadata,
  ferrofluidMetadata,
  gradientBlindsMetadata,
  kaleidoTunnelMetadata,
  liquidChromeMetadata,
  neonVeilMetadata,
  plasmaBlobMetadata,
  raymarchGlassMetadata,
  volumetricNebulaMetadata,
  warpGridMetadata,
}
export type { ShaderMetadata, ShaderUniformMetadata, UniformControlType } from "./types"
