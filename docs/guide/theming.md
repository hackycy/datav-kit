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
