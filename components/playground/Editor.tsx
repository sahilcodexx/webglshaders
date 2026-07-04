"use client"

import { useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { useEditorStore } from "@/lib/editorStore"
import { cn } from "@/utils/cn"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

interface EditorProps {
  className?: string
  defaultValue?: string
  readOnly?: boolean
}

export function Editor({ className, defaultValue = "", readOnly = false }: EditorProps) {
  const { code, setCode } = useEditorStore()

  useEffect(() => {
    if (defaultValue && !code) {
      setCode(defaultValue)
    }
  }, [defaultValue])

  const handleMount = useCallback((editor: any) => {
    setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run()
    }, 500)
  }, [])

  return (
    <div className={cn("overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800", className)}>
      <MonacoEditor
        height="100%"
        language="glsl"
        theme="vs-dark"
        value={code || defaultValue}
        onChange={(val) => setCode(val || "")}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          readOnly,
          tabSize: 2,
          padding: { top: 12 },
        }}
      />
    </div>
  )
}
