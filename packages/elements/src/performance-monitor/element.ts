import type { PerformanceMonitorCounts } from './metrics'
import { DatavElement } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import {
  calculatePressure,
  collectMemoryMetrics,
  collectRenderCounts,
  emptyCounts,
  parseBooleanValue,
} from './metrics'

const dangerThreshold = 70
const frameBudget = 1000 / 60
const sampleWindow = 1000
const storageKey = 'datav-kit-performance-monitor-collapsed'
const warnThreshold = 38

const booleanConverter = {
  fromAttribute: (value: string | null): boolean => parseBooleanValue(value, false),
  toAttribute: (value: boolean): string | null => value ? '' : null,
}

interface PerformanceMonitorSample {
  counts: PerformanceMonitorCounts
  fps: number
  heapLabel: string
  heapPercent: number | null
  longTaskCount: number
  longTaskMs: number
  pressure: number
}

export class PerformanceMonitorElement extends DatavElement {
  static override styles = css`
    :host {
      position: fixed;
      right: var(--dvk-performance-monitor-offset, 14px);
      bottom: var(--dvk-performance-monitor-offset, 14px);
      z-index: var(--dvk-performance-monitor-z-index, 2147483000);
      display: block;
      box-sizing: border-box;
      width: min(260px, calc(100vw - 28px));
      padding: 10px;
      border: 1px solid var(--dvk-performance-monitor-border-color, rgba(110, 215, 232, 0.28));
      border-radius: 8px;
      color: var(--dvk-performance-monitor-color, #e9fbff);
      font-family: var(--dvk-performance-monitor-font-family, Inter, "Segoe UI", sans-serif);
      font-size: 12px;
      line-height: 1.35;
      background: var(--dvk-performance-monitor-bg, rgba(2, 10, 20, 0.92));
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(12px);
    }

    :host([collapsed]) {
      width: 170px;
    }

    .header,
    .pressure {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .label,
    dt {
      color: var(--dvk-performance-monitor-muted-color, rgba(223, 244, 248, 0.58));
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .header strong {
      display: block;
      margin-top: 2px;
      color: #ffffff;
      font-size: 18px;
      line-height: 1;
    }

    button {
      width: 28px;
      height: 28px;
      flex: 0 0 auto;
      border: 1px solid var(--dvk-performance-monitor-border-color, rgba(110, 215, 232, 0.28));
      border-radius: 6px;
      color: #dff8ff;
      font: inherit;
      font-size: 16px;
      line-height: 1;
      background: rgba(14, 165, 183, 0.14);
      cursor: pointer;
    }

    button:hover {
      border-color: rgba(110, 215, 232, 0.58);
      background: rgba(14, 165, 183, 0.24);
    }

    .pressure {
      margin-top: 9px;
      padding: 8px;
      border: 1px solid color-mix(in srgb, var(--dvk-performance-monitor-ok-color, #52f0b5) 18%, transparent);
      border-radius: 6px;
      background: color-mix(in srgb, var(--dvk-performance-monitor-ok-color, #52f0b5) 8%, transparent);
    }

    .pressure[data-tone="warn"] {
      border-color: color-mix(in srgb, var(--dvk-performance-monitor-warn-color, #ffd166) 28%, transparent);
      background: color-mix(in srgb, var(--dvk-performance-monitor-warn-color, #ffd166) 10%, transparent);
    }

    .pressure[data-tone="danger"] {
      border-color: color-mix(in srgb, var(--dvk-performance-monitor-danger-color, #ff668c) 34%, transparent);
      background: color-mix(in srgb, var(--dvk-performance-monitor-danger-color, #ff668c) 12%, transparent);
    }

    .pressure strong {
      color: #ffffff;
      font-size: 16px;
      line-height: 1;
    }

    .grid {
      display: grid;
      gap: 7px;
      margin: 10px 0 0;
    }

    .row {
      display: grid;
      grid-template-columns: 74px minmax(0, 1fr);
      gap: 8px;
      min-width: 0;
    }

    dt,
    dd {
      margin: 0;
    }

    dd {
      min-width: 0;
      overflow: hidden;
      color: #f5fdff;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      :host {
        --dvk-performance-monitor-offset: 10px;
      }
    }
  `

  @property({ converter: booleanConverter, reflect: true })
  collapsed = false

  @state()
  private sample: PerformanceMonitorSample = {
    counts: emptyCounts,
    fps: 0,
    heapLabel: 'n/a',
    heapPercent: null,
    longTaskCount: 0,
    longTaskMs: 0,
    pressure: 0,
  }

  private animationFrame = 0
  private frameCount = 0
  private longTaskCountInWindow = 0
  private longTaskTimeInWindow = 0
  private observer: PerformanceObserver | undefined
  private sampleStartedAt = 0

  override connectedCallback(): void {
    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'status')

    if (!this.hasAttribute('aria-label'))
      this.setAttribute('aria-label', 'Runtime performance monitor')

