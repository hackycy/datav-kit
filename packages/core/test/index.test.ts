// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'
import {
  canUseFullscreen,
  createConditionalExports,
  DatavElement,
  defineDatavElement,
  dispatchDatavEvent,
  registerDatavElements,
  resolveThemeValue,
} from '../src/index'

describe('@datav-kit/core', () => {
  it('defines custom elements once and reports duplicate registrations', () => {
    class TestElement extends DatavElement {}

    const tagName = `dv-test-${crypto.randomUUID()}`

    expect(defineDatavElement(tagName, TestElement)).toBe(true)
    expect(defineDatavElement(tagName, TestElement)).toBe(false)
  })

  it('registers element batches without throwing on already-defined tags', () => {
    class BatchElement extends DatavElement {}

    const tagName = `dv-batch-${crypto.randomUUID()}`
    const first = registerDatavElements([{ tagName, element: BatchElement }])
    const second = registerDatavElements([{ tagName, element: BatchElement }])

    expect(first).toEqual({ defined: [tagName], skipped: [] })
    expect(second).toEqual({ defined: [], skipped: [tagName] })
  })

  it('dispatches composed bubbling datav events by default', () => {
    const host = document.createElement('div')
    const listener = vi.fn()

    document.body.append(host)
    document.body.addEventListener('dv-ready', listener)

    const result = dispatchDatavEvent(host, 'dv-ready', { detail: { ready: true } })

    expect(result).toBe(true)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { ready: true },
    })
  })

  it('creates package export templates with types and import conditions', () => {
    expect(createConditionalExports(['index', 'fit-screen'])).toEqual({
      '.': {
        types: './dist/index.d.mts',
        import: './dist/index.mjs',
      },
      './fit-screen': {
        types: './dist/fit-screen.d.mts',
        import: './dist/fit-screen.mjs',
      },
      './package.json': './package.json',
    })
  })

  it('resolves explicit values before CSS variables and fallbacks', () => {
    const host = document.createElement('div')

    host.style.setProperty('--dv-color-primary', '#18f0ff')
    document.body.append(host)

    expect(resolveThemeValue({
      explicit: '#fff',
      cssVariable: '--dv-color-primary',
      host,
      fallback: '#000',
    })).toBe('#fff')

    expect(resolveThemeValue({
      explicit: '',
      cssVariable: '--dv-color-primary',
      host,
      fallback: '#000',
    })).toBe('#18f0ff')
  })

  it('does not report fullscreen support without the browser API', () => {
    expect(canUseFullscreen(document.documentElement)).toBe(false)
  })
})
