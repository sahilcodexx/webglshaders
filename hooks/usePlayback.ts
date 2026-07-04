import { useState, useCallback, useRef } from "react"

export function usePlayback() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const timeRef = useRef(0)

  const toggle = useCallback(() => {
    setIsPlaying((p) => !p)
  }, [])

  const reset = useCallback(() => {
    timeRef.current = 0
  }, [])

  const getTime = useCallback(
    (delta: number) => {
      if (isPlaying) {
        timeRef.current += delta * speed
      }
      return timeRef.current
    },
    [isPlaying, speed]
  )

  return { isPlaying, speed, setSpeed, toggle, reset, getTime }
}
