export type PerformanceMonitorMode = 'overlay' | 'inline'
export type PerformanceMonitorPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type PerformanceMonitorAlertReason = 'pressure' | 'fps' | 'long-task'

export interface PerformanceMonitorScope {
  fallback: boolean
  label: string
  scannedRoots: number
}

export interface PerformanceMonitorSupport {
  animations: boolean
  longTask: boolean
  memory: boolean
  storage: boolean
}

export interface PerformanceMonitorSummary {
  fps: number
  heapLabel: string
  heapPercent: number | null
  longTaskCount: number
  longTaskMs: number
  nodes: number
  pressure: number
}

export interface PerformanceMonitorPressureContributors {
  frame: number
  inventory: number
  longTask: number
  memory: number
}

export interface PerformanceMonitorFrameMetrics {
  avgFps: number
  droppedRatio: number
  fps: number
  longFrames: number
  maxFrameMs: number
  minFps: number
}

export interface PerformanceMonitorLongTaskEntry {
  attribution: string[]
  duration: number
  name: string
  startTime: number
}

export interface PerformanceMonitorLongTaskMetrics {
  count: number
  maxMs: number
  recent: PerformanceMonitorLongTaskEntry[]
  supported: boolean
  totalMs: number
}

export interface PerformanceMonitorMemoryMetrics {
  label: string
  percent: number | null
  supported: boolean
  totalJSHeapSize: number | null
  usedJSHeapSize: number | null
  jsHeapSizeLimit: number | null
}

export interface PerformanceMonitorInventoryMetrics {
  animations: number
  canvas: number
  datav: number
  nodes: number
  playingVideos: number
  svg: number
  videos: number
  visibleVideos: number
}

export interface PerformanceMonitorHotspot {
  count: number
  owner: string
}

export interface PerformanceMonitorSvgHotspot {
  animations: number
  filters: number
  gradients: number
  masks: number
  nodes: number
  owner: string
}

export interface PerformanceMonitorSvgMetrics {
  animations: number
  filters: number
  gradients: number
  hotspots: PerformanceMonitorSvgHotspot[]
  masks: number
  nodes: number
  total: number
}

export interface PerformanceMonitorCanvasMetrics {
  highDpr: number
  largestHeight: number
  largestWidth: number
  total: number
  totalPixels: number
}

export interface PerformanceMonitorAnimationMetrics {
  cssAnimations: number
  cssTransitions: number
  hotspots: PerformanceMonitorHotspot[]
  running: number
  supported: boolean
  total: number
  waapi: number
}

export interface PerformanceMonitorVideoMetrics {
  playing: number
  total: number
  visible: number
}

export interface PerformanceMonitorSnapshot {
  animation: PerformanceMonitorAnimationMetrics
  canvas: PerformanceMonitorCanvasMetrics
  frame: PerformanceMonitorFrameMetrics
  hotspots: {
    datav: PerformanceMonitorHotspot[]
    svg: PerformanceMonitorSvgHotspot[]
  }
  inventory: PerformanceMonitorInventoryMetrics
  longTask: PerformanceMonitorLongTaskMetrics
  memory: PerformanceMonitorMemoryMetrics
  pressure: {
    contributors: PerformanceMonitorPressureContributors
    value: number
  }
  scope: PerformanceMonitorScope
  summary: PerformanceMonitorSummary
  support: PerformanceMonitorSupport
  timestamp: number
  video: PerformanceMonitorVideoMetrics
}

export interface PerformanceMonitorAlertDetail {
  pressure: PerformanceMonitorSnapshot['pressure']
  reason: PerformanceMonitorAlertReason
  summary: PerformanceMonitorSummary
  threshold: number
  timestamp: number
  value: number
}

export interface LongTaskLikeEntry extends PerformanceEntry {
  attribution?: Array<{
    containerName?: string
    containerSrc?: string
    containerType?: string
    name?: string
  }>
}

interface InventoryResult {
  animation: PerformanceMonitorAnimationMetrics
  canvas: PerformanceMonitorCanvasMetrics
  hotspots: PerformanceMonitorSnapshot['hotspots']
  inventory: PerformanceMonitorInventoryMetrics
  scope: PerformanceMonitorScope
  svg: PerformanceMonitorSvgMetrics
  video: PerformanceMonitorVideoMetrics
}

