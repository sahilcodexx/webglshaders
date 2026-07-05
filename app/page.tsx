"use client"

import { ArrowUpRight, Code2, Copy, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import {
  AuroraShader,
  BeamsShader,
  DarkVeilShader,
  DitherFieldShader,
  FerrofluidShader,
  GradientBlindsShader,
  KaleidoTunnelShader,
  LiquidChromeShader,
  NeonVeilShader,
  PlasmaBlobShader,
  RaymarchGlassShader,
  VolumetricNebulaShader,
  WarpGridShader,
} from "@/components/shaders"
import { Button, buttonVariants } from "@/components/ui/button"
import { shaders } from "@/shader-lib"
import type { ShaderMetadata } from "@/shader-lib"
import { cn } from "@/utils/cn"

interface ShaderCardItem {
  metadata: ShaderMetadata
  preview: () => ReactNode
  usage: string
}

function ShaderPreviewCard({ metadata, preview, usage }: ShaderCardItem) {
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
      <div className="relative aspect-[1.25] overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(103,232,249,0.32),transparent_34%),radial-gradient(circle_at_72%_68%,rgba(251,113,133,0.24),transparent_36%),linear-gradient(135deg,#080808,#111827_48%,#050505)]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

        {isPreviewLoaded ? preview() : null}

        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.18)_56%,transparent)]" />

        {!isPreviewLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-black/45 text-white backdrop-blur hover:bg-white/10"
              onClick={() => setIsPreviewLoaded(true)}
            >
              Load preview
            </Button>
          </div>
        ) : null}

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-1.5">
            {metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[11px] text-white/68 backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {metadata.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/56">
                {metadata.description}
              </p>
            </div>
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/60">
              {metadata.difficulty}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-white/45">usage.tsx</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-white/55 hover:bg-white/10 hover:text-white"
              onClick={() => navigator.clipboard.writeText(usage)}
              aria-label={`Copy ${metadata.name} usage`}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <code className="block whitespace-pre-wrap break-words font-mono text-xs leading-5 text-white/68">
            {usage}
          </code>
        </div>
      </div>
    </article>
  )
}

