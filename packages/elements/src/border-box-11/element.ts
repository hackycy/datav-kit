import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

let borderBox11Id = 0

const contentViewBox = {
  x: 0,
  y: 0,
  width: 1600,
  height: 900,
}
const contentRect = {
  x: 142,
  y: 122,
  width: 1316,
  height: 656,
}
const defaultSize = {
  width: 0,
  height: 0,
}
const fixedSlices = {
  topLeft: { x: 0, y: 0, width: 330, height: 210 },
  topCenter: { x: 640, y: 42, width: 320, height: 96 },
  topRight: { x: 1270, y: 0, width: 330, height: 210 },
  leftDetail: { x: 0, y: 300, width: 128, height: 300 },
  rightDetail: { x: 1472, y: 300, width: 128, height: 300 },
  bottomLeft: { x: 0, y: 690, width: 330, height: 210 },
  bottomCenter: { x: 600, y: 774, width: 400, height: 96 },
  bottomRight: { x: 1270, y: 690, width: 330, height: 210 },
} satisfies Record<string, typeof contentViewBox>
const extensionSlices = {
  topLeading: { x: 330, y: 42, width: 310, height: 96 },
  topTrailing: { x: 960, y: 42, width: 310, height: 96 },
  bottomLeading: { x: 330, y: 774, width: 270, height: 96 },
  bottomTrailing: { x: 1000, y: 774, width: 270, height: 96 },
  leftUpper: { x: 44, y: 210, width: 84, height: 90 },
  leftLower: { x: 44, y: 600, width: 84, height: 90 },
  rightUpper: { x: 1472, y: 210, width: 84, height: 90 },
  rightLower: { x: 1472, y: 600, width: 84, height: 90 },
} satisfies Record<string, typeof contentViewBox>

const shellPath = [
  'M70 88',
  'L112 46H246L270 62H585L610 84H665L686 58H914L935 84H990L1015 62H1330L1354 46H1488L1530 88',
  'L1530 196L1504 222V324L1527 346V554L1504 576V678L1530 704L1530 812',
  'L1488 854H1354L1330 838H1015L990 816H935L914 842H686L665 816H610L585 838H270L246 854H112L70 812',
  'L70 704L96 678V576L73 554V346L96 324V222L70 196Z',
].join(' ')

const innerPath = [
  'M116 122',
  'L152 86H230L256 104H572L596 126H658L684 92H916L942 126H1004L1028 104H1344L1370 86H1448L1484 122',
  'L1484 188L1460 212V338L1480 358V542L1460 562V688L1484 712L1484 778',
  'L1448 814H1370L1344 796H1028L1004 774H942L916 808H684L658 774H596L572 796H256L230 814H152L116 778',
  'L116 712L140 688V562L120 542V358L140 338V212L116 188Z',
].join(' ')

interface BorderBox11SvgIds {
  softGlowId: string
  hardGlowId: string
  nodeGlowId: string
  strokeGradientId: string
  railGradientId: string
  plateGradientId: string
  coreGradientId: string
  nodeGradientId: string
  cornerId: string
  sideRackId: string
  topDockId: string
  hatchId: string
}

