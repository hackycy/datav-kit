# DataV Kit

Framework-agnostic Web Components for data dashboard decoration.

The first usable loop is intentionally small: `dv-fit-screen` handles dashboard scale behavior, `dv-count-to` renders animated metrics, and `dv-border-box-1` through `dv-border-box-10` start the numbered border series. The docs site registers the current Web Components package directly, so every demo on this site is a live usage example rather than a separate demo application.

## Live Demo

<div class="datav-demo">
  <dv-border-box-1 class="datav-panel" colors="#235fa7,#4fd2dd" duration="3">
    <div class="datav-panel__content">
      <p class="datav-panel__title">Command Center</p>
      <p class="datav-panel__meta">dv-border-box-1</p>
    </div>
  </dv-border-box-1>
</div>

```html
<dv-border-box-1 colors="#235fa7,#4fd2dd" duration="3">
  <section>Command Center</section>
</dv-border-box-1>
```

## What To Read Next

- [Installation](/guide/installation) for package setup and registration.
- [Screen Fit](/guide/screen-fit) for scaling behavior.
- [Count To](/components/tools/count-to) for animated numeric metrics.
- [Border Box 1](/components/borders/border-box-1) for SVG border decoration.
- [Border Box 2](/components/borders/border-box-2) for the layered cyber frame border.
- [Border Box 3](/components/borders/border-box-3) for the minimal futuristic blue frame border.
- [Border Box 4](/components/borders/border-box-4) for the dense neon HUD frame border.
- [Border Box 5](/components/borders/border-box-5) for the layered electric-blue HUD frame border.
- [Border Box 6](/components/borders/border-box-6) for the high-precision cyan HUD frame border.
- [Border Box 7](/components/borders/border-box-7) for the chamfered glowing panel.
- [Border Box 8](/components/borders/border-box-8) for the animated corner panel.
- [Border Box 9](/components/borders/border-box-9) for the DataV Vue3 BorderBox7-style glowing corner frame.
- [Border Box 10](/components/borders/border-box-10) for the DataV Vue3 BorderBox12-style rounded glow frame.
- [Decoration 3](/components/decorations/decoration-3) for the DataV Vue3 Decoration5-style angular line decoration.
- [Decoration 4](/components/decorations/decoration-4) for the DataV Vue3 Decoration11-style diamond panel decoration.
- [Component Authoring](/guide/component-authoring) for the required file layout and checklist.
