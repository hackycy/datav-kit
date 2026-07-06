import { DatavElement, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

const baseSize = 72
const defaultStrokeWidth = 2

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
      color: var(--dvk-color-primary, #18f0ff);
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
      color: var(--dvk-loading-energy-tip-color, currentColor);
      font-size: var(--dvk-loading-energy-tip-font-size, 15px);
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
            <radialGradient id="dvk-loading-energy-glow" cx="50%" cy="50%" r="52%">
              <stop offset="0%" stop-color=${withAlpha(primary, 0.28)}></stop>
              <stop offset="58%" stop-color=${withAlpha(secondary, 0.1)}></stop>
              <stop offset="100%" stop-color=${withAlpha(primary, 0)}></stop>
            </radialGradient>
            <linearGradient id="dvk-loading-energy-shell" x1="12" y1="12" x2="60" y2="60">
              <stop offset="0%" stop-color=${withAlpha(secondary, 0.08)}></stop>
              <stop offset="50%" stop-color=${withAlpha(primary, 0.12)}></stop>
              <stop offset="100%" stop-color=${withAlpha(secondary, 0.08)}></stop>
            </linearGradient>
            <linearGradient id="dvk-loading-energy-cell" x1="30" y1="20" x2="42" y2="52">
              <stop offset="0%" stop-color=${withAlpha(primary, 0.16)}></stop>
              <stop offset="50%" stop-color=${withAlpha(secondary, 0.22)}></stop>
              <stop offset="100%" stop-color=${withAlpha(primary, 0.16)}></stop>
            </linearGradient>
            <linearGradient id="dvk-loading-energy-scan" x1="0" y1="0" x2="0" y2="8">
              <stop offset="0%" stop-color=${withAlpha(primary, 0)}></stop>
              <stop offset="50%" stop-color=${withAlpha(primary, 0.64)}></stop>
              <stop offset="100%" stop-color=${withAlpha(primary, 0)}></stop>
            </linearGradient>
            <linearGradient id="dvk-loading-energy-flow" x1="36" y1="50" x2="36" y2="22">
              <stop offset="0%" stop-color=${withAlpha(primary, 0.18)}></stop>
              <stop offset="50%" stop-color=${withAlpha(primary, 0.78)}></stop>
              <stop offset="100%" stop-color=${withAlpha(secondary, 0.36)}></stop>
            </linearGradient>
            <clipPath id="dvk-loading-energy-cell-clip">
              <rect x="31" y="21" width="10" height="30" rx="2"></rect>
            </clipPath>
          </defs>

          <circle part="aura" cx="36" cy="36" r="30" fill="url(#dvk-loading-energy-glow)" opacity="0.5"></circle>

          <path
            part="frame"
            d="M22 10 H50 M62 22 V50 M50 62 H22 M10 50 V22"
            fill="transparent"
            stroke=${withAlpha(secondary, 0.48)}
            stroke-width=${formatNumber(strokeWidth * 0.75)}
            stroke-linecap="round"
          ></path>

          <path
            part="module-shell"
            d="M22 13 H50 L59 22 V50 L50 59 H22 L13 50 V22 Z"
            fill="url(#dvk-loading-energy-shell)"
            stroke=${withAlpha(secondary, 0.58)}
            stroke-width=${formatNumber(strokeWidth * 0.65)}
          ></path>

          <path
            part="bus-line"
            d="M18 36 H29 M43 36 H54 M36 18 V29 M36 43 V54"
            fill="transparent"
            stroke=${withAlpha(secondary, 0.5)}
            stroke-width=${formatNumber(strokeWidth * 0.45)}
            stroke-linecap="round"
          ></path>

          <path
            part="bus-flow"
            d="M18 36 H29 M54 36 H43 M36 18 V29 M36 54 V43"
            fill="transparent"
            stroke=${primary}
            stroke-width=${formatNumber(strokeWidth * 0.52)}
            stroke-dasharray="3 5"
            stroke-dashoffset="0"
            stroke-linecap="round"
            opacity="0.78"
          >
            ${showAnimation
              ? svg`
                <animate
                  attributeName="stroke-dashoffset"
                  values="8;0"
                  dur=${`${duration * 0.9}s`}
                  repeatCount="indefinite"
                ></animate>
              `
              : null}
          </path>

          <rect
            part="energy-cell"
            x="30"
            y="20"
            width="12"
            height="32"
            rx="2.5"
            fill="url(#dvk-loading-energy-cell)"
            stroke=${primary}
            stroke-width=${formatNumber(strokeWidth)}
          ></rect>

          <rect
            part="energy-fill"
            x="32"
            y="22"
            width="8"
            height="28"
            rx="1.8"
            fill=${withAlpha(primary, 0.18)}
          ></rect>

          <g part="energy-flow" clip-path="url(#dvk-loading-energy-cell-clip)">
            <rect x="33" y="46" width="6" height="10" rx="1.5" fill="url(#dvk-loading-energy-flow)"></rect>
            <rect x="33" y="30" width="6" height="10" rx="1.5" fill="url(#dvk-loading-energy-flow)"></rect>
            <rect x="33" y="14" width="6" height="10" rx="1.5" fill="url(#dvk-loading-energy-flow)"></rect>
            ${showAnimation
              ? svg`
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0;0 -16"
                  dur=${`${duration}s`}
                  repeatCount="indefinite"
                ></animateTransform>
              `
              : null}
          </g>

          <rect part="scan-line" x="31" y="21" width="10" height="6" rx="1.4" fill="url(#dvk-loading-energy-scan)" opacity="0.5">
            ${showAnimation
              ? svg`
                <animate
                  attributeName="y"
                  values="21;45;21"
                  dur=${`${duration * 1.25}s`}
                  repeatCount="indefinite"
                ></animate>
              `
              : null}
          </rect>

          ${this.renderChargeSegment('left', 0, 18, 31, 2, 10, primary, duration, showAnimation)}
          ${this.renderChargeSegment('right', 0, 52, 31, 2, 10, secondary, duration, showAnimation)}
          ${this.renderChargeSegment('top', 0, 31, 18, 10, 2, secondary, duration, showAnimation)}
          ${this.renderChargeSegment('bottom', 0, 31, 52, 10, 2, primary, duration, showAnimation)}

          <rect part="core" x="33" y="33" width="6" height="6" rx="1.5" fill=${primary} opacity="0.88">
            ${showAnimation
              ? svg`
                <animate
                  attributeName="y"
                  values="26;40;26"
                  dur=${`${duration * 1.15}s`}
                  repeatCount="indefinite"
                ></animate>
              `
              : null}
          </rect>
        </svg>
        <div part="tip" class="tip">
          <slot></slot>
        </div>
      </div>
    `
  }

  private renderChargeSegment(
    side: 'left' | 'right' | 'top' | 'bottom',
    index: number,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    duration: number,
    showAnimation: boolean,
  ): unknown {
    const direction = {
      left: '0 0;5 0;0 0',
      right: '0 0;-5 0;0 0',
      top: '0 0;0 5;0 0',
      bottom: '0 0;0 -5;0 0',
    }[side]

    return svg`
      <rect
        part=${`charge-segment charge-${side}`}
        x=${String(x)}
        y=${String(y)}
        width=${String(width)}
        height=${String(height)}
        rx="0.8"
        fill=${color}
        opacity=${String(0.38 + index * 0.08)}
      >
        ${showAnimation
          ? svg`
            <animateTransform
              attributeName="transform"
              type="translate"
              values=${direction}
              dur=${`${duration * 1.1}s`}
              begin=${`${index * 0.16}s`}
              repeatCount="indefinite"
            ></animateTransform>
          `
          : null}
      </rect>
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
