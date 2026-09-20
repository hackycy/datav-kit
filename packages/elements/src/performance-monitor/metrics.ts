export interface PerformanceMonitorCounts {
  animations: number
  canvas: number
  datav: number
  nodes: number
  playingVideos: number
  svg: number
  videos: number
  visibleVideos: number
}

export interface PerformanceMonitorMemoryMetrics {
  label: string
  percent: number | null
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    jsHeapSizeLimit: number
    totalJSHeapSize: number
    usedJSHeapSize: number
  }
}

export const monitorTagName = 'dvk-performance-monitor'

const animationTagNames = ['animate', 'animatetransform']

export const emptyCounts: PerformanceMonitorCounts = {
  animations: 0,
  canvas: 0,
  datav: 0,
  nodes: 0,
  playingVideos: 0,
  svg: 0,
  videos: 0,
  visibleVideos: 0,
}

export function parseBooleanValue(value: unknown, fallback: boolean): boolean {
  if (value === undefined || value === null)
    return fallback

  if (typeof value === 'boolean')
    return value

  if (typeof value === 'number')
    return value !== 0

  const normalized = String(value).trim().toLowerCase()

  if (normalized === '')
    return true

  if (['false', '0', 'off', 'no'].includes(normalized))
    return false

  if (['true', '1', 'on', 'yes'].includes(normalized))
    return true

  return fallback
}

export function formatBytes(value: number): string {
  if (!Number.isFinite(value))
    return 'n/a'

  const mib = value / 1024 / 1024

  if (mib >= 1024)
    return `${(mib / 1024).toFixed(1)} GiB`

  return `${mib.toFixed(0)} MiB`
}

export function collectMemoryMetrics(): PerformanceMonitorMemoryMetrics {
  const memory = (performance as PerformanceWithMemory).memory

  if (!memory)
    return { label: 'n/a', percent: null }

  return {
    label: `${formatBytes(memory.usedJSHeapSize)} / ${formatBytes(memory.jsHeapSizeLimit)}`,
    percent: Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100),
  }
}

export function collectRenderCounts(): PerformanceMonitorCounts {
  const counts = { ...emptyCounts }

  collectElements().forEach((element) => {
    const tagName = element.localName.toLowerCase()

    counts.nodes += 1

    if (animationTagNames.includes(tagName)) {
      counts.animations += 1
    }
    else if (tagName === 'canvas') {
      counts.canvas += 1
    }
    else if (tagName === 'svg') {
      counts.svg += 1
    }
    else if (tagName === 'video') {
      counts.videos += 1

      const video = element as HTMLVideoElement

      if (isVideoVisible(video))
        counts.visibleVideos += 1

      if (!video.paused && !video.ended)
        counts.playingVideos += 1
    }

    if (tagName.startsWith('dvk-'))
      counts.datav += 1
  })

  return counts
}

export function calculatePressure(input: { droppedRatio: number, elapsed: number, longTaskMs: number }): number {
  const framePressure = input.droppedRatio * 100
  const longTaskPressure = input.longTaskMs / Math.max(input.elapsed, 1) * 100

  return Math.round(clamp(framePressure + longTaskPressure, 0, 100))
}

function collectElements(): Element[] {
  const elements: Element[] = []
  const roots: ParentNode[] = [document.body]

  for (let index = 0; index < roots.length; index += 1) {
    const walker = document.createTreeWalker(roots[index], NodeFilter.SHOW_ELEMENT)
    let node = walker.nextNode()

    while (node) {
      const element = node as Element

      if (!isMonitorElement(element)) {
        elements.push(element)

        if (element.shadowRoot)
          roots.push(element.shadowRoot)
      }

      node = walker.nextNode()
    }
  }

  return elements
}

function isVideoVisible(video: HTMLVideoElement): boolean {
  const rect = video.getBoundingClientRect()

  return rect.width > 0
    && rect.height > 0
    && rect.bottom >= 0
    && rect.right >= 0
    && rect.top <= window.innerHeight
    && rect.left <= window.innerWidth
}

function isMonitorElement(element: Element): boolean {
  return element.localName.toLowerCase() === monitorTagName
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
