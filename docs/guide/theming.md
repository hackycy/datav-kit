---
description: Coordinate dashboard backgrounds, text, status, data-series colors and dvk component accents through scoped dark or light project themes.
---

# Theming

Components work without a theme file, but optional themes provide CSS variables for consistent color and motion.

```ts
import '@datav-kit/themes/cyber-blue.css'
```

Values resolve in this order:

1. Explicit attribute or property.
2. CSS variable on the host.
3. Component fallback.

For example, `dvk-border-box-1` can use explicit colors:

```html
<dvk-border-box-1 colors="#235fa7,#4fd2dd"></dvk-border-box-1>
```

Or inherit variables from a theme scope:

```html
<section class="dvk-theme-cyber-blue">
  <dvk-border-box-1></dvk-border-box-1>
</section>
```

<div class="theme-grid">
  <div class="theme-card dvk-theme-cyber-blue">
    <strong>cyber-blue</strong>
    <dvk-border-box-1 style="display:block;height:120px"></dvk-border-box-1>
  </div>
  <div class="theme-card dvk-theme-neon-magenta">
    <strong>neon-magenta</strong>
    <dvk-border-box-1 style="display:block;height:120px"></dvk-border-box-1>
  </div>
</div>

## Complete Project Themes

Library presets primarily supply decorative component colors, surfaces and motion values.
The `ice-white` preset is a bright accent palette, not a complete light application theme.
A screen also needs readable text, page backgrounds, status colors and data-series roles.

Define those roles once in a project-scoped class, then map them to the existing component
variables. The `--app-*` names below are application conventions, not new datav-kit APIs:

```css
.dvk-theme-project {
  --app-background: #f4f6f8;
  --app-surface: #ffffff;
  --app-text: #17252d;
  --app-muted: #52646e;
  --app-rule: #d9e1e5;
  --app-selected: #126c94;
  --app-positive: #197448;
  --app-warning: #9a5300;
  --app-danger: #be3545;
  --app-series-1: #167ba5;
  --app-series-2: #168268;
  --app-series-3: #b66019;
  --app-series-4: #7a54a4;

  --dvk-color-primary: var(--app-selected);
  --dvk-color-secondary: var(--app-series-2);
  --dvk-color-accent: var(--app-warning);
  --dvk-color-surface: var(--app-surface);
  --dvk-glow-soft: 0 0 0 transparent;
  --dvk-glow-strong: 0 0 0 transparent;
  --dvk-line-width: 1px;
  --dvk-motion-duration: 2400ms;
  --dvk-count-to-color: var(--app-text);
}
```

Apply the class to the screen root. Set its background and text color from these roles;
use the same roles for status labels and charts. For a dark theme, change the project
role values together and check contrast against the resulting surfaces. Warning color
should not double as an unrelated data category without an additional distinguishing cue.

Keep spacing, type sizes and layout in the screen layer rather than the color theme.
Existing presets also declare `:root` values, so loading several preset stylesheets can
change the surrounding page. A custom project class avoids that global coupling.

Chart and 3D libraries usually need concrete color values. Read inherited custom
properties with `getComputedStyle(screen)`. Resolve expressions such as `color-mix()`
through a computed `color` property before passing them to a library that does not parse
CSS expressions. Reapply colors when the project theme changes.

See [Dashboard Examples](/guide/dashboard-examples) for complete dark analytical, map,
topology and 3D compositions using this approach.
