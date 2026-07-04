"use client"

import { Button } from "@/components/ui/button"
import { useEditorStore } from "@/lib/editorStore"
import { usePlayback } from "@/hooks/usePlayback"

interface ToolbarProps {
  onReset?: () => void
  onFullscreen?: () => void
}

export function Toolbar({ onReset, onFullscreen }: ToolbarProps) {
  const { undo, redo } = useEditorStore()
  const { isPlaying, toggle, speed, setSpeed } = usePlayback()

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={undo}>
          Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={redo}>
          Redo
        </Button>
        <Button variant="ghost" size="sm" onClick={toggle}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="rounded-md border border-zinc-200 bg-transparent px-2 py-1 text-xs dark:border-zinc-700"
        >
          <option value={0.25}>0.25x</option>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
        </select>
        {onFullscreen && (
          <Button variant="ghost" size="sm" onClick={onFullscreen}>
            Fullscreen
          </Button>
        )}
        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
