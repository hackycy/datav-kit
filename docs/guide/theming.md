# Theming

Components work without a theme file, but optional themes provide CSS variables for consistent color and motion.

```ts
import '@datav-kit/themes/cyber-blue.css'
```

Values resolve in this order:

1. Explicit attribute or property.
2. CSS variable on the host.
3. Component fallback.

For example, `dv-border-glow` can use explicit colors:

```html
<dv-border-glow colors="#18f0ff,#f3ff5c"></dv-border-glow>
```

Or inherit variables from a theme scope:

```html
<section class="dv-theme-cyber-blue">
  <dv-border-glow></dv-border-glow>
</section>
```

<div class="theme-grid">
  <div class="theme-card dv-theme-cyber-blue">
    <strong>cyber-blue</strong>
    <dv-border-glow style="display:block;height:120px"></dv-border-glow>
  </div>
  <div class="theme-card dv-theme-neon-magenta">
    <strong>neon-magenta</strong>
    <dv-border-glow style="display:block;height:120px"></dv-border-glow>
  </div>
</div>
