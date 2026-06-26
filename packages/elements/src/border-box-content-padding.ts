export interface BorderBoxRect {
  x: number
  y: number
  width: number
  height: number
}

export interface BorderBoxContentPaddingOptions {
  hostWidth: number
  hostHeight: number
  viewBox: BorderBoxRect
  contentRect: BorderBoxRect
  minBlock: number
  minInline: number
}

export function createBorderBoxContentPadding(options: BorderBoxContentPaddingOptions): string {
  const hostWidth = Math.max(options.hostWidth, 0)
  const hostHeight = Math.max(options.hostHeight, 0)
  const viewBoxRight = options.viewBox.x + options.viewBox.width
  const viewBoxBottom = options.viewBox.y + options.viewBox.height
  const contentRight = options.contentRect.x + options.contentRect.width
  const contentBottom = options.contentRect.y + options.contentRect.height

  const top = scaleY(options.contentRect.y - options.viewBox.y, options.viewBox.height, hostHeight)
  const right = scaleX(viewBoxRight - contentRight, options.viewBox.width, hostWidth)
  const bottom = scaleY(viewBoxBottom - contentBottom, options.viewBox.height, hostHeight)
  const left = scaleX(options.contentRect.x - options.viewBox.x, options.viewBox.width, hostWidth)

  return [
    formatPaddingValue(Math.max(top, options.minBlock)),
    formatPaddingValue(Math.max(right, options.minInline)),
    formatPaddingValue(Math.max(bottom, options.minBlock)),
    formatPaddingValue(Math.max(left, options.minInline)),
  ].join(' ')
}

function scaleX(value: number, viewBoxWidth: number, hostWidth: number): number {
  if (viewBoxWidth <= 0)
    return 0

  return value / viewBoxWidth * hostWidth
}

function scaleY(value: number, viewBoxHeight: number, hostHeight: number): number {
  if (viewBoxHeight <= 0)
    return 0

  return value / viewBoxHeight * hostHeight
}

function formatPaddingValue(value: number): string {
  return `${Number(value.toFixed(2))}px`
}
