"use client"

import { Mesh, Program, Renderer, Triangle } from "ogl"
import { useEffect, useRef } from "react"

import { cn } from "@/utils/cn"

type UniformValue =
  | number
  | boolean
  | Float32Array
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]

type ShaderUniforms = Record<string, { value: UniformValue }>

export interface ShaderCanvasProps {
  fragmentShader: string
  uniforms?: ShaderUniforms
  className?: string
  interactive?: boolean
  pixelRatio?: number
  maxFps?: number
  pauseWhenOffscreen?: boolean
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

export function ShaderCanvas({
  fragmentShader,
  uniforms = {},
  className,
  interactive = true,
  pixelRatio = 0.9,
  maxFps = 24,
  pauseWhenOffscreen = true,
}: ShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const containerElement = container

    let renderer: Renderer | null = null
    let gl: Renderer["gl"] | null = null
    let program: Program | null = null
    let mesh: Mesh | null = null
    let resizeObserver: ResizeObserver | null = null
    let animationFrameId = 0
    let lastRenderTime = 0
    let isStarted = false
    let isVisible = !pauseWhenOffscreen
    let targetMouse = [0.5, 0.5]
    const currentMouse = [0.5, 0.5]
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const frameInterval = prefersReducedMotion
      ? Number.POSITIVE_INFINITY
      : 1000 / Math.max(maxFps, 1)

    function resize() {
      if (!renderer || !program || !gl) return

      const width = containerElement.offsetWidth
      const height = containerElement.offsetHeight
      renderer.setSize(width, height)

      const resolution = program.uniforms.uResolution.value as Float32Array
      resolution[0] = gl.canvas.width
      resolution[1] = gl.canvas.height
      resolution[2] = width / Math.max(height, 1)
    }

    function handlePointerMove(event: PointerEvent) {
      if (!gl) return

      const rect = gl.canvas.getBoundingClientRect()
      targetMouse = [
        (event.clientX - rect.left) / Math.max(rect.width, 1),
        1 - (event.clientY - rect.top) / Math.max(rect.height, 1),
      ]
    }

    function handlePointerLeave() {
      targetMouse = [0.5, 0.5]
    }

    function update(time: number) {
      animationFrameId = requestAnimationFrame(update)

      if (!renderer || !program || !mesh || !isVisible) return
      if (time - lastRenderTime < frameInterval) return
      lastRenderTime = time

      program.uniforms.uTime.value = time * 0.001

      if (interactive) {
        currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.08
        currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.08
      }

      const mouse = program.uniforms.uMouse.value as Float32Array
      mouse[0] = currentMouse[0]
      mouse[1] = currentMouse[1]

      renderer.render({ scene: mesh })
    }

    function start() {
      if (isStarted) return
      isStarted = true

      renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, pixelRatio, 1),
        premultipliedAlpha: false,
      })
      gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      gl.canvas.style.display = "block"
      gl.canvas.style.height = "100%"
      gl.canvas.style.width = "100%"

      const mergedUniforms: ShaderUniforms = {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([1, 1, 1]) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        ...uniforms,
      }

      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: mergedUniforms,
      })
      mesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program,
      })

      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(containerElement)
      resize()

      if (interactive) {
        gl.canvas.addEventListener("pointermove", handlePointerMove)
        gl.canvas.addEventListener("pointerleave", handlePointerLeave)
      }

      containerElement.appendChild(gl.canvas)
      renderer.render({ scene: mesh })
      animationFrameId = requestAnimationFrame(update)
    }

    const intersectionObserver =
      pauseWhenOffscreen && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? false
              if (isVisible) {
                start()
              }
            },
            { rootMargin: "160px" }
          )
        : null

    if (intersectionObserver) {
      intersectionObserver.observe(containerElement)
    } else {
      isVisible = true
      start()
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      intersectionObserver?.disconnect()
      resizeObserver?.disconnect()
      gl?.canvas.removeEventListener("pointermove", handlePointerMove)
      gl?.canvas.removeEventListener("pointerleave", handlePointerLeave)
      gl?.getExtension("WEBGL_lose_context")?.loseContext()
      gl?.canvas.remove()
    }
  }, [fragmentShader, interactive, maxFps, pauseWhenOffscreen, pixelRatio, uniforms])

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    />
  )
}
