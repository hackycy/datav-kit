import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

let borderBox2Id = 0

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
const fixedSlices = {
  topLeft: { x: 48, y: 48, width: 477, height: 210 },
  topCenter: { x: 575, y: 88, width: 455, height: 70 },
  topRight: { x: 1075, y: 48, width: 477, height: 210 },
  leftDetail: { x: 48, y: 290, width: 132, height: 306 },
  rightDetail: { x: 1420, y: 290, width: 132, height: 306 },
  bottomLeft: { x: 48, y: 642, width: 477, height: 210 },
  bottomCenter: { x: 575, y: 750, width: 455, height: 70 },
  bottomRight: { x: 1075, y: 642, width: 477, height: 210 },
} satisfies Record<string, typeof contentViewBox>
const extensionSlices = {
  topLeading: { x: 525, y: 88, width: 50, height: 70 },
  topTrailing: { x: 1030, y: 88, width: 45, height: 70 },
  bottomLeading: { x: 525, y: 750, width: 50, height: 70 },
  bottomTrailing: { x: 1030, y: 750, width: 45, height: 70 },
  leftUpper: { x: 48, y: 258, width: 132, height: 32 },
  leftLower: { x: 48, y: 596, width: 132, height: 46 },
  rightUpper: { x: 1420, y: 258, width: 132, height: 32 },
  rightLower: { x: 1420, y: 596, width: 132, height: 46 },
} satisfies Record<string, typeof contentViewBox>

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

interface BorderBox2SvgIds {
  glowId: string
  strongGlowId: string
  lineGradientId: string
  panelGradientId: string
  barGradientId: string
  slashId: string
}

