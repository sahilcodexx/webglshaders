"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Card } from "@/components/ui/card"
import { cn } from "@/utils/cn"
import Link from "next/link"

interface ShaderCardProps {
  name: string
  slug: string
  description: string
  difficulty: string
  tags: string[]
  fragmentShader: string
  vertexShader: string
  className?: string
}

function MiniPreview({
  fragmentShader,
  vertexShader,
}: {
  fragmentShader: string
  vertexShader: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef({ value: 0 })

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: { uTime: timeRef },
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [fragmentShader, vertexShader]
  )

  useFrame((_, delta) => {
    timeRef.current.value += delta
  })

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export function ShaderCard({
  name,
  slug,
  description,
  difficulty,
  tags,
  fragmentShader,
  vertexShader,
  className,
}: ShaderCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Link href={`/shaders/${slug}`}>
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
          className
        )}
      >
        <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
              <MiniPreview
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
              />
            </Canvas>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                difficulty === "beginner" &&
                  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                difficulty === "intermediate" &&
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                difficulty === "advanced" &&
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              {difficulty}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
