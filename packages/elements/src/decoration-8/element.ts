import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration8Size {
  width: number
  height: number
}

const defaultSize: Decoration8Size = {
  width: 0,
  height: 0,
}
const baseSize = 100
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

let decoration8Id = 0

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
  dur = 5

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

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

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-8' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const duration = Math.max(resolveNumberValue(this.dur, 5), 0.1)
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

      <div part="content" class="content">
        <slot></slot>
      </div>
    `
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
