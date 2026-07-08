// @vitest-environment happy-dom
import type { CountToElement, Decoration5Element, Decoration6Element, Decoration7Element, Decoration8Element, Decoration9Element, Decoration10Element, Decoration11Element, FitScreenElement, LoadingEnergyElement, LoadingOrbitElement, PerformanceMonitorElement, Title1Element } from '../src/index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineBorderBox1, defineBorderBox2, defineBorderBox3, defineBorderBox4, defineBorderBox5, defineBorderBox6, defineBorderBox7, defineBorderBox8, defineBorderBox9, defineBorderBox10, defineBorderBox11, defineBorderBox12, defineBorderBox13, defineBorderBox14, defineBorderBox15, defineBorderBox16, defineCountTo, defineDecoration1, defineDecoration2, defineDecoration3, defineDecoration4, defineDecoration5, defineDecoration6, defineDecoration7, defineDecoration8, defineDecoration9, defineDecoration10, defineDecoration11, defineFitScreen, defineLoadingEnergy, defineLoadingOrbit, definePerformanceMonitor, defineTitle1, elementMetadata, register } from '../src/index'

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0]

const resizeCallbacks: ResizeObserverCallback[] = []

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback)
  }

  observe = vi.fn()
  disconnect = vi.fn()
}

function createCanvasContext(): CanvasRenderingContext2D {
  const gradient = {
    addColorStop: vi.fn(),
  }

  return {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    closePath: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn((_x: number, _y: number, width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
    })),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    restore: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    setLineDash: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private value = ''

  set src(value: string) {
    this.value = value
    this.onload?.()
  }

  get src(): string {
    return this.value
  }
}

class MockMediaRecorder {
  static isTypeSupported = vi.fn(() => true)

  ondataavailable: ((event: BlobEvent) => void) | null = null
  onerror: (() => void) | null = null
  onstop: (() => void) | null = null

  start = vi.fn()

  stop = vi.fn(() => {
    this.ondataavailable?.({
      data: new Blob(['webm'], { type: 'video/webm' }),
    } as BlobEvent)
    this.onstop?.()
  })
}

function createCanvasStream(): MediaStream {
  return {
    getTracks: vi.fn(() => [{ stop: vi.fn() }]),
    getVideoTracks: vi.fn(() => [{ requestFrame: vi.fn() }]),
  } as unknown as MediaStream
}

function createPointerEvent(type: string, options: {
  button?: number
  clientX: number
  clientY: number
  pointerId?: number
}): PointerEvent {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
  }) as PointerEvent

  Object.defineProperties(event, {
    button: { value: options.button ?? 0 },
    clientX: { value: options.clientX },
    clientY: { value: options.clientY },
    pointerId: { value: options.pointerId ?? 1 },
  })

  return event
}

function emitResize(width: number, height: number): void {
  resizeCallbacks.at(-1)?.([
    {
      contentRect: {
        width,
        height,
      },
    } as ResizeObserverEntry,
  ], {} as ResizeObserver)
}

function latestDetail(listener: ReturnType<typeof vi.fn>): Record<string, number> {
  return listener.mock.calls.at(-1)?.[0].detail
}

