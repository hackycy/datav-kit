import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration10Size {
  width: number
  height: number
}

const defaultSize: Decoration10Size = {
  width: 0,
  height: 0,
}
const baseSize = 120
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

  @state()
  private size = defaultSize

  private readonly instanceId = ++decoration10Id
  private readonly backgroundGradientId = `dvk-decoration-10-background-${this.instanceId}`
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

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-10' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const duration = Math.min(Math.max(resolveNumberValue(this.dur, 8), 6), 10)
    const showAnimation = this.animated
      && !this.paused
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0

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
          part="background"
          x="0"
          y="0"
          width="120"
          height="120"
          rx="0"
          fill=${`url(#${this.backgroundGradientId})`}
        ></rect>
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

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <radialGradient id=${this.backgroundGradientId} cx="50%" cy="50%" r="68%">
        <stop offset="0%" stop-color="rgba(4, 24, 45, 0.92)"></stop>
        <stop offset="46%" stop-color="rgba(2, 15, 34, 0.9)"></stop>
        <stop offset="74%" stop-color="rgba(1, 8, 22, 0.96)"></stop>
        <stop offset="100%" stop-color="rgba(0, 3, 12, 0.98)"></stop>
      </radialGradient>

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
