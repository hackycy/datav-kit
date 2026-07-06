import type { SvgVideoRasterFrame } from '../internal/svg-video-rasterizer'
import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { rasterizeSvgToPngSprite } from '../internal/svg-png-sprite-rasterizer'
import { rasterizeSvgToVideo } from '../internal/svg-video-rasterizer'

interface Decoration10Size {
  width: number
  height: number
}

interface Decoration10RasterSize extends Decoration10Size {
  displayWidth: number
}

interface Decoration10RasterHandle {
  asset: Decoration10RasterAsset
  release: () => void
}

interface Decoration10RasterCacheEntry {
  lastUsed: number
  asset?: Decoration10RasterAsset
  promise?: Promise<Decoration10RasterAsset>
  refs: number
}

interface Decoration10RasterAsset {
  url: string
  renderer: Decoration10RasterRenderer
  frameCount?: number
  columns?: number
  rows?: number
  frameDelay?: number
  image?: HTMLImageElement
  height?: number
  width?: number
}

type Decoration10RasterRenderer = 'sprite' | 'video'

const defaultSize: Decoration10Size = {
  width: 0,
  height: 0,
}
const baseSize = 120
const minRasterWidth = 360
const maxRasterWidth = 960
const minRasterScale = 1.5
const maxRasterScale = 2
const rasterFrameRate = 24
const minRasterFrameCount = 168
const maxRasterFrameCount = 480
const rasterFrameDelay = 1000 / rasterFrameRate
const rasterLoopDurationMultiplier = 2
const rasterVideoBitsPerSecond = 6_000_000
const spriteMaxRasterWidth = 560
const spriteMinRasterWidth = 240
const spriteRasterFrameRate = 24
const spriteMinRasterFrameCount = 168
const spriteMaxRasterFrameCount = 480
const spriteRasterFrameDelay = 1000 / spriteRasterFrameRate
const spriteRawAtlasBudgetBytes = 144 * 1024 * 1024
const maxRasterCacheEntries = 12
const tickCount = 120
const radialLineCount = 24
const particleCount = 42
const backgroundNodeCount = 22
const tickIndexes = Array.from({ length: tickCount }, (_, index) => index)
const radialLineIndexes = Array.from({ length: radialLineCount }, (_, index) => index)
const particleIndexes = Array.from({ length: particleCount }, (_, index) => index)
const backgroundNodeIndexes = Array.from({ length: backgroundNodeCount }, (_, index) => index)
const outerArcSegments = [
  { start: -82, end: -28, radius: 50.2, width: 2.1, opacity: 0.76 },
  { start: -10, end: 18, radius: 50.2, width: 1.4, opacity: 0.42 },
  { start: 42, end: 104, radius: 50.2, width: 2.5, opacity: 0.82 },
  { start: 128, end: 148, radius: 50.2, width: 1.35, opacity: 0.36 },
  { start: 168, end: 224, radius: 50.2, width: 2.2, opacity: 0.68 },
  { start: 254, end: 318, radius: 50.2, width: 2.4, opacity: 0.78 },
]
const flowArcSegments = [
  { start: -42, end: -12, radius: 44.6, opacity: 0.54 },
  { start: 24, end: 54, radius: 37.8, opacity: 0.44 },
  { start: 86, end: 126, radius: 44.6, opacity: 0.6 },
  { start: 176, end: 206, radius: 33.4, opacity: 0.38 },
  { start: 236, end: 278, radius: 40.8, opacity: 0.52 },
  { start: 308, end: 338, radius: 37.8, opacity: 0.42 },
]
const innerArcSegments = [
  { start: -74, end: -48 },
  { start: -18, end: 16 },
  { start: 58, end: 94 },
  { start: 132, end: 166 },
  { start: 206, end: 238 },
  { start: 282, end: 320 },
]
const signalRipples = [
  { x: 15.5, y: 58.8, radius: 9.5, delay: 0 },
  { x: 104.2, y: 62.4, radius: 10.5, delay: 2.35 },
]
const targetSignals = [
  { angle: 36, radius: 34.5, size: 1.45, accent: false },
  { angle: 78, radius: 23.8, size: 1.1, accent: true },
  { angle: 146, radius: 31.8, size: 1.25, accent: false },
  { angle: 226, radius: 27.2, size: 1.15, accent: true },
  { angle: 304, radius: 38.2, size: 1.3, accent: false },
]
const dataLines = [
  'M 5 31 H 19 L 24 36 H 37',
  'M 8 87 H 22 L 27 82 H 42',
  'M 83 17 H 100 L 106 23 H 116',
  'M 79 101 H 95 L 101 95 H 115',
  'M 12 14 H 30 L 34 18 H 48',
  'M 73 109 H 88 L 93 104 H 108',
]
let decoration10Id = 0
let rasterQueue = Promise.resolve()
const rasterCache = new Map<string, Decoration10RasterCacheEntry>()

