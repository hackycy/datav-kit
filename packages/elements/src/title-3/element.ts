import { DatavElement, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

let title3Id = 0

export class Title3Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-title-3-title-color, #f6fffb);
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
    ellipse,
    circle,
    line {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: absolute;
      top: var(--dvk-title-3-title-top, 50%);
      left: 50%;
      z-index: 1;
      display: grid;
      place-items: center;
      width: min(38%, var(--dvk-title-3-title-width, 520px));
      min-width: var(--dvk-title-3-title-min-width, 240px);
      height: var(--dvk-title-3-title-height, 46%);
      min-height: 0;
      color: var(--dvk-title-3-title-color, #f6fffb);
      font: var(--dvk-title-3-title-font, 700 23px/1.08 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      letter-spacing: var(--dvk-title-3-title-letter-spacing, 0.14em);
      text-align: center;
      text-shadow:
        0 0 8px var(--dvk-title-3-title-glow, rgba(57, 246, 200, 0.45)),
        0 0 16px var(--dvk-title-3-title-accent-glow, rgba(255, 123, 213, 0.2));
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

  private readonly instanceId = ++title3Id
  private readonly haloGradientId = `dvk-title-3-halo-${this.instanceId}`
  private readonly lensGradientId = `dvk-title-3-lens-${this.instanceId}`
  private readonly railGradientId = `dvk-title-3-rail-${this.instanceId}`
  private readonly baseGradientId = `dvk-title-3-base-${this.instanceId}`
  private readonly accentGradientId = `dvk-title-3-accent-${this.instanceId}`
  private readonly beadGradientId = `dvk-title-3-bead-${this.instanceId}`
  private readonly softGlowId = `dvk-title-3-soft-glow-${this.instanceId}`

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-title-3' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()

    return html`
      <svg
        part="graphic"
        viewBox="0 0 1200 96"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent)}</defs>

        <path
          part="aurora-halo"
          d="M 188 70 C 332 7 868 7 1012 70 C 842 47 358 47 188 70 Z"
          fill=${`url(#${this.haloGradientId})`}
        ></path>
        <ellipse part="lens-glow" cx="600" cy="50" rx="282" ry="36" fill=${withAlpha(primary, 0.08)} filter=${`url(#${this.softGlowId})`}></ellipse>
        <ellipse part="title-lens" cx="600" cy="49" rx="242" ry="29" fill=${`url(#${this.lensGradientId})`}></ellipse>
        <path
          part="title-lens-inner"
          d="M 398 49 C 466 27 734 27 802 49 C 735 66 465 66 398 49 Z"
          fill=${withAlpha(secondary, 0.08)}
          stroke=${withAlpha(primary, 0.28)}
          stroke-width="0.8"
        ></path>

        <path
          part="orbit-rail outer-rail"
          d="M 66 70 C 246 15 954 15 1134 70"
          fill="none"
          stroke=${`url(#${this.railGradientId})`}
          stroke-width="1.45"
          stroke-linecap="round"
          filter=${`url(#${this.softGlowId})`}
        ></path>
        <path
          part="orbit-rail inner-rail"
          d="M 172 76 C 346 42 854 42 1028 76"
          fill="none"
          stroke=${`url(#${this.railGradientId})`}
          stroke-width="0.86"
          stroke-linecap="round"
          stroke-opacity="0.72"
        ></path>
        <path
          part="base-rail"
          d="M 154 78 C 356 90 844 90 1046 78"
          fill="none"
          stroke=${`url(#${this.baseGradientId})`}
          stroke-width="1.2"
          stroke-linecap="round"
        ></path>
        <path
          part="accent-arc"
          d="M 512 23 C 552 15 648 15 688 23"
          fill="none"
          stroke=${`url(#${this.accentGradientId})`}
          stroke-width="2"
          stroke-linecap="round"
        ></path>
        <path
          part="accent-arc"
          d="M 484 73 C 536 80 664 80 716 73"
          fill="none"
          stroke=${`url(#${this.accentGradientId})`}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-opacity="0.68"
        ></path>

        ${this.renderTerminals('left')}
        ${this.renderTerminals('right')}
      </svg>
      <div part="content title" class="content">
        ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
      </div>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <linearGradient id=${this.haloGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${withAlpha(secondary, 0)}></stop>
        <stop offset="0.22" stop-color=${withAlpha(secondary, 0.12)}></stop>
        <stop offset="0.5" stop-color=${withAlpha(primary, 0.18)}></stop>
        <stop offset="0.78" stop-color=${withAlpha(accent, 0.12)}></stop>
        <stop offset="1" stop-color=${withAlpha(accent, 0)}></stop>
      </linearGradient>

      <radialGradient id=${this.lensGradientId} cx="50%" cy="48%" r="58%">
        <stop offset="0" stop-color=${withAlpha(primary, 0.2)}></stop>
        <stop offset="0.46" stop-color=${withAlpha(secondary, 0.12)}></stop>
        <stop offset="0.78" stop-color=${withAlpha(accent, 0.08)}></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0.02)}></stop>
      </radialGradient>

      <linearGradient id=${this.railGradientId} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color=${withAlpha(secondary, 0)}></stop>
        <stop offset="17%" stop-color=${secondary} stop-opacity="0.36"></stop>
        <stop offset="45%" stop-color=${primary} stop-opacity="0.88"></stop>
        <stop offset="55%" stop-color=${primary} stop-opacity="0.88"></stop>
        <stop offset="83%" stop-color=${accent} stop-opacity="0.34"></stop>
        <stop offset="100%" stop-color=${withAlpha(accent, 0)}></stop>
      </linearGradient>

      <linearGradient id=${this.baseGradientId} x1="154" y1="0" x2="1046" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${withAlpha(secondary, 0)}></stop>
        <stop offset="0.28" stop-color=${secondary} stop-opacity="0.3"></stop>
        <stop offset="0.5" stop-color="#f6fffb" stop-opacity="0.46"></stop>
        <stop offset="0.72" stop-color=${primary} stop-opacity="0.34"></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0)}></stop>
      </linearGradient>

      <linearGradient id=${this.accentGradientId} x1="480" y1="0" x2="720" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${withAlpha(accent, 0)}></stop>
        <stop offset="0.5" stop-color=${accent} stop-opacity="0.7"></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0)}></stop>
      </linearGradient>

      <radialGradient id=${this.beadGradientId} cx="50%" cy="50%" r="60%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.92"></stop>
        <stop offset="0.48" stop-color=${primary} stop-opacity="0.7"></stop>
        <stop offset="1" stop-color=${accent} stop-opacity="0.04"></stop>
      </radialGradient>

      <filter id=${this.softGlowId} x="-20%" y="-180%" width="140%" height="460%">
        <feGaussianBlur stdDeviation="2.8" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderTerminals(side: 'left' | 'right'): unknown {
    const transform = side === 'right' ? 'translate(1200 0) scale(-1 1)' : undefined

    return svg`
      <g part=${`terminal ${side}-terminal`} transform=${transform ?? ''}>
        <circle part="light-bead" cx="88" cy="70" r="3.4" fill=${`url(#${this.beadGradientId})`}></circle>
        <circle part="light-bead" cx="134" cy="62" r="2.2" fill=${`url(#${this.beadGradientId})`} opacity="0.72"></circle>
        <line part="terminal-mark" x1="116" y1="58" x2="116" y2="76" stroke=${`url(#${this.railGradientId})`} stroke-width="1.2" stroke-linecap="round" opacity="0.58"></line>
        <line part="terminal-mark" x1="148" y1="61" x2="148" y2="74" stroke=${`url(#${this.railGradientId})`} stroke-width="0.9" stroke-linecap="round" opacity="0.4"></line>
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
      fallback: '#39f6c8',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#7aa8ff',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-3-accent',
      host: this,
      fallback: '#ff7bd5',
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
