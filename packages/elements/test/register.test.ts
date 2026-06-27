// @vitest-environment happy-dom
import type { CountToElement, FitScreenElement } from '../src/index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineBorderBox1, defineBorderBox2, defineBorderBox3, defineBorderBox4, defineBorderBox5, defineCountTo, defineFitScreen, elementMetadata, register } from '../src/index'

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0]

const resizeCallbacks: ResizeObserverCallback[] = []

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback)
  }

  observe = vi.fn()
  disconnect = vi.fn()
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
      'dv-fit-screen',
      'dv-border-box-1',
      'dv-border-box-2',
      'dv-border-box-3',
      'dv-border-box-4',
      'dv-border-box-5',
      'dv-count-to',
    ])

    const first = register()
    const second = register()

    expect(first.defined).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-box-1', 'dv-border-box-2', 'dv-border-box-3', 'dv-border-box-4', 'dv-border-box-5', 'dv-count-to']))
    expect(second.skipped).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-box-1', 'dv-border-box-2', 'dv-border-box-3', 'dv-border-box-4', 'dv-border-box-5', 'dv-count-to']))
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-5')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-5')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-5')?.props).not.toHaveProperty('viewBox')
  })

  it('supports single-element registration helpers', () => {
    expect(defineFitScreen()).toBe(false)
    expect(defineBorderBox1()).toBe(false)
    expect(defineBorderBox2()).toBe(false)
    expect(defineBorderBox3()).toBe(false)
    expect(defineBorderBox4()).toBe(false)
    expect(defineBorderBox5()).toBe(false)
    expect(defineCountTo()).toBe(false)
  })

  it('maps count-to attributes and formats the disabled target value', async () => {
    register()

    const element = document.createElement('dv-count-to') as CountToElement
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

    const element = document.createElement('dv-count-to') as CountToElement
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

    const element = document.createElement('dv-count-to') as CountToElement
    const started = vi.fn()

    element.setAttribute('end-val', '100')
    element.addEventListener('dv-started', started)
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

    const element = document.createElement('dv-count-to') as CountToElement
    const started = vi.fn()
    const finished = vi.fn()

    element.setAttribute('end-val', '100')
    element.setAttribute('duration', '16')
    element.setAttribute('delay', '10')
    element.addEventListener('dv-started', started)
    element.addEventListener('dv-finished', finished)
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

  it('maps border-box-1 attributes to element properties and renders SVG', async () => {
    register()

    const element = document.createElement('dv-border-box-1')
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

    const element = document.createElement('dv-border-box-1') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#123456')
    element.style.setProperty('--dv-color-secondary', '#abcdef')
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

  it('maps border-box-2 public attributes and keeps SVG reference geometry internal', async () => {
    register()

    const element = document.createElement('dv-border-box-2')
    element.setAttribute('colors', '#18f0ff,#2b7cff,#20c8ff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.5')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const circles = element.shadowRoot?.querySelectorAll('circle') ?? []
    const blur = element.shadowRoot?.querySelector('filter feGaussianBlur')
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#18f0ff,#2b7cff,#20c8ff')
    expect(element).toHaveProperty('glowIntensity', 1.5)
    expect(svg?.getAttribute('width')).toBe('1600')
    expect(svg?.getAttribute('height')).toBe('900')
    expect(svg?.getAttribute('viewBox')).toBe('48 48 1504 804')
    expect(paths.some(path => path.getAttribute('d')?.includes('L1510 785'))).toBe(true)
    expect(circles.length).toBeGreaterThan(10)
    expect(blur?.getAttribute('stdDeviation')).toBe('4.5')
    expect(animateMotion).toBeNull()
  })

  it('resolves border-box-2 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dv-border-box-2') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#102030')
    element.style.setProperty('--dv-color-secondary', '#405060')
    element.style.setProperty('--dv-color-accent', '#708090')
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
    expect(blurs).toEqual(['1.5', '4'])
  })

  it('maps border-box-3 public attributes and keeps SVG reference geometry internal', async () => {
    register()

    const element = document.createElement('dv-border-box-3')
    element.setAttribute('colors', '#57b9ff,#168cff,#9ae7ff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.25')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const uses = element.shadowRoot?.querySelectorAll('use') ?? []
    const circles = element.shadowRoot?.querySelectorAll('circle') ?? []
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#57b9ff,#168cff,#9ae7ff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(svg?.getAttribute('width')).toBe('1672')
    expect(svg?.getAttribute('height')).toBe('941')
    expect(svg?.getAttribute('viewBox')).toBe('48 60 1576 820')
    expect(paths.some(path => path.getAttribute('d')?.includes('L1604 162V779L1523 849'))).toBe(true)
    expect(uses.length).toBeGreaterThanOrEqual(8)
    expect(circles.length).toBeGreaterThan(10)
    expect(blurs).toEqual(['2.75', '8.125', '1.5', '5.75', '15', '7.5'])
    expect(animateMotion).toBeNull()
  })

  it('resolves border-box-3 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dv-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#445566')
    element.style.setProperty('--dv-color-accent', '#778899')
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
    expect(blurs).toEqual(['1.1', '3.25', '0.6', '2.3', '6', '3'])
  })

  it('maps border-box-4 public attributes and keeps SVG reference geometry internal', async () => {
    register()

    const element = document.createElement('dv-border-box-4')
    element.setAttribute('colors', '#36d9ff,#1ecfff,#c9fbff')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    element.setAttribute('glow-intensity', '1.25')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const svg = element.shadowRoot?.querySelector('svg')
    const paths = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))
    const animateMotion = element.shadowRoot?.querySelector('animateMotion')

    expect(element).toHaveProperty('colors', '#36d9ff,#1ecfff,#c9fbff')
    expect(element).toHaveProperty('glowIntensity', 1.25)
    expect(svg?.getAttribute('width')).toBe('1672')
    expect(svg?.getAttribute('height')).toBe('941')
    expect(svg?.getAttribute('viewBox')).toBe('48 60 1576 820')
    expect(paths.map(path => path.id)).toEqual([
      'cyan-outer-glow',
      'cyan-soft-glow',
      'cyan-line-core',
      'cyan-hot-highlight',
    ])
    expect(paths.some(path => path.getAttribute('d')?.includes('M1304,859L1302,863L1305,862'))).toBe(true)
    expect(paths.some(path => path.getAttribute('d')?.includes('M809,868L839,868L839,867L810,867'))).toBe(true)
    expect(blurs).toEqual(['5.25', '2.625', '1.0625'])
    expect(animateMotion).toBeNull()
  })

  it('resolves border-box-4 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dv-border-box-4') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#213141')
    element.style.setProperty('--dv-color-secondary', '#526272')
    element.style.setProperty('--dv-color-accent', '#8393a3')
    element.setAttribute('glow-intensity', '0.5')
    document.body.append(element)

    await element.updateComplete

    const fills = [...(element.shadowRoot?.querySelectorAll('path') ?? [])]
      .map(node => node.getAttribute('fill'))
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(fills).toContain('#213141')
    expect(fills).toContain('#526272')
    expect(fills).toContain('#8393a3')
    expect(blurs).toEqual(['2.1', '1.05', '0.425'])
  })

  it('maps border-box-5 public attributes and keeps SVG reference geometry internal', async () => {
    register()

    const element = document.createElement('dv-border-box-5')
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

    const element = document.createElement('dv-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#1a2a3a')
    element.style.setProperty('--dv-color-secondary', '#4a5a6a')
    element.style.setProperty('--dv-color-accent', '#7a8a9a')
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
      ['dv-border-box-1', '8px 8px 8px 8px'],
      ['dv-border-box-2', '21.72px 21.94px 21.72px 21.94px'],
      ['dv-border-box-3', '16px 20px 16px 20px'],
      ['dv-border-box-4', '16.24px 20px 16.24px 20px'],
      ['dv-border-box-5', '32px 22px 32px 22px'],
    ] as const

    for (const [tagName, expectedPadding] of cases) {
      const element = document.createElement(tagName) as HTMLElement & { updateComplete: Promise<boolean> }
      document.body.append(element)
      await element.updateComplete

      emitResize(300, 180)
      await element.updateComplete

      expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe(expectedPadding)
    }
  })

  it('supports content-driven height across border box variants', async () => {
    register()

    const cases = [
      ['dv-border-box-1', '8px 8px 8px 8px'],
      ['dv-border-box-2', '14px 21.94px 14px 21.94px'],
      ['dv-border-box-3', '16px 20px 16px 20px'],
      ['dv-border-box-4', '16px 20px 16px 20px'],
    ] as const

    for (const [tagName, expectedPadding] of cases) {
      const element = document.createElement(tagName) as HTMLElement & { updateComplete: Promise<boolean> }
      element.setAttribute('auto-height', '')
      document.body.append(element)
      await element.updateComplete

      emitResize(300, 180)
      await element.updateComplete

      expect(element).toHaveProperty('autoHeight', true)
      expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe(expectedPadding)
    }
  })

  it('renders border-box-5 as a tiled free border by default', async () => {
    register()

    const element = document.createElement('dv-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(300, 180)
    await element.updateComplete

    const tiles = [...(element.shadowRoot?.querySelectorAll('.tile') ?? [])]

    expect(tiles.length).toBeGreaterThan(8)
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('right: 0'))).toBe(true)
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('bottom: 0'))).toBe(true)
    expect(element.shadowRoot?.querySelectorAll('svg').length).toBe(tiles.length)
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('32px 22px 32px 22px')
  })

  it('emits resize details when fit-screen receives ResizeObserver entries', async () => {
    register()

    const element = document.createElement('dv-fit-screen') as FitScreenElement
    const listener = vi.fn()

    element.setAttribute('width', '1280')
    element.setAttribute('height', '720')
    element.addEventListener('dv-resize', listener)
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
    expect(element.style.getPropertyValue('--dv-scale')).toBe('0.5')

    element.setAttribute('fit-target', 'host')
    await element.updateComplete

    expect(element).toHaveProperty('fitTarget', 'host')
  })

  it('computes cover, fill, scroll, alignment, and zero-size fit-screen states', async () => {
    register()

    const element = document.createElement('dv-fit-screen') as FitScreenElement
    const listener = vi.fn()

    element.setAttribute('width', '1280')
    element.setAttribute('height', '720')
    element.addEventListener('dv-resize', listener)
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
