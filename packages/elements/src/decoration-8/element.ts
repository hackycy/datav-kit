import type { SvgVideoRasterFrame } from '../internal/svg-video-rasterizer'
import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { rasterizeSvgToPngSprite } from '../internal/svg-png-sprite-rasterizer'
import { rasterizeSvgToVideo } from '../internal/svg-video-rasterizer'

interface Decoration8Size {
  width: number
  height: number
}

interface Decoration8RasterSize extends Decoration8Size {
  displayWidth: number
}

interface Decoration8RasterHandle {
  asset: Decoration8RasterAsset
  release: () => void
}

interface Decoration8RasterCacheEntry {
  lastUsed: number
  asset?: Decoration8RasterAsset
  promise?: Promise<Decoration8RasterAsset>
  refs: number
}

interface Decoration8RasterAsset {
  url: string
  renderer: Decoration8RasterRenderer
  frameCount?: number
  columns?: number
  rows?: number
  frameDelay?: number
  image?: HTMLImageElement
  layers?: Decoration8RasterLayer[]
  height?: number
  width?: number
}

interface Decoration8RasterLayer {
  image: HTMLImageElement
  kind: Decoration8RasterLayerKind
  url: string
}

type Decoration8RasterRenderer = 'sprite' | 'video'
type Decoration8RasterLayerKind = 'static' | 'outer-arc-band' | 'outer-arc-trace' | 'segmented-track' | 'energy-blocks'

const defaultSize: Decoration8Size = {
  width: 0,
  height: 0,
}
const baseSize = 100
const minRasterWidth = 300
const maxRasterWidth = 960
const minRasterScale = 1.5
const maxRasterScale = 2
const rasterFrameRate = 24
const minRasterFrameCount = 240
const maxRasterFrameCount = 672
const rasterFrameDelay = 1000 / rasterFrameRate
const rasterLoopDurationMultiplier = 4
const rasterVideoBitsPerSecond = 8_000_000
const spriteMaxRasterWidth = 640
const spriteMinRasterWidth = 300
const spriteRasterFrameRate = 24
const spriteRasterFrameDelay = 1000 / spriteRasterFrameRate
const maxRasterCacheEntries = 12
const rasterLayerKinds: Decoration8RasterLayerKind[] = ['static', 'outer-arc-band', 'outer-arc-trace', 'segmented-track', 'energy-blocks']
const outerArcSegments = [
  { start: -94, end: -38, width: 5.9, opacity: 0.96 },
  { start: -18, end: -2, width: 4.2, opacity: 0.5 },
  { start: 24, end: 80, width: 5.4, opacity: 0.88 },
  { start: 108, end: 126, width: 4.1, opacity: 0.48 },
  { start: 150, end: 216, width: 5.7, opacity: 0.92 },
  { start: 242, end: 260, width: 4.1, opacity: 0.5 },
]
const outerTraceSegments = [
  { start: -34, end: -22, width: 1.5, opacity: 0.68 },
  { start: 4, end: 18, width: 1.1, opacity: 0.4 },
  { start: 86, end: 102, width: 1.45, opacity: 0.72 },
  { start: 132, end: 144, width: 1.2, opacity: 0.46 },
  { start: 222, end: 236, width: 1.35, opacity: 0.62 },
]
const innerArcSegments = [
  { start: -48, end: -12 },
  { start: 36, end: 66 },
  { start: 96, end: 132 },
  { start: 178, end: 214 },
  { start: 246, end: 276 },
  { start: 312, end: 348 },
]
const blockCount = 32
const tickCount = 96
const microLightCount = 48
const blockIndexes = Array.from({ length: blockCount }, (_, index) => index)
const tickIndexes = Array.from({ length: tickCount }, (_, index) => index)
const microLightIndexes = Array.from({ length: microLightCount }, (_, index) => index)
const defaultTrueBooleanConverter = {
  fromAttribute(value: string | null): boolean {
    if (value === null)
      return true

    return !['0', 'false', 'off'].includes(value.trim().toLowerCase())
  },
  toAttribute(value: boolean): string {
    return String(value)
  },
}