function extractPathPoints(path: string): Array<{ x: number, y: number }> {
  const numbers = [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map(match => Number(match[0]))
  const points: Array<{ x: number, y: number }> = []

  for (let index = 0; index < numbers.length; index += 2) {
    points.push({
      x: numbers[index],
      y: numbers[index + 1],
    })
  }

  return points
}

function segmentDelta(from: { x: number, y: number }, to: { x: number, y: number }): { dx: number, dy: number } {
  return {
    dx: Math.abs(to.x - from.x),
    dy: Math.abs(to.y - from.y),
  }
}

describe('@datav-kit/elements', () => {
  beforeEach(() => {
    resizeCallbacks.length = 0
    vi.stubGlobal('ResizeObserver', MockResizeObserver)
  })

  afterEach(() => {
    document.body.replaceChildren()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('exposes MVP metadata and registers elements once', () => {
    expect(elementMetadata.map(meta => meta.tagName)).toEqual([
      'dvk-fit-screen',
      'dvk-border-box-1',
      'dvk-border-box-2',
      'dvk-border-box-3',
      'dvk-border-box-4',
      'dvk-border-box-5',
      'dvk-border-box-6',
      'dvk-border-box-7',
      'dvk-border-box-8',
      'dvk-border-box-9',
      'dvk-border-box-10',
      'dvk-border-box-11',
      'dvk-border-box-12',
      'dvk-border-box-13',
      'dvk-border-box-14',
      'dvk-border-box-15',
      'dvk-border-box-16',
      'dvk-decoration-1',
      'dvk-decoration-2',
      'dvk-decoration-3',
      'dvk-decoration-4',
      'dvk-decoration-5',
      'dvk-decoration-6',
      'dvk-decoration-7',
      'dvk-decoration-8',
      'dvk-decoration-9',
      'dvk-decoration-10',
      'dvk-decoration-11',
      'dvk-title-1',
      'dvk-count-to',
      'dvk-loading-orbit',
      'dvk-loading-energy',
      'dvk-performance-monitor',
    ])

    const first = register()
    const second = register()

    expect(first.defined).toEqual(expect.arrayContaining(['dvk-fit-screen', 'dvk-border-box-1', 'dvk-border-box-2', 'dvk-border-box-3', 'dvk-border-box-4', 'dvk-border-box-5', 'dvk-border-box-6', 'dvk-border-box-7', 'dvk-border-box-8', 'dvk-border-box-9', 'dvk-border-box-10', 'dvk-border-box-11', 'dvk-border-box-12', 'dvk-border-box-13', 'dvk-border-box-14', 'dvk-border-box-15', 'dvk-border-box-16', 'dvk-decoration-1', 'dvk-decoration-2', 'dvk-decoration-3', 'dvk-decoration-4', 'dvk-decoration-5', 'dvk-decoration-6', 'dvk-decoration-7', 'dvk-decoration-8', 'dvk-decoration-9', 'dvk-decoration-10', 'dvk-decoration-11', 'dvk-title-1', 'dvk-count-to', 'dvk-loading-orbit', 'dvk-loading-energy', 'dvk-performance-monitor']))
    expect(second.skipped).toEqual(expect.arrayContaining(['dvk-fit-screen', 'dvk-border-box-1', 'dvk-border-box-2', 'dvk-border-box-3', 'dvk-border-box-4', 'dvk-border-box-5', 'dvk-border-box-6', 'dvk-border-box-7', 'dvk-border-box-8', 'dvk-border-box-9', 'dvk-border-box-10', 'dvk-border-box-11', 'dvk-border-box-12', 'dvk-border-box-13', 'dvk-border-box-14', 'dvk-border-box-15', 'dvk-border-box-16', 'dvk-decoration-1', 'dvk-decoration-2', 'dvk-decoration-3', 'dvk-decoration-4', 'dvk-decoration-5', 'dvk-decoration-6', 'dvk-decoration-7', 'dvk-decoration-8', 'dvk-decoration-9', 'dvk-decoration-10', 'dvk-decoration-11', 'dvk-title-1', 'dvk-count-to', 'dvk-loading-orbit', 'dvk-loading-energy', 'dvk-performance-monitor']))
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-2')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-2')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-2')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-2')?.props).not.toHaveProperty('autoHeight')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-3')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-3')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-3')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-3')?.props).not.toHaveProperty('autoHeight')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-4')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-4')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-4')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-4')?.props).not.toHaveProperty('autoHeight')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-5')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-5')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-5')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-6')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-6')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-6')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-7')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-7')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-7')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-8')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-8')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-8')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-9')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-9')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-9')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-10')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-10')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-10')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-11')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-11')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-11')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-12')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-12')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-12')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-13')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-13')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-13')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-14')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-14')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-14')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-15')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-15')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-15')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-16')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-16')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dvk-border-box-16')?.props).not.toHaveProperty('viewBox')
  })

  it('supports single-element registration helpers', () => {
    expect(defineFitScreen()).toBe(false)
    expect(defineBorderBox1()).toBe(false)
    expect(defineBorderBox2()).toBe(false)
    expect(defineBorderBox3()).toBe(false)
    expect(defineBorderBox4()).toBe(false)
    expect(defineBorderBox5()).toBe(false)
    expect(defineBorderBox6()).toBe(false)
    expect(defineBorderBox7()).toBe(false)
    expect(defineBorderBox8()).toBe(false)
    expect(defineBorderBox9()).toBe(false)
    expect(defineBorderBox10()).toBe(false)
    expect(defineBorderBox11()).toBe(false)
    expect(defineBorderBox12()).toBe(false)
    expect(defineBorderBox13()).toBe(false)
    expect(defineBorderBox14()).toBe(false)
    expect(defineBorderBox15()).toBe(false)
    expect(defineBorderBox16()).toBe(false)
    expect(defineDecoration1()).toBe(false)
    expect(defineDecoration2()).toBe(false)
    expect(defineDecoration3()).toBe(false)
    expect(defineDecoration4()).toBe(false)
    expect(defineDecoration5()).toBe(false)
    expect(defineDecoration6()).toBe(false)
    expect(defineDecoration7()).toBe(false)
    expect(defineDecoration8()).toBe(false)
    expect(defineDecoration9()).toBe(false)
    expect(defineDecoration10()).toBe(false)
    expect(defineDecoration11()).toBe(false)
    expect(defineTitle1()).toBe(false)
    expect(defineCountTo()).toBe(false)
    expect(defineLoadingOrbit()).toBe(false)
    expect(defineLoadingEnergy()).toBe(false)
    expect(definePerformanceMonitor()).toBe(false)
  })

  it('renders performance monitor as a disabled tool when enabled is false', async () => {
    register()

    const element = document.createElement('dvk-performance-monitor') as PerformanceMonitorElement
    element.setAttribute('enabled', 'false')
    document.body.append(element)

    await element.updateComplete

    expect(element.enabled).toBe(false)
    expect(element.shadowRoot?.textContent).toContain('disabled')
  })

  it('collects scoped performance inventory and excludes monitor instances', async () => {
    register()

    const target = document.createElement('section')
    target.id = 'screen-root'
    const datav = document.createElement('dvk-test-widget')
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    const canvas = document.createElement('canvas')

    canvas.width = 3840
    canvas.height = 2160
    svg.append(animate)
    datav.append(svg)
    target.append(datav, canvas)
    document.body.append(target)

    const element = document.createElement('dvk-performance-monitor') as PerformanceMonitorElement
    element.targetElement = target
    document.body.append(element)
    element.refresh()

    await element.updateComplete

    const snapshot = element.getSnapshot()

    expect(snapshot.inventory.datav).toBe(1)
    expect(snapshot.inventory.svg).toBe(1)
    expect(snapshot.inventory.animations).toBe(1)
    expect(snapshot.canvas.largestWidth).toBe(3840)
    expect(snapshot.canvas.largestHeight).toBe(2160)
    expect(snapshot.hotspots.datav).toEqual([{ owner: 'dvk-test-widget', count: 1 }])
    expect(snapshot.hotspots.datav.find(item => item.owner === 'dvk-performance-monitor')).toBeUndefined()
  })

  it('allows overlay performance monitor to be dragged and reset', async () => {
    register()

    const element = document.createElement('dvk-performance-monitor') as PerformanceMonitorElement
    element.setAttribute('enabled', 'false')
    document.body.append(element)
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      bottom: 110,
      height: 100,
      left: 10,
      right: 300,
      top: 10,
      width: 290,
      x: 10,
      y: 10,
      toJSON: () => ({}),
    } as DOMRect)

    await element.updateComplete

    const header = element.shadowRoot?.querySelector('.header')

    header?.dispatchEvent(createPointerEvent('pointerdown', { clientX: 20, clientY: 30 }))
    window.dispatchEvent(createPointerEvent('pointermove', { clientX: 120, clientY: 150 }))
    window.dispatchEvent(createPointerEvent('pointerup', { clientX: 120, clientY: 150 }))

    expect(element.style.left).toBe('110px')
    expect(element.style.top).toBe('130px')
    expect(element.style.right).toBe('auto')
    expect(element.style.bottom).toBe('auto')

    element.resetPosition()

    expect(element.style.left).toBe('')
    expect(element.style.top).toBe('')
    expect(element.style.right).toBe('')
    expect(element.style.bottom).toBe('')
  })

  it('renders decoration-5 with DataV Decoration8 coordinates and reverse mode', async () => {
    register()

    const element = document.createElement('dvk-decoration-5') as Decoration5Element
    element.setAttribute('reverse', '')
    element.setAttribute('colors', '#111,#222')
    document.body.append(element)

    emitResize(360, 40)
    await element.updateComplete

    const lines = [...element.shadowRoot?.querySelectorAll('polyline') ?? []]

    expect(lines).toHaveLength(3)
    expect(lines[0].getAttribute('points')).toBe('360,0 330,20')
    expect(lines[1].getAttribute('points')).toBe('340,0 310,20 0,20')
    expect(lines[2].getAttribute('points')).toBe('360,37 160,37')
    expect(lines[0].getAttribute('stroke')).toBe('#111')
    expect(lines[2].getAttribute('stroke')).toBe('#222')
  })

  it('renders decoration-6 as a reversible HUD rail', async () => {
    register()

    const element = document.createElement('dvk-decoration-6') as Decoration6Element
    element.setAttribute('reverse', '')
    element.setAttribute('colors', '#18f0ff,#2b7cff,#e6fdff')
    document.body.append(element)

    emitResize(360, 48)
    await element.updateComplete

    const lines = [...element.shadowRoot?.querySelectorAll('[part~="main-line"]') ?? []]
    const nodes = [...element.shadowRoot?.querySelectorAll('circle') ?? []]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(lines).toHaveLength(3)
    expect(lines[0].getAttribute('points')).toBe('354.24,29.76 333.12,29.76 319.68,18.24 287.04,18.24 264,24.96')
    expect(lines[1].getAttribute('points')).toBe('252,24.96 187.2,24.96')
    expect(lines[2].getAttribute('points')).toBe('165.6,24.96 8,24.96')
    expect(nodes[0].getAttribute('cx')).toBe('264')
    expect(nodes[0].getAttribute('cy')).toBe('24.96')
    expect(stops[0].getAttribute('stop-color')).toBe('#e6fdff')
    expect(stops[1].getAttribute('stop-color')).toBe('#18f0ff')
    expect(stops[2].getAttribute('stop-color')).toBe('#2b7cff')
  })

  it('renders decoration-7 as a reversible glass ribbon', async () => {
    register()

    const element = document.createElement('dvk-decoration-7') as Decoration7Element
    element.setAttribute('reverse', '')
    element.setAttribute('colors', '#9febff,#22d3ee,#8b5cff')
    document.body.append(element)

    emitResize(400, 80)
    await element.updateComplete

    const ribbon = element.shadowRoot?.querySelector('[part="ribbon"]')
    const slices = [...element.shadowRoot?.querySelectorAll('[part="slice"]') ?? []]
    const particles = [...element.shadowRoot?.querySelectorAll('[part="particle"] circle') ?? []]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(ribbon?.getAttribute('d')).toContain('M 390,52.8 C 344,33.6 284,31.2 224,44')
    expect(slices).toHaveLength(4)
    expect(particles).toHaveLength(8)
    expect(stops[0].getAttribute('stop-color')).toBe('#22d3ee')
    expect(stops[1].getAttribute('stop-color')).toBe('#9febff')
    expect(stops[3].getAttribute('stop-color')).toBe('#8b5cff')
  })

  it('renders decoration-8 as a futuristic HUD energy ring', async () => {
    register()

    const element = document.createElement('dvk-decoration-8') as Decoration8Element
    element.setAttribute('colors', '#111,#222')
    element.setAttribute('dur', '4')
    element.setAttribute('paused', '')
    document.body.append(element)

    emitResize(180, 120)
    await element.updateComplete

    const rings = [...element.shadowRoot?.querySelectorAll('[part~="ring"]') ?? []]
    const guides = [...element.shadowRoot?.querySelectorAll('[part~="guide-ring"]') ?? []]
    const ticks = [...element.shadowRoot?.querySelectorAll('[part~="tick"]') ?? []]
    const blocks = [...element.shadowRoot?.querySelectorAll('[part="energy-block"]') ?? []]
    const microLights = [...element.shadowRoot?.querySelectorAll('[part="micro-light"]') ?? []]
    const animations = [...element.shadowRoot?.querySelectorAll('animateTransform') ?? []]
    const svg = element.shadowRoot?.querySelector('svg')
    const outerArc = element.shadowRoot?.querySelector('[part="ring outer-ring"]')
    const outerTrace = element.shadowRoot?.querySelector('[part="ring outer-trace"]')
    const innerArc = element.shadowRoot?.querySelector('[part="ring inner-ring"]')
    const coreCircles = [...element.shadowRoot?.querySelectorAll('[part="core"] circle') ?? []]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(svg?.getAttribute('width')).toBe('100')
    expect(svg?.getAttribute('height')).toBe('100')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 100 100')
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(rings).toHaveLength(17)
    expect(outerArc?.getAttribute('d')).toBe('M 22.788 15.17 A 44.2 44.2 0 0 0 5.908 53.083')
    expect(outerArc?.getAttribute('stroke')).toContain('dvk-decoration-8-arc-')
    expect(outerArc?.getAttribute('stroke-width')).toBe('5.9')
    expect(outerTrace?.getAttribute('d')).toBe('M 34.978 12.82 A 40.1 40.1 0 0 0 27.576 16.756')
    expect(outerTrace?.getAttribute('stroke-width')).toBe('1.5')
    expect(innerArc?.getAttribute('stroke')).toBe('#111')
    expect(innerArc?.getAttribute('stroke-width')).toBe('1.8')
    expect(guides.map(guide => guide.getAttribute('r'))).toEqual(['39.3', '28.8', '21.3'])
    expect(guides[0].getAttribute('stroke')).toBe('rgba(34, 34, 34, 0.42)')
    expect(ticks).toHaveLength(96)
    expect(blocks).toHaveLength(32)
    expect(microLights).toHaveLength(48)
    expect(coreCircles.at(-1)?.getAttribute('fill')).toBe('rgba(2, 8, 20, 0.92)')
    expect(stops[4].getAttribute('stop-color')).toBe('#222')
    expect(stops[5].getAttribute('stop-color')).toBe('#111')
    expect(animations).toHaveLength(0)
  })

  it('rasterizes decoration-8 animation to a webm video and keeps slot content', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    const revokeObjectURL = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'captureStream').mockReturnValue(createCanvasStream())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    })
    register()

    const element = document.createElement('dvk-decoration-8') as Decoration8Element
    const rasterError = vi.fn()
    element.setAttribute('colors', '#51f0d0,#2b74ff')
    element.setAttribute('dur', '5')
    element.setAttribute('raster-renderer', 'video')
    element.innerHTML = '<span>98</span>'
    element.addEventListener('dvk-raster-error', rasterError)
    document.body.append(element)

    emitResize(180, 180)
    await element.updateComplete
    await vi.runAllTimersAsync()
    await element.updateComplete

    const video = element.shadowRoot?.querySelector('video')
    const content = element.shadowRoot?.querySelector('[part="content"]')

    expect(rasterError).not.toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'video/webm;codecs=vp9' }))
    expect(video?.getAttribute('src')).toContain('blob:video/webm')
    expect(video?.getAttribute('part')).toBe('graphic raster')
    expect(video?.hasAttribute('loop')).toBe(true)
    expect(video?.hasAttribute('muted')).toBe(true)
    expect(content).not.toBeNull()
    expect(element.shadowRoot?.querySelector('svg')).toBeNull()
    expect(revokeObjectURL).toHaveBeenCalled()
  }, 15000)

  it('rasterizes decoration-8 animation to a PNG sprite by default', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(new Blob(['png'], { type: 'image/png' }))
    })
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    })
    register()

    const element = document.createElement('dvk-decoration-8') as Decoration8Element
    element.setAttribute('colors', '#72ffee,#336dff')
    element.setAttribute('dur', '5')
    document.body.append(element)

    emitResize(180, 180)
    await element.updateComplete
    await vi.runAllTimersAsync()
    await element.updateComplete

    const sprite = element.shadowRoot?.querySelector('canvas.raster-sprite-canvas')
    const content = element.shadowRoot?.querySelector('[part="content"]')
    const pngBlobCalls = createObjectURL.mock.calls
      .filter(([blob]) => blob instanceof Blob && blob.type === 'image/png')

    expect(element).toHaveProperty('rasterRenderer', 'sprite')
    expect(pngBlobCalls).toHaveLength(5)
    expect(sprite?.getAttribute('part')).toBe('graphic raster')
    expect(sprite?.getAttribute('width')).toBeTruthy()
    expect(sprite?.getAttribute('height')).toBeTruthy()
    expect(content).not.toBeNull()
    expect(element.shadowRoot?.querySelector('video')).toBeNull()
    expect(element.shadowRoot?.querySelector('svg')).toBeNull()
  }, 15000)

  it('shares one decoration-8 rasterization across matching instances', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    vi.spyOn(HTMLCanvasElement.prototype, 'captureStream').mockReturnValue(createCanvasStream())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    })
    register()

    const first = document.createElement('dvk-decoration-8') as Decoration8Element
    first.setAttribute('colors', '#44f5ff,#447cff')
    first.setAttribute('dur', '5')
    first.setAttribute('raster-renderer', 'video')
    document.body.append(first)
    emitResize(180, 180)
    await first.updateComplete

    const second = document.createElement('dvk-decoration-8') as Decoration8Element
    second.setAttribute('colors', '#44f5ff,#447cff')
    second.setAttribute('dur', '5')
    second.setAttribute('raster-renderer', 'video')
    document.body.append(second)
    emitResize(180, 180)
    await second.updateComplete

    await vi.runAllTimersAsync()
    await first.updateComplete
    await second.updateComplete

    const firstVideo = first.shadowRoot?.querySelector('video')
    const secondVideo = second.shadowRoot?.querySelector('video')
    const videoBlobCalls = createObjectURL.mock.calls
      .filter(([blob]) => blob instanceof Blob && blob.type === 'video/webm;codecs=vp9')

    expect(videoBlobCalls).toHaveLength(1)
    expect(firstVideo?.getAttribute('src')).toBe(secondVideo?.getAttribute('src'))
  }, 15000)

  it('renders decoration-9 as a reversible enterprise HUD rail', async () => {
    register()

    const element = document.createElement('dvk-decoration-9') as Decoration9Element
    element.setAttribute('reverse', '')
    element.setAttribute('colors', '#18f0ff,#2b7cff,#60e7ff')
    document.body.append(element)

    emitResize(480, 54)
    await element.updateComplete

    const lines = [...element.shadowRoot?.querySelectorAll('[part~="line"]') ?? []]
    const cornerLines = [...element.shadowRoot?.querySelectorAll('[part~="corner-line"]') ?? []]
    const ticks = [...element.shadowRoot?.querySelectorAll('[part~="tick"]') ?? []]
    const blocks = [...element.shadowRoot?.querySelectorAll('[part~="block"]') ?? []]
    const firstBlock = blocks[0]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(lines).toHaveLength(4)
    expect(cornerLines).toHaveLength(3)
    expect(ticks).toHaveLength(3)
    expect(blocks).toHaveLength(2)
    expect(lines[0].getAttribute('x1')).toBe('465.6')
    expect(lines[0].getAttribute('x2')).toBe('340.8')
    expect(lines[0].getAttribute('y1')).toBe('27')
    expect(ticks[0].getAttribute('x1')).toBe('328.8')
    expect(ticks[0].getAttribute('x2')).toBe('314.4')
    expect(cornerLines[1].getAttribute('points')).toBe('244.8,35.64 211.2,35.64 194.4,27')
    expect(firstBlock?.getAttribute('points')).toBe('392.64,11.34 360,11.34 365.76,17.01 398.4,17.01')
    expect(stops[6].getAttribute('stop-color')).toBe('#2b7cff')
    expect(stops[12].getAttribute('stop-color')).toBe('#60e7ff')
  })

  it('renders title-1 as a symmetric futuristic header banner', async () => {
    register()

    const element = document.createElement('dvk-title-1') as Title1Element
    element.setAttribute('colors', '#76f6ff,#2f8cff,#52f0b5')
    element.setAttribute('title-text', 'SMART COCKPIT')
    document.body.append(element)

    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const sides = [...element.shadowRoot?.querySelectorAll('[part~="side"]') ?? []]
    const rightSide = element.shadowRoot?.querySelector('[part~="right-side"]')
    const titlePanel = element.shadowRoot?.querySelector('[part="title-panel"]')
    const titleText = element.shadowRoot?.querySelector('[part="title-text"]')
    const sideSurfaces = [...element.shadowRoot?.querySelectorAll('[part="side-surface"]') ?? []]
    const rails = [...element.shadowRoot?.querySelectorAll('[part~="rail"]') ?? []]
    const surfaceAccents = [...element.shadowRoot?.querySelectorAll('[part="surface-accent"]') ?? []]
    const centerEdges = [...element.shadowRoot?.querySelectorAll('[part="center-edge"]') ?? []]
    const animations = [...element.shadowRoot?.querySelectorAll('animate, animateTransform') ?? []]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(svg?.getAttribute('viewBox')).toBe('0 0 1200 72')
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('none')
    expect(sides).toHaveLength(2)
    expect(rightSide?.getAttribute('transform')).toBe('translate(1200 0) scale(-1 1)')
    expect(titlePanel?.getAttribute('points')).toBe('286,36 340,13 860,13 914,36 860,59 340,59')
    expect(titleText?.textContent).toBe('SMART COCKPIT')
    expect(sideSurfaces).toHaveLength(2)
    expect(sideSurfaces[0]?.getAttribute('points')).toBe('0,13 306,13 370,36 306,59 0,59')
    expect(rails).toHaveLength(4)
    expect(surfaceAccents).toHaveLength(2)
    expect(centerEdges).toHaveLength(1)
    expect(stops.map(stop => stop.getAttribute('stop-color'))).toEqual(expect.arrayContaining(['#76f6ff', '#2f8cff', '#52f0b5']))
    expect(animations).toHaveLength(0)
  })

  it('renders decoration-10 as a futuristic radar HUD', async () => {
    register()

    const element = document.createElement('dvk-decoration-10') as Decoration10Element
    element.setAttribute('colors', '#66f5ff,#2f8cff,#a688ff')
    element.setAttribute('dur', '12')
    element.setAttribute('paused', '')
    document.body.append(element)

    emitResize(240, 240)
    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const background = element.shadowRoot?.querySelector('[part="background"]')
    const grid = element.shadowRoot?.querySelector('[part="grid"]')
    const rings = [...element.shadowRoot?.querySelectorAll('[part~="ring"]') ?? []]
    const ticks = [...element.shadowRoot?.querySelectorAll('[part="tick"]') ?? []]
    const radialLines = [...element.shadowRoot?.querySelectorAll('[part="radial-line"]') ?? []]
    const targets = [...element.shadowRoot?.querySelectorAll('[part="target"]') ?? []]
    const particles = [...element.shadowRoot?.querySelectorAll('[part="particle"]') ?? []]
    const dataLines = [...element.shadowRoot?.querySelectorAll('[part="data-line"]') ?? []]
    const scanBeam = element.shadowRoot?.querySelector('[part="scan-beam"]')
    const scanEdge = element.shadowRoot?.querySelector('[part="scan-edge"]')
    const centerPulse = element.shadowRoot?.querySelector('[part="center-pulse"]')
    const animations = [...element.shadowRoot?.querySelectorAll('animate, animateTransform') ?? []]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(svg?.getAttribute('width')).toBe('120')
    expect(svg?.getAttribute('height')).toBe('120')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 120 120')
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(background).toBeNull()
    expect(grid?.getAttribute('fill')).toContain('dvk-decoration-10-grid-')
    expect(rings).toHaveLength(18)
    expect(ticks).toHaveLength(120)
    expect(radialLines).toHaveLength(24)
    expect(targets).toHaveLength(5)
    expect(particles).toHaveLength(42)
    expect(dataLines).toHaveLength(6)
    expect(scanBeam?.getAttribute('d')).toBe('M 60.803 57.527 L 75.204 13.208 A 49.2 49.2 0 0 1 103.441 36.902 L 62.296 58.779 A 2.6 2.6 0 0 0 60.803 57.527 Z')
    expect(scanEdge?.getAttribute('stroke')).toBe('#66f5ff')
    expect(centerPulse?.getAttribute('fill')).toBe('#66f5ff')
    expect(stops.map(stop => stop.getAttribute('stop-color'))).toEqual(expect.arrayContaining(['#2f8cff', '#66f5ff', '#a688ff']))
    expect(animations).toHaveLength(0)
  })

  it('rasterizes decoration-10 animation to a webm video and replaces SVG', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    const revokeObjectURL = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'captureStream').mockReturnValue(createCanvasStream())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    })
    register()

    const element = document.createElement('dvk-decoration-10') as Decoration10Element
    const rasterError = vi.fn()
    element.setAttribute('colors', '#61f7ff,#2c91ff,#b390ff')
    element.setAttribute('dur', '6')
    element.setAttribute('raster-renderer', 'video')
    element.addEventListener('dvk-raster-error', rasterError)
    document.body.append(element)

    emitResize(240, 240)
    await element.updateComplete
    await vi.runAllTimersAsync()
    await element.updateComplete

    const video = element.shadowRoot?.querySelector('video')
    const content = element.shadowRoot?.querySelector('[part="content"]')

    expect(rasterError).not.toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'video/webm;codecs=vp9' }))
    expect(video?.getAttribute('src')).toContain('blob:video/webm')
    expect(video?.getAttribute('part')).toBe('graphic raster')
    expect(video?.hasAttribute('loop')).toBe(true)
    expect(video?.hasAttribute('muted')).toBe(true)
    expect(content).not.toBeNull()
    expect(element.shadowRoot?.querySelector('svg')).toBeNull()
    expect(revokeObjectURL).toHaveBeenCalled()
  }, 15000)

  it('rasterizes decoration-10 animation to a PNG sprite by default', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(new Blob(['png'], { type: 'image/png' }))
    })
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    })
    register()

    const element = document.createElement('dvk-decoration-10') as Decoration10Element
    element.setAttribute('colors', '#6ffaff,#318cff,#ad88ff')
    element.setAttribute('dur', '6')
    document.body.append(element)

    emitResize(240, 240)
    await element.updateComplete
    await vi.runAllTimersAsync()
    await element.updateComplete

    const sprite = element.shadowRoot?.querySelector('canvas.raster-sprite-canvas')
    const content = element.shadowRoot?.querySelector('[part="content"]')
    const pngBlobCalls = createObjectURL.mock.calls
      .filter(([blob]) => blob instanceof Blob && blob.type === 'image/png')

    expect(element).toHaveProperty('rasterRenderer', 'sprite')
    expect(pngBlobCalls).toHaveLength(1)
    expect(sprite?.getAttribute('part')).toBe('graphic raster')
    expect(sprite?.getAttribute('width')).toBeTruthy()
    expect(sprite?.getAttribute('height')).toBeTruthy()
    expect(content).not.toBeNull()
    expect(element.shadowRoot?.querySelector('video')).toBeNull()
    expect(element.shadowRoot?.querySelector('svg')).toBeNull()
  }, 15000)

  it('shares one decoration-10 rasterization across matching instances', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    vi.spyOn(HTMLCanvasElement.prototype, 'captureStream').mockReturnValue(createCanvasStream())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    })
    register()

    const first = document.createElement('dvk-decoration-10') as Decoration10Element
    first.setAttribute('colors', '#49f8ff,#3d89ff,#b58cff')
    first.setAttribute('dur', '6')
    first.setAttribute('raster-renderer', 'video')
    document.body.append(first)
    emitResize(240, 240)
    await first.updateComplete

    const second = document.createElement('dvk-decoration-10') as Decoration10Element
    second.setAttribute('colors', '#49f8ff,#3d89ff,#b58cff')
    second.setAttribute('dur', '6')
    second.setAttribute('raster-renderer', 'video')
    document.body.append(second)
    emitResize(240, 240)
    await second.updateComplete

    await vi.runAllTimersAsync()
    await first.updateComplete
    await second.updateComplete

    const firstVideo = first.shadowRoot?.querySelector('video')
    const secondVideo = second.shadowRoot?.querySelector('video')
    const videoBlobCalls = createObjectURL.mock.calls
      .filter(([blob]) => blob instanceof Blob && blob.type === 'video/webm;codecs=vp9')

    expect(videoBlobCalls).toHaveLength(1)
    expect(firstVideo?.getAttribute('src')).toBe(secondVideo?.getAttribute('src'))
  }, 15000)

  it('renders decoration-11 as a subtly raised floating cyber halo', async () => {
    register()

    const element = document.createElement('dvk-decoration-11') as Decoration11Element
    element.setAttribute('colors', '#66f5ff,#2f8cff,#ffe69c')
    element.setAttribute('dur', '20')
    element.setAttribute('paused', '')
    document.body.append(element)

    emitResize(320, 240)
    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const groundGlow = element.shadowRoot?.querySelector('[part="ground-glow"]')
    const liftShadow = element.shadowRoot?.querySelector('[part="lift-shadow"]')
    const layers = [...element.shadowRoot?.querySelectorAll('[part~="lift-layer"]') ?? []]
    const rings = [...element.shadowRoot?.querySelectorAll('[part~="ring"]') ?? []]
    const bridgeLines = [...element.shadowRoot?.querySelectorAll('[part="bridge-line"]') ?? []]
    const ticks = [...element.shadowRoot?.querySelectorAll('[part~="tick"]') ?? []]
    const particleGuide = element.shadowRoot?.querySelector('[part="ring guide-ring particle-guide"]')
    const thickGuide = element.shadowRoot?.querySelector('[part="ring guide-ring thick-glow-ring"]')
    const thickBright = element.shadowRoot?.querySelector('[part="ring bright-ring thick-glow-ring"]')
    const thickArcOverlays = [...element.shadowRoot?.querySelectorAll('[part~="outer-bright"]') ?? []]
    const audioBars = [...element.shadowRoot?.querySelectorAll('[part~="audio-bar"]') ?? []]
    const scaleTicks = [...element.shadowRoot?.querySelectorAll('[part~="scale-tick"]') ?? []]
    const segmentBlocks = [...element.shadowRoot?.querySelectorAll('[part~="segment-block"]') ?? []]
    const segmentArcs = [...element.shadowRoot?.querySelectorAll('[part~="segment-arc"]') ?? []]
    const particles = [...element.shadowRoot?.querySelectorAll('[part~="particle"]') ?? []]
    const triangleIndicators = [...element.shadowRoot?.querySelectorAll('[part="triangle-indicator"]') ?? []]
    const triangleFrames = [...element.shadowRoot?.querySelectorAll('[part="triangle-indicator"] polygon') ?? []]
    const frontGlows = [...element.shadowRoot?.querySelectorAll('[part~="front-glow"]') ?? []]
    const platformFills = [...element.shadowRoot?.querySelectorAll('[part="platform-fill"]') ?? []]
    const coreDisc = element.shadowRoot?.querySelector('[part~="core-disc"]')
    const cleanRings = [...element.shadowRoot?.querySelectorAll('[part~="clean-ring"]') ?? []]
    const coreGuides = [...element.shadowRoot?.querySelectorAll('[part~="core-guide"]') ?? []]
    const dashedRing = element.shadowRoot?.querySelector('[part="ring guide-ring dashed-ring"]')
    const voidRims = [...element.shadowRoot?.querySelectorAll('[part="void-rim"]') ?? []]
    const content = element.shadowRoot?.querySelector('[part="content"]')
    const animations = [...element.shadowRoot?.querySelectorAll('animate, animateTransform') ?? []]
    const stops = [...element.shadowRoot?.querySelectorAll('linearGradient stop') ?? []]

    expect(svg?.getAttribute('width')).toBe('160')
    expect(svg?.getAttribute('height')).toBe('120')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 160 120')
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(groundGlow).toBeNull()
    expect(liftShadow).toBeNull()
    expect(layers.map(layer => layer.getAttribute('transform'))).toEqual([
      'translate(80 70.6) scale(1 0.42)',
      'translate(80 70.6) scale(1 0.42)',
      'translate(80 68.2) scale(1 0.42)',
      'translate(80 65.8) scale(1 0.42)',
      'translate(80 63.4) scale(1 0.42)',
      'translate(80 60.8) scale(1 0.42)',
    ])
    expect(rings.length).toBeGreaterThan(40)
    expect(bridgeLines).toHaveLength(4)
    expect(ticks).toHaveLength(96)
    expect(particleGuide?.getAttribute('r')).toBe('63.2')
    expect(thickGuide?.getAttribute('stroke')).toBe('rgba(174, 239, 255, 0.34)')
    expect(thickGuide?.getAttribute('stroke-width')).toBe('9.3')
    expect(thickBright?.getAttribute('stroke')).toBe('#aeefff')
    expect(thickBright?.getAttribute('stroke-width')).toBe('5.7')
    expect(thickArcOverlays).toHaveLength(0)
    expect(audioBars).toHaveLength(144)
    expect(audioBars.every(bar => bar.tagName.toLowerCase() === 'rect')).toBe(true)
    expect(scaleTicks).toHaveLength(96)
    expect(segmentBlocks).toHaveLength(32)
    expect(segmentArcs).toHaveLength(32)
    expect(particles).toHaveLength(144)
    expect(triangleIndicators).toHaveLength(4)
    expect(triangleFrames).toHaveLength(4)
    expect(triangleFrames.every(frame => frame.getAttribute('fill') === 'transparent')).toBe(true)
    expect(triangleFrames.every(frame => frame.getAttribute('points') === '0 2.05 1.8 -1.45 -1.8 -1.45')).toBe(true)
    expect(frontGlows).toHaveLength(0)
    expect(platformFills).toHaveLength(0)
    expect(coreDisc).toBeNull()
    expect(cleanRings).toHaveLength(0)
    expect(dashedRing?.getAttribute('r')).toBe('32.2')
    expect(dashedRing?.getAttribute('stroke-dasharray')).toBe('2.8, 4.6')
    expect(coreGuides).toHaveLength(0)
    expect(voidRims).toHaveLength(0)
    expect(content).toBeNull()
    expect(stops.map(stop => stop.getAttribute('stop-color'))).toEqual(expect.arrayContaining(['#66f5ff', '#2f8cff', '#ffe69c']))
    expect(animations).toHaveLength(0)
  })

  it('rasterizes decoration-11 animation to a webm video and replaces SVG', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    const revokeObjectURL = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'captureStream').mockReturnValue(createCanvasStream())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    })
    register()

    const element = document.createElement('dvk-decoration-11') as Decoration11Element
    const rasterError = vi.fn()
    element.setAttribute('colors', '#66f5ff,#2f8cff,#ffe69c')
    element.setAttribute('dur', '6')
    element.setAttribute('raster-renderer', 'video')
    element.addEventListener('dvk-raster-error', rasterError)
    document.body.append(element)

    emitResize(320, 240)
    await element.updateComplete
    await vi.runAllTimersAsync()
    await element.updateComplete

    const video = element.shadowRoot?.querySelector('video')

    expect(rasterError).not.toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'video/webm;codecs=vp9' }))
    expect(video?.getAttribute('src')).toContain('blob:video/webm')
    expect(video?.getAttribute('part')).toBe('graphic raster')
    expect(video?.hasAttribute('loop')).toBe(true)
    expect(video?.hasAttribute('muted')).toBe(true)
    expect(element.shadowRoot?.querySelector('svg')).toBeNull()
    expect(revokeObjectURL).toHaveBeenCalled()
  }, 15000)

  it('rasterizes decoration-11 animation to a PNG sprite by default', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback(new Blob(['png'], { type: 'image/png' }))
    })
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    })
    register()

    const element = document.createElement('dvk-decoration-11') as Decoration11Element
    element.setAttribute('dur', '6')
    document.body.append(element)

    emitResize(320, 240)
    await element.updateComplete
    await vi.runAllTimersAsync()
    await element.updateComplete

    const sprite = element.shadowRoot?.querySelector('canvas.raster-sprite-canvas')
    const pngBlobCalls = createObjectURL.mock.calls
      .filter(([blob]) => blob instanceof Blob && blob.type === 'image/png')

    expect(element).toHaveProperty('rasterRenderer', 'sprite')
    expect(pngBlobCalls).toHaveLength(1)
    expect(sprite?.getAttribute('part')).toBe('graphic raster')
    expect(sprite?.getAttribute('width')).toBeTruthy()
    expect(sprite?.getAttribute('height')).toBeTruthy()
    expect(element.shadowRoot?.querySelector('video')).toBeNull()
    expect(element.shadowRoot?.querySelector('svg')).toBeNull()
  }, 15000)

  it('shares one decoration-11 rasterization across matching instances', async () => {
    vi.useFakeTimers()
    let urlIndex = 0
    const createObjectURL = vi.fn((blob: Blob) => `blob:${blob.type}:${urlIndex += 1}`)
    vi.spyOn(HTMLCanvasElement.prototype, 'captureStream').mockReturnValue(createCanvasStream())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createCanvasContext())
    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL,
      revokeObjectURL: vi.fn(),
    })
    register()

    const first = document.createElement('dvk-decoration-11') as Decoration11Element
    first.setAttribute('colors', '#44f5ff,#447cff,#ffeeaa')
    first.setAttribute('dur', '6')
    first.setAttribute('raster-renderer', 'video')
    document.body.append(first)
    emitResize(320, 240)
    await first.updateComplete

    const second = document.createElement('dvk-decoration-11') as Decoration11Element
    second.setAttribute('colors', '#44f5ff,#447cff,#ffeeaa')
    second.setAttribute('dur', '6')
    second.setAttribute('raster-renderer', 'video')
    document.body.append(second)
    emitResize(320, 240)
    await second.updateComplete

    await vi.runAllTimersAsync()
    await first.updateComplete
    await second.updateComplete

    const firstVideo = first.shadowRoot?.querySelector('video')
    const secondVideo = second.shadowRoot?.querySelector('video')
    const videoBlobCalls = createObjectURL.mock.calls
      .filter(([blob]) => blob instanceof Blob && blob.type === 'video/webm;codecs=vp9')

    expect(videoBlobCalls).toHaveLength(1)
    expect(firstVideo?.getAttribute('src')).toBe(secondVideo?.getAttribute('src'))
  }, 15000)

  it('maps count-to attributes and formats the disabled target value', async () => {
    register()

    const element = document.createElement('dvk-count-to') as CountToElement
    element.setAttribute('start-val', '100')
    element.setAttribute('end-val', '12345.678')
    element.setAttribute('decimals', '2')
    element.setAttribute('separator', ' ')
    element.setAttribute('decimal', ',')
    element.setAttribute('prefix', '$')
    element.setAttribute('suffix', 'k')
    element.setAttribute('disabled', '')
    document.body.append(element)

    await element.updateComplete

    expect(element).toHaveProperty('startVal', 100)
    expect(element).toHaveProperty('endVal', 12345.678)
    expect(element.shadowRoot?.querySelector('[part="prefix"]')?.textContent).toBe('$')
    expect(element.shadowRoot?.querySelector('[part="integer"]')?.textContent).toBe('12 345')
    expect(element.shadowRoot?.querySelector('[part="decimal"]')?.textContent).toBe(',68')
    expect(element.shadowRoot?.querySelector('[part="suffix"]')?.textContent).toBe('k')
  })

  it('clamps count-to decimal places to avoid invalid toFixed ranges', async () => {
    register()

    const element = document.createElement('dvk-count-to') as CountToElement
    element.setAttribute('end-val', '1.234567890123456789012345')
    element.setAttribute('decimals', '999')
    element.setAttribute('disabled', '')
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('[part="decimal"]')?.textContent).toHaveLength(21)
  })

  it('renders count-to target immediately when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))

    register()

    const element = document.createElement('dvk-count-to') as CountToElement
    const started = vi.fn()

    element.setAttribute('end-val', '100')
    element.addEventListener('dvk-started', started)
    document.body.append(element)

    await element.updateComplete

    expect(started).not.toHaveBeenCalled()
    expect(element.shadowRoot?.querySelector('[part="integer"]')?.textContent).toBe('100')
  })

  it('emits count-to lifecycle events when animation runs', async () => {
    vi.useFakeTimers()

    let now = 0
    vi.spyOn(window.performance, 'now').mockImplementation(() => now)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      return window.setTimeout(() => {
        now += 16
        callback(now)
      }, 0)
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      window.clearTimeout(id)
    })

    register()

    const element = document.createElement('dvk-count-to') as CountToElement
    const started = vi.fn()
    const finished = vi.fn()

    element.setAttribute('end-val', '100')
    element.setAttribute('duration', '16')
    element.setAttribute('delay', '10')
    element.addEventListener('dvk-started', started)
    element.addEventListener('dvk-finished', finished)
    document.body.append(element)
    await element.updateComplete

    vi.advanceTimersByTime(10)
    await Promise.resolve()
    vi.runOnlyPendingTimers()
    await element.updateComplete

    expect(started).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        from: 0,
        to: 100,
        duration: 16,
        delay: 10,
      }),
    }))
    expect(finished).toHaveBeenCalledWith(expect.objectContaining({
      detail: { value: 100 },
    }))
    expect(element.shadowRoot?.querySelector('[part="integer"]')?.textContent).toBe('100')
  })

  it('maps loading-orbit attributes and renders DataV-style counter-rotating rings', async () => {
    register()

    const element = document.createElement('dvk-loading-orbit') as LoadingOrbitElement
    const ready = vi.fn()

    element.setAttribute('colors', '#111,#222')
    element.setAttribute('size', '64')
    element.setAttribute('stroke-width', '4')
    element.setAttribute('dur', '2')
    element.textContent = 'Loading data'
    element.addEventListener('dvk-ready', ready)
    document.body.append(element)

    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const circles = [...(element.shadowRoot?.querySelectorAll('circle') ?? [])]
    const rotations = [...(element.shadowRoot?.querySelectorAll('animateTransform') ?? [])]
    const strokeAnimations = [...(element.shadowRoot?.querySelectorAll('animate') ?? [])]

    expect(element).toHaveProperty('colors', '#111,#222')
    expect(element).toHaveProperty('size', 64)
    expect(element).toHaveProperty('strokeWidth', 4)
    expect(element.getAttribute('role')).toBe('status')
    expect(element.getAttribute('aria-live')).toBe('polite')
    expect(ready).toHaveBeenCalledWith(expect.objectContaining({
      detail: { tagName: 'dvk-loading-orbit' },
    }))
    expect(svg?.getAttribute('width')).toBe('64')
    expect(svg?.getAttribute('height')).toBe('64')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 50 50')
    expect(circles.map(circle => circle.getAttribute('r'))).toEqual(['20', '10'])
    expect(circles.map(circle => circle.getAttribute('stroke'))).toEqual(['#111', '#222'])
    expect(circles.map(circle => circle.getAttribute('stroke-width'))).toEqual(['4', '4'])
    expect(circles.map(circle => circle.getAttribute('stroke-dasharray'))).toEqual(['31.415, 31.415', '15.7, 15.7'])
    expect(rotations.map(animation => animation.getAttribute('values'))).toEqual(['0, 25 25;360, 25 25', '360, 25 25;0, 25 25'])
    expect(rotations.map(animation => animation.getAttribute('dur'))).toEqual(['2s', '2s'])
    expect(strokeAnimations.map(animation => animation.getAttribute('values'))).toEqual(['#111;#222;#111', '#222;#111;#222'])
    expect(element.shadowRoot?.querySelector('slot')?.assignedNodes().map(node => node.textContent).join('').trim()).toBe('Loading data')
  })

  it('keeps loading-orbit static when paused', async () => {
    register()

    const element = document.createElement('dvk-loading-orbit') as LoadingOrbitElement
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelectorAll('circle')).toHaveLength(2)
    expect(element.shadowRoot?.querySelector('animateTransform')).toBeNull()
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as loading-orbit fallback colors', async () => {
    register()

    const element = document.createElement('dvk-loading-orbit') as LoadingOrbitElement
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const circles = [...(element.shadowRoot?.querySelectorAll('circle') ?? [])]

    expect(circles.map(circle => circle.getAttribute('stroke'))).toEqual(['#18f0ff', '#2b7cff'])
  })

  it('maps loading-energy attributes and renders a restrained enterprise energy module', async () => {
    register()

    const element = document.createElement('dvk-loading-energy') as LoadingEnergyElement
    const ready = vi.fn()

    element.setAttribute('colors', '#111,#222')
    element.setAttribute('size', '72')
    element.setAttribute('stroke-width', '3')
    element.setAttribute('dur', '2.4')
    element.textContent = 'Processing data'
    element.addEventListener('dvk-ready', ready)
    document.body.append(element)

    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const frame = element.shadowRoot?.querySelector('[part="frame"]')
    const moduleShell = element.shadowRoot?.querySelector('[part="module-shell"]')
    const busLine = element.shadowRoot?.querySelector('[part="bus-line"]')
    const busFlow = element.shadowRoot?.querySelector('[part="bus-flow"]')
    const cell = element.shadowRoot?.querySelector('[part="energy-cell"]')
    const energyFill = element.shadowRoot?.querySelector('[part="energy-fill"]')
    const energyFlow = element.shadowRoot?.querySelector('[part="energy-flow"]')
    const scanLine = element.shadowRoot?.querySelector('[part="scan-line"]')
    const chargeSegments = [...(element.shadowRoot?.querySelectorAll('[part~="charge-segment"]') ?? [])]
    const core = element.shadowRoot?.querySelector('[part="core"]')
    const animations = [...(element.shadowRoot?.querySelectorAll('animate') ?? [])]
    const transforms = [...(element.shadowRoot?.querySelectorAll('animateTransform') ?? [])]

    expect(element).toHaveProperty('colors', '#111,#222')
    expect(element).toHaveProperty('size', 72)
    expect(element).toHaveProperty('strokeWidth', 3)
    expect(element.getAttribute('role')).toBe('status')
    expect(element.getAttribute('aria-live')).toBe('polite')
    expect(ready).toHaveBeenCalledWith(expect.objectContaining({
      detail: { tagName: 'dvk-loading-energy' },
    }))
    expect(svg?.getAttribute('width')).toBe('72')
    expect(svg?.getAttribute('height')).toBe('72')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 72 72')
    expect(svg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(frame?.getAttribute('d')).toBe('M22 10 H50 M62 22 V50 M50 62 H22 M10 50 V22')
    expect(frame?.getAttribute('stroke')).toBe('rgba(34, 34, 34, 0.48)')
    expect(frame?.getAttribute('stroke-width')).toBe('2.25')
    expect(moduleShell?.getAttribute('d')).toBe('M22 13 H50 L59 22 V50 L50 59 H22 L13 50 V22 Z')
    expect(moduleShell?.getAttribute('stroke')).toBe('rgba(34, 34, 34, 0.58)')
    expect(busLine?.getAttribute('d')).toBe('M18 36 H29 M43 36 H54 M36 18 V29 M36 43 V54')
    expect(busFlow?.getAttribute('d')).toBe('M18 36 H29 M54 36 H43 M36 18 V29 M36 54 V43')
    expect(busFlow?.getAttribute('stroke-dasharray')).toBe('3 5')
    expect(cell?.getAttribute('x')).toBe('30')
    expect(cell?.getAttribute('width')).toBe('12')
    expect(cell?.getAttribute('height')).toBe('32')
    expect(cell?.getAttribute('stroke')).toBe('#111')
    expect(cell?.getAttribute('stroke-width')).toBe('3')
    expect(energyFill?.getAttribute('fill')).toBe('rgba(17, 17, 17, 0.18)')
    expect(energyFlow?.getAttribute('clip-path')).toBe('url(#dvk-loading-energy-cell-clip)')
    expect(scanLine?.getAttribute('fill')).toBe('url(#dvk-loading-energy-scan)')
    expect(chargeSegments).toHaveLength(4)
    expect(chargeSegments.map(segment => segment.getAttribute('part'))).toEqual(['charge-segment charge-left', 'charge-segment charge-right', 'charge-segment charge-top', 'charge-segment charge-bottom'])
    expect(chargeSegments.map(segment => segment.getAttribute('fill'))).toEqual(['#111', '#222', '#222', '#111'])
    expect(core?.getAttribute('fill')).toBe('#111')
    expect(animations.map(animation => animation.getAttribute('attributeName'))).toEqual(['stroke-dashoffset', 'y', 'y'])
    expect(animations.map(animation => animation.getAttribute('attributeName'))).not.toContain('opacity')
    expect(animations.map(animation => animation.getAttribute('attributeName'))).not.toContain('fill-opacity')
    expect(transforms).toHaveLength(5)
    expect(transforms.map(animation => animation.getAttribute('type'))).toEqual(['translate', 'translate', 'translate', 'translate', 'translate'])
    expect(transforms.map(animation => animation.getAttribute('dur'))).toContain('2.4s')
    expect(element.shadowRoot?.querySelector('slot')?.assignedNodes().map(node => node.textContent).join('').trim()).toBe('Processing data')
  })

  it('keeps loading-energy static when paused', async () => {
    register()

    const element = document.createElement('dvk-loading-energy') as LoadingEnergyElement
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('[part="core"]')).not.toBeNull()
    expect(element.shadowRoot?.querySelectorAll('[part~="charge-segment"]')).toHaveLength(4)
    expect(element.shadowRoot?.querySelector('animateTransform')).toBeNull()
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as loading-energy fallback colors', async () => {
    register()

    const element = document.createElement('dvk-loading-energy') as LoadingEnergyElement
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const moduleShell = element.shadowRoot?.querySelector('[part="module-shell"]')
    const busLine = element.shadowRoot?.querySelector('[part="bus-line"]')
    const energyFill = element.shadowRoot?.querySelector('[part="energy-fill"]')
    const chargeSegments = [...(element.shadowRoot?.querySelectorAll('[part~="charge-segment"]') ?? [])]

    expect(moduleShell?.getAttribute('stroke')).toBe('rgba(43, 124, 255, 0.58)')
    expect(busLine?.getAttribute('stroke')).toBe('rgba(43, 124, 255, 0.5)')
    expect(energyFill?.getAttribute('fill')).toBe('rgba(24, 240, 255, 0.18)')
    expect(chargeSegments.map(segment => segment.getAttribute('fill'))).toEqual(['#18f0ff', '#2b7cff', '#2b7cff', '#18f0ff'])
  })

  it('maps border-box-1 attributes to element properties and renders SVG', async () => {
    register()

    const element = document.createElement('dvk-border-box-1')
    element.setAttribute('colors', '#fff,#f3ff5c')
    element.setAttribute('duration', '5')
    element.setAttribute('reverse', '')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    expect(element).toHaveProperty('colors', '#fff,#f3ff5c')
    expect(element).toHaveProperty('duration', 5)
    expect(element).toHaveProperty('reverse', true)
    expect(element.shadowRoot?.querySelector('svg')).not.toBeNull()
    expect(element.shadowRoot?.querySelector('path')?.getAttribute('d')).toContain('177.5')
  })

  it('resolves border-box-1 colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dvk-border-box-1') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#123456')
    element.style.setProperty('--dvk-color-secondary', '#abcdef')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const strokes = [...(element.shadowRoot?.querySelectorAll('use') ?? [])]
      .map(use => use.getAttribute('stroke'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(strokes).toContain('#123456')
    expect(strokes).toContain('#abcdef')
    expect(animateMotion).toBeNull()
  })

  it('renders border-box-2 with fixed details and clean source extensions by default', async () => {
    register()

    const element = document.createElement('dvk-border-box-2')
    element.setAttribute('colors', '#18f0ff,#2b7cff,#20c8ff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.5')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(800, 450)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]
    const extensions = [...(element.shadowRoot?.querySelectorAll('.extension') ?? [])]
    const svgs = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])]
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const circles = element.shadowRoot?.querySelectorAll('circle') ?? []
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#18f0ff,#2b7cff,#20c8ff')
    expect(element).toHaveProperty('glowIntensity', 1.5)

    expect(tiles).toHaveLength(8)
    expect(extensions).toHaveLength(8)
    expect(svgs).toHaveLength(18)
    expect(svgs.some(svg => svg.getAttribute('viewBox') === '48 48 1504 804')).toBe(false)
    expect(tiles.some(tile => tile.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(false)
    expect(extensions.every(extension => extension.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
    expect(element.shadowRoot?.querySelector('[data-slice="bottom-leading"] circle[cx="540"][cy="760"]')).toBeNull()
    expect(element.shadowRoot?.querySelector('[data-slice="bottom-trailing"] circle[cx="1060"][cy="760"]')).toBeNull()
    expect([...(element.shadowRoot?.querySelectorAll('.node-overlay svg') ?? [])].map(svg => [
      svg.getAttribute('viewBox'),
      svg.getAttribute('preserveAspectRatio'),
      svg.getAttribute('width'),
      svg.getAttribute('height'),
    ])).toEqual([
      ['520 740 40 40', 'xMidYMid meet', '21.28', '21.28'],
      ['1040 740 40 40', 'xMidYMid meet', '21.28', '21.28'],
    ])
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '48 48 477 210',
      '575 88 455 70',
      '1075 48 477 210',
      '48 290 132 306',
      '1420 290 132 306',
      '48 642 477 210',
      '575 750 455 70',
      '1075 642 477 210',
      '525 88 50 70',
      '1030 88 45 70',
      '525 750 50 70',
      '1030 750 45 70',
      '48 258 132 32',
      '48 596 132 46',
      '1420 258 132 32',
      '1420 596 132 46',
      '520 740 40 40',
      '1040 740 40 40',
    ]))
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('right: 0'))).toBe(true)
    expect(paths.some(path => path.getAttribute('d')?.includes('L1510 785'))).toBe(true)
    expect(circles.length).toBeGreaterThan(10)
    expect(blurs.slice(0, 2)).toEqual(['4.5', '12'])
    expect(animateMotion).toBeNull()
  })

  it('resolves border-box-2 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dvk-border-box-2') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#102030')
    element.style.setProperty('--dvk-color-secondary', '#405060')
    element.style.setProperty('--dvk-color-accent', '#708090')
    element.setAttribute('glow-intensity', '0.5')
    document.body.append(element)

    await element.updateComplete

    const strokes = [...(element.shadowRoot?.querySelectorAll('[stroke]') ?? [])]
      .map(node => node.getAttribute('stroke'))
    const stopColors = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(node => node.getAttribute('stop-color'))
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(strokes).toContain('#102030')
    expect(strokes).toContain('#405060')
    expect(stopColors).toContain('#708090')
    expect(blurs.slice(0, 2)).toEqual(['1.5', '4'])
  })

  it('maps border-box-3 public attributes and keeps SVG reference geometry internal', async () => {
    register()

    const element = document.createElement('dvk-border-box-3')
    element.setAttribute('colors', '#57b9ff,#168cff,#9ae7ff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.25')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(800, 450)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]
    const extensions = [...(element.shadowRoot?.querySelectorAll('.extension') ?? [])]
    const svgs = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])]
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const uses = element.shadowRoot?.querySelectorAll('use') ?? []
    const circles = element.shadowRoot?.querySelectorAll('circle') ?? []
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#57b9ff,#168cff,#9ae7ff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(tiles).toHaveLength(8)
    expect(extensions).toHaveLength(8)
    expect(svgs).toHaveLength(16)
    expect(svgs.some(svg => svg.getAttribute('viewBox') === '48 60 1576 820')).toBe(false)
    expect(tiles.some(tile => tile.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(false)
    expect(extensions.every(extension => extension.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '48 60 300 204',
      '585 88 502 32',
      '1324 60 300 204',
      '48 264 48 410',
      '1576 264 48 410',
      '48 674 300 206',
      '585 821 502 38',
      '1324 674 300 206',
      '348 88 237 34',
      '1087 88 237 34',
      '348 821 237 38',
      '1087 821 237 38',
      '58 228 26 30',
      '58 690 26 42',
      '1588 228 26 30',
      '1588 690 26 42',
    ]))
    expect(paths.some(path => path.getAttribute('d')?.includes('L1604 162V779L1523 849'))).toBe(true)
    expect(uses.length).toBeGreaterThanOrEqual(8)
    expect(circles.length).toBeGreaterThan(10)
    expect(blurs.slice(0, 6)).toEqual(['2.75', '8.125', '1.5', '5.75', '15', '7.5'])
    expect(animateMotion).toBeNull()
  })

  it('aligns border-box-3 lower corner slices with bottom edge extensions', async () => {
    register()

    const element = document.createElement('dvk-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(1576, 820)
    await element.updateComplete

    const bottomLeft = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="bottom-left"]')
    const bottomLeading = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="bottom-leading"]')
    const bottomTrailing = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="bottom-trailing"]')
    const bottomRight = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="bottom-right"]')

    expect(bottomLeft?.querySelector('svg')?.getAttribute('viewBox')).toBe('48 674 300 206')
    expect(bottomRight?.querySelector('svg')?.getAttribute('viewBox')).toBe('1324 674 300 206')
    expect(bottomLeft?.getAttribute('style')).toContain('height: 206px')
    expect(bottomRight?.getAttribute('style')).toContain('height: 206px')
    expect(bottomLeading?.getAttribute('style')).toContain('bottom: 21px')
    expect(bottomTrailing?.getAttribute('style')).toContain('bottom: 21px')
  })

  it('resolves border-box-3 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dvk-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#112233')
    element.style.setProperty('--dvk-color-secondary', '#445566')
    element.style.setProperty('--dvk-color-accent', '#778899')
    element.setAttribute('glow-intensity', '0.5')
    document.body.append(element)

    await element.updateComplete

    const strokes = [...(element.shadowRoot?.querySelectorAll('[stroke]') ?? [])]
      .map(node => node.getAttribute('stroke'))
    const stopColors = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(node => node.getAttribute('stop-color'))
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(strokes).toContain('#112233')
    expect(strokes).toContain('#445566')
    expect(stopColors).toContain('#778899')
    expect(blurs.slice(0, 6)).toEqual(['1.1', '3.25', '0.6', '2.3', '6', '3'])
  })

  it('renders border-box-4 with fixed details and source edge extensions by default', async () => {
    register()

    const element = document.createElement('dvk-border-box-4')
    element.setAttribute('colors', '#36d9ff,#1ecfff,#c9fbff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.25')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(800, 450)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]
    const extensions = [...(element.shadowRoot?.querySelectorAll('.extension') ?? [])]
    const svgs = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])]
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#36d9ff,#1ecfff,#c9fbff')
    expect(element).toHaveProperty('glowIntensity', 1.25)

    expect(tiles).toHaveLength(8)
    expect(extensions).toHaveLength(7)
    expect(svgs).toHaveLength(15)
    expect(svgs.some(svg => svg.getAttribute('viewBox') === '48 60 1576 820')).toBe(false)
    expect(tiles.some(tile => tile.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(false)
    expect(extensions.every(extension => extension.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '48 60 466 150',
      '746 74 360 72',
      '1358 60 266 340',
      '48 150 120 585',
      '1500 392 124 208',
      '48 735 370 145',
      '676 845 547 35',
      '1266 735 358 145',
      '509 72 237 44',
      '1106 72 252 48',
      '418 844 258 36',
      '1223 844 43 36',
      '70 651 32 84',
      '1582 600 42 135',
      '1592 186 8 549',
    ]))
    expect(svgs.some(svg => svg.getAttribute('viewBox')?.endsWith('145'))).toBe(true)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '1500 392 124 208',
      '1582 600 42 135',
      '1266 735 358 145',
    ]))
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('right: 0'))).toBe(true)
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('bottom: 0'))).toBe(true)
    expect(element.shadowRoot?.querySelector('[data-extension="right-edge-reset"]')?.getAttribute('style')).toContain('right: 12.18px')
    expect(element.shadowRoot?.querySelector('#cyan-dynamic-line-core')).toBeNull()
    expect(element.shadowRoot?.querySelector('[data-extension="top-leading"]')?.getAttribute('style')).toContain('left: 234.01px')
    expect(extensions.some(extension => extension.getAttribute('style')?.includes('height: 18.27px'))).toBe(true)
    expect(paths.slice(4, 8).map(path => path.id)).toEqual([
      'cyan-outer-glow',
      'cyan-soft-glow',
      'cyan-line-core',
      'cyan-hot-highlight',
    ])
    expect(paths.some(path => path.getAttribute('d')?.includes('M1304,859L1302,863L1305,862'))).toBe(true)
    expect(paths.some(path => path.getAttribute('d')?.includes('M809,868L839,868L839,867L810,867'))).toBe(true)
    expect(blurs.slice(0, 3)).toEqual(['5.25', '2.625', '1.0625'])
    expect(animateMotion).toBeNull()
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('40.61px 32.49px 40.61px 32.49px')
  })

  it('resolves border-box-4 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dvk-border-box-4') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#213141')
    element.style.setProperty('--dvk-color-secondary', '#526272')
    element.style.setProperty('--dvk-color-accent', '#8393a3')
    element.setAttribute('glow-intensity', '0.5')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
      .map(node => node.getAttribute('fill'))
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(fills).toContain('#213141')
    expect(fills).toContain('#526272')
    expect(fills).toContain('#8393a3')
    expect(blurs.slice(0, 3)).toEqual(['2.1', '1.05', '0.425'])
  })

  it('maps border-box-5 public attributes and keeps SVG reference geometry internal', async () => {
    register()

    const element = document.createElement('dvk-border-box-5')
    element.setAttribute('colors', '#24d9ff,#008cff,#bffcff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.25')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(800, 450)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const svgs = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])]
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#24d9ff,#008cff,#bffcff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(svgs.length).toBeGreaterThan(3)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '112 56 148 341',
      '260 56 1152 341',
      '1412 56 148 341',
      '112 552 148 298',
      '260 552 1152 298',
      '1412 552 148 298',
    ]))
    expect(paths.slice(0, 5).map(path => path.id)).toEqual([
      'blue-outer-aura',
      'blue-soft-halo',
      'blue-electric-body',
      'cyan-stroke',
      'white-hot-core',
    ])
    expect(paths.some(path => path.getAttribute('d')?.includes('M1123 819L1119 819L1109 828L1114 828'))).toBe(true)
    expect(paths.some(path => path.getAttribute('d')?.includes('M1110 837L953 837L952 836L923 836'))).toBe(true)
    expect(blurs.slice(0, 4)).toEqual(['9.375', '4.75', '1.75', '0.4375'])
    expect(animateMotion).toBeNull()
  })

  it('resolves border-box-5 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dvk-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#1a2a3a')
    element.style.setProperty('--dvk-color-secondary', '#4a5a6a')
    element.style.setProperty('--dvk-color-accent', '#7a8a9a')
    element.setAttribute('glow-intensity', '0.5')
    document.body.append(element)

    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
      .map(node => node.getAttribute('fill'))
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(fills).toContain('#1a2a3a')
    expect(fills).toContain('#4a5a6a')
    expect(fills).toContain('#7a8a9a')
    expect(blurs.slice(0, 4)).toEqual(['3.75', '1.9', '0.7', '0.175'])
  })

  it('uses responsive content padding across border box variants', async () => {
    register()

    const cases = [
      ['dvk-border-box-1', '8px 8px 8px 8px'],
      ['dvk-border-box-2', '21.72px 21.94px 21.72px 21.94px'],
      ['dvk-border-box-3', '15.8px 11.8px 15.59px 11.8px'],
      ['dvk-border-box-4', '16.24px 12.18px 16.24px 12.18px'],
      ['dvk-border-box-5', '32px 22px 16px 22px'],
      ['dvk-border-box-10', '15px 15px 15px 15px'],
      ['dvk-border-box-11', '21.94px 19px 21.94px 18.5px'],
      ['dvk-border-box-12', '15.07px 19px 14px 19px'],
      ['dvk-border-box-13', '16px 16px 16px 16px'],
      ['dvk-border-box-14', '14px 14px 14px 14px'],
      ['dvk-border-box-15', '10px 10px 10px 10px'],
      ['dvk-border-box-16', '20px 20px 20px 20px'],
    ] as const

    for (const [tagName, expectedPadding] of cases) {
      const element = document.createElement(tagName) as HTMLElement & { updateComplete: Promise<boolean> }
      document.body.append(element)
      await element.updateComplete

      emitResize(300, 180)
      await element.updateComplete

      expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe(expectedPadding)
    }
  })

  it('maps border-box-2 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dvk-border-box-2') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element).not.toHaveProperty('autoHeight')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('51.88px 70.21px 51.88px 70.21px')
  })

  it('maps border-box-4 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dvk-border-box-4') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('38.8px 38.98px 38.8px 38.98px')
  })

  it('maps border-box-3 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dvk-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('37.76px 37.77px 37.23px 37.77px')
  })

  it('supports content-driven height across border box variants', async () => {
    register()

    const cases = [
      ['dvk-border-box-1', '8px 8px 8px 8px'],
    ] as const

    for (const [tagName, expectedPadding] of cases) {
      const element = document.createElement(tagName) as HTMLElement & { updateComplete: Promise<boolean> }
      element.setAttribute('auto-height', '')
      document.body.append(element)
      await element.updateComplete

      emitResize(300, 180)
      await element.updateComplete

      expect(element).toHaveProperty('autoHeight', true)
      expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe(expectedPadding)
    }
  })

  it('uses content-driven height for border-box-3 by default', async () => {
    register()

    const element = document.createElement('dvk-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(300, 180)
    await element.updateComplete

    expect(element).not.toHaveProperty('autoHeight')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('15.8px 11.8px 15.59px 11.8px')
  })

  it('renders border-box-5 as a tiled free border by default', async () => {
    register()

    const element = document.createElement('dvk-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(300, 180)
    await element.updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]

    expect(tiles.length).toBeGreaterThan(8)
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('right: 0'))).toBe(true)
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('bottom: 0'))).toBe(true)
    expect(element.shadowRoot?.querySelectorAll('svg').length).toBe(tiles.length)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('32px 22px 16px 22px')
  })

  it('caps border-box-5 repeat tiles for very narrow mobile layouts', async () => {
    register()

    const element = document.createElement('dvk-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(1, 1200)
    await element.updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]
    const heights = tiles
      .map(tile => Number(tile.getAttribute('style')?.match(/height: ([\d.]+)px/)?.[1] ?? 0))

    expect(tiles.length).toBeLessThanOrEqual(102)
    expect(Math.max(...heights)).toBeGreaterThan(800)
  })

  it('maps border-box-5 block padding from host height', async () => {
    register()

    const element = document.createElement('dvk-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('35.74px 37.13px 20.58px 41.1px')
  })

  it('maps border-box-6 public attributes and renders source-clipped slices', async () => {
    register()

    const element = document.createElement('dvk-border-box-6')
    element.setAttribute('colors', '#04b9f2,#102132,#00b7f0')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.25')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(800, 450)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const svgs = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])]
    const fixedSvgs = [...(element.shadowRoot?.querySelectorAll('.tile svg') ?? [])]
    const extensionSvgs = [...(element.shadowRoot?.querySelectorAll('.extension svg') ?? [])]
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(element).toHaveProperty('colors', '#04b9f2,#102132,#00b7f0')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(svgs.length).toBeGreaterThan(9)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '356 52 245 24',
      '40 29 330 220',
      '601 53 20 22',
      '621 70 236 28',
      '1195 45 445 200',
      '65 396 29 337',
      '1594 319 46 236',
      '1581 555 59 75',
      '1581 665 59 75',
      '50 740 310 157',
      '716 850 390 47',
      '1130 850 280 47',
      '1364 726 276 171',
    ]))
    expect(fixedSvgs.every(svg => svg.getAttribute('preserveAspectRatio') !== 'none')).toBe(true)
    expect(extensionSvgs.some(svg => svg.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
    expect(element.shadowRoot?.querySelector('svg[viewBox="0 0 1672 941"]')).toBeNull()
    expect(paths.slice(0, 11).map(path => path.id)).toEqual([
      'dark-mist',
      'dark-halo',
      'dark-body',
      'dark-contour',
      'dark-core',
      'cyan-mist',
      'cyan-halo',
      'cyan-body',
      'cyan-core',
      'solid-dark',
      'solid-cyan',
    ])
    expect(paths.some(path => path.getAttribute('d')?.includes('M 40 98 L 40 223 L 49 232'))).toBe(true)
    expect(paths.some(path => path.getAttribute('d')?.includes('M 1595 383 L 1595 389'))).toBe(true)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '65 733 29 10',
      '1581 630 59 35',
    ]))
    expect(blurs.slice(0, 3)).toEqual(['1.875', '3', '0.6875'])
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('34.74px 32px 31.62px 32px')
  })

  it('resolves border-box-6 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dvk-border-box-6') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#112233')
    element.style.setProperty('--dvk-color-secondary', '#445566')
    element.style.setProperty('--dvk-color-accent', '#778899')
    element.setAttribute('glow-intensity', '0.5')
    document.body.append(element)

    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
      .map(node => node.getAttribute('fill'))
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(fills).toContain('#112233')
    expect(fills).toContain('#445566')
    expect(fills).toContain('#778899')
    expect(blurs.slice(0, 3)).toEqual(['0.75', '1.2', '0.275'])
  })

  it('keeps border-box-6 source-ratio right side on the original slice set', async () => {
    register()

    const element = document.createElement('dvk-border-box-6') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(800, 434)
    await element.updateComplete

    const viewBoxes = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])].map(svg => svg.getAttribute('viewBox'))
    const rightLowerTop = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="right-lower-top"]')
    const rightLowerMiddle = element.shadowRoot?.querySelector<HTMLElement>('[data-extension="right-lower-middle"]')
    const rightLowerBottom = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="right-lower-bottom"]')

    expect(viewBoxes).toEqual(expect.arrayContaining([
      '1610 238 30 81',
      '1581 555 59 75',
      '1581 630 59 35',
      '1581 665 59 75',
    ]))
    expect(element.shadowRoot?.querySelector('[data-extension="right-lower-extra"]')).toBeNull()
    expect(rightLowerTop?.querySelector('svg')?.getAttribute('preserveAspectRatio')).not.toBe('none')
    expect(rightLowerMiddle?.querySelector('svg')?.getAttribute('preserveAspectRatio')).toBe('none')
    expect(rightLowerBottom?.querySelector('svg')?.getAttribute('preserveAspectRatio')).not.toBe('none')
    expect(rightLowerTop?.style.top).toBe('263px')
    expect(rightLowerTop?.style.height).toBe('37.5px')
    expect(rightLowerMiddle?.style.top).toBe('300.5px')
    expect(rightLowerMiddle?.style.height).toBe('17.5px')
    expect(rightLowerBottom?.style.top).toBe('318px')
    expect(rightLowerBottom?.style.height).toBe('37.5px')

    emitResize(800, 600)
    await element.updateComplete

    expect(rightLowerTop?.style.top).toBe('263px')
    expect(rightLowerTop?.style.height).toBe('37.5px')
    expect(rightLowerMiddle?.style.top).toBe('300.5px')
    expect(rightLowerMiddle?.style.height).toBe('183.5px')
    expect(rightLowerBottom?.style.top).toBe('484px')
    expect(rightLowerBottom?.style.height).toBe('37.5px')
  })

  it('maps border-box-6 block padding from host height', async () => {
    register()

    const element = document.createElement('dvk-border-box-6') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('33.19px 38.4px 30.22px 38.4px')
  })

  it('maps border-box-7 public attributes and recreates BorderBox10 geometry', async () => {
    register()

    const element = document.createElement('dvk-border-box-7')
    element.setAttribute('colors', '#1d48c4,#d3e1f8')
    element.setAttribute('background-color', 'rgba(5, 18, 46, 0.36)')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const corners = [...(element.shadowRoot?.querySelectorAll('.corner') ?? [])]
    const cornerPolygons = [...(element.shadowRoot?.querySelectorAll('.corner polygon') ?? [])]

    expect(element).toHaveProperty('colors', '#1d48c4,#d3e1f8')
    expect(element).toHaveProperty('backgroundColor', 'rgba(5, 18, 46, 0.36)')
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(element.shadowRoot?.querySelectorAll('.panel polygon')).toHaveLength(1)
    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('points')).toBe('4,0 316,0 320,4 320,176 316,180 4,180 0,176 0,4')
    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('fill')).toBe('rgba(5, 18, 46, 0.36)')
    expect(element.shadowRoot?.querySelector('.panel polygon')?.hasAttribute('stroke')).toBe(false)
    expect(element.shadowRoot?.querySelector('filter')).toBeNull()
    expect(corners).toHaveLength(4)
    expect(corners.every(corner => corner.getAttribute('viewBox') === '0 0 150 150')).toBe(true)
    expect(cornerPolygons.every(polygon => polygon.getAttribute('points') === '40,0 5,0 0,5 0,16 3,19 3,7 7,3 35,3')).toBe(true)
    expect(cornerPolygons.every(polygon => polygon.getAttribute('fill') === '#d3e1f8')).toBe(true)
    expect(element.shadowRoot?.querySelector('feGaussianBlur')).toBeNull()
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')?.style.getPropertyValue('--dvk-border-box-7-box-shadow')).toBe('inset 0 0 25px 3px #1d48c4')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('9.6px 12.8px 9.6px 12.8px')
  })

  it('resolves border-box-7 colors from CSS variables', async () => {
    register()

    const element = document.createElement('dvk-border-box-7') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#112233')
    element.style.setProperty('--dvk-color-secondary', '#ddeeff')
    element.style.setProperty('--dvk-border-box-7-background', 'rgba(1, 2, 3, 0.4)')
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('fill')).toBe('rgba(1, 2, 3, 0.4)')
    expect(element.shadowRoot?.querySelector('.corner polygon')?.getAttribute('fill')).toBe('#ddeeff')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')?.style.getPropertyValue('--dvk-border-box-7-box-shadow')).toBe('inset 0 0 25px 3px #112233')
  })

  it('uses datav-kit colors as border-box-7 defaults', async () => {
    register()

    const element = document.createElement('dvk-border-box-7') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('.corner polygon')?.getAttribute('fill')).toBe('#4fd2dd')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')?.style.getPropertyValue('--dvk-border-box-7-box-shadow')).toBe('inset 0 0 25px 3px #235fa7')
  })

  it('maps border-box-8 public attributes and recreates BorderBox1 geometry', async () => {
    register()

    const element = document.createElement('dvk-border-box-8')
    element.setAttribute('colors', '#235fa7,#4fd2dd')
    element.setAttribute('background-color', 'rgba(5, 18, 46, 0.32)')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const corners = [...(element.shadowRoot?.querySelectorAll('.corner') ?? [])]
    const cornerPolygons = [...(element.shadowRoot?.querySelectorAll('.corner polygon') ?? [])]
    const animations = [...(element.shadowRoot?.querySelectorAll('animate') ?? [])]

    expect(element).toHaveProperty('colors', '#235fa7,#4fd2dd')
    expect(element).toHaveProperty('backgroundColor', 'rgba(5, 18, 46, 0.32)')
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(element.shadowRoot?.querySelectorAll('.panel polygon')).toHaveLength(1)
    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('points')).toBe('10,27 10,153 13,156 13,159 24,169 38,169 41,172 73,172 75,170 81,170 85,174 235,174 239,170 245,170 247,172 279,172 282,169 310,153 310,27 307,25 307,21 296,11 282,11 279,8 247,8 245,10 239,10 235,6 85,6 81,10 75,10 73,8 41,8 38,11 24,11 13,21 13,24')
    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('fill')).toBe('rgba(5, 18, 46, 0.32)')
    expect(corners).toHaveLength(4)
    expect(corners.every(corner => corner.getAttribute('viewBox') === '0 0 150 150')).toBe(true)
    expect(cornerPolygons.map(polygon => polygon.getAttribute('points'))).toEqual(expect.arrayContaining([
      '6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63',
      '27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8',
      '9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54',
    ]))
    expect(animations).toHaveLength(12)
    expect(animations.map(animation => animation.getAttribute('dur'))).toEqual(expect.arrayContaining(['0.5s', '1s']))
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('18px 18px 18px 18px')
  })

  it('resolves border-box-8 colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dvk-border-box-8') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#112233')
    element.style.setProperty('--dvk-color-secondary', '#ddeeff')
    element.style.setProperty('--dvk-border-box-8-background', 'rgba(1, 2, 3, 0.4)')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('.corner polygon') ?? [])]
      .map(node => node.getAttribute('fill'))

    expect(fills).toContain('#112233')
    expect(fills).toContain('#ddeeff')
    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('fill')).toBe('rgba(1, 2, 3, 0.4)')
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as border-box-8 defaults', async () => {
    register()

    const element = document.createElement('dvk-border-box-8') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('.corner polygon') ?? [])]
      .map(node => node.getAttribute('fill'))

    expect(fills).toContain('#235fa7')
    expect(fills).toContain('#4fd2dd')
  })

  it('maps border-box-9 public attributes and recreates BorderBox7 geometry', async () => {
    register()

    const element = document.createElement('dvk-border-box-9')
    element.setAttribute('colors', '#334455,#ddeeff')
    element.setAttribute('background-color', 'rgba(5, 18, 46, 0.22)')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const corners = [...(element.shadowRoot?.querySelectorAll('[data-corner]') ?? [])]
    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]
    const frame = element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')

    expect(element).toHaveProperty('colors', '#334455,#ddeeff')
    expect(element).toHaveProperty('backgroundColor', 'rgba(5, 18, 46, 0.22)')
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(corners.map(corner => corner.getAttribute('data-corner'))).toEqual(['left-top', 'right-top', 'right-bottom', 'left-bottom'])
    expect(corners.map(corner => corner.getAttribute('transform'))).toEqual([
      'translate(0, 0)',
      'translate(320, 0) scale(-1, 1)',
      'translate(320, 180) scale(-1, -1)',
      'translate(0, 180) scale(1, -1)',
    ])
    expect(lines).toHaveLength(8)
    expect(lines.map(line => line.getAttribute('points'))).toEqual([
      '0,25 0,0 25,0',
      '0,10 0,0 10,0',
      '0,25 0,0 25,0',
      '0,10 0,0 10,0',
      '0,25 0,0 25,0',
      '0,10 0,0 10,0',
      '0,25 0,0 25,0',
      '0,10 0,0 10,0',
    ])
    expect(lines.filter(line => line.getAttribute('stroke-width') === '2').every(line => line.getAttribute('stroke') === '#334455')).toBe(true)
    expect(lines.filter(line => line.getAttribute('stroke-width') === '5').every(line => line.getAttribute('stroke') === '#ddeeff')).toBe(true)
    expect(lines.every(line => line.hasAttribute('fill') === false)).toBe(true)
    expect(frame?.style.getPropertyValue('--dvk-border-box-9-primary').trim()).toBe('#334455')
    expect(frame?.style.getPropertyValue('--dvk-border-box-9-box-shadow').trim()).toBe('inset 0 0 40px #334455')
    expect(frame?.style.getPropertyValue('--dvk-border-box-9-background').trim()).toBe('rgba(5, 18, 46, 0.22)')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('10px 10px 10px 10px')
  })

  it('resolves border-box-9 colors from CSS variables', async () => {
    register()

    const element = document.createElement('dvk-border-box-9') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#112233')
    element.style.setProperty('--dvk-color-secondary', '#ddeeff')
    element.style.setProperty('--dvk-border-box-9-background', 'rgba(1, 2, 3, 0.4)')
    document.body.append(element)

    await element.updateComplete

    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]
    const frame = element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')

    expect(lines.filter(line => line.getAttribute('stroke-width') === '2').every(line => line.getAttribute('stroke') === '#112233')).toBe(true)
    expect(lines.filter(line => line.getAttribute('stroke-width') === '5').every(line => line.getAttribute('stroke') === '#ddeeff')).toBe(true)
    expect(frame?.style.getPropertyValue('--dvk-border-box-9-box-shadow').trim()).toBe('inset 0 0 40px #112233')
    expect(frame?.style.getPropertyValue('--dvk-border-box-9-background').trim()).toBe('rgba(1, 2, 3, 0.4)')
  })

  it('uses datav-kit colors as border-box-9 defaults', async () => {
    register()

    const element = document.createElement('dvk-border-box-9') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete

    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]
    const frame = element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')

    expect(lines.filter(line => line.getAttribute('stroke-width') === '2').every(line => line.getAttribute('stroke') === '#235fa7')).toBe(true)
    expect(lines.filter(line => line.getAttribute('stroke-width') === '5').every(line => line.getAttribute('stroke') === '#4fd2dd')).toBe(true)
    expect(frame?.style.getPropertyValue('--dvk-border-box-9-box-shadow').trim()).toBe('inset 0 0 40px #235fa7')
  })

  it('maps border-box-10 public attributes and recreates BorderBox12 geometry', async () => {
    register()

    const element = document.createElement('dvk-border-box-10')
    element.setAttribute('colors', '#334455,#ddeeff')
    element.setAttribute('background-color', 'rgba(5, 18, 46, 0.22)')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const outline = element.shadowRoot?.querySelector('.outline')
    const corners = [...(element.shadowRoot?.querySelectorAll('[data-corner]') ?? [])]
    const flood = element.shadowRoot?.querySelector('feFlood')
    const animation = element.shadowRoot?.querySelector('animate')

    expect(element).toHaveProperty('colors', '#334455,#ddeeff')
    expect(element).toHaveProperty('backgroundColor', 'rgba(5, 18, 46, 0.22)')
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(outline?.getAttribute('fill')).toBe('rgba(5, 18, 46, 0.22)')
    expect(outline?.getAttribute('stroke')).toBe('#334455')
    expect(outline?.getAttribute('stroke-width')).toBe('2')
    expect(outline?.getAttribute('d')).toBe('M15 5 L 305 5 Q 315 5, 315 15 L 315 165 Q 315 175, 305 175 L 15 175 Q 5 175, 5 165 L 5 15 Q 5 5, 15 5')
    expect(corners.map(corner => corner.getAttribute('data-corner'))).toEqual(['left-top', 'right-top', 'right-bottom', 'left-bottom'])
    expect(corners.map(corner => corner.getAttribute('d'))).toEqual([
      'M 20 5 L 15 5 Q 5 5 5 15 L 5 20',
      'M 300 5 L 305 5 Q 315 5 315 15 L 315 20',
      'M 300 175 L 305 175 Q 315 175 315 165 L 315 160',
      'M 20 175 L 15 175 Q 5 175 5 165 L 5 160',
    ])
    expect(corners.every(corner => corner.getAttribute('stroke') === '#ddeeff')).toBe(true)
    expect(corners.every(corner => corner.getAttribute('filter')?.startsWith('url(#dvk-border-box-10-glow-'))).toBe(true)
    expect(flood?.getAttribute('flood-color')).toBe('rgba(221, 238, 255, 0.7)')
    expect(animation?.getAttribute('values')).toBe('rgba(221, 238, 255, 0.7);rgba(221, 238, 255, 0.3);rgba(221, 238, 255, 0.7)')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('15px 15px 15px 15px')
  })

  it('resolves border-box-10 colors from CSS variables and supports paused glow', async () => {
    register()

    const element = document.createElement('dvk-border-box-10') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#112233')
    element.style.setProperty('--dvk-color-secondary', '#ddeeff')
    element.style.setProperty('--dvk-border-box-10-background', 'rgba(1, 2, 3, 0.4)')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const outline = element.shadowRoot?.querySelector('.outline')
    const corners = [...(element.shadowRoot?.querySelectorAll('[data-corner]') ?? [])]
    const flood = element.shadowRoot?.querySelector('feFlood')

    expect(outline?.getAttribute('stroke')).toBe('#112233')
    expect(outline?.getAttribute('fill')).toBe('rgba(1, 2, 3, 0.4)')
    expect(corners.every(corner => corner.getAttribute('stroke') === '#ddeeff')).toBe(true)
    expect(flood?.getAttribute('flood-color')).toBe('rgba(221, 238, 255, 0.7)')
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as border-box-10 defaults', async () => {
    register()

    const element = document.createElement('dvk-border-box-10') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const outline = element.shadowRoot?.querySelector('.outline')
    const corners = [...(element.shadowRoot?.querySelectorAll('[data-corner]') ?? [])]
    const flood = element.shadowRoot?.querySelector('feFlood')

    expect(outline?.getAttribute('stroke')).toBe('#235fa7')
    expect(corners.every(corner => corner.getAttribute('stroke') === '#4fd2dd')).toBe(true)
    expect(flood?.getAttribute('flood-color')).toBe('rgba(79, 210, 221, 0.7)')
  })

  it('maps border-box-11 public attributes and renders enterprise status rail slices', async () => {
    register()

    const element = document.createElement('dvk-border-box-11')
    element.setAttribute('colors', '#112233,#445566,#77ffaa')
    element.setAttribute('glow-intensity', '1.25')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]
    const extensions = [...(element.shadowRoot?.querySelectorAll('.extension') ?? [])]
    const svgs = [...(element.shadowRoot?.querySelectorAll('svg') ?? [])]
    const slices = [...(element.shadowRoot?.querySelectorAll('[data-slice]') ?? [])]
      .map(slice => slice.getAttribute('data-slice'))
    const rail = element.shadowRoot?.querySelector('[data-rail="outer"]')
    const innerRail = element.shadowRoot?.querySelector('[data-rail="inner"]')
    const statusModule = element.shadowRoot?.querySelector('[data-module="right-status"]')
    const motion = element.shadowRoot?.querySelector('[data-motion="rail-charge"]')
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animate = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#112233,#445566,#77ffaa')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(element).not.toHaveProperty('viewBox')
    expect(tiles).toHaveLength(5)
    expect(extensions).toHaveLength(5)
    expect(svgs).toHaveLength(10)
    expect(slices).toEqual([
      'top-rail',
      'left-rail',
      'right-upper',
      'right-lower',
      'bottom-rail',
      'top-left',
      'top-right',
      'right-stack',
      'bottom-left',
      'bottom-right',
    ])
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '0 0 260 96',
      '1040 0 160 96',
      '1110 190 90 260',
      '0 560 220 80',
      '980 560 220 80',
      '260 28 780 40',
      '0 96 60 464',
      '1110 96 90 94',
      '1110 450 90 110',
      '220 584 760 32',
    ]))
    expect(extensions.every(extension => extension.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
    expect(tiles.some(tile => tile.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(false)
    expect(rail?.getAttribute('stroke')).toContain('dvk-border-box-11-rail-')
    expect(innerRail?.getAttribute('d')).toContain('H1140 V554')
    expect(innerRail?.getAttribute('d')).not.toContain('V184 M1140 456')
    expect(element.shadowRoot?.querySelector('[data-slice="right-upper"] svg')?.getAttribute('viewBox')?.split(' ')[2]).toBe('90')
    expect(element.shadowRoot?.querySelector('[data-slice="right-stack"] svg')?.getAttribute('viewBox')?.split(' ')[2]).toBe('90')
    expect(element.shadowRoot?.querySelector('[data-slice="right-lower"] svg')?.getAttribute('viewBox')?.split(' ')[2]).toBe('90')
    expect(statusModule).not.toBeNull()
    expect(motion).not.toBeNull()
    expect(blurs.every(value => value === '3')).toBe(true)
    expect(animate.length).toBeGreaterThanOrEqual(4)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('21.94px 20.27px 21.94px 19.73px')
  })

  it('resolves border-box-11 colors from CSS variables and supports paused motion', async () => {
    register()

    const element = document.createElement('dvk-border-box-11') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#203040')
    element.style.setProperty('--dvk-color-secondary', '#506070')
    element.style.setProperty('--dvk-color-accent', '#80c090')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const rails = [...(element.shadowRoot?.querySelectorAll('[data-rail]') ?? [])]
    const rightStatus = element.shadowRoot?.querySelector('[data-module="right-status"]')
    const accentNodes = [...(element.shadowRoot?.querySelectorAll('circle') ?? [])]
      .map(circle => circle.getAttribute('fill'))

    expect(rails.some(rail => rail.getAttribute('stroke')?.includes('dvk-border-box-11-rail-'))).toBe(true)
    expect(rightStatus).not.toBeNull()
    expect(accentNodes).toContain('#80c090')
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as border-box-11 defaults', async () => {
    register()

    const element = document.createElement('dvk-border-box-11') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))
    const nodes = [...(element.shadowRoot?.querySelectorAll('circle') ?? [])]
      .map(circle => circle.getAttribute('fill'))

    expect(stops).toContain('#3d7fb8')
    expect(stops).toContain('#6ed7e8')
    expect(stops).toContain('#52f0b5')
    expect(nodes).toContain('#52f0b5')
  })

  it('maps border-box-12 public attributes and renders a minimal chamfer HUD frame', async () => {
    register()

    const element = document.createElement('dvk-border-box-12')
    element.setAttribute('colors', '#112233,#445566,#ddeeff')
    element.setAttribute('glow-intensity', '1.25')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const outerRail = element.shadowRoot?.querySelector('[data-rail="outer"]')
    const innerRail = element.shadowRoot?.querySelector('[data-rail="inner"]')
    const shadowRail = element.shadowRoot?.querySelector('[data-rail="outer-shadow"]')
    const bottomRail = element.shadowRoot?.querySelector('[data-rail="bottom-reinforcement"]')
    const backgroundPanel = element.shadowRoot?.querySelector('[data-panel="background"]')
    const blocks = [...(element.shadowRoot?.querySelectorAll('[data-top-block]') ?? [])]
    const blockGroups = [...(element.shadowRoot?.querySelectorAll('[data-block-group]') ?? [])]
      .map(group => group.getAttribute('data-block-group'))
    const sideFolds = [...(element.shadowRoot?.querySelectorAll('[data-side-fold]') ?? [])]
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))
    const blur = element.shadowRoot?.querySelector('feGaussianBlur')
    const flood = element.shadowRoot?.querySelector('feFlood')
    const animations = [
      ...(element.shadowRoot?.querySelectorAll('animate') ?? []),
      ...(element.shadowRoot?.querySelectorAll('animateTransform') ?? []),
    ]

    expect(element).toHaveProperty('colors', '#112233,#445566,#ddeeff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(panel?.getAttribute('viewBox')).toBe('0 0 320 180')
    expect(backgroundPanel?.getAttribute('x')).toBe('8.42')
    expect(backgroundPanel?.getAttribute('y')).toBe('13.01')
    expect(backgroundPanel?.getAttribute('width')).toBe('303.17')
    expect(backgroundPanel?.getAttribute('height')).toBe('154.94')
    expect(outerRail?.getAttribute('stroke')).toContain('dvk-border-box-12-rail-')
    expect(outerRail?.getAttribute('stroke-width')).toBe('1')
    expect(outerRail?.getAttribute('d')).toBe('M 14.54 7.65 L 75.37 7.65 L 80.72 13.01 L 239.28 13.01 L 244.63 7.65 L 305.46 7.65 L 314.26 16.45 L 314.26 66.76 L 310.82 70.2 L 310.82 109.8 L 314.26 113.24 L 314.26 163.74 L 305.46 172.54 L 14.54 172.54 L 5.74 163.74 L 5.74 113.24 L 9.18 109.8 L 9.18 70.2 L 5.74 66.76 L 5.74 16.45 Z')
    expect(innerRail?.getAttribute('stroke')).toBe('rgba(68, 85, 102, 0.58)')
    expect(innerRail?.getAttribute('stroke-width')).toBe('0.7')
    expect(innerRail?.getAttribute('d')).toBe('M 15.88 9.95 L 73.84 9.95 L 79.19 15.11 L 240.81 15.11 L 246.16 9.95 L 304.12 9.95 L 311.58 17.41 L 311.58 65.8 L 308.14 69.25 L 308.14 110.75 L 311.58 114.2 L 311.58 162.4 L 304.12 170.05 L 15.88 170.05 L 8.42 162.4 L 8.42 114.2 L 11.86 110.75 L 11.86 69.25 L 8.42 65.8 L 8.42 17.41 Z')
    expect(shadowRail?.getAttribute('stroke')).toBe('rgba(17, 34, 51, 0.28)')
    expect(shadowRail?.getAttribute('stroke-width')).toBe('2.35')
    expect(blockGroups).toEqual(['left', 'right'])
    expect(blocks).toHaveLength(6)
    expect(blocks.map(block => block.getAttribute('fill')).every(fill => fill?.includes('dvk-border-box-12-block-'))).toBe(true)
    expect(blocks[0].getAttribute('points')).toBe('42.08,10.71 48.59,10.71 52.41,14.92 45.91,14.92')
    expect(blocks[3].getAttribute('points')).toBe('253.05,10.71 259.55,10.71 255.73,14.92 249.22,14.92')
    expect(sideFolds.map(fold => fold.getAttribute('data-side-fold'))).toEqual(['left', 'right'])
    expect(sideFolds.map(fold => fold.getAttribute('d'))).toEqual([
      'M 5.74 66.76 L 9.18 70.2 L 9.18 109.8 L 5.74 113.24',
      'M 314.26 66.76 L 310.82 70.2 L 310.82 109.8 L 314.26 113.24',
    ])
    expect(sideFolds.every(fold => fold.getAttribute('stroke-width') === '2')).toBe(true)
    expect(bottomRail?.getAttribute('d')).toBe('M 14.54 172.54 L 305.46 172.54')
    expect(stops).toEqual([
      'rgba(17, 34, 51, 0.72)',
      '#445566',
      'rgba(17, 34, 51, 0.72)',
      '#ddeeff',
      '#112233',
    ])
    expect(blur?.getAttribute('stdDeviation')).toBe('2.75')
    expect(flood?.getAttribute('flood-color')).toBe('#112233')
    expect(flood?.getAttribute('flood-opacity')).toBe('0.9')
    expect(animations).toHaveLength(6)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('16.07px 19px 14px 19px')
  })

  it('extends border-box-12 straight rails without deforming fold angles', async () => {
    register()

    const element = document.createElement('dvk-border-box-12') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const sourceOuterPoints = extractPathPoints(element.shadowRoot?.querySelector('[data-rail="outer"]')?.getAttribute('d') ?? '')
    const sourceBottomPoints = extractPathPoints(element.shadowRoot?.querySelector('[data-rail="bottom-reinforcement"]')?.getAttribute('d') ?? '')
    const sourceTopMiddleLength = sourceOuterPoints[3].x - sourceOuterPoints[2].x
    const sourceBottomLength = sourceBottomPoints[1].x - sourceBottomPoints[0].x

    emitResize(640, 180)
    await element.updateComplete

    const wideOuterPoints = extractPathPoints(element.shadowRoot?.querySelector('[data-rail="outer"]')?.getAttribute('d') ?? '')
    const wideBottomPoints = extractPathPoints(element.shadowRoot?.querySelector('[data-rail="bottom-reinforcement"]')?.getAttribute('d') ?? '')
    const wideLeftTopFold = segmentDelta(wideOuterPoints[1], wideOuterPoints[2])
    const wideRightTopFold = segmentDelta(wideOuterPoints[3], wideOuterPoints[4])
    const wideRightSideFold = segmentDelta(wideOuterPoints[7], wideOuterPoints[8])

    expect(Math.abs(wideLeftTopFold.dx - wideLeftTopFold.dy)).toBeLessThan(0.02)
    expect(Math.abs(wideRightTopFold.dx - wideRightTopFold.dy)).toBeLessThan(0.02)
    expect(Math.abs(wideRightSideFold.dx - wideRightSideFold.dy)).toBeLessThan(0.02)
    expect(wideOuterPoints[3].x - wideOuterPoints[2].x).toBeGreaterThan(sourceTopMiddleLength)
    expect(wideBottomPoints[1].x - wideBottomPoints[0].x).toBeGreaterThan(sourceBottomLength)

    emitResize(320, 360)
    await element.updateComplete

    const tallOuterPoints = extractPathPoints(element.shadowRoot?.querySelector('[data-rail="outer"]')?.getAttribute('d') ?? '')
    const tallRightSideFold = segmentDelta(tallOuterPoints[7], tallOuterPoints[8])

    expect(Math.abs(tallRightSideFold.dx - tallRightSideFold.dy)).toBeLessThan(0.02)
    expect(tallOuterPoints[7].y).toBeGreaterThan(wideOuterPoints[7].y)
    expect(tallOuterPoints[10].y).toBeGreaterThan(wideOuterPoints[10].y)
  })

  it('resolves border-box-12 colors from CSS variables and supports paused block motion', async () => {
    register()

    const element = document.createElement('dvk-border-box-12') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#203040')
    element.style.setProperty('--dvk-color-secondary', '#506070')
    element.style.setProperty('--dvk-color-accent', '#90e0ff')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const outerRail = element.shadowRoot?.querySelector('[data-rail="outer"]')
    const innerRail = element.shadowRoot?.querySelector('[data-rail="inner"]')
    const blocks = [...(element.shadowRoot?.querySelectorAll('[data-top-block]') ?? [])]
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))

    expect(outerRail?.getAttribute('stroke')).toContain('dvk-border-box-12-rail-')
    expect(innerRail?.getAttribute('stroke')).toBe('rgba(80, 96, 112, 0.58)')
    expect(blocks.map(block => block.getAttribute('fill')).every(fill => fill?.includes('dvk-border-box-12-block-'))).toBe(true)
    expect(stops).toEqual([
      'rgba(32, 48, 64, 0.72)',
      '#506070',
      'rgba(32, 48, 64, 0.72)',
      '#90e0ff',
      '#203040',
    ])
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as border-box-12 defaults', async () => {
    register()

    const element = document.createElement('dvk-border-box-12') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const outerRail = element.shadowRoot?.querySelector('[data-rail="outer"]')
    const innerRail = element.shadowRoot?.querySelector('[data-rail="inner"]')
    const blocks = [...(element.shadowRoot?.querySelectorAll('[data-top-block]') ?? [])]
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))

    expect(outerRail?.getAttribute('stroke')).toContain('dvk-border-box-12-rail-')
    expect(innerRail?.getAttribute('stroke')).toBe('rgba(86, 240, 255, 0.58)')
    expect(blocks.map(block => block.getAttribute('fill')).every(fill => fill?.includes('dvk-border-box-12-block-'))).toBe(true)
    expect(stops).toEqual([
      'rgba(25, 216, 255, 0.72)',
      '#56f0ff',
      'rgba(25, 216, 255, 0.72)',
      '#b9f8ff',
      '#19d8ff',
    ])
  })

  it('maps border-box-13 public attributes and renders split horizon carrier rails', async () => {
    register()

    const element = document.createElement('dvk-border-box-13')
    element.setAttribute('colors', '#112233,#445566,#ddeeff')
    element.setAttribute('glow-intensity', '1.25')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const primaryRails = [...(element.shadowRoot?.querySelectorAll('[data-rail="primary"]') ?? [])]
    const coreRails = [...(element.shadowRoot?.querySelectorAll('[data-rail="core"]') ?? [])]
    const signalRails = [...(element.shadowRoot?.querySelectorAll('[data-signal-rail]') ?? [])]
    const signalSparks = [...(element.shadowRoot?.querySelectorAll('[data-signal-spark]') ?? [])]
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))
    const blur = element.shadowRoot?.querySelector('feGaussianBlur')
    const flood = element.shadowRoot?.querySelector('feFlood')
    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#112233,#445566,#ddeeff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(panel?.getAttribute('viewBox')).toBe('0 0 320 180')
    expect(element.shadowRoot?.querySelector('[data-panel="background"]')).toBeNull()
    expect(primaryRails).toHaveLength(25)
    expect(coreRails).toHaveLength(25)
    expect(signalRails).toHaveLength(0)
    expect(signalSparks).toHaveLength(8)
    expect(primaryRails[0].getAttribute('stroke')).toBeNull()
    expect(primaryRails[0].closest('[data-layer="primary-rails"]')?.getAttribute('stroke')).toContain('dvk-border-box-13-rail-')
    expect(primaryRails[0].closest('[data-layer="primary-rails"]')?.getAttribute('stroke-width')).toBe('3')
    expect(primaryRails[0].closest('[data-layer="primary-rails"]')?.getAttribute('opacity')).toBeNull()
    expect(primaryRails[0].closest('[data-layer="primary-rails"]')?.querySelector('animate')).toBeNull()
    expect(coreRails[0].closest('[data-layer="core-rails"]')?.getAttribute('stroke-width')).toBe('1.2')
    expect(signalSparks[0].closest('[data-layer="signal-sparks"]')?.getAttribute('fill')).toContain('dvk-border-box-13-signal-')
    expect(signalSparks[0].getAttribute('cx')).toBe('2.15')
    expect(signalSparks[0].getAttribute('cy')).toBe('2.15')
    expect(signalSparks[0].getAttribute('r')).toBe('2.2')
    expect(signalSparks[0].getAttribute('opacity')).toBe('0.2')
    expect(signalSparks[0].getAttribute('data-motion')).toBe('endpoint-sparkle')
    expect(signalSparks[0].querySelector('animate[attributeName="stroke-dashoffset"]')).toBeNull()
    expect(signalSparks[0].querySelector('animate[attributeName="stroke-width"]')).toBeNull()
    expect(signalSparks[0].querySelector('animate[attributeName="opacity"]')?.getAttribute('values')).toBe('0.12;0.72;0.18;0.46;0.12')
    expect(signalSparks[0].querySelector('animate[attributeName="r"]')?.getAttribute('values')).toBe('1.6;3.4;1.9;2.7;1.6')
    expect(primaryRails[0].getAttribute('d')).toBe('M 2.15 2.15 L 12.35 2.15')
    expect(primaryRails[18].getAttribute('d')).toBe('M 151.05 177.85 L 168.95 177.85')
    expect(stops).toEqual([
      'rgba(17, 34, 51, 0.62)',
      '#445566',
      'rgba(17, 34, 51, 0.62)',
      '#ddeeff',
      'rgba(221, 238, 255, 0.72)',
      'rgba(221, 238, 255, 0.08)',
    ])
    expect(blur?.getAttribute('stdDeviation')).toBe('5')
    expect(flood).toBeNull()
    expect(animations).toHaveLength(16)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('16px 16px 16px 16px')
  })

  it('extends only border-box-13 bottom middle rails without deforming corner modules', async () => {
    register()

    const element = document.createElement('dvk-border-box-13') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(400, 180)
    await element.updateComplete

    const sourceRails = [...(element.shadowRoot?.querySelectorAll('[data-rail="primary"]') ?? [])]
    const sourceTopRail = extractPathPoints(sourceRails[3].getAttribute('d') ?? '')
    const sourceBottomLeftRail = extractPathPoints(sourceRails[16].getAttribute('d') ?? '')
    const sourceBottomCenterBreak = extractPathPoints(sourceRails[18].getAttribute('d') ?? '')
    const sourceTopLength = sourceTopRail[1].x - sourceTopRail[0].x
    const sourceBottomLeftLength = sourceBottomLeftRail[1].x - sourceBottomLeftRail[0].x
    const sourceCenterBreakLength = sourceBottomCenterBreak[1].x - sourceBottomCenterBreak[0].x

    emitResize(640, 180)
    await element.updateComplete

    const wideRails = [...(element.shadowRoot?.querySelectorAll('[data-rail="primary"]') ?? [])]
    const wideTopChamfer = extractPathPoints(wideRails[2].getAttribute('d') ?? '')
    const wideTopRail = extractPathPoints(wideRails[3].getAttribute('d') ?? '')
    const wideBottomLeftRail = extractPathPoints(wideRails[16].getAttribute('d') ?? '')
    const wideBottomCenterBreak = extractPathPoints(wideRails[18].getAttribute('d') ?? '')
    const wideBottomRightRail = extractPathPoints(wideRails[20].getAttribute('d') ?? '')
    const wideTopChamferDelta = segmentDelta(wideTopChamfer[0], wideTopChamfer[1])
    const wideBottomLeftLength = wideBottomLeftRail[1].x - wideBottomLeftRail[0].x
    const wideBottomRightLength = wideBottomRightRail[1].x - wideBottomRightRail[0].x
    const wideCenterBreakLength = wideBottomCenterBreak[1].x - wideBottomCenterBreak[0].x

    expect(wideTopRail[1].x - wideTopRail[0].x).toBeCloseTo(sourceTopLength, 1)
    expect(wideBottomLeftLength).toBeGreaterThan(sourceBottomLeftLength)
    expect(wideBottomRightLength).toBeGreaterThan(sourceBottomLeftLength)
    expect(wideCenterBreakLength).toBeCloseTo(sourceCenterBreakLength, 1)
    expect(wideTopChamferDelta.dx / wideTopChamferDelta.dy).toBeCloseTo(17 / 13, 1)

    emitResize(640, 360)
    await element.updateComplete

    const tallRails = [...(element.shadowRoot?.querySelectorAll('[data-rail="primary"]') ?? [])]
    const tallTopCap = extractPathPoints(tallRails[0].getAttribute('d') ?? '')
    const tallLeftSide = extractPathPoints(tallRails[10].getAttribute('d') ?? '')
    const tallBottomLeftCenter = extractPathPoints(tallRails[17].getAttribute('d') ?? '')
    const tallModuleScale = (tallTopCap[1].x - tallTopCap[0].x) / 57
    const tallBottomLeftCenterDelta = segmentDelta(tallBottomLeftCenter[0], tallBottomLeftCenter[1])

    expect(tallLeftSide[1].y - tallLeftSide[0].y).toBeCloseTo(150 * tallModuleScale, 1)
    expect(tallBottomLeftCenterDelta.dx / tallBottomLeftCenterDelta.dy).toBeCloseTo(23 / 20, 1)
  })

  it('resolves border-box-13 colors from CSS variables and supports paused endpoint sparkles', async () => {
    register()

    const element = document.createElement('dvk-border-box-13') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#203040')
    element.style.setProperty('--dvk-color-secondary', '#506070')
    element.style.setProperty('--dvk-color-accent', '#90e0ff')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const primaryLayer = element.shadowRoot?.querySelector('[data-layer="primary-rails"]')
    const coreLayer = element.shadowRoot?.querySelector('[data-layer="core-rails"]')
    const signalSparkLayer = element.shadowRoot?.querySelector('[data-layer="signal-sparks"]')
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))

    expect(primaryLayer?.getAttribute('stroke')).toContain('dvk-border-box-13-rail-')
    expect(primaryLayer?.querySelector('animate')).toBeNull()
    expect(coreLayer?.getAttribute('stroke')).toBe('rgba(80, 96, 112, 0.94)')
    expect(signalSparkLayer?.getAttribute('fill')).toContain('dvk-border-box-13-signal-')
    expect(stops).toEqual([
      'rgba(32, 48, 64, 0.62)',
      '#506070',
      'rgba(32, 48, 64, 0.62)',
      '#90e0ff',
      'rgba(144, 224, 255, 0.72)',
      'rgba(144, 224, 255, 0.08)',
    ])
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('maps border-box-14 public attributes and renders shallow signal-port corners', async () => {
    register()

    const element = document.createElement('dvk-border-box-14')
    element.setAttribute('colors', '#112233,#445566,#ddeeff')
    element.setAttribute('glow-intensity', '1.25')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const railLayer = element.shadowRoot?.querySelector('[data-layer="signal-port-rails"]')
    const nodeLayer = element.shadowRoot?.querySelector('[data-layer="signal-port-nodes"]')
    const rails = [...(element.shadowRoot?.querySelectorAll('[data-corner-rail]') ?? [])]
    const nodes = [...(element.shadowRoot?.querySelectorAll('[data-signal-node]') ?? [])]
    const pads = [...(element.shadowRoot?.querySelectorAll('[data-contact-pad]') ?? [])]
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))
    const blur = element.shadowRoot?.querySelector('feGaussianBlur')
    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#112233,#445566,#ddeeff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(panel?.getAttribute('viewBox')).toBe('0 0 320 180')
    expect(rails).toHaveLength(48)
    expect(nodes).toHaveLength(8)
    expect(pads).toHaveLength(16)
    expect(railLayer?.getAttribute('stroke')).toContain('dvk-border-box-14-rail-')
    expect(railLayer?.getAttribute('stroke-width')).toBe('2.6')
    expect(nodeLayer?.getAttribute('fill')).toContain('dvk-border-box-14-node-')
    expect(rails.map(rail => rail.getAttribute('d')).slice(0, 12)).toEqual([
      'M 8 80 L 8 59.2',
      'M 8 59.2 L 8 43.2',
      'M 8 43.2 L 8 12',
      'M 8 12 L 12 12',
      'M 12 12 L 12 8',
      'M 12 8 L 80.32 8',
      'M 80.32 8 L 96.32 8',
      'M 96.32 8 L 138 8',
      'M 8 32 L 12 32',
      'M 8 62.4 L 12 62.4',
      'M 32 8 L 32 12',
      'M 62.4 8 L 62.4 12',
    ])
    expect(rails.map(rail => rail.getAttribute('d')).slice(-12)).toEqual([
      'M 312 100 L 312 120.8',
      'M 312 120.8 L 312 136.8',
      'M 312 136.8 L 312 168',
      'M 312 168 L 308 168',
      'M 308 168 L 308 172',
      'M 308 172 L 239.68 172',
      'M 239.68 172 L 223.68 172',
      'M 223.68 172 L 182 172',
      'M 312 148 L 308 148',
      'M 312 117.6 L 308 117.6',
      'M 288 172 L 288 168',
      'M 257.6 172 L 257.6 168',
    ])
    expect(nodes[0].getAttribute('cx')).toBe('88.32')
    expect(nodes[0].getAttribute('cy')).toBe('8')
    expect(nodes[0].getAttribute('r')).toBe('2.2')
    expect(nodes[0].getAttribute('opacity')).toBe('0.38')
    expect(pads.map(pad => [pad.getAttribute('cx'), pad.getAttribute('cy')]).slice(0, 4)).toEqual([
      ['12', '32'],
      ['12', '62.4'],
      ['32', '12'],
      ['62.4', '12'],
    ])
    expect(nodes[0].querySelector('animate[attributeName="opacity"]')?.getAttribute('values')).toBe('0.28;0.78;0.38;0.58;0.28')
    expect(nodes[0].querySelector('animate[attributeName="r"]')?.getAttribute('values')).toBe('2.1;3.2;2.2;2.7;2.1')
    expect(stops).toEqual([
      'rgba(17, 34, 51, 0.96)',
      '#445566',
      'rgba(17, 34, 51, 0.96)',
      '#ddeeff',
      'rgba(221, 238, 255, 0.66)',
      'rgba(221, 238, 255, 0.1)',
    ])
    expect(blur?.getAttribute('stdDeviation')).toBe('4')
    expect(animations).toHaveLength(16)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('14px 14px 14px 14px')
  })

  it('resolves border-box-14 colors from CSS variables and supports paused node pulses', async () => {
    register()

    const element = document.createElement('dvk-border-box-14') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#203040')
    element.style.setProperty('--dvk-color-secondary', '#506070')
    element.style.setProperty('--dvk-color-accent', '#90e0ff')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const railLayer = element.shadowRoot?.querySelector('[data-layer="signal-port-rails"]')
    const nodeLayer = element.shadowRoot?.querySelector('[data-layer="signal-port-nodes"]')
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))

    expect(railLayer?.getAttribute('stroke')).toContain('dvk-border-box-14-rail-')
    expect(railLayer?.getAttribute('stroke-width')).toBe('2.6')
    expect(nodeLayer?.getAttribute('fill')).toContain('dvk-border-box-14-node-')
    expect(stops).toEqual([
      'rgba(32, 48, 64, 0.96)',
      '#506070',
      'rgba(32, 48, 64, 0.96)',
      '#90e0ff',
      'rgba(144, 224, 255, 0.66)',
      'rgba(144, 224, 255, 0.1)',
    ])
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('keeps border-box-14 corner reach shallow across aspect ratios', async () => {
    register()

    const element = document.createElement('dvk-border-box-14') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const sourceRails = [...(element.shadowRoot?.querySelectorAll('[data-corner-rail]') ?? [])]
    const sourceFirstRail = sourceRails[0].getAttribute('d')

    emitResize(640, 180)
    await element.updateComplete

    const wideRails = [...(element.shadowRoot?.querySelectorAll('[data-corner-rail]') ?? [])]

    expect(wideRails).toHaveLength(48)
    expect(wideRails[0].getAttribute('d')).toBe(sourceFirstRail)
    expect(wideRails.at(-1)?.getAttribute('d')).toBe('M 577.6 172 L 577.6 168')

    emitResize(320, 420)
    await element.updateComplete

    const tallRails = [...(element.shadowRoot?.querySelectorAll('[data-corner-rail]') ?? [])]

    expect(tallRails[0].getAttribute('d')).toBe('M 8 138 L 8 96.32')
    expect(tallRails.at(-1)?.getAttribute('d')).toBe('M 212.36 412 L 212.36 408')

    emitResize(1, 1200)
    await element.updateComplete

    expect(element.shadowRoot?.querySelectorAll('[data-corner-rail]')).toHaveLength(48)
    expect(element.shadowRoot?.querySelectorAll('[data-signal-node]')).toHaveLength(8)
    expect(element.shadowRoot?.querySelectorAll('[data-contact-pad]')).toHaveLength(16)
  })

  it('maps border-box-15 public attributes and recreates DataV BorderBox6 geometry', async () => {
    register()

    const element = document.createElement('dvk-border-box-15')
    element.setAttribute('colors', 'rgba(255, 255, 255, 0.42),#8ea0b8')
    element.setAttribute('background-color', 'rgba(5, 18, 46, 0.28)')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const graphic = element.shadowRoot?.querySelector('[part="graphic"]')
    const panel = element.shadowRoot?.querySelector('polygon')
    const circles = [...(element.shadowRoot?.querySelectorAll('circle') ?? [])]
    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]

    expect(element).toHaveProperty('colors', 'rgba(255, 255, 255, 0.42),#8ea0b8')
    expect(element).toHaveProperty('backgroundColor', 'rgba(5, 18, 46, 0.28)')
    expect(element).not.toHaveProperty('viewBox')
    expect(graphic?.getAttribute('width')).toBe('320')
    expect(graphic?.getAttribute('height')).toBe('180')
    expect(panel?.getAttribute('points')).toBe('9,7 311,7 311,173 9,173')
    expect(panel?.getAttribute('fill')).toBe('rgba(5, 18, 46, 0.28)')
    expect(circles.map(circle => [circle.getAttribute('cx'), circle.getAttribute('cy'), circle.getAttribute('r'), circle.getAttribute('fill')])).toEqual([
      ['5', '5', '2', '#8ea0b8'],
      ['315', '5', '2', '#8ea0b8'],
      ['315', '175', '2', '#8ea0b8'],
      ['5', '175', '2', '#8ea0b8'],
    ])
    expect(lines.map(line => line.getAttribute('points'))).toEqual([
      '10,4 310,4',
      '10,176 310,176',
      '5,70 5,110',
      '315,70 315,110',
      '3,10 3,50',
      '7,30 7,80',
      '317,10 317,50',
      '313,30 313,80',
      '3,170 3,130',
      '7,150 7,100',
      '317,170 317,130',
      '313,150 313,100',
    ])
    expect(lines.every(line => line.getAttribute('stroke') === 'rgba(255, 255, 255, 0.42)')).toBe(true)
    expect(lines.every(line => line.getAttribute('stroke-width') === null)).toBe(true)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('10px 10px 10px 10px')
  })

  it('resolves border-box-15 colors and background from CSS variables', async () => {
    register()

    const element = document.createElement('dvk-border-box-15') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#ccd8e8')
    element.style.setProperty('--dvk-color-secondary', '#718299')
    element.style.setProperty('--dvk-border-box-15-background', 'rgba(1, 2, 3, 0.34)')
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('polygon')?.getAttribute('fill')).toBe('rgba(1, 2, 3, 0.34)')
    expect(element.shadowRoot?.querySelector('circle')?.getAttribute('fill')).toBe('#718299')
    expect(element.shadowRoot?.querySelector('polyline')?.getAttribute('stroke')).toBe('#ccd8e8')
  })

  it('maps border-box-16 public attributes and renders a floating thin CPU laminate rail', async () => {
    register()

    const element = document.createElement('dvk-border-box-16')
    element.setAttribute('colors', '#112233,#445566,#ddeeff')
    element.setAttribute('glow-intensity', '1.25')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const panel = element.shadowRoot?.querySelector('.panel')
    const outerRail = element.shadowRoot?.querySelector('[data-outer-rail]')
    const outerSegments = [...(element.shadowRoot?.querySelectorAll('[data-outer-segment]') ?? [])]
    const innerHairline = element.shadowRoot?.querySelector('[data-inner-hairline]')
    const innerRails = [...(element.shadowRoot?.querySelectorAll('[data-inner-rail]') ?? [])]
    const underlayRails = [...(element.shadowRoot?.querySelectorAll('[data-underlay-rail]') ?? [])]
    const pinLayer = element.shadowRoot?.querySelector('[data-layer="chip-pins"]')
    const padLayer = element.shadowRoot?.querySelector('[data-layer="chip-pads"]')
    const pins = [...(element.shadowRoot?.querySelectorAll('[data-chip-pin]') ?? [])]
    const activePins = [...(element.shadowRoot?.querySelectorAll('[data-active-pin="true"]') ?? [])]
    const pads = [...(element.shadowRoot?.querySelectorAll('[data-chip-pad]') ?? [])]
    const activePads = [...(element.shadowRoot?.querySelectorAll('[data-active-pad="true"]') ?? [])]
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))
    const blur = element.shadowRoot?.querySelector('feGaussianBlur')
    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#112233,#445566,#ddeeff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(element).not.toHaveProperty('viewBox')
    expect(panel?.getAttribute('width')).toBe('320')
    expect(panel?.getAttribute('height')).toBe('180')
    expect(panel?.getAttribute('viewBox')).toBe('0 0 320 180')
    expect(outerRail?.getAttribute('stroke')).toContain('dvk-border-box-16-rail-')
    expect(outerRail?.getAttribute('stroke-width')).toBe('1.25')
    expect(outerSegments.map(segment => segment.getAttribute('d')).slice(0, 5)).toEqual([
      'M 18 5 L 124.8 5',
      'M 150.4 5 L 169.6 5',
      'M 195.2 5 L 302 5',
      'M 315 18 L 315 75.6',
      'M 315 104.4 L 315 162',
    ])
    expect(outerSegments.map(segment => segment.getAttribute('d')).slice(-4)).toEqual([
      'M 302 5 L 315 18',
      'M 315 162 L 302 175',
      'M 18 175 L 5 162',
      'M 5 18 L 18 5',
    ])
    expect(underlayRails).toHaveLength(8)
    expect(underlayRails[0].getAttribute('y1')).toBe('9')
    expect(innerHairline?.getAttribute('stroke-width')).toBe('0.75')
    expect(innerRails.map(rail => [
      rail.getAttribute('data-inner-rail'),
      rail.getAttribute('x1'),
      rail.getAttribute('y1'),
      rail.getAttribute('x2'),
      rail.getAttribute('y2'),
    ])).toEqual([
      ['top', '30', '14', '290', '14'],
      ['right', '306', '30', '306', '150'],
      ['bottom', '290', '166', '30', '166'],
      ['left', '14', '150', '14', '30'],
    ])
    expect(pinLayer?.getAttribute('stroke')).toContain('dvk-border-box-16-pin-')
    expect(pinLayer?.getAttribute('stroke-width')).toBe('1.15')
    expect(padLayer?.getAttribute('fill')).toBe('#ddeeff')
    expect(pins).toHaveLength(20)
    expect(activePins).toHaveLength(5)
    expect(pads).toHaveLength(12)
    expect(activePads).toHaveLength(3)
    expect(stops).toEqual([
      'rgba(17, 34, 51, 0.94)',
      'rgba(68, 85, 102, 0.72)',
      'rgba(17, 34, 51, 0.94)',
      'rgba(68, 85, 102, 0.5)',
      'rgba(221, 238, 255, 0.92)',
      'rgba(68, 85, 102, 0.5)',
    ])
    expect(blur?.getAttribute('stdDeviation')).toBe('3')
    expect(animations).toHaveLength(8)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('20px 20px 20px 20px')
  })

  it('resolves border-box-16 colors from CSS variables and supports paused pin pulses', async () => {
    register()

    const element = document.createElement('dvk-border-box-16') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#203040')
    element.style.setProperty('--dvk-color-secondary', '#506070')
    element.style.setProperty('--dvk-color-accent', '#90e0ff')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(320, 180)
    await element.updateComplete

    const outerRail = element.shadowRoot?.querySelector('[data-outer-rail]')
    const pinLayer = element.shadowRoot?.querySelector('[data-layer="chip-pins"]')
    const padLayer = element.shadowRoot?.querySelector('[data-layer="chip-pads"]')
    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
      .map(stop => stop.getAttribute('stop-color'))

    expect(outerRail?.getAttribute('stroke')).toContain('dvk-border-box-16-rail-')
    expect(pinLayer?.getAttribute('stroke')).toContain('dvk-border-box-16-pin-')
    expect(padLayer?.getAttribute('fill')).toBe('#90e0ff')
    expect(stops).toEqual([
      'rgba(32, 48, 64, 0.94)',
      'rgba(80, 96, 112, 0.72)',
      'rgba(32, 48, 64, 0.94)',
      'rgba(80, 96, 112, 0.5)',
      'rgba(144, 224, 255, 0.92)',
      'rgba(80, 96, 112, 0.5)',
    ])
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('keeps border-box-16 pin count bounded across extreme host sizes', async () => {
    register()

    const element = document.createElement('dvk-border-box-16') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(960, 120)
    await element.updateComplete

    expect(element.shadowRoot?.querySelectorAll('[data-chip-pin]')).toHaveLength(16)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dvk-border-box-auto-padding')).toBe('20px 20px 20px 20px')

    emitResize(1, 1200)
    await element.updateComplete

    expect(element.shadowRoot?.querySelectorAll('[data-chip-pin]')).toHaveLength(12)
    expect(element.shadowRoot?.querySelectorAll('[data-chip-pad]')).toHaveLength(12)
  })

  it('maps decoration-1 attributes and renders animated bars', async () => {
    register()

    const element = document.createElement('dvk-decoration-1') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('colors', '#7acaec,#4fd2dd')
    element.setAttribute('bar-width', '8')
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 35)
    await element.updateComplete

    const bars = element.shadowRoot?.querySelectorAll('rect') ?? []
    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#7acaec,#4fd2dd')
    expect(element).toHaveProperty('barWidth', 8)
    expect(element.shadowRoot?.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 300 35')
    expect(bars).toHaveLength(40)
    expect(bars[0]?.getAttribute('width')).toBe('8')
    expect(animations).toHaveLength(80)
  })

  it('resolves decoration-1 colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dvk-decoration-1') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#123456')
    element.style.setProperty('--dvk-color-secondary', '#abcdef')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 35)
    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('rect') ?? [])]
      .map(rect => rect.getAttribute('fill'))

    expect(fills).toContain('#123456')
    expect(fills).toContain('#abcdef')
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('omits decoration-1 animation nodes when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))

    register()

    const element = document.createElement('dvk-decoration-1') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 35)
    await element.updateComplete

    expect(element.shadowRoot?.querySelectorAll('rect')).toHaveLength(40)
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('maps decoration-2 attributes and renders dotted rows', async () => {
    register()

    const element = document.createElement('dvk-decoration-2') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('colors', '#7acaec,transparent')
    element.setAttribute('point-size', '8')
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 35)
    await element.updateComplete

    const points = element.shadowRoot?.querySelectorAll('rect') ?? []
    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#7acaec,transparent')
    expect(element).toHaveProperty('pointSize', 8)
    expect(element.shadowRoot?.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 300 35')
    expect(points).toHaveLength(50)
    expect(Number(points[0]?.getAttribute('x'))).toBeCloseTo(7.538)
    expect(Number(points[0]?.getAttribute('y'))).toBeCloseTo(7.667)
    expect(points[0]?.getAttribute('width')).toBe('8')
    expect(points[0]?.getAttribute('height')).toBe('8')
    expect(animations.length).toBeGreaterThan(0)
    expect(animations[0]?.getAttribute('attributeName')).toBe('fill')
    expect(animations[0]?.getAttribute('values')).toBe('#7acaec;transparent')
  })

  it('resolves decoration-2 colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dvk-decoration-2') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#123456')
    element.style.setProperty('--dvk-color-secondary', '#abcdef')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 35)
    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('rect') ?? [])]
      .map(rect => rect.getAttribute('fill'))

    expect(fills).toEqual(Array.from({ length: 50 }, () => '#123456'))
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('maps decoration-3 attributes and renders responsive angular lines', async () => {
    register()

    const element = document.createElement('dvk-decoration-3') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('colors', '#18f0ff,#2b7cff')
    element.setAttribute('duration', '2.4')
    document.body.append(element)

    await element.updateComplete
    emitResize(500, 100)
    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const lines = element.shadowRoot?.querySelectorAll('polyline') ?? []
    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('colors', '#18f0ff,#2b7cff')
    expect(element).toHaveProperty('duration', 2.4)
    expect(svg?.getAttribute('width')).toBe('500')
    expect(svg?.getAttribute('height')).toBe('100')
    expect(svg?.hasAttribute('viewBox')).toBe(false)
    expect(lines).toHaveLength(2)
    expect(lines[0]?.getAttribute('points')).toBe('0,20 90,20 100,40 125,40 135,60 360,60 375,40 400,40 410,20 500,20')
    expect(lines[1]?.getAttribute('points')).toBe('150,80 350,80')
    expect(lines[0]?.getAttribute('stroke')).toBe('#18f0ff')
    expect(lines[1]?.getAttribute('stroke')).toBe('#2b7cff')
    expect(animations).toHaveLength(2)
    expect(animations[0]?.getAttribute('attributeName')).toBe('stroke-dasharray')
    expect(animations[0]?.getAttribute('dur')).toBe('2.4s')
    expect(animations[0]?.getAttribute('keySplines')).toBe('0.4,1,0.49,0.98')
  })

  it('supports decoration-3 DataV-compatible dur attribute', async () => {
    register()

    const element = document.createElement('dvk-decoration-3') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('dur', '0.8')
    document.body.append(element)

    await element.updateComplete
    emitResize(360, 40)
    await element.updateComplete

    const animations = element.shadowRoot?.querySelectorAll('animate') ?? []

    expect(element).toHaveProperty('dur', 0.8)
    expect(animations).toHaveLength(2)
    expect([...animations].map(animation => animation.getAttribute('dur'))).toEqual(['0.8s', '0.8s'])
    expect([...animations].map(animation => animation.getAttribute('repeatCount'))).toEqual(['indefinite', 'indefinite'])
  })

  it('resolves decoration-3 colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dvk-decoration-3') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#123456')
    element.style.setProperty('--dvk-color-secondary', '#abcdef')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 60)
    await element.updateComplete

    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]

    expect(lines.map(line => line.getAttribute('stroke'))).toEqual(['#123456', '#abcdef'])
    expect(lines[0]?.getAttribute('points')).toBe('0,12 54,12 60,24 75,24 81,36 216,36 225,24 240,24 246,12 300,12')
    expect(lines[1]?.getAttribute('points')).toBe('90,48 210,48')
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('uses datav-kit colors as decoration-3 fallback colors', async () => {
    register()

    const element = document.createElement('dvk-decoration-3') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 60)
    await element.updateComplete

    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]

    expect(lines.map(line => line.getAttribute('stroke'))).toEqual(['#18f0ff', '#2b7cff'])
  })

  it('maps decoration-4 attributes and renders responsive Decoration11 frame', async () => {
    register()

    const element = document.createElement('dvk-decoration-4') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('colors', '#18f0ff,#2b7cff')
    element.innerHTML = '<span>Center</span>'
    document.body.append(element)

    await element.updateComplete
    emitResize(240, 80)
    await element.updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const polygons = element.shadowRoot?.querySelectorAll('polygon') ?? []
    const lines = element.shadowRoot?.querySelectorAll('polyline') ?? []
    const slot = element.shadowRoot?.querySelector('slot')

    expect(element).toHaveProperty('colors', '#18f0ff,#2b7cff')
    expect(svg?.getAttribute('width')).toBe('240')
    expect(svg?.getAttribute('height')).toBe('80')
    expect(svg?.hasAttribute('viewBox')).toBe(false)
    expect(polygons).toHaveLength(5)
    expect(lines).toHaveLength(2)
    expect(polygons[0]?.getAttribute('points')).toBe('20 10, 25 4, 55 4, 60 10')
    expect(polygons[0]?.getAttribute('fill')).toBe('rgba(43, 124, 255, 0.1)')
    expect(polygons[0]?.getAttribute('stroke')).toBe('#2b7cff')
    expect(polygons[4]?.getAttribute('points')).toBe('20 10, 5 40, 20 70, 220 70, 235 40, 220 10')
    expect(polygons[4]?.getAttribute('fill')).toBe('rgba(24, 240, 255, 0.2)')
    expect(polygons[4]?.getAttribute('stroke')).toBe('#18f0ff')
    expect(lines[0]?.getAttribute('points')).toBe('25 18, 15 40, 25 62')
    expect(lines[0]?.getAttribute('stroke')).toBe('rgba(24, 240, 255, 0.7)')
    expect(lines[1]?.getAttribute('points')).toBe('215 18, 225 40, 215 62')
    expect(slot?.assignedElements()).toHaveLength(1)
  })

  it('resolves decoration-4 colors from CSS variables', async () => {
    register()

    const element = document.createElement('dvk-decoration-4') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dvk-color-primary', '#123456')
    element.style.setProperty('--dvk-color-secondary', '#abcdef')
    document.body.append(element)

    await element.updateComplete
    emitResize(180, 60)
    await element.updateComplete

    const polygons = element.shadowRoot?.querySelectorAll('polygon') ?? []
    const lines = element.shadowRoot?.querySelectorAll('polyline') ?? []

    expect(polygons[0]?.getAttribute('fill')).toBe('rgba(171, 205, 239, 0.1)')
    expect(polygons[4]?.getAttribute('fill')).toBe('rgba(18, 52, 86, 0.2)')
    expect(polygons[4]?.getAttribute('points')).toBe('20 10, 5 30, 20 50, 160 50, 175 30, 160 10')
    expect(lines[1]?.getAttribute('points')).toBe('155 18, 165 30, 155 42')
  })

  it('uses datav-kit colors as decoration-4 fallback colors', async () => {
    register()

    const element = document.createElement('dvk-decoration-4') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(180, 60)
    await element.updateComplete

    const polygons = element.shadowRoot?.querySelectorAll('polygon') ?? []
    const lines = element.shadowRoot?.querySelectorAll('polyline') ?? []

    expect(polygons[0]?.getAttribute('fill')).toBe('rgba(43, 124, 255, 0.1)')
    expect(polygons[0]?.getAttribute('stroke')).toBe('#2b7cff')
    expect(polygons[4]?.getAttribute('fill')).toBe('rgba(24, 240, 255, 0.2)')
    expect(polygons[4]?.getAttribute('stroke')).toBe('#18f0ff')
    expect(lines[0]?.getAttribute('stroke')).toBe('rgba(24, 240, 255, 0.7)')
  })

  it('emits resize details when fit-screen receives ResizeObserver entries', async () => {
    register()

    const element = document.createElement('dvk-fit-screen') as FitScreenElement
    const listener = vi.fn()

    element.setAttribute('width', '1280')
    element.setAttribute('height', '720')
    element.addEventListener('dvk-resize', listener)
    document.body.append(element)
    await element.updateComplete
    listener.mockClear()

    expect(element).toHaveProperty('fitTarget', 'viewport')
    expect(element.getAttribute('fit-target')).toBe('viewport')

    emitResize(640, 360)

    await element.updateComplete

    expect(listener).toHaveBeenCalled()
    expect(latestDetail(listener)).toMatchObject({
      width: 640,
      height: 360,
      scale: 0.5,
      scaleX: 0.5,
      scaleY: 0.5,
      offsetX: 0,
      offsetY: 0,
    })
    expect(element.style.getPropertyValue('--dvk-scale')).toBe('0.5')

    element.setAttribute('fit-target', 'host')
    await element.updateComplete

    expect(element).toHaveProperty('fitTarget', 'host')
  })

  it('computes cover, fill, scroll, alignment, and zero-size fit-screen states', async () => {
    register()

    const element = document.createElement('dvk-fit-screen') as FitScreenElement
    const listener = vi.fn()

    element.setAttribute('width', '1280')
    element.setAttribute('height', '720')
    element.addEventListener('dvk-resize', listener)
    document.body.append(element)
    await element.updateComplete
    listener.mockClear()

    element.setAttribute('mode', 'cover')
    element.setAttribute('align', 'right bottom')
    await element.updateComplete
    emitResize(640, 400)
    await element.updateComplete

    expect(latestDetail(listener).scale).toBeCloseTo(400 / 720)
    expect(latestDetail(listener).offsetX).toBeCloseTo(640 - 1280 * (400 / 720))
    expect(latestDetail(listener).offsetY).toBeCloseTo(0)

    element.setAttribute('mode', 'fill')
    await element.updateComplete

    expect(latestDetail(listener).scaleX).toBeCloseTo(0.5)
    expect(latestDetail(listener).scaleY).toBeCloseTo(400 / 720)

    element.setAttribute('mode', 'scroll')
    await element.updateComplete

    expect(latestDetail(listener)).toMatchObject({
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      offsetX: 0,
      offsetY: 0,
    })

    emitResize(0, 0)
    await element.updateComplete

    expect(latestDetail(listener)).toMatchObject({
      width: 0,
      height: 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    })
  })
})
