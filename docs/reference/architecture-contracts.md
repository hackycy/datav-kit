---
description: Implementation contracts for datav-kit metadata, events, SSR, props, themes, and decorative container content areas.
---

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

### Authoring Slotted Content

Border boxes expose a default content slot. `frame`, `graphic` and `content` are CSS parts,
not named slots; put headings and chart wrappers in the default slot rather than assigning
them to a `header` or `title` slot.

Keep the computed inset unless the rendered result demonstrates an obstruction or overflow.
For additional breathing room, first adjust the layout or add padding to an inner content
wrapper. An explicit inset override affects every child and must still keep content clear
of the frame. Insets depend on the element and its measured size; do not infer a component
variant from padding values or copy a fixed inset across variants.

An independently filled surface requires a component whose detail page documents
`background-color`. Transparent frames can instead inherit a project-owned surface.
Likewise, motion controls and automatic-height support belong to individual component APIs;
verify the selected element's detail page instead of assuming all border boxes share props.

## Title Middle Span

`dvk-title-4`, `dvk-title-5`, `dvk-title-6` and `dvk-title-7` each open a middle span that is
measured from the title box rather than fixed at design time. All four resolve it through one
internal helper, `resolveTitleCenterHalf` in `packages/elements/src/internal/title-center.ts`:

```txt
half = clamp(measuredTitleWidth / 2 * viewBoxWidth / hostWidth, 0, limit)
```

- The measured width is the `.title` **border box**, so the text's horizontal padding is part of the
  span. `observeElementSize` reads the border box for exactly this reason; `ResizeController` reports
  the content box and is used only for the host.
- `--dvk-title-N-title-width` and `--dvk-title-N-title-gap` seed that measured box. They are not
  solver overrides — no variable sets the span directly.
- `limit` stays with each component, because each ceiling protects different side furniture: a soft
  rail reversing on itself (title-4), the slash group leaving the viewBox (title-5), the bend crossing
  the edge ticks (title-6), the side rail reversing on its own fixed outer start (title-7). Do not
  hoist a ceiling into the shared helper.
- `fallback` is the value used when nothing is measurable. It must reproduce the design's own
  geometry, so a layout-less environment renders the design instead of an arbitrary width.

Extra clearance beyond the text always comes from `--dvk-title-N-title-gap`, expressed against the
title font. Keep new title variants on that mechanism rather than adding a viewBox-unit offset to the
span, or the family stops being uniform.

The middle does not mean the same shape in every variant — an interruption in the rails, a filled
recess, or the span of a continuous baseline. Only the width solve is shared; path builders stay with
their component.

When side furniture is tied to the middle span rather than pinned to the host edge, anchor it on the
same projected line the span's own paths use, and keep the design's clearance rather than closing it:
title-7's node sits on the ribbon's inner line at the node's own top height, minus the prototype's
gap, so the design aspect reproduces the prototype exactly and the node still travels with the fold.

`dvk-title-1`, `dvk-title-2` and `dvk-title-3` are static designs with no measured span, so this
mechanism applies only to variants that adapt to their title.

## Fullscreen

Fullscreen must be requested from a user gesture. Components may expose methods such as `requestFullscreenMode()`, but they must not automatically call `requestFullscreen()` on mount.

Use `requestDatavFullscreen()` so unsupported and denied requests resolve to structured results instead of throwing.