let decoration8Id = 0
let rasterQueue = Promise.resolve()
const rasterCache = new Map<string, Decoration8RasterCacheEntry>()

export class Decoration8Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, rgba(3, 166, 224, 0.8));
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
  dur = 5

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @property({ attribute: 'video-rasterize', converter: defaultTrueBooleanConverter })
  videoRasterize = true

  @property({ attribute: 'raster-renderer' })
  rasterRenderer: Decoration8RasterRenderer = 'sprite'

  @state()
  private size = defaultSize

  @state()
  private rasterAsset: Decoration8RasterAsset | undefined

  private readonly instanceId = ++decoration8Id
  private readonly backgroundGradientId = `dvk-decoration-8-background-${this.instanceId}`
  private readonly coreGradientId = `dvk-decoration-8-core-${this.instanceId}`
  private readonly arcGradientId = `dvk-decoration-8-arc-${this.instanceId}`
  private readonly blockGradientId = `dvk-decoration-8-block-${this.instanceId}`
  private readonly blockInnerGradientId = `dvk-decoration-8-block-inner-${this.instanceId}`
  private readonly glowFilterId = `dvk-decoration-8-glow-${this.instanceId}`
  private readonly softGlowFilterId = `dvk-decoration-8-soft-glow-${this.instanceId}`

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
    this.emit('dvk-ready', { tagName: 'dvk-decoration-8' })
    this.queueRasterize()
  }

  override updated(): void {
    this.queueRasterize()
    this.syncRasterPlayback()
    this.syncSpritePlayback()
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const duration = Math.max(resolveNumberValue(this.dur, 5), 0.1)
    const showAnimation = this.animated
      && !this.paused
      && !this.rasterAsset
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0

    return html`
      ${this.rasterAsset
        ? this.renderRasterAsset()
        : this.renderSvg(primary, secondary, duration, showAnimation)}

      <div part="content" class="content">
        <slot></slot>
      </div>
    `
  }

  private renderRasterAsset(): unknown {
    if (this.rasterAsset?.renderer === 'sprite') {
      return html`
        <canvas
          part="graphic raster"
          class="raster-sprite-canvas"
          width=${String(this.rasterAsset.width ?? baseSize)}
          height=${String(this.rasterAsset.height ?? baseSize)}
          aria-hidden="true"
        ></canvas>
      `
    }

    return html`
      <video
        part="graphic raster"
        src=${this.rasterAsset?.url}
        aria-hidden="true"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
      ></video>
    `
  }

  private renderSvg(primary: string, secondary: string, duration: number, showAnimation: boolean): unknown {
    return html`
      <svg
        part="graphic"
        width=${String(baseSize)}
        height=${String(baseSize)}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary)}</defs>

        <circle
          part="background"
          cx="50"
          cy="50"
          r="49"
          fill=${`url(#${this.backgroundGradientId})`}
        ></circle>

        <g part="halo" filter=${`url(#${this.softGlowFilterId})`} opacity="0.85">
          <circle cx="50" cy="50" r="45.5" fill="transparent" stroke=${withAlpha(secondary, 0.16)} stroke-width="0.8"></circle>
          <circle cx="50" cy="50" r="38.5" fill="transparent" stroke=${withAlpha(primary, 0.16)} stroke-width="0.55"></circle>
          <circle cx="50" cy="50" r="25.5" fill="transparent" stroke=${withAlpha(secondary, 0.14)} stroke-width="0.5"></circle>
        </g>

        <g part="outer-arcs" filter=${`url(#${this.glowFilterId})`}>
          <g part="outer-arc-band">
            ${showAnimation
              ? svg`
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 50 50;360 50 50"
                  dur=${`${duration * 1.28}s`}
                  repeatCount="indefinite"
                ></animateTransform>
              `
              : null}
            ${outerArcSegments.map(segment => svg`
              <path
                part="ring outer-ring"
                d=${arcPath(50, 50, 44.2, segment.start, segment.end)}
                fill="transparent"
                stroke=${`url(#${this.arcGradientId})`}
                stroke-width=${String(segment.width)}
                stroke-linecap="butt"
                stroke-opacity=${String(segment.opacity)}
              ></path>
            `)}
          </g>

          <g part="outer-arc-trace">
            ${showAnimation
              ? svg`
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 50 50;-360 50 50"
                  dur=${`${duration * 1.85}s`}
                  repeatCount="indefinite"
                ></animateTransform>
              `
              : null}
            ${outerTraceSegments.map(segment => svg`
              <path
                part="ring outer-trace"
                d=${arcPath(50, 50, 40.1, segment.start, segment.end)}
                fill="transparent"
                stroke=${`url(#${this.arcGradientId})`}
                stroke-width=${String(segment.width)}
                stroke-linecap="round"
                stroke-opacity=${String(segment.opacity)}
              ></path>
            `)}
          </g>
        </g>

        <g part="segmented-track">
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;-360 50 50"
                dur=${`${duration * 1.8}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${innerArcSegments.map(segment => svg`
            <path
              part="ring inner-ring"
              d=${arcPath(50, 50, 36.2, segment.start, segment.end)}
              fill="transparent"
              stroke=${primary}
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-opacity="0.72"
            ></path>
          `)}
          <circle
            part="guide-ring outer-guide"
            cx="50"
            cy="50"
            r="39.3"
            fill="transparent"
            stroke=${withAlpha(secondary, 0.42)}
            stroke-width="0.8"
            stroke-dasharray="1.8, 2.4"
          ></circle>
        </g>

        <g part="ticks">
          ${tickIndexes.map(index => this.renderTick(index, primary, secondary))}
        </g>

        <g part="energy-blocks" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;360 50 50"
                dur=${`${duration * 2.1}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${blockIndexes.map(index => this.renderEnergyBlock(index, primary, secondary))}
        </g>

        <g part="micro-lights">
          ${microLightIndexes.map(index => this.renderMicroLight(index, primary, secondary))}
        </g>

        <circle
          part="guide-ring inner-guide"
          cx="50"
          cy="50"
          r="28.8"
          fill="transparent"
          stroke=${withAlpha(primary, 0.38)}
          stroke-width="0.7"
          stroke-dasharray="4.2, 2"
        ></circle>
        <circle
          part="guide-ring core-guide"
          cx="50"
          cy="50"
          r="21.3"
          fill="transparent"
          stroke=${withAlpha(secondary, 0.28)}
          stroke-width="0.55"
          stroke-dasharray="1, 2.2"
        ></circle>

        <g part="core" filter=${`url(#${this.softGlowFilterId})`}>
          <circle cx="50" cy="50" r="19.2" fill=${`url(#${this.coreGradientId})`}></circle>
          <circle cx="50" cy="50" r="18.8" fill="transparent" stroke=${withAlpha(primary, 0.45)} stroke-width="0.55"></circle>
          <circle cx="50" cy="50" r="14.6" fill="rgba(2, 8, 20, 0.92)" stroke=${withAlpha(secondary, 0.18)} stroke-width="0.4"></circle>
        </g>
      </svg>
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

      const duration = Math.max(resolveNumberValue(this.dur, 5), 0.1)
      const rasterSize = this.resolveRasterSize()
      const renderer = this.resolveRasterRenderer()
      const raster = await acquireDecoration8Raster(key, sourceSvg, duration, rasterSize, renderer)

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
    if (!this.videoRasterize || !this.animated || this.paused || this.prefersReducedMotion())
      return ''

    if (this.size.width <= 0 || this.size.height <= 0)
      return ''

    if (typeof document === 'undefined')
      return ''

    const [primary, secondary] = this.resolveColors()
    const duration = Math.max(resolveNumberValue(this.dur, 5), 0.1)
    const rasterSize = this.resolveRasterSize()
    const renderer = this.resolveRasterRenderer()

    return [
      renderer,
      primary,
      secondary,
      duration,
      rasterSize.width,
      rasterSize.height,
      Math.round(rasterSize.displayWidth),
    ].join('|')
  }

  private resolveRasterSize(): Decoration8RasterSize {
    const contentWidth = Math.min(Math.max(this.size.width, baseSize), Math.max(this.size.height, baseSize))
    const requestedWidth = contentWidth * resolveRasterScale()
    const width = Math.round(Math.min(Math.max(requestedWidth, minRasterWidth), maxRasterWidth))

    return {
      width,
      height: width,
      displayWidth: contentWidth,
    }
  }

  private resolveRasterRenderer(): Decoration8RasterRenderer {
    if (this.rasterRenderer === 'sprite')
      return this.rasterRenderer

    return 'video'
  }

  private clearRaster(): void {
    this.stopSpritePlayback()
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
    if (!(canvas instanceof HTMLCanvasElement))
      return

    if (this.spritePlaybackUrl !== asset.url) {
      this.stopSpritePlayback()
      this.spritePlaybackUrl = asset.url
      this.spritePlaybackFrame = -1
      this.spritePlaybackStartedAt = performance.now()
      this.drawSpriteFrame(asset, canvas)
    }

    if (!this.shouldPlayRaster()) {
      this.stopSpritePlayback()
      return
    }

    if (this.spritePlaybackTimer === undefined)
      this.scheduleSpritePlayback(asset, canvas)
  }

  private scheduleSpritePlayback(asset: Decoration8RasterAsset, canvas: HTMLCanvasElement): void {
    const frameDelay = Math.max(asset.frameDelay ?? spriteRasterFrameDelay, 1)
    const timeout = Math.max(Math.min(frameDelay, 50), 16)

    this.spritePlaybackTimer = window.setTimeout(() => {
      this.spritePlaybackTimer = undefined

      if (this.rasterAsset !== asset || !this.shouldPlayRaster())
        return

      this.drawSpriteFrame(asset, canvas)
      this.scheduleSpritePlayback(asset, canvas)
    }, timeout)
  }

  private drawSpriteFrame(asset: Decoration8RasterAsset, canvas: HTMLCanvasElement): void {
    const frameWidth = Math.max(asset.width ?? canvas.width, 1)
    const frameHeight = Math.max(asset.height ?? canvas.height, 1)
    const frameIndex = Math.floor((performance.now() - this.spritePlaybackStartedAt) / Math.max(asset.frameDelay ?? spriteRasterFrameDelay, 1))

    if (canvas.width !== frameWidth)
      canvas.width = frameWidth

    if (canvas.height !== frameHeight)
      canvas.height = frameHeight

    const context = canvas.getContext('2d')
    if (!context)
      return

    context.clearRect(0, 0, frameWidth, frameHeight)

    if (asset.layers) {
      const elapsed = performance.now() - this.spritePlaybackStartedAt

      for (const layer of asset.layers) {
        const angle = resolveRasterLayerAngle(layer.kind, elapsed, Math.max(resolveNumberValue(this.dur, 5), 0.1))
        this.drawRasterLayer(context, layer.image, frameWidth, frameHeight, angle)
      }

      this.spritePlaybackFrame = frameIndex
      return
    }

    if (asset.image)
      context.drawImage(asset.image, 0, 0, frameWidth, frameHeight)

    this.spritePlaybackFrame = frameIndex
  }

  private drawRasterLayer(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    width: number,
    height: number,
    angle: number,
  ): void {
    if (angle === 0) {
      context.drawImage(image, 0, 0, width, height)
      return
    }

    context.save()
    context.translate(width / 2, height / 2)
    context.rotate(angle * Math.PI / 180)
    context.drawImage(image, -width / 2, -height / 2, width, height)
    context.restore()
  }

  private stopSpritePlayback(): void {
    if (this.spritePlaybackTimer !== undefined) {
      window.clearTimeout(this.spritePlaybackTimer)
      this.spritePlaybackTimer = undefined
    }
  }

  private renderDefs(primary: string, secondary: string): unknown {
    return svg`
      <radialGradient id=${this.backgroundGradientId} cx="50%" cy="50%" r="54%">
        <stop offset="0%" stop-color="rgba(3, 12, 28, 0.92)"></stop>
        <stop offset="42%" stop-color="rgba(2, 14, 33, 0.52)"></stop>
        <stop offset="74%" stop-color=${withAlpha(secondary, 0.16)}></stop>
        <stop offset="100%" stop-color="rgba(0, 4, 12, 0)"></stop>
      </radialGradient>

      <radialGradient id=${this.coreGradientId} cx="50%" cy="50%" r="58%">
        <stop offset="0%" stop-color="rgba(1, 8, 22, 0.98)"></stop>
        <stop offset="72%" stop-color="rgba(2, 15, 34, 0.86)"></stop>
        <stop offset="100%" stop-color=${withAlpha(primary, 0.24)}></stop>
      </radialGradient>

      <linearGradient id=${this.arcGradientId} x1="8" y1="8" x2="92" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.3"></stop>
        <stop offset="34%" stop-color=${primary} stop-opacity="1"></stop>
        <stop offset="66%" stop-color="#39a8ff" stop-opacity="0.92"></stop>
        <stop offset="100%" stop-color="#1458d9" stop-opacity="0.5"></stop>
      </linearGradient>

      <linearGradient id=${this.blockGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.28"></stop>
        <stop offset="48%" stop-color=${primary} stop-opacity="0.86"></stop>
        <stop offset="100%" stop-color="#1d64ff" stop-opacity="0.5"></stop>
      </linearGradient>

      <linearGradient id=${this.blockInnerGradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8fbff" stop-opacity="0.82"></stop>
        <stop offset="52%" stop-color=${primary} stop-opacity="0.28"></stop>
        <stop offset="100%" stop-color="#1b63ff" stop-opacity="0.08"></stop>
      </linearGradient>

      <filter id=${this.glowFilterId} x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1.35" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.softGlowFilterId} x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="0.7" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderTick(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / tickCount
    const isMajor = index % 8 === 0
    const isMinor = index % 2 === 0
    const radius = isMajor ? 46.5 : 42.1
    const length = isMajor ? 4.1 : isMinor ? 2.3 : 1.2
    const stroke = isMajor ? primary : secondary
    const opacity = isMajor ? 0.78 : isMinor ? 0.38 : 0.2

    return svg`
      <line
        part="tick"
        x1="50"
        y1=${String(roundTo(50 - radius, 3))}
        x2="50"
        y2=${String(roundTo(50 - radius + length, 3))}
        stroke=${stroke}
        stroke-width=${isMajor ? '0.72' : '0.42'}
        stroke-linecap="round"
        stroke-opacity=${String(opacity)}
        transform=${`rotate(${roundTo(angle, 3)} 50 50)`}
      ></line>
    `
  }

  private renderEnergyBlock(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / blockCount
    const opacity = 0.66 + pseudoRandom(index, 2) * 0.24

    return svg`
      <g part="energy-block" transform=${`rotate(${roundTo(angle, 3)} 50 50)`}>
        <rect
          x="47.65"
          y="16.9"
          width="4.7"
          height="4.7"
          rx="0.45"
          fill=${`url(#${this.blockGradientId})`}
          stroke=${index % 4 === 0 ? primary : secondary}
          stroke-width="0.42"
          stroke-opacity=${String(opacity)}
        ></rect>
        <rect
          x="48.55"
          y="17.75"
          width="2.9"
          height="1.35"
          rx="0.25"
          fill=${`url(#${this.blockInnerGradientId})`}
          opacity=${String(0.5 + pseudoRandom(index, 5) * 0.35)}
        ></rect>
      </g>
    `
  }

  private renderMicroLight(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / microLightCount
    const active = index % 5 === 0 || index % 7 === 0
    const radius = index % 2 === 0 ? 32.4 : 24.4
    const point = polarPoint(50, 50, radius, angle)

    return svg`
      <rect
        part="micro-light"
        x=${String(roundTo(point.x - (active ? 0.62 : 0.36), 3))}
        y=${String(roundTo(point.y - (active ? 0.62 : 0.36), 3))}
        width=${active ? '1.24' : '0.72'}
        height=${active ? '1.24' : '0.72'}
        rx="0.16"
        fill=${active ? primary : secondary}
        opacity=${active ? '0.72' : '0.26'}
        transform=${`rotate(${roundTo(angle, 3)} ${roundTo(point.x, 3)} ${roundTo(point.y, 3)})`}
      ></rect>
    `
  }

  private resolveColors(): [string, string] {
    const colorList = this.resolveColorList()
    const explicitPrimary = typeof this.color === 'string' && !isJsonArrayString(this.color)
      ? this.color
      : ''
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: 'rgba(3, 166, 224, 0.8)',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: 'rgba(3, 166, 224, 0.5)',
    })

    return [primary, secondary]
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

async function createRasterVideo(sourceSvg: SVGSVGElement, duration: number, size: Decoration8RasterSize): Promise<Decoration8RasterAsset> {
  const loopDuration = duration * rasterLoopDurationMultiplier
  const frameCount = Math.min(Math.max(Math.round(loopDuration * rasterFrameRate), minRasterFrameCount), maxRasterFrameCount)
  const strokeWidthScale = size.width / Math.max(size.displayWidth, baseSize)

  const url = await rasterizeSvgToVideo(sourceSvg, {
    width: size.width,
    height: size.height,
    frameCount,
    frameDelay: rasterFrameDelay,
    prepareFrame: (svg, frame) => prepareDecoration8RasterVideoFrame(svg, frame, duration),
    strokeWidthScale,
    videoBitsPerSecond: rasterVideoBitsPerSecond,
  })

  return {
    url,
    renderer: 'video',
  }
}

async function createRasterSprite(sourceSvg: SVGSVGElement, size: Decoration8RasterSize): Promise<Decoration8RasterAsset> {
  const widthCeiling = Math.min(size.width, spriteMaxRasterWidth)
  const widthFloor = Math.min(spriteMinRasterWidth, widthCeiling)
  const width = Math.max(widthCeiling, widthFloor)
  const strokeWidthScale = width / Math.max(size.displayWidth, baseSize)
  const layers: Decoration8RasterLayer[] = []

  for (const kind of rasterLayerKinds) {
    const result = await rasterizeSvgToPngSprite(sourceSvg, {
      width,
      height: width,
      frameCount: 1,
      columns: 1,
      rows: 1,
      frameDelay: spriteRasterFrameDelay,
      prepareFrame: svg => prepareDecoration8RasterLayer(svg, kind),
      strokeWidthScale,
    })
    const image = await loadRasterImage(result.url)

    layers.push({
      image,
      kind,
      url: result.url,
    })
  }

  return {
    url: layers.map(layer => layer.url).join('|'),
    renderer: 'sprite',
    frameDelay: spriteRasterFrameDelay,
    height: width,
    layers,
    width,
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

async function acquireDecoration8Raster(
  key: string,
  sourceSvg: SVGSVGElement,
  duration: number,
  size: Decoration8RasterSize,
  renderer: Decoration8RasterRenderer,
): Promise<Decoration8RasterHandle> {
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
        throw new Error('Decoration 8 rasterization did not start.')

      asset = await entry.promise
    }

    return {
      asset,
      release: () => releaseDecoration8Raster(key),
    }
  }
  catch (error) {
    releaseDecoration8Raster(key)
    throw error
  }
}

function enqueueRaster(
  sourceSvg: SVGSVGElement,
  duration: number,
  size: Decoration8RasterSize,
  renderer: Decoration8RasterRenderer,
): Promise<Decoration8RasterAsset> {
  const run = rasterQueue.then(() => {
    if (renderer === 'sprite')
      return createRasterSprite(sourceSvg, size)

    return createRasterVideo(sourceSvg, duration, size)
  })

  rasterQueue = run.then(
    () => undefined,
    () => undefined,
  )

  return run
}

function releaseDecoration8Raster(key: string): void {
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
      revokeDecoration8RasterAsset(entry.asset)

    rasterCache.delete(key)
  }
}

function revokeDecoration8RasterAsset(asset: Decoration8RasterAsset): void {
  if (asset.layers) {
    asset.layers.forEach(layer => URL.revokeObjectURL(layer.url))
    return
  }

  URL.revokeObjectURL(asset.url)
}

function prepareDecoration8RasterVideoFrame(svg: SVGSVGElement, frame: SvgVideoRasterFrame, duration: number): void {
  svg.querySelectorAll('animate, animateTransform').forEach(node => node.remove())

  const elapsed = frame.elapsed * 1000

  setRasterRotation(svg, 'outer-arc-band', resolveRasterLayerAngle('outer-arc-band', elapsed, duration))
  setRasterRotation(svg, 'outer-arc-trace', resolveRasterLayerAngle('outer-arc-trace', elapsed, duration))
  setRasterRotation(svg, 'segmented-track', resolveRasterLayerAngle('segmented-track', elapsed, duration))
  setRasterRotation(svg, 'energy-blocks', resolveRasterLayerAngle('energy-blocks', elapsed, duration))
}

function prepareDecoration8RasterLayer(svg: SVGSVGElement, kind: Decoration8RasterLayerKind): void {
  svg.querySelectorAll('animate, animateTransform').forEach(node => node.remove())

  if (kind === 'static') {
    hideRasterParts(svg, ['outer-arc-band', 'outer-arc-trace', 'segmented-track', 'energy-blocks'])
    return
  }

  const hiddenParts: string[] = ['background', 'halo', 'ticks', 'micro-lights', 'inner-guide', 'core-guide', 'core']

  if (kind === 'outer-arc-band')
    hiddenParts.push('outer-arc-trace', 'segmented-track', 'energy-blocks')
  else if (kind === 'outer-arc-trace')
    hiddenParts.push('outer-arc-band', 'segmented-track', 'energy-blocks')
  else
    hiddenParts.push('outer-arcs', kind === 'segmented-track' ? 'energy-blocks' : 'segmented-track')

  hideRasterParts(svg, hiddenParts)
}

function hideRasterParts(svg: SVGSVGElement, parts: string[]): void {
  parts.forEach((part) => {
    svg.querySelectorAll(`[part~="${part}"]`).forEach((node) => {
      if (node instanceof SVGElement)
        node.setAttribute('visibility', 'hidden')
    })
  })
}

function resolveRasterLayerAngle(kind: Decoration8RasterLayerKind, elapsed: number, duration: number): number {
  if (kind === 'static')
    return 0

  const configs: Record<Exclude<Decoration8RasterLayerKind, 'static'>, { direction: number, multiplier: number }> = {
    'outer-arc-band': { direction: 1, multiplier: 1.28 },
    'outer-arc-trace': { direction: -1, multiplier: 1.85 },
    'segmented-track': { direction: -1, multiplier: 1.8 },
    'energy-blocks': { direction: 1, multiplier: 2.1 },
  }
  const config = configs[kind]
  const period = Math.max(duration * config.multiplier * 1000, 1)

  return config.direction * 360 * ((elapsed % period) / period)
}

function setRasterRotation(svg: SVGSVGElement, part: string, angle: number): void {
  const node = svg.querySelector(`[part~="${part}"]`)

  if (node instanceof SVGElement)
    node.setAttribute('transform', `rotate(${roundTo(angle, 3)} 50 50)`)
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
