<div align="center">

# DataV Kit

Framework-agnostic visual decoration components for data dashboards, powered by Web Components.

[![License](https://img.shields.io/github/license/hackycy/datav-kit?style=flat-square)](./LICENSE)
[![Elements Version](https://img.shields.io/npm/v/%40datav-kit%2Felements?style=flat-square&label=elements)](https://www.npmjs.com/package/@datav-kit/elements)
[![Elements Downloads](https://img.shields.io/npm/dm/%40datav-kit%2Felements?style=flat-square&label=downloads)](https://www.npmjs.com/package/@datav-kit/elements)
[![Core Version](https://img.shields.io/npm/v/%40datav-kit%2Fcore?style=flat-square&label=core)](https://www.npmjs.com/package/@datav-kit/core)

Build expressive large-screen dashboard surfaces with SSR-safe Custom Elements, decorative borders, HUD-style decorations, animated numbers, and theme presets.

[Quick Start](#quick-start) | [Packages](#packages) | [Documentation](#documentation) | [Development](#development)

</div>

## Highlights

- **Framework agnostic**: native Custom Elements that can be used from vanilla HTML, Vue, React, Vite, webpack, and SSR environments.
- **Dashboard focused**: border boxes, decorations, fit-screen containers, count-up numbers, and visual primitives designed for data screens.
- **Theme ready**: optional CSS variable presets for cyber blue, neon magenta, matrix green, solar gold, and ice white.
- **Composable foundation**: shared utilities, Web Components primitives, public elements, and themes are separated into focused packages.

> DataV Kit is currently in its foundation phase. Vue and React adapters are planned, but intentionally not part of the current foundation work.

## Quick Start

```bash
pnpm add @datav-kit/elements @datav-kit/themes
```

```ts
import { registerElements } from '@datav-kit/elements'
import '@datav-kit/themes/cyber-blue.css'

registerElements()
```

```html
<dvk-border-box-11 colors="#3d7fb8,#6ed7e8,#52f0b5">
  <section>Command Center</section>
</dvk-border-box-11>
```

## Packages

| Package | Directory | Version | Downloads | Role |
| --- | --- | --- | --- | --- |
| [`@datav-kit/elements`](https://www.npmjs.com/package/@datav-kit/elements) | [`packages/elements`](./packages/elements) | [![npm](https://img.shields.io/npm/v/%40datav-kit%2Felements?style=flat-square)](https://www.npmjs.com/package/@datav-kit/elements) | [![npm downloads](https://img.shields.io/npm/dm/%40datav-kit%2Felements?style=flat-square)](https://www.npmjs.com/package/@datav-kit/elements) | Public Web Components entrypoints and component registrations. |
| [`@datav-kit/core`](https://www.npmjs.com/package/@datav-kit/core) | [`packages/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/%40datav-kit%2Fcore?style=flat-square)](https://www.npmjs.com/package/@datav-kit/core) | [![npm downloads](https://img.shields.io/npm/dm/%40datav-kit%2Fcore?style=flat-square)](https://www.npmjs.com/package/@datav-kit/core) | Web Components primitives, lifecycle helpers, events, and controllers. |
| [`@datav-kit/shared`](https://www.npmjs.com/package/@datav-kit/shared) | [`packages/shared`](./packages/shared) | [![npm](https://img.shields.io/npm/v/%40datav-kit%2Fshared?style=flat-square)](https://www.npmjs.com/package/@datav-kit/shared) | [![npm downloads](https://img.shields.io/npm/dm/%40datav-kit%2Fshared?style=flat-square)](https://www.npmjs.com/package/@datav-kit/shared) | Framework-agnostic utilities shared by DataV Kit packages. |
| [`@datav-kit/themes`](https://www.npmjs.com/package/@datav-kit/themes) | [`packages/themes`](./packages/themes) | [![npm](https://img.shields.io/npm/v/%40datav-kit%2Fthemes?style=flat-square)](https://www.npmjs.com/package/@datav-kit/themes) | [![npm downloads](https://img.shields.io/npm/dm/%40datav-kit%2Fthemes?style=flat-square)](https://www.npmjs.com/package/@datav-kit/themes) | Optional CSS variable themes and theme exports. |

## Documentation

| Section | Path | Contents |
| --- | --- | --- |
| Home | [`docs/index.md`](./docs/index.md) | Documentation landing page with live component previews and large-screen demos. |
| Guide | [`docs/guide`](./docs/guide) | Introduction, installation, theming, component authoring, and framework integration. |
| Components / Borders | [`docs/components/borders`](./docs/components/borders) | Border box component APIs, examples, CSS parts, and usage notes. |
| Components / Decorations | [`docs/components/decorations`](./docs/components/decorations) | Decoration component APIs, examples, CSS parts, and usage notes. |
| Components / Other | [`docs/components/other`](./docs/components/other) | Fit-screen and count-to component docs. |
| Reference | [`docs/reference`](./docs/reference) | Architecture contracts and long-lived implementation constraints. |
| Architecture | [`docs/architecture.md`](./docs/architecture.md) | Repository documentation architecture and content organization. |

Run the VitePress documentation site locally:

```bash
pnpm docs:dev
```

## Repository Map

```text
datav-kit
+-- packages
|   +-- elements   # public Custom Elements and component modules
|   +-- core       # Web Components primitives and helpers
|   +-- shared     # shared framework-agnostic utilities
|   +-- themes     # optional CSS variable theme presets
+-- docs           # VitePress documentation site
+-- skills         # repository-specific Codex/agent workflows
+-- turbo.json     # monorepo task pipeline
```

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
pnpm lint
```

Common scripts:

| Command | Description |
| --- | --- |
| `pnpm dev` | Run package development tasks through Turbo. |
| `pnpm build` | Build all packages through Turbo. |
| `pnpm test` | Run package tests through Turbo. |
| `pnpm typecheck` | Run TypeScript checks. |
| `pnpm lint` | Lint the repository. |
| `pnpm docs:dev` | Start the local VitePress docs site. |
| `pnpm docs:build` | Build the documentation site. |

## Inspire

- [datav-vue3](https://github.com/vaemusic/datav-vue3)

## License

[MIT](./LICENSE) License Copyright [hackycy](https://github.com/hackycy)
