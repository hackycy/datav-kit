import { DatavElement, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

const baseSize = 72
const defaultStrokeWidth = 2
const laneWidth = 38
const laneActiveWidth = 14

export class LoadingEnergyElement extends DatavElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, #1677ff);
      box-sizing: border-box;
    }

    .loading-energy {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--dvk-loading-energy-gap, 8px);
      min-width: 0;
      min-height: 0;
      color: inherit;
    }

    svg {
      display: block;
      width: var(--dvk-loading-energy-size, 72px);
      height: var(--dvk-loading-energy-size, 72px);
      overflow: visible;
    }

    .tip {
      color: var(--dvk-loading-energy-tip-color, #64748b);
      font-size: var(--dvk-loading-energy-tip-font-size, 14px);
      line-height: var(--dvk-loading-energy-tip-line-height, 1.4);
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
  dur = 1.9

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
    this.emit('dvk-ready', { tagName: 'dvk-loading-energy' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const size = Math.max(resolveNumberValue(this.size, baseSize), 1)
    const strokeWidth = Math.max(resolveNumberValue(this.strokeWidth, defaultStrokeWidth), 0.1)
    const duration = Math.max(resolveNumberValue(this.dur, 1.9), 0.1)
    const showAnimation = this.animated && !this.paused && !this.prefersReducedMotion()

    return html`
      <div part="root" class="loading-energy" style=${`--dvk-loading-energy-size: ${size}px`}>
        <svg
          part="graphic"
          width=${String(size)}
          height=${String(size)}
          viewBox="0 0 72 72"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dvk-loading-energy-panel" x1="10" y1="14" x2="62" y2="58">
              <stop offset="0%" stop-color=${withAlpha(primary, 0.1)}></stop>
              <stop offset="46%" stop-color=${withAlpha(secondary, 0.08)}></stop>
              <stop offset="100%" stop-color=${withAlpha(secondary, 0.03)}></stop>
            </linearGradient>
            <linearGradient id="dvk-loading-energy-lane-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color=${withAlpha(primary, 0)}></stop>
              <stop offset="50%" stop-color=${withAlpha(primary, 0.68)}></stop>
              <stop offset="100%" stop-color=${withAlpha(primary, 0)}></stop>
            </linearGradient>
          </defs>

          <rect
            part="panel"
            x="10"
            y="14"
            width="52"
            height="44"
            rx="6"
            fill="url(#dvk-loading-energy-panel)"
          ></rect>
          <rect
            part="frame"
            x="10"
            y="14"
            width="52"
            height="44"
            rx="6"
            fill="transparent"
            stroke=${withAlpha(secondary, 0.38)}
            stroke-width=${formatNumber(strokeWidth * 0.7)}
          ></rect>
          <path
            part="header-line"
            d="M18 24 H40"
            fill="transparent"
            stroke=${withAlpha(secondary, 0.38)}
            stroke-width=${formatNumber(strokeWidth * 0.55)}
            stroke-linecap="round"
          ></path>
          <path
            part="divider"
            d="M16 30.5 H56"
            fill="transparent"
            stroke=${withAlpha(secondary, 0.18)}
            stroke-width=${formatNumber(strokeWidth * 0.45)}
            stroke-linecap="round"
          ></path>
          <circle part="status-dot" cx="53" cy="24" r="2.3" fill=${primary} opacity="0.86">
            ${showAnimation
              ? svg`
                <animate
                  attributeName="opacity"
                  values="0.38;0.94;0.38"
                  dur=${`${duration * 1.3}s`}
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="r"
                  values="2.1;2.8;2.1"
                  dur=${`${duration * 1.3}s`}
                  repeatCount="indefinite"
                ></animate>
              `
              : null}
          </circle>

          ${this.renderDataLane(0, 36, primary, secondary, duration, showAnimation)}
          ${this.renderDataLane(1, 44, primary, secondary, duration, showAnimation)}
          ${this.renderDataLane(2, 52, primary, secondary, duration, showAnimation)}
        </svg>
        <div part="tip" class="tip">
          <slot></slot>
        </div>
      </div>
    `
  }

  private renderDataLane(
    index: number,
    y: number,
    primary: string,
    secondary: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    const activeStart = 18
    const activeEnd = activeStart + laneWidth - laneActiveWidth

    return svg`
      <g part="data-lane">
        <rect part="lane-marker" x="14" y=${String(y - 1)} width="2.6" height="2.6" rx="0.8" fill=${withAlpha(primary, 0.46)}></rect>
        <rect
          part="lane-track"
          x="18"
          y=${String(y - 2)}
          width=${String(laneWidth)}
          height="4"
          rx="2"
          fill=${withAlpha(secondary, 0.16)}
        ></rect>
        <rect
          part="lane-progress"
          x=${String(activeStart)}
          y=${String(y - 2)}
          width=${String(laneActiveWidth)}
          height="4"
          rx="2"
          fill="url(#dvk-loading-energy-lane-flow)"
          opacity="0.88"
        >
          ${showAnimation
            ? svg`
              <animate
                attributeName="x"
                values=${`${activeStart};${activeEnd};${activeStart}`}
                dur=${`${duration * 1.25}s`}
                begin=${`${index * 0.22}s`}
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
      fallback: '#1677ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#8a99ad',
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
