import { useState, useCallback, useMemo } from "react"
import type { UniformDefinition } from "@/types/shader"

export function useUniforms(uniformDefs: UniformDefinition[]) {
  const [uniforms, setUniforms] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    for (const def of uniformDefs) {
      initial[def.name] = def.default
    }
    return initial
  })

  const setUniform = useCallback((name: string, value: unknown) => {
    setUniforms((prev) => ({ ...prev, [name]: value }))
  }, [])

  const resetUniforms = useCallback(() => {
    setUniforms((prev) => {
      const reset: Record<string, unknown> = {}
      for (const def of uniformDefs) {
        reset[def.name] = def.default
      }
      return reset
    })
  }, [uniformDefs])

  const threeUniforms = useMemo(() => {
    const result: Record<string, { value: unknown }> = {}
    for (const [key, val] of Object.entries(uniforms)) {
      result[key] = { value: val }
    }
    return result
  }, [uniforms])

  return { uniforms, setUniform, resetUniforms, threeUniforms }
}
