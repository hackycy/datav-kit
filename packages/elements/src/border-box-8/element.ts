import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

let borderBox8Id = 0

interface BorderBoxSize {
  width: number
  height: number
}

const defaultSize: BorderBoxSize = {
  width: 0,
  height: 0,
}

export class BorderBox8Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #235fa7);
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      animateMotion {
        display: none;
      }
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Boolean })
  reverse = false

  @property({ type: Number })
  duration = 3

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly pathId = `dv-border-box-8-path-${++borderBox8Id}`
  private readonly gradientId = `dv-border-box-8-gradient-${borderBox8Id}`
  private readonly maskId = `dv-border-box-8-mask-${borderBox8Id}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-8' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const path = this.createPath(width, height)
    const length = Math.max((width + height - 5) * 2, 1)
    const duration = Math.max(resolveNumberValue(this.duration, 3), 0.1)
    const showAnimation = this.animated && !this.paused

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" width=${String(width)} height=${String(height)} aria-hidden="true">
          <defs>
            <path id=${this.pathId} d=${path}></path>
            <linearGradient id=${this.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color=${primary} stop-opacity="1"></stop>
              <stop offset="100%" stop-color=${secondary} stop-opacity="1"></stop>
            </linearGradient>
            <mask id=${this.maskId}>
              <circle r="150" fill=${`url(#${this.gradientId})`}>
                ${showAnimation
                  ? svg`
                    <animateMotion
                      dur=${`${duration}s`}
                      path=${path}
                      rotate="auto"
                      repeatCount="indefinite"
                    ></animateMotion>
                  `
                  : null}
              </circle>
            </mask>
          </defs>
          ${svg`
            <polygon
              points=${`2.5,2.5 ${width - 2.5},2.5 ${width - 2.5},${height - 2.5} 2.5,${height - 2.5}`}
              fill="transparent"
              stroke=${primary}
              stroke-width="1"
            ></polygon>
            <use
              href=${`#${this.pathId}`}
              fill="none"
              stroke=${secondary}
              stroke-width="3"
              stroke-dasharray=${`10, ${length}`}
            ></use>
            <use
              href=${`#${this.pathId}`}
              fill="none"
              stroke=${`url(#${this.gradientId})`}
              stroke-width="1"
              mask=${`url(#${this.maskId})`}
            ></use>
          `}
        </svg>
      </div>
      <div part="content" class="content">
        <slot></slot>
      </div>
    `
  }

  private createPath(width: number, height: number): string {
    if (this.reverse)
      return `M 2.5, 2.5 L 2.5, ${height - 2.5} L ${width - 2.5}, ${height - 2.5} L ${width - 2.5}, 2.5 L 2.5, 2.5`

    return `M 2.5, 2.5 L ${width - 2.5}, 2.5 L ${width - 2.5}, ${height - 2.5} L 2.5, ${height - 2.5} L 2.5, 2.5`
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#235fa7',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#4fd2dd',
    })

    return [primary, secondary]
  }
}
