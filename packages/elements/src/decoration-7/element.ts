import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration7Size {
  width: number
  height: number
}

interface Decoration7Point {
  x: number
  y: number
}

interface Decoration7Slice {
  points: Decoration7Point[]
  opacity: number
}

interface Decoration7Particle {
  x: number
  y: number
  radius: number
  opacity: number
}

interface Decoration7Geometry {
  ribbon: Decoration7Point[]
  upperEdge: Decoration7Point[]
  lowerEdge: Decoration7Point[]
  innerTrail: Decoration7Point[]
  outerTrail: Decoration7Point[]
  slices: Decoration7Slice[]
  particles: Decoration7Particle[]
}

let decoration7Id = 0

const defaultSize: Decoration7Size = {
  width: 0,
  height: 0,
}

export class Decoration7Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, #9febff);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    path,
    polygon,
    circle {
      vector-effect: non-scaling-stroke;
    }

    .edge,
    .trail {
      fill: transparent;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `

  @property()
  color: string | readonly string[] = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'accent-color' })
  accentColor = ''

  @property()
  colors = ''

  @property({ type: Boolean })
  reverse = false

  @state()
  private size = defaultSize

  private readonly instanceId = ++decoration7Id
  private readonly glassFilterId = `dvk-decoration-7-glass-${this.instanceId}`
  private readonly glowFilterId = `dvk-decoration-7-glow-${this.instanceId}`
  private readonly ribbonGradientId = `dvk-decoration-7-ribbon-${this.instanceId}`
  private readonly edgeGradientId = `dvk-decoration-7-edge-${this.instanceId}`
  private readonly sliceGradientId = `dvk-decoration-7-slice-${this.instanceId}`
  private readonly trailGradientId = `dvk-decoration-7-trail-${this.instanceId}`
  private readonly particleGradientId = `dvk-decoration-7-particle-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-7' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const geometry = createGeometry(width, height)

    return html`
      <svg
        part="graphic"
        width=${String(width)}
        height=${String(height)}
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent, width)}</defs>

        <path
          part="shadow"
          d=${ribbonPath(geometry.ribbon, width, this.reverse)}
          fill=${`url(#${this.ribbonGradientId})`}
          opacity="0.32"
          filter=${`url(#${this.glowFilterId})`}
        ></path>

        <path
          part="ribbon"
          d=${ribbonPath(geometry.ribbon, width, this.reverse)}
          fill=${`url(#${this.ribbonGradientId})`}
          stroke=${secondary}
          stroke-opacity="0.28"
          stroke-width="0.8"
          filter=${`url(#${this.glassFilterId})`}
        ></path>

        <g part="refraction">
          ${this.renderSlices(geometry.slices, width)}
        </g>

        <path
          part="edge upper-edge"
          class="edge"
          d=${curvePath(geometry.upperEdge, width, this.reverse)}
          stroke=${`url(#${this.edgeGradientId})`}
          stroke-width="1.35"
          stroke-opacity="0.86"
        ></path>
        <path
          part="edge lower-edge"
          class="edge"
          d=${curvePath(geometry.lowerEdge, width, this.reverse)}
          stroke=${`url(#${this.edgeGradientId})`}
          stroke-width="0.9"
          stroke-opacity="0.42"
        ></path>

        <g part="energy" filter=${`url(#${this.glowFilterId})`}>
          <path
            class="trail"
            d=${curvePath(geometry.innerTrail, width, this.reverse)}
            stroke=${`url(#${this.trailGradientId})`}
            stroke-width="1.15"
            stroke-opacity="0.74"
          ></path>
          <path
            class="trail"
            d=${curvePath(geometry.outerTrail, width, this.reverse)}
            stroke=${`url(#${this.trailGradientId})`}
            stroke-width="0.72"
            stroke-opacity="0.34"
          ></path>
        </g>

        <g part="particle">
          ${this.renderParticles(geometry.particles, width)}
        </g>
      </svg>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, width: number): unknown {
    const startX = this.reverse ? width : 0
    const endX = this.reverse ? 0 : width

    return svg`
      <filter id=${this.glassFilterId} x="-8%" y="-90%" width="116%" height="280%" color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="1.8" stdDeviation="2.6" flood-color=${secondary} flood-opacity="0.18"></feDropShadow>
      </filter>

      <filter id=${this.glowFilterId} x="-12%" y="-140%" width="124%" height="380%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="3.2" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <linearGradient id=${this.ribbonGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.04"></stop>
        <stop offset="12%" stop-color=${primary} stop-opacity="0.36"></stop>
        <stop offset="36%" stop-color=${secondary} stop-opacity="0.2"></stop>
        <stop offset="62%" stop-color=${accent} stop-opacity="0.18"></stop>
        <stop offset="82%" stop-color=${primary} stop-opacity="0.3"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.06"></stop>
      </linearGradient>

      <linearGradient id=${this.edgeGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${primary} stop-opacity="0.04"></stop>
        <stop offset="18%" stop-color="#f6feff" stop-opacity="0.82"></stop>
        <stop offset="48%" stop-color=${secondary} stop-opacity="0.68"></stop>
        <stop offset="74%" stop-color=${accent} stop-opacity="0.42"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0.08"></stop>
      </linearGradient>

      <linearGradient id=${this.sliceGradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.52"></stop>
        <stop offset="48%" stop-color=${primary} stop-opacity="0.16"></stop>
        <stop offset="100%" stop-color=${accent} stop-opacity="0.08"></stop>
      </linearGradient>

      <linearGradient id=${this.trailGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${primary} stop-opacity="0"></stop>
        <stop offset="28%" stop-color=${primary} stop-opacity="0.74"></stop>
        <stop offset="56%" stop-color=${secondary} stop-opacity="0.5"></stop>
        <stop offset="76%" stop-color=${accent} stop-opacity="0.5"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>

      <radialGradient id=${this.particleGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"></stop>
        <stop offset="48%" stop-color=${primary} stop-opacity="0.72"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0"></stop>
      </radialGradient>
    `
  }

  private renderSlices(slices: Decoration7Slice[], width: number): unknown[] {
    return slices.map(slice => svg`
      <polygon
        part="slice"
        points=${pointsToString(slice.points, width, this.reverse)}
        fill=${`url(#${this.sliceGradientId})`}
        stroke="#ffffff"
        stroke-width="0.45"
        stroke-opacity="0.22"
        opacity=${String(slice.opacity)}
      ></polygon>
    `)
  }

  private renderParticles(particles: Decoration7Particle[], width: number): unknown[] {
    return particles.map(particle => svg`
      <circle
        cx=${String(mapX(particle.x, width, this.reverse))}
        cy=${String(particle.y)}
        r=${String(particle.radius)}
        fill=${`url(#${this.particleGradientId})`}
        opacity=${String(particle.opacity)}
      ></circle>
    `)
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
      fallback: '#9febff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#22d3ee',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-decoration-7-accent-color',
      host: this,
      fallback: '#8b5cff',
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
}

function createGeometry(width: number, height: number): Decoration7Geometry {
  const point = (xRatio: number, yRatio: number): Decoration7Point => ({
    x: roundTo(width * xRatio, 3),
    y: roundTo(height * yRatio, 3),
  })
  const radius = roundTo(clamp(height * 0.022, 0.9, 2.2), 3)

  return {
    ribbon: [
      point(0.025, 0.66),
      point(0.14, 0.42),
      point(0.29, 0.39),
      point(0.44, 0.55),
      point(0.62, 0.74),
      point(0.79, 0.71),
      point(0.975, 0.44),
      point(0.95, 0.23),
      point(0.76, 0.48),
      point(0.58, 0.5),
      point(0.42, 0.31),
      point(0.26, 0.14),
      point(0.12, 0.2),
      point(0.035, 0.47),
    ],
    upperEdge: [
      point(0.048, 0.46),
      point(0.16, 0.25),
      point(0.3, 0.23),
      point(0.43, 0.38),
      point(0.58, 0.55),
      point(0.77, 0.55),
      point(0.946, 0.31),
    ],
    lowerEdge: [
      point(0.06, 0.62),
      point(0.2, 0.48),
      point(0.34, 0.5),
      point(0.5, 0.65),
      point(0.66, 0.78),
      point(0.82, 0.69),
      point(0.955, 0.49),
    ],
    innerTrail: [
      point(0.1, 0.53),
      point(0.25, 0.38),
      point(0.4, 0.43),
      point(0.55, 0.57),
      point(0.72, 0.63),
      point(0.88, 0.47),
    ],
    outerTrail: [
      point(0.18, 0.32),
      point(0.33, 0.2),
      point(0.48, 0.35),
      point(0.64, 0.49),
      point(0.82, 0.41),
      point(0.94, 0.25),
    ],
    slices: [
      {
        points: [point(0.18, 0.28), point(0.31, 0.24), point(0.39, 0.35), point(0.25, 0.47)],
        opacity: 0.46,
      },
      {
        points: [point(0.42, 0.36), point(0.56, 0.5), point(0.51, 0.66), point(0.36, 0.52)],
        opacity: 0.34,
      },
      {
        points: [point(0.66, 0.56), point(0.82, 0.51), point(0.76, 0.66), point(0.61, 0.7)],
        opacity: 0.4,
      },
      {
        points: [point(0.84, 0.39), point(0.94, 0.27), point(0.96, 0.42), point(0.86, 0.55)],
        opacity: 0.32,
      },
    ],
    particles: [
      { ...point(0.13, 0.31), radius, opacity: 0.45 },
      { ...point(0.23, 0.56), radius: roundTo(radius * 0.72, 3), opacity: 0.34 },
      { ...point(0.37, 0.26), radius: roundTo(radius * 0.82, 3), opacity: 0.4 },
      { ...point(0.47, 0.58), radius, opacity: 0.5 },
      { ...point(0.6, 0.41), radius: roundTo(radius * 0.76, 3), opacity: 0.34 },
      { ...point(0.73, 0.74), radius: roundTo(radius * 0.9, 3), opacity: 0.38 },
      { ...point(0.87, 0.36), radius, opacity: 0.48 },
      { ...point(0.93, 0.58), radius: roundTo(radius * 0.68, 3), opacity: 0.28 },
    ],
  }
}

function ribbonPath(points: Decoration7Point[], width: number, reverse: boolean): string {
  return [
    `M ${pointToString(points[0], width, reverse)}`,
    `C ${pointToString(points[1], width, reverse)} ${pointToString(points[2], width, reverse)} ${pointToString(points[3], width, reverse)}`,
    `C ${pointToString(points[4], width, reverse)} ${pointToString(points[5], width, reverse)} ${pointToString(points[6], width, reverse)}`,
    `L ${pointToString(points[7], width, reverse)}`,
    `C ${pointToString(points[8], width, reverse)} ${pointToString(points[9], width, reverse)} ${pointToString(points[10], width, reverse)}`,
    `C ${pointToString(points[11], width, reverse)} ${pointToString(points[12], width, reverse)} ${pointToString(points[13], width, reverse)}`,
    'Z',
  ].join(' ')
}

function curvePath(points: Decoration7Point[], width: number, reverse: boolean): string {
  const commands = [
    `M ${pointToString(points[0], width, reverse)}`,
    `C ${pointToString(points[1], width, reverse)} ${pointToString(points[2], width, reverse)} ${pointToString(points[3], width, reverse)}`,
    `S ${pointToString(points[4], width, reverse)} ${pointToString(points[5], width, reverse)}`,
  ]

  if (points.length > 6)
    commands.push(`L ${pointToString(points[points.length - 1], width, reverse)}`)

  return commands.join(' ')
}

function pointsToString(points: Decoration7Point[], width: number, reverse: boolean): string {
  return points
    .map(point => pointToString(point, width, reverse))
    .join(' ')
}

function pointToString(point: Decoration7Point, width: number, reverse: boolean): string {
  return `${mapX(point.x, width, reverse)},${point.y}`
}

function mapX(value: number, width: number, reverse: boolean): number {
  return roundTo(reverse ? width - value : value, 3)
}

function splitColors(value: string): string[] {
  return value.split(',').map(color => color.trim()).filter(Boolean)
}

function isJsonArrayString(value: string): boolean {
  return value.trim().startsWith('[')
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function roundTo(value: number, precision: number): number {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}
