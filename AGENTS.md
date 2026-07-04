# AGENTS.md

# Project Name

shadercn

> The shadcn/ui of shaders.

---

# Vision

shadercn is an open-source platform that allows developers to:

- Browse beautiful production-ready shaders
- Customize shaders visually
- Copy shader components into their own projects
- Install shaders via CLI
- Learn GLSL through interactive examples
- Build reusable shader libraries instead of one-off demos

The experience should feel similar to shadcn/ui:

Instead of UI Components:

Button
Card
Dialog

We have:

Aurora
Galaxy
Noise
Gradient
Glass
Glow
Water
Fire
Smoke
Blob
Metaballs

Every shader should be reusable, documented, customizable, and production-ready.

---

# Core Philosophy

Everything should prioritize:

1. Developer Experience
2. Performance
3. Beautiful Design
4. Reusability
5. Simplicity
6. Accessibility where applicable
7. Clean Architecture

Avoid unnecessary abstractions.

Prefer readable code over clever code.

---

# Tech Stack

Framework:
- Next.js (App Router)
- React
- TypeScript

Styling:
- Tailwind CSS
- shadcn/ui

Rendering:
- React Three Fiber
- Three.js

Shaders:
- GLSL
- ShaderMaterial

Editor:
- Monaco Editor

Animation:
- Framer Motion

State:
- Zustand

Validation:
- Zod

Icons:
- Lucide

Package Manager:
- pnpm

Deployment:
- Vercel

---

# Folder Structure

app/

components/
    ui/
    shaders/
    playground/
    editor/
    docs/

lib/
hooks/
utils/

shader-lib/
    aurora/
    galaxy/
    noise/
    water/
    fire/

public/

docs/

---

# Design Language

Inspired by:

shadcn/ui

Linear

Vercel

Raycast

Apple

The interface should feel:

minimal

premium

fast

modern

dark-first

No unnecessary colors.

Use spacing over borders.

Use subtle animations.

Avoid visual clutter.

---

# UI Principles

Prefer:

rounded-xl

backdrop blur

soft shadows

gradient accents

glassmorphism only where appropriate

Use motion carefully.

Animations should communicate, not distract.

---

# Components

Every component must:

be reusable

be typed

accept variants

accept className

support dark mode

avoid unnecessary props

---

# Shader Components

Every shader should expose props.

Example:

<Aurora
    speed={1}
    intensity={0.7}
    color="#7C3AED"
/>

Internally these map to uniforms.

Never hardcode configurable values.

---

# Shader Metadata

Every shader should include metadata.

Example:

name

description

preview image

tags

difficulty

author

license

version

uniforms

examples

---

# Shader Page

Every shader page should contain:

Live Preview

Editable Source Code

Uniform Controls

Documentation

Installation

Usage

Copy Button

Examples

Performance Notes

Related Shaders

---

# Playground

The playground is one of the most important parts.

Features:

Live GLSL editing

Monaco editor

Real-time compilation

Error overlay

FPS counter

Fullscreen mode

Screenshot export

Reset button

Undo

Redo

Share link

Fork

---

# Uniform Controls

Automatically generate controls based on metadata.

Supported types:

float

int

bool

vec2

vec3

vec4

color

texture

toggle

slider

dropdown

---

# Performance Rules

Avoid unnecessary rerenders.

Memoize expensive calculations.

Dispose Three.js resources correctly.

Never recreate materials every frame.

Reuse geometries.

Avoid unnecessary useFrame callbacks.

Optimize shaders before adding features.

---

# Code Style

Always use:

TypeScript

Strict typing

Named exports

Small components

Readable variable names

Early returns

Composition over inheritance

No magic numbers.

Document complex math.

---

# Shader Standards

Vertex shader

Fragment shader

Uniforms

Helper functions

Comments for complex algorithms

Keep shaders modular.

Avoid duplicated GLSL.

Extract reusable GLSL utilities.

---

# Documentation

Every shader requires:

Overview

Parameters

Preview

Usage

Code Example

Performance Tips

Customization Guide

Browser Support

---

# Naming Conventions

Components:

AuroraShader

WaterShader

GlowShader

Hooks:

useShader

useUniforms

usePlayback

Utilities:

createMaterial

compileShader

parseUniforms

---

# Accessibility

Keyboard navigation

Focus states

Readable contrast

Reduced motion support

Responsive layouts

---

# Animations

Prefer Framer Motion.

Use easing.

Avoid spring animations everywhere.

Transitions should feel natural.

---

# Error Handling

Never fail silently.

Shader compile errors should:

Highlight the line

Display GLSL error

Suggest fixes

Allow quick reset

---

# Future Features

CLI

npx shadercn add aurora

Shader marketplace

Community uploads

Collections

Shader presets

Favorites

Search

Tags

AI-generated shader starter

Shader diff viewer

Version history

Export to:

React Three Fiber

Three.js

WebGL

Unity

Godot

Babylon.js

WebGPU

---

# AI Coding Rules

When generating code:

Think like a senior engineer.

Prefer maintainability over cleverness.

Never generate placeholder implementations when a real implementation is feasible.

Avoid overengineering.

Follow existing architecture.

Reuse components.

Never duplicate code.

Prefer composition.

Write self-documenting code.

Add comments only where necessary.

Keep files focused.

---

# Visual Quality

Every UI should feel:

professional

modern

clean

premium

balanced

consistent

Use whitespace intentionally.

Avoid cramped layouts.

---

# Git

Small commits.

Meaningful commit messages.

Conventional commits.

Examples:

feat:

fix:

refactor:

docs:

perf:

style:

test:

---

# Goal

Build the best open-source shader component library on the web.

The project should become for shaders what shadcn/ui became for React UI components.

Every decision should improve developer experience, performance, and visual quality.
