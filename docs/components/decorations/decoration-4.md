# Decoration 4

`dv-decoration-4` recreates the responsive diamond panel from DataV Vue3 `Decoration11` as a framework-agnostic Web Component. It draws the four corner ornaments, main diamond frame, and side accent lines from the host width and height, then centers slotted content over the SVG.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 360px; --datav-decoration-height: 90px;">
  <div class="datav-decoration-shell">
    <dv-decoration-4>
      <strong>Decoration 4</strong>
    </dv-decoration-4>
  </div>
</div>

```html
<dv-decoration-4>
  <strong>Decoration 4</strong>
</dv-decoration-4>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary frame color. |
| `secondary-color` | `string` | CSS variable fallback | Corner ornament color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary fallback color. |
| `--dv-color-secondary` | Secondary fallback color. |
| `--dv-decoration-4-padding` | Padding applied to the centered content layer. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `corner` | Shared part for all four corner ornaments. |
| `top-left-corner` | Top-left corner ornament. |
| `bottom-left-corner` | Bottom-left corner ornament. |
| `top-right-corner` | Top-right corner ornament. |
| `bottom-right-corner` | Bottom-right corner ornament. |
| `frame` | Main diamond panel polygon. |
| `side-line` | Shared part for both inner side accent lines. |
| `left-line` | Left inner accent line. |
| `right-line` | Right inner accent line. |
| `content` | Centered slotted content layer. |
