import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { toBooleanAttribute, toNumber } from '@datav-kit/shared'
import { LitElement } from 'lit'

export type DatavPropType = 'string' | 'number' | 'boolean' | 'array' | 'object'

export interface DatavPropMetadata {
  type: DatavPropType
  attribute?: string | boolean
  default?: unknown
  cssVariable?: string
  reflect?: boolean
  description?: string
}

export interface DatavEventMetadata {
  name: string
  detail?: string
  description?: string
}

export interface DatavElementMetadata {
  tagName: `dvk-${string}`
  className: string
  description?: string
  props: Record<string, DatavPropMetadata>
  events: DatavEventMetadata[]
  parts: string[]
}

export interface DatavEventInit<TDetail> {
  detail: TDetail
  bubbles?: boolean
  cancelable?: boolean
  composed?: boolean
}

export interface DatavElementRegistration {
  tagName: string
  element: CustomElementConstructor
}

export interface ConditionalExportEntry {
  types: string
  import: string
}

export type ConditionalExports = Record<string, ConditionalExportEntry | string>

export interface ResizeState {
  width: number
  height: number
  dpr: number
  entry?: ResizeObserverEntry
}

export type ResizeCallback = (state: ResizeState) => void
export type MotionFrameCallback = (time: number, delta: number) => void

export interface ResolvedValueOptions<TValue> {
  explicit?: TValue | null
  cssVariable?: string
  host?: Element
  fallback: TValue
  transform?: (value: string) => TValue
}

export interface FullscreenResult {
  ok: boolean
  reason?: 'unsupported' | 'denied'
}

export function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof customElements !== 'undefined'
}

export function canUseFullscreen(target: Element = document.documentElement): boolean {
  return canUseDOM() && typeof target.requestFullscreen === 'function'
}

export async function requestDatavFullscreen(target: Element = document.documentElement): Promise<FullscreenResult> {
  if (!canUseFullscreen(target))
    return { ok: false, reason: 'unsupported' }

  try {
    await target.requestFullscreen()
    return { ok: true }
  }
  catch {
    return { ok: false, reason: 'denied' }
  }
}

export function createConditionalExports(entries: string[]): ConditionalExports {
  return entries.reduce<ConditionalExports>((exports, entry) => {
    const key = entry === 'index' ? '.' : `./${entry}`
    const file = entry === 'index' ? 'index' : entry

    exports[key] = {
      types: `./dist/${file}.d.mts`,
      import: `./dist/${file}.mjs`,
    }

    return exports
  }, {
    './package.json': './package.json',
  })
}

export function resolveThemeValue<TValue>(options: ResolvedValueOptions<TValue>): TValue {
  if (options.explicit !== undefined && options.explicit !== null && options.explicit !== '')
    return options.explicit

  if (options.host && options.cssVariable && typeof getComputedStyle !== 'undefined') {
    const value = getComputedStyle(options.host).getPropertyValue(options.cssVariable).trim()
    if (value)
      return options.transform ? options.transform(value) : value as TValue
  }

  return options.fallback
}

export function resolveNumberValue(value: unknown, fallback: number): number {
  return toNumber(value, fallback)
}

export function resolveBooleanValue(value: unknown): boolean {
  return toBooleanAttribute(value)
}

export function defineDatavElement(tagName: string, element: CustomElementConstructor): boolean {
  if (!canUseDOM())
    return false

  if (customElements.get(tagName))
    return false

  customElements.define(tagName, element)
  return true
}

export function registerDatavElements(elements: DatavElementRegistration[]): {
  defined: string[]
  skipped: string[]
} {
  return elements.reduce(
    (result, item) => {
      if (defineDatavElement(item.tagName, item.element))
        result.defined.push(item.tagName)
      else
        result.skipped.push(item.tagName)

      return result
    },
    { defined: [] as string[], skipped: [] as string[] },
  )
}

export function dispatchDatavEvent<TDetail>(
  target: EventTarget,
  type: string,
  init: DatavEventInit<TDetail>,
): boolean {
  return target.dispatchEvent(new CustomEvent(type, {
    bubbles: init.bubbles ?? true,
    cancelable: init.cancelable ?? false,
    composed: init.composed ?? true,
    detail: init.detail,
  }))
}

export abstract class DatavElement extends LitElement {
  connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('aria-hidden') && !this.hasAttribute('role'))
      this.setAttribute('aria-hidden', 'true')
  }

  protected emit<TDetail>(type: string, detail: TDetail, init?: Omit<DatavEventInit<TDetail>, 'detail'>): boolean {
    return dispatchDatavEvent(this, type, {
      ...init,
      detail,
    })
  }
}

export class ResizeController implements ReactiveController {
  private observer?: ResizeObserver

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly callback: ResizeCallback,
  ) {
    host.addController(this)
  }

  hostConnected(): void {
    if (typeof ResizeObserver === 'undefined')
      return

    this.observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry)
        return

      const rect = entry.contentRect
      this.callback({
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
        entry,
      })
    })

    this.observer.observe(this.host)
  }

  hostDisconnected(): void {
    this.observer?.disconnect()
    this.observer = undefined
  }
}

export class MotionController implements ReactiveController {
  private frameId = 0
  private lastTime = 0
  private paused = false

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly callback: MotionFrameCallback,
  ) {
    host.addController(this)
  }

  hostConnected(): void {
    this.resume()
  }

  hostDisconnected(): void {
    this.pause()
  }

  pause(): void {
    this.paused = true

    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = 0
    }

    this.lastTime = 0
  }

  resume(): void {
    if (typeof requestAnimationFrame === 'undefined')
      return

    if (this.frameId)
      return

    this.paused = false
    this.frameId = requestAnimationFrame(this.tick)
  }

  private readonly tick = (time: number): void => {
    if (this.paused)
      return

    const delta = this.lastTime ? time - this.lastTime : 0
    this.lastTime = time
    this.callback(time, delta)
    this.frameId = requestAnimationFrame(this.tick)
  }
}
