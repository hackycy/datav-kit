import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox10Size {
  width: number
  height: number
}

const defaultSize: BorderBox10Size = {
  width: 0,
  height: 0,
}
const frameInset = 5
const cornerRadius = 10
const contentSafeInset = 15
let borderBox10Id = 0

export class BorderBox10Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #2e6099);
      overflow: hidden;
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    svg {
      display: block;
      overflow: visible;
    }

    .panel {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    path {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dv-border-box-10-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    @media (prefers-reduced-motion: reduce) {
      animate {
        display: none;
      }
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'background-color' })
  backgroundColor = ''

  @property()
  colors = ''

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly instanceId = ++borderBox10Id
  private readonly glowFilterId = `dv-border-box-10-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-10' })
  }

  override render(): unknown {
    const [primary, secondary, background] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: width,
      hostHeight: height,
      viewBox: {
        x: 0,
        y: 0,
        width,
        height,
      },
      contentRect: {
        x: contentSafeInset,
        y: contentSafeInset,
        width: Math.max(width - contentSafeInset * 2, 0),
        height: Math.max(height - contentSafeInset * 2, 0),
      },
      minBlock: 10,
      minInline: 10,
    })

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} aria-hidden="true">
          <defs>${this.renderGlowFilter(secondary)}</defs>
          <path
            class="outline"
            fill=${background}
            stroke=${primary}
            stroke-width="2"
            d=${this.createPanelPath(width, height)}
          ></path>
          ${this.renderCornerGlows(width, height, secondary)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderGlowFilter(secondary: string): unknown {
    const high = withAlpha(secondary, 0.7)
    const low = withAlpha(secondary, 0.3)

    return svg`
      <filter id=${this.glowFilterId} height="150%" width="150%" x="-25%" y="-25%" color-interpolation-filters="sRGB">
        <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken"></feMorphology>
        <feGaussianBlur in="thicken" stdDeviation="2" result="blurred"></feGaussianBlur>
        <feFlood flood-color=${high} result="glowColor">
          ${this.animated && !this.paused
            ? svg`<animate attributeName="flood-color" values=${`${high};${low};${high}`} dur="3s" begin="0s" repeatCount="indefinite"></animate>`
            : null}
        </feFlood>
        <feComposite in="glowColor" in2="blurred" operator="in" result="softGlowColored"></feComposite>
        <feMerge>
          <feMergeNode in="softGlowColored"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderCornerGlows(width: number, height: number, secondary: string): unknown {
    return svg`
      <path
        data-corner="left-top"
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        filter=${`url(#${this.glowFilterId})`}
        stroke=${secondary}
        d="M 20 5 L 15 5 Q 5 5 5 15 L 5 20"
      ></path>
      <path
        data-corner="right-top"
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        filter=${`url(#${this.glowFilterId})`}
        stroke=${secondary}
        d=${`M ${width - 20} 5 L ${width - 15} 5 Q ${width - 5} 5 ${width - 5} 15 L ${width - 5} 20`}
      ></path>
      <path
        data-corner="right-bottom"
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        filter=${`url(#${this.glowFilterId})`}
        stroke=${secondary}
        d=${`M ${width - 20} ${height - 5} L ${width - 15} ${height - 5} Q ${width - 5} ${height - 5} ${width - 5} ${height - 15} L ${width - 5} ${height - 20}`}
      ></path>
      <path
        data-corner="left-bottom"
        stroke-width="2"
        fill="transparent"
        stroke-linecap="round"
        filter=${`url(#${this.glowFilterId})`}
        stroke=${secondary}
        d=${`M 20 ${height - 5} L 15 ${height - 5} Q 5 ${height - 5} 5 ${height - 15} L 5 ${height - 20}`}
      ></path>
    `
  }

  private createPanelPath(width: number, height: number): string {
    const inset = Math.min(frameInset, width / 2, height / 2)
    const left = inset
    const top = inset
    const right = width - inset
    const bottom = height - inset
    const radius = Math.min(cornerRadius, Math.max(right - left, 0) / 2, Math.max(bottom - top, 0) / 2)

    return [
      `M${left + radius} ${top}`,
      `L ${right - radius} ${top}`,
      `Q ${right} ${top}, ${right} ${top + radius}`,
      `L ${right} ${bottom - radius}`,
      `Q ${right} ${bottom}, ${right - radius} ${bottom}`,
      `L ${left + radius} ${bottom}`,
      `Q ${left} ${bottom}, ${left} ${bottom - radius}`,
      `L ${left} ${top + radius}`,
      `Q ${left} ${top}, ${left + radius} ${top}`,
    ].join(' ')
  }

  private resolveColors(): [string, string, string] {
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
    const background = resolveThemeValue({
      explicit: this.backgroundColor,
      cssVariable: '--dv-border-box-10-background',
      host: this,
      fallback: 'transparent',
    })

    return [primary, secondary, background]
  }
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
    const parts = rgb[1].split(',').map(part => part.trim())

    return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return trimmed
}
