---
description: Create new datav-kit elements with proper file layout, metadata, registration, and testing conventions.
---

# Component Authoring

Every new element should follow the same shape so docs, metadata, registration, and adapters can be generated consistently later.

## File Layout

```txt
packages/elements/src/<component>/
  element.ts
  metadata.ts
  register.ts
  index.ts
```

## Required Checklist

- Export an element class from `element.ts`.
- Export `metadata.ts` that satisfies `DatavElementMetadata`.
- Export a single-element `defineXxx()` helper from `register.ts`.
- Add the element to `packages/elements/src/register.ts`.
- Add metadata to `packages/elements/src/metadata.ts`.
- Add a package subpath export if users should import the component directly.
- Add unit tests for registration, attribute/property behavior, and any resize or animation behavior.
- Add a VitePress component page with a live demo and the matching code block.

## Public Contracts

Events must use `DatavElement.emit()` or `dispatchDatavEvent()`. Public visual values should follow:

```txt
explicit attribute/property > CSS variable > component fallback
```

Fullscreen, DOM registration, and other browser-only APIs must be guarded so modules can be imported during SSR.