export default function Home() {
  const shaderCards: ShaderCardItem[] = [
    {
      metadata: shaders[0],
      preview: () => (
        <FerrofluidShader
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
        />
      ),
      usage:
        '<FerrofluidShader scale={1.6} turbulence={1} rimWidth={0.2} glow={2} color1="#ffffff" />',
    },
    {
      metadata: shaders[1],
      preview: () => (
        <AuroraShader
          speed={1}
          blend={0.5}
          colorA="#7cff67"
          colorB="#b497cf"
          colorC="#5227ff"
        />
      ),
      usage:
        '<AuroraShader speed={1} blend={0.5} colorA="#7cff67" colorB="#b497cf" colorC="#5227ff" />',
    },
    {
      metadata: shaders[2],
      preview: () => (
        <BeamsShader
          beamCount={20}
          beamWidth={0.32}
          beamHeight={30}
          noiseIntensity={1.75}
          rotation={30}
        />
      ),
      usage:
        '<BeamsShader beamCount={20} beamWidth={0.32} beamHeight={30} noiseIntensity={1.75} rotation={30} />',
    },
    {
      metadata: shaders[3],
      preview: () => <DarkVeilShader speed={0.5} color="#5227ff" />,
      usage: '<DarkVeilShader speed={0.5} color="#5227ff" warpAmount={0} />',
    },
    {
      metadata: shaders[4],
      preview: () => <DitherFieldShader scale={8} dotSize={0.42} colorA="#808080" colorB="#ffffff" />,
      usage: '<DitherFieldShader scale={8} dotSize={0.42} colorA="#808080" colorB="#ffffff" />',
    },
    {
      metadata: shaders[5],
      preview: () => (
        <GradientBlindsShader
          angle={20}
          noiseAmount={0.5}
          blindsCount={16}
          minBlindWidth={0.6}
          spotRadius={0.5}
        />
      ),
      usage:
        '<GradientBlindsShader angle={20} blindsCount={16} color1="#ff9ffc" color2="#5227ff" />',
    },
    {
      metadata: shaders[6],
      preview: () => <RaymarchGlassShader lightStrength={1.25} />,
      usage:
        '<RaymarchGlassShader speed={0.75} scale={1} baseColor="#67E8F9" accentColor="#F0ABFC" />',
    },
    {
      metadata: shaders[7],
      preview: () => <VolumetricNebulaShader density={1.2} falloff={0.42} />,
      usage:
        '<VolumetricNebulaShader density={1.2} falloff={0.42} color1="#38BDF8" color2="#A78BFA" color3="#FB7185" />',
    },
    {
      metadata: shaders[8],
      preview: () => <KaleidoTunnelShader segments={8} twist={1} glow={1.15} />,
      usage: '<KaleidoTunnelShader segments={8} twist={1} glow={1.15} />',
    },
    {
      metadata: shaders[9],
      preview: () => <LiquidChromeShader distortion={1.15} roughness={0.4} />,
      usage:
        '<LiquidChromeShader distortion={1.15} roughness={0.4} baseColor="#B8FFF1" highlightColor="#FF6B4A" />',
    },
    {
      metadata: shaders[10],
      preview: () => <NeonVeilShader density={8.5} intensity={1.12} />,
      usage:
        '<NeonVeilShader speed={0.45} density={8.5} intensity={1.12} color1="#00F5D4" color2="#7C3AED" color3="#F15BB5" />',
    },
    {
      metadata: shaders[11],
      preview: () => <WarpGridShader gridScale={13} warp={1.2} glow={0.9} />,
      usage: '<WarpGridShader gridScale={13} warp={1.2} glow={0.9} color1="#67E8F9" color2="#FB7185" />',
    },
    {
      metadata: shaders[12],
      preview: () => <PlasmaBlobShader blobCount={8} blobSize={0.26} softness={1.2} />,
      usage:
        '<PlasmaBlobShader blobCount={8} blobSize={0.26} softness={1.2} color1="#2DD4BF" color2="#F97316" color3="#E879F9" />',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="text-base font-semibold tracking-tight text-white">
            shadercn
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/60">
            <Link
              href="#shaders"
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "hidden text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex"
              )}
            >
              Shaders
            </Link>
            <a
              href="https://github.com/sahilcodexx/webglshaders"
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_24%,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_74%_54%,rgba(168,85,247,0.22),transparent_32%),radial-gradient(circle_at_58%_78%,rgba(251,113,133,0.16),transparent_30%),linear-gradient(135deg,#050505,#101010_48%,#050505)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(0,0,0,0.04),rgba(0,0,0,0.66)_62%,#050505_100%)]" />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-14 pt-28 sm:px-6 lg:pb-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white/70 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                Production-ready WebGL shader components
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
                The shadcn/ui of shaders.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                Reusable, typed shader components with metadata, controls, examples, and
                installation paths built for modern React apps.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#shaders"
                  className={cn(
                    buttonVariants(),
                    "bg-white text-black hover:bg-white/85"
                  )}
                >
                  Browse shaders
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-white/15 bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  Inspiration source
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="shaders" className="relative border-t border-white/10 bg-[#050505] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-cyan-200">Shader library</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Original WebGL effects, componentized.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/55">
                Each shader exposes typed props and matching metadata so visual controls,
                docs, and CLI installs can share one source of truth.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {shaderCards.map((card) => (
                <ShaderPreviewCard
                  key={card.metadata.slug}
                  metadata={card.metadata}
                  preview={card.preview}
                  usage={card.usage}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/45">
        Built as an original shader component library inspired by shadcn/ui.
      </footer>
    </div>
  )
}
