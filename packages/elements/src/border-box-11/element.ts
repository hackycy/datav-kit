import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox11Rect {
  x: number
  y: number
  width: number
  height: number
}

interface BorderBox11SvgIds {
  glowId: string
  railGradientId: string
  chargeGradientId: string
}

let borderBox11Id = 0

const contentViewBox: BorderBox11Rect = {
  x: 0,
  y: 0,
  width: 1200,
  height: 640,
}
const contentRect: BorderBox11Rect = {
  x: 74,
  y: 78,
  width: 1050,
  height: 484,
}
const defaultSize = {
  width: 0,
  height: 0,
}
const fixedSlices = {
  topLeft: { x: 0, y: 0, width: 260, height: 96 },
  topRight: { x: 1040, y: 0, width: 160, height: 96 },
  rightStack: { x: 1110, y: 190, width: 90, height: 260 },
  bottomLeft: { x: 0, y: 560, width: 220, height: 80 },
  bottomRight: { x: 980, y: 560, width: 220, height: 80 },
} satisfies Record<string, BorderBox11Rect>
const extensionSlices = {
  topRail: { x: 260, y: 28, width: 780, height: 40 },
  leftRail: { x: 0, y: 96, width: 60, height: 464 },
  rightUpper: { x: 1110, y: 96, width: 90, height: 94 },
  rightLower: { x: 1110, y: 450, width: 90, height: 110 },
  bottomRail: { x: 220, y: 584, width: 760, height: 32 },
} satisfies Record<string, BorderBox11Rect>

