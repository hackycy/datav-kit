import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

let borderBox2Id = 0

const defaultSvgWidth = 1600
const defaultSvgHeight = 900
const defaultViewBox = '48 48 1504 804'
const contentViewBox = {
  x: 48,
  y: 48,
  width: 1504,
  height: 804,
}
const contentRect = {
  x: 158,
  y: 145,
  width: 1284,
  height: 610,
}
const defaultSize = {
  width: 0,
  height: 0,
}

const outerPath = [
  'M90 115',
  'L125 80 L210 80 L195 100 L560 100 L575 118 L640 118 L658 96',
  'L942 96 L960 118 L1030 118 L1045 100 L1405 100 L1390 80',
  'L1475 80 L1510 115 L1510 215 L1490 235 L1490 410 L1510 430',
  'L1510 485 L1490 505 L1490 670 L1510 690 L1510 785',
  'L1475 820 L1390 820 L1405 800 L1045 800 L1030 782 L960 782',
  'L942 804 L658 804 L640 782 L575 782 L560 800 L195 800',
  'L210 820 L125 820 L90 785 L90 690 L110 670 L110 505',
  'L90 485 L90 430 L110 410 L110 235 L90 215 Z',
].join(' ')

const innerPath = [
  'M125 145',
  'L190 145 L205 130 L540 130 L555 145 L630 145 L652 120',
  'L948 120 L970 145 L1045 145 L1060 130 L1395 130 L1410 145',
  'L1475 145 L1475 225 L1458 242 L1458 410 L1442 425 L1442 475',
  'L1458 490 L1458 660 L1475 675 L1475 755 L1410 755 L1395 770',
  'L1060 770 L1045 755 L970 755 L948 780 L652 780 L630 755',
  'L555 755 L540 770 L205 770 L190 755 L125 755 L125 675',
  'L142 660 L142 490 L158 475 L158 425 L142 410 L142 242',
  'L125 225 Z',
].join(' ')

