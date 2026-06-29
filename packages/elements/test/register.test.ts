// @vitest-environment happy-dom
import type { CountToElement, FitScreenElement } from '../src/index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineBorderBox1, defineBorderBox2, defineBorderBox3, defineBorderBox4, defineBorderBox5, defineBorderBox6, defineBorderBox7, defineBorderBox8, defineBorderBox9, defineBorderBox10, defineBorderBox11, defineCountTo, defineDecoration1, defineDecoration2, defineFitScreen, elementMetadata, register } from '../src/index'

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
      'dv-border-box-6',
      'dv-border-box-7',
      'dv-border-box-8',
      'dv-border-box-9',
      'dv-border-box-10',
      'dv-border-box-11',
      'dv-decoration-1',
      'dv-decoration-2',
      'dv-count-to',
    ])

    const first = register()
    const second = register()

    expect(first.defined).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-box-1', 'dv-border-box-2', 'dv-border-box-3', 'dv-border-box-4', 'dv-border-box-5', 'dv-border-box-6', 'dv-border-box-7', 'dv-border-box-8', 'dv-border-box-9', 'dv-border-box-10', 'dv-border-box-11', 'dv-decoration-1', 'dv-decoration-2', 'dv-count-to']))
    expect(second.skipped).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-box-1', 'dv-border-box-2', 'dv-border-box-3', 'dv-border-box-4', 'dv-border-box-5', 'dv-border-box-6', 'dv-border-box-7', 'dv-border-box-8', 'dv-border-box-9', 'dv-border-box-10', 'dv-border-box-11', 'dv-decoration-1', 'dv-decoration-2', 'dv-count-to']))
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('autoHeight')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('autoHeight')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-4')?.props).not.toHaveProperty('autoHeight')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-5')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-5')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-5')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-6')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-6')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-6')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-7')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-7')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-7')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-8')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-8')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-8')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-9')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-9')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-9')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-10')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-10')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-10')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-11')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-11')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-11')?.props).not.toHaveProperty('viewBox')
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
    expect(defineDecoration1()).toBe(false)
    expect(defineDecoration2()).toBe(false)
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

  it('renders border-box-2 with fixed details and clean source extensions by default', async () => {
    register()

    const element = document.createElement('dv-border-box-2')
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
    expect(svgs).toHaveLength(16)
    expect(svgs.some(svg => svg.getAttribute('viewBox') === '48 48 1504 804')).toBe(false)
    expect(tiles.some(tile => tile.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(false)
    expect(extensions.every(extension => extension.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
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
    ]))
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('right: 0'))).toBe(true)
    expect(paths.some(path => path.getAttribute('d')?.includes('L1510 785'))).toBe(true)
    expect(circles.length).toBeGreaterThan(10)
    expect(blurs.slice(0, 2)).toEqual(['4.5', '12'])
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
    expect(blurs.slice(0, 2)).toEqual(['1.5', '4'])
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

    const element = document.createElement('dv-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
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
    expect(blurs.slice(0, 6)).toEqual(['1.1', '3.25', '0.6', '2.3', '6', '3'])
  })

  it('renders border-box-4 with fixed details and source edge extensions by default', async () => {
    register()

    const element = document.createElement('dv-border-box-4')
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
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('40.61px 32.49px 40.61px 32.49px')
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
      ['dv-border-box-3', '15.8px 11.8px 15.59px 11.8px'],
      ['dv-border-box-4', '16.24px 12.18px 16.24px 12.18px'],
      ['dv-border-box-5', '32px 22px 16px 22px'],
      ['dv-border-box-10', '15px 15px 15px 15px'],
      ['dv-border-box-11', '24.4px 26.63px 24.4px 26.63px'],
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

  it('maps border-box-2 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dv-border-box-2') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element).not.toHaveProperty('autoHeight')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('51.88px 70.21px 51.88px 70.21px')
  })

  it('maps border-box-4 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dv-border-box-4') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('38.8px 38.98px 38.8px 38.98px')
  })

  it('maps border-box-3 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dv-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('37.76px 37.77px 37.23px 37.77px')
  })

  it('maps border-box-11 block padding from host height without masking safe area', async () => {
    register()

    const element = document.createElement('dv-border-box-11') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('58.29px 85.2px 58.29px 85.2px')
  })

  it('supports content-driven height across border box variants', async () => {
    register()

    const cases = [
      ['dv-border-box-1', '8px 8px 8px 8px'],
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

  it('uses content-driven height for border-box-3 by default', async () => {
    register()

    const element = document.createElement('dv-border-box-3') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(300, 180)
    await element.updateComplete

    expect(element).not.toHaveProperty('autoHeight')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('15.8px 11.8px 15.59px 11.8px')
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
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('32px 22px 16px 22px')
  })

  it('maps border-box-5 block padding from host height', async () => {
    register()

    const element = document.createElement('dv-border-box-5') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('35.74px 37.13px 20.58px 41.1px')
  })

  it('maps border-box-6 public attributes and renders source-clipped slices', async () => {
    register()

    const element = document.createElement('dv-border-box-6')
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
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('34.74px 32px 31.62px 32px')
  })

  it('resolves border-box-6 colors from CSS variables and applies glow intensity', async () => {
    register()

    const element = document.createElement('dv-border-box-6') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#445566')
    element.style.setProperty('--dv-color-accent', '#778899')
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

    const element = document.createElement('dv-border-box-6') as HTMLElement & { updateComplete: Promise<boolean> }
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

    const element = document.createElement('dv-border-box-6') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)
    await element.updateComplete

    emitResize(960, 430)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('33.19px 38.4px 30.22px 38.4px')
  })

  it('maps border-box-7 public attributes and recreates BorderBox10 geometry', async () => {
    register()

    const element = document.createElement('dv-border-box-7')
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
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')?.style.getPropertyValue('--dv-border-box-7-box-shadow')).toBe('inset 0 0 25px 3px #1d48c4')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('9.6px 12.8px 9.6px 12.8px')
  })

  it('resolves border-box-7 colors from CSS variables', async () => {
    register()

    const element = document.createElement('dv-border-box-7') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#ddeeff')
    element.style.setProperty('--dv-border-box-7-background', 'rgba(1, 2, 3, 0.4)')
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('.panel polygon')?.getAttribute('fill')).toBe('rgba(1, 2, 3, 0.4)')
    expect(element.shadowRoot?.querySelector('.corner polygon')?.getAttribute('fill')).toBe('#ddeeff')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')?.style.getPropertyValue('--dv-border-box-7-box-shadow')).toBe('inset 0 0 25px 3px #112233')
  })

  it('uses datav-kit colors as border-box-7 defaults', async () => {
    register()

    const element = document.createElement('dv-border-box-7') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector('.corner polygon')?.getAttribute('fill')).toBe('#4fd2dd')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')?.style.getPropertyValue('--dv-border-box-7-box-shadow')).toBe('inset 0 0 25px 3px #235fa7')
  })

  it('maps border-box-8 public attributes and recreates BorderBox1 geometry', async () => {
    register()

    const element = document.createElement('dv-border-box-8')
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
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('18px 18px 18px 18px')
  })

  it('resolves border-box-8 colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dv-border-box-8') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#ddeeff')
    element.style.setProperty('--dv-border-box-8-background', 'rgba(1, 2, 3, 0.4)')
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

    const element = document.createElement('dv-border-box-8') as HTMLElement & { updateComplete: Promise<boolean> }
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

    const element = document.createElement('dv-border-box-9')
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
    expect(frame?.style.getPropertyValue('--dv-border-box-9-primary').trim()).toBe('#334455')
    expect(frame?.style.getPropertyValue('--dv-border-box-9-box-shadow').trim()).toBe('inset 0 0 40px #334455')
    expect(frame?.style.getPropertyValue('--dv-border-box-9-background').trim()).toBe('rgba(5, 18, 46, 0.22)')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('10px 10px 10px 10px')
  })

  it('resolves border-box-9 colors from CSS variables', async () => {
    register()

    const element = document.createElement('dv-border-box-9') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#ddeeff')
    element.style.setProperty('--dv-border-box-9-background', 'rgba(1, 2, 3, 0.4)')
    document.body.append(element)

    await element.updateComplete

    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]
    const frame = element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')

    expect(lines.filter(line => line.getAttribute('stroke-width') === '2').every(line => line.getAttribute('stroke') === '#112233')).toBe(true)
    expect(lines.filter(line => line.getAttribute('stroke-width') === '5').every(line => line.getAttribute('stroke') === '#ddeeff')).toBe(true)
    expect(frame?.style.getPropertyValue('--dv-border-box-9-box-shadow').trim()).toBe('inset 0 0 40px #112233')
    expect(frame?.style.getPropertyValue('--dv-border-box-9-background').trim()).toBe('rgba(1, 2, 3, 0.4)')
  })

  it('uses datav-kit colors as border-box-9 defaults', async () => {
    register()

    const element = document.createElement('dv-border-box-9') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete

    const lines = [...(element.shadowRoot?.querySelectorAll('polyline') ?? [])]
    const frame = element.shadowRoot?.querySelector<HTMLElement>('[part="frame"]')

    expect(lines.filter(line => line.getAttribute('stroke-width') === '2').every(line => line.getAttribute('stroke') === '#235fa7')).toBe(true)
    expect(lines.filter(line => line.getAttribute('stroke-width') === '5').every(line => line.getAttribute('stroke') === '#4fd2dd')).toBe(true)
    expect(frame?.style.getPropertyValue('--dv-border-box-9-box-shadow').trim()).toBe('inset 0 0 40px #235fa7')
  })

  it('maps border-box-10 public attributes and recreates BorderBox12 geometry', async () => {
    register()

    const element = document.createElement('dv-border-box-10')
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
    expect(corners.every(corner => corner.getAttribute('filter')?.startsWith('url(#dv-border-box-10-glow-'))).toBe(true)
    expect(flood?.getAttribute('flood-color')).toBe('rgba(221, 238, 255, 0.7)')
    expect(animation?.getAttribute('values')).toBe('rgba(221, 238, 255, 0.7);rgba(221, 238, 255, 0.3);rgba(221, 238, 255, 0.7)')
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('15px 15px 15px 15px')
  })

  it('resolves border-box-10 colors from CSS variables and supports paused glow', async () => {
    register()

    const element = document.createElement('dv-border-box-10') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#ddeeff')
    element.style.setProperty('--dv-border-box-10-background', 'rgba(1, 2, 3, 0.4)')
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

    const element = document.createElement('dv-border-box-10') as HTMLElement & { updateComplete: Promise<boolean> }
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

  it('maps border-box-11 public attributes and renders sliced cyber modules', async () => {
    register()

    const element = document.createElement('dv-border-box-11')
    element.setAttribute('colors', '#123456,#abcdef,#fedcba')
    element.setAttribute('glow-intensity', '0.5')
    element.setAttribute('width', '800')
    element.setAttribute('height', '450')
    element.setAttribute('view-box', '0 0 800 450')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete
    emitResize(320, 180)
    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    const slices = [...(element.shadowRoot?.querySelectorAll('[data-slice]') ?? [])]
    const topCenter = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="top-center"]')
    const bottomCenter = element.shadowRoot?.querySelector<HTMLElement>('[data-slice="bottom-center"]')
    const topLeadingSvg = element.shadowRoot?.querySelector('[data-slice="top-leading"] svg')
    const topLeftSvg = element.shadowRoot?.querySelector('[data-slice="top-left"] svg')
    const gradients = [...(element.shadowRoot?.querySelectorAll('linearGradient stop') ?? [])]
    const blurs = [...(element.shadowRoot?.querySelectorAll('feGaussianBlur') ?? [])]
      .map(node => node.getAttribute('stdDeviation'))

    expect(element).toHaveProperty('colors', '#123456,#abcdef,#fedcba')
    expect(element).toHaveProperty('glowIntensity', 0.5)
    expect(element).not.toHaveProperty('viewBox')
    expect(slices.map(slice => slice.getAttribute('data-slice'))).toEqual([
      'top-leading',
      'top-trailing',
      'bottom-leading',
      'bottom-trailing',
      'left-upper',
      'left-lower',
      'right-upper',
      'right-lower',
      'top-left',
      'top-center',
      'top-right',
      'left-detail',
      'right-detail',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ])
    expect(topLeadingSvg?.getAttribute('preserveAspectRatio')).toBe('none')
    expect(topLeftSvg?.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(topCenter?.style.left).toBe('128px')
    expect(topCenter?.style.top).toBe('8.4px')
    expect(topCenter?.style.width).toBe('64px')
    expect(topCenter?.style.height).toBe('19.2px')
    expect(bottomCenter?.style.left).toBe('120px')
    expect(bottomCenter?.style.bottom).toBe('6px')
    expect(bottomCenter?.style.width).toBe('80px')
    expect(bottomCenter?.style.height).toBe('19.2px')
    expect(gradients.map(gradient => gradient.getAttribute('stop-color'))).toEqual(expect.arrayContaining(['#123456', '#abcdef', '#fedcba']))
    expect(blurs.slice(0, 6)).toEqual(['1.2', '4', '0.55', '2.4', '7', '2.75'])
    expect(element.shadowRoot?.querySelector('animateMotion')).not.toBeNull()
    expect(element.shadowRoot?.querySelector<HTMLElement>('[part="content"]')?.style.getPropertyValue('--dv-border-box-auto-padding')).toBe('24.4px 28.4px 24.4px 28.4px')
  })

  it('resolves border-box-11 colors from CSS variables and supports paused scan lights', async () => {
    register()

    const element = document.createElement('dv-border-box-11') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#112233')
    element.style.setProperty('--dv-color-secondary', '#445566')
    element.style.setProperty('--dv-color-accent', '#778899')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const stops = [...(element.shadowRoot?.querySelectorAll('linearGradient stop') ?? [])]
      .map(node => node.getAttribute('stop-color'))

    expect(stops).toEqual(expect.arrayContaining(['#112233', '#445566', '#778899']))
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
    expect(element.shadowRoot?.querySelector('animateMotion')).toBeNull()
  })

  it('uses datav-kit colors as border-box-11 defaults', async () => {
    register()

    const element = document.createElement('dv-border-box-11') as HTMLElement & { updateComplete: Promise<boolean> }
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const stops = [...(element.shadowRoot?.querySelectorAll('linearGradient stop') ?? [])]
      .map(node => node.getAttribute('stop-color'))

    expect(stops).toEqual(expect.arrayContaining(['#32e6ff', '#1b7dff', '#b9f7ff']))
  })

  it('maps decoration-1 attributes and renders animated bars', async () => {
    register()

    const element = document.createElement('dv-decoration-1') as HTMLElement & { updateComplete: Promise<boolean> }
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

    const element = document.createElement('dv-decoration-1') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#123456')
    element.style.setProperty('--dv-color-secondary', '#abcdef')
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

    const element = document.createElement('dv-decoration-1') as HTMLElement & { updateComplete: Promise<boolean> }
    document.body.append(element)

    await element.updateComplete
    emitResize(300, 35)
    await element.updateComplete

    expect(element.shadowRoot?.querySelectorAll('rect')).toHaveLength(40)
    expect(element.shadowRoot?.querySelector('animate')).toBeNull()
  })

  it('maps decoration-2 attributes and renders dotted rows', async () => {
    register()

    const element = document.createElement('dv-decoration-2') as HTMLElement & { updateComplete: Promise<boolean> }
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

    const element = document.createElement('dv-decoration-2') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#123456')
    element.style.setProperty('--dv-color-secondary', '#abcdef')
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
