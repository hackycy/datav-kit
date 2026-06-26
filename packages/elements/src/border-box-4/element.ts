import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'
import {
  borderBox4HotHighlightPath,
  borderBox4LineCorePath,
  borderBox4OuterGlowPath,
  borderBox4SoftGlowPath,
} from './vector-paths'

let borderBox4Id = 0

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
  x: 112,
  y: 134,
  width: 1448,
  height: 672,
}
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
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #36d9ff);
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
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: this.size.width,
      hostHeight: this.size.height,
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
            <filter id=${this.outerGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation=${String(4.2 * glowIntensity)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            <filter id=${this.softGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation=${String(2.1 * glowIntensity)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>

            <filter id=${this.lineGlowId} x="-8%" y="-12%" width="116%" height="124%" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation=${String(0.85 * glowIntensity)} result="blur"></feGaussianBlur>
              <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
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
      <g id="hud-frame" class="hud-frame" fill-rule="evenodd" clip-rule="evenodd">
        <path
          id="cyan-outer-glow"
          d=${borderBox4OuterGlowPath}
          fill=${secondary}
          opacity="0.32"
          filter=${`url(#${this.outerGlowId})`}
        ></path>
        <path
          id="cyan-soft-glow"
          d=${borderBox4SoftGlowPath}
          fill=${secondary}
          opacity="0.42"
          filter=${`url(#${this.softGlowId})`}
        ></path>
        <path
          id="cyan-line-core"
          d=${borderBox4LineCorePath}
          fill=${primary}
          opacity="0.76"
          filter=${`url(#${this.lineGlowId})`}
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
