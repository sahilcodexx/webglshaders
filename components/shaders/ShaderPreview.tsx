"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { cn } from "@/utils/cn"

interface ShaderPreviewProps {
  fragmentShader: string
  vertexShader: string
  uniforms: Record<string, { value: unknown }>
  className?: string
}

function ShaderPlane({
  fragmentShader,
  vertexShader,
  uniforms: externalUniforms,
}: Omit<ShaderPreviewProps, "className">) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeUniform = useMemo(() => ({ value: 0 }), [])

  const material = useMemo(() => {
    const mergedUniforms: Record<string, THREE.IUniform> = {
      uTime: timeUniform,
    }
    for (const [key, val] of Object.entries(externalUniforms)) {
      mergedUniforms[key] = { value: val.value }
    }
    return new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: mergedUniforms,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [fragmentShader, vertexShader, externalUniforms, timeUniform])

  useFrame((_, delta) => {
    timeUniform.value += delta
    for (const [key, uniform] of Object.entries(externalUniforms)) {
      if (material.uniforms[key]) {
        material.uniforms[key].value = uniform.value
      }
    }
  })

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export function ShaderPreview({
  fragmentShader,
  vertexShader,
  uniforms,
  className,
}: ShaderPreviewProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <ShaderPlane
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </Canvas>
    </div>
  )
}
