import { DatavElement, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

const baseSize = 52
const barWidth = 6
const barGap = 4
const barHeight = 39
const viewBoxWidth = 46
const centerY = barHeight / 2
const minScale = 0.24
const restScales = [0.28, 0.48, 0.72, 0.48, 0.28]
const phaseOffsets = [0.6, 0.8, 0, 0.8, 0.6]

export class LoadingPulseElement extends DatavElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, #18f0ff);
      box-sizing: border-box;
    }

    .loading-pulse {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--dvk-loading-pulse-gap, 8px);
      min-width: 0;
      min-height: 0;
      color: inherit;
    }

    svg {
      display: block;
      width: var(--dvk-loading-pulse-size, 52px);
      height: auto;
      overflow: visible;
    }

    .tip {
      color: var(--dvk-loading-pulse-tip-color, #d8f6ff);
      font-size: var(--dvk-loading-pulse-tip-font-size, 12px);
      line-height: var(--dvk-loading-pulse-tip-line-height, 1.4);
      letter-spacing: var(--dvk-loading-pulse-tip-letter-spacing, 0.16em);
      text-transform: uppercase;
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

  @property({ type: Number })
  dur = 1.05

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
    this.emit('dvk-ready', { tagName: 'dvk-loading-pulse' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const size = Math.max(resolveNumberValue(this.size, baseSize), 1)
    const duration = Math.max(resolveNumberValue(this.dur, 1.05), 0.1)
    const showAnimation = this.animated && !this.paused && !this.prefersReducedMotion()

    return html`
      <div part="root" class="loading-pulse" style=${`--dvk-loading-pulse-size: ${size}px`}>
        <svg
          part="graphic"
          width=${String(size)}
          height=${formatNumber(size * barHeight / viewBoxWidth)}
          viewBox=${`0 0 ${viewBoxWidth} ${barHeight}`}
          aria-hidden="true"
        >
          ${restScales.map((restScale, index) => this.renderBar({
            x: index * (barWidth + barGap),
            primary,
            secondary,
            duration,
            restScale,
            begin: duration * (phaseOffsets[index] ?? 0),
            showAnimation,
          }))}
        </svg>
        <div part="tip" class="tip">
          <slot></slot>
        </div>
      </div>
    `
  }

  private renderBar(options: {
    x: number
    primary: string
    secondary: string
    duration: number
    restScale: number
    begin: number
    showAnimation: boolean
  }): unknown {
    const begin = `${formatNumber(options.begin)}s`

    return svg`
      <g part="bar" transform=${`translate(0 ${centerY})`}>
        <rect
          part="bar-track"
          x=${String(options.x)}
          y=${String(-centerY)}
          width=${String(barWidth)}
          height=${String(barHeight)}
          fill=${withAlpha(options.secondary, 0.16)}
        ></rect>
        <rect
          part="bar-fill"
          x=${String(options.x)}
          y=${String(-centerY)}
          width=${String(barWidth)}
          height=${String(barHeight)}
          fill=${options.primary}
          opacity="0.9"
          transform=${`scale(1 ${options.restScale})`}
        >
          ${options.showAnimation
            ? svg`
              <animateTransform
                attributeName="transform"
                type="scale"
                values=${`1 ${minScale};1 1;1 ${minScale}`}
                keyTimes="0;0.5;1"
                calcMode="spline"
                keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                dur=${`${options.duration}s`}
                begin=${begin}
                repeatCount="indefinite"
              ></animateTransform>
              <animate
                attributeName="opacity"
                values="0.48;0.8;1;0.8;0.48"
                keyTimes="0;0.35;0.5;0.65;1"
                dur=${`${options.duration}s`}
                begin=${begin}
                repeatCount="indefinite"
              ></animate>
            `
            : null}
        </rect>
      </g>
    `
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#18f0ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#2b7cff',
    })

    return [primary, secondary]
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
}

function withAlpha(color: string, alpha: number): string {
  const clampedAlpha = Math.min(Math.max(alpha, 0), 1)
  const hex = color.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)

  if (hex) {
    const value = hex[1].length === 3
      ? hex[1].split('').map(part => part + part).join('')
      : hex[1]
    const red = Number.parseInt(value.slice(0, 2), 16)
    const green = Number.parseInt(value.slice(2, 4), 16)
    const blue = Number.parseInt(value.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`
  }

  const rgba = color.trim().match(/^rgba?\((.+)\)$/i)

  if (rgba) {
    const parts = rgba[1].split(',').map(part => part.trim())

    if (parts.length >= 3)
      return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return color
}

function formatNumber(value: number): string {
  return Number(value.toFixed(3)).toString()
}