export class BorderBox2Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #0af2ff);
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
      height: 100%;
      min-height: 0;
      overflow: hidden;
      padding: var(--dv-border-box-2-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
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
    const metrics = this.createSliceMetrics()
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: this.size.width,
      hostHeight: this.size.height,
      viewBox: contentViewBox,
      contentRect,
      minBlock: 14,
      minInline: 18,
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
    metrics: ReturnType<BorderBox2Element['createSliceMetrics']>,
  ): unknown {
    return html`
      <div part="frame" class="frame frame--sliced">
        ${this.renderExtensionStrips(primary, secondary, accent, glowIntensity, metrics)}
        ${this.renderTile({
          name: 'top-left',
          rect: fixedSlices.topLeft,
          style: `left: 0; top: 0; width: ${metrics.topLeftWidth}px; height: ${metrics.topHeight}px`,
          width: metrics.topLeftWidth,
          height: metrics.topHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'top-center',
          rect: fixedSlices.topCenter,
          style: `left: ${metrics.centerLeft}px; top: ${metrics.topCenterTop}px; width: ${metrics.centerWidth}px; height: ${metrics.centerHeight}px`,
          width: metrics.centerWidth,
          height: metrics.centerHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'top-right',
          rect: fixedSlices.topRight,
          style: `right: 0; top: 0; width: ${metrics.topRightWidth}px; height: ${metrics.topHeight}px`,
          width: metrics.topRightWidth,
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
          style: `left: 0; bottom: 0; width: ${metrics.bottomLeftWidth}px; height: ${metrics.bottomHeight}px`,
          width: metrics.bottomLeftWidth,
          height: metrics.bottomHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-center',
          rect: fixedSlices.bottomCenter,
          style: `left: ${metrics.centerLeft}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.centerWidth}px; height: ${metrics.centerHeight}px`,
          width: metrics.centerWidth,
          height: metrics.centerHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-right',
          rect: fixedSlices.bottomRight,
          style: `right: 0; bottom: 0; width: ${metrics.bottomRightWidth}px; height: ${metrics.bottomHeight}px`,
          width: metrics.bottomRightWidth,
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
    metrics: ReturnType<BorderBox2Element['createSliceMetrics']>,
  ): unknown {
    return html`
      ${this.renderTile({
        name: 'top-leading',
        rect: extensionSlices.topLeading,
        style: `left: ${metrics.topLeftWidth}px; top: ${metrics.topCenterTop}px; width: ${metrics.topLeadingWidth}px; height: ${metrics.centerHeight}px`,
        width: metrics.topLeadingWidth,
        height: metrics.centerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'top-trailing',
        rect: extensionSlices.topTrailing,
        style: `left: ${metrics.topTrailingLeft}px; top: ${metrics.topCenterTop}px; width: ${metrics.topTrailingWidth}px; height: ${metrics.centerHeight}px`,
        width: metrics.topTrailingWidth,
        height: metrics.centerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-leading',
        rect: extensionSlices.bottomLeading,
        style: `left: ${metrics.bottomLeftWidth}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.bottomLeadingWidth}px; height: ${metrics.centerHeight}px`,
        width: metrics.bottomLeadingWidth,
        height: metrics.centerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-trailing',
        rect: extensionSlices.bottomTrailing,
        style: `left: ${metrics.bottomTrailingLeft}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.bottomTrailingWidth}px; height: ${metrics.centerHeight}px`,
        width: metrics.bottomTrailingWidth,
        height: metrics.centerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'left-upper',
        rect: extensionSlices.leftUpper,
        style: `left: 0; top: ${metrics.topHeight}px; width: ${metrics.sideWidth}px; height: ${metrics.sideUpperHeight}px`,
        width: metrics.sideWidth,
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
        style: `left: 0; top: ${metrics.sideLowerTop}px; width: ${metrics.sideWidth}px; height: ${metrics.sideLowerHeight}px`,
        width: metrics.sideWidth,
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
        style: `right: 0; top: ${metrics.topHeight}px; width: ${metrics.sideWidth}px; height: ${metrics.sideUpperHeight}px`,
        width: metrics.sideWidth,
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
        style: `right: 0; top: ${metrics.sideLowerTop}px; width: ${metrics.sideWidth}px; height: ${metrics.sideLowerHeight}px`,
        width: metrics.sideWidth,
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
          </defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, ids)}
        </svg>
      </div>
    `
  }

  private createSvgIds(suffix: string): BorderBox2SvgIds {
    return {
      glowId: `${this.glowId}-${suffix}`,
      strongGlowId: `${this.strongGlowId}-${suffix}`,
      lineGradientId: `${this.lineGradientId}-${suffix}`,
      panelGradientId: `${this.panelGradientId}-${suffix}`,
      barGradientId: `${this.barGradientId}-${suffix}`,
      slashId: `${this.slashId}-${suffix}`,
    }
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number, ids: BorderBox2SvgIds): unknown {
    return svg`
      <filter id=${ids.glowId} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation=${String(3 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${ids.strongGlowId} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation=${String(8 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <linearGradient id=${ids.lineGradientId} x1="0" y1="0" x2="1600" y2="0">
        <stop offset="0%" stop-color=${primary}></stop>
        <stop offset="45%" stop-color=${secondary}></stop>
        <stop offset="55%" stop-color=${accent}></stop>
        <stop offset="100%" stop-color=${primary}></stop>
      </linearGradient>

      <linearGradient id=${ids.panelGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color=${secondary} stop-opacity="0.8"></stop>
        <stop offset="100%" stop-color=${accent} stop-opacity="0.25"></stop>
      </linearGradient>

      <linearGradient id=${ids.barGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color=${primary}></stop>
        <stop offset="65%" stop-color=${secondary}></stop>
        <stop offset="100%" stop-color=${accent}></stop>
      </linearGradient>

      <g id=${ids.slashId}>
        <path d="M0 14 L8 0 H18 L10 14 Z" fill=${primary}></path>
      </g>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, ids: BorderBox2SvgIds): unknown {
    return svg`
      <path
        d=${outerPath}
        stroke=${`url(#${ids.lineGradientId})`}
        stroke-width="2"
        fill="transparent"
        filter=${`url(#${ids.glowId})`}
        class="outer-line"
      ></path>

      <path d=${innerPath} stroke=${secondary} stroke-width="1" opacity="0.9" fill="transparent"></path>

      <g filter=${`url(#${ids.glowId})`}>
        <path d="M65 105 L105 65 H210 L185 100 H120 L95 125 V220 L65 190 Z" fill=${`url(#${ids.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M95 125 L130 90 H195" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>

        <path d="M1535 105 L1495 65 H1390 L1415 100 H1480 L1505 125 V220 L1535 190 Z" fill=${`url(#${ids.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M1505 125 L1470 90 H1405" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>

        <path d="M65 795 L105 835 H210 L185 800 H120 L95 775 V680 L65 710 Z" fill=${`url(#${ids.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M95 775 L130 810 H195" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>

        <path d="M1535 795 L1495 835 H1390 L1415 800 H1480 L1505 775 V680 L1535 710 Z" fill=${`url(#${ids.panelGradientId})`} stroke=${primary} stroke-width="2"></path>
        <path d="M1505 775 L1470 810 H1405" stroke="#e9f7ff" stroke-width="5" stroke-linecap="round"></path>
      </g>

      <g filter=${`url(#${ids.strongGlowId})`}>
        ${this.renderCornerNode(145, 175, 'M20 -5 L55 -40', primary, secondary)}
        ${this.renderCornerNode(1455, 175, 'M-20 -5 L-55 -40', primary, secondary)}
        ${this.renderCornerNode(145, 735, 'M20 5 L55 40', primary, secondary)}
        ${this.renderCornerNode(1455, 735, 'M-20 5 L-55 40', primary, secondary)}
      </g>

      ${this.renderEnergyBar(112, secondary, ids)}
      ${this.renderEnergyBar(764, secondary, ids)}

      <g filter=${`url(#${ids.glowId})`} opacity="0.95">
        <g transform="translate(205 118)">${this.renderSlashUses(5, ids)}</g>
        <g transform="translate(1320 118)">${this.renderSlashUses(5, ids)}</g>
        <g transform="translate(205 782)">${this.renderSlashUses(5, ids)}</g>
        <g transform="translate(1320 782)">${this.renderSlashUses(5, ids)}</g>
      </g>

      <g filter=${`url(#${ids.glowId})`}>
        <g transform="translate(110 290)">${this.renderRects(9, 6, 3, 10, primary)}</g>
        <g transform="translate(1484 290)">${this.renderRects(9, 6, 3, 10, primary)}</g>
        <g transform="translate(100 510)">${this.renderRects(6, 12, 6, 16, primary)}</g>
        <g transform="translate(1488 510)">${this.renderRects(6, 12, 6, 16, secondary)}</g>
      </g>

      <g filter=${`url(#${ids.glowId})`}>
        <path d="M138 430 L154 430 L146 444 Z" fill=${primary}></path>
        <path d="M138 448 L154 448 L146 462 Z" fill=${secondary}></path>
        <path d="M138 466 L154 466 L146 480 Z" fill=${primary}></path>

        <path d="M1462 430 L1446 430 L1454 444 Z" fill=${primary}></path>
        <path d="M1462 448 L1446 448 L1454 462 Z" fill=${secondary}></path>
        <path d="M1462 466 L1446 466 L1454 480 Z" fill=${primary}></path>
      </g>

      <g filter=${`url(#${ids.strongGlowId})`}>
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

      <g filter=${`url(#${ids.glowId})`} opacity="0.9">
        <path d="M82 210 L98 230 V255 L82 240 Z" fill=${accent}></path>
        <path d="M1518 210 L1502 230 V255 L1518 240 Z" fill=${accent}></path>
        <path d="M82 690 L98 670 V645 L82 660 Z" fill=${accent}></path>
        <path d="M1518 690 L1502 670 V645 L1518 660 Z" fill=${accent}></path>
      </g>
    `
  }

  private createSliceMetrics(): {
    scale: number
    topLeftWidth: number
    topRightWidth: number
    topHeight: number
    centerLeft: number
    centerWidth: number
    centerHeight: number
    topCenterTop: number
    bottomCenterBottom: number
    topLeadingWidth: number
    topTrailingLeft: number
    topTrailingWidth: number
    bottomLeftWidth: number
    bottomRightWidth: number
    bottomHeight: number
    bottomLeadingWidth: number
    bottomTrailingLeft: number
    bottomTrailingWidth: number
    sideWidth: number
    sideDetailTop: number
    sideDetailHeight: number
    sideUpperHeight: number
    sideLowerTop: number
    sideLowerHeight: number
  } {
    const widthScale = this.size.width > 0 ? this.size.width / contentViewBox.width : 1
    const heightScale = this.size.height > 0 ? this.size.height / contentViewBox.height : widthScale
    const scale = Math.min(widthScale, heightScale)
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const topLeftWidth = this.scaleValue(fixedSlices.topLeft.width, scale)
    const topRightWidth = this.scaleValue(fixedSlices.topRight.width, scale)
    const centerWidth = this.scaleValue(fixedSlices.topCenter.width, scale)
    const horizontalExtensionTotal = Math.max(hostWidth - topLeftWidth - centerWidth - topRightWidth, 0)
    const topLeadingWidth = this.round(horizontalExtensionTotal * extensionSlices.topLeading.width / (extensionSlices.topLeading.width + extensionSlices.topTrailing.width))
    const topTrailingWidth = Math.max(this.round(horizontalExtensionTotal - topLeadingWidth), 0)
    const topHeight = this.scaleValue(fixedSlices.topLeft.height, scale)
    const bottomHeight = this.scaleValue(fixedSlices.bottomLeft.height, scale)
    const sideDetailHeight = this.scaleValue(fixedSlices.leftDetail.height, scale)
    const verticalExtensionTotal = Math.max(hostHeight - topHeight - sideDetailHeight - bottomHeight, 0)
    const sideUpperHeight = this.round(verticalExtensionTotal * extensionSlices.leftUpper.height / (extensionSlices.leftUpper.height + extensionSlices.leftLower.height))
    const sideLowerHeight = Math.max(this.round(verticalExtensionTotal - sideUpperHeight), 0)
    const centerLeft = topLeftWidth + topLeadingWidth
    const topTrailingLeft = centerLeft + centerWidth
    const sideDetailTop = topHeight + sideUpperHeight
    const sideLowerTop = sideDetailTop + sideDetailHeight

    return {
      scale,
      topLeftWidth,
      topRightWidth,
      topHeight,
      centerLeft,
      centerWidth,
      centerHeight: this.scaleValue(fixedSlices.topCenter.height, scale),
      topCenterTop: this.sourceY(fixedSlices.topCenter.y, scale),
      bottomCenterBottom: this.scaleValue(contentViewBox.y + contentViewBox.height - fixedSlices.bottomCenter.y - fixedSlices.bottomCenter.height, scale),
      topLeadingWidth,
      topTrailingLeft,
      topTrailingWidth,
      bottomLeftWidth: topLeftWidth,
      bottomRightWidth: topRightWidth,
      bottomHeight,
      bottomLeadingWidth: topLeadingWidth,
      bottomTrailingLeft: topTrailingLeft,
      bottomTrailingWidth: topTrailingWidth,
      sideWidth: this.scaleValue(fixedSlices.leftDetail.width, scale),
      sideDetailTop,
      sideDetailHeight,
      sideUpperHeight,
      sideLowerTop,
      sideLowerHeight,
    }
  }

  private scaleValue(value: number, scale: number): number {
    return this.round(Math.max(value * scale, value === 0 ? 0 : 1))
  }

  private sourceY(value: number, scale: number): number {
    return this.scaleValue(value - contentViewBox.y, scale)
  }

  private round(value: number): number {
    return Number(value.toFixed(2))
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

  private renderEnergyBar(y: number, secondary: string, ids: BorderBox2SvgIds): unknown {
    return svg`
      <g transform=${`translate(670 ${y})`} filter=${`url(#${ids.glowId})`}>
        <path d="M0 24 L20 0 H260 L280 24 Z" stroke=${secondary} stroke-width="2" fill="#061a3a"></path>
        <g transform="translate(28 8)">${this.renderSlashUses(12, ids)}</g>
        <rect x="28" y="8" width="226" height="14" fill=${`url(#${ids.barGradientId})`} opacity="0.35"></rect>
      </g>
    `
  }

  private renderSlashUses(count: number, ids: BorderBox2SvgIds): unknown[] {
    return Array.from({ length: count }, (_, index) => {
      return svg`<use href=${`#${ids.slashId}`} x=${String(index * 18)}></use>`
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