export class Decoration10Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, rgba(88, 232, 255, 0.88));
    }

    canvas,
    svg,
    video {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      overflow: visible;
      pointer-events: none;
    }

    path,
    circle,
    line,
    rect {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: relative;
      z-index: 1;
      display: grid;
      place-items: center;
      min-width: 0;
      min-height: 0;
      color: inherit;
    }
  `

  @property()
  color: string | readonly string[] = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Number })
  dur = 8

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @property({ attribute: 'raster-renderer' })
  rasterRenderer: Decoration10RasterRenderer = 'sprite'

  @state()
  private size = defaultSize

  @state()
  private rasterAsset: Decoration10RasterAsset | undefined

  private readonly instanceId = ++decoration10Id
  private readonly scanGradientId = `dvk-decoration-10-scan-${this.instanceId}`
  private readonly arcGradientId = `dvk-decoration-10-arc-${this.instanceId}`
  private readonly targetGradientId = `dvk-decoration-10-target-${this.instanceId}`
  private readonly gridPatternId = `dvk-decoration-10-grid-${this.instanceId}`
  private readonly glowFilterId = `dvk-decoration-10-glow-${this.instanceId}`
  private readonly softGlowFilterId = `dvk-decoration-10-soft-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  private rasterKey = ''
  private pendingRasterKey = ''
  private rasterRelease: (() => void) | undefined
  private rasterToken = 0
  private rasterVisible = true
  private rasterVisibilityObserver: IntersectionObserver | undefined
  private spritePlaybackFrame = -1
  private spritePlaybackStartedAt = 0
  private spritePlaybackTimer: number | undefined
  private spritePlaybackUrl = ''

  private readonly handleDocumentVisibility = (): void => {
    this.syncRasterPlayback()
    this.requestUpdate()
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('visibilitychange', this.handleDocumentVisibility)

    if (typeof IntersectionObserver !== 'undefined') {
      this.rasterVisibilityObserver = new IntersectionObserver((entries) => {
        this.rasterVisible = entries.at(-1)?.isIntersecting ?? true
        this.syncRasterPlayback()
        this.requestUpdate()
      })
      this.rasterVisibilityObserver.observe(this)
    }
  }

  override disconnectedCallback(): void {
    this.rasterToken += 1
    document.removeEventListener('visibilitychange', this.handleDocumentVisibility)
    this.rasterVisibilityObserver?.disconnect()
    this.rasterVisibilityObserver = undefined
    this.clearRaster()
    super.disconnectedCallback()
  }

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-10' })
    this.queueRasterize()
  }

  override updated(): void {
    this.queueRasterize()
    this.syncRasterPlayback()
    this.syncSpritePlayback()
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const duration = Math.min(Math.max(resolveNumberValue(this.dur, 8), 6), 10)
    const showAnimation = this.animated
      && !this.paused
      && !this.rasterAsset
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0

    if (this.rasterAsset) {
      return html`
        ${this.rasterAsset.renderer === 'sprite'
          ? html`
            <canvas
              part="graphic raster"
              class="raster-sprite-canvas"
              width=${String(this.rasterAsset.width ?? baseSize)}
              height=${String(this.rasterAsset.height ?? baseSize)}
              aria-hidden="true"
            ></canvas>
          `
          : html`
            <video
              part="graphic raster"
              src=${this.rasterAsset.url}
              aria-hidden="true"
              autoplay
              loop
              muted
              playsinline
              preload="auto"
            ></video>
          `}

        <div part="content" class="content">
          <slot></slot>
        </div>
      `
    }

    return html`
      <svg
        part="graphic"
        width=${String(baseSize)}
        height=${String(baseSize)}
        viewBox="0 0 120 120"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent)}</defs>

        <rect
          part="grid"
          x="4"
          y="4"
          width="112"
          height="112"
          fill=${`url(#${this.gridPatternId})`}
          opacity="0.44"
        ></rect>

        <g part="background-nodes">
          ${backgroundNodeIndexes.map(index => this.renderBackgroundNode(index, primary, secondary, showAnimation))}
        </g>

        <g part="data-flow" opacity="0.72">
          ${dataLines.map((path, index) => this.renderDataLine(path, index, primary, secondary, showAnimation))}
        </g>

        <g part="ripple-grid">
          ${signalRipples.map(ripple => svg`
            <g part="signal-ripple" opacity="0.42">
              <circle
                cx=${String(ripple.x)}
                cy=${String(ripple.y)}
                r=${String(ripple.radius)}
                fill="transparent"
                stroke=${withAlpha(primary, 0.18)}
                stroke-width="0.42"
                stroke-dasharray="1.4,2.4"
              >
                ${showAnimation
                  ? svg`
                    <animate
                      attributeName="r"
                      values=${`${ripple.radius * 0.45};${ripple.radius};${ripple.radius * 1.42}`}
                      dur=${`${duration * 1.08}s`}
                      begin=${`${ripple.delay}s`}
                      repeatCount="indefinite"
                    ></animate>
                    <animate
                      attributeName="opacity"
                      values="0;0.62;0"
                      dur=${`${duration * 1.08}s`}
                      begin=${`${ripple.delay}s`}
                      repeatCount="indefinite"
                    ></animate>
                  `
                  : null}
              </circle>
            </g>
          `)}
        </g>

        <g part="halo" filter=${`url(#${this.softGlowFilterId})`}>
          <circle cx="60" cy="60" r="53.5" fill="transparent" stroke=${withAlpha(secondary, 0.26)} stroke-width="0.8"></circle>
          <circle cx="60" cy="60" r="47.8" fill="transparent" stroke=${withAlpha(primary, 0.32)} stroke-width="0.62"></circle>
          <circle cx="60" cy="60" r="39.8" fill="transparent" stroke=${withAlpha(secondary, 0.2)} stroke-width="0.52" stroke-dasharray="2.4,3.2"></circle>
          <circle cx="60" cy="60" r="29.4" fill="transparent" stroke=${withAlpha(primary, 0.2)} stroke-width="0.48"></circle>
          <circle cx="60" cy="60" r="18.4" fill="transparent" stroke=${withAlpha(accent, 0.18)} stroke-width="0.44" stroke-dasharray="1.2,2.4"></circle>
        </g>

        <g part="radial-grid">
          ${radialLineIndexes.map(index => this.renderRadialLine(index, primary, secondary))}
        </g>

        <g part="segmented-ring" filter=${`url(#${this.glowFilterId})`}>
          ${outerArcSegments.map(segment => svg`
            <path
              part="ring outer-ring"
              d=${arcPath(60, 60, segment.radius, segment.start, segment.end)}
              fill="transparent"
              stroke=${`url(#${this.arcGradientId})`}
              stroke-width=${String(segment.width)}
              stroke-linecap="butt"
              stroke-opacity=${String(segment.opacity)}
            ></path>
          `)}
          ${innerArcSegments.map(segment => svg`
            <path
              part="ring inner-ring"
              d=${arcPath(60, 60, 26.8, segment.start, segment.end)}
              fill="transparent"
              stroke=${primary}
              stroke-width="1"
              stroke-linecap="round"
              stroke-opacity="0.58"
            ></path>
          `)}
        </g>

        <g part="flow-ring" filter=${`url(#${this.softGlowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 60 60;360 60 60"
                dur=${`${duration * 1.65}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${flowArcSegments.map(segment => svg`
            <path
              part="ring flow-arc"
              d=${arcPath(60, 60, segment.radius, segment.start, segment.end)}
              fill="transparent"
              stroke=${segment.radius < 38 ? accent : primary}
              stroke-width="0.82"
              stroke-linecap="round"
              stroke-opacity=${String(segment.opacity)}
            ></path>
          `)}
        </g>

        <g part="ticks">
          ${tickIndexes.map(index => this.renderTick(index, primary, secondary))}
        </g>

        <g part="particles">
          ${particleIndexes.map(index => this.renderParticle(index, primary, accent, showAnimation))}
        </g>

        <g part="scanner" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 60 60;360 60 60"
                dur=${`${duration}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          <path
            part="scan-beam"
            d=${sectorPath(60, 60, 2.6, 49.2, 18, 62)}
            fill=${`url(#${this.scanGradientId})`}
            opacity="0.88"
          ></path>
          <path
            part="scan-beam"
            d=${sectorPath(60, 60, 4.8, 49.2, 48, 62)}
            fill=${withAlpha(primary, 0.2)}
            opacity="0.8"
          ></path>
          <line
            part="scan-edge"
            x1="60"
            y1="60"
            x2=${String(roundTo(polarPoint(60, 60, 50.2, 62).x, 3))}
            y2=${String(roundTo(polarPoint(60, 60, 50.2, 62).y, 3))}
            stroke=${primary}
            stroke-width="1"
            stroke-linecap="round"
            stroke-opacity="0.9"
          ></line>
        </g>

        <g part="targets" filter=${`url(#${this.glowFilterId})`}>
          ${targetSignals.map(target => this.renderTarget(target, primary, secondary, accent, duration, showAnimation))}
        </g>

        <g part="center" filter=${`url(#${this.softGlowFilterId})`}>
          <circle cx="60" cy="60" r="7.4" fill="rgba(1, 9, 24, 0.9)" stroke=${withAlpha(primary, 0.42)} stroke-width="0.62"></circle>
          <circle part="center-pulse" cx="60" cy="60" r="2.4" fill=${primary} opacity="0.78">
            ${showAnimation
              ? svg`
                <animate attributeName="r" values="1.7;2.8;1.7" dur=${`${duration / 2}s`} repeatCount="indefinite"></animate>
                <animate attributeName="opacity" values="0.46;0.9;0.46" dur=${`${duration / 2}s`} repeatCount="indefinite"></animate>
              `
              : null}
          </circle>
          <circle cx="60" cy="60" r="11.2" fill="transparent" stroke=${withAlpha(accent, 0.2)} stroke-width="0.5" stroke-dasharray="1,2.2"></circle>
        </g>
      </svg>

      <div part="content" class="content">
        <slot></slot>
      </div>
    `
  }

  private queueRasterize(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return

    const key = this.createRasterKey()
    if (!key) {
      this.pendingRasterKey = ''
      this.rasterKey = ''
      this.clearRaster()
      return
    }

    if (key === this.rasterKey || key === this.pendingRasterKey)
      return

    this.clearRaster()
    this.pendingRasterKey = key
    const token = ++this.rasterToken

    window.setTimeout(() => {
      void this.generateRaster(token, key)
    }, 0)
  }

  private async generateRaster(token: number, key: string): Promise<void> {
    try {
      const sourceSvg = this.renderRoot.querySelector('svg')
      if (!sourceSvg)
        return

      const duration = Math.min(Math.max(resolveNumberValue(this.dur, 8), 6), 10)
      const rasterSize = this.resolveRasterSize()
      const renderer = this.resolveRasterRenderer()
      const raster = await acquireDecoration10Raster(key, sourceSvg, duration, rasterSize, renderer)

      if (token !== this.rasterToken || key !== this.pendingRasterKey) {
        raster.release()
        return
      }

      this.pendingRasterKey = ''
      this.rasterKey = key
      this.rasterRelease = raster.release
      this.rasterAsset = raster.asset
    }
    catch (error) {
      if (token === this.rasterToken)
        this.pendingRasterKey = ''

      this.emit('dvk-raster-error', {
        message: error instanceof Error ? error.message : String(error),
      }, { bubbles: false })
    }
  }

  private createRasterKey(): string {
    if (!this.animated || this.paused || this.prefersReducedMotion())
      return ''

    if (this.size.width <= 0 || this.size.height <= 0)
      return ''

    if (typeof document === 'undefined')
      return ''

    const [primary, secondary, accent] = this.resolveColors()
    const duration = Math.min(Math.max(resolveNumberValue(this.dur, 8), 6), 10)
    const rasterSize = this.resolveRasterSize()
    const renderer = this.resolveRasterRenderer()

    return [
      renderer,
      primary,
      secondary,
      accent,
      duration,
      rasterSize.width,
      rasterSize.height,
      Math.round(rasterSize.displayWidth),
    ].join('|')
  }

  private resolveRasterSize(): Decoration10RasterSize {
    const contentWidth = Math.min(
      Math.max(this.size.width, baseSize),
      Math.max(this.size.height, baseSize),
    )
    const requestedWidth = contentWidth * resolveRasterScale()
    const width = Math.round(Math.min(Math.max(requestedWidth, minRasterWidth), maxRasterWidth))

    return {
      width,
      height: width,
      displayWidth: contentWidth,
    }
  }

  private resolveRasterRenderer(): Decoration10RasterRenderer {
    if (this.rasterRenderer === 'sprite')
      return this.rasterRenderer

    return 'video'
  }

  private clearRaster(): void {
    this.stopSpritePlayback()
    this.spritePlaybackFrame = -1
    this.spritePlaybackStartedAt = 0
    this.spritePlaybackUrl = ''
    this.rasterRelease?.()
    this.rasterRelease = undefined
    this.rasterAsset = undefined
  }

  private syncRasterPlayback(): void {
    if (typeof document === 'undefined')
      return

    const video = this.renderRoot.querySelector('video')
    if (!(video instanceof HTMLVideoElement))
      return

    if (this.animated && !this.paused && this.rasterVisible && !document.hidden) {
      void video.play().catch(() => undefined)
      return
    }

    video.pause()
  }

  private shouldPlayRaster(): boolean {
    return this.animated && !this.paused && this.rasterVisible && (typeof document === 'undefined' || !document.hidden)
  }

  private syncSpritePlayback(): void {
    const asset = this.rasterAsset
    if (!asset || asset.renderer !== 'sprite') {
      this.stopSpritePlayback()
      return
    }

    const canvas = this.renderRoot.querySelector('canvas.raster-sprite-canvas')
    if (!(canvas instanceof HTMLCanvasElement) || !asset.image)
      return

    if (this.spritePlaybackUrl !== asset.url) {
      this.stopSpritePlayback()
      this.spritePlaybackUrl = asset.url
      this.spritePlaybackFrame = -1
      this.spritePlaybackStartedAt = performance.now()
      this.drawSpriteFrame(asset, canvas, 0)
    }

    if (!this.shouldPlayRaster()) {
      this.stopSpritePlayback()
      return
    }

    if (this.spritePlaybackTimer === undefined)
      this.scheduleSpritePlayback(asset, canvas)
  }

  private scheduleSpritePlayback(asset: Decoration10RasterAsset, canvas: HTMLCanvasElement): void {
    const frameDelay = Math.max(asset.frameDelay ?? spriteRasterFrameDelay, 1)
    const timeout = Math.max(Math.min(frameDelay, 50), 16)

    this.spritePlaybackTimer = window.setTimeout(() => {
      this.spritePlaybackTimer = undefined

      if (this.rasterAsset !== asset || !this.shouldPlayRaster())
        return

      const frameCount = Math.max(asset.frameCount ?? 1, 1)
      const elapsed = performance.now() - this.spritePlaybackStartedAt
      const frame = Math.floor(elapsed / frameDelay) % frameCount

      this.drawSpriteFrame(asset, canvas, frame)
      this.scheduleSpritePlayback(asset, canvas)
    }, timeout)
  }

  private drawSpriteFrame(asset: Decoration10RasterAsset, canvas: HTMLCanvasElement, frame: number): void {
    const image = asset.image
    if (!image)
      return

    const columns = Math.max(asset.columns ?? 1, 1)
    const rows = Math.max(asset.rows ?? 1, 1)
    const frameCount = Math.max(asset.frameCount ?? columns * rows, 1)
    const frameWidth = Math.max(asset.width ?? canvas.width, 1)
    const frameHeight = Math.max(asset.height ?? canvas.height, 1)
    const frameIndex = ((frame % frameCount) + frameCount) % frameCount

    if (frameIndex === this.spritePlaybackFrame && canvas.width === frameWidth && canvas.height === frameHeight)
      return

    if (canvas.width !== frameWidth)
      canvas.width = frameWidth

    if (canvas.height !== frameHeight)
      canvas.height = frameHeight

    const context = canvas.getContext('2d')
    if (!context)
      return

    const column = frameIndex % columns
    const row = Math.floor(frameIndex / columns)

    context.clearRect(0, 0, frameWidth, frameHeight)
    context.drawImage(
      image,
      column * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth,
      frameHeight,
    )
    this.spritePlaybackFrame = frameIndex
  }

  private stopSpritePlayback(): void {
    if (this.spritePlaybackTimer !== undefined) {
      window.clearTimeout(this.spritePlaybackTimer)
      this.spritePlaybackTimer = undefined
    }
  }

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <pattern id=${this.gridPatternId} width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 8 0 H 0 V 8" fill="transparent" stroke=${withAlpha(secondary, 0.18)} stroke-width="0.28"></path>
        <path d="M 4 0 V 8 M 0 4 H 8" fill="transparent" stroke=${withAlpha(primary, 0.08)} stroke-width="0.18"></path>
      </pattern>

      <linearGradient id=${this.arcGradientId} x1="12" y1="16" x2="108" y2="104" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.24"></stop>
        <stop offset="34%" stop-color=${primary} stop-opacity="0.98"></stop>
        <stop offset="76%" stop-color="#2f8cff" stop-opacity="0.72"></stop>
        <stop offset="100%" stop-color=${accent} stop-opacity="0.42"></stop>
      </linearGradient>

      <radialGradient id=${this.scanGradientId} cx="0%" cy="100%" r="115%">
        <stop offset="0%" stop-color=${primary} stop-opacity="0.02"></stop>
        <stop offset="50%" stop-color=${primary} stop-opacity="0.1"></stop>
        <stop offset="82%" stop-color=${secondary} stop-opacity="0.22"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0.48"></stop>
      </radialGradient>

      <radialGradient id=${this.targetGradientId} cx="50%" cy="50%" r="58%">
        <stop offset="0%" stop-color="#f3fdff" stop-opacity="0.98"></stop>
        <stop offset="48%" stop-color=${primary} stop-opacity="0.9"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.1"></stop>
      </radialGradient>

      <filter id=${this.glowFilterId} x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1.2" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.softGlowFilterId} x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="0.58" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderDataLine(path: string, index: number, primary: string, secondary: string, showAnimation: boolean): unknown {
    const color = index % 2 === 0 ? primary : secondary

    return svg`
      <path
        part="data-line"
        d=${path}
        fill="transparent"
        stroke=${color}
        stroke-width="0.45"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity=${String(0.18 + pseudoRandom(index, 7) * 0.16)}
        stroke-dasharray="3, 5"
      >
        ${showAnimation
          ? svg`
            <animate
              attributeName="stroke-dashoffset"
              values="0;-16"
              dur=${`${5.8 + index * 0.4}s`}
              repeatCount="indefinite"
            ></animate>
          `
          : null}
      </path>
    `
  }

  private renderBackgroundNode(index: number, primary: string, secondary: string, showAnimation: boolean): unknown {
    const x = 8 + pseudoRandom(index, 29) * 104
    const y = 8 + pseudoRandom(index, 31) * 104
    const active = index % 6 === 0

    return svg`
      <circle
        part="background-node"
        cx=${String(roundTo(x, 3))}
        cy=${String(roundTo(y, 3))}
        r=${active ? '0.68' : '0.42'}
        fill=${active ? primary : secondary}
        opacity=${active ? '0.28' : '0.14'}
      >
        ${showAnimation
          ? svg`
            <animate
              attributeName="opacity"
              values=${active ? '0.12;0.44;0.12' : '0.06;0.22;0.06'}
              dur=${`${4.2 + pseudoRandom(index, 37) * 2.2}s`}
              begin=${`${pseudoRandom(index, 41) * 2.4}s`}
              repeatCount="indefinite"
            ></animate>
          `
          : null}
      </circle>
    `
  }

  private renderRadialLine(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / radialLineCount
    const opacity = index % 3 === 0 ? 0.34 : 0.17

    return svg`
      <line
        part="radial-line"
        x1="60"
        y1="23.2"
        x2="60"
        y2="54.2"
        stroke=${index % 3 === 0 ? primary : secondary}
        stroke-width=${index % 3 === 0 ? '0.45' : '0.28'}
        stroke-opacity=${String(opacity)}
        transform=${`rotate(${roundTo(angle, 3)} 60 60)`}
      ></line>
    `
  }

  private renderTick(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / tickCount
    const isMajor = index % 10 === 0
    const isMid = index % 5 === 0
    const radius = isMajor ? 55.3 : 52.8
    const length = isMajor ? 4.7 : isMid ? 3 : 1.5

    return svg`
      <line
        part="tick"
        x1="60"
        y1=${String(roundTo(60 - radius, 3))}
        x2="60"
        y2=${String(roundTo(60 - radius + length, 3))}
        stroke=${isMajor ? primary : secondary}
        stroke-width=${isMajor ? '0.62' : '0.34'}
        stroke-linecap="round"
        stroke-opacity=${isMajor ? '0.68' : isMid ? '0.36' : '0.2'}
        transform=${`rotate(${roundTo(angle, 3)} 60 60)`}
      ></line>
    `
  }

  private renderParticle(index: number, primary: string, accent: string, showAnimation: boolean): unknown {
    const angle = pseudoRandom(index, 3) * 360
    const radius = 17 + pseudoRandom(index, 11) * 33
    const point = polarPoint(60, 60, radius, angle)
    const active = index % 7 === 0

    return svg`
      <circle
        part="particle"
        cx=${String(roundTo(point.x, 3))}
        cy=${String(roundTo(point.y, 3))}
        r=${active ? '0.58' : '0.34'}
        fill=${active ? accent : primary}
        opacity=${active ? '0.5' : '0.24'}
      >
        ${showAnimation
          ? svg`
            <animate
              attributeName="opacity"
              values=${active ? '0.22;0.72;0.22' : '0.12;0.38;0.12'}
              dur=${`${3.2 + pseudoRandom(index, 17) * 2.6}s`}
              begin=${`${pseudoRandom(index, 23) * 2}s`}
              repeatCount="indefinite"
            ></animate>
          `
          : null}
      </circle>
    `
  }

  private renderTarget(
    target: { angle: number, radius: number, size: number, accent: boolean },
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    const point = polarPoint(60, 60, target.radius, target.angle)
    const color = target.accent ? accent : primary
    const delay = roundTo(((target.angle - 62 + 360) % 360) / 360 * duration, 3)

    return svg`
      <g part="target" transform=${`translate(${roundTo(point.x, 3)} ${roundTo(point.y, 3)})`}>
        <circle
          part="target-ripple"
          cx="0"
          cy="0"
          r=${String(target.size * 2.4)}
          fill="transparent"
          stroke=${color}
          stroke-width="0.38"
          stroke-opacity="0.24"
        >
          ${showAnimation
            ? svg`
              <animate
                attributeName="r"
                values=${`${target.size * 1.8};${target.size * 5.8}`}
                dur="1.2s"
                begin=${`${delay}s`}
                repeatCount="indefinite"
              ></animate>
              <animate
                attributeName="stroke-opacity"
                values="0.68;0"
                dur="1.2s"
                begin=${`${delay}s`}
                repeatCount="indefinite"
              ></animate>
            `
            : null}
        </circle>
        <circle
          part="target-core"
          cx="0"
          cy="0"
          r=${String(target.size)}
          fill=${target.accent ? accent : `url(#${this.targetGradientId})`}
          stroke=${secondary}
          stroke-width="0.32"
          opacity="0.72"
        >
          ${showAnimation
            ? svg`
              <animate
                attributeName="opacity"
                values="0.48;1;0.48"
                dur="1.2s"
                begin=${`${delay}s`}
                repeatCount="indefinite"
              ></animate>
            `
            : null}
        </circle>
      </g>
    `
  }

  private resolveColors(): [string, string, string] {
    const colorList = this.resolveColorList()
    const explicitPrimary = typeof this.color === 'string' && !isJsonArrayString(this.color)
      ? this.color
      : ''
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: 'rgba(88, 232, 255, 0.88)',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: 'rgba(47, 140, 255, 0.62)',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: '',
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: 'rgba(158, 126, 255, 0.68)',
    })

    return [primary, secondary, accent]
  }

  private resolveColorList(): string[] {
    const colors = splitColors(this.colors)

    if (colors.length > 0)
      return colors

    if (Array.isArray(this.color))
      return this.color.map(color => String(color).trim()).filter(Boolean)

    if (typeof this.color === 'string' && isJsonArrayString(this.color)) {
      try {
        const parsed = JSON.parse(this.color)

        if (Array.isArray(parsed))
          return parsed.map(color => String(color).trim()).filter(Boolean)
      }
      catch {
        return []
      }
    }

    return []
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}

function resolveRasterScale(): number {
  const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1

  return Math.min(Math.max(ratio, minRasterScale), maxRasterScale)
}

async function createRasterVideo(sourceSvg: SVGSVGElement, duration: number, size: Decoration10RasterSize): Promise<Decoration10RasterAsset> {
  const loopDuration = duration * rasterLoopDurationMultiplier
  const frameCount = Math.min(Math.max(Math.round(loopDuration * rasterFrameRate), minRasterFrameCount), maxRasterFrameCount)
  const strokeWidthScale = size.width / Math.max(size.displayWidth, baseSize)

  const url = await rasterizeSvgToVideo(sourceSvg, {
    width: size.width,
    height: size.height,
    frameCount,
    frameDelay: rasterFrameDelay,
    prepareFrame: (svg, frame) => prepareDecoration10RasterFrame(svg, frame, duration),
    strokeWidthScale,
    videoBitsPerSecond: rasterVideoBitsPerSecond,
  })

  return {
    url,
    renderer: 'video',
  }
}

async function createRasterSprite(sourceSvg: SVGSVGElement, duration: number, size: Decoration10RasterSize): Promise<Decoration10RasterAsset> {
  const loopDuration = duration * rasterLoopDurationMultiplier
  const requestedFrameCount = Math.min(Math.max(Math.round(loopDuration * spriteRasterFrameRate), spriteMinRasterFrameCount), spriteMaxRasterFrameCount)
  const columns = Math.ceil(Math.sqrt(requestedFrameCount))
  const rows = Math.ceil(requestedFrameCount / columns)
  const frameCount = columns * rows
  const frameDelay = loopDuration * 1000 / frameCount
  const widthCeiling = Math.min(size.width, spriteMaxRasterWidth)
  const maxWidthByBudget = Math.floor(Math.sqrt(spriteRawAtlasBudgetBytes / (frameCount * 4)))
  const widthFloor = Math.min(spriteMinRasterWidth, widthCeiling)
  const width = Math.max(Math.min(widthCeiling, maxWidthByBudget), widthFloor)
  const result = await rasterizeSvgToPngSprite(sourceSvg, {
    width,
    height: width,
    frameCount,
    columns,
    rows,
    frameDelay,
    prepareFrame: (svg, frame) => prepareDecoration10RasterFrame(svg, frame, duration),
    strokeWidthScale: width / Math.max(size.displayWidth, baseSize),
  })
  const image = await loadRasterImage(result.url)

  return {
    url: result.url,
    renderer: 'sprite',
    frameCount: result.frameCount,
    columns: result.columns,
    rows: result.rows,
    frameDelay: result.frameDelay,
    height: result.height,
    image,
    width: result.width,
  }
}

function loadRasterImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.decoding = 'async'
    image.onload = () => {
      if (typeof image.decode !== 'function') {
        resolve(image)
        return
      }

      void image.decode().then(
        () => resolve(image),
        () => resolve(image),
      )
    }
    image.onerror = () => reject(new Error('Unable to decode sprite atlas.'))
    image.src = url
  })
}

async function acquireDecoration10Raster(
  key: string,
  sourceSvg: SVGSVGElement,
  duration: number,
  size: Decoration10RasterSize,
  renderer: Decoration10RasterRenderer,
): Promise<Decoration10RasterHandle> {
  let entry = rasterCache.get(key)

  if (!entry) {
    entry = {
      lastUsed: Date.now(),
      refs: 0,
    }
    rasterCache.set(key, entry)
  }

  entry.refs += 1
  entry.lastUsed = Date.now()

  if (!entry.asset && !entry.promise) {
    entry.promise = enqueueRaster(sourceSvg, duration, size, renderer)
      .then((asset) => {
        if (rasterCache.get(key) === entry) {
          entry.asset = asset
          entry.promise = undefined
          trimRasterCache()
        }

        return asset
      })
      .catch((error) => {
        if (rasterCache.get(key) === entry)
          rasterCache.delete(key)

        throw error
      })
  }

  try {
    let asset = entry.asset

    if (!asset) {
      if (!entry.promise)
        throw new Error('Decoration 10 rasterization did not start.')

      asset = await entry.promise
    }

    return {
      asset,
      release: () => releaseDecoration10Raster(key),
    }
  }
  catch (error) {
    releaseDecoration10Raster(key)
    throw error
  }
}

function enqueueRaster(
  sourceSvg: SVGSVGElement,
  duration: number,
  size: Decoration10RasterSize,
  renderer: Decoration10RasterRenderer,
): Promise<Decoration10RasterAsset> {
  const run = rasterQueue.then(() => {
    if (renderer === 'sprite')
      return createRasterSprite(sourceSvg, duration, size)

    return createRasterVideo(sourceSvg, duration, size)
  })

  rasterQueue = run.then(
    () => undefined,
    () => undefined,
  )

  return run
}

function releaseDecoration10Raster(key: string): void {
  const entry = rasterCache.get(key)
  if (!entry)
    return

  entry.refs = Math.max(entry.refs - 1, 0)
  entry.lastUsed = Date.now()
  trimRasterCache()
}

function trimRasterCache(): void {
  const releasable = [...rasterCache.entries()]
    .filter(([, entry]) => entry.refs === 0 && entry.asset)
    .sort(([, left], [, right]) => left.lastUsed - right.lastUsed)

  while (rasterCache.size > maxRasterCacheEntries && releasable.length > 0) {
    const [key, entry] = releasable.shift()!

    if (entry.asset)
      URL.revokeObjectURL(entry.asset.url)

    rasterCache.delete(key)
  }
}

function prepareDecoration10RasterFrame(svg: SVGSVGElement, frame: SvgVideoRasterFrame, duration: number): void {
  svg.querySelectorAll('animate, animateTransform').forEach(node => node.remove())

  setRasterRotation(svg, 'flow-ring', 360 * cycleProgress(frame.elapsed, duration * 1.65))
  setRasterRotation(svg, 'scanner', 360 * cycleProgress(frame.elapsed, duration))
  setRasterDataLines(svg, frame.elapsed)
  setRasterBackgroundNodes(svg, frame.elapsed)
  setRasterSignalRipples(svg, frame.elapsed, duration)
  setRasterParticles(svg, frame.elapsed)
  setRasterTargets(svg, frame.elapsed, duration)
  setRasterCenterPulse(svg, frame.elapsed, duration)
}

function setRasterRotation(svg: SVGSVGElement, part: string, angle: number): void {
  const node = svg.querySelector(`[part~="${part}"]`)

  if (node instanceof SVGElement)
    node.setAttribute('transform', `rotate(${roundTo(angle, 3)} 60 60)`)
}

function setRasterDataLines(svg: SVGSVGElement, elapsed: number): void {
  svg.querySelectorAll('[part~="data-line"]').forEach((node, index) => {
    if (node instanceof SVGElement) {
      const duration = 5.8 + index * 0.4
      node.setAttribute('stroke-dashoffset', String(roundTo(-16 * cycleProgress(elapsed, duration), 3)))
    }
  })
}

function setRasterBackgroundNodes(svg: SVGSVGElement, elapsed: number): void {
  svg.querySelectorAll('[part~="background-node"]').forEach((node, index) => {
    if (node instanceof SVGElement) {
      const active = index % 6 === 0
      const duration = 4.2 + pseudoRandom(index, 37) * 2.2
      const delay = pseudoRandom(index, 41) * 2.4
      const opacity = active
        ? pulseValue(elapsed, duration, delay, 0.12, 0.44)
        : pulseValue(elapsed, duration, delay, 0.06, 0.22)

      node.setAttribute('opacity', String(roundTo(opacity, 3)))
    }
  })
}

function setRasterSignalRipples(svg: SVGSVGElement, elapsed: number, duration: number): void {
  svg.querySelectorAll('[part~="signal-ripple"]').forEach((node, index) => {
    const circle = node.querySelector('circle')
    const ripple = signalRipples[index]

    if (circle instanceof SVGElement && ripple) {
      const progress = cycleProgress(elapsed - ripple.delay, duration * 1.08)
      const radius = progress < 0.5
        ? lerp(ripple.radius * 0.45, ripple.radius, progress * 2)
        : lerp(ripple.radius, ripple.radius * 1.42, (progress - 0.5) * 2)

      circle.setAttribute('r', String(roundTo(radius, 3)))
      circle.setAttribute('opacity', String(roundTo(progress < 0.5 ? progress * 1.24 : (1 - progress) * 1.24, 3)))
    }
  })
}

function setRasterParticles(svg: SVGSVGElement, elapsed: number): void {
  svg.querySelectorAll('[part~="particle"]').forEach((node, index) => {
    if (node instanceof SVGElement) {
      const active = index % 7 === 0
      const duration = 3.2 + pseudoRandom(index, 17) * 2.6
      const delay = pseudoRandom(index, 23) * 2
      const opacity = active
        ? pulseValue(elapsed, duration, delay, 0.22, 0.72)
        : pulseValue(elapsed, duration, delay, 0.12, 0.38)

      node.setAttribute('opacity', String(roundTo(opacity, 3)))
    }
  })
}

function setRasterTargets(svg: SVGSVGElement, elapsed: number, duration: number): void {
  svg.querySelectorAll('[part~="target"]').forEach((node, index) => {
    const ripple = node.querySelector('[part~="target-ripple"]')
    const core = node.querySelector('[part~="target-core"]')
    const target = targetSignals[index]

    if (!target)
      return

    const delay = ((target.angle - 62 + 360) % 360) / 360 * duration
    const progress = cycleProgress(elapsed - delay, 1.2)

    if (ripple instanceof SVGElement) {
      ripple.setAttribute('r', String(roundTo(lerp(target.size * 1.8, target.size * 5.8, progress), 3)))
      ripple.setAttribute('stroke-opacity', String(roundTo(lerp(0.68, 0, progress), 3)))
    }

    if (core instanceof SVGElement)
      core.setAttribute('opacity', String(roundTo(progress < 0.5 ? lerp(0.48, 1, progress * 2) : lerp(1, 0.48, (progress - 0.5) * 2), 3)))
  })
}

function setRasterCenterPulse(svg: SVGSVGElement, elapsed: number, duration: number): void {
  const node = svg.querySelector('[part~="center-pulse"]')
  if (!(node instanceof SVGElement))
    return

  const progress = cycleProgress(elapsed, duration / 2)
  const phase = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2

  node.setAttribute('r', String(roundTo(progress < 0.5 ? lerp(1.7, 2.8, phase) : lerp(2.8, 1.7, phase), 3)))
  node.setAttribute('opacity', String(roundTo(progress < 0.5 ? lerp(0.46, 0.9, phase) : lerp(0.9, 0.46, phase), 3)))
}

function cycleProgress(elapsed: number, duration: number): number {
  if (duration <= 0)
    return 0

  return positiveModulo(elapsed, duration) / duration
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor
}

function pulseValue(elapsed: number, duration: number, delay: number, low: number, high: number): number {
  const progress = cycleProgress(elapsed - delay, duration)

  return progress < 0.5
    ? lerp(low, high, progress * 2)
    : lerp(high, low, (progress - 0.5) * 2)
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress
}

function splitColors(value: string): string[] {
  return value.split(',').map(color => color.trim()).filter(Boolean)
}

function isJsonArrayString(value: string): boolean {
  return value.trim().startsWith('[')
}

function withAlpha(color: string, alpha: number): string {
  const trimmed = color.trim()
  const clampedAlpha = Math.min(Math.max(alpha, 0), 1)
  const hex = trimmed.match(/^#([\da-f]{3}|[\da-f]{6})$/i)

  if (hex) {
    const value = hex[1].length === 3
      ? hex[1].split('').map(part => `${part}${part}`).join('')
      : hex[1]
    const red = Number.parseInt(value.slice(0, 2), 16)
    const green = Number.parseInt(value.slice(2, 4), 16)
    const blue = Number.parseInt(value.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`
  }

  const rgb = trimmed.match(/^rgba?\((.+)\)$/i)

  if (rgb) {
    const parts = rgb[1].split(',').map(part => part.trim()).filter(Boolean)
    if (parts.length >= 3)
      return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return trimmed
}

function pseudoRandom(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 9301 + salt * 49297) * 233280

  return value - Math.floor(value)
}

function roundTo(value: number, precision: number): number {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}

function polarPoint(cx: number, cy: number, radius: number, angle: number): { x: number, y: number } {
  const radians = (angle - 90) * Math.PI / 180

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function arcPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarPoint(cx, cy, radius, endAngle)
  const end = polarPoint(cx, cy, radius, startAngle)
  const largeArc = Math.abs(endAngle - startAngle) <= 180 ? 0 : 1

  return [
    `M ${roundTo(start.x, 3)} ${roundTo(start.y, 3)}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${roundTo(end.x, 3)} ${roundTo(end.y, 3)}`,
  ].join(' ')
}

function sectorPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = polarPoint(cx, cy, outerRadius, startAngle)
  const outerEnd = polarPoint(cx, cy, outerRadius, endAngle)
  const innerStart = polarPoint(cx, cy, innerRadius, startAngle)
  const innerEnd = polarPoint(cx, cy, innerRadius, endAngle)
  const largeArc = Math.abs(endAngle - startAngle) <= 180 ? 0 : 1

  return [
    `M ${roundTo(innerStart.x, 3)} ${roundTo(innerStart.y, 3)}`,
    `L ${roundTo(outerStart.x, 3)} ${roundTo(outerStart.y, 3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${roundTo(outerEnd.x, 3)} ${roundTo(outerEnd.y, 3)}`,
    `L ${roundTo(innerEnd.x, 3)} ${roundTo(innerEnd.y, 3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${roundTo(innerStart.x, 3)} ${roundTo(innerStart.y, 3)}`,
    'Z',
  ].join(' ')
}
