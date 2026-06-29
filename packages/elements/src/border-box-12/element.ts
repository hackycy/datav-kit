import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

let borderBox12Id = 0

const contentViewBox = {
  x: 0,
  y: 0,
  width: 1600,
  height: 900,
}
const contentRect = {
  x: 112,
  y: 98,
  width: 1396,
  height: 704,
}
const defaultSize = {
  width: 0,
  height: 0,
}
const fixedSlices = {
  topLeft: { x: 0, y: 0, width: 360, height: 188 },
  topStatus: { x: 1010, y: 36, width: 360, height: 104 },
  topRight: { x: 1360, y: 0, width: 240, height: 188 },
  leftBus: { x: 0, y: 220, width: 132, height: 360 },
  bottomLeft: { x: 0, y: 720, width: 300, height: 180 },
  bottomChecksum: { x: 580, y: 776, width: 440, height: 88 },
  bottomRight: { x: 1360, y: 720, width: 240, height: 180 },
} satisfies Record<string, typeof contentViewBox>
const extensionSlices = {
  topRail: { x: 360, y: 50, width: 650, height: 78 },
  bottomLeading: { x: 300, y: 800, width: 280, height: 64 },
  bottomTrailing: { x: 1020, y: 800, width: 340, height: 64 },
  leftUpper: { x: 44, y: 188, width: 72, height: 32 },
  leftLower: { x: 44, y: 580, width: 72, height: 140 },
  rightReturn: { x: 1484, y: 188, width: 70, height: 532 },
} satisfies Record<string, typeof contentViewBox>

const shellPath = [
  'M72 122',
  'L72 96L120 48H312L342 66H958L986 92H1332L1356 70H1496L1530 104',
  'L1530 190L1508 212V688L1530 710V806L1492 844H1374L1348 828H1032L1010 848H590L568 828H302L276 844H114L72 802',
  'V708L94 686V584L76 562V222L94 202V122Z',
].join(' ')

const innerPath = [
  'M112 132',
  'L112 116L150 80H302L330 98H946L974 124H1322L1348 104H1460L1490 132',
  'L1490 182L1468 204V696L1490 718V776L1460 806H1364L1338 790H1042L1018 812H600L578 790H314L288 806H150L112 768',
  'V718L132 696V574L116 554V232L132 212V132Z',
].join(' ')

interface BorderBox12SvgIds {
  softGlowId: string
  hardGlowId: string
  nodeGlowId: string
  strokeGradientId: string
  busGradientId: string
  plateGradientId: string
  coreGradientId: string
  nodeGradientId: string
}

