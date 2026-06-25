# Border Glow

`dv-border-glow` renders an SVG-first glowing panel frame.

<div class="datav-demo">
  <dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
    <dv-border-glow class="datav-panel" colors="#18f0ff,#f3ff5c" intensity="0.95" radius="24">
      <div class="datav-panel__content">
        <p class="datav-panel__title">Border Glow</p>
        <p class="datav-panel__meta">SVG gradients, glow, and animated dash flow</p>
      </div>
    </dv-border-glow>
  </dv-fit-screen>
</div>

```html
<dv-border-glow
  colors="#18f0ff,#f3ff5c"
  intensity="0.95"
  radius="24"
>
  <section>Border Glow</section>
</dv-border-glow>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary gradient color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. |
| `intensity` | `number` | `0.8` | Glow intensity from `0` to `1`. |
| `radius` | `number` | `16` | Corner radius in pixels. |
| `animated` | `boolean` | `true` | Enables dash flow animation. |
| `paused` | `boolean` | `false` | Pauses animation while retaining the frame. |
| `duration` | `number` | `2400` | Animation duration in milliseconds. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary fallback color. |
| `--dv-color-secondary` | Secondary fallback color. |
| `--dv-motion-duration` | Theme-level motion duration token. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
