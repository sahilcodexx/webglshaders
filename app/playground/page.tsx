"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useMemo, Suspense } from "react"
import { getShaderBySlug, getShaderList } from "@/lib/registry"
import { ShaderPreview } from "@/components/shaders/ShaderPreview"
import { UniformControls } from "@/components/shaders/UniformControls"
import { Editor } from "@/components/playground/Editor"
import { Toolbar } from "@/components/playground/Toolbar"
import { FpsCounter } from "@/components/playground/FpsCounter"
import { useUniforms } from "@/hooks/useUniforms"
import { useEditorStore } from "@/lib/editorStore"
import type { UniformDefinition } from "@/types/shader"
import Link from "next/link"

function PlaygroundContent() {
  const searchParams = useSearchParams()
  const initialShader = searchParams.get("shader") || "aurora"

  const [shaderModule, setShaderModule] = useState<{
    fragmentShader: string
    vertexShader: string
    defaultUniforms: Record<string, unknown>
  } | null>(null)

  const [activeSlug, setActiveSlug] = useState(initialShader)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { code, setCode, reset } = useEditorStore()

  const entry = getShaderBySlug(activeSlug)
  const metadata = entry?.metadata

  useEffect(() => {
    if (entry) {
      entry.import().then((mod) => {
        setShaderModule(mod)
        reset(mod.fragmentShader)
      })
    }
  }, [entry])

  const uniformDefs = useMemo(
    () => metadata?.uniforms ?? ([] as UniformDefinition[]),
    [metadata]
  )

  const { uniforms, setUniform, resetUniforms, threeUniforms } =
    useUniforms(uniformDefs)

  const shaders = getShaderList()

  const handleReset = useCallback(() => {
    resetUniforms()
    if (shaderModule) {
      reset(shaderModule.fragmentShader)
    }
  }, [shaderModule, resetUniforms])

  const handleShaderChange = (slug: string) => {
    setActiveSlug(slug)
  }

  const fragmentToRender = code || shaderModule?.fragmentShader || ""

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="flex h-12 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            shadercn
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-sm text-zinc-500">Playground</span>
        </div>
        <div className="flex items-center gap-2">
          <FpsCounter />
          <select
            value={activeSlug}
            onChange={(e) => handleShaderChange(e.target.value)}
            className="rounded-md border border-zinc-200 bg-transparent px-2 py-1 text-xs dark:border-zinc-700"
          >
            {shaders.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.metadata.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div
            className={`relative flex-1 ${
              isFullscreen ? "fixed inset-0 z-50" : ""
            }`}
          >
            <ShaderPreview
              fragmentShader={fragmentToRender}
              vertexShader={shaderModule?.vertexShader ?? ""}
              uniforms={threeUniforms}
              className="h-full w-full rounded-none"
            />
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800">
            <Toolbar
              onReset={handleReset}
              onFullscreen={() => setIsFullscreen(!isFullscreen)}
            />
          </div>
        </div>

        <div className="flex w-96 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex-1">
            <Editor
              defaultValue={shaderModule?.fragmentShader ?? ""}
              className="h-full rounded-none border-0"
            />
          </div>
          <div className="max-h-80 overflow-y-auto border-t border-zinc-200 p-4 dark:border-zinc-800">
            <UniformControls
              uniforms={uniformDefs}
              values={uniforms}
              onChange={setUniform}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-zinc-500">
          Loading playground...
        </div>
      }
    >
      <PlaygroundContent />
    </Suspense>
  )
}
