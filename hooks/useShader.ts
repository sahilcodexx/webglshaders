import { useRef, useMemo, useEffect, useCallback } from "react"
import * as THREE from "three"

export function useShader(
  fragmentShader: string,
  vertexShader: string,
  uniforms: Record<string, { value: unknown }>
) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: Object.fromEntries(
        Object.entries(uniforms).map(([key, val]) => [key, { value: val.value }])
      ),
      transparent: true,
      side: THREE.DoubleSide,
    })
    materialRef.current = mat
    return mat
  }, [fragmentShader, vertexShader])

  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose()
        materialRef.current = null
      }
    }
  }, [])

  const updateUniform = useCallback(
    (name: string, value: unknown) => {
      if (material.uniforms[name]) {
        material.uniforms[name].value = value
      }
    },
    [material]
  )

  return { material, updateUniform }
}
