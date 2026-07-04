"use client"

import { useCallback } from "react"
import type { UniformDefinition } from "@/types/shader"

interface UniformControlsProps {
  uniforms: UniformDefinition[]
  values: Record<string, unknown>
  onChange: (name: string, value: unknown) => void
}

function toHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function fromHex(hex: string): number[] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

export function UniformControls({
  uniforms,
  values,
  onChange,
}: UniformControlsProps) {
  const handleChange = useCallback(
    (name: string, value: unknown) => {
      onChange(name, value)
    },
    [onChange]
  )

  const groups = new Map<string, UniformDefinition[]>()
  for (const u of uniforms) {
    const group = u.group || "General"
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(u)
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([group, defs]) => (
        <div key={group}>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {group}
          </h4>
          <div className="space-y-4">
            {defs.map((def) => (
              <div key={def.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-zinc-700 dark:text-zinc-300">
                    {def.description || def.name.replace("u", "")}
                  </label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {formatValue(values[def.name], def.type)}
                  </span>
                </div>
                {renderControl(def, values[def.name], (val) =>
                  handleChange(def.name, val)
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatValue(value: unknown, type: string): string {
  if (type === "color" && Array.isArray(value)) {
    return toHex(value[0] as number, value[1] as number, value[2] as number)
  }
  if (typeof value === "number") return value.toFixed(2)
  return String(value)
}

function renderControl(
  def: UniformDefinition,
  value: unknown,
  onChange: (val: unknown) => void
) {
  switch (def.type) {
    case "float":
    case "int": {
      const isInt = def.type === "int"
      return (
        <input
          type="range"
          min={def.min ?? 0}
          max={def.max ?? 1}
          step={def.step ?? (isInt ? 1 : 0.01)}
          value={(value as number) ?? def.default}
          onChange={(e) =>
            onChange(isInt ? parseInt(e.target.value) : parseFloat(e.target.value))
          }
          className="w-full accent-zinc-900 dark:accent-zinc-100"
        />
      )
    }
    case "bool":
      return (
        <button
          onClick={() => onChange(!(value as boolean))}
          className={`h-6 w-11 rounded-full transition-colors ${
            value ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              value ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      )
    case "color": {
      const arr = value as number[]
      return (
        <input
          type="color"
          value={toHex(arr[0], arr[1], arr[2])}
          onChange={(e) => onChange(fromHex(e.target.value))}
          className="h-8 w-full cursor-pointer rounded-lg border border-zinc-200 bg-transparent dark:border-zinc-700"
        />
      )
    }
    case "select": {
      return (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {def.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }
    default:
      return null
  }
}
