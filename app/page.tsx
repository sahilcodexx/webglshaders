"use client"

import Link from "next/link"
import LineWaves from "@/components/LineWaves"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            shadercn
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/" className="text-white font-medium">
              Home
            </Link>
            <a
              href="https://github.com/sahilcodexx/webglshaders"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <section className="relative h-screen w-full overflow-hidden">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={48}
          warpIntensity={1.2}
          rotation={-30}
          colorCycleSpeed={0.8}
          brightness={0.15}
          color1="#7C3AED"
          color2="#3B82F6"
          color3="#EC4899"
          enableMouseInteraction={true}
          mouseInfluence={3.0}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            shadercn
          </h1>
          <p className="mt-4 max-w-md text-center text-lg text-white/60">
            The shadcn/ui of shaders.
          </p>
        </div>
      </section>
    </div>
  )
}
