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
      '48 674 300 195',
      '585 821 502 38',
      '1324 674 300 195',
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
    expect(extensions).toHaveLength(6)
    expect(svgs).toHaveLength(14)
    expect(svgs.some(svg => svg.getAttribute('viewBox') === '48 60 1576 820')).toBe(false)
    expect(tiles.some(tile => tile.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(false)
    expect(extensions.every(extension => extension.querySelector('svg')?.getAttribute('preserveAspectRatio') === 'none')).toBe(true)
    expect(svgs.map(svg => svg.getAttribute('viewBox'))).toEqual(expect.arrayContaining([
      '48 60 466 150',
      '746 74 360 72',
      '1358 60 266 340',
      '48 150 120 585',
      '1500 400 124 335',
      '48 735 370 130',
      '780 815 460 50',
      '1320 735 304 130',
      '514 72 232 44',
      '1106 72 252 48',
      '418 844 362 21',
      '1240 844 80 21',
      '70 651 32 84',
      '1582 600 42 60',
    ]))
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('right: 0'))).toBe(true)
    expect(tiles.some(tile => tile.getAttribute('style')?.includes('bottom: 0'))).toBe(true)
    expect(element.shadowRoot?.querySelector('#cyan-dynamic-line-core')).toBeNull()
    expect(extensions.some(extension => extension.getAttribute('style')?.includes('width: 117.75999999999999px'))).toBe(true)
    expect(extensions.some(extension => extension.getAttribute('style')?.includes('height: 10.66px'))).toBe(true)
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
