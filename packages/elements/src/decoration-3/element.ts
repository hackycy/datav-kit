import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface DecorationPoint {
  x: number
  y: number
}

interface DecorationSize {
  width: number
  height: number
}

const defaultDuration = 1.2
const strokeDashKeySplines = '0.4,1,0.49,0.98'
const defaultSize: DecorationSize = {
  width: 0,
  height: 0,
}

export class Decoration3Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dv-color-primary, #3f96a5);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Number })
  duration = defaultDuration

  @property({ type: Number })
  dur = defaultDuration

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-decoration-3' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const duration = this.resolveDuration()
    const line1Points = createLine1Points(width, height)
    const line2Points = createLine2Points(width, height)
    const line1Length = getPolylineLength(line1Points)
    const line2Length = getPolylineLength(line2Points)
    const showAnimation = this.animated
      && !this.paused
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0

    return html`
      <svg
        part="graphic"
        width=${String(width)}
        height=${String(height)}
        aria-hidden="true"
      >
        <polyline
          part="line main-line"
          fill="transparent"
          stroke=${primary}
          stroke-width="3"
          points=${pointsToString(line1Points)}
        >
          ${showAnimation ? createStrokeDashAnimation(line1Length, duration) : null}
        </polyline>
        <polyline
          part="line sub-line"
          fill="transparent"
          stroke=${secondary}
          stroke-width="2"
          points=${pointsToString(line2Points)}
        >
          ${showAnimation ? createStrokeDashAnimation(line2Length, duration) : null}
        </polyline>
      </svg>
    `
  }

  private resolveDuration(): number {
    const duration = this.hasAttribute('duration') || this.duration !== defaultDuration
      ? this.duration
      : this.dur

    return Math.max(resolveNumberValue(duration, defaultDuration), 0.1)
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#3f96a5',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#3f96a5',
    })

    return [primary, secondary]
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}

function createLine1Points(width: number, height: number): DecorationPoint[] {
  return [
    { x: 0, y: height * 0.2 },
    { x: width * 0.18, y: height * 0.2 },
    { x: width * 0.2, y: height * 0.4 },
    { x: width * 0.25, y: height * 0.4 },
    { x: width * 0.27, y: height * 0.6 },
    { x: width * 0.72, y: height * 0.6 },
    { x: width * 0.75, y: height * 0.4 },
    { x: width * 0.8, y: height * 0.4 },
    { x: width * 0.82, y: height * 0.2 },
    { x: width, y: height * 0.2 },
  ]
}

function createLine2Points(width: number, height: number): DecorationPoint[] {
  return [
    { x: width * 0.3, y: height * 0.8 },
    { x: width * 0.7, y: height * 0.8 },
  ]
}

function createStrokeDashAnimation(length: number, duration: number): unknown {
  return svg`
    <animate
      attributeName="stroke-dasharray"
      attributeType="XML"
      from=${`0, ${length / 2}, 0, ${length / 2}`}
      to=${`0, 0, ${length}, 0`}
      dur=${`${duration}s`}
      begin="0s"
      calcMode="spline"
      keyTimes="0;1"
      keySplines=${strokeDashKeySplines}
      repeatCount="indefinite"
    ></animate>
  `
}

function pointsToString(points: DecorationPoint[]): string {
  return points.map(point => `${roundTo(point.x, 3)},${roundTo(point.y, 3)}`).join(' ')
}

function getPolylineLength(points: DecorationPoint[]): number {
  return points.reduce((length, point, index) => {
    const previousPoint = points[index - 1]

    if (!previousPoint)
      return length

    return length + Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y)
  }, 0)
}

function roundTo(value: number, precision: number): number {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}