interface PressureInput {
  droppedRatio: number
  elapsed: number
  inventory: PerformanceMonitorInventoryMetrics
  longTaskMs: number
  memoryPercent: number | null
}

export const defaultInventory: PerformanceMonitorInventoryMetrics = {
  animations: 0,
  canvas: 0,
  datav: 0,
  nodes: 0,
  playingVideos: 0,
  svg: 0,
  videos: 0,
  visibleVideos: 0,
}

export const defaultSnapshot: PerformanceMonitorSnapshot = {
  animation: {
    cssAnimations: 0,
    cssTransitions: 0,
    hotspots: [],
    running: 0,
    supported: false,
    total: 0,
    waapi: 0,
  },
  canvas: {
    highDpr: 0,
    largestHeight: 0,
    largestWidth: 0,
    total: 0,
    totalPixels: 0,
  },
  frame: {
    avgFps: 0,
    droppedRatio: 0,
    fps: 0,
    longFrames: 0,
    maxFrameMs: 0,
    minFps: 0,
  },
  hotspots: {
    datav: [],
    svg: [],
  },
  inventory: defaultInventory,
  longTask: {
    count: 0,
    maxMs: 0,
    recent: [],
    supported: false,
    totalMs: 0,
  },
  memory: {
    label: 'n/a',
    percent: null,
    supported: false,
    totalJSHeapSize: null,
    usedJSHeapSize: null,
    jsHeapSizeLimit: null,
  },
  pressure: {
    contributors: {
      frame: 0,
      inventory: 0,
      longTask: 0,
      memory: 0,
    },
    value: 0,
  },
  scope: {
    fallback: false,
    label: 'document.body',
    scannedRoots: 0,
  },
  summary: {
    fps: 0,
    heapLabel: 'n/a',
    heapPercent: null,
    longTaskCount: 0,
    longTaskMs: 0,
    nodes: 0,
    pressure: 0,
  },
  support: {
    animations: false,
    longTask: false,
    memory: false,
    storage: false,
  },
  timestamp: 0,
  video: {
    playing: 0,
    total: 0,
    visible: 0,
  },
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

export function formatBytes(value: number | null): string {
  if (value === null || !Number.isFinite(value))
    return 'n/a'

  const mib = value / 1024 / 1024

  if (mib >= 1024)
    return `${(mib / 1024).toFixed(1)} GiB`

  return `${mib.toFixed(0)} MiB`
}

export function collectMemoryMetrics(): PerformanceMonitorMemoryMetrics {
  const memory = typeof performance === 'undefined'
    ? undefined
    : (performance as Performance & {
        memory?: {
          jsHeapSizeLimit: number
          totalJSHeapSize: number
          usedJSHeapSize: number
        }
      }).memory

  if (!memory) {
    return {
      label: 'unsupported',
      percent: null,
      supported: false,
      totalJSHeapSize: null,
      usedJSHeapSize: null,
      jsHeapSizeLimit: null,
    }
  }

  const percent = Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100)

  return {
    label: `${formatBytes(memory.usedJSHeapSize)} / ${formatBytes(memory.jsHeapSizeLimit)}`,
    percent,
    supported: true,
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  }
}

export function normalizeLongTaskEntry(entry: LongTaskLikeEntry): PerformanceMonitorLongTaskEntry {
  return {
    attribution: (entry.attribution ?? [])
      .map((item) => {
        const parts = [item.containerType, item.containerName, item.containerSrc, item.name].filter(Boolean)
        return parts.length > 0 ? parts.join(' ') : 'n/a'
      })
      .slice(0, 3),
    duration: Math.round(entry.duration),
    name: entry.name || 'longtask',
    startTime: Math.round(entry.startTime),
  }
}

export function calculatePressure(input: PressureInput): {
  contributors: PerformanceMonitorPressureContributors
  value: number
} {
  const frame = clamp(Math.round(input.droppedRatio * 100), 0, 100)
  const longTask = clamp(Math.round(input.longTaskMs / Math.max(input.elapsed, 1) * 100), 0, 100)
  const memory = input.memoryPercent === null
    ? 0
    : clamp(Math.round(Math.max(input.memoryPercent - 80, 0) * 0.5), 0, 10)
  const inventory = clamp(Math.round(
    Math.max(input.inventory.nodes - 3000, 0) / 800
    + input.inventory.animations / 20
    + input.inventory.canvas / 4,
  ), 0, 15)
  const contributors = {
    frame,
    inventory,
    longTask,
    memory,
  }

  return {
    contributors,
    value: clamp(frame + longTask + memory + inventory, 0, 100),
  }
}

