# datav-kit

Framework-agnostic Web Components for data dashboard decoration.

The first usable loop is intentionally small: `dv-fit-screen` handles dashboard scale behavior, and `dv-border-box-8` starts the numbered border series. The docs site registers the current Web Components package directly, so every demo on this site is a live usage example rather than a separate demo application.

## Live Demo

<div class="datav-demo">
  <dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
    <dv-border-box-8 class="datav-panel" colors="#235fa7,#4fd2dd" duration="3">
      <div class="datav-panel__content">
        <p class="datav-panel__title">Command Center</p>
        <p class="datav-panel__meta">dv-fit-screen + dv-border-box-8</p>
      </div>
    </dv-border-box-8>
  </dv-fit-screen>
</div>

```html
<dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
  <dv-border-box-8 colors="#235fa7,#4fd2dd" duration="3">
    <section>Command Center</section>
  </dv-border-box-8>
</dv-fit-screen>
```

## What To Read Next

- [Installation](/guide/installation) for package setup and registration.
- [Screen Fit](/guide/screen-fit) for scaling behavior.
- [Border Box 8](/components/borders/border-box-8) for SVG border decoration.
- [Component Authoring](/guide/component-authoring) for the required file layout and checklist.
