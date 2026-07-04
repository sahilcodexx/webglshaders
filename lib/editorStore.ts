import { create } from "zustand"

interface EditorState {
  code: string
  history: string[]
  historyIndex: number
  setCode: (code: string) => void
  undo: () => void
  redo: () => void
  reset: (defaultCode: string) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  code: "",
  history: [""],
  historyIndex: 0,
  setCode: (code: string) => {
    const { history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(code)
    if (newHistory.length > 50) newHistory.shift()
    const newIndex = newHistory.length - 1
    set({ code, history: newHistory, historyIndex: newIndex })
  },
  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({ code: history[newIndex], historyIndex: newIndex })
    }
  },
  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({ code: history[newIndex], historyIndex: newIndex })
    }
  },
  reset: (defaultCode: string) => {
    set({ code: defaultCode, history: [defaultCode], historyIndex: 0 })
  },
}))
