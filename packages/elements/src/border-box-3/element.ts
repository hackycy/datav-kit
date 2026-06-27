import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

let borderBox3Id = 0

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
const fixedSlices = {
  topLeft: { x: 48, y: 60, width: 300, height: 204 },
  topCenter: { x: 585, y: 88, width: 502, height: 32 },
  topRight: { x: 1324, y: 60, width: 300, height: 204 },
  leftDetail: { x: 48, y: 264, width: 48, height: 410 },
  rightDetail: { x: 1576, y: 264, width: 48, height: 410 },
  bottomLeft: { x: 48, y: 674, width: 300, height: 206 },
  bottomCenter: { x: 585, y: 821, width: 502, height: 38 },
  bottomRight: { x: 1324, y: 674, width: 300, height: 206 },
} satisfies Record<string, typeof contentViewBox>
const extensionSlices = {
  topLeading: { x: 348, y: 88, width: 237, height: 34 },
  topTrailing: { x: 1087, y: 88, width: 237, height: 34 },
  bottomLeading: { x: 348, y: 821, width: 237, height: 38 },
  bottomTrailing: { x: 1087, y: 821, width: 237, height: 38 },
  leftUpper: { x: 58, y: 228, width: 26, height: 30 },
  leftLower: { x: 58, y: 690, width: 26, height: 42 },
  rightUpper: { x: 1588, y: 228, width: 26, height: 30 },
  rightLower: { x: 1588, y: 690, width: 26, height: 42 },
} satisfies Record<string, typeof contentViewBox>

interface BorderBox3SvgIds {
  softGlowId: string
  hardGlowId: string
  haloId: string
  strokeGradientId: string
  dimGradientId: string
  coreGradientId: string
  plateGradientId: string
  cornerGradientId: string
  nodeGradientId: string
  cornerId: string
  topCenterId: string
  leftSideId: string
}