export class BorderBox12Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #43d7ff);
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
      z-index: 2;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      padding: var(--dv-border-box-12-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    .glow-layer {
      opacity: var(--dv-border-box-12-glow-opacity, 1);
    }

    @media (prefers-reduced-motion: reduce) {
      animate,
      animateMotion {
        display: none;
      }
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

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly instanceId = ++borderBox12Id
  private readonly softGlowId = `dv-border-box-12-soft-glow-${this.instanceId}`
  private readonly hardGlowId = `dv-border-box-12-hard-glow-${this.instanceId}`
  private readonly nodeGlowId = `dv-border-box-12-node-glow-${this.instanceId}`
  private readonly strokeGradientId = `dv-border-box-12-stroke-${this.instanceId}`
  private readonly busGradientId = `dv-border-box-12-bus-${this.instanceId}`
  private readonly plateGradientId = `dv-border-box-12-plate-${this.instanceId}`
  private readonly coreGradientId = `dv-border-box-12-core-${this.instanceId}`
  private readonly nodeGradientId = `dv-border-box-12-node-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-12' })
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
      minInline: 16,
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
    metrics: ReturnType<BorderBox12Element['createSliceMetrics']>,
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
          name: 'top-status',
          rect: fixedSlices.topStatus,
          style: `left: ${metrics.topStatusLeft}px; top: ${metrics.topStatusTop}px; width: ${metrics.topStatusWidth}px; height: ${metrics.topStatusHeight}px`,
          width: metrics.topStatusWidth,
          height: metrics.topStatusHeight,
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
          name: 'left-bus',
          rect: fixedSlices.leftBus,
          style: `left: 0; top: ${metrics.leftBusTop}px; width: ${metrics.leftBusWidth}px; height: ${metrics.leftBusHeight}px`,
          width: metrics.leftBusWidth,
          height: metrics.leftBusHeight,
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
          name: 'bottom-checksum',
          rect: fixedSlices.bottomChecksum,
          style: `left: ${metrics.bottomChecksumLeft}px; bottom: ${metrics.bottomChecksumBottom}px; width: ${metrics.bottomChecksumWidth}px; height: ${metrics.bottomChecksumHeight}px`,
          width: metrics.bottomChecksumWidth,
          height: metrics.bottomChecksumHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-right',
          rect: fixedSlices.bottomRight,
          style: `right: 0; bottom: 0; width: ${metrics.topRightWidth}px; height: ${metrics.bottomHeight}px`,
          width: metrics.topRightWidth,
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
    metrics: ReturnType<BorderBox12Element['createSliceMetrics']>,
  ): unknown {
    return html`
      ${this.renderTile({
        name: 'top-rail',
        rect: extensionSlices.topRail,
        style: `left: ${metrics.topLeftWidth}px; top: ${metrics.topRailTop}px; width: ${metrics.topRailWidth}px; height: ${metrics.topRailHeight}px`,
        width: metrics.topRailWidth,
        height: metrics.topRailHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-leading',
        rect: extensionSlices.bottomLeading,
        style: `left: ${metrics.bottomLeftWidth}px; bottom: ${metrics.bottomRailBottom}px; width: ${metrics.bottomLeadingWidth}px; height: ${metrics.bottomRailHeight}px`,
        width: metrics.bottomLeadingWidth,
        height: metrics.bottomRailHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-trailing',
        rect: extensionSlices.bottomTrailing,
        style: `left: ${metrics.bottomTrailingLeft}px; bottom: ${metrics.bottomRailBottom}px; width: ${metrics.bottomTrailingWidth}px; height: ${metrics.bottomRailHeight}px`,
        width: metrics.bottomTrailingWidth,
        height: metrics.bottomRailHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'left-upper',
        rect: extensionSlices.leftUpper,
        style: `left: ${metrics.leftLineLeft}px; top: ${metrics.topHeight}px; width: ${metrics.leftLineWidth}px; height: ${metrics.leftUpperHeight}px`,
        width: metrics.leftLineWidth,
        height: metrics.leftUpperHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'left-lower',
        rect: extensionSlices.leftLower,
        style: `left: ${metrics.leftLineLeft}px; top: ${metrics.leftLowerTop}px; width: ${metrics.leftLineWidth}px; height: ${metrics.leftLowerHeight}px`,
        width: metrics.leftLineWidth,
        height: metrics.leftLowerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'right-return',
        rect: extensionSlices.rightReturn,
        style: `right: ${metrics.rightLineRight}px; top: ${metrics.topHeight}px; width: ${metrics.rightLineWidth}px; height: ${metrics.rightLineHeight}px`,
        width: metrics.rightLineWidth,
        height: metrics.rightLineHeight,
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
          <defs>${this.renderDefs(options.primary, options.secondary, options.accent, options.glowIntensity, ids)}</defs>
          ${this.renderFrame(options.name, options.primary, options.secondary, options.accent, ids)}
        </svg>
      </div>
    `
  }

  private createSvgIds(suffix: string): BorderBox12SvgIds {
    return {
      softGlowId: `${this.softGlowId}-${suffix}`,
      hardGlowId: `${this.hardGlowId}-${suffix}`,
      nodeGlowId: `${this.nodeGlowId}-${suffix}`,
      strokeGradientId: `${this.strokeGradientId}-${suffix}`,
      busGradientId: `${this.busGradientId}-${suffix}`,
      plateGradientId: `${this.plateGradientId}-${suffix}`,
      coreGradientId: `${this.coreGradientId}-${suffix}`,
      nodeGradientId: `${this.nodeGradientId}-${suffix}`,
    }
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number, ids: BorderBox12SvgIds): unknown {
    return svg`
      <linearGradient id=${ids.strokeGradientId} x1="72" y1="0" x2="1530" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${primary} stop-opacity="0.94"></stop>
        <stop offset="0.32" stop-color=${primary} stop-opacity="0.72"></stop>
        <stop offset="0.68" stop-color=${secondary} stop-opacity="0.52"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.84"></stop>
      </linearGradient>
      <linearGradient id=${ids.busGradientId} x1="0" y1="220" x2="0" y2="580" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${primary} stop-opacity="0.92"></stop>
        <stop offset="0.46" stop-color=${secondary} stop-opacity="0.58"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.32"></stop>
      </linearGradient>
      <linearGradient id=${ids.plateGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${primary} stop-opacity="0.2"></stop>
        <stop offset="0.48" stop-color=${secondary} stop-opacity="0.1"></stop>
        <stop offset="1" stop-color="#020b14" stop-opacity="0.04"></stop>
      </linearGradient>
      <linearGradient id=${ids.coreGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${accent} stop-opacity="0"></stop>
        <stop offset="0.22" stop-color=${accent} stop-opacity="0.62"></stop>
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.96"></stop>
        <stop offset="0.78" stop-color=${accent} stop-opacity="0.62"></stop>
        <stop offset="1" stop-color=${accent} stop-opacity="0"></stop>
      </linearGradient>
      <radialGradient id=${ids.nodeGradientId} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffffff"></stop>
        <stop offset="0.36" stop-color=${accent}></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0"></stop>
      </radialGradient>
      <filter id=${ids.softGlowId} x="-120" y="-120" width="1840" height="1140" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(1.8 * glowIntensity)} result="blur1"></feGaussianBlur>
        <feGaussianBlur stdDeviation=${String(6.2 * glowIntensity)} result="blur2"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur2"></feMergeNode>
          <feMergeNode in="blur1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <filter id=${ids.hardGlowId} x="-120" y="-120" width="1840" height="1140" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(0.85 * glowIntensity)} result="hard1"></feGaussianBlur>
        <feGaussianBlur stdDeviation=${String(3.6 * glowIntensity)} result="hard2"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="hard2"></feMergeNode>
          <feMergeNode in="hard1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <filter id=${ids.nodeGlowId} x="-32" y="-32" width="64" height="64" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation=${String(4.2 * glowIntensity)} result="nodeBlur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="nodeBlur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderFrame(sliceName: string, primary: string, secondary: string, accent: string, ids: BorderBox12SvgIds): unknown {
    const renderTopCharge = sliceName === 'top-rail'
    const renderLeftCharge = sliceName === 'left-bus'
    const renderStatusPulse = sliceName === 'top-status'

    return svg`
      <g class="glow-layer" fill="transparent" stroke-linecap="round" stroke-linejoin="round">
        <path d=${shellPath} stroke=${secondary} stroke-width="10" opacity="0.1" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d=${shellPath} stroke=${`url(#${ids.strokeGradientId})`} stroke-width="2" filter=${`url(#${ids.softGlowId})`}></path>
        <path d=${innerPath} stroke=${primary} stroke-width="0.85" opacity="0.58"></path>

        <path d="M88 162V98L128 58H306L336 76H454" fill=${`url(#${ids.plateGradientId})`} stroke=${primary} stroke-width="1.55" opacity="0.9" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M124 124L158 90H310M150 70H284M174 108H320" stroke="#eefcff" stroke-width="0.9" opacity="0.68"></path>
        <path d="M158 126H328M158 142H284M158 158H304" stroke=${secondary} stroke-width="1" opacity="0.42"></path>
        <path d="M342 66H958L986 92H1010" stroke=${primary} stroke-width="1.35" opacity="0.62"></path>
        <path d="M386 82H902" stroke=${secondary} stroke-width="0.9" stroke-dasharray="22 14" opacity="0.5"></path>
        <path d="M408 104H670" stroke=${`url(#${ids.coreGradientId})`} stroke-width="5.5" opacity="0.66" filter=${`url(#${ids.hardGlowId})`}></path>

        <path d="M1018 82H1094L1116 58H1322L1344 82H1360L1334 118H1042Z" fill=${`url(#${ids.plateGradientId})`} stroke=${primary} stroke-width="1.45" opacity="0.86" filter=${`url(#${ids.softGlowId})`}></path>
        <path class="status-core" d="M1062 82H1294" stroke=${`url(#${ids.coreGradientId})`} stroke-width="6" opacity="0.76" filter=${`url(#${ids.hardGlowId})`}>
          ${this.animated && !this.paused && renderStatusPulse
            ? svg`<animate attributeName="opacity" values="0.34;0.88;0.34" dur="3.8s" repeatCount="indefinite"></animate>`
            : null}
        </path>
        <path d="M1082 102H1154M1210 102H1284" stroke=${secondary} stroke-width="1" stroke-dasharray="10 8" opacity="0.62"></path>
        ${this.renderDots([1168, 1184, 1200], 102, accent)}

        <path d="M1360 82H1494L1530 118V188" stroke=${primary} stroke-width="1.35" opacity="0.72"></path>
        <path d="M1398 104H1482M1412 124H1460" stroke=${secondary} stroke-width="0.9" opacity="0.44"></path>

        <path d="M94 222V580" stroke=${`url(#${ids.busGradientId})`} stroke-width="6" opacity="0.56" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M122 238V330M122 466V562" stroke=${secondary} stroke-width="1.2" opacity="0.68"></path>
        <path d="M54 260H112M62 298H102M54 336H112M62 374H102M54 412H112M62 450H102M54 488H112M62 526H102" stroke=${primary} stroke-width="1.75" opacity="0.6"></path>
        <path d="M76 222L100 246M76 580L100 556" stroke=${accent} stroke-width="1.25" opacity="0.72"></path>
        <circle cx="94" cy="222" r="3.4" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.nodeGlowId})`}></circle>
        <circle cx="94" cy="580" r="3.4" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.nodeGlowId})`}></circle>

        <path d="M1508 212V688" stroke=${secondary} stroke-width="1.4" opacity="0.42"></path>
        <path d="M1484 266H1532M1484 450H1516M1484 634H1532" stroke=${primary} stroke-width="1.25" opacity="0.36"></path>

        <path d="M276 844H114L72 802V708" stroke=${primary} stroke-width="1.25" opacity="0.62"></path>
        <path d="M302 828H568L590 848" stroke=${secondary} stroke-width="1.05" opacity="0.48"></path>
        <path d="M580 828H660L676 808H924L940 828H1020" stroke=${primary} stroke-width="1.5" opacity="0.78" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M692 834H908" stroke=${`url(#${ids.coreGradientId})`} stroke-width="5.4" opacity="0.62" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d="M636 816L620 832M666 816L650 832M950 816L980 832M920 816L950 832" stroke=${accent} stroke-width="1.35" opacity="0.68"></path>
        ${this.renderDots([728, 744, 760, 776, 792, 808], 824, accent)}
        <path d="M1032 828H1348M1010 848H590" stroke=${secondary} stroke-width="0.95" stroke-dasharray="18 13" opacity="0.42"></path>
        <path d="M1348 828L1374 844H1492L1530 806V710" stroke=${primary} stroke-width="1.25" opacity="0.56"></path>

        <g filter=${`url(#${ids.nodeGlowId})`}>
          <circle cx="128" cy="58" r="3.2" fill=${accent}></circle>
          <circle cx="336" cy="76" r="2.5" fill=${primary}></circle>
          <circle cx="986" cy="92" r="2.6" fill=${primary}></circle>
          <circle cx="1344" cy="82" r="2.7" fill=${accent}></circle>
          <circle cx="676" cy="808" r="2.6" fill=${primary}></circle>
          <circle cx="940" cy="828" r="2.6" fill=${primary}></circle>
        </g>

        ${this.animated && !this.paused && renderTopCharge
          ? svg`
              <circle r="3.4" fill="#ffffff" opacity="0.86" filter=${`url(#${ids.nodeGlowId})`}>
                <animateMotion dur="5.2s" repeatCount="indefinite" path="M150 90H930L986 92"></animateMotion>
              </circle>
            `
          : null}
        ${this.animated && !this.paused && renderLeftCharge
          ? svg`
              <circle r="2.8" fill=${accent} opacity="0.78" filter=${`url(#${ids.nodeGlowId})`}>
                <animateMotion dur="4.6s" repeatCount="indefinite" path="M94 238V562"></animateMotion>
              </circle>
            `
          : null}
      </g>
    `
  }

  private createSliceMetrics(): {
    scale: number
    topLeftWidth: number
    topRightWidth: number
    topHeight: number
    topStatusLeft: number
    topStatusTop: number
    topStatusWidth: number
    topStatusHeight: number
    topRailTop: number
    topRailHeight: number
    topRailWidth: number
    leftBusWidth: number
    leftBusTop: number
    leftBusHeight: number
    bottomLeftWidth: number
    bottomHeight: number
    bottomChecksumLeft: number
    bottomChecksumWidth: number
    bottomChecksumBottom: number
    bottomChecksumHeight: number
    bottomRailBottom: number
    bottomRailHeight: number
    bottomLeadingWidth: number
    bottomTrailingLeft: number
    bottomTrailingWidth: number
    leftLineLeft: number
    leftLineWidth: number
    leftUpperHeight: number
    leftLowerTop: number
    leftLowerHeight: number
    rightLineRight: number
    rightLineWidth: number
    rightLineHeight: number
  } {
    const widthScale = this.size.width > 0 ? this.size.width / contentViewBox.width : 1
    const heightScale = this.size.height > 0 ? this.size.height / contentViewBox.height : widthScale
    const scale = Math.min(widthScale, heightScale)
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const topLeftWidth = this.scaleValue(fixedSlices.topLeft.width, scale)
    const topRightWidth = this.scaleValue(fixedSlices.topRight.width, scale)
    const topHeight = this.scaleValue(fixedSlices.topLeft.height, scale)
    const bottomLeftWidth = this.scaleValue(fixedSlices.bottomLeft.width, scale)
    const bottomHeight = this.scaleValue(fixedSlices.bottomLeft.height, scale)
    const topStatusWidth = this.scaleValue(fixedSlices.topStatus.width, scale)
    const bottomChecksumWidth = this.scaleValue(fixedSlices.bottomChecksum.width, scale)
    const minGap = this.scaleValue(12, scale)
    const topStatusLeft = this.clamp(
      this.sourceX(fixedSlices.topStatus.x, scale),
      topLeftWidth + minGap,
      Math.max(hostWidth - topRightWidth - topStatusWidth - minGap, topLeftWidth),
    )
    const bottomChecksumLeft = this.clamp(
      this.sourceX(fixedSlices.bottomChecksum.x, scale),
      bottomLeftWidth + minGap,
      Math.max(hostWidth - topRightWidth - bottomChecksumWidth - minGap, bottomLeftWidth),
    )
    const leftBusHeight = this.scaleValue(fixedSlices.leftBus.height, scale)
    const leftBusTop = this.clamp(
      this.sourceY(fixedSlices.leftBus.y, scale),
      topHeight,
      Math.max(hostHeight - bottomHeight - leftBusHeight, topHeight),
    )
    const leftLowerTop = leftBusTop + leftBusHeight

    return {
      scale,
      topLeftWidth,
      topRightWidth,
      topHeight,
      topStatusLeft,
      topStatusTop: this.sourceY(fixedSlices.topStatus.y, scale),
      topStatusWidth,
      topStatusHeight: this.scaleValue(fixedSlices.topStatus.height, scale),
      topRailTop: this.sourceY(extensionSlices.topRail.y, scale),
      topRailHeight: this.scaleValue(extensionSlices.topRail.height, scale),
      topRailWidth: Math.max(topStatusLeft - topLeftWidth, 0),
      leftBusWidth: this.scaleValue(fixedSlices.leftBus.width, scale),
      leftBusTop,
      leftBusHeight,
      bottomLeftWidth,
      bottomHeight,
      bottomChecksumLeft,
      bottomChecksumWidth,
      bottomChecksumBottom: this.scaleValue(contentViewBox.y + contentViewBox.height - fixedSlices.bottomChecksum.y - fixedSlices.bottomChecksum.height, scale),
      bottomChecksumHeight: this.scaleValue(fixedSlices.bottomChecksum.height, scale),
      bottomRailBottom: this.scaleValue(contentViewBox.y + contentViewBox.height - extensionSlices.bottomLeading.y - extensionSlices.bottomLeading.height, scale),
      bottomRailHeight: this.scaleValue(extensionSlices.bottomLeading.height, scale),
      bottomLeadingWidth: Math.max(bottomChecksumLeft - bottomLeftWidth, 0),
      bottomTrailingLeft: bottomChecksumLeft + bottomChecksumWidth,
      bottomTrailingWidth: Math.max(hostWidth - topRightWidth - bottomChecksumLeft - bottomChecksumWidth, 0),
      leftLineLeft: this.sourceX(extensionSlices.leftUpper.x, scale),
      leftLineWidth: this.scaleValue(extensionSlices.leftUpper.width, scale),
      leftUpperHeight: Math.max(leftBusTop - topHeight, 0),
      leftLowerTop,
      leftLowerHeight: Math.max(hostHeight - bottomHeight - leftLowerTop, 0),
      rightLineRight: this.scaleValue(contentViewBox.x + contentViewBox.width - extensionSlices.rightReturn.x - extensionSlices.rightReturn.width, scale),
      rightLineWidth: this.scaleValue(extensionSlices.rightReturn.width, scale),
      rightLineHeight: Math.max(hostHeight - topHeight - bottomHeight, 0),
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
      const radius = index % 3 === 1 ? 2.2 : 1.8
      return svg`<circle cx=${String(x)} cy=${String(y)} r=${String(radius)} fill=${fill}></circle>`
    })
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#43d7ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#2c7bf2',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dv-color-accent',
      host: this,
      fallback: '#f6d56a',
    })

    return [primary, secondary, accent]
  }
}
