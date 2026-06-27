import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface DecorationPoint {
  x: number
  y: number
  animated: boolean
  duration: number
  begin: number
}

interface DecorationSize {
  width: number
  height: number
}

const baseWidth = 300
const baseHeight = 35
const rowNum = 2
const rowPoints = 25
const defaultPointSize = 7
const defaultSize: DecorationSize = {
  width: 0,
  height: 0,
}

const points = createPoints()

export class Decoration2Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dv-color-primary, #7acaec);
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

  @property({ type: Number, attribute: 'point-size' })
  pointSize = defaultPointSize

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
    this.emit('dv-ready', { tagName: 'dv-decoration-2' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const pointSize = Math.max(resolveNumberValue(this.pointSize, defaultPointSize), 0.1)
    const halfPointSize = pointSize / 2
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
        viewBox=${`0 0 ${baseWidth} ${baseHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        ${points.map(point => svg`
          <rect
            part="point"
            fill=${primary}
            x=${String(point.x - halfPointSize)}
            y=${String(point.y - halfPointSize)}
            width=${String(pointSize)}
            height=${String(pointSize)}
          >
            ${showAnimation && point.animated
              ? svg`
                <animate
                  attributeName="fill"
                  values=${`${primary};${secondary}`}
                  dur=${`${point.duration}s`}
                  begin=${`${point.begin}s`}
                  repeatCount="indefinite"
                ></animate>
              `
              : null}
          </rect>
        `)}
      </svg>
    `
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#7acaec',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: 'transparent',
    })

    return [primary, secondary]
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}

function createPoints(): DecorationPoint[] {
  const horizontalGap = baseWidth / (rowPoints + 1)
  const verticalGap = baseHeight / (rowNum + 1)

  return Array.from({ length: rowNum }).flatMap((_, rowIndex) =>
    Array.from({ length: rowPoints }, (_, columnIndex) => {
      const index = rowIndex * rowPoints + columnIndex

      return {
        x: horizontalGap * (columnIndex + 1),
        y: verticalGap * (rowIndex + 1),
        animated: pseudoRandom(index, 1) > 0.6,
        duration: roundTo(pseudoRandom(index, 2) + 1, 3),
        begin: roundTo(pseudoRandom(index, 3) * 2, 3),
      }
    }))
}

function pseudoRandom(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 9301 + salt * 49297) * 233280

  return value - Math.floor(value)
}

function roundTo(value: number, precision: number): number {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}
