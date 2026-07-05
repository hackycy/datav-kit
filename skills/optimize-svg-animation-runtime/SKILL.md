---
name: optimize-svg-animation-runtime
description: Diagnose and fix high CPU usage from complex animated SVG components in datav-kit by applying a consistent runtime rasterization/video fallback pattern, feature switch, cache/queue lifecycle, SSR safety, and validation workflow. Use when a decoration, border, HUD frame, or other SVG-heavy component causes Chrome Renderer/Google Chrome Helper CPU spikes, when adding the decoration-11 video rasterization approach to another component, or when deciding whether to keep SVG, simplify animation, or use a rasterized runtime asset.
---

# Optimize SVG Animation Runtime

## Overview

Use this skill when a datav-kit component has sustained CPU usage from SVG animation, filters, masks, gradients, or many animated nodes. The goal is not to blindly convert SVG to video; first prove the cost source, then apply the least risky runtime strategy with the same public API and lifecycle rules across components.

## Read First

Before editing, read:

- `CLAUDE.md`
- `docs/architecture.md`
- The target component folder
- `packages/elements/src/decoration-11/element.ts`
- `packages/elements/src/internal/svg-video-rasterizer.ts` when reusing the current WebM path
- The target component metadata, docs page, registration/test coverage

## Decision Path

1. Confirm the runtime cost.
   - Reproduce with the live SVG animation visible.
   - Distinguish generation CPU, playback CPU, layout/paint CPU, and memory growth.
   - Check whether the CPU stays high after replacing SVG with `<video>`; if it does, suspect transparent WebM decode/compositing, not the recorder.

2. Prefer cheaper SVG only when fidelity is easy.
   - Reduce repeated filters, animated nodes, or blur stacks if the visual survives.
   - Add reduced-motion and hidden/offscreen pauses.
   - Do not degrade the component's intended visual identity just to keep SVG.

3. Use runtime rasterization when SVG animation is the sustained CPU source and the environment is Chromium-oriented.
   - Reuse the shared internal rasterizer instead of creating component-specific encoders.
   - Keep the live SVG as initial render and fallback.
   - Replace with video only after generation succeeds.

4. Escalate away from WebM alpha when fidelity or playback CPU is unacceptable.
   - For shallow or white backgrounds requiring exact translucent glow, consider APNG or PNG frame sequence.
   - For many repeated visible instances, consider one shared canvas/sprite playback instead of many independent videos.

## Required Public API

Every component using runtime rasterization must expose an opt-out property named `videoRasterize`, backed by the `video-rasterize` attribute and a default-true boolean converter.

Support `video-rasterize="false"`, `"0"`, and `"off"` as false. Default must remain true unless the user explicitly asks otherwise. When disabled, the component must keep the original live SVG path and must not create canvas/video resources.

Document the property in metadata and docs:

```html
<dvk-some-component video-rasterize="false"></dvk-some-component>
```

## Runtime Rasterization Pattern

Follow the decoration-11 structure unless there is a strong component-specific reason:

1. Render the normal SVG first.
2. Gate rasterization on:
   - `videoRasterize`
   - `animated`
   - not `paused`
   - not reduced motion
   - valid measured size
   - browser DOM availability
3. Build a stable raster key from final visual inputs:
   - resolved colors/theme values
   - clamped duration/speed
   - final raster width/height
   - display width used for stroke compensation
   - any animation mode or variant that changes pixels
4. Acquire a shared raster handle from a module-level cache.
5. Replace SVG with `<video part="graphic raster" autoplay loop muted playsinline preload="auto">`.
6. On prop/size changes, disconnection, or opt-out, release the raster handle and fall back safely.
7. Emit a component event such as `dvk-raster-error` and keep SVG visible if generation fails.

## Shared Queue And Cache Rules

Use one module-level queue per component family or a shared internal queue if generalized.

- Only one recording task should run at a time.
- Same key must share the same pending promise and final Blob URL.
- Track refs per instance; do not revoke a shared Blob URL while another instance uses it.
- Keep a small LRU cache for completed rasters; 8-12 entries is usually enough.
- Do not keep unbounded pending entries after failures.

Blob URL rules:

- Revoke temporary frame SVG Blob URLs immediately after image decode.
- Stop `MediaStreamTrack`s in `finally`.
- Stop `MediaRecorder` in `finally`.
- Revoke completed video Blob URLs only when evicting from cache or when no longer shared.

## Fidelity Rules

SVG-to-video can visibly degrade line art. Check these before blaming the codec:

- `vector-effect: non-scaling-stroke` plus high-resolution canvas can make strokes thinner after downscale. Compensate stroke widths in the cloned SVG only.
- Use final displayed content width, not unstable `clientWidth` from cloned SVG, for stroke compensation.
- Avoid black-background `screen` compositing if the component must match light backgrounds.
- Avoid GIF for glow/alpha: palette and transparency limitations usually ruin translucent lines.
- Keep raster scale adaptive. A practical starting point is DPR clamped to `1.5x-2x`, not fixed `3x`.
- Use 24fps unless visual motion proves it needs more; 30fps transparent video can be expensive.
- If loop closure needs a longer cycle, explain the cost. Do not hide seams with crossfades unless the user accepts the look.

## Playback CPU Rules

Transparent WebM playback may still keep Chrome Renderer CPU high because each visible `<video>` can decode/composite independently.

Always add:

- `IntersectionObserver` pause/resume when offscreen.
- `document.visibilitychange` pause/resume when tab is hidden.
- `paused` and `animated` integration so public controls stop the video.

If CPU remains high while visible:

- Lower raster max width, fps, and bitrate before changing generation architecture.
- Check how many visible video instances are decoding.
- Consider APNG/PNG sequence, shared canvas playback, or static SVG glow plus rasterized moving layers.

## SSR And Build Safety

Never touch browser-only globals at module top level:

- `document`
- `window`
- `XMLSerializer`
- `MediaRecorder`
- `Image`
- `URL.createObjectURL`

Access them only inside browser-gated functions. VitePress/docs SSR must be able to import the package without running browser code.

## Tests And Validation

Add or update tests for every component integration:

- Default path eventually replaces SVG with video when rasterization succeeds.
- `video-rasterize="false"` keeps live SVG and does not call `URL.createObjectURL`.
- Matching instances share one generated video URL.
- Raster errors keep SVG fallback visible.
- Typecheck, lint, package tests, and docs build pass.

Run:

```bash
pnpm --filter @datav-kit/elements typecheck
pnpm --filter @datav-kit/elements lint
pnpm --filter @datav-kit/elements test
pnpm --filter @datav-kit/docs build
```

Run docs build separately from tests that rebuild `packages/elements/dist`; concurrent builds can race while `dist` is cleaned.

## Review Checklist

- Public opt-out property is documented and tested.
- Existing props, parts, and events remain compatible.
- Fallback SVG is still the source of truth.
- Runtime cache is bounded.
- Generation tasks are serialized.
- No top-level browser globals break SSR.
- Hidden/offscreen videos pause.
- The final answer explains whether remaining CPU is generation cost or playback decode/compositing cost.
