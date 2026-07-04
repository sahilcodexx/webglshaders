# ARCHITECTURE.md

# shadercn Architecture

Version: 1.0

---

# Purpose

This document defines the technical architecture of shadercn.

Every AI agent contributing to this repository MUST follow these architectural decisions.

Goals:

- Maintainable
- Scalable
- Modular
- Production Ready
- Easy to Contribute
- High Performance
- Strong Developer Experience

---

# Core Philosophy

Everything should be reusable.

Everything should be composable.

Nothing should be tightly coupled.

Features should be isolated.

Never duplicate logic.

Prefer configuration over hardcoded values.

---

# High Level Architecture

shadercn is composed of five systems.

1. Website
2. Playground
3. Shader Library
4. Documentation
5. CLI

Each system must remain independent.

---

# Application Structure

app/
components/
features/
hooks/
lib/
shader-lib/
playground/
editor/
styles/
types/
utils/
public/
content/

Every folder should have a single responsibility.

---

# Feature Architecture

Each feature owns everything it needs.

Example

features/

gallery/
components/
hooks/
utils/
types/

playground/
components/
hooks/
compiler/
state/

editor/
components/
themes/

Never place feature-specific code into shared folders.

---

# Shared Components

Only place components inside components/ui if they are reusable across multiple pages.

Examples

Button

Card

Input

Dialog

Tabs

Resizable

Popover

Tooltip

If only one feature uses a component, keep it inside that feature.

---

# Shader Library Structure

shader-lib/

aurora/

fragment.glsl

vertex.glsl

metadata.ts

preview.png

index.ts

water/

glass/

noise/

gradient/

Every shader lives in its own folder.

---

# Shader Interface

Every shader exports

Shader Material

Metadata

Default uniforms

Preview

Examples

Never expose raw files directly.

Always use an index.ts.

Example

export {
    shader,
    metadata,
    uniforms
}

---

# Metadata Structure

Every shader MUST define

name

slug

description

author

version

tags

difficulty

category

previewImage

uniforms

license

createdAt

updatedAt

relatedShaders

---

# Uniform Schema

Uniforms are the public API.

Example

speed

intensity

scale

color

resolution

mouse

time

Each uniform contains

name

type

default

min

max

step

description

group

The UI should be generated automatically from metadata.

Never manually build controls.

---

# Rendering Pipeline

React Component

↓

Uniform State

↓

Shader Material

↓

Three.js

↓

WebGL

Never update uniforms directly inside React rendering.

Use refs when possible.

---

# State Management

Use Zustand.

Separate state into stores.

editorStore

shaderStore

playgroundStore

settingsStore

Never create one massive global store.

---

# Component Principles

Components should

do one thing

remain small

remain testable

be reusable

accept props

avoid side effects

Never exceed roughly 250 lines unless justified.

Split large components.

---

# Data Flow

Metadata

↓

Registry

↓

Gallery

↓

Shader Page

↓

Preview

↓

Playground

The registry is the source of truth.

---

# Registry

Maintain a central registry.

Example

shaderRegistry

Aurora

Water

Glass

Noise

Blob

Galaxy

The application should never manually import dozens of shaders.

Always query the registry.

---

# Dynamic Loading

Use lazy loading.

Gallery thumbnails

↓

Import shader only when opened.

Never load every GLSL file on startup.

---

# Playground Architecture

Playground consists of

Editor

Renderer

Compiler

Controls

Error Panel

Toolbar

Console

These modules should remain independent.

---

# Compiler Flow

User edits GLSL

↓

Debounce

↓

Compile

↓

Validate

↓

Apply Material

↓

Render

↓

Display Errors

Compilation should never block the UI.

---

# Error Handling

Shader compilation errors should include

line number

column

compiler message

highlighted code

possible explanation

Never display raw WebGL errors alone.

Translate them into readable messages when possible.

---

# Monaco Integration

Monaco should provide

Syntax Highlighting

Auto Complete

Formatting

Themes

Diagnostics

Readonly Mode

Diff View

Future support

GLSL IntelliSense

---

# Documentation System

Each shader automatically generates documentation from metadata.

Avoid duplicated documentation.

Metadata is the source of truth.

---

# Routing

/

Gallery

/playground

/docs

/shaders/[slug]

/collections

/settings

Future

/community

/pro

---

# Styling

Tailwind CSS

Use design tokens.

Avoid arbitrary values unless necessary.

Spacing should follow a consistent scale.

Use CSS variables for

colors

radius

spacing

font sizes

---

# Theme System

Support

Dark

Light

System

Every component must work in every theme.

---

# Animation System

Framer Motion only.

Keep animations subtle.

Recommended durations

150ms

200ms

300ms

Avoid unnecessary bouncing.

---

# Performance

Always optimize for

Fast First Paint

Fast Interaction

Low GPU usage

Low CPU usage

Small bundles

Techniques

Memoization

Dynamic imports

Lazy loading

Resource disposal

Texture reuse

Geometry reuse

Avoid unnecessary renders

---

# Three.js Guidelines

Dispose

Geometry

Materials

Textures

Render Targets

Use useMemo where appropriate.

Never recreate ShaderMaterial every frame.

---

# GLSL Standards

Organize shaders into sections

Uniforms

Constants

Helpers

Noise

Lighting

Main

Keep helper functions reusable.

---

# Utility Library

Create reusable GLSL helpers.

Examples

noise

fbm

rotation

random

sdf

lighting

blend modes

color conversions

Never duplicate GLSL utilities.

---

# Testing

Future

Vitest

Playwright

React Testing Library

Test

Utilities

Metadata

Registry

Hooks

Components

Never test implementation details.

Test behavior.

---

# Accessibility

Keyboard support

Screen reader labels

Focus visibility

Reduced motion

Responsive layouts

---

# Security

Never execute arbitrary code outside the shader sandbox.

Validate imported shaders.

Sanitize user-generated content.

Do not expose secrets to the client.

---

# CLI Architecture

shadercn add aurora

↓

Download Metadata

↓

Download Shader

↓

Copy Files

↓

Install Dependencies

↓

Print Usage

CLI should consume the same registry as the website.

---

# Search

Search indexes

Title

Tags

Description

Author

Category

Difficulty

Use fuzzy search.

---

# Future Architecture

Plugin System

Custom Shader Packs

Marketplace

Authentication

Collections

Cloud Storage

Version History

Real-time Collaboration

Shader AI Assistant

---

# AI Agent Rules

Before generating code

Understand existing architecture.

Search for reusable code first.

Do not duplicate functionality.

Prefer extension over replacement.

Maintain backwards compatibility.

Do not introduce new patterns unless necessary.

Keep APIs stable.

Always generate strongly typed code.

Always write readable code.

When uncertain

Follow existing conventions instead of inventing new ones.

---

# Definition of Done

A feature is complete only if

✓ Fully typed

✓ Responsive

✓ Accessible

✓ Tested where applicable

✓ Documented

✓ Uses existing architecture

✓ No duplicated logic

✓ Optimized

✓ Clean code

✓ Works in dark mode

✓ Works in light mode

✓ Production ready

---

# Final Principle

The architecture should scale to hundreds of shaders without requiring major refactoring.

Every new shader should be added by creating a single folder with its GLSL files, metadata, and preview, then registering it once. The gallery, documentation, playground, CLI, search, and exports should all derive their behavior from that shared metadata.
