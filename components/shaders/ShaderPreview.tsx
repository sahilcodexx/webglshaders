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
  uniforms,
}: Omit<ShaderPreviewProps, "className">) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef({ value: 0 })

  const material = useMemo(() => {
    const mergedUniforms = {
      uTime: timeRef.current,
      ...uniforms,
    }
    return new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: Object.fromEntries(
        Object.entries(mergedUniforms).map(([key, val]) => [key, { value: val.value }])
      ),
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [fragmentShader, vertexShader, uniforms])

  useFrame((_, delta) => {
    timeRef.current.value += delta
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = timeRef.current.value
    }
    for (const [key, uniform] of Object.entries(uniforms)) {
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
