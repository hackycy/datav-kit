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

    resizeCallbacks.at(-1)?.([
      {
        contentRect: {
          width: 640,
          height: 360,
        },
      } as ResizeObserverEntry,
    ], {} as ResizeObserver)

    await element.updateComplete

    expect(listener).toHaveBeenCalled()
    expect(listener.mock.calls.at(-1)?.[0].detail).toMatchObject({
      width: 640,
      height: 360,
      scale: 0.5,
      scaleX: 0.5,
      scaleY: 0.5,
      offsetX: 0,
      offsetY: 0,
    })
    expect(element.style.getPropertyValue('--dv-scale')).toBe('0.5')
  })
})
