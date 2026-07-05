import type { ShaderMetadata } from "@/shader-lib/types"

export const beamsMetadata = {
  name: "Beams",
  slug: "beams",
  description:
    "Soft diagonal light bands with procedural grain, noise falloff, and cursor drift.",
  tags: ["beams", "light", "grain", "monochrome", "background"],
  difficulty: "beginner",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "BeamsShader",
  uniforms: [
    {
      name: "beamCount",
      label: "Beam Count",
      type: "slider",
      defaultValue: 20,
      min: 2,
      max: 64,
      step: 1,
      description: "Number of repeated beams.",
    },
    {
      name: "beamWidth",
      label: "Beam Width",
      type: "slider",
      defaultValue: 0.32,
      min: 0.02,
      max: 0.9,
      step: 0.01,
      description: "Width of each light band.",
    },
    {
      name: "rotation",
      label: "Rotation",
      type: "slider",
      defaultValue: 30,
      min: -90,
      max: 90,
      step: 1,
      description: "Beam direction in degrees.",
    },
  ],
  examples: ['<BeamsShader beamCount={20} beamWidth={0.32} rotation={30} noiseIntensity={1.75} />'],
  performanceNotes: [
    "Very cheap procedural beam mask.",
    "Good candidate for always-on hero usage if needed.",
  ],
} satisfies ShaderMetadata

