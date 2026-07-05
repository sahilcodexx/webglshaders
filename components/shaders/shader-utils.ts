export type UniformValue =
  | number
  | boolean
  | Float32Array
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]

export type ShaderUniforms = Record<string, { value: UniformValue }>

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ]
}

export function parseColor(hex: string): [number, number, number] {
  return hexToRgb(hex)
}
