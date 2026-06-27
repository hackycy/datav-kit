import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface DecorationBar {
  x: number
  y: number
  height: number
  minHeight: number
  duration: number
  colorIndex: number
}

interface DecorationSize {
  width: number
  height: number
}

const baseWidth = 300
const baseHeight = 35
const rowPoints = 40
const rectWidth = 7
const defaultSize: DecorationSize = {
  width: 0,
  height: 0,
}

const bars = createBars()

export class Decoration1Element extends DatavElement {
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

  @property({ type: Number, attribute: 'bar-width' })
  barWidth = rectWidth

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
    this.emit('dv-ready', { tagName: 'dv-decoration-1' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const barWidth = Math.max(resolveNumberValue(this.barWidth, rectWidth), 0.1)
    const showAnimation = this.animated
      && !this.paused
      && !this.prefersReducedMotion()
      && this.size.width > 0
      && this.size.height > 0
    const colors = [primary, secondary]

    return html`
      <svg
        part="graphic"
        width=${String(width)}
        height=${String(height)}
        viewBox=${`0 0 ${baseWidth} ${baseHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        ${bars.map(bar => svg`
          <rect
            part="bar"
            fill=${colors[bar.colorIndex]}
            x=${String(bar.x - barWidth / 2)}
            y=${String(bar.y - bar.height / 2)}
            width=${String(barWidth)}
            height=${String(bar.height)}
          >
            ${showAnimation
              ? svg`
                <animate
                  attributeName="y"
                  values=${`${bar.y - bar.minHeight / 2};${bar.y - bar.height / 2};${bar.y - bar.minHeight / 2}`}
                  dur=${`${bar.duration}s`}
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
                  begin="0s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="height"
                  values=${`${bar.minHeight};${bar.height};${bar.minHeight}`}
                  dur=${`${bar.duration}s`}
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
                  begin="0s"
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
      fallback: '#7acaec',
    })

    return [primary, secondary]
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}

function createBars(): DecorationBar[] {
  const horizontalGap = baseWidth / (rowPoints + 1)
  const verticalCenter = baseHeight / 2

  return Array.from({ length: rowPoints }, (_, index) => {
    const heightRatio = pseudoRandom(index, 1) > 0.8
      ? randomBetween(index, 2, 0.7, 1)
      : randomBetween(index, 2, 0.2, 0.5)
    const height = heightRatio * baseHeight

    return {
      x: horizontalGap * (index + 1),
      y: verticalCenter,
      height,
      minHeight: height * pseudoRandom(index, 3),
      duration: pseudoRandom(index, 4) + 1.5,
      colorIndex: pseudoRandom(index, 5) > 0.5 ? 0 : 1,
    }
  })
}

function randomBetween(index: number, salt: number, min: number, max: number): number {
  return min + (max - min) * pseudoRandom(index, salt)
}

function pseudoRandom(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 9301 + salt * 49297) * 233280

  return value - Math.floor(value)
}
