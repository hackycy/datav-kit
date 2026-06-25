// @vitest-environment happy-dom
import type { FitScreenElement } from '../src/index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineBorderGlow, defineFitScreen, elementMetadata, register } from '../src/index'

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
      'dv-border-glow',
    ])

    const first = register()
    const second = register()

    expect(first.defined).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-glow']))
    expect(second.skipped).toEqual(expect.arrayContaining(['dv-fit-screen', 'dv-border-glow']))
  })

  it('supports single-element registration helpers', () => {
    expect(defineFitScreen()).toBe(false)
    expect(defineBorderGlow()).toBe(false)
  })

  it('maps border-glow attributes to element properties and renders SVG', async () => {
    register()

    const element = document.createElement('dv-border-glow')
    element.setAttribute('colors', '#fff,#f3ff5c')
    element.setAttribute('intensity', '0.5')
    element.setAttribute('radius', '20')
    document.body.append(element)

    await (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete

    expect(element).toHaveProperty('colors', '#fff,#f3ff5c')
    expect(element).toHaveProperty('intensity', 0.5)
    expect(element.shadowRoot?.querySelector('svg')).not.toBeNull()
  })

  it('resolves border-glow colors from CSS variables and supports paused animation', async () => {
    register()

    const element = document.createElement('dv-border-glow') as HTMLElement & { updateComplete: Promise<boolean> }
    element.style.setProperty('--dv-color-primary', '#123456')
    element.style.setProperty('--dv-color-secondary', '#abcdef')
    element.setAttribute('paused', '')
    document.body.append(element)

    await element.updateComplete

    const stops = [...(element.shadowRoot?.querySelectorAll('stop') ?? [])]
    const animatedStroke = element.shadowRoot?.querySelector('rect[stroke-dasharray]')

    expect(stops.map(stop => stop.getAttribute('stop-color'))).toContain('#123456')
    expect(stops.map(stop => stop.getAttribute('stop-color'))).toContain('#abcdef')
    expect(animatedStroke?.getAttribute('class')).toBe('')
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
