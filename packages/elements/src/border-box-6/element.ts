import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import {
  borderBox6CyanBodyPath,
  borderBox6CyanCorePath,
  borderBox6CyanHaloPath,
  borderBox6CyanMistPath,
  borderBox6DarkBodyPath,
  borderBox6DarkContourPath,
  borderBox6DarkCorePath,
  borderBox6DarkHaloPath,
  borderBox6DarkMistPath,
  borderBox6SolidCyanPath,
  borderBox6SolidDarkPath,
} from './vector-paths'

let borderBox6Id = 0

interface BorderBox6Rect {
  x: number
  y: number
  width: number
  height: number
}

interface BorderBox6FilterIds {
  darkGlowId: string
  cyanGlowId: string
  lineGlowId: string
  clipId: string
}

const frameViewBox: BorderBox6Rect = {
  x: 40,
  y: 29,
  width: 1600,
  height: 868,
}
const contentRect: BorderBox6Rect = {
  x: 104,
  y: 96,
  width: 1472,
  height: 740,
}
const fixedSlices = {
  topLeft: { x: 40, y: 29, width: 330, height: 220 },
  topUpperJoin: { x: 601, y: 53, width: 20, height: 22 },
  topCenter: { x: 621, y: 70, width: 236, height: 28 },
  topRight: { x: 1195, y: 45, width: 445, height: 200 },
  leftMarker: { x: 65, y: 396, width: 29, height: 337 },
  rightMarker: { x: 1594, y: 319, width: 46, height: 236 },
  rightLowerTop: { x: 1581, y: 555, width: 59, height: 75 },
  rightLowerBottom: { x: 1581, y: 665, width: 59, height: 75 },
  bottomLeft: { x: 50, y: 740, width: 310, height: 157 },
  bottomStep: { x: 716, y: 850, width: 390, height: 47 },
  bottomHatch: { x: 1130, y: 850, width: 280, height: 47 },
  bottomRight: { x: 1364, y: 726, width: 276, height: 171 },
} satisfies Record<string, BorderBox6Rect>
const extensionSlices = {
  topUpper: { x: 356, y: 52, width: 245, height: 24 },
  topLeading: { x: 356, y: 74, width: 265, height: 18 },
  topMain: { x: 855, y: 85, width: 340, height: 12 },
  leftUpper: { x: 67, y: 249, width: 20, height: 147 },
  leftLower: { x: 65, y: 733, width: 29, height: 10 },
  rightUpper: { x: 1610, y: 238, width: 30, height: 81 },
  rightLowerMiddle: { x: 1581, y: 630, width: 59, height: 35 },
  bottomLeading: { x: 360, y: 880, width: 361, height: 17 },
  bottomMain: { x: 736, y: 863, width: 344, height: 22 },
  bottomTrailing: { x: 1092, y: 877, width: 272, height: 20 },
} satisfies Record<string, BorderBox6Rect>
const defaultSize = {
  width: 0,
  height: 0,
}

