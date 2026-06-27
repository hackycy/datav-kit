import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import {
  borderBox5CyanStrokePath,
  borderBox5ElectricBodyPath,
  borderBox5OuterAuraPath,
  borderBox5SoftBlueHaloPath,
  borderBox5WhiteHotCorePath,
} from './vector-paths'

let borderBox5Id = 0

const contentViewBox = {
  x: 112,
  y: 56,
  width: 1448,
  height: 804,
}
const frameBottomY = 850
const frameViewBox = {
  ...contentViewBox,
  height: frameBottomY - contentViewBox.y,
}
const contentRect = {
  x: 174,
  y: 122,
  width: 1330,
  height: 690,
}
const sliceTopHeight = 341
const sliceBottomHeight = 298
const sliceBottomY = frameBottomY - sliceBottomHeight
const sliceSideWidth = 148
const sliceMiddleX = contentViewBox.x + sliceSideWidth
const sliceMiddleY = 397
const sliceMiddleWidth = contentViewBox.width - sliceSideWidth * 2
const sliceMiddleHeight = contentViewBox.height - sliceTopHeight - sliceBottomHeight
const defaultSize = {
  width: 0,
  height: 0,
}

interface BorderBox5FilterIds {
  outerAuraId: string
  softHaloId: string
  bodyGlowId: string
  strokeGlowId: string
}

