# Border Box 8

`dv-border-box-8` is the first numbered border component. It renders a rectangular SVG border with a moving highlight around the edge.

<div class="datav-demo">
  <dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
    <dv-border-box-8 class="datav-panel" colors="#235fa7,#4fd2dd" duration="3">
      <div class="datav-panel__content">
        <p class="datav-panel__title">Border Box 8</p>
        <p class="datav-panel__meta">numbered SVG border with animated edge highlight</p>
      </div>
    </dv-border-box-8>
  </dv-fit-screen>
</div>

```html
<dv-border-box-8 colors="#235fa7,#4fd2dd" duration="3">
  <section>Border Box 8</section>
</dv-border-box-8>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary border color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary highlight color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. |
| `reverse` | `boolean` | `false` | Reverses the animated path direction. |
| `duration` | `number` | `3` | Animation duration in seconds. |
| `animated` | `boolean` | `true` | Enables the moving highlight. |
| `paused` | `boolean` | `false` | Pauses the moving highlight while retaining the border. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary fallback color. |
| `--dv-color-secondary` | Secondary fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
