export interface TitleCenterOptions {
  /** Measured `.title` box width, border-box, in px. */
  titleWidth: number
  /** Host width in px. */
  hostWidth: number
  /** The design canvas width the component's viewBox uses. */
  viewBoxWidth: number
  /** Half-span used when nothing is measurable. */
  fallback: number
  /** Structural ceiling derived from the component's own side furniture. */
  limit: number
}

// Every `dvk-title-*` that opens a middle span solves the same quantity: half of the
// measured title box, in viewBox units, so `preserveAspectRatio="none"` stretches it
// onto the host. Only the ceiling and the unmeasurable fallback differ per component,
// and each ceiling protects different furniture, so callers derive `limit` themselves
// rather than sharing it. The title box keeps its text-to-decoration gap as horizontal
// padding, so the measurement that feeds this is the border box.
export function resolveTitleCenterHalf(options: TitleCenterOptions): number {
  const { titleWidth, hostWidth, viewBoxWidth, fallback, limit } = options

  if (!(titleWidth > 0) || !(hostWidth > 0))
    return fallback

  const half = titleWidth / 2 * viewBoxWidth / hostWidth

  // `Math.max(limit, 0)` floors the ceiling itself: a caller whose run or furniture
  // constants grow past the centre would otherwise invert the clamp into a negative.
  return Math.min(Math.max(half, 0), Math.max(limit, 0))
}
