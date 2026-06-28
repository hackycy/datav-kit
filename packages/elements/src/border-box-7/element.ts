import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface BorderBox7Size {
  width: number
  height: number
}

const defaultSize: BorderBox7Size = {
  width: 0,
  height: 0,
}
const cornerSize = 150
const chamferSize = 4

export class BorderBox7Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      border-radius: var(--dv-border-box-7-radius, 6px);
      color: var(--dv-color-primary, #235fa7);
      overflow: hidden;
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
      box-shadow: var(--dv-border-box-7-box-shadow);
    }

    svg {
      display: block;
      overflow: visible;
    }

    .panel {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .corner {
      position: absolute;
      width: ${cornerSize}px;
      height: ${cornerSize}px;
    }

    .corner--left-top {
      left: 0;
      top: 0;
    }

    .corner--right-top {
      right: 0;
      top: 0;
      transform: rotateY(180deg);
    }

    .corner--left-bottom {
      left: 0;
      bottom: 0;
      transform: rotateX(180deg);
    }

    .corner--right-bottom {
      right: 0;
      bottom: 0;
      transform: rotateX(180deg) rotateY(180deg);
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dv-border-box-7-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'background-color' })
  backgroundColor = ''

  @property()
  colors = ''

  @state()
  private size = defaultSize

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-7' })
  }

  override render(): unknown {
    const [primary, secondary, background] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const contentPadding = this.createContentPadding(width, height)

    return html`
      <div
        part="frame"
        class="frame"
        style=${`--dv-border-box-7-box-shadow: inset 0 0 25px 3px ${primary}`}
      >
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} aria-hidden="true">
          <polygon fill=${background} points=${this.createPanelPoints(width, height)}></polygon>
        </svg>
        ${this.renderCorner('left-top', secondary)}
        ${this.renderCorner('right-top', secondary)}
        ${this.renderCorner('left-bottom', secondary)}
        ${this.renderCorner('right-bottom', secondary)}
      </div>
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderCorner(position: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom', secondary: string): unknown {
    return svg`
      <svg
        part="graphic"
        class=${`corner corner--${position}`}
        width=${String(cornerSize)}
        height=${String(cornerSize)}
        viewBox="0 0 150 150"
        aria-hidden="true"
      >
        <polygon
          fill=${secondary}
          points="40,0 5,0 0,5 0,16 3,19 3,7 7,3 35,3"
        ></polygon>
      </svg>
    `
  }

  private createPanelPoints(width: number, height: number): string {
    const inset = Math.min(chamferSize, width / 2, height / 2)

    return [
      `${inset},0`,
      `${width - inset},0`,
      `${width},${inset}`,
      `${width},${height - inset}`,
      `${width - inset},${height}`,
      `${inset},${height}`,
      `0,${height - inset}`,
      `0,${inset}`,
    ].join(' ')
  }

  private createContentPadding(width: number, height: number): string {
    const block = clamp(height * (8 / cornerSize), 6, 14)
    const inline = clamp(width * (6 / cornerSize), 6, 14)

    return [
      formatPaddingValue(block),
      formatPaddingValue(inline),
      formatPaddingValue(block),
      formatPaddingValue(inline),
    ].join(' ')
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#235fa7',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#4fd2dd',
    })
    const background = resolveThemeValue({
      explicit: this.backgroundColor,
      cssVariable: '--dv-border-box-7-background',
      host: this,
      fallback: 'transparent',
    })

    return [primary, secondary, background]
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function formatPaddingValue(value: number): string {
  return `${Number(value.toFixed(2))}px`
}
