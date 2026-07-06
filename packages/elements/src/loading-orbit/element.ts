import { DatavElement, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

const baseSize = 50
const defaultStrokeWidth = 3

export class LoadingOrbitElement extends DatavElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, #02bcfe);
      box-sizing: border-box;
    }

    .loading-orbit {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--dvk-loading-orbit-gap, 8px);
      min-width: 0;
      min-height: 0;
      color: inherit;
    }

    svg {
      display: block;
      width: var(--dvk-loading-orbit-size, 50px);
      height: var(--dvk-loading-orbit-size, 50px);
      overflow: visible;
    }

    .tip {
      color: var(--dvk-loading-orbit-tip-color, currentColor);
      font-size: var(--dvk-loading-orbit-tip-font-size, 15px);
      line-height: var(--dvk-loading-orbit-tip-line-height, 1.4);
      text-align: center;
      white-space: normal;
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Number })
  size = baseSize

  @property({ type: Number, attribute: 'stroke-width' })
  strokeWidth = defaultStrokeWidth

  @property({ type: Number })
  dur = 1.5

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  override connectedCallback(): void {
    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'status')

    if (!this.hasAttribute('aria-live'))
      this.setAttribute('aria-live', 'polite')

    super.connectedCallback()
  }

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-loading-orbit' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const size = Math.max(resolveNumberValue(this.size, baseSize), 1)
    const strokeWidth = Math.max(resolveNumberValue(this.strokeWidth, defaultStrokeWidth), 0.1)
    const duration = Math.max(resolveNumberValue(this.dur, 1.5), 0.1)
    const showAnimation = this.animated && !this.paused && !this.prefersReducedMotion()

    return html`
      <div part="root" class="loading-orbit" style=${`--dvk-loading-orbit-size: ${size}px`}>
        <svg
          part="graphic"
          width=${String(size)}
          height=${String(size)}
          viewBox="0 0 50 50"
          aria-hidden="true"
        >
          ${this.renderCircle({
            radius: 20,
            color: primary,
            alternateColor: secondary,
            strokeWidth,
            duration,
            reverse: false,
            showAnimation,
          })}
          ${this.renderCircle({
            radius: 10,
            color: secondary,
            alternateColor: primary,
            strokeWidth,
            duration,
            reverse: true,
            showAnimation,
          })}
        </svg>
        <div part="tip" class="tip">
          <slot></slot>
        </div>
      </div>
    `
  }

  private renderCircle(options: {
    radius: number
    color: string
    alternateColor: string
    strokeWidth: number
    duration: number
    reverse: boolean
    showAnimation: boolean
  }): unknown {
    const dash = options.reverse ? '15.7' : '31.415'
    const values = options.reverse ? '360, 25 25;0, 25 25' : '0, 25 25;360, 25 25'

    return svg`
      <circle
        part=${options.reverse ? 'ring inner-ring' : 'ring outer-ring'}
        cx="25"
        cy="25"
        r=${String(options.radius)}
        fill="transparent"
        stroke=${options.color}
        stroke-width=${String(options.strokeWidth)}
        stroke-dasharray=${`${dash}, ${dash}`}
        stroke-linecap="round"
      >
        ${options.showAnimation
          ? svg`
            <animateTransform
              attributeName="transform"
              type="rotate"
              values=${values}
              dur=${`${options.duration}s`}
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="stroke"
              values=${`${options.color};${options.alternateColor};${options.color}`}
              dur=${`${options.duration * 2}s`}
              repeatCount="indefinite"
            ></animate>
          `
          : null}
      </circle>
    `
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#02bcfe',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#3be6cb',
    })

    return [primary, secondary]
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}
