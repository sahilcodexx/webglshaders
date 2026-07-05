"use client"

import { ArrowUpRight, Code2, Copy, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import {
  CosmicShader,
  GlassShader,
  GradientShader,
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
        <GradientShader
          color1="#5227ff"
          color2="#dbba95"
          color3="#d0bce1"
          speed={0.4}
          noiseDensity={5.5}
          noiseStrength={4.0}
        />
      ),
      usage:
        '<GradientShader color1="#5227ff" color2="#dbba95" color3="#d0bce1" speed={0.4} />',
    },
    {
      metadata: shaders[1],
      preview: () => (
        <CosmicShader
          color1="#5227ff"
          color2="#dbba95"
          color3="#d0bce1"
          speed={0.4}
          holographicIntensity={1.0}
        />
      ),
      usage:
        '<CosmicShader color1="#5227ff" color2="#dbba95" color3="#d0bce1" holographicIntensity={1.0} />',
    },
    {
      metadata: shaders[2],
      preview: () => (
        <GlassShader
          color1="#67E8F9"
          color2="#F0ABFC"
          color3="#FCD34D"
          transparency={0.3}
          refraction={1.5}
        />
      ),
      usage:
        '<GlassShader color1="#67E8F9" color2="#F0ABFC" color3="#FCD34D" transparency={0.3} />',
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
                  href="https://github.com/ruucm/shadergradient"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-white/15 bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  Inspired by shadergradient
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
