import type { SvgVideoRasterFrame } from '../internal/svg-video-rasterizer'
import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { rasterizeSvgToVideo } from '../internal/svg-video-rasterizer'

interface Decoration11Size {
  width: number
  height: number
}

interface Decoration11RasterSize extends Decoration11Size {
  displayWidth: number
}

interface ArcSegment {
  start: number
  end: number
  radius: number
  width: number
  opacity: number
  accent?: 'primary' | 'secondary' | 'gold' | 'white'
}

const defaultSize: Decoration11Size = {
  width: 0,
  height: 0,
}
const baseWidth = 160
const baseHeight = 120
const minRasterWidth = 960
const maxRasterWidth = 1920
const rasterFrameRate = 30
const minRasterFrameCount = 360
const maxRasterFrameCount = 840
const rasterFrameDelay = 1000 / rasterFrameRate
const rasterLoopDurationMultiplier = 2
const rasterVideoBitsPerSecond = 12_000_000
const perspectiveScaleY = 0.42
const particleLayerY = 70.6
const thinGlowLayerY = 70.6
const thickGlowLayerY = 68.2
const scaleLayerY = 65.8
const segmentLayerY = 63.4
const innerLayerY = 60.8
const audioBarCount = 144
const scaleTickCount = 96
const segmentCount = 32
const bridgeAngles = [34, 128, 218, 318]
const indicatorAngles = [28, 132, 222, 314]
const audioBarIndexes = Array.from({ length: audioBarCount }, (_, index) => index)
const scaleTickIndexes = Array.from({ length: scaleTickCount }, (_, index) => index)
const segmentIndexes = Array.from({ length: segmentCount }, (_, index) => index)
const thinArcSegments: ArcSegment[] = [
  { start: -74, end: -28, radius: 63.2, width: 0.72, opacity: 0.74, accent: 'white' },
  { start: 8, end: 54, radius: 63.2, width: 0.78, opacity: 0.66, accent: 'primary' },
  { start: 94, end: 132, radius: 63.2, width: 0.58, opacity: 0.44, accent: 'secondary' },
  { start: 184, end: 248, radius: 63.2, width: 0.72, opacity: 0.58, accent: 'primary' },
  { start: 292, end: 338, radius: 63.2, width: 0.6, opacity: 0.44, accent: 'white' },
]
let decoration11Id = 0