    super.connectedCallback()
    this.restoreCollapsedState()
    this.start()
  }

  override disconnectedCallback(): void {
    this.stop()
    super.disconnectedCallback()
  }

  override render(): unknown {
    const { counts, fps, heapLabel, heapPercent, longTaskCount, longTaskMs, pressure } = this.sample

    return html`
      <aside part="root">
        <header part="header" class="header">
          <div>
            <span class="label">Runtime</span>
            <strong>${fps} FPS</strong>
          </div>
          <button
            part="toggle"
            type="button"
            aria-label=${this.collapsed ? 'Expand performance monitor' : 'Collapse performance monitor'}
            @click=${this.toggleCollapsed}
          >
            ${this.collapsed ? '+' : '-'}
          </button>
        </header>

        <div part="pressure" class="pressure" data-tone=${this.resolvePressureTone()}>
          <span class="label">pressure</span>
          <strong>${pressure}%</strong>
        </div>

        ${this.collapsed
          ? null
          : html`
            <dl part="grid" class="grid">
              <div part="metric" class="row">
                <dt part="metric-label">long tasks</dt>
                <dd part="metric-value">${longTaskCount} / ${longTaskMs}ms</dd>
              </div>
              <div part="metric" class="row">
                <dt part="metric-label">heap</dt>
                <dd part="metric-value">${heapLabel}${heapPercent === null ? '' : ` · ${heapPercent}%`}</dd>
              </div>
              <div part="metric" class="row">
                <dt part="metric-label">nodes</dt>
                <dd part="metric-value">${counts.nodes}</dd>
              </div>
              <div part="metric" class="row">
                <dt part="metric-label">dvk</dt>
                <dd part="metric-value">${counts.datav}</dd>
              </div>
              <div part="metric" class="row">
                <dt part="metric-label">svg / anim</dt>
                <dd part="metric-value">${counts.svg} / ${counts.animations}</dd>
              </div>
              <div part="metric" class="row">
                <dt part="metric-label">video</dt>
                <dd part="metric-value">${counts.playingVideos} playing · ${counts.visibleVideos}/${counts.videos} visible</dd>
              </div>
              <div part="metric" class="row">
                <dt part="metric-label">canvas</dt>
                <dd part="metric-value">${counts.canvas}</dd>
              </div>
            </dl>
          `}
      </aside>
    `
  }

  private toggleCollapsed(): void {
    this.collapsed = !this.collapsed
    this.persistCollapsedState()
  }

  private start(): void {
    if (!this.isConnected || typeof window === 'undefined' || this.animationFrame)
      return

    this.sample = { ...this.sample, counts: collectRenderCounts() }
    this.startLongTaskObserver()
    this.animationFrame = window.requestAnimationFrame(time => this.tick(time))
  }

  private stop(): void {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame)
      this.animationFrame = 0
    }

    this.observer?.disconnect()
    this.observer = undefined
  }

  private tick(now: number): void {
    this.frameCount += 1

    if (this.sampleStartedAt === 0)
      this.sampleStartedAt = now

    if (now - this.sampleStartedAt >= sampleWindow)
      this.collectSample(now)

    this.animationFrame = window.requestAnimationFrame(time => this.tick(time))
  }

  private collectSample(now: number): void {
    const elapsed = Math.max(now - this.sampleStartedAt, 1)
    const expectedFrames = elapsed / frameBudget
    const droppedRatio = Math.max((expectedFrames - this.frameCount) / expectedFrames, 0)
    const memory = collectMemoryMetrics()

    this.sample = {
      counts: collectRenderCounts(),
      fps: Math.round(this.frameCount / elapsed * 1000),
      heapLabel: memory.label,
      heapPercent: memory.percent,
      longTaskCount: this.longTaskCountInWindow,
      longTaskMs: Math.round(this.longTaskTimeInWindow),
      pressure: calculatePressure({
        droppedRatio,
        elapsed,
        longTaskMs: this.longTaskTimeInWindow,
      }),
    }

    this.frameCount = 0
    this.longTaskCountInWindow = 0
    this.longTaskTimeInWindow = 0
    this.sampleStartedAt = now
  }

  private startLongTaskObserver(): void {
    if (this.observer)
      return

    if (
      typeof PerformanceObserver === 'undefined'
      || !PerformanceObserver.supportedEntryTypes?.includes('longtask')
    ) {
      return
    }

    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.longTaskCountInWindow += 1
        this.longTaskTimeInWindow += entry.duration
      })
    })
    this.observer.observe({ entryTypes: ['longtask'] })
  }

  private resolvePressureTone(): 'danger' | 'ok' | 'warn' {
    if (this.sample.pressure >= dangerThreshold)
      return 'danger'

    if (this.sample.pressure >= warnThreshold)
      return 'warn'

    return 'ok'
  }

  private restoreCollapsedState(): void {
    if (this.hasAttribute('collapsed'))
      return

    try {
      this.collapsed = window.localStorage.getItem(storageKey) === 'true'
    }
    catch {
      this.collapsed = false
    }
  }

  private persistCollapsedState(): void {
    try {
      window.localStorage.setItem(storageKey, String(this.collapsed))
    }
    catch {
      // Storage failures should not stop the monitor.
    }
  }
}
