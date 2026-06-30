# Architecture Contracts

This file records the implementation contracts that package code must follow.

## Metadata

Component metadata uses `DatavElementMetadata` from `@datav-kit/core`.

Each element must declare:

- `tagName`: a `dvk-*` custom element name.
- `className`: the exported element class name.
- `props`: public attributes/properties, including type, default, attribute name, and optional CSS variable.
- `events`: public `dvk-*` events and their detail shape.
- `parts`: supported Shadow DOM `::part()` names.

The `@datav-kit/elements` package exports a single `elementMetadata` array for docs and adapters.

## Package Exports

Published element packages should expose a single root entrypoint with explicit `types` and `import` entries. Element-level APIs should be re-exported from `src/index.ts` instead of adding one package export per element:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    },
    "./package.json": "./package.json"
  }
}
```

Use package subpath exports only for non-element assets that must be imported directly.

## Events

Use `dispatchDatavEvent()` or `DatavElement.emit()` for public events.

Defaults:

- `bubbles: true`
- `composed: true`
- `cancelable: false`

Event names must use the `dvk-*` prefix.

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

## Decorative Container Content Areas

Border boxes and similar decorative container elements must treat the content area as a first-class implementation contract.

Each SVG-backed decorative container should define:

- `viewBox`: the SVG coordinate system used for rendering the frame.
- `contentRect`: the safe rectangle, in the same SVG coordinate system, where slotted content may be placed.

The default content padding must be derived by mapping `contentRect` from SVG coordinates to the host element's measured size:

```txt
top    = (contentRect.y - viewBox.y) / viewBox.height * hostHeight
right  = (viewBox.right - contentRect.right) / viewBox.width * hostWidth
bottom = (viewBox.bottom - contentRect.bottom) / viewBox.height * hostHeight
left   = (contentRect.x - viewBox.x) / viewBox.width * hostWidth
```

Do not use fixed large padding or generic width/height ratios as the default content-area model. Those values may be used only as minimum guards or explicit CSS-variable overrides.

CSS variable precedence for border-box content inset is:

```txt
--dvk-border-box-N-padding
> --dvk-border-box-padding
> computed safe-area padding
```

The computed value may be stored in an internal CSS variable such as `--dvk-border-box-auto-padding`, but it is not a public authoring contract.

## Fullscreen

Fullscreen must be requested from a user gesture. Components may expose methods such as `requestFullscreenMode()`, but they must not automatically call `requestFullscreen()` on mount.

Use `requestDatavFullscreen()` so unsupported and denied requests resolve to structured results instead of throwing.
