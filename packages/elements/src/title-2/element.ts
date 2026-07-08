import { DatavElement, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property } from 'lit/decorators.js'

let title2Id = 0

export class Title2Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-title-2-title-color, var(--dvk-title-2-resolved-title-color, #f5cf70));
    }

    svg {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    path,
    polygon,
    rect {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: absolute;
      top: var(--dvk-title-2-title-top, 17.25%);
      left: 50%;
      z-index: 1;
      display: grid;
      place-items: center;
      width: min(36%, var(--dvk-title-2-title-width, 760px));
      min-width: var(--dvk-title-2-title-min-width, 260px);
      height: var(--dvk-title-2-title-height, 46.55%);
      min-height: 0;
      color: var(--dvk-title-2-title-color, var(--dvk-title-2-resolved-title-color, #f5cf70));
      font: var(--dvk-title-2-title-font, 700 24px/1 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      letter-spacing: var(--dvk-title-2-title-letter-spacing, 0.18em);
      text-align: center;
      text-shadow:
        0 0 2px var(--dvk-title-2-title-stroke, rgba(255, 234, 165, 0.88)),
        0 0 10px var(--dvk-title-2-title-glow, rgba(245, 207, 112, 0.46));
      transform: translateX(-50%);
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

  private readonly instanceId = ++title2Id
  private readonly bgGradientId = `dvk-title-2-bg-${this.instanceId}`
  private readonly wingFillId = `dvk-title-2-wing-fill-${this.instanceId}`
  private readonly wingFillMirrorId = `dvk-title-2-wing-fill-mirror-${this.instanceId}`
  private readonly titleFillId = `dvk-title-2-title-fill-${this.instanceId}`
  private readonly blueLineId = `dvk-title-2-blue-line-${this.instanceId}`
  private readonly edgeLeftId = `dvk-title-2-edge-left-${this.instanceId}`
  private readonly edgeRightId = `dvk-title-2-edge-right-${this.instanceId}`
  private readonly glassSheenId = `dvk-title-2-glass-sheen-${this.instanceId}`
  private readonly lineGlowId = `dvk-title-2-line-glow-${this.instanceId}`
  private readonly softLineGlowId = `dvk-title-2-soft-line-glow-${this.instanceId}`
  private readonly microGridId = `dvk-title-2-micro-grid-${this.instanceId}`
  private readonly leftWingClipId = `dvk-title-2-left-wing-clip-${this.instanceId}`
  private readonly rightWingClipId = `dvk-title-2-right-wing-clip-${this.instanceId}`

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-title-2' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()

    return html`
      <svg
        part="graphic"
        viewBox="48 42 2304 116"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary)}</defs>

        <rect part="background" width="2400" height="260" fill=${`url(#${this.bgGradientId})`}></rect>
        <rect part="micro-grid" width="2400" height="178" fill=${`url(#${this.microGridId})`} opacity="0.5"></rect>

        ${this.renderLeftWing(primary, secondary)}
        ${this.renderRightWing(primary, secondary)}
        ${this.renderCenterPanel(primary, secondary)}
        ${this.renderFlowLine(primary)}
      </svg>
      <div part="content title" class="content" style=${`--dvk-title-2-resolved-title-color: ${accent}`}>
        ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
      </div>
    `
  }

  private renderDefs(primary: string, secondary: string): unknown {
    return svg`
      <linearGradient id=${this.bgGradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#06101e"></stop>
        <stop offset="0.58" stop-color="#020814"></stop>
        <stop offset="1" stop-color="#00040a"></stop>
      </linearGradient>

      <linearGradient id=${this.wingFillId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.52"></stop>
        <stop offset="0.45" stop-color=${withAlpha(secondary, 0.68)} stop-opacity="0.38"></stop>
        <stop offset="1" stop-color="#020812" stop-opacity="0.18"></stop>
      </linearGradient>

      <linearGradient id=${this.wingFillMirrorId} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.52"></stop>
        <stop offset="0.45" stop-color=${withAlpha(secondary, 0.68)} stop-opacity="0.38"></stop>
        <stop offset="1" stop-color="#020812" stop-opacity="0.18"></stop>
      </linearGradient>

      <linearGradient id=${this.titleFillId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#081526" stop-opacity="0.34"></stop>
        <stop offset="0.6" stop-color="#051225" stop-opacity="0.52"></stop>
        <stop offset="1" stop-color="#020812" stop-opacity="0.38"></stop>
      </linearGradient>

      <linearGradient id=${this.blueLineId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
        <stop offset="0.18" stop-color=${primary} stop-opacity="0.82"></stop>
        <stop offset="0.5" stop-color="#c7fbff" stop-opacity="0.92"></stop>
        <stop offset="0.82" stop-color=${primary} stop-opacity="0.82"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>

      <linearGradient id=${this.edgeLeftId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
        <stop offset="0.35" stop-color=${primary} stop-opacity="0.62"></stop>
        <stop offset="1" stop-color="#bffaff" stop-opacity="0.86"></stop>
      </linearGradient>

      <linearGradient id=${this.edgeRightId} x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
        <stop offset="0.35" stop-color=${primary} stop-opacity="0.62"></stop>
        <stop offset="1" stop-color="#bffaff" stop-opacity="0.86"></stop>
      </linearGradient>

      <linearGradient id=${this.glassSheenId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0"></stop>
        <stop offset="0.28" stop-color=${primary} stop-opacity="0.11"></stop>
        <stop offset="0.64" stop-color="#ffffff" stop-opacity="0.035"></stop>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
      </linearGradient>

      <filter id=${this.lineGlowId} x="-40%" y="-120%" width="180%" height="340%">
        <feGaussianBlur stdDeviation="2.2" result="blur"></feGaussianBlur>
        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.62  0 0 0 0 1  0 0 0 0.62 0" result="blue"></feColorMatrix>
        <feMerge>
          <feMergeNode in="blue"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${this.softLineGlowId} x="-35%" y="-180%" width="170%" height="460%">
        <feGaussianBlur stdDeviation="5" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <pattern id=${this.microGridId} width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke=${primary} stroke-opacity="0.055" stroke-width="1"></path>
        <path d="M24 0V48M0 24H48" fill="none" stroke=${primary} stroke-opacity="0.025" stroke-width="1"></path>
      </pattern>

      <clipPath id=${this.leftWingClipId}>
        <path d="M64,58 L802,58 L868,89 L804,119 L512,119 L474,136 L64,136 Z"></path>
      </clipPath>

      <clipPath id=${this.rightWingClipId}>
        <path d="M2336,58 L1598,58 L1532,89 L1596,119 L1888,119 L1926,136 L2336,136 Z"></path>
      </clipPath>
    `
  }

  private renderLeftWing(primary: string, secondary: string): unknown {
    return svg`
      <g part="wing left-wing">
        <path part="wing-surface" d="M64,58 L802,58 L868,89 L804,119 L512,119 L474,136 L64,136 Z" fill=${`url(#${this.wingFillId})`} stroke=${secondary} stroke-opacity="0.42" stroke-width="1"></path>
        <path part="wing-inner-line" d="M93,70 L762,70 L814,90 L764,108 L518,108 L480,124 L93,124 Z" fill="none" stroke=${primary} stroke-opacity="0.32" stroke-width="1"></path>
        <rect part="glass-sheen" x="64" y="58" width="804" height="78" clip-path=${`url(#${this.leftWingClipId})`} fill=${`url(#${this.glassSheenId})`} opacity="0.75"></rect>
        <path part="edge-line" d="M70,58 H802 L868,89" fill="none" stroke=${`url(#${this.edgeLeftId})`} stroke-width="1.8" filter=${`url(#${this.lineGlowId})`}></path>
        <path part="edge-line" d="M70,136 H474 L512,119 H804" fill="none" stroke=${`url(#${this.edgeLeftId})`} stroke-width="1.5" filter=${`url(#${this.lineGlowId})`}></path>
        <path part="detail-line" d="M120,83 H548 L582,96 H730" fill="none" stroke=${primary} stroke-opacity="0.28" stroke-width="1.2"></path>
        <path part="detail-line" d="M128,113 H438 L478,96 H636" fill="none" stroke="#7cefff" stroke-opacity="0.24" stroke-width="1"></path>
        <path part="detail-line" d="M596,58 L660,89 L596,119" fill="none" stroke=${primary} stroke-opacity="0.22" stroke-width="1"></path>
        <path part="glow-accent" d="M140,92 H296" fill="none" stroke="#72eaff" stroke-opacity="0.26" stroke-width="2.4" filter=${`url(#${this.softLineGlowId})`}></path>
      </g>
    `
  }

  private renderRightWing(primary: string, secondary: string): unknown {
    return svg`
      <g part="wing right-wing">
        <path part="wing-surface" d="M2336,58 L1598,58 L1532,89 L1596,119 L1888,119 L1926,136 L2336,136 Z" fill=${`url(#${this.wingFillMirrorId})`} stroke=${secondary} stroke-opacity="0.42" stroke-width="1"></path>
        <path part="wing-inner-line" d="M2307,70 L1638,70 L1586,90 L1636,108 L1882,108 L1920,124 L2307,124 Z" fill="none" stroke=${primary} stroke-opacity="0.32" stroke-width="1"></path>
        <rect part="glass-sheen" x="1532" y="58" width="804" height="78" clip-path=${`url(#${this.rightWingClipId})`} fill=${`url(#${this.glassSheenId})`} opacity="0.75"></rect>
        <path part="edge-line" d="M2330,58 H1598 L1532,89" fill="none" stroke=${`url(#${this.edgeRightId})`} stroke-width="1.8" filter=${`url(#${this.lineGlowId})`}></path>
        <path part="edge-line" d="M2330,136 H1926 L1888,119 H1596" fill="none" stroke=${`url(#${this.edgeRightId})`} stroke-width="1.5" filter=${`url(#${this.lineGlowId})`}></path>
        <path part="detail-line" d="M2280,83 H1852 L1818,96 H1670" fill="none" stroke=${primary} stroke-opacity="0.28" stroke-width="1.2"></path>
        <path part="detail-line" d="M2272,113 H1962 L1922,96 H1764" fill="none" stroke="#7cefff" stroke-opacity="0.24" stroke-width="1"></path>
        <path part="detail-line" d="M1804,58 L1740,89 L1804,119" fill="none" stroke=${primary} stroke-opacity="0.22" stroke-width="1"></path>
        <path part="glow-accent" d="M2260,92 H2104" fill="none" stroke="#72eaff" stroke-opacity="0.26" stroke-width="2.4" filter=${`url(#${this.softLineGlowId})`}></path>
      </g>
    `
  }

  private renderCenterPanel(primary: string, secondary: string): unknown {
    return svg`
      <g part="center-panel">
        <path part="title-panel" d="M806,48 L1594,48 L1668,89 L1594,130 L806,130 L732,89 Z" fill=${`url(#${this.titleFillId})`} stroke=${secondary} stroke-opacity="0.5" stroke-width="1"></path>
        <path part="title-inner-panel" d="M852,62 H1548 L1594,89 L1548,116 H852 L806,89 Z" fill="#03101d" fill-opacity="0.22" stroke=${secondary} stroke-opacity="0.28" stroke-width="1"></path>
        <path part="center-edge" d="M810,48 H1590 L1664,89" fill="none" stroke=${`url(#${this.blueLineId})`} stroke-width="1.7" filter=${`url(#${this.lineGlowId})`}></path>
        <path part="center-edge" d="M806,130 H1594" fill="none" stroke=${`url(#${this.blueLineId})`} stroke-width="1.9" filter=${`url(#${this.lineGlowId})`}></path>
        <path part="quiet-line" d="M950,65 H1450" fill="none" stroke="#d8fbff" stroke-opacity="0.11" stroke-width="1"></path>
        <path part="quiet-line" d="M900,114 H1500" fill="none" stroke=${primary} stroke-opacity="0.16" stroke-width="1"></path>
        <path part="side-connector" d="M754,89 H820 M1646,89 H1580" fill="none" stroke="#99f7ff" stroke-opacity="0.5" stroke-width="1.3" filter=${`url(#${this.lineGlowId})`}></path>
      </g>
    `
  }

  private renderFlowLine(primary: string): unknown {
    return svg`
      <g part="flow-line">
        <rect x="740" y="143" width="920" height="1.7" fill=${`url(#${this.blueLineId})`} opacity="0.58" filter=${`url(#${this.lineGlowId})`}></rect>
        <rect x="930" y="151" width="540" height="1" fill=${`url(#${this.blueLineId})`} opacity="0.26"></rect>
        <ellipse cx="1200" cy="143.5" rx="76" ry="7" fill=${primary} opacity="0.13" filter=${`url(#${this.softLineGlowId})`}></ellipse>
        <path d="M1144,143.5 H1256" fill="none" stroke="#dffcff" stroke-opacity="0.32" stroke-width="1"></path>
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
      fallback: '#0ec8ff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#0a61ff',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-2-accent',
      host: this,
      fallback: '#f5cf70',
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
