export interface ElementSize {
  width: number
  height: number
}

// Reports the border box, unlike `ResizeController`, which reports `contentRect`.
// The title boxes carry their text-to-decoration gap as horizontal padding, so a
// content-box reading would be short by twice the gap and fight the rect reads the
// components already do.
export function observeElementSize(
  element: Element,
  callback: (size: ElementSize) => void,
): () => void {
  if (typeof ResizeObserver === 'undefined')
    return () => {}

  const read = (): void => {
    const rect = element.getBoundingClientRect()

    callback({ width: rect.width, height: rect.height })
  }

  const observer = new ResizeObserver(read)
  observer.observe(element, { box: 'border-box' })

  return () => observer.disconnect()
}