export class Decoration11Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, rgba(52, 236, 255, 0.92));
    }

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
    rect,
    ellipse,
    polygon {
      vector-effect: non-scaling-stroke;
    }

  `

  @property()
  color: string | readonly string[] = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Number })
  dur = 9

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  @state()
  private rasterUrl = ''

  private readonly instanceId = ++decoration11Id
  private readonly ringGradientId = `dvk-decoration-11-ring-${this.instanceId}`
  private readonly accentGradientId = `dvk-decoration-11-accent-${this.instanceId}`
  private readonly segmentGradientId = `dvk-decoration-11-segment-${this.instanceId}`
  private readonly glowFilterId = `dvk-decoration-11-glow-${this.instanceId}`
  private readonly strongGlowFilterId = `dvk-decoration-11-strong-glow-${this.instanceId}`
  private readonly softGlowFilterId = `dvk-decoration-11-soft-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  private rasterKey = ''
  private pendingRasterKey = ''
  private rasterToken = 0

  override disconnectedCallback(): void {
    this.rasterToken += 1
    this.clearRaster()
    super.disconnectedCallback()
  }

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-11' })
    this.queueRasterize()
  }

  override updated(): void {
    this.queueRasterize()
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const duration = Math.min(Math.max(resolveNumberValue(this.dur, 9), 6), 14)
    const showAnimation = this.animated
      && !this.paused
      && !this.rasterUrl
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0

    if (this.rasterUrl) {
      return html`
        <video
          part="graphic raster"
          src=${this.rasterUrl}
          aria-hidden="true"
          autoplay
          loop
          muted
          playsinline
          preload="auto"
        ></video>
      `
    }

    return html`
      <svg
        part="graphic"
        width=${String(baseWidth)}
        height=${String(baseHeight)}
        viewBox="0 0 160 120"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent)}</defs>

        <g part="vertical-links" opacity="0.1" filter=${`url(#${this.softGlowFilterId})`}>
          ${bridgeAngles.map((angle, index) => this.renderBridge(angle, index, primary, secondary))}
        </g>

        ${this.renderAudioBars(primary, secondary, accent, duration, showAnimation)}
        ${this.renderThinGlowLayer(primary, secondary, duration, showAnimation)}
        ${this.renderThickGlowLayer()}
        ${this.renderScaleLayer(primary, secondary)}
        ${this.renderSegmentLayer(primary, secondary, accent, duration, showAnimation)}
        ${this.renderInnerLayer(primary, secondary, accent, duration, showAnimation)}
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
      void this.generateRasterVideo(token, key)
    }, 0)
  }

  private async generateRasterVideo(token: number, key: string): Promise<void> {
    try {
      const sourceSvg = this.renderRoot.querySelector('svg')
      if (!sourceSvg)
        return

      const duration = Math.min(Math.max(resolveNumberValue(this.dur, 9), 6), 14)
      const rasterSize = this.resolveRasterSize()
      const url = await createRasterVideo(sourceSvg, duration, rasterSize)

      if (token !== this.rasterToken || key !== this.pendingRasterKey) {
        URL.revokeObjectURL(url)
        return
      }

      this.pendingRasterKey = ''
      this.rasterKey = key
      this.rasterUrl = url
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
    const duration = Math.min(Math.max(resolveNumberValue(this.dur, 9), 6), 14)

    return [
      primary,
      secondary,
      accent,
      duration,
      Math.round(this.size.width),
      Math.round(this.size.height),
    ].join('|')
  }

  private resolveRasterSize(): Decoration11RasterSize {
    const ratio = baseHeight / baseWidth
    const contentWidth = Math.min(
      Math.max(this.size.width, baseWidth),
      Math.max(this.size.height, baseHeight) / ratio,
    )
    const requestedWidth = contentWidth * 3
    const width = Math.round(Math.min(Math.max(requestedWidth, minRasterWidth), maxRasterWidth))

    return {
      width,
      height: Math.round(width * ratio),
      displayWidth: contentWidth,
    }
  }

  private clearRaster(): void {
    if (!this.rasterUrl)
      return

    URL.revokeObjectURL(this.rasterUrl)
    this.rasterUrl = ''
  }

  private renderAudioBars(
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer particle-layer particles audio-bars" transform=${layerTransform(particleLayerY)} filter=${`url(#${this.glowFilterId})`}>
        <g part="audio-bar-ring">
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;-360 0 0"
                dur=${`${duration * 2.1}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          <circle part="ring guide-ring particle-guide" cx="0" cy="0" r="63.2" fill="transparent" stroke=${withAlpha(secondary, 0.18)} stroke-width="0.58"></circle>
          ${audioBarIndexes.map(index => this.renderAudioBar(index, primary, secondary, accent))}
        </g>
      </g>
    `
  }

  private renderThinGlowLayer(
    primary: string,
    secondary: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer thin-glow-layer" transform=${layerTransform(thinGlowLayerY)}>
        <circle
          part="ring guide-ring thin-glow-ring"
          cx="0"
          cy="0"
          r="63.2"
          fill="transparent"
          stroke=${withAlpha(primary, 0.62)}
          stroke-width="0.66"
          filter=${`url(#${this.glowFilterId})`}
        ></circle>
        <circle
          part="ring guide-ring thin-glow-ring"
          cx="0"
          cy="0"
          r="61.4"
          fill="transparent"
          stroke=${withAlpha(secondary, 0.2)}
          stroke-width="0.42"
        ></circle>

        <g part="sweep-ring thin-sweep" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;360 0 0"
                dur=${`${duration * 1.55}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${thinArcSegments.map(segment => this.renderArc(segment, primary, secondary, 'ring sweep-arc thin-glow-ring'))}
        </g>
      </g>
    `
  }

  private renderThickGlowLayer(): unknown {
    return svg`
      <g part="lift-layer thick-glow-layer" transform=${layerTransform(thickGlowLayerY)}>
        <circle
          part="ring guide-ring thick-glow-ring"
          cx="0"
          cy="0"
          r="58.4"
          fill="transparent"
          stroke="rgba(174, 239, 255, 0.34)"
          stroke-width="9.3"
        ></circle>
        <circle
          part="ring bright-ring thick-glow-ring"
          cx="0"
          cy="0"
          r="58.4"
          fill="transparent"
          stroke="#aeefff"
          stroke-width="5.7"
          stroke-opacity="0.82"
          filter=${`url(#${this.strongGlowFilterId})`}
        ></circle>
        <path part="thick-side-shadow" d=${arcPath(0, 0, 55.4, 92, 268)} fill="transparent" stroke="rgba(7, 32, 70, 0.58)" stroke-width="2.4" stroke-linecap="round" stroke-opacity="0.38"></path>
      </g>
    `
  }

  private renderScaleLayer(primary: string, secondary: string): unknown {
    return svg`
      <g part="lift-layer scale-layer" transform=${layerTransform(scaleLayerY)}>
        <circle part="ring guide-ring scale-guide" cx="0" cy="0" r="50.8" fill="transparent" stroke=${withAlpha(secondary, 0.2)} stroke-width="4.2"></circle>
        <circle part="ring guide-ring scale-guide" cx="0" cy="0" r="46.8" fill="transparent" stroke=${withAlpha(primary, 0.24)} stroke-width="0.54"></circle>

        <g part="ticks scale-ticks" opacity="0.78">
          ${scaleTickIndexes.map(index => this.renderScaleTick(index, primary, secondary))}
        </g>
      </g>
    `
  }

  private renderSegmentLayer(
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer inner-segment-layer" transform=${layerTransform(segmentLayerY)}>
        <circle part="ring guide-ring segment-guide" cx="0" cy="0" r="41.5" fill="transparent" stroke=${withAlpha(primary, 0.2)} stroke-width="0.68"></circle>

        <g part="segmented-track segmented-ring" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;-360 0 0"
                dur=${`${duration * 2.35}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${segmentIndexes.map(index => this.renderSegmentArc(index, primary, secondary, accent))}
        </g>
      </g>
    `
  }

  private renderInnerLayer(
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer inner-layer" transform=${layerTransform(innerLayerY)} filter=${`url(#${this.softGlowFilterId})`}>
        <circle part="ring guide-ring dashed-ring" cx="0" cy="0" r="32.2" fill="transparent" stroke=${withAlpha(primary, 0.66)} stroke-width="0.72" stroke-dasharray="2.8, 4.6"></circle>
        <g part="triangle-indicators">
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;360 0 0"
                dur=${`${duration * 1.9}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${indicatorAngles.map((angle, index) => this.renderTriangleIndicator(angle, index, primary, accent))}
        </g>

      </g>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <linearGradient id=${this.ringGradientId} x1="-66" y1="-46" x2="66" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#f4fdff" stop-opacity="0.92"></stop>
        <stop offset="30%" stop-color=${primary} stop-opacity="0.96"></stop>
        <stop offset="72%" stop-color=${secondary} stop-opacity="0.72"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0.24"></stop>
      </linearGradient>

      <linearGradient id=${this.accentGradientId} x1="-42" y1="-18" x2="42" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#fff6d2" stop-opacity="0.96"></stop>
        <stop offset="52%" stop-color=${accent} stop-opacity="0.82"></stop>
        <stop offset="100%" stop-color="#ffbd5c" stop-opacity="0.34"></stop>
      </linearGradient>

      <linearGradient id=${this.segmentGradientId} x1="-42" y1="-18" x2="42" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.28"></stop>
        <stop offset="50%" stop-color=${primary} stop-opacity="0.76"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.2"></stop>
      </linearGradient>

      <filter id=${this.glowFilterId} x="-42%" y="-64%" width="184%" height="228%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="0.9" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.strongGlowFilterId} x="-58%" y="-80%" width="216%" height="260%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1.8" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.softGlowFilterId} x="-32%" y="-48%" width="164%" height="196%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="0.55" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderArc(
    segment: ArcSegment,
    primary: string,
    secondary: string,
    part: string,
  ): unknown {
    const stroke = this.resolveArcStroke(segment, primary, secondary)

    return svg`
      <path
        part=${part}
        d=${arcPath(0, 0, segment.radius, segment.start, segment.end)}
        fill="transparent"
        stroke=${stroke}
        stroke-width=${String(segment.width)}
        stroke-linecap="round"
        stroke-opacity=${String(segment.opacity)}
      ></path>
    `
  }

  private renderAudioBar(index: number, primary: string, secondary: string, accent: string): unknown {
    const angle = index * 360 / audioBarCount
    const wave = (Math.sin(index * 0.74) + 1) / 2
    const active = index % 18 === 0 || index % 31 === 0
    const radius = 63.2
    const width = active ? 1.35 : index % 3 === 0 ? 1.12 : 0.92
    const height = 2.2 + wave * 3.8 + pseudoRandom(index, 7) * 3 + (active ? 2.4 : 0)
    const point = polarPoint(0, 0, radius, angle)
    const fill = active ? accent : index % 4 === 0 ? primary : secondary

    return svg`
      <rect
        part="particle audio-bar"
        transform=${`translate(${roundTo(point.x, 3)} ${roundTo(point.y, 3)}) rotate(${roundTo(angle, 3)})`}
        x=${String(roundTo(-width / 2, 3))}
        y=${String(roundTo(-height, 3))}
        width=${String(roundTo(width, 3))}
        height=${String(roundTo(height, 3))}
        rx="0.22"
        fill=${fill}
        fill-opacity=${active ? '0.72' : index % 3 === 0 ? '0.48' : '0.3'}
        stroke=${active ? '#f6ffff' : primary}
        stroke-width="0.12"
        stroke-opacity=${active ? '0.46' : '0.18'}
      ></rect>
    `
  }

  private renderScaleTick(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / scaleTickCount
    const major = index % 8 === 0
    const mid = index % 4 === 0
    const radius = major ? 53.6 : 52.4
    const length = major ? 5.2 : mid ? 3.8 : 2.4
    const start = polarPoint(0, 0, radius, angle)
    const end = polarPoint(0, 0, radius - length, angle)

    return svg`
      <line
        part="tick scale-tick"
        x1=${String(roundTo(start.x, 3))}
        y1=${String(roundTo(start.y, 3))}
        x2=${String(roundTo(end.x, 3))}
        y2=${String(roundTo(end.y, 3))}
        stroke=${major ? primary : secondary}
        stroke-width=${major ? '0.7' : mid ? '0.46' : '0.3'}
        stroke-linecap="round"
        stroke-opacity=${major ? '0.74' : mid ? '0.45' : '0.24'}
      ></line>
    `
  }

  private renderSegmentArc(index: number, primary: string, secondary: string, accent: string): unknown {
    const step = 360 / segmentCount
    const start = index * step + 1.8
    const end = start + step - 4.2
    const active = index % 8 === 0 || index % 11 === 0
    const stroke = active ? accent : index % 3 === 0 ? primary : `url(#${this.segmentGradientId})`

    return svg`
      <path
        part="ring segment-block segment-arc"
        d=${arcPath(0, 0, 40.2, start, end)}
        fill="transparent"
        stroke=${stroke}
        stroke-width=${active ? '2.9' : '2.15'}
        stroke-linecap="butt"
        stroke-opacity=${active ? '0.82' : index % 3 === 0 ? '0.58' : '0.42'}
      ></path>
    `
  }

  private renderTriangleIndicator(angle: number, index: number, primary: string, accent: string): unknown {
    const point = polarPoint(0, 0, 22.8, angle)
    const active = index % 2 === 0
    const stroke = active ? primary : accent

    return svg`
      <g part="triangle-indicator" transform=${`translate(${roundTo(point.x, 3)} ${roundTo(point.y, 3)}) rotate(${roundTo(angle, 3)})`}>
        <polygon
          points="0 2.05 1.8 -1.45 -1.8 -1.45"
          fill="transparent"
          stroke=${stroke}
          stroke-width="0.36"
          stroke-linejoin="round"
          stroke-opacity=${active ? '0.78' : '0.62'}
          opacity=${active ? '0.82' : '0.66'}
        ></polygon>
        <path
          d="M -0.88 -0.58 L 0 0.42 L 0.88 -0.58"
          fill="transparent"
          stroke="#f6ffff"
          stroke-width="0.22"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity="0.46"
        ></path>
      </g>
    `
  }

  private renderBridge(angle: number, index: number, primary: string, secondary: string): unknown {
    const low = projectedPoint(80, particleLayerY, 66, angle)
    const middle = projectedPoint(80, segmentLayerY, 40, angle + (index % 2 === 0 ? 2.4 : -2.4))
    const high = projectedPoint(80, innerLayerY, 27, angle + (index % 2 === 0 ? 4 : -4))
    const color = index % 2 === 0 ? primary : secondary

    return svg`
      <path
        part="bridge-line"
        d=${`M ${pointToString(low)} L ${pointToString(middle)} L ${pointToString(high)}`}
        fill="transparent"
        stroke=${color}
        stroke-width="0.42"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity=${String(index < 2 ? 0.2 : 0.12)}
      ></path>
    `
  }

  private resolveArcStroke(segment: ArcSegment, primary: string, secondary: string): string {
    if (segment.accent === 'gold')
      return `url(#${this.accentGradientId})`

    if (segment.accent === 'white')
      return '#f4fdff'

    if (segment.accent === 'secondary')
      return secondary

    return segment.accent === 'primary' ? primary : `url(#${this.ringGradientId})`
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
      fallback: 'rgba(52, 236, 255, 0.92)',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: 'rgba(18, 109, 255, 0.74)',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: '',
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: 'rgba(255, 230, 156, 0.9)',
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

async function createRasterVideo(sourceSvg: SVGSVGElement, duration: number, size: Decoration11RasterSize): Promise<string> {
  const loopDuration = duration * rasterLoopDurationMultiplier
  const frameCount = Math.min(Math.max(Math.round(loopDuration * rasterFrameRate), minRasterFrameCount), maxRasterFrameCount)
  const strokeWidthScale = size.width / Math.max(size.displayWidth, baseWidth)

  return rasterizeSvgToVideo(sourceSvg, {
    width: size.width,
    height: size.height,
    frameCount,
    frameDelay: rasterFrameDelay,
    prepareFrame: prepareDecoration11RasterFrame,
    strokeWidthScale,
    videoBitsPerSecond: rasterVideoBitsPerSecond,
  })
}

function prepareDecoration11RasterFrame(svg: SVGSVGElement, frame: SvgVideoRasterFrame): void {
  svg.querySelectorAll('animate, animateTransform').forEach(node => node.remove())

  setRasterRotation(svg, 'audio-bar-ring', -360 * frame.progress)
  setRasterRotation(svg, 'thin-sweep', 360 * frame.progress)
  setRasterRotation(svg, 'segmented-ring', -360 * frame.progress)
  setRasterRotation(svg, 'triangle-indicators', 360 * frame.progress)
}

function setRasterRotation(svg: SVGSVGElement, part: string, angle: number): void {
  const node = svg.querySelector(`[part~="${part}"]`)

  if (node instanceof SVGElement)
    node.setAttribute('transform', `rotate(${roundTo(angle, 3)} 0 0)`)
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

function layerTransform(y: number): string {
  return `translate(80 ${y}) scale(1 ${perspectiveScaleY})`
}

function polarPoint(cx: number, cy: number, radius: number, angle: number): { x: number, y: number } {
  const radians = (angle - 90) * Math.PI / 180

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function projectedPoint(cx: number, cy: number, radius: number, angle: number): { x: number, y: number } {
  const point = polarPoint(0, 0, radius, angle)

  return {
    x: cx + point.x,
    y: cy + point.y * perspectiveScaleY,
  }
}

function pointToString(point: { x: number, y: number }): string {
  return `${roundTo(point.x, 3)} ${roundTo(point.y, 3)}`
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
