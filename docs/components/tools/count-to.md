# Count To

`dv-count-to` renders an animated numeric metric with optional prefix, suffix, thousands separator, and decimal formatting.

<div class="datav-demo">
  <dv-border-box-1 class="datav-panel" colors="#235fa7,#4fd2dd">
    <div class="datav-panel__content">
      <p class="datav-panel__title">Total Throughput</p>
      <dv-count-to end-val="987654.32" decimals="2" prefix="$" suffix="M" duration="1800"></dv-count-to>
    </div>
  </dv-border-box-1>
</div>

```html
<dv-count-to
  end-val="987654.32"
  decimals="2"
  prefix="$"
  suffix="M"
  duration="1800"
></dv-count-to>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `start-val` | `number` | `0` | Initial value used when the counter starts or restarts. |
| `end-val` | `number` | `0` | Target value displayed after the count animation finishes. |
| `duration` | `number` | `2000` | Animation duration in milliseconds. |
| `delay` | `number` | `0` | Delay before the animation starts, in milliseconds. |
| `decimals` | `number` | `0` | Number of decimal places to render. |
| `decimal` | `string` | `.` | Decimal separator. |
| `separator` | `string` | `,` | Thousands separator. |
| `prefix` | `string` | empty | Text rendered before the number when no `prefix` slot is provided. |
| `suffix` | `string` | empty | Text rendered after the number when no `suffix` slot is provided. |
| `disabled` | `boolean` | `false` | Disables animation and immediately renders the target value. |
| `transition` | `linear \| easeOutCubic \| easeInOutCubic \| easeOutExpo` | `easeOutExpo` | Easing preset for the count animation. |

## Events

| Name | Detail |
| --- | --- |
| `dv-started` | `{ from, to, duration, delay }` |
| `dv-finished` | `{ value }` |

## Slots

| Name | Description |
| --- | --- |
| `prefix` | Custom content before the number. |
| `suffix` | Custom content after the number. |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-count-to-color` | Root text color. |
| `--dv-count-to-font-family` | Number font family. |
| `--dv-count-to-font-size` | Main number font size. |
| `--dv-count-to-font-weight` | Main number font weight. |
| `--dv-count-to-gap` | Gap between prefix, number, and suffix. |
| `--dv-count-to-affix-color` | Prefix and suffix text color. |
| `--dv-count-to-affix-font-size` | Prefix and suffix font size. |
| `--dv-count-to-decimal-color` | Decimal text color. |
| `--dv-count-to-decimal-font-size` | Decimal font size. |
| `--dv-count-to-decimal-font-weight` | Decimal font weight. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Inline wrapper. |
| `prefix` | Fallback prefix text. |
| `main` | Number wrapper. |
| `integer` | Integer text. |
| `decimal` | Decimal text. |
| `suffix` | Fallback suffix text. |
