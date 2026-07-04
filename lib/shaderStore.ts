import { create } from "zustand"

interface ShaderState {
  selectedShader: string | null
  searchQuery: string
  categoryFilter: string | null
  setSelectedShader: (slug: string | null) => void
  setSearchQuery: (query: string) => void
  setCategoryFilter: (category: string | null) => void
}

export const useShaderStore = create<ShaderState>((set) => ({
  selectedShader: null,
  searchQuery: "",
  categoryFilter: null,
  setSelectedShader: (slug) => set({ selectedShader: slug }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
}))
