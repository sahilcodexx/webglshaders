"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { getShaderBySlug } from "@/lib/registry"
import { ShaderPreview } from "@/components/shaders/ShaderPreview"
import { UniformControls } from "@/components/shaders/UniformControls"
import { useUniforms } from "@/hooks/useUniforms"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/utils/cn"
import { toast } from "sonner"
import Link from "next/link"
import type { UniformDefinition } from "@/types/shader"

export default function ShaderPage() {
  const params = useParams()
  const slug = params.slug as string
  const [shaderModule, setShaderModule] = useState<{
    fragmentShader: string
    vertexShader: string
    defaultUniforms: Record<string, unknown>
  } | null>(null)

  const entry = getShaderBySlug(slug)
  const metadata = entry?.metadata

  useEffect(() => {
    if (entry) {
      entry.import().then(setShaderModule)
    }
  }, [entry])

  const uniformDefs = useMemo(
    () => metadata?.uniforms ?? ([] as UniformDefinition[]),
    [metadata]
  )

  const { uniforms, setUniform, resetUniforms, threeUniforms } =
    useUniforms(uniformDefs)

  const copyCode = () => {
    if (shaderModule?.fragmentShader) {
      navigator.clipboard.writeText(shaderModule.fragmentShader)
      toast.success("Shader code copied to clipboard")
    }
  }

  if (!entry || !metadata) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Shader not found</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            shadercn
          </Link>
          <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-foreground transition-colors">
              Shaders
            </Link>
            <Link href="/playground" className="hover:text-foreground transition-colors">
              Playground
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            ← Back to shaders
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{metadata.name}</h1>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider",
                    metadata.difficulty === "beginner" &&
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    metadata.difficulty === "intermediate" &&
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    metadata.difficulty === "advanced" &&
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  {metadata.difficulty}
                </span>
              </div>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                {metadata.description}
              </p>
            </div>

            <ShaderPreview
              fragmentShader={shaderModule?.fragmentShader ?? ""}
              vertexShader={shaderModule?.vertexShader ?? ""}
              uniforms={threeUniforms}
              className="aspect-video w-full"
            />

            <div className="flex gap-2">
              <Button onClick={copyCode}>Copy Shader</Button>
              <Link href={`/playground?shader=${slug}`}>
                <Button variant="secondary">Open in Playground</Button>
              </Link>
              <Button variant="ghost" onClick={resetUniforms}>
                Reset
              </Button>
            </div>

            <Card className="p-4">
              <h3 className="mb-2 text-sm font-medium">Usage</h3>
              <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
                <code>{`import { ${metadata.name}Shader } from "shadercn"

<${metadata.name}Shader
  speed={1}
  intensity={0.7}
/>`}</code>
              </pre>
            </Card>

            <Card className="p-4">
              <h3 className="mb-2 text-sm font-medium">Performance Notes</h3>
              <ul className="space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                <li>• Uses fbm noise with {metadata.uniforms.filter(u => u.type === 'float' || u.type === 'int').length} configurable parameters</li>
                <li>• Single pass fragment shader — no post-processing required</li>
                <li>• Optimized for mobile GPUs</li>
                <li>• Minimal uniform updates per frame</li>
              </ul>
            </Card>

            <div className="flex flex-wrap gap-1.5">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="mb-1 text-xs text-zinc-400">Author</div>
              <div className="text-sm font-medium">{metadata.author}</div>
              <div className="mt-3 mb-1 text-xs text-zinc-400">Version</div>
              <div className="text-sm font-medium">{metadata.version}</div>
              <div className="mt-3 mb-1 text-xs text-zinc-400">License</div>
              <div className="text-sm font-medium">{metadata.license}</div>
            </Card>

            {shaderModule && (
              <Card className="p-5">
                <h3 className="mb-4 text-sm font-medium">Controls</h3>
                <UniformControls
                  uniforms={uniformDefs}
                  values={uniforms}
                  onChange={setUniform}
                />
              </Card>
            )}

            {metadata.relatedShaders.length > 0 && (
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-medium">Related Shaders</h3>
                <div className="space-y-2">
                  {metadata.relatedShaders.map((related) => {
                    const relatedEntry = getShaderBySlug(related)
                    if (!relatedEntry) return null
                    return (
                      <Link
                        key={related}
                        href={`/shaders/${related}`}
                        className="block rounded-lg bg-zinc-50 p-3 text-sm transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        <div className="font-medium">{relatedEntry.metadata.name}</div>
                        <div className="mt-0.5 text-xs text-zinc-400 line-clamp-1">
                          {relatedEntry.metadata.description}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
