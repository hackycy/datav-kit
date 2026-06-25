# datav-kit

Framework-agnostic Web Components for data dashboard decoration.

The first usable loop is intentionally small: `dv-fit-screen` handles dashboard scale behavior, and `dv-border-glow` provides an SVG-first decorative panel. The docs site registers the current Web Components package directly, so every demo on this site is a live usage example rather than a separate demo application.

## Live Demo

<div class="datav-demo">
  <dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
    <dv-border-glow class="datav-panel" colors="#18f0ff,#f3ff5c" intensity="0.9" radius="18">
      <div class="datav-panel__content">
        <p class="datav-panel__title">Command Center</p>
        <p class="datav-panel__meta">dv-fit-screen + dv-border-glow</p>
      </div>
    </dv-border-glow>
  </dv-fit-screen>
</div>

```html
<dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
  <dv-border-glow colors="#18f0ff,#f3ff5c" intensity="0.9" radius="18">
    <section>Command Center</section>
  </dv-border-glow>
</dv-fit-screen>
```

## What To Read Next

- [Installation](/guide/installation) for package setup and registration.
- [Screen Fit](/guide/screen-fit) for scaling behavior.
- [Border Glow](/components/borders/border-glow) for SVG border decoration.
- [Component Authoring](/guide/component-authoring) for the required file layout and checklist.