export class BorderBox6Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dvk-color-primary, #04b9f2);
    }

    .frame {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
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
      padding: var(--dvk-border-box-6-padding, var(--dvk-border-box-padding, var(--dvk-border-box-auto-padding)));
    }

    .hud-frame {
      opacity: var(--dvk-border-box-6-glow-opacity, 1);
    }

    @media (max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce) {
      svg [filter] {
        filter: none;
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

  @state()
  private size = defaultSize

  private readonly instanceId = ++borderBox6Id
  private readonly darkGlowId = `dvk-border-box-6-dark-glow-${this.instanceId}`
  private readonly cyanGlowId = `dvk-border-box-6-cyan-glow-${this.instanceId}`
  private readonly lineGlowId = `dvk-border-box-6-line-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-border-box-6' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const metrics = this.createSliceMetrics()
    const contentPadding = this.createContentPadding()

    return html`
      ${this.renderSlicedGraphic(primary, secondary, accent, glowIntensity, metrics)}
      <div part="content" class="content" style=${`--dvk-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderSlicedGraphic(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox6Element['createSliceMetrics']>,
  ): unknown {
    return html`
      <div part="frame" class="frame frame--sliced">
        ${this.renderExtensionStrips(primary, secondary, accent, glowIntensity, metrics)}
        ${this.renderFixedTile({
          name: 'top-left',
          rect: fixedSlices.topLeft,
          style: `left: 0; top: 0; width: ${metrics.topLeftWidth}px; height: ${metrics.topLeftHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'top-upper-join',
          rect: fixedSlices.topUpperJoin,
          style: `left: ${metrics.topUpperJoinLeft}px; top: ${metrics.topUpperJoinTop}px; width: ${metrics.topUpperJoinWidth}px; height: ${metrics.topUpperJoinHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'top-center',
          rect: fixedSlices.topCenter,
          style: `left: ${metrics.topCenterLeft}px; top: ${metrics.topCenterTop}px; width: ${metrics.topCenterWidth}px; height: ${metrics.topCenterHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'top-right',
          rect: fixedSlices.topRight,
          style: `right: 0; top: ${metrics.topRightTop}px; width: ${metrics.topRightWidth}px; height: ${metrics.topRightHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'left-marker',
          rect: fixedSlices.leftMarker,
          style: `left: ${metrics.leftMarkerLeft}px; top: ${metrics.leftMarkerTop}px; width: ${metrics.leftMarkerWidth}px; height: ${metrics.leftMarkerHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'right-marker',
          rect: fixedSlices.rightMarker,
          style: `right: ${metrics.rightMarkerRight}px; top: ${metrics.rightMarkerTop}px; width: ${metrics.rightMarkerWidth}px; height: ${metrics.rightMarkerHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'right-lower-top',
          rect: fixedSlices.rightLowerTop,
          style: `right: 0; top: ${metrics.rightLowerTopTop}px; width: ${metrics.rightLowerTopWidth}px; height: ${metrics.rightLowerTopHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'right-lower-bottom',
          rect: fixedSlices.rightLowerBottom,
          style: `right: 0; top: ${metrics.rightLowerBottomTop}px; width: ${metrics.rightLowerBottomWidth}px; height: ${metrics.rightLowerBottomHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-left',
          rect: fixedSlices.bottomLeft,
          style: `left: ${metrics.bottomLeftLeft}px; bottom: 0; width: ${metrics.bottomLeftWidth}px; height: ${metrics.bottomLeftHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-step',
          rect: fixedSlices.bottomStep,
          style: `left: ${metrics.bottomStepLeft}px; bottom: 0; width: ${metrics.bottomStepWidth}px; height: ${metrics.bottomStepHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-hatch',
          rect: fixedSlices.bottomHatch,
          style: `left: ${metrics.bottomHatchLeft}px; bottom: 0; width: ${metrics.bottomHatchWidth}px; height: ${metrics.bottomHatchHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-right',
          rect: fixedSlices.bottomRight,
          style: `right: 0; bottom: 0; width: ${metrics.bottomRightWidth}px; height: ${metrics.bottomRightHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
      </div>
    `
  }

  private renderExtensionStrips(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox6Element['createSliceMetrics']>,
  ): unknown {
    return html`
      ${this.renderExtensionStrip({
        name: 'top-upper',
        rect: extensionSlices.topUpper,
        style: `left: ${metrics.topUpperLeft}px; top: ${metrics.topUpperTop}px; width: ${metrics.topUpperWidth}px; height: ${metrics.topUpperHeight}px`,
        width: metrics.topUpperWidth,
        height: metrics.topUpperHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'top-leading',
        rect: extensionSlices.topLeading,
        style: `left: ${metrics.topLeadingLeft}px; top: ${metrics.topLeadingTop}px; width: ${metrics.topLeadingWidth}px; height: ${metrics.topLeadingHeight}px`,
        width: metrics.topLeadingWidth,
        height: metrics.topLeadingHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'top-main',
        rect: extensionSlices.topMain,
        style: `left: ${metrics.topMainLeft}px; top: ${metrics.topMainTop}px; width: ${metrics.topMainWidth}px; height: ${metrics.topMainHeight}px`,
        width: metrics.topMainWidth,
        height: metrics.topMainHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'left-upper',
        rect: extensionSlices.leftUpper,
        style: `left: ${metrics.leftUpperLeft}px; top: ${metrics.leftUpperTop}px; width: ${metrics.leftUpperWidth}px; height: ${metrics.leftUpperHeight}px`,
        width: metrics.leftUpperWidth,
        height: metrics.leftUpperHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'left-lower',
        rect: extensionSlices.leftLower,
        style: `left: ${metrics.leftLowerLeft}px; top: ${metrics.leftLowerTop}px; width: ${metrics.leftLowerWidth}px; height: ${metrics.leftLowerHeight}px`,
        width: metrics.leftLowerWidth,
        height: metrics.leftLowerHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'right-upper',
        rect: extensionSlices.rightUpper,
        style: `right: 0; top: ${metrics.rightUpperTop}px; width: ${metrics.rightUpperWidth}px; height: ${metrics.rightUpperHeight}px`,
        width: metrics.rightUpperWidth,
        height: metrics.rightUpperHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'right-lower-middle',
        rect: extensionSlices.rightLowerMiddle,
        style: `right: 0; top: ${metrics.rightLowerMiddleTop}px; width: ${metrics.rightLowerMiddleWidth}px; height: ${metrics.rightLowerMiddleHeight}px`,
        width: metrics.rightLowerMiddleWidth,
        height: metrics.rightLowerMiddleHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'bottom-leading',
        rect: extensionSlices.bottomLeading,
        style: `left: ${metrics.bottomLeadingLeft}px; bottom: 0; width: ${metrics.bottomLeadingWidth}px; height: ${metrics.bottomLeadingHeight}px`,
        width: metrics.bottomLeadingWidth,
        height: metrics.bottomLeadingHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'bottom-main',
        rect: extensionSlices.bottomMain,
        style: `left: ${metrics.bottomMainLeft}px; bottom: ${metrics.bottomMainBottom}px; width: ${metrics.bottomMainWidth}px; height: ${metrics.bottomMainHeight}px`,
        width: metrics.bottomMainWidth,
        height: metrics.bottomMainHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'bottom-trailing',
        rect: extensionSlices.bottomTrailing,
        style: `left: ${metrics.bottomTrailingLeft}px; bottom: 0; width: ${metrics.bottomTrailingWidth}px; height: ${metrics.bottomTrailingHeight}px`,
        width: metrics.bottomTrailingWidth,
        height: metrics.bottomTrailingHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
    `
  }

  private renderExtensionStrip(options: {
    name: string
    rect: BorderBox6Rect
    style: string
    width: number
    height: number
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
  }): unknown {
    if (options.width < 2 || options.height < 2)
      return ''

    const filterIds = this.createFilterIds(options.name)

    return html`
      <div class="extension" data-extension=${options.name} style=${options.style}>
        <svg
          part="graphic"
          width=${String(options.width)}
          height=${String(options.height)}
          viewBox=${`${options.rect.x} ${options.rect.y} ${options.rect.width} ${options.rect.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          shape-rendering="geometricPrecision"
        >
          <defs>
            ${this.renderFilterDefs(filterIds, options.glowIntensity)}
            ${this.renderClipPath(filterIds, options.rect)}
          </defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, filterIds)}
        </svg>
      </div>
    `
  }

  private renderFixedTile(options: {
    name: string
    rect: BorderBox6Rect
    style: string
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
    scale: number
  }): unknown {
    const filterIds = this.createFilterIds(options.name)
    const svgWidth = this.scaleValue(options.rect.width, options.scale)
    const svgHeight = this.scaleValue(options.rect.height, options.scale)

    return html`
      <div class="tile" data-slice=${options.name} style=${options.style}>
        <svg
          part="graphic"
          width=${String(svgWidth)}
          height=${String(svgHeight)}
          viewBox=${`${options.rect.x} ${options.rect.y} ${options.rect.width} ${options.rect.height}`}
          aria-hidden="true"
          shape-rendering="geometricPrecision"
        >
          <defs>
            ${this.renderFilterDefs(filterIds, options.glowIntensity)}
            ${this.renderClipPath(filterIds, options.rect)}
          </defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, filterIds)}
        </svg>
      </div>
    `
  }

  private renderClipPath(filterIds: BorderBox6FilterIds, rect: BorderBox6Rect): unknown {
    return svg`
      <clipPath id=${filterIds.clipId}>
        <rect
          x=${String(rect.x)}
          y=${String(rect.y)}
          width=${String(rect.width)}
          height=${String(rect.height)}
        ></rect>
      </clipPath>
    `
  }

  private renderFilterDefs(filterIds: BorderBox6FilterIds, glowIntensity: number): unknown {
    return svg`
      <filter id=${filterIds.darkGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(1.5 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.cyanGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(2.4 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.lineGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(0.55 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, filterIds: BorderBox6FilterIds): unknown {
    return svg`
      <g id="hud-frame" class="hud-frame" fill-rule="evenodd" clip-rule="evenodd" clip-path=${`url(#${filterIds.clipId})`}>
        <path id="dark-mist" d=${borderBox6DarkMistPath} fill=${secondary} opacity="0.16" filter=${`url(#${filterIds.darkGlowId})`}></path>
        <path id="dark-halo" d=${borderBox6DarkHaloPath} fill=${secondary} opacity="0.2"></path>
        <path id="dark-body" d=${borderBox6DarkBodyPath} fill=${secondary} opacity="0.24"></path>
        <path id="dark-contour" d=${borderBox6DarkContourPath} fill=${secondary} opacity="0.26"></path>
        <path id="dark-core" d=${borderBox6DarkCorePath} fill=${secondary} opacity="0.34"></path>
        <path id="cyan-mist" d=${borderBox6CyanMistPath} fill=${primary} opacity="0.22" filter=${`url(#${filterIds.cyanGlowId})`}></path>
        <path id="cyan-halo" d=${borderBox6CyanHaloPath} fill=${primary} opacity="0.28"></path>
        <path id="cyan-body" d=${borderBox6CyanBodyPath} fill=${primary} opacity="0.32"></path>
        <path id="cyan-core" d=${borderBox6CyanCorePath} fill=${primary} opacity="0.4" filter=${`url(#${filterIds.lineGlowId})`}></path>
        <path id="solid-dark" d=${borderBox6SolidDarkPath} fill=${secondary} opacity="0.85"></path>
        <path id="solid-cyan" d=${borderBox6SolidCyanPath} fill=${accent} opacity="0.85"></path>
      </g>
    `
  }

  private createFilterIds(suffix: string): BorderBox6FilterIds {
    return {
      darkGlowId: `${this.darkGlowId}-${suffix}`,
      cyanGlowId: `${this.cyanGlowId}-${suffix}`,
      lineGlowId: `${this.lineGlowId}-${suffix}`,
      clipId: `dvk-border-box-6-clip-${this.instanceId}-${suffix}`,
    }
  }

  private createSliceMetrics(): {
    scale: number
    topLeftWidth: number
    topLeftHeight: number
    topUpperJoinLeft: number
    topUpperJoinTop: number
    topUpperJoinWidth: number
    topUpperJoinHeight: number
    topCenterLeft: number
    topCenterTop: number
    topCenterWidth: number
    topCenterHeight: number
    topRightTop: number
    topRightWidth: number
    topRightHeight: number
    leftMarkerLeft: number
    leftMarkerTop: number
    leftMarkerWidth: number
    leftMarkerHeight: number
    rightMarkerRight: number
    rightMarkerTop: number
    rightMarkerWidth: number
    rightMarkerHeight: number
    rightLowerTopTop: number
    rightLowerTopWidth: number
    rightLowerTopHeight: number
    rightLowerBottomTop: number
    rightLowerBottomWidth: number
    rightLowerBottomHeight: number
    bottomLeftLeft: number
    bottomLeftWidth: number
    bottomLeftHeight: number
    bottomStepLeft: number
    bottomStepWidth: number
    bottomStepHeight: number
    bottomHatchLeft: number
    bottomHatchWidth: number
    bottomHatchHeight: number
    bottomRightWidth: number
    bottomRightHeight: number
    topUpperLeft: number
    topUpperTop: number
    topUpperWidth: number
    topUpperHeight: number
    topLeadingLeft: number
    topLeadingTop: number
    topLeadingWidth: number
    topLeadingHeight: number
    topMainLeft: number
    topMainTop: number
    topMainWidth: number
    topMainHeight: number
    leftUpperLeft: number
    leftUpperTop: number
    leftUpperWidth: number
    leftUpperHeight: number
    leftLowerLeft: number
    leftLowerTop: number
    leftLowerWidth: number
    leftLowerHeight: number
    rightUpperTop: number
    rightUpperWidth: number
    rightUpperHeight: number
    rightLowerMiddleTop: number
    rightLowerMiddleWidth: number
    rightLowerMiddleHeight: number
    bottomLeadingLeft: number
    bottomLeadingWidth: number
    bottomLeadingHeight: number
    bottomMainLeft: number
    bottomMainBottom: number
    bottomMainWidth: number
    bottomMainHeight: number
    bottomTrailingLeft: number
    bottomTrailingWidth: number
    bottomTrailingHeight: number
  } {
    const scale = this.size.width > 0 ? this.size.width / frameViewBox.width : 1
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const topLeftWidth = this.scaleValue(fixedSlices.topLeft.width, scale)
    const topUpperJoinWidth = this.scaleValue(fixedSlices.topUpperJoin.width, scale)
    const topCenterWidth = this.scaleValue(fixedSlices.topCenter.width, scale)
    const topRightWidth = this.scaleValue(fixedSlices.topRight.width, scale)
    const bottomLeftWidth = this.scaleValue(fixedSlices.bottomLeft.width, scale)
    const bottomStepWidth = this.scaleValue(fixedSlices.bottomStep.width, scale)
    const bottomHatchWidth = this.scaleValue(fixedSlices.bottomHatch.width, scale)
    const bottomRightWidth = this.scaleValue(fixedSlices.bottomRight.width, scale)
    const bottomStepLeft = this.clamp(
      this.sourceX(fixedSlices.bottomStep.x, scale),
      bottomLeftWidth + this.scaleValue(24, scale),
      Math.max(hostWidth - bottomRightWidth - bottomStepWidth - this.scaleValue(32, scale), bottomLeftWidth),
    )
    const bottomHatchLeft = this.clamp(
      this.sourceX(fixedSlices.bottomHatch.x, scale),
      bottomStepLeft + bottomStepWidth + this.scaleValue(18, scale),
      Math.max(hostWidth - bottomRightWidth - bottomHatchWidth - this.scaleValue(18, scale), bottomStepLeft + bottomStepWidth),
    )
    const bottomTop = Math.max(hostHeight - this.scaleValue(fixedSlices.bottomLeft.height, scale), 0)
    const rightLowerTopTop = this.sourceY(fixedSlices.rightLowerTop.y, scale)
    const rightLowerTopHeight = this.scaleValue(fixedSlices.rightLowerTop.height, scale)
    const rightLowerBottomHeight = this.scaleValue(fixedSlices.rightLowerBottom.height, scale)
    const rightLowerBottomTop = Math.max(bottomTop - rightLowerBottomHeight, rightLowerTopTop + rightLowerTopHeight)
    const topCenterLeft = this.clamp(
      this.sourceX(fixedSlices.topCenter.x, scale),
      topLeftWidth + this.scaleValue(22, scale),
      Math.max(hostWidth - topRightWidth - topCenterWidth - this.scaleValue(22, scale), topLeftWidth),
    )
    const topUpperJoinLeft = Math.max(topCenterLeft - topUpperJoinWidth, 0)
    const topMainSourceLeft = this.sourceX(extensionSlices.topMain.x, scale)

    return {
      scale,
      topLeftWidth,
      topLeftHeight: this.scaleValue(fixedSlices.topLeft.height, scale),
      topUpperJoinLeft,
      topUpperJoinTop: this.sourceY(fixedSlices.topUpperJoin.y, scale),
      topUpperJoinWidth,
      topUpperJoinHeight: this.scaleValue(fixedSlices.topUpperJoin.height, scale),
      topCenterLeft,
      topCenterTop: this.sourceY(fixedSlices.topCenter.y, scale),
      topCenterWidth,
      topCenterHeight: this.scaleValue(fixedSlices.topCenter.height, scale),
      topRightTop: this.sourceY(fixedSlices.topRight.y, scale),
      topRightWidth,
      topRightHeight: this.scaleValue(fixedSlices.topRight.height, scale),
      leftMarkerLeft: this.sourceX(fixedSlices.leftMarker.x, scale),
      leftMarkerTop: this.sourceY(fixedSlices.leftMarker.y, scale),
      leftMarkerWidth: this.scaleValue(fixedSlices.leftMarker.width, scale),
      leftMarkerHeight: Math.min(this.scaleValue(fixedSlices.leftMarker.height, scale), Math.max(bottomTop - this.sourceY(fixedSlices.leftMarker.y, scale), 0)),
      rightMarkerRight: this.sourceRight(fixedSlices.rightMarker.x + fixedSlices.rightMarker.width, scale),
      rightMarkerTop: this.sourceY(fixedSlices.rightMarker.y, scale),
      rightMarkerWidth: this.scaleValue(fixedSlices.rightMarker.width, scale),
      rightMarkerHeight: this.scaleValue(fixedSlices.rightMarker.height, scale),
      rightLowerTopTop,
      rightLowerTopWidth: this.scaleValue(fixedSlices.rightLowerTop.width, scale),
      rightLowerTopHeight,
      rightLowerBottomTop,
      rightLowerBottomWidth: this.scaleValue(fixedSlices.rightLowerBottom.width, scale),
      rightLowerBottomHeight,
      bottomLeftLeft: this.sourceX(fixedSlices.bottomLeft.x, scale),
      bottomLeftWidth,
      bottomLeftHeight: this.scaleValue(fixedSlices.bottomLeft.height, scale),
      bottomStepLeft,
      bottomStepWidth,
      bottomStepHeight: this.scaleValue(fixedSlices.bottomStep.height, scale),
      bottomHatchLeft,
      bottomHatchWidth,
      bottomHatchHeight: this.scaleValue(fixedSlices.bottomHatch.height, scale),
      bottomRightWidth,
      bottomRightHeight: this.scaleValue(fixedSlices.bottomRight.height, scale),
      topUpperLeft: this.sourceX(extensionSlices.topUpper.x, scale),
      topUpperTop: this.sourceY(extensionSlices.topUpper.y, scale),
      topUpperWidth: Math.max(topUpperJoinLeft - this.sourceX(extensionSlices.topUpper.x, scale), 0),
      topUpperHeight: this.scaleValue(extensionSlices.topUpper.height, scale),
      topLeadingLeft: this.sourceX(extensionSlices.topLeading.x, scale),
      topLeadingTop: this.sourceY(extensionSlices.topLeading.y, scale),
      topLeadingWidth: Math.max(topCenterLeft - this.sourceX(extensionSlices.topLeading.x, scale), 0),
      topLeadingHeight: this.scaleValue(extensionSlices.topLeading.height, scale),
      topMainLeft: topMainSourceLeft,
      topMainTop: this.sourceY(extensionSlices.topMain.y, scale),
      topMainWidth: Math.max(hostWidth - topRightWidth - topMainSourceLeft, 0),
      topMainHeight: this.scaleValue(extensionSlices.topMain.height, scale),
      leftUpperLeft: this.sourceX(extensionSlices.leftUpper.x, scale),
      leftUpperTop: this.sourceY(extensionSlices.leftUpper.y, scale),
      leftUpperWidth: this.scaleValue(extensionSlices.leftUpper.width, scale),
      leftUpperHeight: Math.max(this.sourceY(fixedSlices.leftMarker.y, scale) - this.sourceY(extensionSlices.leftUpper.y, scale), 0),
      leftLowerLeft: this.sourceX(extensionSlices.leftLower.x, scale),
      leftLowerTop: this.sourceY(extensionSlices.leftLower.y, scale),
      leftLowerWidth: this.scaleValue(extensionSlices.leftLower.width, scale),
      leftLowerHeight: Math.max(bottomTop - this.sourceY(extensionSlices.leftLower.y, scale), 0),
      rightUpperTop: this.sourceY(extensionSlices.rightUpper.y, scale),
      rightUpperWidth: this.scaleValue(extensionSlices.rightUpper.width, scale),
      rightUpperHeight: Math.max(this.sourceY(fixedSlices.rightMarker.y, scale) - this.sourceY(extensionSlices.rightUpper.y, scale), 0),
      rightLowerMiddleTop: rightLowerTopTop + rightLowerTopHeight,
      rightLowerMiddleWidth: this.scaleValue(extensionSlices.rightLowerMiddle.width, scale),
      rightLowerMiddleHeight: Math.max(rightLowerBottomTop - rightLowerTopTop - rightLowerTopHeight, 0),
      bottomLeadingLeft: bottomLeftWidth,
      bottomLeadingWidth: Math.max(bottomStepLeft - bottomLeftWidth, 0),
      bottomLeadingHeight: this.scaleValue(extensionSlices.bottomLeading.height, scale),
      bottomMainLeft: bottomStepLeft + bottomStepWidth,
      bottomMainBottom: this.scaleValue(frameViewBox.y + frameViewBox.height - extensionSlices.bottomMain.y - extensionSlices.bottomMain.height, scale),
      bottomMainWidth: Math.max(bottomHatchLeft - bottomStepLeft - bottomStepWidth, 0),
      bottomMainHeight: this.scaleValue(extensionSlices.bottomMain.height, scale),
      bottomTrailingLeft: bottomHatchLeft + bottomHatchWidth,
      bottomTrailingWidth: Math.max(hostWidth - bottomRightWidth - bottomHatchLeft - bottomHatchWidth, 0),
      bottomTrailingHeight: this.scaleValue(extensionSlices.bottomTrailing.height, scale),
    }
  }

  private createContentPadding(): string {
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const inlineScale = hostWidth > 0 ? hostWidth / frameViewBox.width : 1
    const blockScale = hostHeight > 0 ? hostHeight / frameViewBox.height : 1
    const frameRight = frameViewBox.x + frameViewBox.width
    const frameBottom = frameViewBox.y + frameViewBox.height
    const contentRight = contentRect.x + contentRect.width
    const contentBottom = contentRect.y + contentRect.height
    const top = (contentRect.y - frameViewBox.y) * blockScale
    const right = (frameRight - contentRight) * inlineScale
    const bottom = (frameBottom - contentBottom) * blockScale
    const left = (contentRect.x - frameViewBox.x) * inlineScale

    return [
      this.formatPaddingValue(this.clampPadding(top, 8)),
      this.formatPaddingValue(this.clampPadding(right, 8)),
      this.formatPaddingValue(this.clampPadding(bottom, 8)),
      this.formatPaddingValue(this.clampPadding(left, 8)),
    ].join(' ')
  }

  private scaleValue(value: number, scale: number): number {
    return this.round(Math.max(value * scale, value === 0 ? 0 : 1))
  }

  private sourceX(value: number, scale: number): number {
    return this.scaleValue(value - frameViewBox.x, scale)
  }

  private sourceY(value: number, scale: number): number {
    return this.scaleValue(value - frameViewBox.y, scale)
  }

  private sourceRight(value: number, scale: number): number {
    return this.scaleValue(frameViewBox.x + frameViewBox.width - value, scale)
  }

  private clamp(value: number, min: number, max: number): number {
    return this.round(Math.min(Math.max(value, min), Math.max(min, max)))
  }

  private round(value: number): number {
    return Number(value.toFixed(2))
  }

  private clampPadding(value: number, fallback: number): number {
    return Math.max(value, fallback)
  }

  private formatPaddingValue(value: number): string {
    return `${this.round(value)}px`
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#04b9f2',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#102132',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: '#00b7f0',
    })

    return [primary, secondary, accent]
  }
}
