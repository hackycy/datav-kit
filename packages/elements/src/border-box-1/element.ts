import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

let borderBox1Id = 0

interface BorderBoxSize {
  width: number
  height: number
}

const defaultSize: BorderBoxSize = {
  width: 0,
  height: 0,
}

export class BorderBox1Element extends DatavElement {
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

  private readonly pathId = `dv-border-box-1-path-${++borderBox1Id}`
  private readonly gradientId = `dv-border-box-1-gradient-${borderBox1Id}`
  private readonly maskId = `dv-border-box-1-mask-${borderBox1Id}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-1' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const path = this.createPath(width, height)
    const duration = Math.max(resolveNumberValue(this.duration, 3), 0.1)
    const showAnimation = this.animated && !this.paused

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" width=${String(width)} height=${String(height)} aria-hidden="true">
          <defs>
            <path id=${this.pathId} d=${path} fill="transparent"></path>
            <radialGradient id=${this.gradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fff" stop-opacity="1"></stop>
              <stop offset="100%" stop-color="#fff" stop-opacity="0"></stop>
            </radialGradient>
            <mask id=${this.maskId}>
              <circle cx="0" cy="0" r="150" fill=${`url(#${this.gradientId})`}>
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
            <use
              href=${`#${this.pathId}`}
              stroke=${primary}
              stroke-width="1"
            ></use>
            <use
              href=${`#${this.pathId}`}
              stroke=${secondary}
              stroke-width="3"
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
