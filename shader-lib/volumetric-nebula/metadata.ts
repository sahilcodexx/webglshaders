import type { ShaderMetadata } from "@/shader-lib/types"

export const volumetricNebulaMetadata = {
  name: "Volumetric Nebula",
  slug: "volumetric-nebula",
  description:
    "A single-pass volume raymarch with 3D FBM, domain warping, star field, tone mapping, and cursor parallax.",
  tags: ["volumetric", "fbm", "domain-warp", "space", "raymarching"],
  difficulty: "advanced",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "VolumetricNebulaShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.55,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "density",
      label: "Density",
      type: "slider",
      defaultValue: 1.2,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Volume density multiplier.",
    },
    {
      name: "falloff",
      label: "Falloff",
      type: "slider",
      defaultValue: 0.42,
      min: 0.1,
      max: 0.9,
      step: 0.01,
      description: "Noise threshold for cloud formation.",
    },
  ],
  examples: [
    '<VolumetricNebulaShader density={1.2} falloff={0.42} color1="#38BDF8" color2="#A78BFA" color3="#FB7185" />',
  ],
  performanceNotes: [
    "Uses 56 volume samples and six FBM octaves.",
    "Reduce density or starIntensity for subtle UI backgrounds.",
  ],
} satisfies ShaderMetadata

