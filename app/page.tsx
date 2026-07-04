"use client"

import { useMemo, useEffect, useState } from "react"
import { getShaderList, searchShaders } from "@/lib/registry"
import { ShaderCard } from "@/components/shaders/ShaderCard"
import { useShaderStore } from "@/lib/shaderStore"
import { cn } from "@/utils/cn"
import Link from "next/link"

const categories = [
  { value: "atmosphere", label: "Atmosphere" },
  { value: "water", label: "Water" },
  { value: "noise", label: "Noise" },
  { value: "gradient", label: "Gradient" },
]

export default function GalleryPage() {
  const { searchQuery, categoryFilter, setSearchQuery, setCategoryFilter } =
    useShaderStore()
  const [shaderData, setShaderData] = useState<
    { slug: string; f: string; v: string }[]
  >([])

  const shaders = getShaderList()

  useEffect(() => {
    Promise.all(
      shaders.map(async (s) => {
        const mod = await s.import()
        return { slug: s.slug, f: mod.fragmentShader, v: mod.vertexShader }
      })
    ).then(setShaderData)
  }, [])

  const filtered = useMemo(() => {
    let result = shaders
    if (searchQuery) result = searchShaders(searchQuery)
    if (categoryFilter)
      result = result.filter((s) => s.metadata.category === categoryFilter)
    return result
  }, [shaders, searchQuery, categoryFilter])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            shadercn
          </Link>
          <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="text-foreground font-medium">
              Shaders
            </Link>
            <Link href="/playground" className="hover:text-foreground transition-colors">
              Playground
            </Link>
            <a href="https://github.com/sahilcodexx/webglshaders" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Shaders</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Browse, customize, and copy production-ready GLSL shaders.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search shaders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter(null)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                !categoryFilter
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  categoryFilter === cat.value
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((shader, i) => {
            const data = shaderData.find((d) => d.slug === shader.slug)
            return (
              <ShaderCard
                key={shader.slug}
                name={shader.metadata.name}
                slug={shader.slug}
                description={shader.metadata.description}
                difficulty={shader.metadata.difficulty}
                tags={shader.metadata.tags}
                fragmentShader={data?.f ?? ""}
                vertexShader={data?.v ?? ""}
              />
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-20 text-center text-zinc-400">
            <p className="text-lg">No shaders found</p>
            <p className="mt-1 text-sm">Try a different search or filter</p>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-zinc-400">
          shadercn — MIT License
        </div>
      </footer>
    </div>
  )
}
