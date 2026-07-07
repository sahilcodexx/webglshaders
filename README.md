# shadercn

A library of production-ready, customizable GLSL shaders for React applications. Browse, configure, and integrate shaders with the same developer experience as shadcn/ui.

## Overview

shadercn provides a collection of handcrafted WebGL shaders built with React Three Fiber. Each shader is fully typed, documented, and exposes configurable uniforms for real-time customization. Use them directly, copy the source into your own projects, or install via the CLI.

### Available Shaders

- **Aurora** — flowing northern lights with layered color bands and organic motion
- **Water** — realistic water surface with wave simulation, reflections, and foam
- **Noise** — animated fractal noise with domain warping and multi-octave detail
- **Galaxy** — spiral galaxy with procedurally generated stars and dust lanes
- **Gradient** — animated multi-stop color gradient with easing controls
- **Glass** — frosted glass surface with refraction, thickness, and environment mapping
- **Glow** — volumetric glow with falloff, color, and intensity controls
- **Blob** — organic metaball-like blob with morphing and blend controls
- **Smoke** — volumetric smoke simulation with density and turbulence
- **Fire** — layered fire effect with heat distortion and particle embers

## Tech Stack

- **Framework** — Next.js 16 (App Router), React 19, TypeScript
- **Rendering** — React Three Fiber, Three.js, OGL
- **Styling** — Tailwind CSS, shadcn/ui
- **Animation** — Framer Motion
- **State** — Zustand
- **Shader Editor** — Monaco Editor
- **Icons** — Lucide

## Getting Started

```bash
pnpm dev
```

Opens the development server at `http://localhost:3000`.

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Usage

Import any shader as a React component and configure it via props:

```tsx
import { Aurora } from "@/shader-lib/aurora"

export function Scene() {
  return (
    <Aurora
      speed={1.0}
      intensity={0.7}
      color="#7C3AED"
      scale={2.0}
    />
  )
}
```

Each prop maps to a GLSL uniform. The component handles material creation, disposal, and performance optimization internally.

## Architecture

The project follows a modular architecture built around a central shader registry:

- **Shader Library** — Each shader lives in its own directory with GLSL source, metadata, preview, and a typed React component
- **Registry** — A central registry is the single source of truth; shaders are lazy-loaded when requested
- **Metadata** — Each shader defines uniforms, tags, difficulty, and usage examples; the UI generates controls automatically
- **Playground** — Live GLSL editing with Monaco, real-time compilation, error overlays, and uniform controls
- **Gallery** — Browse, search, and filter shaders by category, difficulty, or tags

Every shader folder follows the same structure:

```
shader-lib/aurora/
  fragment.glsl
  vertex.glsl
  metadata.ts
  index.ts
```

## CLI

```bash
npx shadercn add aurora
```

Downloads the shader, copies files into your project, installs dependencies, and prints usage instructions. The CLI shares the same registry as the website.

## Design Principles

- **Performance first** — geometries and materials are reused; unnecessary renders are avoided; Three.js resources are disposed correctly
- **Type safety** — all components, hooks, and utilities are strictly typed
- **Composable** — shaders accept props, support className merging, and integrate with any R3F scene
- **Minimal** — no unnecessary abstractions; readable over clever
- **Dark-first** — the interface defaults to dark mode with full light mode support

## License

MIT
