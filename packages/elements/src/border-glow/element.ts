import { DatavElement, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

let borderGlowId = 0

export class BorderGlowElement extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #18f0ff);
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

    .animated {
      animation: dv-border-glow-flow var(--dv-border-duration, 2400ms) linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .animated {
        animation: none;
      }
    }

    @keyframes dv-border-glow-flow {
      from {
        stroke-dashoffset: 0;
      }

      to {
        stroke-dashoffset: -240;
      }
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Number })
  intensity = 0.8

  @property({ type: Number })
  radius = 16

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @property({ type: Number })
  duration = 2400

  private readonly gradientId = `dv-border-glow-gradient-${++borderGlowId}`
  private readonly glowId = `dv-border-glow-filter-${borderGlowId}`

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-glow' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const intensity = Math.max(0, Math.min(resolveNumberValue(this.intensity, 0.8), 1))
    const radius = Math.max(resolveNumberValue(this.radius, 16), 0)
    const duration = Math.max(resolveNumberValue(this.duration, 2400), 1)
    const strokeOpacity = 0.38 + intensity * 0.58
    const glowDeviation = 2 + intensity * 5
    const animationClass = this.animated && !this.paused ? 'animated' : ''

    return html`
      <div part="frame" class="frame" style=${`--dv-border-duration: ${duration}ms`}>
        <svg part="graphic" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id=${this.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color=${primary} stop-opacity="0.18"></stop>
              <stop offset="38%" stop-color=${primary}></stop>
              <stop offset="70%" stop-color=${secondary}></stop>
              <stop offset="100%" stop-color=${primary} stop-opacity="0.28"></stop>
            </linearGradient>
            <filter id=${this.glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation=${String(glowDeviation)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          ${svg`
            <rect
              x="1.5"
              y="1.5"
              width="97"
              height="97"
              rx=${String(radius / 2)}
              ry=${String(radius / 2)}
              fill="rgba(4, 15, 28, 0.10)"
              stroke=${`url(#${this.gradientId})`}
              stroke-width="0.7"
              opacity=${String(strokeOpacity)}
              filter=${`url(#${this.glowId})`}
            ></rect>
            <rect
              class=${animationClass}
              x="3.5"
              y="3.5"
              width="93"
              height="93"
              rx=${String(Math.max(radius / 2 - 1, 0))}
              ry=${String(Math.max(radius / 2 - 1, 0))}
              fill="none"
              stroke=${`url(#${this.gradientId})`}
              stroke-width="0.35"
              stroke-dasharray="18 10 4 10"
              opacity=${String(0.54 + intensity * 0.36)}
            ></rect>
            <path
              d="M 6 18 L 6 6 L 20 6 M 80 6 L 94 6 L 94 18 M 94 82 L 94 94 L 80 94 M 20 94 L 6 94 L 6 82"
              fill="none"
              stroke=${secondary}
              stroke-width="0.8"
              stroke-linecap="round"
              opacity=${String(0.48 + intensity * 0.36)}
            ></path>
          `}
        </svg>
      </div>
      <div part="content" class="content">
        <slot></slot>
      </div>
    `
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#18f0ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#2b7cff',
    })

    return [primary, secondary]
  }
}
