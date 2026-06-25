# Architecture Contracts

This file records the implementation contracts that package code must follow.

## Metadata

Component metadata uses `DatavElementMetadata` from `@datav-kit/core`.

Each element must declare:

- `tagName`: a `dv-*` custom element name.
- `className`: the exported element class name.
- `props`: public attributes/properties, including type, default, attribute name, and optional CSS variable.
- `events`: public `dv-*` events and their detail shape.
- `parts`: supported Shadow DOM `::part()` names.

The `@datav-kit/elements` package exports a single `elementMetadata` array for docs and adapters.

## Package Exports

Published package entrypoints should use conditional exports with explicit `types` and `import` entries:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    },
    "./fit-screen": {
      "types": "./dist/fit-screen/index.d.mts",
      "import": "./dist/fit-screen/index.mjs"
    },
    "./package.json": "./package.json"
  }
}
```

Use `createConditionalExports()` from `@datav-kit/core` for simple one-file entrypoint templates.

## Events

Use `dispatchDatavEvent()` or `DatavElement.emit()` for public events.

Defaults:

- `bubbles: true`
- `composed: true`
- `cancelable: false`

Event names must use the `dv-*` prefix.

## SSR

Modules may be imported during SSR, but browser side effects must be guarded.

Rules:

- Do not call `customElements.define()` at module top level.
- Use `canUseDOM()` before browser-only registration code.
- Wrapper packages must render custom element tags during SSR without touching `window`.

## Props And Themes

Visual values resolve in this order:

1. Explicit attribute/property.
2. CSS variable on the host.
3. Component fallback.

Use `resolveThemeValue()` for values that support CSS variable fallback.

## Fullscreen

Fullscreen must be requested from a user gesture. Components may expose methods such as `requestFullscreenMode()`, but they must not automatically call `requestFullscreen()` on mount.

Use `requestDatavFullscreen()` so unsupported and denied requests resolve to structured results instead of throwing.