export function collectPerformanceInventory(options: {
  fallbackLabel: string
  fallbackUsed: boolean
  monitorTagName: string
  root: ParentNode
}): InventoryResult {
  const elements = collectElements(options.root, options.monitorTagName)
  const datavOwners = new Map<string, number>()
  const svgHotspots: PerformanceMonitorSvgHotspot[] = []
  const animationOwners = new Map<string, number>()
  const scope: PerformanceMonitorScope = {
    fallback: options.fallbackUsed,
    label: options.fallbackLabel,
    scannedRoots: 1,
  }
  const inventory = { ...defaultInventory }
  const canvas: PerformanceMonitorCanvasMetrics = {
    highDpr: 0,
    largestHeight: 0,
    largestWidth: 0,
    total: 0,
    totalPixels: 0,
  }
  const animation: PerformanceMonitorAnimationMetrics = {
    cssAnimations: 0,
    cssTransitions: 0,
    hotspots: [],
    running: 0,
    supported: typeof Element !== 'undefined' && 'getAnimations' in Element.prototype,
    total: 0,
    waapi: 0,
  }
  const svgMetrics: PerformanceMonitorSvgMetrics = {
    animations: 0,
    filters: 0,
    gradients: 0,
    hotspots: [],
    masks: 0,
    nodes: 0,
    total: 0,
  }
  const video: PerformanceMonitorVideoMetrics = {
    playing: 0,
    total: 0,
    visible: 0,
  }

  elements.forEach((element) => {
    const tagName = element.localName.toLowerCase()

    inventory.nodes += 1

    if (tagName.startsWith('dvk-')) {
      inventory.datav += 1
      increment(datavOwners, tagName, 1)
    }

    if (element.shadowRoot)
      scope.scannedRoots += 1

    if (tagName === 'canvas') {
      inventory.canvas += 1
      collectCanvasMetrics(element as HTMLCanvasElement, canvas)
    }
    else if (tagName === 'svg') {
      inventory.svg += 1
      collectSvgMetrics(element as SVGSVGElement, svgMetrics, svgHotspots)
    }
    else if (tagName === 'video') {
      inventory.videos += 1
      collectVideoMetrics(element as HTMLVideoElement, video)
    }

    collectElementAnimationMetrics(element, animation, animationOwners)
  })

  inventory.animations = svgMetrics.animations
  inventory.playingVideos = video.playing
  inventory.visibleVideos = video.visible
  canvas.total = inventory.canvas
  svgMetrics.total = inventory.svg
  svgMetrics.hotspots = topSvgHotspots(svgHotspots, 5)
  animation.hotspots = topCountHotspots(animationOwners, 5)

  return {
    animation,
    canvas,
    hotspots: {
      datav: topCountHotspots(datavOwners, 5),
      svg: svgMetrics.hotspots,
    },
    inventory,
    scope,
    svg: svgMetrics,
    video,
  }
}

function collectElements(root: ParentNode, monitorTagName: string): Element[] {
  const elements: Element[] = []
  const roots: ParentNode[] = [root]
  const visited = new Set<ParentNode>()

  for (let index = 0; index < roots.length; index += 1) {
    const currentRoot = roots[index]

    if (visited.has(currentRoot))
      continue

    visited.add(currentRoot)

    if (currentRoot instanceof Element && !isMonitorElement(currentRoot, monitorTagName))
      elements.push(currentRoot)

    const doc = currentRoot instanceof Document
      ? currentRoot
      : currentRoot.ownerDocument ?? document
    const walker = doc.createTreeWalker(currentRoot, NodeFilter.SHOW_ELEMENT)
    let node = walker.nextNode()

    while (node) {
      const element = node as Element

      if (!isMonitorElement(element, monitorTagName)) {
        elements.push(element)

        if (element.shadowRoot)
          roots.push(element.shadowRoot)
      }

      node = walker.nextNode()
    }
  }

  return elements
}