export class BorderBox2Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #0af2ff);
    }

    :host([auto-height]) {
      height: auto;
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
      padding: var(--dv-border-box-2-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    :host([auto-height]) .content {
      height: auto;
    }

    .outer-line {
      opacity: var(--dv-border-box-2-glow-opacity, 1);
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'accent-color' })
  accentColor = ''

  @property()
  colors = ''

  @property({ type: Number, attribute: 'glow-intensity' })
  glowIntensity = 1

  @property({ type: Boolean, attribute: 'auto-height', reflect: true })
  autoHeight = false

  @state()
  private size = defaultSize

  private readonly instanceId = ++borderBox2Id
  private readonly glowId = `dv-border-box-2-glow-${this.instanceId}`
  private readonly strongGlowId = `dv-border-box-2-strong-glow-${this.instanceId}`
  private readonly lineGradientId = `dv-border-box-2-line-${this.instanceId}`
  private readonly panelGradientId = `dv-border-box-2-panel-${this.instanceId}`
  private readonly barGradientId = `dv-border-box-2-bar-${this.instanceId}`
  private readonly slashId = `dv-border-box-2-slash-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-2' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: this.size.width,
      hostHeight: this.autoHeight ? 0 : this.size.height,
      viewBox: contentViewBox,
      contentRect,
      minBlock: 14,
      minInline: 18,
    })

    return html`
      <div part="frame" class="frame">
        <svg
          part="graphic"
          width=${String(defaultSvgWidth)}
          height=${String(defaultSvgHeight)}
          viewBox=${defaultViewBox}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id=${this.glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation=${String(3 * glowIntensity)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            <filter id=${this.strongGlowId} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation=${String(8 * glowIntensity)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            <linearGradient id=${this.lineGradientId} x1="0" y1="0" x2="1600" y2="0">
              <stop offset="0%" stop-color=${primary}></stop>
              <stop offset="45%" stop-color=${secondary}></stop>
              <stop offset="55%" stop-color=${accent}></stop>
              <stop offset="100%" stop-color=${primary}></stop>
            </linearGradient>

            <linearGradient id=${this.panelGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color=${secondary} stop-opacity="0.8"></stop>
              <stop offset="100%" stop-color=${accent} stop-opacity="0.25"></stop>
            </linearGradient>

            <linearGradient id=${this.barGradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color=${primary}></stop>
              <stop offset="65%" stop-color=${secondary}></stop>
              <stop offset="100%" stop-color=${accent}></stop>
            </linearGradient>

            <g id=${this.slashId}>
              <path d="M0 14 L8 0 H18 L10 14 Z" fill=${primary}></path>
            </g>
          </defs>

          ${this.renderFrame(primary, secondary, accent)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <path
        d=${outerPath}
        stroke=${`url(#${this.lineGradientId})`}
        stroke-width="2"
        fill="transparent"
        filter=${`url(#${this.glowId})`}
        class="outer-line"
      ></path>

      <path d=${innerPath} stroke=${secondary} stroke-width="1" opacity="0.9" fill="transparent"></path>

      <g filter=${`url(#${this.glowId})`}>
        <path d="M65 105 L105 65 H210 L185 100 H120 L95 125 V220 L65 190 Z" fill=${`url(#${this.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M95 125 L130 90 H195" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>

        <path d="M1535 105 L1495 65 H1390 L1415 100 H1480 L1505 125 V220 L1535 190 Z" fill=${`url(#${this.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M1505 125 L1470 90 H1405" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>

        <path d="M65 795 L105 835 H210 L185 800 H120 L95 775 V680 L65 710 Z" fill=${`url(#${this.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M95 775 L130 810 H195" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>

        <path d="M1535 795 L1495 835 H1390 L1415 800 H1480 L1505 775 V680 L1535 710 Z" fill=${`url(#${this.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M1505 775 L1470 810 H1405" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>
      </g>

      <g filter=${`url(#${this.strongGlowId})`}>
        ${this.renderCornerNode(145, 175, 'M20 -5 L55 -40', primary, secondary)}
        ${this.renderCornerNode(1455, 175, 'M-20 -5 L-55 -40', primary, secondary)}
        ${this.renderCornerNode(145, 735, 'M20 5 L55 40', primary, secondary)}
        ${this.renderCornerNode(1455, 735, 'M-20 5 L-55 40', primary, secondary)}
      </g>

      ${this.renderEnergyBar(112, secondary)}
      ${this.renderEnergyBar(764, secondary)}

      <g filter=${`url(#${this.glowId})`} opacity="0.95">
        <g transform="translate(205 118)">${this.renderSlashUses(5)}</g>
        <g transform="translate(1320 118)">${this.renderSlashUses(5)}</g>
        <g transform="translate(205 782)">${this.renderSlashUses(5)}</g>
        <g transform="translate(1320 782)">${this.renderSlashUses(5)}</g>
      </g>

      <g filter=${`url(#${this.glowId})`}>
        <g transform="translate(110 290)">${this.renderRects(9, 6, 3, 10, primary)}</g>
        <g transform="translate(1484 290)">${this.renderRects(9, 6, 3, 10, primary)}</g>
        <g transform="translate(100 510)">${this.renderRects(6, 12, 6, 16, primary)}</g>
        <g transform="translate(1488 510)">${this.renderRects(6, 12, 6, 16, secondary)}</g>
      </g>

      <g filter=${`url(#${this.glowId})`}>
        <path d="M138 430 L154 430 L146 444 Z" fill=${primary}></path>
        <path d="M138 448 L154 448 L146 462 Z" fill=${secondary}></path>
        <path d="M138 466 L154 466 L146 480 Z" fill=${primary}></path>

        <path d="M1462 430 L1446 430 L1454 444 Z" fill=${primary}></path>
        <path d="M1462 448 L1446 448 L1454 462 Z" fill=${secondary}></path>
        <path d="M1462 466 L1446 466 L1454 480 Z" fill=${primary}></path>
      </g>

      <g filter=${`url(#${this.strongGlowId})`}>
        <circle cx="500" cy="120" r="4" fill=${primary}></circle>
        <circle cx="630" cy="140" r="4" fill=${primary}></circle>
        <circle cx="970" cy="140" r="4" fill=${primary}></circle>
        <circle cx="1100" cy="120" r="4" fill=${primary}></circle>
        <circle cx="500" cy="780" r="4" fill=${primary}></circle>
        <circle cx="540" cy="760" r="4" fill=${primary}></circle>
        <circle cx="1060" cy="760" r="4" fill=${primary}></circle>
        <circle cx="1100" cy="780" r="4" fill=${primary}></circle>
        <rect x="75" y="380" width="8" height="34" rx="4" fill=${primary}></rect>
        <rect x="1517" y="380" width="8" height="34" rx="4" fill=${primary}></rect>
      </g>

      <g stroke=${secondary} stroke-width="1.5" opacity="0.75" fill="transparent">
        <path d="M300 118 H520"></path>
        <path d="M1080 118 H1300"></path>
        <path d="M300 782 H520"></path>
        <path d="M1080 782 H1300"></path>
        <path d="M340 132 H610"></path>
        <path d="M990 132 H1260"></path>
        <path d="M340 768 H610"></path>
        <path d="M990 768 H1260"></path>
      </g>

      <g filter=${`url(#${this.glowId})`} opacity="0.9">
        <path d="M82 210 L98 230 V255 L82 240 Z" fill=${accent}></path>
        <path d="M1518 210 L1502 230 V255 L1518 240 Z" fill=${accent}></path>
        <path d="M82 690 L98 670 V645 L82 660 Z" fill=${accent}></path>
        <path d="M1518 690 L1502 670 V645 L1518 660 Z" fill=${accent}></path>
      </g>
    `
  }

  private renderCornerNode(x: number, y: number, line: string, primary: string, secondary: string): unknown {
    return svg`
      <g transform=${`translate(${x} ${y})`}>
        <circle r="22" stroke=${secondary} stroke-width="2" fill="transparent"></circle>
        <circle r="13" fill="#123b8a" stroke=${primary} stroke-width="2"></circle>
        <circle r="6" fill="#dffbff"></circle>
        <path d=${line} stroke=${secondary} stroke-width="2"></path>
      </g>
    `
  }

  private renderEnergyBar(y: number, secondary: string): unknown {
    return svg`
      <g transform=${`translate(670 ${y})`} filter=${`url(#${this.glowId})`}>
        <path d="M0 24 L20 0 H260 L280 24 Z" stroke=${secondary} stroke-width="2" fill="#061a3a"></path>
        <g transform="translate(28 8)">${this.renderSlashUses(12)}</g>
        <rect x="28" y="8" width="226" height="14" fill=${`url(#${this.barGradientId})`} opacity="0.35"></rect>
      </g>
    `
  }

  private renderSlashUses(count: number): unknown[] {
    return Array.from({ length: count }, (_, index) => {
      return svg`<use href=${`#${this.slashId}`} x=${String(index * 18)}></use>`
    })
  }

  private renderRects(count: number, width: number, height: number, gap: number, fill: string): unknown[] {
    return Array.from({ length: count }, (_, index) => {
      return svg`<rect x="0" y=${String(index * gap)} width=${String(width)} height=${String(height)} fill=${fill}></rect>`
    })
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#0af2ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#168cff',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dv-color-accent',
      host: this,
      fallback: '#7c4dff',
    })

    return [primary, secondary, accent]
  }
}
