// @vitest-environment happy-dom
import type { FitScreenElement } from '../src/index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineBorderBox1, defineBorderBox2, defineBorderBox3, defineFitScreen, elementMetadata, register } from '../src/index'

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
    vi.unstubAllGlobals()
  })

  it('exposes MVP metadata and registers elements once', () => {
    expect(elementMetadata.map(meta => meta.tagName)).toEqual([
      'dv-fit-screen',
      'dv-border-box-1',
      'dv-border-box-2',
      'dv-border-box-3',
    ])

    const first = register()
    const second = register()

    expect(first.defined).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-box-1', 'dv-border-box-2', 'dv-border-box-3']))
    expect(second.skipped).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-box-1', 'dv-border-box-2', 'dv-border-box-3']))
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-2')?.props).not.toHaveProperty('viewBox')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('width')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('height')
    expect(elementMetadata.find(meta => meta.tagName === 'dv-border-box-3')?.props).not.toHaveProperty('viewBox')
  })

  it('supports single-element registration helpers', () => {
    expect(defineFitScreen()).toBe(false)
    expect(defineBorderBox1()).toBe(false)
    expect(defineBorderBox2()).toBe(false)
    expect(defineBorderBox3()).toBe(false)
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
