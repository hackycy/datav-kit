import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration11Size {
  width: number
  height: number
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
const perspectiveScaleY = 0.42
const baseLayerY = 70.8
const lowerLayerY = 68.2
const middleLayerY = 65
const innerLayerY = 61.8
const particleLayerY = 69.8
const outerTickCount = 132
const innerTickCount = 54
const coreTickCount = 36
const blockCount = 88
const particleCount = 86
const bridgeAngles = [42, 116, 214, 318]
const outerTickIndexes = Array.from({ length: outerTickCount }, (_, index) => index)
const innerTickIndexes = Array.from({ length: innerTickCount }, (_, index) => index)
const coreTickIndexes = Array.from({ length: coreTickCount }, (_, index) => index)
const blockIndexes = Array.from({ length: blockCount }, (_, index) => index)
  .filter(index => index < 9 || index > 39)
const particleIndexes = Array.from({ length: particleCount }, (_, index) => index)
const outerArcSegments: ArcSegment[] = [
  { start: -84, end: -18, radius: 61.8, width: 3.4, opacity: 0.92, accent: 'white' },
  { start: 6, end: 62, radius: 61.8, width: 4.2, opacity: 0.98, accent: 'primary' },
  { start: 82, end: 116, radius: 61.8, width: 1.6, opacity: 0.45, accent: 'secondary' },
  { start: 148, end: 222, radius: 61.8, width: 3.8, opacity: 0.9, accent: 'primary' },
  { start: 246, end: 294, radius: 61.8, width: 2.4, opacity: 0.7, accent: 'secondary' },
  { start: 312, end: 348, radius: 61.8, width: 2, opacity: 0.58, accent: 'white' },
]
const lowerArcSegments: ArcSegment[] = [
  { start: -58, end: -12, radius: 51.6, width: 2, opacity: 0.56, accent: 'secondary' },
  { start: 28, end: 76, radius: 51.6, width: 2.2, opacity: 0.62, accent: 'primary' },
  { start: 118, end: 176, radius: 51.6, width: 1.7, opacity: 0.45, accent: 'secondary' },
  { start: 216, end: 276, radius: 51.6, width: 2.2, opacity: 0.66, accent: 'primary' },
  { start: 304, end: 336, radius: 51.6, width: 1.5, opacity: 0.42, accent: 'white' },
]
const middleArcSegments: ArcSegment[] = [
  { start: -46, end: 8, radius: 42.8, width: 1.45, opacity: 0.78, accent: 'white' },
  { start: 32, end: 72, radius: 42.8, width: 2.1, opacity: 0.78, accent: 'gold' },
  { start: 114, end: 164, radius: 42.8, width: 1.25, opacity: 0.48, accent: 'primary' },
  { start: 206, end: 252, radius: 42.8, width: 2.05, opacity: 0.72, accent: 'gold' },
  { start: 286, end: 328, radius: 42.8, width: 1.3, opacity: 0.52, accent: 'white' },
]
const innerOrbitSegments: ArcSegment[] = [
  { start: -64, end: -22, radius: 27.8, width: 1.2, opacity: 0.58, accent: 'primary' },
  { start: 24, end: 74, radius: 27.8, width: 1.55, opacity: 0.82, accent: 'white' },
  { start: 124, end: 174, radius: 27.8, width: 1.1, opacity: 0.52, accent: 'primary' },
  { start: 214, end: 274, radius: 27.8, width: 1.55, opacity: 0.84, accent: 'gold' },
  { start: 310, end: 340, radius: 27.8, width: 0.95, opacity: 0.5, accent: 'secondary' },
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

    svg {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    path,
    circle,
    line,
    rect,
    ellipse {
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

  private readonly instanceId = ++decoration11Id
  private readonly groundGradientId = `dvk-decoration-11-ground-${this.instanceId}`
  private readonly voidGradientId = `dvk-decoration-11-void-${this.instanceId}`
  private readonly ringGradientId = `dvk-decoration-11-ring-${this.instanceId}`
  private readonly goldGradientId = `dvk-decoration-11-gold-${this.instanceId}`
  private readonly blockGradientId = `dvk-decoration-11-block-${this.instanceId}`
  private readonly particleGradientId = `dvk-decoration-11-particle-${this.instanceId}`
  private readonly glowFilterId = `dvk-decoration-11-glow-${this.instanceId}`
  private readonly strongGlowFilterId = `dvk-decoration-11-strong-glow-${this.instanceId}`
  private readonly softGlowFilterId = `dvk-decoration-11-soft-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-11' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const duration = Math.min(Math.max(resolveNumberValue(this.dur, 9), 6), 14)
    const showAnimation = this.animated
      && !this.paused
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0

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

        <ellipse
          part="ground-glow"
          cx="80"
          cy="83"
          rx="68"
          ry="18"
          fill=${`url(#${this.groundGradientId})`}
          opacity="0.76"
          filter=${`url(#${this.softGlowFilterId})`}
        ></ellipse>

        <g part="lift-shadow" filter=${`url(#${this.softGlowFilterId})`}>
          <ellipse cx="80" cy="73.4" rx="58" ry="10.8" fill="transparent" stroke="rgba(1, 8, 28, 0.5)" stroke-width="3.2" stroke-opacity="0.34"></ellipse>
          <ellipse cx="80" cy="69.2" rx="47" ry="7.8" fill="transparent" stroke=${withAlpha(primary, 0.18)} stroke-width="1.1" stroke-opacity="0.38"></ellipse>
        </g>

        <g part="vertical-links" opacity="0.16" filter=${`url(#${this.softGlowFilterId})`}>
          ${bridgeAngles.map((angle, index) => this.renderBridge(angle, index, primary, secondary))}
        </g>

        ${this.renderBaseLayer(primary, secondary, accent, duration, showAnimation)}
        ${this.renderLowerLayer(primary, secondary, accent, duration, showAnimation)}
        ${this.renderMiddleLayer(primary, secondary, accent, duration, showAnimation)}
        ${this.renderInnerLayer(primary, secondary, accent, duration, showAnimation)}
        ${this.renderParticles(primary, accent, duration, showAnimation)}
      </svg>

    `
  }

  private renderBaseLayer(
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer base-layer" transform="translate(80 ${baseLayerY}) scale(1 ${perspectiveScaleY})">
        <circle part="ring guide-ring" cx="0" cy="0" r="58.5" fill="transparent" stroke=${withAlpha(secondary, 0.22)} stroke-width="4.4"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="54.2" fill="transparent" stroke=${withAlpha(primary, 0.28)} stroke-width="0.7"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="46.8" fill="transparent" stroke=${withAlpha(secondary, 0.16)} stroke-width="0.58" stroke-dasharray="2.6, 3.4"></circle>

        <g part="front-glow-ring" filter=${`url(#${this.strongGlowFilterId})`}>
          <path part="ring front-glow" d=${arcPath(0, 0, 63.4, 74, 258)} fill="transparent" stroke="#f4fdff" stroke-width="3.1" stroke-linecap="round" stroke-opacity="0.88"></path>
          <path part="ring front-glow" d=${arcPath(0, 0, 60.5, 86, 238)} fill="transparent" stroke=${primary} stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.72"></path>
        </g>

        <g part="bright-ring outer-bright" filter=${`url(#${this.strongGlowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;360 0 0"
                dur=${`${duration * 1.14}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${outerArcSegments.map(segment => this.renderArc(segment, primary, secondary, 'ring bright-ring'))}
        </g>

        <g part="sweep-ring outer-sweep" filter=${`url(#${this.glowFilterId})`} opacity="0.74">
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;-360 0 0"
                dur=${`${duration * 0.72}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          <path part="ring sweep-arc" d=${arcPath(0, 0, 56.2, -22, 28)} fill="transparent" stroke=${primary} stroke-width="1.25" stroke-linecap="round" stroke-opacity="0.78"></path>
          <path part="ring sweep-arc" d=${arcPath(0, 0, 49.4, 96, 148)} fill="transparent" stroke=${secondary} stroke-width="0.92" stroke-linecap="round" stroke-opacity="0.52"></path>
          <path part="ring sweep-arc" d=${arcPath(0, 0, 38.8, 242, 304)} fill="transparent" stroke=${accent} stroke-width="0.9" stroke-linecap="round" stroke-opacity="0.5"></path>
        </g>

        <g part="ticks outer-ticks">
          ${outerTickIndexes.map(index => this.renderOuterTick(index, primary, secondary))}
        </g>
      </g>
    `
  }

  private renderLowerLayer(
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer lower-layer" transform="translate(80 ${lowerLayerY}) scale(1 ${perspectiveScaleY})">
        <circle part="ring guide-ring lower-track" cx="0" cy="0" r="50.6" fill="transparent" stroke=${withAlpha(secondary, 0.24)} stroke-width="5.8"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="43.8" fill="transparent" stroke=${withAlpha(primary, 0.32)} stroke-width="0.68"></circle>

        <g part="segmented-track" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;-360 0 0"
                dur=${`${duration * 2.15}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${blockIndexes.map(index => this.renderSegmentBlock(index, primary, secondary))}
        </g>

        <g part="bright-ring lower-bright">
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;360 0 0"
                dur=${`${duration * 1.72}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${lowerArcSegments.map(segment => this.renderArc(segment, primary, secondary, 'ring bright-ring'))}
        </g>
      </g>
    `
  }

  private renderMiddleLayer(
    primary: string,
    secondary: string,
    accent: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <g part="lift-layer middle-layer" transform="translate(80 ${middleLayerY}) scale(1 ${perspectiveScaleY})">
        <circle part="ring guide-ring" cx="0" cy="0" r="43.8" fill="transparent" stroke=${withAlpha(secondary, 0.28)} stroke-width="0.86"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="36.6" fill="transparent" stroke=${withAlpha(primary, 0.2)} stroke-width="0.56"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="31" fill="transparent" stroke=${withAlpha(accent, 0.22)} stroke-width="0.46" stroke-dasharray="4.4, 4.8"></circle>

        <g part="gold-orbit" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;360 0 0"
                dur=${`${duration * 0.95}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${middleArcSegments.map(segment => this.renderArc(segment, primary, secondary, 'ring gold-orbit'))}
        </g>

        <g part="ticks inner-ticks" opacity="0.7">
          ${innerTickIndexes.map(index => this.renderInnerTick(index, primary, secondary))}
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
      <g part="lift-layer inner-layer" transform="translate(80 ${innerLayerY}) scale(1 ${perspectiveScaleY})" filter=${`url(#${this.softGlowFilterId})`}>
        <path part="inner-side-shadow" d=${arcPath(0, 0, 35.2, 86, 274)} fill="transparent" stroke="rgba(0, 5, 22, 0.68)" stroke-width="3.1" stroke-linecap="round" stroke-opacity="0.5"></path>
        <circle part="core-disc" cx="0" cy="0" r="34.8" fill="transparent" stroke=${withAlpha(primary, 0.54)} stroke-width="0.88"></circle>
        <path part="inner-top-highlight" d=${arcPath(0, 0, 34.4, -70, 58)} fill="transparent" stroke="#f4fdff" stroke-width="1.35" stroke-linecap="round" stroke-opacity="0.68"></path>
        <path part="inner-front-lip" d=${arcPath(0, 0, 34.2, 84, 266)} fill="transparent" stroke=${withAlpha(primary, 0.58)} stroke-width="1.45" stroke-linecap="round" stroke-opacity="0.62"></path>
        <path part="inner-front-lip" d=${arcPath(0, 0, 31.4, 104, 250)} fill="transparent" stroke="rgba(0, 5, 22, 0.58)" stroke-width="0.8" stroke-linecap="round" stroke-opacity="0.5"></path>
        <circle part="ring guide-ring inner-rim" cx="0" cy="0" r="33.1" fill="transparent" stroke=${withAlpha(secondary, 0.32)} stroke-width="1.25"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="25.4" fill="transparent" stroke=${withAlpha(primary, 0.52)} stroke-width="0.7" stroke-dasharray="2.2, 4.2"></circle>
        <circle part="ring guide-ring" cx="0" cy="0" r="16.8" fill="transparent" stroke=${withAlpha(accent, 0.28)} stroke-width="0.48"></circle>
        <circle part="ring guide-ring core-guide" cx="0" cy="0" r="12.8" fill="transparent" stroke=${withAlpha(primary, 0.34)} stroke-width="0.46" stroke-dasharray="1.4, 2.4"></circle>

        <g part="core-ticks" opacity="0.72">
          ${coreTickIndexes.map(index => this.renderCoreTick(index, primary, secondary))}
        </g>

        <g part="white-orbit" filter=${`url(#${this.glowFilterId})`}>
          ${showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 0 0;-360 0 0"
                dur=${`${duration * 0.78}s`}
                repeatCount="indefinite"
              ></animateTransform>
            `
            : null}
          ${innerOrbitSegments.map(segment => this.renderArc(segment, primary, secondary, 'ring white-orbit'))}
        </g>

        <g part="core core-void" filter=${`url(#${this.glowFilterId})`}>
          <circle part="void-hole" cx="0" cy="0" r="10.8" fill=${`url(#${this.voidGradientId})`}></circle>
          <circle part="void-rim" cx="0" cy="0" r="11.4" fill="transparent" stroke="rgba(0, 3, 16, 0.9)" stroke-width="1.8"></circle>
          <circle part="void-rim" cx="0" cy="0" r="12.6" fill="transparent" stroke=${withAlpha(primary, 0.42)} stroke-width="0.52" stroke-dasharray="2.2, 2.8"></circle>
        </g>
      </g>
    `
  }

  private renderParticles(primary: string, accent: string, duration: number, showAnimation: boolean): unknown {
    return svg`
      <g part="particles" transform="translate(80 ${particleLayerY}) scale(1 ${perspectiveScaleY})" filter=${`url(#${this.glowFilterId})`}>
        ${showAnimation
          ? svg`
            <animateTransform
              attributeName="transform"
              type="rotate"
              additive="sum"
              values="0 0 0;-360 0 0"
              dur=${`${duration * 2.4}s`}
              repeatCount="indefinite"
            ></animateTransform>
          `
          : null}
        ${particleIndexes.map(index => this.renderParticle(index, primary, accent, showAnimation))}
      </g>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <radialGradient id=${this.groundGradientId} cx="50%" cy="50%" r="62%">
        <stop offset="0%" stop-color=${withAlpha(primary, 0.3)}></stop>
        <stop offset="44%" stop-color=${withAlpha(secondary, 0.18)}></stop>
        <stop offset="100%" stop-color="rgba(0, 8, 28, 0)"></stop>
      </radialGradient>

      <radialGradient id=${this.voidGradientId} cx="50%" cy="50%" r="62%">
        <stop offset="0%" stop-color="rgba(0, 0, 0, 1)"></stop>
        <stop offset="58%" stop-color="rgba(0, 3, 16, 0.98)"></stop>
        <stop offset="84%" stop-color="rgba(1, 10, 34, 0.94)"></stop>
        <stop offset="100%" stop-color=${withAlpha(primary, 0.08)}></stop>
      </radialGradient>

      <linearGradient id=${this.ringGradientId} x1="-64" y1="-44" x2="64" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#f4fdff" stop-opacity="0.96"></stop>
        <stop offset="28%" stop-color=${primary} stop-opacity="0.98"></stop>
        <stop offset="68%" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0.34"></stop>
      </linearGradient>

      <linearGradient id=${this.goldGradientId} x1="-42" y1="-18" x2="42" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#fff6d2" stop-opacity="0.98"></stop>
        <stop offset="50%" stop-color=${accent} stop-opacity="0.86"></stop>
        <stop offset="100%" stop-color="#ffbd5c" stop-opacity="0.44"></stop>
      </linearGradient>

      <linearGradient id=${this.blockGradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color=${primary} stop-opacity="0.74"></stop>
        <stop offset="55%" stop-color=${secondary} stop-opacity="0.38"></stop>
        <stop offset="100%" stop-color="#083baf" stop-opacity="0.12"></stop>
      </linearGradient>

      <radialGradient id=${this.particleGradientId} cx="50%" cy="50%" r="54%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"></stop>
        <stop offset="48%" stop-color=${primary} stop-opacity="0.82"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0"></stop>
      </radialGradient>

      <filter id=${this.glowFilterId} x="-40%" y="-60%" width="180%" height="220%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="0.9" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.strongGlowFilterId} x="-55%" y="-75%" width="210%" height="250%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1.8" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.softGlowFilterId} x="-30%" y="-45%" width="160%" height="190%" color-interpolation-filters="sRGB">
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

  private renderBridge(angle: number, index: number, primary: string, secondary: string): unknown {
    const low = projectedPoint(80, baseLayerY, 58, angle)
    const middle = projectedPoint(80, lowerLayerY, 49, angle + (index % 2 === 0 ? 1.8 : -1.8))
    const high = projectedPoint(80, innerLayerY, 33, angle + (index % 2 === 0 ? 3.2 : -3.2))
    const color = index % 2 === 0 ? primary : secondary

    return svg`
      <path
        part="bridge-line"
        d=${`M ${pointToString(low)} L ${pointToString(middle)} L ${pointToString(high)}`}
        fill="transparent"
        stroke=${color}
        stroke-width="0.52"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity=${String(index < 2 ? 0.22 : 0.14)}
      ></path>
    `
  }

  private renderOuterTick(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / outerTickCount
    const isMajor = index % 11 === 0
    const isMid = index % 3 === 0
    const radius = isMajor ? 66.3 : 64.4
    const length = isMajor ? 3.6 : isMid ? 2.2 : 1.1
    const start = polarPoint(0, 0, radius, angle)
    const end = polarPoint(0, 0, radius - length, angle)

    return svg`
      <line
        part="tick"
        x1=${String(roundTo(start.x, 3))}
        y1=${String(roundTo(start.y, 3))}
        x2=${String(roundTo(end.x, 3))}
        y2=${String(roundTo(end.y, 3))}
        stroke=${isMajor ? primary : secondary}
        stroke-width=${isMajor ? '0.62' : '0.34'}
        stroke-linecap="round"
        stroke-opacity=${isMajor ? '0.72' : isMid ? '0.34' : '0.18'}
      ></line>
    `
  }

  private renderInnerTick(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / innerTickCount
    const active = index % 6 === 0
    const start = polarPoint(0, 0, active ? 24.4 : 22.8, angle)
    const end = polarPoint(0, 0, active ? 21.6 : 20.8, angle)

    return svg`
      <line
        part="tick"
        x1=${String(roundTo(start.x, 3))}
        y1=${String(roundTo(start.y, 3))}
        x2=${String(roundTo(end.x, 3))}
        y2=${String(roundTo(end.y, 3))}
        stroke=${active ? primary : secondary}
        stroke-width=${active ? '0.54' : '0.28'}
        stroke-linecap="round"
        stroke-opacity=${active ? '0.64' : '0.26'}
      ></line>
    `
  }

  private renderCoreTick(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / coreTickCount
    const active = index % 4 === 0
    const start = polarPoint(0, 0, active ? 15.7 : 14.6, angle)
    const end = polarPoint(0, 0, active ? 13.4 : 12.9, angle)

    return svg`
      <line
        part="tick core-tick"
        x1=${String(roundTo(start.x, 3))}
        y1=${String(roundTo(start.y, 3))}
        x2=${String(roundTo(end.x, 3))}
        y2=${String(roundTo(end.y, 3))}
        stroke=${active ? primary : secondary}
        stroke-width=${active ? '0.42' : '0.24'}
        stroke-linecap="round"
        stroke-opacity=${active ? '0.58' : '0.26'}
      ></line>
    `
  }

  private renderSegmentBlock(index: number, primary: string, secondary: string): unknown {
    const angle = index * 360 / blockCount
    const radius = 48.9
    const point = polarPoint(0, 0, radius, angle)
    const active = index % 6 === 0 || index % 13 === 0

    return svg`
      <g part="segment-block" transform=${`translate(${roundTo(point.x, 3)} ${roundTo(point.y, 3)}) rotate(${roundTo(angle, 3)})`}>
        <rect
          x="-1.15"
          y="-4.1"
          width="2.3"
          height=${active ? '8.6' : '6.7'}
          rx="0.32"
          fill=${`url(#${this.blockGradientId})`}
          stroke=${active ? primary : secondary}
          stroke-width="0.28"
          stroke-opacity=${active ? '0.68' : '0.34'}
          opacity=${active ? '0.88' : '0.58'}
        ></rect>
      </g>
    `
  }

  private renderParticle(index: number, primary: string, accent: string, showAnimation: boolean): unknown {
    const angle = pseudoRandom(index, 3) * 360
    const radius = 58 + pseudoRandom(index, 7) * 13
    const point = polarPoint(0, 0, radius, angle)
    const active = index % 9 === 0 || index % 17 === 0
    const size = active ? 0.95 + pseudoRandom(index, 11) * 0.65 : 0.38 + pseudoRandom(index, 13) * 0.46

    return svg`
      <circle
        part="particle"
        cx=${String(roundTo(point.x, 3))}
        cy=${String(roundTo(point.y, 3))}
        r=${String(roundTo(size, 3))}
        fill=${active ? accent : `url(#${this.particleGradientId})`}
        opacity=${active ? '0.72' : '0.38'}
      >
        ${showAnimation
          ? svg`
            <animate
              attributeName="opacity"
              values=${active ? '0.32;0.92;0.32' : '0.12;0.52;0.12'}
              dur=${`${2.4 + pseudoRandom(index, 19) * 2.2}s`}
              begin=${`${pseudoRandom(index, 23) * -2.8}s`}
              repeatCount="indefinite"
            ></animate>
          `
          : null}
      </circle>
    `
  }

  private resolveArcStroke(segment: ArcSegment, primary: string, secondary: string): string {
    if (segment.accent === 'gold')
      return `url(#${this.goldGradientId})`

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
