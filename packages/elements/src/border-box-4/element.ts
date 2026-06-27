import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import {
  borderBox4HotHighlightPath,
  borderBox4LineCorePath,
  borderBox4OuterGlowPath,
  borderBox4SoftGlowPath,
} from './vector-paths'

let borderBox4Id = 0

interface BorderBox4Rect {
  x: number
  y: number
  width: number
  height: number
}

interface BorderBox4FilterIds {
  outerGlowId: string
  softGlowId: string
  lineGlowId: string
  clipId: string
}

const frameViewBox: BorderBox4Rect = {
  x: 48,
  y: 60,
  width: 1576,
  height: 820,
}
const contentRect: BorderBox4Rect = {
  x: 112,
  y: 134,
  width: 1448,
  height: 672,
}
const fixedSlices = {
  topLeft: { x: 48, y: 60, width: 466, height: 150 },
  topDetail: { x: 746, y: 74, width: 360, height: 72 },
  topRight: { x: 1358, y: 60, width: 266, height: 340 },
  leftSide: { x: 48, y: 150, width: 120, height: 585 },
  rightMiddle: { x: 1500, y: 392, width: 124, height: 208 },
  bottomLeft: { x: 48, y: 735, width: 370, height: 145 },
  bottomDetail: { x: 676, y: 845, width: 547, height: 35 },
  bottomRight: { x: 1266, y: 735, width: 358, height: 145 },
} satisfies Record<string, BorderBox4Rect>
const extensionSlices = {
  topLeading: { x: 509, y: 72, width: 237, height: 44 },
  topTrailing: { x: 1106, y: 72, width: 252, height: 48 },
  bottomLeading: { x: 418, y: 844, width: 258, height: 36 },
  bottomTrailing: { x: 1223, y: 844, width: 43, height: 36 },
  leftLower: { x: 70, y: 651, width: 32, height: 84 },
  rightLower: { x: 1582, y: 600, width: 42, height: 135 },
  rightLine: { x: 1592, y: 186, width: 8, height: 549 },
} satisfies Record<string, BorderBox4Rect>
const defaultSize = {
  width: 0,
  height: 0,
}

