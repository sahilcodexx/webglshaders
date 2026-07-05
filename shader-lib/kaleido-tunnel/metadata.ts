import type { ShaderMetadata } from "@/shader-lib/types"

export const kaleidoTunnelMetadata = {
  name: "Kaleido Tunnel",
  slug: "kaleido-tunnel",
  description:
    "A polar-coordinate kaleidoscope tunnel with animated rails, FBM mist, additive glow, and cursor drift.",
  tags: ["kaleidoscope", "polar", "tunnel", "glow", "motion"],
  difficulty: "intermediate",
  author: "shadercn",
  license: "MIT",
  version: "0.1.0",
  component: "KaleidoTunnelShader",
  uniforms: [
    {
      name: "speed",
      label: "Speed",
      type: "slider",
      defaultValue: 0.8,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Animation speed multiplier.",
    },
    {
      name: "segments",
      label: "Segments",
      type: "slider",
      defaultValue: 8,
      min: 3,
      max: 16,
      step: 1,
      description: "Number of mirrored kaleidoscope wedges.",
    },
    {
      name: "twist",
      label: "Twist",
      type: "slider",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 0.05,
      description: "Longitudinal tunnel distortion.",
    },
  ],
  examples: ['<KaleidoTunnelShader segments={8} twist={1} glow={1.15} />'],
  performanceNotes: [
    "Uses polar UV manipulation rather than expensive 3D marching.",
    "Good for animated thumbnails, music visuals, and energetic heroes.",
  ],
} satisfies ShaderMetadata

