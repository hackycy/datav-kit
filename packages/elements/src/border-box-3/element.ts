import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

let borderBox3Id = 0

const defaultSvgWidth = 1672
const defaultSvgHeight = 941
const defaultViewBox = '48 60 1576 820'
const contentViewBox = {
  x: 48,
  y: 60,
  width: 1576,
  height: 820,
}
const contentRect = {
  x: 110,
  y: 132,
  width: 1452,
  height: 677,
}
const defaultSize = {
  width: 0,
  height: 0,
}

export class BorderBox3Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #57b9ff);
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
      padding: var(--dv-border-box-3-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    :host([auto-height]) .content {
      height: auto;
    }

    .glow-layer {
      opacity: var(--dv-border-box-3-glow-opacity, 1);
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

  private readonly instanceId = ++borderBox3Id
  private readonly softGlowId = `dv-border-box-3-soft-glow-${this.instanceId}`
  private readonly hardGlowId = `dv-border-box-3-hard-glow-${this.instanceId}`
  private readonly haloId = `dv-border-box-3-halo-${this.instanceId}`
  private readonly strokeGradientId = `dv-border-box-3-stroke-${this.instanceId}`
  private readonly dimGradientId = `dv-border-box-3-dim-${this.instanceId}`
  private readonly coreGradientId = `dv-border-box-3-core-${this.instanceId}`
  private readonly plateGradientId = `dv-border-box-3-plate-${this.instanceId}`
  private readonly cornerGradientId = `dv-border-box-3-corner-${this.instanceId}`
  private readonly nodeGradientId = `dv-border-box-3-node-${this.instanceId}`
  private readonly cornerId = `dv-border-box-3-corner-symbol-${this.instanceId}`
  private readonly topCenterId = `dv-border-box-3-top-center-${this.instanceId}`
  private readonly leftSideId = `dv-border-box-3-left-side-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-3' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: this.size.width,
      hostHeight: this.autoHeight ? 0 : this.size.height,
      viewBox: contentViewBox,
      contentRect,
      minBlock: 16,
      minInline: 20,
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
          shape-rendering="geometricPrecision"
        >
          <defs>
            <linearGradient id=${this.strokeGradientId} x1="60" y1="0" x2="1612" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color=${accent} stop-opacity="0.95"></stop>
              <stop offset="0.12" stop-color=${secondary} stop-opacity="0.78"></stop>
              <stop offset="0.5" stop-color=${primary} stop-opacity="0.95"></stop>
              <stop offset="0.88" stop-color=${secondary} stop-opacity="0.78"></stop>
              <stop offset="1" stop-color=${accent} stop-opacity="0.95"></stop>
            </linearGradient>

            <linearGradient id=${this.dimGradientId} x1="0" y1="0" x2="1672" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color=${secondary} stop-opacity="0.18"></stop>
              <stop offset="0.15" stop-color=${primary} stop-opacity="0.9"></stop>
              <stop offset="0.5" stop-color=${accent} stop-opacity="0.78"></stop>
              <stop offset="0.85" stop-color=${primary} stop-opacity="0.9"></stop>
              <stop offset="1" stop-color=${secondary} stop-opacity="0.18"></stop>
            </linearGradient>

            <linearGradient id=${this.coreGradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
              <stop offset="0.18" stop-color=${secondary} stop-opacity="0.62"></stop>
              <stop offset="0.5" stop-color="#e0f7ff" stop-opacity="1"></stop>
              <stop offset="0.82" stop-color=${secondary} stop-opacity="0.62"></stop>
              <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
            </linearGradient>

            <linearGradient id=${this.plateGradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color=${secondary} stop-opacity="0.15"></stop>
              <stop offset="0.25" stop-color=${secondary} stop-opacity="0.54"></stop>
              <stop offset="0.5" stop-color=${primary} stop-opacity="0.86"></stop>
              <stop offset="0.75" stop-color=${secondary} stop-opacity="0.54"></stop>
              <stop offset="1" stop-color=${secondary} stop-opacity="0.15"></stop>
            </linearGradient>

            <linearGradient id=${this.cornerGradientId} x1="50" y1="60" x2="145" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color=${primary} stop-opacity="0.22"></stop>
              <stop offset="0.35" stop-color=${secondary} stop-opacity="0.24"></stop>
              <stop offset="1" stop-color="#021429" stop-opacity="0.08"></stop>
            </linearGradient>

            <radialGradient id=${this.nodeGradientId} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stop-color="#e0f7ff"></stop>
              <stop offset="0.35" stop-color=${accent}></stop>
              <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
            </radialGradient>

            <filter id=${this.softGlowId} x="-80" y="-80" width="1832" height="1101" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation=${String(2.2 * glowIntensity)} result="b1"></feGaussianBlur>
              <feGaussianBlur stdDeviation=${String(6.5 * glowIntensity)} result="b2"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="b2"></feMergeNode>
                <feMergeNode in="b1"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            <filter id=${this.hardGlowId} x="-80" y="-80" width="1832" height="1101" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation=${String(1.2 * glowIntensity)} result="b1"></feGaussianBlur>
              <feGaussianBlur stdDeviation=${String(4.6 * glowIntensity)} result="b2"></feGaussianBlur>
              <feGaussianBlur stdDeviation=${String(12 * glowIntensity)} result="b3"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="b3"></feMergeNode>
                <feMergeNode in="b2"></feMergeNode>
                <feMergeNode in="b1"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            <filter id=${this.haloId} x="-40" y="-40" width="120" height="120" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation=${String(6 * glowIntensity)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            ${this.renderSymbols(primary, secondary, accent)}
          </defs>

          ${this.renderFrame(primary, secondary, accent)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderSymbols(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <g id=${this.cornerId}>
        <path d="M66 121L97 91H107L103 121H83V204L67 190V162Z" fill=${`url(#${this.cornerGradientId})`} opacity="0.88"></path>
        <path d="M58 197V111L98 70H214L224 79H238" stroke=${primary} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" filter=${`url(#${this.hardGlowId})`}></path>
        <path d="M69 161L149 91H236" stroke=${`url(#${this.strokeGradientId})`} stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" filter=${`url(#${this.softGlowId})`}></path>
        <path d="M68 163V228M68 281V381" stroke=${secondary} stroke-width="1.65" stroke-linecap="round" opacity="0.9"></path>
        <path d="M78 164L149 101H586" stroke=${secondary} stroke-width="1" opacity="0.7"></path>
        <path d="M78 164V386" stroke=${secondary} stroke-width="1.2" opacity="0.56"></path>
        <path d="M57 112L102 80H214L226 90" stroke=${secondary} stroke-width="1.2" opacity="0.76"></path>
        <path d="M55 186L67 198" stroke=${primary} stroke-width="2" stroke-linecap="round" opacity="0.85"></path>
        <path d="M74 121H108L112 92" stroke=${secondary} stroke-width="1" opacity="0.7"></path>
        <path d="M79 120H104L98 142" stroke=${secondary} stroke-width="1" opacity="0.5"></path>
        <path d="M68 204L56 188" stroke=${primary} stroke-width="1.8" stroke-linecap="round" filter=${`url(#${this.softGlowId})`} opacity="0.82"></path>
        <path d="M236 75V84M247 75V84M258 75V84M269 75V84M280 75V84M291 75V84" stroke=${secondary} stroke-width="2.2" stroke-linecap="square" opacity="0.66"></path>
        <path d="M242 82H298" stroke=${secondary} stroke-width="1.3" opacity="0.68"></path>
        <path d="M88 93L59 121V189" stroke=${accent} stroke-width="1" opacity="0.52"></path>
        <circle cx="68" cy="233" r="2.2" fill=${accent} filter=${`url(#${this.haloId})`}></circle>
        <path d="M99 91H148" stroke="#9ae0ff" stroke-width="1.2" opacity="0.74"></path>
      </g>

      <g id=${this.topCenterId} filter=${`url(#${this.softGlowId})`}>
        <path d="M621 97H761L772 107H900L911 97H1050" stroke=${primary} stroke-width="1.55" opacity="0.86"></path>
        <path d="M633 96H781L792 106H880L891 96H1038L1022 111H914L903 106H769L758 111H649Z" fill=${`url(#${this.plateGradientId})`} opacity="0.7"></path>
        <path d="M640 96H776M896 96H1031" stroke=${`url(#${this.coreGradientId})`} stroke-width="6.5" opacity="0.9"></path>
        <path d="M641 96H1030" stroke="#9ae7ff" stroke-width="1.1" opacity="0.75"></path>
        <path d="M650 111H714M928 111H1020" stroke=${secondary} stroke-width="1" stroke-dasharray="8 6" opacity="0.75"></path>
        ${this.renderDots([722, 735, 750, 765, 901, 917, 932], 111, accent)}
        <path d="M585 91L594 96H614" stroke=${accent} stroke-width="1.25" opacity="0.86"></path>
        <path d="M1087 91L1078 96H1058" stroke=${accent} stroke-width="1.25" opacity="0.86"></path>
      </g>

      <g id=${this.leftSideId} filter=${`url(#${this.softGlowId})`}>
        <path d="M64 266V671" stroke=${secondary} stroke-width="0.9" opacity="0.35"></path>
        <path d="M68 228V274M68 284V381M68 563V666M68 676V732" stroke=${primary} stroke-width="1.35" opacity="0.8"></path>
        <path d="M78 331V381M78 563V613" stroke=${secondary} stroke-width="1.1" opacity="0.66"></path>
        <circle cx="64" cy="264" r="3.1" fill=${accent} filter=${`url(#${this.haloId})`}></circle>
        <circle cx="78" cy="315" r="2.5" fill=${accent}></circle>
        <circle cx="78" cy="629" r="2.5" fill=${accent}></circle>
        <circle cx="64" cy="674" r="3.1" fill=${accent} filter=${`url(#${this.haloId})`}></circle>
        <path d="M76 401H83M76 414H81M76 428H83M76 441H81M76 455H83M76 469H81M76 483H83M76 497H81M76 511H83M76 525H81M76 540H83" stroke=${primary} stroke-width="2" opacity="0.72"></path>
        <path d="M67 231H72M67 736H72" stroke="#8ee2ff" stroke-width="1.6" opacity="0.62"></path>
      </g>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <g id="datav-border" class="glow-layer" stroke-linecap="round" stroke-linejoin="round">
        <path d="M98 70H214L224 79H238M58 197V111L98 70M69 161L149 91H586M1086 91H1523L1604 162V779L1523 849H149L68 779V162" stroke=${secondary} stroke-width="8" opacity="0.13" filter=${`url(#${this.hardGlowId})`}></path>
        <path d="M149 91H580L590 95H614L631 111H760 M912 111H1041L1059 95H1084L1092 91H1523L1604 162V381 M1604 558V779L1523 849H149L68 779V558 M68 381V162L149 91" stroke=${`url(#${this.strokeGradientId})`} stroke-width="2.05" filter=${`url(#${this.softGlowId})`} fill="transparent"></path>
        <path d="M149 849H580L590 845H614L631 829H760M912 829H1041L1059 845H1084L1092 849H1523" stroke=${`url(#${this.strokeGradientId})`} stroke-width="2.05" filter=${`url(#${this.softGlowId})`} fill="transparent"></path>

        <use href=${`#${this.cornerId}`}></use>
        <use href=${`#${this.cornerId}`} transform="translate(1672 0) scale(-1 1)"></use>
        <use href=${`#${this.cornerId}`} transform="translate(0 941) scale(1 -1)"></use>
        <use href=${`#${this.cornerId}`} transform="translate(1672 941) scale(-1 -1)"></use>

        <use href=${`#${this.topCenterId}`}></use>
        <use href=${`#${this.topCenterId}`} transform="translate(0 941) scale(1 -1)"></use>

        <path d="M238 91H556M1116 91H1434" stroke=${primary} stroke-width="1.25" opacity="0.42"></path>
        <path d="M238 849H556M1116 849H1434" stroke=${primary} stroke-width="1.25" opacity="0.42"></path>
        <path d="M146 91H584" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>
        <path d="M1089 91H1524" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>
        <path d="M146 849H584" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>
        <path d="M1089 849H1524" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>

        <use href=${`#${this.leftSideId}`}></use>
        <use href=${`#${this.leftSideId}`} transform="translate(1672 0) scale(-1 1)"></use>

        <path d="M66 818V747L78 736V779L149 839H232L224 849H109L68 809Z" fill=${`url(#${this.cornerGradientId})`} opacity="0.58" filter=${`url(#${this.softGlowId})`}></path>
        <path d="M1606 818V747L1594 736V779L1523 839H1440L1448 849H1563L1604 809Z" fill=${`url(#${this.cornerGradientId})`} opacity="0.58" filter=${`url(#${this.softGlowId})`}></path>
        <path d="M66 122V193L78 204V162L149 102H232L224 91H109L68 131Z" fill=${`url(#${this.cornerGradientId})`} opacity="0.37"></path>
        <path d="M1606 122V193L1594 204V162L1523 102H1440L1448 91H1563L1604 131Z" fill=${`url(#${this.cornerGradientId})`} opacity="0.37"></path>

        <g opacity="0.66">
          <path d="M236 858V849M247 858V849M258 858V849M269 858V849M280 858V849M291 858V849" stroke=${secondary} stroke-width="2.2"></path>
          <path d="M1436 858V849M1425 858V849M1414 858V849M1403 858V849M1392 858V849M1381 858V849" stroke=${secondary} stroke-width="2.2"></path>
          <path d="M242 852H298M1374 852H1430" stroke=${secondary} stroke-width="1.3"></path>
        </g>

        <circle cx="99" cy="70" r="2.2" fill=${`url(#${this.nodeGradientId})`} filter=${`url(#${this.haloId})`} opacity="0.86"></circle>
        <circle cx="1573" cy="70" r="2.2" fill=${`url(#${this.nodeGradientId})`} filter=${`url(#${this.haloId})`} opacity="0.86"></circle>
        <circle cx="99" cy="869" r="2.2" fill=${`url(#${this.nodeGradientId})`} filter=${`url(#${this.haloId})`} opacity="0.86"></circle>
        <circle cx="1573" cy="869" r="2.2" fill=${`url(#${this.nodeGradientId})`} filter=${`url(#${this.haloId})`} opacity="0.86"></circle>

        <path d="M149.5 92.5H581L591 96.5H612.5L628.5 112.5H740 M932 112.5H1041.5L1058.5 96.5H1081L1091.5 92.5H1522.5L1602.5 162.5V778.5L1522.5 847.5H149.5L69.5 778.5V162.5L149.5 92.5" stroke="#a5e8ff" stroke-width="0.65" opacity="0.45" fill="transparent"></path>
        <path d="M149 91H580L590 95H614L631 111H760L769 107H903L912 111H1041L1059 95H1084L1092 91H1523L1604 162V779L1523 849H149L68 779V162Z" stroke=${`url(#${this.dimGradientId})`} stroke-width="0.75" opacity="0.7" fill="transparent"></path>
      </g>
    `
  }

  private renderDots(xs: number[], y: number, fill: string): unknown[] {
    return xs.map((x, index) => {
      const radius = index === 3 || index === 4 ? 2.2 : 1.9
      return svg`<circle cx=${String(x)} cy=${String(y)} r=${String(radius)} fill=${fill}></circle>`
    })
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#57b9ff',
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
      fallback: '#9ae7ff',
    })

    return [primary, secondary, accent]
  }
}