export class BorderBox4Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #36d9ff);
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
      padding: var(--dv-border-box-4-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    .hud-frame {
      opacity: var(--dv-border-box-4-glow-opacity, 1);
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

  private readonly instanceId = ++borderBox4Id
  private readonly outerGlowId = `dv-border-box-4-outer-glow-${this.instanceId}`
  private readonly softGlowId = `dv-border-box-4-soft-glow-${this.instanceId}`
  private readonly lineGlowId = `dv-border-box-4-line-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-4' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const metrics = this.createSliceMetrics()
    const contentPadding = this.createContentPadding()

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
    metrics: ReturnType<BorderBox4Element['createSliceMetrics']>,
  ): unknown {
    return html`
      <div part="frame" class="frame frame--flex">
        ${this.renderExtensionStrips(primary, secondary, accent, glowIntensity, metrics)}
        ${this.renderRightEdgeReset(primary, secondary, accent, glowIntensity, metrics)}
        ${this.renderFixedTile({
          name: 'top-left',
          rect: fixedSlices.topLeft,
          style: `left: 0; top: 0; width: ${metrics.topLeftWidth}px; height: ${metrics.topHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'top-right',
          rect: fixedSlices.topRight,
          style: `right: 0; top: 0; width: ${metrics.topRightWidth}px; height: ${metrics.topRightHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'top-detail',
          rect: fixedSlices.topDetail,
          style: `left: ${metrics.topDetailLeft}px; top: ${metrics.topDetailTop}px; width: ${metrics.topDetailWidth}px; height: ${metrics.topDetailHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'left-side',
          rect: fixedSlices.leftSide,
          style: `left: 0; top: ${metrics.leftSideTop}px; width: ${metrics.leftSideWidth}px; height: ${metrics.leftSideHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'right-middle',
          rect: fixedSlices.rightMiddle,
          style: `right: 0; top: ${metrics.rightMiddleTop}px; width: ${metrics.rightMiddleWidth}px; height: ${metrics.rightMiddleHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-left',
          rect: fixedSlices.bottomLeft,
          style: `left: 0; bottom: 0; width: ${metrics.bottomLeftWidth}px; height: ${metrics.bottomHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-detail',
          rect: fixedSlices.bottomDetail,
          style: `left: ${metrics.bottomDetailLeft}px; bottom: 0; width: ${metrics.bottomDetailWidth}px; height: ${metrics.bottomDetailHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
        ${this.renderFixedTile({
          name: 'bottom-right',
          rect: fixedSlices.bottomRight,
          style: `right: 0; bottom: 0; width: ${metrics.bottomRightWidth}px; height: ${metrics.bottomHeight}px`,
          primary,
          secondary,
          accent,
          glowIntensity,
          scale: metrics.scale,
        })}
      </div>
    `
  }

  private renderRightEdgeReset(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox4Element['createSliceMetrics']>,
  ): unknown {
    return this.renderExtensionStrip({
      name: 'right-edge-reset',
      rect: extensionSlices.rightLine,
      style: `right: ${metrics.rightLineRight}px; top: ${metrics.rightLineTop}px; width: ${metrics.rightLineWidth}px; height: ${metrics.rightLineHeight}px`,
      width: metrics.rightLineWidth,
      height: metrics.rightLineHeight,
      primary,
      secondary,
      accent,
      glowIntensity,
    })
  }

  private renderExtensionStrips(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox4Element['createSliceMetrics']>,
  ): unknown {
    return html`
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
        name: 'top-trailing',
        rect: extensionSlices.topTrailing,
        style: `left: ${metrics.topTrailingLeft}px; top: ${metrics.topTrailingTop}px; width: ${metrics.topTrailingWidth}px; height: ${metrics.topTrailingHeight}px`,
        width: metrics.topTrailingWidth,
        height: metrics.topTrailingHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'bottom-leading',
        rect: extensionSlices.bottomLeading,
        style: `left: ${metrics.bottomLeftWidth}px; bottom: 0; width: ${metrics.bottomLeadingWidth}px; height: ${metrics.bottomExtensionHeight}px`,
        width: metrics.bottomLeadingWidth,
        height: metrics.bottomExtensionHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
      ${this.renderExtensionStrip({
        name: 'bottom-trailing',
        rect: extensionSlices.bottomTrailing,
        style: `left: ${metrics.bottomTrailingLeft}px; bottom: 0; width: ${metrics.bottomTrailingWidth}px; height: ${metrics.bottomExtensionHeight}px`,
        width: metrics.bottomTrailingWidth,
        height: metrics.bottomExtensionHeight,
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
        name: 'right-lower',
        rect: extensionSlices.rightLower,
        style: `right: ${metrics.rightLowerRight}px; top: ${metrics.rightLowerTop}px; width: ${metrics.rightLowerWidth}px; height: ${metrics.rightLowerHeight}px`,
        width: metrics.rightLowerWidth,
        height: metrics.rightLowerHeight,
        primary,
        secondary,
        accent,
        glowIntensity,
      })}
    `
  }

  private renderExtensionStrip(options: {
    name: string
    rect: BorderBox4Rect
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
            <clipPath id=${filterIds.clipId}>
              <rect
                x=${String(options.rect.x)}
                y=${String(options.rect.y)}
                width=${String(options.rect.width)}
                height=${String(options.rect.height)}
              ></rect>
            </clipPath>
          </defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, filterIds)}
        </svg>
      </div>
    `
  }

  private renderFixedTile(options: {
    name: string
    rect: BorderBox4Rect
    style: string
    clipWidth?: number
    clipHeight?: number
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
    scale: number
  }): unknown {
    const filterIds = this.createFilterIds(options.name)
    const svgWidth = options.clipWidth ?? this.scaleValue(options.rect.width, options.scale)
    const svgHeight = options.clipHeight ?? this.scaleValue(options.rect.height, options.scale)

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
            <clipPath id=${filterIds.clipId}>
              <rect
                x=${String(options.rect.x)}
                y=${String(options.rect.y)}
                width=${String(options.rect.width)}
                height=${String(options.rect.height)}
              ></rect>
            </clipPath>
          </defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, filterIds)}
        </svg>
      </div>
    `
  }

  private renderFilterDefs(filterIds: BorderBox4FilterIds, glowIntensity: number): unknown {
    return svg`
      <filter id=${filterIds.outerGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(4.2 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.softGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(2.1 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.lineGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(0.85 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, filterIds: BorderBox4FilterIds): unknown {
    return svg`
      <g id="hud-frame" class="hud-frame" fill-rule="evenodd" clip-rule="evenodd" clip-path=${`url(#${filterIds.clipId})`}>
        <path
          id="cyan-outer-glow"
          d=${borderBox4OuterGlowPath}
          fill=${secondary}
          opacity="0.32"
          filter=${`url(#${filterIds.outerGlowId})`}
        ></path>
        <path
          id="cyan-soft-glow"
          d=${borderBox4SoftGlowPath}
          fill=${secondary}
          opacity="0.42"
          filter=${`url(#${filterIds.softGlowId})`}
        ></path>
        <path
          id="cyan-line-core"
          d=${borderBox4LineCorePath}
          fill=${primary}
          opacity="0.76"
          filter=${`url(#${filterIds.lineGlowId})`}
        ></path>
        <path
          id="cyan-hot-highlight"
          d=${borderBox4HotHighlightPath}
          fill=${accent}
          opacity="0.82"
        ></path>
      </g>
    `
  }

  private createFilterIds(suffix: string): BorderBox4FilterIds {
    return {
      outerGlowId: `${this.outerGlowId}-${suffix}`,
      softGlowId: `${this.softGlowId}-${suffix}`,
      lineGlowId: `${this.lineGlowId}-${suffix}`,
      clipId: `dv-border-box-4-clip-${this.instanceId}-${suffix}`,
    }
  }

  private createSliceMetrics(): {
    scale: number
    topHeight: number
    topRightHeight: number
    topDetailWidth: number
    topDetailHeight: number
    topDetailTop: number
    topDetailLeft: number
    bottomHeight: number
    topLeftWidth: number
    topRightWidth: number
    leftSideWidth: number
    leftSideTop: number
    leftSideHeight: number
    rightMiddleTop: number
    rightMiddleWidth: number
    rightMiddleHeight: number
    bottomLeftWidth: number
    bottomDetailWidth: number
    bottomDetailHeight: number
    bottomDetailLeft: number
    bottomRightWidth: number
    topLeadingTop: number
    topLeadingLeft: number
    topLeadingWidth: number
    topLeadingHeight: number
    topTrailingLeft: number
    topTrailingTop: number
    topTrailingWidth: number
    topTrailingHeight: number
    bottomLeadingWidth: number
    bottomTrailingLeft: number
    bottomTrailingWidth: number
    bottomExtensionHeight: number
    leftLowerLeft: number
    leftLowerTop: number
    leftLowerWidth: number
    leftLowerHeight: number
    rightLowerRight: number
    rightLowerTop: number
    rightLowerWidth: number
    rightLowerHeight: number
    rightLineRight: number
    rightLineTop: number
    rightLineWidth: number
    rightLineHeight: number
  } {
    const scale = this.size.width > 0 ? this.size.width / frameViewBox.width : 1
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const topHeight = this.scaleValue(fixedSlices.topLeft.height, scale)
    const topRightHeight = this.scaleValue(fixedSlices.topRight.height, scale)
    const topDetailWidth = this.scaleValue(fixedSlices.topDetail.width, scale)
    const bottomHeight = this.scaleValue(fixedSlices.bottomLeft.height, scale)
    const topLeftWidth = this.scaleValue(fixedSlices.topLeft.width, scale)
    const topRightWidth = this.scaleValue(fixedSlices.topRight.width, scale)
    const leftSourceHeight = this.scaleValue(fixedSlices.leftSide.height, scale)
    const rightMiddleSourceHeight = this.scaleValue(fixedSlices.rightMiddle.height, scale)
    const bottomDetailWidth = this.scaleValue(fixedSlices.bottomDetail.width, scale)
    const bottomLeftWidth = this.scaleValue(fixedSlices.bottomLeft.width, scale)
    const bottomRightWidth = this.scaleValue(fixedSlices.bottomRight.width, scale)
    const topDetailLeft = this.clamp(
      this.sourceX(fixedSlices.topDetail.x, scale),
      topLeftWidth + this.scaleValue(18, scale),
      Math.max(hostWidth - topRightWidth - topDetailWidth - this.scaleValue(18, scale), topLeftWidth),
    )
    const bottomDetailLeft = this.clamp(
      this.sourceX(fixedSlices.bottomDetail.x, scale),
      bottomLeftWidth + this.scaleValue(20, scale),
      Math.max(hostWidth - bottomRightWidth - bottomDetailWidth - this.scaleValue(20, scale), bottomLeftWidth),
    )
    const leftSideTop = this.sourceY(fixedSlices.leftSide.y, scale)
    const bottomTop = Math.max(hostHeight - bottomHeight, 0)
    const topTrailingLeft = topDetailLeft + topDetailWidth
    const bottomTrailingLeft = bottomDetailLeft + bottomDetailWidth
    const rightMiddleTop = this.sourceY(fixedSlices.rightMiddle.y, scale)
    const leftSideHeight = Math.min(leftSourceHeight, Math.max(bottomTop - leftSideTop, 0))
    const rightMiddleHeight = Math.min(rightMiddleSourceHeight, Math.max(bottomTop - rightMiddleTop, 0))
    const leftLowerTop = leftSideTop + leftSideHeight
    const rightLowerTop = rightMiddleTop + rightMiddleHeight
    const topLeadingLeft = this.sourceX(extensionSlices.topLeading.x, scale)
    const rightLineTop = this.sourceY(186, scale)
    const rightLineWidth = this.scaleValue(extensionSlices.rightLine.width, scale)

    return {
      scale,
      topHeight,
      topRightHeight,
      topDetailWidth,
      topDetailHeight: this.scaleValue(fixedSlices.topDetail.height, scale),
      topDetailTop: this.sourceY(fixedSlices.topDetail.y, scale),
      topDetailLeft,
      bottomHeight,
      topLeftWidth,
      topRightWidth,
      leftSideWidth: this.scaleValue(fixedSlices.leftSide.width, scale),
      leftSideTop,
      leftSideHeight,
      rightMiddleTop,
      rightMiddleWidth: this.scaleValue(fixedSlices.rightMiddle.width, scale),
      rightMiddleHeight,
      bottomLeftWidth,
      bottomDetailWidth,
      bottomDetailHeight: this.scaleValue(fixedSlices.bottomDetail.height, scale),
      bottomDetailLeft,
      bottomRightWidth,
      topLeadingTop: this.sourceY(extensionSlices.topLeading.y, scale),
      topLeadingLeft,
      topLeadingWidth: Math.max(topDetailLeft - topLeadingLeft, 0),
      topLeadingHeight: this.scaleValue(extensionSlices.topLeading.height, scale),
      topTrailingLeft,
      topTrailingTop: this.sourceY(extensionSlices.topTrailing.y, scale),
      topTrailingWidth: Math.max(hostWidth - topRightWidth - topTrailingLeft, 0),
      topTrailingHeight: this.scaleValue(extensionSlices.topTrailing.height, scale),
      bottomLeadingWidth: Math.max(bottomDetailLeft - bottomLeftWidth, 0),
      bottomTrailingLeft,
      bottomTrailingWidth: Math.max(hostWidth - bottomRightWidth - bottomTrailingLeft, 0),
      bottomExtensionHeight: this.scaleValue(extensionSlices.bottomLeading.height, scale),
      leftLowerLeft: this.sourceX(extensionSlices.leftLower.x, scale),
      leftLowerTop,
      leftLowerWidth: this.scaleValue(extensionSlices.leftLower.width, scale),
      leftLowerHeight: Math.max(bottomTop - leftLowerTop, 0),
      rightLowerRight: this.sourceRight(extensionSlices.rightLower.x + extensionSlices.rightLower.width, scale),
      rightLowerTop,
      rightLowerWidth: this.scaleValue(extensionSlices.rightLower.width, scale),
      rightLowerHeight: Math.max(bottomTop - rightLowerTop, 0),
      rightLineRight: this.sourceRight(extensionSlices.rightLine.x + extensionSlices.rightLine.width, scale),
      rightLineTop,
      rightLineWidth,
      rightLineHeight: Math.max(bottomTop - rightLineTop, 0),
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
      this.formatPaddingValue(this.clampPadding(top, 4)),
      this.formatPaddingValue(this.clampPadding(right, 4)),
      this.formatPaddingValue(this.clampPadding(bottom, 4)),
      this.formatPaddingValue(this.clampPadding(left, 4)),
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
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#36d9ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#1ecfff',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dv-color-accent',
      host: this,
      fallback: '#c9fbff',
    })

    return [primary, secondary, accent]
  }
}