export class BorderBox5Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #24d9ff);
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .frame--sliced {
      overflow: hidden;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .tile {
      position: absolute;
      display: block;
      overflow: hidden;
    }

    .tile > svg {
      width: auto;
      height: auto;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dv-border-box-5-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }

    .hud-frame {
      opacity: var(--dv-border-box-5-glow-opacity, 1);
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

  private readonly instanceId = ++borderBox5Id
  private readonly outerAuraId = `dv-border-box-5-outer-aura-${this.instanceId}`
  private readonly softHaloId = `dv-border-box-5-soft-halo-${this.instanceId}`
  private readonly bodyGlowId = `dv-border-box-5-body-glow-${this.instanceId}`
  private readonly strokeGlowId = `dv-border-box-5-stroke-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-5' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const sliceMetrics = this.createSliceMetrics()
    const contentPadding = this.createContentPadding()

    return html`
      ${this.renderTiledGraphic(primary, secondary, accent, glowIntensity, sliceMetrics)}
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderTiledGraphic(
    primary: string,
    secondary: string,
    accent: string,
    glowIntensity: number,
    metrics: ReturnType<BorderBox5Element['createSliceMetrics']>,
  ): unknown {
    return html`
      <div part="frame" class="frame frame--sliced">
        ${this.renderTile({
          name: 'top-left',
          style: `left: 0; top: 0; width: ${metrics.side}px; height: ${metrics.top}px`,
          svgWidth: metrics.side,
          svgHeight: metrics.top,
          viewBox: `${contentViewBox.x} ${contentViewBox.y} ${sliceSideWidth} ${sliceTopHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderHorizontalRepeats({
          name: 'top-middle',
          left: metrics.side,
          top: 0,
          availableWidth: metrics.middleWidth,
          tileWidth: metrics.middleTileWidth,
          height: metrics.top,
          viewBox: `${sliceMiddleX} ${contentViewBox.y} ${sliceMiddleWidth} ${sliceTopHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'top-right',
          style: `right: 0; top: 0; width: ${metrics.side}px; height: ${metrics.top}px`,
          svgWidth: metrics.side,
          svgHeight: metrics.top,
          viewBox: `${contentViewBox.x + contentViewBox.width - sliceSideWidth} ${contentViewBox.y} ${sliceSideWidth} ${sliceTopHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderVerticalRepeats({
          name: 'left-middle',
          leftStyle: 'left: 0',
          top: metrics.top,
          availableHeight: metrics.middleHeight,
          width: metrics.side,
          tileHeight: metrics.middleTileHeight,
          viewBox: `${contentViewBox.x} ${sliceMiddleY} ${sliceSideWidth} ${sliceMiddleHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderVerticalRepeats({
          name: 'right-middle',
          leftStyle: 'right: 0',
          top: metrics.top,
          availableHeight: metrics.middleHeight,
          width: metrics.side,
          tileHeight: metrics.middleTileHeight,
          viewBox: `${contentViewBox.x + contentViewBox.width - sliceSideWidth} ${sliceMiddleY} ${sliceSideWidth} ${sliceMiddleHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-left',
          style: `left: 0; bottom: 0; width: ${metrics.side}px; height: ${metrics.bottom}px`,
          svgWidth: metrics.side,
          svgHeight: metrics.bottom,
          viewBox: `${contentViewBox.x} ${sliceBottomY} ${sliceSideWidth} ${sliceBottomHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderHorizontalRepeats({
          name: 'bottom-middle',
          left: metrics.side,
          bottom: 0,
          availableWidth: metrics.middleWidth,
          tileWidth: metrics.middleTileWidth,
          height: metrics.bottom,
          viewBox: `${sliceMiddleX} ${sliceBottomY} ${sliceMiddleWidth} ${sliceBottomHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
        ${this.renderTile({
          name: 'bottom-right',
          style: `right: 0; bottom: 0; width: ${metrics.side}px; height: ${metrics.bottom}px`,
          svgWidth: metrics.side,
          svgHeight: metrics.bottom,
          viewBox: `${contentViewBox.x + contentViewBox.width - sliceSideWidth} ${sliceBottomY} ${sliceSideWidth} ${sliceBottomHeight}`,
          primary,
          secondary,
          accent,
          glowIntensity,
        })}
      </div>
    `
  }

  private renderHorizontalRepeats(options: {
    name: string
    left: number
    top?: number
    bottom?: number
    availableWidth: number
    tileWidth: number
    height: number
    viewBox: string
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
  }): unknown[] {
    return this.createRepeatOffsets(options.availableWidth, options.tileWidth).map((tile, index) => {
      const vertical = options.top === undefined ? `bottom: ${options.bottom ?? 0}px` : `top: ${options.top}px`

      return this.renderTile({
        name: `${options.name}-${index}`,
        style: `left: ${options.left + tile.offset}px; ${vertical}; width: ${tile.length}px; height: ${options.height}px`,
        svgWidth: options.tileWidth,
        svgHeight: options.height,
        viewBox: options.viewBox,
        primary: options.primary,
        secondary: options.secondary,
        accent: options.accent,
        glowIntensity: options.glowIntensity,
      })
    })
  }

  private renderVerticalRepeats(options: {
    name: string
    leftStyle: string
    top: number
    availableHeight: number
    width: number
    tileHeight: number
    viewBox: string
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
  }): unknown[] {
    return this.createRepeatOffsets(options.availableHeight, options.tileHeight).map((tile, index) => {
      return this.renderTile({
        name: `${options.name}-${index}`,
        style: `${options.leftStyle}; top: ${options.top + tile.offset}px; width: ${options.width}px; height: ${tile.length}px`,
        svgWidth: options.width,
        svgHeight: options.tileHeight,
        viewBox: options.viewBox,
        primary: options.primary,
        secondary: options.secondary,
        accent: options.accent,
        glowIntensity: options.glowIntensity,
      })
    })
  }

  private renderTile(options: {
    name: string
    style: string
    svgWidth: number
    svgHeight: number
    viewBox: string
    primary: string
    secondary: string
    accent: string
    glowIntensity: number
  }): unknown {
    const filterIds = this.createFilterIds(options.name)

    return html`
      <div class="tile" style=${options.style}>
        <svg
          part="graphic"
          width=${String(options.svgWidth)}
          height=${String(options.svgHeight)}
          viewBox=${options.viewBox}
          preserveAspectRatio="none"
          aria-hidden="true"
          shape-rendering="geometricPrecision"
        >
          <defs>${this.renderFilterDefs(filterIds, options.glowIntensity)}</defs>
          ${this.renderFrame(options.primary, options.secondary, options.accent, filterIds)}
        </svg>
      </div>
    `
  }

  private renderFilterDefs(filterIds: BorderBox5FilterIds, glowIntensity: number): unknown {
    return svg`
      <filter id=${filterIds.outerAuraId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(7.5 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.softHaloId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(3.8 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.bodyGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(1.4 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>

      <filter id=${filterIds.strokeGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=${String(0.35 * glowIntensity)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderFrame(primary: string, secondary: string, accent: string, filterIds: BorderBox5FilterIds): unknown {
    return svg`
      <g id="hud-frame" class="hud-frame" fill-rule="evenodd" clip-rule="evenodd">
        <path
          id="blue-outer-aura"
          d=${borderBox5OuterAuraPath}
          fill=${secondary}
          opacity="0.16"
          filter=${`url(#${filterIds.outerAuraId})`}
        ></path>
        <path
          id="blue-soft-halo"
          d=${borderBox5SoftBlueHaloPath}
          fill=${secondary}
          opacity="0.2"
          filter=${`url(#${filterIds.softHaloId})`}
        ></path>
        <path
          id="blue-electric-body"
          d=${borderBox5ElectricBodyPath}
          fill=${primary}
          opacity="0.34"
          filter=${`url(#${filterIds.bodyGlowId})`}
        ></path>
        <path
          id="cyan-stroke"
          d=${borderBox5CyanStrokePath}
          fill=${primary}
          opacity="0.7"
          filter=${`url(#${filterIds.strokeGlowId})`}
        ></path>
        <path
          id="white-hot-core"
          d=${borderBox5WhiteHotCorePath}
          fill=${accent}
          opacity="0.92"
        ></path>
      </g>
    `
  }

  private createFilterIds(suffix = ''): BorderBox5FilterIds {
    const name = suffix ? `-${suffix}` : ''

    return {
      outerAuraId: `${this.outerAuraId}${name}`,
      softHaloId: `${this.softHaloId}${name}`,
      bodyGlowId: `${this.bodyGlowId}${name}`,
      strokeGlowId: `${this.strokeGlowId}${name}`,
    }
  }

  private createSliceMetrics(): {
    top: number
    bottom: number
    side: number
    middleWidth: number
    middleHeight: number
    middleTileWidth: number
    middleTileHeight: number
  } {
    const scale = this.size.width > 0 ? this.size.width / contentViewBox.width : 1
    const side = sliceSideWidth * scale
    const top = sliceTopHeight * scale
    const bottom = sliceBottomHeight * scale

    return {
      top: Number(top.toFixed(2)),
      bottom: Number(bottom.toFixed(2)),
      side: Number(side.toFixed(2)),
      middleWidth: Number(Math.max(this.size.width - side * 2, 0).toFixed(2)),
      middleHeight: Number(Math.max(this.size.height - top - bottom, 0).toFixed(2)),
      middleTileWidth: Number((sliceMiddleWidth * scale).toFixed(2)),
      middleTileHeight: Number((sliceMiddleHeight * scale).toFixed(2)),
    }
  }

  private createRepeatOffsets(available: number, tileLength: number): Array<{ offset: number, length: number }> {
    if (available <= 0 || tileLength <= 0)
      return []

    const tiles: Array<{ offset: number, length: number }> = []
    let offset = 0

    while (offset < available) {
      const length = Math.min(tileLength, available - offset)
      tiles.push({
        offset: Number(offset.toFixed(2)),
        length: Number(length.toFixed(2)),
      })
      offset += tileLength
    }

    return tiles
  }

  private createContentPadding(): string {
    const hostWidth = Math.max(this.size.width, 0)
    const hostHeight = Math.max(this.size.height, 0)
    const scaleX = hostWidth > 0 ? hostWidth / frameViewBox.width : 1
    const scaleY = hostHeight > 0 ? hostHeight / frameViewBox.height : 1
    const viewBoxRight = frameViewBox.x + frameViewBox.width
    const contentRight = contentRect.x + contentRect.width
    const contentBottom = contentRect.y + contentRect.height
    const top = (contentRect.y - frameViewBox.y) * scaleY
    const right = (viewBoxRight - contentRight) * scaleX
    const bottom = (frameBottomY - contentBottom) * scaleY
    const left = (contentRect.x - frameViewBox.x) * scaleX

    return [
      this.formatPaddingValue(Math.max(top, 32)),
      this.formatPaddingValue(Math.max(right, 22)),
      this.formatPaddingValue(Math.max(bottom, 16)),
      this.formatPaddingValue(Math.max(left, 22)),
    ].join(' ')
  }

  private formatPaddingValue(value: number): string {
    return `${Number(value.toFixed(2))}px`
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#24d9ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#008cff',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dv-color-accent',
      host: this,
      fallback: '#bffcff',
    })

    return [primary, secondary, accent]
  }
}