export class BorderBox3Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #57b9ff);
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    svg {
      display: block;
      overflow: hidden;
    }

    .extension,
    .tile {
      position: absolute;
      display: block;
      overflow: hidden;
    }

    .extension {
      z-index: 0;
    }

    .tile {
      z-index: 1;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      padding: var(--dv-border-box-3-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
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
    const metrics = this.createSliceMetrics()
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: this.size.width,
      hostHeight: 0,
      viewBox: contentViewBox,
      contentRect,
      minBlock: 16,
      minInline: 20,
    })

    return html`
      ${this.renderFlexibleGraphic(primary, secondary, accent, glowIntensity, metrics)}
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderFlexibleGraphic(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox3Element['createSliceMetrics']>,
  ): unknown {
    return html`
      <div part="frame" class="frame frame--sliced">
        ${this.renderExtensionStrips(primary, secondary, accent, glowIntensity, metrics)}
        ${this.renderTile({
          name: 'top-left',
          rect: fixedSlices.topLeft,
          style: `left: 0; top: 0; width: ${metrics.cornerWidth}px; height: ${metrics.topHeight}px`,
          width: metrics.cornerWidth,
          height: metrics.topHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'top-center',
          rect: fixedSlices.topCenter,
          style: `left: ${metrics.centerLeft}px; top: ${metrics.topCenterTop}px; width: ${metrics.centerWidth}px; height: ${metrics.topCenterHeight}px`,
          width: metrics.centerWidth,
          height: metrics.topCenterHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'top-right',
          rect: fixedSlices.topRight,
          style: `right: 0; top: 0; width: ${metrics.cornerWidth}px; height: ${metrics.topHeight}px`,
          width: metrics.cornerWidth,
          height: metrics.topHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'left-detail',
          rect: fixedSlices.leftDetail,
          style: `left: 0; top: ${metrics.sideDetailTop}px; width: ${metrics.sideWidth}px; height: ${metrics.sideDetailHeight}px`,
          width: metrics.sideWidth,
          height: metrics.sideDetailHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'right-detail',
          rect: fixedSlices.rightDetail,
          style: `right: 0; top: ${metrics.sideDetailTop}px; width: ${metrics.sideWidth}px; height: ${metrics.sideDetailHeight}px`,
          width: metrics.sideWidth,
          height: metrics.sideDetailHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-left',
          rect: fixedSlices.bottomLeft,
          style: `left: 0; bottom: 0; width: ${metrics.cornerWidth}px; height: ${metrics.bottomHeight}px`,
          width: metrics.cornerWidth,
          height: metrics.bottomHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-center',
          rect: fixedSlices.bottomCenter,
          style: `left: ${metrics.centerLeft}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.centerWidth}px; height: ${metrics.bottomCenterHeight}px`,
          width: metrics.centerWidth,
          height: metrics.bottomCenterHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-right',
          rect: fixedSlices.bottomRight,
          style: `right: 0; bottom: 0; width: ${metrics.cornerWidth}px; height: ${metrics.bottomHeight}px`,
          width: metrics.cornerWidth,
          height: metrics.bottomHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
      </div>
    `
  }

  private renderExtensionStrips(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox3Element['createSliceMetrics']>,
  ): unknown {
    return html`
      ${this.renderTile({
        name: 'top-leading',
        rect: extensionSlices.topLeading,
        style: `left: ${metrics.cornerWidth}px; top: ${metrics.topLineTop}px; width: ${metrics.topLeadingWidth}px; height: ${metrics.topLineHeight}px`,
        width: metrics.topLeadingWidth,
        height: metrics.topLineHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'top-trailing',
        rect: extensionSlices.topTrailing,
        style: `left: ${metrics.topTrailingLeft}px; top: ${metrics.topLineTop}px; width: ${metrics.topTrailingWidth}px; height: ${metrics.topLineHeight}px`,
        width: metrics.topTrailingWidth,
        height: metrics.topLineHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-leading',
        rect: extensionSlices.bottomLeading,
        style: `left: ${metrics.cornerWidth}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.bottomLeadingWidth}px; height: ${metrics.bottomLineHeight}px`,
        width: metrics.bottomLeadingWidth,
        height: metrics.bottomLineHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-trailing',
        rect: extensionSlices.bottomTrailing,
        style: `left: ${metrics.bottomTrailingLeft}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.bottomTrailingWidth}px; height: ${metrics.bottomLineHeight}px`,
        width: metrics.bottomTrailingWidth,
        height: metrics.bottomLineHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'left-upper',
        rect: extensionSlices.leftUpper,
        style: `left: ${metrics.leftLineLeft}px; top: ${metrics.topHeight}px; width: ${metrics.sideLineWidth}px; height: ${metrics.sideUpperHeight}px`,
        width: metrics.sideLineWidth,
        height: metrics.sideUpperHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'left-lower',
        rect: extensionSlices.leftLower,
        style: `left: ${metrics.leftLineLeft}px; top: ${metrics.sideLowerTop}px; width: ${metrics.sideLineWidth}px; height: ${metrics.sideLowerHeight}px`,
        width: metrics.sideLineWidth,
        height: metrics.sideLowerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'right-upper',
        rect: extensionSlices.rightUpper,
        style: `right: ${metrics.rightLineRight}px; top: ${metrics.topHeight}px; width: ${metrics.sideLineWidth}px; height: ${metrics.sideUpperHeight}px`,
        width: metrics.sideLineWidth,
        height: metrics.sideUpperHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'right-lower',
        rect: extensionSlices.rightLower,
        style: `right: ${metrics.rightLineRight}px; top: ${metrics.sideLowerTop}px; width: ${metrics.sideLineWidth}px; height: ${metrics.sideLowerHeight}px`,
        width: metrics.sideLineWidth,
        height: metrics.sideLowerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
    `
  }

  private renderTile(options: {
    name: string
    rect: typeof contentViewBox
    style: string
    width: number
    height: number
    stretch?: boolean
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
  }): unknown {
    if (options.width < 1 || options.height < 1)
      return ''

    const ids = this.createSvgIds(options.name)

    return html`
      <div class=${options.stretch ? 'extension' : 'tile'} data-slice=${options.name} style=${options.style}>
        <svg
          part="graphic"
          width=${String(options.width)}
          height=${String(options.height)}
          viewBox=${`${options.rect.x} ${options.rect.y} ${options.rect.width} ${options.rect.height}`}
          preserveAspectRatio=${options.stretch ? 'none' : 'xMidYMid meet'}
          aria-hidden="true"
          shape-rendering="geometricPrecision"
        >
          <defs>
            ${this.renderDefs(options.primary, options.secondary, options.accent, options.glowIntensity, ids)}
            ${this.renderSymbols(options.primary, options.secondary, options.accent, ids)}
          </defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, ids)}
        </svg>
      </div>
    `
  }

  private createSvgIds(suffix: string): BorderBox3SvgIds {
    return {
      softGlowId: `${this.softGlowId}-${suffix}`,
      hardGlowId: `${this.hardGlowId}-${suffix}`,
      haloId: `${this.haloId}-${suffix}`,
      strokeGradientId: `${this.strokeGradientId}-${suffix}`,
      dimGradientId: `${this.dimGradientId}-${suffix}`,
      coreGradientId: `${this.coreGradientId}-${suffix}`,
      plateGradientId: `${this.plateGradientId}-${suffix}`,
      cornerGradientId: `${this.cornerGradientId}-${suffix}`,
      nodeGradientId: `${this.nodeGradientId}-${suffix}`,
      cornerId: `${this.cornerId}-${suffix}`,
      topCenterId: `${this.topCenterId}-${suffix}`,
      leftSideId: `${this.leftSideId}-${suffix}`,
    }
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number, ids: BorderBox3SvgIds): unknown {
    return svg`
      <linearGradient id=${ids.strokeGradientId} x1="60" y1="0" x2="1612" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${accent} stop-opacity="0.95"></stop>
        <stop offset="0.12" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="0.5" stop-color=${primary} stop-opacity="0.95"></stop>
        <stop offset="0.88" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="1" stop-color=${accent} stop-opacity="0.95"></stop>
      </linearGradient>

      <linearGradient id=${ids.dimGradientId} x1="0" y1="0" x2="1672" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.18"></stop>
        <stop offset="0.15" stop-color=${primary} stop-opacity="0.9"></stop>
        <stop offset="0.5" stop-color=${accent} stop-opacity="0.78"></stop>
        <stop offset="0.85" stop-color=${primary} stop-opacity="0.9"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.18"></stop>
      </linearGradient>

      <linearGradient id=${ids.coreGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
        <stop offset="0.18" stop-color=${secondary} stop-opacity="0.62"></stop>
        <stop offset="0.5" stop-color="#e0f7ff" stop-opacity="1"></stop>
        <stop offset="0.82" stop-color=${secondary} stop-opacity="0.62"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>

      <linearGradient id=${ids.plateGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.15"></stop>
        <stop offset="0.25" stop-color=${secondary} stop-opacity="0.54"></stop>
        <stop offset="0.5" stop-color=${primary} stop-opacity="0.86"></stop>
        <stop offset="0.75" stop-color=${secondary} stop-opacity="0.54"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.15"></stop>
      </linearGradient>

      <linearGradient id=${ids.cornerGradientId} x1="50" y1="60" x2="145" y2="210" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${primary} stop-opacity="0.22"></stop>
        <stop offset="0.35" stop-color=${secondary} stop-opacity="0.24"></stop>
        <stop offset="1" stop-color="#021429" stop-opacity="0.08"></stop>
      </linearGradient>

      <radialGradient id=${ids.nodeGradientId} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#e0f7ff"></stop>
        <stop offset="0.35" stop-color=${accent}></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </radialGradient>

      <filter id=${ids.softGlowId} x="-80" y="-80" width="1832" height="1101" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(2.2 * glowIntensity)} result="b1"></feGaussianBlur>
        <feGaussianBlur stdDeviation=${String(6.5 * glowIntensity)} result="b2"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="b2"></feMergeNode>
          <feMergeNode in="b1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${ids.hardGlowId} x="-80" y="-80" width="1832" height="1101" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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

      <filter id=${ids.haloId} x="-40" y="-40" width="120" height="120" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation=${String(6 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderSymbols(primary: string, secondary: string, accent: string, ids: BorderBox3SvgIds): unknown {
    return svg`
      <g id=${ids.cornerId}>
        <path d="M66 121L97 91H107L103 121H83V204L67 190V162Z" fill=${`url(#${ids.cornerGradientId})`} opacity="0.88"></path>
        <path d="M58 197V111L98 70H214L224 79H238" stroke=${primary} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d="M69 161L149 91H236" stroke=${`url(#${ids.strokeGradientId})`} stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M68 163V228M68 281V381" stroke=${secondary} stroke-width="1.65" stroke-linecap="round" opacity="0.9"></path>
        <path d="M78 164L149 101H586" stroke=${secondary} stroke-width="1" opacity="0.7"></path>
        <path d="M78 164V386" stroke=${secondary} stroke-width="1.2" opacity="0.56"></path>
        <path d="M57 112L102 80H214L226 90" stroke=${secondary} stroke-width="1.2" opacity="0.76"></path>
        <path d="M55 186L67 198" stroke=${primary} stroke-width="2" stroke-linecap="round" opacity="0.85"></path>
        <path d="M74 121H108L112 92" stroke=${secondary} stroke-width="1" opacity="0.7"></path>
        <path d="M79 120H104L98 142" stroke=${secondary} stroke-width="1" opacity="0.5"></path>
        <path d="M68 204L56 188" stroke=${primary} stroke-width="1.8" stroke-linecap="round" filter=${`url(#${ids.softGlowId})`} opacity="0.82"></path>
        <path d="M236 75V84M247 75V84M258 75V84M269 75V84M280 75V84M291 75V84" stroke=${secondary} stroke-width="2.2" stroke-linecap="square" opacity="0.66"></path>
        <path d="M242 82H298" stroke=${secondary} stroke-width="1.3" opacity="0.68"></path>
        <path d="M88 93L59 121V189" stroke=${accent} stroke-width="1" opacity="0.52"></path>
        <circle cx="68" cy="233" r="2.2" fill=${accent} filter=${`url(#${ids.haloId})`}></circle>
        <path d="M99 91H148" stroke="#9ae0ff" stroke-width="1.2" opacity="0.74"></path>
      </g>

      <g id=${ids.topCenterId} filter=${`url(#${ids.softGlowId})`}>
        <path d="M621 97H761L772 107H900L911 97H1050" stroke=${primary} stroke-width="1.55" opacity="0.86"></path>
        <path d="M633 96H781L792 106H880L891 96H1038L1022 111H914L903 106H769L758 111H649Z" fill=${`url(#${ids.plateGradientId})`} opacity="0.7"></path>
        <path d="M640 96H776M896 96H1031" stroke=${`url(#${ids.coreGradientId})`} stroke-width="6.5" opacity="0.9"></path>
        <path d="M641 96H1030" stroke="#9ae7ff" stroke-width="1.1" opacity="0.75"></path>
        <path d="M650 111H714M928 111H1020" stroke=${secondary} stroke-width="1" stroke-dasharray="8 6" opacity="0.75"></path>
        ${this.renderDots([722, 735, 750, 765, 901, 917, 932], 111, accent)}
        <path d="M585 91L594 96H614" stroke=${accent} stroke-width="1.25" opacity="0.86"></path>
        <path d="M1087 91L1078 96H1058" stroke=${accent} stroke-width="1.25" opacity="0.86"></path>
      </g>

      <g id=${ids.leftSideId} filter=${`url(#${ids.softGlowId})`}>
        <path d="M64 266V671" stroke=${secondary} stroke-width="0.9" opacity="0.35"></path>
        <path d="M68 228V274M68 284V381M68 563V666M68 676V732" stroke=${primary} stroke-width="1.35" opacity="0.8"></path>
        <path d="M78 331V381M78 563V613" stroke=${secondary} stroke-width="1.1" opacity="0.66"></path>
        <circle cx="64" cy="264" r="3.1" fill=${accent} filter=${`url(#${ids.haloId})`}></circle>
        <circle cx="78" cy="315" r="2.5" fill=${accent}></circle>
        <circle cx="78" cy="629" r="2.5" fill=${accent}></circle>
        <circle cx="64" cy="674" r="3.1" fill=${accent} filter=${`url(#${ids.haloId})`}></circle>
        <path d="M76 401H83M76 414H81M76 428H83M76 441H81M76 455H83M76 469H81M76 483H83M76 497H81M76 511H83M76 525H81M76 540H83" stroke=${primary} stroke-width="2" opacity="0.72"></path>
        <path d="M67 231H72M67 736H72" stroke="#8ee2ff" stroke-width="1.6" opacity="0.62"></path>
      </g>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, ids: BorderBox3SvgIds): unknown {
    return svg`
      <g id="datav-border" class="glow-layer" stroke-linecap="round" stroke-linejoin="round">
        <path d="M98 70H214L224 79H238M58 197V111L98 70M69 161L149 91H586M1086 91H1523L1604 162V779L1523 849H149L68 779V162" stroke=${secondary} stroke-width="8" opacity="0.13" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d="M149 91H580L590 95H614L631 111H760 M912 111H1041L1059 95H1084L1092 91H1523L1604 162V381 M1604 558V779L1523 849H149L68 779V558 M68 381V162L149 91" stroke=${`url(#${ids.strokeGradientId})`} stroke-width="2.05" filter=${`url(#${ids.softGlowId})`} fill="transparent"></path>
        <path d="M149 849H580L590 845H614L631 829H760M912 829H1041L1059 845H1084L1092 849H1523" stroke=${`url(#${ids.strokeGradientId})`} stroke-width="2.05" filter=${`url(#${ids.softGlowId})`} fill="transparent"></path>

        <use href=${`#${ids.cornerId}`}></use>
        <use href=${`#${ids.cornerId}`} transform="translate(1672 0) scale(-1 1)"></use>
        <use href=${`#${ids.cornerId}`} transform="translate(0 941) scale(1 -1)"></use>
        <use href=${`#${ids.cornerId}`} transform="translate(1672 941) scale(-1 -1)"></use>

        <use href=${`#${ids.topCenterId}`}></use>
        <use href=${`#${ids.topCenterId}`} transform="translate(0 941) scale(1 -1)"></use>

        <path d="M238 91H556M1116 91H1434" stroke=${primary} stroke-width="1.25" opacity="0.42"></path>
        <path d="M238 849H556M1116 849H1434" stroke=${primary} stroke-width="1.25" opacity="0.42"></path>
        <path d="M146 91H584" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>
        <path d="M1089 91H1524" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>
        <path d="M146 849H584" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>
        <path d="M1089 849H1524" stroke=${accent} stroke-width="0.85" opacity="0.58"></path>

        <use href=${`#${ids.leftSideId}`}></use>
        <use href=${`#${ids.leftSideId}`} transform="translate(1672 0) scale(-1 1)"></use>

        <path d="M66 818V747L78 736V779L149 839H232L224 849H109L68 809Z" fill=${`url(#${ids.cornerGradientId})`} opacity="0.58" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M1606 818V747L1594 736V779L1523 839H1440L1448 849H1563L1604 809Z" fill=${`url(#${ids.cornerGradientId})`} opacity="0.58" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M66 122V193L78 204V162L149 102H232L224 91H109L68 131Z" fill=${`url(#${ids.cornerGradientId})`} opacity="0.37"></path>
        <path d="M1606 122V193L1594 204V162L1523 102H1440L1448 91H1563L1604 131Z" fill=${`url(#${ids.cornerGradientId})`} opacity="0.37"></path>

        <g opacity="0.66">
          <path d="M236 858V849M247 858V849M258 858V849M269 858V849M280 858V849M291 858V849" stroke=${secondary} stroke-width="2.2"></path>
          <path d="M1436 858V849M1425 858V849M1414 858V849M1403 858V849M1392 858V849M1381 858V849" stroke=${secondary} stroke-width="2.2"></path>
          <path d="M242 852H298M1374 852H1430" stroke=${secondary} stroke-width="1.3"></path>
        </g>

        <circle cx="99" cy="70" r="2.2" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.haloId})`} opacity="0.86"></circle>
        <circle cx="1573" cy="70" r="2.2" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.haloId})`} opacity="0.86"></circle>
        <circle cx="99" cy="869" r="2.2" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.haloId})`} opacity="0.86"></circle>
        <circle cx="1573" cy="869" r="2.2" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.haloId})`} opacity="0.86"></circle>

        <path d="M149.5 92.5H581L591 96.5H612.5L628.5 112.5H740 M932 112.5H1041.5L1058.5 96.5H1081L1091.5 92.5H1522.5L1602.5 162.5V778.5L1522.5 847.5H149.5L69.5 778.5V162.5L149.5 92.5" stroke="#a5e8ff" stroke-width="0.65" opacity="0.45" fill="transparent"></path>
        <path d="M149 91H580L590 95H614L631 111H760L769 107H903L912 111H1041L1059 95H1084L1092 91H1523L1604 162V779L1523 849H149L68 779V162Z" stroke=${`url(#${ids.dimGradientId})`} stroke-width="0.75" opacity="0.7" fill="transparent"></path>
      </g>
    `
  }

  private createSliceMetrics(): {
    scale: number
    cornerWidth: number
    topHeight: number
    bottomHeight: number
    centerLeft: number
    centerWidth: number
    topCenterTop: number
    topCenterHeight: number
    bottomCenterBottom: number
    bottomCenterHeight: number
    sideWidth: number
    sideDetailTop: number
    sideDetailHeight: number
    topLineTop: number
    topLineHeight: number
    topLeadingWidth: number
    topTrailingLeft: number
    topTrailingWidth: number
    bottomLineHeight: number
    bottomLeadingWidth: number
    bottomTrailingLeft: number
    bottomTrailingWidth: number
    leftLineLeft: number
    rightLineRight: number
    sideLineWidth: number
    sideUpperHeight: number
    sideLowerTop: number
    sideLowerHeight: number
  } {
    const scale = this.size.width > 0 ? this.size.width / contentViewBox.width : 1
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const cornerWidth = this.scaleValue(fixedSlices.topLeft.width, scale)
    const topHeight = this.scaleValue(fixedSlices.topLeft.height, scale)
    const bottomHeight = this.scaleValue(fixedSlices.bottomLeft.height, scale)
    const centerWidth = this.scaleValue(fixedSlices.topCenter.width, scale)
    const minCenterGap = this.scaleValue(16, scale)
    const centerLeft = this.clamp(
      this.sourceX(fixedSlices.topCenter.x, scale),
      cornerWidth + minCenterGap,
      Math.max(hostWidth - cornerWidth - centerWidth - minCenterGap, cornerWidth),
    )
    const sideDetailHeight = this.scaleValue(fixedSlices.leftDetail.height, scale)
    const sideExtensionTotal = Math.max(hostHeight - topHeight - bottomHeight - sideDetailHeight, 0)
    const sideUpperHeight = this.round(sideExtensionTotal / 2)
    const sideDetailTop = topHeight + sideUpperHeight
    const sideLowerTop = sideDetailTop + sideDetailHeight
    const bottomTop = Math.max(hostHeight - bottomHeight, 0)

    return {
      scale,
      cornerWidth,
      topHeight,
      bottomHeight,
      centerLeft,
      centerWidth,
      topCenterTop: this.sourceY(fixedSlices.topCenter.y, scale),
      topCenterHeight: this.scaleValue(fixedSlices.topCenter.height, scale),
      bottomCenterBottom: this.scaleValue(contentViewBox.y + contentViewBox.height - fixedSlices.bottomCenter.y - fixedSlices.bottomCenter.height, scale),
      bottomCenterHeight: this.scaleValue(fixedSlices.bottomCenter.height, scale),
      sideWidth: this.scaleValue(fixedSlices.leftDetail.width, scale),
      sideDetailTop,
      sideDetailHeight,
      topLineTop: this.sourceY(extensionSlices.topLeading.y, scale),
      topLineHeight: this.scaleValue(extensionSlices.topLeading.height, scale),
      topLeadingWidth: Math.max(centerLeft - cornerWidth, 0),
      topTrailingLeft: centerLeft + centerWidth,
      topTrailingWidth: Math.max(hostWidth - cornerWidth - centerLeft - centerWidth, 0),
      bottomLineHeight: this.scaleValue(extensionSlices.bottomLeading.height, scale),
      bottomLeadingWidth: Math.max(centerLeft - cornerWidth, 0),
      bottomTrailingLeft: centerLeft + centerWidth,
      bottomTrailingWidth: Math.max(hostWidth - cornerWidth - centerLeft - centerWidth, 0),
      leftLineLeft: this.sourceX(extensionSlices.leftUpper.x, scale),
      rightLineRight: this.scaleValue(contentViewBox.x + contentViewBox.width - extensionSlices.rightUpper.x - extensionSlices.rightUpper.width, scale),
      sideLineWidth: this.scaleValue(extensionSlices.leftUpper.width, scale),
      sideUpperHeight,
      sideLowerTop,
      sideLowerHeight: Math.max(bottomTop - sideLowerTop, 0),
    }
  }

  private scaleValue(value: number, scale: number): number {
    return this.round(Math.max(value * scale, value === 0 ? 0 : 1))
  }

  private sourceX(value: number, scale: number): number {
    return this.scaleValue(value - contentViewBox.x, scale)
  }

  private sourceY(value: number, scale: number): number {
    return this.scaleValue(value - contentViewBox.y, scale)
  }

  private clamp(value: number, min: number, max: number): number {
    return this.round(Math.min(Math.max(value, min), Math.max(min, max)))
  }

  private round(value: number): number {
    return Number(value.toFixed(2))
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
