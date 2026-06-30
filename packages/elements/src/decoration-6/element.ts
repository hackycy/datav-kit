import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration6Size {
  width: number
  height: number
}

interface Decoration6Point {
  x: number
  y: number
}

interface Decoration6Segment {
  x: number
  y: number
  length: number
}

interface Decoration6Cut {
  x: number
  y: number
  dx: number
  dy: number
}

interface Decoration6Node {
  x: number
  y: number
  radius: number
  opacity: number
}

interface Decoration6Geometry {
  headLine: Decoration6Point[]
  mainLine: Decoration6Point[]
  tailLine: Decoration6Point[]
  upperLine: Decoration6Point[]
  upperTailLine: Decoration6Point[]
  lowerLine: Decoration6Point[]
  lowerTailLine: Decoration6Point[]
  haloLine: Decoration6Point[]
  segments: Decoration6Segment[]
  cuts: Decoration6Cut[]
  nodes: Decoration6Node[]
}

let decoration6Id = 0

const defaultSize: Decoration6Size = {
  width: 0,
  height: 0,
}

export class Decoration6Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, #18f0ff);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    path,
    polyline,
    line,
    circle {
      vector-effect: non-scaling-stroke;
    }

    .line {
      fill: transparent;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .crisp {
      shape-rendering: geometricPrecision;
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

  private readonly instanceId = ++decoration6Id
  private readonly glowId = `dvk-decoration-6-glow-${this.instanceId}`
  private readonly nodeGlowId = `dvk-decoration-6-node-glow-${this.instanceId}`
  private readonly railGradientId = `dvk-decoration-6-rail-${this.instanceId}`
  private readonly dimGradientId = `dvk-decoration-6-dim-${this.instanceId}`
  private readonly nodeGradientId = `dvk-decoration-6-node-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-6' })
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

        <g part="halo" filter=${`url(#${this.glowId})`} opacity="0.78">
          <polyline
            class="line"
            stroke=${secondary}
            stroke-width="4.2"
            stroke-opacity="0.18"
            points=${pointsToString(geometry.haloLine, width, this.reverse)}
          ></polyline>
          <polyline
            class="line"
            stroke=${primary}
            stroke-width="2.8"
            stroke-opacity="0.22"
            points=${pointsToString(geometry.mainLine, width, this.reverse)}
          ></polyline>
        </g>

        <g class="crisp">
          <polyline
            part="line support-line upper-line"
            class="line"
            stroke=${`url(#${this.dimGradientId})`}
            stroke-width="0.95"
            points=${pointsToString(geometry.upperLine, width, this.reverse)}
          ></polyline>
          <polyline
            part="line support-line upper-tail-line"
            class="line"
            stroke=${secondary}
            stroke-width="0.85"
            stroke-opacity="0.62"
            points=${pointsToString(geometry.upperTailLine, width, this.reverse)}
          ></polyline>
          <polyline
            part="line main-line head-line"
            class="line"
            stroke=${`url(#${this.railGradientId})`}
            stroke-width="1.7"
            points=${pointsToString(geometry.headLine, width, this.reverse)}
          ></polyline>
          <polyline
            part="line main-line"
            class="line"
            stroke=${`url(#${this.railGradientId})`}
            stroke-width="1.55"
            points=${pointsToString(geometry.mainLine, width, this.reverse)}
          ></polyline>
          <polyline
            part="line main-line tail-line"
            class="line"
            stroke=${`url(#${this.railGradientId})`}
            stroke-width="1.2"
            stroke-opacity="0.88"
            points=${pointsToString(geometry.tailLine, width, this.reverse)}
          ></polyline>
          <polyline
            part="line support-line lower-line"
            class="line"
            stroke=${secondary}
            stroke-width="0.9"
            stroke-opacity="0.7"
            points=${pointsToString(geometry.lowerLine, width, this.reverse)}
          ></polyline>
          <polyline
            part="line support-line lower-tail-line"
            class="line"
            stroke=${`url(#${this.dimGradientId})`}
            stroke-width="0.82"
            points=${pointsToString(geometry.lowerTailLine, width, this.reverse)}
          ></polyline>

          ${this.renderSegments(geometry.segments, width, primary, secondary)}
          ${this.renderCuts(geometry.cuts, width, primary)}
        </g>

        <g part="node" filter=${`url(#${this.nodeGlowId})`}>
          ${this.renderNodes(geometry.nodes, width)}
        </g>
      </svg>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, width: number): unknown {
    const startX = this.reverse ? width : 0
    const endX = this.reverse ? 0 : width

    return svg`
      <filter id=${this.glowId} x="-12%" y="-120%" width="124%" height="340%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="2.6" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.nodeGlowId} x="-220%" y="-220%" width="540%" height="540%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="2.2" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <linearGradient id=${this.railGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${accent} stop-opacity="0.95"></stop>
        <stop offset="12%" stop-color=${primary}></stop>
        <stop offset="44%" stop-color=${secondary} stop-opacity="0.86"></stop>
        <stop offset="70%" stop-color=${primary} stop-opacity="0.62"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.2"></stop>
      </linearGradient>

      <linearGradient id=${this.dimGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${primary} stop-opacity="0.86"></stop>
        <stop offset="38%" stop-color=${secondary} stop-opacity="0.44"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.08"></stop>
      </linearGradient>

      <radialGradient id=${this.nodeGradientId} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color=${accent}></stop>
        <stop offset="42%" stop-color=${primary}></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.18"></stop>
      </radialGradient>
    `
  }

  private renderSegments(segments: Decoration6Segment[], width: number, primary: string, secondary: string): unknown[] {
    return segments.map((segment, index) => {
      const color = index % 2 === 0 ? primary : secondary

      return svg`
        <line
          part="segment"
          class="line"
          x1=${String(mapX(segment.x, width, this.reverse))}
          y1=${String(segment.y)}
          x2=${String(mapX(segment.x + segment.length, width, this.reverse))}
          y2=${String(segment.y)}
          stroke=${color}
          stroke-width=${index === 1 ? '1.5' : '1'}
          stroke-opacity=${index === 1 ? '0.92' : '0.66'}
        ></line>
      `
    })
  }

  private renderCuts(cuts: Decoration6Cut[], width: number, primary: string): unknown[] {
    return cuts.map(cut => svg`
      <line
        part="cut"
        class="line"
        x1=${String(mapX(cut.x, width, this.reverse))}
        y1=${String(cut.y)}
        x2=${String(mapX(cut.x + cut.dx, width, this.reverse))}
        y2=${String(cut.y + cut.dy)}
        stroke=${primary}
        stroke-width="0.9"
        stroke-opacity="0.58"
      ></line>
    `)
  }

  private renderNodes(nodes: Decoration6Node[], width: number): unknown[] {
    return nodes.map(node => svg`
      <circle
        cx=${String(mapX(node.x, width, this.reverse))}
        cy=${String(node.y)}
        r=${String(node.radius)}
        fill=${`url(#${this.nodeGradientId})`}
        opacity=${String(node.opacity)}
      ></circle>
      <circle
        cx=${String(mapX(node.x, width, this.reverse))}
        cy=${String(node.y)}
        r=${String(Math.max(node.radius * 0.34, 0.8))}
        fill="#f5feff"
        opacity=${String(Math.min(node.opacity + 0.14, 1))}
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
      fallback: '#18f0ff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#2b7cff',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-decoration-6-accent-color',
      host: this,
      fallback: '#e6fdff',
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

function createGeometry(width: number, height: number): Decoration6Geometry {
  const headEnd = roundTo(clamp(Math.max(96, width * 0.22), 64, Math.max(width - 16, 64)), 3)
  const mainStart = roundTo(clamp(headEnd + 12, 0, width), 3)
  const firstEnd = roundTo(clamp(Math.max(headEnd + 36, width * 0.48), headEnd + 24, Math.max(width - 92, headEnd + 24)), 3)
  const gap = Math.max(18, width * 0.06)
  const secondStart = roundTo(clamp(firstEnd + gap, firstEnd + 12, Math.max(width - 54, firstEnd + 12)), 3)
  const tailStart = roundTo(clamp(Math.max(secondStart + 34, width * 0.69), secondStart + 20, Math.max(width - 34, secondStart + 20)), 3)
  const tailEnd = roundTo(Math.max(width - 8, tailStart), 3)
  const upperEnd = roundTo(clamp(width * 0.36, headEnd + 28, Math.max(firstEnd - 26, headEnd + 28)), 3)
  const upperTailStart = roundTo(clamp(firstEnd + 18, firstEnd + 10, Math.max(width - 112, firstEnd + 10)), 3)
  const upperTailEnd = roundTo(clamp(width * 0.82, upperTailStart + 22, Math.max(width - 44, upperTailStart + 22)), 3)
  const lowerEnd = roundTo(clamp(width * 0.45, headEnd + 48, Math.max(firstEnd - 8, headEnd + 48)), 3)
  const lowerTailEnd = roundTo(clamp(width - 30, tailStart + 18, width), 3)
  const y = createYPositions(height)

  return {
    headLine: [
      { x: roundTo(headEnd * 0.06, 3), y: y.head },
      { x: roundTo(headEnd * 0.28, 3), y: y.head },
      { x: roundTo(headEnd * 0.42, 3), y: y.upperStep },
      { x: roundTo(headEnd * 0.76, 3), y: y.upperStep },
      { x: headEnd, y: y.mid },
    ],
    mainLine: [
      { x: mainStart, y: y.mid },
      { x: firstEnd, y: y.mid },
    ],
    tailLine: [
      { x: secondStart, y: y.mid },
      { x: tailEnd, y: y.mid },
    ],
    upperLine: [
      { x: roundTo(headEnd * 0.16, 3), y: y.upper },
      { x: roundTo(headEnd * 0.54, 3), y: y.upper },
      { x: roundTo(headEnd * 0.68, 3), y: y.upperStep },
      { x: upperEnd, y: y.upperStep },
    ],
    upperTailLine: [
      { x: upperTailStart, y: y.upperStep },
      { x: upperTailEnd, y: y.upperStep },
    ],
    lowerLine: [
      { x: roundTo(headEnd * 0.48, 3), y: y.lower },
      { x: roundTo(headEnd * 0.84, 3), y: y.lower },
      { x: roundTo(headEnd * 0.98, 3), y: y.lowerStep },
      { x: lowerEnd, y: y.lowerStep },
    ],
    lowerTailLine: [
      { x: tailStart, y: y.lowerStep },
      { x: lowerTailEnd, y: y.lowerStep },
      { x: tailEnd, y: y.mid },
    ],
    haloLine: [
      { x: roundTo(headEnd * 0.05, 3), y: y.head },
      { x: roundTo(headEnd * 0.76, 3), y: y.upperStep },
      { x: headEnd, y: y.mid },
      { x: tailEnd, y: y.mid },
    ],
    segments: [
      { x: roundTo(headEnd * 0.2, 3), y: y.upper, length: roundTo(headEnd * 0.12, 3) },
      { x: roundTo(firstEnd + gap * 0.24, 3), y: y.mid, length: roundTo(Math.max(10, gap * 0.28), 3) },
      { x: roundTo(tailStart + 10, 3), y: y.upperStep, length: roundTo(Math.max(14, width * 0.045), 3) },
      { x: roundTo(lowerEnd - Math.max(22, width * 0.045), 3), y: y.lowerStep, length: roundTo(Math.max(14, width * 0.035), 3) },
    ],
    cuts: [
      { x: roundTo(headEnd * 0.34, 3), y: y.lower, dx: roundTo(headEnd * 0.08, 3), dy: roundTo(-height * 0.18, 3) },
      { x: roundTo(firstEnd + gap * 0.42, 3), y: y.upper, dx: roundTo(gap * 0.28, 3), dy: roundTo(height * 0.2, 3) },
      { x: roundTo(tailEnd - Math.max(26, width * 0.06), 3), y: y.lowerStep, dx: roundTo(Math.max(10, width * 0.03), 3), dy: roundTo(-height * 0.16, 3) },
    ],
    nodes: [
      { x: headEnd, y: y.mid, radius: roundTo(clamp(height * 0.07, 2, 3.8), 3), opacity: 0.96 },
      { x: secondStart, y: y.mid, radius: roundTo(clamp(height * 0.052, 1.5, 3), 3), opacity: 0.86 },
      { x: tailStart, y: y.lowerStep, radius: roundTo(clamp(height * 0.042, 1.2, 2.4), 3), opacity: 0.72 },
      { x: roundTo(headEnd * 0.28, 3), y: y.head, radius: roundTo(clamp(height * 0.04, 1.2, 2.2), 3), opacity: 0.78 },
    ],
  }
}

function createYPositions(height: number): Record<'upper' | 'upperStep' | 'mid' | 'lowerStep' | 'lower' | 'head', number> {
  const mid = roundTo(height * 0.52, 3)

  return {
    upper: roundTo(height * 0.26, 3),
    upperStep: roundTo(height * 0.38, 3),
    mid,
    lowerStep: roundTo(height * 0.66, 3),
    lower: roundTo(height * 0.78, 3),
    head: roundTo(mid + height * 0.1, 3),
  }
}

function pointsToString(points: Decoration6Point[], width: number, reverse: boolean): string {
  return points
    .map(point => `${mapX(point.x, width, reverse)},${point.y}`)
    .join(' ')
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