function collectCanvasMetrics(element: HTMLCanvasElement, metrics: PerformanceMonitorCanvasMetrics): void {
  const width = Math.max(element.width || 0, 0)
  const height = Math.max(element.height || 0, 0)
  const pixels = width * height
  const rect = element.getBoundingClientRect()
  const dprX = rect.width > 0 ? width / rect.width : 1
  const dprY = rect.height > 0 ? height / rect.height : 1

  metrics.totalPixels += pixels

  if (pixels > metrics.largestWidth * metrics.largestHeight) {
    metrics.largestWidth = width
    metrics.largestHeight = height
  }

  if (Math.max(dprX, dprY) > 1.5)
    metrics.highDpr += 1
}

function collectSvgMetrics(element: SVGSVGElement, metrics: PerformanceMonitorSvgMetrics, hotspots: PerformanceMonitorSvgHotspot[]): void {
  const nodes = element.querySelectorAll('*').length
  const animations = element.querySelectorAll('animate, animateTransform, animateMotion').length
  const filters = element.querySelectorAll('filter').length
  const gradients = element.querySelectorAll('linearGradient, radialGradient').length
  const masks = element.querySelectorAll('mask, clipPath').length

  metrics.nodes += nodes
  metrics.animations += animations
  metrics.filters += filters
  metrics.gradients += gradients
  metrics.masks += masks
  hotspots.push({
    animations,
    filters,
    gradients,
    masks,
    nodes,
    owner: resolveOwnerLabel(element),
  })
}

function collectVideoMetrics(element: HTMLVideoElement, metrics: PerformanceMonitorVideoMetrics): void {
  metrics.total += 1

  if (isVisible(element))
    metrics.visible += 1

  if (!element.paused && !element.ended)
    metrics.playing += 1
}

function collectElementAnimationMetrics(element: Element, metrics: PerformanceMonitorAnimationMetrics, owners: Map<string, number>): void {
  const getAnimations = (element as Element & {
    getAnimations?: () => Animation[]
  }).getAnimations

  if (!getAnimations)
    return

  getAnimations.call(element).forEach((animation) => {
    const type = animation.constructor.name

    metrics.total += 1

    if (animation.playState === 'running') {
      metrics.running += 1
      increment(owners, resolveOwnerLabel(element), 1)
    }

    if (type === 'CSSAnimation')
      metrics.cssAnimations += 1
    else if (type === 'CSSTransition')
      metrics.cssTransitions += 1
    else
      metrics.waapi += 1
  })
}

function isVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect()

  return rect.width > 0
    && rect.height > 0
    && rect.bottom >= 0
    && rect.right >= 0
    && rect.top <= window.innerHeight
    && rect.left <= window.innerWidth
}

function resolveOwnerLabel(element: Element): string {
  const datavOwner = findDatavOwner(element)

  if (datavOwner)
    return datavOwner

  return shortSelector(element)
}

function findDatavOwner(element: Element): string {
  let current: Element | null = element

  while (current) {
    const tagName = current.localName.toLowerCase()

    if (tagName.startsWith('dvk-'))
      return tagName

    current = current.parentElement
  }

  const root = element.getRootNode()

  if (root instanceof ShadowRoot && root.host)
    return findDatavOwner(root.host)

  return ''
}

function shortSelector(element: Element): string {
  const tagName = element.localName.toLowerCase()

  if (element.id)
    return `${tagName}#${element.id}`

  if (element.classList.length > 0)
    return `${tagName}.${[...element.classList].slice(0, 2).join('.')}`

  return tagName
}

function isMonitorElement(element: Element, monitorTagName: string): boolean {
  return element.localName.toLowerCase() === monitorTagName
}

function topCountHotspots(source: Map<string, number>, limit: number): PerformanceMonitorHotspot[] {
  return [...source.entries()]
    .map(([owner, count]) => ({ count, owner }))
    .sort((a, b) => b.count - a.count || a.owner.localeCompare(b.owner))
    .slice(0, limit)
}

function topSvgHotspots(source: PerformanceMonitorSvgHotspot[], limit: number): PerformanceMonitorSvgHotspot[] {
  return source
    .filter(item => item.nodes > 0 || item.animations > 0 || item.filters > 0 || item.gradients > 0 || item.masks > 0)
    .sort((a, b) => svgWeight(b) - svgWeight(a) || a.owner.localeCompare(b.owner))
    .slice(0, limit)
}

function svgWeight(item: PerformanceMonitorSvgHotspot): number {
  return item.nodes + item.animations * 5 + item.filters * 10 + item.gradients * 2 + item.masks * 3
}

function increment(source: Map<string, number>, key: string, amount: number): void {
  source.set(key, (source.get(key) ?? 0) + amount)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
