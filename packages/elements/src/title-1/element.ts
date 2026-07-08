import { DatavElement, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

type Title1Side = 'left' | 'right'

let title1Id = 0

export class Title1Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-color-primary, #57f3ff);
    }

    svg {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    path,
    polygon,
    rect {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      display: grid;
      place-items: center;
      width: min(34%, var(--dvk-title-1-title-width, 410px));
      min-width: var(--dvk-title-1-title-min-width, 220px);
      height: var(--dvk-title-1-title-height, 56%);
      min-height: 0;
      color: var(--dvk-title-1-title-color, #effcff);
      font: var(--dvk-title-1-title-font, 700 22px/1.2 system-ui, sans-serif);
      letter-spacing: var(--dvk-title-1-title-letter-spacing, 0.04em);
      text-align: center;
      text-shadow: 0 0 10px var(--dvk-title-1-title-glow, rgba(87, 243, 255, 0.32));
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    slot::slotted(*) {
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-align: inherit;
      text-shadow: inherit;
    }
  `

  @property()
  color: string | readonly string[] = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'accent-color' })
  accentColor = ''

  @property()
  colors = ''

  @property({ attribute: 'title-text' })
  titleText = ''

  private readonly instanceId = ++title1Id
  private readonly centerSurfaceGradientId = `dvk-title-1-center-surface-${this.instanceId}`
  private readonly sideSurfaceGradientId = `dvk-title-1-side-surface-${this.instanceId}`
  private readonly railGradientId = `dvk-title-1-rail-${this.instanceId}`
  private readonly accentGradientId = `dvk-title-1-accent-${this.instanceId}`

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-title-1' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()

    return html`
      <svg
        part="graphic"
        viewBox="0 0 1200 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent)}</defs>

        <rect part="ambient-glow" x="42" y="13" width="1116" height="46" rx="5" fill=${withAlpha(secondary, 0.04)}></rect>
        ${this.renderSide('left')}
        ${this.renderSide('right')}
        ${this.renderCenter(accent)}
      </svg>
      <div part="content title" class="content">
        ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
      </div>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <linearGradient id=${this.centerSurfaceGradientId} x1="380" y1="0" x2="820" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(secondary, 0.08)}></stop>
        <stop offset="18%" stop-color=${withAlpha(primary, 0.14)}></stop>
        <stop offset="50%" stop-color=${withAlpha(primary, 0.055)}></stop>
        <stop offset="82%" stop-color=${withAlpha(primary, 0.14)}></stop>
        <stop offset="100%" stop-color=${withAlpha(secondary, 0.08)}></stop>
      </linearGradient>

      <linearGradient id=${this.sideSurfaceGradientId} x1="0" y1="0" x2="460" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(secondary, 0.015)}></stop>
        <stop offset="70%" stop-color=${withAlpha(secondary, 0.075)}></stop>
        <stop offset="100%" stop-color=${withAlpha(primary, 0.13)}></stop>
      </linearGradient>

      <linearGradient id=${this.railGradientId} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(secondary, 0.02)}></stop>
        <stop offset="30%" stop-color=${secondary} stop-opacity="0.42"></stop>
        <stop offset="50%" stop-color=${primary} stop-opacity="0.7"></stop>
        <stop offset="70%" stop-color=${secondary} stop-opacity="0.42"></stop>
        <stop offset="100%" stop-color=${withAlpha(secondary, 0.02)}></stop>
      </linearGradient>

      <linearGradient id=${this.accentGradientId} x1="500" y1="0" x2="700" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(accent, 0)}></stop>
        <stop offset="50%" stop-color=${accent} stop-opacity="0.58"></stop>
        <stop offset="100%" stop-color=${withAlpha(accent, 0)}></stop>
      </linearGradient>
    `
  }

  private renderSide(side: Title1Side): unknown {
    const transform = side === 'right' ? 'translate(1200 0) scale(-1 1)' : undefined

    return svg`
      <g part=${`side ${side}-side`} transform=${transform ?? ''}>
        <polygon
          part="side-surface"
          points="0,13 306,13 370,36 306,59 0,59"
          fill=${`url(#${this.sideSurfaceGradientId})`}
        ></polygon>
        <path
          part="rail main-rail"
          d="M 28 17 H 286 L 340 36"
          fill="none"
          stroke=${`url(#${this.railGradientId})`}
          stroke-width="1.05"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          part="rail quiet-rail"
          d="M 28 55 H 286 L 340 36"
          fill="none"
          stroke=${`url(#${this.railGradientId})`}
          stroke-width="0.48"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity="0.5"
        ></path>
        <polygon part="surface-accent" points="118,29 252,29 276,36 252,43 118,43" fill=${`url(#${this.accentGradientId})`} opacity="0.48"></polygon>
      </g>
    `
  }

  private renderCenter(accent: string): unknown {
    return svg`
      <g part="center-panel">
        <polygon
          part="title-panel"
          points="286,36 340,13 860,13 914,36 860,59 340,59"
          fill=${`url(#${this.centerSurfaceGradientId})`}
        ></polygon>
        <path
          part="center-edge"
          d="M 360 17 H 840 M 360 55 H 840"
          fill="none"
          stroke=${`url(#${this.railGradientId})`}
          stroke-width="0.72"
          stroke-linecap="round"
          stroke-opacity="0.62"
        ></path>
        <rect part="accent-core" x="510" y="12" width="180" height="4" fill=${`url(#${this.accentGradientId})`}></rect>
        <polygon part="center-notch" points="572,59 628,59 614,64 586,64" fill=${withAlpha(accent, 0.18)}></polygon>
      </g>
    `
  }

  private resolveColors(): [string, string, string] {
    const colorList = this.resolveColorList()
    const explicitPrimary = typeof this.color === 'string' && !isJsonArrayString(this.color)
      ? this.color
      : ''
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#57f3ff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#2f8cff',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-1-accent',
      host: this,
      fallback: '#8cecff',
    })

    return [primary, secondary, accent]
  }

  private resolveColorList(): string[] {
    const colors = splitColors(this.colors)

    if (colors.length > 0)
      return colors

    if (Array.isArray(this.color))
      return this.color.map(color => String(color).trim()).filter(Boolean)

    if (typeof this.color === 'string' && isJsonArrayString(this.color)) {
      try {
        const parsed = JSON.parse(this.color)

        if (Array.isArray(parsed))
          return parsed.map(color => String(color).trim()).filter(Boolean)
      }
      catch {
        return []
      }
    }

    return []
  }
}

function splitColors(value: string): string[] {
  return value.split(',').map(color => color.trim()).filter(Boolean)
}

function isJsonArrayString(value: string): boolean {
  return value.trim().startsWith('[')
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
    const parts = rgb[1].split(',').map(part => part.trim()).filter(Boolean)
    if (parts.length >= 3)
      return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return trimmed
}
