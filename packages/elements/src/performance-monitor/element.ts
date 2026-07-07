import type {
  LongTaskLikeEntry,
  PerformanceMonitorAlertDetail,
  PerformanceMonitorAlertReason,
  PerformanceMonitorMode,
  PerformanceMonitorPlacement,
  PerformanceMonitorSnapshot,
} from './metrics'
import { DatavElement, resolveNumberValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import {
  calculatePressure,
  collectMemoryMetrics,
  collectPerformanceInventory,
  defaultSnapshot,
  normalizeLongTaskEntry,
  parseBooleanValue,
} from './metrics'

const monitorTagName = 'dvk-performance-monitor'
const frameBudget = 1000 / 60
const historyLimit = 10
const recentLongTaskLimit = 5

const booleanConverter = {
  fromAttribute: (value: string | null): boolean => parseBooleanValue(value, false),
  toAttribute: (value: boolean): string | null => value ? '' : null,
}

const enabledBooleanConverter = {
  fromAttribute: (value: string | null): boolean => parseBooleanValue(value, true),
  toAttribute: (value: boolean): string | null => value ? '' : 'false',
}

const nullableBooleanConverter = {
  fromAttribute: (value: string | null): boolean | null => value === null ? null : parseBooleanValue(value, true),
  toAttribute: (value: boolean | null): string | null => {
    if (value === null)
      return null

    return value ? '' : 'false'
  },
}

export class PerformanceMonitorElement extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      color: var(--dvk-performance-monitor-color, #e9fbff);
      font-family: var(--dvk-performance-monitor-font-family, Inter, "Segoe UI", sans-serif);
      font-size: 12px;
      line-height: 1.35;
      --dvk-performance-monitor-bg: rgba(2, 10, 20, 0.92);
      --dvk-performance-monitor-border-color: rgba(110, 215, 232, 0.28);
      --dvk-performance-monitor-muted-color: rgba(223, 244, 248, 0.58);
      --dvk-performance-monitor-ok-color: #52f0b5;
      --dvk-performance-monitor-warn-color: #ffd166;
      --dvk-performance-monitor-danger-color: #ff668c;
      --dvk-performance-monitor-offset: 14px;
      --dvk-performance-monitor-z-index: 2147483000;
    }

    :host([mode="overlay"]) {
      position: fixed;
      z-index: var(--dvk-performance-monitor-z-index);
      width: min(290px, calc(100vw - var(--dvk-performance-monitor-offset) * 2));
      pointer-events: auto;
    }

    :host([mode="overlay"][collapsed]) {
      width: min(180px, calc(100vw - var(--dvk-performance-monitor-offset) * 2));
    }

    :host([mode="overlay"][placement="top-left"]) {
      top: var(--dvk-performance-monitor-offset);
      left: var(--dvk-performance-monitor-offset);
    }

    :host([mode="overlay"][placement="top-right"]) {
      top: var(--dvk-performance-monitor-offset);
      right: var(--dvk-performance-monitor-offset);
    }

    :host([mode="overlay"][placement="bottom-left"]) {
      bottom: var(--dvk-performance-monitor-offset);
      left: var(--dvk-performance-monitor-offset);
    }

    :host([mode="overlay"][placement="bottom-right"]) {
      right: var(--dvk-performance-monitor-offset);
      bottom: var(--dvk-performance-monitor-offset);
    }

    .panel {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--dvk-performance-monitor-border-color);
      border-radius: var(--dvk-performance-monitor-radius, 8px);
      background: var(--dvk-performance-monitor-bg);
      box-shadow: var(--dvk-performance-monitor-shadow, 0 18px 48px rgba(0, 0, 0, 0.32));
      backdrop-filter: blur(12px);
    }

    .panel[data-collapsed="true"] {
      width: min(180px, 100%);
    }

    :host([mode="inline"]) .panel {
      box-shadow: none;
      backdrop-filter: none;
    }

    .header,
    .pressure,
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-width: 0;
    }

    :host([mode="overlay"]) .header[data-draggable="true"] {
      cursor: move;
      user-select: none;
      touch-action: none;
    }

    .title {
      min-width: 0;
    }

    .label,
    dt,
    .section-title {
      color: var(--dvk-performance-monitor-muted-color);
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
      border: 1px solid var(--dvk-performance-monitor-border-color);
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
      border: 1px solid rgba(82, 240, 181, 0.18);
      border-radius: 6px;
      background: rgba(82, 240, 181, 0.08);
    }

    .pressure[data-tone="warn"] {
      border-color: color-mix(in srgb, var(--dvk-performance-monitor-warn-color) 38%, transparent);
      background: color-mix(in srgb, var(--dvk-performance-monitor-warn-color) 12%, transparent);
    }

    .pressure[data-tone="danger"] {
      border-color: color-mix(in srgb, var(--dvk-performance-monitor-danger-color) 42%, transparent);
      background: color-mix(in srgb, var(--dvk-performance-monitor-danger-color) 14%, transparent);
    }

    .pressure strong {
      color: #ffffff;
      font-size: 16px;
      line-height: 1;
    }

    .details {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }

    section {
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    dl {
      display: grid;
      gap: 3px;
      margin: 0;
    }

    .row {
      align-items: baseline;
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

    .list {
      display: grid;
      gap: 2px;
      min-width: 0;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .list li {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }

    .list span:first-child {
      min-width: 0;
      overflow: hidden;
      color: #f5fdff;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .list span:last-child,
    .muted {
      color: var(--dvk-performance-monitor-muted-color);
    }

    .disabled {
      margin-top: 10px;
      color: var(--dvk-performance-monitor-muted-color);
    }

    @media (max-width: 640px) {
      :host {
        --dvk-performance-monitor-offset: 10px;
      }
    }
  `

  @property({ reflect: true })
  mode: PerformanceMonitorMode = 'overlay'

  @property({ reflect: true })
  placement: PerformanceMonitorPlacement = 'bottom-right'

  @property({ converter: enabledBooleanConverter })
  enabled = true

  @property({ converter: booleanConverter, reflect: true })
  collapsed = false

  @property({ converter: nullableBooleanConverter })
  persist: boolean | null = null

  @property({ attribute: 'persist-key' })
  persistKey = 'datav-kit-performance-monitor-collapsed'

  @property({ attribute: 'emit-samples', converter: enabledBooleanConverter })
  emitSamples = true

  @property({ attribute: 'drag-enabled', converter: enabledBooleanConverter })
  dragEnabled = true

  @property({ type: Number, attribute: 'sample-interval' })
  sampleInterval = 1000

  @property({ type: Number, attribute: 'scan-interval' })
  scanInterval = 3000

  @property({ type: Number, attribute: 'long-frame-threshold' })
  longFrameThreshold = 50

  @property({ type: Number, attribute: 'danger-threshold' })
  dangerThreshold = 70

  @property({ type: Number, attribute: 'min-fps-threshold' })
  minFpsThreshold = 30

  @property({ type: Number, attribute: 'long-task-threshold' })
  longTaskThreshold = 200

  @property({ type: Number, attribute: 'alert-cooldown' })
  alertCooldown = 10000

  @property({ type: Number, attribute: 'z-index' })
  zIndex = 2147483000

  @property({ type: Number })
  offset = 14

  @property()
  target = ''

  @property({ attribute: false })
  targetElement: Element | null = null

  @state()
  private snapshot: PerformanceMonitorSnapshot = {
    ...defaultSnapshot,
    timestamp: Date.now(),
  }

  private animationFrame = 0
  private frameCount = 0
  private frameHistory: number[] = []
  private lastAlertAt = 0
  private lastFrameTime = 0
  private longFrameCount = 0
  private longTaskCountInWindow = 0
  private longTaskMaxInWindow = 0
  private longTaskTimeInWindow = 0
  private longTaskRecent: PerformanceMonitorSnapshot['longTask']['recent'] = []
  private maxFrameMs = 0
  private observer: PerformanceObserver | undefined
  private sampleStartedAt = 0
  private scanTimer = 0
  private dragState: {
    offsetX: number
    offsetY: number
    pointerId: number
  } | null = null

  override connectedCallback(): void {
    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'status')

    if (!this.hasAttribute('aria-label'))
      this.setAttribute('aria-label', 'Runtime performance monitor')

    super.connectedCallback()
    this.applyHostVariables()
    this.restoreCollapsedState()
    this.start()
  }

  override disconnectedCallback(): void {
    this.stop()
    super.disconnectedCallback()
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    this.applyHostVariables()

    if (changed.has('enabled')) {
      this.enabled ? this.start() : this.stop()

      if (changed.get('enabled') !== undefined)
        this.emit('dvk-enabled-change', { enabled: this.enabled })
    }

    if (
      (changed.has('sampleInterval') && changed.get('sampleInterval') !== undefined)
      || (changed.has('scanInterval') && changed.get('scanInterval') !== undefined)
      || (changed.has('target') && changed.get('target') !== undefined)
      || (changed.has('targetElement') && changed.get('targetElement') !== undefined)
    ) {
      this.restartRuntime()
    }

    if (changed.has('collapsed')) {
      this.persistCollapsedState()

      if (changed.get('collapsed') !== undefined)
        this.emit('dvk-collapse-change', { collapsed: this.collapsed })
    }

    if (changed.has('mode') && changed.get('mode') !== undefined && this.mode === 'inline')
      this.resetPosition()
  }

  override render(): unknown {
    const tone = this.resolvePressureTone()

    return html`
      <aside part="root" class="panel" data-collapsed=${String(this.collapsed)}>
        <header
          part="header"
          class="header"
          data-draggable=${String(this.dragEnabled)}
          @pointerdown=${this.startDrag}
        >
          <div class="title">
            <span class="label">Runtime</span>
            <strong>${this.snapshot.summary.fps} FPS</strong>
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

        <div part="pressure" class="pressure" data-tone=${tone}>
          <span class="label">pressure</span>
          <strong>${this.snapshot.summary.pressure}%</strong>
        </div>

        ${this.enabled
          ? this.collapsed ? null : this.renderDetails()
          : html`<div class="disabled">disabled</div>`}
      </aside>
    `
  }

  getSnapshot(): PerformanceMonitorSnapshot {
    return structuredCloneIfAvailable(this.snapshot)
  }

  refresh(): void {
    if (!this.isConnected || !this.enabled || typeof document === 'undefined')
      return

    const target = this.resolveTarget()
    const inventory = collectPerformanceInventory({
      fallbackLabel: target.label,
      fallbackUsed: target.fallback,
      monitorTagName,
      root: target.root,
    })

    this.snapshot = {
      ...this.snapshot,
      animation: inventory.animation,
      canvas: inventory.canvas,
      hotspots: inventory.hotspots,
      inventory: inventory.inventory,
      scope: inventory.scope,
      support: {
        ...this.snapshot.support,
        animations: inventory.animation.supported,
      },
      video: inventory.video,
    }
  }

  reset(): void {
    this.frameCount = 0
    this.frameHistory = []
    this.lastAlertAt = 0
    this.lastFrameTime = 0
    this.longFrameCount = 0
    this.longTaskCountInWindow = 0
    this.longTaskMaxInWindow = 0
    this.longTaskTimeInWindow = 0
    this.longTaskRecent = []
    this.maxFrameMs = 0
    this.sampleStartedAt = 0
    this.snapshot = {
      ...this.snapshot,
      frame: defaultSnapshot.frame,
      longTask: {
        ...defaultSnapshot.longTask,
        supported: this.snapshot.support.longTask,
      },
      pressure: defaultSnapshot.pressure,
      summary: {
        ...this.snapshot.summary,
        fps: 0,
        longTaskCount: 0,
        longTaskMs: 0,
        pressure: 0,
      },
    }
  }

  resetPosition(): void {
    this.dragState = null
    this.style.removeProperty('left')
    this.style.removeProperty('top')
    this.style.removeProperty('right')
    this.style.removeProperty('bottom')
  }

  private renderDetails(): unknown {
    const snapshot = this.snapshot

    return html`
      <div part="details" class="details">
        ${this.renderGroup('Frame', [
          ['avg / min', `${snapshot.frame.avgFps} / ${snapshot.frame.minFps} FPS`],
          ['dropped', `${Math.round(snapshot.frame.droppedRatio * 100)}%`],
          ['long / max', `${snapshot.frame.longFrames} / ${snapshot.frame.maxFrameMs}ms`],
        ])}
        ${this.renderGroup('Long Task', snapshot.longTask.supported
          ? [
              ['count / ms', `${snapshot.longTask.count} / ${snapshot.longTask.totalMs}ms`],
              ['max', `${snapshot.longTask.maxMs}ms`],
              ['recent', snapshot.longTask.recent.length > 0 ? snapshot.longTask.recent.map(item => `${item.duration}ms`).join(', ') : 'none'],
            ]
          : [['support', 'unsupported']])}
        ${this.renderGroup('Memory', snapshot.memory.supported
          ? [
              ['heap', snapshot.memory.label],
              ['used', snapshot.memory.percent === null ? 'n/a' : `${snapshot.memory.percent}%`],
            ]
          : [['support', 'unsupported']])}
        ${this.renderGroup('Inventory', [
          ['nodes / dvk', `${snapshot.inventory.nodes} / ${snapshot.inventory.datav}`],
          ['svg / anim', `${snapshot.inventory.svg} / ${snapshot.inventory.animations}`],
          ['canvas / video', `${snapshot.inventory.canvas} / ${snapshot.inventory.playingVideos} playing`],
          ...(snapshot.scope.fallback ? [['target', `fallback ${snapshot.scope.label}`] as [string, string]] : []),
        ])}
        ${this.renderList('Dvk Hotspots', snapshot.hotspots.datav.map(item => [item.owner, String(item.count)]))}
        ${this.renderList('SVG Hotspots', snapshot.hotspots.svg.map(item => [
          item.owner,
          `n${item.nodes} a${item.animations} f${item.filters}`,
        ]))}
        ${this.renderGroup('Canvas', [
          ['largest', `${snapshot.canvas.largestWidth} x ${snapshot.canvas.largestHeight}`],
          ['pixels', `${(snapshot.canvas.totalPixels / 1000000).toFixed(1)} MP`],
          ['high dpr', String(snapshot.canvas.highDpr)],
        ])}
        ${this.renderGroup('Animations', snapshot.animation.supported
          ? [
              ['running / total', `${snapshot.animation.running} / ${snapshot.animation.total}`],
              ['css / trans', `${snapshot.animation.cssAnimations} / ${snapshot.animation.cssTransitions}`],
              ['waapi', String(snapshot.animation.waapi)],
            ]
          : [['support', 'unsupported']])}
        ${this.renderGroup('Video', [
          ['playing', String(snapshot.video.playing)],
          ['visible / total', `${snapshot.video.visible} / ${snapshot.video.total}`],
        ])}
        ${this.renderGroup('Pressure', [
          ['frame / task', `${snapshot.pressure.contributors.frame} / ${snapshot.pressure.contributors.longTask}`],
          ['mem / inv', `${snapshot.pressure.contributors.memory} / ${snapshot.pressure.contributors.inventory}`],
        ])}
      </div>
    `
  }

  private renderGroup(title: string, rows: Array<[string, string]>): unknown {
    return html`
      <section part="section metric">
        <div part="section-title" class="section-title">${title}</div>
        <dl>
          ${rows.map(([label, value]) => html`
            <div part="metric" class="row">
              <dt part="metric-label">${label}</dt>
              <dd part="metric-value">${value}</dd>
            </div>
          `)}
        </dl>
      </section>
    `
  }

  private renderList(title: string, rows: Array<[string, string]>): unknown {
    return html`
      <section part="section metric">
        <div part="section-title" class="section-title">${title}</div>
        ${rows.length > 0
          ? html`
            <ul class="list">
              ${rows.map(([label, value]) => html`
                <li part="metric">
                  <span part="metric-label">${label}</span>
                  <span part="metric-value">${value}</span>
                </li>
              `)}
            </ul>
          `
          : html`<div class="muted">none</div>`}
      </section>
    `
  }

  private start(): void {
    if (!this.isConnected || !this.enabled || typeof window === 'undefined')
      return

    if (this.animationFrame)
      return

    this.refresh()
    this.startLongTaskObserver()
    this.scanTimer = window.setInterval(() => this.refresh(), this.resolveScanInterval())
    this.animationFrame = window.requestAnimationFrame(time => this.tick(time))
  }

  private stop(): void {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame)
      this.animationFrame = 0
    }

    if (this.scanTimer) {
      window.clearInterval(this.scanTimer)
      this.scanTimer = 0
    }

    this.observer?.disconnect()
    this.observer = undefined
  }

  private restartRuntime(): void {
    if (!this.isConnected || !this.enabled)
      return

    this.stop()
    this.start()
  }

  private tick(now: number): void {
    if (!this.enabled)
      return

    this.frameCount += 1

    if (this.sampleStartedAt === 0)
      this.sampleStartedAt = now

    if (this.lastFrameTime > 0) {
      const delta = now - this.lastFrameTime

      if (delta >= this.resolveLongFrameThreshold())
        this.longFrameCount += 1

      this.maxFrameMs = Math.max(this.maxFrameMs, Math.round(delta))
    }

    this.lastFrameTime = now

    if (now - this.sampleStartedAt >= this.resolveSampleInterval())
      this.collectSample(now)

    this.animationFrame = window.requestAnimationFrame(time => this.tick(time))
  }

  private collectSample(now: number): void {
    const elapsed = Math.max(now - this.sampleStartedAt, 1)
    const expectedFrames = elapsed / frameBudget
    const droppedRatio = Math.max((expectedFrames - this.frameCount) / expectedFrames, 0)
    const fps = Math.round(this.frameCount / elapsed * 1000)
    const memory = collectMemoryMetrics()
    const pressure = calculatePressure({
      droppedRatio,
      elapsed,
      inventory: this.snapshot.inventory,
      longTaskMs: this.longTaskTimeInWindow,
      memoryPercent: memory.percent,
    })

    this.frameHistory = [...this.frameHistory, fps].slice(-historyLimit)

    const frame = {
      avgFps: Math.round(this.frameHistory.reduce((sum, item) => sum + item, 0) / Math.max(this.frameHistory.length, 1)),
      droppedRatio,
      fps,
      longFrames: this.longFrameCount,
      maxFrameMs: this.maxFrameMs,
      minFps: Math.min(...this.frameHistory),
    }
    const longTask = {
      count: this.longTaskCountInWindow,
      maxMs: Math.round(this.longTaskMaxInWindow),
      recent: this.longTaskRecent,
      supported: this.snapshot.support.longTask,
      totalMs: Math.round(this.longTaskTimeInWindow),
    }
    const summary = {
      fps,
      heapLabel: memory.label,
      heapPercent: memory.percent,
      longTaskCount: longTask.count,
      longTaskMs: longTask.totalMs,
      nodes: this.snapshot.inventory.nodes,
      pressure: pressure.value,
    }
    const snapshot: PerformanceMonitorSnapshot = {
      ...this.snapshot,
      frame,
      longTask,
      memory,
      pressure,
      summary,
      support: {
        ...this.snapshot.support,
        memory: memory.supported,
        storage: this.canUseStorage(),
      },
      timestamp: Date.now(),
    }

    this.snapshot = snapshot
    this.emitSample(snapshot)
    this.emitAlertIfNeeded(snapshot)

    this.frameCount = 0
    this.longFrameCount = 0
    this.longTaskCountInWindow = 0
    this.longTaskMaxInWindow = 0
    this.longTaskTimeInWindow = 0
    this.maxFrameMs = 0
    this.sampleStartedAt = now
  }

  private startLongTaskObserver(): void {
    if (this.observer)
      return

    const supported = typeof PerformanceObserver !== 'undefined'
      && PerformanceObserver.supportedEntryTypes?.includes('longtask')

    this.snapshot = {
      ...this.snapshot,
      longTask: {
        ...this.snapshot.longTask,
        supported,
      },
      support: {
        ...this.snapshot.support,
        longTask: supported,
      },
    }

    if (!supported)
      return

    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const normalized = normalizeLongTaskEntry(entry as LongTaskLikeEntry)

        this.longTaskCountInWindow += 1
        this.longTaskTimeInWindow += entry.duration
        this.longTaskMaxInWindow = Math.max(this.longTaskMaxInWindow, entry.duration)
        this.longTaskRecent = [normalized, ...this.longTaskRecent].slice(0, recentLongTaskLimit)
      })
    })
    this.observer.observe({ entryTypes: ['longtask'] })
  }

  private emitSample(snapshot: PerformanceMonitorSnapshot): void {
    if (this.emitSamples)
      this.emit('dvk-performance-sample', snapshot)
  }

  private emitAlertIfNeeded(snapshot: PerformanceMonitorSnapshot): void {
    const now = Date.now()

    if (now - this.lastAlertAt < this.resolveAlertCooldown())
      return

    const alert = this.resolveAlert(snapshot)

    if (!alert)
      return

    this.lastAlertAt = now
    this.emit('dvk-performance-alert', alert)
  }

  private resolveAlert(snapshot: PerformanceMonitorSnapshot): PerformanceMonitorAlertDetail | null {
    const pressureThreshold = this.resolveDangerThreshold()
    const minFpsThreshold = this.resolveMinFpsThreshold()
    const longTaskThreshold = this.resolveLongTaskThreshold()

    if (snapshot.summary.pressure >= pressureThreshold)
      return this.createAlert('pressure', snapshot.summary.pressure, pressureThreshold, snapshot)

    if (snapshot.summary.fps <= minFpsThreshold)
      return this.createAlert('fps', snapshot.summary.fps, minFpsThreshold, snapshot)

    if (snapshot.summary.longTaskMs >= longTaskThreshold)
      return this.createAlert('long-task', snapshot.summary.longTaskMs, longTaskThreshold, snapshot)

    return null
  }

  private createAlert(reason: PerformanceMonitorAlertReason, value: number, threshold: number, snapshot: PerformanceMonitorSnapshot): PerformanceMonitorAlertDetail {
    return {
      pressure: snapshot.pressure,
      reason,
      summary: snapshot.summary,
      threshold,
      timestamp: Date.now(),
      value,
    }
  }

  private toggleCollapsed(): void {
    this.collapsed = !this.collapsed
  }

  private startDrag(event: PointerEvent): void {
    if (!this.dragEnabled || this.mode !== 'overlay' || event.button !== 0 || isInteractiveTarget(event.target))
      return

    const rect = this.getBoundingClientRect()

    this.dragState = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      pointerId: event.pointerId,
    }
    ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
    window.addEventListener('pointermove', this.drag)
    window.addEventListener('pointerup', this.stopDrag)
    window.addEventListener('pointercancel', this.stopDrag)
    event.preventDefault()
  }

  private drag = (event: PointerEvent): void => {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId)
      return

    const rect = this.getBoundingClientRect()
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || rect.width
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || rect.height
    const left = clamp(event.clientX - this.dragState.offsetX, 0, Math.max(viewportWidth - rect.width, 0))
    const top = clamp(event.clientY - this.dragState.offsetY, 0, Math.max(viewportHeight - rect.height, 0))

    this.style.left = `${Math.round(left)}px`
    this.style.top = `${Math.round(top)}px`
    this.style.right = 'auto'
    this.style.bottom = 'auto'
  }

  private stopDrag = (event: PointerEvent): void => {
    if (this.dragState && event.pointerId !== this.dragState.pointerId)
      return

    this.dragState = null
    window.removeEventListener('pointermove', this.drag)
    window.removeEventListener('pointerup', this.stopDrag)
    window.removeEventListener('pointercancel', this.stopDrag)
  }

  private resolveTarget(): { fallback: boolean, label: string, root: ParentNode } {
    if (this.targetElement)
      return { fallback: false, label: shortTargetLabel(this.targetElement), root: this.targetElement }

    if (this.target.trim()) {
      const target = document.querySelector(this.target)

      if (target)
        return { fallback: false, label: this.target, root: target }
    }

    return {
      fallback: Boolean(this.target.trim() || this.targetElement),
      label: 'document.body',
      root: document.body,
    }
  }

  private restoreCollapsedState(): void {
    if (this.hasAttribute('collapsed') || !this.resolvePersist() || !this.canUseStorage())
      return

    this.collapsed = window.localStorage.getItem(this.persistKey) === 'true'
  }

  private persistCollapsedState(): void {
    if (!this.resolvePersist() || !this.canUseStorage())
      return

    try {
      window.localStorage.setItem(this.persistKey, String(this.collapsed))
    }
    catch {
      // Storage failures should not stop the monitor.
    }
  }

  private canUseStorage(): boolean {
    if (typeof window === 'undefined' || !window.localStorage)
      return false

    try {
      const key = '__dvk_performance_monitor_storage__'
      window.localStorage.setItem(key, '1')
      window.localStorage.removeItem(key)
      return true
    }
    catch {
      return false
    }
  }

  private resolvePersist(): boolean {
    return this.persist ?? this.mode === 'overlay'
  }

  private resolvePressureTone(): 'danger' | 'ok' | 'warn' {
    if (this.snapshot.summary.pressure >= this.resolveDangerThreshold())
      return 'danger'

    if (this.snapshot.summary.pressure >= 38)
      return 'warn'

    return 'ok'
  }

  private applyHostVariables(): void {
    this.style.setProperty('--dvk-performance-monitor-z-index', String(this.zIndex))
    this.style.setProperty('--dvk-performance-monitor-offset', `${Math.max(resolveNumberValue(this.offset, 14), 0)}px`)
  }

  private resolveSampleInterval(): number {
    return Math.max(resolveNumberValue(this.sampleInterval, 1000), 250)
  }

  private resolveScanInterval(): number {
    return Math.max(resolveNumberValue(this.scanInterval, 3000), this.resolveSampleInterval())
  }

  private resolveLongFrameThreshold(): number {
    return Math.max(resolveNumberValue(this.longFrameThreshold, 50), frameBudget)
  }

  private resolveDangerThreshold(): number {
    return Math.max(resolveNumberValue(this.dangerThreshold, 70), 1)
  }

  private resolveMinFpsThreshold(): number {
    return Math.max(resolveNumberValue(this.minFpsThreshold, 30), 0)
  }

  private resolveLongTaskThreshold(): number {
    return Math.max(resolveNumberValue(this.longTaskThreshold, 200), 0)
  }

  private resolveAlertCooldown(): number {
    return Math.max(resolveNumberValue(this.alertCooldown, 10000), 0)
  }
}

function structuredCloneIfAvailable<TValue>(value: TValue): TValue {
  if (typeof structuredClone === 'function')
    return structuredClone(value)

  return JSON.parse(JSON.stringify(value)) as TValue
}

function shortTargetLabel(element: Element): string {
  const tagName = element.localName.toLowerCase()

  if (element.id)
    return `${tagName}#${element.id}`

  return tagName
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('button, a, input, select, textarea'))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
