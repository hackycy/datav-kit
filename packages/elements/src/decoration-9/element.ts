import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration9Size {
  width: number
  height: number
}

interface Decoration9Line {
  x1: number
  x2: number
  y: number
  width: number
  opacity: number
  tone: 'primary' | 'secondary' | 'accent' | 'dim'
}

interface Decoration9Point {
  x: number
  y: number
}

interface Decoration9CornerLine {
  points: Decoration9Point[]
  width: number
  opacity: number
  tone: 'primary' | 'secondary' | 'accent' | 'dim'
}

interface Decoration9Block {
  x: number
  y: number
  width: number
  height: number
  skew: number
  opacity: number
  tone: 'primary' | 'secondary' | 'accent'
}

interface Decoration9Geometry {
  lines: Decoration9Line[]
  cornerLines: Decoration9CornerLine[]
  ticks: Decoration9Line[]
  blocks: Decoration9Block[]
}

let decoration9Id = 0

const defaultSize: Decoration9Size = {
  width: 0,
  height: 0,
}

export class Decoration9Element extends DatavElement {
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

    line,
    polyline,
    polygon {
      vector-effect: non-scaling-stroke;
    }

    line,
    polyline {
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

  private readonly instanceId = ++decoration9Id
  private readonly railGradientId = `dvk-decoration-9-rail-${this.instanceId}`
  private readonly dimGradientId = `dvk-decoration-9-dim-${this.instanceId}`
  private readonly blockGradientId = `dvk-decoration-9-block-${this.instanceId}`
  private readonly accentBlockGradientId = `dvk-decoration-9-accent-block-${this.instanceId}`
  private readonly lineGlowId = `dvk-decoration-9-line-glow-${this.instanceId}`
  private readonly blockGlowId = `dvk-decoration-9-block-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-decoration-9' })
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

        <g part="line-glow" filter=${`url(#${this.lineGlowId})`} opacity="0.72">
          ${geometry.lines.map(line => this.renderLine(line, width, true))}
        </g>

        <g part="line-layer">
          ${geometry.lines.map(line => this.renderLine(line, width, false))}
          ${geometry.cornerLines.map(line => this.renderCornerLine(line, width))}
          ${geometry.ticks.map(line => this.renderTick(line, width, primary, secondary, accent))}
        </g>

        <g part="block-layer" filter=${`url(#${this.blockGlowId})`}>
          ${geometry.blocks.map(block => this.renderBlock(block, width, primary, secondary, accent))}
        </g>
      </svg>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, width: number): unknown {
    const startX = this.reverse ? width : 0
    const endX = this.reverse ? 0 : width

    return svg`
      <filter id=${this.lineGlowId} x="-8%" y="-160%" width="116%" height="420%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="2.1" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.blockGlowId} x="-140%" y="-220%" width="380%" height="540%" color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color=${secondary} flood-opacity="0.38"></feDropShadow>
        <feDropShadow dx="0" dy="0" stdDeviation="5.8" flood-color=${primary} flood-opacity="0.12"></feDropShadow>
      </filter>

      <linearGradient id=${this.railGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(secondary, 0.18)}></stop>
        <stop offset="18%" stop-color=${secondary} stop-opacity="0.72"></stop>
        <stop offset="48%" stop-color=${primary} stop-opacity="0.96"></stop>
        <stop offset="78%" stop-color=${secondary} stop-opacity="0.68"></stop>
        <stop offset="100%" stop-color=${withAlpha(primary, 0.16)}></stop>
      </linearGradient>

      <linearGradient id=${this.dimGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(secondary, 0.05)}></stop>
        <stop offset="46%" stop-color=${secondary} stop-opacity="0.42"></stop>
        <stop offset="100%" stop-color=${withAlpha(primary, 0.08)}></stop>
      </linearGradient>

      <linearGradient id=${this.blockGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${primary} stop-opacity="0.18"></stop>
        <stop offset="50%" stop-color=${secondary} stop-opacity="0.92"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0.32"></stop>
      </linearGradient>

      <linearGradient id=${this.accentBlockGradientId} x1=${String(startX)} y1="0" x2=${String(endX)} y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.18"></stop>
        <stop offset="50%" stop-color=${accent} stop-opacity="0.9"></stop>
        <stop offset="100%" stop-color=${primary} stop-opacity="0.28"></stop>
      </linearGradient>
    `
  }

  private renderLine(line: Decoration9Line, width: number, glow: boolean): unknown {
    const stroke = line.tone === 'dim'
      ? `url(#${this.dimGradientId})`
      : line.tone === 'accent'
        ? `url(#${this.railGradientId})`
        : `url(#${this.railGradientId})`

    return svg`
      <line
        part=${glow ? 'glow-line' : `line ${line.tone}-line`}
        x1=${n(mirrorX(line.x1, width, this.reverse))}
        x2=${n(mirrorX(line.x2, width, this.reverse))}
        y1=${n(line.y)}
        y2=${n(line.y)}
        stroke=${stroke}
        stroke-width=${n(glow ? line.width + 2.6 : line.width)}
        stroke-opacity=${String(glow ? line.opacity * 0.22 : line.opacity)}
      ></line>
    `
  }

  private renderTick(line: Decoration9Line, width: number, primary: string, secondary: string, accent: string): unknown {
    const stroke = line.tone === 'accent'
      ? accent
      : line.tone === 'primary'
        ? primary
        : secondary

    return svg`
      <line
        part="tick"
        x1=${n(mirrorX(line.x1, width, this.reverse))}
        x2=${n(mirrorX(line.x2, width, this.reverse))}
        y1=${n(line.y)}
        y2=${n(line.y)}
        stroke=${stroke}
        stroke-width=${n(line.width)}
        stroke-opacity=${String(line.opacity)}
      ></line>
    `
  }

  private renderCornerLine(line: Decoration9CornerLine, width: number): unknown {
    const stroke = line.tone === 'dim'
      ? `url(#${this.dimGradientId})`
      : `url(#${this.railGradientId})`

    return svg`
      <polyline
        part=${`corner-line ${line.tone}-corner-line`}
        points=${pointsToString(line.points, width, this.reverse)}
        fill="transparent"
        stroke=${stroke}
        stroke-width=${n(line.width)}
        stroke-opacity=${String(line.opacity)}
      ></polyline>
    `
  }

  private renderBlock(block: Decoration9Block, width: number, primary: string, secondary: string, accent: string): unknown {
    const fill = block.tone === 'accent'
      ? `url(#${this.accentBlockGradientId})`
      : `url(#${this.blockGradientId})`
    const stroke = block.tone === 'accent'
      ? accent
      : block.tone === 'primary'
        ? primary
        : secondary

    return svg`
      <polygon
        part=${`block ${block.tone}-block`}
        points=${parallelogramPoints(block, width, this.reverse)}
        fill=${fill}
        fill-opacity=${String(block.opacity)}
        stroke=${stroke}
        stroke-opacity="0.72"
        stroke-width="0.7"
      ></polygon>
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
      cssVariable: '--dvk-decoration-9-accent',
      host: this,
      fallback: '#60e7ff',
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

function createGeometry(width: number, height: number): Decoration9Geometry {
  const margin = clamp(width * 0.03, 10, 18)
  const centerY = height * 0.5
  const upperY = height * 0.36
  const lowerY = height * 0.66
  const fineWidth = clamp(height * 0.02, 0.72, 1.1)
  const railWidth = clamp(height * 0.028, 1, 1.65)
  const blockHeight = clamp(height * 0.105, 4.4, 7)
  const blockSkew = clamp(width * 0.012, 4.2, 7.4)

  return {
    lines: [
      { x1: margin, x2: width * 0.29, y: centerY, width: railWidth, opacity: 0.9, tone: 'primary' },
      { x1: width * 0.72, x2: width - margin, y: centerY, width: railWidth, opacity: 0.86, tone: 'secondary' },
      { x1: width * 0.43, x2: width * 0.58, y: upperY, width: fineWidth, opacity: 0.58, tone: 'secondary' },
      { x1: width * 0.25, x2: width * 0.4, y: lowerY, width: fineWidth, opacity: 0.5, tone: 'dim' },
    ],
    cornerLines: [
      {
        points: [
          { x: width * 0.085, y: centerY },
          { x: width * 0.16, y: centerY },
          { x: width * 0.195, y: height * 0.33 },
        ],
        width: fineWidth,
        opacity: 0.56,
        tone: 'dim',
      },
      {
        points: [
          { x: width * 0.49, y: lowerY },
          { x: width * 0.56, y: lowerY },
          { x: width * 0.595, y: centerY },
        ],
        width: railWidth,
        opacity: 0.72,
        tone: 'primary',
      },
      {
        points: [
          { x: width * 0.78, y: height * 0.35 },
          { x: width * 0.84, y: centerY },
          { x: width * 0.925, y: centerY },
        ],
        width: fineWidth,
        opacity: 0.62,
        tone: 'secondary',
      },
    ],
    ticks: [
      { x1: width * 0.315, x2: width * 0.345, y: upperY, width: railWidth, opacity: 0.78, tone: 'primary' },
      { x1: width * 0.655, x2: width * 0.695, y: lowerY, width: railWidth, opacity: 0.74, tone: 'accent' },
      { x1: width * 0.885, x2: width * 0.925, y: upperY, width: fineWidth, opacity: 0.48, tone: 'secondary' },
    ],
    blocks: [
      { x: width * 0.17, y: height * 0.21, width: width * 0.068, height: blockHeight, skew: blockSkew, opacity: 0.78, tone: 'secondary' },
      { x: width * 0.78, y: height * 0.56, width: width * 0.082, height: blockHeight, skew: blockSkew, opacity: 0.7, tone: 'accent' },
    ],
  }
}

function parallelogramPoints(block: Decoration9Block, width: number, reverse: boolean): string {
  const points = [
    { x: block.x + block.skew, y: block.y },
    { x: block.x + block.width + block.skew, y: block.y },
    { x: block.x + block.width, y: block.y + block.height },
    { x: block.x, y: block.y + block.height },
  ]

  return points.map(point => `${n(mirrorX(point.x, width, reverse))},${n(point.y)}`).join(' ')
}

function pointsToString(points: Decoration9Point[], width: number, reverse: boolean): string {
  return points.map(point => `${n(mirrorX(point.x, width, reverse))},${n(point.y)}`).join(' ')
}

function mirrorX(x: number, width: number, reverse: boolean): number {
  return reverse ? width - x : x
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function n(value: number): string {
  return String(Math.round(value * 1000) / 1000)
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
