import { create } from "zustand"

interface PlaygroundState {
  activeShader: string | null
  fps: number
  isFullscreen: boolean
  error: string | null
  setActiveShader: (slug: string | null) => void
  setFps: (fps: number) => void
  setFullscreen: (fs: boolean) => void
  setError: (err: string | null) => void
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  activeShader: null,
  fps: 0,
  isFullscreen: false,
  error: null,
  setActiveShader: (slug) => set({ activeShader: slug, error: null }),
  setFps: (fps) => set({ fps }),
  setFullscreen: (fs) => set({ isFullscreen: fs }),
  setError: (err) => set({ error: err }),
}))