export class BorderBox11Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #32e6ff);
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
      padding: var(--dv-border-box-11-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    .glow-layer {
      opacity: var(--dv-border-box-11-glow-opacity, 1);
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

  private readonly instanceId = ++borderBox11Id
  private readonly softGlowId = `dv-border-box-11-soft-glow-${this.instanceId}`
  private readonly hardGlowId = `dv-border-box-11-hard-glow-${this.instanceId}`
  private readonly nodeGlowId = `dv-border-box-11-node-glow-${this.instanceId}`
  private readonly strokeGradientId = `dv-border-box-11-stroke-${this.instanceId}`
  private readonly railGradientId = `dv-border-box-11-rail-${this.instanceId}`
  private readonly plateGradientId = `dv-border-box-11-plate-${this.instanceId}`
  private readonly coreGradientId = `dv-border-box-11-core-${this.instanceId}`
  private readonly nodeGradientId = `dv-border-box-11-node-${this.instanceId}`
  private readonly cornerId = `dv-border-box-11-corner-${this.instanceId}`
  private readonly sideRackId = `dv-border-box-11-side-rack-${this.instanceId}`
  private readonly topDockId = `dv-border-box-11-top-dock-${this.instanceId}`
  private readonly hatchId = `dv-border-box-11-hatch-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-11' })
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
    metrics: ReturnType<BorderBox11Element['createSliceMetrics']>,
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
          style: `left: ${metrics.topCenterLeft}px; top: ${metrics.topCenterTop}px; width: ${metrics.topCenterWidth}px; height: ${metrics.topCenterHeight}px`,
          width: metrics.topCenterWidth,
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
          style: `left: 0; top: ${metrics.sideDetailTop}px; width: ${metrics.sideDetailWidth}px; height: ${metrics.sideDetailHeight}px`,
          width: metrics.sideDetailWidth,
          height: metrics.sideDetailHeight,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'right-detail',
          rect: fixedSlices.rightDetail,
          style: `right: 0; top: ${metrics.sideDetailTop}px; width: ${metrics.sideDetailWidth}px; height: ${metrics.sideDetailHeight}px`,
          width: metrics.sideDetailWidth,
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
          style: `left: ${metrics.bottomCenterLeft}px; bottom: ${metrics.bottomCenterBottom}px; width: ${metrics.bottomCenterWidth}px; height: ${metrics.bottomCenterHeight}px`,
          width: metrics.bottomCenterWidth,
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
    metrics: ReturnType<BorderBox11Element['createSliceMetrics']>,
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

  private createSvgIds(suffix: string): BorderBox11SvgIds {
    return {
      softGlowId: `${this.softGlowId}-${suffix}`,
      hardGlowId: `${this.hardGlowId}-${suffix}`,
      nodeGlowId: `${this.nodeGlowId}-${suffix}`,
      strokeGradientId: `${this.strokeGradientId}-${suffix}`,
      railGradientId: `${this.railGradientId}-${suffix}`,
      plateGradientId: `${this.plateGradientId}-${suffix}`,
      coreGradientId: `${this.coreGradientId}-${suffix}`,
      nodeGradientId: `${this.nodeGradientId}-${suffix}`,
      cornerId: `${this.cornerId}-${suffix}`,
      sideRackId: `${this.sideRackId}-${suffix}`,
      topDockId: `${this.topDockId}-${suffix}`,
      hatchId: `${this.hatchId}-${suffix}`,
    }
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number, ids: BorderBox11SvgIds): unknown {
    return svg`
      <linearGradient id=${ids.strokeGradientId} x1="70" y1="0" x2="1530" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color=${accent} stop-opacity="0.9"></stop>
        <stop offset="0.16" stop-color=${primary} stop-opacity="0.92"></stop>
        <stop offset="0.5" stop-color=${secondary} stop-opacity="0.86"></stop>
        <stop offset="0.84" stop-color=${primary} stop-opacity="0.92"></stop>
        <stop offset="1" stop-color=${accent} stop-opacity="0.9"></stop>
      </linearGradient>
      <linearGradient id=${ids.railGradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.18"></stop>
        <stop offset="0.5" stop-color=${primary} stop-opacity="0.78"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.18"></stop>
      </linearGradient>
      <linearGradient id=${ids.plateGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${primary} stop-opacity="0.32"></stop>
        <stop offset="0.48" stop-color=${secondary} stop-opacity="0.14"></stop>
        <stop offset="1" stop-color="#03101d" stop-opacity="0.06"></stop>
      </linearGradient>
      <linearGradient id=${ids.coreGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
        <stop offset="0.2" stop-color=${secondary} stop-opacity="0.55"></stop>
        <stop offset="0.5" stop-color="#e7fbff" stop-opacity="1"></stop>
        <stop offset="0.8" stop-color=${secondary} stop-opacity="0.55"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>
      <radialGradient id=${ids.nodeGradientId} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffffff"></stop>
        <stop offset="0.34" stop-color=${accent}></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0"></stop>
      </radialGradient>
      <filter id=${ids.softGlowId} x="-120" y="-120" width="1840" height="1140" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(2.4 * glowIntensity)} result="blur1"></feGaussianBlur>
        <feGaussianBlur stdDeviation=${String(8 * glowIntensity)} result="blur2"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur2"></feMergeNode>
          <feMergeNode in="blur1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <filter id=${ids.hardGlowId} x="-120" y="-120" width="1840" height="1140" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(1.1 * glowIntensity)} result="hard1"></feGaussianBlur>
        <feGaussianBlur stdDeviation=${String(4.8 * glowIntensity)} result="hard2"></feGaussianBlur>
        <feGaussianBlur stdDeviation=${String(14 * glowIntensity)} result="hard3"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="hard3"></feMergeNode>
          <feMergeNode in="hard2"></feMergeNode>
          <feMergeNode in="hard1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <filter id=${ids.nodeGlowId} x="-32" y="-32" width="64" height="64" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation=${String(5.5 * glowIntensity)} result="nodeBlur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="nodeBlur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderSymbols(primary: string, secondary: string, accent: string, ids: BorderBox11SvgIds): unknown {
    return svg`
      <g id=${ids.cornerId} stroke-linecap="round" stroke-linejoin="round">
        <path d="M70 196V88L112 46H246L270 62H334L310 86H158L116 128V188L140 212V302" fill=${`url(#${ids.plateGradientId})`} stroke=${primary} stroke-width="2.4" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M112 46H246L270 62H334M116 128L158 86H310" stroke="#dffaff" stroke-width="1.2" opacity="0.72"></path>
        <path d="M92 104L132 64H226M92 188V118M140 212V302" stroke=${secondary} stroke-width="1.25" opacity="0.72"></path>
        <path d="M150 102H220L236 114H292" stroke=${accent} stroke-width="1.15" opacity="0.82"></path>
        <path d="M152 132H286M152 148H248M152 164H276" stroke=${primary} stroke-width="1" opacity="0.44"></path>
        <path d="M278 72L256 94M302 72L280 94M326 72L304 94" stroke=${secondary} stroke-width="2" opacity="0.72"></path>
        <path d="M78 206L104 232V292M86 218L104 236H126" stroke=${accent} stroke-width="1.4" opacity="0.68"></path>
        <circle cx="116" cy="128" r="4.2" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.nodeGlowId})`}></circle>
        <circle cx="246" cy="62" r="3" fill=${accent}></circle>
        <rect x="156" y="178" width="38" height="6" rx="3" fill=${primary} opacity="0.72"></rect>
        <rect x="202" y="178" width="18" height="6" rx="3" fill=${secondary} opacity="0.86"></rect>
      </g>

      <g id=${ids.topDockId} stroke-linecap="round" stroke-linejoin="round">
        <path d="M642 84H665L686 58H914L935 84H958L928 126H672Z" fill=${`url(#${ids.plateGradientId})`} stroke=${primary} stroke-width="1.8" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M704 76H896L916 100H684Z" fill=${secondary} opacity="0.18"></path>
        <path d="M690 92H762M838 92H910" stroke=${`url(#${ids.coreGradientId})`} stroke-width="7" opacity="0.88" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d="M684 58H916M666 126H934" stroke="#e8fbff" stroke-width="0.9" opacity="0.64"></path>
        <path d="M724 112H776M824 112H876" stroke=${secondary} stroke-width="1" stroke-dasharray="8 6" opacity="0.8"></path>
        ${this.renderDots([786, 800, 814], 112, accent)}
        <rect x="760" y="66" width="80" height="6" rx="3" fill=${primary} opacity="0.62"></rect>
        <path d="M640 84L612 84M960 84H988" stroke=${accent} stroke-width="1.4" opacity="0.86"></path>
      </g>

      <g id=${ids.sideRackId} stroke-linecap="round">
        <path d="M96 324V576" stroke=${`url(#${ids.railGradientId})`} stroke-width="7" opacity="0.55" filter=${`url(#${ids.softGlowId})`}></path>
        <path d="M122 338V410M122 490V562" stroke=${secondary} stroke-width="1.3" opacity="0.74"></path>
        <path d="M76 364H112M76 392H102M76 420H112M76 448H102M76 476H112M76 504H102M76 532H112" stroke=${primary} stroke-width="2.2" opacity="0.66"></path>
        <path d="M126 382L146 394L126 406M126 494L146 506L126 518" stroke=${accent} stroke-width="1.6" opacity="0.82"></path>
        <circle cx="96" cy="324" r="4" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.nodeGlowId})`}></circle>
        <circle cx="96" cy="576" r="4" fill=${`url(#${ids.nodeGradientId})`} filter=${`url(#${ids.nodeGlowId})`}></circle>
        <rect x="72" y="435" width="10" height="30" rx="5" fill=${secondary} opacity="0.78"></rect>
      </g>

      <g id=${ids.hatchId}>
        <path d="M636 824H964" stroke=${primary} stroke-width="1.4" opacity="0.82"></path>
        <path d="M668 808H740L754 824H846L860 808H932" fill="transparent" stroke=${secondary} stroke-width="1.2" opacity="0.68"></path>
        <path d="M704 842H896" stroke=${`url(#${ids.coreGradientId})`} stroke-width="6" opacity="0.82" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d="M618 838L600 854M644 838L626 854M970 838L1000 854M944 838L974 854" stroke=${accent} stroke-width="1.6" opacity="0.72"></path>
        ${this.renderDots([766, 780, 794, 808, 822, 836], 824, accent)}
      </g>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, ids: BorderBox11SvgIds): unknown {
    return svg`
      <g class="glow-layer" fill="transparent" stroke-linecap="round" stroke-linejoin="round">
        <path d=${shellPath} stroke=${secondary} stroke-width="12" opacity="0.12" filter=${`url(#${ids.hardGlowId})`}></path>
        <path d=${shellPath} stroke=${`url(#${ids.strokeGradientId})`} stroke-width="2.2" filter=${`url(#${ids.softGlowId})`}></path>
        <path d=${innerPath} stroke=${primary} stroke-width="0.9" opacity="0.72"></path>
        <path d="M270 62H585L610 84H642M958 84H990L1015 62H1330M270 838H585L610 816H642M958 816H990L1015 838H1330" stroke=${accent} stroke-width="1" opacity="0.54"></path>
        <path d="M330 84H600M1000 84H1270M330 816H600M1000 816H1270" stroke=${primary} stroke-width="1.35" opacity="0.42"></path>
        <path d="M346 98H562M1038 98H1254M346 802H562M1038 802H1254" stroke=${secondary} stroke-width="0.9" stroke-dasharray="16 10" opacity="0.52"></path>
        <path d="M96 222V324M96 576V678M1504 222V324M1504 576V678" stroke=${primary} stroke-width="1.4" opacity="0.52"></path>
        <path d="M140 212V300M140 600V688M1460 212V300M1460 600V688" stroke=${secondary} stroke-width="1" opacity="0.5"></path>

        <use href=${`#${ids.cornerId}`}></use>
        <use href=${`#${ids.cornerId}`} transform="translate(1600 0) scale(-1 1)"></use>
        <use href=${`#${ids.cornerId}`} transform="translate(0 900) scale(1 -1)"></use>
        <use href=${`#${ids.cornerId}`} transform="translate(1600 900) scale(-1 -1)"></use>

        <use href=${`#${ids.topDockId}`}></use>
        <use href=${`#${ids.topDockId}`} transform="translate(0 900) scale(1 -1)"></use>
        <use href=${`#${ids.sideRackId}`}></use>
        <use href=${`#${ids.sideRackId}`} transform="translate(1600 0) scale(-1 1)"></use>
        <use href=${`#${ids.hatchId}`}></use>

        <g filter=${`url(#${ids.nodeGlowId})`}>
          <circle cx="70" cy="196" r="3.2" fill=${accent}></circle>
          <circle cx="1530" cy="196" r="3.2" fill=${accent}></circle>
          <circle cx="70" cy="704" r="3.2" fill=${accent}></circle>
          <circle cx="1530" cy="704" r="3.2" fill=${accent}></circle>
          <circle cx="610" cy="84" r="2.7" fill=${primary}></circle>
          <circle cx="990" cy="84" r="2.7" fill=${primary}></circle>
          <circle cx="610" cy="816" r="2.7" fill=${primary}></circle>
          <circle cx="990" cy="816" r="2.7" fill=${primary}></circle>
        </g>

        <g opacity="0.74">
          <path d="M384 70V84M408 70V84M432 70V84M456 70V84M1144 70V84M1168 70V84M1192 70V84M1216 70V84" stroke=${secondary} stroke-width="2.1"></path>
          <path d="M384 830V816M408 830V816M432 830V816M456 830V816M1144 830V816M1168 830V816M1192 830V816M1216 830V816" stroke=${secondary} stroke-width="2.1"></path>
          <rect x="226" y="52" width="36" height="6" rx="3" fill=${primary} opacity="0.68"></rect>
          <rect x="1338" y="52" width="36" height="6" rx="3" fill=${primary} opacity="0.68"></rect>
          <rect x="226" y="842" width="36" height="6" rx="3" fill=${primary} opacity="0.68"></rect>
          <rect x="1338" y="842" width="36" height="6" rx="3" fill=${primary} opacity="0.68"></rect>
        </g>

        ${this.animated && !this.paused
          ? svg`
              <circle r="3.6" fill="#ffffff" opacity="0.9" filter=${`url(#${ids.nodeGlowId})`}>
                <animateMotion dur="4.8s" repeatCount="indefinite" path="M330 84H600"></animateMotion>
              </circle>
              <circle r="3" fill=${accent} opacity="0.82" filter=${`url(#${ids.nodeGlowId})`}>
                <animateMotion dur="5.4s" repeatCount="indefinite" path="M1270 816H1000"></animateMotion>
              </circle>
              <path d="M690 92H762" stroke="#ffffff" stroke-width="1.4" opacity="0.72">
                <animate attributeName="opacity" values="0.28;0.9;0.28" dur="2.6s" repeatCount="indefinite"></animate>
              </path>
            `
          : null}
      </g>
    `
  }

  private createSliceMetrics(): {
    scale: number
    cornerWidth: number
    topHeight: number
    bottomHeight: number
    topCenterLeft: number
    topCenterWidth: number
    topCenterTop: number
    topCenterHeight: number
    bottomCenterLeft: number
    bottomCenterWidth: number
    bottomCenterBottom: number
    bottomCenterHeight: number
    topLineTop: number
    topLineHeight: number
    topLeadingWidth: number
    topTrailingLeft: number
    topTrailingWidth: number
    bottomLineHeight: number
    bottomLeadingWidth: number
    bottomTrailingLeft: number
    bottomTrailingWidth: number
    sideDetailWidth: number
    sideDetailTop: number
    sideDetailHeight: number
    leftLineLeft: number
    rightLineRight: number
    sideLineWidth: number
    sideUpperHeight: number
    sideLowerTop: number
    sideLowerHeight: number
  } {
    const widthScale = this.size.width > 0 ? this.size.width / contentViewBox.width : 1
    const heightScale = this.size.height > 0 ? this.size.height / contentViewBox.height : widthScale
    const scale = Math.min(widthScale, heightScale)
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const cornerWidth = this.scaleValue(fixedSlices.topLeft.width, scale)
    const topHeight = this.scaleValue(fixedSlices.topLeft.height, scale)
    const bottomHeight = this.scaleValue(fixedSlices.bottomLeft.height, scale)
    const topCenterWidth = this.scaleValue(fixedSlices.topCenter.width, scale)
    const bottomCenterWidth = this.scaleValue(fixedSlices.bottomCenter.width, scale)
    const minCenterGap = this.scaleValue(12, scale)
    const topCenterLeft = this.clamp(
      this.sourceX(fixedSlices.topCenter.x, scale),
      cornerWidth + minCenterGap,
      Math.max(hostWidth - cornerWidth - topCenterWidth - minCenterGap, cornerWidth),
    )
    const bottomCenterLeft = this.clamp(
      this.sourceX(fixedSlices.bottomCenter.x, scale),
      cornerWidth + minCenterGap,
      Math.max(hostWidth - cornerWidth - bottomCenterWidth - minCenterGap, cornerWidth),
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
      topCenterLeft,
      topCenterWidth,
      topCenterTop: this.sourceY(fixedSlices.topCenter.y, scale),
      topCenterHeight: this.scaleValue(fixedSlices.topCenter.height, scale),
      bottomCenterLeft,
      bottomCenterWidth,
      bottomCenterBottom: this.scaleValue(contentViewBox.y + contentViewBox.height - fixedSlices.bottomCenter.y - fixedSlices.bottomCenter.height, scale),
      bottomCenterHeight: this.scaleValue(fixedSlices.bottomCenter.height, scale),
      topLineTop: this.sourceY(extensionSlices.topLeading.y, scale),
      topLineHeight: this.scaleValue(extensionSlices.topLeading.height, scale),
      topLeadingWidth: Math.max(topCenterLeft - cornerWidth, 0),
      topTrailingLeft: topCenterLeft + topCenterWidth,
      topTrailingWidth: Math.max(hostWidth - cornerWidth - topCenterLeft - topCenterWidth, 0),
      bottomLineHeight: this.scaleValue(extensionSlices.bottomLeading.height, scale),
      bottomLeadingWidth: Math.max(bottomCenterLeft - cornerWidth, 0),
      bottomTrailingLeft: bottomCenterLeft + bottomCenterWidth,
      bottomTrailingWidth: Math.max(hostWidth - cornerWidth - bottomCenterLeft - bottomCenterWidth, 0),
      sideDetailWidth: this.scaleValue(fixedSlices.leftDetail.width, scale),
      sideDetailTop,
      sideDetailHeight,
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
      const radius = index % 3 === 1 ? 2.4 : 1.9
      return svg`<circle cx=${String(x)} cy=${String(y)} r=${String(radius)} fill=${fill}></circle>`
    })
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#32e6ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#1b7dff',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dv-color-accent',
      host: this,
      fallback: '#b9f7ff',
    })

    return [primary, secondary, accent]
  }
}
