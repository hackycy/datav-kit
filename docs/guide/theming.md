# Theming

Components work without a theme file, but optional themes provide CSS variables for consistent color and motion.

```ts
import '@datav-kit/themes/cyber-blue.css'
```

Values resolve in this order:

1. Explicit attribute or property.
2. CSS variable on the host.
3. Component fallback.

For example, `dv-border-box-8` can use explicit colors:

```html
<dv-border-box-8 colors="#235fa7,#4fd2dd"></dv-border-box-8>
```

Or inherit variables from a theme scope:

```html
<section class="dv-theme-cyber-blue">
  <dv-border-box-8></dv-border-box-8>
</section>
```

<div class="theme-grid">
  <div class="theme-card dv-theme-cyber-blue">
    <strong>cyber-blue</strong>
    <dv-border-box-8 style="display:block;height:120px"></dv-border-box-8>
  </div>
  <div class="theme-card dv-theme-neon-magenta">
    <strong>neon-magenta</strong>
    <dv-border-box-8 style="display:block;height:120px"></dv-border-box-8>
  </div>
</div>
