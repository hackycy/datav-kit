---
description: Animated numeric metric display with prefix, suffix, thousands separator, and decimal formatting options.
---

# Count To

`dvk-count-to` renders an animated numeric metric with optional prefix, suffix, thousands separator, and decimal formatting.

<div class="datav-demo">
  <dvk-border-box-1 class="datav-panel" colors="#235fa7,#4fd2dd">
    <div class="datav-panel__content">
      <p class="datav-panel__title">Total Throughput</p>
      <dvk-count-to end-val="987654.32" decimals="2" prefix="$" suffix="M" duration="1800"></dvk-count-to>
    </div>
  </dvk-border-box-1>
</div>

```html
<dvk-count-to
  end-val="987654.32"
  decimals="2"
  prefix="$"
  suffix="M"
  duration="1800"
></dvk-count-to>
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
| `dvk-started` | `{ from, to, duration, delay }` |
| `dvk-finished` | `{ value }` |

## Slots

| Name | Description |
| --- | --- |
| `prefix` | Custom content before the number. |
| `suffix` | Custom content after the number. |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-count-to-color` | Root text color. |
| `--dvk-count-to-font-family` | Number font family. |
| `--dvk-count-to-font-size` | Main number font size. |
| `--dvk-count-to-font-weight` | Main number font weight. |
| `--dvk-count-to-gap` | Gap between prefix, number, and suffix. |
| `--dvk-count-to-affix-color` | Prefix and suffix text color. |
| `--dvk-count-to-affix-font-size` | Prefix and suffix font size. |
| `--dvk-count-to-decimal-color` | Decimal text color. |
| `--dvk-count-to-decimal-font-size` | Decimal font size. |
| `--dvk-count-to-decimal-font-weight` | Decimal font weight. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Inline wrapper. |
| `prefix` | Fallback prefix text. |
| `main` | Number wrapper. |
| `integer` | Integer text. |
| `decimal` | Decimal text. |
| `suffix` | Fallback suffix text. |
