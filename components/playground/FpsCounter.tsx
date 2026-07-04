"use client"

import { useEffect, useState, useRef } from "react"

export function FpsCounter() {
  const [fps, setFps] = useState(0)
  const frameRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  useEffect(() => {
    let raf: number
    const tick = () => {
      frameRef.current++
      const now = performance.now()
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameRef.current)
        frameRef.current = 0
        lastTimeRef.current = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2 py-1 text-xs text-green-400 font-mono">
      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
      {fps} FPS
    </div>
  )
}
