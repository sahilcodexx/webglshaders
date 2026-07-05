"use client"

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <ShaderGradientCanvas
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient
          type="plane"
          shader="defaults"
          color1="#2b0b5e"
          color2="#8b3dff"
          color3="#00d4aa"
          uSpeed={0.3}
          uDensity={2.5}
          uStrength={0.6}
          animate="on"
          cAzimuthAngle={0}
          cPolarAngle={90}
          cDistance={6}
          lightType="3d"
        />
      </ShaderGradientCanvas>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Powered by @shadergradient/react
        </div>
        <h1 className="max-w-5xl text-5xl font-medium tracking-tight sm:text-7xl lg:text-8xl">
          The shadcn/ui
          <br />
          of shaders.
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/50 sm:text-lg">
          Reusable, typed shader components with metadata, controls, and
          installation paths built for modern React apps.
        </p>
      </div>
    </div>
  )
}