export class BorderBox11Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #3d7fb8);
      overflow: hidden;
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
      padding: var(--dv-border-box-11-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    .live-mark {
      opacity: var(--dv-border-box-11-glow-opacity, 0.95);
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
  private readonly glowId = `dv-border-box-11-glow-${this.instanceId}`
  private readonly railGradientId = `dv-border-box-11-rail-${this.instanceId}`
  private readonly chargeGradientId = `dv-border-box-11-charge-${this.instanceId}`

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
      minBlock: 12,
      minInline: 12,
    })

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
          name: 'right-stack',
          rect: fixedSlices.rightStack,
          style: `right: 0; top: ${metrics.rightStackTop}px; width: ${metrics.rightWidth}px; height: ${metrics.rightStackHeight}px`,
          width: metrics.rightWidth,
          height: metrics.rightStackHeight,
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
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
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
        name: 'left-rail',
        rect: extensionSlices.leftRail,
        style: `left: 0; top: ${metrics.topHeight}px; width: ${metrics.leftWidth}px; height: ${metrics.leftRailHeight}px`,
        width: metrics.leftWidth,
        height: metrics.leftRailHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'right-upper',
        rect: extensionSlices.rightUpper,
        style: `right: 0; top: ${metrics.topHeight}px; width: ${metrics.rightWidth}px; height: ${metrics.rightUpperHeight}px`,
        width: metrics.rightWidth,
        height: metrics.rightUpperHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'right-lower',
        rect: extensionSlices.rightLower,
        style: `right: 0; top: ${metrics.rightLowerTop}px; width: ${metrics.rightWidth}px; height: ${metrics.rightLowerHeight}px`,
        width: metrics.rightWidth,
        height: metrics.rightLowerHeight,
        stretch: true,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderTile({
        name: 'bottom-rail',
        rect: extensionSlices.bottomRail,
        style: `left: ${metrics.bottomLeftWidth}px; bottom: ${metrics.bottomRailBottom}px; width: ${metrics.bottomRailWidth}px; height: ${metrics.bottomRailHeight}px`,
        width: metrics.bottomRailWidth,
        height: metrics.bottomRailHeight,
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
    rect: BorderBox11Rect
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
          ${this.renderFrame(options.primary, options.secondary, options.accent, ids, options.name)}
        </svg>
      </div>
    `
  }

  private createSvgIds(suffix: string): BorderBox11SvgIds {
    return {
      glowId: `${this.glowId}-${suffix}`,
      railGradientId: `${this.railGradientId}-${suffix}`,
      chargeGradientId: `${this.chargeGradientId}-${suffix}`,
    }
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number, ids: BorderBox11SvgIds): unknown {
    return svg`
      <filter id=${ids.glowId} x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(2.4 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <linearGradient id=${ids.railGradientId} x1="0" y1="0" x2="1200" y2="0">
        <stop offset="0%" stop-color=${primary} stop-opacity="0.72"></stop>
        <stop offset="18%" stop-color=${secondary} stop-opacity="0.95"></stop>
        <stop offset="72%" stop-color=${primary} stop-opacity="0.46"></stop>
        <stop offset="100%" stop-color=${secondary} stop-opacity="0.72"></stop>
      </linearGradient>

      <linearGradient id=${ids.chargeGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color=${accent} stop-opacity="0"></stop>
        <stop offset="45%" stop-color=${accent}></stop>
        <stop offset="100%" stop-color="#f2fffb"></stop>
      </linearGradient>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, ids: BorderBox11SvgIds, sliceName: string): unknown {
    const animateTopStatus = sliceName === 'top-left'
    const animateRightStatus = sliceName === 'right-stack'

    return svg`
      <path
        d="M38 18 H236 L260 42 H1040 L1064 18 H1162 L1182 38 V602 L1162 622 H1004 L980 598 H220 L196 622 H38 L18 602 V38 Z"
        fill="rgba(5, 20, 36, 0.2)"
        stroke=${primary}
        stroke-width="1"
        opacity="0.5"
      ></path>

      <g fill="transparent" stroke-linejoin="round" stroke-linecap="round">
        <path
          data-rail="outer"
          d="M42 24 H232 L256 48 H1044 L1068 24 H1158 L1176 42 V598 L1158 616 H1008 L984 592 H216 L192 616 H42 L24 598 V42 Z"
          stroke=${`url(#${ids.railGradientId})`}
          stroke-width="1.5"
        ></path>
        <path
          data-rail="inner"
          d="M58 60 H236 L258 72 H1040 L1062 60 H1140 V554 M1120 580 H990 L970 568 H230 L210 580 H60 M60 554 V96"
          stroke=${secondary}
          stroke-width="1"
          opacity="0.72"
        ></path>
      </g>

      <g data-module="top-status" filter=${`url(#${ids.glowId})`} class="live-mark">
        <path d="M54 34 H172 L188 50 H250" stroke=${secondary} stroke-width="2" fill="transparent" stroke-linecap="round"></path>
        <path d="M72 50 H138" stroke=${accent} stroke-width="3" stroke-linecap="round"></path>
        <circle cx="198" cy="50" r="4" fill=${accent}></circle>
        ${this.renderPulseCircle(198, 50, accent, '2.8s', animateTopStatus)}
      </g>

      <g data-module="right-status" filter=${`url(#${ids.glowId})`} class="live-mark">
        <path d="M1140 184 V456" stroke=${secondary} stroke-width="1.5" opacity="0.9"></path>
        ${this.renderStatusNode(1140, 236, accent, '3.2s', animateRightStatus)}
        ${this.renderStatusNode(1140, 320, secondary, '3.8s', false)}
        ${this.renderStatusNode(1140, 404, accent, '3.4s', false)}
        <path d="M1152 236 H1170 M1152 320 H1164 M1152 404 H1170" stroke=${primary} stroke-width="1.5" opacity="0.75"></path>
      </g>

      <g data-module="bottom-ticks" stroke=${secondary} stroke-width="1.5" stroke-linecap="round" opacity="0.78">
        <path d="M260 598 H326"></path>
        <path d="M356 598 H390"></path>
        <path d="M820 598 H886"></path>
        <path d="M916 598 H950"></path>
      </g>

      <g data-module="calibration" stroke=${primary} stroke-width="1" opacity="0.62">
        <path d="M46 90 H78 M46 112 H66 M1122 88 H1152 M1134 552 H1160"></path>
        <path d="M82 602 V574 M106 602 V586 M1096 36 V64 M1120 36 V52"></path>
      </g>

      <g data-module="quiet-ticks" fill=${primary} opacity="0.45">
        <rect x="300" y="42" width="18" height="2" rx="1"></rect>
        <rect x="342" y="42" width="10" height="2" rx="1"></rect>
        <rect x="894" y="42" width="18" height="2" rx="1"></rect>
        <rect x="928" y="42" width="10" height="2" rx="1"></rect>
        <rect x="72" y="152" width="2" height="18" rx="1"></rect>
        <rect x="72" y="196" width="2" height="10" rx="1"></rect>
        <rect x="1086" y="590" width="18" height="2" rx="1"></rect>
        <rect x="1120" y="590" width="10" height="2" rx="1"></rect>
      </g>

      ${this.renderMotion(ids, sliceName)}
    `
  }

  private renderMotion(ids: BorderBox11SvgIds, sliceName: string): unknown {
    if (!this.animated || this.paused)
      return null

    if (sliceName === 'top-rail') {
      return svg`
        <g data-motion="rail-charge" filter=${`url(#${ids.glowId})`}>
          <path
            d="M284 48 H1016"
            stroke=${`url(#${ids.chargeGradientId})`}
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="96 760"
            stroke-dashoffset="760"
          >
            <animate attributeName="stroke-dashoffset" from="760" to="-96" dur="4.8s" repeatCount="indefinite"></animate>
          </path>
        </g>
      `
    }

    if (sliceName === 'right-stack') {
      return svg`
        <g data-motion="rail-charge" filter=${`url(#${ids.glowId})`}>
          <path
            d="M1140 184 V456"
            stroke=${`url(#${ids.chargeGradientId})`}
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="44 260"
            stroke-dashoffset="260"
          >
            <animate attributeName="stroke-dashoffset" from="260" to="-44" dur="5.6s" begin="0.8s" repeatCount="indefinite"></animate>
          </path>
        </g>
      `
    }

    return null
  }

  private renderStatusNode(x: number, y: number, fill: string, duration: string, active: boolean): unknown {
    return svg`
      <circle cx=${String(x)} cy=${String(y)} r="5" fill=${fill}></circle>
      ${this.renderPulseCircle(x, y, fill, duration, active)}
    `
  }

  private renderPulseCircle(x: number, y: number, stroke: string, duration: string, active: boolean): unknown {
    if (!active || !this.animated || this.paused)
      return null

    return svg`
      <circle cx=${String(x)} cy=${String(y)} r="7" fill="transparent" stroke=${stroke} stroke-width="1" opacity="0.55">
        <animate attributeName="r" values="7;13;7" dur=${duration} repeatCount="indefinite"></animate>
        <animate attributeName="opacity" values="0.55;0.08;0.55" dur=${duration} repeatCount="indefinite"></animate>
      </circle>
    `
  }

  private createSliceMetrics(): {
    scale: number
    topLeftWidth: number
    topRightWidth: number
    topHeight: number
    topRailTop: number
    topRailHeight: number
    topRailWidth: number
    leftWidth: number
    leftRailHeight: number
    rightWidth: number
    rightUpperHeight: number
    rightStackTop: number
    rightStackHeight: number
    rightLowerTop: number
    rightLowerHeight: number
    bottomLeftWidth: number
    bottomRightWidth: number
    bottomHeight: number
    bottomRailWidth: number
    bottomRailHeight: number
    bottomRailBottom: number
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
    const bottomRightWidth = this.scaleValue(fixedSlices.bottomRight.width, scale)
    const bottomHeight = this.scaleValue(fixedSlices.bottomLeft.height, scale)
    const rightStackHeight = this.scaleValue(fixedSlices.rightStack.height, scale)
    const rightExtensionTotal = Math.max(hostHeight - topHeight - rightStackHeight - bottomHeight, 0)
    const rightUpperHeight = this.round(
      rightExtensionTotal * extensionSlices.rightUpper.height / (extensionSlices.rightUpper.height + extensionSlices.rightLower.height),
    )
    const rightLowerHeight = Math.max(this.round(rightExtensionTotal - rightUpperHeight), 0)
    const rightStackTop = topHeight + rightUpperHeight

    return {
      scale,
      topLeftWidth,
      topRightWidth,
      topHeight,
      topRailTop: this.sourceY(extensionSlices.topRail.y, scale),
      topRailHeight: this.scaleValue(extensionSlices.topRail.height, scale),
      topRailWidth: Math.max(this.round(hostWidth - topLeftWidth - topRightWidth), 0),
      leftWidth: this.scaleValue(extensionSlices.leftRail.width, scale),
      leftRailHeight: Math.max(this.round(hostHeight - topHeight - bottomHeight), 0),
      rightWidth: this.scaleValue(fixedSlices.rightStack.width, scale),
      rightUpperHeight,
      rightStackTop,
      rightStackHeight,
      rightLowerTop: rightStackTop + rightStackHeight,
      rightLowerHeight,
      bottomLeftWidth,
      bottomRightWidth,
      bottomHeight,
      bottomRailWidth: Math.max(this.round(hostWidth - bottomLeftWidth - bottomRightWidth), 0),
      bottomRailHeight: this.scaleValue(extensionSlices.bottomRail.height, scale),
      bottomRailBottom: this.scaleValue(contentViewBox.height - extensionSlices.bottomRail.y - extensionSlices.bottomRail.height, scale),
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

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#3d7fb8',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#6ed7e8',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dv-color-accent',
      host: this,
      fallback: '#52f0b5',
    })

    return [primary, secondary, accent]
  }
}
